import { NextRequest, NextResponse } from 'next/server';
import { extractCharacterDna, buildFallbackStoryboard, VisualArtStyle, ScenePacing } from '@/services/ai/geminiSceneDirector';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'generate-storyboard';

    if (action === 'extract-character-dna') {
      const { imageUrl, userHint } = body;
      if (!imageUrl) {
        return NextResponse.json({ ok: false, error: 'Character image is required.' }, { status: 400 });
      }

      const result = await extractCharacterDna({ imageUrl, userHint });
      return NextResponse.json({ ok: true, result });
    }

    // Default action: generate storyboard prompts
    const transcript = String(body.transcript || '');
    const durationSeconds = Number(body.durationSeconds) || 60;
    const visualStyle: VisualArtStyle = body.visualStyle === '2d' || body.visualStyle === '3d' ? body.visualStyle : 'realistic';
    const characterDna = typeof body.characterDna === 'string' ? body.characterDna : undefined;
    const pacing: ScenePacing = body.pacing === 'dynamic' || body.pacing === 'relaxed' ? body.pacing : 'balanced';

    const scenes = buildFallbackStoryboard({
      transcript,
      durationSeconds,
      visualStyle,
      characterDna,
      pacing,
    });

    return NextResponse.json({
      ok: true,
      visualStyle,
      sceneCount: scenes.length,
      scenes,
    });
  } catch (err) {
    console.error('[AI_STORYBOARD_API_ERROR]', err);
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal error processing storyboard.',
    }, { status: 500 });
  }
}
