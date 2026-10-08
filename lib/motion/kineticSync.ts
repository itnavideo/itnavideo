/**
 * Kinetic Sync — Motivated Motion & Audio-Aligned Text Animation
 *
 * Rules:
 * 1. Every motion is MOTIVATED by the message content
 * 2. Entry/exit of text is perfectly aligned with audio word onset
 * 3. Emphasized voiceover words trigger reactive visual pops
 * 4. Motion rhythm follows the emotional arc, not arbitrary timing
 *
 * Motion Motivation Map:
 * - Rising/Growing → positive, expansive concepts
 * - Hard Cut/Flash → high-energy, punchy factual statements
 * - Subtle Fade → quiet, emotional, documentary narratives
 */

import type { MotionPreset } from '../../services/ai/sceneDirector';
import { DEFAULT_FPS } from '../../remotion/constants';

// ── Types ─────────────────────────────────────────────────────────────────────

export type MotionMotivation =
  | 'rising'        // Positive growth, expansion, increase
  | 'descending'    // Decline, loss, negative
  | 'hard_impact'   // Punchy facts, statistics, bold claims
  | 'subtle_fade'   // Emotional, quiet, documentary
  | 'pulse'         // Rhythmic, musical, repetitive
  | 'reveal'        // Unveiling, discovery, surprise
  | 'settle'        // Conclusion, resolution, certainty
  | 'tension'       // Building suspense, worry, urgency
  | 'neutral';      // Default narration, no strong motivation

export type WordReaction = {
  word: string;
  startTime: number;
  endTime: number;
  reactionType: 'scale_pop' | 'color_flash' | 'brightness_pulse' | 'letter_space_expand' | 'weight_shift' | 'none';
  intensity: number; // 0–1
  durationFrames: number;
};

export type KineticSyncConfig = {
  motivation: MotionMotivation;
  entryStyle: EntryAnimation;
  exitStyle: ExitAnimation;
  wordReactions: WordReaction[];
  rhythmBPM?: number;
  audioOnsetFrame: number; // exact frame where the first word begins
  audioOffsetFrame: number; // exact frame where the last word ends
};

export type EntryAnimation = {
  type: 'scale_up' | 'slide_up' | 'slide_down' | 'hard_cut' | 'fade_in' | 'typewrite' | 'expand_from_center' | 'drop_bounce';
  durationFrames: number;
  delay: number; // frames before the audio onset to start the visual (negative = before audio)
  easing: 'spring' | 'ease_out' | 'linear' | 'overshoot';
};

export type ExitAnimation = {
  type: 'fade_out' | 'scale_down' | 'slide_out' | 'dissolve' | 'hard_cut' | 'blur_out';
  durationFrames: number;
  offset: number; // frames after the audio offset to complete the exit
  easing: 'ease_in' | 'linear' | 'spring';
};

// ── Motivation Detection ──────────────────────────────────────────────────────

const MOTIVATION_KEYWORDS: Record<MotionMotivation, RegExp> = {
  rising: /\b(grow|increase|rise|expand|improve|better|success|gain|build|progress|achieve|profit|up|more|higher|boost|double|triple)\b/i,
  descending: /\b(fall|decline|decrease|drop|lose|worst|down|less|lower|shrink|reduce|cut|minus)\b/i,
  hard_impact: /\b(fact|truth|reality|actually|exactly|precisely|proven|data|number|percent|million|billion|statistic|rule|law)\b/i,
  subtle_fade: /\b(feel|heart|soul|remember|memory|moment|silence|peace|gentle|softly|slowly|whisper|dream|hope)\b/i,
  pulse: /\b(every|always|each|again|repeat|rhythm|beat|time|cycle|pattern|daily|weekly|monthly)\b/i,
  reveal: /\b(secret|hidden|discover|reveal|surprise|actually|twist|truth is|real reason|what if|imagine)\b/i,
  settle: /\b(final|conclusion|answer|solution|simple|clear|done|finished|result|bottom line|summary|so basically)\b/i,
  tension: /\b(but|however|problem|risk|danger|warning|careful|watch out|unless|before|deadline|urgent|hurry)\b/i,
  neutral: /./,
};

/**
 * Detect the motivation behind a phrase based on its semantic content.
 */
export function detectMotivation(text: string, emotionalWeight?: string): MotionMotivation {
  // Emotional weight override
  if (emotionalWeight === 'urgent' || emotionalWeight === 'dramatic') return 'tension';
  if (emotionalWeight === 'inspirational') return 'rising';
  if (emotionalWeight === 'calm') return 'subtle_fade';
  if (emotionalWeight === 'energetic') return 'hard_impact';
  if (emotionalWeight === 'authoritative') return 'hard_impact';

  const normalized = text.toLowerCase();

  // Check each motivation pattern (order matters — more specific first)
  if (MOTIVATION_KEYWORDS.hard_impact.test(normalized)) return 'hard_impact';
  if (MOTIVATION_KEYWORDS.rising.test(normalized)) return 'rising';
  if (MOTIVATION_KEYWORDS.descending.test(normalized)) return 'descending';
  if (MOTIVATION_KEYWORDS.reveal.test(normalized)) return 'reveal';
  if (MOTIVATION_KEYWORDS.tension.test(normalized)) return 'tension';
  if (MOTIVATION_KEYWORDS.settle.test(normalized)) return 'settle';
  if (MOTIVATION_KEYWORDS.subtle_fade.test(normalized)) return 'subtle_fade';
  if (MOTIVATION_KEYWORDS.pulse.test(normalized)) return 'pulse';

  return 'neutral';
}

// ── Entry/Exit Selection Based on Motivation ──────────────────────────────────

const MOTIVATION_TO_ENTRY: Record<MotionMotivation, EntryAnimation> = {
  rising: { type: 'scale_up', durationFrames: 12, delay: -2, easing: 'spring' },
  descending: { type: 'slide_down', durationFrames: 10, delay: -1, easing: 'ease_out' },
  hard_impact: { type: 'hard_cut', durationFrames: 3, delay: 0, easing: 'linear' },
  subtle_fade: { type: 'fade_in', durationFrames: 18, delay: -4, easing: 'ease_out' },
  pulse: { type: 'scale_up', durationFrames: 8, delay: -1, easing: 'overshoot' },
  reveal: { type: 'expand_from_center', durationFrames: 14, delay: -2, easing: 'spring' },
  settle: { type: 'drop_bounce', durationFrames: 16, delay: -2, easing: 'spring' },
  tension: { type: 'slide_up', durationFrames: 10, delay: -1, easing: 'ease_out' },
  neutral: { type: 'fade_in', durationFrames: 10, delay: -1, easing: 'ease_out' },
};

const MOTIVATION_TO_EXIT: Record<MotionMotivation, ExitAnimation> = {
  rising: { type: 'scale_down', durationFrames: 8, offset: 2, easing: 'ease_in' },
  descending: { type: 'fade_out', durationFrames: 10, offset: 3, easing: 'ease_in' },
  hard_impact: { type: 'hard_cut', durationFrames: 2, offset: 1, easing: 'linear' },
  subtle_fade: { type: 'dissolve', durationFrames: 16, offset: 4, easing: 'ease_in' },
  pulse: { type: 'scale_down', durationFrames: 6, offset: 1, easing: 'spring' },
  reveal: { type: 'fade_out', durationFrames: 10, offset: 2, easing: 'ease_in' },
  settle: { type: 'fade_out', durationFrames: 12, offset: 3, easing: 'ease_in' },
  tension: { type: 'blur_out', durationFrames: 8, offset: 1, easing: 'ease_in' },
  neutral: { type: 'fade_out', durationFrames: 8, offset: 2, easing: 'ease_in' },
};

// ── Word-Level Reaction Detection ─────────────────────────────────────────────

/**
 * Detect which words in a phrase deserve a reactive visual pop.
 * Based on: word emphasis in voiceover, semantic power, and position.
 */
export function detectWordReactions(
  words: Array<{ word: string; start: number; end: number }>,
  phraseEmphasis?: string[],
  fps = DEFAULT_FPS,
): WordReaction[] {
  const emphasisSet = new Set((phraseEmphasis || []).map((w) => w.toLowerCase()));

  // Power words that naturally get emphasized in voiceover
  const VOICEOVER_EMPHASIS = new Set([
    'never', 'always', 'best', 'worst', 'first', 'last', 'only', 'most',
    'every', 'all', 'none', 'zero', 'free', 'now', 'today', 'million',
    'billion', 'secret', 'truth', 'real', 'fake', 'stop', 'must', 'key',
    'critical', 'important', 'guaranteed', 'proven', 'impossible',
  ]);

  return words.map((word) => {
    const clean = word.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isExplicitEmphasis = emphasisSet.has(clean);
    const isPowerWord = VOICEOVER_EMPHASIS.has(clean);
    const isNumber = /^\d+/.test(word.word);
    const isLong = clean.length >= 8;

    if (isExplicitEmphasis) {
      return { word: word.word, startTime: word.start, endTime: word.end, reactionType: 'scale_pop' as const, intensity: 0.85, durationFrames: 10 };
    }
    if (isPowerWord) {
      return { word: word.word, startTime: word.start, endTime: word.end, reactionType: 'color_flash' as const, intensity: 0.7, durationFrames: 8 };
    }
    if (isNumber) {
      return { word: word.word, startTime: word.start, endTime: word.end, reactionType: 'weight_shift' as const, intensity: 0.6, durationFrames: 8 };
    }
    if (isLong) {
      return { word: word.word, startTime: word.start, endTime: word.end, reactionType: 'letter_space_expand' as const, intensity: 0.4, durationFrames: 6 };
    }
    return { word: word.word, startTime: word.start, endTime: word.end, reactionType: 'none' as const, intensity: 0, durationFrames: 0 };
  });
}

// ── Full Kinetic Sync Builder ─────────────────────────────────────────────────

/**
 * Build the complete kinetic sync configuration for a phrase.
 * Aligns entry/exit to exact audio word onsets.
 */
export function buildKineticSync(
  text: string,
  words: Array<{ word: string; start: number; end: number }>,
  emotionalWeight?: string,
  phraseEmphasis?: string[],
  fps = DEFAULT_FPS,
): KineticSyncConfig {
  const motivation = detectMotivation(text, emotionalWeight);
  const entry = MOTIVATION_TO_ENTRY[motivation];
  const exit = MOTIVATION_TO_EXIT[motivation];
  const reactions = detectWordReactions(words, phraseEmphasis, fps);

  // Audio onset = first word start; audio offset = last word end
  const audioOnsetFrame = words.length ? Math.round(words[0].start * fps) : 0;
  const audioOffsetFrame = words.length ? Math.round(words[words.length - 1].end * fps) : audioOnsetFrame + Math.round(fps * 1.0);

  return {
    motivation,
    entryStyle: entry,
    exitStyle: exit,
    wordReactions: reactions,
    audioOnsetFrame,
    audioOffsetFrame,
  };
}

// ── Renderer Helpers ──────────────────────────────────────────────────────────

/**
 * Calculate the visual transform for a kinetic text element at a given frame.
 * Perfectly syncs entry to audio onset and exit to audio offset.
 */
export function getKineticTransform(
  frame: number,
  sync: KineticSyncConfig,
  fps = DEFAULT_FPS,
): { opacity: number; transform: string; filter: string } {
  const { entryStyle, exitStyle, audioOnsetFrame, audioOffsetFrame } = sync;

  // Entry starts `delay` frames before audio onset
  const entryStartFrame = audioOnsetFrame + entryStyle.delay;
  const entryEndFrame = entryStartFrame + entryStyle.durationFrames;

  // Exit starts at audio offset + offset
  const exitStartFrame = audioOffsetFrame + exitStyle.offset;
  const exitEndFrame = exitStartFrame + exitStyle.durationFrames;

  // Before entry
  if (frame < entryStartFrame) {
    return { opacity: 0, transform: getEntryStartTransform(entryStyle), filter: '' };
  }

  // During entry
  if (frame < entryEndFrame) {
    const progress = (frame - entryStartFrame) / Math.max(1, entryStyle.durationFrames);
    const eased = applyEasing(progress, entryStyle.easing);
    return {
      opacity: eased,
      transform: interpolateEntryTransform(entryStyle, eased),
      filter: '',
    };
  }

  // During hold (between entry end and exit start)
  if (frame < exitStartFrame) {
    return { opacity: 1, transform: 'none', filter: '' };
  }

  // During exit
  if (frame < exitEndFrame) {
    const progress = (frame - exitStartFrame) / Math.max(1, exitStyle.durationFrames);
    const eased = applyEasing(progress, exitStyle.easing);
    return {
      opacity: 1 - eased,
      transform: interpolateExitTransform(exitStyle, eased),
      filter: exitStyle.type === 'blur_out' ? `blur(${eased * 8}px)` : '',
    };
  }

  // After exit
  return { opacity: 0, transform: 'none', filter: '' };
}

/**
 * Calculate word-level reaction at a given time.
 * Returns scale/color adjustments for the currently-spoken word.
 */
export function getWordReactionAtTime(
  currentTime: number,
  reactions: WordReaction[],
  fps = DEFAULT_FPS,
): { activeWord: string | null; scale: number; colorShift: string; letterSpacing: number; fontWeight: number } {
  const active = reactions.find((r) =>
    r.reactionType !== 'none' &&
    currentTime >= r.startTime &&
    currentTime <= r.startTime + r.durationFrames / fps,
  );

  if (!active) return { activeWord: null, scale: 1, colorShift: '', letterSpacing: 0, fontWeight: 0 };

  const progress = Math.min(1, (currentTime - active.startTime) / (active.durationFrames / fps));
  // Bell curve: peak at 0.5, ease in and out
  const bell = Math.sin(progress * Math.PI);

  switch (active.reactionType) {
    case 'scale_pop':
      return { activeWord: active.word, scale: 1 + bell * active.intensity * 0.15, colorShift: '', letterSpacing: 0, fontWeight: 0 };
    case 'color_flash':
      return { activeWord: active.word, scale: 1 + bell * 0.03, colorShift: `brightness(${1 + bell * active.intensity * 0.3})`, letterSpacing: 0, fontWeight: 0 };
    case 'brightness_pulse':
      return { activeWord: active.word, scale: 1, colorShift: `brightness(${1 + bell * active.intensity * 0.4})`, letterSpacing: 0, fontWeight: 0 };
    case 'letter_space_expand':
      return { activeWord: active.word, scale: 1, colorShift: '', letterSpacing: bell * active.intensity * 0.06, fontWeight: 0 };
    case 'weight_shift':
      return { activeWord: active.word, scale: 1, colorShift: '', letterSpacing: 0, fontWeight: Math.round(bell * active.intensity * 200) };
    default:
      return { activeWord: null, scale: 1, colorShift: '', letterSpacing: 0, fontWeight: 0 };
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function applyEasing(t: number, easing: string): number {
  switch (easing) {
    case 'spring': return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 0.8);
    case 'overshoot': return t < 0.7 ? (t / 0.7) * 1.15 : 1.15 - (t - 0.7) / 0.3 * 0.15;
    case 'ease_out': return 1 - Math.pow(1 - t, 3);
    case 'ease_in': return t * t * t;
    default: return t;
  }
}

function getEntryStartTransform(entry: EntryAnimation): string {
  switch (entry.type) {
    case 'scale_up': return 'scale(0.7)';
    case 'slide_up': return 'translateY(50px)';
    case 'slide_down': return 'translateY(-50px)';
    case 'hard_cut': return 'none';
    case 'fade_in': return 'none';
    case 'typewrite': return 'none';
    case 'expand_from_center': return 'scaleX(0)';
    case 'drop_bounce': return 'translateY(-80px)';
    default: return 'none';
  }
}

function interpolateEntryTransform(entry: EntryAnimation, progress: number): string {
  switch (entry.type) {
    case 'scale_up': return `scale(${0.7 + progress * 0.3})`;
    case 'slide_up': return `translateY(${50 * (1 - progress)}px)`;
    case 'slide_down': return `translateY(${-50 * (1 - progress)}px)`;
    case 'expand_from_center': return `scaleX(${progress})`;
    case 'drop_bounce': {
      const y = -80 * (1 - progress);
      const bounce = progress > 0.8 ? Math.sin((progress - 0.8) * 25) * 4 * (1 - progress) : 0;
      return `translateY(${y + bounce}px)`;
    }
    default: return 'none';
  }
}

function interpolateExitTransform(exit: ExitAnimation, progress: number): string {
  switch (exit.type) {
    case 'scale_down': return `scale(${1 - progress * 0.3})`;
    case 'slide_out': return `translateX(${progress * 60}px)`;
    case 'blur_out': return 'none';
    case 'dissolve': return `scale(${1 + progress * 0.05})`;
    default: return 'none';
  }
}
