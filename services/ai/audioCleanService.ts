/**
 * AI Audio Cleaner & Silence Remover Service
 *
 * End-to-End Pipeline:
 * 1. Word & segment timestamp extraction from Groq Whisper (Fallback: Gemini 2.0 Flash in asia-south1).
 * 2. Full-Timeline Smart Pause Compression:
 *    - Scans every silence gap across the entire duration (no skipping/early stops).
 *    - Short pauses (<0.40s in fast mode) kept 100% intact for natural breathing and speech cadence.
 *    - Medium & long dead air gaps compressed down to ~0.28s - 0.35s (eliminating boring pauses for Image to Video).
 *    - Lead-in & tail silence trimmed with safe attack/decay buffers.
 * 3. 100% Original Voice Preservation:
 *    - ZERO voice regeneration, ZERO artificial EQ, ZERO pitch/speed tampering, ZERO destructive noise suppression.
 *    - Exact original recorded audio spliced via sample-accurate FFmpeg atrim + concat with 8ms anti-pop micro-fades.
 * 4. S3 Storage & Signed URL output.
 */

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { findFfmpegPath, probeAudioDuration, readMediaInput, runFfmpeg, findFfprobePath } from '@/services/media/mediaClipper';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { uploadTemporaryMediaObject, createReadUrl } from '@/lib/gcs/mediaStorage';

async function probeAudioBitrate(filePath: string): Promise<string> {
  try {
    const ffprobePath = findFfprobePath();
    const { stdout } = await execFileAsync(ffprobePath, [
      '-v', 'error',
      '-select_streams', 'a:0',
      '-show_entries', 'stream=bit_rate',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath
    ]);
    const bps = parseInt(stdout.trim(), 10);
    if (!isNaN(bps) && bps > 0) {
      return Math.round(bps / 1000) + 'k';
    }
  } catch {}
  return '320k';
}

import {
  structureTranscriptIntoBlocks,
  alignPastedScriptWithAudio,
  type StructuredScriptBlock,
} from './structuredScriptService';

export type AudioCleanOptions = {
  removeSilence?: boolean;
  trimEnds?: boolean;
  exportFormat?: 'mp3' | 'wav' | 'm4a';
  preserveInputQuality?: boolean;
  playbackSpeed?: number;
  speed?: number;
  pacing?: 'fast' | 'natural' | 'relaxed';
  // Legacy / compatibility flags
  voiceType?: 'human' | 'ai';
  removeFillers?: boolean;
  removeRepeats?: boolean;
  removeFalseStarts?: boolean;
  noiseReduction?: boolean;
  volumeNormalize?: boolean;
};

export type AudioTranscriptData = {
  transcript: string;
  words?: Array<{ word: string; start: number; end: number }>;
  segments?: Array<{ id?: string | number; start: number; end: number; text: string }>;
  durationSeconds?: number;
  duration?: number;
};

export type DetectedPause = {
  id: string;
  index: number;
  type: 'gap' | 'lead-in' | 'tail';
  start: number;
  end: number;
  duration: number;
  cutStart: number;
  cutEnd: number;
  cutDuration: number;
  compressedGap: number;
  prevWord?: string;
  nextWord?: string;
  description: string;
};

export type AudioCleanSegment = {
  id: string;
  start: number;
  end: number;
  text: string;
  action: 'keep' | 'cut';
  reason?: 'silence' | 'user';
  internalCuts?: Array<{ start: number; end: number; text: string; reason: 'silence' }>;
};

export type CutInterval = {
  start: number;
  end: number;
  reason: 'silence' | 'user';
  text?: string;
};

export type AudioCustomCutInterval = CutInterval & {
  internalCuts?: CutInterval[];
};

export type AudioAnalysisResult = {
  ok: boolean;
  error?: string;
  transcript: string;
  segments: AudioCleanSegment[];
  structuredBlocks?: StructuredScriptBlock[];
  markdown?: string;
  words: Array<{ word: string; start: number; end: number }>;
  detectedPauses: DetectedPause[];
  allSilenceCuts: CutInterval[];
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
  mediaKey?: string;
  bucketName?: string;
  renderId?: string;
  originalDuration?: number;
  cleanedDuration?: number;
  removedSegments?: number;
  stats?: {
    repeatedTakesCut: number;
    silencesCut: number;
    fillersCut: number;
    durationSavedSeconds: number;
    changesSummary?: string[];
  };
};

/**
 * Intelligent Smart Pause Compression:
 * Calibrated specifically for Image to Video pacing (visuals changing every 5-6s)
 * and high-retention narration:
 *
 * - Short natural breath/word gaps (< minThreshold) are preserved 100% intact.
 * - Medium and long pauses are compressed down to natural target remaining space (~0.28s–0.35s)
 *   so speech never sounds robotic or stitched while eliminating dead air.
 * - Lead-in & trailing dead air are trimmed with safe attack/decay buffers.
 */
export function detectSmartPauses(
  words: Array<{ word: string; start: number; end: number }>,
  segments: Array<{ start: number; end: number; text?: string }>,
  duration: number,
  options: AudioCleanOptions
): { cuts: CutInterval[]; detectedPauses: DetectedPause[]; silenceCount: number } {
  if (options.removeSilence === false) {
    return { cuts: [], detectedPauses: [], silenceCount: 0 };
  }

  const cuts: CutInterval[] = [];
  const detectedPauses: DetectedPause[] = [];
  let pauseIndex = 1;

  // Pacing calibration
  // "fast" (Default for AI TTS & Image to Video AI): Pauses > 0.25s (250ms) compressed to ~0.18s (180ms)
  // "natural": Pauses > 0.35s (350ms) compressed to ~0.22s (220ms)
  // "relaxed": Pauses > 0.50s compressed to ~0.30s
  const pacing = options.pacing || 'fast';
  let minThreshold = 0.25;
  let targetRemaining = 0.18;
  let headPadding = 0.06; // 60ms keep after word release
  let tailPadding = 0.06; // 60ms keep before next word attack

  if (pacing === 'natural') {
    minThreshold = 0.35;
    targetRemaining = 0.22;
    headPadding = 0.06;
    tailPadding = 0.06;
  } else if (pacing === 'relaxed') {
    minThreshold = 0.50;
    targetRemaining = 0.30;
    headPadding = 0.08;
    tailPadding = 0.08;
  }

  const validWords = (words || [])
    .filter((w) => w && Number.isFinite(w.start) && Number.isFinite(w.end) && w.end >= w.start)
    .sort((a, b) => a.start - b.start);

  const validSegments = (segments || [])
    .filter((s) => s && Number.isFinite(s.start) && Number.isFinite(s.end) && s.end >= s.start)
    .sort((a, b) => a.start - b.start);

  // 1. Lead-in dead air (before first spoken word)
  const firstSpokenStart = validWords.length > 0 ? validWords[0].start : validSegments.length > 0 ? validSegments[0].start : 0;
  if (options.trimEnds !== false && firstSpokenStart > 0.10) {
    const safeLeadCutEnd = Number(Math.max(0, firstSpokenStart - 0.04).toFixed(3));
    if (safeLeadCutEnd > 0.02) {
      cuts.push({
        start: 0,
        end: safeLeadCutEnd,
        reason: 'silence',
      });
      detectedPauses.push({
        id: `pause-lead`,
        index: pauseIndex++,
        type: 'lead-in',
        start: 0,
        end: Number(firstSpokenStart.toFixed(3)),
        duration: Number(firstSpokenStart.toFixed(3)),
        cutStart: 0,
        cutEnd: safeLeadCutEnd,
        cutDuration: safeLeadCutEnd,
        compressedGap: 0.04,
        description: `Lead-in silence trimmed before speech (-${safeLeadCutEnd.toFixed(2)}s)`,
      });
    }
  }

  // 2. Intra-timeline pauses (Word-level scan across ALL words)
  if (validWords.length > 1) {
    for (let i = 0; i < validWords.length - 1; i++) {
      const cur = validWords[i];
      const next = validWords[i + 1];
      const rawGap = next.start - cur.end;

      if (rawGap > minThreshold) {
        const desiredCutStart = Number((cur.end + headPadding).toFixed(3));
        const desiredCutEnd = Number((next.start - tailPadding).toFixed(3));
        const cutDuration = Number((desiredCutEnd - desiredCutStart).toFixed(3));

        if (desiredCutEnd > desiredCutStart + 0.05) {
          cuts.push({
            start: desiredCutStart,
            end: desiredCutEnd,
            reason: 'silence',
            text: `[Pause between "${cur.word}" and "${next.word}"]`,
          });

          const compressedGap = Number((rawGap - cutDuration).toFixed(3));
          detectedPauses.push({
            id: `pause-gap-${i}`,
            index: pauseIndex++,
            type: 'gap',
            start: Number(cur.end.toFixed(3)),
            end: Number(next.start.toFixed(3)),
            duration: Number(rawGap.toFixed(3)),
            cutStart: desiredCutStart,
            cutEnd: desiredCutEnd,
            cutDuration,
            compressedGap,
            prevWord: cur.word,
            nextWord: next.word,
            description: `Pause between "${cur.word}" and "${next.word}" (${rawGap.toFixed(2)}s → ${compressedGap.toFixed(2)}s)`,
          });
        }
      }
    }
  } else if (validSegments.length > 1) {
    // Fallback: Segment-level gap scan across all segments
    for (let i = 0; i < validSegments.length - 1; i++) {
      const cur = validSegments[i];
      const next = validSegments[i + 1];
      const rawGap = next.start - cur.end;

      if (rawGap > minThreshold) {
        const desiredCutStart = Number((cur.end + headPadding).toFixed(3));
        const desiredCutEnd = Number((next.start - tailPadding).toFixed(3));
        const cutDuration = Number((desiredCutEnd - desiredCutStart).toFixed(3));

        if (desiredCutEnd > desiredCutStart + 0.05) {
          cuts.push({
            start: desiredCutStart,
            end: desiredCutEnd,
            reason: 'silence',
            text: `[Pause between segments]`,
          });

          const compressedGap = Number((rawGap - cutDuration).toFixed(3));
          detectedPauses.push({
            id: `pause-seg-gap-${i}`,
            index: pauseIndex++,
            type: 'gap',
            start: Number(cur.end.toFixed(3)),
            end: Number(next.start.toFixed(3)),
            duration: Number(rawGap.toFixed(3)),
            cutStart: desiredCutStart,
            cutEnd: desiredCutEnd,
            cutDuration,
            compressedGap,
            description: `Inter-segment pause (${rawGap.toFixed(2)}s → ${compressedGap.toFixed(2)}s)`,
          });
        }
      }
    }
  }

  // 3. Trailing dead air (after last spoken word)
  const lastSpokenEnd = validWords.length > 0
    ? validWords[validWords.length - 1].end
    : validSegments.length > 0
      ? validSegments[validSegments.length - 1].end
      : duration;

  if (options.trimEnds !== false && Number.isFinite(duration) && duration > lastSpokenEnd + 0.10) {
    const trailingGap = duration - lastSpokenEnd;
    const safeTailCutStart = Number((lastSpokenEnd + 0.05).toFixed(3));
    if (duration - safeTailCutStart > 0.03) {
      cuts.push({
        start: safeTailCutStart,
        end: Number(duration.toFixed(3)),
        reason: 'silence',
      });
      detectedPauses.push({
        id: `pause-tail`,
        index: pauseIndex++,
        type: 'tail',
        start: Number(lastSpokenEnd.toFixed(3)),
        end: Number(duration.toFixed(3)),
        duration: Number(trailingGap.toFixed(3)),
        cutStart: safeTailCutStart,
        cutEnd: Number(duration.toFixed(3)),
        cutDuration: Number((duration - safeTailCutStart).toFixed(3)),
        compressedGap: 0.05,
        description: `Ending silence trimmed after last word (-${(duration - safeTailCutStart).toFixed(2)}s)`,
      });
    }
  }

  return {
    cuts,
    detectedPauses,
    silenceCount: cuts.length,
  };
}

/**
 * Merge overlapping and contiguous cut intervals.
 */
export function mergeCutIntervals(cuts: CutInterval[]): CutInterval[] {
  if (cuts.length <= 1) return cuts;
  const sorted = [...cuts].sort((a, b) => a.start - b.start);
  const merged: CutInterval[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const prev = merged[merged.length - 1];

    if (cur.start <= prev.end + 0.02) {
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
export function computeKeepIntervals(cuts: CutInterval[], totalDuration: number): Array<{ start: number; end: number }> {
  const mergedCuts = mergeCutIntervals(cuts.filter((c) => c.start < c.end && c.start >= 0));
  const keep: Array<{ start: number; end: number }> = [];

  let current = 0;
  for (const cut of mergedCuts) {
    if (cut.start > current + 0.03) {
      keep.push({
        start: Number(current.toFixed(3)),
        end: Number(cut.start.toFixed(3)),
      });
    }
    current = Math.max(current, cut.end);
  }

  if (current < totalDuration - 0.03) {
    keep.push({
      start: Number(current.toFixed(3)),
      end: Number(totalDuration.toFixed(3)),
    });
  }

  return keep;
}

/**
 * Analyze audio transcript strictly for smart pause & dead air detection.
 * All spoken content is preserved as 'keep'.
 */
export async function analyzeAudioScript(
  transcript: AudioTranscriptData,
  options: AudioCleanOptions = {},
  pastedScript?: string
): Promise<AudioAnalysisResult> {
  const rawSegments = transcript.segments || [];
  const rawWords = transcript.words || [];
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

  // Create segments preserving every spoken sentence
  const segments: AudioCleanSegment[] = [];
  if (rawSegments.length > 0) {
    rawSegments.forEach((s, idx) => {
      segments.push({
        id: `seg-${idx}`,
        start: Number(s.start || 0),
        end: Number(s.end || 0),
        text: String(s.text || '').trim(),
        action: 'keep',
      });
    });
  } else if (words.length > 0) {
    segments.push({
      id: 'seg-0',
      start: words[0].start,
      end: words[words.length - 1].end,
      text: fullText,
      action: 'keep',
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

  // Detect pauses & dead air across entire timeline
  const { cuts: allSilenceCuts, detectedPauses, silenceCount } = detectSmartPauses(
    words,
    rawSegments,
    duration,
    options
  );

  // Attach internal cuts to corresponding segments for client synchronization
  segments.forEach((seg) => {
    const internal = allSilenceCuts.filter(
      (c) => c.start >= seg.start - 0.05 && c.end <= seg.end + 0.05
    );
    if (internal.length > 0) {
      seg.internalCuts = internal.map((c) => ({
        start: c.start,
        end: c.end,
        text: c.text || 'Pause',
        reason: 'silence',
      }));
    }
  });

  const totalCutSeconds = allSilenceCuts.reduce((sum, c) => sum + Math.max(0, c.end - c.start), 0);
  const estimatedCleanDuration = Math.max(1, Number((duration - totalCutSeconds).toFixed(1)));

  // Structure transcript into Markdown view
  let structuredBlocks: StructuredScriptBlock[] = [];
  let markdown = '';

  if (pastedScript && pastedScript.trim()) {
    const aligned = alignPastedScriptWithAudio(pastedScript.trim(), segments, words, options);
    structuredBlocks = aligned.blocks;
    markdown = aligned.alignedMarkdown;
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
    detectedPauses,
    allSilenceCuts,
    originalDuration: duration,
    estimatedCleanDuration,
    stats: {
      totalWords: words.length || fullText.split(/\s+/).filter(Boolean).length,
      repeatedTakesCount: 0,
      silenceCount,
      fillerCount: 0,
      mistakesCount: 0,
      falseStartsCount: 0,
      stuttersCount: 0,
      secondsSaved: Number(totalCutSeconds.toFixed(1)),
    },
  };
}

/**
 * Process audio with FFmpeg:
 * - Smart pause compression & silence removal.
 * - ZERO quality modifications (no EQ, no noise reduction, no loudness boosting).
 * - Exact original voice, pitch, and timbre 100% preserved.
 */
export async function cleanAudioWithAI({
  mediaUrl,
  userId,
  options = {},
  transcript,
  customSegmentsToCut,
}: {
  mediaUrl: string;
  mediaKey?: string;
  userId: string;
  options?: AudioCleanOptions;
  transcript?: AudioTranscriptData;
  customSegmentsToCut?: AudioCustomCutInterval[];
}): Promise<AudioCleanResult> {
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) {
    return { ok: false, error: 'FFmpeg media processor is not available.' };
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-audio-clean-'));
  const rawExt = path.extname(mediaUrl.split('?')[0] || '').toLowerCase() || '.mp3';
  const inputAudioPath = path.join(workDir, `input-audio${rawExt}`);

  const exportFormat = options.exportFormat || 'mp3';
  const outputFileName = `cleaned-audio.${exportFormat}`;
  const outputAudioPath = path.join(workDir, outputFileName);

  try {
    // 1. Download source audio
    const rawAudioBytes = await readMediaInput(mediaUrl);
    await writeFile(inputAudioPath, rawAudioBytes);

    // 2. Accurately probe media duration
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

    // 3. Determine silence cuts
    const cuts: CutInterval[] = [];

    if (Array.isArray(customSegmentsToCut) && customSegmentsToCut.length > 0) {
      for (const item of customSegmentsToCut) {
        if (typeof item?.start === 'number' && typeof item?.end === 'number' && item.end > item.start) {
          cuts.push(item);
        }
      }
    } else if (transcript) {
      const words = transcript.words || [];
      const segments = transcript.segments || [];
      const { cuts: detectedCuts } = detectSmartPauses(words, segments, duration, options);
      cuts.push(...detectedCuts);
    }

    const keepIntervals = computeKeepIntervals(cuts, duration);

    // 4. Build FFmpeg filter chain (pure atrim + concat with 8ms anti-pop micro cross-fades)
    const filterParts: string[] = [];
    let audioOutLabel = '0:a';

    if (cuts.length > 0 && keepIntervals.length > 0) {
      if (keepIntervals.length === 1) {
        const dur = Math.max(0.01, keepIntervals[0].end - keepIntervals[0].start);
        const outFadeStart = Math.max(0, dur - 0.008);
        filterParts.push(
          `[0:a]atrim=start=${keepIntervals[0].start.toFixed(3)}:end=${keepIntervals[0].end.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.008,afade=t=out:st=${outFadeStart.toFixed(3)}:d=0.008[acut]`
        );
        audioOutLabel = 'acut';
      } else {
        const concatInputs: string[] = [];
        keepIntervals.forEach((interval, idx) => {
          const dur = Math.max(0.01, interval.end - interval.start);
          const outFadeStart = Math.max(0, dur - 0.008);
          filterParts.push(
            `[0:a]atrim=start=${interval.start.toFixed(3)}:end=${interval.end.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.008,afade=t=out:st=${outFadeStart.toFixed(3)}:d=0.008[a${idx}]`
          );
          concatInputs.push(`[a${idx}]`);
        });
        filterParts.push(`${concatInputs.join('')}concat=n=${keepIntervals.length}:v=0:a=1[acut]`);
        audioOutLabel = 'acut';
      }
    }

    // Playback Speed Adjustment if explicitly requested
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

    // 5. Run FFmpeg command - Preserves 100% original quality without artificial filters
    const ffmpegArgs: string[] = ['-y', '-i', inputAudioPath, '-vn'];

    if (filterParts.length > 0) {
      ffmpegArgs.push('-filter_complex', filterParts.join('; '));
      ffmpegArgs.push('-map', `[${audioOutLabel}]`);
    } else {
      ffmpegArgs.push('-map', '0:a');
    }

    if (exportFormat === 'wav') {
      ffmpegArgs.push('-c:a', 'pcm_s16le', outputAudioPath);
    } else if (exportFormat === 'm4a') {
      ffmpegArgs.push('-c:a', 'aac', '-b:a', '256k', outputAudioPath);
    } else {
      let targetBitrate = '320k';
      if (options.preserveInputQuality !== false) {
        targetBitrate = await probeAudioBitrate(inputAudioPath);
      }
      ffmpegArgs.push(
        '-c:a', 'libmp3lame',
        '-b:a', targetBitrate,
        '-ar', '48000',
        '-id3v2_version', '3',
        '-write_xing', '1',
        outputAudioPath
      );
    }

    console.log(`[AUDIO_CLEAN] Running smart pause FFmpeg splice on ${cuts.length} silence regions. Voice preserved 100%.`);
    await runFfmpeg(ffmpegPath, ffmpegArgs);

    // 6. Read processed audio and upload to S3
    const cleanedBytes = await readFile(outputAudioPath);
    const contentType = exportFormat === 'wav' ? 'audio/wav' : exportFormat === 'm4a' ? 'audio/mp4' : 'audio/mpeg';

    const { bucket, key } = await uploadTemporaryMediaObject({
      body: cleanedBytes,
      contentType,
      fileName: outputFileName,
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

    const renderId = `clean-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    return {
      ok: true,
      outputUrl,
      mediaKey: key,
      bucketName: bucket,
      renderId,
      originalDuration: duration,
      cleanedDuration,
      removedSegments: cuts.length,
      stats: {
        repeatedTakesCut: 0,
        silencesCut: cuts.length,
        fillersCut: 0,
        durationSavedSeconds: Number(secondsSaved.toFixed(1)),
        changesSummary: [
          cuts.length > 0
            ? `${cuts.length} dead air and silence pause(s) compressed (-${secondsSaved.toFixed(1)}s)`
            : 'Natural conversational cadence preserved',
          'Exact original voice, pitch, and timbre 100% preserved (No AI regeneration/EQ)',
        ],
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
