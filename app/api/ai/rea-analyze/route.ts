import { NextRequest, NextResponse } from 'next/server';
import { analyzeVideoWithCloudRea } from '@/services/ai/reaVideoAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, videoTitle } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing required field: videoUrl' }, { status: 400 });
    }

    const result = await analyzeVideoWithCloudRea(videoUrl, videoTitle || 'Reference Video');

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('[API/AI/REA_ANALYZE] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze video with Cloud REA' },
      { status: 500 }
    );
  }
}

