import { NextResponse } from 'next/server';
import { getAvailableIconsDatabase } from '@/services/assets/iconDatabase';
import { isGoogleDriveConfigured } from '@/services/assets/googleDriveClient.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const icons = await getAvailableIconsDatabase();

    return NextResponse.json({
      success: true,
      configured: isGoogleDriveConfigured(),
      count: icons.length,
      AVAILABLE_ICONS_DATABASE: icons,
    });
  } catch (error) {
    console.error('Drive icon database route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Drive icon database scan failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
