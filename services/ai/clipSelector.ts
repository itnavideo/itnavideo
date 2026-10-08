/**
 * Clip Selector — Deterministic high-energy segment picker for Long Video Clips.
 *
 * Picks the best N non-overlapping segments from a transcript by scoring
 * each segment based on:
 *   1. Word density (rapid speech = engaging)
 *   2. Keyword presence (questions, numbers, strong verbs, calls-to-action)
 *   3. Sentence completeness (start/end on sentence boundaries)
 *   4. Position diversity (spread across the video, not clustered)
 *
 * No AI/LLM required — fully deterministic.
 */

export type HookStrategy = 'auto' | 'high-energy' | 'actionable' | 'story';

export type ClipSegment = {
  index: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  text: string;
  score: number;
  viralityScore: number;
  viralityGrade: 'A+' | 'A' | 'B+' | 'B';
  title: string;
  hookText: string;
  headline: string;
  whyItWorks: string;
};

export type TranscriptWord = {
  word: string;
  start: number;
  end: number;
};

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type ClipSelectorInput = {
  /** Full transcript text */
  transcript?: string;
  /** Word-level timestamps from Groq */
  words: TranscriptWord[];
  /** Segment-level timestamps */
  segments?: TranscriptSegment[];
  /** Total duration of the source video in seconds */
  totalDurationSeconds: number;
  /** Desired clip duration in seconds or range option */
  clipDurationSeconds?: number;
  clipDurationOption?: 'auto' | 'under-30' | '30-60' | '60-90' | string;
  /** Number of clips to pick */
  clipCount: number;
  /** AI Viral Hook Strategy */
  hookStrategy?: HookStrategy;
};

// Keywords grouped by strategy
const HIGH_ENERGY_KEYWORDS = [
  'why', 'what', 'stop', 'never', 'secret', 'crazy', 'insane', 'truth', 'danger',
  'unbelievable', 'shocking', 'listen', 'watch', 'biggest', 'worst', 'powerful', 'now',
  'fast', 'explode', 'gamechanger', 'urgent',
];

const ACTIONABLE_KEYWORDS = [
  'how', 'strategy', 'framework', 'step', 'tip', 'trick', 'hack', 'guide', 'solution',
  'rule', 'formula', 'method', 'system', 'build', 'create', 'increase', 'percent',
  'number', 'million', 'thousand', 'result', 'money', 'free', 'cost',
];

const STORY_KEYWORDS = [
  'imagine', 'remember', 'believe', 'thought', 'realized', 'story', 'journey', 'life',
  'moment', 'happened', 'struggle', 'failed', 'lesson', 'discovered', 'actually',
  'changed', 'experience', 'personally', 'years', 'feeling',
];

// General engagement keywords
const ENGAGEMENT_KEYWORDS = [
  ...HIGH_ENERGY_KEYWORDS,
  ...ACTIONABLE_KEYWORDS,
  ...STORY_KEYWORDS,
];

const SENTENCE_ENDERS = new Set(['.', '!', '?', '।', '۔']);

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateHeadlineAndTitle(
  text: string,
  words: TranscriptWord[],
  strategy: HookStrategy = 'high-energy'
): { title: string; hookText: string; headline: string } {
  const cleanedText = text.replace(/[\r\n]+/g, ' ').trim();
  const firstSentenceMatch = cleanedText.match(/[^.!?।۔]+[.!?।۔]?/);
  const rawFirstSentence = firstSentenceMatch ? firstSentenceMatch[0].trim() : cleanedText;

  // Build hook text from opening sentence or first 12 words
  const hookWords = rawFirstSentence.split(/\s+/).slice(0, 12);
  const hookText = hookWords.join(' ');

  // Build headline (max 7 punchy words)
  const headlineWords = hookWords.slice(0, 7).join(' ').replace(/[,;:.!?]/g, '');
  const emoji = strategy === 'high-energy' ? '🔥' : strategy === 'actionable' ? '💡' : '✨';
  const headline = headlineWords ? `${headlineWords.toUpperCase()} ${emoji}` : `VIRAL CLIP ${emoji}`;

  // Title for display
  const title = hookText.length > 55 ? `${hookText.slice(0, 52)}...` : hookText || 'Viral Highlight';

  return { title, hookText, headline };
}

function calculateViralityGrade(score: number): {
  viralityScore: number;
  viralityGrade: 'A+' | 'A' | 'B+' | 'B';
  whyItWorks: string;
} {
  // Score is usually between 20 and 85 -> normalize smoothly to 65 - 98
  const normalized = Math.min(99, Math.max(60, Math.round(55 + (score / 85) * 44)));

  let grade: 'A+' | 'A' | 'B+' | 'B' = 'B';
  let whyItWorks = 'Solid clip with clear spoken delivery and consistent flow.';

  if (normalized >= 92) {
    grade = 'A+';
    whyItWorks = 'Exceptional viral hook with high word density, strong emotional triggers, and rapid retention pace.';
  } else if (normalized >= 84) {
    grade = 'A';
    whyItWorks = 'Strong opening hook and high speech density; ideal for viewer retention on Reels and Shorts.';
  } else if (normalized >= 75) {
    grade = 'B+';
    whyItWorks = 'Engaging spoken segment containing actionable insights or key storytelling points.';
  }

  return { viralityScore: normalized, viralityGrade: grade, whyItWorks };
}

/**
 * Selects the best N non-overlapping clips from a long video transcript.
 */
export function selectBestClips(input: ClipSelectorInput): ClipSegment[] {
  const {
    words = [],
    segments = [],
    totalDurationSeconds = 0,
    clipDurationSeconds = 30,
    clipCount = 3,
    hookStrategy = 'high-energy',
  } = input;

  // Parse duration option
  const rawOption = String(input.clipDurationOption || input.clipDurationSeconds || 'auto');
  let targetDuration = 45;
  let minAllowedDur = 12;
  let maxAllowedDur = 85;

  if (rawOption === 'under-30' || rawOption === '15') {
    targetDuration = 20;
    minAllowedDur = 10;
    maxAllowedDur = 30;
  } else if (rawOption === '30-60' || rawOption === '30') {
    targetDuration = 45;
    minAllowedDur = 30;
    maxAllowedDur = 60;
  } else if (rawOption === '60-90' || rawOption === '60') {
    targetDuration = 75;
    minAllowedDur = 60;
    maxAllowedDur = 90;
  }

  if (!words.length && !segments.length) return [];
  if (totalDurationSeconds < minAllowedDur) return [];

  // Build candidate windows sliding across the video
  const stepSeconds = Math.max(5, targetDuration / 3);
  const candidates: Array<{
    startSeconds: number;
    endSeconds: number;
    words: TranscriptWord[];
    text: string;
    score: number;
  }> = [];

  const maxStart = totalDurationSeconds - targetDuration;
  for (let start = 0; start <= maxStart; start += stepSeconds) {
    const end = start + targetDuration;
    const windowWords = words.filter((w) => w.start >= start && w.end <= end);
    const windowText = windowWords.map((w) => w.word).join(' ');

    if (windowWords.length < 5) continue; // Skip near-silent windows

    const score = scoreWindow(windowWords, windowText, start, end, totalDurationSeconds, hookStrategy);
    candidates.push({ startSeconds: start, endSeconds: end, words: windowWords, text: windowText, score });
  }

  // Determine effective target clip count
  let effectiveClipCount = clipCount;
  if (!effectiveClipCount || effectiveClipCount <= 0) {
    if (totalDurationSeconds <= 180) effectiveClipCount = 1;       // < 3 mins -> 1 clip
    else if (totalDurationSeconds <= 600) effectiveClipCount = 3;  // 3-10 mins -> 3 clips
    else if (totalDurationSeconds <= 1800) effectiveClipCount = 5; // 10-30 mins -> 5 clips
    else effectiveClipCount = 8;                                   // > 30 mins -> 8 clips
  }

  if (!candidates.length) {
    // Fallback: evenly spaced clips
    return buildEvenlySpacedClips(totalDurationSeconds, targetDuration, effectiveClipCount, words, [], hookStrategy);
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Greedy pick: take top-scored clips that don't overlap
  const selected: ClipSegment[] = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  for (const candidate of candidates) {
    if (selected.length >= effectiveClipCount) break;

    // Check overlap with already-selected clips (require at least 3s gap)
    const overlaps = usedRanges.some(
      (r) => candidate.startSeconds < r.end + 3 && candidate.endSeconds > r.start - 3
    );
    if (overlaps) continue;

    // Snap to sentence boundary if possible
    const snapped = snapToSentenceBoundary(
      candidate.startSeconds,
      candidate.endSeconds,
      words,
      targetDuration,
      minAllowedDur,
      maxAllowedDur
    );
    const finalText = snapped.text || candidate.text;
    const { title, hookText, headline } = generateHeadlineAndTitle(finalText, words, hookStrategy);
    const { viralityScore, viralityGrade, whyItWorks } = calculateViralityGrade(candidate.score);

    selected.push({
      index: selected.length,
      startSeconds: Math.max(0, snapped.start),
      endSeconds: Math.min(totalDurationSeconds, snapped.end),
      durationSeconds: snapped.end - snapped.start,
      text: finalText,
      score: candidate.score,
      viralityScore,
      viralityGrade,
      title,
      hookText,
      headline,
      whyItWorks,
    });
    usedRanges.push({ start: snapped.start, end: snapped.end });
  }

  // If we couldn't find enough non-overlapping clips, fill with evenly spaced
  if (selected.length < effectiveClipCount) {
    const remaining = effectiveClipCount - selected.length;
    const fallback = buildEvenlySpacedClips(
      totalDurationSeconds,
      clipDurationSeconds,
      remaining,
      words,
      usedRanges,
      hookStrategy
    );
    for (const clip of fallback) {
      if (selected.length >= effectiveClipCount) break;
      selected.push({ ...clip, index: selected.length });
    }
  }

  // Sort final clips by position in video
  selected.sort((a, b) => a.startSeconds - b.startSeconds);
  selected.forEach((clip, i) => {
    clip.index = i;
  });

  return selected;
}

function scoreWindow(
  windowWords: TranscriptWord[],
  text: string,
  start: number,
  end: number,
  totalDuration: number,
  strategy: HookStrategy = 'high-energy'
): number {
  let score = 0;
  const duration = Math.max(1, end - start);

  // 1. Word density (words per second) — more speech = more engaging
  const wordsPerSecond = windowWords.length / duration;
  const densityWeight = strategy === 'high-energy' ? 12 : 9;
  score += Math.min(wordsPerSecond * densityWeight, 36);

  // 2. Keyword presence tailored by strategy
  const lowerText = text.toLowerCase();
  let keywordHits = 0;

  let priorityKeywords = HIGH_ENERGY_KEYWORDS;
  if (strategy === 'actionable') {
    priorityKeywords = ACTIONABLE_KEYWORDS;
  } else if (strategy === 'story') {
    priorityKeywords = STORY_KEYWORDS;
  } else if (strategy === 'auto') {
    // Auto mode evaluates ALL hook types: Energy, Actionable, Story & Viral triggers
    priorityKeywords = [...HIGH_ENERGY_KEYWORDS, ...ACTIONABLE_KEYWORDS, ...STORY_KEYWORDS];
  }

  for (const kw of priorityKeywords) {
    if (lowerText.includes(kw)) keywordHits += 1.5;
  }
  for (const kw of ENGAGEMENT_KEYWORDS) {
    if (lowerText.includes(kw)) keywordHits += 0.5;
  }
  score += Math.min(keywordHits * 3, 30);

  // 3. Numbers & stats (vital for actionable advice)
  const numberMatches = text.match(/\d+/g);
  if (numberMatches) {
    const numBonus = strategy === 'actionable' ? 6 : 4;
    score += Math.min(numberMatches.length * numBonus, 14);
  }

  // 4. Question & exclamation detection (hooks)
  const questionCount = (text.match(/\?/g) || []).length;
  const exclamationCount = (text.match(/!/g) || []).length;
  score += Math.min(questionCount * 5 + exclamationCount * 3, 12);

  // 5. Position diversity bonus — preference for opening (hook) and middle
  const positionRatio = totalDuration > 0 ? start / totalDuration : 0;
  if (positionRatio < 0.15) score += 8; // Opening hook
  else if (positionRatio > 0.3 && positionRatio < 0.7) score += 4; // Middle content

  // 6. Sentence completeness (starts with capital after sentence-ender)
  const firstWord = windowWords[0]?.word || '';
  if (firstWord[0] === firstWord[0]?.toUpperCase() && /^[A-Z]/.test(firstWord)) score += 5;

  return score;
}

function snapToSentenceBoundary(
  start: number,
  end: number,
  allWords: TranscriptWord[],
  targetDurationSeconds: number,
  minAllowedDuration: number = 10,
  maxAllowedDuration: number = 90
): { start: number; end: number; text: string } {
  let bestStart = start;
  const searchRadius = 4; // seconds to search for opening sentence start

  // 1. Find the best sentence start near candidate start
  for (let i = 0; i < allWords.length; i++) {
    const w = allWords[i];
    if (w.start < start - searchRadius) continue;
    if (w.start > start + searchRadius) break;

    if (i > 0) {
      const prevWord = allWords[i - 1].word;
      const lastChar = prevWord[prevWord.length - 1];
      if (SENTENCE_ENDERS.has(lastChar)) {
        bestStart = w.start;
        break;
      }
    }
  }

  // 2. Flexible duration range based on user target preference:
  const minDuration = Math.max(8, minAllowedDuration);
  const maxDuration = Math.min(120, maxAllowedDuration);

  const idealEnd = bestStart + targetDurationSeconds;
  let bestEnd = Math.min(allWords[allWords.length - 1]?.end || idealEnd, bestStart + maxDuration);
  let minDiff = Infinity;

  // Look for sentence enders in [bestStart + minDuration, bestStart + maxDuration]
  for (let i = 0; i < allWords.length; i++) {
    const w = allWords[i];
    if (w.end < bestStart + minDuration) continue;
    if (w.end > bestStart + maxDuration) break;

    const lastChar = w.word[w.word.length - 1];
    if (SENTENCE_ENDERS.has(lastChar)) {
      const diff = Math.abs(w.end - idealEnd);
      if (diff < minDiff) {
        minDiff = diff;
        bestEnd = w.end;
      }
    }
  }

  // If no sentence ender found, search for natural pause (>0.35s gap between words)
  if (minDiff === Infinity) {
    for (let i = 0; i < allWords.length - 1; i++) {
      const w1 = allWords[i];
      const w2 = allWords[i + 1];
      if (w1.end < bestStart + minDuration) continue;
      if (w1.end > bestStart + maxDuration) break;

      const gap = w2.start - w1.end;
      if (gap >= 0.35) {
        const diff = Math.abs(w1.end - idealEnd);
        if (diff < minDiff) {
          minDiff = diff;
          bestEnd = w1.end;
        }
      }
    }
  }

  const clippedWords = allWords.filter((w) => w.start >= bestStart && w.end <= bestEnd);
  const text = clippedWords.map((w) => w.word).join(' ');

  return { start: bestStart, end: bestEnd, text };
}

function buildEvenlySpacedClips(
  totalDuration: number,
  clipDuration: number,
  count: number,
  words: TranscriptWord[],
  excludeRanges: Array<{ start: number; end: number }> = [],
  strategy: HookStrategy = 'high-energy'
): ClipSegment[] {
  const clips: ClipSegment[] = [];
  const safeTotalDuration = Math.max(clipDuration, totalDuration || clipDuration);
  const spacing = safeTotalDuration / (count + 1);

  for (let i = 0; i < count; i++) {
    const center = spacing * (i + 1);
    let start = Math.max(0, center - clipDuration / 2);
    const end = Math.min(safeTotalDuration, start + clipDuration);
    start = Math.max(0, end - clipDuration);

    // Skip if overlaps with excluded ranges
    const overlaps = excludeRanges.some((r) => start < r.end + 3 && end > r.start - 3);
    if (overlaps) continue;

    const windowWords = words.filter((w) => w.start >= start && w.end <= end);
    const text = windowWords.map((w) => w.word).join(' ');
    const { title, hookText, headline } = generateHeadlineAndTitle(text, windowWords, strategy);
    const { viralityScore, viralityGrade, whyItWorks } = calculateViralityGrade(40);

    clips.push({
      index: clips.length,
      startSeconds: start,
      endSeconds: end,
      durationSeconds: end - start,
      text,
      score: 40,
      viralityScore,
      viralityGrade,
      title,
      hookText,
      headline,
      whyItWorks,
    });
  }

  return clips;
}
