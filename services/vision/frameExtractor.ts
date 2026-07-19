/**
 * Frame Extractor — Uses FFmpeg to extract sampled keyframes from a video.
 * Returns an array of { timestampSeconds, imagePath } for MediaPipe analysis.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

const execFileAsync = promisify(execFile);

// FFmpeg binary paths (project includes ffmpeg-static + ffprobe-static)
let ffmpegPath: string;
let ffprobePath: string;
try {
  ffmpegPath = require('ffmpeg-static') as string;
  ffprobePath = require('ffprobe-static').path as string;
} catch {
  ffmpegPath = 'ffmpeg';
  ffprobePath = 'ffprobe';
}

export type ExtractedFrame = {
  timestampSeconds: number;
  imagePath: string;
};

export type FrameExtractionResult = {
  ok: boolean;
  videoDurationSeconds: number;
  sampleIntervalSeconds: number;
  frames: ExtractedFrame[];
  tempDir: string;
  error?: string;
};

/**
 * Probe video duration using ffprobe.
 */
async function getVideoDuration(videoPath: string): Promise<number> {
  const { stdout } = await execFileAsync(ffprobePath, [
    '-v', 'quiet',
    '-show_entries', 'format=duration',
    '-of', 'csv=p=0',
    videoPath,
  ]);
  const duration = parseFloat(stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid video duration: ${stdout.trim()}`);
  }
  return duration;
}

/**
 * Extract sampled keyframes from a video file.
 *
 * @param videoPath - Absolute path to the video file.
 * @param sampleIntervalSeconds - Extract one frame every N seconds (default: 1.5).
 * @param maxFrames - Maximum frames to extract (default: 60, covers 90s video at 1.5s interval).
 */
export async function extractKeyframes(
  videoPath: string,
  sampleIntervalSeconds = 1.5,
  maxFrames = 60,
): Promise<FrameExtractionResult> {
  const tag = '[FRAME_EXTRACTOR]';

  try {
    // Create temp directory for frames
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'itnavideo-frames-'));

    // Get video duration
    const videoDurationSeconds = await getVideoDuration(videoPath);
    console.log(tag, 'duration:', videoDurationSeconds.toFixed(1), 's');

    // Calculate timestamps to extract
    const timestamps: number[] = [];
    let t = 0;
    while (t < videoDurationSeconds && timestamps.length < maxFrames) {
      timestamps.push(Number(t.toFixed(2)));
      t += sampleIntervalSeconds;
    }

    console.log(tag, 'extracting', timestamps.length, 'frames at', sampleIntervalSeconds, 's intervals');

    // Extract frames using FFmpeg — one command per frame for precise timestamps
    const frames: ExtractedFrame[] = [];
    for (const ts of timestamps) {
      const outputPath = path.join(tempDir, `frame_${String(frames.length).padStart(4, '0')}.jpg`);
      try {
        await execFileAsync(ffmpegPath, [
          '-ss', String(ts),
          '-i', videoPath,
          '-frames:v', '1',
          '-q:v', '3',
          '-vf', 'scale=640:-1',  // Downscale to 640px width (faster analysis, sufficient for pose)
          '-y',
          outputPath,
        ], { timeout: 10000 });

        // Verify file exists and has content
        const stat = await fs.stat(outputPath).catch(() => null);
        if (stat && stat.size > 500) {
          frames.push({ timestampSeconds: ts, imagePath: outputPath });
        }
      } catch (err) {
        // Skip individual frame errors (e.g., seeking past end)
        console.warn(tag, `frame at ${ts}s failed:`, err instanceof Error ? err.message : '');
      }
    }

    console.log(tag, 'extracted', frames.length, '/', timestamps.length, 'frames');

    return {
      ok: frames.length > 0,
      videoDurationSeconds,
      sampleIntervalSeconds,
      frames,
      tempDir,
      error: frames.length === 0 ? 'No frames could be extracted' : undefined,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(tag, 'extraction failed:', msg);
    return {
      ok: false,
      videoDurationSeconds: 0,
      sampleIntervalSeconds,
      frames: [],
      tempDir: '',
      error: msg,
    };
  }
}

/**
 * Clean up extracted frame files after analysis.
 */
export async function cleanupFrames(tempDir: string): Promise<void> {
  if (!tempDir) return;
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup
  }
}
