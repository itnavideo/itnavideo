/**
 * AI Scene Director — Semantic Script & Scene Planning (Strategy A)
 *
 * Parses a transcript into a structured shot list using Gemini.
 * Each scene has: visual intent, motion preset, transition, and word-anchored timing.
 * Falls back to a deterministic local planner when Gemini is unavailable.
 */

import { GoogleGenAI } from '@google/genai';

// ── Types ─────────────────────────────────────────────────────────────────────

export type VisualType =
  | 'cinematic_landscape'
  | 'product_closeup'
  | 'text_overlay'
  | 'data_visualization'
  | 'person_portrait'
  | 'abstract_motion'
  | 'icon_illustration'
  | 'screen_recording'
  | 'b_roll_ambient';

export type MotionPreset =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_right_ease'
  | 'pan_left_ease'
  | 'dolly_forward'
  | 'dolly_backward'
  | 'static_breathe'
  | 'ken_burns_tl_br'
  | 'ken_burns_br_tl'
  | 'scale_pop'
  | 'parallax_layers';

export type TransitionType =
  | 'hard_cut'
  | 'cross_dissolve'
  | 'soft_fade'
  | 'match_cut'
  | 'slide_left'
  | 'slide_right'
  | 'zoom_through'
  | 'wipe_down';

export type SceneIntent =
  | 'establish_atmosphere'
  | 'introduce_topic'
  | 'explain_concept'
  | 'show_example'
  | 'emphasize_point'
  | 'compare_contrast'
  | 'build_tension'
  | 'resolve_conclusion'
  | 'call_to_action';

export type DirectedScene = {
  scene: number;
  startWord: number;
  endWord: number;
  startTime: number;
  endTime: number;
  visualType: VisualType;
  motion: MotionPreset;
  transitionIn: TransitionType;
  intent: SceneIntent;
  emphasis?: string[];
  assetQuery?: string;
};

export type SceneDirectorInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  durationSeconds: number;
  topicTitle?: string;
  mood?: string;
  pacing?: 'slow' | 'medium' | 'fast';
};

export type SceneDirectorResult = {
  scenes: DirectedScene[];
  source: 'gemini' | 'fallback';
};

// ── Available options for the prompt ──────────────────────────────────────────

const VISUAL_TYPES: VisualType[] = ['cinematic_landscape', 'product_closeup', 'text_overlay', 'data_visualization', 'person_portrait', 'abstract_motion', 'icon_illustration', 'screen_recording', 'b_roll_ambient'];
const MOTION_PRESETS: MotionPreset[] = ['slow_zoom_in', 'slow_zoom_out', 'pan_right_ease', 'pan_left_ease', 'dolly_forward', 'dolly_backward', 'static_breathe', 'ken_burns_tl_br', 'ken_burns_br_tl', 'scale_pop', 'parallax_layers'];
const TRANSITIONS: TransitionType[] = ['hard_cut', 'cross_dissolve', 'soft_fade', 'match_cut', 'slide_left', 'slide_right', 'zoom_through', 'wipe_down'];
const INTENTS: SceneIntent[] = ['establish_atmosphere', 'introduce_topic', 'explain_concept', 'show_example', 'emphasize_point', 'compare_contrast', 'build_tension', 'resolve_conclusion', 'call_to_action'];

// ── Main director ─────────────────────────────────────────────────────────────

export async function planScenes(input: SceneDirectorInput): Promise<SceneDirectorResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (apiKey && input.words.length >= 4) {
    try {
      const scenes = await callGeminiDirector(input, apiKey);
      if (scenes.length >= 2) return { scenes, source: 'gemini' };
    } catch (error) {
      console.error('[SCENE_DIRECTOR] Gemini failed, using fallback:', error instanceof Error ? error.message : error);
    }
  }
  return { scenes: buildFallbackScenes(input), source: 'fallback' };
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGeminiDirector(input: SceneDirectorInput, apiKey: string): Promise<DirectedScene[]> {
  const ai = new GoogleGenAI({ apiKey });

  const wordLines = input.words.slice(0, 200).map((w, i) => `[${i}] ${w.start.toFixed(2)}s "${w.word}"`).join('\n');
  const pacing = input.pacing || 'medium';
  const sceneChangeInterval = pacing === 'fast' ? '2-3' : pacing === 'slow' ? '5-7' : '3-5';

  const prompt = [
    'You are a professional video director planning shots for a short-form video.',
    '',
    `TOPIC: "${input.topicTitle || 'Explainer Video'}"`,
    `DURATION: ${input.durationSeconds.toFixed(1)} seconds`,
    `MOOD: ${input.mood || 'professional, engaging'}`,
    `PACING: ${pacing} (change scenes every ${sceneChangeInterval} seconds)`,
    '',
    'TRANSCRIPT WITH WORD INDICES AND TIMESTAMPS:',
    wordLines,
    '',
    'AVAILABLE VISUAL TYPES:', VISUAL_TYPES.join(', '),
    'AVAILABLE MOTION PRESETS:', MOTION_PRESETS.join(', '),
    'AVAILABLE TRANSITIONS:', TRANSITIONS.join(', '),
    'AVAILABLE INTENTS:', INTENTS.join(', '),
    '',
    'RULES:',
    '1. Plan 4-12 scenes based on the script content and pacing.',
    '2. Each scene MUST reference startWord and endWord indices from the transcript.',
    '3. Scenes must not overlap and must cover the full duration.',
    '4. Match visual_type to the MEANING of the narration segment.',
    '5. Use varied motion presets — avoid repeating the same motion twice in a row.',
    '6. Transitions should follow narrative logic:',
    '   - hard_cut for fast information',
    '   - cross_dissolve for topic shifts',
    '   - soft_fade for emotional moments',
    '   - match_cut when subjects are similar',
    '7. Include 1-3 emphasis words per scene (power words that deserve visual pop).',
    '8. assetQuery should be a short search phrase for finding the right visual asset.',
    '',
    'OUTPUT: Return ONLY a JSON array. No markdown fences, no explanation.',
    '[{"scene":1,"startWord":0,"endWord":8,"startTime":0,"endTime":3.5,"visualType":"cinematic_landscape","motion":"slow_zoom_in","transitionIn":"soft_fade","intent":"establish_atmosphere","emphasis":["powerful"],"assetQuery":"dramatic sky sunset"}]',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.4, maxOutputTokens: 3000 },
  });

  const text = (response.text || '').trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Empty scene plan');

  return parsed
    .filter((s: Record<string, unknown>) =>
      typeof s.startWord === 'number' && typeof s.endWord === 'number' &&
      typeof s.startTime === 'number' && typeof s.endTime === 'number' &&
      s.endTime > s.startTime
    )
    .map((s: Record<string, unknown>, i: number) => ({
      scene: i + 1,
      startWord: Math.max(0, Number(s.startWord)),
      endWord: Math.min(input.words.length - 1, Number(s.endWord)),
      startTime: Math.max(0, Number(s.startTime)),
      endTime: Math.min(input.durationSeconds, Number(s.endTime)),
      visualType: VISUAL_TYPES.includes(s.visualType as VisualType) ? s.visualType as VisualType : 'b_roll_ambient',
      motion: MOTION_PRESETS.includes(s.motion as MotionPreset) ? s.motion as MotionPreset : 'slow_zoom_in',
      transitionIn: TRANSITIONS.includes(s.transitionIn as TransitionType) ? s.transitionIn as TransitionType : 'cross_dissolve',
      intent: INTENTS.includes(s.intent as SceneIntent) ? s.intent as SceneIntent : 'explain_concept',
      emphasis: Array.isArray(s.emphasis) ? s.emphasis.map(String).slice(0, 3) : [],
      assetQuery: typeof s.assetQuery === 'string' ? s.assetQuery.slice(0, 80) : undefined,
    }));
}

// ── Deterministic fallback ────────────────────────────────────────────────────

function buildFallbackScenes(input: SceneDirectorInput): DirectedScene[] {
  const { words, durationSeconds } = input;
  if (!words.length) return [];

  const pacing = input.pacing || 'medium';
  const intervalSec = pacing === 'fast' ? 2.5 : pacing === 'slow' ? 6 : 4;
  const sceneCount = Math.max(3, Math.min(10, Math.ceil(durationSeconds / intervalSec)));
  const wordsPerScene = Math.max(2, Math.floor(words.length / sceneCount));
  const scenes: DirectedScene[] = [];

  const motionCycle: MotionPreset[] = ['slow_zoom_in', 'pan_right_ease', 'ken_burns_tl_br', 'dolly_forward', 'slow_zoom_out', 'pan_left_ease', 'ken_burns_br_tl', 'static_breathe'];
  const transitionCycle: TransitionType[] = ['soft_fade', 'cross_dissolve', 'hard_cut', 'cross_dissolve', 'slide_left', 'cross_dissolve'];
  const intentCycle: SceneIntent[] = ['introduce_topic', 'explain_concept', 'show_example', 'emphasize_point', 'explain_concept', 'compare_contrast', 'build_tension', 'resolve_conclusion'];

  for (let i = 0; i < sceneCount; i++) {
    const startIdx = i * wordsPerScene;
    const endIdx = Math.min(words.length - 1, (i + 1) * wordsPerScene - 1);
    if (startIdx >= words.length) break;

    const startTime = words[startIdx].start;
    const endTime = i === sceneCount - 1 ? durationSeconds : words[Math.min(endIdx + 1, words.length - 1)].start;

    scenes.push({
      scene: i + 1,
      startWord: startIdx,
      endWord: endIdx,
      startTime,
      endTime: Math.max(startTime + 0.5, endTime),
      visualType: i === 0 ? 'cinematic_landscape' : i === sceneCount - 1 ? 'text_overlay' : 'b_roll_ambient',
      motion: motionCycle[i % motionCycle.length],
      transitionIn: i === 0 ? 'soft_fade' : transitionCycle[i % transitionCycle.length],
      intent: i === 0 ? 'establish_atmosphere' : i === sceneCount - 1 ? 'call_to_action' : intentCycle[i % intentCycle.length],
      emphasis: words.slice(startIdx, endIdx + 1).filter((w) => w.word.length >= 5).slice(0, 2).map((w) => w.word),
    });
  }

  return scenes;
}
