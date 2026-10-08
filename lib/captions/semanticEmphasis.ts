// lib/captions/semanticEmphasis.ts
// Semantic Emphasis & NLP Hierarchy Engine for Motion Captions

import type { CaptionWordRole, CaptionPhraseType, SpeechSpeed, CaptionWordEvent } from './types';
import type { RawPhraseSegment } from './phraseSegmenter';

const HIGH_IMPACT_KEYWORDS = new Set([
  'money', 'million', 'billion', 'dollar', 'dollars', 'crore', 'lakh', 'rupees', 'free',
  'growth', 'power', 'powerful', 'secret', 'truth', 'insane', 'crazy', 'best', 'worst',
  'massive', 'huge', 'never', 'always', 'stop', 'start', 'win', 'lose', 'success', 'fail',
  'ultimate', 'game-changer', 'revolution', 'ai', 'video', 'future', 'fast', 'slow',
  'sabse', 'kabhi', 'zaroor', 'bada', 'paisa', 'shuru', 'khatam', 'asli', 'dum'
]);

const LOW_IMPACT_FUNCTION_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about',
  'into', 'over', 'after', 'and', 'but', 'or', 'so', 'if', 'that', 'this', 'these', 'those',
  'it', 'its', 'they', 'them', 'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'hai', 'hain', 'ho', 'tha', 'thi', 'the', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'par', 'aur', 'ya'
]);

function isNumberOrCurrency(str: string): boolean {
  return /[\d$%€£₹]/.test(str);
}

function cleanToken(str: string): string {
  return str.toLowerCase().replace(/[^\w\d]/g, '');
}

/**
 * Analyzes speech speed based on syllables/characters spoken per second.
 */
export function calculateSpeechSpeed(durationSeconds: number, charCount: number): SpeechSpeed {
  if (durationSeconds <= 0) return 'normal';
  const charsPerSecond = charCount / durationSeconds;
  if (charsPerSecond > 18) return 'fast';
  if (charsPerSecond < 9) return 'slow';
  return 'normal';
}

/**
 * Classifies phrase type from punctuation and position in narrative.
 */
export function classifyPhraseType(
  phrase: RawPhraseSegment,
  phraseIndex: number,
  totalPhrases: number
): CaptionPhraseType {
  const text = phrase.text.trim();
  if (text.endsWith('?')) return 'question';
  if (text.endsWith('!') || phrase.text.toUpperCase() === phrase.text && phrase.words.length <= 3) {
    return 'punchline';
  }
  if (phraseIndex === totalPhrases - 1 || phraseIndex >= totalPhrases - 2 && phrase.duration >= 2.0) {
    return 'climax';
  }
  if (!phrase.hasMajorPunctuation && phrase.pauseAfterSeconds < 0.2) {
    return 'continuation';
  }
  return 'statement';
}

/**
 * Analyzes word emphasis within a phrase and returns structured CaptionWordEvents.
 */
export function analyzePhraseWords(
  phrase: RawPhraseSegment,
  phraseType: CaptionPhraseType
): {
  words: CaptionWordEvent[];
  leadText: string;
  heroText: string;
  subText: string;
} {
  const rawWords = phrase.words;
  if (rawWords.length === 0) {
    return { words: [], leadText: '', heroText: '', subText: '' };
  }

  // Calculate base emphasis scores
  const scored = rawWords.map((w, idx) => {
    const rawWord = w.word;
    const clean = cleanToken(rawWord);
    let score = 0.5;

    // Numbers, currencies, metrics
    if (isNumberOrCurrency(rawWord)) {
      score += 0.45;
    }

    // High impact keywords
    if (HIGH_IMPACT_KEYWORDS.has(clean)) {
      score += 0.4;
    }

    // Low impact function words
    if (LOW_IMPACT_FUNCTION_WORDS.has(clean)) {
      score -= 0.35;
    }

    // Capitalized proper nouns / acronyms
    if (rawWord.length >= 2 && rawWord[0] === rawWord[0].toUpperCase() && !LOW_IMPACT_FUNCTION_WORDS.has(clean)) {
      score += 0.15;
    }

    // Word duration emphasis (spoken notably longer than usual)
    const wordDur = w.end - w.start;
    if (wordDur >= 0.45 && clean.length >= 4) {
      score += 0.2;
    }

    // Punctuation emphasis
    if (/[!?]/.test(rawWord)) {
      score += 0.25;
    }

    // Position bonus for final punch word in punchlines
    if ((phraseType === 'punchline' || phraseType === 'climax') && idx === rawWords.length - 1) {
      score += 0.3;
    }

    const clampedScore = Math.max(0.05, Math.min(1.0, Number(score.toFixed(2))));

    return {
      w,
      clean,
      score: clampedScore,
      idx,
    };
  });

  // Sort to identify primary hero word (highest score)
  const sortedScores = [...scored].sort((a, b) => b.score - a.score);
  const highestScore = sortedScores[0]?.score ?? 0.5;
  const heroIndex = sortedScores[0]?.idx ?? scored.length - 1;

  // Build CaptionWordEvents
  const words: CaptionWordEvent[] = scored.map((item) => {
    let role: CaptionWordRole = 'neutral';

    if (item.idx === heroIndex && item.score >= 0.55) {
      role = 'hero';
    } else if (item.score >= 0.65) {
      role = 'secondary';
    } else if (item.idx === 0 && item.score < 0.5) {
      role = 'lead';
    } else if (LOW_IMPACT_FUNCTION_WORDS.has(item.clean)) {
      role = 'neutral';
    } else {
      role = 'secondary';
    }

    return {
      id: item.w.id,
      word: item.w.word,
      cleanWord: item.clean,
      start: item.w.start,
      end: item.w.end,
      duration: Number((item.w.end - item.w.start).toFixed(3)),
      role,
      emphasisScore: item.score,
      isEdited: item.w.isEdited,
    };
  });

  // Staging text partitions
  let leadText = '';
  let heroText = '';
  let subText = '';

  if (heroIndex === 0) {
    heroText = rawWords[0].word;
    subText = rawWords.slice(1).map((w) => w.word).join(' ');
  } else if (heroIndex === rawWords.length - 1) {
    leadText = rawWords.slice(0, heroIndex).map((w) => w.word).join(' ');
    heroText = rawWords[heroIndex].word;
  } else {
    leadText = rawWords.slice(0, heroIndex).map((w) => w.word).join(' ');
    heroText = rawWords[heroIndex].word;
    subText = rawWords.slice(heroIndex + 1).map((w) => w.word).join(' ');
  }

  return { words, leadText, heroText, subText };
}
