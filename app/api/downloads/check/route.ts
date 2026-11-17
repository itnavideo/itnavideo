import { NextRequest, NextResponse } from 'next/server';
import { getUserDailyDownloads } from '@/services/supabase/downloadStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('x-user-id');

    if (!userId || userId === 'anonymous') {
      return NextResponse.json({
        ok: true,
        authenticated: false,
        used: 0,
        limit: 2,
        remaining: 2,
        resetsAt: new Date().toISOString(),
        resetsInFormatted: '12:00 AM IST',
        allowed: false,
        message: 'Sign in to access your 2 free daily video downloads.',
      });
    }

    const stats = await getUserDailyDownloads(userId);

    return NextResponse.json({
      ok: true,
      authenticated: true,
      userId: stats.userId,
      dateIST: stats.dateIST,
      used: stats.used,
      limit: stats.limit,
      remaining: stats.remaining,
      allowed: stats.remaining > 0,
      downloadedVideoIds: stats.downloadedVideoIds,
      resetsAt: stats.resetsAt,
      resetsInFormatted: stats.resetsInFormatted,
    });
  } catch (error: any) {
    console.error('Error in /api/downloads/check:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error checking downloads.' },
      { status: 500 }
    );
  }
}
