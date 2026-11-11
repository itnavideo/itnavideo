import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * BE8 Fix: This route is DEAD CODE — no component calls it.
 * FacelessShortsPageClient renders directly via /api/reels/jobs which runs the
 * 16-specialist production crew inline. Disabled to remove dead code overhead.
 * If a dedicated plan step is needed in future, wire FacelessShortsStudio.tsx
 * onTranscribeAndPlan hook to call this endpoint.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'This planning endpoint is not in use. Faceless Shorts renders go through /api/reels/jobs directly.' },
    { status: 410 }
  );
}
