/**
 * Face-Camera Silence & Filler Word Cleaner
 *
 * Analyzes word-level timestamps from Whisper transcription to:
 * 1. Detect silence gaps (> 0.5s) between spoken words.
 * 2. Filter filler words ("um", "uh", "hmm", "err") that occur during pauses.
 * 3. Construct a compact, continuous speech timeline with active clip ranges.
 * 4. Remap word and caption timestamps so captions remain 100% in sync with the edited video.
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
  clips: SpeechClip[];
  cleanedWords: WordTimestamp[];
}

const FILLER_WORD_REGEX = /^(um|uh|uhh|umm|hmm|aah|err|er|like)$/i;
const MIN_SILENCE_GAP_SECONDS = 0.5; // Gaps larger than 0.5s get trimmed
const PADDING_SECONDS = 0.12;          // Safety breathing room before/after words

export function cleanFaceCamSilenceAndFillers(
  rawWords: WordTimestamp[],
  totalDurationSeconds: number
): CleanedSpeechTimeline {
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
      clips: [singleClip],
      cleanedWords: [],
    };
  }

  // Step 1: Filter filler words that are isolated or surrounded by pauses
  let fillersCount = 0;
  const filteredWords: WordTimestamp[] = [];

  for (let i = 0; i < rawWords.length; i++) {
    const current = rawWords[i];
    const cleanWord = current.word.replace(/[^a-zA-Z]/g, '');

    if (FILLER_WORD_REGEX.test(cleanWord)) {
      const prevEnd = i > 0 ? rawWords[i - 1].end : 0;
      const nextStart = i < rawWords.length - 1 ? rawWords[i + 1].start : totalDurationSeconds;

      // Remove filler if surrounded by pause or short word
      if ((current.start - prevEnd > 0.2) || (nextStart - current.end > 0.2) || rawWords.length <= 10) {
        fillersCount++;
        continue; // Skip this filler word
      }
    }
    filteredWords.push(current);
  }

  const wordsToProcess = filteredWords.length > 0 ? filteredWords : rawWords;

  // Step 2: Identify speech segments by merging words separated by < MIN_SILENCE_GAP_SECONDS
  type RawSegment = { start: number; end: number };
  const rawSegments: RawSegment[] = [];

  let segStart = Math.max(0, wordsToProcess[0].start - PADDING_SECONDS);
  let segEnd = wordsToProcess[0].end + PADDING_SECONDS;

  for (let i = 1; i < wordsToProcess.length; i++) {
    const w = wordsToProcess[i];
    const gap = w.start - segEnd;

    if (gap > MIN_SILENCE_GAP_SECONDS) {
      // Close current segment and start a new one
      rawSegments.push({ start: round(segStart), end: round(Math.min(totalDurationSeconds, segEnd)) });
      segStart = Math.max(0, w.start - PADDING_SECONDS);
      segEnd = w.end + PADDING_SECONDS;
    } else {
      // Extend current segment
      segEnd = Math.max(segEnd, w.end + PADDING_SECONDS);
    }
  }
  rawSegments.push({ start: round(segStart), end: round(Math.min(totalDurationSeconds, segEnd)) });

  // Step 3: Build SpeechClips and cumulative timeline
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

  // Step 4: Remap word timestamps onto the compressed timeline
  const cleanedWords: WordTimestamp[] = [];

  for (const w of wordsToProcess) {
    // Find which clip contains this word
    const clip = clips.find((c) => w.start >= c.startSeconds - PADDING_SECONDS && w.end <= c.endSeconds + PADDING_SECONDS) || clips[0];

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
    clips,
    cleanedWords,
  };
}

function round(val: number): number {
  return Math.round(val * 100) / 100;
}
