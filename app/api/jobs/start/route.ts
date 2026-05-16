import { NextRequest, NextResponse } from 'next/server';
import { getAppSettingFromServer, upsertUserProjectFromServer } from '@/services/supabase/projectStore';
import { upsertFfmpegJob } from '@/services/rendering/ffmpegJobStore';
import { getPipelineProfileForTier, videoPipelineConfig } from '@/lib/videoPipelineConfig';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const WORKER_DISPATCH_TIMEOUT_MS = 45_000;
const WORKER_HEALTH_TIMEOUT_MS = 5_000;
const FREE_TIER_SETTING_KEY = 'free_tier_render_enabled';
const FREE_TIER_QUEUE_LIMIT = getPositiveNumber(process.env.FREE_TIER_QUEUE_LIMIT, 50);
const FREE_MAX_DURATION_SECONDS = videoPipelineConfig.maxDurationSec;
const DEFAULT_TARGET_DURATION_SECONDS = FREE_MAX_DURATION_SECONDS;

const DEFAULT_CONFIG = {
  aspectRatio: 'Portrait (9:16)',
  editingStyle: 'reels_pacing',
  captionStyle: 'Reels',
  quality: videoPipelineConfig.qualityPreset,
  creationMode: 'faceless',
};

export async function POST(request: NextRequest) {
  let userId = '';
  let jobId = '';

  try {
    const body = await request.json();
    userId = sanitizeString(body.userId);
    const voiceoverUrl = sanitizeString(body.voiceoverUrl || body.voiceUrl);
    jobId = sanitizeString(body.jobId) || createJobId();
    const title = sanitizeString(body.title) || `Project ${jobId.toUpperCase()}`;
    const userAssets = normalizeUserAssets(body.userAssets);
    const userTier = await getUserTierForRender(userId);
    const renderProfile = getPipelineProfileForTier(userTier);
    const config = {
      ...DEFAULT_CONFIG,
      ...(isPlainObject(body.config) ? body.config : {}),
      userTier,
      quality: renderProfile.qualityPreset,
      targetWidth: renderProfile.targetWidth,
      targetHeight: renderProfile.targetHeight,
    };
    const targetDurationSeconds = getTargetDurationSeconds(body.targetDurationSeconds || config.targetDurationSeconds);
    const shouldRunPipeline = body.runPipeline !== false;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!voiceoverUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    if (targetDurationSeconds > FREE_MAX_DURATION_SECONDS) {
      return NextResponse.json(
        { error: `Upload is too long for the ${videoPipelineConfig.qualityPreset} standard pipeline. Please use audio or video under ${FREE_MAX_DURATION_SECONDS} seconds.` },
        { status: 413 },
      );
    }

    const freeTierGate = shouldRunPipeline ? await getFreeTierGateStatus() : null;
    if (shouldRunPipeline && !isPaidTier(userTier) && freeTierGate && !freeTierGate.allowed) {
      return NextResponse.json(
        {
          error: freeTierGate.message,
          code: freeTierGate.autoBlocked ? 'FREE_TIER_QUEUE_BUSY' : 'FREE_TIER_DISABLED',
          queue: freeTierGate.queue,
          limit: freeTierGate.limit,
        },
        { status: 503 },
      );
    }

    await upsertUserProjectFromServer(userId, jobId, {
      id: jobId,
      title,
      status: 'Queued',
      progress: 12,
      quality: renderProfile.qualityPreset,
      voiceUrl: voiceoverUrl,
      voiceoverUrl,
      userAssets,
      visualUrl: userAssets[0]?.url,
      timelineScenes: 0,
      captions: 0,
      createdAt: new Date().toISOString(),
    });
    await upsertFfmpegJob({
      userId,
      jobId,
      status: 'queued',
      progress: 12,
      message: 'Generation queued. Waiting for Groq transcription and AI planning.',
    }).catch((error) => console.warn(`Initial FFmpeg job write failed for ${jobId}:`, error));

    if (shouldRunPipeline) {
      await dispatchWorkerPipeline({
        userId,
        jobId,
        voiceoverUrl,
        userAssets,
        config,
        title,
        targetDurationSeconds,
      });
    }

    return NextResponse.json({
      success: true,
      accepted: true,
      jobId,
      status: shouldRunPipeline ? 'queued' : 'metadata_saved',
      stage: shouldRunPipeline ? 'background_pipeline' : 'frontend_pipeline',
      message: shouldRunPipeline
        ? 'Generation accepted. Groq transcription, AI planning, and render dispatch will continue in the background.'
        : 'Generation metadata saved. The browser pipeline will trigger AI planning and render dispatch.',
    });
  } catch (error: any) {
    console.error('Job start failed:', error);
    if (userId && jobId) {
      await markJobStartFailed(userId, jobId, error).catch((writeError) => {
        console.error(`Failed to mark job ${jobId} as failed:`, writeError);
      });
    }

    return NextResponse.json(
      { error: 'Job start failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

async function dispatchWorkerPipeline({
  userId,
  jobId,
  voiceoverUrl,
  userAssets,
  config,
  title,
  targetDurationSeconds,
}: {
  userId: string;
  jobId: string;
  voiceoverUrl: string;
  userAssets: Array<{ url: string; type: 'image' | 'video'; filename?: string }>;
  config: Record<string, unknown>;
  title: string;
  targetDurationSeconds?: number;
}) {
  const workerUrl = getRenderWorkerUrl();
  if (!workerUrl) {
    throw new Error('RENDER_BACKEND_URL is not configured. Set it to your Render worker service URL.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WORKER_DISPATCH_TIMEOUT_MS);
  let response: Response | null = null;
  let data: any = {};

  try {
    response = await fetch(`${workerUrl}/api/pipeline/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getWorkerAuthHeaders(),
      },
      body: JSON.stringify({
        userId,
        jobId,
        title,
        voiceoverUrl,
        userAssets,
        config,
        targetDurationSeconds,
      }),
      signal: controller.signal,
    });
    data = await response.json().catch(() => ({}));
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`Render worker did not respond within ${Math.round(WORKER_DISPATCH_TIMEOUT_MS / 1000)} seconds. Check the worker health endpoint and retry.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response || !response.ok) {
    throw new Error(data.details || data.error || 'Render worker did not accept the job.');
  }
}

async function markJobStartFailed(userId: string, jobId: string, error: any) {
  const message = error?.message || 'Render worker did not start.';
  await Promise.allSettled([
    upsertFfmpegJob({
      userId,
      jobId,
      status: 'error',
      progress: 12,
      message,
      error: message,
    }),
    upsertUserProjectFromServer(userId, jobId, {
      status: 'Render worker unavailable',
      progress: 12,
      error: message,
      updatedAt: new Date().toISOString(),
    }),
  ]);
}

async function runAudioToVideoPipeline({
  origin,
  userId,
  jobId,
  voiceoverUrl,
  userAssets,
  config,
}: {
  origin: string;
  userId: string;
  jobId: string;
  voiceoverUrl: string;
  userAssets: Array<{ url: string; type: 'image' | 'video'; filename?: string }>;
  config: Record<string, unknown>;
}) {
  try {
    await upsertUserProjectFromServer(userId, jobId, {
      status: 'Transcribing with Groq and planning timeline',
      progress: 35,
    });
    await upsertFfmpegJob({
      userId,
      jobId,
      status: 'processing',
      progress: 35,
      message: 'Groq is transcribing the voiceover, then AI is building the timeline...',
    }).catch((error) => console.warn(`AI planning status write failed for ${jobId}:`, error));

    const timelineRes = await fetch(`${origin}/api/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voiceoverUrl,
        jobId,
        config,
        userAssets,
      }),
    });
    const timelineData = await timelineRes.json().catch(() => ({}));

    if (!timelineRes.ok || !timelineData.timeline?.scenes?.length) {
      throw new Error(timelineData.details || timelineData.error || 'AI timeline failed.');
    }

    const timeline = timelineData.timeline;
    await upsertUserProjectFromServer(userId, jobId, {
      status: 'Timeline ready, starting FFmpeg',
      progress: 68,
      timelineScenes: timeline.scenes.length,
      captions: timeline.captions?.length || 0,
      durationSeconds: timeline.metadata?.duration,
      timeline,
    });
    await upsertFfmpegJob({
      userId,
      jobId,
      status: 'rendering',
      progress: 68,
      message: 'Timeline is ready. Sending job to FFmpeg render worker...',
    }).catch((error) => console.warn(`Render handoff status write failed for ${jobId}:`, error));

    const renderRes = await fetch(`${origin}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeline,
        voiceoverUrl,
        jobId,
        userId,
        priority: 'high',
      }),
    });
    const renderData = await renderRes.json().catch(() => ({}));

    if (!renderRes.ok) {
      throw new Error(renderData.details || renderData.error || 'Render failed.');
    }

    const videoUrl = renderData.videoUrl || renderData.renderUrl || '';
    if (videoUrl) {
      await upsertUserProjectFromServer(userId, jobId, {
        status: 'Video ready',
        progress: 100,
        renderUrl: videoUrl,
        videoUrl,
      });
      return {
        status: 'ready',
        stage: 'complete',
        message: 'Video rendered successfully.',
      };
    }

    await upsertUserProjectFromServer(userId, jobId, {
      status: 'Rendering MP4',
      progress: 72,
    });
    return {
      status: 'rendering',
      stage: 'ffmpeg_worker',
      message: 'AI timeline completed and FFmpeg worker accepted the render job.',
    };
  } catch (error: any) {
    console.error(`Generation pipeline failed for ${jobId}:`, error);
    await upsertFfmpegJob({
      userId,
      jobId,
      status: 'error',
      progress: 12,
      message: error.message || 'Pipeline failed before FFmpeg completed.',
      error: error.message || 'Pipeline failed before FFmpeg completed.',
    }).catch((writeError) => {
      console.error(`Failed to mark FFmpeg job ${jobId} as failed:`, writeError);
    });
    await upsertUserProjectFromServer(userId, jobId, {
      status: 'Needs retry',
      progress: 12,
      error: error.message || 'Generation pipeline failed.',
    }).catch((writeError) => {
      console.error(`Failed to mark job ${jobId} as failed:`, writeError);
    });
    throw error;
  }
}

function getRenderWorkerUrl() {
  return String(process.env.RENDER_BACKEND_URL || process.env.RENDER_WORKER_URL || process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || '').replace(/\/$/, '');
}

function getWorkerAuthHeaders(): Record<string, string> {
  const secret = process.env.RENDER_WORKER_SECRET;
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

async function getFreeTierGateStatus() {
  const storedValue = await getAppSettingFromServer<unknown>(
    FREE_TIER_SETTING_KEY,
    process.env.FREE_TIER_RENDER_ENABLED ?? true,
  ).catch((error) => {
    console.warn('Free-tier gate setting read failed; using env fallback:', error);
    return process.env.FREE_TIER_RENDER_ENABLED ?? true;
  });
  const enabled = parseBooleanSetting(storedValue, true);
  const queue = await getWorkerQueueHealth();
  const queueSize = queue.active + queue.pending;
  const autoBlocked = queue.available && queueSize > FREE_TIER_QUEUE_LIMIT;
  const allowed = enabled && !autoBlocked;

  return {
    allowed,
    enabled,
    autoBlocked,
    limit: FREE_TIER_QUEUE_LIMIT,
    queue,
    message: autoBlocked
      ? 'Server is busy right now. Free renders are temporarily paused. Please try again in a little while.'
      : 'Free renders are temporarily paused. Please try again in a little while.',
  };
}

async function getWorkerQueueHealth() {
  const workerUrl = getRenderWorkerUrl();
  const emptyQueue = { active: 0, pending: 0, maxParallel: 0, available: false };
  if (!workerUrl) return emptyQueue;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WORKER_HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${workerUrl}/health`, {
      headers: getWorkerAuthHeaders(),
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return {
      active: getNonNegativeNumber(data?.queue?.active, 0),
      pending: getNonNegativeNumber(data?.queue?.pending, 0),
      maxParallel: getNonNegativeNumber(data?.queue?.maxParallel, 0),
      available: response.ok,
    };
  } catch (error: any) {
    console.warn('Free-tier queue health check failed; leaving gate open:', error?.message || error);
    return emptyQueue;
  } finally {
    clearTimeout(timeout);
  }
}

function isPaidTier(tier: unknown) {
  return ['premium', 'pro', 'creator', 'studio', 'paid'].includes(String(tier || '').toLowerCase());
}

function parseBooleanSetting(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;
  }
  if (isPlainObject(value)) {
    if ('enabled' in value) return parseBooleanSetting(value.enabled, fallback);
    if ('freeTierEnabled' in value) return parseBooleanSetting(value.freeTierEnabled, fallback);
  }
  return fallback;
}

function getPositiveNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function getNonNegativeNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function createJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getTargetDurationSeconds(value: unknown) {
  const duration = Number(value || DEFAULT_TARGET_DURATION_SECONDS);
  if (!Number.isFinite(duration) || duration <= 0) return DEFAULT_TARGET_DURATION_SECONDS;
  return Math.ceil(duration);
}

async function getUserTierForRender(_userId: string) {
  // Payment approval is still pending, so every render stays on the stable free profile.
  // When billing is live, replace this with the Supabase user subscription tier.
  return 'free';
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeUserAssets(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((asset) => {
      if (!isPlainObject(asset)) return null;
      const url = sanitizeString(asset.url);
      if (!url) return null;

      return {
        url,
        type: sanitizeString(asset.type) === 'video' ? 'video' as const : 'image' as const,
        filename: sanitizeString(asset.filename),
      };
    })
    .filter(Boolean) as Array<{ url: string; type: 'image' | 'video'; filename?: string }>;
}
