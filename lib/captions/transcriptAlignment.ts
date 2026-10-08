// lib/captions/transcriptAlignment.ts
// Intelligent sequence alignment & timestamp reconciliation for transcript edits

import type { TranscriptDocument, TranscriptWordItem } from './types';

function cleanWord(str: string): string {
  return str.toLowerCase().replace(/[^\w\d]/g, '');
}

/**
 * Calculates Damerau-Levenshtein distance (supports transpositions like 'teh' -> 'the')
 */
function damerauLevenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[i][0] = i;
  for (let j = 0; j <= bn; j++) matrix[0][j] = j;

  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition check (e.g. 'teh' -> 'the')
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }
  return matrix[an][bn];
}

function wordSimilarity(w1: string, w2: string): number {
  const c1 = cleanWord(w1);
  const c2 = cleanWord(w2);
  if (c1 === c2) return 1.0;
  if (!c1 || !c2) return 0.0;
  
  // Substring inclusion bonus (e.g. "itnavideo" contains "itna" or "video")
  if (c1.includes(c2) || c2.includes(c1)) {
    return 0.75;
  }

  const maxLen = Math.max(c1.length, c2.length);
  const dist = damerauLevenshteinDistance(c1, c2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Creates an initial TranscriptDocument from raw Whisper output
 */
export function createTranscriptDocument(
  rawTranscript: string,
  rawWords: Array<{ word: string; start: number; end: number; confidence?: number }>,
  durationSeconds: number,
  language?: string
): TranscriptDocument {
  const words: TranscriptWordItem[] = rawWords.map((w, idx) => ({
    id: `w-${idx + 1}-${Date.now()}`,
    word: w.word.trim(),
    start: Number(w.start.toFixed(3)),
    end: Number(w.end.toFixed(3)),
    confidence: w.confidence ?? 0.95,
    isEdited: false,
    isInserted: false,
  }));

  return {
    id: `doc-${Date.now()}`,
    rawTranscript: rawTranscript.trim(),
    editedTranscript: rawTranscript.trim(),
    words,
    language: language || 'en',
    durationSeconds: Number(durationSeconds.toFixed(2)),
    version: 'v1-ai',
    updatedAt: Date.now(),
  };
}

/**
 * Reconciles user-edited full text with original word timestamps.
 * Uses Dynamic Programming sequence alignment to preserve timestamps for matching/edited words
 * and smoothly interpolates timestamps for inserted words.
 */
export function alignEditedTranscript(
  currentDoc: TranscriptDocument,
  newEditedText: string
): TranscriptDocument {
  const trimmedNewText = newEditedText.trim();
  if (!trimmedNewText) {
    return {
      ...currentDoc,
      editedTranscript: '',
      words: [],
      version: 'v2-user',
      updatedAt: Date.now(),
    };
  }

  // Tokenize edited text while preserving punctuation attached to tokens
  const newTokens = trimmedNewText.split(/\s+/).filter(Boolean);
  const oldWords = currentDoc.words;

  if (oldWords.length === 0) {
    const totalDuration = currentDoc.durationSeconds || 5;
    const perWord = totalDuration / Math.max(1, newTokens.length);
    const newWords: TranscriptWordItem[] = newTokens.map((token, idx) => ({
      id: `w-${idx + 1}-${Date.now()}`,
      word: token,
      start: Number((idx * perWord).toFixed(3)),
      end: Number(((idx + 1) * perWord).toFixed(3)),
      isEdited: true,
      isInserted: true,
    }));

    return {
      ...currentDoc,
      editedTranscript: trimmedNewText,
      words: newWords,
      version: 'v2-user',
      updatedAt: Date.now(),
    };
  }

  // Dynamic Programming Matrix for Word Sequence Alignment
  const N = newTokens.length;
  const M = oldWords.length;
  const dp: number[][] = Array.from({ length: N + 1 }, () => Array(M + 1).fill(0));
  const traceback: Array<Array<'diag' | 'up' | 'left'>> = Array.from({ length: N + 1 }, () =>
    Array(M + 1).fill('diag')
  );

  const GAP_PENALTY = -0.4;

  for (let i = 0; i <= N; i++) {
    dp[i][0] = i * GAP_PENALTY;
    traceback[i][0] = 'up';
  }
  for (let j = 0; j <= M; j++) {
    dp[0][j] = j * GAP_PENALTY;
    traceback[0][j] = 'left';
  }

  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
      const sim = wordSimilarity(newTokens[i - 1], oldWords[j - 1].word);
      const matchScore = sim >= 0.3 ? sim * 2.5 : -1.0;

      const scoreDiag = dp[i - 1][j - 1] + matchScore;
      const scoreUp = dp[i - 1][j] + GAP_PENALTY; // Insertion in new text
      const scoreLeft = dp[i][j - 1] + GAP_PENALTY; // Deletion from old text

      if (scoreDiag >= scoreUp && scoreDiag >= scoreLeft) {
        dp[i][j] = scoreDiag;
        traceback[i][j] = 'diag';
      } else if (scoreUp >= scoreLeft) {
        dp[i][j] = scoreUp;
        traceback[i][j] = 'up';
      } else {
        dp[i][j] = scoreLeft;
        traceback[i][j] = 'left';
      }
    }
  }

  // Traceback to build alignment pairs
  let i = N;
  let j = M;
  const alignment: Array<{ newIdx: number | null; oldIdx: number | null }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && traceback[i][j] === 'diag') {
      alignment.unshift({ newIdx: i - 1, oldIdx: j - 1 });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || traceback[i][j] === 'up')) {
      alignment.unshift({ newIdx: i - 1, oldIdx: null });
      i--;
    } else {
      alignment.unshift({ newIdx: null, oldIdx: j - 1 });
      j--;
    }
  }

  // Reconcile timestamps for newTokens
  const reconstructedWords: TranscriptWordItem[] = [];

  for (let k = 0; k < alignment.length; k++) {
    const pair = alignment[k];
    if (pair.newIdx === null) continue; // Deleted word

    const tokenText = newTokens[pair.newIdx];

    if (pair.oldIdx !== null) {
      const oldMatch = oldWords[pair.oldIdx];
      const isExact = cleanWord(tokenText) === cleanWord(oldMatch.word);
      reconstructedWords.push({
        id: oldMatch.id || `w-${pair.newIdx + 1}-${Date.now()}`,
        word: tokenText,
        start: oldMatch.start,
        end: oldMatch.end,
        confidence: isExact ? oldMatch.confidence : 0.9,
        isEdited: !isExact || tokenText !== oldMatch.word,
        isInserted: false,
      });
    } else {
      // Inserted word — placeholder timing to be interpolated
      reconstructedWords.push({
        id: `ins-${pair.newIdx + 1}-${Date.now()}`,
        word: tokenText,
        start: -1,
        end: -1,
        confidence: 0.85,
        isEdited: true,
        isInserted: true,
      });
    }
  }

  // Interpolate missing timestamps for inserted words
  for (let idx = 0; idx < reconstructedWords.length; idx++) {
    if (reconstructedWords[idx].start === -1) {
      // Find previous valid timestamp
      let prevValidIdx = idx - 1;
      while (prevValidIdx >= 0 && reconstructedWords[prevValidIdx].start === -1) {
        prevValidIdx--;
      }
      const prevEnd = prevValidIdx >= 0 ? reconstructedWords[prevValidIdx].end : 0;

      // Find next valid timestamp
      let nextValidIdx = idx + 1;
      while (nextValidIdx < reconstructedWords.length && reconstructedWords[nextValidIdx].start === -1) {
        nextValidIdx++;
      }
      const nextStart =
        nextValidIdx < reconstructedWords.length
          ? reconstructedWords[nextValidIdx].start
          : currentDoc.durationSeconds || prevEnd + 3;

      // Number of consecutive inserted words to interpolate
      const groupStart = prevValidIdx + 1;
      const groupEnd = nextValidIdx - 1;
      const count = groupEnd - groupStart + 1;

      const availableDuration = Math.max(0.3 * count, nextStart - prevEnd);
      const step = availableDuration / count;

      for (let g = groupStart; g <= groupEnd; g++) {
        const offset = g - groupStart;
        const s = prevEnd + offset * step;
        const e = s + step * 0.95;
        reconstructedWords[g].start = Number(s.toFixed(3));
        reconstructedWords[g].end = Number(e.toFixed(3));
      }

      idx = groupEnd; // Skip to end of interpolated group
    }
  }

  // Ensure monotonic progression and non-overlapping sanity
  for (let idx = 1; idx < reconstructedWords.length; idx++) {
    const prev = reconstructedWords[idx - 1];
    const curr = reconstructedWords[idx];
    if (curr.start < prev.start) {
      curr.start = Number((prev.start + 0.05).toFixed(3));
    }
    if (curr.end <= curr.start) {
      curr.end = Number((curr.start + 0.2).toFixed(3));
    }
  }

  return {
    ...currentDoc,
    editedTranscript: trimmedNewText,
    words: reconstructedWords,
    version: 'v2-user',
    updatedAt: Date.now(),
  };
}
