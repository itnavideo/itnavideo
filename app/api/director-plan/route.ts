import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceover } from '@/services/ai/voiceAnalysis';
import { createVideoDirectorPlan } from '@/services/ai/videoDirector';
import { normalizeCreationMode } from '@/services/ai/videoModeInstructions';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { voiceoverUrl, voiceUrl, editingStyle, config } = await request.json();
    const audioUrl = voiceoverUrl || voiceUrl;
    const creationMode = normalizeCreationMode(config?.creationMode || config?.mode || 'faceless');

    if (!audioUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    const voiceoverAnalysis = await analyzeVoiceover(audioUrl);
    const directorPlan = await createVideoDirectorPlan(voiceoverAnalysis, editingStyle || config?.editingStyle || config?.mood, creationMode);

    return NextResponse.json({
      success: true,
      voiceoverAnalysis,
      directorPlan,
    });
  } catch (error) {
    console.error('Director planning error:', error);

    return NextResponse.json(
      {
        error: 'Director planning failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

