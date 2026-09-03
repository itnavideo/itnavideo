/**
 * Media Optimization for Production Rendering
 *
 * When a user uploads a 4K or high-bitrate video, we create an optimized
 * intermediate (1080p, efficient bitrate) before sending to Lambda.
 * This reduces: render time, memory usage, and cloud costs significantly.
 *
 * Rules:
 * - If source resolution > 1080p: transcode to 1080p
 * - If source bitrate > 8 Mbps: re-encode at ~5 Mbps
 * - If source is already ≤1080p and ≤8 Mbps: use as-is (no processing)
 * - Always preserve audio stream untouched
 * - Output: H.264 MP4 with AAC audio
 */

export type MediaOptimizationResult = {
  optimized: boolean;
  reason: string;
  outputKey?: string;
  outputUrl?: string;
  originalWidth?: number;
  originalHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
};

export type MediaProbeResult = {
  width: number;
  height: number;
  durationSeconds: number;
  bitrate: number; // bits per second
  codec: string;
  needsOptimization: boolean;
  reason: string;
};

/**
 * Determine if a video needs optimization based on resolution/bitrate.
 * For Long-form: max 1920x1080, max 8 Mbps
 * For Shorts: max 1080x1920, max 6 Mbps
 */
export function shouldOptimize(
  width: number,
  height: number,
  bitrate: number,
  isLandscape: boolean,
): MediaProbeResult {
  const maxWidth = isLandscape ? 1920 : 1080;
  const maxHeight = isLandscape ? 1080 : 1920;
  const maxBitrate = 8_000_000; // 8 Mbps

  const exceedsResolution = width > maxWidth || height > maxHeight;
  const exceedsBitrate = bitrate > maxBitrate;
  const needsOptimization = exceedsResolution || exceedsBitrate;

  let reason = 'within_limits';
  if (exceedsResolution && exceedsBitrate) reason = 'resolution_and_bitrate';
  else if (exceedsResolution) reason = 'resolution';
  else if (exceedsBitrate) reason = 'bitrate';

  return {
    width,
    height,
    durationSeconds: 0,
    bitrate,
    codec: 'h264',
    needsOptimization,
    reason,
  };
}

/**
 * Calculate optimal output dimensions maintaining aspect ratio.
 * Scales down to fit within max bounds while keeping even dimensions.
 */
export function calculateOptimalDimensions(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const aspectRatio = sourceWidth / sourceHeight;

  let outWidth = sourceWidth;
  let outHeight = sourceHeight;

  if (outWidth > maxWidth) {
    outWidth = maxWidth;
    outHeight = Math.round(maxWidth / aspectRatio);
  }
  if (outHeight > maxHeight) {
    outHeight = maxHeight;
    outWidth = Math.round(maxHeight * aspectRatio);
  }

  // Ensure even dimensions (required by H.264)
  outWidth = Math.floor(outWidth / 2) * 2;
  outHeight = Math.floor(outHeight / 2) * 2;

  return { width: outWidth, height: outHeight };
}

/**
 * Get optimal framesPerLambda for a given duration.
 * Longer videos need fewer frames per chunk to avoid OOM.
 */
export function getOptimalFramesPerLambda(durationSeconds: number, isLongForm: boolean): number {
  if (!isLongForm) return 120; // Short videos: standard

  // Long-form: scale down as duration increases
  if (durationSeconds <= 60) return 300;
  if (durationSeconds <= 180) return 240;
  if (durationSeconds <= 300) return 180;
  if (durationSeconds <= 420) return 150;
  return 120; // 7-10 min: smallest chunks for safety
}
