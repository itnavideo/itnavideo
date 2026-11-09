import { NextRequest, NextResponse } from 'next/server';
import {
  enhanceUserPrompt,
  generateAiVideoPlan,
  regenerateSingleScene,
} from '@/services/ai/aiVideoGeneratorPlanner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'generate-plan';

    // 1. Action: Enhance user prompt
    if (action === 'enhance-prompt') {
      const prompt = String(body.prompt || '').trim();
      if (!prompt) {
        return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 });
      }
      const enhanced = await enhanceUserPrompt(prompt, {
        style: body.style,
        targetDuration: body.targetDurationSeconds,
      });
      return NextResponse.json({ ok: true, enhancedPrompt: enhanced });
    }

    // 2. Action: Regenerate a single scene
    if (action === 'regenerate-scene') {
      const sceneIndex = typeof body.sceneIndex === 'number' ? body.sceneIndex : -1;
      const currentPlan = body.currentPlan;
      if (sceneIndex < 0 || !currentPlan) {
        return NextResponse.json(
          { ok: false, error: 'Valid sceneIndex and currentPlan are required' },
          { status: 400 }
        );
      }
      const updatedScene = await regenerateSingleScene(sceneIndex, currentPlan, body.promptContext);
      return NextResponse.json({ ok: true, scene: updatedScene });
    }

    // 3. Action: Generate complete AI video plan
    const prompt = String(body.prompt || '').trim();
    if (!prompt) {
      return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 });
    }

    const plan = await generateAiVideoPlan({
      prompt,
      targetDurationSeconds: body.targetDurationSeconds,
      style: body.style,
      uploadedMedia: body.uploadedMedia,
      captionThemeId: body.captionThemeId,
      bgmTrackId: body.bgmTrackId,
    });

    return NextResponse.json({ ok: true, plan });
  } catch (err: any) {
    console.error('[/api/reels/plan-ai-video] Error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Failed to plan AI video' },
      { status: 500 }
    );
  }
}

