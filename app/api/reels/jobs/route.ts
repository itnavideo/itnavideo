import {NextResponse} from 'next/server';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {renderMediaOnLambda, type AwsRegion} from '@remotion/lambda/client';
import {createReadUrl, TEMP_MEDIA_RENDER_PREFIX, uploadTemporaryMediaObject} from '@/lib/aws/mediaStorage';
import {transcribeMediaUrlWithGroq, transcribeMediaUrlWithOpenAI} from '@/services/ai/groqTranscription';
import {createReelPlan, REEL_TEMPLATE_REGISTRY, validateAndRepairReelPlan, type ReelTemplateName, type ReelTranscriptSegment, type ReelWord} from '@/services/ai/reelPlanner';
import {readUnifiedAssets} from '@/services/ai/assetPicker';
import {hasHindiUrduScript, hasRomanHinglish} from '@/services/ai/hinglishTranscript';
import {checkRateLimit, getClientIp} from '@/services/rateLimit/inMemoryRateLimiter';
import {getRenderAccessForUser} from '@/services/billing/renderAccess';
import {createPlanningMediaClip} from '@/services/media/mediaClipper';
import {buildEnergyTimeline, findBeatPeaks} from '@/lib/audio/energyTimeline';
import {createPremiumSoundCues, createPremiumStyleLock} from '@/services/ai/premiumStylePlanner';
import {planCompareStickers} from '@/services/ai/compareStickerPlanner';
import {planWhiteboardVideo} from '@/services/ai/whiteboardPlanner';
import {planTypographyVideo} from '@/services/ai/typographyPlanner';
import {SUBTITLE_PRESETS} from '@/remotion/types/subtitles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LambdaRenderRequest = Parameters<typeof renderMediaOnLambda>[0];
type ReelMode =
  | 'compare' | 'autoCaption' | 'longVideoPromo' | 'whiteboardVideo' | 'typographyVideo';

const MODE_TO_TEMPLATE: Partial<Record<ReelMode, ReelTemplateName>> = {
  compare: 'comparisonImages',
  autoCaption: 'AUTO_CAPTION_REEL',
  longVideoPromo: 'LONG_VIDEO_PROMO',
  whiteboardVideo: 'WHITEBOARD_VIDEO',
  typographyVideo: 'TYPOGRAPHY_VIDEO',
};

const MAX_RENDER_WINDOW_SECONDS = 60;

const SUBTITLE_LANGUAGE_POLICY = 'General translation policy';
const getSubtitlePolicy = (lang: string) => `Subtitle language policy: Generate subtitles strictly in ${lang}. If the script is non-Latin (like Kannada, Telugu, Urdu), use the native script. If it's a Latin-script language, use the appropriate alphabet. Ensure accurate synchronization with the audio timing.`;
const DEFAULT_PLANNING_MEDIA_SECONDS = 60;
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
  const explanationImageKey = readString(body.explanationImageKey);
  const promoThumbnailImageKey = readString(body.thumbnailKey);
  const topicTitle = readString(body.topicTitle);
  const design = toDesign(readString(body.design));
  const languageHint = toLanguageHint(readString(body.language || body.displayLanguage || body.typographyLanguage));

  // Preview-edited captions/scenes — if present, skip transcription+planning and use these directly
  const previewCaptions = Array.isArray(body.previewCaptions) ? body.previewCaptions as Array<{start: number; end: number; text: string; words?: unknown[]}> : null;
  const previewScenes = Array.isArray(body.previewScenes) ? body.previewScenes : null;
  const previewOverlayTimeline = Array.isArray(body.previewOverlayTimeline) ? body.previewOverlayTimeline : null;
  const requestedMode = readString(body.mode || body.templateName || body.template || body.compositionId);
  if (!requestedMode) {
    return NextResponse.json({ok: false, status: 'failed', reasonCode: 'MISSING_TEMPLATE', error: 'Please select a video type before creating a reel.'}, {status: 400});
  }
  const requestedModeValue = toMode(requestedMode);
  const resolvedTemplateName = resolveTemplateNameFromRequest(readString(body.templateName || body.template || requestedMode)) || (requestedModeValue ? MODE_TO_TEMPLATE[requestedModeValue] : null) || null;
  const mode: ReelMode = requestedModeValue || toMode(resolvedTemplateName || '') || 'autoCaption';
  const templateConfig = resolvedTemplateName ? REEL_TEMPLATE_REGISTRY[resolvedTemplateName] : null;
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
  const rateLimit = checkRateLimit({
    key: `reels-job:${userId || ip}`,
    limit: userId ? 20 : 8,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ok: false, error: 'Too many render jobs. Please wait a minute and try again.'}, {status: 429});
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
  if (mode === 'compare') {
    if (contentType && !contentType.startsWith('audio/')) {
      return NextResponse.json({ok: false, error: 'Compare requires one audio voiceover file.'}, {status: 400});
    }
    if (comparisonImageKeys.length !== 2) {
      return NextResponse.json({ok: false, error: 'Compare requires exactly 2 visuals: one left and one right.'}, {status: 400});
    }
  }

  try {
    const access = await getRenderAccessForUser(userId);
    markTiming('access_check_ms');
    if (!access.allowed) {
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
    const comparisonImageUrls = mode === 'compare'
      ? (await Promise.all(
          comparisonImageKeys.map(async (key: string) => readString(await createReadUrl(key))),
        )).filter(Boolean).slice(0, 2)
      : [];
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
      const promoFramesPerLambda = Math.min(Number(config.framesPerLambda || 120), 120);
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
        concurrency: undefined,
        framesPerLambda: promoFramesPerLambda,
        maxRetries: 2,
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

    const planningMedia = await preparePlanningMediaForRender({
      mediaUrl,
      fileName,
      contentType,
      mediaType: mediaType === 'image' ? 'video' : mediaType,
      userId,
    });
    if (planningMedia.error && !planningMedia.transcriptionMediaUrl) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: 'MEDIA_CLIP_PREP_FAILED',
          error: 'We could not prepare the 1 minute video clip. Please try again or upload a standard MP4 file.',
          detail: process.env.NODE_ENV !== 'production' ? planningMedia.error : undefined,
        },
        {status: 422},
      );
    }

    const subtitleLang = normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage));
    console.log('[PIPELINE] subtitleLang:', subtitleLang || 'auto-source', '| mode:', mode, '| template:', templateName);

    let transcription: PlanningTranscription;
    const transcribeStart = Date.now();
    try {
      transcription = await transcribeForPlanning({
        mediaUrl: planningMedia.transcriptionMediaUrl,
        fileName: planningMedia.transcriptionFileName,
        contentType: planningMedia.transcriptionContentType,
        mediaType: mediaType === 'image' ? 'video' : mediaType,
        outputLanguage: subtitleLang,
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
    const renderWindow = selectRenderWindow(transcription);
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
    const captionStyleValue = readString(body.captionStyle) || 'Studio Clean';
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
              ? previewCaptions.map((c) => ({start: Number(c.start), end: Number(c.end), text: String(c.text), words: Array.isArray(c.words) ? c.words : undefined}))
              : buildCompareCaptionsFromGroq(renderWindow);
            const rawOverlayTimeline = previewOverlayTimeline
              ? previewOverlayTimeline.map((item: unknown, index: number) => {
                  const overlay = item && typeof item === 'object' ? item as Record<string, unknown> : {};
                  const start = Number(overlay.start ?? finalCaptions[index]?.start ?? 0);
                  return {
                    id: readString(overlay.id) || `compare-beat-${index + 1}`,
                    start,
                    end: Number(overlay.end ?? finalCaptions[index]?.end ?? (start + 2.5)),
                    text: readString(overlay.text || overlay.body || finalCaptions[index]?.text),
                    body: readString(overlay.body || overlay.text || finalCaptions[index]?.text),
                    title: readString(overlay.title),
                    stickerPose: readString(overlay.stickerPose || overlay.pose) || undefined,
                    pose: readString(overlay.pose || overlay.stickerPose) || undefined,
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

            // ── AI Sticker Planner: overrides keyword-based poses with intentional AI-planned ones ──
            const stickerPlanResult = await planCompareStickers({
              transcript: renderWindow.transcript,
              segments: finalCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              leftTitle: compareLeftTitleValue,
              rightTitle: compareRightTitleValue,
              durationSeconds: renderWindow.durationSeconds,
            });

            // Apply AI plan poses to the overlay timeline
            const aiPlannedOverlayTimeline = applyStickerPlanToOverlays(finalOverlayTimeline, stickerPlanResult.plan);
            console.log('[COMPARE_STICKER_PLANNER]', { source: stickerPlanResult.source, poseCount: stickerPlanResult.plan.length, overlayCount: aiPlannedOverlayTimeline.length });

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
            compareLeftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            compareRightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            leftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            rightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            imageSources: comparisonImageUrls,
            captions: finalCaptions,
            transcriptSegments: finalCaptions,
            overlayTimeline: aiPlannedOverlayTimeline,
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
            const wbPlan = await planWhiteboardVideo({
              transcript: renderWindow.transcript,
              segments: wbCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              durationSeconds: renderWindow.durationSeconds,
              topicTitle: topicTitle || undefined,
            });
            console.log('[WHITEBOARD_PLANNER]', { source: wbPlan.source, title: wbPlan.title, pointCount: wbPlan.points.length });
            return {
              title: wbPlan.title,
              titleColor: wbPlan.titleColor,
              points: wbPlan.points,
              conclusion: wbPlan.conclusion,
              conclusionTime: wbPlan.conclusionTime,
              captions: wbCaptions,
              durationSeconds: renderWindow.durationSeconds,
              transcript: renderWindow.transcript,
              overlayTimeline: [],
              assetTimeline: [],
            };
          })()
        : {}),
      ...(mode === 'typographyVideo'
        ? (() => {
            const typoCaptions = buildCompareCaptionsFromGroq(renderWindow);
            const typoPlan = planTypographyVideo({
              transcript: renderWindow.transcript,
              words: (renderWindow.words || []).map((w: any) => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) })),
              segments: typoCaptions.map((c) => ({ start: c.start, end: c.end, text: c.text })),
              durationSeconds: renderWindow.durationSeconds,
            });
            console.log('[TYPOGRAPHY_PLANNER]', { keywordCount: typoPlan.keywords.length });
            return {
              keywords: typoPlan.keywords,
              typographyStyle: readString(body.typographyStyle) || 'silver-chrome',
              captions: typoCaptions,
              durationSeconds: renderWindow.durationSeconds,
              transcript: renderWindow.transcript,
              overlayTimeline: [],
              assetTimeline: [],
            };
          })()
        : {}),
      mediaType,
      mediaFit: templateConfig.mediaFit,
      captionStyle: captionStyleValue,
      captionPosition: readString(body.captionPosition) || 'bottom',
      fontFamily: readString(body.captionFontFamily || body.fontFamily) || captionPreset?.fontFamily || undefined,
      fontSize: readString(body.captionFontSize || body.fontSize) || captionPreset?.fontSize || 'large',
      subtitleOutputLanguage: normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage)) || '',
      textColor: readString(body.captionTextColor) || captionPreset?.textColor || '#ffffff',
      highlightColor: readString(body.captionHighlightColor) || captionPreset?.highlightColor || '#facc15',
      backgroundColor: captionBackgroundColorValue || captionPreset?.backgroundColor || '#18181B',
      showBackground: typeof body.captionShowBackground === 'boolean'
        ? body.captionShowBackground
        : Boolean(captionBackgroundColorValue || captionPreset?.backgroundColor),
      videoLayout: mode === 'autoCaption' ? 'fullscreen' : readString(body.videoLayout) || 'fullscreen',
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
      backgroundMusic: mode === 'autoCaption' ? false : plan.renderProps?.backgroundMusic !== false,
      backgroundMusicMood: readString(plan.renderProps?.backgroundMusicMood) || music.mood,
      backgroundMusicSrc: readString(plan.renderProps?.backgroundMusicSrc) || music.src,
      backgroundMusicVolume: Number.isFinite(Number(plan.renderProps?.backgroundMusicVolume))
        ? Math.min(0.04, Math.max(0.012, Number(plan.renderProps?.backgroundMusicVolume)))
        : music.volume,
      sourceAudioVolume: 1.35,
      subtitleLanguagePolicy: SUBTITLE_LANGUAGE_POLICY,
      backgroundMusicCategory: readString(plan.renderProps?.backgroundMusicCategory) || music.category,
      premiumEditing: mode !== 'autoCaption',
      styleLock: mode === 'autoCaption' ? undefined : styleLock,

      ...(mode === 'compare'
        ? {
            captions: buildCompareCaptionsFromGroq(renderWindow),
            transcriptSegments: renderWindow.segments || [],
            transcript: renderWindow.transcript,
            sourceScript: renderWindow.transcript,
          }
        : {}),
    };
    if (mode !== 'autoCaption') {
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
      console.log('[AUTO_CAPTION_REEL] Render props debug:', {
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
      concurrency: config.framesPerLambda ? undefined : config.concurrency,
      framesPerLambda: config.framesPerLambda,
      maxRetries: 1,
      downloadBehavior: {
        type: 'download',
        fileName: mode === 'autoCaption' ? 'itnavideo-auto-caption-reel.mp4' : 'itnavideo-reel.mp4',
      },
      isProduction: true,
      logLevel: 'info',
    };
    const render = await startRenderWithCapacityRetry(renderRequest);

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
  | {ok: true; region: AwsRegion; functionName: string; serveUrl: string; concurrency: number; framesPerLambda?: number}
  | {ok: false; error: string} {
  const region = readAwsRegion(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION);
  const functionName = clean(process.env.REMOTION_LAMBDA_FUNCTION_NAME);
  const serveUrl = normalizeServeUrl(clean(process.env.REMOTION_LAMBDA_SERVE_URL));
  const configuredConcurrency = Number(process.env.REMOTION_LAMBDA_CONCURRENCY || 6);
  const concurrency = Math.min(8, Math.max(2, Number.isFinite(configuredConcurrency) ? configuredConcurrency : 6));
  const useFramesPerLambda = clean(process.env.REMOTION_LAMBDA_USE_FRAMES_PER_LAMBDA).toLowerCase() !== 'false';
  const configuredFramesPerLambda = Number(process.env.REMOTION_LAMBDA_FRAMES_PER_LAMBDA || 200);
  const framesPerLambda = useFramesPerLambda && Number.isFinite(configuredFramesPerLambda)
    ? Math.min(300, Math.max(120, configuredFramesPerLambda))
    : undefined;
  if (!functionName || !serveUrl) {
    return {ok: false, error: 'The render system is not deployed yet.'};
  }
  return {ok: true, region, functionName, serveUrl, concurrency, framesPerLambda};
}

function normalizeServeUrl(value: string) {
  if (!value) return value;
  return value.includes(REQUIRED_RENDER_SITE_PATH)
    ? value
    : '';
}

async function startRenderWithCapacityRetry(request: LambdaRenderRequest) {
  const retryFramesPerLambda = Math.max(Number(request.framesPerLambda || 200), 300);
  const attempts: LambdaRenderRequest[] = [
    request,
    {...request, concurrency: undefined, framesPerLambda: retryFramesPerLambda, maxRetries: 1},
    {...request, concurrency: 2, framesPerLambda: undefined, maxRetries: 1},
    // Extra attempt: minimal concurrency, generous framesPerLambda
    {...request, concurrency: 1, framesPerLambda: undefined, maxRetries: 1},
  ];
  let lastError: unknown;

  for (let index = 0; index < attempts.length; index += 1) {
    try {
      return await renderMediaOnLambda(attempts[index]);
    } catch (error) {
      lastError = error;
      if (!isTemporaryRenderCapacityError(error) || index === attempts.length - 1) {
        throw error;
      }
      // Progressive backoff: 4s, 8s, 14s
      await sleep([4000, 8000, 14000][index] ?? 14000);
    }
  }

  throw lastError;
}

function isTemporaryRenderCapacityError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/i.test(message);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function preparePlanningMediaForRender({
  mediaUrl,
  fileName,
  contentType,
  mediaType,
  userId,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
  userId: string;
}) {
  const maxSeconds = readPlanningMediaMaxSeconds();
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
  outputLanguage,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
  outputLanguage?: string;
}) {
  let primaryWarning = '';
  try {
    const groqStart = Date.now();
    const result = await transcribeMediaUrlWithGroq({mediaUrl, fileName, contentType});
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
    console.error('Primary transcription failed', {
      message: sanitizeUserFacingStatus(primaryWarning),
      contentType,
      mediaType,
    });
  }

  try {
    const fallback = await transcribeMediaUrlWithOpenAI({mediaUrl, fileName, contentType});
    if (fallback.transcript) {
      if (!outputLanguage) {
        return {...fallback, source: 'openai' as const, warning: sanitizeUserFacingStatus(primaryWarning)};
      }
      return await repairTranscriptionToLanguage({
        ...fallback,
        source: 'openai' as const,
        warning: sanitizeUserFacingStatus(primaryWarning),
      }, outputLanguage);
    }
    throw new Error(fallback.warning || 'OpenAI transcription returned an empty result.');
  } catch (error) {
    console.error('Fallback transcription failed', {
      primary: sanitizeUserFacingStatus(primaryWarning),
      fallback: sanitizeUserFacingStatus(error instanceof Error ? error.message : 'OpenAI transcription failed.'),
      contentType,
      mediaType,
    });
    return {
      transcript: '',
      durationSeconds: 0,
      source: 'failed' as const,
      model: process.env.OPENAI_TRANSCRIPTION_MODEL || 'whisper-1',
      languageHint: undefined,
      warning: sanitizeUserFacingStatus(
        `Transcription failed. Primary: ${primaryWarning}. Fallback: ${error instanceof Error ? error.message : 'OpenAI transcription failed.'}`,
      ),
    };
  }
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
  source: 'groq' | 'openai';
};

const LANGUAGE_NAMES: Record<string, string> = {
  english: 'English',
  hinglish: 'clean Roman Hinglish (Hindi words in Latin script mixed with English)',
  hindi: 'Hindi in Devanagari script',
  urdu: 'Urdu in Urdu/Arabic script',
  kannada: 'Kannada in Kannada script',
  tamil: 'Tamil in Tamil script',
  farsi: 'Farsi/Persian in Persian script',
  arabic: 'Arabic in Arabic script',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  portuguese: 'Portuguese',
  indonesian: 'Indonesian',
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
    const captions: Array<{start: number; end: number; text: string; words?: Array<{word: string; start: number; end: number}>}> = [];
    let group: typeof words = [];

    const flush = () => {
      if (!group.length) return;
      captions.push({
        start: roundSeconds(group[0].start),
        end: roundSeconds(Math.max(group[group.length - 1].end, group[0].start + 0.65)),
        text: group.map((item) => item.word).join(' '),
        words: group.map((item) => ({word: item.word, start: roundSeconds(item.start), end: roundSeconds(item.end)})),
      });
      group = [];
    };

    for (const word of words) {
      const groupStart = group[0]?.start ?? word.start;
      const tooManyWords = group.length >= 5;
      const tooLong = word.end - groupStart > 1.55;
      if (group.length && (tooManyWords || tooLong)) flush();
      group.push(word);
    }

    flush();
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

function selectRenderWindow(transcription: PlanningTranscription): {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
  trimStartSeconds: number;
  source: 'voice-activity' | 'timestamp-segment' | 'start';
} {
  const sourceDuration = Number.isFinite(transcription.durationSeconds || 0) && (transcription.durationSeconds || 0) > 0
    ? transcription.durationSeconds || MAX_RENDER_WINDOW_SECONDS
    : MAX_RENDER_WINDOW_SECONDS;
  const speechActivity = findFirstSpeechActivity(transcription);
  const maxTrimStart = Math.max(0, sourceDuration - MAX_RENDER_WINDOW_SECONDS);
  const trimStartSeconds = Math.min(maxTrimStart, Math.max(0, speechActivity.startSeconds - SPEECH_LEAD_SECONDS));
  const trimEndSeconds = Math.min(sourceDuration, trimStartSeconds + MAX_RENDER_WINDOW_SECONDS);
  const durationSeconds = Math.max(1, Math.min(MAX_RENDER_WINDOW_SECONDS, trimEndSeconds - trimStartSeconds));
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
  const registryMatch = Object.keys(REEL_TEMPLATE_REGISTRY).find((templateKey) => (
    templateKey.toLowerCase().replace(/[-_\s]+/g, '') === lookup
  ));
  if (registryMatch) return registryMatch as ReelTemplateName;

  const mode = toMode(value);
  return mode ? MODE_TO_TEMPLATE[mode] || null : null;
}

function toMode(value: string): ReelMode | null {
  const normalized = value.toLowerCase();
  if (normalized.includes('compare') || normalized.includes('comparison') || normalized === 'vs') return 'compare';
  if (normalized.includes('long-video') || normalized.includes('longvideo') || normalized.includes('promo')) return 'longVideoPromo';
  if (normalized.includes('whiteboard') || normalized.includes('white-board')) return 'whiteboardVideo';
  if (normalized.includes('typography') || normalized.includes('typo-video') || normalized.includes('bold-reel')) return 'typographyVideo';
  if (normalized.includes('auto-caption') || normalized.includes('autocaption')) return 'autoCaption';
  if (normalized.includes('caption') || normalized.includes('subtitle')) return 'autoCaption';
  return null;
}

function getUploadedMediaType({mode, contentType}: {mode: ReelMode; contentType: string}): 'audio' | 'video' | 'image' {
  if (mode === 'autoCaption') return 'video';
  if (mode === 'compare') return 'audio';
  if (mode === 'whiteboardVideo') return contentType.startsWith('video/') ? 'video' : 'audio';
  if (mode === 'typographyVideo') return 'video';
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

function normalizeSubtitleLanguage(value: string): 'english' | 'hinglish' | undefined {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  if (!normalized || normalized === 'auto' || normalized === 'source') return undefined;
  if (normalized === 'english' || normalized === 'en') return 'english';
  if (normalized === 'hinglish' || normalized === 'romanenglish' || normalized === 'romanhindi' || normalized === 'romanurdu' || normalized === 'hindi' || normalized === 'urdu' || normalized === 'hi' || normalized === 'ur') return 'hinglish';
  return undefined;
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
  const templateConfig = REEL_TEMPLATE_REGISTRY[templateName];
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
  if (!renderDuration || renderDuration > MAX_RENDER_WINDOW_SECONDS) {
    return {
      reasonCode: 'INVALID_RENDER_DURATION',
      message: 'Render duration must be between 1 second and 1 minute.',
    };
  }

  if (!readString(inputProps.mediaSrc)) {
    return {
      reasonCode: 'MISSING_MEDIA_SOURCE',
      message: `${humanTemplateName(templateName)} needs uploaded media before render.`,
    };
  }

  if ((templateName === 'VIDEO_CAPTION' || templateName === 'AUTO_CAPTION_REEL') && mediaType !== 'video') {
    return {
      reasonCode: 'VIDEO_CAPTION_REQUIRES_VIDEO',
      message: 'Video Caption needs a video upload before render.',
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
  if (templateName === 'AUTO_CAPTION_REEL') return 'Auto Caption Video';
  if (templateName === 'LONG_VIDEO_PROMO') return 'Long Video Promo';
  if (templateName === 'comparisonImages') return 'Compare Explainer Video';
  if (templateName === 'WHITEBOARD_VIDEO') return 'Whiteboard Video';
  if (templateName === 'TYPOGRAPHY_VIDEO') return 'Typography Video';
  return 'Itnavideo Reel';
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
  return /(?:scriptDetails|mediaSrc|imageSources|selectedAssets|uploadedImages|assetTimeline|assetBrief|primaryVisual\.prompt|prompt|visual|searchText|assetSearchText|detailedDescription|visualDifference|useCase|use_case|tags|category|orientation|style|motion|file|suggestedFilename|embeddingRef|storage|source|src|url|key|id|model|provider|debug|constraints|qualityChecks|warnings|repairNotes|renderNotes|captions|subtitleChunks|transcriptSegments|transcript|sourceScript|subtitleLanguagePolicy|subtitleOutputLanguage|overlayTimeline|topicTitle|compareLeftTitle|compareRightTitle|leftTitle|rightTitle|text|body|title|label)/i.test(keyPath);
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
  if (/rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/.test(normalized)) {
    return 'Render traffic is high right now. Your upload stays selected, so please retry in a minute.';
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
  return FOUNDER_EMAILS.includes(email.toLowerCase().trim());
}

function isFounderUser(userId: string) {
  if (!userId) return false;
  return FOUNDER_USER_IDS.includes(userId);
}
