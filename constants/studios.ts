/**
 * Single Source of Truth for Studio Counts & Names across Itnavideo.
 *
 * Current Inventory: 15 Total Studios
 * - 8 Vertical 9:16 Studios (Shorts, Reels, TikTok)
 * - 6 Widescreen 16:9 Studios (YouTube, Cinema, Long-form)
 * - 1 Audio Utility Studio (AI Audio Cleaner)
 *
 * Total Video Studios: 14 (8 + 6)
 */

export const STUDIO_COUNTS = {
  TOTAL: 15,
  VIDEO_ONLY: 14,
  SHORTS_916: 8,
  CINEMA_169: 6,
  UTILITY_AUDIO: 1,
} as const;

export const STUDIO_COUNT = STUDIO_COUNTS.TOTAL;
export const VIDEO_STUDIO_COUNT = STUDIO_COUNTS.VIDEO_ONLY;

/**
 * Safe marketing phrase for high-level headers and promotional copy
 * so minor roadmap expansions never break the promise.
 */
export const STUDIO_COUNT_PHRASE = '10+';

export const STUDIO_COUNT_EXACT_LABEL = `${STUDIO_COUNTS.TOTAL} Studios`;
export const VIDEO_STUDIO_COUNT_EXACT_LABEL = `${STUDIO_COUNTS.VIDEO_ONLY} Video Studios`;

