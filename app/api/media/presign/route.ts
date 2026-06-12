import {NextResponse} from 'next/server';
import {createUploadUrl} from '@/lib/aws/mediaStorage';
import {checkRateLimit, getClientIp} from '@/services/rateLimit/inMemoryRateLimiter';
import {getRenderAccessForUser} from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 300;

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
  const workflowMode = readString(body.mode || body.template).toLowerCase();
  const templateMode = isCompareWorkflow(workflowMode) ? 'compare' : 'videoExplainer';
  const uploadMode = contentType.startsWith('audio/') ? 'audio' : contentType.startsWith('image/') ? 'image' : 'video';
  const fileSize = Number(body.fileSize || 0);
  const userId = readString(body.userId);

  if (!fileName || !contentType) {
    return NextResponse.json({ok: false, error: 'fileName and contentType are required.'}, {status: 400});
  }
  if (!userId) {
    return NextResponse.json({ok: false, error: 'Please log in before uploading media.'}, {status: 401});
  }
  if (workflowMode && !isVideoExplainerWorkflow(workflowMode) && !isCompareWorkflow(workflowMode)) {
    return NextResponse.json({ok: false, error: 'This template is not available right now.'}, {status: 422});
  }
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ok: false, error: 'File is too large for beta uploads.'}, {status: 400});
  }
  if (!isAllowedUploadForTemplate(templateMode, contentType)) {
    return NextResponse.json({ok: false, error: uploadErrorForTemplate(templateMode)}, {status: 400});
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

function isAllowedUploadForTemplate(templateMode: string, contentType: string) {
  if (templateMode === 'compare') return contentType.startsWith('audio/') || contentType.startsWith('image/');
  return contentType.startsWith('audio/') || contentType.startsWith('video/');
}

function uploadErrorForTemplate(templateMode: string) {
  if (templateMode === 'compare') return 'Compare needs one audio file plus exactly 2 visuals.';
  return 'Video Explainer needs audio or video with clear speech.';
}

function isVideoExplainerWorkflow(value: string) {
  return (
    value === 'videoexplainer' ||
    value === 'video-explainer' ||
    value === 'explainer' ||
    value === 'explainer-video' ||
    value === 'facecam'
  );
}

function isCompareWorkflow(value: string) {
  return value === 'compare' || value === 'comparison' || value === 'vs';
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


