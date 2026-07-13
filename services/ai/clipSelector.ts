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

export type ClipSegment = {
  index: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  text: string;
  score: number;
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

type ClipSelectorInput = {
  /** Full transcript text */
  transcript: string;
  /** Word-level timestamps from Groq */
  words: TranscriptWord[];
  /** Segment-level timestamps */
  segments: TranscriptSegment[];
  /** Total duration of the source video in seconds */
  totalDurationSeconds: number;
  /** Desired clip duration in seconds */
  clipDurationSeconds: number;
  /** Number of clips to pick */
  clipCount: number;
};

// Keywords that indicate engaging content
const ENGAGEMENT_KEYWORDS = [
  // Questions / hooks
  'why', 'how', 'what', 'when', 'where', 'who',
  'secret', 'mistake', 'never', 'always', 'important', 'actually',
  // Numbers & stats
  'percent', 'million', 'billion', 'thousand', 'number', 'first', 'second', 'third',
  // Strong verbs & CTA
  'stop', 'start', 'learn', 'watch', 'listen', 'remember', 'forget', 'imagine',
  'believe', 'think', 'know', 'understand', 'realize',
  // Emotional hooks
  'money', 'free', 'best', 'worst', 'biggest', 'problem', 'solution', 'truth',
  'hack', 'tip', 'trick', 'strategy', 'powerful', 'crazy', 'amazing',
];

const SENTENCE_ENDERS = new Set(['.', '!', '?']);

/**
 * Selects the best N non-overlapping clips from a long video transcript.
 */
export function selectBestClips(input: ClipSelectorInput): ClipSegment[] {
  const { words, segments, totalDurationSeconds, clipDurationSeconds, clipCount } = input;

  if (!words.length && !segments.length) return [];
  if (totalDurationSeconds < clipDurationSeconds) return [];

  // Build candidate windows sliding across the video
  const stepSeconds = Math.max(5, clipDurationSeconds / 3);
  const candidates: Array<{
    startSeconds: number;
    endSeconds: number;
    words: TranscriptWord[];
    text: string;
    score: number;
  }> = [];

  const maxStart = totalDurationSeconds - clipDurationSeconds;
  for (let start = 0; start <= maxStart; start += stepSeconds) {
    const end = start + clipDurationSeconds;
    const windowWords = words.filter((w) => w.start >= start && w.end <= end);
    const windowText = windowWords.map((w) => w.word).join(' ');

    if (windowWords.length < 5) continue; // Skip near-silent windows

    const score = scoreWindow(windowWords, windowText, start, end, totalDurationSeconds);
    candidates.push({ startSeconds: start, endSeconds: end, words: windowWords, text: windowText, score });
  }

  if (!candidates.length) {
    // Fallback: evenly spaced clips
    return buildEvenlySpacedClips(totalDurationSeconds, clipDurationSeconds, clipCount, words);
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Greedy pick: take top-scored clips that don't overlap
  const selected: ClipSegment[] = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  for (const candidate of candidates) {
    if (selected.length >= clipCount) break;

    // Check overlap with already-selected clips (require at least 3s gap)
    const overlaps = usedRanges.some(
      (r) => candidate.startSeconds < r.end + 3 && candidate.endSeconds > r.start - 3
    );
    if (overlaps) continue;

    // Snap to sentence boundary if possible
    const snapped = snapToSentenceBoundary(candidate.startSeconds, candidate.endSeconds, words, clipDurationSeconds);

    selected.push({
      index: selected.length,
      startSeconds: snapped.start,
      endSeconds: snapped.end,
      durationSeconds: snapped.end - snapped.start,
      text: snapped.text || candidate.text,
      score: candidate.score,
    });
    usedRanges.push({ start: snapped.start, end: snapped.end });
  }

  // If we couldn't find enough non-overlapping clips, fill with evenly spaced
  if (selected.length < clipCount) {
    const remaining = clipCount - selected.length;
    const fallback = buildEvenlySpacedClips(totalDurationSeconds, clipDurationSeconds, remaining, words, usedRanges);
    for (const clip of fallback) {
      if (selected.length >= clipCount) break;
      selected.push({ ...clip, index: selected.length });
    }
  }

  // Sort final clips by position in video
  selected.sort((a, b) => a.startSeconds - b.startSeconds);
  selected.forEach((clip, i) => { clip.index = i; });

  return selected;
}

function scoreWindow(
  windowWords: TranscriptWord[],
  text: string,
  start: number,
  end: number,
  totalDuration: number
): number {
  let score = 0;
  const duration = end - start;

  // 1. Word density (words per second) — more speech = more engaging
  const wordsPerSecond = windowWords.length / duration;
  score += Math.min(wordsPerSecond * 10, 35); // cap at 35 points

  // 2. Keyword presence
  const lowerText = text.toLowerCase();
  let keywordHits = 0;
  for (const kw of ENGAGEMENT_KEYWORDS) {
    if (lowerText.includes(kw)) keywordHits++;
  }
  score += Math.min(keywordHits * 3, 30); // cap at 30 points

  // 3. Contains numbers/stats (very engaging in short clips)
  const numberMatches = text.match(/\d+/g);
  if (numberMatches) score += Math.min(numberMatches.length * 4, 12);

  // 4. Question detection (hooks)
  const questionCount = (text.match(/\?/g) || []).length;
  score += Math.min(questionCount * 5, 10);

  // 5. Position diversity bonus — slight preference for opening (hook) and middle
  const positionRatio = start / totalDuration;
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
  maxDuration: number
): { start: number; end: number; text: string } {
  // Find the nearest sentence start (word after a period/question/exclamation)
  let bestStart = start;
  const searchRadius = 3; // seconds

  for (const w of allWords) {
    if (w.start < start - searchRadius || w.start > start + searchRadius) continue;
    // Check if previous word ended a sentence
    const prevWordIdx = allWords.indexOf(w) - 1;
    if (prevWordIdx >= 0) {
      const prevWord = allWords[prevWordIdx].word;
      const lastChar = prevWord[prevWord.length - 1];
      if (SENTENCE_ENDERS.has(lastChar)) {
        bestStart = w.start;
        break;
      }
    }
  }

  const bestEnd = Math.min(bestStart + maxDuration, end + searchRadius);
  const clippedWords = allWords.filter((w) => w.start >= bestStart && w.end <= bestEnd);
  const text = clippedWords.map((w) => w.word).join(' ');

  return { start: bestStart, end: Math.min(bestStart + maxDuration, bestEnd), text };
}

function buildEvenlySpacedClips(
  totalDuration: number,
  clipDuration: number,
  count: number,
  words: TranscriptWord[],
  excludeRanges: Array<{ start: number; end: number }> = []
): ClipSegment[] {
  const clips: ClipSegment[] = [];
  const spacing = totalDuration / (count + 1);

  for (let i = 0; i < count; i++) {
    const center = spacing * (i + 1);
    let start = Math.max(0, center - clipDuration / 2);
    const end = Math.min(totalDuration, start + clipDuration);
    start = end - clipDuration; // ensure exact duration

    // Skip if overlaps with excluded ranges
    const overlaps = excludeRanges.some((r) => start < r.end + 3 && end > r.start - 3);
    if (overlaps) continue;

    const windowWords = words.filter((w) => w.start >= start && w.end <= end);
    const text = windowWords.map((w) => w.word).join(' ');

    clips.push({
      index: clips.length,
      startSeconds: Math.max(0, start),
      endSeconds: end,
      durationSeconds: clipDuration,
      text,
      score: 0,
    });
  }

  return clips;
}
