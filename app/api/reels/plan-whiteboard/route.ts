import { NextResponse } from 'next/server';
import { planWhiteboardVideo, buildWhiteboardSegments } from '@/services/ai/whiteboardPlanner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const transcript = String(body.transcript || '').trim();
    const durationSeconds = Number(body.durationSeconds) || 30;
    const topicTitle = body.topicTitle ? String(body.topicTitle) : undefined;
    const words = Array.isArray(body.words) ? body.words : [];

    if (!transcript) {
      return NextResponse.json({ ok: false, error: 'Transcript is required to plan whiteboard scenes.' }, { status: 400 });
    }

    const wbWords = words.map((w: any) => ({
      word: String(w.word || ''),
      start: Number(w.start || 0),
      end: Number(w.end || 0),
    }));

    const wbSegments = buildWhiteboardSegments(wbWords, durationSeconds);

    const plan = await planWhiteboardVideo({
      transcript,
      segments: wbSegments.map((s) => ({ start: s.start, end: s.end, text: s.text })),
      words: wbWords,
      durationSeconds,
      topicTitle,
      boardStyle: 'classic_black_marker',
      aspectRatio: '9:16',
    });

    return NextResponse.json({
      ok: true,
      success: true,
      plan,
      words: wbWords,
    });
  } catch (err: any) {
    console.error('[PLAN_WHITEBOARD_ERROR]', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to plan whiteboard storyboard.' }, { status: 500 });
  }
}
