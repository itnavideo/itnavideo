// remotion/types/subtitles.ts
// Shared subtitle types for all Itnavideo templates

export type SubtitleStyle =
  | "none"
  | "normal"
  | "highlight"
  | "big-bold"
  | "word-pop"
  | "neon"
  | "box"
  | "split-color"
  | "typewriter"
  | "bold-outline"
  | "one-word"
  | "gold-pill"
  | "stacked"
  | "inline-bg"
  | "vollkorn"
  | "karaoke"
  | "shorts-karaoke"
  | "reels-clean"
  | "bold-highlight-strip"
  | "shatter"
  | "pill-bounce"
  | "cinematic"
  | "typewriter-code";

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
  Eclipse: { name: "Eclipse", style: "highlight", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#7C3AED", fontSize: "large" },
  Hustle: { name: "Hustle", style: "bold-outline", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "large" },
  Marigold: { name: "Marigold", style: "normal", fontFamily: "Georgia, serif", textColor: "#F59E0B", highlightColor: "#F59E0B", fontSize: "medium" },
  "Gold Pill": { name: "Gold Pill", style: "gold-pill", fontFamily: "Arial Black, sans-serif", textColor: "#FFD700", highlightColor: "#FFD700", backgroundColor: "#000000", fontSize: "large" },
  Midnight: { name: "Midnight", style: "inline-bg", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#3B82F6", fontSize: "medium" },
  "Arctic Glow": { name: "Arctic Glow", style: "neon", fontFamily: "sans-serif", textColor: "#E0F2FE", highlightColor: "#38BDF8", fontSize: "large" },
  "Studio Clean": { name: "Studio Clean", style: "stacked", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", backgroundColor: "#18181B", fontSize: "large" },
  "One Word": { name: "One Word", style: "one-word", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  Vollkorn: { name: "Vollkorn", style: "vollkorn", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#22D3EE", backgroundColor: "#000000", fontSize: "large" },
  "Pop Candy": { name: "Pop Candy", style: "box", fontFamily: "sans-serif", textColor: "#000000", highlightColor: "#F472B6", fontSize: "large" },
  Typewriter: { name: "Typewriter", style: "typewriter", fontFamily: "Courier New, monospace", textColor: "#10B981", highlightColor: "#10B981", fontSize: "medium" },
  "Bold Fire": { name: "Bold Fire", style: "big-bold", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#F97316", fontSize: "xlarge" },
  "Karaoke Fill": { name: "Karaoke Fill", style: "karaoke", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE500", fontSize: "large" },
  "Shorts Karaoke": { name: "Shorts Karaoke", style: "shorts-karaoke", fontFamily: "Inter, sans-serif", textColor: "#9CA3AF", highlightColor: "#111827", backgroundColor: "#F4F4F5", fontSize: "large" },
  "Reels Clean": { name: "Reels Clean", style: "reels-clean", fontFamily: "Inter, sans-serif", textColor: "#F8FAFC", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Bold Highlight Strip": { name: "Bold Highlight Strip", style: "bold-highlight-strip", fontFamily: "Fredoka", textColor: "#FFFFFF", highlightColor: "#FFF3A3", backgroundColor: "#F59E0B", fontSize: "xlarge" },
  "Shatter Drop": { name: "Shatter Drop", style: "shatter", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF3D3D", fontSize: "large" },
  "Pill Bounce": { name: "Pill Bounce", style: "pill-bounce", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6B35", fontSize: "large" },
  "Cinematic": { name: "Cinematic", style: "cinematic", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Hacker Type": { name: "Hacker Type", style: "typewriter-code", fontFamily: "Courier New, monospace", textColor: "#00FF88", highlightColor: "#00FF88", fontSize: "medium" },
  "split-color": { name: "Split Color", style: "split-color", fontFamily: "sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "medium" },
};
