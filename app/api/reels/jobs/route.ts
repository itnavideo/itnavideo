import {NextResponse} from 'next/server';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {renderMediaOnLambda, type AwsRegion} from '@remotion/lambda/client';
import {createReadUrl, TEMP_MEDIA_RENDER_PREFIX, uploadTemporaryMediaObject} from '@/lib/aws/mediaStorage';
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
import {extractAudioFromS3Video} from '@/services/media/audioExtractLambda';
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
import {cleanFaceCamSilenceAndFillers} from '@/services/ai/faceCamSilenceCleaner';
import {extractFaceKeyframes} from '@/services/vision/faceTracker';
import {generateStructuredSceneBlueprint} from '@/services/ai/aiScenePlanner';
import {planBrollForScenes} from '@/services/ai/brollMatcher';
import {planImagesFromLibraryForScenes} from '@/services/ai/aiImageLibraryMatcher';
import {getAssetsByFolder, getSfxUrl, getBackgroundMusicUrl} from '@/lib/cloudinary/client';
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LambdaRenderRequest = Parameters<typeof renderMediaOnLambda>[0];
type ReelMode =
  | 'compare' | 'autoCaption' | 'longVideoPromo' | 'whiteboardVideo' | 'typographyVideo' | 'longVideoClips' | 'facelessVideo' | 'aiVideoGenerator' | 'longVideoPro' | 'imageToVideoAi';

const MODE_TO_TEMPLATE: Partial<Record<ReelMode, ReelTemplateName>> = {
  compare: 'comparisonImages',
  autoCaption: 'AUTO_CAPTION_GENERATOR',
  longVideoPromo: 'LONG_VIDEO_PROMO',
  whiteboardVideo: 'WHITEBOARD_VIDEO',
  typographyVideo: 'TYPOGRAPHY_VIDEO',
  longVideoClips: 'LONG_VIDEO_CLIPS',
  longVideoPro: 'FACELESS_VIDEO',
  facelessVideo: 'FACELESS_VIDEO',
  aiVideoGenerator: 'FACELESS_VIDEO',
  imageToVideoAi: 'IMAGE_TO_VIDEO_AI',
};

// All 9:16 short video types render up to 90 seconds.
// Long Faceless Video supports up to 20 minutes (1200 seconds) audio.
// Image to Video AI supports up to 30 minutes (1800 seconds) audio.
const MAX_RENDER_WINDOW_SECONDS = 90;
const MAX_AUTO_CAPTION_SECONDS = 90;
const MAX_IMAGE_TO_VIDEO_SECONDS = 30 * 60; // 1800 seconds (30 minutes)
const MAX_FACELESS_VIDEO_SECONDS = 20 * 60; // 1200 seconds (20 minutes)

function getMaxRenderWindowSecondsForTemplate(templateName?: ReelTemplateName | null): number {
  if (templateName === 'IMAGE_TO_VIDEO_AI') {
    return MAX_IMAGE_TO_VIDEO_SECONDS;
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
  const bgmKey = readString(body.bgmKey);
  const requestedBgmUrl = readString(body.bgmUrl);
  const enableBgm = typeof body.enableBgm === 'boolean' ? body.enableBgm : body.enableBgm !== 'false' && body.enableBgm !== false;
  const bgmVolume = typeof body.bgmVolume === 'number' ? body.bgmVolume : 0.15;
  const subtitleStyle = readString(body.subtitleStyle) || 'parallax-modern';
  const cameraMotionPreset = readString(body.cameraMotionPreset) || 'ken-burns';
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

  if (!mediaKey) {
    return NextResponse.json({ok: false, error: 'mediaKey is required. Upload media before starting render.'}, {status: 400});
  }
  if (!userId) {
    return NextResponse.json({ok: false, error: 'Please log in before creating a reel.'}, {status: 401});
  }
  const requestedClipCountRaw = body.clipCount;
  const isAutoClips = mode === 'longVideoClips' && (requestedClipCountRaw === 'auto' || requestedClipCountRaw === 0 || !requestedClipCountRaw);
  const requestedClipCount = mode === 'longVideoClips'
    ? (isAutoClips ? 5 : Math.max(1, Math.min(15, readFiniteNumber(requestedClipCountRaw, 5))))
    : undefined;
  let requestedCreditUnits: number | null = null;
  try {
    const hasAiGeneratedImages = body.hasAiGeneratedImages === true || body.assetMode === 'ai-generate';
    requestedCreditUnits = (mode === 'longVideoPro')
      ? null
      : calculateRenderCreditUnits(mode, {
          clipCount: requestedClipCount,
          durationSeconds: readFiniteNumber(body.durationSeconds, 60),
          hasAiGeneratedImages: mode === 'imageToVideoAi' && hasAiGeneratedImages,
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

    const mediaUrl = mediaKey ? await createReadUrl(mediaKey) : '';
    const explanationImageUrl = explanationImageKey
      ? readString(await createReadUrl(explanationImageKey))
      : "";
    const thumbnailKey = promoThumbnailImageKey;
    const promoThumbnailUrl = thumbnailKey
      ? readString(await createReadUrl(thumbnailKey))
      : "";
    const comparisonImageUrls = templateConfig.needsImages
      ? (await Promise.all(
          comparisonImageKeys.map(async (key: string) => readString(await createReadUrl(key))),
        )).filter(Boolean).slice(0, 2)
      : [];
    const uploadedImageUrls = (
      await Promise.all(
        uploadedImageKeys.map(async (key: string) => {
          try {
            return readString(await createReadUrl(key));
          } catch {
            return '';
          }
        })
      )
    ).filter(Boolean);
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
        ctaText: readString(body.promoCtaText).slice(0, 40) || 'Watch the full video',
        ctaSubtext: readString(body.promoCtaSubtext ?? 'Link in bio').slice(0, 28),
        sourceAudioVolume: 1,
        premiumEditing: true,
        fastRender: true,
        styleLock,
        soundCues,
        templateName,
        template: templateName,
        compositionId: composition,
      };

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

    // ── IMAGE TO VIDEO AI (16:9 Widescreen, scene flow synced to script, Ken Burns camera motion, 2.5D parallax subtitles) ──
    if (mode === 'imageToVideoAi') {
      const audioPrep = await prepareAudioForTranscription(mediaKey, mediaUrl, fileName, contentType, 'audio');
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
      // Widescreen 16:9 natural documentary captions (8-12 words, complete sentences/clauses)
      const captions = buildWidescreen16x9Captions(renderWindow);

      // Intelligent filter: exclude user error screenshots, bug captures, or UI diagnostics
      const isRealStoryAsset = (url: string) => {
        if (!url || typeof url !== 'string') return false;
        const lower = url.toLowerCase();
        const nonStoryKeywords = ['screenshot', 'screen_shot', 'screen-shot', 'screencap', 'capture', 'error', 'bug', 'debug', 'console', '1%'];
        return !nonStoryKeywords.some((kw) => lower.includes(kw));
      };

      // Load rich 16:9 images from Cloudinary library (assets.json)
      const catalogAssets = getAssetsByFolder('images');
      const catalogImages = catalogAssets
        .filter((img) => img && img.secure_url && isRealStoryAsset(img.secure_url))
        .map((img) => img.secure_url);

      const library16x9Images = catalogImages.length > 0 ? catalogImages : [
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688244/financial_planning_collaboration_phdqrt.png',
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688239/hand_stacking_coins_wealth_blocks_jpzudc.png',
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688238/hands_cupping_growing_money_plant_helfm6.png',
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688234/creative_mindset_innovation_gears_h7qmzn.png',
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688229/futuristic_ai_robot_neural_network_v6j5fk.png',
        'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688223/modern_workspace_laptop_coffee_planning_o8nkmk.png',
      ];

      // Pool of images: user custom stock/AI URLs > user uploaded > default 16:9 library (filtered)
      const rawCustomUrls = Array.isArray(body.customImageUrls)
        ? (body.customImageUrls as unknown[]).map((u) => String(u || '').trim()).filter((u) => u.startsWith('http') && isRealStoryAsset(u))
        : [];
      const cleanUploadedImageUrls = uploadedImageUrls.filter(isRealStoryAsset);
      const imagePool = rawCustomUrls.length > 0
        ? rawCustomUrls
        : (cleanUploadedImageUrls.length > 0 ? cleanUploadedImageUrls : library16x9Images);

      const fitMode = (readString(body.fitMode) as 'blur-fill' | 'cover') || 'cover';

      // Build dynamic, high-retention 16:9 scene cuts paced to script lines (~2.2s - 3.5s per cut)
      const scenes = buildWidescreen16x9Scenes({
        renderWindow,
        imagePool,
        cameraMotionPreset,
        fitMode,
      });

      // SFX Events: Cinematic sound design pack across scene transitions
      // Rotates between whoosh, camera snap, and sub-bass hit for rhythmic excitement
      const sfxLibrary = [
        'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939729/whoosh-in_ygnjid.mp3', // dynamic whoosh
        'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093485/click_aydqtp.mp3',      // subtle snap / shutter
        'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939729/whoosh-in_ygnjid.mp3', // whoosh
        'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093466/bass-drop_sn3ngm.mp3',  // cinematic low bass thud
      ];
      const enableSfx = body.enableSfx !== false;
      const sfxStride = Math.max(1, Math.floor(scenes.length / 14));
      const sfxEvents = enableSfx
        ? scenes
            .slice(1)
            .filter((_, idx) => idx % sfxStride === 0)
            .slice(0, 14)
            .map((s, idx) => ({
              id: `sfx-event-${idx + 1}`,
              sfxUrl: sfxLibrary[idx % sfxLibrary.length],
              startFrame: Math.floor(s.startSeconds * 30),
              volume: idx % sfxLibrary.length === 3 ? 0.14 : 0.16,
            }))
        : [];

      let finalBgmUrl = '';
      if (enableBgm) {
        if (customBgmUrl) {
          finalBgmUrl = customBgmUrl;
        } else if (requestedBgmUrl) {
          finalBgmUrl = requestedBgmUrl;
        } else {
          finalBgmUrl = getBackgroundMusicUrl('wealth') || 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093179/wealth-building_kyg9kb.mp3';
        }
      }

      const inputProps: Record<string, unknown> = {
        mediaSrc: mediaUrl,
        audioUrl: mediaUrl,
        bgmUrl: finalBgmUrl,
        bgmVolume: enableBgm ? bgmVolume : 0,
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

      const preflight = validateBeforeRender({ inputProps, templateName, composition, mediaType: 'audio' });
      if (preflight) {
        return NextResponse.json({ ok: false, status: 'failed', reasonCode: preflight.reasonCode, error: preflight.message }, { status: 422 });
      }

      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-image-to-video-ai.mp4`;
      const render = await startRenderWithCapacityRetry({
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
        framesPerLambda: getOptimalFramesPerLambda(renderWindow.durationSeconds, true),
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
        diagnostics: { sceneCount: scenes.length, imageCount: imagePool.length },
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
      const renderWindow = selectRenderWindow(lvpTranscription, MAX_FACELESS_VIDEO_SECONDS);
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
        framesPerLambda: getOptimalFramesPerLambda(renderWindow.durationSeconds, true),
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

      const requestedClipDuration = [15, 30, 60].includes(readFiniteNumber(body.clipDuration, 30))
        ? readFiniteNumber(body.clipDuration, 30)
        : 30;

      // Pick best clips using deterministic scorer
      const bestClips = selectBestClips({
        transcript: clipTranscription.transcript,
        words: allWords,
        segments: allSegments,
        totalDurationSeconds: totalDuration,
        clipDurationSeconds: requestedClipDuration,
        clipCount: selectedClipCount,
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

      // Render each clip as a separate Lambda job
      const renderResults: Array<{
        clipIndex: number;
        renderId: string;
        bucketName: string;
        outName: string;
        startSeconds: number;
        endSeconds: number;
        title: string;
        durationSeconds: number;
      }> = [];

      for (const [clipPosition, clip] of bestClips.entries()) {
        // Build captions for this clip window
        const clipWords = allWords.filter((w: any) => w.start >= clip.startSeconds && w.end <= clip.endSeconds);
        const clipCaptions = buildCaptionsFromWords(clipWords, clip.startSeconds);
        const clipTitle = titleFromTranscript(clip.text) || `Viral Clip ${clipPosition + 1}`;
        const clipDuration = clip.endSeconds - clip.startSeconds;

        const clipInputProps: Record<string, unknown> = {
          mediaSrc: mediaUrl,
          mediaType: 'video',
          mediaTrimStartSeconds: clip.startSeconds,
          sourceAudioVolume: 1,
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
          concurrency: 2,
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
          durationSeconds: clipDuration,
        });
      }
      markTiming('all_clips_render_start_ms');

      console.log('[LONG_VIDEO_CLIPS] All clips submitted', {
        clipCount: renderResults.length,
        clipDuration: requestedClipDuration,
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
    if (planningMedia.error && !planningMedia.transcriptionMediaUrl) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: 'MEDIA_CLIP_PREP_FAILED',
          error: 'We could not prepare the media for processing. Please try again or upload a standard MP3/MP4 file.',
          detail: process.env.NODE_ENV !== 'production' ? planningMedia.error : undefined,
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
    let plan: ReturnType<typeof validateAndRepairReelPlan>;
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
        mode === 'autoCaption'
          ? 'Use uploaded video as full-screen primary media and render clean timed captions over it.'
          : mediaType === 'video'
            ? 'Use uploaded video as the top visual container for Video Explainer.'
            : 'Use uploaded voiceover to create a Video Explainer with generated visual structure.',
        renderWindow.trimStartSeconds > 0
          ? `Use the speech-aware 1 minute window starting at ${renderWindow.trimStartSeconds.toFixed(2)}s of the source media.`
          : 'Use the first minute of the source media.',
        planningMedia.clipped
          ? 'Uploaded media was clipped to the first minute before transcription and render.'
          : 'Use the uploaded media directly because clipping was unavailable or unnecessary.',
        'No karaoke captions.',
        mode === 'autoCaption'
          ? 'Do not add explainer cards. Keep only clean captions/subtitles over the uploaded video.'
          : 'One primary visual element per scene.',
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
      ...(mode === 'autoCaption'
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
            stickerStyle: readString(body.stickerStyle) || 'explainer',
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
          };
          })()
        : {}),
      ...(mode === 'autoCaption'
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
            const wbPlan = await planWhiteboardVideo({
              transcript: renderWindow.transcript,
              segments: wbCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              durationSeconds: renderWindow.durationSeconds,
              topicTitle: topicTitle || undefined,
              boardStyle: wbBoard,
            });
            console.log('[WHITEBOARD_PLANNER]', { source: wbPlan.source, title: wbPlan.title, pointCount: wbPlan.points.length, board: wbBoard });
            return {
              title: wbPlan.title,
              titleColor: wbPlan.titleColor,
              points: wbPlan.points,
              conclusion: wbPlan.conclusion,
              conclusionTime: wbPlan.conclusionTime,
              boardStyle: wbBoard,
              captions: [],
              durationSeconds: renderWindow.durationSeconds,
              transcript: renderWindow.transcript,
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
            const videoTitle = topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName) || 'Faceless Video';

            const blueprint = await generateStructuredSceneBlueprint(
              transcriptChunks.length ? transcriptChunks : [{ text: renderWindow.transcript, start: 0, end: renderWindow.durationSeconds }],
              { title: videoTitle, headingFont, bodyFont, backgroundTheme }
            );

            // Step 3.5: AI Visual Asset Selection via Curated Cloudinary ChatGPT Library
            // Bypasses external stock APIs (Pexels/Pixabay/Google) in favor of high-quality custom visuals
            const targetAspectRatio: '16:9' | '9:16' =
              body.aspectRatio === '9:16' || composition.includes('VERTICAL') ? '9:16' : '16:9';

            const plannedLibraryImages = await planImagesFromLibraryForScenes(blueprint.scenes, {
              aspectRatio: targetAspectRatio,
            });

            const userUploadedAssets = (comparisonImageUrls || []).filter(Boolean);
            const uploadedCandidates = userUploadedAssets.map((url, i) => ({
              key: `uploaded_image_${i}`,
              url,
              fileName: `uploaded_image_${i}`,
            }));

            const mappedBrollUrls = userUploadedAssets.length > 0
              ? smartMatchUploadedImagesToScenes(blueprint.scenes, uploadedCandidates)
              : plannedLibraryImages;

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
      videoLayout: mode === 'autoCaption' ? 'fullscreen' : readString(body.videoLayout) || 'fullscreen',
      watermark: mode === 'autoCaption' && Boolean(access?.watermark),
      progressStyle: mode === 'autoCaption' ? 'none' : readString(body.progressStyle) || 'glow',
      wordClickSound: mode === 'autoCaption' ? false : body.wordClickSound !== false,
      mediaTrimStartSeconds: renderWindow.trimStartSeconds,
      sourceDurationSeconds: transcription.durationSeconds || renderWindow.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
      durationSeconds: renderWindow.durationSeconds || transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
      renderWindowSeconds: renderWindow.durationSeconds || transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS,
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
            backgroundMusic: mode === 'autoCaption' ? false : plan.renderProps?.backgroundMusic !== false,
            backgroundMusicMood: readString(plan.renderProps?.backgroundMusicMood) || music.mood,
            backgroundMusicSrc: readString(plan.renderProps?.backgroundMusicSrc) || music.src,
            backgroundMusicVolume: Number.isFinite(Number(plan.renderProps?.backgroundMusicVolume))
              ? Math.min(0.04, Math.max(0.012, Number(plan.renderProps?.backgroundMusicVolume)))
              : music.volume,
          }),
      sourceAudioVolume: 1.35,
      subtitleLanguagePolicy: SUBTITLE_LANGUAGE_POLICY,
      backgroundMusicCategory: readString(plan.renderProps?.backgroundMusicCategory) || music.category,
      premiumEditing: mode !== 'autoCaption',
      styleLock: mode === 'autoCaption' ? undefined : styleLock,

      ...(mode === 'compare'
        ? {
            transcript: renderWindow.transcript,
            sourceScript: renderWindow.transcript,
          }
        : {}),
    };
    if (mode !== 'autoCaption' && (!Array.isArray(inputProps.soundCues) || !inputProps.soundCues.length)) {
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
    if (mode === 'autoCaption') {
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

    const renderRequest: LambdaRenderRequest = {
      region: config.region,
      functionName: config.functionName,
      serveUrl: config.serveUrl,
      composition,
      codec: 'h264',
      audioCodec: 'aac',
      inputProps: imagePreflight.inputProps,
      outName,
      privacy: 'private',
      deleteAfter: '3-days',
      overwrite: true,
      concurrency: config.concurrency,
      maxRetries: 3,
      downloadBehavior: {
        type: 'download',
        fileName: mode === 'autoCaption' ? 'itnavideo-auto-caption-reel.mp4' : 'itnavideo-reel.mp4',
      },
      isProduction: true,
      logLevel: 'info',
    };
    const render = await startRenderWithCapacityRetry(renderRequest);
    await reserveAcceptedRenderUsage({
      userId,
      renderId: render.renderId,
      creditUnits: requestedCreditUnits ?? calculateRenderCreditUnits(mode),
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
      mediaTrimStartSeconds: renderWindow.trimStartSeconds,
      renderWindowSeconds: renderWindow.durationSeconds,
      renderWindowSource: renderWindow.source,
      planningMediaSource: planningMedia.clipped ? 'first-60s-clip' : 'original-upload',
      access,
      creditUnits: requestedCreditUnits,
      creditCost: formatCreditUnits(requestedCreditUnits ?? calculateRenderCreditUnits(mode)),
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

  for (const ref of refs) {
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
  return possible.some((file) => existsSync(file))
    ? {ok: true}
    : {ok: false, reason: 'LOCAL_IMAGE_FILE_MISSING'};
}

function getRenderImageFallback() {
  const asset = readUnifiedAssets()
    .filter((item) => item.type === 'image' && item.safeToUse && !item.needsLabel && item.kind !== 'background' && item.kind !== 'icon')
    .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))[0];
  return {
    src: asset?.src || '/assets/reusable/images/ai-typographic-tile-background.png',
    title: asset?.title || 'Fallback visual',
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
  const renderProvider = clean(process.env.RENDER_PROVIDER).toLowerCase();
  const gcpWorkerUrl = clean(process.env.GCP_RENDER_WORKER_URL);
  if (renderProvider !== 'aws') {
    return {
      ok: true,
      region: 'ap-south-1' as AwsRegion,
      functionName: 'gcp-render-worker',
      serveUrl: gcpWorkerUrl || 'http://34.100.147.84:8080',
      concurrency: 4,
    };
  }

  const region = readAwsRegion(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION);
  const functionName = clean(process.env.REMOTION_LAMBDA_FUNCTION_NAME);
  const serveUrl = normalizeServeUrl(clean(process.env.REMOTION_LAMBDA_SERVE_URL));
  const configuredConcurrency = Number(process.env.REMOTION_LAMBDA_CONCURRENCY || 2);
  // Cap concurrency strictly to 2 to stay safely under AWS Lambda 10-concurrency account limit in ap-south-1
  const concurrency = Math.min(2, Math.max(1, Number.isFinite(configuredConcurrency) ? configuredConcurrency : 2));
  if (!functionName || !serveUrl) {
    return {ok: false, error: 'The render system is not deployed yet.'};
  }
  return {ok: true, region, functionName, serveUrl, concurrency};
}

function normalizeServeUrl(value: string) {
  if (!value) return value;
  return value.includes('/sites/')
    ? value
    : '';
}

async function startRenderWithCapacityRetry(request: LambdaRenderRequest) {
  const renderProvider = clean(process.env.RENDER_PROVIDER).toLowerCase();
  const gcpWorkerUrl = clean(process.env.GCP_RENDER_WORKER_URL);
  if (renderProvider !== 'aws') {
    const workerEndpoint = (gcpWorkerUrl || 'http://34.100.147.84:8080').replace(/\/+$/, '');
    console.log('[RENDER_DISPATCH_GCP] Dispatching to Google Cloud render worker:', workerEndpoint);
    const resp = await fetch(`${workerEndpoint}/api/render`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        composition: request.composition,
        inputProps: request.inputProps,
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`GCP Cloud Render worker failed (${resp.status}): ${errText}`);
    }
    const data = await resp.json();
    return {
      renderId: data.renderId,
      bucketName: data.bucketName || 'itnavideo-media-assets',
    };
  }

  const baseConcurrency = Math.min(2, Math.max(1, Number(request.concurrency) || 2));
  // Remotion Lambda forbids passing both framesPerLambda and concurrency together.
  // If framesPerLambda is provided, we prioritize it to avoid chunk timeouts for heavy workloads.
  const cleanRequest = {...request};
  const attempts: LambdaRenderRequest[] = [];

  if ((cleanRequest as any).framesPerLambda) {
    delete (cleanRequest as any).concurrency;
    attempts.push({...cleanRequest, maxRetries: 3});
  } else {
    delete (cleanRequest as any).framesPerLambda;
    attempts.push({...cleanRequest, concurrency: baseConcurrency, maxRetries: 3});
    attempts.push({...cleanRequest, concurrency: 1, maxRetries: 3});
  }

  let lastError: unknown;

  for (let index = 0; index < attempts.length; index += 1) {
    try {
      console.log(`[RENDER_INVOKE_ATTEMPT] Attempt ${index + 1}/${attempts.length}`, {
        concurrency: attempts[index].concurrency,
        framesPerLambda: (attempts[index] as any).framesPerLambda,
        maxRetries: attempts[index].maxRetries,
        composition: attempts[index].composition,
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

  try {
    const extracted = await extractAudioFromS3Video(mediaKey, fileName);
    if (extracted.audioUrl && !extracted.error) {
      return {
        audioUrl: extracted.audioUrl,
        audioFileName: extracted.audioFileName,
        contentType: 'audio/mpeg',
        mediaType: 'audio' as const,
      };
    }
    console.warn('[AUDIO_EXTRACT] Audio extraction returned error, falling back to direct video URL:', extracted.error);
  } catch (err) {
    console.warn('[AUDIO_EXTRACT] Exception during audio extraction, falling back to direct video URL:', err);
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
  const shouldClip = maxSeconds > 0 && (mediaType === 'video' || mediaType === 'audio');
  if (!shouldClip) {
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

  try {
    const clip = await createPlanningMediaClip({
      mediaUrl,
      fileName,
      contentType,
      maxSeconds,
    });
    const uploaded = await uploadTemporaryMediaObject({
      body: clip.bytes,
      contentType: clip.contentType,
      fileName: clip.fileName,
      mode: clip.mode,
      userId,
      purpose: 'first-60s',
    });
    const clippedUrl = await createReadUrl(uploaded.key);
    const transcriptionUpload = clip.transcriptionAudio
      ? await uploadTemporaryMediaObject({
          body: clip.transcriptionAudio.bytes,
          contentType: clip.transcriptionAudio.contentType,
          fileName: clip.transcriptionAudio.fileName,
          mode: 'audio',
          userId,
          purpose: 'first-60s-transcript',
        })
      : undefined;
    const transcriptionUrl = transcriptionUpload ? await createReadUrl(transcriptionUpload.key) : clippedUrl;
    return {
      mediaUrl: clippedUrl,
      fileName: clip.fileName,
      contentType: clip.contentType,
      transcriptionMediaUrl: transcriptionUrl,
      transcriptionFileName: clip.transcriptionAudio?.fileName || clip.fileName,
      transcriptionContentType: clip.transcriptionAudio?.contentType || clip.contentType,
      mediaKey: uploaded.key,
      transcriptionMediaKey: transcriptionUpload?.key,
      clipped: true,
      maxSeconds: clip.maxSeconds,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Media clipping failed.';
    console.error('Planning media clip failed', {
      message: sanitizeUserFacingStatus(message),
      contentType,
      mediaType,
      fileName: sanitizeSegment(fileName),
    });
    if (mediaType === 'video') {
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
        error: undefined,
      };
    }
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
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
  language?: string;
  outputLanguage?: string;
  maxSeconds?: number;
}) {
  let primaryWarning = '';
  try {
    const groqStart = Date.now();
    const result = await transcribeMediaUrlWithGroq({mediaUrl, fileName, contentType, language, maxSeconds});
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

  const minHoldSeconds = 4;
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
      (heldFor >= minHoldSeconds && (intentChanged || sentenceEnded)) ||
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
  if (index === 0) return 'sticker_welcome_intro_explainer';
  if (index >= total - 1) return 'sticker_happy_celebrating_outro';
  if (/[?]/.test(text) || /\b(question|confus|doubt|which|kaunsa|konsa|kya farq|kya difference|why|how)\b/i.test(text)) return 'sticker_questioning_surprised_explainer';
  if (/\b(risk|problem|mistake|warning|issue|loss|avoid|danger|galti|nuksan)\b/i.test(text)) return 'sticker_warning_issue_explainer';
  if (left && right && text.includes(left) && text.includes(right)) return 'sticker_comparing_both_sides_explainer';
  if (right && text.includes(right)) return 'sticker_pointing_right_side_explainer';
  if (left && text.includes(left)) return 'sticker_pointing_left_side_explainer';
  if (/\b(vs|compare|comparison|difference|better|both|dono|tradeoff)\b/i.test(text)) return 'sticker_comparing_both_sides_explainer';
  if (/\b(final|conclusion|winner|best|benefit|yaad rakho|remember|clear)\b/i.test(text)) return 'sticker_success_conclusion_explainer';
  const progress = total > 1 ? index / (total - 1) : 0;
  if (progress < 0.28) return 'sticker_pointing_left_side_explainer';
  if (progress < 0.55) return 'sticker_comparing_both_sides_explainer';
  if (progress < 0.78) return 'sticker_pointing_right_side_explainer';
  return 'sticker_success_conclusion_explainer';
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
 * Generates natural, readable widescreen (16:9) captions for YouTube explainer / documentary videos.
 * Unlike vertical 9:16 reels which break every 1-4 words, 16:9 widescreen has ample horizontal space,
 * so captions group full thoughts, clauses, or sentences (8-12 words, 2.5-4.0s) for comfortable reading.
 */
function buildWidescreen16x9Captions(renderWindow: {
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

    // Tuned specifically for 16:9 widescreen:
    // Full sentence lines or clauses: 8-12 words, up to 3.8s, max 65 chars
    const MAX_WORDS = 11;
    const MAX_SECONDS = 3.8;
    const MAX_CHARS = 65;
    const PAUSE_GAP_SECONDS = 0.55;

    const flush = () => {
      if (!group.length) return;
      captions.push({
        start: roundSeconds(group[0].start),
        end: roundSeconds(Math.max(group[group.length - 1].end, group[0].start + 0.8)),
        text: group.map((item) => item.word).join(' '),
        words: group.map((item) => ({word: item.word, start: roundSeconds(item.start), end: roundSeconds(item.end)})),
      });
      group = [];
    };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (group.length) {
        const groupStart = group[0].start;
        const lastWord = group[group.length - 1];
        const currentChars = group.reduce((total, item) => total + item.word.length + 1, 0);
        const endsSentence = /[.!?:]$/.test(lastWord.word);
        const isClauseBreak = /[,;-]$/.test(lastWord.word) && (group.length >= 6 || word.start - groupStart >= 2.2);
        const pause = word.start - lastWord.end;
        const shouldBreak =
          group.length >= MAX_WORDS ||
          word.end - groupStart > MAX_SECONDS ||
          currentChars + word.word.length + 1 > MAX_CHARS ||
          pause > PAUSE_GAP_SECONDS ||
          endsSentence ||
          isClauseBreak;
        if (shouldBreak) flush();
      }
      group.push(word);
    }
    flush();

    // Merge a tiny orphan final group (1-2 words) into previous caption for clean presentation
    if (captions.length >= 2) {
      const last = captions[captions.length - 1];
      const lastWordCount = last.words?.length ?? last.text.split(/\s+/).length;
      if (lastWordCount <= 2 && last.end - last.start < 1.0) {
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
      const chunkSize = 10;
      const duration = Math.max(1.0, Number(segment.end) - Number(segment.start));
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
  const chunkSize = 10;
  const totalChunks = Math.max(1, Math.ceil(fallbackWords.length / chunkSize));

  return Array.from({length: totalChunks}).map((_, index) => ({
    start: roundSeconds((fallbackDuration / totalChunks) * index),
    end: roundSeconds((fallbackDuration / totalChunks) * (index + 1)),
    text: fallbackWords.slice(index * chunkSize, index * chunkSize + chunkSize).join(' '),
  })).filter((caption) => caption.text.trim());
}

/**
 * Creates dynamic, high-retention image scenes for 16:9 YouTube explainers and documentaries.
 * Paces image cuts frequently (~2.2s - 3.5s per cut, aligned with script lines, sentences, or pauses).
 * Never lets an image linger longer than 3.6s without a camera motion cut or new visual.
 */
function buildWidescreen16x9Scenes(options: {
  renderWindow: {
    transcript: string;
    words?: ReelWord[];
    segments?: ReelTranscriptSegment[];
    durationSeconds: number;
  };
  imagePool: string[];
  cameraMotionPreset: string;
  fitMode: 'blur-fill' | 'cover';
}) {
  const { renderWindow, imagePool, cameraMotionPreset, fitMode } = options;
  const totalDuration = Math.max(1, renderWindow.durationSeconds);

  let motions: Array<'zoom-in' | 'pan-left' | 'zoom-out' | 'pan-right' | 'pan-up' | 'pan-down'>;
  let transitions: Array<'dissolve' | 'push-left' | 'dissolve' | 'push-right' | 'hard-cut'>;

  if (cameraMotionPreset === 'dynamic-flow') {
    motions = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'pan-up', 'pan-down'];
    transitions = ['push-left', 'dissolve', 'push-right', 'hard-cut', 'dissolve'];
  } else if (cameraMotionPreset === 'subtle-drift') {
    motions = ['zoom-in', 'zoom-out', 'zoom-in', 'zoom-out', 'pan-left', 'pan-right'];
    transitions = ['dissolve', 'dissolve', 'dissolve'];
  } else {
    // Default: ken-burns cinematic documentary pacing
    motions = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'pan-up', 'zoom-in'];
    transitions = ['dissolve', 'push-left', 'dissolve', 'push-right', 'dissolve'];
  }

  const scenes: Array<{
    id: string;
    startSeconds: number;
    endSeconds: number;
    imageUrl?: string;
    text: string;
    cameraMotion: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
    transition: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
    fitMode?: 'blur-fill' | 'cover';
    sceneType?: 'image' | 'typography';
    typographyPrimary?: string;
    typographySecondary?: string;
    typographyAccent?: string;
  }> = [];

  const extractProminentTypoMetric = (text: string): { primary: string; secondary: string; accent: string } | null => {
    if (!text) return null;
    const moneyMatch = text.match(/(?:[\$₹£€]\s*[\d,]+(?:\.\d+)?(?:\s*(?:k|m|b|lakh|crore|million|billion|thousand))?|[\d,]+(?:\.\d+)?\s*(?:dollars|rupees|percent|%|k|m|b))/i);
    if (moneyMatch) {
      return {
        primary: moneyMatch[0].toUpperCase(),
        secondary: text.length > 55 ? text.slice(0, 52) + '...' : text,
        accent: 'KEY METRIC',
      };
    }
    const pctMatch = text.match(/\b\d+[\d,.]*(?:%|x\b)/i);
    if (pctMatch) {
      return {
        primary: pctMatch[0].toUpperCase(),
        secondary: text.length > 55 ? text.slice(0, 52) + '...' : text,
        accent: 'THE DIFFERENCE',
      };
    }
    const stepMatch = text.match(/\b(step|chapter|rule|phase|secret|day|year)\s*#?\d+\b/i);
    if (stepMatch) {
      return {
        primary: stepMatch[0].toUpperCase(),
        secondary: text.length > 55 ? text.slice(0, 52) + '...' : text,
        accent: 'TURNING POINT',
      };
    }
    return null;
  };

  const words = (renderWindow.words || [])
    .filter((w) => readString(w.word) && Number.isFinite(w.start) && Number.isFinite(w.end))
    .map((w) => ({
      word: readString(w.word),
      start: Math.max(0, Number(w.start)),
      end: Math.max(Number(w.start) + 0.1, Number(w.end)),
    }));

  if (words.length > 5) {
    // Cut based on script lines & natural sentence boundaries
    let sceneStartIndex = 0;
    let sceneStartSec = words[0].start;

    for (let i = 0; i < words.length; i++) {
      const currentWord = words[i];
      const nextWord = i < words.length - 1 ? words[i + 1] : null;
      const durationSoFar = currentWord.end - sceneStartSec;
      const endsSentence = /[.!?]$/.test(currentWord.word);
      const endsClause = /[,;:-]$/.test(currentWord.word);
      const speechPause = nextWord ? (nextWord.start - currentWord.end) : 0;

      const isLastWord = i === words.length - 1;
      const shouldCut =
        isLastWord ||
        // Sentence finished and scene has played at least 2.0 seconds
        (endsSentence && durationSoFar >= 2.0) ||
        // Clause finished and scene has played at least 2.5 seconds
        (endsClause && durationSoFar >= 2.5) ||
        // Natural speech pause between phrases and scene has played at least 2.0 seconds
        (speechPause > 0.38 && durationSoFar >= 2.0) ||
        // Hard maximum duration: keep cuts frequent (max 3.6 seconds per cut)
        (durationSoFar >= 3.6);

      if (shouldCut) {
        const sceneWords = words.slice(sceneStartIndex, i + 1);
        const sceneEndSec = isLastWord ? totalDuration : currentWord.end;
        const sceneIndex = scenes.length;
        const sceneText = sceneWords.map((w) => w.word).join(' ');
        const typo = extractProminentTypoMetric(sceneText);
        const shouldUseTypography = Boolean(typo && (sceneIndex % 7 === 0 || imagePool.length === 0));

        scenes.push({
          id: `scene-${sceneIndex + 1}`,
          startSeconds: roundSeconds(sceneStartSec),
          endSeconds: roundSeconds(sceneEndSec),
          imageUrl: imagePool.length > 0 ? imagePool[sceneIndex % imagePool.length] : undefined,
          text: sceneText,
          cameraMotion: motions[sceneIndex % motions.length],
          transition: transitions[sceneIndex % transitions.length],
          fitMode,
          sceneType: shouldUseTypography ? 'typography' : 'image',
          typographyPrimary: typo ? typo.primary : undefined,
          typographySecondary: typo ? typo.secondary : undefined,
          typographyAccent: typo ? typo.accent : undefined,
        });

        if (nextWord) {
          sceneStartIndex = i + 1;
          sceneStartSec = nextWord.start;
        }
      }
    }
  } else if (renderWindow.segments && renderWindow.segments.length > 0) {
    // If only segments available, split segments > 3.6s into 2.5-3.2s sub-scenes
    renderWindow.segments.forEach((seg) => {
      const segStart = Math.max(0, Number(seg.start) || 0);
      const segEnd = Math.min(totalDuration, Number(seg.end) || (segStart + 3));
      const segDur = Math.max(1, segEnd - segStart);
      const subSceneCount = Math.max(1, Math.ceil(segDur / 3.2));
      const subDur = segDur / subSceneCount;

      for (let s = 0; s < subSceneCount; s++) {
        const start = segStart + s * subDur;
        const end = s === subSceneCount - 1 ? segEnd : start + subDur;
        const sceneIndex = scenes.length;
        const segText = s === 0 ? String(seg.text || '').trim() : '';
        const typo = extractProminentTypoMetric(segText);
        const shouldUseTypography = Boolean(typo && (sceneIndex % 7 === 0 || imagePool.length === 0));

        scenes.push({
          id: `scene-${sceneIndex + 1}`,
          startSeconds: roundSeconds(start),
          endSeconds: roundSeconds(end),
          imageUrl: imagePool.length > 0 ? imagePool[sceneIndex % imagePool.length] : undefined,
          text: segText,
          cameraMotion: motions[sceneIndex % motions.length],
          transition: transitions[sceneIndex % transitions.length],
          fitMode,
          sceneType: shouldUseTypography ? 'typography' : 'image',
          typographyPrimary: typo ? typo.primary : undefined,
          typographySecondary: typo ? typo.secondary : undefined,
          typographyAccent: typo ? typo.accent : undefined,
        });
      }
    });
  } else {
    // Fallback: dynamic 3.0-second rapid cuts across the whole duration
    const sceneCount = Math.max(1, Math.ceil(totalDuration / 3.0));
    const sceneDuration = totalDuration / sceneCount;
    for (let idx = 0; idx < sceneCount; idx++) {
      const start = idx * sceneDuration;
      const end = idx === sceneCount - 1 ? totalDuration : (idx + 1) * sceneDuration;
      scenes.push({
        id: `scene-${idx + 1}`,
        startSeconds: roundSeconds(start),
        endSeconds: roundSeconds(end),
        imageUrl: imagePool[idx % imagePool.length],
        text: '',
        cameraMotion: motions[idx % motions.length],
        transition: transitions[idx % transitions.length],
        fitMode,
      });
    }
  }

  // Ensure 100% contiguous timeline from 0 to totalDuration without gaps or overlaps
  if (scenes.length > 0) {
    scenes[0].startSeconds = 0;
    for (let i = 0; i < scenes.length - 1; i++) {
      if (scenes[i + 1].startSeconds <= scenes[i].startSeconds + 0.5) {
        scenes[i + 1].startSeconds = scenes[i].startSeconds + 0.5;
      }
      scenes[i].endSeconds = scenes[i + 1].startSeconds;
    }
    scenes[scenes.length - 1].endSeconds = totalDuration;
  }

  return scenes;
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
  if (normalized.includes('image-to-video') || normalized.includes('imagetovideo') || normalized.includes('image_to_video')) return 'imageToVideoAi';
  if (normalized.includes('ai-video-generator') || normalized.includes('aivideogenerator') || normalized.includes('aivideo') || normalized.includes('ai-video') || normalized.includes('text-to-video') || normalized.includes('script-to-video')) return 'aiVideoGenerator';
  if (normalized.includes('faceless') || normalized.includes('audio-to-video') || normalized.includes('longvideopro') || normalized.includes('long-video-pro')) return 'aiVideoGenerator';
  if (normalized.includes('compare') || normalized.includes('comparison') || normalized === 'vs') return 'compare';
  if (normalized.includes('long-video-clip') || normalized.includes('longvideoclip') || normalized.includes('video-clips')) return 'longVideoClips';
  if (normalized.includes('long-video') || normalized.includes('longvideo') || normalized.includes('promo')) return 'longVideoPromo';
  if (normalized.includes('whiteboard') || normalized.includes('white-board')) return 'whiteboardVideo';
  if (normalized.includes('typography') || normalized.includes('typo-video') || normalized.includes('bold-reel')) return 'typographyVideo';
  if (normalized.includes('auto-caption') || normalized.includes('autocaption') || normalized.includes('caption') || normalized.includes('subtitle') || normalized.includes('captionstudio') || normalized.includes('long-form-captioned') || normalized.includes('longcaption')) return 'autoCaption';
  return null;
}

function getUploadedMediaType({mode, contentType}: {mode: ReelMode; contentType: string}): 'audio' | 'video' | 'image' {
  if (mode === 'autoCaption') return 'video';
  if (mode === 'compare') return 'audio';
  if (mode === 'imageToVideoAi') return 'audio';
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

  if ((templateName === 'VIDEO_CAPTION' || templateName === 'AUTO_CAPTION_GENERATOR') && mediaType !== 'video') {
    return {
      reasonCode: 'VIDEO_CAPTION_REQUIRES_VIDEO',
      message: 'Auto Caption Generator needs a video upload before render.',
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
  if (/background replace video is temporarily unavailable|background replace worker is not configured|background_replace_worker_not_configured|background_replace_worker_not_ready|creator_bg_replace_worker_url|background_replace_worker_url|background processor is not ready|creator-background-replace-preflight/.test(normalized)) {
    return 'Background Replace Video is temporarily unavailable. Please try again later or choose another video type.';
  }
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
