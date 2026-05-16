import { NextRequest, NextResponse } from 'next/server';
import { downloadGoogleDriveFile } from '@/services/assets/googleDriveClient.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const fileId = new URL(request.url).searchParams.get('id');
    if (!fileId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const driveResponse = await downloadGoogleDriveFile(fileId);
    const headers = new Headers();
    const contentType = driveResponse.headers.get('content-type');
    const contentLength = driveResponse.headers.get('content-length');

    if (contentType) headers.set('content-type', contentType);
    if (contentLength) headers.set('content-length', contentLength);
    headers.set('cache-control', 'private, max-age=300');

    return new NextResponse(driveResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Drive asset download failed:', error);
    return NextResponse.json(
      {
        error: 'Drive asset download failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
