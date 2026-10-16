/**
 * Sentence & Segment Timeline Engine (Deterministic Code, Zero AI for Timecodes)
 * 
 * Golden Rule: "Time code decide kare, AI nahi. AI se timestamps likhwaoge to drift aur galat cuts aate hain."
 * 
 * Converts words and transcript chunks into frame-accurate, sentence-boundary segments
 * (3.0s - 8.0s each) with natural cut points at pauses (>0.35s) and chapter marks every ~60-80s.
 */

export interface TimelineWord {
  word: string;
  start: number;
  end: number;
}

export interface RawSegmentInput {
  text: string;
  start: number;
  end: number;
  words?: TimelineWord[];
}

export interface TimelineSegment {
  id: number;
  chapterNumber: number;
  isChapterStart: boolean;
  start: number;
  end: number;
  duration: number;
  text: string;
  words?: TimelineWord[];
}

export interface TimelineBuildOptions {
  minDurationSeconds?: number; // default: 3.0
  maxDurationSeconds?: number; // default: 8.0
  chapterDurationSeconds?: number; // default: 70.0 (~60-90s)
  totalDurationSeconds?: number;
}

/**
 * Builds a frame-accurate, sentence-boundary timeline strictly in deterministic code.
 */
export function buildDeterministicSentenceTimeline(
  rawSegments: RawSegmentInput[],
  options: TimelineBuildOptions = {}
): TimelineSegment[] {
  const minDur = options.minDurationSeconds ?? 3.0;
  const maxDur = options.maxDurationSeconds ?? 8.0;
  const chapterDur = options.chapterDurationSeconds ?? 70.0;

  if (!rawSegments || rawSegments.length === 0) {
    return [];
  }

  // 1. Collect all words if available
  const allWords: TimelineWord[] = [];
  rawSegments.forEach((seg) => {
    if (Array.isArray(seg.words) && seg.words.length > 0) {
      allWords.push(...seg.words);
    }
  });

  const timelineSegments: TimelineSegment[] = [];
  let currentChapterNumber = 1;
  let lastChapterTime = 0;

  if (allWords.length > 5) {
    // ── Word-Level High-Precision Timeline Construction ──
    let currentWords: TimelineWord[] = [];
    let currentStart = allWords[0].start;

    for (let i = 0; i < allWords.length; i++) {
      const w = allWords[i];
      const nextW = i < allWords.length - 1 ? allWords[i + 1] : null;
      currentWords.push(w);

      const currentDuration = w.end - currentStart;
      const cleanWord = w.word.trim();
      const hasSentenceEndPunctuation = /[.!?]$/.test(cleanWord);
      const pauseAfterWord = nextW ? nextW.start - w.end : 0;
      const isNaturalPause = pauseAfterWord >= 0.35;

      const shouldCut =
        // End of all words
        !nextW ||
        // Must cut if approaching max duration limit (8s)
        currentDuration >= maxDur ||
        // Clean natural sentence end (. ! ? with at least 1.8s or 4 words)
        (hasSentenceEndPunctuation && (currentDuration >= 1.8 || currentWords.length >= 4)) ||
        // Natural pause (at least 0.35s) if duration is above min threshold
        (currentDuration >= minDur && isNaturalPause);

      if (shouldCut && currentWords.length > 0) {
        const segText = currentWords.map((cw) => cw.word).join(' ').trim();
        const segEnd = w.end;
        const segDur = Math.round((segEnd - currentStart) * 100) / 100;

        const isChapterStart =
          timelineSegments.length === 0 ||
          currentStart - lastChapterTime >= chapterDur;

        if (isChapterStart && timelineSegments.length > 0) {
          currentChapterNumber++;
          lastChapterTime = currentStart;
        }

        timelineSegments.push({
          id: timelineSegments.length + 1,
          chapterNumber: currentChapterNumber,
          isChapterStart,
          start: Math.round(currentStart * 100) / 100,
          end: Math.round(segEnd * 100) / 100,
          duration: segDur,
          text: segText,
          words: [...currentWords],
        });

        // Reset for next segment
        currentWords = [];
        currentStart = nextW ? nextW.start : segEnd;
      }
    }
  } else {
    // ── Segment-Level Proportional Split Fallback (When word timestamps unavailable) ──
    for (let i = 0; i < rawSegments.length; i++) {
      const seg = rawSegments[i];
      const segDuration = seg.end - seg.start;

      if (segDuration > maxDur) {
        // Split long segment into snappy 3-8s beats
        const parts = Math.ceil(segDuration / maxDur);
        const partDur = Math.round((segDuration / parts) * 100) / 100;
        const words = seg.text.split(/\s+/).filter(Boolean);
        const wordsPerPart = Math.ceil(words.length / parts);

        let partStart = seg.start;

        for (let p = 0; p < parts; p++) {
          const partEnd = Math.min(seg.end, Math.round((partStart + partDur) * 100) / 100);
          const partWords = words.slice(p * wordsPerPart, (p + 1) * wordsPerPart);
          const partText = partWords.join(' ') || seg.text;

          const isChapterStart =
            timelineSegments.length === 0 ||
            partStart - lastChapterTime >= chapterDur;

          if (isChapterStart && timelineSegments.length > 0) {
            currentChapterNumber++;
            lastChapterTime = partStart;
          }

          timelineSegments.push({
            id: timelineSegments.length + 1,
            chapterNumber: currentChapterNumber,
            isChapterStart,
            start: Math.round(partStart * 100) / 100,
            end: Math.round(partEnd * 100) / 100,
            duration: Math.round((partEnd - partStart) * 100) / 100,
            text: partText,
          });

          partStart = partEnd;
        }
      } else {
        const isChapterStart =
          timelineSegments.length === 0 ||
          seg.start - lastChapterTime >= chapterDur;

        if (isChapterStart && timelineSegments.length > 0) {
          currentChapterNumber++;
          lastChapterTime = seg.start;
        }

        timelineSegments.push({
          id: timelineSegments.length + 1,
          chapterNumber: currentChapterNumber,
          isChapterStart,
          start: Math.round(seg.start * 100) / 100,
          end: Math.round(seg.end * 100) / 100,
          duration: Math.round(segDuration * 100) / 100,
          text: seg.text.trim(),
        });
      }
    }
  }

  return timelineSegments;
}
