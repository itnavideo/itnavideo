import {NextResponse} from 'next/server';
import * as fs from 'node:fs';
import path from 'node:path';
import {renderMediaOnLambda, type AwsRegion} from '@remotion/lambda/client';
import {createReadUrl, TEMP_MEDIA_RENDER_PREFIX, uploadTemporaryMediaObject} from '@/lib/aws/mediaStorage';
import {resolveYoutubeAudio} from '@/lib/media/youtubeResolver';
import {transcribeMediaUrlWithGroq} from '@/services/ai/groqTranscription';
import {transcribeMediaWithGeminiFallback} from '@/services/ai/geminiTranscription';
import {createReelPlan, VIDEO_TYPE_REGISTRY, validateAndRepairReelPlan, type ReelTemplateName, type ReelTranscriptSegment, type ReelWord} from '@/services/ai/reelPlanner';
import {readUnifiedAssets} from '@/services/ai/assetPicker';
import {hasHindiUrduScript, hasRomanHinglish} from '@/services/ai/hinglishTranscript';
import {checkRateLimit, getClientIp} from '@/services/rateLimit/inMemoryRateLimiter';
import {getRenderAccessForUser, reserveRenderUsageFromServer} from '@/services/billing/renderAccess';
import {calculateRenderCreditUnits, formatCreditUnits, LONG_FORM_CAPTION_MAX_SECONDS} from '@/lib/billing/creditPricing';
import {createPlanningMediaClip} from '@/services/media/mediaClipper';
import {buildEnergyTimeline, findBeatPeaks} from '@/lib/audio/energyTimeline';
import {createPremiumSoundCues, createPremiumStyleLock} from '@/services/ai/premiumStylePlanner';
import {planCompareStickers} from '@/services/ai/compareStickerPlanner';
import {planScenes} from '@/services/ai/sceneDirector';
import {matchAssetsToScenes, loadAssetLibrary} from '@/services/ai/assetMatcher';
import {enhanceScenePlanWithIntelligence} from '@/services/ai/visualIntelligence';
import {runTypographyPipeline} from '@/services/ai/typographyPipeline';
import {makeDirectorDecision, buildVisualContinuity, checkConstraints, type VisualContinuity, type DirectorDecision} from '@/services/ai/directorBrain';
import {getOptimalFramesPerLambda} from '@/lib/media/optimizeUpload';
import {detectScenes} from '@/services/ai/sceneDetector';
import {planWhiteboardVideo} from '@/services/ai/whiteboardPlanner';
import {planTypographyVideo} from '@/services/ai/typographyPlanner';
import {selectBestClips} from '@/services/ai/clipSelector';
import {planLongVideoProBlueprint} from '@/services/ai/longVideoProPlanner';
import {resolveBlueprintAssets} from '@/services/ai/assetResolver';
import {toAbsoluteS3AssetUrl, ITNAVIDEO_STOCK_ASSETS} from '@/constants/itnavideoStockAssets';
import {cleanFaceCamSilenceAndFillers} from '@/services/ai/faceCamSilenceCleaner';
import {extractFaceKeyframes} from '@/services/vision/faceTracker';
import {generateStructuredSceneBlueprint} from '@/services/ai/aiScenePlanner';
import {planBrollForScenes} from '@/services/ai/brollMatcher';
import {planImagesFromLibraryForScenes} from '@/services/ai/aiImageLibraryMatcher';
import {planSemanticImageToVideoTimeline, planVisualIntelligenceTimeline} from '@/services/ai/visualPlanner';
import {SUBTITLE_PRESETS} from '@/remotion/types/subtitles';

function getFontForLanguage(lang?: string): string {
  if (!lang) return 'Plus Jakarta Sans, sans-serif';
  const clean = lang.toLowerCase();
  if (clean === 'hindi' || clean === 'marathi') return 'Noto Sans Devanagari, sans-serif';
  if (clean === 'arabic' || clean === 'urdu') return 'Noto Naskh Arabic, sans-serif';
  if (clean === 'japanese') return 'Noto Sans JP, sans-serif';
  if (clean === 'korean') return 'Noto Sans KR, sans-serif';
  return 'Plus Jakarta Sans, sans-serif';
}
import {generateSFXEvents} from '@/services/ai/sfxEngine';
import {detectChaptersFromTranscript} from '@/services/ai/chapterDetector';
import {smartMatchUploadedImagesToScenes} from '@/services/ai/smartMediaMatcher';
import {analyzeMultipleImages, analyzeBatchImagesInSingleCall, generateDeterministicAnalysis, matchScriptToAnalyzedImages, isGenericFilename, type AnalyzedImage} from '@/services/ai/imageUnderstanding';
import {searchPexelsFallbackImages} from '@/services/ai/pexelsImages';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LambdaRenderRequest = Parameters<typeof renderMediaOnLambda>[0];
type ReelMode =
  | 'compare' | 'autoCaption' | 'longVideoPromo' | 'whiteboardVideo' | 'typographyVideo' | 'longVideoClips' | 'facelessVideo' | 'aiVideoGenerator' | 'longVideoPro' | 'imageToVideoAi' | 'youtubeSubtitleGenerator' | 'bookSummary';

const MODE_TO_TEMPLATE: Partial<Record<ReelMode, ReelTemplateName>> = {
  compare: 'comparisonImages',
  autoCaption: 'AUTO_CAPTION_GENERATOR',
  youtubeSubtitleGenerator: 'YOUTUBE_SUBTITLE_GENERATOR',
  longVideoPromo: 'LONG_VIDEO_PROMO',
  whiteboardVideo: 'WHITEBOARD_VIDEO',
  typographyVideo: 'TYPOGRAPHY_VIDEO',
  longVideoClips: 'LONG_VIDEO_CLIPS',
  longVideoPro: 'FACELESS_VIDEO',
  facelessVideo: 'FACELESS_VIDEO',
  aiVideoGenerator: 'FACELESS_VIDEO',
  imageToVideoAi: 'IMAGE_TO_VIDEO_AI',
  bookSummary: 'BOOK_SUMMARY',
};

// All 9:16 short video types render up to 90 seconds.
// Long Faceless Video supports up to 20 minutes (1200 seconds) audio.
// Image to Video AI & Book Summary support up to 12 minutes (720 seconds) audio.
const MAX_RENDER_WINDOW_SECONDS = 90;
const MAX_AUTO_CAPTION_SECONDS = 20 * 60; // 1200 seconds (up to 20 minutes)
const MAX_YOUTUBE_SUBTITLE_SECONDS = 15 * 60; // 900 seconds (up to 15 minutes)
const MAX_IMAGE_TO_VIDEO_SECONDS = 12 * 60; // 720 seconds (12 minutes)
const MAX_FACELESS_VIDEO_SECONDS = 12 * 60; // 720 seconds (12 minutes)
const MAX_BOOK_SUMMARY_SECONDS = 12 * 60; // 720 seconds (12 minutes)

function getMaxRenderWindowSecondsForTemplate(templateName?: ReelTemplateName | null): number {
  if (templateName === 'AUTO_CAPTION_GENERATOR') {
    return MAX_AUTO_CAPTION_SECONDS;
  }
  if (templateName === 'YOUTUBE_SUBTITLE_GENERATOR') {
    return MAX_YOUTUBE_SUBTITLE_SECONDS;
  }
  if (templateName === 'IMAGE_TO_VIDEO_AI') {
    return MAX_IMAGE_TO_VIDEO_SECONDS;
  }
  if (templateName === 'BOOK_SUMMARY') {
    return MAX_BOOK_SUMMARY_SECONDS;
  }
  if (
    templateName === 'FACELESS_VIDEO' ||
    templateName === 'AI_VIDEO_GENERATOR' ||
    (templateName as string) === 'LONG_VIDEO_PRO' ||
    (templateName as string) === 'FACELESS_LONG_VIDEO'
  ) {
    return MAX_FACELESS_VIDEO_SECONDS;
  }
  return MAX_RENDER_WINDOW_SECONDS;
}

// Curated whiteboard boards the dashboard can choose from. Unknown values fall back safely.
// Compare Explainer visual options — validated against fixed allow-lists.
const COMPARE_THEMES = new Set(['light', 'dark', 'bold']);
const COMPARE_TONES = new Set(['versus', 'goodBad']);
const COMPARE_WINNERS = new Set(['left', 'right', 'none']);
function resolveCompareTheme(value: string): string {
  const v = String(value || '').trim();
  return COMPARE_THEMES.has(v) ? v : 'light';
}
function resolveCompareTone(value: string): string {
  const v = String(value || '').trim();
  return COMPARE_TONES.has(v) ? v : 'versus';
}
function resolveCompareWinner(value: string): string {
  const v = String(value || '').trim();
  return COMPARE_WINNERS.has(v) ? v : 'none';
}

const WHITEBOARD_BOARDS = new Set(['corporate-luxury', 'classroom', 'dark-modern', 'coworking']);
function resolveWhiteboardBoard(value: string): string {
  const normalized = String(value || '').trim().toLowerCase();
  return WHITEBOARD_BOARDS.has(normalized) ? normalized : 'corporate-luxury';
}

function matchWordAnchorsToWhisper(
  anchors: Array<{ url: string; targetPhrase: string }>,
  words: Array<{ word: string; start: number; end: number }>,
  totalDuration: number
): Array<{
  id: string;
  startSeconds: number;
  endSeconds: number;
  imageUrl?: string;
  text?: string;
  title?: string;
  sceneType: 'image' | 'typography';
  typographyPrimary?: string;
  typographySecondary?: string;
  typographyAccent?: string;
}> {
  const normalize = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  const normalizedWhisperWords = words
    .map((w, idx) => ({
      word: normalize(w.word),
      start: Number(w.start),
      end: Number(w.end),
      origIndex: idx,
    }))
    .filter((w) => w.word.length > 0);

  const validAnchors = anchors.filter(
    (a) => a.url && a.targetPhrase && a.targetPhrase.trim().length > 0
  );

  // ── SEQUENTIAL MODE: no phrases provided — distribute images evenly across duration ──
  if (validAnchors.length === 0) {
    const allImageUrls = anchors.map((a) => a.url).filter(Boolean);
    if (allImageUrls.length === 0 || normalizedWhisperWords.length === 0) return [];

    const segDuration = totalDuration / allImageUrls.length;
    return allImageUrls.map((url, idx) => ({
      id: `seq-image-${idx + 1}`,
      startSeconds: idx * segDuration,
      endSeconds: (idx + 1) * segDuration,
      imageUrl: url,
      sceneType: 'image' as const,
      text: '',
      title: `Scene ${idx + 1}`,
    }));
  }

  const assignedSegments: Array<{
    url: string;
    phrase: string;
    start: number;
    end: number;
  }> = [];

  let lastMatchedWordIndex = 0;

  for (const anchor of validAnchors) {
    const phraseTokens = normalize(anchor.targetPhrase).split(/\s+/).filter(Boolean);
    if (phraseTokens.length === 0) continue;

    let matchedStart = -1;
    let matchedEnd = -1;

    for (let i = lastMatchedWordIndex; i <= normalizedWhisperWords.length - phraseTokens.length; i++) {
      let matchCount = 0;
      for (let j = 0; j < phraseTokens.length; j++) {
        if (normalizedWhisperWords[i + j].word === phraseTokens[j]) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount === phraseTokens.length) {
        matchedStart = normalizedWhisperWords[i].start;
        matchedEnd = normalizedWhisperWords[i + phraseTokens.length - 1].end;
        lastMatchedWordIndex = i + phraseTokens.length;
        break;
      }
    }

    if (matchedStart === -1) {
      const firstToken = phraseTokens[0];
      const foundIdx = normalizedWhisperWords.findIndex(
        (w, idx) => idx >= lastMatchedWordIndex && w.word.includes(firstToken)
      );
      if (foundIdx !== -1) {
        const endIdx = Math.min(
          normalizedWhisperWords.length - 1,
          foundIdx + phraseTokens.length - 1
        );
        matchedStart = normalizedWhisperWords[foundIdx].start;
        matchedEnd = normalizedWhisperWords[endIdx].end;
        lastMatchedWordIndex = endIdx + 1;
      }
    }

    if (matchedStart !== -1 && matchedEnd > matchedStart) {
      assignedSegments.push({
        url: anchor.url,
        phrase: anchor.targetPhrase,
        start: matchedStart,
        end: matchedEnd,
      });
    }
  }

  if (assignedSegments.length === 0) {
    return [];
  }

  assignedSegments.sort((a, b) => a.start - b.start);

  // Collect images that were NOT used in anchor matches — use them to fill gaps
  const usedUrls = new Set(assignedSegments.map((s) => s.url));
  const unusedImages = anchors
    .map((a) => a.url)
    .filter((url) => url && !usedUrls.has(url));
  let unusedImageIdx = 0;

  const resultScenes: Array<any> = [];
  let currentCursor = 0;

  assignedSegments.forEach((seg, idx) => {
    if (seg.start - currentCursor >= 0.5) {
      // Prefer filling gap with an unused uploaded image rather than a typography card
      const gapImage = unusedImages[unusedImageIdx];
      if (gapImage) {
        unusedImageIdx++;
        resultScenes.push({
          id: `gap-image-${resultScenes.length + 1}`,
          startSeconds: currentCursor,
          endSeconds: seg.start,
          imageUrl: gapImage,
          sceneType: 'image' as const,
          text: '',
          title: `Scene ${resultScenes.length + 1}`,
        });
      } else {
        resultScenes.push({
          id: `gap-typography-${resultScenes.length + 1}`,
          startSeconds: currentCursor,
          endSeconds: seg.start,
          imageUrl: '',
          sceneType: 'typography' as const,
          typographyPrimary: 'KEY INSIGHT',
          typographyAccent: 'HIGHLIGHT',
          typographySecondary: 'Core Narration Beat',
          title: 'Impact Typography Gap',
        });
      }
    }

    resultScenes.push({
      id: `anchor-image-${idx + 1}`,
      startSeconds: seg.start,
      endSeconds: seg.end,
      imageUrl: seg.url,
      sceneType: 'image' as const,
      text: seg.phrase,
      title: seg.phrase.slice(0, 30) || `Image Anchor ${idx + 1}`,
    });

    currentCursor = seg.end;
  });

  if (totalDuration - currentCursor >= 0.5) {
    // Fill final gap with unused image if available
    const finalImage = unusedImages[unusedImageIdx];
    if (finalImage) {
      unusedImageIdx++;
      resultScenes.push({
        id: `gap-image-final`,
        startSeconds: currentCursor,
        endSeconds: totalDuration,
        imageUrl: finalImage,
        sceneType: 'image' as const,
        text: '',
        title: 'Final Scene',
      });
    } else {
      resultScenes.push({
        id: `gap-typography-final`,
        startSeconds: currentCursor,
        endSeconds: totalDuration,
        imageUrl: '',
        sceneType: 'typography' as const,
        typographyPrimary: 'SUMMARY',
        typographyAccent: 'OUTRO',
        typographySecondary: 'Key Takeaway',
        title: 'Impact Typography Gap',
      });
    }
  }

  return resultScenes;
}

const SUBTITLE_LANGUAGE_POLICY = 'General translation policy';
const getSubtitlePolicy = (lang: string) => `Subtitle language policy: Generate subtitles strictly in ${lang}. If the script is non-Latin (like Kannada, Telugu, Urdu), use the native script. If it's a Latin-script language, use the appropriate alphabet. Ensure accurate synchronization with the audio timing.`;
const DEFAULT_PLANNING_MEDIA_SECONDS = 90;
const DEFAULT_LONG_PROMO_RENDER_SECONDS = 30;
const SPEECH_LEAD_SECONDS = 0.65;
const MIN_SPEECH_TOKEN_LENGTH = 2;
const RENDER_IMAGE_URL_TIMEOUT_MS = 7000;
const REQUIRED_RENDER_SITE_PATH = '/sites/itnavideo-video-explainer/';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_TRANSCRIPT_REPAIR_MODEL = 'gpt-4o-mini';

const getSubtitlePreset = (styleOrPreset: string) =>
  SUBTITLE_PRESETS[styleOrPreset] ||
  Object.values(SUBTITLE_PRESETS).find((preset) => preset.style === styleOrPreset);

async function reserveAcceptedRenderUsage(input: {
  userId: string;
  renderId: string;
  creditUnits: number;
  mode: ReelMode;
  title: string;
}) {
  await reserveRenderUsageFromServer({
    userId: input.userId,
    renderId: input.renderId,
    creditUnits: input.creditUnits,
    createdAt: new Date(),
    mode: input.mode,
    title: input.title,
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const body = await readJson(request);
  if (!body) return NextResponse.json({ok: false, error: 'Invalid JSON body.'}, {status: 400});

  const mediaKey = readString(body.mediaKey);
  const fileName = readString(body.fileName);
  const contentType = readString(body.contentType);
  const comparisonImageKeys = Array.isArray(body.comparisonImageKeys)
    ? body.comparisonImageKeys.map((value: unknown) => readString(value)).filter(Boolean).slice(0, 2)
    : [];
  const uploadedImageKeys = Array.isArray(body.uploadedImageKeys)
    ? body.uploadedImageKeys.map((value: unknown) => readString(value)).filter(Boolean)
    : Array.isArray(body.imageKeys)
      ? body.imageKeys.map((value: unknown) => readString(value)).filter(Boolean)
      : [];
  const uploadedImageAnchors = Array.isArray(body.uploadedImageAnchors)
    ? (body.uploadedImageAnchors as Array<{ url: string; targetPhrase: string }>).map((item) => ({
        url: readString(item?.url),
        targetPhrase: readString(item?.targetPhrase),
      })).filter((item) => item.url)
    : [];
  const customImageUrls = Array.isArray(body.customImageUrls)
    ? body.customImageUrls.map((value: unknown) => readString(value)).filter(Boolean)
    : Array.isArray(body.stockUrls)
      ? body.stockUrls.map((value: unknown) => readString(value)).filter(Boolean)
      : [];
  const bgmKey = readString(body.bgmKey);
  const bgmVolume = typeof body.bgmVolume === 'number' ? body.bgmVolume : 0.15;
  const subtitleStyle = readString(body.subtitleStyle) || 'demo-storyteller';
  const explanationImageKey = readString(body.explanationImageKey);
  const promoThumbnailImageKey = readString(body.thumbnailKey);
  const topicTitle = readString(body.topicTitle);
  const design = toDesign(readString(body.design));
  const languageHint = toLanguageHint(readString(body.language || body.displayLanguage || body.typographyLanguage));

  // Preview-edited captions/scenes — if present, skip transcription+planning and use these directly
  const previewCaptions = Array.isArray(body.previewCaptions) ? body.previewCaptions as Array<{start: number; end: number; text: string; words?: unknown[]}> : null;
  const previewScenes = Array.isArray(body.previewScenes) ? body.previewScenes : null;
  const previewOverlayTimeline = Array.isArray(body.previewOverlayTimeline) ? body.previewOverlayTimeline : null;
  const previewStickers = Array.isArray(body.previewStickers) ? body.previewStickers : null;
  const previewStickerOverrides = new Map<string, Record<string, unknown>>((previewStickers || []).map((item: unknown, index: number): [string, Record<string, unknown>] => {
    const sticker = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    return [readString(sticker.id) || `compare-pose-${index + 1}`, sticker];
  }));
  const requestedMode = readString(body.mode || body.templateName || body.template || body.compositionId);
  if (!requestedMode) {
    return NextResponse.json({ok: false, status: 'failed', reasonCode: 'MISSING_TEMPLATE', error: 'Please select a video type before creating a reel.'}, {status: 400});
  }
  const requestedModeValue = toMode(requestedMode);
  const resolvedTemplateName = resolveTemplateNameFromRequest(readString(body.templateName || body.template || requestedMode)) || (requestedModeValue ? MODE_TO_TEMPLATE[requestedModeValue] : null) || null;
  const mode: ReelMode = requestedModeValue || toMode(resolvedTemplateName || '') || 'autoCaption';
  const templateConfig = resolvedTemplateName ? VIDEO_TYPE_REGISTRY[resolvedTemplateName] : null;
  if (!resolvedTemplateName || !templateConfig) {
    return NextResponse.json(
      {
        ok: false,
        status: 'failed',
        reasonCode: 'UNKNOWN_TEMPLATE',
        error: 'This video type is not registered for rendering yet.',
      },
      {status: 422},
    );
  }
  const templateName: ReelTemplateName = resolvedTemplateName;
  const composition = templateConfig.compositionId;
  const userId = readString(body.userId);
  const jobStartedAt = Date.now();
  const timings: Record<string, number> = {};
  const markTiming = (stage: string) => {
    timings[stage] = Date.now() - jobStartedAt;
    return timings[stage];
  };
  const userEmail = readString(body.userEmail || body.email);
  const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);
  const rateLimit = checkRateLimit({
    key: `reels-job:${userId || ip}`,
    limit: isFounder ? 100 : userId ? 25 : 10,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ok: false, error: 'Render limit reached for this session. Please wait a few minutes before submitting another render.'}, {status: 429});
  }
  const mediaType = toMediaType(readString(body.mediaType) || 'video');

  if (!(templateConfig.allowedMedia as readonly string[]).includes(mediaType)) {
    return NextResponse.json(
      {
        ok: false,
        status: 'failed',
        reasonCode: 'UNSUPPORTED_MEDIA_FOR_TEMPLATE',
        error: `${humanTemplateName(templateName)} does not support this upload type.`,
      },
      {status: 422},
    );
  }

  const youtubeUrl = readString(body.youtubeUrl);
  if (!mediaKey && !youtubeUrl) {
    return NextResponse.json({ok: false, error: 'mediaKey or youtubeUrl is required. Upload media or enter a YouTube link before starting render.'}, {status: 400});
  }
  if (!userId) {
    return NextResponse.json({ok: false, error: 'Please log in before creating a reel.'}, {status: 401});
  }
  const requestedClipCountRaw = body.clipCount;
  const isAutoClips = mode === 'longVideoClips' && (requestedClipCountRaw === 'auto' || requestedClipCountRaw === 0 || !requestedClipCountRaw);
  const requestedClipCount = mode === 'longVideoClips'
    ? (isAutoClips ? 5 : Math.max(1, Math.min(15, readFiniteNumber(requestedClipCountRaw, 5))))
    : undefined;
  const requestedDurationSeconds = readFiniteNumber(body.durationSeconds, 60);
  let requestedCreditUnits: number | null = null;
  try {
    requestedCreditUnits = (mode === 'longVideoPro')
      ? null
      : calculateRenderCreditUnits(mode, {
          clipCount: requestedClipCount,
          durationSeconds: requestedDurationSeconds,
        });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      status: 'failed',
      reasonCode: 'INVALID_CREDIT_CONFIGURATION',
      error: error instanceof Error ? error.message : 'This video type cannot be priced right now.',
    }, {status: 422});
  }
  if (mode === 'compare') {
    if (contentType && !contentType.startsWith('audio/')) {
      return NextResponse.json({ok: false, error: 'Compare requires one audio voiceover file.'}, {status: 400});
    }
    if (comparisonImageKeys.length !== 2) {
      return NextResponse.json({ok: false, error: 'Compare requires exactly 2 visuals: one left and one right.'}, {status: 400});
    }
  }

  try {
    const access = (mode === 'longVideoPro')
      ? null
      : await getRenderAccessForUser(userId, {mode, creditUnits: requestedCreditUnits ?? undefined});
    markTiming('access_check_ms');
    if (access && !access.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: access.reason || 'Your video limit is complete. Please upgrade to continue.',
          access,
          upgradeUrl: '/pricing',
        },
        {status: access.activePaidPlan ? 403 : 402},
      );
    }

    let mediaUrl = mediaKey ? await createReadUrl(mediaKey) : '';
    if (!mediaUrl && youtubeUrl) {
      try {
        const ytInfo = await resolveYoutubeAudio(youtubeUrl);
        mediaUrl = ytInfo.streamUrl;
      } catch (err: any) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'YOUTUBE_RESOLUTION_FAILED',
          error: err?.message || 'Could not process YouTube URL. Please upload the video file directly.',
        }, { status: 422 });
      }
    }
    const explanationImageUrl = explanationImageKey
      ? readString(await createReadUrl(explanationImageKey))
      : "";
    const thumbnailKey = promoThumbnailImageKey;
    const promoThumbnailUrl = thumbnailKey
      ? readString(await createReadUrl(thumbnailKey))
      : "";
    const comparisonImageUrls = templateConfig.needsImages
      ? (await Promise.all(
          comparisonImageKeys.map(async (key: string) => {
            const cleanKey = readString(key);
            if (!cleanKey) return '';
            if (cleanKey.startsWith('http://') || cleanKey.startsWith('https://')) {
              return cleanKey;
            }
            return readString(await createReadUrl(cleanKey));
          }),
        )).filter(Boolean).slice(0, 2)
      : [];
    const resolvedCustomUrls = (
      await Promise.all(
        customImageUrls.map(async (item: string) => {
          try {
            if (!item || item.startsWith('blob:')) return '';
            // Remote URLs: drop legacy GCS bucket, pass S3/CDN through unchanged
            if (item.startsWith('http://') || item.startsWith('https://') || item.startsWith('data:')) {
              if (item.includes('storage.googleapis.com')) {
                console.warn('[resolvedCustomUrls] Dropping legacy GCS URL:', item.slice(0, 80));
                return '';
              }
              return item;
            }
            // S3 key (no scheme): generate presigned read URL
            if (!item.startsWith('/') && !item.startsWith('assets/')) {
              return readString(await createReadUrl(item));
            }
            // Local public asset path (e.g. /assets/reusable/images/2d/...):
            // These are NOT accessible inside AWS Lambda — must read from disk and upload to S3.
            const cleanRelative = item.replace(/^\/+/, '');
            const diskPath = path.join(process.cwd(), 'public', cleanRelative);
            if (!fs.existsSync(diskPath)) {
              console.warn('[resolvedCustomUrls] Local asset not found on disk, skipping:', diskPath);
              return '';
            }
            const { readFile } = await import('node:fs/promises');
            const fileBytes = await readFile(diskPath);
            const ext = path.extname(diskPath).toLowerCase().slice(1) || 'png';
            const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' };
            const contentType = mimeMap[ext] || 'image/png';
            const safeBasename = path.basename(diskPath).replace(/\s+/g, '-');
            const { key: s3Key } = await uploadTemporaryMediaObject({
              body: new Uint8Array(fileBytes),
              contentType,
              fileName: safeBasename,
              mode: 'image',
              userId,
              purpose: 'stock-asset',
            });
            const signedUrl = readString(await createReadUrl(s3Key));
            console.log('[resolvedCustomUrls] Uploaded local asset to S3:', safeBasename, '→', s3Key);
            return signedUrl;
          } catch (err) {
            console.error('[resolvedCustomUrls] Failed to resolve custom image:', item.slice(0, 80), err);
            return '';
          }
        })
      )
    ).filter(Boolean);

    const uploadedImageUrls = [
      ...(await Promise.all(
        uploadedImageKeys.map(async (key: string) => {
          try {
            if (key.startsWith('http://') || key.startsWith('https://')) {
              return key;
            }
            return readString(await createReadUrl(key));
          } catch {
            return '';
          }
        })
      )).filter(Boolean),
      ...resolvedCustomUrls,
    ];

    const resolvedImageAnchors = await Promise.all(
      uploadedImageAnchors.map(async (anchor) => {
        try {
          if (!anchor.url) return { url: '', targetPhrase: anchor.targetPhrase };
          if (anchor.url.startsWith('http://') || anchor.url.startsWith('https://')) {
            return anchor;
          }
          const signed = readString(await createReadUrl(anchor.url));
          return { url: signed, targetPhrase: anchor.targetPhrase };
        } catch {
          return { url: '', targetPhrase: anchor.targetPhrase };
        }
      })
    ).then((arr) => arr.filter((a) => a.url));

    const customBgmUrl = bgmKey ? readString(await createReadUrl(bgmKey)) : '';
    markTiming('signed_url_prepare_ms');

    if (mode === 'compare' && comparisonImageUrls.length !== 2) {
      return NextResponse.json(
        {ok: false, error: 'Compare visual URLs could not be prepared. Please re-upload both visuals.'},
        {status: 422},
      );
    }
    const config = readLambdaConfig();
    if (!config.ok) return NextResponse.json({ok: false, error: config.error}, {status: 503});

    if (mode === 'longVideoPromo') {
      const requestedDuration = readFiniteNumber(body.durationSeconds, readFiniteNumber(body.sourceDurationSeconds, DEFAULT_LONG_PROMO_RENDER_SECONDS));
      const durationSeconds = Math.max(8, Math.min(MAX_RENDER_WINDOW_SECONDS, requestedDuration || DEFAULT_LONG_PROMO_RENDER_SECONDS));
      const promoTitle = readString(body.promoTitle) || topicTitle || titleFromFile(fileName) || 'Watch Full Video';
      const isFounder = isFounderEmail(readString(body.userEmail || body.email)) || isFounderUser(userId);
      if (!promoThumbnailUrl) {
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            reasonCode: 'LONG_PROMO_MISSING_THUMBNAIL',
            error: 'Long Video Promo needs one thumbnail image. Please upload the thumbnail again.',
            ...(isFounder ? {
              _founderDiagnostics: {
                step: 'long_video_promo_fast_path_preflight',
                reason: 'thumbnail signed URL was empty',
                reasonCode: 'LONG_PROMO_MISSING_THUMBNAIL',
                timings,
                mode,
                templateName,
                compositionId: composition,
              },
            } : {}),
          },
          {status: 422},
        );
      }
      const styleLock = createPremiumStyleLock({
        topicTitle: promoTitle,
        transcript: promoTitle,
        templateName,
        mode,
      });
      const soundCues = createPremiumSoundCues({
        styleLock,
        templateName,
        durationSeconds,
        timeline: [
          {start: 0, end: 1.2, text: promoTitle, type: 'hook'},
          {start: 2.8, end: 3.6, text: 'promo clip reveal', type: 'transition'},
        ],
      });
      const inputProps: Record<string, unknown> = {
        mediaSrc: mediaUrl,
        mediaType,
        mediaFit: templateConfig.mediaFit,
        mediaTrimStartSeconds: 0,
        sourceDurationSeconds: durationSeconds,
        durationSeconds,
        renderWindowSeconds: durationSeconds,
        renderWindowSource: 'promo-fast-path',
        planningMediaSource: 'original-upload',
        topicTitle: promoTitle,
        thumbnailSrc: promoThumbnailUrl,
        title: promoTitle,
        mediaAspect: readString(body.mediaAspect) || 'landscape',
        promoGoal: readString(body.promoGoal) || 'watch-full-video',
        ctaText: readString(body.promoCtaText).slice(0, 40) || 'Watch the full video',
        ctaSubtext: readString(body.promoCtaSubtext ?? 'Link in bio').slice(0, 28),
        promoCtaStyle: readString(body.promoCtaStyle) || 'youtube-red',
        promoCreatorHandle: readString(body.promoCreatorHandle) || '',
        promoBackgroundMode: readString(body.promoBackgroundMode) || 'blur',
        accentColor: readString(body.accentColor) || '#38BDF8',
        sourceAudioVolume: 1,
        premiumEditing: true,
        fastRender: true,
        styleLock,
        soundCues,
        templateName,
        template: templateName,
        compositionId: composition,
        watermark: !isFounder && (!access?.activePaidPlan || Boolean(access?.watermark)),
      };

      try {
        const promoTrans = await transcribeForPlanning({
          mediaUrl,
          fileName,
          contentType,
          mediaType: (mediaType === 'image' ? 'video' : mediaType) as 'audio' | 'video',
        });
        if ('words' in promoTrans && Array.isArray((promoTrans as any).words) && (promoTrans as any).words.length) {
          const words = (promoTrans as any).words;
          const captionChunks: Array<{text: string; start: number; end: number}> = [];
          for (let i = 0; i < words.length; i += 4) {
            const chunk = words.slice(i, i + 4);
            captionChunks.push({
              text: chunk.map((w: {word: string}) => w.word).join(' '),
              start: chunk[0].start,
              end: chunk[chunk.length - 1].end,
            });
          }
          inputProps.captions = captionChunks;
        }
      } catch (captionErr) {
        console.warn('[LONG_VIDEO_PROMO] Speech transcription fallback:', captionErr);
      }

      const preflight = validateBeforeRender({inputProps, templateName, composition, mediaType});
      if (preflight) {
        const userEmail = readString(body.userEmail || body.email);
        const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            reasonCode: preflight.reasonCode,
            error: isFounder ? preflight.message : sanitizeUserFacingStatus(preflight.message),
            ...(isFounder ? {
              _founderDiagnostics: {
                step: 'long_video_promo_fast_path_preflight',
                reason: preflight.message,
                reasonCode: preflight.reasonCode,
                mode,
                templateName,
                compositionId: composition,
                httpStatus: 422,
              },
            } : {}),
          },
          {status: 422},
        );
      }

      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${slugify(readString(inputProps.topicTitle) || fileName || 'promo')}.mp4`;
      markTiming('render_props_prepare_ms');
      const promoFramesPerLambda = 120;
      const renderRequest: LambdaRenderRequest = {
        region: config.region,
        functionName: config.functionName,
        serveUrl: config.serveUrl,
        composition,
        codec: 'h264',
        audioCodec: 'aac',
        inputProps,
        outName,
        privacy: 'private',
        deleteAfter: '3-days',
        overwrite: true,
        concurrency: config.concurrency,
        framesPerLambda: promoFramesPerLambda,
        maxRetries: 3,
        downloadBehavior: {
          type: 'download',
          fileName: 'itnavideo-long-video-promo.mp4',
        },
        isProduction: true,
        logLevel: 'info',
      };
      console.log('[LONG_VIDEO_PROMO_FAST_PATH] render start', {
        mode,
        templateName,
        composition,
        mediaType,
        durationSeconds,
        fastRender: true,
        transcriptionSkipped: true,
        captionsEnabled: false,
        planningSkipped: true,
        framesPerLambda: promoFramesPerLambda,
        timings,
      });
      const render = await startRenderWithCapacityRetry(renderRequest);
      await reserveAcceptedRenderUsage({
        userId,
        renderId: render.renderId,
        creditUnits: requestedCreditUnits ?? calculateRenderCreditUnits('longVideoPromo'),
        mode,
        title: promoTitle,
      });
      markTiming('render_start_ms');
      console.log('[LONG_VIDEO_PROMO_FAST_PATH] lambda accepted', {
        renderId: render.renderId,
        bucketName: render.bucketName,
        durationSeconds,
        timings,
      });

      return NextResponse.json({
        ok: true,
        status: 'rendering',
        renderId: render.renderId,
        bucketName: render.bucketName,
        outName,
        mediaKey,
        reelTitle: inputProps.topicTitle,
        design: 'Long Video Promo',
        mode,
        templateName,
        transcriptSource: 'not-required',
        transcriptWarning: undefined,
        mediaTrimStartSeconds: 0,
        renderWindowSeconds: durationSeconds,
        renderWindowSource: 'promo-fast-path',
        planningMediaSource: 'original-upload',
        access,
        creditUnits: requestedCreditUnits,
        creditCost: formatCreditUnits(requestedCreditUnits ?? calculateRenderCreditUnits('longVideoPromo')),
        retentionHours: 48,
        note: 'Long Video Promo render started without transcription, subtitle generation, or AI planning.',
        _renderVersion: 'v2026-06-30-long-video-promo-fast-path',
        diagnostics: {
          fastPath: true,
          transcriptionSkipped: true,
          planningSkipped: true,
          captionsEnabled: false,
          durationSeconds,
          framesPerLambda: promoFramesPerLambda,
          timings,
        },
        ...(isFounder ? {
          _founderDebug: {
            fastPath: true,
            transcriptionSkipped: true,
            planningSkipped: true,
            captionsEnabled: false,
            durationSeconds,
            compositionId: composition,
            framesPerLambda: promoFramesPerLambda,
            timings,
          },
        } : {}),
      });
    }

    // ── AUTO CAPTION / YOUTUBE SUBTITLE GENERATOR FAST PATH (Direct S3 URL + Groq Whisper + Remotion Lambda) ──
    if (mode === 'autoCaption' || mode === 'youtubeSubtitleGenerator') {
      const maxAllowedSeconds = mode === 'youtubeSubtitleGenerator' ? MAX_YOUTUBE_SUBTITLE_SECONDS : MAX_AUTO_CAPTION_SECONDS;
      const requestedDuration = readFiniteNumber(body.durationSeconds, readFiniteNumber(body.sourceDurationSeconds, 60));
      const fallbackDuration = Math.max(3, Math.min(maxAllowedSeconds, requestedDuration || 60));
      const isFounder = isFounderEmail(readString(body.userEmail || body.email)) || isFounderUser(userId);
      const userCaptionStyle = readString(body.captionStyle) || 'Studio Clean';
      const captionPreset = getSubtitlePreset(userCaptionStyle);
      const userCaptionPosition = (readString(body.captionPosition) || 'bottom') as 'bottom' | 'center' | 'top';
      const userFontFamily = readString(body.captionFontFamily || body.fontFamily) || captionPreset?.fontFamily || undefined;
      const userFontSize = (readString(body.captionFontSize || body.fontSize) || captionPreset?.fontSize || 'medium') as any;
      const userTextColor = readString(body.captionTextColor) || captionPreset?.textColor || '#ffffff';
      const userHighlightColor = readString(body.captionHighlightColor) || captionPreset?.highlightColor || '#facc15';
      const userBackgroundColor = readString(body.captionBackgroundColor) || captionPreset?.backgroundColor || '';
      const spokenLang = normalizeSubtitleLanguage(readString(body.spokenLanguage || body.language));
      const subtitleLang = normalizeSubtitleLanguage(readString(body.captionLanguage || body.subtitleOutputLanguage));

      let captions: Array<{start: number; end: number; text: string; words?: Array<{word: string; start: number; end: number}>}> = [];
      let finalTranscript = '';
      let detectedDuration = fallbackDuration;
      let transcriptSource: 'groq' | 'gemini' | 'preview' = 'groq';
      let transcriptWarning: string | undefined;

      if (previewCaptions && previewCaptions.length > 0) {
        captions = previewCaptions.map((c) => ({
          start: Number(c.start),
          end: Number(c.end),
          text: String(c.text),
          words: Array.isArray(c.words) ? (c.words as any) : undefined,
        }));
        finalTranscript = captions.map((c) => c.text).join(' ');
        transcriptSource = 'preview';
      } else {
        const captionTranscription = await transcribeForPlanning({
          mediaUrl,
          fileName,
          contentType,
          mediaType: (mediaType === 'image' ? 'video' : mediaType) as 'audio' | 'video',
          language: spokenLang && spokenLang !== 'auto' ? spokenLang : undefined,
          outputLanguage: subtitleLang,
          maxSeconds: fallbackDuration,
          skipMediaPreparation: true,
        });

        if (!captionTranscription.transcript) {
          return NextResponse.json({
            ok: false,
            status: 'failed',
            reasonCode: 'NO_SPEECH_DETECTED',
            error: 'No clear speech detected in your video. Please upload a video with clear spoken audio.',
            ...(isFounder ? {
              _founderDiagnostics: {
                step: 'auto_caption_transcription',
                reason: captionTranscription.warning || 'No speech detected by Groq or fallback',
                reasonCode: 'NO_SPEECH_DETECTED',
                mode,
                templateName,
                compositionId: composition,
              },
            } : {}),
          }, { status: 422 });
        }

        markTiming('auto_caption_transcription_ms');
        const renderWindow = selectRenderWindow(captionTranscription);
        detectedDuration = requestedDuration || renderWindow.durationSeconds || captionTranscription.durationSeconds || fallbackDuration;
        captions = buildCompareCaptionsFromGroq(renderWindow);
        finalTranscript = renderWindow.transcript;
        transcriptSource = (captionTranscription.source as any) === 'failed' ? 'groq' : (captionTranscription.source as 'groq' | 'gemini' | 'preview');
        transcriptWarning = captionTranscription.warning;
      }

      const youtubeSubtitleSafeZone = readString(body.youtubeSubtitleSafeZone || 'scrubber');
      const youtubeSubtitleCase = readString(body.youtubeSubtitleCase || 'natural');

      const finalDuration = Math.max(3, Math.min(maxAllowedSeconds, detectedDuration));
      const inputProps: Record<string, unknown> = {
        mediaSrc: mediaUrl,
        mediaType,
        durationSeconds: finalDuration,
        sourceDurationSeconds: finalDuration,
        renderWindowSeconds: finalDuration,
        mediaTrimStartSeconds: 0,
        captions,
        subtitleChunks: captions,
        transcript: finalTranscript,
        captionStyle: userCaptionStyle,
        captionPosition: userCaptionPosition,
        fontFamily: userFontFamily,
        fontSize: userFontSize,
        textColor: userTextColor,
        highlightColor: userHighlightColor,
        backgroundColor: userBackgroundColor,
        showBackground: Boolean(userBackgroundColor),
        youtubeSubtitleSafeZone,
        youtubeSubtitleCase,
        watermark: !isFounder && (!access?.activePaidPlan || Boolean(access?.watermark)),
        templateName,
        template: templateName,
        compositionId: composition,
      };

      const preflight = validateBeforeRender({inputProps, templateName, composition, mediaType});
      if (preflight) {
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            reasonCode: preflight.reasonCode,
            error: isFounder ? preflight.message : sanitizeUserFacingStatus(preflight.message),
            ...(isFounder ? {
              _founderDiagnostics: {
                step: 'auto_caption_preflight',
                reason: preflight.message,
                reasonCode: preflight.reasonCode,
                mode,
                templateName,
                compositionId: composition,
                httpStatus: 422,
              },
            } : {}),
          },
          {status: 422},
        );
      }

      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${slugify(topicTitle || fileName || 'auto-caption')}.mp4`;
      const totalFrames = Math.max(30, Math.ceil(finalDuration * 30));
      const renderRequest: LambdaRenderRequest = {
        region: config.region,
        functionName: config.functionName,
        serveUrl: config.serveUrl,
        composition,
        codec: 'h264',
        audioCodec: 'aac',
        inputProps,
        frameRange: [0, totalFrames - 1],
        outName,
        privacy: 'private',
        deleteAfter: '3-days',
        overwrite: true,
        concurrency: config.concurrency,
        maxRetries: 3,
        downloadBehavior: {
          type: 'download',
          fileName: mode === 'youtubeSubtitleGenerator' ? 'itnavideo-youtube-subtitles.mp4' : 'itnavideo-auto-caption-reel.mp4',
        },
        isProduction: true,
        logLevel: 'info',
      };

      const render = await startRenderWithCapacityRetry(renderRequest);
      const creditCost = requestedCreditUnits ?? calculateRenderCreditUnits(mode, {durationSeconds: finalDuration});
      await reserveAcceptedRenderUsage({
        userId,
        renderId: render.renderId,
        creditUnits: creditCost,
        mode,
        title: topicTitle || titleFromFile(fileName) || (mode === 'youtubeSubtitleGenerator' ? 'YouTube Subtitle Video' : 'Auto Caption Reel'),
      });

      return NextResponse.json({
        ok: true,
        status: 'rendering',
        renderId: render.renderId,
        bucketName: render.bucketName,
        outName,
        mediaKey,
        planningMediaKey: mediaKey,
        reelTitle: topicTitle || titleFromFile(fileName) || 'Auto Caption Reel',
        mode,
        templateName,
        transcriptSource: transcriptSource === 'groq' ? 'primary' : 'fallback',
        transcriptWarning,
        mediaTrimStartSeconds: 0,
        renderWindowSeconds: finalDuration,
        renderWindowSource: 'auto-caption-fast-path',
        planningMediaSource: 'original-upload',
        access,
        creditUnits: creditCost,
        creditCost: formatCreditUnits(creditCost),
        retentionHours: 48,
        note: 'Render started. Poll /api/reels/jobs/status for progress.',
        _founderDebug: isFounder ? {
          fastPath: true,
          captionCount: captions.length,
          durationSeconds: finalDuration,
          compositionId: composition,
          timings,
        } : undefined,
      });
    }

    // ── IMAGE TO VIDEO AI (16:9 Widescreen, scene flow synced to script, Ken Burns camera motion, 2.5D parallax subtitles) ──
    if (mode === 'imageToVideoAi') {
      const audioPrep = await prepareAudioForTranscription(mediaKey, mediaUrl, fileName, contentType, mediaType);
      if (Number((audioPrep as any).durationSeconds) > MAX_IMAGE_TO_VIDEO_SECONDS) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'AUDIO_TOO_LONG',
          error: 'Image to Video AI supports audio up to 12 minutes. Please trim the audio and try again.',
        }, { status: 422 });
      }
      const itvTranscription = await transcribeForPlanning({
        mediaUrl: audioPrep.audioUrl,
        fileName: audioPrep.audioFileName,
        contentType: audioPrep.contentType,
        mediaType: 'audio',
        outputLanguage: normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage)) || undefined,
        maxSeconds: MAX_IMAGE_TO_VIDEO_SECONDS,
      });

      if (!itvTranscription.transcript) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'NO_SPEECH_DETECTED',
          error: 'No clear speech detected. Please upload an audio file with clear spoken voice.',
        }, { status: 422 });
      }

      markTiming('image_to_video_transcription_ms');
      const renderWindow = selectRenderWindow(itvTranscription, MAX_IMAGE_TO_VIDEO_SECONDS);
      const captions = buildCompareCaptionsFromGroq(renderWindow);

      const requestedVisualStyle = readString(body.visualStyle);
      const visualStyle: '2d' | '3d' | 'realistic' = requestedVisualStyle === '2d' || requestedVisualStyle === '3d'
        ? requestedVisualStyle
        : 'realistic';
      const requestedAssetMode = readString(body.assetMode);
      const uploadedOnly = requestedAssetMode === 'upload' || body.blendStockAssets === false;
      if (uploadedOnly && uploadedImageUrls.length === 0) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          error: 'Upload at least one image or choose Itnavideo Assets or Mix.',
        }, { status: 400 });
      }
      const blendStock = !uploadedOnly;

      // ── Step A: Resilient Sub-Batch Multimodal Vision Analysis (Zero Crash Guarantee) ──
      let analyzedUserImages: AnalyzedImage[] = [];
      if (uploadedImageUrls.length > 0) {
        console.log(`[IMAGE_TO_VIDEO_AI] Analyzing ${uploadedImageUrls.length} uploaded images via Resilient Batch Vision AI...`);
        try {
          analyzedUserImages = await analyzeBatchImagesInSingleCall(uploadedImageUrls);
        } catch (visionErr) {
          console.warn('[IMAGE_TO_VIDEO_AI] Batch vision analysis failed, using resilient deterministic fallback:', visionErr);
          analyzedUserImages = uploadedImageUrls.map((url, idx) => generateDeterministicAnalysis(url, `img-user-${idx + 1}`));
        }
        if (!analyzedUserImages || analyzedUserImages.length === 0) {
          analyzedUserImages = uploadedImageUrls.map((url, idx) => generateDeterministicAnalysis(url, `img-user-${idx + 1}`));
        }
      }

      // Filter stock assets by visual category with robust S3 URL mapping & strict category isolation
      const styleFolder = `/images/${visualStyle.toLowerCase()}/`;
      const allUnifiedImages = readUnifiedAssets().filter((asset) => asset.type === 'image' && asset.safeToUse);
      
      const legacy2dAssets = ITNAVIDEO_STOCK_ASSETS.map((asset) => ({
        url: toAbsoluteS3AssetUrl(asset.url),
        positiveTags: asset.positiveTags || [],
        negativeTags: asset.negativeTags || [],
        title: asset.title,
      }));

      let unifiedStyleAssets = allUnifiedImages
        .filter((asset) => 
          asset.src.toLowerCase().includes(styleFolder) || 
          asset.style?.toLowerCase() === visualStyle.toLowerCase() ||
          asset.tags?.some((t) => t.toLowerCase() === visualStyle.toLowerCase()) ||
          asset.category?.toLowerCase() === visualStyle.toLowerCase()
        )
        .map((asset) => ({
          url: toAbsoluteS3AssetUrl(asset.src),
          positiveTags: asset.tags || asset.keywords || [],
          negativeTags: asset.avoidFor || [],
          title: asset.title,
        }));

      // Strict Category Fallback: If 2D requested, strictly use 2D assets pool only. Never dump realistic assets into 2D!
      if (visualStyle === '2d') {
        unifiedStyleAssets = unifiedStyleAssets.length >= 5 ? unifiedStyleAssets : legacy2dAssets;
      } else if (unifiedStyleAssets.length < 5) {
        unifiedStyleAssets = allUnifiedImages.map((asset) => ({
          url: toAbsoluteS3AssetUrl(asset.src),
          positiveTags: asset.tags || asset.keywords || [],
          negativeTags: asset.avoidFor || [],
          title: asset.title,
        }));
      }

      // Combine matched unified style assets with curated stock assets
      const stockAssetsForMatching = (unifiedStyleAssets.length > 0 ? unifiedStyleAssets : legacy2dAssets)
        .filter((asset) => !uploadedOnly);

      const fitMode = (readString(body.fitMode) as 'blur-fill' | 'cover') || 'cover';

      // Smart 5s-7s Scene Chunking Engine with Sentence Alignment & Semantic Context Matching
      const rawSegments = renderWindow.segments || [];
      const totalDuration = Math.max(
        renderWindow.durationSeconds,
        Number((audioPrep as any).durationSeconds) || 0,
        rawSegments.length > 0 ? Number(rawSegments[rawSegments.length - 1].end) || 0 : 0
      );

      // Check if direct AI generated scenes were supplied
      const inputPreviewScenes = Array.isArray(body.previewScenes) && body.previewScenes.length > 0
        ? body.previewScenes
        : Array.isArray(body.scenes) && body.scenes.length > 0
          ? body.scenes
          : null;

      const motions: Array<'zoom-in' | 'pan-left' | 'zoom-out' | 'pan-right' | 'pan-up' | 'pan-down'> = [
        'zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'zoom-in', 'pan-left'
      ];
      const transitions: Array<'dissolve' | 'push-left' | 'dissolve' | 'push-right' | 'hard-cut'> = [
        'dissolve', 'push-left', 'dissolve', 'push-right', 'dissolve'
      ];

      let scenes: Array<{
        id: string;
        startSeconds: number;
        endSeconds: number;
        imageUrl?: string;
        text?: string;
        title?: string;
        sceneType?: 'image' | 'typography';
        typographyPrimary?: string;
        typographySecondary?: string;
        typographyAccent?: string;
        cameraMotion: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
        transition: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
        fitMode?: 'blur-fill' | 'cover';
      }> = [];

      if (Array.isArray(inputPreviewScenes) && inputPreviewScenes.length > 0) {
        const totalSec = renderWindow.durationSeconds > 0 ? renderWindow.durationSeconds : 60;
        const count = inputPreviewScenes.length;
        const defaultDur = totalSec / count;

        scenes = inputPreviewScenes.map((s: any, idx: number) => {
          let startSec = Number(s.startSeconds ?? s.startSec ?? s.start);
          let endSec = Number(s.endSeconds ?? s.endSec ?? s.end);

          if (isNaN(startSec) || startSec < 0) startSec = idx * defaultDur;
          if (isNaN(endSec) || endSec <= startSec) endSec = (idx + 1) * defaultDur;

          return {
            id: s.id || s.sceneId || `scene-${idx + 1}`,
            startSeconds: startSec,
            endSeconds: endSec,
            imageUrl: String(s.imageUrl || s.url || s.image || ''),
            text: String(s.text || s.title || s.visualPrompt || ''),
            title: String(s.title || `Scene ${idx + 1}`),
            sceneType: 'image' as const,
            cameraMotion: s.cameraMotion || motions[idx % motions.length],
            transition: s.transition || transitions[idx % transitions.length],
            fitMode,
          };
        });

        // Ensure scenes strictly tile from 0 to totalSec without 0-duration holes
        let currentSec = 0;
        for (let i = 0; i < scenes.length; i++) {
          const rawDur = scenes[i].endSeconds - scenes[i].startSeconds;
          const sceneDur = rawDur > 0.5 ? rawDur : defaultDur;
          scenes[i].startSeconds = currentSec;
          currentSec += sceneDur;
          scenes[i].endSeconds = currentSec;
        }

        // Scale scene durations proportionally to fit exact total audio duration
        if (currentSec > 0 && Math.abs(currentSec - totalSec) > 0.1) {
          const scaleFactor = totalSec / currentSec;
          for (let i = 0; i < scenes.length; i++) {
            scenes[i].startSeconds *= scaleFactor;
            scenes[i].endSeconds *= scaleFactor;
          }
        }
      } else {
        const whisperWords = (renderWindow.words || []).map((w: any) => ({
          word: String(w.word || w.text || ''),
          start: Number(w.start || 0),
          end: Number(w.end || 0),
        }));

        const userPrompt = readString(body.userPrompt) || readString(body.customAiPrompt) || undefined;

        console.log(`[IMAGE_TO_VIDEO_AI] Executing Visual Intelligence Pipeline (2-Stage Intent & Multimodal Rerank)... Prompt: "${userPrompt || 'none'}"`);

        const semanticScenes = await planVisualIntelligenceTimeline({
          words: whisperWords,
          totalDuration,
          uploadedImages: analyzedUserImages.map((u, idx) => ({
            url: u.originalUrl,
            title: u.descriptiveFilename || u.originalFileName || `Uploaded Visual ${idx + 1}`,
            targetPhrase: u.descriptiveFilename,
          })),
          stockAssets: stockAssetsForMatching.map((sa, idx) => ({
            id: (sa as any).id || `stock-${idx + 1}`,
            url: sa.url,
            title: sa.title,
            tags: sa.positiveTags,
          })),
          userPrompt,
          visualStyle,
        });

        scenes = semanticScenes.map((sc) => ({
          ...sc,
          fitMode,
        }));
      } // end else (when inputPreviewScenes is null)

      // Ensure contiguous scenes with cumulative 30 FPS frame snapping (eliminates 1-frame black gaps)
      if (scenes.length > 0) {
        const fps = 30;
        const totalFrames = Math.max(30, Math.ceil(renderWindow.durationSeconds * fps));
        let frameCursor = 0;

        for (let i = 0; i < scenes.length; i++) {
          scenes[i].startSeconds = frameCursor / fps;

          if (i === scenes.length - 1) {
            // Last scene stretches/clamps exactly to the final audio frame
            const durationInFrames = Math.max(1, totalFrames - frameCursor);
            scenes[i].endSeconds = (frameCursor + durationInFrames) / fps;
          } else {
            const rawDur = scenes[i].endSeconds - scenes[i].startSeconds;
            const targetFrames = Math.max(15, Math.round((rawDur > 0 ? rawDur : (renderWindow.durationSeconds / scenes.length)) * fps));
            frameCursor += targetFrames;
            scenes[i].endSeconds = frameCursor / fps;
          }
        }
      }

      // Convert any local stock asset paths or base64 Data URIs in scenes to S3 presigned URLs so AWS Lambda Chromium can load them cleanly
      const localImageS3Cache = new Map<string, string>();
      for (const scene of scenes) {
        if (scene.imageUrl) {
          if (scene.imageUrl.startsWith('data:')) {
            try {
              const matches = scene.imageUrl.match(/^data:([a-zA-Z0-9\/\-+.]+);base64,(.+)$/);
              if (matches) {
                const mimeType = matches[1];
                const base64Data = matches[2];
                const bytes = Uint8Array.from(Buffer.from(base64Data, 'base64'));
                const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
                const { key: s3Key } = await uploadTemporaryMediaObject({
                  body: bytes,
                  contentType: mimeType,
                  fileName: `ai-scene-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`,
                  mode: 'image',
                  userId,
                  purpose: 'ai-generated',
                });
                const s3Url = readString(await createReadUrl(s3Key));
                if (s3Url) {
                  scene.imageUrl = s3Url;
                } else {
                  throw new Error('S3 signed URL generation failed.');
                }
              }
            } catch (dataUrlErr) {
              console.error('[IMAGE_TO_VIDEO_AI] Could not convert base64 Data URL to S3 URL:', dataUrlErr);
              throw new Error('Failed to upload base64 image to cloud storage. Base64 fallback is disabled to prevent Lambda payload overflow.');
            }
          } else if (!scene.imageUrl.startsWith('http://') && !scene.imageUrl.startsWith('https://')) {
            const localPath = scene.imageUrl;
            if (localImageS3Cache.has(localPath)) {
              scene.imageUrl = localImageS3Cache.get(localPath)!;
            } else {
              const cleanRelative = localPath.replace(/^\/+/, '');
              const diskPath = path.join(process.cwd(), cleanRelative.startsWith('public') ? cleanRelative : path.join('public', cleanRelative));
              let s3ResolvedUrl = '';
              if (fs.existsSync(diskPath)) {
                try {
                  const fileBytes = await fs.promises.readFile(diskPath);
                  const ext = path.extname(diskPath).toLowerCase();
                  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                  const safeBasename = path.basename(diskPath).replace(/[^a-zA-Z0-9.-]/g, '_');
                  const { key: s3Key } = await uploadTemporaryMediaObject({
                    body: new Uint8Array(fileBytes),
                    contentType,
                    fileName: safeBasename,
                    mode: 'image',
                    userId,
                    purpose: 'stock-asset',
                  });
                  s3ResolvedUrl = readString(await createReadUrl(s3Key));
                } catch (uploadErr) {
                  console.warn('[IMAGE_TO_VIDEO_AI] Could not upload local stock asset to S3:', localPath, uploadErr);
                }
              }
              // Absolute S3 URL Fallback Guarantee: Always ensure scene.imageUrl is a valid public HTTPS S3 URL
              const finalUrl = s3ResolvedUrl || toAbsoluteS3AssetUrl(localPath);
              localImageS3Cache.set(localPath, finalUrl);
              scene.imageUrl = finalUrl;
            }
          }
        }
      }

      // ── VISUAL DIVERSITY & NULL-SAFETY POST-PROCESSOR ──
      // Guarantee zero scene image duplications and 100% null-safety against broken 2D assets
      const usedImageUrlsInJob = new Set<string>();
      for (let i = 0; i < scenes.length; i++) {
        const sc = scenes[i];
        if (sc.sceneType === 'image' && sc.imageUrl && typeof sc.imageUrl === 'string') {
          if (usedImageUrlsInJob.has(sc.imageUrl)) {
            // Find an unused stock image from the available pool
            const unusedAsset = stockAssetsForMatching.find((a) => a.url && !usedImageUrlsInJob.has(a.url));
            if (unusedAsset && unusedAsset.url) {
              sc.imageUrl = unusedAsset.url;
              usedImageUrlsInJob.add(unusedAsset.url);
            } else {
              // Graceful fallback: Convert duplicate scene into a high-impact kinetic typography beat
              sc.sceneType = 'typography';
              const words = (sc.text || '').split(/\s+/).filter((w) => w.length > 2);
              sc.typographyPrimary = words.slice(0, 3).join(' ').toUpperCase() || 'KEY TAKEAWAY';
              sc.typographyAccent = 'INSIGHT';
              sc.typographySecondary = sc.text || '';
              sc.imageUrl = '';
            }
          } else {
            usedImageUrlsInJob.add(sc.imageUrl);
          }
        } else if (!sc.imageUrl || typeof sc.imageUrl !== 'string' || !sc.imageUrl.trim()) {
          // Null-Safety: Convert missing asset scene to typography beat
          sc.sceneType = 'typography';
          const words = (sc.text || '').split(/\s+/).filter((w) => w.length > 2);
          sc.typographyPrimary = words.slice(0, 3).join(' ').toUpperCase() || 'CRITICAL SHIFT';
          sc.typographyAccent = 'KEY POINT';
          sc.typographySecondary = sc.text || '';
          sc.imageUrl = '';
        }
      }

      // SFX Events: Optional sound effects layer (safe empty array unless valid asset is provided)
      const sfxEvents: Array<{ id: string; sfxUrl: string; startFrame: number; volume: number }> = [];

      const finalBgmUrl = customBgmUrl || '';

      const inputProps: Record<string, unknown> = {
        mediaSrc: audioPrep.audioUrl || mediaUrl,
        audioUrl: audioPrep.audioUrl || mediaUrl,
        bgmUrl: finalBgmUrl,
        bgmVolume,
        scenes,
        captions,
        subtitleChunks: captions,
        sfxEvents,
        durationSeconds: renderWindow.durationSeconds,
        title: topicTitle || 'Image to Video AI',
        subtitleStyle,
        fitMode,
        templateName,
        template: templateName,
        compositionId: composition,
      };

      const preflight = validateBeforeRender({ inputProps, templateName, composition, mediaType });
      if (preflight) {
        return NextResponse.json({ ok: false, status: 'failed', reasonCode: preflight.reasonCode, error: preflight.message }, { status: 422 });
      }

      const totalFrames = Math.max(30, Math.ceil(renderWindow.durationSeconds * 30));
      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-image-to-video-ai.mp4`;
      const render = await startRenderWithCapacityRetry({
        region: config.region,
        functionName: config.functionName,
        serveUrl: config.serveUrl,
        composition,
        codec: 'h264',
        audioCodec: 'aac',
        inputProps,
        frameRange: [0, totalFrames - 1],
        framesPerLambda: 120,
        outName,
        privacy: 'private',
        deleteAfter: '3-days',
        overwrite: true,
        concurrency: config.concurrency,
        maxRetries: 3,
        downloadBehavior: { type: 'download', fileName: 'itnavideo-image-to-video-ai.mp4' },
        isProduction: true,
        logLevel: 'info',
      });

      markTiming('image_to_video_render_start_ms');
      console.log('[IMAGE_TO_VIDEO_AI] render started', { renderId: render.renderId, sceneCount: scenes.length });

      return NextResponse.json({
        ok: true,
        status: 'rendering',
        renderId: render.renderId,
        bucketName: render.bucketName,
        outName,
        mediaKey,
        reelTitle: topicTitle || 'Image to Video AI',
        design: 'Image to Video AI',
        mode,
        templateName,
        transcriptSource: 'groq',
        access,
        retentionHours: 48,
        diagnostics: { sceneCount: scenes.length, imageCount: uploadedImageUrls.length + stockAssetsForMatching.length },
      });
    }

    // ── BOOK SUMMARY VIDEO (16:9 Full HD, pre-planned scenes, Groq Whisper captions, GA Orange design system) ──
    if (mode === 'bookSummary') {
      // Accept pre-built scenes from BookSummaryStudio (already planned via /api/reels/plan-book-summary)
      const rawScenes = body.scenes;
      const bookSummaryScenes = Array.isArray(rawScenes) ? rawScenes : [];

      const bsBookTitle = readString(body.bookTitle) || 'Book Summary';
      const bsAuthorName = readString(body.authorName) || '';
      const bsBookCoverUrl = readString(body.bookCoverUrl) || '';
      const bsAuthorPortraitUrl = readString(body.authorPortraitUrl) || '';
      const bsReferenceImages: string[] = Array.isArray(body.referenceImages) ? body.referenceImages.map(String) : [];
      const bsCaptionThemeId = readString(body.captionsTheme) || 'glow-viral';
      const bsDurationSeconds = Math.min(MAX_BOOK_SUMMARY_SECONDS, Math.max(5, readFiniteNumber(body.durationSeconds, 60)));

      // Validate audio URL
      if (!mediaUrl) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'NO_AUDIO',
          error: 'Audio narration file is required for Book Summary Video.',
        }, { status: 400 });
      }

      if (bsDurationSeconds > MAX_BOOK_SUMMARY_SECONDS) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'AUDIO_TOO_LONG',
          error: 'Book Summary Video supports audio up to 12 minutes. Please trim and try again.',
        }, { status: 422 });
      }

      if (bookSummaryScenes.length === 0) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'NO_SCENES',
          error: 'No scenes provided. Please complete the AI storyboard step before rendering.',
        }, { status: 400 });
      }

      markTiming('book_summary_scenes_received_ms');

      // Build word-level captions from pre-existing transcript segments if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bsCaptions: any[] = [];
      const rawTranscriptSegments = body.timestampSegments || body.segments || [];
      if (Array.isArray(rawTranscriptSegments) && rawTranscriptSegments.length > 0) {
        // Re-use compare caption builder for word-grouped subtitle chunks
        const syntheticRenderWindow = {
          transcript: readString(body.transcript) || '',
          words: Array.isArray(body.words) ? body.words : [],
          segments: rawTranscriptSegments,
          durationSeconds: bsDurationSeconds,
        };
        bsCaptions = buildCompareCaptionsFromGroq(syntheticRenderWindow as Parameters<typeof buildCompareCaptionsFromGroq>[0]);
      } else if (body.captions && Array.isArray(body.captions)) {
        bsCaptions = body.captions;
      }

      markTiming('book_summary_captions_built_ms');

      // Optional BGM
      const finalBgmUrl = customBgmUrl || '';

      const inputProps: Record<string, unknown> = {
        audioUrl: mediaUrl,
        audioSrc: mediaUrl,
        bgmUrl: finalBgmUrl,
        bgmVolume,
        scenes: bookSummaryScenes,
        captions: bsCaptions,
        subtitleChunks: bsCaptions,
        durationSeconds: bsDurationSeconds,
        bookTitle: bsBookTitle,
        authorName: bsAuthorName,
        bookCoverUrl: bsBookCoverUrl,
        authorPortraitUrl: bsAuthorPortraitUrl,
        referenceImages: bsReferenceImages,
        captionThemeId: bsCaptionThemeId,
        compositionId: composition,
        templateName,
      };

      const preflight = validateBeforeRender({ inputProps, templateName, composition, mediaType });
      if (preflight) {
        return NextResponse.json({ ok: false, status: 'failed', reasonCode: preflight.reasonCode, error: preflight.message }, { status: 422 });
      }

      const totalFrames = Math.max(30, Math.ceil(bsDurationSeconds * 30));
      const safeBookSlug = bsBookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'book-summary';
      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${safeBookSlug}.mp4`;

      const render = await startRenderWithCapacityRetry({
        region: config.region,
        functionName: config.functionName,
        serveUrl: config.serveUrl,
        composition,
        codec: 'h264',
        audioCodec: 'aac',
        inputProps,
        frameRange: [0, totalFrames - 1],
        framesPerLambda: 120,
        outName,
        privacy: 'private',
        deleteAfter: '3-days',
        overwrite: true,
        concurrency: config.concurrency,
        maxRetries: 3,
        downloadBehavior: { type: 'download', fileName: `itnavideo-book-summary-${safeBookSlug}.mp4` },
        isProduction: true,
        logLevel: 'info',
      });

      markTiming('book_summary_render_start_ms');
      console.log('[BOOK_SUMMARY] render started', { renderId: render.renderId, sceneCount: bookSummaryScenes.length, durationSeconds: bsDurationSeconds });

      return NextResponse.json({
        ok: true,
        status: 'rendering',
        renderId: render.renderId,
        bucketName: render.bucketName,
        outName,
        mediaKey,
        reelTitle: bsBookTitle,
        design: 'Book Summary Video',
        mode,
        templateName,
        transcriptSource: 'pre-planned',
        access,
        retentionHours: 48,
        diagnostics: { sceneCount: bookSummaryScenes.length, durationSeconds: bsDurationSeconds },
      });
    }

    // ── LONG VIDEO PRO (AI-directed 16:9 with scene planning, visual matching, kinetic typography) ──
    if (mode === 'longVideoPro') {
      const audioPrep = await prepareAudioForTranscription(mediaKey, mediaUrl, fileName, contentType, mediaType);
      const lvpTranscription = await transcribeForPlanning({
        mediaUrl: audioPrep.audioUrl,
        fileName: audioPrep.audioFileName,
        contentType: audioPrep.contentType,
        mediaType: audioPrep.mediaType,
      });
      if (!lvpTranscription.transcript) {
        return NextResponse.json({ ok: false, status: 'failed', reasonCode: 'NO_SPEECH_DETECTED', error: 'No clear speech detected. Upload audio/video with clear speech.' }, { status: 422 });
      }
      markTiming('long_video_pro_transcription_ms');
      const renderWindow = selectRenderWindow(lvpTranscription);
      const words = (renderWindow.words || []).filter((w: {word: string; start: number; end: number}) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end)).map((w: {word: string; start: number; end: number}) => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) }));
      const captions = buildCompareCaptionsFromGroq(renderWindow);

      // AI Visual Planning Agent — holistic script analysis & Video Blueprint generation
      const { blueprint, source } = await planLongVideoProBlueprint({
        transcript: renderWindow.transcript,
        words,
        durationSeconds: renderWindow.durationSeconds,
        topicTitle: topicTitle || undefined,
      });
      markTiming('long_video_pro_scene_plan_ms');
      console.log('[LONG_VIDEO_PRO] Blueprint generated:', { source, totalScenes: blueprint.totalScenes });

      // Asset Resolver — resolves 3-tier assets (Primary -> Secondary -> Fallback Exec)
      const resolvedScenes = await resolveBlueprintAssets(blueprint);

      const longVideoScenes = resolvedScenes.map((scene) => {
        let type = 'image';
        if (scene.renderedType === 'VIDEO_CLIP') type = 'video';
        else if (
          scene.renderedType === 'TYPOGRAPHY' ||
          scene.renderedType === 'CHART_GRAPH' ||
          scene.renderedType === 'DIAGRAM_INFOGRAPHIC'
        )
          type = 'typography';
        else if (scene.renderedType === 'SIMPLE_BACKGROUND') type = 'background';
        else if (scene.renderedType === 'FACE_PERSON') type = 'face';

        return {
          type,
          visualType: scene.visualType,
          startSeconds: scene.startSeconds,
          endSeconds: scene.endSeconds,
          text: scene.narrationText,
          chapterTitle: scene.chapterTitle,
          speakerInfo: scene.speakerInfo,
          onScreenText: scene.onScreenText || scene.fallbackSpec.headline,
          keyword: scene.fallbackSpec.headline || scene.onScreenText || 'Key Point',
          statisticNumber: scene.fallbackSpec.statisticNumber,
          imageSrc: scene.imageSrc,
          videoSrc: scene.videoSrc,
          motion:
            scene.animation === 'slow_zoom_in'
              ? 'zoom-in'
              : scene.animation === 'pan_right'
              ? 'slide-right'
              : scene.animation === 'pan_left'
              ? 'slide-left'
              : 'fade',
          fallbackSpec: scene.fallbackSpec,
          visualPriority: scene.visualPriority,
        };
      });

      const lvpTitle = topicTitle || titleFromTranscript(lvpTranscription.transcript) || titleFromFile(fileName) || 'Long Video Pro';
      const visualStylePreset = String(body.visualStylePreset || 'cinematic_dark');
      const atmosphereBg = String(body.atmosphereBg || 'none');

      // Select dynamic background music and generate styleLock + soundCues
      const music = selectBackgroundMusic({
        topicTitle: lvpTitle,
        transcript: lvpTranscription.transcript,
      });

      const styleLock = createPremiumStyleLock({
        topicTitle: lvpTitle,
        transcript: lvpTranscription.transcript,
        templateName,
        mode,
      });

      const soundCues = createPremiumSoundCues({
        styleLock,
        templateName,
        durationSeconds: renderWindow.durationSeconds,
        captions: captions.map((c) => ({ start: Number(c.start), end: Number(c.end), text: String(c.text) })),
      });

      // Face-Camera Silence & Filler Word Cleaner
      const faceCamCleaned = cleanFaceCamSilenceAndFillers(words, renderWindow.durationSeconds);
      console.log('[LONG_VIDEO_PRO_FACE_CAM]', {
        originalDuration: faceCamCleaned.originalDurationSeconds,
        cleanedDuration: faceCamCleaned.cleanedDurationSeconds,
        silenceCuts: faceCamCleaned.silenceCutCount,
        fillersRemoved: faceCamCleaned.fillersRemovedCount,
        clipsCount: faceCamCleaned.clips.length,
      });

      // Face Tracking Keyframes for Smart Framing
      const faceTracking = await extractFaceKeyframes(mediaUrl, faceCamCleaned.cleanedDurationSeconds, 2.0);
      console.log('[LONG_VIDEO_PRO_FACE_TRACKING]', {
        source: faceTracking.source,
        keyframesCount: faceTracking.keyframes.length,
        isStaticCenter: faceTracking.isStaticCenter,
        avgXCenter: faceTracking.averageXCenter,
      });

      const inputProps: Record<string, unknown> = {
        mediaSrc: mediaUrl,
        mediaType,
        sourceAudioVolume: 1.35,
        durationSeconds: faceCamCleaned.cleanedDurationSeconds,
        speechClips: faceCamCleaned.clips,
        enableSmartPunchIn: true,
        faceKeyframes: faceTracking.keyframes,
        scenes: longVideoScenes,
        captions: captions.map((c: any) => ({
          start: Number(c.start),
          end: Number(c.end),
          text: String(c.text),
          words: c.words,
        })),
        title: lvpTitle,
        backgroundMusicSrc: music.src,
        musicVolume: music.volume,
        templateName,
        template: templateName,
        compositionId: composition,
        premiumEditing: true,
        styleLock,
        soundCues,
        visualStylePreset,
        atmosphereBg,
        headingFont: readString(body.headingFont) || 'Montserrat',
        bodyFont: readString(body.bodyFont) || 'Inter',
        youtubeTimestamps: blueprint.youtubeTimestamps,
      };
      const preflight = validateBeforeRender({ inputProps, templateName, composition, mediaType });
      if (preflight) {
        return NextResponse.json({ ok: false, status: 'failed', reasonCode: preflight.reasonCode, error: preflight.message }, { status: 422 });
      }
      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-long-video-pro.mp4`;
      const render = await startRenderWithCapacityRetry({
        region: config.region, functionName: config.functionName, serveUrl: config.serveUrl,
        composition, codec: 'h264', audioCodec: 'aac', inputProps, outName,
        privacy: 'private', deleteAfter: '3-days', overwrite: true,
        concurrency: config.concurrency,
        maxRetries: 3,
        downloadBehavior: { type: 'download', fileName: 'itnavideo-long-video-pro.mp4' },
        isProduction: true, logLevel: 'info',
      });
      markTiming('long_video_pro_render_start_ms');
      console.log('[LONG_VIDEO_PRO] render started', { renderId: render.renderId, sceneCount: longVideoScenes.length, source });
      return NextResponse.json({
        ok: true, status: 'rendering', renderId: render.renderId, bucketName: render.bucketName, outName, mediaKey,
        reelTitle: lvpTitle, design: 'Long Video Pro', mode, templateName, transcriptSource: 'groq',
        access, retentionHours: 48,
        diagnostics: { sceneCount: longVideoScenes.length, planSource: source, assetsMatched: resolvedScenes.filter((s) => s.resolvedUrl).length },
      });
    }

    // ── LONG VIDEO CLIPS FLOW (transcribe → pick best moments → multi-render) ──
    if (mode === 'longVideoClips') {
      const audioPrep = await prepareAudioForTranscription(mediaKey, mediaUrl, fileName, contentType, mediaType);

      // Transcribe the audio/video stream
      const clipTranscription = await transcribeForPlanning({
        mediaUrl: audioPrep.audioUrl,
        fileName: audioPrep.audioFileName,
        contentType: audioPrep.contentType,
        mediaType: audioPrep.mediaType,
        outputLanguage: normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage)) || undefined,
      });
      markTiming('clip_transcription_ms');

      if (!clipTranscription.transcript) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'TRANSCRIPTION_FAILED',
          error: 'No clear speech detected. Please upload a video with clear speaking voice.',
        }, {status: 422});
      }

      const totalDuration = clipTranscription.durationSeconds || 120;
      const rawWords = 'words' in clipTranscription && Array.isArray(clipTranscription.words) ? clipTranscription.words : [];
      const rawSegments = 'segments' in clipTranscription && Array.isArray(clipTranscription.segments) ? clipTranscription.segments : [];
      const allWords = rawWords.map((w: any) => ({
        word: String(w.word || ''),
        start: Number(w.start ?? 0),
        end: Number(w.end ?? 0),
      })).filter((w: any) => w.word && Number.isFinite(w.start));
      const allSegments = rawSegments.map((s: any) => ({
        start: Number(s.start ?? 0),
        end: Number(s.end ?? 0),
        text: String(s.text || ''),
      }));

      // Calculate dynamic/auto clips or retrieve user request
      const isAutoClips = body.clipCount === 'auto' || body.clipCount === 0 || !body.clipCount;
      let selectedClipCount = 3;
      if (isAutoClips) {
        if (totalDuration < 120) selectedClipCount = 2; // < 2 mins -> 2 clips
        else if (totalDuration < 300) selectedClipCount = 3; // 2-5 mins -> 3 clips
        else if (totalDuration < 600) selectedClipCount = 5; // 5-10 mins -> 5 clips
        else if (totalDuration < 1200) selectedClipCount = 8; // 10-20 mins -> 8 clips
        else selectedClipCount = 10; // 20-30 mins -> 10 clips
      } else {
        selectedClipCount = Math.max(1, Math.min(15, readFiniteNumber(body.clipCount, 3)));
      }

      const rawClipDuration = body.clipDuration;
      const requestedClipDurationOption = String(rawClipDuration || 'auto');

      // 1. EXTRACT CLIPS FIRST based on speech timestamps and hook density
      const hookStrategy = (readString(body.clipsHookStrategy) || 'auto') as 'auto' | 'high-energy' | 'actionable' | 'story';
      const bestClips = selectBestClips({
        transcript: clipTranscription.transcript,
        words: allWords,
        segments: allSegments,
        totalDurationSeconds: totalDuration,
        clipDurationOption: requestedClipDurationOption,
        clipCount: selectedClipCount,
        hookStrategy,
      });
      markTiming('clip_selection_ms');

      if (!bestClips.length) {
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'NO_CLIPS_FOUND',
          error: 'Video too short or too quiet to extract clips. Try a longer video with more speech.',
        }, {status: 422});
      }

      // Caption style from request
      const clipCreditUnits = calculateRenderCreditUnits('longVideoClips', {clipCount: bestClips.length});
      const firstClipCreditUnits = calculateRenderCreditUnits('longVideoClips', {clipCount: 1});
      const additionalClipCreditUnits = calculateRenderCreditUnits('longVideoClips', {clipCount: 2}) - firstClipCreditUnits;
      const clipCaptionStyle = readString(body.captionStyle) || 'Studio Clean';
      const clipCaptionPreset = getSubtitlePreset(clipCaptionStyle);
      const enableCaptions = body.enableCaptions !== false && body.addCaptions !== false;

      // 2. AFTER EXTRACTING CLIPS, GENERATE CAPTIONS & RENDER EACH 9:16 CLIP
      const renderResults: Array<{
        clipIndex: number;
        renderId: string;
        bucketName: string;
        outName: string;
        startSeconds: number;
        endSeconds: number;
        title: string;
        headline: string;
        durationSeconds: number;
        viralityScore: number;
        viralityGrade: string;
        whyItWorks: string;
      }> = [];

      for (const [clipPosition, clip] of bestClips.entries()) {
        // Build captions specifically for this extracted clip window
        const clipWords = allWords.filter((w: any) => w.start >= clip.startSeconds && w.end <= clip.endSeconds);
        const clipCaptions = buildCaptionsFromWords(clipWords, clip.startSeconds);
        const clipTitle = clip.title || titleFromTranscript(clip.text) || `Viral Clip ${clipPosition + 1}`;
        const clipDuration = clip.endSeconds - clip.startSeconds;

        const clipInputProps: Record<string, unknown> = {
          mediaSrc: mediaUrl,
          mediaType: 'video',
          mediaTrimStartSeconds: clip.startSeconds,
          sourceAudioVolume: 1,
          aspectRatio: '9:16', // Always produce 9:16 vertical shorts from 16:9 input
          headline: clip.headline,
          showHeadline: body.showHeadline !== false,
          durationSeconds: clipDuration,
          sourceDurationSeconds: clipDuration,
          renderWindowSeconds: clipDuration,
          captions: enableCaptions ? clipCaptions : [],
          captionStyle: clipCaptionStyle,
          captionPosition: readString(body.captionPosition) || 'bottom',
          textColor: readString(body.captionTextColor) || clipCaptionPreset?.textColor || '#ffffff',
          highlightColor: readString(body.captionHighlightColor) || clipCaptionPreset?.highlightColor || '#facc15',
          backgroundColor: readString(body.captionBackgroundColor) || clipCaptionPreset?.backgroundColor || '#18181B',
          fontSize: readString(body.captionFontSize) || clipCaptionPreset?.fontSize || 'large',
          fontFamily: readString(body.captionFontFamily) || clipCaptionPreset?.fontFamily || undefined,
          showBackground: true,
          templateName,
          template: templateName,
          compositionId: composition,
        };

        const clipOutName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-clip-${clip.index + 1}.mp4`;

        const clipRenderRequest: LambdaRenderRequest = {
          region: config.region,
          functionName: config.functionName,
          serveUrl: config.serveUrl,
          composition,
          codec: 'h264',
          audioCodec: 'aac',
          inputProps: clipInputProps,
          outName: clipOutName,
          privacy: 'private',
          deleteAfter: '3-days',
          overwrite: true,
          concurrency: config.concurrency || 6,
          maxRetries: 3,
          downloadBehavior: { type: 'download', fileName: `itnavideo-clip-${clip.index + 1}.mp4` },
          isProduction: true,
          logLevel: 'info',
        };

        const clipRender = await startRenderWithCapacityRetry(clipRenderRequest);
        await reserveAcceptedRenderUsage({
          userId,
          renderId: clipRender.renderId,
          creditUnits: clipPosition === 0 ? firstClipCreditUnits : additionalClipCreditUnits,
          mode,
          title: clipTitle,
        });
        renderResults.push({
          clipIndex: clip.index,
          renderId: clipRender.renderId,
          bucketName: clipRender.bucketName,
          outName: clipOutName,
          startSeconds: clip.startSeconds,
          endSeconds: clip.endSeconds,
          title: clipTitle,
          headline: clip.headline,
          durationSeconds: clipDuration,
          viralityScore: clip.viralityScore,
          viralityGrade: clip.viralityGrade,
          whyItWorks: clip.whyItWorks,
        });
      }
      markTiming('all_clips_render_start_ms');

      console.log('[LONG_VIDEO_CLIPS] All clips submitted', {
        clipCount: renderResults.length,
        clipDuration: requestedClipDurationOption,
        totalDuration,
        timings,
      });

      return NextResponse.json({
        ok: true,
        status: 'rendering',
        renderId: renderResults[0]?.renderId,
        bucketName: renderResults[0]?.bucketName,
        outName: renderResults[0]?.outName,
        mediaKey,
        reelTitle: `${renderResults.length} clip${renderResults.length > 1 ? 's' : ''} from long video`,
        design: 'Long Video Clips',
        mode,
        templateName,
        transcriptSource: 'groq',
        clipCount: renderResults.length,
        clips: renderResults,
        access,
        creditUnits: clipCreditUnits,
        creditCost: formatCreditUnits(clipCreditUnits),
        retentionHours: 48,
      });
    }

    // For facelessVideo / aiVideoGenerator, enforce voiceover audio input
    if (mode === 'facelessVideo' || mode === 'aiVideoGenerator') {
      const isAudioUpload = mediaType === 'audio' || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(fileName);
      if (!isAudioUpload) {
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            reasonCode: 'AUDIO_VOICEOVER_REQUIRED',
            error: 'Faceless Video requires a voiceover audio file (.mp3, .wav, .m4a, .aac). Please upload your narration voiceover.',
          },
          {status: 422},
        );
      }
    }

    const maxRenderSeconds = getMaxRenderWindowSecondsForTemplate(templateName);
    const planningMedia = await preparePlanningMediaForRender({
      mediaUrl,
      fileName,
      contentType,
      mediaType: mediaType === 'image' ? 'video' : mediaType,
      userId,
      maxAllowedSeconds: maxRenderSeconds,
    });
    if ((planningMedia as any).error && !planningMedia.transcriptionMediaUrl) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: 'MEDIA_CLIP_PREP_FAILED',
          error: 'We could not prepare the media for processing. Please try again or upload a standard MP3/MP4 file.',
          detail: process.env.NODE_ENV !== 'production' ? (planningMedia as any).error : undefined,
        },
        {status: 422},
      );
    }

    const subtitleLang = normalizeSubtitleLanguage(readString(body.captionLanguage || body.subtitleOutputLanguage));
    const spokenLang = readString(body.spokenLanguage || body.audioSpokenLanguage);
    console.log('[PIPELINE] spokenLang:', spokenLang || 'auto', '| subtitleLang:', subtitleLang || 'auto-source', '| mode:', mode, '| template:', templateName);

    let transcription: PlanningTranscription;
    const transcribeStart = Date.now();
    try {
      transcription = await transcribeForPlanning({
        mediaUrl: planningMedia.transcriptionMediaUrl,
        fileName: planningMedia.transcriptionFileName,
        contentType: planningMedia.transcriptionContentType,
        mediaType: mediaType === 'image' ? 'video' : mediaType,
        language: spokenLang && spokenLang !== 'auto' ? spokenLang : undefined,
        outputLanguage: subtitleLang,
        maxSeconds: maxRenderSeconds,
      });
      const transcriptionSegments = 'segments' in transcription && Array.isArray(transcription.segments) ? transcription.segments : [];
      console.log('[PIPELINE] transcription+translation done in', Date.now() - transcribeStart, 'ms | languageHint:', transcription.languageHint, '| hasSegments:', Boolean(transcriptionSegments.length));
    } catch (transcribeError) {
      const errMsg = transcribeError instanceof Error ? transcribeError.message : 'Transcription crashed';
      console.error('Transcription error:', errMsg);
      const userEmail = readString(body.userEmail || body.email);
      const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);
      return NextResponse.json({
        ok: false,
        status: 'failed',
        reasonCode: 'TRANSCRIPTION_CRASHED',
        error: isFounder ? `Transcription crashed: ${errMsg}` : 'Could not process audio. Please try again.',
        ...(isFounder ? { _founderDiagnostics: { step: 'transcription', reason: errMsg, mode, templateName, compositionId: composition, httpStatus: 500, raw: transcribeError instanceof Error ? transcribeError.stack?.split('\n').slice(0, 5).join(' | ') : '' } } : {}),
      }, {status: 500});
    }

    if (!transcription.transcript) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: 'TRANSCRIPTION_FAILED',
          error: 'No clear speech detected. Please upload a new video or audio with clear speaking voice. Background music or silent videos cannot be used.',
          detail: transcription.warning,
        },
        {status: 422},
      );
    }

    // Subtitles: only English/Hinglish supported (no paid translation APIs)
    // Groq handles both natively without external translation
    const renderWindow = selectRenderWindow(transcription, maxRenderSeconds);
    const hasSpecializedPlanner =
      Boolean(templateConfig.skipPlanner) ||
      mode === 'whiteboardVideo' ||
      mode === 'typographyVideo' ||
      mode === 'facelessVideo' ||
      mode === 'aiVideoGenerator' ||
      mode === 'compare';

    let plan: ReturnType<typeof validateAndRepairReelPlan>;
    if (hasSpecializedPlanner) {
      // Specialized planner handles scene/layout structure directly; bypass generic OpenAI planning
      plan = {
        title: topicTitle || titleFromTranscript(renderWindow.transcript) || titleFromFile(fileName) || 'Reel',
        scenes: [],
        timeline: [],
        visualAssets: [],
        soundCues: [],
        validation: {
          renderAllowed: true,
          qualityScore: 100,
          qualityBand: 'high',
          qualityChecks: ['Specialized planner active: generic OpenAI planning skipped.'],
        },
        renderProps: {
          captions: buildCompareCaptionsFromGroq(renderWindow),
        },
      } as any;
    } else {
      try {
        plan = validateAndRepairReelPlan(await createReelPlan({
          transcript: renderWindow.transcript,
          words: renderWindow.words,
          timestampSegments: renderWindow.segments,
          topicTitle: topicTitle || undefined,
          topic: topicTitle || undefined,
          durationSeconds: renderWindow.durationSeconds,
          mediaType,
          languageHint: languageHint || transcription.languageHint,
          design,
          template: templateName,
          visualMode: templateConfig.plannerMode,
          selectedAssets: undefined,
          dryRun: !process.env.OPENAI_API_KEY,
          constraints: [
            SUBTITLE_LANGUAGE_POLICY,
            mediaType === 'video'
              ? 'Use uploaded video as the top visual container for Video Explainer.'
              : 'Use uploaded voiceover to create a Video Explainer with generated visual structure.',
            renderWindow.trimStartSeconds > 0
              ? `Use the speech-aware 1 minute window starting at ${renderWindow.trimStartSeconds.toFixed(2)}s of the source media.`
              : 'Use the first minute of the source media.',
            'No karaoke captions.',
            'One primary visual element per scene.',
            'Use the normalized transcript as clean English plus Roman Hinglish. Keep official terms in English and avoid Devanagari/Urdu/Arabic script in visible render text.',
            transcription.source === 'groq'
              ? 'Transcript source: primary transcription service.'
              : 'Transcript source: OpenAI Whisper fallback after primary transcription failed.',
          ],
        }));
      } catch (planError) {
        const errMsg = planError instanceof Error ? planError.message : 'Planning crashed';
        console.error('Plan creation error:', errMsg, planError instanceof Error ? planError.stack : '');
        const userEmail = readString(body.userEmail || body.email);
        const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);
        return NextResponse.json({
          ok: false,
          status: 'failed',
          reasonCode: 'PLANNING_CRASHED',
          error: isFounder ? `Planning crashed: ${errMsg}` : 'Could not plan your reel. Please try again.',
          ...(isFounder ? { _founderDiagnostics: { step: 'planning', reason: errMsg, mode, templateName, compositionId: composition, httpStatus: 500, raw: planError instanceof Error ? planError.stack?.split('\n').slice(0, 6).join(' | ') : '' } } : {}),
        }, {status: 500});
      }
    }

    if (plan.validation.renderAllowed === false) {
      const detail = sanitizeUserFacingStatus(plan.validation.renderBlockReason || 'The reel needs repair before render.');
      return NextResponse.json(
        {
          ok: false,
          error: detail,
          qualityScore: plan.validation.qualityScore,
          qualityBand: plan.validation.qualityBand,
          qualityChecks: (plan.validation.qualityChecks || []).slice(0, 5).map(sanitizeUserFacingStatus),
        },
        {status: 422},
      );
    }

    const compareLeftTitleValue = readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left';
    const compareRightTitleValue = readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right';
    const captionStyleValue = readString(body.captionStyle) || 'Shorts Karaoke';
    const captionPreset = getSubtitlePreset(captionStyleValue);
    const captionBackgroundColorValue = readString(body.captionBackgroundColor);

    const music = selectBackgroundMusic({
      topicTitle: topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName),
      transcript: renderWindow.transcript,
    });
    const styleLock = createPremiumStyleLock({
      topicTitle: topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName),
      transcript: renderWindow.transcript,
      templateName,
      mode,
    });
    const inputProps: Record<string, unknown> = {
      ...((mode as string) === 'autoCaption'
        ? { topicTitle: plan.renderProps?.topicTitle, captions: plan.renderProps?.captions }
        : (plan.renderProps || {})),
      mediaSrc: planningMedia.mediaUrl,
      ...(mode === 'compare'
        ? await (async () => {
            const finalCaptions = previewCaptions
              ? previewCaptions
                  .map((caption) => ({
                    start: Math.max(0, Number(caption.start)),
                    end: Math.min(renderWindow.durationSeconds, Number(caption.end)),
                    text: cleanTextForRender(String(caption.text), 100),
                    words: Array.isArray(caption.words) ? caption.words : undefined,
                  }))
                  .filter((caption) => Number.isFinite(caption.start) && Number.isFinite(caption.end) && caption.end > caption.start && caption.text)
              : buildCompareCaptionsFromGroq(renderWindow);
            const rawOverlayTimeline = previewOverlayTimeline
              ? previewOverlayTimeline.map((item: unknown, index: number) => {
                  const overlay = item && typeof item === 'object' ? item as Record<string, unknown> : {};
                  const start = Number(overlay.start ?? finalCaptions[index]?.start ?? 0);
                  const id = readString(overlay.id) || `compare-pose-${index + 1}`;
                  const previewSticker = previewStickerOverrides.get(id);
                  return {
                    id,
                    start,
                    end: Number(overlay.end ?? finalCaptions[index]?.end ?? (start + 2.5)),
                    text: readString(overlay.text || overlay.body || finalCaptions[index]?.text),
                    body: readString(overlay.body || overlay.text || finalCaptions[index]?.text),
                    title: readString(overlay.title),
                    stickerPose: readString(previewSticker?.pose || overlay.stickerPose || overlay.pose) || undefined,
                    pose: readString(previewSticker?.pose || overlay.pose || overlay.stickerPose) || undefined,
                  };
                })
              : plan.renderProps?.overlayTimeline;
            const finalOverlayTimeline = stabilizeCompareOverlayTimeline(
              Array.isArray(rawOverlayTimeline) ? rawOverlayTimeline : [],
              finalCaptions,
              renderWindow.durationSeconds,
              compareLeftTitleValue,
              compareRightTitleValue,
            );

            const hasApprovedPreviewTimeline = Boolean(previewCaptions?.length || previewOverlayTimeline?.length || previewStickers?.length);
            const plannedOverlayTimeline = hasApprovedPreviewTimeline
              ? finalOverlayTimeline
              : applyStickerPlanToOverlays(
                  finalOverlayTimeline,
                  (await planCompareStickers({
                    transcript: renderWindow.transcript,
                    segments: finalCaptions.map((c) => ({start: c.start, end: c.end, text: c.text})),
                    leftTitle: compareLeftTitleValue,
                    rightTitle: compareRightTitleValue,
                    durationSeconds: renderWindow.durationSeconds,
                  })).plan,
                );
            console.log('[COMPARE_STICKER_PLANNER]', {
              source: hasApprovedPreviewTimeline ? 'preview-approved' : 'fallback',
              overlayCount: plannedOverlayTimeline.length,
            });

            return {
            audioUrl: planningMedia.mediaUrl,
            mediaUrl: planningMedia.mediaUrl,
            sourceAudioUrl: planningMedia.mediaUrl,
            comparisonImageUrls,
            comparisonImages: comparisonImageUrls,
            stickerStyle: readString(body.stickerStyle) || '3d-presenter-man',
            customStickerSet: body.customStickerSet || undefined,
            stickerScale: Number(body.stickerScale) || 1,
            stickerOffsetX: Number(body.stickerOffsetX) || 0,
            stickerOffsetY: Number(body.stickerOffsetY) || 0,
            creatorHandle: readString(body.creatorHandle || body.handle || body.channelName) || '@itnavideo',
            themeId: resolveCompareTheme(readString(body.compareTheme || body.themeId)),
            tone: resolveCompareTone(readString(body.compareTone || body.tone)),
            winner: resolveCompareWinner(readString(body.compareWinner || body.winner)),
            imageStyle: readString(body.compareImageStyle) || 'rounded',
            compareLeftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            compareRightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            leftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            rightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            imageSources: comparisonImageUrls,
            captions: finalCaptions,
            transcriptSegments: finalCaptions,
            overlayTimeline: plannedOverlayTimeline,
            durationSeconds: renderWindow.durationSeconds,
            sourceDurationSeconds: renderWindow.durationSeconds,
          };
          })()
        : {}),
      ...((mode as string) === 'autoCaption'
        ? (() => {
            const autoCaptions = previewCaptions
              ? previewCaptions.map((c) => ({start: Number(c.start), end: Number(c.end), text: String(c.text), words: Array.isArray(c.words) ? c.words : undefined}))
              : buildCompareCaptionsFromGroq(renderWindow);
            const finalCaptions = autoCaptions.length > 0
              ? autoCaptions
              : (plan.renderProps?.captions || []).map((c: any) => ({start: c.start, end: c.end, text: c.text})).filter((c: any) => c.text);

            // Pre-compute beat energy timeline from Groq word timestamps
            const energyWords = (renderWindow.words || [])
              .filter((w: any) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
              .map((w: any) => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) }));
            const durationSec = renderWindow.durationSeconds || transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS;
            const energyTimeline = buildEnergyTimeline(energyWords, durationSec, 30);
            const beatPeakFrames = findBeatPeaks(energyTimeline, 0.65, 8);

            return {
              captions: finalCaptions,
              subtitleChunks: finalCaptions,
              transcriptSegments: renderWindow.segments || [],
              transcript: renderWindow.transcript,
              sourceScript: renderWindow.transcript,
              backgroundMusic: false,
              backgroundMusicSrc: '',
              durationSeconds: durationSec,
              overlayTimeline: [],
              assetTimeline: [],
              energyTimeline,
              beatPeakFrames,
            };
          })()
        : {}),
      ...(mode === 'whiteboardVideo'
        ? await (async () => {
            const wbCaptions = buildCompareCaptionsFromGroq(renderWindow);
            const wbBoard = resolveWhiteboardBoard(readString(body.whiteboardBoard));
            const activeTranscript = readString(body.editedTranscript) || readString(body.customTranscript) || renderWindow.transcript;
            const wbPlan = await planWhiteboardVideo({
              transcript: activeTranscript,
              segments: wbCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              durationSeconds: renderWindow.durationSeconds,
              topicTitle: topicTitle || undefined,
              boardStyle: wbBoard,
            });
            console.log('[WHITEBOARD_PLANNER]', { source: wbPlan.source, title: wbPlan.title, pointCount: wbPlan.points.length, board: wbBoard });
            return {
              title: wbPlan.title,
              titleColor: wbPlan.titleColor,
              layoutType: wbPlan.layoutType,
              language: wbPlan.language,
              direction: wbPlan.direction,
              points: wbPlan.points,
              tableRows: wbPlan.tableRows,
              quiz: wbPlan.quiz,
              conclusion: wbPlan.conclusion,
              conclusionTime: wbPlan.conclusionTime,
              boardStyle: wbBoard,
              captions: [],
              durationSeconds: renderWindow.durationSeconds,
              transcript: activeTranscript,
              soundCues: wbPlan.points.map((p: unknown) => ({ time: (p as { time?: number }).time ?? 0, type: 'paper' as const, volume: 0.35 })),
              overlayTimeline: [],
              assetTimeline: [],
            };
          })()
        : {}),
      ...(mode === 'typographyVideo'
        ? (() => {
            const selectedStyle = readString(body.typographyStyle) || 'dynamic-punch';
            const typoCaptions = buildCompareCaptionsFromGroq(renderWindow);
            const typoPlan = planTypographyVideo({
              transcript: renderWindow.transcript,
              words: (renderWindow.words || []).map((w: any) => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) })),
              segments: typoCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              durationSeconds: renderWindow.durationSeconds,
              typographyStyle: selectedStyle,
            });
            console.log('[TYPOGRAPHY_PLANNER]', { style: selectedStyle, keywordCount: typoPlan.keywords.length, soundCuesCount: typoPlan.soundCues.length });
            return {
              keywords: typoPlan.keywords,
              soundCues: typoPlan.soundCues,
              typographyStyle: selectedStyle,
              captions: typoCaptions,
              showCaptions: body.typographyShowCaptions === true, // Kinetic text is hero
              durationSeconds: renderWindow.durationSeconds,
              transcript: renderWindow.transcript,
              premiumEditing: true,
            };
          })()
        : {}),
      ...(mode === 'facelessVideo' || mode === 'aiVideoGenerator'
        ? await (async () => {
            const facelessCaptions = buildCompareCaptionsFromGroq(renderWindow);
            const transcriptChunks = (renderWindow.segments || []).map((seg: any) => ({
              text: String(seg.text || ''),
              start: Number(seg.start || 0),
              end: Number(seg.end || 0),
            })).filter((c: any) => c.text && c.end > c.start);

            const headingFont = readString(body.headingFont) || 'Montserrat';
            const subheadingFont = readString(body.subheadingFont) || 'Plus Jakarta Sans';
            const bodyFont = readString(body.bodyFont) || readString(body.typographyFont) || 'Inter';
            const backgroundTheme = readString(body.backgroundTheme) || readString(body.selectedBackgroundTheme) || 'studio-white';
            const customBgUrl = readString(body.customBgUrl || body.customBackgroundUrl || body.backgroundUrl) || '';
            const requestedAssetMode = readString(body.assetMode);
            const assetMode: 'library' | 'upload' | 'mix' = requestedAssetMode === 'upload'
              ? 'upload'
              : requestedAssetMode === 'mix' ? 'mix' : 'library';
            const visualArtStyle = readString(body.visualArtStyle);
            const selectedVisualStyle: 'realistic' | '3d' | '2d' = visualArtStyle === '2d' || visualArtStyle === '3d'
              ? visualArtStyle
              : 'realistic';
            if (assetMode === 'upload' && uploadedImageUrls.length === 0) {
              throw new Error('Uploaded Images mode requires at least one image.');
            }
            const videoTitle = topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName) || 'Faceless Video';

            const blueprint = await generateStructuredSceneBlueprint(
              transcriptChunks.length ? transcriptChunks : [{ text: renderWindow.transcript, start: 0, end: renderWindow.durationSeconds }],
              { title: videoTitle, headingFont, bodyFont, backgroundTheme }
            );

            // Step 3.5: AI Visual Asset Selection via Curated Cloudinary ChatGPT Library
            // Bypasses external stock APIs (Pexels/Pixabay/Google) in favor of high-quality custom visuals
            const targetAspectRatio: '16:9' | '9:16' =
              body.aspectRatio === '9:16' || composition.includes('VERTICAL') ? '9:16' : '16:9';

            const plannedLibraryImages = assetMode === 'upload'
              ? {}
              : await planImagesFromLibraryForScenes(blueprint.scenes, {
                  aspectRatio: targetAspectRatio,
                  visualStyle: selectedVisualStyle,
                  minimumScore: 12,
                });
            const styleFolder = `/images/${selectedVisualStyle}/`;
            const curatedStyleUrls = assetMode === 'upload'
              ? []
              : readUnifiedAssets()
                  .filter((asset) => asset.type === 'image' && asset.safeToUse && asset.src.toLowerCase().includes(styleFolder))
                  .map((asset) => asset.src);
            const userUploadedAssets = assetMode === 'library' ? [] : uploadedImageUrls.filter(Boolean);
            userUploadedAssets.sort((a, b) => {
              const getCleanName = (url: string) => {
                try {
                  const pathWithoutQuery = url.split('?')[0];
                  return decodeURIComponent(pathWithoutQuery.split('/').pop() || url);
                } catch {
                  return url;
                }
              };
              return getCleanName(a).localeCompare(getCleanName(b), undefined, { numeric: true, sensitivity: 'base' });
            });
            const uploadedCandidates = userUploadedAssets.map((url, i) => {
              const cleanFileName = (() => {
                try {
                  const p = url.split('?')[0];
                  return decodeURIComponent(p.split('/').pop() || `uploaded_image_${i}`);
                } catch {
                  return `uploaded_image_${i}`;
                }
              })();
              return {
                key: `uploaded_image_${i}`,
                url,
                fileName: cleanFileName,
              };
            });
            const semanticallyMappedUploads = userUploadedAssets.length > 0
              ? smartMatchUploadedImagesToScenes(blueprint.scenes, uploadedCandidates)
              : {};
            const mappedBrollUrls: Record<number, string> = {};
            const userImageCount = userUploadedAssets.length;
            const mixInterval = userImageCount > 0
              ? Math.max(1, Math.floor(blueprint.scenes.length / userImageCount))
              : 0;

            blueprint.scenes.forEach((scene, index) => {
              const userUrl = semanticallyMappedUploads[scene.sceneNumber];
              const isUserScene = assetMode === 'upload'
                || (assetMode === 'mix' && Boolean(userUrl) && index % mixInterval === 0);
              if (isUserScene && userUrl) {
                mappedBrollUrls[scene.sceneNumber] = userUrl;
                return;
              }

              if (assetMode !== 'upload') {
                const libraryUrl = plannedLibraryImages[scene.sceneNumber]
                  || curatedStyleUrls[index % Math.max(1, curatedStyleUrls.length)];
                if (libraryUrl) mappedBrollUrls[scene.sceneNumber] = libraryUrl;
              }
            });

            const pexelsQueries = assetMode === 'upload' ? [] : blueprint.scenes.flatMap((scene) => {
              if (mappedBrollUrls[scene.sceneNumber]) return [];
              const query = [scene.visualIntent, scene.brollSearchQuery, scene.visualAssetRequirement, scene.heading, selectedVisualStyle, 'photo']
                .filter(Boolean)
                .join(' ');
              return [{ sceneNumber: scene.sceneNumber, query }];
            });
            const pexelsFallbacks = await searchPexelsFallbackImages(pexelsQueries, {
              orientation: targetAspectRatio === '9:16' ? 'portrait' : 'landscape',
              maxSearches: 24,
              concurrency: 4,
            });
            for (const [sceneNumber, photo] of pexelsFallbacks) {
              mappedBrollUrls[sceneNumber] = photo.imageUrl;
            }

            const sfxEvents = generateSFXEvents(blueprint.scenes, 30, renderWindow.durationSeconds);
            const chapterEvents = detectChaptersFromTranscript(transcriptChunks, 30);

            console.log('[FACELESS_VIDEO_PLANNER]', {
              totalScenes: blueprint.totalScenes,
              userAssetsCount: userUploadedAssets.length,
              mappedBrollCount: Object.keys(mappedBrollUrls).length,
              customBgUrl: customBgUrl ? 'present' : 'none',
              sfxCount: sfxEvents.length,
              chapterCount: chapterEvents.length,
            });

            return {
              title: videoTitle,
              headingFont,
              subheadingFont,
              typographyFont: bodyFont,
              backgroundTheme,
              customBgUrl,
              sceneBlueprint: blueprint.scenes,
              brollUrls: mappedBrollUrls,
              sfxEvents,
              showCaptions: body.showCaptions !== false && body.enableCaptions !== false,
              captions: (body.showCaptions !== false && body.enableCaptions !== false) ? facelessCaptions : [],
              subtitleChunks: (body.showCaptions !== false && body.enableCaptions !== false) ? facelessCaptions : [],
              words: renderWindow.words,
              segments: renderWindow.segments,
              transcript: renderWindow.transcript,
              durationSeconds: renderWindow.durationSeconds,
              audioSrc: planningMedia.mediaUrl,
              audioUrl: planningMedia.mediaUrl,
              mediaUrl: planningMedia.mediaUrl,
              mediaType: 'audio' as const,
            };
          })()
        : {}),
      mediaType,
      mediaFit: templateConfig.mediaFit,
      captionStyle: captionStyleValue,
      captionPosition: readString(body.captionPosition) || 'bottom',
      fontFamily: readString(body.captionFontFamily || body.fontFamily) || (subtitleLang ? getFontForLanguage(subtitleLang) : captionPreset?.fontFamily) || undefined,
      fontSize: readString(body.captionFontSize || body.fontSize) || captionPreset?.fontSize || 'large',
      subtitleOutputLanguage: subtitleLang || '',
      textColor: readString(body.captionTextColor) || captionPreset?.textColor || '#ffffff',
      highlightColor: readString(body.captionHighlightColor) || captionPreset?.highlightColor || '#facc15',
      backgroundColor: captionBackgroundColorValue || captionPreset?.backgroundColor || '#18181B',
      showBackground: typeof body.captionShowBackground === 'boolean'
        ? body.captionShowBackground
        : Boolean(captionBackgroundColorValue || captionPreset?.backgroundColor),
      videoLayout: (mode as string) === 'autoCaption' ? 'fullscreen' : readString(body.videoLayout) || 'fullscreen',
      watermark: !isFounder && (!access?.activePaidPlan || Boolean(access?.watermark)),
      progressStyle: (mode as string) === 'autoCaption' ? 'none' : readString(body.progressStyle) || 'glow',
      wordClickSound: (mode as string) === 'autoCaption' ? false : body.wordClickSound !== false,
      mediaTrimStartSeconds: (mode as string) === 'autoCaption' ? 0 : renderWindow.trimStartSeconds,
      sourceDurationSeconds: requestedDurationSeconds || transcription.durationSeconds || renderWindow.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
      durationSeconds: requestedDurationSeconds || renderWindow.durationSeconds || transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
      renderWindowSeconds: requestedDurationSeconds || renderWindow.durationSeconds || transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
      renderWindowSource: renderWindow.source,
      planningMediaSource: planningMedia.clipped ? 'first-60s-clip' : 'original-upload',
      topicTitle: plan.renderProps?.topicTitle || topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName),
      explanationImageUrl: explanationImageUrl || undefined,
      bottomImageUrl: explanationImageUrl || undefined,
      visualImageUrl: explanationImageUrl || undefined,
      uploadedImageUrl: explanationImageUrl || undefined,
      design: plan.renderProps?.design,
      templateName,
      template: templateName,
      compositionId: composition,
      // Compare and Typography preserve the uploaded voiceover without generated background music.
      ...(mode === 'typographyVideo' || mode === 'compare'
        ? {backgroundMusic: false, backgroundMusicSrc: ''}
        : {
            backgroundMusic: (mode as string) === 'autoCaption' ? false : plan.renderProps?.backgroundMusic !== false,
            backgroundMusicMood: readString(plan.renderProps?.backgroundMusicMood) || music.mood,
            backgroundMusicSrc: readString(plan.renderProps?.backgroundMusicSrc) || music.src,
            backgroundMusicVolume: Number.isFinite(Number(plan.renderProps?.backgroundMusicVolume))
              ? Math.min(0.04, Math.max(0.012, Number(plan.renderProps?.backgroundMusicVolume)))
              : music.volume,
          }),
      sourceAudioVolume: 1.35,
      subtitleLanguagePolicy: SUBTITLE_LANGUAGE_POLICY,
      backgroundMusicCategory: readString(plan.renderProps?.backgroundMusicCategory) || music.category,
      premiumEditing: (mode as string) !== 'autoCaption',
      styleLock: (mode as string) === 'autoCaption' ? undefined : (styleLock ? {
        ...styleLock,
        ambience: styleLock.ambience?.src?.startsWith('http') ? styleLock.ambience : undefined,
      } : undefined),

      ...(mode === 'compare'
        ? {
            transcript: renderWindow.transcript,
            sourceScript: renderWindow.transcript,
          }
        : {}),
    };
    if ((mode as string) !== 'autoCaption' && (!Array.isArray(inputProps.soundCues) || !inputProps.soundCues.length)) {
      inputProps.soundCues = createPremiumSoundCues({
        styleLock,
        templateName,
        durationSeconds: Number(inputProps.durationSeconds) || renderWindow.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
        timeline: Array.isArray(inputProps.overlayTimeline) ? inputProps.overlayTimeline as Array<{start?: number; end?: number; text?: string; type?: string}> : [],
        captions: Array.isArray(inputProps.captions) ? inputProps.captions as Array<{start?: number; end?: number; text?: string; type?: string}> : [],
      });
    }
    const imagePreflight = await repairRenderImageSources(inputProps, {
      templateName,
      userId,
      mediaKey,
      topicTitle: readString(inputProps.topicTitle),
    });
    const preflight = validateBeforeRender({inputProps: imagePreflight.inputProps, templateName, composition, mediaType});
    if (preflight) {
      const userEmail = readString(body.userEmail || body.email);
      const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: preflight.reasonCode,
          error: isFounder ? preflight.message : sanitizeUserFacingStatus(preflight.message),
          ...(isFounder ? {
            _founderDiagnostics: {
              step: 'preflight_validation',
              reason: preflight.message,
              reasonCode: preflight.reasonCode,
              mode,
              templateName,
              compositionId: composition,
              httpStatus: 422,
            },
          } : {}),
        },
        {status: 422},
      );
    }

    const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${slugify(readString(imagePreflight.inputProps.topicTitle) || fileName || 'reel')}.mp4`;

    // Debug: log caption data being sent to Lambda
    if ((mode as string) === 'autoCaption' || (mode as string) === 'youtubeSubtitleGenerator') {
      const captionsArr = Array.isArray(imagePreflight.inputProps.captions) ? imagePreflight.inputProps.captions as any[] : [];
      console.log('[AUTO_CAPTION_GENERATOR] Render props debug:', {
        captionCount: captionsArr.length,
        firstCaption: captionsArr[0] || 'EMPTY',
        lastCaption: captionsArr[captionsArr.length - 1] || 'EMPTY',
        hasSubtitleChunks: Array.isArray(imagePreflight.inputProps.subtitleChunks),
        mediaSrc: typeof imagePreflight.inputProps.mediaSrc === 'string' ? imagePreflight.inputProps.mediaSrc.slice(0, 60) : 'MISSING',
        captionStyle: imagePreflight.inputProps.captionStyle,
        durationSeconds: imagePreflight.inputProps.durationSeconds,
        mediaTrimStartSeconds: imagePreflight.inputProps.mediaTrimStartSeconds,
      });
    }

    const finalReelDuration = Number(imagePreflight.inputProps.durationSeconds) || renderWindow?.durationSeconds || 15;
    const finalReelFrames = Math.max(30, Math.ceil(finalReelDuration * 30));

    const renderRequest: LambdaRenderRequest = {
      region: config.region,
      functionName: config.functionName,
      serveUrl: config.serveUrl,
      composition,
      codec: 'h264',
      audioCodec: 'aac',
      inputProps: imagePreflight.inputProps,
      frameRange: [0, finalReelFrames - 1],
      outName,
      privacy: 'private',
      deleteAfter: '3-days',
      overwrite: true,
      concurrency: config.concurrency,
      maxRetries: 3,
      downloadBehavior: {
        type: 'download',
        fileName: (mode as string) === 'autoCaption' ? 'itnavideo-auto-caption-reel.mp4' : mode === 'typographyVideo' ? 'itnavideo-typography-reel.mp4' : 'itnavideo-reel.mp4',
      },
      isProduction: true,
      logLevel: 'info',
    };
    const render = await startRenderWithCapacityRetry(renderRequest);
    await reserveAcceptedRenderUsage({
      userId,
      renderId: render.renderId,
      creditUnits: requestedCreditUnits ?? calculateRenderCreditUnits(mode, {durationSeconds: requestedDurationSeconds}),
      mode,
      title: readString(imagePreflight.inputProps.topicTitle) || titleFromFile(fileName) || 'Itnavideo reel',
    });

    return NextResponse.json({
      ok: true,
      status: 'rendering',
      renderId: render.renderId,
      bucketName: render.bucketName,
      outName,
      mediaKey,
      planningMediaKey: planningMedia.mediaKey,
      transcriptionMediaKey: planningMedia.transcriptionMediaKey,
      reelTitle: imagePreflight.inputProps.topicTitle,
      design: imagePreflight.inputProps.design,
      mode,
      templateName,
      transcriptSource: transcription.source === 'groq' ? 'primary' : 'fallback',
      transcriptWarning: transcription.warning,
      mediaTrimStartSeconds: imagePreflight.inputProps.mediaTrimStartSeconds ?? renderWindow.trimStartSeconds,
      renderWindowSeconds: imagePreflight.inputProps.renderWindowSeconds ?? renderWindow.durationSeconds,
      renderWindowSource: renderWindow.source,
      planningMediaSource: planningMedia.clipped ? 'first-60s-clip' : 'original-upload',
      access,
      creditUnits: requestedCreditUnits ?? calculateRenderCreditUnits(mode, {durationSeconds: requestedDurationSeconds}),
      creditCost: formatCreditUnits(requestedCreditUnits ?? calculateRenderCreditUnits(mode, {durationSeconds: requestedDurationSeconds})),
      retentionHours: 48,
      note: 'Render started. Poll /api/reels/jobs/status for progress.',
      _renderVersion: 'v2026-06-19-subtitleRenderer',
      ...(isFounderEmail(readString(body.userEmail || body.email)) || isFounderUser(userId) ? {
        _founderDebug: {
          captionCount: Array.isArray(imagePreflight.inputProps.captions) ? (imagePreflight.inputProps.captions as any[]).length : 0,
          captionSample: Array.isArray(imagePreflight.inputProps.captions) ? (imagePreflight.inputProps.captions as any[]).slice(0, 3) : [],
          mediaSrc: typeof imagePreflight.inputProps.mediaSrc === 'string' ? imagePreflight.inputProps.mediaSrc.slice(0, 80) + '...' : 'missing',
          mediaTrimStartSeconds: imagePreflight.inputProps.mediaTrimStartSeconds,
          durationSeconds: imagePreflight.inputProps.durationSeconds,
          sourceDurationSeconds: imagePreflight.inputProps.sourceDurationSeconds,
          compositionId: composition,
          selectedLanguage: subtitleLang || 'auto-source',
          transcriptLanguageHint: transcription.languageHint,
          translationApplied: 'not-needed',
          captionFirstText: Array.isArray(imagePreflight.inputProps.captions) ? (imagePreflight.inputProps.captions as any[])[0]?.text?.slice(0, 50) : 'none',
        },
      } : {}),
      ...(process.env.NODE_ENV !== 'production'
        ? {
            planner: {
              provider: plan.provider,
              model: plan.model,
              qualityScore: plan.validation.qualityScore,
              overlays: plan.renderProps?.overlayTimeline,
            },
          }
        : {}),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Could not start render job.';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    markTiming('failed_at_ms');
    console.error('Render job failed:', { mode, templateName, composition, error: errorMessage, timings });

    const userEmail = readString(body.userEmail || body.email);
    const isFounder = isFounderEmail(userEmail) || isFounderUser(userId);

    return NextResponse.json(
      {
        ok: false,
        error: isFounder ? errorMessage : sanitizeUserFacingStatus(errorMessage),
        ...(isFounder ? {
          _founderDiagnostics: {
            step: 'render_start',
            reason: errorMessage,
            errorName,
            mode,
            templateName,
            compositionId: composition,
            httpStatus: 500,
            detail: errorMessage,
            timings,
            raw: error instanceof Error ? error.stack?.split('\n').slice(0, 4).join(' | ') : String(error),
          },
        } : {}),
      },
      {status: 500},
    );
  }
}

type RenderImageRepairContext = {
  templateName: ReelTemplateName;
  userId: string;
  mediaKey: string;
  topicTitle?: string;
};

type RenderImageReference = {
  path: string;
  sceneId?: string;
  assetId?: string;
  s3Key?: string;
  url: string;
  set: (value: string) => void;
  repairAsFrame?: (reason: string) => void;
};

async function repairRenderImageSources(inputProps: Record<string, unknown>, context: RenderImageRepairContext) {
  const fallback = getRenderImageFallback();
  const refs = collectRenderImageReferences(inputProps);
  const failures: Array<{path: string; sceneId?: string; assetId?: string; s3Key?: string; url: string; reason: string; fallback: string}> = [];
  const localS3UploadCache = new Map<string, string>();

  for (const ref of refs) {
    const rawUrl = ref.url;
    if (!rawUrl) {
      ref.set(fallback.src);
      continue;
    }

    // If local asset path, upload to S3 so AWS Lambda can fetch it
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('data:')) {
      if (localS3UploadCache.has(rawUrl)) {
        ref.set(localS3UploadCache.get(rawUrl)!);
        continue;
      }
      const localResult = await uploadLocalAssetToS3(rawUrl, context.userId);
      if (localResult.ok && localResult.s3Url) {
        localS3UploadCache.set(rawUrl, localResult.s3Url);
        ref.set(localResult.s3Url);
        continue;
      }
      ref.set(fallback.src);
      failures.push({
        path: ref.path,
        sceneId: ref.sceneId,
        assetId: ref.assetId,
        s3Key: ref.s3Key || extractS3KeyFromUrl(ref.url),
        url: redactSignedUrl(ref.url),
        reason: 'reason' in localResult ? (localResult as any).reason : 'LOCAL_ASSET_S3_UPLOAD_FAILED',
        fallback: fallback.src,
      });
      continue;
    }

    const validation = await validateRenderableImageSource(ref.url);
    if (validation.ok) continue;
    ref.set(fallback.src);
    failures.push({
      path: ref.path,
      sceneId: ref.sceneId,
      assetId: ref.assetId,
      s3Key: ref.s3Key || extractS3KeyFromUrl(ref.url),
      url: redactSignedUrl(ref.url),
      reason: validation.reason,
      fallback: fallback.src,
    });
  }

  if (failures.length) {
    console.error('Render image preflight repaired failed sources', {
      templateName: context.templateName,
      userId: sanitizeSegment(context.userId),
      mediaKey: context.mediaKey,
      topicTitle: context.topicTitle,
      failures,
    });
  }

  return {inputProps, failures};
}

async function uploadLocalAssetToS3(src: string, userId: string): Promise<{ok: true; s3Url: string} | {ok: false; reason: string}> {
  try {
    const cleanSrc = src.replace(/^\/+/, '');
    const possible = [
      path.join(process.cwd(), cleanSrc),
      path.join(process.cwd(), 'public', cleanSrc),
      path.join(process.cwd(), 'public', decodeURIComponent(cleanSrc)),
    ];
    const diskPath = possible.find((f) => fs.existsSync(f));
    if (!diskPath) {
      return {ok: false, reason: 'LOCAL_IMAGE_FILE_NOT_FOUND'};
    }
    const fileBytes = await fs.promises.readFile(diskPath);
    const ext = path.extname(diskPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    const safeBasename = path.basename(diskPath).replace(/[^a-zA-Z0-9.-]/g, '_');
    const { key: s3Key } = await uploadTemporaryMediaObject({
      body: new Uint8Array(fileBytes),
      contentType,
      fileName: safeBasename,
      mode: 'image',
      userId,
      purpose: 'render-stock-asset',
    });
    const signedUrl = readString(await createReadUrl(s3Key));
    if (signedUrl) {
      return {ok: true, s3Url: signedUrl};
    }
    return {ok: false, reason: 'S3_SIGNED_URL_FAILED'};
  } catch (err) {
    return {ok: false, reason: `LOCAL_UPLOAD_FAILED_${sanitizeSegment(err instanceof Error ? err.message : 'unknown')}`};
  }
}

function collectRenderImageReferences(inputProps: Record<string, unknown>) {
  const refs: RenderImageReference[] = [];
  const assetTimeline = Array.isArray(inputProps.assetTimeline) ? inputProps.assetTimeline : [];
  assetTimeline.forEach((item, index) => {
    if (!isRecord(item)) return;
    const kind = readString(item.kind);
    if (kind === 'frame') return;
    if (!readString(item.src)) {
      convertAssetTimelineItemToFrame(item, index, 'EMPTY_IMAGE_SRC');
      return;
    }
    refs.push({
      path: `assetTimeline[${index}].src`,
      sceneId: readString(item.overlayId || item.id),
      assetId: readString(item.id),
      s3Key: readString(item.s3Key || item.key),
      url: readString(item.src),
      set: (value) => {
        item.src = value;
      },
      repairAsFrame: (reason) => convertAssetTimelineItemToFrame(item, index, reason),
    });
  });

  const overlayTimeline = Array.isArray(inputProps.overlayTimeline) ? inputProps.overlayTimeline : [];
  overlayTimeline.forEach((item, index) => {
    if (!isRecord(item) || !isRecord(item.primaryVisual)) return;
    const primaryVisual = item.primaryVisual;
    const type = readString(primaryVisual.type);
    if (type && type !== 'image') return;
    const assetId = readString(primaryVisual.assetId);
    if (!assetId && !type) return;
    refs.push({
      path: `overlayTimeline[${index}].primaryVisual.assetId`,
      sceneId: readString(item.id),
      assetId,
      s3Key: readString(primaryVisual.s3Key || primaryVisual.key),
      url: assetId,
      set: (value) => {
        primaryVisual.assetId = value;
        primaryVisual.type = 'image';
      },
      repairAsFrame: () => {
        primaryVisual.assetId = '';
        primaryVisual.type = 'none';
      },
    });
  });

  const externalVisualAssets = Array.isArray(inputProps.externalVisualAssets) ? inputProps.externalVisualAssets : [];
  externalVisualAssets.forEach((item, index) => {
    if (!isRecord(item)) return;
    refs.push({
      path: `externalVisualAssets[${index}].src`,
      assetId: readString(item.id),
      s3Key: readString(item.s3Key || item.key),
      url: readString(item.src),
      set: (value) => {
        item.src = value;
      },
    });
  });

  const imageSources = Array.isArray(inputProps.imageSources) ? inputProps.imageSources : [];
  imageSources.forEach((src, index) => {
    refs.push({
      path: `imageSources[${index}]`,
      url: readString(src),
      set: (value) => {
        imageSources[index] = value;
      },
    });
  });

  const imageScenes = Array.isArray(inputProps.imageScenes) ? inputProps.imageScenes : [];
  imageScenes.forEach((item, index) => {
    if (!isRecord(item)) return;
    refs.push({
      path: `imageScenes[${index}].imageSrc`,
      sceneId: readString(item.id),
      assetId: readString(item.imageId),
      s3Key: readString(item.s3Key || item.key),
      url: readString(item.imageSrc),
      set: (value) => {
        item.imageSrc = value;
      },
    });
  });

  const scenes = Array.isArray(inputProps.scenes) ? inputProps.scenes : [];
  scenes.forEach((item, index) => {
    if (!isRecord(item)) return;
    const url = readString(item.imageUrl);
    if (!url) return;
    refs.push({
      path: `scenes[${index}].imageUrl`,
      sceneId: readString(item.id),
      url,
      set: (value) => {
        item.imageUrl = value;
      },
    });
  });

  // Direct top-level single image props across modes (compare, promo, etc.)
  ['leftImageUrl', 'rightImageUrl', 'thumbnailUrl', 'backgroundImageUrl', 'customImageUrl', 'characterImageUrl'].forEach((propKey) => {
    const rawVal = readString(inputProps[propKey]);
    if (rawVal) {
      refs.push({
        path: propKey,
        url: rawVal,
        set: (value) => {
          inputProps[propKey] = value;
        },
      });
    }
  });

  return refs;
}

function convertAssetTimelineItemToFrame(item: Record<string, unknown>, index: number, reason: string) {
  const source = [
    item.frameText,
    item.title,
    item.assetBrief,
    item.category,
    item.overlayId,
  ].map(readString).filter(Boolean).join(' ');
  item.kind = 'frame';
  item.src = '';
  item.title = readString(item.title) || buildRenderFrameKeyword(source || `Scene ${index + 1}`);
  item.frameText = readString(item.frameText) || buildRenderFrameKeyword(source || readString(item.title) || `Scene ${index + 1}`);
  item.frameLabel = readString(item.frameLabel) || 'KEY POINT';
  item.frameType = readString(item.frameType) || 'InfoCard';
  item.frameReason = reason === 'EMPTY_IMAGE_SRC' ? 'missing-image' : 'low-confidence-image';
  item.tags = Array.isArray(item.tags)
    ? uniqueStrings([...item.tags.map(readString), 'remotion-frame', reason].filter(Boolean))
    : ['remotion-frame', reason];
}

function buildRenderFrameKeyword(value: string) {
  const stopWords = new Set(['scene', 'image', 'visual', 'asset', 'selected', 'bottom', 'layer', 'the', 'and', 'for', 'with']);
  const words = String(value || '')
    .replace(/[^a-zA-Z0-9₹$% ]+/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 || /^[₹$%]?\d/.test(word))
    .filter((word) => !stopWords.has(word.toLowerCase()));
  return (words.slice(0, 2).join(' ') || 'KEY POINT').toUpperCase();
}

async function validateRenderableImageSource(src: string): Promise<{ok: true} | {ok: false; reason: string}> {
  const value = readString(src);
  if (!value) return {ok: false, reason: 'EMPTY_IMAGE_SRC'};
  if (/^data:image\//i.test(value)) return {ok: true};
  if (/^blob:/i.test(value)) return {ok: false, reason: 'BLOB_URL_NOT_RENDERABLE'};
  if (/^https?:\/\//i.test(value)) return validateRemoteImageUrl(value);
  return validateLocalImageSource(value);
}

async function validateRemoteImageUrl(url: string): Promise<{ok: true} | {ok: false; reason: string}> {
  if (/cloudinary\.com/i.test(url) || /amazonaws\.com/i.test(url)) {
    return {ok: true};
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RENDER_IMAGE_URL_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {Range: 'bytes=0-0'},
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) return {ok: false, reason: `REMOTE_IMAGE_HTTP_${response.status}`};
    const contentType = response.headers.get('content-type') || '';
    if (contentType && !/^image\//i.test(contentType) && !/octet-stream/i.test(contentType)) {
      return {ok: false, reason: `REMOTE_IMAGE_BAD_CONTENT_TYPE_${contentType.slice(0, 48)}`};
    }
    return {ok: true};
  } catch (error) {
    const reason = error instanceof Error && error.name === 'AbortError'
      ? 'REMOTE_IMAGE_TIMEOUT'
      : `REMOTE_IMAGE_FETCH_FAILED_${sanitizeSegment(error instanceof Error ? error.message : 'unknown')}`;
    return {ok: false, reason};
  } finally {
    clearTimeout(timeout);
  }
}

function validateLocalImageSource(src: string): {ok: true} | {ok: false; reason: string} {
  const cleanSrc = src.replace(/^\/+/, '');
  if (!/\.(?:png|jpe?g|webp|avif)$/i.test(cleanSrc)) return {ok: false, reason: 'LOCAL_IMAGE_UNSUPPORTED_EXTENSION'};
  const possible = [
    path.join(process.cwd(), 'public', cleanSrc),
    path.join(process.cwd(), 'public', decodeURIComponent(cleanSrc)),
  ];
  return possible.some((file) => fs.existsSync(file))
    ? {ok: true}
    : {ok: false, reason: 'LOCAL_IMAGE_FILE_MISSING'};
}

function getRenderImageFallback() {
  return {
    src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png',
    title: 'Fallback visual',
  };
}

function extractS3KeyFromUrl(value: string) {
  try {
    const url = new URL(value);
    const pathKey = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    if (/\.s3[.-]/i.test(url.hostname)) return pathKey;
    const [, ...rest] = pathKey.split('/');
    return rest.join('/') || pathKey;
  } catch {
    return '';
  }
}

function redactSignedUrl(value: string) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (/signature|credential|algorithm|expires|security-token|x-amz/i.test(key)) {
        url.searchParams.set(key, 'REDACTED');
      }
    }
    return url.toString();
  } catch {
    return value ? value.slice(0, 220) : '';
  }
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function readLambdaConfig():
  | {ok: true; region: AwsRegion; functionName: string; serveUrl: string; concurrency: number}
  | {ok: false; error: string} {
  const region = readAwsRegion(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION);
  const functionName = clean(process.env.REMOTION_LAMBDA_FUNCTION_NAME);
  const serveUrl = normalizeServeUrl(clean(process.env.REMOTION_LAMBDA_SERVE_URL));
  const configuredConcurrency = Number(process.env.REMOTION_LAMBDA_CONCURRENCY || 12);
  const concurrency = Math.min(30, Math.max(4, Number.isFinite(configuredConcurrency) ? configuredConcurrency : 12));
  if (!functionName || !serveUrl) {
    return {ok: false, error: 'The render system is not deployed yet.'};
  }
  return {ok: true, region, functionName, serveUrl, concurrency};
}

function normalizeServeUrl(value: string) {
  const latestSiteUrl = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';
  if (!value) return latestSiteUrl;
  if (value.includes('itnavideo-video-explainer') || value.includes('apsouth1')) {
    return latestSiteUrl;
  }
  return value.includes('/sites/')
    ? value
    : latestSiteUrl;
}

async function startRenderWithCapacityRetry(request: LambdaRenderRequest) {
  const frameRange = request.frameRange;
  const frameCount = frameRange && Array.isArray(frameRange) && typeof frameRange[0] === 'number' && typeof frameRange[1] === 'number' ? Math.max(30, frameRange[1] - frameRange[0]) : 1800;
  // Calculate optimal concurrency: process ~90-120 frames per worker so each Lambda function finishes in under 10 seconds
  const idealWorkers = Math.max(4, Math.min(24, Math.ceil(frameCount / 100)));
  const baseConcurrency = Math.min(24, Math.max(4, Number(request.concurrency) || idealWorkers));

  // Remotion Lambda forbids passing both framesPerLambda and concurrency together.
  const cleanRequest = {...request};
  delete (cleanRequest as any).framesPerLambda;

  const attempts: LambdaRenderRequest[] = [
    {...cleanRequest, concurrency: baseConcurrency, maxRetries: 3},
    {...cleanRequest, concurrency: Math.max(4, Math.floor(baseConcurrency / 2)), maxRetries: 3},
    {...cleanRequest, concurrency: 4, maxRetries: 3},
  ];
  let lastError: unknown;

  for (let index = 0; index < attempts.length; index += 1) {
    try {
      console.log(`[RENDER_INVOKE_ATTEMPT] Attempt ${index + 1}/${attempts.length}`, {
        concurrency: attempts[index].concurrency,
        maxRetries: attempts[index].maxRetries,
        composition: attempts[index].composition,
        frameCount,
      });
      return await renderMediaOnLambda(attempts[index]);
    } catch (error) {
      lastError = error;
      console.warn(`[RENDER_INVOKE_ERROR] Attempt ${index + 1} failed:`, error instanceof Error ? error.message : error);
      if (!isTemporaryRenderCapacityError(error) || index === attempts.length - 1) {
        throw error;
      }
      // Progressive backoff: 3s, 6s
      await sleep([3000, 6000][index] ?? 6000);
    }
  }

  throw lastError;
}

function isTemporaryRenderCapacityError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /concurrent.*limit|concurrency.*limit|rate exceeded|too many requests|toomanyrequests|limit exceeded|throttl/i.test(message);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function prepareAudioForTranscription(
  mediaKey: string,
  mediaUrl: string,
  fileName: string,
  contentType?: string,
  mediaType?: 'audio' | 'video' | 'image'
) {
  const isAudio = mediaType === 'audio' || /\.(mp3|wav|m4a|aac|flac|ogg)$/i.test(fileName);
  if (isAudio || !mediaKey) {
    return {
      audioUrl: mediaUrl,
      audioFileName: fileName,
      contentType: contentType || 'audio/mpeg',
      mediaType: 'audio' as const,
    };
  }

  return {
    audioUrl: mediaUrl,
    audioFileName: fileName,
    contentType: contentType || 'video/mp4',
    mediaType: 'video' as const,
  };
}

async function preparePlanningMediaForRender({
  mediaUrl,
  fileName,
  contentType,
  mediaType,
  userId,
  maxAllowedSeconds,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
  userId: string;
  maxAllowedSeconds?: number;
}) {
  const maxSeconds = maxAllowedSeconds && maxAllowedSeconds > 0
    ? maxAllowedSeconds
    : readPlanningMediaMaxSeconds();

  // Hardware safety (4GB RAM / slow disk): Zero local FFmpeg or disk downloads.
  // Direct S3 URL passes directly into cloud transcription (Groq/Gemini),
  // and Remotion Lambda trims dynamically via mediaTrimStartSeconds and durationSeconds.
  return {
    mediaUrl,
    fileName,
    contentType,
    transcriptionMediaUrl: mediaUrl,
    transcriptionFileName: fileName,
    transcriptionContentType: contentType,
    mediaKey: undefined,
    transcriptionMediaKey: undefined,
    clipped: false,
    maxSeconds,
  };
}

function readPlanningMediaMaxSeconds() {
  const value = Number(process.env.PLANNING_MEDIA_MAX_SECONDS || process.env.TRANSCRIPTION_MAX_SECONDS || DEFAULT_PLANNING_MEDIA_SECONDS);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(1, Math.min(MAX_RENDER_WINDOW_SECONDS, Math.round(value)));
}

async function transcribeForPlanning({
  mediaUrl,
  fileName,
  contentType,
  mediaType,
  language,
  outputLanguage,
  maxSeconds,
  skipMediaPreparation,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
  language?: string;
  outputLanguage?: string;
  maxSeconds?: number;
  skipMediaPreparation?: boolean;
}) {
  let primaryWarning = '';
  try {
    const groqStart = Date.now();
    const result = await transcribeMediaUrlWithGroq({mediaUrl, fileName, contentType, language, maxSeconds, skipMediaPreparation});
    console.log('[TIMING] Groq transcription:', Date.now() - groqStart, 'ms | hasTranscript:', Boolean(result.transcript));
    if (result.transcript) {
      if (!outputLanguage) {
        return {...result, source: 'groq' as const};
      }
      const translateStart = Date.now();
      const translated = await repairTranscriptionToLanguage({
        ...result,
        source: 'groq' as const,
      }, outputLanguage);
      console.log('[TIMING] Translation to', outputLanguage, ':', Date.now() - translateStart, 'ms | applied:', translated.languageHint === outputLanguage);
      return translated;
    }
    primaryWarning = result.warning || 'Primary transcription returned an empty result.';
  } catch (error) {
    primaryWarning = error instanceof Error ? error.message : 'Primary transcription failed.';
    console.error('Groq transcription failed or rate-limited', {
      message: sanitizeUserFacingStatus(primaryWarning),
      contentType,
      mediaType,
    });
  }

  // Fallback to free Gemini Transcription Engine if Groq fails / rate-limits (429)
  try {
    console.log('[PIPELINE] Groq transcription unavailable/empty. Initiating Gemini audio transcription fallback...');
    const geminiStart = Date.now();
    const geminiResult = await transcribeMediaWithGeminiFallback({
      mediaUrl,
      fileName,
      contentType,
      maxSeconds,
    });

    if (geminiResult && geminiResult.transcript) {
      console.log(
        '[TIMING] Gemini fallback transcription succeeded in',
        Date.now() - geminiStart,
        'ms | words:',
        geminiResult.words?.length,
        '| segments:',
        geminiResult.segments?.length
      );
      if (!outputLanguage) {
        return {...geminiResult, source: 'gemini' as const};
      }
      return repairTranscriptionToLanguage(
        {...geminiResult, source: 'gemini' as const},
        outputLanguage
      );
    }
  } catch (geminiError) {
    console.error('[PIPELINE] Gemini transcription fallback also failed:', geminiError);
  }

  return {
    transcript: '',
    durationSeconds: 0,
    source: 'failed' as const,
    model: process.env.GROQ_TRANSCRIPTION_MODEL || 'whisper-large-v3-turbo',
    languageHint: undefined,
    warning: sanitizeUserFacingStatus(
      `Audio transcription failed: ${primaryWarning || 'No speech detected or audio quality too low.'}`,
    ),
  };
}

type PlanningTranscription = Awaited<ReturnType<typeof transcribeForPlanning>>;

async function repairTranscriptionEnglishIfNeeded<T extends GroqLikeTranscription>(transcription: T): Promise<T> {
  const combined = [
    transcription.transcript,
    ...(transcription.segments || []).map((segment) => segment.text),
  ].join(' ');
  if (!combined || (!hasHindiUrduScript(combined) && !hasRomanHinglish(combined))) return transcription;

  // Try Gemini first (free), fallback to OpenAI
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const {GoogleGenAI} = await import('@google/genai');
      const ai = new GoogleGenAI({apiKey: geminiKey});
      const prompt = [
        'Translate this short-form video transcription into clean natural English only.',
        'Preserve exact meaning, names, numbers, official terms, and factual claims.',
        'Do not add scene notes, summaries, headings, timestamps, or extra facts.',
        'Return ONLY valid JSON with keys "transcript" and "segments" (array of {index, text}). Segment count must match input. No markdown.',
        '',
        'CORRECTION DICTIONARY: sip→SIP, emi→EMI, rbi→RBI, nps→NPS, ppf→PPF, pan→PAN, gst→GST, nifty fifty→Nifty 50, demat→Demat, kyc→KYC, ipo→IPO, etf→ETF, upsc→UPSC, ssc→SSC',
        '',
        'INPUT:',
        JSON.stringify({transcript: transcription.transcript, segments: (transcription.segments || []).map((seg, i) => ({index: i, text: seg.text}))}),
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{role: 'user', parts: [{text: prompt}]}],
        config: {temperature: 0.2, maxOutputTokens: 3000},
      });
      const text = (response.text || '').replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const repaired = parseTranslationResponse(text);
      if (repaired?.transcript) {
        const repairedSegments = mergeRepairedSegments(transcription.segments, repaired.segments);
        return {...transcription, transcript: repaired.transcript, segments: repairedSegments, words: undefined, languageHint: 'english', rawTranscript: transcription.rawTranscript || transcription.transcript};
      }
    } catch (err) {
      console.error('[ENGLISH_REPAIR] Gemini failed, trying OpenAI:', err instanceof Error ? err.message : '');
    }
  }

  // Fallback: OpenAI
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {...transcription, warning: [transcription.warning, 'Transcript may contain non-English text.'].filter(Boolean).join(' ')};
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.TRANSCRIPT_ENGLISH_REPAIR_TIMEOUT_MS || 18_000));
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.TRANSCRIPT_ENGLISH_REPAIR_MODEL || DEFAULT_TRANSCRIPT_REPAIR_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'Translate short-form video transcription text into clean natural English only.',
              'Preserve exact meaning, names, numbers, official terms, and factual claims.',
              'Do not add scene notes, summaries, headings, timestamps, or extra facts.',
              'Return strict JSON with keys "transcript" and "segments". Segment count must match the input segment count.',
              '',
              'CORRECTION DICTIONARY — Always apply these domain-specific fixes:',
              'sip → SIP, emi → EMI, rbi → RBI, nps → NPS, ppf → PPF, pan → PAN, gst → GST',
              'nifty fifty → Nifty 50, sensex → Sensex, demat → Demat, kyc → KYC',
              'sbi → SBI, hdfc → HDFC, icici → ICICI, lic → LIC, epfo → EPFO, pf → PF',
              'ipo → IPO, etf → ETF, nav → NAV, amc → AMC, cagr → CAGR, fd → FD, rd → RD',
              'upsc → UPSC, ssc → SSC, ibps → IBPS, neet → NEET, jee → JEE, cat → CAT',
              'rbi grade bee → RBI Grade B, grade bee → Grade B',
              'lakh → lakh, crore → crore, rupees → rupees, paisa → paisa',
              'mutual fund → mutual fund (not "mutual fun"), elss → ELSS',
              'tds → TDS, itr → ITR, form sixteen → Form 16, form twenty six → Form 26AS',
              'aadhaar → Aadhaar, upi → UPI, bhim → BHIM, neft → NEFT, rtgs → RTGS, imps → IMPS',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({
              transcript: transcription.transcript,
              segments: (transcription.segments || []).map((segment, index) => ({
                index,
                text: segment.text,
              })),
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Transcript repair issue: ${response.status}`);
    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content || '';
    const repaired = parseTranslationResponse(content);
    if (!repaired?.transcript) throw new Error('English transcript repair returned an empty transcript.');
    const repairedSegments = mergeRepairedSegments(transcription.segments, repaired.segments);
    return {
      ...transcription,
      transcript: repaired.transcript,
      segments: repairedSegments,
      words: undefined,
      languageHint: 'english',
      warning: transcription.warning,
      rawTranscript: transcription.rawTranscript || transcription.transcript,
    };
  } catch (error) {
    console.error('English transcript repair failed', {
      message: sanitizeUserFacingStatus(error instanceof Error ? error.message : 'English repair failed.'),
    });
    return transcription;
  } finally {
    clearTimeout(timeout);
  }
}

type GroqLikeTranscription = {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds?: number;
  languageHint?: 'english' | 'hinglish';
  model: string;
  warning?: string;
  rawTranscript?: string;
  source: 'groq' | 'openai' | 'gemini';
};

const LANGUAGE_NAMES: Record<string, string> = {
  english: 'English',
  hinglish: 'clean Roman Hinglish (Hindi words in Latin script mixed with English)',
  hindi: 'Hindi in Devanagari script',
  urdu: 'Urdu in Urdu/Arabic script',
  kannada: 'Kannada in Kannada script',
  tamil: 'Tamil in Tamil script',
  telugu: 'Telugu in Telugu script',
  bengali: 'Bengali in Bengali script',
  marathi: 'Marathi in Devanagari script',
  gujarati: 'Gujarati in Gujarati script',
  farsi: 'Farsi/Persian in Persian script',
  arabic: 'Arabic in Arabic script',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  portuguese: 'Portuguese',
  indonesian: 'Indonesian',
  russian: 'Russian',
  japanese: 'Japanese',
};

async function repairTranscriptionToLanguage<T extends GroqLikeTranscription>(transcription: T, outputLanguage: string): Promise<T> {
  // If output is English or Hinglish, use the existing English repair
  if (outputLanguage === 'english' || outputLanguage === 'hinglish') {
    return repairTranscriptionEnglishIfNeeded(transcription);
  }

  // For ALL other languages — translate via Gemini (free) or OpenAI (fallback)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('[TRANSLATION] GEMINI_API_KEY missing — cannot translate to:', outputLanguage);
    return transcription;
  }

  const targetLang = LANGUAGE_NAMES[outputLanguage] || outputLanguage;

  try {
    console.log('[TRANSLATION] Gemini translating to:', targetLang, '| segments:', transcription.segments?.length || 0);
    const {GoogleGenAI} = await import('@google/genai');
    const ai = new GoogleGenAI({apiKey: geminiKey});

    const prompt = `Translate this video transcription into ${targetLang}. Preserve meaning, names, numbers, and factual claims. Keep it natural and readable for short-form video subtitles. Return ONLY valid JSON with keys "transcript" (full translated text) and "segments" (array of {index, text}). Segment count must match input. No markdown, no explanation.\n\nINPUT:\n${JSON.stringify({transcript: transcription.transcript, segments: (transcription.segments || []).map((seg, i) => ({index: i, text: seg.text}))})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{role: 'user', parts: [{text: prompt}]}],
      config: {temperature: 0.3, maxOutputTokens: 3000},
    });

    const text = (response.text || '').replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const parsed = parseTranslationResponse(text);
    if (!parsed?.transcript) {
      console.error('[TRANSLATION] Gemini empty result for:', outputLanguage, '| raw:', text.slice(0, 100));
      return transcription;
    }

    console.log('[TRANSLATION] Gemini success:', outputLanguage, '| segments:', parsed.segments.length);
    const translatedSegments = mergeRepairedSegments(transcription.segments, parsed.segments);
    return {
      ...transcription,
      transcript: parsed.transcript,
      segments: translatedSegments,
      words: undefined,
      languageHint: outputLanguage as any,
      rawTranscript: transcription.rawTranscript || transcription.transcript,
    };
  } catch (err) {
    console.error('[TRANSLATION] Gemini exception for:', outputLanguage, err instanceof Error ? err.message : String(err));
    // Fallback to OpenAI if Gemini fails and OpenAI key exists
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        console.log('[TRANSLATION] Trying OpenAI fallback for:', outputLanguage);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json'},
          body: JSON.stringify({
            model: process.env.TRANSCRIPT_ENGLISH_REPAIR_MODEL || DEFAULT_TRANSCRIPT_REPAIR_MODEL,
            messages: [
              {role: 'system', content: `Translate this video transcription into ${targetLang}. Preserve meaning, names, numbers. Return ONLY valid JSON with keys "transcript" and "segments" (array of {index, text}). Segment count must match input.`},
              {role: 'user', content: JSON.stringify({transcript: transcription.transcript, segments: (transcription.segments || []).map((seg, i) => ({index: i, text: seg.text}))})},
            ],
            response_format: {type: 'json_object'},
            temperature: 0.3,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (response.ok) {
          const json = await response.json();
          const content = json?.choices?.[0]?.message?.content || '';
          const parsed = parseTranslationResponse(content);
          if (parsed?.transcript) {
            console.log('[TRANSLATION] OpenAI fallback success:', outputLanguage);
            const translatedSegments = mergeRepairedSegments(transcription.segments, parsed.segments);
            return {...transcription, transcript: parsed.transcript, segments: translatedSegments, words: undefined, languageHint: outputLanguage as any, rawTranscript: transcription.rawTranscript || transcription.transcript};
          }
        }
      } catch (oaiErr) {
        console.error('[TRANSLATION] OpenAI fallback also failed:', oaiErr instanceof Error ? oaiErr.message : '');
      }
    }
    return transcription;
  }
}

function parseTranslationResponse(content: string): {transcript: string; segments: Array<{index: number; text: string}>} | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (!isRecord(parsed)) return null;
    const transcript = readString(parsed.transcript);
    const segments = Array.isArray(parsed.segments)
      ? parsed.segments
          .map((segment) => isRecord(segment)
            ? {index: Number(segment.index), text: readString(segment.text)}
            : null)
          .filter((segment): segment is {index: number; text: string} => Boolean(segment && Number.isFinite(segment.index) && segment.text))
      : [];
    return transcript ? {transcript, segments} : null;
  } catch {
    return null;
  }
}

function parseEnglishRepairResponse(payload: unknown): {transcript: string; segments: Array<{index: number; text: string}>} | null {
  const text = extractResponsesText(payload);
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    if (!isRecord(parsed)) return null;
    const transcript = readString(parsed.transcript);
    const segments = Array.isArray(parsed.segments)
      ? parsed.segments
          .map((segment) => isRecord(segment)
            ? {index: Number(segment.index), text: readString(segment.text)}
            : null)
          .filter((segment): segment is {index: number; text: string} => Boolean(segment && Number.isFinite(segment.index) && segment.text))
      : [];
    return {transcript, segments};
  } catch {
    return null;
  }
}

function extractResponsesText(payload: unknown): string {
  if (!isRecord(payload)) return '';
  const direct = readString(payload.output_text);
  if (direct) return direct;
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (!isRecord(content)) continue;
      const text = readString(content.text);
      if (text) return text;
    }
  }
  return '';
}

function mergeRepairedSegments(original: ReelTranscriptSegment[] | undefined, repaired: Array<{index: number; text: string}>): ReelTranscriptSegment[] | undefined {
  if (!original?.length || repaired.length !== original.length) return original;
  const repairedByIndex = new Map(repaired.map((segment) => [segment.index, segment.text]));
  return original.map((segment, index) => ({
    ...segment,
    text: repairedByIndex.get(index) || segment.text,
  }));
}


function stabilizeCompareOverlayTimeline(
  overlays: Array<Record<string, unknown>>,
  captions: Array<{start: number; end: number; text: string}>,
  durationSeconds: number,
  leftTitle: string,
  rightTitle: string,
) {
  const source: Array<Record<string, unknown>> = overlays.length
    ? overlays
    : captions.map((caption, index) => ({
        id: `compare-beat-${index + 1}`,
        start: caption.start,
        end: caption.end,
        text: caption.text,
        body: caption.text,
        title: '',
      }));

  const isShortReel = durationSeconds <= 20;
  const minHoldSeconds = isShortReel ? 1.5 : 3.0;
  const intentMinHold = isShortReel ? 0.7 : 1.5;
  const maxHoldSeconds = 6;
  const normalized = source
    .map((overlay, index) => {
      const start = Math.max(0, Number(overlay.start ?? captions[index]?.start ?? 0) || 0);
      const end = Math.min(
        durationSeconds,
        Math.max(Number(overlay.end ?? captions[index]?.end ?? start + 2.5) || start + 2.5, start + 0.6),
      );
      const text = readString(overlay.text || overlay.body || captions[index]?.text);
      const pose = readString(overlay.stickerPose || overlay.pose) || pickComparePoseForStableBeat(text, index, source.length, leftTitle, rightTitle);
      return {
        id: readString(overlay.id) || `compare-beat-${index + 1}`,
        start,
        end,
        text,
        body: readString(overlay.body || overlay.text || text),
        title: readString(overlay.title),
        stickerPose: pose,
        pose,
      };
    })
    .filter((overlay) => overlay.start < durationSeconds && overlay.end > overlay.start);

  const groups: typeof normalized = [];
  let current: typeof normalized[number] | null = null;
  let texts: string[] = [];

  const flush = () => {
    if (!current) return;
    const combined = texts.join(' ').replace(/\s+/g, ' ').trim();
    groups.push({
      ...current,
      text: combined || current.text,
      body: combined || current.body,
    });
    current = null;
    texts = [];
  };

  normalized.forEach((overlay, index) => {
    if (!current) {
      current = {...overlay, id: `compare-pose-${groups.length + 1}`};
      texts = [overlay.text].filter(Boolean);
      return;
    }

    const heldFor = current.end - current.start;
    const intentChanged = overlay.stickerPose !== current.stickerPose;
    const sentenceEnded = /[.!?]$/.test(texts.join(' ').trim());
    const shouldBreak =
      heldFor >= maxHoldSeconds ||
      (intentChanged && heldFor >= intentMinHold) ||
      (sentenceEnded && heldFor >= minHoldSeconds) ||
      (index === normalized.length - 1 && heldFor >= minHoldSeconds);

    if (shouldBreak) {
      flush();
      current = {...overlay, id: `compare-pose-${groups.length + 1}`};
      texts = [overlay.text].filter(Boolean);
      return;
    }

    current.end = overlay.end;
    texts.push(overlay.text);
  });

  flush();
  return groups.map((group, index) => ({
    ...group,
    id: `compare-pose-${index + 1}`,
    start: roundSeconds(group.start),
    end: roundSeconds(index === groups.length - 1 ? Math.min(durationSeconds, group.end) : group.end),
  }));
}

function pickComparePoseForStableBeat(textValue: string, index: number, total: number, leftTitle: string, rightTitle: string) {
  const text = readString(textValue).toLowerCase();
  const left = readString(leftTitle).toLowerCase();
  const right = readString(rightTitle).toLowerCase();
  if (index === 0 && (text.includes('welcome') || text.includes('hello') || text.includes('aaj') || text.includes('today') || text.includes('compare'))) {
    return 'sticker_welcome_intro_explainer';
  }
  if (/\b(final|conclusion|winner|best|recommend|verdict|khareed lo|buy this|yaad rakho|remember)\b/i.test(text)) {
    return 'sticker_success_conclusion_explainer';
  }
  if (/[?]/.test(text) || /\b(question|confus|doubt|which|kaunsa|konsa|kya farq|kya difference|why|how)\b/i.test(text)) {
    return 'sticker_questioning_surprised_explainer';
  }
  if (/\b(risk|problem|mistake|warning|issue|loss|avoid|danger|galti|nuksan|drawback|heating|cons)\b/i.test(text)) {
    return 'sticker_warning_issue_explainer';
  }
  if (left && right && text.includes(left) && text.includes(right)) {
    return 'sticker_comparing_both_sides_explainer';
  }
  if (right && text.includes(right)) {
    return 'sticker_pointing_right_side_explainer';
  }
  if (left && text.includes(left)) {
    return 'sticker_pointing_left_side_explainer';
  }
  if (/\b(vs|compare|comparison|difference|better|both|dono|tradeoff)\b/i.test(text)) {
    return 'sticker_comparing_both_sides_explainer';
  }
  if (/\b(price|pricing|cost|worth|specs|camera|display|battery|processor)\b/i.test(text)) {
    return 'sticker_thinking_analysis_explainer';
  }
  return 'sticker_general_explaining_key_point';
}

/**
 * Apply AI-planned sticker poses to the overlay timeline.
 * For each overlay, find which AI plan segment covers its midpoint and assign that pose.
 */
function applyStickerPlanToOverlays(
  overlays: Array<Record<string, unknown>>,
  stickerPlan: Array<{start: number; end: number; pose: string}>,
): Array<Record<string, unknown>> {
  if (!stickerPlan.length) return overlays;

  return overlays.map((overlay) => {
    const overlayStart = Number(overlay.start || 0);
    const overlayEnd = Number(overlay.end || overlayStart + 2);
    const midpoint = (overlayStart + overlayEnd) / 2;

    // Find the AI plan segment that covers this overlay's midpoint
    const matchingPlan = stickerPlan.find((seg) => midpoint >= seg.start && midpoint <= seg.end);
    if (matchingPlan) {
      return { ...overlay, stickerPose: matchingPlan.pose, pose: matchingPlan.pose };
    }

    // Fallback: find the nearest plan segment if exact match fails
    let nearest = stickerPlan[0];
    let nearestDist = Infinity;
    for (const seg of stickerPlan) {
      const segMid = (seg.start + seg.end) / 2;
      const dist = Math.abs(midpoint - segMid);
      if (dist < nearestDist) { nearest = seg; nearestDist = dist; }
    }
    if (nearest && nearestDist < 10) {
      return { ...overlay, stickerPose: nearest.pose, pose: nearest.pose };
    }

    return overlay;
  });
}

function buildCompareCaptionsFromGroq(renderWindow: {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
}) {
  const words = (renderWindow.words || [])
    .filter((word) => readString(word.word) && Number.isFinite(word.start) && Number.isFinite(word.end))
    .map((word) => ({
      start: Math.max(0, Number(word.start)),
      end: Math.max(Number(word.start) + 0.12, Number(word.end)),
      word: readString(word.word),
    }));

  if (words.length) {
    type CaptionGroup = {start: number; end: number; text: string; words?: Array<{word: string; start: number; end: number}>};
    const captions: CaptionGroup[] = [];
    let group: typeof words = [];

    // Grouping tuned for natural, readable social captions:
    //  - break on sentence-ending punctuation (. ! ?)
    //  - break on a clear speech pause (gap between words)
    //  - cap words, on-screen duration, and character width (long Hinglish words)
    const MAX_WORDS = 5;
    const MAX_SECONDS = 1.6;
    const MAX_CHARS = 30;
    const PAUSE_GAP_SECONDS = 0.5;

    const flush = () => {
      if (!group.length) return;
      captions.push({
        start: roundSeconds(group[0].start),
        end: roundSeconds(Math.max(group[group.length - 1].end, group[0].start + 0.55)),
        text: group.map((item) => item.word).join(' '),
        words: group.map((item) => ({word: item.word, start: roundSeconds(item.start), end: roundSeconds(item.end)})),
      });
      group = [];
    };

    for (const word of words) {
      if (group.length) {
        const groupStart = group[0].start;
        const lastWord = group[group.length - 1];
        const currentChars = group.reduce((total, item) => total + item.word.length + 1, 0);
        const endsSentence = /[.!?]$/.test(lastWord.word);
        const pause = word.start - lastWord.end;
        const shouldBreak =
          group.length >= MAX_WORDS ||
          word.end - groupStart > MAX_SECONDS ||
          currentChars + word.word.length + 1 > MAX_CHARS ||
          pause > PAUSE_GAP_SECONDS ||
          endsSentence;
        if (shouldBreak) flush();
      }
      group.push(word);
    }
    flush();

    // Merge a tiny orphan final group (single short word) into the previous caption
    if (captions.length >= 2) {
      const last = captions[captions.length - 1];
      const lastWordCount = last.words?.length ?? last.text.split(/\s+/).length;
      if (lastWordCount <= 1 && last.end - last.start < 0.6) {
        const prev = captions[captions.length - 2];
        prev.end = last.end;
        prev.text = `${prev.text} ${last.text}`.trim();
        if (prev.words && last.words) prev.words = [...prev.words, ...last.words];
        captions.pop();
      }
    }

    return captions.filter((caption) => caption.text.trim());
  }

  const segments = (renderWindow.segments || [])
    .filter((segment) => readString(segment.text) && Number.isFinite(segment.start) && Number.isFinite(segment.end));

  if (segments.length) {
    return segments.flatMap((segment) => {
      const parts = readString(segment.text).split(/\s+/).filter(Boolean);
      const chunks: Array<{start: number; end: number; text: string}> = [];
      const chunkSize = 5;
      const duration = Math.max(0.8, Number(segment.end) - Number(segment.start));
      const totalChunks = Math.max(1, Math.ceil(parts.length / chunkSize));

      for (let index = 0; index < totalChunks; index += 1) {
        const chunkWords = parts.slice(index * chunkSize, index * chunkSize + chunkSize);
        const start = Number(segment.start) + (duration / totalChunks) * index;
        const end = Number(segment.start) + (duration / totalChunks) * (index + 1);
        chunks.push({
          start: roundSeconds(start),
          end: roundSeconds(end),
          text: chunkWords.join(' '),
        });
      }

      return chunks;
    });
  }

  const fallbackWords = readString(renderWindow.transcript).split(/\s+/).filter(Boolean);
  const fallbackDuration = Math.max(1, renderWindow.durationSeconds || MAX_RENDER_WINDOW_SECONDS);
  const chunkSize = 5;
  const totalChunks = Math.max(1, Math.ceil(fallbackWords.length / chunkSize));

  return Array.from({length: totalChunks}).map((_, index) => ({
    start: roundSeconds((fallbackDuration / totalChunks) * index),
    end: roundSeconds((fallbackDuration / totalChunks) * (index + 1)),
    text: fallbackWords.slice(index * chunkSize, index * chunkSize + chunkSize).join(' '),
  })).filter((caption) => caption.text.trim());
}

/**
 * Build captions from word-level timestamps for a clip, adjusting times relative to clip start.
 */
function buildCaptionsFromWords(
  words: Array<{word: string; start: number; end: number}>,
  clipStartSeconds: number
): Array<{start: number; end: number; text: string; words?: Array<{word: string; start: number; end: number}>}> {
  const adjusted = words
    .filter((w) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
    .map((w) => ({
      word: w.word,
      start: Math.max(0, w.start - clipStartSeconds),
      end: Math.max(0.01, w.end - clipStartSeconds),
    }));

  if (!adjusted.length) return [];

  const captions: Array<{start: number; end: number; text: string; words: Array<{word: string; start: number; end: number}>}> = [];
  let group: typeof adjusted = [];

  const flush = () => {
    if (!group.length) return;
    captions.push({
      start: roundSeconds(group[0].start),
      end: roundSeconds(Math.max(group[group.length - 1].end, group[0].start + 0.5)),
      text: group.map((item) => item.word).join(' '),
      words: group.map((item) => ({word: item.word, start: roundSeconds(item.start), end: roundSeconds(item.end)})),
    });
    group = [];
  };

  for (const word of adjusted) {
    const groupStart = group[0]?.start ?? word.start;
    if (group.length >= 5 || (group.length > 0 && word.end - groupStart > 1.55)) flush();
    group.push(word);
  }
  flush();

  return captions.filter((c) => c.text.trim());
}

function selectBackgroundMusic({
  topicTitle,
  transcript,
}: {
  topicTitle: string;
  transcript: string;
}): {category: string; mood: string; src: string; volume: number} {
  const text = `${topicTitle} ${transcript}`.toLowerCase();
  const rules = [
    {
      category: 'finance',
      mood: 'finance',
      src: 'assets/reusable/background-music/economic-pulse.mp3',
      volume: 0.03,
      pattern: /\b(rbi|reserve bank|banking|currency|rupee|note|notes|cash|money|finance|financial|salary|market|investment|loan|tax|budget|economy|economic)\b/,
    },
    {
      category: 'government-exam',
      mood: 'study',
      src: 'assets/reusable/background-music/exam-preparation.mp3',
      volume: 0.028,
      pattern: /\b(exam|ssc|upsc|ibps|railway|result|admit card|syllabus|vacancy|recruitment|government job|student|study)\b/,
    },
    {
      category: 'tech-ai',
      mood: 'ai',
      src: 'assets/reusable/background-music/digital-future.mp3',
      volume: 0.026,
      pattern: /\b(ai|artificial intelligence|software|coding|app|automation|chatgpt|startup|tech|tool|saas)\b/,
    },
    {
      category: 'breaking-news',
      mood: 'news',
      src: 'assets/reusable/background-music/serious-analysis.mp3',
      volume: 0.026,
      pattern: /\b(breaking|alert|warning|latest|update|minister|court|policy|notice|official|government)\b/,
    },
    {
      category: 'motivation',
      mood: 'motivation',
      src: 'assets/reusable/background-music/rise-again.mp3',
      volume: 0.03,
      pattern: /\b(success|motivation|life|mindset|dream|struggle|comeback|discipline|habit)\b/,
    },
    {
      category: 'story',
      mood: 'documentary',
      src: 'assets/reusable/background-music/documentary-light.mp3',
      volume: 0.024,
      pattern: /\b(story|journey|history|case study|real life|documentary|explained)\b/,
    },
  ];

  return rules.find((rule) => rule.pattern.test(text)) || {
    category: 'general-explainer',
    mood: 'corporate',
    src: 'assets/reusable/background-music/corporate-inspire.mp3',
    volume: 0.028,
  };
}

/**
 * Distributes N images across the narration so each image change lands on a natural
 * speech pause (caption boundary) nearest to an even split. Returns per-image
 * {start,end} windows in seconds. Falls back to an even split when boundaries are sparse.
 */
function planMultiImageTimings(
  captions: Array<{start: number; end: number}>,
  imageCount: number,
  durationSeconds: number,
): Array<{start: number; end: number}> {
  if (imageCount <= 1) return [{start: 0, end: durationSeconds}];
  const minGap = Math.max(1.2, durationSeconds / (imageCount * 3));
  const boundaries = Array.from(
    new Set(
      (captions || [])
        .map((c) => Number(c.end))
        .filter((e) => Number.isFinite(e) && e > minGap && e < durationSeconds - minGap),
    ),
  ).sort((a, b) => a - b);

  const cuts: number[] = [];
  let prev = 0;
  for (let k = 1; k < imageCount; k += 1) {
    const target = (k * durationSeconds) / imageCount;
    let best = target;
    let bestDist = Infinity;
    for (const b of boundaries) {
      if (b <= prev + minGap) continue;
      const d = Math.abs(b - target);
      if (d < bestDist) { bestDist = d; best = b; }
    }
    if (!(best > prev + minGap) || best > durationSeconds - minGap) {
      best = Math.min(durationSeconds - minGap * (imageCount - k), Math.max(prev + minGap, target));
    }
    cuts.push(best);
    prev = best;
  }

  const points = [0, ...cuts, durationSeconds];
  const windows = Array.from({length: imageCount}, (_, i) => ({
    start: Number(points[i].toFixed(2)),
    end: Number(points[i + 1].toFixed(2)),
  }));
  const ok = windows.every((w, i) => w.end > w.start && (i === 0 || w.start >= windows[i - 1].start));
  if (!ok) {
    return Array.from({length: imageCount}, (_, i) => ({
      start: Number(((i * durationSeconds) / imageCount).toFixed(2)),
      end: Number((((i + 1) * durationSeconds) / imageCount).toFixed(2)),
    }));
  }
  return windows;
}

function selectRenderWindow(transcription: PlanningTranscription, maxSeconds: number = MAX_RENDER_WINDOW_SECONDS): {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
  trimStartSeconds: number;
  source: 'voice-activity' | 'timestamp-segment' | 'start';
} {
  const sourceDuration = Number.isFinite(transcription.durationSeconds || 0) && (transcription.durationSeconds || 0) > 0
    ? transcription.durationSeconds || maxSeconds
    : maxSeconds;
  const speechActivity = findFirstSpeechActivity(transcription);
  const maxTrimStart = Math.max(0, sourceDuration - maxSeconds);
  const trimStartSeconds = Math.min(maxTrimStart, Math.max(0, speechActivity.startSeconds - SPEECH_LEAD_SECONDS));
  const trimEndSeconds = Math.min(sourceDuration, trimStartSeconds + maxSeconds);
  const durationSeconds = Math.max(1, Math.min(maxSeconds, trimEndSeconds - trimStartSeconds));
  const words = shiftWordsToWindow(getTranscriptionWords(transcription), trimStartSeconds, trimEndSeconds);
  const segments = shiftSegmentsToWindow(getTranscriptionSegments(transcription), trimStartSeconds, trimEndSeconds);

  return {
    transcript: buildWindowTranscript(transcription.transcript, words, segments),
    words,
    segments,
    durationSeconds,
    trimStartSeconds: roundSeconds(trimStartSeconds),
    source: speechActivity.source,
  };
}

function findFirstSpeechActivity(transcription: PlanningTranscription): {
  startSeconds: number;
  source: 'voice-activity' | 'timestamp-segment' | 'start';
} {
  const wordStart = getTranscriptionWords(transcription)
    ?.filter((word) => isSpeechLikeText(word.word))
    .map((word) => word.start)
    .find((start) => Number.isFinite(start) && start >= 0);
  if (wordStart !== undefined) {
    return {startSeconds: wordStart, source: 'voice-activity'};
  }

  const segmentStart = getTranscriptionSegments(transcription)
    ?.filter((segment) => isSpeechLikeText(segment.text))
    .map((segment) => segment.start)
    .find((start) => Number.isFinite(start) && start >= 0);
  if (segmentStart !== undefined) {
    return {startSeconds: segmentStart, source: 'timestamp-segment'};
  }

  return {startSeconds: 0, source: 'start'};
}

function getTranscriptionWords(transcription: PlanningTranscription): ReelWord[] | undefined {
  return 'words' in transcription ? transcription.words : undefined;
}

function getTranscriptionSegments(transcription: PlanningTranscription): ReelTranscriptSegment[] | undefined {
  return 'segments' in transcription ? transcription.segments : undefined;
}

function shiftWordsToWindow(words: ReelWord[] | undefined, trimStart: number, trimEnd: number) {
  const shifted = (words || [])
    .filter((word) => word.end > trimStart && word.start < trimEnd)
    .map((word) => ({
      ...word,
      start: roundSeconds(Math.max(0, word.start - trimStart)),
      end: roundSeconds(Math.min(trimEnd, word.end) - trimStart),
    }))
    .filter((word) => word.word && word.end > word.start);
  return shifted.length ? shifted : undefined;
}

function shiftSegmentsToWindow(segments: ReelTranscriptSegment[] | undefined, trimStart: number, trimEnd: number) {
  const shifted = (segments || [])
    .filter((segment) => segment.end > trimStart && segment.start < trimEnd)
    .map((segment) => ({
      ...segment,
      start: roundSeconds(Math.max(0, segment.start - trimStart)),
      end: roundSeconds(Math.min(trimEnd, segment.end) - trimStart),
    }))
    .filter((segment) => segment.text && segment.end > segment.start);
  return shifted.length ? shifted : undefined;
}

function buildWindowTranscript(
  fallbackTranscript: string,
  words: ReelWord[] | undefined,
  segments: ReelTranscriptSegment[] | undefined,
) {
  const segmentText = segments?.map((segment) => segment.text.trim()).filter(Boolean).join(' ');
  if (segmentText) return segmentText;
  const wordText = words?.map((word) => word.word.trim()).filter(Boolean).join(' ');
  if (wordText) return wordText;
  return fallbackTranscript || '';
}

function roundSeconds(value: number) {
  return Math.round(value * 1000) / 1000;
}

function isSpeechLikeText(value: string) {
  const normalized = value
    .replace(/\[[^\]]+]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim();
  return normalized.length >= MIN_SPEECH_TOKEN_LENGTH;
}

function toDesign(value: string) {
  const normalized = value.toLowerCase();
  if (!normalized || normalized.includes('auto')) return undefined;
  if (normalized.includes('simple') || normalized.includes('manual')) return 'simpleManual';
  if (normalized.includes('corporate')) return 'corporateVc';
  if (normalized.includes('story')) return 'storyMotivation';
  if (normalized.includes('pink')) return 'pinkWomen';
  if (normalized.includes('fashion')) return 'fashionCommerce';
  return 'educationCreator';
}

function isAllowedRenderMode(value: string) {
  return Boolean(resolveTemplateNameFromRequest(value));
}

function resolveTemplateNameFromRequest(value: string): ReelTemplateName | null {
  const normalized = value.toLowerCase().trim();
  if (!normalized) return null;
  const lookup = normalized.replace(/[-_\s]+/g, '');

  // Direct registry lookup first — exact match against all registered template names
  const registryMatch = Object.keys(VIDEO_TYPE_REGISTRY).find((templateKey) => (
    templateKey.toLowerCase().replace(/[-_\s]+/g, '') === lookup
  ));
  if (registryMatch) return registryMatch as ReelTemplateName;

  const mode = toMode(value);
  return mode ? MODE_TO_TEMPLATE[mode] || null : null;
}

function toMode(value: string): ReelMode | null {
  const normalized = value.toLowerCase();
  if (normalized.includes('book-summary') || normalized.includes('booksummary') || normalized.includes('book_summary')) return 'bookSummary';
  if (normalized.includes('image-to-video') || normalized.includes('imagetovideo') || normalized.includes('image_to_video')) return 'imageToVideoAi';
  if (normalized.includes('ai-video-generator') || normalized.includes('aivideogenerator') || normalized.includes('aivideo') || normalized.includes('ai-video') || normalized.includes('text-to-video') || normalized.includes('script-to-video')) return 'aiVideoGenerator';
  if (normalized.includes('faceless') || normalized.includes('audio-to-video') || normalized.includes('longvideopro') || normalized.includes('long-video-pro')) return 'aiVideoGenerator';
  if (normalized.includes('compare') || normalized.includes('comparison') || normalized === 'vs') return 'compare';
  if (normalized.includes('long-video-clip') || normalized.includes('longvideoclip') || normalized.includes('video-clips')) return 'longVideoClips';
  if (normalized.includes('long-video') || normalized.includes('longvideo') || normalized.includes('promo')) return 'longVideoPromo';
  if (normalized.includes('whiteboard') || normalized.includes('white-board')) return 'whiteboardVideo';
  if (normalized.includes('typography') || normalized.includes('typo-video') || normalized.includes('bold-reel')) return 'typographyVideo';
  if (normalized.includes('youtube') || normalized.includes('youtubesubtitle') || normalized.includes('youtube-subtitle')) return 'youtubeSubtitleGenerator';
  if (normalized.includes('auto-caption') || normalized.includes('autocaption') || normalized.includes('caption') || normalized.includes('subtitle') || normalized.includes('captionstudio') || normalized.includes('long-form-captioned') || normalized.includes('longcaption')) return 'autoCaption';
  return null;
}

function getUploadedMediaType({mode, contentType}: {mode: ReelMode; contentType: string}): 'audio' | 'video' | 'image' {
  if (mode === 'autoCaption') return 'video';
  if (mode === 'youtubeSubtitleGenerator') return 'video';
  if (mode === 'compare') return 'audio';
  if (mode === 'imageToVideoAi') return 'audio';
  if (mode === 'bookSummary') return contentType.startsWith('video/') ? 'video' : 'audio';
  if (mode === 'whiteboardVideo') return contentType.startsWith('video/') ? 'video' : 'audio';
  if (mode === 'typographyVideo') return 'video';
  if (mode === 'longVideoClips') return 'video';
  return contentType.startsWith('audio/') ? 'audio' : 'video';
}

function toMediaType(value: string): 'audio' | 'video' | 'image' {
  const normalized = value.toLowerCase();
  if (normalized === 'audio' || normalized.startsWith('audio/')) return 'audio';
  if (normalized === 'image' || normalized.startsWith('image/')) return 'image';
  return 'video';
}

function toLanguageHint(value: string): 'english' | 'hinglish' | undefined {
  const normalized = value.toLowerCase();
  if (!normalized || normalized.includes('auto')) return undefined;
  if (normalized.includes('hindi') || normalized.includes('urdu') || normalized.includes('hinglish')) return 'hinglish';
  if (normalized.includes('english')) return 'english';
  return undefined;
}

function normalizeSubtitleLanguage(value: string): string | undefined {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  if (!normalized || normalized === 'auto' || normalized === 'source' || normalized === 'same') return undefined;
  if (normalized === 'english' || normalized === 'en') return 'english';
  if (normalized === 'hinglish' || normalized === 'romanenglish' || normalized === 'romanhindi' || normalized === 'romanurdu') return 'hinglish';
  if (normalized === 'hindi' || normalized === 'hi') return 'hindi';
  if (normalized === 'urdu' || normalized === 'ur') return 'urdu';
  if (normalized === 'kannada' || normalized === 'kn') return 'kannada';
  if (normalized === 'tamil' || normalized === 'ta') return 'tamil';
  if (normalized === 'telugu' || normalized === 'te') return 'telugu';
  if (normalized === 'bengali' || normalized === 'bn') return 'bengali';
  if (normalized === 'marathi' || normalized === 'mr') return 'marathi';
  if (normalized === 'gujarati' || normalized === 'gu') return 'gujarati';
  if (normalized === 'arabic' || normalized === 'ar') return 'arabic';
  if (normalized === 'spanish' || normalized === 'es') return 'spanish';
  if (normalized === 'french' || normalized === 'fr') return 'french';
  if (normalized === 'german' || normalized === 'de') return 'german';
  if (normalized === 'portuguese' || normalized === 'pt') return 'portuguese';
  if (normalized === 'russian' || normalized === 'ru') return 'russian';
  if (normalized === 'japanese' || normalized === 'ja') return 'japanese';
  return normalized;
}

function titleFromFile(value: string) {
  return value.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim().slice(0, 64) || 'ItnaVideo Reel';
}

function titleFromTranscript(value: string) {
  const firstSentence = String(value || '')
    .replace(/\s+/g, ' ')
    .split(/[.!?\n]/)
    .map((item) => item.trim())
    .find((item) => item.length >= 8);
  if (!firstSentence) return '';
  return firstSentence
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 7)
    .join(' ')
    .replace(/[^\p{L}\p{N}\s₹$%.,-]/gu, '')
    .trim()
    .slice(0, 64);
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanTextForRender(value: string, maxLength: number) {
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length <= maxLength ? text : `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function readFiniteNumber(value: unknown, fallback: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

type RenderPreflightFailure = {
  reasonCode: string;
  message: string;
};

function validateBeforeRender({
  inputProps,
  templateName,
  composition,
  mediaType,
}: {
  inputProps: Record<string, unknown>;
  templateName: ReelTemplateName;
  composition: string;
  mediaType: 'audio' | 'video' | 'image';
}): RenderPreflightFailure | null {
  const templateConfig = VIDEO_TYPE_REGISTRY[templateName];
  if (!templateConfig) {
    return {
      reasonCode: 'UNKNOWN_TEMPLATE',
      message: 'This video type is not available for rendering yet.',
    };
  }

  if (composition !== templateConfig.compositionId || readString(inputProps.compositionId) !== templateConfig.compositionId) {
    return {
      reasonCode: 'COMPOSITION_TEMPLATE_MISMATCH',
      message: `${humanTemplateName(templateName)} is mapped to the wrong render composition.`,
    };
  }

  if (readString(inputProps.templateName) !== templateName || readString(inputProps.template) !== templateName) {
    return {
      reasonCode: 'TEMPLATE_PROPS_MISMATCH',
      message: 'The planned video type does not match the selected render video type.',
    };
  }

  if (!canSerializeRenderProps(inputProps)) {
    return {
      reasonCode: 'RENDER_PROPS_NOT_SERIALIZABLE',
      message: 'Render data could not be prepared safely. Please try again.',
    };
  }

  if (!(templateConfig.allowedMedia as readonly string[]).includes(mediaType)) {
    return {
      reasonCode: 'UNSUPPORTED_MEDIA_FOR_TEMPLATE',
      message: `${humanTemplateName(templateName)} does not support this upload type.`,
    };
  }

  const renderDuration = readPositiveNumber(inputProps.durationSeconds) ?? readPositiveNumber(inputProps.renderWindowSeconds);
  const maximumDuration = getMaxRenderWindowSecondsForTemplate(templateName);
  if (!renderDuration || renderDuration > maximumDuration) {
    const maxDesc = maximumDuration >= 60 ? `${Math.round(maximumDuration / 60)} minutes` : `${Math.round(maximumDuration)} seconds`;
    return {
      reasonCode: 'INVALID_RENDER_DURATION',
      message: `Render duration must be between 1 second and ${maxDesc}.`,
    };
  }

  if (!readString(inputProps.mediaSrc)) {
    return {
      reasonCode: 'MISSING_MEDIA_SOURCE',
      message: `${humanTemplateName(templateName)} needs uploaded media before render.`,
    };
  }

  if ((templateName === 'VIDEO_CAPTION' || templateName === 'AUTO_CAPTION_GENERATOR' || templateName === 'YOUTUBE_SUBTITLE_GENERATOR') && mediaType !== 'video') {
    return {
      reasonCode: 'VIDEO_CAPTION_REQUIRES_VIDEO',
      message: 'Video upload required for subtitles before render.',
    };
  }

  if (hasVisibleTextIssue(inputProps, hasForbiddenScriptText)) {
    return {
      reasonCode: 'FORBIDDEN_VISIBLE_SCRIPT',
      message: 'Visible reel text must use clean Roman/Hinglish or English text.',
    };
  }

  if (hasVisibleTextIssue(inputProps, isForbiddenPlaceholderText)) {
    return {
      reasonCode: 'PLACEHOLDER_VISIBLE_TEXT',
      message: 'The plan still contains placeholder text and needs repair before render.',
    };
  }

  return null;
}

function humanTemplateName(templateName: string) {
  if (templateName === 'YOUTUBE_SUBTITLE_GENERATOR') return 'YouTube Subtitle Generator';
  if (templateName === 'IMAGE_TO_VIDEO_AI') return 'Image to Video AI';
  if (templateName === 'AUTO_CAPTION_GENERATOR') return 'Auto Caption Generator';
  if (templateName === 'LONG_VIDEO_PROMO') return 'Long Video Promo';
  if (templateName === 'LONG_VIDEO_PRO') return 'Long Video Pro';
  if (templateName === 'comparisonImages') return 'Compare Explainer Video';
  if (templateName === 'WHITEBOARD_VIDEO') return 'Whiteboard Video';
  if (templateName === 'TYPOGRAPHY_VIDEO') return 'Typography Video';
  if (templateName === 'LONG_VIDEO_CLIPS') return 'Long Video Clips';
  return 'Itnavideo Reel';
}

function sceneIntentToType(intent: string): 'title' | 'narration' | 'typography' | 'image' | 'callout' | 'transition' {
  switch (intent) {
    case 'establish_atmosphere': return 'title';
    case 'introduce_topic': return 'title';
    case 'emphasize_point': return 'typography';
    case 'show_example': return 'image';
    case 'compare_contrast': return 'callout';
    case 'call_to_action': return 'title';
    case 'build_tension': return 'typography';
    case 'resolve_conclusion': return 'callout';
    default: return 'typography';
  }
}

/** Extract a meaningful keyword for typography fallback when no image is available */
function extractKeyword(scene: {emphasis?: string[]; assetQuery?: string}, captions: {text: string}[]): string {
  // Try emphasis words from scene plan
  if (scene.emphasis?.length) return scene.emphasis[0];
  // Try asset query (scene director's suggested visual)
  if (scene.assetQuery) {
    const words = scene.assetQuery.split(/\s+/).filter((w) => w.length > 3);
    if (words.length > 0) return words.slice(0, 2).join(' ');
  }
  // Pick the longest meaningful word from captions in this segment
  const allText = captions.map((c) => c.text).join(' ');
  const meaningful = allText.split(/\s+/).filter((w) => w.length > 4 && !/^(about|these|those|there|which|where|their|would|could|should|after|before)$/i.test(w));
  if (meaningful.length > 0) {
    // Pick the longest word as the most impactful keyword
    return meaningful.sort((a, b) => b.length - a.length)[0];
  }
  return allText.split(/\s+/).slice(0, 2).join(' ') || 'Key Point';
}

function readPositiveNumber(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function canSerializeRenderProps(value: unknown) {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

function hasImageSource(value: unknown): boolean {
  if (typeof value === 'string') return /^(https?:|data:image\/|blob:|\/)/i.test(value.trim());
  if (Array.isArray(value)) return value.some(hasImageSource);
  if (!isRecord(value)) return false;
  return ['src', 'source', 'url', 'imageUrl', 'mediaSrc', 'image'].some((key) => hasImageSource(value[key]));
}

function hasVisibleTextIssue(value: unknown, predicate: (text: string) => boolean, keyPath = ''): boolean {
  if (typeof value === 'string') {
    if (shouldSkipVisibleTextKey(keyPath)) return false;
    return predicate(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasVisibleTextIssue(item, predicate, keyPath));
  if (!isRecord(value)) return false;
  return Object.entries(value).some(([key, nested]) => hasVisibleTextIssue(nested, predicate, keyPath ? `${keyPath}.${key}` : key));
}

function shouldSkipVisibleTextKey(keyPath: string) {
  return /(?:scriptDetails|mediaSrc|imageSources|selectedAssets|uploadedImages|assetTimeline|assetBrief|primaryVisual\.prompt|prompt|visual|searchText|assetSearchText|detailedDescription|visualDifference|useCase|use_case|tags|category|orientation|style|motion|type|file|suggestedFilename|embeddingRef|storage|source|src|url|key|id|model|provider|debug|constraints|qualityChecks|warnings|repairNotes|renderNotes|captions|subtitleChunks|transcriptSegments|transcript|sourceScript|subtitleLanguagePolicy|subtitleOutputLanguage|overlayTimeline|topicTitle|compareLeftTitle|compareRightTitle|leftTitle|rightTitle|text|body|title|label|keyword|imageSrc|scenes)/i.test(keyPath);
}

function hasForbiddenScriptText(value: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F]/u.test(value);
}

function isForbiddenPlaceholderText(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase();
  return FORBIDDEN_VISIBLE_PLACEHOLDERS.has(normalized) || /^scene\s+\d+$/i.test(normalized);
}

const FORBIDDEN_VISIBLE_PLACEHOLDERS = new Set([
  'scene 1',
  'scene 2',
  'scene 3',
  'visual brief',
  'image brief',
  'key point',
  'typography',
  'safe zone',
  'motion',
  'placeholder',
  'todo',
  'debug',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function clean(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function readAwsRegion(value?: string): AwsRegion {
  return (clean(value) || 'ap-south-1') as AwsRegion;
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || '');
  const normalized = source.toLowerCase();
  if (/rate exceeded|too many requests|toomanyrequests|concurrent.*limit|concurrency.*limit|limit exceeded|throttl/i.test(normalized)) {
    return 'Render engine is warming up or processing previous tasks. Your upload stays selected, please retry in a moment.';
  }
  if (/timed out|timeout|chunks are missing|missing chunks|main function/i.test(source)) {
    return 'Render took too long with the current workload. Please try again; the render has been split into smaller parts now.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\bVIDEO[-_]SIMPLE[-_]EXPLAINER\b/gi, 'Video Simple Explainer')
    .replace(/\bAUTO[-_]CAPTION[-_]REEL\b/gi, 'Auto Caption Reel')
    .replace(/\bCOMPARE[-_]EXPLAINER\b/gi, 'Compare Explainer')
    .replace(/\bIMAGE[-_]STORY[-_]COLLAGE\b/gi, 'Cinematic Collage')
    .replace(/\bAUTO[-_]DRAW[-_]EXPLAINER\b/gi, 'Auto Draw Explainer')
    .replace(/\bLONG[-_]VIDEO[-_]PROMO\b/gi, 'Long Video Promo')
    .replace(/\bVOICE[-_]SYNCED[-_]NOTES\b/gi, 'Voice Synced Notes')
    .replace(/\b(?:REMOTION|GROQ|OPENAI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, 'render system')
    .replace(/\bGroq\b/gi, 'transcription service')
    .replace(/\bAWS Lambda\b/gi, 'render system')
    .replace(/\bAWS\b/gi, 'render')
    .replace(/\bLambda\b/gi, 'render system')
    .replace(/\bRemotion\b/gi, 'video renderer')
    .replace(/\bS3\b/gi, 'secure storage')
    .replace(/\bffmpeg\b/gi, 'media processor')
    .replace(/\bOpenAI\b/gi, 'AI planner')
    .trim() || 'Something went wrong. Please try again.';
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'anonymous';
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'reel';
}

const FOUNDER_EMAILS = ['itnavideo@gmail.com', 'rohi@itnavideo.com'];
const FOUNDER_USER_IDS = (process.env.FOUNDER_TEST_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);

function isFounderEmail(email: string) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    FOUNDER_EMAILS.includes(normalized) ||
    normalized.includes('akram') ||
    normalized.includes('itnavideo') ||
    process.env.NODE_ENV !== 'production'
  );
}

function isFounderUser(userId: string) {
  if (!userId) return false;
  return FOUNDER_USER_IDS.includes(userId);
}
