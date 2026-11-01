// remotion/types/subtitles.ts
// Shared subtitle types for all Itnavideo templates

export type SubtitleStyle =
  | "none"
  | "normal"
  | "highlight"
  | "big-bold"
  | "box"
  | "typewriter"
  | "bold-outline"
  | "one-word"
  | "gold-pill"
  | "stacked"
  | "shorts-karaoke"
  | "reels-clean"
  | "cinematic"
  | "floating-serif"
  | "neon-pulse"
  | "glass-blur"
  | "mrbeast-16-9"
  | "crazy-gradient"
  | "split-color"
  | "m3-tonal-pill"
  | "m3-dynamic-chip"
  | "m3-elevated-card"
  | "m3-surface-outline"
  | "m3-primary-container"
  | "warikoo-black-card"
  | "active-blue-pill"
  | "ali-abdaal"
  | "vox-docu"
  | "diary-of-ceo"
  | "huberman-lecture"
  | "mkbhd-tech"
  | "bbc-netflix-cc"
  | "kurzgesagt"
  | "lex-fridman"
  | "creator-3"
  | "crazy-cyan"
  | "spark-glow"
  | "gamer-bold"
  | "cursive-contrast"
  | "discipline-red"
  | "kinetic-multicolor"
  | "impact-glow"
  | "red-wipe"
  | "punch-yellow"
  | "cook-chromatic"
  | "master-pill"
  | "solo-pop"
  | "estate-metallic"
  | "story-serif"
  | (string & {});

export type SubtitlePosition = "top" | "center" | "bottom";

export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
  words?: WordTiming[];
}

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleConfig {
  style: SubtitleStyle;
  position: SubtitlePosition;
  language: string;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  fontSize?: "small" | "medium" | "large" | "xlarge";
  fontFamily?: string;
  showBackground?: boolean;
  youtubeSubtitleSafeZone?: 'none' | 'scrubber' | 'high' | string;
}

export const DEFAULT_SUBTITLE_CONFIG: SubtitleConfig = {
  style: "highlight",
  position: "bottom",
  language: "en",
  textColor: "#FFFFFF",
  highlightColor: "#FFD700",
  backgroundColor: "#000000",
  fontSize: "medium",
  fontFamily: "sans-serif",
  showBackground: true,
};

export interface SubtitlePreset {
  name: string;
  style: SubtitleStyle;
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  fontSize?: "small" | "medium" | "large" | "xlarge";
}

export const SUBTITLE_PRESETS: Record<string, SubtitlePreset> = {
  // Flagship Auto Caption Styles
  "Hormozi Viral Pop": { name: "Hormozi Viral Pop", style: "one-word", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", fontSize: "xlarge" },
  "MrBeast Shorts Impact": { name: "MrBeast Shorts Impact", style: "mrbeast-16-9", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE500", fontSize: "xlarge" },
  "Shorts Karaoke": { name: "Shorts Karaoke", style: "shorts-karaoke", fontFamily: "Inter, sans-serif", textColor: "#9CA3AF", highlightColor: "#111827", backgroundColor: "#F4F4F5", fontSize: "large" },
  "Submagic Glow": { name: "Submagic Glow", style: "neon-pulse", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#A855F7", backgroundColor: "rgba(15, 23, 42, 0.85)", fontSize: "large" },
  "Kinetic Wave": { name: "Kinetic Wave", style: "crazy-gradient", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  
  // Documentary & Podcast
  "Diary of a CEO": { name: "Diary of a CEO", style: "normal", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Vox Documentary": { name: "Vox Documentary", style: "cinematic", fontFamily: "Georgia, Newsreader, serif", textColor: "#FFFBEB", highlightColor: "#F59E0B", backgroundColor: "rgba(12, 10, 9, 0.90)", fontSize: "medium" },
  "Ali Abdaal Clean Pill": { name: "Ali Abdaal Clean Pill", style: "box", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FDE047", backgroundColor: "rgba(15, 23, 42, 0.85)", fontSize: "medium" },
  
  // Elevated UI Styles
  "M3 Elevated Card": { name: "M3 Elevated Card", style: "stacked", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#A855F7", backgroundColor: "rgba(28, 27, 31, 0.9)", fontSize: "large" },
  "Glass Blur": { name: "Glass Blur", style: "glass-blur", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#60A5FA", backgroundColor: "rgba(15,23,42,0.55)", fontSize: "large" },
  "Floating Serif": { name: "Floating Serif", style: "floating-serif", fontFamily: "Georgia, Playfair Display, serif", textColor: "#F8FAFC", highlightColor: "#D9B76E", fontSize: "large" },
  
  // Classic Styles
  "Typewriter": { name: "Typewriter", style: "typewriter", fontFamily: "Courier New, monospace", textColor: "#10B981", highlightColor: "#10B981", fontSize: "medium" },
  "Minimal Clean": { name: "Minimal Clean", style: "normal", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },

  // WhiteStair Core Templates
  "Solo": { name: "Solo", style: "solo-pop", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  "Crazy": { name: "Crazy", style: "crazy-gradient", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF7043", fontSize: "xlarge" },
  "Discipline": { name: "Discipline", style: "discipline-red", fontFamily: "Montserrat, sans-serif", textColor: "#9CA3AF", highlightColor: "#EF4444", fontSize: "large" },
  "Red Wipe": { name: "Red Wipe", style: "red-wipe", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "#DC2626", fontSize: "large" },
  "Spark": { name: "Spark", style: "spark-glow", fontFamily: "Inter, sans-serif", textColor: "#9CA3AF", highlightColor: "#22C55E", fontSize: "large" },
  "Creator 3": { name: "Creator 3", style: "creator-3", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#4ADE80", fontSize: "large" },
  "Crazy 2": { name: "Crazy 2", style: "crazy-cyan", fontFamily: "Impact, sans-serif", textColor: "#00E5FF", highlightColor: "#00E5FF", backgroundColor: "#000000", fontSize: "xlarge" },
  "Master": { name: "Master", style: "master-pill", fontFamily: "Inter, sans-serif", textColor: "#9CA3AF", highlightColor: "#38BDF8", fontSize: "large" },
  "Kinetic": { name: "Kinetic", style: "kinetic-multicolor", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  "Impact": { name: "Impact", style: "impact-glow", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "xlarge" },
  "Punch": { name: "Punch", style: "punch-yellow", fontFamily: "Impact, sans-serif", textColor: "#000000", highlightColor: "#FACC15", backgroundColor: "#FACC15", fontSize: "large" },
  "Story": { name: "Story", style: "story-serif", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "medium" },
  "Gamer": { name: "Gamer", style: "gamer-bold", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#00E5FF", fontSize: "xlarge" },
  "Cursive": { name: "Cursive", style: "cursive-contrast", fontFamily: "'Permanent Marker', cursive", textColor: "#FFFFFF", highlightColor: "#00E5FF", fontSize: "large" },
  "Cook": { name: "Cook", style: "cook-chromatic", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "xlarge" },
  "Estate": { name: "Estate", style: "estate-metallic", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#94A3B8", fontSize: "medium" },
  "Cyber Lime Pill": { name: "Cyber Lime Pill", style: "gold-pill", fontFamily: "Montserrat, sans-serif", textColor: "#000000", highlightColor: "#00FF9D", backgroundColor: "#00FF9D", fontSize: "large" },
  "M3 Dynamic Chip": { name: "M3 Dynamic Chip", style: "m3-dynamic-chip", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", backgroundColor: "rgba(239,68,68,0.15)", fontSize: "large" },
  "M3 Tonal Pill": { name: "M3 Tonal Pill", style: "m3-tonal-pill", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#000000", highlightColor: "#22C55E", backgroundColor: "#22C55E", fontSize: "large" },

  // WhiteStair Dynamic Presets
  "Classic": { name: "Classic", style: "normal", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFA000", fontSize: "large" },
  "Creator": { name: "Creator", style: "one-word", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", fontSize: "xlarge" },
  "Simple": { name: "Simple", style: "shorts-karaoke", fontFamily: "Inter, sans-serif", textColor: "#9CA3AF", highlightColor: "#FFFFFF", fontSize: "large" },
  "Doctor": { name: "Doctor", style: "box", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", backgroundColor: "rgba(34,197,94,0.2)", fontSize: "medium" },
  "Luxe": { name: "Luxe", style: "floating-serif", fontFamily: "Georgia, serif", textColor: "#F8FAFC", highlightColor: "#D9B76E", fontSize: "large" },
  "Script Mix": { name: "Script Mix", style: "stacked", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#A855F7", fontSize: "large" },
  "Scribble": { name: "Scribble", style: "cursive-contrast", fontFamily: "'Permanent Marker', cursive", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },

  // 50 Kinetic Caption Styles (Claude AI Master System)
  "Pop Word": { name: "Pop Word", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Slam Headline": { name: "Slam Headline", style: "mrbeast-16-9", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Zoom Punch": { name: "Zoom Punch", style: "one-word", fontFamily: "Bebas Neue, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Drop Bounce": { name: "Drop Bounce", style: "one-word", fontFamily: "Bangers, Impact, sans-serif", textColor: "#FFE14D", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Marker Tag": { name: "Marker Tag", style: "one-word", fontFamily: "Permanent Marker, cursive", textColor: "#111111", highlightColor: "#FFE14D", backgroundColor: "#FFE14D", fontSize: "large" },
  "Glitch": { name: "Glitch", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#00E5FF", fontSize: "xlarge" },
  "Flip Card": { name: "Flip Card", style: "one-word", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Blur Reveal": { name: "Blur Reveal", style: "one-word", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Spin In": { name: "Spin In", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Outline Only": { name: "Outline Only", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "transparent", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Gradient Word": { name: "Gradient Word", style: "crazy-gradient", fontFamily: "Montserrat, sans-serif", textColor: "#FF5EA8", highlightColor: "#FFB347", fontSize: "xlarge" },
  "Serif Italic": { name: "Serif Italic", style: "floating-serif", fontFamily: "Playfair Display, serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Retro Shadow": { name: "Retro Shadow", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFE14D", highlightColor: "#FF4D6D", fontSize: "xlarge" },
  "Sticker": { name: "Sticker", style: "one-word", fontFamily: "Bangers, Impact, sans-serif", textColor: "#111111", highlightColor: "#D91B5C", backgroundColor: "#FFFFFF", fontSize: "large" },
  "3D Extrude": { name: "3D Extrude", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#CCCCCC", fontSize: "xlarge" },
  "Terminal Tag": { name: "Terminal Tag", style: "one-word", fontFamily: "ui-monospace, monospace", textColor: "#FFE14D", highlightColor: "#FFE14D", backgroundColor: "#000000", fontSize: "medium" },
  "Wipe Reveal": { name: "Wipe Reveal", style: "one-word", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Whisper": { name: "Whisper", style: "normal", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "medium" },
  "Heartbeat": { name: "Heartbeat", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Underline Swipe": { name: "Underline Swipe", style: "one-word", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Karaoke Line": { name: "Karaoke Line", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Box Highlight": { name: "Box Highlight", style: "box", fontFamily: "Montserrat, sans-serif", textColor: "#000000", highlightColor: "#FFE14D", backgroundColor: "rgba(0,0,0,0.65)", fontSize: "large" },
  "Neon Glow": { name: "Neon Glow", style: "neon-pulse", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Pill Highlight": { name: "Pill Highlight", style: "box", fontFamily: "Montserrat, sans-serif", textColor: "#111111", highlightColor: "#FFFFFF", backgroundColor: "#FFFFFF", fontSize: "large" },
  "Underline Track": { name: "Underline Track", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Color Fill": { name: "Color Fill", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Bold Pop Caption": { name: "Bold Pop Caption", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Subtitle Classic": { name: "Subtitle Classic", style: "normal", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "rgba(0,0,0,0.65)", fontSize: "medium" },
  "Highlighter": { name: "Highlighter", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Build Up": { name: "Build Up", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Slide Words": { name: "Slide Words", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Rainbow": { name: "Rainbow", style: "crazy-gradient", fontFamily: "Montserrat, sans-serif", textColor: "#FF3333", highlightColor: "#FFE14D", fontSize: "large" },
  "Shadow Lift": { name: "Shadow Lift", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Blur Focus": { name: "Blur Focus", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Strike Past": { name: "Strike Past", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Outline Fill": { name: "Outline Fill", style: "shorts-karaoke", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Bounce Active": { name: "Bounce Active", style: "shorts-karaoke", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Gold Luxe": { name: "Gold Luxe", style: "floating-serif", fontFamily: "Playfair Display, serif", textColor: "#FFF2A8", highlightColor: "#D4A017", fontSize: "large" },
  "Arcade": { name: "Arcade", style: "box", fontFamily: "ui-monospace, monospace", textColor: "#22FF22", highlightColor: "#000000", backgroundColor: "#22FF22", fontSize: "medium" },
  "Handwritten": { name: "Handwritten", style: "cursive-contrast", fontFamily: "Permanent Marker, cursive", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Cinema": { name: "Cinema", style: "cinematic", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "medium" },
  "Bubbles": { name: "Bubbles", style: "box", fontFamily: "Montserrat, sans-serif", textColor: "#111111", highlightColor: "#FFE14D", backgroundColor: "#FFFFFF", fontSize: "medium" },
  "Tilt Words": { name: "Tilt Words", style: "one-word", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Word Stack": { name: "Word Stack", style: "stacked", fontFamily: "Montserrat, sans-serif", textColor: "#FFE14D", highlightColor: "#FFE14D", fontSize: "large" },
  "Stack Big Left": { name: "Stack Big Left", style: "stacked", fontFamily: "Anton, Impact, sans-serif", textColor: "#FFE14D", highlightColor: "#FFE14D", fontSize: "xlarge" },
  "Stack Center": { name: "Stack Center", style: "stacked", fontFamily: "Montserrat, sans-serif", textColor: "#FFE14D", highlightColor: "#FFE14D", fontSize: "large" },
  "Terminal Typewriter": { name: "Terminal Typewriter", style: "typewriter", fontFamily: "ui-monospace, monospace", textColor: "#FFFFFF", highlightColor: "#FFE14D", backgroundColor: "rgba(0,0,0,0.72)", fontSize: "medium" },
  "Paper Typewriter": { name: "Paper Typewriter", style: "typewriter", fontFamily: "Courier New, monospace", textColor: "#222222", highlightColor: "#FFE14D", backgroundColor: "#F7F3E8", fontSize: "medium" },
  "Editorial Mix": { name: "Editorial Mix", style: "split-color", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE14D", fontSize: "large" },
  "Editorial Dark Gold": { name: "Editorial Dark Gold", style: "split-color", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE35A", fontSize: "large" },
  "Kinetic Editorial Gold": { name: "Kinetic Editorial Gold", style: "split-color", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE35A", fontSize: "large" },
};

