/**
 * Sentence & Segment Timeline Engine (Deterministic Code, Zero AI for Timecodes)
 *
 * Golden Rule: "Time code decide kare, AI nahi. AI se timestamps likhwaoge to drift aur galat cuts aate hain."
 *
 * Converts words and transcript chunks into frame-accurate, natural sentence-boundary segments
 * with natural cut points at sentence endings (. ! ?) and speech pauses, without arbitrary 4s/7s forced chopping.
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
  minDurationSeconds?: number; // default: 2.2 (natural short sentence)
  maxDurationSeconds?: number; // default: 5.5 (keeps pacing punchy and viral)
  chapterDurationSeconds?: number; // default: 70.0 (~60-90s)
  totalDurationSeconds?: number;
}

/**
 * Builds a frame-accurate, natural sentence-by-sentence timeline strictly in deterministic code.
 * Cuts happen at natural sentence boundaries (. ! ?) or natural speech pauses, NOT arbitrary fixed 4s/7s timers.
 */
export function buildDeterministicSentenceTimeline(
  rawSegments: RawSegmentInput[],
  options: TimelineBuildOptions = {}
): TimelineSegment[] {
  const minDur = options.minDurationSeconds ?? 2.2;
  const maxDur = options.maxDurationSeconds ?? 5.5;
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
    // ── Word-Level Natural Sentence-by-Sentence Timeline Construction ──
    let currentWords: TimelineWord[] = [];
    let currentStart = allWords[0].start;

    for (let i = 0; i < allWords.length; i++) {
      const w = allWords[i];
      const nextW = i < allWords.length - 1 ? allWords[i + 1] : null;
      currentWords.push(w);

      const currentDuration = w.end - currentStart;
      const cleanWord = w.word.trim();
      const hasSentenceEndPunctuation = /[.!?।]$/.test(cleanWord);
      const hasClausePunctuation = /[,;:—–-]$/.test(cleanWord);
      const pauseAfterWord = nextW ? nextW.start - w.end : 0;
      const isNaturalSentencePause = pauseAfterWord >= 0.45;
      const isClausePause = pauseAfterWord >= 0.3;

      const shouldCut =
        // End of all words
        !nextW ||
        // Clean natural sentence end (. ! ? ।) with a meaningful thought (at least 1.8s or 4 words)
        (hasSentenceEndPunctuation && (currentDuration >= 1.8 || currentWords.length >= 4)) ||
        // Clear speaker breath/pause (>= 0.45s) after a complete phrase (at least minDur and 5 words)
        (currentDuration >= minDur && currentWords.length >= 5 && isNaturalSentencePause) ||
        // If a run-on unpunctuated sentence gets long (>= 8.5s), cut at the next clause/pause
        (currentDuration >= 8.5 && (hasClausePunctuation || isClausePause)) ||
        // Safety cap only for extreme unpunctuated marathon sentences
        currentDuration >= maxDur;

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
    // ── Segment-Level Natural Sentence Split Fallback (When word timestamps unavailable) ──
    for (let i = 0; i < rawSegments.length; i++) {
      const seg = rawSegments[i];
      const segDuration = Math.max(0.5, seg.end - seg.start);
      const rawText = (seg.text || '').trim();

      // Split into natural sentences if a transcript segment contains multiple sentences and is long
      const sentenceParts = rawText
        .split(/(?<=[.!?।])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (sentenceParts.length > 1 && segDuration > 5.0) {
        const totalChars = sentenceParts.reduce((acc, s) => acc + s.length, 0) || 1;
        let partStart = seg.start;

        for (let p = 0; p < sentenceParts.length; p++) {
          const partText = sentenceParts[p];
          const proportionalDur = (partText.length / totalChars) * segDuration;
          const partEnd = p === sentenceParts.length - 1
            ? seg.end
            : Math.min(seg.end, Math.round((partStart + proportionalDur) * 100) / 100);

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
            duration: Math.max(0.5, Math.round((partEnd - partStart) * 100) / 100),
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
          text: rawText,
        });
      }
    }
  }

  return timelineSegments;
}
