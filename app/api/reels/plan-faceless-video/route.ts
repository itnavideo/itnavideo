import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { generateStructuredSceneBlueprint, generateFacelessStickerEvents } from '@/services/ai/aiScenePlanner';
import { planFacelessGraphics } from '@/services/ai/facelessGraphicPlanner';
import { generateSFXEvents } from '@/services/ai/sfxEngine';
import { validateAndAlignTranscript, type TranscriptSegment } from '@/services/ai/transcriptAlignment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FACELESS_DURATION_SECONDS = 300; // 300 seconds (5 minutes maximum strictly per user standard)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      topicTitle = '',
      durationSeconds: inputDuration,
      language = 'en',
      existingTranscript = '',
      existingSegments = null,
      backgroundTheme = 'midnight-mesh',
      brandNamesHint = '',
    } = body;

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
          maxSeconds: MAX_FACELESS_DURATION_SECONDS,
          prompt: brandNamesHint,
        });
      } catch (groqErr) {
        console.warn('[PLAN_FACELESS] Groq Whisper failed, trying Gemini fallback:', groqErr);
        try {
          transcriptionResult = await transcribeMediaWithGeminiFallback({
            mediaUrl: audioUrl,
            fileName: 'faceless-voiceover.mp3',
            maxSeconds: MAX_FACELESS_DURATION_SECONDS,
          });
        } catch (geminiErr) {
          console.error('[PLAN_FACELESS] Both Groq and Gemini transcription failed:', geminiErr);
          return NextResponse.json(
            { ok: false, error: 'Could not transcribe speech. Please ensure your audio contains clear spoken voice.' },
            { status: 422 }
          );
        }
      }

      if (!transcriptionResult || !transcriptionResult.transcript?.trim()) {
        return NextResponse.json(
          { ok: false, error: 'No speech detected in audio file. Please upload a clear narration recording.' },
          { status: 422 }
        );
      }

      transcript = transcriptionResult.transcript;
      durationSeconds = Math.min(
        MAX_FACELESS_DURATION_SECONDS,
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
      durationSeconds = Math.min(MAX_FACELESS_DURATION_SECONDS, segments.length > 0 ? segments[segments.length - 1].end : 60);
    }

    // 2. Validate transcript & timestamps
    const validation = validateAndAlignTranscript(segments, transcript, durationSeconds);
    if (!validation.isValid && segments.length === 0) {
      // Create fallback segment
      segments = [{ text: transcript, start: 0, end: durationSeconds }];
    } else if (validation.repairedSegments.length > 0) {
      segments = validation.repairedSegments;
    }
    warnings = [...warnings, ...validation.warnings];

    // 3. Generate Structured Scene Blueprint
    const videoTitle = String(topicTitle || '').trim() || 'Faceless Video';
    const transcriptChunks = segments.map((s) => ({
      text: s.text,
      start: s.start,
      end: s.end,
      words: words && words.length > 0
        ? words.filter((w) => w.start >= s.start - 0.08 && w.end <= s.end + 0.08)
        : undefined,
    }));

    const blueprint = await generateStructuredSceneBlueprint(transcriptChunks, {
      title: videoTitle,
      headingFont: 'Montserrat',
      bodyFont: 'Plus Jakarta Sans',
      backgroundTheme,
    });

    // Image visuals are paused; derive every scene graphic from the approved narration.
    const sceneBlueprint = planFacelessGraphics(blueprint.scenes).map((scene) => ({
      ...scene,
      visualAssetRequirement: "",
      brollSearchQuery: "",
    }));

    // 5. Sound Effects (SFX) & High-Impact 3D Sticker Events
    const sfxEvents = generateSFXEvents(sceneBlueprint, 30, durationSeconds);
    const stickerEvents: any[] = []; // Faceless videos do NOT use 3D cartoon avatar presenters

    return NextResponse.json({
      ok: true,
      transcript,
      segments,
      words: words,
      durationSeconds,
      sceneBlueprint,
      brollUrls: {},
      uploadedAssets: [],
      sfxEvents,
      stickerEvents,
      warnings,
      videoTitle,
      aspectRatio: '16:9',
    });
  } catch (error: any) {
    console.error('[PLAN_FACELESS_API_ERROR]', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to generate Faceless Video plan.' },
      { status: 500 }
    );
  }
}
