/**
 * whiteboardConstants.ts
 * Single source of truth for all whiteboard layout geometry.
 * Strictly 9:16 Vertical Portrait (1080×1920) reels up to 90 seconds.
 * 16:9 is completely eliminated per founder directive.
 */

// ── Canvas dimensions (1080×1920 portrait) ─────────────────────────────────
export const WB_CANVAS_WIDTH = 1080;
export const WB_CANVAS_HEIGHT = 1920;

// ── Safe area (px) — stays clear of reel UI chrome top/bottom ──────────────
export const WB_SAFE_LEFT = 70;
export const WB_SAFE_RIGHT = 70;
export const WB_SAFE_TOP = 140;
export const WB_SAFE_BOTTOM = 220;

// Derived usable dimensions inside the safe area
export const WB_USABLE_WIDTH = WB_CANVAS_WIDTH - WB_SAFE_LEFT - WB_SAFE_RIGHT; // 940px
export const WB_USABLE_HEIGHT = WB_CANVAS_HEIGHT - WB_SAFE_TOP - WB_SAFE_BOTTOM; // 1560px

// ── Per-board limits ────────────────────────────────────────────────────────
export const WB_MAX_POINTS_PER_BOARD = 3;
export const WB_MAX_WORDS_PER_POINT = 7;
export const WB_MAX_LINES_PER_POINT = 2;

// ── Chars-per-line: calibrated for 940px width at 44px-52px font size ────────
export const WB_MAX_CHARS_PER_LINE = 30;

// ── Typography: px values on a 1080×1920 canvas ─────────────────────────────
export const WB_TITLE_SIZE = 64;
export const WB_CONCLUSION_SIZE = 48;

// Point font size table indexed by point count (1, 2, or 3 points on board)
// Calibrated so text never overflows and is always crisp and readable
export const WB_POINT_SIZE_BY_COUNT: Record<number, number> = {
  1: 54,
  2: 50,
  3: 46,
} as const;
export const WB_POINT_SIZE_MIN = 42; // Hard floor, never go below

// ── Line height multipliers ──────────────────────────────────────────────────
export const WB_TITLE_LINE_HEIGHT = 1.2;
export const WB_POINT_LINE_HEIGHT = 1.35;
export const WB_CONCLUSION_LINE_HEIGHT = 1.25;

// ── Spacing (px) between elements ─────────────────────────────────────────
export const WB_TITLE_MARGIN_BOTTOM = 36;
export const WB_POINT_MARGIN_BOTTOM = 24;
export const WB_POINT_PADDING_V = 20;
export const WB_POINT_PADDING_H = 24;

// ── Writing / reveal animation ───────────────────────────────────────────────
/** Frames to fade-in point text (opacity 0→1). */
export const WB_REVEAL_FADE_FRAMES = 8;
/** translateY offset (px) at start of reveal animation */
export const WB_REVEAL_TRANSLATE_Y_START = 10;

// ── Timing buffers ───────────────────────────────────────────────────────────
/** Seconds before first spoken word of a point to start its reveal */
export const WB_REVEAL_LEAD_SECONDS = 0.05;
/** Minimum display time (seconds) for any point, even if speech is shorter */
export const WB_MIN_DISPLAY_SECONDS = 1.5;

// ── Dedicated 9:16 Geometry Engine ───────────────────────────────────────────
export function getWhiteboardDimensions() {
  return {
    width: WB_CANVAS_WIDTH,
    height: WB_CANVAS_HEIGHT,
    safeLeft: WB_SAFE_LEFT,
    safeRight: WB_SAFE_RIGHT,
    safeTop: WB_SAFE_TOP,
    safeBottom: WB_SAFE_BOTTOM,
    usableWidth: WB_USABLE_WIDTH,
    usableHeight: WB_USABLE_HEIGHT,
    titleSize: WB_TITLE_SIZE,
    conclusionSize: WB_CONCLUSION_SIZE,
    pointSizeByCount: WB_POINT_SIZE_BY_COUNT,
    pointSizeMin: WB_POINT_SIZE_MIN,
  };
}
