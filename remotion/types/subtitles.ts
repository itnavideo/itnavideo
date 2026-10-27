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
};
