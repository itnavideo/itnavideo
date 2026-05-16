import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceover } from '@/services/ai/voiceAnalysis';
import { planVideoScript, type UserVisualAsset } from '@/services/ai/scriptPlanner';
import { generateSubtitlePlan, translateSubtitlePlanToEnglish } from '@/services/ai/subtitleGenerator';
import { generateSceneMatchingTimeline } from '@/services/ai/sceneMatching';
import { generateSoundEffectsPlan } from '@/services/ai/soundEffects';
import { createVideoDirectorPlan } from '@/services/ai/videoDirector';
import { generateMasterTimeline, type AvailableFontDatabaseItem } from '@/services/ai/timelineGenerator';
import { getAvailableFontsDatabase, mergeAvailableFontsDatabases } from '@/services/assets/fontDatabase';
import { getAvailableIconsDatabase, mergeAvailableIconsDatabases, type AvailableIconDatabaseItem } from '@/services/assets/iconDatabase';
import { videoPipelineConfig } from '@/lib/videoPipelineConfig';
import { normalizeCreationMode } from '@/services/ai/videoModeInstructions';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if ((!data.voiceUrl && !data.fastMode) || !data.userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (data.fastMode) {
      return NextResponse.json(createFastVideoPlan(data));
    }

    console.log(`Starting video generation for user: ${data.userId}`);
    const creationMode = normalizeCreationMode(data.config?.creationMode || data.config?.mode || data.creationMode || 'faceless');
    const [scannedFontsDatabase, scannedIconsDatabase] = await Promise.all([
      getAvailableFontsDatabase(),
      getAvailableIconsDatabase(),
    ]);
    const availableFontsDatabase = mergeAvailableFontsDatabases(
      normalizeAvailableFontsDatabase(data.config?.AVAILABLE_FONTS_DATABASE || data.config?.availableFontsDatabase || data.config?.available_fonts_database || data.AVAILABLE_FONTS_DATABASE),
      scannedFontsDatabase,
    );
    const availableIconsDatabase = mergeAvailableIconsDatabases(
      normalizeAvailableIconsDatabase(data.config?.AVAILABLE_ICONS_DATABASE || data.config?.availableIconsDatabase || data.config?.available_icons_database || data.AVAILABLE_ICONS_DATABASE),
      scannedIconsDatabase,
    );

    const voiceoverAnalysis = await analyzeVoiceover(data.voiceUrl);
    const directorPlan = await createVideoDirectorPlan(voiceoverAnalysis, data.config?.editingStyle || data.config?.mood, creationMode);
    const scriptPlan = await planVideoScript(voiceoverAnalysis, {
      aspectRatio: data.config?.aspectRatio,
      captionStyle: data.config?.captionStyle,
      preferredMood: data.config?.mood,
      userAssets: normalizeUserAssets(data.userAssets),
      availableIconsDatabase,
      creationMode,
    });
    const subtitlePlan = await translateSubtitlePlanToEnglish(
      generateSubtitlePlan(voiceoverAnalysis, scriptPlan, data.config?.captionStyle),
      voiceoverAnalysis,
    );
    const directorTimeline = await generateSceneMatchingTimeline(voiceoverAnalysis, scriptPlan, subtitlePlan, directorPlan);
    const soundEffectsPlan = generateSoundEffectsPlan(voiceoverAnalysis, scriptPlan, directorTimeline, directorPlan);
    const timeline = generateMasterTimeline({
      directorPlan,
      voiceoverAnalysis,
      scriptPlan,
      subtitlePlan,
      directorTimeline,
      soundEffectsPlan,
      availableFontsDatabase,
    });

    return NextResponse.json({
      success: true,
      message: 'Video generation has been successfully initiated.',
      jobId: `vid_${Date.now()}`,
      pipeline: {
        currentStep: 'sound_effects_completed',
        nextStep: 'ffmpeg_render',
      },
      directorPlan,
      voiceoverAnalysis,
      scriptPlan,
      subtitlePlan,
      directorTimeline,
      soundEffectsPlan,
      timeline,
    });
  } catch (error) {
    console.error('Video Generation API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

function normalizeAvailableFontsDatabase(value: unknown): AvailableFontDatabaseItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((font) => font as Record<string, unknown>)
    .filter((font) => typeof font.font_id === 'string' && typeof font.font_name === 'string')
    .map((font) => ({
      font_id: font.font_id as string,
      font_name: font.font_name as string,
      category: typeof font.category === 'string' ? font.category : undefined,
      vibe: typeof font.vibe === 'string' ? font.vibe : undefined,
    }));
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

function createFastVideoPlan(data: Record<string, any>) {
  const duration = clampDuration(Number(data.targetDurationSeconds) || Number(data.audioDurationSeconds) || 30);
  const scenes = buildFastScenes(duration);
  const captionCues = scenes.map((scene, index) => ({
    id: `cap_${index + 1}`,
    start: scene.start,
    end: scene.end,
    text: scene.caption,
    style: data.config?.captionStyle || 'Reels',
    animation: index === 0 ? 'pop_highlight' : 'karaoke',
  }));

  return {
    success: true,
    fastMode: true,
    message: 'Express AI timeline generated. Full render can run separately.',
    jobId: `vid_${Date.now()}`,
    pipeline: {
      currentStep: 'express_timeline_ready',
      nextStep: 'optional_full_render',
    },
    directorPlan: {
      selectedStyle: data.config?.editingStyle || 'reels_pacing',
      pacing: duration > 180 ? 'chaptered_fast_preview' : 'short_form_preview',
      hookLogic: 'Front-load movement and captions in the first 3-5 seconds.',
    },
    scriptPlan: {
      scenes,
    },
    subtitlePlan: {
      cues: captionCues,
    },
    timeline: {
      metadata: {
        mode: 'express',
        duration,
        aspectRatio: data.config?.aspectRatio || 'Portrait (9:16)',
        quality: data.config?.quality || videoPipelineConfig.qualityPreset,
      },
      scenes: scenes.map((scene) => ({
        id: scene.id,
        start: scene.start,
        end: scene.end,
        type: 'ai_visual_search',
        source: {
          type: 'placeholder',
          url: null,
        },
        prompt: scene.visualPrompt,
        transition: scene.transition,
        camera: scene.camera,
      })),
      captions: captionCues,
      music: [
        {
          start: 0,
          end: duration,
          mood: data.config?.editingStyle || 'reels_pacing',
          fadeIn: 0.6,
          fadeOut: 1.2,
        },
      ],
      effects: scenes.flatMap((scene, index) => [
        {
          start: Math.max(0, scene.start - 0.05),
          type: index === 0 ? 'impact' : 'whoosh',
          intensity: index === 0 ? 0.75 : 0.45,
        },
      ]),
      transitions: scenes.slice(1).map((scene) => ({
        at: scene.start,
        type: scene.transition,
      })),
    },
  };
}

function buildFastScenes(duration: number) {
  const maxScenes = duration > 180 ? 12 : duration > 60 ? 8 : 5;
  const sceneCount = Math.max(3, Math.min(maxScenes, Math.ceil(duration / (duration > 180 ? 45 : 8))));
  const segment = duration / sceneCount;

  return Array.from({ length: sceneCount }, (_, index) => {
    const start = roundTime(index * segment);
    const end = roundTime(index === sceneCount - 1 ? duration : (index + 1) * segment);
    const phase = index === 0 ? 'Hook' : index === sceneCount - 1 ? 'CTA' : `Point ${index}`;

    return {
      id: `scene_${index + 1}`,
      start,
      end,
      phase,
      caption: getFastCaption(phase, index),
      visualPrompt: getFastVisualPrompt(phase, index),
      transition: index === 0 ? 'hard_cut' : index % 3 === 0 ? 'glitch' : 'whoosh',
      camera: index === 0 ? 'fast_push_in' : index % 2 === 0 ? 'slow_zoom' : 'parallax_pan',
    };
  });
}

function getFastCaption(phase: string, index: number) {
  if (index === 0) return 'Hook the viewer in the first seconds.';
  if (phase === 'CTA') return 'End with a clear action.';
  return 'Match the visual to the voiceover point.';
}

function getFastVisualPrompt(phase: string, index: number) {
  if (index === 0) return 'high energy creator hook, bold motion, cinematic vertical frame';
  if (phase === 'CTA') return 'clean call to action screen, premium social video finish';
  return index % 2 === 0
    ? 'cinematic b-roll matching spoken idea, modern creator workspace'
    : 'motion graphics, icons, captions, fast social media edit';
}

function clampDuration(value: number) {
  return Math.max(8, Math.min(videoPipelineConfig.maxDurationSec, value));
}

function roundTime(value: number) {
  return Math.round(value * 100) / 100;
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

