import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_AI_VOICES, synthesizeSpeechWithGoogleTts } from '@/services/ai/googleTtsService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Long scripts are chunked into multiple sequential TTS calls.
export const maxDuration = 300;

export async function GET() {
  return NextResponse.json({
    success: true,
    voices: GOOGLE_AI_VOICES,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId, speakingRate, pitch } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text prompt/script is required' },
        { status: 400 }
      );
    }

    // Image to Video AI is capped at 5 minutes. ~5,000 characters is about
    // 5 minutes of speech, which also fits Google TTS's single-request limit
    // (chunking in the service still covers edge cases just over one chunk).
    if (text.length > 5200) {
      return NextResponse.json(
        { success: false, error: 'Script is too long. Please keep it under ~5,000 characters (about 5 minutes of narration).' },
        { status: 400 }
      );
    }

    const result = await synthesizeSpeechWithGoogleTts({
      text,
      voiceId,
      speakingRate: speakingRate ? Number(speakingRate) : 1.0,
      pitch: pitch ? Number(pitch) : 0.0,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to synthesize speech' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audioBase64: result.audioBase64,
      mimeType: result.mimeType || 'audio/mp3',
      voiceId: result.voiceId,
      voiceName: result.voiceName,
      characterCount: result.characterCount,
    });
  } catch (err: any) {
    console.error('[API_TTS] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
