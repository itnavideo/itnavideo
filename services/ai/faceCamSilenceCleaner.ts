/**
 * Face-Camera Silence, Repeat & False Start Cleaner (Smart Rough Cut)
 *
 * Implements:
 * 1. Silence Gap Snip (> 0.4s between spoken words)
 * 2. False Start & Stutter Removal ("Let me rephrase that...", repeated clauses within 5s)
 * 3. Filler Word Filter ("um", "uh", "hmm", "err") during pauses
 * 4. Micro-Breathing Padding (60ms) to preserve natural speech acoustics
 * 5. Accurate Timestamp Remapping so subtitles stay 100% synchronized with the trimmed video
 */

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface SpeechClip {
  clipId: string;
  startSeconds: number;       // Start in raw source video
  endSeconds: number;         // End in raw source video
  durationSeconds: number;    // Duration of this active clip
  cumulativeStart: number;    // Compressed start time in edited video
  cumulativeEnd: number;      // Compressed end time in edited video
}

export interface CleanedSpeechTimeline {
  originalDurationSeconds: number;
  cleanedDurationSeconds: number;
  silenceCutCount: number;
  fillersRemovedCount: number;
  repeatsRemovedCount: number;
  falseStartsRemovedCount: number;
  clips: SpeechClip[];
  cleanedWords: WordTimestamp[];
}

export interface SilenceCleaningOptions {
  minSilenceGapSeconds?: number;     // Gaps >= threshold (default 0.40s) get snipped out
  paddingSeconds?: number;           // Breathing room padding (default 0.06s = 60ms)
  trimRepeatsAndFalseStarts?: boolean; // Remove false starts and repeated takes
}

const FILLER_WORD_REGEX = /^(um|uh|uhh|umm|hmm|aah|err|er|like)$/i;

// Verbal triggers where the speaker indicates they are restarting a thought/sentence
const RETAKE_TRIGGER_PHRASES = [
  /let me rephrase that/i,
  /let me start over/i,
  /let me redo that/i,
  /let me say that again/i,
  /scratch that/i,
  /sorry let me/i,
  /wait let me/i,
  /take two/i,
];

function cleanWordForMatch(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function round(val: number): number {
  return Math.round(val * 100) / 100;
}

export function cleanFaceCamSilenceAndFillers(
  rawWords: WordTimestamp[],
  totalDurationSeconds: number,
  options?: SilenceCleaningOptions
): CleanedSpeechTimeline {
  const minSilenceGapSeconds = options?.minSilenceGapSeconds ?? 0.40;
  const paddingSeconds = options?.paddingSeconds ?? 0.06;
  const trimRepeats = options?.trimRepeatsAndFalseStarts ?? true;

  if (!rawWords || rawWords.length === 0) {
    const singleClip: SpeechClip = {
      clipId: 'clip-0',
      startSeconds: 0,
      endSeconds: totalDurationSeconds,
      durationSeconds: totalDurationSeconds,
      cumulativeStart: 0,
      cumulativeEnd: totalDurationSeconds,
    };
    return {
      originalDurationSeconds: totalDurationSeconds,
      cleanedDurationSeconds: totalDurationSeconds,
      silenceCutCount: 0,
      fillersRemovedCount: 0,
      repeatsRemovedCount: 0,
      falseStartsRemovedCount: 0,
      clips: [singleClip],
      cleanedWords: [],
    };
  }

  // ── STEP 1: DETECT AND PRUNE FALSE STARTS & RETAKES ────────────────────────
  let words = [...rawWords];
  let falseStartsRemovedCount = 0;
  let repeatsRemovedCount = 0;

  if (trimRepeats && words.length > 5) {
    // 1A. Detect verbal retake phrases ("let me rephrase that...")
    // When found, snip the preceding false start (up to 4s prior) and the retake phrase itself
    const discardedWordIndices = new Set<number>();
    const fullSentenceText = words.map((w) => w.word).join(' ');

    for (const phraseRegex of RETAKE_TRIGGER_PHRASES) {
      let match: RegExpExecArray | null;
      const globalRegex = new RegExp(phraseRegex.source, 'gi');
      while ((match = globalRegex.exec(fullSentenceText)) !== null) {
        // Find which words overlap with this match
        const matchCharStart = match.index;
        const matchCharEnd = match.index + match[0].length;

        let charCursor = 0;
        let retakeWordStart = -1;
        let retakeWordEnd = -1;

        for (let i = 0; i < words.length; i++) {
          const wordLen = words[i].word.length;
          const wordEndChar = charCursor + wordLen;

          if (retakeWordStart === -1 && wordEndChar >= matchCharStart) {
            retakeWordStart = i;
          }
          if (charCursor <= matchCharEnd) {
            retakeWordEnd = i;
          }
          charCursor += wordLen + 1; // +1 for space
        }

        if (retakeWordStart !== -1 && retakeWordEnd !== -1) {
          // Snip the retake trigger words
          for (let k = retakeWordStart; k <= retakeWordEnd; k++) {
            discardedWordIndices.add(k);
          }
          // Also snip prior broken sentence words (within 4 seconds prior)
          const retakeStartTime = words[retakeWordStart].start;
          for (let k = retakeWordStart - 1; k >= 0; k--) {
            if (retakeStartTime - words[k].end <= 4.0) {
              discardedWordIndices.add(k);
            } else {
              break;
            }
          }
          falseStartsRemovedCount++;
        }
      }
    }

    // 1B. Detect immediate repeats / stutters (e.g. repeated 3-word phrase within 5s)
    // Example: "The biggest problem is [pause] The biggest problem is..."
    for (let i = 0; i < words.length - 3; i++) {
      if (discardedWordIndices.has(i)) continue;

      const phrase3 = [
        cleanWordForMatch(words[i].word),
        cleanWordForMatch(words[i + 1].word),
        cleanWordForMatch(words[i + 2].word),
      ].join(' ');

      if (phrase3.length < 6) continue; // Skip trivial words like "in a the"

      // Search ahead up to 10 words or 5 seconds for identical repeated phrase
      for (let j = i + 3; j < Math.min(words.length - 2, i + 14); j++) {
        if (words[j].start - words[i].end > 5.5) break;

        const comparePhrase = [
          cleanWordForMatch(words[j].word),
          cleanWordForMatch(words[j + 1].word),
          cleanWordForMatch(words[j + 2].word),
        ].join(' ');

        if (phrase3 === comparePhrase) {
          // The earlier occurrence (i .. j-1) is the false start! Snip it.
          for (let k = i; k < j; k++) {
            discardedWordIndices.add(k);
          }
          repeatsRemovedCount++;
          break;
        }
      }
    }

    // 1C. Filter out discarded words
    if (discardedWordIndices.size > 0) {
      words = words.filter((_, idx) => !discardedWordIndices.has(idx));
    }
  }

  // ── STEP 2: REMOVE FILLER WORDS SURROUNDED BY SILENCE ──────────────────────
  let fillersCount = 0;
  const filteredWords: WordTimestamp[] = [];

  for (let i = 0; i < words.length; i++) {
    const current = words[i];
    const cleanWord = current.word.replace(/[^a-zA-Z]/g, '');

    if (FILLER_WORD_REGEX.test(cleanWord)) {
      const prevEnd = i > 0 ? words[i - 1].end : 0;
      const nextStart = i < words.length - 1 ? words[i + 1].start : totalDurationSeconds;

      // Remove filler if surrounded by silence or at start/end
      if (current.start - prevEnd > 0.18 || nextStart - current.end > 0.18 || words.length <= 10) {
        fillersCount++;
        continue;
      }
    }
    filteredWords.push(current);
  }

  const wordsToProcess = filteredWords.length > 0 ? filteredWords : words;

  // ── STEP 3: DETECT ACTIVE SPEECH SEGMENTS (PAUSE TRIMMING > 0.4s) ───────────
  type RawSegment = { start: number; end: number };
  const rawSegments: RawSegment[] = [];

  let segStart = Math.max(0, wordsToProcess[0].start - paddingSeconds);
  let segEnd = wordsToProcess[0].end + paddingSeconds;

  for (let i = 1; i < wordsToProcess.length; i++) {
    const w = wordsToProcess[i];
    const gap = w.start - segEnd;

    if (gap > minSilenceGapSeconds) {
      // Close current segment and start a new one (snipping the silence)
      rawSegments.push({
        start: round(segStart),
        end: round(Math.min(totalDurationSeconds, segEnd)),
      });
      segStart = Math.max(0, w.start - paddingSeconds);
      segEnd = w.end + paddingSeconds;
    } else {
      // Extend current segment
      segEnd = Math.max(segEnd, w.end + paddingSeconds);
    }
  }
  rawSegments.push({
    start: round(segStart),
    end: round(Math.min(totalDurationSeconds, segEnd)),
  });

  // ── STEP 4: BUILD CONTINUOUS TIMELINE CLIPS ────────────────────────────────
  const clips: SpeechClip[] = [];
  let cumulativeTime = 0;

  for (let i = 0; i < rawSegments.length; i++) {
    const seg = rawSegments[i];
    const duration = round(Math.max(0.1, seg.end - seg.start));

    clips.push({
      clipId: `clip-${i}`,
      startSeconds: seg.start,
      endSeconds: seg.end,
      durationSeconds: duration,
      cumulativeStart: round(cumulativeTime),
      cumulativeEnd: round(cumulativeTime + duration),
    });

    cumulativeTime += duration;
  }

  const cleanedDurationSeconds = round(cumulativeTime);
  const silenceCutCount = Math.max(0, rawSegments.length - 1);

  // ── STEP 5: REMAP WORD TIMESTAMPS ONTO COMPRESSED TIMELINE ─────────────────
  const cleanedWords: WordTimestamp[] = [];

  for (const w of wordsToProcess) {
    const clip =
      clips.find(
        (c) =>
          w.start >= c.startSeconds - paddingSeconds &&
          w.end <= c.endSeconds + paddingSeconds
      ) || clips[0];

    const offsetInClip = Math.max(0, w.start - clip.startSeconds);
    const wordDuration = Math.max(0.05, w.end - w.start);

    const remappedStart = round(clip.cumulativeStart + offsetInClip);
    const remappedEnd = round(remappedStart + wordDuration);

    cleanedWords.push({
      word: w.word,
      start: remappedStart,
      end: remappedEnd,
    });
  }

  return {
    originalDurationSeconds: round(totalDurationSeconds),
    cleanedDurationSeconds,
    silenceCutCount,
    fillersRemovedCount: fillersCount,
    repeatsRemovedCount,
    falseStartsRemovedCount,
    clips,
    cleanedWords,
  };
}
