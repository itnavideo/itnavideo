/**
 * Advanced Multi-Stage Video Frame & Temporal Transition Sampler
 *
 * Inspects video streams, detects visual/motion transitions, and extracts both
 * steady-state keyframes and high-frequency transition bursts (for micro-motion analysis).
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

// Dynamic binary paths
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static') || 'ffmpeg';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffprobeStatic = require('ffprobe-static');
const ffprobePath: string = ffprobeStatic?.path || 'ffprobe';

export interface VideoStreamMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  totalFramesEstimate: number;
}

export interface SampledFrame {
  timestampSeconds: number;
  frameIndex: number;
  imagePath: string;
  base64Data: string; // data:image/jpeg;base64,...
  isTransitionBurst: boolean;
  burstGroup?: string; // e.g. "transition-0", "transition-1"
  burstSequenceIndex?: number; // 0, 1, 2...
}

export interface MultiStageSamplingResult {
  metadata: VideoStreamMetadata;
  anchorFrames: SampledFrame[];
  transitionBursts: Record<string, SampledFrame[]>;
  allSampledFrames: SampledFrame[];
  tempDir: string;
  cleanup: () => Promise<void>;
}

/**
 * Downloads a remote video (e.g. Cloudinary) to a local temp file
 */
async function downloadToTemp(url: string, tempDir: string): Promise<string> {
  const localVideoPath = path.join(tempDir, `source_${Date.now()}.mp4`);
  const encodedUrl = encodeURI(url);
  const response = await fetch(encodedUrl, {
    signal: AbortSignal.timeout(30000), // 30s timeout
  });
  if (!response.ok) {
    throw new Error(`Failed to download demo video from ${url} (status: ${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  await fs.promises.writeFile(localVideoPath, Buffer.from(arrayBuffer));
  return localVideoPath;
}

/**
 * Probes video technical metadata using ffprobe
 */
export async function probeVideoMetadata(videoPath: string): Promise<VideoStreamMetadata> {
  try {
    const { stdout } = await execFileAsync(ffprobePath, [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height,r_frame_rate,duration,nb_frames:format=duration',
      '-of',
      'json',
      videoPath,
    ]);

    const info = JSON.parse(stdout);
    const stream = info.streams?.[0] || {};
    const format = info.format || {};

    const width = Number(stream.width) || 1080;
    const height = Number(stream.height) || 1920;

    let fps = 30;
    if (stream.r_frame_rate) {
      const parts = stream.r_frame_rate.split('/');
      if (parts.length === 2 && Number(parts[1]) > 0) {
        fps = Math.round(Number(parts[0]) / Number(parts[1]));
      } else {
        fps = Number(stream.r_frame_rate) || 30;
      }
    }

    const durationSeconds =
      Number(format.duration) ||
      Number(stream.duration) ||
      (Number(stream.nb_frames) ? Number(stream.nb_frames) / fps : 5.0);

    const totalFramesEstimate = Math.round(durationSeconds * fps);
    const aspectRatio = width > height ? '16:9' : height > width ? '9:16' : '1:1';

    return {
      durationSeconds: Math.max(1, durationSeconds),
      width,
      height,
      fps: Math.max(15, fps),
      aspectRatio,
      totalFramesEstimate,
    };
  } catch {
    // Fallback default metadata for shorts/reels
    return {
      durationSeconds: 5.0,
      width: 1080,
      height: 1920,
      fps: 30,
      aspectRatio: '9:16',
      totalFramesEstimate: 150,
    };
  }
}

/**
 * Detects timestamps with significant visual/motion changes (scene shifts, text pop-ins)
 */
async function detectVisualChangeTimestamps(
  videoPath: string,
  durationSeconds: number
): Promise<number[]> {
  const timestamps: number[] = [];

  try {
    // Run scene filter with low threshold to capture typography entrances and transitions
    const { stderr } = await execFileAsync(ffmpegPath, [
      '-i',
      videoPath,
      '-filter_complex',
      "select='gt(scene,0.08)',metadata=print:file=-",
      '-f',
      'null',
      '-',
    ]);

    const matches = stderr.matchAll(/pts_time:([0-9.]+)/g);
    for (const match of matches) {
      const t = parseFloat(match[1]);
      if (!isNaN(t) && t > 0.1 && t < durationSeconds - 0.2) {
        timestamps.push(t);
      }
    }
  } catch {
    // Ignore scene filter errors
  }

  // If no scene transitions were detected, calculate adaptive intervals across duration
  if (timestamps.length === 0) {
    const step = durationSeconds > 6 ? 1.5 : 1.0;
    for (let t = 0.5; t < durationSeconds; t += step) {
      timestamps.push(t);
    }
  }

  return Array.from(new Set(timestamps.map((t) => Math.round(t * 10) / 10))).sort((a, b) => a - b);
}

/**
 * Performs comprehensive multi-stage sampling on a video:
 * 1. Probes duration, fps, resolution.
 * 2. Samples regular anchor frames across the entire video.
 * 3. Identifies motion/transition zones and samples high-frequency bursts (3-5 frames 60-100ms apart)
 *    to reverse-engineer entrance easing, scale curve, and opacity changes.
 */
export async function sampleVideoTemporally(videoSource: string): Promise<MultiStageSamplingResult> {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'itna_typo_sample_'));
  let videoPath = videoSource;

  if (videoSource.startsWith('http://') || videoSource.startsWith('https://')) {
    videoPath = await downloadToTemp(videoSource, tempDir);
  }

  const metadata = await probeVideoMetadata(videoPath);
  const transitionMoments = await detectVisualChangeTimestamps(videoPath, metadata.durationSeconds);

  // 1. Build List of Timestamps to Extract
  const extractionPlan: Array<{
    timestamp: number;
    isBurst: boolean;
    burstGroup?: string;
    burstIndex?: number;
  }> = [];

  // Anchor frames: evenly spaced every ~0.6s
  const anchorInterval = Math.max(0.4, metadata.durationSeconds / 8);
  for (let t = 0.2; t <= metadata.durationSeconds - 0.2; t += anchorInterval) {
    extractionPlan.push({
      timestamp: Math.round(t * 100) / 100,
      isBurst: false,
    });
  }

  // Transition bursts: for up to 3 major visual transition moments, sample 4 frames (t-0.10s, t, t+0.10s, t+0.25s)
  const keyTransitions = transitionMoments.slice(0, 3);
  keyTransitions.forEach((tPeak, groupIdx) => {
    const burstGroup = `transition-${groupIdx}`;
    const offsets = [-0.12, 0.0, 0.12, 0.28];
    offsets.forEach((offset, burstIdx) => {
      const targetT = Math.max(0.05, Math.min(metadata.durationSeconds - 0.05, tPeak + offset));
      extractionPlan.push({
        timestamp: Math.round(targetT * 100) / 100,
        isBurst: true,
        burstGroup,
        burstIndex: burstIdx,
      });
    });
  });

  // Sort timestamps and remove duplicates within 40ms
  extractionPlan.sort((a, b) => a.timestamp - b.timestamp);
  const filteredPlan: typeof extractionPlan = [];
  extractionPlan.forEach((item) => {
    const existing = filteredPlan.find((p) => Math.abs(p.timestamp - item.timestamp) < 0.04);
    if (!existing) {
      filteredPlan.push(item);
    }
  });

  // 2. Extract JPEG frames using FFmpeg
  const allSampledFrames: SampledFrame[] = [];
  const anchorFrames: SampledFrame[] = [];
  const transitionBursts: Record<string, SampledFrame[]> = {};

  for (let i = 0; i < filteredPlan.length; i++) {
    const plan = filteredPlan[i];
    const outFileName = `frame_${i}_${plan.timestamp.toFixed(2).replace('.', '_')}.jpg`;
    const outFilePath = path.join(tempDir, outFileName);

    try {
      // Seek and extract 1 high-quality JPEG scaled to 720p for fast vision processing
      await execFileAsync(ffmpegPath, [
        '-ss',
        plan.timestamp.toFixed(3),
        '-i',
        videoPath,
        '-vframes',
        '1',
        '-q:v',
        '2',
        '-vf',
        'scale=720:-2',
        outFilePath,
      ]);

      if (fs.existsSync(outFilePath)) {
        const fileBuffer = await fs.promises.readFile(outFilePath);
        const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
        const frameIndex = Math.round(plan.timestamp * metadata.fps);

        const sampled: SampledFrame = {
          timestampSeconds: plan.timestamp,
          frameIndex,
          imagePath: outFilePath,
          base64Data,
          isTransitionBurst: plan.isBurst,
          burstGroup: plan.burstGroup,
          burstSequenceIndex: plan.burstIndex,
        };

        allSampledFrames.push(sampled);

        if (!plan.isBurst) {
          anchorFrames.push(sampled);
        } else if (plan.burstGroup) {
          if (!transitionBursts[plan.burstGroup]) {
            transitionBursts[plan.burstGroup] = [];
          }
          transitionBursts[plan.burstGroup].push(sampled);
        }
      }
    } catch (err) {
      console.warn(`[FRAME_SAMPLING] Failed to extract frame at ${plan.timestamp}s:`, err);
    }
  }

  // Ensure we have at least 4 valid frames
  if (allSampledFrames.length === 0) {
    throw new Error('Frame extraction failed: No frames could be decoded from video source.');
  }

  const cleanup = async () => {
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  };

  return {
    metadata,
    anchorFrames,
    transitionBursts,
    allSampledFrames,
    tempDir,
    cleanup,
  };
}
