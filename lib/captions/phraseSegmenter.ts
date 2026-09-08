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
