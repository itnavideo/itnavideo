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
  | "typewriter-code"
  | "marker-highlight"
  | "floating-serif"
  | "metallic-gradient"
  | "neon-pulse"
  | "minimal-fade"
  | "gradient-wave"
  | "retro-vhs"
  | "handwritten"
  | "glass-blur"
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
  | "mrbeast-16-9"
  | "mkbhd-tech"
  | "bbc-netflix-cc"
  | "kurzgesagt"
  | "lex-fridman"
  | "creator-3"
  | "crazy-gradient"
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
  | "blue-muse"
  | "headliner"
  | "chalk"
  | "cursive"
  | "gold-centre"
  | "floodlight"
  | "storyline"
  | "the-difference"
  | "action"
  | "stat-numbers";

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
  // ── Western 16:9 YouTube Creator Presets (USA, UK, Canada, Australia) ──
  // ── Moonshot Typography Presets (https://makemoonshot.co/) ──
  "Blue Muse": { name: "Blue Muse", style: "blue-muse", fontFamily: "Playfair Display, Inter, sans-serif", textColor: "#3B82F6", highlightColor: "#FFFFFF", fontSize: "large" },
  "Headliner": { name: "Headliner", style: "headliner", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6D00", fontSize: "xlarge" },
  "Chalk": { name: "Chalk", style: "chalk", fontFamily: "Courier New, monospace", textColor: "#FFFFFF", highlightColor: "#FACC15", backgroundColor: "rgba(0,0,0,0.85)", fontSize: "medium" },
  "Cursive": { name: "Cursive", style: "cursive", fontFamily: "Georgia, cursive, serif", textColor: "#F8FAFC", highlightColor: "#FF9100", fontSize: "large" },
  "Gold Centre": { name: "Gold Centre", style: "gold-centre", fontFamily: "Arial Black, sans-serif", textColor: "#FFD700", highlightColor: "#FFA726", fontSize: "xlarge" },
  "Floodlight": { name: "Floodlight", style: "floodlight", fontFamily: "Inter, sans-serif", textColor: "#000000", highlightColor: "#FACC15", backgroundColor: "#FACC15", fontSize: "large" },
  "Storyline": { name: "Storyline", style: "storyline", fontFamily: "Playfair Display, Georgia, serif", textColor: "#FFFFFF", highlightColor: "#38BDF8", fontSize: "medium" },
  "The Difference": { name: "The Difference", style: "the-difference", fontFamily: "Space Grotesk, sans-serif", textColor: "#C084FC", highlightColor: "#2DD4BF", fontSize: "large" },
  "Action": { name: "Action", style: "action", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "xlarge" },
  "Stat Numbers": { name: "Stat Numbers", style: "stat-numbers", fontFamily: "Impact, Arial Black, sans-serif", textColor: "#00FF88", highlightColor: "#00FF88", fontSize: "xlarge" },

  "Ali Abdaal Clean Pill": { name: "Ali Abdaal Clean Pill", style: "ali-abdaal", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FDE047", backgroundColor: "rgba(15, 23, 42, 0.85)", fontSize: "medium" },
  "Vox Documentary": { name: "Vox Documentary", style: "vox-docu", fontFamily: "Georgia, Newsreader, serif", textColor: "#FFFBEB", highlightColor: "#F59E0B", backgroundColor: "rgba(12, 10, 9, 0.90)", fontSize: "medium" },
  "Diary of a CEO": { name: "Diary of a CEO", style: "diary-of-ceo", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Huberman Lab Lecture": { name: "Huberman Lab Lecture", style: "huberman-lecture", fontFamily: "Inter, sans-serif", textColor: "#F8FAFC", highlightColor: "#38BDF8", backgroundColor: "rgba(10, 10, 10, 0.92)", fontSize: "medium" },
  "MrBeast 16:9 Punch": { name: "MrBeast 16:9 Punch", style: "mrbeast-16-9", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },
  "MKBHD Tech Studio": { name: "MKBHD Tech Studio", style: "mkbhd-tech", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", backgroundColor: "rgba(24, 24, 27, 0.92)", fontSize: "medium" },
  "BBC / Netflix Closed Captions": { name: "BBC / Netflix Closed Captions", style: "bbc-netflix-cc", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "rgba(0, 0, 0, 0.88)", fontSize: "medium" },
  "Kurzgesagt Explainer": { name: "Kurzgesagt Explainer", style: "kurzgesagt", fontFamily: "Poppins, sans-serif", textColor: "#F8FAFC", highlightColor: "#67E8F9", backgroundColor: "rgba(30, 41, 59, 0.88)", fontSize: "medium" },
  "Lex Fridman Minimalist": { name: "Lex Fridman Minimalist", style: "lex-fridman", fontFamily: "Inter, sans-serif", textColor: "#E2E8F0", highlightColor: "#FFFFFF", fontSize: "medium" },

  // ── YouTube Long-Form Real Creator Styles ──
  "Minimal Clean": { name: "Minimal Clean", style: "normal", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Cinematic Docu": { name: "Cinematic Docu", style: "cinematic", fontFamily: "Montserrat, sans-serif", textColor: "#F5F5F0", highlightColor: "#FDE047", fontSize: "medium" },
  "Studio Podcast": { name: "Studio Podcast", style: "box", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "#000000", fontSize: "large" },
  "Bold Creator": { name: "Bold Creator", style: "bold-outline", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },
  "Netflix Classic": { name: "Netflix Classic", style: "cinematic", fontFamily: "Roboto, sans-serif", textColor: "#FFDE00", highlightColor: "#FFDE00", fontSize: "medium" },

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
  "Marker Highlight": { name: "Marker Highlight", style: "marker-highlight", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FDE68A", backgroundColor: "#F59E0B", fontSize: "large" },
  "Floating Serif": { name: "Floating Serif", style: "floating-serif", fontFamily: "Georgia, serif", textColor: "#F8FAFC", highlightColor: "#E5E7EB", fontSize: "medium" },
  "Metallic Gradient": { name: "Metallic Gradient", style: "metallic-gradient", fontFamily: "Arial Black, sans-serif", textColor: "#F8FAFC", highlightColor: "#D9B76E", backgroundColor: "#111827", fontSize: "large" },
  "Neon Pulse": { name: "Neon Pulse", style: "neon-pulse", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#00FF88", backgroundColor: "rgba(0,0,0,0.75)", fontSize: "large" },
  "Minimal Fade": { name: "Minimal Fade", style: "minimal-fade", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#94A3B8", fontSize: "medium" },
  "Gradient Wave": { name: "Gradient Wave", style: "gradient-wave", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#8B5CF6", backgroundColor: "rgba(0,0,0,0.6)", fontSize: "large" },
  "Retro VHS": { name: "Retro VHS", style: "retro-vhs", fontFamily: "Courier New, monospace", textColor: "#FFFFFF", highlightColor: "#FF6B6B", backgroundColor: "rgba(0,0,0,0.85)", fontSize: "large" },
  "Handwritten": { name: "Handwritten", style: "handwritten", fontFamily: "Georgia, serif", textColor: "#F8FAFC", highlightColor: "#FBBF24", fontSize: "large" },
  "Glass Blur": { name: "Glass Blur", style: "glass-blur", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#60A5FA", backgroundColor: "rgba(15,23,42,0.55)", fontSize: "large" },
  "split-color": { name: "Split Color", style: "split-color", fontFamily: "sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "medium" },

  // ── Professional additions (reuse tested render layouts) ──
  "Sharp Yellow": { name: "Sharp Yellow", style: "highlight", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },
  "Ocean Blue": { name: "Ocean Blue", style: "highlight", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#38BDF8", fontSize: "large" },
  "Screamer": { name: "Screamer", style: "bold-outline", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "xlarge" },
  "Netflix Bar": { name: "Netflix Bar", style: "cinematic", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "medium" },
  "Black Card": { name: "Black Card", style: "floating-serif", fontFamily: "Playfair Display, serif", textColor: "#F8FAFC", highlightColor: "#D9B76E", fontSize: "large" },
  "Stock Green": { name: "Stock Green", style: "stacked", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", backgroundColor: "#0B1120", fontSize: "large" },
  "Boardroom": { name: "Boardroom", style: "vollkorn", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#38BDF8", backgroundColor: "#000000", fontSize: "medium" },
  "Podcast Hype": { name: "Podcast Hype", style: "stacked", fontFamily: "Arial Black, sans-serif", textColor: "#FFFFFF", highlightColor: "#F97316", backgroundColor: "#18181B", fontSize: "xlarge" },

  // ── Demo Video References (Cloudinary Uploads) ──
  "Warikoo Black Card": { name: "Warikoo Black Card", style: "warikoo-black-card", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "rgba(0, 0, 0, 0.88)", fontSize: "medium" },
  "Active Orange Pill": { name: "Active Orange Pill", style: "active-blue-pill", fontFamily: "Montserrat, Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6D00", fontSize: "large" },
  "Storyteller Bold": { name: "Storyteller Bold", style: "bold-outline", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", fontSize: "large" },

  // ── Viral Short-Form Presets (TikTok, IG Reels, YT Shorts — USA, UK, Canada, Australia) ──
  "Hormozi Viral Pop": { name: "Hormozi Viral Pop", style: "one-word", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", fontSize: "xlarge" },
  "MrBeast Shorts Impact": { name: "MrBeast Shorts Impact", style: "mrbeast-16-9", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFE500", fontSize: "xlarge" },
  "Submagic Glow": { name: "Submagic Glow", style: "gradient-wave", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#A855F7", backgroundColor: "rgba(15, 23, 42, 0.85)", fontSize: "large" },
  "Devane Luxury Serif": { name: "Devane Luxury Serif", style: "floating-serif", fontFamily: "Georgia, Playfair Display, serif", textColor: "#F8FAFC", highlightColor: "#D9B76E", fontSize: "large" },
  "Cyber Lime Pill": { name: "Cyber Lime Pill", style: "gold-pill", fontFamily: "Arial Black, sans-serif", textColor: "#A3E635", highlightColor: "#A3E635", backgroundColor: "#000000", fontSize: "large" },
  "Opus Inverted Box": { name: "Opus Inverted Box", style: "box", fontFamily: "Montserrat, sans-serif", textColor: "#000000", highlightColor: "#FACC15", backgroundColor: "#FACC15", fontSize: "large" },

  // ── Material Design 3 (M3) Official Specifications (m3.material.io) ──
  "M3 Tonal Pill": { name: "M3 Tonal Pill", style: "m3-tonal-pill", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#F8FAFC", highlightColor: "#38BDF8", backgroundColor: "rgba(24, 24, 27, 0.85)", fontSize: "large" },
  "M3 Dynamic Chip": { name: "M3 Dynamic Chip", style: "m3-dynamic-chip", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.15)", fontSize: "large" },
  "M3 Elevated Card": { name: "M3 Elevated Card", style: "m3-elevated-card", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#A855F7", backgroundColor: "rgba(28, 27, 31, 0.9)", fontSize: "large" },
  "M3 Surface Outline": { name: "M3 Surface Outline", style: "m3-surface-outline", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#38BDF8", backgroundColor: "rgba(15, 23, 42, 0.8)", fontSize: "large" },
  "M3 Primary Container": { name: "M3 Primary Container", style: "m3-primary-container", fontFamily: "Plus Jakarta Sans, sans-serif", textColor: "#FFFFFF", highlightColor: "#67E8F9", backgroundColor: "rgba(30, 58, 138, 0.88)", fontSize: "large" },

  // ── Competitor Specials (Captions.ai & Submagic Inspired) ──
  "Creator 3": { name: "Creator 3", style: "creator-3", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#4ADE80", backgroundColor: "#000000", fontSize: "large" },
  "Crazy": { name: "Crazy", style: "crazy-gradient", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  "Crazy 2": { name: "Crazy 2", style: "crazy-cyan", fontFamily: "Montserrat, Arial Black, sans-serif", textColor: "#38BDF8", highlightColor: "#38BDF8", backgroundColor: "#000000", fontSize: "large" },
  "Spark": { name: "Spark", style: "spark-glow", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#22C55E", fontSize: "large" },
  "Gamer": { name: "Gamer", style: "gamer-bold", fontFamily: "Impact, sans-serif", textColor: "#0284C7", highlightColor: "#38BDF8", fontSize: "xlarge" },
  "Cursive Contrast": { name: "Cursive Contrast", style: "cursive-contrast", fontFamily: "Caveat, Georgia, cursive", textColor: "#FFFFFF", highlightColor: "#EC4899", fontSize: "large" },
  "Discipline": { name: "Discipline", style: "discipline-red", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "large" },
  "Kinetic": { name: "Kinetic", style: "kinetic-multicolor", fontFamily: "Impact, Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },
  "Impact": { name: "Impact", style: "impact-glow", fontFamily: "Impact, sans-serif", textColor: "#EF4444", highlightColor: "#EF4444", backgroundColor: "#000000", fontSize: "xlarge" },
  "Red Wipe": { name: "Red Wipe", style: "red-wipe", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFFFFF", backgroundColor: "#DC2626", fontSize: "large" },
  "Punch": { name: "Punch", style: "punch-yellow", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "large" },
  "Cook": { name: "Cook", style: "cook-chromatic", fontFamily: "Montserrat, sans-serif", textColor: "#FB923C", highlightColor: "#E879F9", fontSize: "xlarge" },
  "Master": { name: "Master", style: "master-pill", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#38BDF8", backgroundColor: "#0F172A", fontSize: "large" },
  "Solo": { name: "Solo", style: "solo-pop", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15", fontSize: "xlarge" },
  "Estate": { name: "Estate", style: "estate-metallic", fontFamily: "Montserrat, Arial Black, sans-serif", textColor: "#F8FAFC", highlightColor: "#E2E8F0", fontSize: "large" },
  "Story": { name: "Story", style: "story-serif", fontFamily: "Georgia, Playfair Display, serif", textColor: "#FFFFFF", highlightColor: "#EF4444", fontSize: "large" },

  // ── Kids, 2D Animation & 3D Creator Presets ──
  "Rainbow Pop": { name: "Rainbow Pop", style: "word-pop", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFA726", fontSize: "large" },
  "Bubble Bounce": { name: "Bubble Bounce", style: "pill-bounce", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", backgroundColor: "#0E1526", fontSize: "large" },
  "Storybook Spark": { name: "Storybook Spark", style: "floating-serif", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#FFA726", fontSize: "large" },
  "Crayon Caption": { name: "Crayon Caption", style: "handwritten", fontFamily: "Georgia, cursive, serif", textColor: "#FFFFFF", highlightColor: "#FF8F00", fontSize: "large" },
  "Candy Karaoke": { name: "Candy Karaoke", style: "shorts-karaoke", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6D00", backgroundColor: "#0E1526", fontSize: "large" },
  "Toon Word Pop": { name: "Toon Word Pop", style: "creator-3", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFA726", backgroundColor: "#0E1526", fontSize: "large" },
  "Comic Burst 2D": { name: "Comic Burst 2D", style: "shatter", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6D00", fontSize: "large" },
  "Cel Shade 2D": { name: "Cel Shade 2D", style: "bold-outline", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFA726", fontSize: "large" },
  "Anime Kinetic 2D": { name: "Anime Kinetic 2D", style: "punch-yellow", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF8F00", fontSize: "xlarge" },
  "Flat Motion 2D": { name: "Flat Motion 2D", style: "split-color", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", fontSize: "large" },
  "Pixel Pop 2D": { name: "Pixel Pop 2D", style: "typewriter-code", fontFamily: "Courier New, monospace", textColor: "#FFFFFF", highlightColor: "#10B981", fontSize: "large" },
  "Cutout Story 2D": { name: "Cutout Story 2D", style: "box", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF8F00", backgroundColor: "#0E1526", fontSize: "large" },
  "Toy Block 3D": { name: "Toy Block 3D", style: "m3-elevated-card", fontFamily: "Poppins, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", backgroundColor: "rgba(14, 21, 38, 0.92)", fontSize: "large" },
  "Depth Pop 3D": { name: "Depth Pop 3D", style: "big-bold", fontFamily: "Impact, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF6D00", fontSize: "xlarge" },
  "Chrome Bounce 3D": { name: "Chrome Bounce 3D", style: "metallic-gradient", fontFamily: "Arial Black, sans-serif", textColor: "#FFFFFF", highlightColor: "#FFA726", backgroundColor: "#0E1526", fontSize: "large" },
  "Holo Glass 3D": { name: "Holo Glass 3D", style: "glass-blur", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", backgroundColor: "rgba(14, 21, 38, 0.82)", fontSize: "large" },
  "Neon Voxel 3D": { name: "Neon Voxel 3D", style: "neon-pulse", fontFamily: "Montserrat, sans-serif", textColor: "#FFFFFF", highlightColor: "#10B981", backgroundColor: "rgba(7, 11, 20, 0.88)", fontSize: "large" },
  "Orbit Motion 3D": { name: "Orbit Motion 3D", style: "gradient-wave", fontFamily: "Inter, sans-serif", textColor: "#FFFFFF", highlightColor: "#FF8F00", backgroundColor: "rgba(14, 21, 38, 0.82)", fontSize: "large" },
  "Cinema Depth 3D": { name: "Cinema Depth 3D", style: "cinematic", fontFamily: "Georgia, serif", textColor: "#FFFFFF", highlightColor: "#FFA726", fontSize: "large" },
};
