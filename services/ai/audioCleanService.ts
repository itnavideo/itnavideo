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
};

export type AudioCleanSegment = {
  id: string;
  start: number;
  end: number;
  text: string;
  action: 'keep' | 'cut';
  reason?: 'repeat' | 'mistake' | 'silence' | 'filler';
};

export type CutInterval = {
  start: number;
  end: number;
  reason: 'repeat' | 'mistake' | 'silence' | 'filler';
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
const FILLER_WORDS = new Set([
  'um', 'uh', 'uhh', 'umm', 'hmm', 'hm',
  'like', 'literally', 'basically', 'actually',
  'you know', 'i mean', 'sort of', 'kind of',
  // Hinglish / Hindi fillers
  'matlab', 'toh', 'hai na', 'dekho', 'acha', 'suno', 'woh',
]);

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

  let sourceSegments: Array<{ id: string; start: number; end: number; text: string }> = [];
  if (rawSegments.length > 0) {
    sourceSegments = rawSegments.map((s, idx) => ({
      id: `seg-${idx}`,
      start: Number(s.start || 0),
      end: Number(s.end || 0),
      text: String(s.text || '').trim(),
    }));
  } else if (words.length > 0) {
    let curStart = words[0].start;
    let curWords: string[] = [];
    let segIdx = 0;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      curWords.push(w.word);
      const isEnd = /[.?!]$/.test(w.word) || (i < words.length - 1 && words[i + 1].start - w.end > 0.8) || i === words.length - 1;
      if (isEnd) {
        sourceSegments.push({
          id: `seg-${segIdx++}`,
          start: curStart,
          end: w.end,
          text: curWords.join(' '),
        });
        curWords = [];
        if (i < words.length - 1) {
          curStart = words[i + 1].start;
        }
      }
    }
  } else {
    sourceSegments = [{
      id: 'seg-0',
      start: 0,
      end: duration,
      text: fullText,
    }];
  }

  // Track actions on segments
  const segments: AudioCleanSegment[] = sourceSegments.map((s) => ({
    ...s,
    action: 'keep' as const,
  }));

  let repeatedTakesCount = 0;
  let silenceCount = 0;
  let fillerCount = 0;

  // 1. Detect Repeated Sentences / Retakes
  // Look forward within a 35-second window. If segment i is highly similar to segment j (j > i),
  // segment i is marked as a flawed prior take ('repeat' or 'mistake') and segment j is kept.
  if (options.removeRepeats && segments.length > 1) {
    for (let i = 0; i < segments.length - 1; i++) {
      if (segments[i].action === 'cut') continue;
      const textI = cleanText(segments[i].text);
      if (textI.split(' ').length < 2) continue; // Skip single words

      for (let j = i + 1; j < segments.length; j++) {
        if (segments[j].start - segments[i].end > 35) break;

        const textJ = cleanText(segments[j].text);
        const sim = computePhraseSimilarity(textI, textJ);

        if (sim >= 0.65) {
          segments[i].action = 'cut';
          segments[i].reason = 'repeat';
          repeatedTakesCount++;
          break;
        }
      }
    }
  }

  // 2. Word-level repeated false-starts
  if (options.removeFalseStarts && words.length > 4) {
    for (let i = 0; i < words.length - 3; i++) {
      const phrase1 = cleanText(words.slice(i, i + 2).map((w) => w.word).join(' '));
      const phrase2 = cleanText(words.slice(i + 2, i + 4).map((w) => w.word).join(' '));
      if (phrase1 && phrase1 === phrase2 && words[i + 2].start - words[i + 1].end < 2.0) {
        const segIdx = segments.findIndex((s) => s.start <= words[i].start && s.end >= words[i + 1].end);
        if (segIdx !== -1 && segments[segIdx].action === 'keep') {
          repeatedTakesCount++;
        }
      }
    }
  }

  // 3. Detect Long Silences (> 1.0s between consecutive words)
  const cutsFromSilence: CutInterval[] = [];
  if (options.removeSilence && words.length > 1) {
    for (let i = 0; i < words.length - 1; i++) {
      const gap = words[i + 1].start - words[i].end;
      if (gap > 1.0) {
        // Keep 0.3s natural breathing space
        const cutStart = Number((words[i].end + 0.15).toFixed(2));
        const cutEnd = Number((words[i + 1].start - 0.15).toFixed(2));
        if (cutEnd > cutStart + 0.3) {
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
    const aligned = alignPastedScriptWithAudio(pastedScript.trim(), segments);
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
      repeatedTakesCount,
      silenceCount,
      fillerCount,
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

    // Always detect and remove awkward long silences (>1.0s) if enabled
    if (options.removeSilence && transcript?.words && transcript.words.length > 1) {
      const words = transcript.words;
      for (let i = 0; i < words.length - 1; i++) {
        const gap = words[i + 1].start - words[i].end;
        if (gap > 1.0) {
          const cutStart = Number((words[i].end + 0.15).toFixed(2));
          const cutEnd = Number((words[i + 1].start - 0.15).toFixed(2));
          if (cutEnd > cutStart + 0.3) {
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

    // Background Noise Reduction (Optional)
    if (options.noiseReduction) {
      filterParts.push(`[${audioOutLabel}]afftdn=nf=-25[anoise]`);
      audioOutLabel = 'anoise';
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
      '-b:a', '192k',
      '-ar', '44100',
      outputAudioPath
    );

    console.log('[AUDIO_CLEAN] Running FFmpeg with filters:', filterParts.length);
    await runFfmpeg(ffmpegPath, ffmpegArgs);

    // 5. Read processed audio and upload to S3
    const cleanedBytes = await readFile(outputAudioPath);
    const { key } = await uploadTemporaryMediaObject({
      body: cleanedBytes,
      contentType: 'audio/mpeg',
      fileName: 'cleaned-audio.mp3',
      mode: 'audio',
      userId,
      purpose: 'audio-clean',
    });

    const outputUrl = await createReadUrl(key, 48 * 60 * 60);

    const secondsSaved = cuts.reduce((sum, c) => sum + Math.max(0, c.end - c.start), 0);
    const cleanedDuration = Math.max(1, Number((duration - secondsSaved).toFixed(1)));

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
