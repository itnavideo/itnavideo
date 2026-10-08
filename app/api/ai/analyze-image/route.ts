import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageContent, analyzeMultipleImages } from '../../../../services/ai/imageUnderstanding';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { imageUrl, imageUrls, originalFileName } = body;

    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const results = await analyzeMultipleImages(imageUrls);
      return NextResponse.json({
        ok: true,
        count: results.length,
        analyzedImages: results,
      });
    }

    if (imageUrl && typeof imageUrl === 'string') {
      const result = await analyzeImageContent(imageUrl, {
        originalFileName: typeof originalFileName === 'string' ? originalFileName : undefined,
      });
      return NextResponse.json({
        ok: true,
        analyzedImage: result,
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Please provide imageUrl or imageUrls in the request body.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[ANALYZE_IMAGE_API] Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
