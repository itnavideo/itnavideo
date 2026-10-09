/**
 * whiteboardConstants.ts
 * Single source of truth for all whiteboard layout geometry.
 * Imported by BOTH the planner (services/ai/whiteboardPlanner.ts)
 * AND the Remotion template (remotion/templates/WHITEBOARD_VIDEO/template.tsx).
 * NEVER duplicate these values — change here, both sides see it.
 */

// ── Canvas dimensions (1080×1920 portrait) ─────────────────────────────────
export const WB_CANVAS_WIDTH = 1080;
export const WB_CANVAS_HEIGHT = 1920;

// ── Safe area (px) — stays clear of reel UI chrome top/bottom ──────────────
export const WB_SAFE_LEFT = 80;
export const WB_SAFE_RIGHT = 80;
export const WB_SAFE_TOP = 160;
export const WB_SAFE_BOTTOM = 240;

// Derived usable dimensions inside the safe area
export const WB_USABLE_WIDTH = WB_CANVAS_WIDTH - WB_SAFE_LEFT - WB_SAFE_RIGHT; // 920px
export const WB_USABLE_HEIGHT = WB_CANVAS_HEIGHT - WB_SAFE_TOP - WB_SAFE_BOTTOM; // 1520px

// ── Per-board limits ────────────────────────────────────────────────────────
export const WB_MAX_POINTS_PER_BOARD = 3;
export const WB_MAX_WORDS_PER_POINT = 5;
export const WB_MAX_LINES_PER_POINT = 2;

// ── Chars-per-line: unified single value (was 28 in planner vs 26 in template) ──
export const WB_MAX_CHARS_PER_LINE = 26;

// ── Typography: px values on a 1080×1920 canvas ─────────────────────────────
export const WB_TITLE_SIZE = 96;
export const WB_CONCLUSION_SIZE = 72;

// Point font size table indexed by [pointCount - 1] (1, 2, or 3 points on board)
// 1 point → biggest, 3 points → minimum readable
export const WB_POINT_SIZE_BY_COUNT: Record<number, number> = {
  1: 80,
  2: 72,
  3: 68,
} as const;
export const WB_POINT_SIZE_MIN = 68; // hard floor, never go below

// ── Line height multipliers ──────────────────────────────────────────────────
export const WB_TITLE_LINE_HEIGHT = 1.15;
export const WB_POINT_LINE_HEIGHT = 1.35;
export const WB_CONCLUSION_LINE_HEIGHT = 1.2;

// ── Spacing (px) between elements ─────────────────────────────────────────
export const WB_TITLE_MARGIN_BOTTOM = 40;
export const WB_POINT_MARGIN_BOTTOM = 28;
export const WB_POINT_PADDING_V = 22;
export const WB_POINT_PADDING_H = 28;

// ── Writing / reveal animation ───────────────────────────────────────────────
/** Frames to fade-in full point text (opacity 0→1). Keep short so layout is final from frame 0. */
export const WB_REVEAL_FADE_FRAMES = 8;
/** translateY offset (px) at start of reveal animation */
export const WB_REVEAL_TRANSLATE_Y_START = 12;

// ── Timing buffers ───────────────────────────────────────────────────────────
/** Seconds before first spoken word of a point to start its reveal */
export const WB_REVEAL_LEAD_SECONDS = 0.05;
/** Minimum display time (seconds) for any point, even if speech is shorter */
export const WB_MIN_DISPLAY_SECONDS = 1.5;
