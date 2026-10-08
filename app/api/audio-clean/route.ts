import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/gcs/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { getRenderAccessForUser } from '@/services/billing/renderAccess';
import { cleanAudioWithAI, type AudioTranscriptData } from '@/services/ai/audioCleanService';
import { upsertRenderHistoryFromServer } from '@/services/supabase/siteStore';

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
    const mediaKey = String(body.mediaKey || '');
    const userId = String(body.userId || '');
    const options = asRecord(body.audioCleanOptions);

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

    return makeStreamingResponse(async (send) => {
      await send({ ok: true, state: 'progress', progress: 0.1, message: 'Preparing source audio for cleaning...' });

      // Get signed URL
      const mediaUrl = await createReadUrl(mediaKey);

      // Use passed transcript or transcribe with Groq (Fallback: Gemini AI)
      let transcript: AudioTranscriptData | null = body.transcript && typeof body.transcript === 'object'
        ? body.transcript as AudioTranscriptData
        : null;
      if (!transcript && (options.removeSilence !== false || options.trimEnds !== false)) {
        await send({ ok: true, state: 'progress', progress: 0.25, message: 'Listening for speech and long pauses...' });
        try {
          const result = await transcribeMediaUrlWithGroq({ mediaUrl, fileName: 'audio.mp3', maxSeconds: 900 });
          transcript = result;
        } catch (err) {
          console.warn('[AUDIO_CLEAN] Groq transcription failed, trying Gemini fallback:', err);
          try {
            const geminiResult = await transcribeMediaWithGeminiFallback({ mediaUrl, fileName: 'audio.mp3', maxSeconds: 900 });
            if (geminiResult) transcript = geminiResult;
          } catch (gErr) {
            console.warn('[AUDIO_CLEAN] Gemini fallback also failed, proceeding with audio mastering:', gErr);
          }
        }
      }

      await send({
        ok: true,
        state: 'progress',
        progress: 0.45,
        message: 'Compressing dead air pauses & non-destructive FFmpeg splicing...'
      });

      // Process audio with FFmpeg engine (100% exact original voice preservation)
      const result = await cleanAudioWithAI({
        mediaUrl,
        mediaKey,
        userId,
        options: {
          pacing: options.pacing === 'natural' || options.pacing === 'relaxed'
            ? (options.pacing as 'natural' | 'relaxed')
            : 'fast',
          preserveInputQuality: options.preserveInputQuality !== undefined ? Boolean(options.preserveInputQuality) : true,
          removeSilence: Boolean(options.removeSilence ?? true),
          trimEnds: Boolean(options.trimEnds ?? true),
          exportFormat: (options.exportFormat as 'mp3' | 'wav' | 'm4a') || 'mp3',
          playbackSpeed: Number(options.playbackSpeed || options.speed || 1.0),
        },
        transcript: transcript || undefined,
        customSegmentsToCut: Array.isArray(body.segmentsToCut) && body.segmentsToCut.length > 0
          ? body.segmentsToCut
          : undefined,
      });

      if (!result.ok) {
        throw new Error(result.error || 'Audio cleaning failed.');
      }

      await send({ ok: true, state: 'progress', progress: 0.9, message: 'Exporting studio master with 100% original voice quality...' });

      const renderId = result.renderId || `clean-${Date.now()}`;
      const rawTitle = typeof body.title === 'string' && body.title.trim()
        ? body.title.trim()
        : typeof body.fileName === 'string' && body.fileName.trim()
          ? body.fileName.trim().replace(/\.[^.]+$/, '')
          : 'Cleaned Studio Audio';
      const title = rawTitle.slice(0, 120);
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      if (result.outputUrl) {
        try {
          await upsertRenderHistoryFromServer({
            userId,
            renderId,
            bucketName: result.bucketName || '',
            mode: 'audioClean',
            design: 'Studio Mastered Audio',
            title,
            outputFile: result.outputUrl,
            createdAt,
            expiresAt,
          });
        } catch (historyErr) {
          console.warn('[AUDIO_CLEAN] Supabase render history record failed:', historyErr);
        }
      }

      await send({ ok: true, state: 'progress', progress: 1.0, message: 'Your audio is ready!' });

      await send({
        ok: true,
        state: 'done',
        result: {
          ok: true,
          status: 'complete',
          outputUrl: result.outputUrl,
          mediaKey: result.mediaKey,
          bucketName: result.bucketName,
          renderId,
          title,
          createdAt,
          expiresAt,
          originalUrl: mediaUrl,
          originalDuration: result.originalDuration,
          cleanedDuration: result.cleanedDuration,
          removedSegments: result.removedSegments,
          stats: result.stats,
          access,
        }
      });
    });
  } catch (error) {
    console.error('[AUDIO_CLEAN] Error:', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
