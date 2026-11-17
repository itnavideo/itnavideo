import { NextRequest, NextResponse } from 'next/server';
import { claimVideoDownload } from '@/services/supabase/downloadStore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || request.headers.get('x-user-id');
    const videoId = body.videoId;
    const videoType = body.videoType || 'generic';
    const outputUrl = body.outputUrl;
    const fileName = body.fileName;

    if (!userId || userId === 'anonymous') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Please sign in or create an account to download your video.',
          reason: 'AUTH_REQUIRED',
        },
        { status: 401 }
      );
    }

    if (!videoId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Missing videoId for download claim.',
        },
        { status: 400 }
      );
    }

    const claimResult = await claimVideoDownload({
      userId,
      videoId,
      videoType,
      outputUrl,
      fileName,
    });

    if (!claimResult.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: claimResult.error || 'Daily download limit reached.',
          used: claimResult.used,
          limit: claimResult.limit,
          remaining: 0,
          resetsAt: claimResult.resetsAt,
          resetsInFormatted: claimResult.resetsInFormatted,
          reason: 'DAILY_LIMIT_EXCEEDED',
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      ok: true,
      downloadUrl: outputUrl || '',
      used: claimResult.used,
      limit: claimResult.limit,
      remaining: claimResult.remaining,
      alreadyClaimed: claimResult.alreadyClaimed,
      resetsAt: claimResult.resetsAt,
      resetsInFormatted: claimResult.resetsInFormatted,
    });
  } catch (error: any) {
    console.error('Error in /api/downloads/claim:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error claiming download.' },
      { status: 500 }
    );
  }
}
