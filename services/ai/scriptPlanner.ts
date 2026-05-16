import type { VisualAsset, VisualAssetType } from '../assets/visualAssets';
import { searchLocalVisualAssets } from '../assets/localAssetLibrary';
import type { AvailableIconDatabaseItem } from '../assets/iconDatabase';
import type { VoiceoverAnalysis } from './voiceAnalysis';
import { generateGeminiJson, hasGeminiApiKey } from './gemini';
import { MULTILINGUAL_VIDEO_RULE } from './multilingualRules';
import { getVideoModeInstruction, type CreationMode } from './videoModeInstructions';

type VisualCategory = 'stockVideos' | 'motionGraphics' | 'icons' | 'overlays' | 'animations' | 'stockImages';
type SceneRole = 'hook' | 'main_point' | 'emotional_buildup' | 'cta' | 'supporting_point';

export type UserVisualAsset = {
  id?: string;
  url: string;
  type: 'image' | 'video';
  filename?: string;
  description?: string;
};

export type VisualSearchPlan = {
  category: VisualCategory;
  query: string;
  style: string;
  assetTypes: VisualAssetType[];
  visualAssets: VisualAsset[];
};

export type TimelineScene = {
  id: string;
  role: SceneRole;
  label: string;
  start: number;
  end: number;
  duration: number;
  sentenceIndexes: number[];
  scriptText: string;
  intent: string;
  emotion: string;
  pacing: 'slow' | 'medium' | 'fast';
  captionStyle: string;
  visualDirection: string;
  transition: string;
  overlays: string[];
  animationNotes: string[];
  visualSearches: VisualSearchPlan[];
  userAssetSuggestions: UserVisualAsset[];
};

export type VideoScriptPlan = {
  format: 'vertical_short';
  totalDuration: number;
  structure: Array<{
    role: SceneRole;
    label: string;
    start: number;
    end: number;
    goal: string;
  }>;
  scenes: TimelineScene[];
  sentenceVisuals: Array<{
    sentenceIndex: number;
    text: string;
    start: number | null;
    end: number | null;
    sceneId: string;
    visualSearches: VisualSearchPlan[];
    userAssetSuggestions: UserVisualAsset[];
  }>;
};

type PlannerOptions = {
  aspectRatio?: string;
  captionStyle?: string;
  preferredMood?: string;
  userAssets?: UserVisualAsset[];
  availableIconsDatabase?: AvailableIconDatabaseItem[];
  creationMode?: CreationMode;
};

const VISUAL_CATEGORIES: Array<{
  category: VisualCategory;
  assetTypes: VisualAssetType[];
}> = [
  { category: 'stockVideos', assetTypes: ['video'] },
  { category: 'motionGraphics', assetTypes: ['graphic', 'video'] },
  { category: 'icons', assetTypes: ['graphic'] },
  { category: 'overlays', assetTypes: ['graphic'] },
  { category: 'animations', assetTypes: ['video', 'graphic'] },
  { category: 'stockImages', assetTypes: ['image'] },
];

export async function planVideoScript(
  analysis: VoiceoverAnalysis,
  options: PlannerOptions = {},
): Promise<VideoScriptPlan> {
  const basePlan = await generateScriptPlan(analysis, options);
  const scenesWithAssets = await attachLibraryAssets(basePlan.scenes);
  const sceneById = new Map(scenesWithAssets.map((scene) => [scene.id, scene]));

  return {
    ...basePlan,
    scenes: scenesWithAssets,
    sentenceVisuals: basePlan.sentenceVisuals.map((sentence) => {
      const scene = sceneById.get(sentence.sceneId);

      return {
        ...sentence,
        visualSearches: scene?.visualSearches || sentence.visualSearches,
      };
    }),
  };
}

async function generateScriptPlan(analysis: VoiceoverAnalysis, options: PlannerOptions): Promise<VideoScriptPlan> {
  const aiPlan = await requestAIScriptPlan(analysis, options);

  if (aiPlan) {
    return normalizeAIPlan(aiPlan, analysis, options);
  }

  return createFallbackPlan(analysis, options);
}

async function requestAIScriptPlan(analysis: VoiceoverAnalysis, options: PlannerOptions) {
  const modeInstruction = getVideoModeInstruction(options.creationMode);
  const requestPayload = {
    task: modeInstruction.mode === 'faceless'
      ? 'Create a faceless short-form timeline. Assign every sentence to a scene and create visual search queries for the internal asset library.'
      : 'Create a face-camera short-form edit plan. Keep the speaker video as the main visual anchor and plan supporting captions, icons, callouts, SFX, and text emphasis.',
    creationMode: modeInstruction.mode,
    modeInstruction,
    multilingualRule: MULTILINGUAL_VIDEO_RULE,
    iconInventoryRule: 'Use AVAILABLE_ICONS_DATABASE as the registered icon inventory. When an icon is useful, choose search queries from this list by exact icon_name or close tags. Do not invent icon names outside this list.',
    AVAILABLE_ICONS_DATABASE: summarizeIconsDatabase(options.availableIconsDatabase || []),
    requiredJsonShape: {
      structure: [
        {
          role: 'hook | main_point | emotional_buildup | cta | supporting_point',
          label: '0-4s - hook',
          start: 0,
          end: 4,
          goal: 'Scene objective',
        },
      ],
      scenes: [
        {
          role: 'hook | main_point | emotional_buildup | cta | supporting_point',
          label: 'Hook',
          start: 0,
          end: 4,
          sentenceIndexes: [0],
          intent: 'What this scene must do',
          visualDirection: 'Example: dark cinematic office clips for work hard silently',
          transition: 'cut | push | whip | fade | zoom | glitch',
          overlays: ['progress bar', 'grain'],
          animationNotes: ['kinetic caption pop'],
          visualSearches: [
            {
              category: 'stockVideos | motionGraphics | icons | overlays | animations | stockImages',
              query: 'Internal asset-library search query',
              style: 'cinematic/luxury/minimal/etc',
            },
          ],
        },
      ],
    },
    voiceAnalysis: {
      language: analysis.language,
      emotion: analysis.emotion,
      speakingSpeed: analysis.speakingSpeed,
      topics: analysis.topics,
      keywords: analysis.keywords,
      topicSummary: analysis.topicSummary,
      sentences: analysis.sentences,
    },
    preferences: {
      aspectRatio: options.aspectRatio || '9:16',
      captionStyle: options.captionStyle || 'Modern',
      preferredMood: options.preferredMood || analysis.emotion.primary,
      userAssetCount: options.userAssets?.length || 0,
    },
  };

  if (hasGeminiApiKey()) {
    const geminiPlan = await generateGeminiJson(
      `You are the script director for Itnavideo. ${modeInstruction.prompt} ${MULTILINGUAL_VIDEO_RULE} Return only valid JSON.`,
      requestPayload,
      { temperature: 0.35 },
    );

    if (geminiPlan) return geminiPlan;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `You are the script director for Itnavideo. ${modeInstruction.prompt} ${MULTILINGUAL_VIDEO_RULE} Return only valid JSON.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            ...requestPayload,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI script planning failed: ${response.status}`);
    return null;
  }

  const completion = await response.json();
  return safeJsonParse(completion?.choices?.[0]?.message?.content || '{}');
}

function normalizeAIPlan(
  aiPlan: Record<string, unknown>,
  analysis: VoiceoverAnalysis,
  options: PlannerOptions,
): VideoScriptPlan {
  const fallback = createFallbackPlan(analysis, options);
  const rawScenes = Array.isArray(aiPlan.scenes) ? aiPlan.scenes : [];

  if (!rawScenes.length) {
    return fallback;
  }

  const totalDuration = Math.max(analysis.speakingSpeed.durationSeconds, fallback.totalDuration);
  const scenes = rawScenes.map((rawScene, index) => {
    const scene = rawScene as Record<string, unknown>;
    const start = normalizeTime(scene.start, fallback.scenes[index]?.start || 0);
    const end = normalizeTime(scene.end, fallback.scenes[index]?.end || Math.min(totalDuration, start + 4));
    const sentenceIndexes = normalizeNumberArray(scene.sentenceIndexes, fallback.scenes[index]?.sentenceIndexes || [index])
      .filter((sentenceIndex) => analysis.sentences[sentenceIndex]);
    const role = normalizeRole(scene.role, fallback.scenes[index]?.role || 'supporting_point');
    const scriptText = sentenceIndexes.length
      ? sentenceIndexes.map((sentenceIndex) => analysis.sentences[sentenceIndex]?.text).filter(Boolean).join(' ')
      : fallback.scenes[index]?.scriptText || '';

    return {
      id: `scene_${index + 1}`,
      role,
      label: asString(scene.label) || labelForRole(role, start, end),
      start,
      end,
      duration: round(Math.max(0.5, end - start)),
      sentenceIndexes,
      scriptText,
      intent: asString(scene.intent) || fallback.scenes[index]?.intent || 'Move the story forward.',
      emotion: analysis.emotion.primary,
      pacing: getScenePacing(analysis),
      captionStyle: options.captionStyle || 'Modern',
      visualDirection: asString(scene.visualDirection) || fallback.scenes[index]?.visualDirection || buildVisualDirection(scriptText, analysis),
      transition: asString(scene.transition) || fallback.scenes[index]?.transition || 'cut',
      overlays: normalizeStringArray(scene.overlays, fallback.scenes[index]?.overlays || ['subtle grain']),
      animationNotes: normalizeStringArray(scene.animationNotes, fallback.scenes[index]?.animationNotes || ['caption emphasis on keywords']),
      visualSearches: normalizeVisualSearches(scene.visualSearches, scriptText, analysis),
      userAssetSuggestions: suggestUserAssets(scriptText, options.userAssets || []),
    };
  });

  return buildPlanFromScenes(scenes, analysis);
}

function createFallbackPlan(analysis: VoiceoverAnalysis, options: PlannerOptions): VideoScriptPlan {
  const duration = Math.max(analysis.speakingSpeed.durationSeconds, 1);
  const structure = getDefaultStructure(duration);
  const scenes = structure.map((block, index) => {
    const sentenceIndexes = analysis.sentences
      .filter((sentence) => overlapsTime(sentence.start, sentence.end, block.start, block.end))
      .map((sentence) => sentence.index);
    const resolvedSentenceIndexes = sentenceIndexes.length ? sentenceIndexes : [Math.min(index, Math.max(analysis.sentences.length - 1, 0))];
    const scriptText = resolvedSentenceIndexes.map((sentenceIndex) => analysis.sentences[sentenceIndex]?.text).filter(Boolean).join(' ');

    return {
      id: `scene_${index + 1}`,
      role: block.role,
      label: block.label,
      start: block.start,
      end: block.end,
      duration: round(block.end - block.start),
      sentenceIndexes: resolvedSentenceIndexes,
      scriptText,
      intent: block.goal,
      emotion: analysis.emotion.primary,
      pacing: getScenePacing(analysis),
      captionStyle: options.captionStyle || 'Modern',
      visualDirection: buildVisualDirection(scriptText, analysis),
      transition: getTransition(block.role, analysis.emotion.primary),
      overlays: getOverlays(block.role, analysis.emotion.primary),
      animationNotes: getAnimationNotes(block.role, analysis.speakingSpeed.label),
      visualSearches: buildVisualSearches(scriptText, analysis),
      userAssetSuggestions: suggestUserAssets(scriptText, options.userAssets || []),
    };
  });

  return buildPlanFromScenes(scenes, analysis);
}

function buildPlanFromScenes(scenes: TimelineScene[], analysis: VoiceoverAnalysis): VideoScriptPlan {
  return {
    format: 'vertical_short',
    totalDuration: round(Math.max(...scenes.map((scene) => scene.end), analysis.speakingSpeed.durationSeconds)),
    structure: scenes.map((scene) => ({
      role: scene.role,
      label: labelForRole(scene.role, scene.start, scene.end),
      start: scene.start,
      end: scene.end,
      goal: scene.intent,
    })),
    scenes,
    sentenceVisuals: analysis.sentences.map((sentence) => {
      const scene = scenes.find((item) => item.sentenceIndexes.includes(sentence.index)) || scenes[0];

      return {
        sentenceIndex: sentence.index,
        text: sentence.text,
        start: sentence.start,
        end: sentence.end,
        sceneId: scene?.id || 'scene_1',
        visualSearches: scene?.visualSearches || [],
        userAssetSuggestions: scene?.userAssetSuggestions || [],
      };
    }),
  };
}

async function attachLibraryAssets(scenes: TimelineScene[]) {
  return Promise.all(
    scenes.map(async (scene) => ({
      ...scene,
      visualSearches: await Promise.all(
        scene.visualSearches.map(async (search) => {
          const localAssets = await searchLocalVisualAssets({
            query: search.query,
            category: search.category,
            types: search.assetTypes,
            limit: 4,
          });
          return {
            ...search,
            visualAssets: localAssets,
          };
        }),
      ),
    })),
  );
}

function buildVisualSearches(scriptText: string, analysis: VoiceoverAnalysis): VisualSearchPlan[] {
  const queryBase = buildVisualDirection(scriptText, analysis);

  return VISUAL_CATEGORIES.map(({ category, assetTypes }) => ({
    category,
    query: queryForCategory(category, queryBase),
    style: styleForEmotion(analysis.emotion.primary),
    assetTypes,
    visualAssets: [],
  }));
}

function normalizeVisualSearches(value: unknown, scriptText: string, analysis: VoiceoverAnalysis): VisualSearchPlan[] {
  if (!Array.isArray(value)) {
    return buildVisualSearches(scriptText, analysis);
  }

  const searches = value
    .map((item) => item as Record<string, unknown>)
    .map((item) => {
      const category = normalizeCategory(item.category);
      const defaults = VISUAL_CATEGORIES.find((entry) => entry.category === category) || VISUAL_CATEGORIES[0];

      return {
        category,
        query: asString(item.query) || queryForCategory(category, buildVisualDirection(scriptText, analysis)),
        style: asString(item.style) || styleForEmotion(analysis.emotion.primary),
        assetTypes: defaults.assetTypes,
        visualAssets: [],
      };
    });

  return searches.length ? searches : buildVisualSearches(scriptText, analysis);
}

function summarizeIconsDatabase(icons: AvailableIconDatabaseItem[]) {
  return icons.slice(0, 350).map((icon) => ({
    icon_id: icon.icon_id,
    icon_name: icon.icon_name,
    category: icon.category,
    style: icon.style,
    tags: icon.tags.slice(0, 8),
  }));
}

function getDefaultStructure(duration: number) {
  if (duration <= 8) {
    return [
      { role: 'hook' as SceneRole, label: `0-${round(duration)}s - hook`, start: 0, end: round(duration), goal: 'Grab attention and deliver the core idea fast.' },
    ];
  }

  const hookEnd = Math.min(4, duration);
  const mainEnd = Math.min(Math.max(10, duration * 0.45), duration);
  const buildupEnd = Math.min(Math.max(18, duration * 0.75), duration);

  return [
    { role: 'hook' as SceneRole, label: `0-${round(hookEnd)}s - hook`, start: 0, end: round(hookEnd), goal: 'Stop the scroll with the strongest idea.' },
    { role: 'main_point' as SceneRole, label: `${round(hookEnd)}-${round(mainEnd)}s - main point`, start: round(hookEnd), end: round(mainEnd), goal: 'Explain the core point clearly.' },
    { role: 'emotional_buildup' as SceneRole, label: `${round(mainEnd)}-${round(buildupEnd)}s - emotional buildup`, start: round(mainEnd), end: round(buildupEnd), goal: 'Increase emotion, stakes, or curiosity.' },
    { role: 'cta' as SceneRole, label: `${round(buildupEnd)}-${round(duration)}s - CTA`, start: round(buildupEnd), end: round(duration), goal: 'Push the viewer toward the next action.' },
  ].filter((block) => block.end > block.start);
}

function buildVisualDirection(scriptText: string, analysis: VoiceoverAnalysis) {
  const text = scriptText || analysis.topicSummary || analysis.keywords.slice(0, 4).join(' ');
  const style = styleForEmotion(analysis.emotion.primary);

  return `${text} - ${style} vertical short-form visual, ${analysis.emotion.primary} mood`;
}

function queryForCategory(category: VisualCategory, queryBase: string) {
  const categoryPrompt: Record<VisualCategory, string> = {
    stockVideos: 'cinematic stock video',
    motionGraphics: 'motion graphics elements',
    icons: '2d 3d icons',
    overlays: 'video overlays texture light leak',
    animations: 'animated transition kinetic',
    stockImages: 'editorial stock image',
  };

  return `${queryBase}, ${categoryPrompt[category]}`;
}

function suggestUserAssets(scriptText: string, userAssets: UserVisualAsset[]) {
  if (!userAssets.length) {
    return [];
  }

  const searchableText = scriptText.toLowerCase();
  const matched = userAssets.filter((asset) => {
    const haystack = `${asset.filename || ''} ${asset.description || ''}`.toLowerCase();
    return haystack && haystack.split(/\s+/).some((token) => token.length > 3 && searchableText.includes(token));
  });

  return (matched.length ? matched : userAssets).slice(0, 3);
}

function getScenePacing(analysis: VoiceoverAnalysis): TimelineScene['pacing'] {
  if (analysis.speakingSpeed.label === 'fast' || analysis.speakingSpeed.label === 'very_fast') {
    return 'fast';
  }

  if (analysis.speakingSpeed.label === 'slow') {
    return 'slow';
  }

  return 'medium';
}

function getTransition(role: SceneRole, emotion: string) {
  if (role === 'hook') return 'zoom';
  if (role === 'cta') return 'fade';
  if (emotion === 'energetic' || emotion === 'motivation') return 'whip';
  if (emotion === 'sad' || emotion === 'luxury') return 'fade';
  return 'cut';
}

function getOverlays(role: SceneRole, emotion: string) {
  const overlays = ['safe-zone captions', 'subtle grain'];
  if (role === 'hook') overlays.push('progress bar');
  if (emotion === 'cinematic') overlays.push('letterbox glow');
  if (emotion === 'luxury') overlays.push('soft gold accent');
  return overlays;
}

function getAnimationNotes(role: SceneRole, speedLabel: string) {
  const notes = ['keyword caption emphasis'];
  if (role === 'hook') notes.push('fast scale-in on first phrase');
  if (speedLabel === 'fast' || speedLabel === 'very_fast') notes.push('short cuts synced to sentence breaks');
  return notes;
}

function styleForEmotion(emotion: string) {
  const styles: Record<string, string> = {
    motivation: 'high contrast motivational cinematic',
    sad: 'soft moody emotional',
    energetic: 'fast bright dynamic',
    luxury: 'premium minimal luxury',
    cinematic: 'dark cinematic dramatic',
    normal: 'clean modern creator',
    informational: 'clear educational infographic',
  };

  return styles[emotion] || styles.normal;
}

function labelForRole(role: SceneRole, start: number, end: number) {
  const labels: Record<SceneRole, string> = {
    hook: 'hook',
    main_point: 'main point',
    emotional_buildup: 'emotional buildup',
    cta: 'CTA',
    supporting_point: 'supporting point',
  };

  return `${round(start)}-${round(end)}s - ${labels[role]}`;
}

function overlapsTime(sentenceStart: number | null, sentenceEnd: number | null, sceneStart: number, sceneEnd: number) {
  if (sentenceStart === null || sentenceEnd === null) {
    return false;
  }

  return sentenceStart < sceneEnd && sentenceEnd > sceneStart;
}

function normalizeRole(value: unknown, fallback: SceneRole): SceneRole {
  const role = asString(value) as SceneRole;
  return ['hook', 'main_point', 'emotional_buildup', 'cta', 'supporting_point'].includes(role) ? role : fallback;
}

function normalizeCategory(value: unknown): VisualCategory {
  const category = asString(value) as VisualCategory;
  return VISUAL_CATEGORIES.some((entry) => entry.category === category) ? category : 'stockVideos';
}

function normalizeTime(value: unknown, fallback: number) {
  return round(typeof value === 'number' && Number.isFinite(value) ? value : fallback);
}

function normalizeNumberArray(value: unknown, fallback: number[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((item) => Number(item)).filter(Number.isFinite);
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map((item) => asString(item).trim()).filter(Boolean);
  return items.length ? items : fallback;
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

