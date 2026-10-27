import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { planWhiteboardVideo, buildWhiteboardSegments } from '@/services/ai/whiteboardPlanner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      transcript: inputTranscript,
      words: inputWords,
      timestampSegments: inputSegments, // Not strictly required, planner uses words
      durationSeconds: inputDuration,
      topicTitle,
      boardStyle = 'corporate-luxury',
      aspectRatio = '9:16',
    } = body;

    let audioUrl = String(body.audioUrl || body.mediaKey || '').trim();
    if (audioUrl) {
      if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
        try {
          audioUrl = await createReadUrl(audioUrl);
        } catch (e) {
          console.warn('[PlanWhiteboard] Could not resolve audioUrl key:', audioUrl, e);
        }
      } else if (audioUrl.includes('.amazonaws.com/') && !audioUrl.includes('X-Amz-Signature')) {
        try {
          const key = audioUrl.split('.amazonaws.com/')[1];
          if (key) audioUrl = await createReadUrl(decodeURIComponent(key));
        } catch (e) {
          console.warn('[PlanWhiteboard] Could not sign S3 URL:', audioUrl, e);
        }
      }
    }

    if (!audioUrl && !inputTranscript) {
      return NextResponse.json(
        { error: 'Either audioUrl or transcript is required' },
        { status: 400 }
      );
    }

    let transcript = inputTranscript || '';
    let words = inputWords || [];
    let durationSeconds = Number(inputDuration) || 0;

    // Transcribe audio if transcript not provided
    if (!transcript && audioUrl) {
      let result;
      try {
        result = await transcribeMediaUrlWithGroq({ mediaUrl: audioUrl, fileName: 'whiteboard-audio.mp3' });
      } catch (err) {
        console.warn('[PlanWhiteboard] Groq transcription fallback to Gemini:', err);
        result = await transcribeMediaWithGeminiFallback({ mediaUrl: audioUrl, fileName: 'whiteboard-audio.mp3' });
      }

      if (result) {
        transcript = result.transcript || '';
        words = result.words || [];
        if (!durationSeconds && result.durationSeconds) {
          durationSeconds = result.durationSeconds;
        }
      }
    }

    if (!durationSeconds || durationSeconds <= 0) {
      durationSeconds = 60; // Fallback safe estimate
    }
    // Limit to 90 seconds strictly per Rule 4.1 for 9:16 Short-Form
    durationSeconds = Math.min(90, durationSeconds);
    
    // Ensure words array has finite numbers
    const wbWords = (words || [])
        .filter((w: any) => typeof w.word === 'string' && w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
        .map((w: any) => ({ word: w.word, start: Number(w.start), end: Number(w.end) }));
    
    // Build whiteboard segments
    const wbSegments = buildWhiteboardSegments(wbWords, durationSeconds);

    const planRequest = {
      transcript,
      segments: wbSegments.map((s) => ({ start: s.start, end: s.end, text: s.text })),
      words: wbWords,
      durationSeconds,
      topicTitle: topicTitle || undefined,
      boardStyle,
      aspectRatio,
    };

    const plan = await planWhiteboardVideo(planRequest as any);

    return NextResponse.json({
      success: true,
      plan,
      transcript,
      words: wbWords,
      timestampSegments: wbSegments,
      durationSeconds,
    });
  } catch (error: any) {
    console.error('[PlanWhiteboard] Error generating plan:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate Whiteboard Plan' },
      { status: 500 }
    );
  }
}
