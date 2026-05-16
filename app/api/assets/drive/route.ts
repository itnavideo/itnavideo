import { NextRequest, NextResponse } from 'next/server';
import { listGoogleDriveAssets } from '@/services/assets/googleDriveAssetLibrary';
import { isGoogleDriveConfigured } from '@/services/assets/googleDriveClient.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = normalizeKind(searchParams.get('kind'));
    const query = searchParams.get('q') || '';
    const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit') || 80)));

    if (!isGoogleDriveConfigured()) {
      return NextResponse.json({
        success: true,
        configured: false,
        assets: [],
      });
    }

    const assets = await listGoogleDriveAssets({ kind, query, limit });

    return NextResponse.json({
      success: true,
      configured: true,
      assets,
    });
  } catch (error) {
    console.error('Drive asset list failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Drive asset list failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

function normalizeKind(value: string | null): 'visual' | 'audio' | 'font' | 'all' {
  return value === 'visual' || value === 'audio' || value === 'font' || value === 'all' ? value : 'all';
}
