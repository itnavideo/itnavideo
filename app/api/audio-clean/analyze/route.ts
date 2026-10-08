import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/gcs/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { getRenderAccessForUser } from '@/services/billing/renderAccess';
import { analyzeAudioScript, type AudioCleanOptions, type AudioTranscriptData } from '@/services/ai/audioCleanService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StreamPayload = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function makeStreamingResponse(
  handler: (send: (data: StreamPayload) => Promise<void>) => Promise<void>
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = async (data: StreamPayload) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
        } catch (e) {
          console.warn('[STREAM_ERROR] Failed to enqueue:', e);
        }
      };

      const heartbeatInterval = setInterval(() => {
        send({ state: 'heartbeat', ok: true });
      }, 3000);

      try {
        await handler(send);
      } catch (err: unknown) {
        console.error('[STREAM_HANDLER_ERROR] failed:', err);
        await send({
          ok: false,
          error: err instanceof Error ? err.message : 'An unexpected processing error occurred.',
        });
      } finally {
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch {}
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = asRecord(await request.json());
    const submittedOptions = asRecord(body.audioCleanOptions);
    const mediaKey = String(body.mediaKey || '');
    const userId = String(body.userId || '');
    const options: AudioCleanOptions = {
      pacing: submittedOptions.pacing === 'natural' || submittedOptions.pacing === 'relaxed'
        ? (submittedOptions.pacing as 'natural' | 'relaxed')
        : 'fast',
      preserveInputQuality: submittedOptions.preserveInputQuality !== undefined ? Boolean(submittedOptions.preserveInputQuality) : true,
      removeSilence: Boolean(submittedOptions.removeSilence ?? true),
      trimEnds: Boolean(submittedOptions.trimEnds ?? true),
      exportFormat: (submittedOptions.exportFormat as 'mp3' | 'wav' | 'm4a') || 'mp3',
      playbackSpeed: Number(submittedOptions.playbackSpeed ?? 1.0),
    };

    const pastedScript = typeof body.pastedScript === 'string' ? body.pastedScript.trim() : undefined;

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

    return makeStreamingResponse(async (send) => {
      await send({ ok: true, state: 'progress', progress: 0.1, message: 'Getting your recording ready...' });

      // Read URL
      await send({ ok: true, state: 'progress', progress: 0.2, message: 'Preparing audio for transcription...' });
      const mediaUrl = await createReadUrl(mediaKey);

      // Audio transcription: Primary = Groq Whisper Large v3 Turbo (Max 15 min / 900s)
      await send({ ok: true, state: 'progress', progress: 0.35, message: 'Groq Whisper transcribing speech & word timestamps...' });
      let transcript: AudioTranscriptData | null = null;
      try {
        transcript = await transcribeMediaUrlWithGroq({
          mediaUrl,
          fileName: 'audio.mp3',
          maxSeconds: 900,
        });
      } catch (groqErr) {
        console.warn('[AUDIO_CLEAN_ANALYZE] Groq Whisper failed or rate-limited. Falling back to Gemini AI:', groqErr);
        await send({ ok: true, state: 'progress', progress: 0.55, message: 'Trying Gemini 2.0 Flash fallback for speech transcription...' });
        try {
          transcript = await transcribeMediaWithGeminiFallback({
            mediaUrl,
            fileName: 'audio.mp3',
            maxSeconds: 900,
          });
        } catch (geminiErr) {
          console.error('[AUDIO_CLEAN_ANALYZE] Gemini fallback also failed:', geminiErr);
        }
      }

      if (!transcript || !transcript.transcript) {
        throw new Error('Could not transcribe audio. Please ensure the audio contains clear speech and is under 15 minutes.');
      }

      await send({ ok: true, state: 'progress', progress: 0.75, message: 'Scanning full timeline for dead air & silence gaps...' });
      // Run full-timeline smart pause and dead-air analysis
      const analysis = await analyzeAudioScript(transcript, options, pastedScript);

      await send({ ok: true, state: 'progress', progress: 0.95, message: 'Transcript and pause analysis ready for review.' });

      await send({
        ok: true,
        state: 'done',
        result: {
          mediaKey,
          transcript: analysis.transcript,
          segments: analysis.segments,
          structuredBlocks: analysis.structuredBlocks || [],
          markdown: analysis.markdown || '',
          words: analysis.words,
          detectedPauses: analysis.detectedPauses || [],
          allSilenceCuts: analysis.allSilenceCuts || [],
          originalDuration: analysis.originalDuration,
          estimatedCleanDuration: analysis.estimatedCleanDuration,
          stats: analysis.stats,
          rawTranscript: transcript,
        }
      });
    });
  } catch (error) {
    console.error('[AUDIO_CLEAN_ANALYZE] Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Transcription & analysis failed.' },
      { status: 500 }
    );
  }
}
