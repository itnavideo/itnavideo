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
  minDurationSeconds?: number; // default: 2.5 (natural short sentence)
  maxDurationSeconds?: number; // default: 18.0 (preserves complete spoken thoughts; zero artificial 3-6s beats)
  chapterDurationSeconds?: number; // default: 70.0 (~60-90s)
  totalDurationSeconds?: number;
}

/**
 * Builds a frame-accurate, natural sentence-by-sentence timeline strictly in deterministic code.
 * Scenes represent complete spoken thoughts. Cuts happen at natural sentence boundaries (. ! ? ।)
 * or genuine speech pauses, NEVER arbitrary 3-6s artificial beats.
 */
export function buildDeterministicSentenceTimeline(
  rawSegments: RawSegmentInput[],
  options: TimelineBuildOptions = {}
): TimelineSegment[] {
  const minDur = options.minDurationSeconds ?? 2.5;
  const maxDur = options.maxDurationSeconds ?? 18.0;
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
      const pauseAfterWord = nextW ? nextW.start - w.end : 0;
      const isNaturalSentencePause = pauseAfterWord >= 0.65;

      const shouldCut =
        // End of all words
        !nextW ||
        // Clean natural sentence end (. ! ? ।) with a complete thought
        (hasSentenceEndPunctuation && (currentDuration >= minDur || currentWords.length >= 3)) ||
        // Speaker natural long breath pause (>= 0.65s) after a substantial spoken clause (at least 5 words and minDur)
        (currentDuration >= minDur && currentWords.length >= 6 && isNaturalSentencePause) ||
        // Runaway safety ceiling only: never allow a single unbroken sentence to exceed maxDur (18s)
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

  // ── Post-Pass: Merge ultra-short lead-in / transition sentences (< minDur) into adjacent paragraph beat ──
  if (timelineSegments.length > 1) {
    const merged: TimelineSegment[] = [];
    for (let i = 0; i < timelineSegments.length; i++) {
      const curr = { ...timelineSegments[i] };
      const next = timelineSegments[i + 1];

      if (curr.duration < minDur && next && curr.duration + next.duration <= maxDur + 2.0) {
        // Merge short lead-in (e.g. "And here's the biggest advantage.") forward into the main point it introduces
        timelineSegments[i + 1] = {
          ...next,
          start: curr.start,
          duration: Math.round((next.end - curr.start) * 100) / 100,
          text: `${curr.text} ${next.text}`.replace(/\s+/g, ' ').trim(),
          words:
            curr.words || next.words
              ? [...(curr.words || []), ...(next.words || [])]
              : undefined,
          isChapterStart: curr.isChapterStart || next.isChapterStart,
          chapterNumber: curr.chapterNumber,
        };
        continue;
      }

      if (curr.duration < minDur && merged.length > 0) {
        const prev = merged[merged.length - 1];
        prev.end = curr.end;
        prev.duration = Math.round((prev.end - prev.start) * 100) / 100;
        prev.text = `${prev.text} ${curr.text}`.replace(/\s+/g, ' ').trim();
        if (prev.words || curr.words) {
          prev.words = [...(prev.words || []), ...(curr.words || [])];
        }
        continue;
      }

      merged.push(curr);
    }

    return merged.map((seg, idx) => ({
      ...seg,
      id: idx + 1,
    }));
  }

  return timelineSegments;
}
