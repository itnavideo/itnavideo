import { NextResponse } from 'next/server';
import { getAvailableFontsDatabase } from '@/services/assets/fontDatabase';
import { isGoogleDriveConfigured } from '@/services/assets/googleDriveClient.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fonts = await getAvailableFontsDatabase();

    return NextResponse.json({
      success: true,
      configured: isGoogleDriveConfigured(),
      count: fonts.length,
      AVAILABLE_FONTS_DATABASE: fonts,
    });
  } catch (error) {
    console.error('Drive font database route failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Drive font database scan failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
