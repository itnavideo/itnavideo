import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceover } from '@/services/ai/voiceAnalysis';
import { generateSubtitlePlan, translateSubtitlePlanToEnglish } from '@/services/ai/subtitleGenerator';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { voiceoverUrl, voiceUrl, style } = await request.json();
    const audioUrl = voiceoverUrl || voiceUrl;

    if (!audioUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    const voiceoverAnalysis = await analyzeVoiceover(audioUrl);
    const subtitlePlan = await translateSubtitlePlanToEnglish(
      generateSubtitlePlan(voiceoverAnalysis, undefined, style),
      voiceoverAnalysis,
    );

    return NextResponse.json({
      success: true,
      voiceoverAnalysis,
      subtitlePlan,
    });
  } catch (error) {
    console.error('Subtitle generation error:', error);

    return NextResponse.json(
      {
        error: 'Subtitle generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

