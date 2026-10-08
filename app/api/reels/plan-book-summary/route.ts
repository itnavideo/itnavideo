import { NextResponse } from 'next/server';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import { transcribeMediaWithGeminiFallback } from '@/services/ai/geminiTranscription';
import { buildLocalBookSummaryPlan, validateAndRepairBookSummaryPlan, type BookSummaryPlanRequest } from '@/services/ai/bookSummaryPlanner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      audioUrl,
      transcript: inputTranscript,
      words: inputWords,
      timestampSegments: inputSegments,
      durationSeconds: inputDuration,
      bookTitle,
      authorName,
      bookCoverUrl,
      authorPortraitUrl,
      referenceImages = [],
    } = body;

    if (!audioUrl && !inputTranscript) {
      return NextResponse.json(
        { error: 'Either audioUrl or transcript is required' },
        { status: 400 }
      );
    }

    let transcript = inputTranscript || '';
    let words = inputWords || [];
    let timestampSegments = inputSegments || [];
    let durationSeconds = Number(inputDuration) || 0;

    // Transcribe audio if transcript not provided
    if (!transcript && audioUrl) {
      let result;
      try {
        result = await transcribeMediaUrlWithGroq({ mediaUrl: audioUrl, fileName: 'book-summary-audio.mp3' });
      } catch (err) {
        console.warn('[PlanBookSummary] Groq transcription fallback to Gemini:', err);
        result = await transcribeMediaWithGeminiFallback({ mediaUrl: audioUrl, fileName: 'book-summary-audio.mp3' });
      }

      if (result) {
        transcript = result.transcript || '';
        words = result.words || [];
        timestampSegments = result.segments || [];
        if (!durationSeconds && result.durationSeconds) {
          durationSeconds = result.durationSeconds;
        }
      }
    }

    if (!durationSeconds || durationSeconds <= 0) {
      durationSeconds = 60; // Fallback safe estimate
    }

    const planRequest: BookSummaryPlanRequest = {
      transcript,
      words,
      timestampSegments,
      durationSeconds,
      bookTitle,
      authorName,
      bookCoverUrl,
      authorPortraitUrl,
      referenceImages,
    };

    const initialPlan = buildLocalBookSummaryPlan(planRequest);
    const finalPlan = validateAndRepairBookSummaryPlan(initialPlan, transcript, durationSeconds);

    return NextResponse.json({
      success: true,
      plan: finalPlan,
      transcript,
      words,
      timestampSegments,
      durationSeconds,
    });
  } catch (error: any) {
    console.error('[PlanBookSummary] Error generating plan:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate Book Summary Plan' },
      { status: 500 }
    );
  }
}
