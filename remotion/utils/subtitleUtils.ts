// remotion/utils/subtitleUtils.ts
// Shared utilities for subtitle timing and processing

import {CaptionSegment, WordTiming} from '../types/subtitles';

/** Get the active caption segment at a given time (in seconds) */
export function getActiveCaption(
  captions: CaptionSegment[],
  currentTimeSec: number,
): CaptionSegment | null {
  if (!captions || captions.length === 0) return null;
  return (
    captions.find((c) => currentTimeSec >= c.start && currentTimeSec < c.end) ??
    null
  );
}

/** Get the currently spoken word within an active caption */
export function getActiveWord(
  caption: CaptionSegment | null,
  currentTimeSec: number,
): string | null {
  if (!caption?.words) return null;
  const activeWord = caption.words.find(
    (w) => currentTimeSec >= w.start && currentTimeSec < w.end,
  );
  return activeWord?.word ?? null;
}

/**
 * Distribute word timings evenly across a caption if word-level
 * timing is missing (Groq segments fallback)
 */
export function distributeWordTimings(caption: CaptionSegment): WordTiming[] {
  if (caption.words && caption.words.length > 0) return caption.words;
  const words = caption.text.trim().split(/\s+/);
  const duration = caption.end - caption.start;
  const wordDuration = duration / words.length;
  return words.map((word, i) => ({
    word,
    start: caption.start + i * wordDuration,
    end: caption.start + (i + 1) * wordDuration,
  }));
}

/** Font size map */
export function getFontSize(
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium',
): number {
  const map = {small: 36, medium: 52, large: 68, xlarge: 88};
  return map[size];
}
