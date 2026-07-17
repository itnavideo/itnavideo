import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { getRenderAccessForUser } from '@/services/billing/renderAccess';
import { cleanAudioWithAI } from '@/services/ai/audioCleanService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mediaKey = String(body.mediaKey || '');
    const userId = String(body.userId || '');
    const options = body.audioCleanOptions || {};

    if (!mediaKey) {
      return NextResponse.json({ ok: false, error: 'Please upload an audio file.' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Please log in first.' }, { status: 401 });
    }

    // Check access
    const access = await getRenderAccessForUser(userId, {});
    if (!access.allowed) {
      return NextResponse.json({ ok: false, error: access.reason || 'No credits remaining.', upgradeUrl: '/pricing' }, { status: 402 });
    }

    // Get signed URL
    const mediaUrl = await createReadUrl(mediaKey);

    // Transcribe with Groq for filler/repeat detection
    let transcript: any = null;
    if (options.removeFillers || options.removeRepeats || options.removeFalseStarts) {
      try {
        const result = await transcribeMediaUrlWithGroq({ mediaUrl, fileName: 'audio.mp3' });
        transcript = result;
      } catch (err) {
        console.warn('[AUDIO_CLEAN] Transcription failed, skipping filler/repeat removal:', err);
      }
    }

    // Process audio
    const result = await cleanAudioWithAI({
      mediaUrl,
      mediaKey,
      userId,
      options: {
        removeSilence: Boolean(options.removeSilence),
        removeFillers: Boolean(options.removeFillers),
        removeRepeats: Boolean(options.removeRepeats),
        removeFalseStarts: Boolean(options.removeFalseStarts),
        noiseReduction: Boolean(options.noiseReduction),
        volumeNormalize: Boolean(options.volumeNormalize),
        trimEnds: Boolean(options.trimEnds),
      },
      transcript,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || 'Audio cleaning failed.' }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      status: 'complete',
      outputUrl: result.outputUrl,
      originalDuration: result.originalDuration,
      cleanedDuration: result.cleanedDuration,
      removedSegments: result.removedSegments,
      access,
    });
  } catch (error) {
    console.error('[AUDIO_CLEAN] Error:', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
