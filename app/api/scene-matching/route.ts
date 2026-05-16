import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceover } from '@/services/ai/voiceAnalysis';
import { planVideoScript, type UserVisualAsset } from '@/services/ai/scriptPlanner';
import { generateSubtitlePlan, translateSubtitlePlanToEnglish } from '@/services/ai/subtitleGenerator';
import { generateSceneMatchingTimeline } from '@/services/ai/sceneMatching';
import { generateSoundEffectsPlan } from '@/services/ai/soundEffects';
import { createVideoDirectorPlan } from '@/services/ai/videoDirector';
import { getAvailableIconsDatabase, mergeAvailableIconsDatabases, type AvailableIconDatabaseItem } from '@/services/assets/iconDatabase';
import { normalizeCreationMode } from '@/services/ai/videoModeInstructions';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { voiceoverUrl, voiceUrl, config, userAssets } = await request.json();
    const audioUrl = voiceoverUrl || voiceUrl;
    const creationMode = normalizeCreationMode(config?.creationMode || config?.mode || 'faceless');

    if (!audioUrl) {
      return NextResponse.json({ error: 'voiceoverUrl is required' }, { status: 400 });
    }

    const voiceoverAnalysis = await analyzeVoiceover(audioUrl);
    const availableIconsDatabase = mergeAvailableIconsDatabases(
      normalizeAvailableIconsDatabase(config?.AVAILABLE_ICONS_DATABASE || config?.availableIconsDatabase || config?.available_icons_database),
      await getAvailableIconsDatabase(),
    );
    const directorPlan = await createVideoDirectorPlan(voiceoverAnalysis, config?.editingStyle || config?.mood, creationMode);
    const scriptPlan = await planVideoScript(voiceoverAnalysis, {
      aspectRatio: config?.aspectRatio,
      captionStyle: config?.captionStyle,
      preferredMood: config?.mood,
      userAssets: normalizeUserAssets(userAssets),
      availableIconsDatabase,
      creationMode,
    });
    const subtitlePlan = await translateSubtitlePlanToEnglish(
      generateSubtitlePlan(voiceoverAnalysis, scriptPlan, config?.captionStyle),
      voiceoverAnalysis,
    );
    const directorTimeline = await generateSceneMatchingTimeline(voiceoverAnalysis, scriptPlan, subtitlePlan, directorPlan);
    const soundEffectsPlan = generateSoundEffectsPlan(voiceoverAnalysis, scriptPlan, directorTimeline, directorPlan);

    return NextResponse.json({
      success: true,
      directorPlan,
      directorTimeline,
      soundEffectsPlan,
      scriptPlan,
      subtitlePlan,
    });
  } catch (error) {
    console.error('Scene matching error:', error);

    return NextResponse.json(
      {
        error: 'Scene matching failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

function normalizeAvailableIconsDatabase(value: unknown): AvailableIconDatabaseItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((icon) => icon as Record<string, unknown>)
    .filter((icon) => typeof icon.icon_id === 'string' && typeof icon.icon_name === 'string')
    .map((icon) => ({
      icon_id: icon.icon_id as string,
      icon_name: icon.icon_name as string,
      category: normalizeIconCategory(icon.category),
      style: typeof icon.style === 'string' ? icon.style : 'Custom',
      tags: Array.isArray(icon.tags) ? icon.tags.map(String) : [],
    }));
}

function normalizeIconCategory(value: unknown): AvailableIconDatabaseItem['category'] {
  return value === 'Material Symbols' || value === 'Color Icons' || value === 'Animated Icons' || value === 'Custom Icons' || value === 'Drive Icons'
    ? value
    : 'Custom Icons';
}

function normalizeUserAssets(value: unknown): UserVisualAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((asset) => asset as Record<string, unknown>)
    .filter((asset) => typeof asset.url === 'string')
    .map((asset) => ({
      id: typeof asset.id === 'string' ? asset.id : undefined,
      url: asset.url as string,
      type: asset.type === 'video' ? 'video' : 'image',
      filename: typeof asset.filename === 'string' ? asset.filename : undefined,
      description: typeof asset.description === 'string' ? asset.description : undefined,
    }));
}

