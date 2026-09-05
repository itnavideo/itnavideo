import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { getRenderAccessForUser } from '@/services/billing/renderAccess';
import { analyzeAudioScript, type AudioCleanOptions } from '@/services/ai/audioCleanService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mediaKey = String(body.mediaKey || '');
    const userId = String(body.userId || '');
    const options: AudioCleanOptions = {
      removeSilence: Boolean(body.audioCleanOptions?.removeSilence ?? true),
      removeFillers: Boolean(body.audioCleanOptions?.removeFillers ?? true),
      removeRepeats: Boolean(body.audioCleanOptions?.removeRepeats ?? true),
      removeFalseStarts: Boolean(body.audioCleanOptions?.removeFalseStarts ?? true),
      noiseReduction: Boolean(body.audioCleanOptions?.noiseReduction ?? false),
      volumeNormalize: Boolean(body.audioCleanOptions?.volumeNormalize ?? true),
      trimEnds: Boolean(body.audioCleanOptions?.trimEnds ?? true),
    };

    if (!mediaKey) {
      return NextResponse.json({ ok: false, error: 'Please upload an audio file first.' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Please log in first.' }, { status: 401 });
    }

    // Access check
    const access = await getRenderAccessForUser(userId, {});
    if (!access.allowed) {
      return NextResponse.json(
        { ok: false, error: access.reason || 'No credits remaining.', upgradeUrl: '/pricing' },
        { status: 402 }
      );
    }

    // Read URL
    const mediaUrl = await createReadUrl(mediaKey);

    // Groq transcription
    const transcript = await transcribeMediaUrlWithGroq({
      mediaUrl,
      fileName: 'audio.mp3',
    });

    if (!transcript || !transcript.transcript) {
      return NextResponse.json({ ok: false, error: 'Could not transcribe audio. Please ensure the audio contains clear speech.' }, { status: 422 });
    }

    // Run script analysis to detect repeated sentences, mistakes, and silences
    const analysis = analyzeAudioScript(transcript, options);

    return NextResponse.json({
      ok: true,
      mediaKey,
      transcript: analysis.transcript,
      segments: analysis.segments,
      words: analysis.words,
      originalDuration: analysis.originalDuration,
      estimatedCleanDuration: analysis.estimatedCleanDuration,
      stats: analysis.stats,
      rawTranscript: transcript,
    });
  } catch (error) {
    console.error('[AUDIO_CLEAN_ANALYZE] Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Transcription & analysis failed.' },
      { status: 500 }
    );
  }
}
