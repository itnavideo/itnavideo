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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LambdaRenderRequest = Parameters<typeof renderMediaOnLambda>[0];
type ReelMode = 'videoExplainer' | 'compare' | 'autoCaption';
const MODE_TO_TEMPLATE: Record<ReelMode, ReelTemplateName> = {
  videoExplainer: 'VIDEO_SIMPLE_EXPLAINER',
  compare: 'comparisonImages',
  autoCaption: 'AUTO_CAPTION_REEL',
};

const MAX_RENDER_WINDOW_SECONDS = 60;

const SUBTITLE_LANGUAGE_POLICY =
  "Subtitle language policy: If the uploaded speech is Hindi/Hinglish, generate clean Hinglish subtitles in Latin/Roman script. If the speech is English, generate English subtitles. Never use Devanagari/Hindi script. Never use over-literal romanization such as kaaphee, kyaa, rahataa, men, savaal. Prefer natural Hinglish spellings such as kaafi, kya, rehta, mein, sawaal.";
const DEFAULT_PLANNING_MEDIA_SECONDS = 60;
const SPEECH_LEAD_SECONDS = 0.65;
const MIN_SPEECH_TOKEN_LENGTH = 2;
const RENDER_IMAGE_URL_TIMEOUT_MS = 7000;
const REQUIRED_RENDER_SITE_PATH = '/sites/itnavideo-video-explainer/';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_TRANSCRIPT_REPAIR_MODEL = 'gpt-5-mini';

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
  const topicTitle = readString(body.topicTitle);
  const design = toDesign(readString(body.design));
  const languageHint = toLanguageHint(readString(body.language || body.displayLanguage || body.typographyLanguage));
  const requestedMode = readString(body.mode || body.template);
  if (requestedMode && !isAllowedRenderMode(requestedMode)) {
    return NextResponse.json(
      {
        ok: false,
        status: 'failed',
        reasonCode: 'TEMPLATE_UNAVAILABLE',
        error: 'Only Explainer Video and Compare are available right now.',
      },
      {status: 422},
    );
  }
  const mode = toMode(requestedMode || 'videoExplainer');
  const mediaType = getUploadedMediaType({mode, contentType});
  const templateName = MODE_TO_TEMPLATE[mode];
  const templateConfig = REEL_TEMPLATE_REGISTRY[templateName];
  const composition = templateConfig.compositionId;
  const userId = readString(body.userId);
  const rateLimit = checkRateLimit({
    key: `reels-job:${userId || ip}`,
    limit: userId ? 20 : 8,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ok: false, error: 'Too many render jobs. Please wait a minute and try again.'}, {status: 429});
  }

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
  if (mode === 'videoExplainer' && contentType && !contentType.startsWith('video/') && !contentType.startsWith('audio/')) {
    return NextResponse.json({ok: false, error: 'Video Explainer requires a video or voiceover file.'}, {status: 400});
  }

  if (mode === 'compare') {
    if (contentType && !contentType.startsWith('audio/')) {
      return NextResponse.json({ok: false, error: 'Compare requires one audio voiceover file.'}, {status: 400});
    }
    if (comparisonImageKeys.length !== 2) {
      return NextResponse.json({ok: false, error: 'Compare requires exactly 2 visuals: one left and one right.'}, {status: 400});
    }
  }

  const config = readLambdaConfig();
  if (!config.ok) return NextResponse.json({ok: false, error: config.error}, {status: 503});

  try {
    const access = await getRenderAccessForUser(userId);
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

    const mediaUrl = await createReadUrl(mediaKey);
    const explanationImageUrl = explanationImageKey
      ? readString(await createReadUrl(explanationImageKey))
      : "";
    const comparisonImageUrls = mode === 'compare'
      ? (await Promise.all(
          comparisonImageKeys.map(async (key: string) => readString(await createReadUrl(key))),
        )).filter(Boolean).slice(0, 2)
      : [];

    if (mode === 'compare' && comparisonImageUrls.length !== 2) {
      return NextResponse.json(
        {ok: false, error: 'Compare visual URLs could not be prepared. Please re-upload both visuals.'},
        {status: 422},
      );
    }
    if (mode === 'videoCaption' && !mediaUrl) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          error: 'Caption render blocked because video URL is missing.',
        },
        {status: 422},
      );
    }
    if (mode === 'imageStory' && contentType.startsWith('image/')) {
      if (!mediaUrl) {
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            error: 'Image Story render blocked because image URL is missing.',
          },
          {status: 422},
        );
      }
      const prompt = topicTitle || titleFromFile(fileName) || 'Image story';
      const imageDurationSeconds = Math.min(MAX_RENDER_WINDOW_SECONDS, Math.max(8, Number(body.durationSeconds) || 12));
      const plan = validateAndRepairReelPlan(await createReelPlan({
        transcript: prompt,
        topicTitle: topicTitle || undefined,
        topic: prompt,
        durationSeconds: imageDurationSeconds,
        mediaType: 'image',
        languageHint,
        design,
        template: templateName,
        visualMode: templateConfig.plannerMode,
        selectedAssets: {
          uploadedImages: [mediaUrl],
        },
        dryRun: !process.env.OPENAI_API_KEY,
        constraints: [
        SUBTITLE_LANGUAGE_POLICY,
          'Image Story image-only mode: use topic/prompt for visual story beats, but do not create fake transcript captions.',
          'One primary image per scene with subtle cinematic motion.',
          'Use minimal safe-zone text only; no subtitles, notes, or explainer cards.',
        ],
      }));

      if (plan.validation.renderAllowed === false) {
        const detail = sanitizeUserFacingStatus(plan.validation.renderBlockReason || 'Image Story needs a usable image before render.');
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

      const inputProps: Record<string, unknown> = {
        ...(plan.renderProps || {}),
        mediaType: 'image',
        mediaFit: templateConfig.mediaFit,
      captionStyle: readString(body.captionStyle) || 'yellowPop',
      captionPosition: readString(body.captionPosition) || 'bottom',
      subtitleOutputLanguage: readString(body.subtitleOutputLanguage) || 'hinglish',
      textColor: readString(body.captionTextColor) || '#ffffff',
      highlightColor: readString(body.captionHighlightColor) || '#facc15',
        sourceDurationSeconds: imageDurationSeconds,
        renderWindowSource: 'image-only',
        topicTitle: plan.renderProps?.topicTitle || topicTitle || titleFromFile(fileName),
        explanationImageUrl: typeof explanationImageUrl !== "undefined" ? explanationImageUrl || undefined : undefined,
        bottomImageUrl: typeof explanationImageUrl !== "undefined" ? explanationImageUrl || undefined : undefined,
        visualImageUrl: typeof explanationImageUrl !== "undefined" ? explanationImageUrl || undefined : undefined,
        uploadedImageUrl: typeof explanationImageUrl !== "undefined" ? explanationImageUrl || undefined : undefined,
        design: mode === 'videoExplainer' ? 'simpleManual' : plan.renderProps?.design,
      templateName,
      template: templateName,
        compositionId: composition,
      };
      const imagePreflight = await repairRenderImageSources(inputProps, {
        templateName,
        userId,
        mediaKey,
        topicTitle: readString(inputProps.topicTitle),
      });
      const preflight = validateBeforeRender({inputProps: imagePreflight.inputProps, templateName, composition, mediaType});
      if (preflight) {
        return NextResponse.json(
          {
            ok: false,
            status: 'failed',
            reasonCode: preflight.reasonCode,
            error: preflight.message,
          },
          {status: 422},
        );
      }

      const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${slugify(readString(inputProps.topicTitle) || fileName || 'image-story')}.mp4`;
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
        maxRetries: 2,
        downloadBehavior: {
          type: 'download',
          fileName: 'itnavideo-image-story.mp4',
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
        reelTitle: imagePreflight.inputProps.topicTitle,
        design: imagePreflight.inputProps.design,
        mode,
        templateName,
        transcriptSource: 'not-required',
        mediaTrimStartSeconds: 0,
        renderWindowSeconds: imageDurationSeconds,
        renderWindowSource: 'image-only',
        access,
        retentionHours: 48,
        note: 'Render started. Poll /api/reels/jobs/status for progress.',
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
    }    const transcription = await transcribeForPlanning({
      mediaUrl: planningMedia.transcriptionMediaUrl,
      fileName: planningMedia.transcriptionFileName,
      contentType: planningMedia.transcriptionContentType,
      mediaType: mediaType === 'image' ? 'video' : mediaType,
    });    if (!transcription.transcript) {
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
    const renderWindow = selectRenderWindow(transcription);
    const plan = validateAndRepairReelPlan(await createReelPlan({
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
      selectedAssets: mode === 'imageStory'
        ? {uploadedImages: collectImageStorySources(body, mediaUrl, contentType)}
        : undefined,
      dryRun: !process.env.OPENAI_API_KEY,
      constraints: [
        SUBTITLE_LANGUAGE_POLICY,
        mode === 'notes'
          ? 'Use uploaded voiceover as the audio source for Handwritten Notes.'
          : mode === 'videoCaption'
            ? 'Use uploaded video as full-screen primary media and render clean timed captions over it.'
            : mode === 'imageStory'
              ? 'Use supplied images as the primary visual story and keep text minimal.'
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
        mode === 'notes'
          ? 'Render explanation as clean handwritten notes on a blank white canvas. Do not use prewritten note images.'
          : mode === 'videoCaption'
            ? 'Do not add explainer cards. Keep only clean captions/subtitles over the uploaded video.'
            : mode === 'imageStory'
              ? 'Do not add subtitles, handwritten notes, or explainer cards. Use one strong image per scene.'
          : 'One primary visual element per scene.',
        'Use the normalized transcript as clean English plus Roman Hinglish. Keep official terms in English and avoid Devanagari/Urdu/Arabic script in visible render text.',
        transcription.source === 'groq'
          ? 'Transcript source: primary transcription service.'
          : 'Transcript source: OpenAI Whisper fallback after primary transcription failed.',
      ],
    }));

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

    const music = selectBackgroundMusic({
      topicTitle: topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName),
      transcript: renderWindow.transcript,
    });
    const inputProps: Record<string, unknown> = {
      ...(plan.renderProps || {}),
      mediaSrc: planningMedia.mediaUrl,
      ...(mode === 'compare'
        ? {
            audioUrl: planningMedia.mediaUrl,
            mediaUrl: planningMedia.mediaUrl,
            sourceAudioUrl: planningMedia.mediaUrl,
            comparisonImageUrls,
            comparisonImages: comparisonImageUrls,
            stickerStyle: ['2d', 'cartoon', 'explainer'].includes(readString(body.stickerStyle)) ? readString(body.stickerStyle) : 'explainer',
            creatorHandle: readString(body.creatorHandle || body.handle || body.channelName) || '@itnavideo',
            compareLeftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            compareRightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            leftTitle: readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left',
            rightTitle: readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right',
            imageSources: comparisonImageUrls,
          }        : {}),
      ...(mode === 'autoCaption'
        ? {
            captions: buildCompareCaptionsFromGroq(renderWindow),
            subtitleChunks: buildCompareCaptionsFromGroq(renderWindow),
            transcriptSegments: renderWindow.segments || [],
            transcript: renderWindow.transcript,
            sourceScript: renderWindow.transcript,
            backgroundMusic: false,
          }
        : {}),
      mediaType,
      mediaFit: templateConfig.mediaFit,
      captionStyle: readString(body.captionStyle) || 'yellowPop',
      captionPosition: readString(body.captionPosition) || 'bottom',
      subtitleOutputLanguage: readString(body.subtitleOutputLanguage) || 'hinglish',
      textColor: readString(body.captionTextColor) || '#ffffff',
      highlightColor: readString(body.captionHighlightColor) || '#facc15',
      mediaTrimStartSeconds: renderWindow.trimStartSeconds,
      sourceDurationSeconds: transcription.durationSeconds,
      renderWindowSource: renderWindow.source,
      planningMediaSource: planningMedia.clipped ? 'first-60s-clip' : 'original-upload',
      topicTitle: plan.renderProps?.topicTitle || topicTitle || titleFromTranscript(transcription.transcript) || titleFromFile(fileName),
      explanationImageUrl: explanationImageUrl || undefined,
      bottomImageUrl: explanationImageUrl || undefined,
      visualImageUrl: explanationImageUrl || undefined,
      uploadedImageUrl: explanationImageUrl || undefined,
      design: mode === 'videoExplainer' ? 'simpleManual' : plan.renderProps?.design,
      templateName,
      template: templateName,
      compositionId: composition,
      backgroundMusic: plan.renderProps?.backgroundMusic !== false,
      backgroundMusicMood: readString(plan.renderProps?.backgroundMusicMood) || music.mood,
      backgroundMusicSrc: readString(plan.renderProps?.backgroundMusicSrc) || music.src,
      backgroundMusicVolume: Number.isFinite(Number(plan.renderProps?.backgroundMusicVolume))
        ? Math.min(0.04, Math.max(0.012, Number(plan.renderProps?.backgroundMusicVolume)))
        : music.volume,
      sourceAudioVolume: 1.35,
      subtitleLanguagePolicy: SUBTITLE_LANGUAGE_POLICY,
      backgroundMusicCategory: readString(plan.renderProps?.backgroundMusicCategory) || music.category,

      ...(mode === 'compare'
        ? {
            captions: buildCompareCaptionsFromGroq(renderWindow),
            transcriptSegments: renderWindow.segments || [],
            transcript: renderWindow.transcript,
            sourceScript: renderWindow.transcript,
          }
        : {}),
    };
    const imagePreflight = await repairRenderImageSources(inputProps, {
      templateName,
      userId,
      mediaKey,
      topicTitle: readString(inputProps.topicTitle),
    });
    const preflight = validateBeforeRender({inputProps: imagePreflight.inputProps, templateName, composition, mediaType});
    if (preflight) {
      return NextResponse.json(
        {
          ok: false,
          status: 'failed',
          reasonCode: preflight.reasonCode,
          error: preflight.message,
        },
        {status: 422},
      );
    }

    const outName = `${TEMP_MEDIA_RENDER_PREFIX}${sanitizeSegment(userId)}/${Date.now()}-${slugify(readString(imagePreflight.inputProps.topicTitle) || fileName || 'reel')}.mp4`;
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
      maxRetries: 2,
      downloadBehavior: {
        type: 'download',
        fileName: mode === 'notes'
          ? 'itnavideo-handwritten-notes.mp4'
          : mode === 'autoCaption' ? 'itnavideo-auto-caption-reel.mp4' : mode === 'videoCaption' ? 'itnavideo-captioned-video.mp4'
            : mode === 'imageStory'
              ? 'itnavideo-image-story.mp4'
            : 'itnavideo-reel.mp4',
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
    return NextResponse.json(
      {ok: false, error: sanitizeUserFacingStatus(error instanceof Error ? error.message : 'Could not start render job.')},
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
    if (context.templateName === 'VIDEO_EXPLAINER' && ref.repairAsFrame) {
      ref.repairAsFrame(validation.reason);
    } else {
      ref.set(fallback.src);
    }
    failures.push({
      path: ref.path,
      sceneId: ref.sceneId,
      assetId: ref.assetId,
      s3Key: ref.s3Key || extractS3KeyFromUrl(ref.url),
      url: redactSignedUrl(ref.url),
      reason: validation.reason,
      fallback: context.templateName === 'VIDEO_EXPLAINER' && ref.repairAsFrame ? 'remotion-frame' : fallback.src,
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
  const configuredFramesPerLambda = Number(process.env.REMOTION_LAMBDA_FRAMES_PER_LAMBDA || 300);
  const framesPerLambda = useFramesPerLambda && Number.isFinite(configuredFramesPerLambda)
    ? Math.min(420, Math.max(180, configuredFramesPerLambda))
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
  const retryFramesPerLambda = Math.max(Number(request.framesPerLambda || 300), 420);
  const attempts: LambdaRenderRequest[] = [
    request,
    {...request, concurrency: undefined, framesPerLambda: retryFramesPerLambda, maxRetries: 1},
    {...request, concurrency: 2, framesPerLambda: undefined, maxRetries: 1},
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
      await sleep(3500 * (index + 1));
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
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  mediaType: 'audio' | 'video';
}) {
  let primaryWarning = '';
  try {
    const result = await transcribeMediaUrlWithGroq({mediaUrl, fileName, contentType});
    if (result.transcript) {
      return await repairTranscriptionEnglishIfNeeded({
        ...result,
        source: 'groq' as const,
      });
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
      return await repairTranscriptionEnglishIfNeeded({
        ...fallback,
        source: 'openai' as const,
        warning: sanitizeUserFacingStatus(primaryWarning),
      });
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      ...transcription,
      warning: [transcription.warning, 'Transcript may contain non-English text because English repair is not configured.'].filter(Boolean).join(' '),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.TRANSCRIPT_ENGLISH_REPAIR_TIMEOUT_MS || 18_000));
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.TRANSCRIPT_ENGLISH_REPAIR_MODEL || DEFAULT_TRANSCRIPT_REPAIR_MODEL,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: [
                  'Translate short-form video transcription text into clean natural English only.',
                  'Preserve exact meaning, names, numbers, official terms, and factual claims.',
                  'Do not add scene notes, summaries, headings, timestamps, or extra facts.',
                  'Return strict JSON with transcript and segments. Segment count must match the input segment count.',
                ].join(' '),
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  transcript: transcription.transcript,
                  segments: (transcription.segments || []).map((segment, index) => ({
                    index,
                    text: segment.text,
                  })),
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'itnavideo_english_transcript_repair',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                transcript: {type: 'string'},
                segments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      index: {type: 'number'},
                      text: {type: 'string'},
                    },
                    required: ['index', 'text'],
                  },
                },
              },
              required: ['transcript', 'segments'],
            },
          },
        },
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`English transcript repair failed: ${response.status}`);
    const repaired = parseEnglishRepairResponse(await response.json());
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
    const captions: Array<{start: number; end: number; text: string}> = [];
    let group: typeof words = [];

    const flush = () => {
      if (!group.length) return;
      captions.push({
        start: roundSeconds(group[0].start),
        end: roundSeconds(Math.max(group[group.length - 1].end, group[0].start + 0.65)),
        text: group.map((item) => item.word).join(' '),
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
  const fallbackDuration = Math.max(1, renderWindow.durationSeconds || 30);
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
  const normalized = value.toLowerCase().replace(/[_\s]+/g, '-');
  return (
    normalized === 'videoexplainer' ||
    normalized === 'video-explainer' ||
    normalized === 'explainer' ||
    normalized === 'explainer-video' ||
    normalized === 'facecam' ||
    normalized === 'compare' ||
    normalized === 'comparison' ||
    normalized === 'vs'
  );
}

function toMode(value: string): ReelMode {
  const normalized = value.toLowerCase();
  if (normalized.includes('compare') || normalized.includes('comparison') || normalized === 'vs') return 'compare';
  if (normalized.includes('handwriting') || normalized.includes('notes')) return 'notes';
  if (normalized.includes('auto-caption') || normalized.includes('autocaption')) return 'autoCaption';
  if (normalized.includes('caption') || normalized.includes('subtitle')) return 'autoCaption';
  if (normalized.includes('image') || normalized.includes('photo') || normalized.includes('story')) return 'imageStory';
  return 'videoExplainer';
}

function getUploadedMediaType({mode, contentType}: {mode: ReelMode; contentType: string}): 'audio' | 'video' | 'image' {
  if (mode === 'autoCaption') return 'video';
  if (mode === 'notes' || mode === 'compare') return 'audio';
  if (mode === 'imageStory' && contentType.startsWith('image/')) return 'image';
  return contentType.startsWith('audio/') ? 'audio' : 'video';
}

function toLanguageHint(value: string): 'english' | 'hinglish' | undefined {
  const normalized = value.toLowerCase();
  if (!normalized || normalized.includes('auto')) return undefined;
  if (normalized.includes('hindi') || normalized.includes('urdu') || normalized.includes('hinglish')) return 'hinglish';
  if (normalized.includes('english')) return 'english';
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

function readStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => readString(item)).filter(Boolean).slice(0, 24);
}

function collectImageStorySources(body: Record<string, unknown>, mediaUrl: string, contentType: string) {
  const explicit = [
    ...readStringList(body.imageSources),
    ...readStringList(body.images),
    ...readStringList(body.selectedImageUrls),
  ];
  const selectedAssets = body.selectedAssets && typeof body.selectedAssets === 'object' && !Array.isArray(body.selectedAssets)
    ? Object.values(body.selectedAssets as Record<string, unknown>).flatMap(readStringList)
    : [];
  const uploadedImage = contentType.startsWith('image/') && mediaUrl ? [mediaUrl] : [];
  return Array.from(new Set([...uploadedImage, ...explicit, ...selectedAssets]))
    .filter((src) => /^(https?:|data:image\/|blob:|\/)/i.test(src))
    .slice(0, 24);
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
      message: 'This template is not available for rendering yet.',
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
      message: 'The planned template does not match the selected render template.',
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

  if (templateName === 'IMAGE_STORY') {
    if (!hasImageSource(inputProps.images) && !hasImageSource(inputProps.imageSources) && !hasImageSource(inputProps.imageScenes)) {
      return {
        reasonCode: 'MISSING_IMAGE_SOURCE',
        message: 'Image Story needs at least one usable image before render.',
      };
    }
  } else if (!readString(inputProps.mediaSrc)) {
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

function humanTemplateName(templateName: ReelTemplateName) {
  if (templateName === 'HANDWRITTEN_NOTES') return 'Handwritten Notes';
  if (templateName === 'AUTO_CAPTION_REEL') return 'Auto Caption Reel';
  if (templateName === 'VIDEO_CAPTION') return 'Video Caption';
  if (templateName === 'IMAGE_STORY') return 'Image Story';
  return 'Video Explainer';
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
  return /(?:scriptDetails|mediaSrc|imageSources|selectedAssets|uploadedImages|assetTimeline|assetBrief|primaryVisual\.prompt|prompt|visual|searchText|assetSearchText|detailedDescription|visualDifference|useCase|use_case|tags|category|orientation|style|motion|file|suggestedFilename|embeddingRef|storage|source|src|url|key|id|model|provider|debug|constraints|qualityChecks|warnings|repairNotes|renderNotes)/i.test(keyPath);
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
  if (/rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/.test(normalized)) {
    return 'Render traffic is high right now. Your upload stays selected, so please retry in a minute.';
  }
  if (/timed out|timeout|chunks are missing|missing chunks|main function/i.test(source)) {
    return 'Render took too long with the current workload. Please try again; the render has been split into smaller parts now.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:HANDWRITING_NOTES_REEL|HANDWRITTEN_NOTES|NOTES)\b/g, 'Handwritten Notes')
    .replace(/\bVIDEO[-_]EXPLAINER\b/gi, 'Video Explainer')
    .replace(/\bVIDEO[-_]CAPTION\b/gi, 'Video Caption')
    .replace(/\bIMAGE[-_]STORY\b/gi, 'Image Story')
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
































