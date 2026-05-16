import { NextRequest, NextResponse } from 'next/server';
import { transcribeUploadedAudio, transcriptionToSrt } from '@/services/ai/voiceAnalysis';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 100 * 1024 * 1024;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400, headers: corsHeaders });
    }

    if (file.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'Audio file must be 100 MB or smaller.' }, { status: 413, headers: corsHeaders });
    }

    const transcription = await transcribeUploadedAudio(file, file.name || 'audio.webm');
    const subtitles = transcriptionToSrt(transcription);

    return NextResponse.json(
      {
        success: true,
        subtitles,
        transcription,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('Transcription API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
