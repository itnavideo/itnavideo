import type { VoiceoverAnalysis } from './voiceAnalysis';
import { generateGeminiJson, hasGeminiApiKey } from './gemini';
import { MULTILINGUAL_VIDEO_RULE } from './multilingualRules';
import { getVideoModeInstruction, type CreationMode } from './videoModeInstructions';

export type EditingStyle =
  | 'fast_cuts'
  | 'slow_cinematic'
  | 'meme_style'
  | 'luxury_edit'
  | 'reels_pacing'
  | 'youtube_documentary';

export type VideoDirectorPlan = {
  version: '1.0';
  selectedStyle: EditingStyle;
  confidence: number;
  reason: string;
  hookLogic: {
    durationSeconds: number;
    forceFastCuts: boolean;
    targetCutRangeSeconds: [number, number];
    actionDensity: 'medium' | 'high' | 'very_high';
    notes: string[];
  };
  visualPacing: {
    estimatedBpm: number;
    voiceEnergy: 'low' | 'medium' | 'high';
    cutRangeSeconds: [number, number];
    beatSync: 'subtle' | 'strong' | 'aggressive';
    sceneHoldRangeSeconds: [number, number];
  };
  shotSelection: Array<{
    shotType: 'establishing' | 'close_up' | 'b_roll_overlay' | 'insert' | 'reaction' | 'wide' | 'detail';
    when: string;
    reason: string;
    priority: 'primary' | 'secondary';
  }>;
  colorGrade: {
    lut: string;
    contrast: 'soft' | 'medium' | 'high';
    saturation: 'low' | 'natural' | 'high';
    grain: 'none' | 'subtle' | 'heavy';
    palette: string[];
  };
  semanticSoundDesign: Array<{
    keyword: string;
    action: 'sfx' | 'music_duck' | 'muffle' | 'impact' | 'ambient_shift';
    soundCue: string;
    mixNote: string;
  }>;
  rendererRules: {
    maxConsecutiveSameShot: number;
    avoidRoboticPattern: boolean;
    varyZoomDirection: boolean;
    prioritizeRetentionInFirstSeconds: number;
  };
};

export async function createVideoDirectorPlan(
  analysis: VoiceoverAnalysis,
  requestedStyle?: string,
  creationMode?: CreationMode,
): Promise<VideoDirectorPlan> {
  const fallback = createFallbackDirectorPlan(analysis, requestedStyle);
  const aiPlan = await requestAIDirectorPlan(analysis, fallback, requestedStyle, creationMode);

  return aiPlan ? normalizeAIDirectorPlan(aiPlan, fallback) : fallback;
}

async function requestAIDirectorPlan(
  analysis: VoiceoverAnalysis,
  fallback: VideoDirectorPlan,
  requestedStyle?: string,
  creationMode?: CreationMode,
) {
  const modeInstruction = getVideoModeInstruction(creationMode);
  if (hasGeminiApiKey()) {
    const geminiPlan = await generateGeminiJson(
      `You are an AI video director for Itnavideo. ${modeInstruction.prompt} ${MULTILINGUAL_VIDEO_RULE} Choose the editing style from: fast_cuts, slow_cinematic, meme_style, luxury_edit, reels_pacing, youtube_documentary. Include pacing/BPM, shot selection logic, color grade mapping, semantic sound design, and hook logic.`,
      {
        requestedStyle,
        creationMode: modeInstruction.mode,
        modeInstruction,
        voiceAnalysis: {
          language: analysis.language,
          emotion: analysis.emotion,
          speed: analysis.speakingSpeed,
          pauses: analysis.pauses,
          keywords: analysis.keywords,
          topics: analysis.topics,
          topicSummary: analysis.topicSummary,
          transcript: analysis.transcript.slice(0, 4000),
        },
        fallbackPlan: fallback,
      },
      { temperature: 0.25 },
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
      temperature: 0.25,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `You are an AI video director for Itnavideo. ${modeInstruction.prompt} ${MULTILINGUAL_VIDEO_RULE} Return only valid JSON. Choose the editing style from: fast_cuts, slow_cinematic, meme_style, luxury_edit, reels_pacing, youtube_documentary.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Select video editing direction from the voiceover. Include pacing/BPM, shot selection logic, color grade mapping, semantic sound design, and hook logic.',
            requestedStyle,
            creationMode: modeInstruction.mode,
            modeInstruction,
            voiceAnalysis: {
              language: analysis.language,
              emotion: analysis.emotion,
              speed: analysis.speakingSpeed,
              pauses: analysis.pauses,
              keywords: analysis.keywords,
              topics: analysis.topics,
              topicSummary: analysis.topicSummary,
              transcript: analysis.transcript.slice(0, 4000),
            },
            fallbackPlan: fallback,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI director planning failed: ${response.status}`);
    return null;
  }

  const completion = await response.json();
  return safeJsonParse(completion?.choices?.[0]?.message?.content || '{}');
}

function createFallbackDirectorPlan(analysis: VoiceoverAnalysis, requestedStyle?: string): VideoDirectorPlan {
  const selectedStyle = normalizeStyle(requestedStyle) || inferStyle(analysis);
  const visualPacing = getVisualPacing(analysis, selectedStyle);

  return {
    version: '1.0',
    selectedStyle,
    confidence: requestedStyle ? 0.92 : 0.74,
    reason: buildReason(analysis, selectedStyle),
    hookLogic: {
      durationSeconds: clamp(analysis.speakingSpeed.durationSeconds < 10 ? 3 : 5, 3, 5),
      forceFastCuts: true,
      targetCutRangeSeconds: [0.5, 1.2],
      actionDensity: selectedStyle === 'meme_style' || selectedStyle === 'fast_cuts' ? 'very_high' : 'high',
      notes: [
        'First 3-5 seconds should carry the highest action density.',
        'Use fast cuts in hook even when the rest of the video is slow cinematic.',
        'Show the most concrete visual proof before abstract explanation.',
      ],
    },
    visualPacing,
    shotSelection: getShotSelectionRules(selectedStyle),
    colorGrade: getColorGrade(selectedStyle),
    semanticSoundDesign: getSemanticSoundRules(analysis, selectedStyle),
    rendererRules: {
      maxConsecutiveSameShot: selectedStyle === 'slow_cinematic' ? 2 : 1,
      avoidRoboticPattern: true,
      varyZoomDirection: true,
      prioritizeRetentionInFirstSeconds: 5,
    },
  };
}

function normalizeAIDirectorPlan(aiPlan: Record<string, unknown>, fallback: VideoDirectorPlan): VideoDirectorPlan {
  const selectedStyle = normalizeStyle(aiPlan.selectedStyle) || fallback.selectedStyle;
  const rawVisualPacing = asRecord(aiPlan.visualPacing);
  const rawHookLogic = asRecord(aiPlan.hookLogic);
  const rawColorGrade = asRecord(aiPlan.colorGrade);

  return {
    version: '1.0',
    selectedStyle,
    confidence: clampNumber(typeof aiPlan.confidence === 'number' ? aiPlan.confidence : fallback.confidence, 0, 1),
    reason: asString(aiPlan.reason) || fallback.reason,
    hookLogic: {
      durationSeconds: clampNumber(asNumber(rawHookLogic.durationSeconds, fallback.hookLogic.durationSeconds), 3, 5),
      forceFastCuts: typeof rawHookLogic.forceFastCuts === 'boolean' ? rawHookLogic.forceFastCuts : fallback.hookLogic.forceFastCuts,
      targetCutRangeSeconds: normalizeRange(rawHookLogic.targetCutRangeSeconds, fallback.hookLogic.targetCutRangeSeconds),
      actionDensity: normalizeActionDensity(rawHookLogic.actionDensity, fallback.hookLogic.actionDensity),
      notes: normalizeStringArray(rawHookLogic.notes, fallback.hookLogic.notes),
    },
    visualPacing: {
      estimatedBpm: Math.round(asNumber(rawVisualPacing.estimatedBpm, fallback.visualPacing.estimatedBpm)),
      voiceEnergy: normalizeEnergy(rawVisualPacing.voiceEnergy, fallback.visualPacing.voiceEnergy),
      cutRangeSeconds: normalizeRange(rawVisualPacing.cutRangeSeconds, fallback.visualPacing.cutRangeSeconds),
      beatSync: normalizeBeatSync(rawVisualPacing.beatSync, fallback.visualPacing.beatSync),
      sceneHoldRangeSeconds: normalizeRange(rawVisualPacing.sceneHoldRangeSeconds, fallback.visualPacing.sceneHoldRangeSeconds),
    },
    shotSelection: normalizeShotSelection(aiPlan.shotSelection, fallback.shotSelection),
    colorGrade: {
      lut: asString(rawColorGrade.lut) || fallback.colorGrade.lut,
      contrast: normalizeGradeValue(rawColorGrade.contrast, fallback.colorGrade.contrast, ['soft', 'medium', 'high']),
      saturation: normalizeGradeValue(rawColorGrade.saturation, fallback.colorGrade.saturation, ['low', 'natural', 'high']),
      grain: normalizeGradeValue(rawColorGrade.grain, fallback.colorGrade.grain, ['none', 'subtle', 'heavy']),
      palette: normalizeStringArray(rawColorGrade.palette, fallback.colorGrade.palette),
    },
    semanticSoundDesign: normalizeSemanticSound(aiPlan.semanticSoundDesign, fallback.semanticSoundDesign),
    rendererRules: fallback.rendererRules,
  };
}

function inferStyle(analysis: VoiceoverAnalysis): EditingStyle {
  const transcript = analysis.transcript.toLowerCase();

  if (analysis.emotion.primary === 'luxury' || transcript.includes('luxury') || transcript.includes('premium')) return 'luxury_edit';
  if (transcript.includes('meme') || transcript.includes('funny') || transcript.includes('viral')) return 'meme_style';
  if (analysis.speakingSpeed.label === 'fast' || analysis.speakingSpeed.label === 'very_fast' || analysis.emotion.primary === 'energetic') return 'fast_cuts';
  if (analysis.emotion.primary === 'sad' || analysis.emotion.primary === 'cinematic') return 'slow_cinematic';
  if (analysis.speakingSpeed.durationSeconds > 55 || transcript.includes('documentary') || transcript.includes('story')) return 'youtube_documentary';
  return 'reels_pacing';
}

function getVisualPacing(analysis: VoiceoverAnalysis, style: EditingStyle): VideoDirectorPlan['visualPacing'] {
  const estimatedBpm = estimateBpm(analysis);
  const highEnergy = analysis.speakingSpeed.label === 'fast' || analysis.speakingSpeed.label === 'very_fast' || analysis.emotion.primary === 'energetic';

  const stylePacing: Record<EditingStyle, Omit<VideoDirectorPlan['visualPacing'], 'estimatedBpm' | 'voiceEnergy'>> = {
    fast_cuts: { cutRangeSeconds: [0.5, 1.2], beatSync: 'aggressive', sceneHoldRangeSeconds: [0.8, 1.8] },
    slow_cinematic: { cutRangeSeconds: [3, 5], beatSync: 'subtle', sceneHoldRangeSeconds: [3, 5] },
    meme_style: { cutRangeSeconds: [0.4, 1], beatSync: 'aggressive', sceneHoldRangeSeconds: [0.7, 1.4] },
    luxury_edit: { cutRangeSeconds: [2.5, 4.5], beatSync: 'subtle', sceneHoldRangeSeconds: [2.8, 5] },
    reels_pacing: { cutRangeSeconds: [0.8, 1.8], beatSync: 'strong', sceneHoldRangeSeconds: [1.2, 2.4] },
    youtube_documentary: { cutRangeSeconds: [2.5, 4], beatSync: 'subtle', sceneHoldRangeSeconds: [3, 6] },
  };

  return {
    estimatedBpm,
    voiceEnergy: highEnergy ? 'high' : analysis.speakingSpeed.label === 'slow' ? 'low' : 'medium',
    ...stylePacing[style],
  };
}

function getShotSelectionRules(style: EditingStyle): VideoDirectorPlan['shotSelection'] {
  const base: VideoDirectorPlan['shotSelection'] = [
    {
      shotType: 'establishing',
      when: 'Start of a new scene or topic shift',
      reason: 'Set context before details so the viewer understands where they are.',
      priority: 'primary',
    },
    {
      shotType: 'close_up',
      when: 'Important, emotional, or high-confidence keyword appears',
      reason: 'Close-ups increase emotional weight and retention.',
      priority: 'primary',
    },
    {
      shotType: 'b_roll_overlay',
      when: 'Voiceover mentions process, object, place, app, money, or visible action',
      reason: 'Overlay concrete visuals over abstract narration.',
      priority: 'primary',
    },
  ];

  if (style === 'youtube_documentary') {
    base.push({ shotType: 'wide', when: 'Before explanation blocks', reason: 'Documentary pacing needs orientation and breath.', priority: 'secondary' });
  }

  if (style === 'meme_style') {
    base.push({ shotType: 'reaction', when: 'Punchline, contrast, or surprising phrase', reason: 'Reaction beats make meme pacing feel human.', priority: 'primary' });
  }

  if (style === 'luxury_edit') {
    base.push({ shotType: 'detail', when: 'Premium, success, money, product, or status words', reason: 'Luxury edits rely on restrained details and texture.', priority: 'primary' });
  }

  return base;
}

function getColorGrade(style: EditingStyle): VideoDirectorPlan['colorGrade'] {
  const grades: Record<EditingStyle, VideoDirectorPlan['colorGrade']> = {
    fast_cuts: { lut: 'punchy_creator_contrast', contrast: 'high', saturation: 'high', grain: 'none', palette: ['cyan', 'white', 'black'] },
    slow_cinematic: { lut: 'cinematic_teal_shadow', contrast: 'medium', saturation: 'low', grain: 'subtle', palette: ['teal', 'amber', 'deep black'] },
    meme_style: { lut: 'bright_pop_meme', contrast: 'high', saturation: 'high', grain: 'none', palette: ['yellow', 'red', 'blue', 'white'] },
    luxury_edit: { lut: 'luxury_gold_black', contrast: 'high', saturation: 'low', grain: 'subtle', palette: ['gold', 'deep black', 'champagne'] },
    reels_pacing: { lut: 'clean_reels_pop', contrast: 'medium', saturation: 'high', grain: 'none', palette: ['purple', 'cyan', 'white'] },
    youtube_documentary: { lut: 'natural_documentary_film', contrast: 'medium', saturation: 'natural', grain: 'subtle', palette: ['natural skin', 'warm grey', 'muted blue'] },
  };

  return grades[style];
}

function getSemanticSoundRules(analysis: VoiceoverAnalysis, style: EditingStyle): VideoDirectorPlan['semanticSoundDesign'] {
  const transcript = analysis.transcript.toLowerCase();
  const rules: VideoDirectorPlan['semanticSoundDesign'] = [];

  const addIfPresent = (keywords: string[], action: VideoDirectorPlan['semanticSoundDesign'][number]['action'], soundCue: string, mixNote: string) => {
    const keyword = keywords.find((item) => transcript.includes(item));
    if (keyword) rules.push({ keyword, action, soundCue, mixNote });
  };

  addIfPresent(['money', 'cash', 'revenue', 'profit'], 'sfx', 'cash_register_chime', 'Keep low and quick under the voice.');
  addIfPresent(['secret', 'hidden', 'truth'], 'muffle', 'low_muffled_drop', 'Duck music suddenly for mystery.');
  addIfPresent(['mistake', 'wrong', 'fail'], 'impact', 'short_error_hit', 'Use a dry hit, no long tail.');
  addIfPresent(['success', 'win', 'power'], 'impact', style === 'luxury_edit' ? 'soft_luxury_hit' : 'cinematic_hit', 'Sync with keyword caption pop.');
  addIfPresent(['work', 'focus', 'build'], 'ambient_shift', 'office_urban_hum', 'Blend subtly behind productive scenes.');

  if (!rules.length) {
    rules.push({
      keyword: analysis.keywords[0] || 'hook',
      action: 'sfx',
      soundCue: 'whoosh_to_hit',
      mixNote: 'Use only on the strongest hook word.',
    });
  }

  return rules;
}

function estimateBpm(analysis: VoiceoverAnalysis) {
  const wpm = analysis.speakingSpeed.wordsPerMinute;
  if (wpm >= 210) return 150;
  if (wpm >= 165) return 132;
  if (wpm >= 120) return 104;
  return 82;
}

function buildReason(analysis: VoiceoverAnalysis, style: EditingStyle) {
  return `Selected ${style} from ${analysis.emotion.primary} emotion, ${analysis.speakingSpeed.label} voice speed, and topic: ${analysis.topicSummary}`;
}

function normalizeStyle(value: unknown): EditingStyle | null {
  const normalized = asString(value).toLowerCase().replace(/[\s-]+/g, '_');
  const aliases: Record<string, EditingStyle> = {
    fast: 'fast_cuts',
    fast_cuts: 'fast_cuts',
    slow: 'slow_cinematic',
    cinematic: 'slow_cinematic',
    slow_cinematic: 'slow_cinematic',
    meme: 'meme_style',
    meme_style: 'meme_style',
    luxury: 'luxury_edit',
    luxury_edit: 'luxury_edit',
    reels: 'reels_pacing',
    reels_pacing: 'reels_pacing',
    documentary: 'youtube_documentary',
    youtube_documentary: 'youtube_documentary',
  };

  return aliases[normalized] || null;
}

function normalizeShotSelection(value: unknown, fallback: VideoDirectorPlan['shotSelection']) {
  if (!Array.isArray(value)) return fallback;
  const normalized = value.map((item) => {
    const shot = asRecord(item);
    return {
      shotType: normalizeShotType(shot.shotType),
      when: asString(shot.when) || 'At relevant narrative moment',
      reason: asString(shot.reason) || 'Improve visual clarity and retention.',
      priority: asString(shot.priority) === 'secondary' ? 'secondary' as const : 'primary' as const,
    };
  });

  return normalized.length ? normalized : fallback;
}

function normalizeSemanticSound(value: unknown, fallback: VideoDirectorPlan['semanticSoundDesign']) {
  if (!Array.isArray(value)) return fallback;
  const normalized = value.map((item) => {
    const rule = asRecord(item);
    return {
      keyword: asString(rule.keyword),
      action: normalizeSoundAction(rule.action),
      soundCue: asString(rule.soundCue) || 'whoosh_to_hit',
      mixNote: asString(rule.mixNote) || 'Keep subtle under the voiceover.',
    };
  }).filter((item) => item.keyword);

  return normalized.length ? normalized : fallback;
}

function normalizeShotType(value: unknown): VideoDirectorPlan['shotSelection'][number]['shotType'] {
  const shotType = asString(value) as VideoDirectorPlan['shotSelection'][number]['shotType'];
  return ['establishing', 'close_up', 'b_roll_overlay', 'insert', 'reaction', 'wide', 'detail'].includes(shotType) ? shotType : 'b_roll_overlay';
}

function normalizeSoundAction(value: unknown): VideoDirectorPlan['semanticSoundDesign'][number]['action'] {
  const action = asString(value) as VideoDirectorPlan['semanticSoundDesign'][number]['action'];
  return ['sfx', 'music_duck', 'muffle', 'impact', 'ambient_shift'].includes(action) ? action : 'sfx';
}

function normalizeRange(value: unknown, fallback: [number, number]): [number, number] {
  if (!Array.isArray(value) || value.length < 2) return fallback;
  const first = Number(value[0]);
  const second = Number(value[1]);
  return Number.isFinite(first) && Number.isFinite(second) ? [round(first), round(second)] : fallback;
}

function normalizeEnergy(value: unknown, fallback: VideoDirectorPlan['visualPacing']['voiceEnergy']) {
  const energy = asString(value) as VideoDirectorPlan['visualPacing']['voiceEnergy'];
  return ['low', 'medium', 'high'].includes(energy) ? energy : fallback;
}

function normalizeBeatSync(value: unknown, fallback: VideoDirectorPlan['visualPacing']['beatSync']) {
  const beatSync = asString(value) as VideoDirectorPlan['visualPacing']['beatSync'];
  return ['subtle', 'strong', 'aggressive'].includes(beatSync) ? beatSync : fallback;
}

function normalizeActionDensity(value: unknown, fallback: VideoDirectorPlan['hookLogic']['actionDensity']) {
  const density = asString(value) as VideoDirectorPlan['hookLogic']['actionDensity'];
  return ['medium', 'high', 'very_high'].includes(density) ? density : fallback;
}

function normalizeGradeValue<T extends string>(value: unknown, fallback: T, allowed: T[]) {
  const normalized = asString(value) as T;
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.map((item) => asString(item).trim()).filter(Boolean);
  return items.length ? items : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

