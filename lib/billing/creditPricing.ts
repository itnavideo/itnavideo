export const CREDIT_UNITS_PER_CREDIT = 1;
export const LONG_FORM_CAPTION_MAX_SECONDS = 3 * 60; // 3 minutes (180 seconds)
export const SHORT_REEL_MAX_SECONDS = 90; // 90 seconds
export const LONG_VIDEO_CLIPS_BASE_CREDITS = 2;
export const LONG_VIDEO_CLIPS_PER_OUTPUT_CREDITS = 2;

// ─── Video Unit Cost ──────────────────────────────────────────────────────────
// 1 Video credit = 1 short-form render (9:16, up to 90 sec)
// 2 Video credits = 1 long-form render (16:9, up to 3 min)
export const SHORT_FORM_VIDEO_UNITS = 1;   // 9:16 Reels / Shorts / TikTok (up to 90s) = 1 credit
export const LONG_FORM_VIDEO_UNITS  = 2;   // 16:9 YouTube / Cinema (up to 3 min) = 2 credits

export type BillableRenderMode =
  | "autoCaption"
  | "compare"
  | "longVideoPromo"
  | "aiVideoGenerator"
  | "facelessVideo"
  | "whiteboardVideo"
  | "typographyVideo"
  | "longVideoClips"
  | "aiAudioCleaner"
  | "audioClean"
  | "audio-cleaner"
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
    throw new Error("16:9 Widescreen video supports up to 3 minutes (180 seconds) duration.");
  }
  // 16:9 Widescreen Video (up to 3 min) = 2 Credits
  return LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
}

export function calculateYouTubeSubtitleCreditUnits(durationSeconds: number) {
  const duration = Number(durationSeconds) || 60;
  if (!Number.isFinite(duration) || duration <= 0 || duration > LONG_FORM_CAPTION_MAX_SECONDS) {
    throw new Error("YouTube Subtitle Generator supports up to 3 minutes (180 seconds) duration.");
  }
  // YouTube 16:9 Subtitle Generator = 2 Credits
  return LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
}

export function calculateRenderCreditUnits(mode: BillableRenderMode, options: RenderCreditOptions = {}) {
  const duration = Number(options.durationSeconds) || 60;

  switch (mode) {
    // All 9:16 Reels / Shorts (up to 90s): 1 Credit
    case "autoCaption":
    case "longVideoPromo":
    case "typographyVideo":
    case "compare":
    case "whiteboardVideo":
      return SHORT_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;

    // AI Audio Cleaner: 1 Credit
    case "aiAudioCleaner":
    case "audioClean":
    case "audio-cleaner":
      return SHORT_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;

    // Long Video Clips: 2 Credits per generated clip
    case "longVideoClips": {
      const clipCount = Number(options.clipCount) || 1;
      return clipCount * LONG_FORM_VIDEO_UNITS * CREDIT_UNITS_PER_CREDIT;
    }

    // YouTube Subtitle Generator (16:9 widescreen, up to 3 min): 2 Credits
    case "youtubeSubtitleGenerator":
      return calculateYouTubeSubtitleCreditUnits(duration);

    // All 16:9 Long Videos & Cinema (up to 3 min): 2 Credits
    case "longFormCaptionedVideo":
    case "aiVideoGenerator":
    case "facelessVideo":
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
