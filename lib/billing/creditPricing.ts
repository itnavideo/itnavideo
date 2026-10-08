export const CREDIT_UNITS_PER_CREDIT = 1;
export const LONG_FORM_CAPTION_MAX_SECONDS = 12 * 60;
export const SHORT_REEL_MAX_SECONDS = 3 * 60;
export const LONG_VIDEO_CLIPS_BASE_CREDITS = 4;
export const LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS = 4;

// ─── Video Unit Cost ──────────────────────────────────────────────────────────
// 1 Video unit = 1 short-form render (9:16, up to 3 min)
// 4 Video units = 1 long-form render (16:9, up to 12 min)
// This ratio mirrors real AWS Lambda compute cost (long form ~4× more expensive)
export const SHORT_FORM_VIDEO_UNITS = 1;   // 9:16 Reels / Shorts / TikTok
export const LONG_FORM_VIDEO_UNITS  = 4;   // 16:9 YouTube / Cinema

export type BillableRenderMode =
  | "autoCaption"
  | "compare"
  | "longVideoPromo"
  | "aiVideoGenerator"
  | "facelessVideo"
  | "whiteboardVideo"
  | "typographyVideo"
  | "longVideoClips"
  | "longVideoPro"
  | "aiAudioCleaner"
  | "imageToVideoAi"
  | "bookSummary"
  | "longFormCaptionedVideo"
  | "youtubeSubtitleGenerator";

type RenderCreditOptions = {
  durationSeconds?: number;
  clipCount?: number;
};

export function calculateLongFormCaptionCreditUnits(durationSeconds: number) {
  const duration = Number(durationSeconds) || 60;
  if (!Number.isFinite(duration) || duration <= 0 || duration > LONG_FORM_CAPTION_MAX_SECONDS) {
    throw new Error("Long Video supports a confirmed duration from 1 second to 12 minutes.");
  }
  // 16:9 Long Video (up to 12 min) = 4 Video units
  return LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
}

export function calculateYouTubeSubtitleCreditUnits(durationSeconds: number) {
  const duration = Number(durationSeconds) || 60;
  if (!Number.isFinite(duration) || duration <= 0 || duration > LONG_FORM_CAPTION_MAX_SECONDS) {
    throw new Error("YouTube Subtitle Generator supports a confirmed duration from 1 second to 12 minutes.");
  }
  // YouTube 16:9 Subtitle Generator = 4 Video units
  return LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
}

export function calculateRenderCreditUnits(mode: BillableRenderMode, options: RenderCreditOptions = {}) {
  const duration = Number(options.durationSeconds) || 60;

  switch (mode) {
    // All 9:16 Reels / Shorts (up to 3 min): 1 Video unit
    case "autoCaption":
    case "longVideoPromo":
    case "typographyVideo":
    case "compare":
    case "whiteboardVideo":
      return SHORT_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;

    // AI Audio Cleaner: 1 Video unit (lightweight, no render)
    case "aiAudioCleaner":
      return SHORT_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;

    // Long Video Clips: 4 units per generated clip (each clip = 1 long-form render)
    case "longVideoClips": {
      const clipCount = Number(options.clipCount) || 1;
      return clipCount * LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
    }

    // YouTube Subtitle Generator (16:9 widescreen): 4 Video units
    case "youtubeSubtitleGenerator":
      return calculateYouTubeSubtitleCreditUnits(duration);

    // All 16:9 Long Videos & Cinema (up to 12 min): 4 Video units
    case "longFormCaptionedVideo":
    case "aiVideoGenerator":
    case "facelessVideo":
    case "longVideoPro":
    case "imageToVideoAi":
    case "bookSummary":
      return calculateLongFormCaptionCreditUnits(duration);

    default: {
      const unsupportedMode: never = mode;
      throw new Error(`Unsupported render credit mode: ${unsupportedMode}`);
    }
  }
}

export function formatCreditUnits(creditUnits: number) {
  const credits = Math.max(0, Number(creditUnits) || 0) / CREDIT_UNITS_PER_CREDIT;
  return Number.isInteger(credits) ? String(credits) : credits.toFixed(1);
}

export function normalizeCreditUnits(value: unknown, fallback = CREDIT_UNITS_PER_CREDIT) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0
    ? Math.max(1, Math.round(numeric))
    : fallback;
}
