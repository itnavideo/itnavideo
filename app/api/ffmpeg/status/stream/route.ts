import { NextRequest } from 'next/server';
import { getFfmpegJob } from '@/services/rendering/ffmpegJobStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STREAM_INTERVAL_MS = 2000;
const STREAM_MAX_MS = 10 * 60 * 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const jobId = searchParams.get('jobId');

  if (!userId || !jobId) {
    return Response.json({ error: 'userId and jobId are required' }, { status: 400, headers: corsHeaders });
  }

  const encoder = new TextEncoder();
  let closed = false;
  let lastPayload = '';
  let interval: ReturnType<typeof setInterval> | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const close = () => {
        if (closed) return;
        closed = true;
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
        controller.close();
      };

      const tick = async () => {
        if (closed) return;

        const job = await getFfmpegJob(userId, jobId);
        const payload = JSON.stringify(job || { status: 'not_found', progress: 0, message: 'Waiting for job status...' });

        if (payload !== lastPayload) {
          lastPayload = payload;
          send('status', JSON.parse(payload));
        } else {
          send('pulse', { at: new Date().toISOString() });
        }

        if (job?.status === 'ready' || job?.status === 'error') close();
      };

      send('open', { ok: true, jobId });
      void tick().catch((error) => send('error', { message: error?.message || 'Status stream failed' }));
      interval = setInterval(() => {
        void tick().catch((error) => send('error', { message: error?.message || 'Status stream failed' }));
      }, STREAM_INTERVAL_MS);
      timeout = setTimeout(close, STREAM_MAX_MS);
    },
    cancel() {
      closed = true;
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
