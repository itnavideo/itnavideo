import { NextResponse } from 'next/server';
import { releaseReservedRenderUsageFromServer } from '@/services/billing/renderAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory cancelled jobs set so status checks immediately return cancelled state
export const cancelledJobs = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const renderId = String(body.renderId || body.jobId || '').trim();
    const userId = String(body.userId || '').trim();

    if (!renderId) {
      return NextResponse.json({ ok: false, error: 'renderId or jobId is required.' }, { status: 400 });
    }

    // Add render ID to in-memory cancellation registry
    cancelledJobs.add(renderId);

    // Release reserved credit allocation if userId is provided
    if (userId) {
      try {
        await releaseReservedRenderUsageFromServer({ userId, renderId });
      } catch (err) {
        console.warn('[JOB_CANCEL] Credit release warning:', err);
      }
    }

    console.log(`[JOB_CANCELLED] Job ${renderId} was cancelled by user ${userId || 'anonymous'}`);

    return NextResponse.json({
      ok: true,
      cancelled: true,
      renderId,
      message: 'Process cancelled successfully. Render credits released.',
    });
  } catch (error) {
    console.error('[JOB_CANCEL_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Failed to cancel job process.' }, { status: 500 });
  }
}
