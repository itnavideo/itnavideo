import {NextResponse} from 'next/server';
import {createUploadUrl} from '@/lib/aws/mediaStorage';
import {checkRateLimit, getClientIp} from '@/services/rateLimit/inMemoryRateLimiter';
import {getRenderAccessForUser} from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 500;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit({
    key: `media-presign:${ip}`,
    limit: 30,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ok: false, error: 'Too many upload attempts. Try again shortly.'}, {status: 429});
  }

  const body = await readJson(request);
  if (!body) return NextResponse.json({ok: false, error: 'Invalid JSON body.'}, {status: 400});

  const fileName = readString(body.fileName);
  const contentType = readString(body.contentType);
  const workflowMode = readString(body.mode || body.videoType || body.template).toLowerCase();
  const videoTypeMode = resolvePresignVideoTypeMode(workflowMode);
  const uploadMode = contentType.startsWith('audio/') ? 'audio' : contentType.startsWith('image/') ? 'image' : 'video';
  const fileSize = Number(body.fileSize || 0);
  const userId = readString(body.userId);

  if (!fileName || !contentType) {
    return NextResponse.json({ok: false, error: 'fileName and contentType are required.'}, {status: 400});
  }
  if (!userId) {
    return NextResponse.json({ok: false, error: 'Please log in before uploading media.'}, {status: 401});
  }
  if (workflowMode && !isRecognizedWorkflowMode(workflowMode)) {
    return NextResponse.json({ok: false, error: 'This video type is not available right now.'}, {status: 422});
  }
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ok: false, error: 'File is too large. Please upload a video under 500MB.'}, {status: 400});
  }
  if (!isAllowedUploadForVideoType(videoTypeMode, contentType)) {
    return NextResponse.json({ok: false, error: uploadErrorForVideoType(videoTypeMode)}, {status: 400});
  }

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

    const upload = await createUploadUrl({contentType, fileName, mode: uploadMode, userId});
    return NextResponse.json({
      ok: true,
      ...upload,
      access,
      expiresInSeconds: 15 * 60,
      retentionHours: 48,
    });
  } catch (error) {
    return NextResponse.json(
      {ok: false, error: sanitizeUserFacingStatus(error instanceof Error ? error.message : 'Could not create upload URL.')},
      {status: 500},
    );
  }
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isAllowedUploadForVideoType(videoTypeMode: string, contentType: string) {
  if (videoTypeMode === 'compare') return contentType.startsWith('audio/') || contentType.startsWith('image/');
  if (videoTypeMode === 'autoCaption') return contentType.startsWith('video/');
  return contentType.startsWith('audio/') || contentType.startsWith('video/') || contentType.startsWith('image/');
}

function uploadErrorForVideoType(videoTypeMode: string) {
  if (videoTypeMode === 'compare') return 'Compare needs one audio file plus exactly 2 visuals.';
  if (videoTypeMode === 'autoCaption') return 'Auto Caption needs a video file with speech.';
  return 'This video type needs audio, video, or image upload.';
}

function isCompareWorkflow(value: string) {
  return value === 'compare' || value === 'comparison' || value === 'vs';
}

function isAutoCaptionWorkflow(value: string) {
  return value === 'autocaption' || value === 'auto-caption' || value === 'auto-caption-reel' || value === 'caption' || value === 'subtitle';
}

function isLongVideoPromoWorkflow(value: string) {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  return normalized === 'longvideopromo' || normalized === 'longvideopromotion' || normalized === 'promo';
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || '');
  const normalized = source.toLowerCase();
  if (/bucket|storage|s3|aws|remotion|lambda|credential|access key|secret/i.test(normalized)) {
    return 'Secure upload storage is not ready yet. Please try again shortly.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:REMOTION|GROQ|OPENAI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, 'render system')
    .replace(/\bGroq\b/gi, 'transcription service')
    .replace(/\bAWS Lambda\b/gi, 'render system')
    .replace(/\bAWS\b/gi, 'render')
    .replace(/\bLambda\b/gi, 'render system')
    .replace(/\bRemotion\b/gi, 'video renderer')
    .replace(/\bS3\b/gi, 'secure storage')
    .replace(/\bffmpeg\b/gi, 'media processor')
    .replace(/\bOpenAI\b/gi, 'AI planner')
    .trim() || 'Could not create upload URL.';
}

/**
 * SAFETY: Registry-based video type mode resolution.
 * Instead of hardcoded if/else that silently accepts removed video types,
 * this function checks all known workflow patterns and returns null for unknown video types.
 * The null case triggers a proper "video type not available" error instead of corrupting Video Explainer.
 */
function resolvePresignVideoTypeMode(value: string): string {
  if (!value) return 'generic';
  if (isCompareWorkflow(value)) return 'compare';
  if (isAutoCaptionWorkflow(value)) return 'autoCaption';
  if (isLongVideoPromoWorkflow(value)) return 'longVideoPromo';
  return 'generic';
}

function isRecognizedWorkflowMode(value: string) {
  return isCompareWorkflow(value) || isAutoCaptionWorkflow(value) || isLongVideoPromoWorkflow(value);
}
