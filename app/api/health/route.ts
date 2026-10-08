import { NextResponse } from 'next/server';
import { canWriteSupabaseFromServer } from '@/services/supabase/siteStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        configured: canWriteSupabaseFromServer(),
        mode: 'supabase',
      },
      videoPipeline: {
        status: 'removed',
        provider: 'none',
      },
    },
  });
}
