export const CREDIT_UNITS_PER_CREDIT = 10;
export const LONG_FORM_CAPTION_MAX_SECONDS = 10 * 60;
export const LONG_VIDEO_CLIPS_BASE_CREDITS = 2;
export const LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS = 1;

export type BillableRenderMode =
  | "autoCaption"
  | "captionStudio"
  | "compare"
  | "longVideoPromo"
  | "longFormCaptionedVideo"
  | "whiteboardVideo"
  | "typographyVideo"
  | "multiImagesVideo"
  | "longVideoClips";

type RenderCreditOptions = {
  durationSeconds?: number;
  clipCount?: number;
};

export function calculateLongFormCaptionCreditUnits(durationSeconds: number) {
  const duration = Number(durationSeconds);
  if (!Number.isFinite(duration) || duration <= 0 || duration > LONG_FORM_CAPTION_MAX_SECONDS) {
    throw new Error("Long-form Captioned Video supports a confirmed duration from 1 second to 10 minutes.");
  }

  return Math.ceil(duration / 60) * CREDIT_UNITS_PER_CREDIT;
}

export function calculateRenderCreditUnits(mode: BillableRenderMode, options: RenderCreditOptions = {}) {
  switch (mode) {
    case "autoCaption":
    case "longVideoPromo":
    case "typographyVideo":
      return CREDIT_UNITS_PER_CREDIT;
    case "captionStudio":
    case "compare":
    case "whiteboardVideo":
    case "multiImagesVideo":
      return 2 * CREDIT_UNITS_PER_CREDIT;
    case "longVideoClips": {
      const clipCount = Number(options.clipCount);
      if (!Number.isInteger(clipCount) || clipCount < 1 || clipCount > 10) {
        throw new Error("Long Video Clips requires between 1 and 10 requested clips.");
      }
      return (LONG_VIDEO_CLIPS_BASE_CREDITS + clipCount * LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS) * CREDIT_UNITS_PER_CREDIT;
    }
    case "longFormCaptionedVideo":
      return calculateLongFormCaptionCreditUnits(Number(options.durationSeconds));
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
