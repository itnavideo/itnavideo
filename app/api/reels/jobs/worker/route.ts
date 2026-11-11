import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * DEAD ROUTE — This worker route is NOT called by any component or the jobs route.
 * All render dispatching goes directly through /api/reels/jobs.
 * This file is preserved to avoid breaking imports, but returns 410 Gone.
 *
 * If a queue-based worker pattern is needed in future:
 * - Fix AWS region to us-east-1 (not ap-south-1)
 * - Wire FacelessShortsPageClient / other studios to call this route as a plan step
 * - Add authentication and credit reservation
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'This worker route is deprecated. Use /api/reels/jobs directly.' },
    { status: 410 }
  );
}
