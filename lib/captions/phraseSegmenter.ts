// lib/captions/phraseSegmenter.ts
// Intelligent semantic clause segmentation & speech cadence chunking

import type { TranscriptWordItem } from './types';

export interface RawPhraseSegment {
  id: string;
  text: string;
  start: number;
  end: number;
  duration: number;
  words: TranscriptWordItem[];
  hasMajorPunctuation: boolean;
  pauseAfterSeconds: number;
}

const STRONG_PUNCTUATION = /[.!?]/;
const WEAK_PUNCTUATION = /[,:;—–-]/;

// Prepositions, articles, and conjunctions that should not be isolated at line ends
const TRAILING_DISCOURAGED = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'over', 'after', 'and', 'but',
  'or', 'so', 'because', 'as', 'if', 'when', 'than', 'that', 'this',
  'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'par', 'aur', 'ya', 'to', 'bhi'
]);

/**
 * Refines multi-word text exceeding maxCharsPerLine (default 42) into clean 2-line widescreen subtitles
 * breaking strictly at punctuation marks (commas, periods, dashes) or natural grammatical pauses.
 */
export function formatPunctuationAwareLineBreaks(
  text: string,
  maxCharsPerLine = 42
): string {
  const trimmed = String(text || '').trim();
  if (trimmed.length <= maxCharsPerLine) return trimmed;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return trimmed;

  // Search for ideal break point near middle of text that aligns with punctuation
  const totalLen = trimmed.length;
  const targetSplitIndex = Math.floor(totalLen / 2);

  let bestSplitWordIndex = -1;
  let bestScore = -Infinity;

  let currentLen = 0;
  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i];
    currentLen += word.length + 1; // including space

    const distanceFromMid = Math.abs(currentLen - targetSplitIndex);
    let punctuationBonus = 0;

    if (/[.!?]/.test(word)) {
      punctuationBonus = 50;
    } else if (/[,:;—–-]/.test(word)) {
      punctuationBonus = 35;
    }

    const cleanWord = word.toLowerCase().replace(/[^\w\d]/g, '');
    if (TRAILING_DISCOURAGED.has(cleanWord)) {
      punctuationBonus -= 15; // penalize splitting right after dangling preposition
    }

    // Score evaluates closeness to midpoint + punctuation bonus
    const score = 100 - distanceFromMid + punctuationBonus;
    if (score > bestScore) {
      bestScore = score;
      bestSplitWordIndex = i;
    }
  }

  if (bestSplitWordIndex !== -1) {
    const line1 = words.slice(0, bestSplitWordIndex + 1).join(' ');
    const line2 = words.slice(bestSplitWordIndex + 1).join(' ');
    return `${line1}\n${line2}`;
  }

  return trimmed;
}

/**
 * Segments an aligned stream of transcript words into natural, rhythm-balanced phrases.
 */
export function segmentTranscriptIntoPhrases(
  words: TranscriptWordItem[],
  options: {
    minWordsPerPhrase?: number;
    maxWordsPerPhrase?: number;
    maxDurationSeconds?: number;
    pauseThresholdSeconds?: number;
  } = {}
): RawPhraseSegment[] {
  if (!words || words.length === 0) return [];

  const minWords = options.minWordsPerPhrase ?? 2;
  const maxWords = options.maxWordsPerPhrase ?? 5;
  const maxDuration = options.maxDurationSeconds ?? 2.2;
  const pauseThreshold = options.pauseThresholdSeconds ?? 0.32;

  const phrases: RawPhraseSegment[] = [];
  let currentWords: TranscriptWordItem[] = [];

  const flushPhrase = () => {
    if (currentWords.length === 0) return;

    const start = currentWords[0].start;
    const end = currentWords[currentWords.length - 1].end;
    const text = currentWords.map((w) => w.word).join(' ');
    const lastWord = currentWords[currentWords.length - 1].word;
    const hasMajorPunctuation = STRONG_PUNCTUATION.test(lastWord);

    phrases.push({
      id: `phrase-${phrases.length + 1}-${Date.now()}`,
      text,
      start: Number(start.toFixed(3)),
      end: Number(end.toFixed(3)),
      duration: Number((end - start).toFixed(3)),
      words: [...currentWords],
      hasMajorPunctuation,
      pauseAfterSeconds: 0,
    });

    currentWords = [];
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];
    currentWords.push(word);

    const wordCount = currentWords.length;
    const phraseDuration = word.end - currentWords[0].start;
    const pauseToNext = nextWord ? Math.max(0, nextWord.start - word.end) : 0;

    const hasStrongBreak = STRONG_PUNCTUATION.test(word.word);
    const hasWeakBreak = WEAK_PUNCTUATION.test(word.word);
    const isCleanWord = word.word.toLowerCase().replace(/[^\w\d]/g, '');
    const isTrailingDiscouraged = TRAILING_DISCOURAGED.has(isCleanWord);

    // Rule 1: Natural end of sentence / strong punctuation
    if (hasStrongBreak && wordCount >= minWords) {
      flushPhrase();
      if (phrases.length > 0) {
        phrases[phrases.length - 1].pauseAfterSeconds = pauseToNext;
      }
      continue;
    }

    // Rule 2: Significant speech pause (silence between spoken words)
    if (pauseToNext >= pauseThreshold && wordCount >= minWords) {
      flushPhrase();
      if (phrases.length > 0) {
        phrases[phrases.length - 1].pauseAfterSeconds = pauseToNext;
      }
      continue;
    }

    // Rule 3: Weak punctuation (commas, dashes) if we have enough words
    if (hasWeakBreak && wordCount >= 3) {
      flushPhrase();
      if (phrases.length > 0) {
        phrases[phrases.length - 1].pauseAfterSeconds = pauseToNext;
      }
      continue;
    }

    // Rule 4: Reached max word threshold or max duration, unless word is a dangling preposition
    if ((wordCount >= maxWords || phraseDuration >= maxDuration) && !isTrailingDiscouraged) {
      flushPhrase();
      if (phrases.length > 0) {
        phrases[phrases.length - 1].pauseAfterSeconds = pauseToNext;
      }
      continue;
    }

    // Rule 5: Hard limit safeguard (prevent runaways even on prepositions)
    if (wordCount >= maxWords + 2 || phraseDuration >= maxDuration + 0.8) {
      flushPhrase();
      if (phrases.length > 0) {
        phrases[phrases.length - 1].pauseAfterSeconds = pauseToNext;
      }
      continue;
    }
  }

  // Flush remaining words
  if (currentWords.length > 0) {
    flushPhrase();
  }

  // Post-processing: Merge any awkward 1-word orphan trailing phrase with previous phrase
  if (phrases.length >= 2) {
    const last = phrases[phrases.length - 1];
    const prev = phrases[phrases.length - 2];
    if (last.words.length === 1 && prev.words.length <= 4) {
      prev.words.push(...last.words);
      prev.text = prev.words.map((w) => w.word).join(' ');
      prev.end = last.end;
      prev.duration = prev.end - prev.start;
      phrases.pop();
    }
  }

  return phrases;
}
