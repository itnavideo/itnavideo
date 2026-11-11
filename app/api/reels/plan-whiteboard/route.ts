import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * BE8 Fix: This route is DEAD CODE — no component or studio calls it.
 * WhiteboardStudio.tsx uses /api/reels/transcribe directly, then renders via /api/reels/jobs.
 * Disabled to remove unnecessary Lambda cold-start overhead.
 * If whiteboard needs a dedicated plan step in future, rebuild and wire onTranscribeAndPlan.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'This planning endpoint is not in use. Whiteboard renders go through /api/reels/jobs directly.' },
    { status: 410 }
  );
}
