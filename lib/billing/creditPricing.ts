export const CREDIT_UNITS_PER_CREDIT = 10;
export const LONG_FORM_CAPTION_MAX_SECONDS = 20 * 60;
export const LONG_VIDEO_CLIPS_BASE_CREDITS = 2;
export const LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS = 1;

export type BillableRenderMode =
  | "autoCaption"
  | "compare"
  | "longVideoPromo"
  | "aiVideoGenerator"
  | "facelessVideo"
  | "whiteboardVideo"
  | "typographyVideo"
  | "multiImagesVideo"
  | "longVideoClips"
  | "longVideoPro"
  | "aiAudioCleaner"
  | "longFormCaptionedVideo";

type RenderCreditOptions = {
  durationSeconds?: number;
  clipCount?: number;
};

export function calculateLongFormCaptionCreditUnits(durationSeconds: number) {
  const duration = Number(durationSeconds) || 60;
  if (!Number.isFinite(duration) || duration <= 0 || duration > LONG_FORM_CAPTION_MAX_SECONDS) {
    throw new Error("Long Video supports a confirmed duration from 1 second to 20 minutes.");
  }

  // 2 credits per started minute (e.g. 10 min video = 20 credits)
  const minutes = Math.ceil(duration / 60);
  return minutes * 2 * CREDIT_UNITS_PER_CREDIT;
}

export function calculateRenderCreditUnits(mode: BillableRenderMode, options: RenderCreditOptions = {}) {
  const duration = Number(options.durationSeconds) || 60;
  const minutes = Math.max(1, Math.ceil(duration / 60));

  switch (mode) {
    // All 9:16 videos: 1 credit for 1 min video
    case "autoCaption":
    case "longVideoPromo":
    case "typographyVideo":
    case "compare":
    case "whiteboardVideo":
    case "multiImagesVideo":
      return minutes * CREDIT_UNITS_PER_CREDIT;

    // AI Audio Cleaner: 1 credit for 5 min audio
    case "aiAudioCleaner": {
      const fiveMinBlocks = Math.max(1, Math.ceil(duration / 300));
      return fiveMinBlocks * CREDIT_UNITS_PER_CREDIT;
    }

    // Long Video Clips: 2 base credits + 1 credit per output clip
    case "longVideoClips": {
      const clipCount = Number(options.clipCount);
      if (!Number.isInteger(clipCount) || clipCount < 1 || clipCount > 15) {
        throw new Error("Long Video Clips requires between 1 and 15 requested clips.");
      }
      return (LONG_VIDEO_CLIPS_BASE_CREDITS + clipCount * LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS) * CREDIT_UNITS_PER_CREDIT;
    }

    // All 16:9 Long Videos & Faceless Videos: 2 credits for 1 min video (10 min = 20 credits)
    case "longFormCaptionedVideo":
    case "aiVideoGenerator":
    case "facelessVideo":
    case "longVideoPro":
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
