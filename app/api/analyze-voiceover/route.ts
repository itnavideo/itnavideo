import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceover } from '@/services/ai/voiceAnalysis';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { voiceoverUrl, voiceUrl } = await request.json();
    const audioUrl = voiceoverUrl || voiceUrl;

    if (!audioUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    const analysis = await analyzeVoiceover(audioUrl);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Voiceover analysis error:', error);

    return NextResponse.json(
      {
        error: 'Voiceover analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

