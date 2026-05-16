import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 10;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const voiceoverUrl = sanitizeString(body.voiceoverUrl || body.voiceUrl);
    const userId = sanitizeString(body.userId);
    const jobId = sanitizeString(body.jobId) || createJobId();

    if (!voiceoverUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const workerUrl = getRenderWorkerUrl();
    if (!workerUrl) {
      return NextResponse.json(
        {
          error: 'RENDER_BACKEND_URL is not configured',
          details: 'Set RENDER_BACKEND_URL to your Render worker service URL.',
        },
        { status: 500 },
      );
    }

    const response = await fetch(`${workerUrl}/api/pipeline/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getWorkerAuthHeaders(),
      },
      body: JSON.stringify({
        ...body,
        userId,
        jobId,
        voiceoverUrl,
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || 'Worker pipeline handoff failed.',
          details: data.details || data.message,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      accepted: true,
      jobId,
      status: 'processing',
      stage: 'render_worker_pipeline',
      message: 'Video generation started on the background worker.',
    });
  } catch (error: any) {
    console.error('Timeline worker handoff failed:', error);
    return NextResponse.json(
      { error: 'Timeline worker handoff failed', details: error.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

function getRenderWorkerUrl() {
  return String(process.env.RENDER_BACKEND_URL || process.env.RENDER_WORKER_URL || process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || '').replace(/\/$/, '');
}

function getWorkerAuthHeaders(): Record<string, string> {
  const secret = process.env.RENDER_WORKER_SECRET;
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function createJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
