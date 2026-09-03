import {
  NarrativeSceneType,
  VisualLayoutType,
  SceneBlueprintItem,
  FullVideoSceneBlueprint,
} from './sceneBlueprintTypes';
import { planVisualAssetsForSentence } from './assetPlanner';

export type TranscriptChunk = {
  text: string;
  start: number;
  end: number;
};

export type ScenePlannerOptions = {
  title?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
};

export const ALL_VISUAL_LAYOUTS: VisualLayoutType[] = [
  'big_typography',
  'stat_card',
  'split_screen',
  'image_text',
  'screenshot_highlight',
  'comparison',
  'timeline',
  'checklist',
  'quote',
  'numbered_point',
  'fullscreen_statement',
  'data_visualization',
  'broll_overlay',
];

/**
 * Deterministic local parser that converts transcript chunks into a structured
 * 8-stage narrative Scene Blueprint JSON fallback using the AI Asset Planner.
 */
export function buildDeterministicSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): FullVideoSceneBlueprint {
  if (!transcript || transcript.length === 0) {
    return {
      title: options.title || 'Untitled Video',
      overallNarrativeMood: 'Professional Explainer',
      totalDurationSeconds: 0,
      totalScenes: 0,
      scenes: [],
    };
  }

  const narrativeFlowOrder: NarrativeSceneType[] = [
    'hook',
    'context',
    'main_point',
    'explanation',
    'example_stat',
    'emphasis',
    'transition',
    'next_point',
  ];

  const headingFont = options.headingFont || 'Plus Jakarta Sans';
  const bodyFont = options.bodyFont || 'Plus Jakarta Sans';
  const backgroundTheme = options.backgroundTheme || 'purple-vignette';

  const scenes: SceneBlueprintItem[] = transcript.map((chunk, index) => {
    const sceneType = narrativeFlowOrder[index % narrativeFlowOrder.length];
    const layoutType = ALL_VISUAL_LAYOUTS[index % ALL_VISUAL_LAYOUTS.length];
    const text = chunk.text.trim();
    const duration = Math.max(1, Math.round((chunk.end - chunk.start) * 10) / 10);

    // AI Semantic Asset Planner evaluation
    const assetPlan = planVisualAssetsForSentence(text);

    // Assign SFX based on narrative stage
    let SFX: 'pop' | 'woosh' | 'chime' | 'rise' | 'none' = 'none';
    if (sceneType === 'hook') SFX = 'rise';
    else if (sceneType === 'example_stat' || sceneType === 'emphasis') SFX = 'pop';
    else if (sceneType === 'transition') SFX = 'woosh';
    else if (sceneType === 'main_point') SFX = 'chime';

    return {
      sceneNumber: index + 1,
      sceneType,
      layoutType,
      duration,
      narrationSegment: {
        text,
        startSeconds: chunk.start,
        endSeconds: chunk.end,
      },
      heading: assetPlan.suggestedHeading,
      supportingText: assetPlan.suggestedSupportingText,
      highlightedWords: assetPlan.highlightedWords,
      visualAssetRequirement: assetPlan.brollSearchQuery,
      visualIntent: assetPlan.visualIntent,
      brollSearchQuery: assetPlan.brollSearchQuery,
      background: backgroundTheme,
      fontHierarchy: {
        headingFont,
        bodyFont,
      },
      animation: assetPlan.motion,
      SFX,
      transition: sceneType === 'transition' ? 'zoom' : 'dissolve',
      statValue: '123K VIEWS',
      numberBadge: index + 1,
      quoteAuthor: 'Industry Expert',
      chartValuePercent: Math.min(95, 60 + ((index * 7) % 35)),
    };
  });

  const totalDurationSeconds = Math.round(
    transcript[transcript.length - 1].end - transcript[0].start
  );

  return {
    title: options.title || 'Professional Faceless Video',
    overallNarrativeMood: 'High Engagement Dynamic Presentation',
    totalDurationSeconds,
    totalScenes: scenes.length,
    scenes,
  };
}

/**
 * Main AI Scene Planner function.
 * Uses Gemini AI when available or falls back cleanly to deterministic narrative planner.
 */
export async function generateStructuredSceneBlueprint(
  transcript: TranscriptChunk[],
  options: ScenePlannerOptions = {}
): Promise<FullVideoSceneBlueprint> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey || transcript.length === 0) {
    return buildDeterministicSceneBlueprint(transcript, options);
  }

  try {
    const prompt = `You are a world-class YouTube director. Analyze this transcript and divide it into structured scenes.

Narrative Flow:
Hook -> Context -> Main Point -> Explanation -> Example/Stat -> Emphasis -> Transition -> Next Point

For every sentence, decide: "What visual best represents this exact concept?"
Assign ONE of these 13 visual layout types:
- big_typography
- stat_card
- split_screen
- image_text
- screenshot_highlight
- comparison
- timeline
- checklist
- quote
- numbered_point
- fullscreen_statement
- data_visualization
- broll_overlay

Assign ONE motion animation: slow_zoom_in | slow_zoom_out | pan_right | scale_pop | number_count_up

Transcript:
${JSON.stringify(transcript, null, 2)}

Return a strict JSON object with this structure:
{
  "title": "${options.title || 'Professional Faceless Video'}",
  "overallNarrativeMood": "High Engagement Dynamic Presentation",
  "totalDurationSeconds": 60,
  "totalScenes": ${transcript.length},
  "scenes": [
    {
      "sceneNumber": 1,
      "sceneType": "hook",
      "layoutType": "big_typography",
      "duration": 5.0,
      "narrationSegment": { "text": "...", "startSeconds": 0, "endSeconds": 5.0 },
      "heading": "SHORT BOLD HEADING",
      "supportingText": "Supporting sentence",
      "highlightedWords": ["word1", "word2"],
      "visualAssetRequirement": "B-Roll stock query",
      "visualIntent": "Semantic description of the scene concept",
      "brollSearchQuery": "stock search query",
      "background": "${options.backgroundTheme || 'purple-vignette'}",
      "fontHierarchy": { "headingFont": "${options.headingFont || 'Plus Jakarta Sans'}", "bodyFont": "${options.bodyFont || 'Plus Jakarta Sans'}" },
      "animation": "slow_zoom_in",
      "SFX": "pop",
      "transition": "dissolve"
    }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
      }
    );

    if (!response.ok) {
      return buildDeterministicSceneBlueprint(transcript, options);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return buildDeterministicSceneBlueprint(transcript, options);

    const parsedBlueprint = JSON.parse(rawText) as FullVideoSceneBlueprint;
    if (parsedBlueprint && Array.isArray(parsedBlueprint.scenes) && parsedBlueprint.scenes.length > 0) {
      return parsedBlueprint;
    }
  } catch (err) {
    console.warn('[AIScenePlanner] Gemini AI parsing failed, using deterministic fallback:', err);
  }

  return buildDeterministicSceneBlueprint(transcript, options);
}
