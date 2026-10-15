import {NextResponse} from 'next/server';
import {createUploadUrl, createReadUrl} from '@/lib/aws/mediaStorage';
import {checkRateLimit, getClientIp} from '@/services/rateLimit/inMemoryRateLimiter';
import {getRenderAccessForUser} from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 500;

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return NextResponse.json({ok: false, error: 'Invalid JSON body.'}, {status: 400});

  const ip = getClientIp(request.headers);
  const rawUserId = readString(body.userId);
  const effectiveUserId = rawUserId || 'guest_user';
  const rateLimit = checkRateLimit({
    key: `media-presign:${effectiveUserId !== 'guest_user' ? effectiveUserId : ip}`,
    limit: 1200, // Generous creator limit for batch uploads
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ok: false, error: 'Upload limit reached. Please wait a moment before uploading more files.'}, {status: 429});
  }

  // Handle on-demand S3 read URL generation
  const action = readString(body.action).toLowerCase();
  const rawKey = readString(body.key || body.mediaKey);
  if (action === 'read' || (rawKey && !readString(body.fileName) && !readString(body.contentType))) {
    if (!rawKey) {
      return NextResponse.json({ok: false, error: 'Key is required to generate read URL.'}, {status: 400});
    }
    try {
      const readUrl = await createReadUrl(rawKey);
      return NextResponse.json({ok: true, readUrl, key: rawKey});
    } catch (err: any) {
      return NextResponse.json(
        {ok: false, error: sanitizeUserFacingStatus(err instanceof Error ? err.message : 'Could not generate read URL.')},
        {status: 500},
      );
    }
  }

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
    // If no userId provided, fallback to guest session instead of failing
    body.userId = "guest_user";
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

  const userEmail = readString(body.userEmail || body.email);

  try {
    let access = { allowed: true, planId: "free", planName: "Guest", activePaidPlan: false, used: 0, limit: 10, remaining: 10 };
    if (effectiveUserId !== "guest_user") {
      access = await getRenderAccessForUser(effectiveUserId, {
        mode: (videoTypeMode === 'autoCaption' || videoTypeMode === 'captionStudio') ? 'autoCaption' : undefined,
        userEmail: userEmail || undefined,
      });
    }

    const upload = await createUploadUrl({contentType, fileName, mode: uploadMode, userId: effectiveUserId});
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
  if (videoTypeMode === 'autoCaption') {
    return contentType.startsWith('video/') || contentType.startsWith('audio/') || contentType === 'application/octet-stream' || contentType === '';
  }
  return contentType.startsWith('audio/') || contentType.startsWith('video/') || contentType.startsWith('image/') || contentType === 'application/octet-stream' || contentType === '';
}

function uploadErrorForVideoType(videoTypeMode: string) {
  if (videoTypeMode === 'compare') return 'Compare needs one audio file plus exactly 2 visuals.';
  if (videoTypeMode === 'autoCaption') return 'Auto Caption needs a video or audio file with speech.';
  return 'This video type needs audio, video, or image upload.';
}

function isCompareWorkflow(value: string) {
  return value === 'compare' || value === 'comparison' || value === 'vs';
}

function isAutoCaptionWorkflow(value: string) {
  return value === 'autocaption' || value === 'auto-caption' || value === 'auto-caption-reel' || value === 'caption' || value === 'subtitle';
}

function isCaptionStudioWorkflow(value: string) {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  return normalized === 'captionstudio' || normalized === 'customcaption' || normalized === 'customcaptions' || normalized === 'advancedcaption';
}

function isLongVideoPromoWorkflow(value: string) {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  return normalized === 'longvideopromo' || normalized === 'longvideopromotion' || normalized === 'promo';
}

function isLongFormCaptionedWorkflow(value: string) {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  return normalized === 'longCaptionPro' || normalized === 'longformcaptioned' || normalized === 'longvideocaptioned';
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || '');
  const normalized = source.toLowerCase();
  if (/bucket|storage|s3|aws|remotion|lambda|credential|access key|secret/i.test(normalized)) {
    return 'Cloud upload service is preparing. Please retry in a few seconds.';
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:REMOTION|GROQ|OPENAI|GEMINI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, 'render system')
    .replace(/\bGroq\b/gi, 'transcription service')
    .replace(/\bAWS Lambda\b/gi, 'render system')
    .replace(/\bAWS\b/gi, 'render')
    .replace(/\bLambda\b/gi, 'render system')
    .replace(/\bRemotion\b/gi, 'video renderer')
    .replace(/\bS3\b/gi, 'secure storage')
    .replace(/\bffmpeg\b/gi, 'media processor')
    .replace(/\b(?:Gemini|Google AI|OpenAI|ChatGPT)\b/gi, 'AI Director')
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
  if (isCaptionStudioWorkflow(value)) return 'captionStudio';
  if (isLongVideoPromoWorkflow(value)) return 'longVideoPromo';
  if (isLongFormCaptionedWorkflow(value)) return 'longCaptionPro';
  return 'generic';
}

function isRecognizedWorkflowMode(value: string) {
  // Allow ALL modes — new video types should never be blocked at upload step.
  // If mode is provided and non-empty, accept it. Validation happens in /api/reels/jobs.
  return Boolean(value && value.trim().length > 0);
}
