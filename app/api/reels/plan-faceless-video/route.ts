import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { generateStructuredSceneBlueprint } from '@/services/ai/aiScenePlanner';
import { planFacelessGraphics } from '@/services/ai/facelessGraphicPlanner';
import { generateSFXEvents } from '@/services/ai/sfxEngine';
import {
  validateAndAlignTranscript,
  splitLongSegmentsByWordTimestamps,
  type TranscriptSegment,
} from '@/services/ai/transcriptAlignment';
import { searchS3AssetCatalog } from '@/services/ai/assetCatalogMatcher';
import { auditAndSelfHealVideoBlueprint, assertPreRenderQualityGate } from '@/services/ai/preRenderQualityAudit';
import { planUserUploadedAssetsForFacelessScenes } from '@/services/ai/smartMediaMatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FACELESS_LONG_DURATION_SECONDS = 300; // 300 seconds (5 minutes maximum strictly for 16:9 Faceless Video)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      topicTitle = '',
      durationSeconds: inputDuration,
      language = 'en',
      existingTranscript = '',
      existingSegments = null,
      backgroundTheme = 'studio-white',
      fontFamily = '',
      accentFont = 'Caveat',
      creatorStyle = '',
      headingFont = '',
      subheadingFont = '',
      bodyFont = '',
      brandNamesHint = '',
    } = body;

    // 16:9 Faceless Video pipeline is strictly 16:9 (9:16 Faceless Shorts uses its own separate pipeline)
    const targetAspectRatio = '16:9' as const;
    const targetVideoType = 'facelessVideo' as const;
    const maxDurationLimit = MAX_FACELESS_LONG_DURATION_SECONDS;

    let audioUrl = String(body.audioUrl || '').trim();
    const mediaKey = String(body.mediaKey || '').trim();

    // Auto-resolve mediaKey into signed S3 read URL if needed
    if (!audioUrl && mediaKey) {
      try {
        audioUrl = await createReadUrl(mediaKey);
      } catch (err) {
        console.warn('[PLAN_FACELESS] Could not generate read URL for mediaKey:', mediaKey, err);
      }
    } else if (audioUrl && !audioUrl.startsWith('http://') && !audioUrl.startsWith('https://') && !audioUrl.startsWith('data:')) {
      try {
        audioUrl = await createReadUrl(audioUrl);
      } catch (err) {
        console.warn('[PLAN_FACELESS] Could not resolve audioUrl key:', audioUrl, err);
      }
    }

    let transcript = String(existingTranscript || '').trim();
    let segments: TranscriptSegment[] = Array.isArray(existingSegments) ? existingSegments : [];
    let words: Array<{ word: string; start: number; end: number }> = [];
    let durationSeconds = Number(inputDuration) || 0;
    let warnings: string[] = [];

    // 1. Transcribe voiceover if transcript not supplied
    if (!transcript && audioUrl) {
      let transcriptionResult;
      try {
        transcriptionResult = await transcribeMediaUrlWithGroq({
          mediaUrl: audioUrl,
          fileName: 'faceless-voiceover.mp3',
          language,
          maxSeconds: maxDurationLimit,
          prompt: brandNamesHint,
        });
      } catch (groqErr) {
        console.warn('[PLAN_FACELESS] Groq Whisper failed, trying Gemini fallback:', groqErr);
        try {
          transcriptionResult = await transcribeMediaWithGeminiFallback({
            mediaUrl: audioUrl,
            fileName: 'faceless-voiceover.mp3',
            maxSeconds: maxDurationLimit,
          });
        } catch (geminiErr) {
          console.error('[PLAN_FACELESS] Both Groq (Key 1 & Key 2) and Gemini transcription failed:', geminiErr);
          return NextResponse.json(
            {
              ok: false,
              code: 'TRANSCRIPTION_FAILED',
              retryable: true,
              error: 'TRANSCRIPTION_FAILED: Could not transcribe audio across Groq & Gemini. Please click Retry — no credits were used.',
            },
            { status: 503 }
          );
        }
      }

      if (!transcriptionResult || !transcriptionResult.transcript?.trim()) {
        return NextResponse.json(
          {
            ok: false,
            code: 'TRANSCRIPTION_FAILED',
            retryable: true,
            error: 'TRANSCRIPTION_FAILED: No speech detected in audio file. Please click Retry or upload a clear narration recording.',
          },
          { status: 422 }
        );
      }

      transcript = transcriptionResult.transcript;
      durationSeconds = Math.min(
        maxDurationLimit,
        Number(transcriptionResult.durationSeconds) || Number(inputDuration) || 60
      );

      // Map segments
      if (Array.isArray(transcriptionResult.segments) && transcriptionResult.segments.length > 0) {
        segments = transcriptionResult.segments.map((seg: any) => ({
          text: String(seg.text || '').trim(),
          start: Number(seg.start || 0),
          end: Number(seg.end || 0),
        })).filter((s) => s.text && s.end > s.start);
      }

      // Map words
      if (Array.isArray(transcriptionResult.words) && transcriptionResult.words.length > 0) {
        words = transcriptionResult.words.map((w: any) => ({
          word: String(w.word || '').trim(),
          start: Number(w.start || 0),
          end: Number(w.end || 0),
        })).filter((w) => w.word);
      }
    }

    if (!transcript) {
      return NextResponse.json(
        { ok: false, error: 'Audio recording or transcript is required to plan scenes.' },
        { status: 400 }
      );
    }

    if (durationSeconds <= 0) {
      durationSeconds = Math.min(maxDurationLimit, segments.length > 0 ? segments[segments.length - 1].end : 60);
    }

    // 2. Split overly long Whisper segments using word timestamps, then validate & align
    if (words.length > 0 && segments.length > 0) {
      segments = splitLongSegmentsByWordTimestamps(segments, words, 8.5);
    }
    const validation = validateAndAlignTranscript(segments, transcript, durationSeconds);
    if (!validation.isValid && segments.length === 0) {
      // Create fallback segment
      segments = [{ text: transcript, start: 0, end: durationSeconds }];
    } else if (validation.repairedSegments.length > 0) {
      segments = validation.repairedSegments;
    }
    warnings = [...warnings, ...validation.warnings];

    // 3. Generate Structured Scene-by-Scene JSON Blueprint
    const videoTitle = String(topicTitle || '').trim() || 'Faceless Video';
    const transcriptChunks = segments.map((s) => ({
      text: s.text,
      start: s.start,
      end: s.end,
      words: words && words.length > 0
        ? words.filter((w) => w.start >= s.start - 0.08 && w.end <= s.end + 0.08)
        : undefined,
    }));

    const resolvedPrimaryFont = String(fontFamily || headingFont || bodyFont || subheadingFont || 'Montserrat').trim();
    const resolvedAccentFont = String(accentFont || 'Caveat').trim();
    let blueprint;
    try {
      blueprint = await generateStructuredSceneBlueprint(transcriptChunks, {
        title: videoTitle,
        fontFamily: resolvedPrimaryFont,
        headingFont: resolvedPrimaryFont,
        bodyFont: resolvedPrimaryFont,
        accentFont: resolvedAccentFont,
        creatorStyle: String(creatorStyle || '').trim() || undefined,
        backgroundTheme,
        aspectRatio: targetAspectRatio,
        videoType: targetVideoType,
      });
    } catch (planErr: any) {
      console.error('[PLAN_FACELESS] All AI scene planning providers failed:', planErr);
      return NextResponse.json(
        {
          ok: false,
          retryable: true,
          error:
            planErr?.message ||
            'AI planning failed across all providers. Please click Retry — no credits were consumed.',
        },
        { status: 503 }
      );
    }

    // Derive scene-by-scene graphics from the approved narration
    let sceneBlueprint = planFacelessGraphics(blueprint.scenes);

    // 3b. Analyze & semantically place user-uploaded assets (if provided)
    const uploadedImageUrls = Array.isArray(body.uploadedImageUrls)
      ? body.uploadedImageUrls.map((u: unknown) => String(u || '').trim()).filter(Boolean)
      : [];
    const requestedAssetMode = String(body.assetMode || 'mix').trim().toLowerCase();

    let analyzedUploadedAssets: any[] = [];
    const userBrollUrls: Record<number, string> = {};
    if (uploadedImageUrls.length > 0 && requestedAssetMode !== 'library') {
      const userAssetPlan = await planUserUploadedAssetsForFacelessScenes(sceneBlueprint, uploadedImageUrls, {
        assetMode: requestedAssetMode,
      });
      sceneBlueprint = userAssetPlan.scenes;
      Object.assign(userBrollUrls, userAssetPlan.brollUrls);
      analyzedUploadedAssets = userAssetPlan.analyzedAssets;
    }

    // Build brollUrls map (prioritizing AI-matched user assets, then assigned S3 assets)
    const brollUrls: Record<number, string> = { ...userBrollUrls };
    sceneBlueprint.forEach((sc: any) => {
      if (sc.assetUrl && !brollUrls[sc.sceneNumber]) {
        brollUrls[sc.sceneNumber] = sc.assetUrl;
      }
    });

    // Curate available S3 assets pool for frontend asset selection
    const availableAssetsPool = searchS3AssetCatalog(transcript, {
      maxResults: 48,
    });

    // 4. Sound Effects (SFX)
    const sfxEvents = generateSFXEvents(sceneBlueprint, 30, durationSeconds);
    const stickerEvents: any[] = []; // Faceless videos do NOT use 3D cartoon avatar presenters

    // 5. Pre-Render Quality Assurance & Autonomous Self-Healing Ecosystem
    const {
      healedScenes,
      healedBrollUrls,
      healedSfxEvents,
      auditReport,
    } = auditAndSelfHealVideoBlueprint({
      scenes: sceneBlueprint,
      durationSeconds,
      backgroundTheme,
      aspectRatio: targetAspectRatio,
      videoType: targetVideoType,
      brollUrls,
      sfxEvents,
      availableAssetsPool,
    });

    const qualityGate = assertPreRenderQualityGate({
      healedScenes,
      healedBrollUrls,
      durationSeconds,
      fps: 30,
    });
    if (!qualityGate.passed) {
      console.error('[PLAN_FACELESS] Quality gate failed:', qualityGate.violations);
      return NextResponse.json(
        {
          ok: false,
          code: 'QUALITY_GATE_FAILED',
          retryable: true,
          violations: qualityGate.violations,
          error: 'Scene quality check failed. Please click Retry — no credits were used.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ok: true,
      transcript,
      segments,
      words,
      durationSeconds,
      sceneBlueprint: healedScenes,
      brollUrls: healedBrollUrls,
      uploadedAssets: analyzedUploadedAssets,
      availableAssetsPool,
      sfxEvents: healedSfxEvents,
      stickerEvents,
      auditReport,
      warnings,
      videoTitle,
      aspectRatio: targetAspectRatio,
      videoType: targetVideoType,
    });
  } catch (error: any) {
    console.error('[PLAN_FACELESS_API_ERROR]', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to generate Faceless Video plan.' },
      { status: 500 }
    );
  }
}
