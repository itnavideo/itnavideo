/**
 * AI Voiceover Quality Inspector & Auto-Cleanup Engine
 */

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface SpeechClip {
  startSeconds: number;
  endSeconds: number;
}

export interface VoiceoverInspectionReport {
  qualityScore: number;
  originalDurationSeconds: number;
  cleanedDurationSeconds: number;
  timeSavedSeconds: number;
  silenceCutCount: number;
  fillersRemovedCount: number;
  retakesRemovedCount: number;
  detectedFillers: string[];
  languageDetected: string;
  speechClips: SpeechClip[];
  cleanedWords: WordTimestamp[];
}

const ENGLISH_FILLERS = new Set([
  'uh', 'um', 'er', 'ah', 'like', 'basically', 'actually', 'literally',
  'you know', 'i mean', 'sort of', 'kind of', 'right'
]);

const HINGLISH_FILLERS = new Set([
  'matlab', 'aah', 'samjhe', 'samjho', 'na', 'toh', 'voh', 'matlabki',
  'deko', 'dekho', 'suno', 'bhai'
]);

export function inspectAndCleanVoiceover(
  words: WordTimestamp[],
  totalDurationSeconds: number,
  options?: {
    maxGapSeconds?: number;
    languageHint?: string;
  }
): VoiceoverInspectionReport {
  const maxGap = options?.maxGapSeconds || 0.6;

  if (!words || words.length === 0) {
    return {
      qualityScore: 100,
      originalDurationSeconds: totalDurationSeconds,
      cleanedDurationSeconds: totalDurationSeconds,
      timeSavedSeconds: 0,
      silenceCutCount: 0,
      fillersRemovedCount: 0,
      retakesRemovedCount: 0,
      detectedFillers: [],
      languageDetected: options?.languageHint || 'hinglish-roman',
      speechClips: [{ startSeconds: 0, endSeconds: totalDurationSeconds }],
      cleanedWords: [],
    };
  }

  const detectedFillersSet = new Set<string>();
  const cleanedWords: WordTimestamp[] = [];
  let fillersRemovedCount = 0;
  let retakesRemovedCount = 0;

  for (let i = 0; i < words.length; i++) {
    const current = words[i];
    const normalized = current.word.toLowerCase().replace(/[^\w]/g, '');

    if (ENGLISH_FILLERS.has(normalized) || HINGLISH_FILLERS.has(normalized)) {
      fillersRemovedCount++;
      detectedFillersSet.add(normalized);
      continue;
    }

    const next = words[i + 1];
    if (next) {
      const nextNormalized = next.word.toLowerCase().replace(/[^\w]/g, '');
      if (normalized && normalized === nextNormalized && current.end - current.start < 0.3) {
        retakesRemovedCount++;
        continue;
      }
    }

    cleanedWords.push(current);
  }

  const speechClips: SpeechClip[] = [];
  let silenceCutCount = 0;
  let currentClipStart = cleanedWords[0]?.start ?? 0;
  let lastClipEnd = cleanedWords[0]?.end ?? 0;

  for (let i = 0; i < cleanedWords.length; i++) {
    const word = cleanedWords[i];

    if (i === 0) {
      currentClipStart = Math.max(0, word.start - 0.1);
      lastClipEnd = word.end + 0.1;
      continue;
    }

    const gap = word.start - lastClipEnd;
    if (gap > maxGap) {
      speechClips.push({
        startSeconds: currentClipStart,
        endSeconds: lastClipEnd,
      });
      silenceCutCount++;
      currentClipStart = Math.max(0, word.start - 0.1);
    }

    lastClipEnd = word.end + 0.1;
  }

  if (cleanedWords.length > 0) {
    speechClips.push({
      startSeconds: currentClipStart,
      endSeconds: Math.min(totalDurationSeconds, lastClipEnd),
    });
  }

  const cleanedDurationSeconds = speechClips.reduce(
    (acc, clip) => acc + (clip.endSeconds - clip.startSeconds),
    0
  );
  const timeSavedSeconds = Math.max(0, totalDurationSeconds - cleanedDurationSeconds);

  const qualityScore = Math.max(
    60,
    Math.round(100 - fillersRemovedCount * 2 - silenceCutCount * 1.5)
  );

  return {
    qualityScore,
    originalDurationSeconds: totalDurationSeconds,
    cleanedDurationSeconds: Number(cleanedDurationSeconds.toFixed(2)),
    timeSavedSeconds: Number(timeSavedSeconds.toFixed(2)),
    silenceCutCount,
    fillersRemovedCount,
    retakesRemovedCount,
    detectedFillers: Array.from(detectedFillersSet),
    languageDetected: options?.languageHint || 'hinglish-roman',
    speechClips,
    cleanedWords,
  };
}

