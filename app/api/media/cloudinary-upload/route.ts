import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * This endpoint has been DISABLED.
 *
 * Reason: The route was unauthenticated (no session check), had hardcoded
 * Cloudinary credentials, and had zero callers in the codebase.
 * All media uploads now use the secure presigned S3 flow via /api/media/presign.
 *
 * If Cloudinary upload is needed in the future, rebuild with:
 *   1. Supabase session authentication (check user before accepting upload)
 *   2. Credentials loaded only from environment variables (never hardcoded)
 *   3. Proper rate limiting tied to userId, not just IP
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'This endpoint is not available. Use /api/media/presign for uploads.' },
    { status: 410 }
  );
}
