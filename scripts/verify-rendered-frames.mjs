import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * Extract frames from a video file and verify that the video contains valid rendered visuals
 * and is not blank/empty/solid black/solid white.
 * 
 * @param {string} videoPath - Path to the rendered MP4 file
 * @param {number} sampleCount - Number of sample frames to verify (default 5)
 * @returns {{ valid: boolean, message: string, sampleFrames: string[] }}
 */
export async function verifyRenderedVideoFrames(videoPath, sampleCount = 5) {
  if (!fs.existsSync(videoPath)) {
    return { valid: false, message: "Video file does not exist: " + videoPath, sampleFrames: [] };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'itna-frame-verify-'));
  const sampleFrames = [];

  try {
    // Get video duration using ffprobe
    const durationOutput = execSync(
      'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "' + videoPath + '"',
      { encoding: 'utf-8' }
    ).trim();

    const duration = parseFloat(durationOutput);
    if (!duration || Number.isNaN(duration) || duration <= 0) {
      return { valid: false, message: 'Invalid video duration', sampleFrames: [] };
    }

    // Extract sample frames across duration
    const timestamps = [];
    for (let i = 1; i <= sampleCount; i++) {
      const ratio = i / (sampleCount + 1);
      timestamps.push((duration * ratio).toFixed(2));
    }

    let validFrames = 0;
    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      const framePath = path.join(tmpDir, 'frame_' + (i + 1) + '.png');
      
      try {
        execSync(
          'ffmpeg -y -ss ' + ts + ' -i "' + videoPath + '" -vframes 1 -q:v 2 "' + framePath + '"',
          { stdio: 'ignore' }
        );

        if (fs.existsSync(framePath) && fs.statSync(framePath).size > 1000) {
          sampleFrames.push(framePath);

          // Get mean color/luminance using ffmpeg signalstats
          const statsOutput = execSync(
            'ffmpeg -i "' + framePath + '" -vf "signalstats" -f null - 2>&1',
            { encoding: 'utf-8' }
          );

          const ylowMatch = statsOutput.match(/YLOW=([\d.]+)/);
          const yavgMatch = statsOutput.match(/YAVG=([\d.]+)/);
          const yhighMatch = statsOutput.match(/YHIGH=([\d.]+)/);

          const yavg = yavgMatch ? parseFloat(yavgMatch[1]) : 128;
          const ylow = ylowMatch ? parseFloat(ylowMatch[1]) : 0;
          const yhigh = yhighMatch ? parseFloat(yhighMatch[1]) : 255;

          // Check if frame is pure black (YAVG < 5) or pure white (YAVG > 250 with low variance)
          const isPitchBlack = yavg < 5 && yhigh < 15;
          const isPureWhite = yavg > 250 && ylow > 240;

          if (!isPitchBlack && !isPureWhite) {
            validFrames++;
          }
        }
      } catch (err) {
        console.warn('Frame extraction warning at ' + ts + 's:', err.message);
      }
    }

    const isValid = validFrames >= Math.ceil(sampleCount / 2);
    return {
      valid: isValid,
      message: isValid
        ? 'Video frame check passed (' + validFrames + '/' + sampleCount + ' rich frames)'
        : 'Video frame check failed: Only ' + validFrames + '/' + sampleCount + ' non-empty frames detected',
      sampleFrames,
    };
  } catch (error) {
    return { valid: false, message: 'Frame verification failed: ' + error.message, sampleFrames: [] };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

// CLI execution if run directly
if (process.argv[1] && process.argv[1].endsWith('verify-rendered-frames.mjs')) {
  const targetVideo = process.argv[2] || 'public/renders/sample-reel.mp4';
  process.stdout.write('Analyzing frames for: ' + targetVideo + '...\n');
  const result = await verifyRenderedVideoFrames(targetVideo);
  process.stdout.write('Result: ' + JSON.stringify(result, null, 2) + '\n');
}
