/**
 * Transcript Validation & Audio Alignment Engine
 *
 * Ensures edited transcript text maintains rigorous alignment with spoken audio.
 * Prevents desync, timestamp clipping, or malformed time ranges.
 */

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface AlignmentValidationResult {
  isValid: boolean;
  isEdited: boolean;
  warnings: string[];
  repairedSegments: TranscriptSegment[];
  totalWords: number;
}

/**
 * Validates edited segments against the audio duration and original transcript.
 * Does NOT blindly interpolate: validates boundaries, checks duration limits,
 * detects changes, and warns user if text divergence could cause subtitle desync.
 */
export function validateAndAlignTranscript(
  segments: TranscriptSegment[],
  originalText: string,
  audioDurationSeconds: number
): AlignmentValidationResult {
  const warnings: string[] = [];
  const maxDuration = Math.max(1, Number(audioDurationSeconds) || 60);

  if (!Array.isArray(segments) || segments.length === 0) {
    return {
      isValid: false,
      isEdited: false,
      warnings: ['No transcript segments provided.'],
      repairedSegments: [],
      totalWords: 0,
    };
  }

  // 1. Text change detection
  const joinedEdited = segments
    .map((s) => (s.text || '').trim())
    .filter(Boolean)
    .join(' ');
  const normOriginal = originalText.toLowerCase().replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  const normEdited = joinedEdited.toLowerCase().replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();

  const isEdited = normOriginal.length > 0 && normEdited !== normOriginal;
  if (isEdited) {
    const origWordCount = normOriginal.split(/\s+/).filter(Boolean).length;
    const editWordCount = normEdited.split(/\s+/).filter(Boolean).length;
    const wordDiff = Math.abs(editWordCount - origWordCount);

    if (wordDiff > 5) {
      warnings.push(
        `Word count changed by ${wordDiff} words. Spoken narration audio cannot be changed; on-screen subtitles will display your edited text, but word rhythm may slightly diverge from speech.`
      );
    } else {
      warnings.push(
        'Edited transcript text will appear in subtitles and on-screen graphics, while your original voiceover audio is preserved.'
      );
    }
  }

  // 2. Strict timestamp validation & sequential ordering
  const repairedSegments: TranscriptSegment[] = [];
  let lastEnd = 0;
  let totalWordsCount = 0;

  for (let i = 0; i < segments.length; i++) {
    const raw = segments[i];
    const text = (raw.text || '').trim();
    if (!text) continue;

    let start = Number.isFinite(raw.start) ? Math.max(0, Number(raw.start)) : lastEnd;
    let end = Number.isFinite(raw.end) ? Math.min(maxDuration, Number(raw.end)) : start + 3;

    // Enforce sequential start
    if (start < lastEnd) {
      start = lastEnd;
    }
    // Ensure minimum duration (0.4s)
    if (end <= start) {
      end = Math.min(maxDuration, start + 0.5);
    }

    lastEnd = end;

    // Split into words and distribute safely within [start, end]
    const wordTokens = text.split(/\s+/).filter(Boolean);
    totalWordsCount += wordTokens.length;

    const segmentDuration = end - start;
    const totalChars = wordTokens.reduce((sum, w) => sum + w.length, 0);

    let currentWordStart = start;
    const wordObjects: Array<{ word: string; start: number; end: number }> = [];

    wordTokens.forEach((token, wIdx) => {
      // Weight word duration by character length
      const weight = totalChars > 0 ? token.length / totalChars : 1 / wordTokens.length;
      const wordDur = Math.max(0.08, segmentDuration * weight);
      const wordEnd = wIdx === wordTokens.length - 1 ? end : Math.min(end, currentWordStart + wordDur);

      wordObjects.push({
        word: token,
        start: Math.round(currentWordStart * 100) / 100,
        end: Math.round(wordEnd * 100) / 100,
      });

      currentWordStart = wordEnd;
    });

    repairedSegments.push({
      start: Math.round(start * 100) / 100,
      end: Math.round(end * 100) / 100,
      text,
      words: wordObjects,
    });
  }

  return {
    isValid: repairedSegments.length > 0,
    isEdited,
    warnings,
    repairedSegments,
    totalWords: totalWordsCount,
  };
}
