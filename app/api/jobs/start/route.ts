import { NextRequest, NextResponse } from 'next/server';
import { upsertUserProjectFromServer } from '@/services/supabase/projectStore';
import { upsertFfmpegJob } from '@/services/rendering/ffmpegJobStore';

export const runtime = 'nodejs';
export const maxDuration = 10;
export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  aspectRatio: 'Portrait (9:16)',
  editingStyle: 'reels_pacing',
  captionStyle: 'Reels',
  quality: '1080p',
  creationMode: 'faceless',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = sanitizeString(body.userId);
    const voiceoverUrl = sanitizeString(body.voiceoverUrl || body.voiceUrl);
    const jobId = sanitizeString(body.jobId) || createJobId();
    const title = sanitizeString(body.title) || `Project ${jobId.toUpperCase()}`;
    const userAssets = normalizeUserAssets(body.userAssets);
    const config = {
      ...DEFAULT_CONFIG,
      ...(isPlainObject(body.config) ? body.config : {}),
    };
    const shouldRunPipeline = body.runPipeline !== false;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!voiceoverUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    await upsertUserProjectFromServer(userId, jobId, {
      id: jobId,
      title,
      status: 'Queued',
      progress: 12,
      quality: '1080p',
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
        targetDurationSeconds: Number(body.targetDurationSeconds || config.targetDurationSeconds || 0),
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

  const response = await fetch(`${workerUrl}/api/pipeline/start`, {
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
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.details || data.error || 'Render worker did not accept the job.');
  }
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

function getWorkerAuthHeaders() {
  const secret = process.env.RENDER_WORKER_SECRET;
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

function createJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
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
