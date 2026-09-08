/**
 * AI Audio Cleaner Service
 *
 * Real Audio Cleaning Pipeline:
 * 1. Script Analysis: Word & segment timestamp extraction from Groq Whisper.
 * 2. Deduplication & Retake Detection: Detects when a speaker repeats a sentence
 *    2 or 3 times due to mistakes, keeps the final/best take, and marks flawed takes for removal.
 * 3. Long Silence Detection: Detects dead air (>1.0s) and trims it to a natural breathing gap (0.3s).
 * 4. Filler Word Detection: Cuts unwanted fillers (um, uh, matlab, etc.).
 * 5. FFmpeg Audio Engine:
 *    - Inverts cut timestamps to keep-intervals and splices audio with sample-accurate atrim + concat.
 *    - Loudness Normalization: EBU R128 standard (loudnorm=I=-16:TP=-1.5:LRA=11) for consistent voice volume.
 *    - Background Noise Reduction: Optional FFT denoiser (afftdn=nf=-25).
 * 6. S3 Upload & Signed URL generation.
 */

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { findFfmpegPath, probeAudioDuration, readMediaInput, runFfmpeg } from '@/services/media/mediaClipper';
import { uploadTemporaryMediaObject, createReadUrl } from '@/lib/aws/mediaStorage';
import {
  structureTranscriptIntoBlocks,
  alignPastedScriptWithAudio,
  type StructuredScriptBlock,
} from './structuredScriptService';

export type AudioCleanOptions = {
  removeSilence: boolean;
  removeFillers: boolean;
  removeRepeats: boolean;
  removeFalseStarts: boolean;
  noiseReduction: boolean;
  volumeNormalize: boolean;
  trimEnds?: boolean;
  playbackSpeed?: number;
  speed?: number;
};

export type AudioCleanSegment = {
  id: string;
  start: number;
  end: number;
  text: string;
  action: 'keep' | 'cut';
  reason?: 'repeat' | 'mistake' | 'silence' | 'filler' | 'stumble' | 'false-start' | 'user';
};

export type CutInterval = {
  start: number;
  end: number;
  reason: 'repeat' | 'mistake' | 'silence' | 'filler' | 'stumble' | 'false-start' | 'user';
  text?: string;
};

export type AudioAnalysisResult = {
  ok: boolean;
  error?: string;
  transcript: string;
  segments: AudioCleanSegment[];
  structuredBlocks?: StructuredScriptBlock[];
  markdown?: string;
  words: Array<{ word: string; start: number; end: number }>;
  originalDuration: number;
  estimatedCleanDuration: number;
  stats: {
    totalWords: number;
    repeatedTakesCount: number;
    silenceCount: number;
    fillerCount: number;
    mistakesCount?: number;
    falseStartsCount?: number;
    stuttersCount?: number;
    secondsSaved: number;
  };
};

export type AudioCleanResult = {
  ok: boolean;
  error?: string;
  outputUrl?: string;
  originalDuration?: number;
  cleanedDuration?: number;
  removedSegments?: number;
  stats?: {
    repeatedTakesCut: number;
    silencesCut: number;
    fillersCut: number;
    durationSavedSeconds: number;
  };
};

// Common fillers in English and Hinglish / Hindi
const PURE_FILLER_TOKENS = new Set([
  'um', 'uh', 'uhh', 'umm', 'hmm', 'hm', 'er', 'ah', 'ahh',
  // Hinglish / Hindi vocalized fillers
  'matlab', 'woh', 'yani', 'haan',
]);

const CONTEXTUAL_FILLER_TOKENS = new Set([
  'like', 'basically', 'actually', 'literally',
  'toh', 'dekho', 'suno', 'acha', 'bhai',
]);

const FILLER_PHRASES = [
  'you know', 'i mean', 'sort of', 'kind of', 'hai na',
];

const FILLER_WORDS = new Set([
  ...PURE_FILLER_TOKENS,
  ...CONTEXTUAL_FILLER_TOKENS,
  ...FILLER_PHRASES,
]);

const HESITATION_TOKENS = new Set([
  'so', 'um', 'uh', 'uhh', 'umm', 'hmm', 'hm', 'like', 'literally',
  'basically', 'actually', 'matlab', 'toh', 'aur', 'and', 'woh', 'dekho', 'er', 'ah',
]);

const STOP_WORD_TOKENS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'it', 'you', 'we', 'that', 'this',
]);

function cleanWordToken(w: string): string {
  return String(w || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, '');
}

function stemWordToken(w: string): string {
  const c = cleanWordToken(w);
  if (c.endsWith('ing') && c.length > 5) return c.slice(0, -3);
  if (c.endsWith('ed') && c.length > 4) return c.slice(0, -2);
  if (c.endsWith('es') && c.length > 4) return c.slice(0, -2);
  if (c.endsWith('s') && c.length > 3) return c.slice(0, -1);
  return c;
}

function cleanText(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compute similarity score between two phrases (0.0 to 1.0)
 * Uses token overlap (Jaccard) + prefix matching
 */
function computePhraseSimilarity(a: string, b: string): number {
  const wordsA = cleanText(a).split(' ').filter(Boolean);
  const wordsB = cleanText(b).split(' ').filter(Boolean);
  if (!wordsA.length || !wordsB.length) return 0;

  // Exact match
  if (wordsA.join(' ') === wordsB.join(' ')) return 1.0;

  // Prefix match (e.g. retake where sentence was started and restarted)
  const minLen = Math.min(wordsA.length, wordsB.length);
  let commonPrefix = 0;
  for (let i = 0; i < minLen; i++) {
    if (wordsA[i] === wordsB[i]) commonPrefix++;
    else break;
  }
  const prefixRatio = commonPrefix / minLen;

  // Jaccard similarity
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  let intersection = 0;
  for (const w of setA) {
    if (setB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  const jaccard = union > 0 ? intersection / union : 0;

  return Math.max(prefixRatio, jaccard);
}

/**
 * Analyze audio transcript to detect retakes, repeated sentences, silences, and fillers.
 */
export function analyzeAudioScript(
  transcript: any,
  options: AudioCleanOptions,
  pastedScript?: string
): AudioAnalysisResult {
  const rawSegments: any[] = Array.isArray(transcript?.segments) ? transcript.segments : [];
  const rawWords: any[] = Array.isArray(transcript?.words) ? transcript.words : [];
  const duration = Number(transcript?.durationSeconds || transcript?.duration || 0) ||
    (rawWords.length ? Math.ceil(rawWords[rawWords.length - 1].end || 0) : 60);

  const words = rawWords
    .filter((w) => w && typeof w.start === 'number' && typeof w.end === 'number')
    .map((w) => ({
      word: String(w.word || '').trim(),
      start: Number(w.start),
      end: Number(w.end),
    }));

  const fullText = String(transcript?.transcript || rawSegments.map((s) => s.text).join(' ')).trim();

  const wordCuts: Array<{
    startIndex: number;
    endIndex: number;
    start: number;
    end: number;
    reason: 'repeat' | 'mistake' | 'filler' | 'stumble' | 'false-start';
    text: string;
  }> = [];

  let repeatedTakesCount = 0;
  let silenceCount = 0;
  let fillerCount = 0;
  let mistakesCount = 0;
  let falseStartsCount = 0;
  let stuttersCount = 0;

  const isCutOverlapping = (start: number, end: number) => {
    return wordCuts.some(
      (c) => (start >= c.start && start < c.end) || (end > c.start && end <= c.end) || (start <= c.start && end >= c.end)
    );
  };

  if (words.length > 0) {
    // Pass 1: Direct identical word stutters (e.g. "I I", "the the", "we we", "so so", "to to")
    if (options.removeRepeats) {
      for (let i = 0; i < words.length - 1; i++) {
        const w0 = cleanWordToken(words[i].word);
        const w1 = cleanWordToken(words[i + 1].word);
        const gap = words[i + 1].start - words[i].end;
        if (w0 && w0 === w1 && gap < 0.85) {
          const cutStart = words[i].start;
          const cutEnd = words[i + 1].start;
          if (!isCutOverlapping(cutStart, cutEnd)) {
            wordCuts.push({
              startIndex: i,
              endIndex: i + 1,
              start: cutStart,
              end: cutEnd,
              reason: 'stumble',
              text: words[i].word,
            });
            stuttersCount++;
          }
        }
      }
    }

    // Pass 2: Partial syllable stumbles (e.g. "st- start", "in- invest", "com- compare")
    if (options.removeRepeats || options.removeFalseStarts) {
      for (let i = 0; i < words.length - 1; i++) {
        const w0 = cleanWordToken(words[i].word);
        const w1 = cleanWordToken(words[i + 1].word);
        const gap = words[i + 1].start - words[i].end;
        if (
          w0 && w1 &&
          w0.length >= 2 && w0.length <= 4 &&
          w1.length > w0.length &&
          w1.startsWith(w0) &&
          gap < 0.45
        ) {
          const cutStart = words[i].start;
          const cutEnd = words[i + 1].start;
          if (!isCutOverlapping(cutStart, cutEnd)) {
            wordCuts.push({
              startIndex: i,
              endIndex: i + 1,
              start: cutStart,
              end: cutEnd,
              reason: 'stumble',
              text: words[i].word,
            });
            stuttersCount++;
          }
        }
      }
    }

    // Pass 3: Stutter with hesitation/filler token in between (e.g. "let's so let's start", "we uh we")
    if (options.removeRepeats) {
      for (let i = 0; i < words.length - 2; i++) {
        const w0 = cleanWordToken(words[i].word);
        const w1 = cleanWordToken(words[i + 1].word);
        const w2 = cleanWordToken(words[i + 2].word);
        const gapTotal = words[i + 2].start - words[i].end;
        if (
          w0 && w0 === w2 &&
          (HESITATION_TOKENS.has(w1) || gapTotal < 1.4) &&
          !isCutOverlapping(words[i].start, words[i + 2].start)
        ) {
          wordCuts.push({
            startIndex: i,
            endIndex: i + 2,
            start: words[i].start,
            end: words[i + 2].start,
            reason: 'stumble',
            text: `${words[i].word} ${words[i + 1].word}`,
          });
          stuttersCount++;
          i += 1;
        }
      }
    }

    // Pass 4: Active Filler Words Elimination (when options.removeFillers is true)
    if (options.removeFillers) {
      // 4A. Two-word filler phrases ("you know", "i mean", "sort of", "kind of", "hai na")
      for (let i = 0; i < words.length - 1; i++) {
        const bigram = `${cleanWordToken(words[i].word)} ${cleanWordToken(words[i + 1].word)}`;
        if (FILLER_PHRASES.includes(bigram)) {
          const cutStart = words[i].start;
          const cutEnd = words[i + 1].end;
          if (!isCutOverlapping(cutStart, cutEnd)) {
            wordCuts.push({
              startIndex: i,
              endIndex: i + 2,
              start: cutStart,
              end: cutEnd,
              reason: 'filler',
              text: `${words[i].word} ${words[i + 1].word}`,
            });
            fillerCount++;
            i += 1;
          }
        }
      }

      // 4B. Single-word vocal fillers ("um", "uh", "umm", "hmm", "matlab", "er", "ah", etc.)
      for (let i = 0; i < words.length; i++) {
        const tok = cleanWordToken(words[i].word);
        if (PURE_FILLER_TOKENS.has(tok)) {
          const cutStart = words[i].start;
          const cutEnd = words[i].end;
          if (!isCutOverlapping(cutStart, cutEnd)) {
            wordCuts.push({
              startIndex: i,
              endIndex: i + 1,
              start: cutStart,
              end: cutEnd,
              reason: 'filler',
              text: words[i].word,
            });
            fillerCount++;
          }
        } else if (CONTEXTUAL_FILLER_TOKENS.has(tok)) {
          // Contextual fillers: cut if surrounded by pause or at phrase boundaries
          const prevGap = i > 0 ? words[i].start - words[i - 1].end : 0.5;
          const nextGap = i < words.length - 1 ? words[i + 1].start - words[i].end : 0.5;
          if ((prevGap >= 0.25 || nextGap >= 0.25) && !isCutOverlapping(words[i].start, words[i].end)) {
            wordCuts.push({
              startIndex: i,
              endIndex: i + 1,
              start: words[i].start,
              end: words[i].end,
              reason: 'filler',
              text: words[i].word,
            });
            fillerCount++;
          }
        }
      }
    }

    // Pass 5: False Starts & Abandoned Incomplete Sentences (when options.removeFalseStarts is true)
    if (options.removeFalseStarts) {
      for (let i = 0; i < words.length - 4; i++) {
        for (let len = 2; len <= 5; len++) {
          if (i + len >= words.length) break;
          const endWord = words[i + len - 1];
          const nextWord = words[i + len];
          const gap = nextWord.start - endWord.end;

          // Check if there is an awkward silence / hesitation after this short burst
          if (gap >= 0.60) {
            const prefixCurrent = words.slice(i, i + Math.min(2, len)).map((w) => cleanWordToken(w.word)).join(' ');
            const prefixNext = words.slice(i + len, i + len + Math.min(2, len)).map((w) => cleanWordToken(w.word)).join(' ');

            const isRestart = prefixCurrent && prefixNext && (
              prefixCurrent === prefixNext ||
              cleanWordToken(words[i].word) === cleanWordToken(nextWord.word)
            );

            const isFragment = len <= 3 && !/[.!?]$/.test(endWord.word);

            if (isRestart || (isFragment && gap >= 1.0)) {
              const cutStart = words[i].start;
              const cutEnd = nextWord.start - 0.20; // preserve 0.20s breathing space before next sentence
              if (cutEnd > cutStart + 0.15 && !isCutOverlapping(cutStart, cutEnd)) {
                wordCuts.push({
                  startIndex: i,
                  endIndex: i + len,
                  start: cutStart,
                  end: cutEnd,
                  reason: 'false-start',
                  text: words.slice(i, i + len).map((w) => w.word).join(' '),
                });
                falseStartsCount++;
                i += len - 1;
                break;
              }
            }
          }
        }
      }
    }

    // Pass 6: Immediate repeated N-gram phrases (N from 8 down to 1)
    if (options.removeRepeats) {
      for (let n = 8; n >= 1; n--) {
        let i = 0;
        while (i <= words.length - 2 * n) {
          const phrase1 = words.slice(i, i + n).map((w) => cleanWordToken(w.word)).join(' ');
          const phrase2 = words.slice(i + n, i + 2 * n).map((w) => cleanWordToken(w.word)).join(' ');

          if (phrase1 && phrase1 === phrase2) {
            const hasContent = words.slice(i, i + n).some((w) => !STOP_WORD_TOKENS.has(cleanWordToken(w.word)));
            if (hasContent) {
              const cutStart = words[i].start;
              const cutEnd = words[i + n].start;
              if (!isCutOverlapping(cutStart, cutEnd)) {
                wordCuts.push({
                  startIndex: i,
                  endIndex: i + n,
                  start: cutStart,
                  end: cutEnd,
                  reason: 'repeat',
                  text: words.slice(i, i + n).map((w) => w.word).join(' '),
                });
                repeatedTakesCount++;
                i += 2 * n;
                continue;
              }
            }
          }
          i++;
        }
      }
    }

    // Pass 3: Flawed tongue-twister / stumbled near-duplicate takes (e.g. "no getting quick rich promises" -> "no get rich quick promises")
    if (options.removeRepeats || options.removeFalseStarts) {
      for (let i = 0; i < words.length - 6; i++) {
        for (let len1 = 3; len1 <= 8; len1++) {
          for (let len2 = 3; len2 <= 8; len2++) {
            if (i + len1 + len2 > words.length) continue;
            const slice1 = words.slice(i, i + len1);
            const slice2 = words.slice(i + len1, i + len1 + len2);

            const stems1 = slice1.map((w) => stemWordToken(w.word)).filter((s) => s && !STOP_WORD_TOKENS.has(s));
            const stems2 = slice2.map((w) => stemWordToken(w.word)).filter((s) => s && !STOP_WORD_TOKENS.has(s));
            if (stems1.length < 2 || stems2.length < 2) continue;

            let matches = 0;
            const set2 = new Set(stems2);
            for (const s of stems1) {
              if (set2.has(s)) matches++;
            }

            const overlapRatio = matches / Math.max(stems1.length, stems2.length);
            if (overlapRatio >= 0.75) {
              const cutStart = slice1[0].start;
              const cutEnd = slice2[0].start;
              const already = wordCuts.some(
                (c) => (cutStart >= c.start && cutStart < c.end) || (cutEnd > c.start && cutEnd <= c.end)
              );
              if (!already) {
                wordCuts.push({
                  startIndex: i,
                  endIndex: i + len1,
                  start: cutStart,
                  end: cutEnd,
                  reason: 'mistake',
                  text: slice1.map((w) => w.word).join(' '),
                });
                repeatedTakesCount++;
              }
            }
          }
        }
      }
    }

    // Pass 4: False start restart (e.g. "so your files" -> "so your first financial goal")
    if (options.removeFalseStarts) {
      for (let i = 0; i < words.length - 5; i++) {
        for (let shortLen = 2; shortLen <= 4; shortLen++) {
          for (let longLen = shortLen + 2; longLen <= 10; longLen++) {
            if (i + shortLen + longLen > words.length) continue;
            const prefix1 = words.slice(i, i + 2).map((w) => cleanWordToken(w.word)).join(' ');
            const prefix2 = words.slice(i + shortLen, i + shortLen + 2).map((w) => cleanWordToken(w.word)).join(' ');
            const gapBetween = words[i + shortLen].start - words[i + shortLen - 1].end;
            if (gapBetween > 2.0) continue;

            if (prefix1 && prefix1 === prefix2) {
              const contentTail1 = words
                .slice(i + 2, i + shortLen)
                .map((w) => cleanWordToken(w.word))
                .filter((w) => !STOP_WORD_TOKENS.has(w));
              const contentTail2 = words
                .slice(i + shortLen + 2, i + shortLen + 4)
                .map((w) => cleanWordToken(w.word))
                .filter((w) => !STOP_WORD_TOKENS.has(w));

              if (!contentTail1.length || !contentTail2.length) continue;

              const isPhoneticStumble = contentTail1.some((t1) =>
                contentTail2.some((t2) => t1.slice(0, 2) === t2.slice(0, 2) || stemWordToken(t1) === stemWordToken(t2))
              );
              const isShortStutter = shortLen === 2;

              if (isPhoneticStumble || isShortStutter) {
                const cutStart = words[i].start;
                const cutEnd = words[i + shortLen].start;
                const already = wordCuts.some(
                  (c) => (cutStart >= c.start && cutStart < c.end) || (cutEnd > c.start && cutEnd <= c.end)
                );
                if (!already) {
                  wordCuts.push({
                    startIndex: i,
                    endIndex: i + shortLen,
                    start: cutStart,
                    end: cutEnd,
                    reason: 'mistake',
                    text: words.slice(i, i + shortLen).map((w) => w.word).join(' '),
                  });
                  repeatedTakesCount++;
                }
              }
            }
          }
        }
      }
    }

    // Pass 5: Interrupted Take Restart across gap (e.g. "so your first financial goal should be simple..." restarted)
    if (options.removeRepeats) {
      for (let n = 8; n >= 6; n--) {
        for (let i = 0; i <= words.length - n; i++) {
          const phraseI = words.slice(i, i + n).map((w) => cleanWordToken(w.word)).join(' ');
          if (!phraseI) continue;

          for (let j = i + n; j <= Math.min(words.length - n, i + n + 15); j++) {
            if (words[j].start - words[i].end > 25) break;
            const phraseJ = words.slice(j, j + n).map((w) => cleanWordToken(w.word)).join(' ');
            if (phraseI === phraseJ) {
              const cutStart = words[i].start;
              const cutEnd = words[j].start;
              const already = wordCuts.some(
                (c) => (cutStart >= c.start && cutStart < c.end) || (cutEnd > c.start && cutEnd <= c.end)
              );
              if (!already) {
                wordCuts.push({
                  startIndex: i,
                  endIndex: j,
                  start: cutStart,
                  end: cutEnd,
                  reason: 'repeat',
                  text: words.slice(i, j).map((w) => w.word).join(' '),
                });
                repeatedTakesCount++;
              }
            }
          }
        }
      }
    }

    wordCuts.sort((a, b) => a.start - b.start);
  }

  // Now create clean segments from words and wordCuts
  const segments: AudioCleanSegment[] = [];
  if (words.length > 0) {
    let wIdx = 0;
    let segCounter = 0;

    while (wIdx < words.length) {
      // Check if wIdx matches the start of a cut
      const matchingCut = wordCuts.find((c) => c.startIndex === wIdx);
      if (matchingCut) {
        segments.push({
          id: `seg-${segCounter++}`,
          start: matchingCut.start,
          end: matchingCut.end,
          text: matchingCut.text,
          action: 'cut',
          reason: matchingCut.reason,
        });
        wIdx = matchingCut.endIndex;
        continue;
      }

      // Collect words for a natural spoken sentence
      const curWords: string[] = [];
      const segStart = words[wIdx].start;
      let segEnd = words[wIdx].end;

      while (wIdx < words.length) {
        const nextIsCut = wordCuts.some((c) => c.startIndex === wIdx);
        if (nextIsCut && curWords.length > 0) break;

        const w = words[wIdx];
        curWords.push(w.word);
        segEnd = w.end;
        wIdx++;

        const isPunct = /[.?!]$/.test(w.word);
        const isPause = wIdx < words.length && words[wIdx].start - w.end > 0.4;
        const isSentenceEnd =
          curWords.length >= 12 && (isPunct || isPause || (wIdx < words.length && words[wIdx].start - w.end > 0.28));
        if (isSentenceEnd || (isPunct && curWords.length >= 4) || isPause) break;
      }

      if (curWords.length > 0) {
        segments.push({
          id: `seg-${segCounter++}`,
          start: segStart,
          end: segEnd,
          text: curWords.join(' '),
          action: 'keep',
        });
      }
    }
  } else if (rawSegments.length > 0) {
    rawSegments.forEach((s, idx) => {
      segments.push({
        id: `seg-${idx}`,
        start: Number(s.start || 0),
        end: Number(s.end || 0),
        text: String(s.text || '').trim(),
        action: 'keep',
      });
    });
  } else {
    segments.push({
      id: 'seg-0',
      start: 0,
      end: duration,
      text: fullText,
      action: 'keep',
    });
  }

  // Cross-segment retake check for segments
  // USER MANDATE: Automatically select and preserve the most natural, complete, and accurate take.
  // Never cut audio in a way that leaves a sentence incomplete.
  if (options.removeRepeats && segments.length > 1) {
    for (let i = 0; i < segments.length - 1; i++) {
      if (segments[i].action === 'cut') continue;
      const textI = cleanText(segments[i].text);
      const wordsI = textI.split(' ').filter(Boolean);
      if (wordsI.length < 3) continue;

      for (let j = i + 1; j < segments.length; j++) {
        if (segments[j].start - segments[i].end > 35) break;
        if (segments[j].action === 'cut') continue;

        const textJ = cleanText(segments[j].text);
        const wordsJ = textJ.split(' ').filter(Boolean);
        const sim = computePhraseSimilarity(textI, textJ);

        if (sim >= 0.65) {
          const hasPunctI = /[.!?]$/.test(segments[i].text.trim());
          const hasPunctJ = /[.!?]$/.test(segments[j].text.trim());

          // Check completeness of both takes
          const isJIncomplete = (!hasPunctJ && wordsJ.length < wordsI.length * 0.6) || wordsJ.length <= 3;
          const isIIncomplete = (!hasPunctI && wordsI.length < wordsJ.length * 0.6) || wordsI.length <= 3;

          if (isJIncomplete && !isIIncomplete) {
            // Cut take J (the incomplete attempt) and preserve take I (the complete take)!
            segments[j].action = 'cut';
            segments[j].reason = 'false-start';
            falseStartsCount++;
          } else {
            // Cut take I (earlier take/mistake) and preserve take J (the fresh complete take)!
            segments[i].action = 'cut';
            segments[i].reason = isIIncomplete ? 'false-start' : 'repeat';
            if (isIIncomplete) {
              falseStartsCount++;
            } else {
              repeatedTakesCount++;
            }
            break;
          }
        }
      }
    }
  }

  // 3. Detect Long Silences (> 1.1s between consecutive words)
  // USER MANDATE: Do not remove intentional pauses, natural breathing, emphasis, or natural speech patterns.
  // Preserve a generous 0.40s natural breathing headroom (0.20s after previous word + 0.20s before next word).
  const cutsFromSilence: CutInterval[] = [];
  if (options.removeSilence && words.length > 1) {
    for (let i = 0; i < words.length - 1; i++) {
      const gap = words[i + 1].start - words[i].end;
      if (gap > 1.1) {
        const cutStart = Number((words[i].end + 0.20).toFixed(3));
        const cutEnd = Number((words[i + 1].start - 0.20).toFixed(3));
        if (cutEnd > cutStart + 0.25) {
          cutsFromSilence.push({
            start: cutStart,
            end: cutEnd,
            reason: 'silence',
          });
          silenceCount++;
        }
      }
    }
  }

  // Calculate cut durations
  let totalCutSeconds = 0;
  for (const seg of segments) {
    if (seg.action === 'cut') {
      totalCutSeconds += Math.max(0, seg.end - seg.start);
    }
  }
  for (const s of cutsFromSilence) {
    totalCutSeconds += Math.max(0, s.end - s.start);
  }

  const estimatedCleanDuration = Math.max(1, Number((duration - totalCutSeconds).toFixed(1)));

  // Structure transcript into Headings (#H), Steps, and Explanations (or align with pasted script)
  let structuredBlocks: StructuredScriptBlock[] = [];
  let markdown = '';

  if (pastedScript && pastedScript.trim()) {
    const aligned = alignPastedScriptWithAudio(pastedScript.trim(), segments, words, options);
    structuredBlocks = aligned.blocks;
    markdown = aligned.alignedMarkdown;
    // update segment references from alignment
    for (let k = 0; k < segments.length; k++) {
      if (aligned.updatedSegments[k]) {
        segments[k].action = aligned.updatedSegments[k].action;
        segments[k].reason = aligned.updatedSegments[k].reason;
      }
    }
  } else {
    const structured = structureTranscriptIntoBlocks(segments, fullText);
    structuredBlocks = structured.blocks;
    markdown = structured.markdown;
  }

  let finalRepeats = 0;
  let finalMistakes = 0;
  let finalFalseStarts = 0;
  let finalFillers = fillerCount;

  for (const seg of segments) {
    if (seg.action === 'cut') {
      if (seg.reason === 'false-start') finalFalseStarts++;
      else if (seg.reason === 'mistake' || seg.reason === 'stumble') finalMistakes++;
      else if (seg.reason === 'filler') finalFillers++;
      else finalRepeats++;
    }
  }

  return {
    ok: true,
    transcript: fullText,
    segments,
    structuredBlocks,
    markdown,
    words,
    originalDuration: duration,
    estimatedCleanDuration,
    stats: {
      totalWords: words.length,
      repeatedTakesCount: finalRepeats,
      silenceCount,
      fillerCount: finalFillers,
      mistakesCount: finalMistakes,
      falseStartsCount: finalFalseStarts,
      stuttersCount,
      secondsSaved: Number(totalCutSeconds.toFixed(1)),
    },
  };
}

/**
 * Merge overlapping and contiguous cut intervals.
 */
function mergeCutIntervals(cuts: CutInterval[]): CutInterval[] {
  if (cuts.length <= 1) return cuts;
  const sorted = [...cuts].sort((a, b) => a.start - b.start);
  const merged: CutInterval[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const prev = merged[merged.length - 1];

    if (cur.start <= prev.end + 0.05) {
      prev.end = Math.max(prev.end, cur.end);
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

/**
 * Compute the inverted intervals to KEEP from total duration and cut intervals.
 */
function computeKeepIntervals(cuts: CutInterval[], totalDuration: number): Array<{ start: number; end: number }> {
  const mergedCuts = mergeCutIntervals(cuts.filter((c) => c.start < c.end && c.start >= 0));
  const keep: Array<{ start: number; end: number }> = [];

  let current = 0;
  for (const cut of mergedCuts) {
    if (cut.start > current + 0.1) {
      keep.push({ start: current, end: cut.start });
    }
    current = Math.max(current, cut.end);
  }

  if (current < totalDuration - 0.1) {
    keep.push({ start: current, end: totalDuration });
  }

  return keep;
}

/**
 * Process audio with FFmpeg:
 * - Cuts out retakes, mistakes, silences, and fillers
 * - Applies Volume Normalization (EBU R128 standard loudnorm)
 * - Applies Background Noise Reduction (afftdn) if enabled
 * - Uploads cleaned audio to S3 and returns signed URL
 */
export async function cleanAudioWithAI({
  mediaUrl,
  userId,
  options,
  transcript,
  customSegmentsToCut,
}: {
  mediaUrl: string;
  mediaKey?: string;
  userId: string;
  options: AudioCleanOptions;
  transcript?: any;
  customSegmentsToCut?: CutInterval[];
}): Promise<AudioCleanResult> {
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) {
    return { ok: false, error: 'FFmpeg media processor is not available.' };
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-audio-clean-'));
  const rawExt = path.extname(mediaUrl.split('?')[0] || '').toLowerCase() || '.mp3';
  const inputAudioPath = path.join(workDir, `input-audio${rawExt}`);
  const outputAudioPath = path.join(workDir, 'cleaned-audio.mp3');

  try {
    // 1. Download source audio
    const rawAudioBytes = await readMediaInput(mediaUrl);
    await writeFile(inputAudioPath, rawAudioBytes);

    // 2. Accurately probe media duration (avoids premature cutoffs for long audio)
    let duration = await probeAudioDuration(inputAudioPath);
    if (!duration || duration <= 0) {
      duration = Number(transcript?.durationSeconds || transcript?.duration || 0);
    }
    if (!duration || duration <= 0) {
      const words = transcript?.words || [];
      if (words.length > 0) {
        duration = Math.ceil(words[words.length - 1].end + 1);
      } else {
        duration = 60;
      }
    }

    // 3. Determine cut intervals
    let cuts: CutInterval[] = [];

    if (Array.isArray(customSegmentsToCut)) {
      cuts.push(...customSegmentsToCut);
    } else if (transcript) {
      const analysis = analyzeAudioScript(transcript, options);
      for (const seg of analysis.segments) {
        if (seg.action === 'cut') {
          cuts.push({
            start: seg.start,
            end: seg.end,
            reason: seg.reason || 'repeat',
            text: seg.text,
          });
        }
      }
    }

    // Always detect and remove awkward dead silences (>1.1s) if enabled
    // USER MANDATE: Do not remove intentional pauses or natural breathing.
    // Preserve 0.40s natural breathing headroom (0.20s after previous word + 0.20s before next word).
    if (options.removeSilence && transcript?.words && transcript.words.length > 1) {
      const words = transcript.words;
      for (let i = 0; i < words.length - 1; i++) {
        const gap = words[i + 1].start - words[i].end;
        if (gap > 1.1) {
          const cutStart = Number((words[i].end + 0.20).toFixed(3));
          const cutEnd = Number((words[i + 1].start - 0.20).toFixed(3));
          if (cutEnd > cutStart + 0.25) {
            cuts.push({ start: cutStart, end: cutEnd, reason: 'silence' });
          }
        }
      }
    }

    const keepIntervals = computeKeepIntervals(cuts, duration);

    // 4. Build FFmpeg filter chain
    const filterParts: string[] = [];
    let audioOutLabel = '0:a';

    // Splice cuts if any
    if (cuts.length > 0 && keepIntervals.length > 0) {
      if (keepIntervals.length === 1) {
        // Single segment keep: direct atrim without concat overhead
        filterParts.push(
          `[0:a]atrim=start=${keepIntervals[0].start.toFixed(3)}:end=${keepIntervals[0].end.toFixed(3)},asetpts=PTS-STARTPTS[acut]`
        );
        audioOutLabel = 'acut';
      } else {
        const concatInputs: string[] = [];
        keepIntervals.forEach((interval, idx) => {
          filterParts.push(
            `[0:a]atrim=start=${interval.start.toFixed(3)}:end=${interval.end.toFixed(3)},asetpts=PTS-STARTPTS[a${idx}]`
          );
          concatInputs.push(`[a${idx}]`);
        });
        filterParts.push(`${concatInputs.join('')}concat=n=${keepIntervals.length}:v=0:a=1[acut]`);
        audioOutLabel = 'acut';
      }
    }

    // Background Noise Reduction (Studio Broadcast Multi-Stage Chain)
    if (options.noiseReduction) {
      filterParts.push(
        `[${audioOutLabel}]highpass=f=80,lowpass=f=12000,afftdn=nr=18:nf=-30:tn=1,agate=threshold=0.015:ratio=3:range=0.05:attack=10:release=150,equalizer=f=3000:t=q:w=1:g=2,equalizer=f=400:t=q:w=1:g=-2[anoise]`
      );
      audioOutLabel = 'anoise';
    }

    // Playback Speed Adjustment (1.0x, 1.25x, 1.5x with pitch-preservation)
    const speed =
      typeof options.playbackSpeed === 'number' && options.playbackSpeed > 0
        ? options.playbackSpeed
        : typeof options.speed === 'number' && options.speed > 0
          ? options.speed
          : 1.0;
    if (speed !== 1.0) {
      filterParts.push(`[${audioOutLabel}]atempo=${speed.toFixed(2)}[aspeed]`);
      audioOutLabel = 'aspeed';
    }

    // Voice Volume Normalization (EBU R128 Standard)
    if (options.volumeNormalize) {
      filterParts.push(`[${audioOutLabel}]loudnorm=I=-16:TP=-1.5:LRA=11[anorm]`);
      audioOutLabel = 'anorm';
    }

    // 5. Run FFmpeg command
    const ffmpegArgs: string[] = ['-y', '-i', inputAudioPath, '-vn'];

    if (filterParts.length > 0) {
      ffmpegArgs.push('-filter_complex', filterParts.join('; '));
      ffmpegArgs.push('-map', `[${audioOutLabel}]`);
    } else {
      ffmpegArgs.push('-map', '0:a');
    }

    ffmpegArgs.push(
      '-c:a', 'libmp3lame',
      '-b:a', '256k',
      '-ar', '48000',
      '-id3v2_version', '3',
      '-write_xing', '1',
      outputAudioPath
    );

    console.log('[AUDIO_CLEAN] Running FFmpeg with filters:', filterParts.length, 'speed:', speed);
    await runFfmpeg(ffmpegPath, ffmpegArgs);

    // 5. Read processed audio and upload to S3
    const cleanedBytes = await readFile(outputAudioPath);
    const { key } = await uploadTemporaryMediaObject({
      body: cleanedBytes,
      contentType: 'audio/mpeg',
      fileName: speed !== 1.0 ? `cleaned-audio-${speed}x.mp3` : 'cleaned-audio.mp3',
      mode: 'audio',
      userId,
      purpose: 'audio-clean',
    });

    const outputUrl = await createReadUrl(key, 48 * 60 * 60);

    const secondsSaved = cuts.reduce((sum, c) => sum + Math.max(0, c.end - c.start), 0);
    const probedOutputDuration = await probeAudioDuration(outputAudioPath);
    const cleanedDuration = probedOutputDuration && probedOutputDuration > 0
      ? probedOutputDuration
      : Math.max(1, Number(((duration - secondsSaved) / speed).toFixed(1)));

    return {
      ok: true,
      outputUrl,
      originalDuration: duration,
      cleanedDuration,
      removedSegments: cuts.length,
      stats: {
        repeatedTakesCut: cuts.filter((c) => c.reason === 'repeat' || c.reason === 'mistake').length,
        silencesCut: cuts.filter((c) => c.reason === 'silence').length,
        fillersCut: cuts.filter((c) => c.reason === 'filler').length,
        durationSavedSeconds: Number(secondsSaved.toFixed(1)),
      },
    };
  } catch (error) {
    console.error('[AUDIO_CLEAN] Processing failed:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Audio processing failed.',
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
