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
  | "bold-outline";

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
