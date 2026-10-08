/**
 * Platform-wide Remotion Constants & Configuration
 * Single Source of Truth for FPS across all templates and compositions.
 */

export const DEFAULT_FPS = 30;
export const PLATFORM_FPS = 30;

/**
 * Converts duration in seconds to total frame count.
 */
export function secondsToFrames(seconds: number, fps: number = DEFAULT_FPS): number {
  return Math.ceil(Math.max(0, seconds) * fps);
}

/**
 * Converts frame count to duration in seconds.
 */
export function framesToSeconds(frames: number, fps: number = DEFAULT_FPS): number {
  return frames / fps;
}
