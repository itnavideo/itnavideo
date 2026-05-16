import { NextRequest, NextResponse } from 'next/server';
import { upsertUserProjectFromServer } from '@/services/supabase/projectStore';
import { upsertFfmpegJob } from '@/services/rendering/ffmpegJobStore';

export const runtime = 'nodejs';
export const maxDuration = 300; // hobby plan max limit
export const dynamic = 'force-dynamic';

const RENDER_ORDER_TIMEOUT_MS = 60_000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timeline, jobId, userId } = body;

    if (!timeline?.scenes?.length) {
      return NextResponse.json({ error: 'timeline.scenes is required' }, { status: 400, headers: corsHeaders });
    }

    if (!jobId || !userId) {
      return NextResponse.json({ error: 'jobId and userId are required' }, { status: 400, headers: corsHeaders });
    }

    const renderBackendUrl = getRenderBackendUrl();
    if (!renderBackendUrl) {
      await updateRenderStatusBestEffort(userId, jobId, {
        job: {
          status: 'error',
          progress: 0,
          message: 'Render worker URL is not configured. FFmpeg did not start.',
          error: 'RENDER_BACKEND_URL is not configured.',
        },
        project: {
          status: 'Needs render worker',
          progress: 68,
          error: 'RENDER_BACKEND_URL is not configured, so FFmpeg did not start.',
        },
      });
      return NextResponse.json(
        { error: 'RENDER_BACKEND_URL is not configured', details: 'Set RENDER_BACKEND_URL to the Render worker service URL, not the Render dashboard URL.' },
        { status: 500, headers: corsHeaders },
      );
    }

    await updateRenderStatusBestEffort(userId, jobId, {
      job: {
        status: 'queued',
        progress: 5,
        message: 'Render order sent to dedicated worker...',
      },
      project: {
        status: 'Connecting to render server',
        progress: 70,
        renderProvider: 'render',
      },
    });

    await dispatchRenderOrder(renderBackendUrl, body);

    return NextResponse.json(
      {
        success: true,
        jobId,
        status: 'started',
        message: 'Processing started on dedicated server',
      },
      { status: 202, headers: corsHeaders },
    );
  } catch (error: any) {
    console.error('Render order failed:', error);
    return NextResponse.json(
      { error: 'Render failed to start', details: error.message || 'Unknown error' },
      { status: 500, headers: corsHeaders },
    );
  }
}

async function dispatchRenderOrder(renderBackendUrl: string, body: Record<string, unknown>) {
  const jobId = typeof body.jobId === 'string' ? body.jobId : '';
  const userId = typeof body.userId === 'string' ? body.userId : '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RENDER_ORDER_TIMEOUT_MS);

  try {
    const response = await fetch(`${renderBackendUrl}/api/process-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getRenderWorkerAuthHeader(),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      throw new Error(`Render worker rejected order: ${response.status} ${details.slice(0, 500)}`);
    }

    await updateRenderStatusBestEffort(userId, jobId, {
      job: {
        status: 'rendering',
        progress: 10,
        message: 'Dedicated render worker accepted the job.',
      },
      project: {
        status: 'Rendering MP4',
        progress: 78,
        renderProvider: 'render',
      },
    });
  } catch (error: any) {
    console.error(`Render worker dispatch failed for ${jobId}:`, error);
    await updateRenderStatusBestEffort(userId, jobId, {
      job: {
        status: 'error',
        progress: 0,
        message: error.message || 'Render worker dispatch failed.',
        error: error.message || 'Render worker dispatch failed.',
      },
      project: {
        status: 'Needs retry',
        progress: 72,
        error: error.message || 'Render worker dispatch failed.',
      },
    });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getRenderBackendUrl() {
  const backendUrl = process.env.RENDER_BACKEND_URL || process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || '';
  const normalized = backendUrl.replace(/\/$/, '').trim();
  if (!normalized) return '';
  if (/dashboard\.render\.com/i.test(normalized)) return '';
  return normalized;
}

function getRenderWorkerAuthHeader(): Record<string, string> {
  if (!process.env.RENDER_WORKER_SECRET) return {};
  return {
    Authorization: `Bearer ${process.env.RENDER_WORKER_SECRET}`,
  };
}

async function updateProject(userId: string, jobId: string, data: Record<string, unknown>) {
  await upsertUserProjectFromServer(userId, jobId, data).catch((error) => {
    console.warn(`Project status update failed for ${jobId}:`, error);
  });
}

async function updateRenderStatusBestEffort(
  userId: string,
  jobId: string,
  updates: {
    job?: {
      status: 'queued' | 'uploading' | 'processing' | 'rendering' | 'ready' | 'error';
      progress: number;
      message: string;
      videoUrl?: string;
      error?: string;
    };
    project?: Record<string, unknown>;
  },
) {
  const writes: Array<Promise<unknown>> = [];

  if (updates.job) {
    writes.push(upsertFfmpegJob({ userId, jobId, ...updates.job }));
  }

  if (updates.project) {
    writes.push(updateProject(userId, jobId, updates.project));
  }

  const results = await Promise.allSettled(writes);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.warn(`Render status write failed for ${jobId}:`, result.reason);
    }
  });
}
