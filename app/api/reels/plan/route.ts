import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * BE9 Fix: This generic reel planning route is DEAD CODE — no component calls /api/reels/plan.
 * It is a legacy route from a pre-multimode architecture, capped at 60s max duration.
 * All video types now dispatch directly to /api/reels/jobs with their mode parameter.
 * Disabled to remove maintenance overhead and unnecessary bundle imports.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'This legacy endpoint is not in use. Use /api/reels/jobs with a mode parameter.' },
    { status: 410 }
  );
}
