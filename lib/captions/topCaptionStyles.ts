/**
 * TOP_CAPTION_STYLES — Editable config for the Homepage Caption Showcase carousel.
 *
 * 10 slots. Each entry maps to a style preset key that exists in SUBTITLE_PRESETS
 * (remotion/types/subtitles.ts) and has a Cloudinary preview video in PRESET_TO_VIDEO_MAP.
 *
 * To change the selection: edit the `key` fields below. The poster + video URLs
 * are resolved automatically from captionCatalog at runtime.
 *
 * Style ID deep-link: each card routes to /dashboard/auto-caption?style_id=<slug>
 * where <slug> is the URL-encoded preset key.
 */

export interface TopCaptionStyleSlot {
  /** Display number shown on the badge — #01, #02, ... */
  num: string;
  /** SUBTITLE_PRESETS key — must match exactly */
  key: string;
  /** Short label shown on card (can differ from key for cleaner UI) */
  label: string;
  /** Category tag displayed below the label */
  tag: string;
  /**
   * Cloudinary poster image URL.
   * Replace with a real high-quality poster frame when available.
   * Falls back to captionCatalog-generated poster if left empty.
   */
  posterOverride?: string;
}

export const TOP_CAPTION_STYLES: TopCaptionStyleSlot[] = [
  {
    num: "01",
    key: "Hormozi Viral Pop",
    label: "Hormozi Bold",
    tag: "🔥 Viral / Bold",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/hormozi-viral-pop.jpg",
  },
  {
    num: "02",
    key: "Shorts Karaoke",
    label: "Shorts Karaoke",
    tag: "⚡ Kinetic Fill",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/shorts-karaoke.jpg",
  },
  {
    num: "03",
    key: "MrBeast Shorts Impact",
    label: "MrBeast Impact",
    tag: "🔥 Viral / Bold",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/mrbeast-shorts-impact.jpg",
  },
  {
    num: "04",
    key: "Submagic Glow",
    label: "Submagic Glow",
    tag: "✨ Glow & Neon",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/submagic-glow.jpg",
  },
  {
    num: "05",
    key: "Kinetic",
    label: "Kinetic Wave",
    tag: "⚡ Kinetic",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/kinetic.jpg",
  },
  {
    num: "06",
    key: "Diary of a CEO",
    label: "Diary of a CEO",
    tag: "🎙️ Podcast",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/diary-of-a-ceo.jpg",
  },
  {
    num: "07",
    key: "Vox Documentary",
    label: "Vox Documentary",
    tag: "🎬 Cinematic",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/vox-documentary.jpg",
  },
  {
    num: "08",
    key: "M3 Elevated Card",
    label: "M3 Elevated",
    tag: "💎 Minimal",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/m3-elevated-card.jpg",
  },
  {
    num: "09",
    key: "Crazy",
    label: "Crazy Gradient",
    tag: "⚡ Kinetic",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/crazy.jpg",
  },
  {
    num: "10",
    key: "Ali Abdaal Clean Pill",
    label: "Ali Abdaal Clean",
    tag: "💎 Minimal",
    posterOverride: "https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/itnavideo-assets/autocaptionvideos/ali-abdaal-clean-pill.jpg",
  },
];
