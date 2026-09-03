/**
 * Typography Video Planner
 *
 * Analyzes speech transcript and word timings to generate continuous, high-impact
 * Kinetic Typography scenes tailored to the selected Typography Style Blueprint.
 */

import type { KineticPhrase, TypographyStyleId } from '@/lib/typography/types';
import type { PremiumSoundCue, PremiumSoundCueType } from '@/remotion/components/PremiumAudioLayer';
import { getAdvancedStyleBlueprint } from '@/lib/typography/styleRegistry';

export type TypographyPlanInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
  typographyStyle?: string;
};

export type TypographyPlan = {
  keywords: KineticPhrase[];
  soundCues: PremiumSoundCue[];
  source: 'deterministic';
};

const POWER_WORDS = new Set([
  'sold', 'earned', 'made', 'lost', 'spent', 'invested', 'grew', 'dropped', 'closed',
  'million', 'billion', 'crore', 'lakh', 'thousand', 'profit', 'loss', 'revenue', 'roi',
  'never', 'always', 'every', 'only', 'first', 'last', 'best', 'worst', 'nobody', 'everyone',
  'luxury', 'premium', 'exclusive', 'elite', 'legacy', 'iconic', 'signature', 'prestige',
  'penthouse', 'skyline', 'oceanfront', 'estate', 'portfolio', 'territory', 'questions',
  'secret', 'truth', 'real', 'fake', 'actually', 'literally', 'exactly', 'growth',
  'discipline', 'freedom', 'consistency', 'mindset', 'vision', 'purpose', 'leverage',
  'wealth', 'success', 'failure', 'risk', 'reward', 'patience', 'focus', 'slow', 'rush',
  'stop', 'start', 'quit', 'build', 'create', 'scale', 'launch', 'work', 'friends', 'relatives',
  'paisa', 'paise', 'kamai', 'kamao', 'crorepati', 'ameer', 'garib', 'daulat',
  'mehnat', 'sapna', 'safalta', 'kamyabi', 'himmat', 'junoon', 'sabar', 'vishwas',
]);

function cleanWord(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Splits words into clean, balanced chunks based on target chunk size
 */
function splitWordsBalanced(words: string[], maxChunkSize: number = 3): string[][] {
  const n = words.length;
  if (n <= maxChunkSize) return [words];

  const chunks: string[][] = [];
  let i = 0;
  while (i < n) {
    const remaining = n - i;
    if (remaining <= maxChunkSize) {
      chunks.push(words.slice(i, n));
      break;
    } else {
      chunks.push(words.slice(i, i + maxChunkSize));
      i += maxChunkSize;
    }
  }
  return chunks;
}

export function planTypographyVideo(input: TypographyPlanInput): TypographyPlan {
  const { words, segments, durationSeconds, typographyStyle = 'dynamic-punch' } = input;
  const phrases: KineticPhrase[] = [];

  // Load blueprint if reverse-engineered
  const blueprint = getAdvancedStyleBlueprint(typographyStyle);

  // Determine optimal chunk size based on style blueprint or personality
  let maxWordsPerChunk = blueprint?.pacingAndRhythm?.targetWordsPerPhrase || 3;
  if (!blueprint) {
    if (typographyStyle === 'silver-chrome') {
      maxWordsPerChunk = 2; // Fast, 1-2 word rapid beats
    } else if (typographyStyle === 'dubai-gold' || typographyStyle === 'paper-ii') {
      maxWordsPerChunk = 4; // 4-tier stack or lead+hero+sub
    } else if (typographyStyle === 'royal-emerald') {
      maxWordsPerChunk = 5; // Hook word + full context subtitle
    } else if (typographyStyle === 'platinum-penthouse') {
      maxWordsPerChunk = 3; // Step words + hero punch
    }
  }

  // 1. Group words (or segments) into non-overlapping kinetic blocks
  let rawBlocks: Array<{ text: string; start: number; end: number }> = [];

  if (words && words.length > 0) {
    const wordStrings = words.map((w) => w.word);
    const chunks = splitWordsBalanced(wordStrings, maxWordsPerChunk);

    let wordIdx = 0;
    for (const chunk of chunks) {
      const chunkWords = words.slice(wordIdx, wordIdx + chunk.length);
      wordIdx += chunk.length;
      if (chunkWords.length === 0) continue;

      const text = chunkWords.map((w) => w.word).join(' ');
      const start = chunkWords[0].start;
      const end = chunkWords[chunkWords.length - 1].end;
      rawBlocks.push({ text, start, end: Math.min(durationSeconds, end) });
    }
  } else if (segments && segments.length > 0) {
    for (const seg of segments) {
      if (seg.start >= durationSeconds) break;
      const cleanSegText = seg.text.trim();
      if (!cleanSegText) continue;

      const segWords = cleanSegText.split(/\s+/).filter(Boolean);
      const chunks = splitWordsBalanced(segWords, maxWordsPerChunk);

      const totalWords = segWords.length;
      let wordCursor = 0;

      for (const chunk of chunks) {
        const chunkText = chunk.join(' ');
        const chunkStart = seg.start + (wordCursor / totalWords) * (seg.end - seg.start);
        wordCursor += chunk.length;
        const chunkEnd = seg.start + (wordCursor / totalWords) * (seg.end - seg.start);

        rawBlocks.push({
          text: chunkText,
          start: chunkStart,
          end: Math.min(durationSeconds, chunkEnd),
        });
      }
    }
  }

  // Fallback if audio/transcript is empty
  if (rawBlocks.length === 0) {
    rawBlocks = [
      { text: 'Walking into new territory', start: 0.5, end: 3.5 },
      { text: 'Not everyone will clap when you grow', start: 3.8, end: 7.2 },
      { text: 'Slow down to be taken seriously', start: 7.5, end: 11.5 },
    ];
  }

  // 2. Transform each block into a structured phrase based on the selected style
  rawBlocks.forEach((block, idx) => {
    const rawWords = block.text.trim().split(/\s+/).filter(Boolean);
    if (rawWords.length === 0) return;

    let leadText = '';
    let heroText = '';
    let subText = '';
    let extraText = '';
    let hookWord = '';
    let subtitleText = '';
    let stepWords: string[] = [];
    let icon: KineticPhrase['icon'] = 'none';

    // Style-specific content parsing
    if (typographyStyle === 'dynamic-punch') {
      const fullText = rawWords.join(' ');
      const isShock = /^(not|don't|dont|never|stop|wrong|no)$/i.test(fullText.trim());
      const numIdx = rawWords.findIndex((w) => /^\d+(\+|k|m|x)?$/i.test(w) || /^\$\d+/i.test(w));

      if (isShock) {
        heroText = fullText.toUpperCase();
      } else if (numIdx !== -1) {
        heroText = rawWords[numIdx];
        const remaining = rawWords.filter((_, i) => i !== numIdx);
        if (remaining.length > 0) {
          subText = remaining.join(' ');
        }
      } else if (rawWords.length === 1) {
        heroText = rawWords[0];
      } else if (rawWords.length === 2) {
        leadText = rawWords[0];
        heroText = rawWords[1];
      } else if (rawWords.length === 3) {
        if (rawWords[0].length <= 6 && rawWords[2].length <= 5) {
          leadText = rawWords[0];
          heroText = rawWords[1];
          subText = rawWords[2];
        } else {
          leadText = rawWords[0];
          heroText = rawWords.slice(1).join(' ');
        }
      } else {
        leadText = rawWords.slice(0, 2).join(' ');
        heroText = rawWords.slice(2, 4).join(' ');
        if (rawWords.length > 4) {
          subText = rawWords.slice(4).join(' ');
        }
      }
    } else if (typographyStyle === 'dubai-gold') {
      // Natural casing, architectural lead + 3D gold hero
      const powerIndices = rawWords
        .map((w, i) => (POWER_WORDS.has(cleanWord(w)) || /^\d+/i.test(w) ? i : -1))
        .filter((i) => i !== -1);

      if (rawWords.length === 1) {
        heroText = rawWords[0];
      } else if (powerIndices.length > 0) {
        const pIdx = powerIndices[0];
        if (pIdx > 0) {
          leadText = rawWords.slice(0, pIdx).join(' ');
          heroText = rawWords.slice(pIdx, Math.min(rawWords.length, pIdx + 2)).join(' ');
          if (pIdx + 2 < rawWords.length) {
            subText = rawWords.slice(pIdx + 2).join(' ');
          }
        } else {
          heroText = rawWords.slice(0, Math.min(rawWords.length, 2)).join(' ');
          if (rawWords.length > 2) {
            subText = rawWords.slice(2).join(' ');
          }
        }
      } else if (rawWords.length <= 3) {
        leadText = rawWords[0];
        heroText = rawWords.slice(1).join(' ');
      } else {
        leadText = rawWords.slice(0, 2).join(' ');
        heroText = rawWords.slice(2).join(' ');
      }
    } else if (typographyStyle === 'paper-ii') {
      // 4-tier stack
      if (rawWords.length === 1) {
        heroText = rawWords[0].toUpperCase();
      } else if (rawWords.length === 2) {
        leadText = rawWords[0];
        heroText = rawWords[1].toUpperCase();
      } else if (rawWords.length === 3) {
        leadText = rawWords[0];
        heroText = rawWords[1].toUpperCase();
        subText = rawWords[2];
      } else {
        leadText = rawWords[0];
        heroText = rawWords[1].toUpperCase();
        subText = rawWords[2];
        extraText = rawWords.slice(3).join(' ').toUpperCase();
      }
    } else if (typographyStyle === 'royal-emerald') {
      // Keynote hook word + lower subtitle line
      const powerIdx = rawWords.findIndex((w) => POWER_WORDS.has(cleanWord(w)));
      if (powerIdx !== -1) {
        hookWord = rawWords[powerIdx].toUpperCase();
        subtitleText = rawWords.filter((_, i) => i !== powerIdx).join(' ');
      } else {
        hookWord = rawWords[0].toUpperCase();
        subtitleText = rawWords.slice(1).join(' ');
      }
      heroText = hookWord;
    } else if (typographyStyle === 'platinum-penthouse') {
      // Vertical step reveals
      if (rawWords.length > 1) {
        stepWords = rawWords.slice(0, rawWords.length - 1);
        heroText = rawWords[rawWords.length - 1].toUpperCase();
      } else {
        heroText = rawWords[0].toUpperCase();
      }
    } else if (typographyStyle === 'silver-chrome') {
      // 1-2 rapid punch beats
      if (rawWords.length === 1) {
        heroText = rawWords[0].toUpperCase();
      } else {
        leadText = rawWords[0].toUpperCase();
        heroText = rawWords.slice(1).join(' ').toUpperCase();
      }
    } else {
      // General 2-level hierarchy: lead connector + hero keyword
      const powerIndices = rawWords
        .map((w, i) => (POWER_WORDS.has(cleanWord(w)) ? i : -1))
        .filter((i) => i !== -1);

      if (rawWords.length === 1) {
        heroText = rawWords[0].toUpperCase();
      } else if (rawWords.length === 2) {
        leadText = rawWords[0];
        heroText = rawWords[1].toUpperCase();
      } else if (powerIndices.length > 0) {
        const pIdx = powerIndices[0];
        leadText = rawWords.slice(0, pIdx).join(' ');
        heroText = rawWords.slice(pIdx, Math.min(rawWords.length, pIdx + 2)).join(' ').toUpperCase();
        if (pIdx + 2 < rawWords.length) {
          subText = rawWords.slice(pIdx + 2).join(' ');
        }
      } else {
        const mid = Math.max(1, Math.floor(rawWords.length / 2));
        leadText = rawWords.slice(0, mid).join(' ');
        heroText = rawWords.slice(mid).join(' ').toUpperCase();
      }
    }

    // Attach contextual icons
    const blockLower = block.text.toLowerCase();
    if (blockLower.includes('slow') || blockLower.includes('speed') || blockLower.includes('rush') || blockLower.includes('fast')) {
      icon = 'speedometer';
    } else if (blockLower.includes('clap') || blockLower.includes('grow') || blockLower.includes('star') || blockLower.includes('win')) {
      icon = 'star';
    } else if (blockLower.includes('right') || blockLower.includes('yes') || blockLower.includes('true') || blockLower.includes('correct')) {
      icon = 'checkmark';
    } else if (blockLower.includes('questions') || blockLower.includes('new') || blockLower.includes('territory') || blockLower.includes('secret')) {
      icon = 'sparkle';
    }

    // Ensure seamless timeline without any overlapping
    const nextStart = idx < rawBlocks.length - 1 ? rawBlocks[idx + 1].start : durationSeconds;
    const start = block.start;
    const rawDuration = block.end - block.start;
    const targetDuration = Math.max(0.8, rawDuration + 0.1);
    const end = Math.min(nextStart, Math.min(durationSeconds, start + targetDuration));

    // Detect semantic composition highlight type
    let highlightType: string = 'emphasis';
    const fullBlock = block.text.trim();

    if (fullBlock.endsWith('?') || /^(what|why|how|when|who|where|kya|kyun|kaise)\b/i.test(fullBlock)) {
      highlightType = 'question';
    } else if (/\b(\d+|[$€₹%]\d+|\d+k|\d+m|\d+b|\d+x|\d+\s*(percent|cr|lakh|days|years|million|billion))\b/i.test(fullBlock)) {
      highlightType = 'metric';
    } else if (/\b(comment|follow|subscribe|share|link in bio|dm me|save this|visit|sign up|join now|download)\b/i.test(fullBlock)) {
      highlightType = 'cta';
    } else if (/\b(first|second|third|step \w+|rule \w+|mistake|mistakes|attention|stop|wait|warning|truth|secret|fact)\b/i.test(fullBlock)) {
      highlightType = 'tape-badge';
    }

    phrases.push({
      id: `kinetic-${idx}-${start.toFixed(2)}`,
      leadText,
      heroText,
      subText,
      extraText,
      hookWord,
      subtitleText,
      stepWords,
      start,
      end,
      position: 'center',
      size: rawWords.length === 1 && !leadText && !subText ? 'compact' : 'large',
      icon,
      word: `${leadText} ${heroText} ${subText}`.trim(),
      emphasis: 'headline',
      highlightType: highlightType as any,
    });
  });

  const soundCues = generateTypographySoundCues(phrases, typographyStyle, durationSeconds);

  return {
    keywords: phrases,
    soundCues,
    source: 'deterministic',
  };
}

/**
 * Generates style-synchronized SFX hits for each kinetic phrase entrance
 */
function generateTypographySoundCues(
  phrases: KineticPhrase[],
  style: string,
  durationSeconds: number
): PremiumSoundCue[] {
  const cues: PremiumSoundCue[] = [];
  const hitPool: PremiumSoundCueType[] = ['whoosh', 'pop-medium', 'hit-soft', 'swipe', 'pop-strong'];

  phrases.forEach((p, idx) => {
    const time = Math.max(0, p.start);
    if (time >= durationSeconds - 0.1) return;

    // Avoid stacking cues closer than 0.22s
    if (cues.some((c) => Math.abs((c.time ?? 0) - time) < 0.22)) return;

    let type: PremiumSoundCueType = 'pop-medium';
    let volume = 0.14;

    const heroLower = (p.heroText || p.word || '').toLowerCase();
    const isShock = /^(not|don't|dont|never|stop|wrong|no)$/i.test(heroLower.trim());

    if (isShock) {
      type = 'hit-strong';
      volume = 0.18;
    } else if (p.highlightType === 'metric' || /^\d+/i.test(heroLower)) {
      type = 'ding';
      volume = 0.15;
    } else if (p.highlightType === 'cta') {
      type = 'chime';
      volume = 0.14;
    } else if (style === 'dubai-gold') {
      const goldPool: PremiumSoundCueType[] = ['chime', 'whoosh', 'hit-soft', 'ding', 'swipe'];
      type = goldPool[idx % goldPool.length];
      volume = 0.15;
    } else if (style === 'paper-ii') {
      type = idx % 2 === 0 ? 'paper' : 'page-flip';
      volume = 0.16;
    } else if (style === 'cyber-hud') {
      type = idx % 2 === 0 ? 'data-scan' : 'data-pulse';
      volume = 0.15;
    } else if (style === 'silver-chrome') {
      type = idx % 2 === 0 ? 'whoosh' : 'hit-soft';
      volume = 0.16;
    } else if (style === 'dynamic-punch') {
      type = hitPool[idx % hitPool.length];
      volume = 0.15;
    } else {
      type = idx % 2 === 0 ? 'soft-pop' : 'whoosh';
      volume = 0.14;
    }

    const pans: Array<-0.5 | 0 | 0.5> = [-0.5, 0, 0.5, 0];
    const pan = pans[idx % pans.length];

    cues.push({
      time,
      type,
      volume,
      ducking: true,
      pan,
    });
  });

  return cues;
}
