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

export interface AlignedWord {
  word: string;
  start: number;
  end: number;
  isEdited?: boolean;
}

/**
 * Diff-Based Alignment Engine
 *
 * Matches edited word tokens to original Whisper word timestamps using sequence alignment.
 * Unchanged words preserve their exact original Whisper timestamps down to the millisecond.
 * Only inserted/modified words interpolate within their surrounding unchanged anchor bounds.
 */
export function diffBasedAlignTranscript(
  originalWords: Array<{ word: string; start: number; end: number }>,
  editedText: string,
  totalDurationSeconds: number
): { words: AlignedWord[]; segments: TranscriptSegment[] } {
  const maxDuration = Math.max(1, Number(totalDurationSeconds) || 60);
  const editTokens = editedText.trim().split(/\s+/).filter(Boolean);

  if (editTokens.length === 0) {
    return { words: [], segments: [] };
  }

  // If no original words available, fall back to proportional distribution
  if (!originalWords || originalWords.length === 0) {
    const perWord = maxDuration / editTokens.length;
    const fallbackWords: AlignedWord[] = editTokens.map((w, i) => ({
      word: w,
      start: Math.round(i * perWord * 100) / 100,
      end: Math.round((i + 1) * perWord * 100) / 100,
      isEdited: true,
    }));
    return {
      words: fallbackWords,
      segments: [
        {
          start: 0,
          end: maxDuration,
          text: editedText,
          words: fallbackWords,
        },
      ],
    };
  }

  // Normalize tokens for matching
  const cleanOriginal = originalWords.map((w) => ({
    raw: w.word,
    clean: w.word.toLowerCase().replace(/[^a-z0-9]/g, ''),
    start: Number(w.start),
    end: Number(w.end),
  }));

  const cleanEdited = editTokens.map((t) => ({
    raw: t,
    clean: t.toLowerCase().replace(/[^a-z0-9]/g, ''),
  }));

  // Build Monotonic Anchor Alignment (greedy forward scan with lookahead)
  const matchedOriginalIndex: number[] = new Array(cleanEdited.length).fill(-1);
  let lastMatchedOrigIdx = -1;

  for (let eIdx = 0; eIdx < cleanEdited.length; eIdx++) {
    const editItem = cleanEdited[eIdx];
    if (!editItem.clean) continue;

    // Lookahead up to 16 words in original
    const searchEnd = Math.min(cleanOriginal.length, lastMatchedOrigIdx + 17);
    for (let oIdx = lastMatchedOrigIdx + 1; oIdx < searchEnd; oIdx++) {
      if (cleanOriginal[oIdx].clean === editItem.clean) {
        matchedOriginalIndex[eIdx] = oIdx;
        lastMatchedOrigIdx = oIdx;
        break;
      }
    }
  }

  // Interpolate unanchored words between surrounding anchors
  const alignedWords: AlignedWord[] = [];

  for (let i = 0; i < cleanEdited.length; i++) {
    const origIdx = matchedOriginalIndex[i];
    if (origIdx !== -1) {
      // Unchanged word -> 100% exact original Whisper timestamp
      alignedWords.push({
        word: cleanEdited[i].raw,
        start: cleanOriginal[origIdx].start,
        end: cleanOriginal[origIdx].end,
        isEdited: false,
      });
    } else {
      // Find previous anchor
      let prevAnchorEnd = 0;
      for (let p = i - 1; p >= 0; p--) {
        if (matchedOriginalIndex[p] !== -1) {
          prevAnchorEnd = cleanOriginal[matchedOriginalIndex[p]].end;
          break;
        }
      }

      // Find next anchor
      let nextAnchorStart = maxDuration;
      let nextAnchorIndex = cleanEdited.length;
      for (let n = i + 1; n < cleanEdited.length; n++) {
        if (matchedOriginalIndex[n] !== -1) {
          nextAnchorStart = cleanOriginal[matchedOriginalIndex[n]].start;
          nextAnchorIndex = n;
          break;
        }
      }

      // Find count of consecutive unanchored words in this gap
      let gapStartIndex = i;
      while (gapStartIndex > 0 && matchedOriginalIndex[gapStartIndex - 1] === -1) {
        gapStartIndex--;
      }
      const gapTotalWords = nextAnchorIndex - gapStartIndex;
      const wordPositionInGap = i - gapStartIndex;

      const safeStartBound = Math.max(0, prevAnchorEnd);
      const safeEndBound = Math.max(safeStartBound + 0.3, nextAnchorStart);
      const gapDuration = safeEndBound - safeStartBound;
      const step = gapDuration / Math.max(1, gapTotalWords);

      const wordStart = safeStartBound + wordPositionInGap * step;
      const wordEnd = safeStartBound + (wordPositionInGap + 1) * step;

      alignedWords.push({
        word: cleanEdited[i].raw,
        start: Math.round(wordStart * 100) / 100,
        end: Math.round(wordEnd * 100) / 100,
        isEdited: true,
      });
    }
  }

  // Reconstruct sentence segments based on punctuation (.?!) or natural breaks (max 10 words)
  const segments: TranscriptSegment[] = [];
  let currentSegmentWords: AlignedWord[] = [];

  alignedWords.forEach((wordObj, idx) => {
    currentSegmentWords.push(wordObj);
    const hasPunctuation = /[.?!]$/.test(wordObj.word);
    const isAtChunkLimit = currentSegmentWords.length >= 10;
    const isLast = idx === alignedWords.length - 1;

    if (hasPunctuation || isAtChunkLimit || isLast) {
      const segText = currentSegmentWords.map((w) => w.word).join(' ');
      const segStart = currentSegmentWords[0].start;
      const segEnd = currentSegmentWords[currentSegmentWords.length - 1].end;

      segments.push({
        text: segText,
        start: segStart,
        end: Math.max(segStart + 0.5, segEnd),
        words: [...currentSegmentWords],
      });
      currentSegmentWords = [];
    }
  });

  return { words: alignedWords, segments };
}
