// lib/captions/whiteStairTemplates.ts
// Master registry of WhiteStair caption template cards, color styles, and single-line phrase definitions.
import { getKineticStyle } from "./kineticStyles";

export interface WhiteStairWordStyle {
  text?: string;
  color?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  glow?: string;
  pill?: boolean;
  underline?: boolean;
  font?: string;
}

export interface WhiteStairCard {
  id: string;
  name: string;
  presetKey: string;
  isCustom?: boolean;
  isCrossed?: boolean;
  words?: WhiteStairWordStyle[];
  subtext?: string;
  hasDots?: boolean;
  maxWordsPerLine?: number;
  layout?: "single-line" | "two-line" | "one-word" | "pill" | "box";
}

export const WHITESTAIR_TEMPLATES: WhiteStairCard[] = [
  { id: "custom", name: "Custom Theme", presetKey: "", isCustom: true, subtext: "Create your own" },
  {
    id: "classic",
    name: "Classic",
    presetKey: "Minimal Clean",
    hasDots: true,
    words: [{ text: "this is sample", color: "#FFFFFF" }],
    layout: "single-line",
    maxWordsPerLine: 4,
  },
  { id: "no-caption", name: "No Caption", presetKey: "none", isCrossed: true },
  {
    id: "solo",
    name: "Solo",
    presetKey: "Solo",
    words: [
      { text: "this", color: "#FFFFFF" },
      { text: "is", color: "#FACC15", bold: true, glow: "rgba(250,204,21,0.8)" },
      { text: "sample text now", color: "#FFFFFF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "crazy",
    name: "Crazy",
    presetKey: "Crazy",
    words: [
      { text: "Every", color: "#FFFFFF" },
      { text: "Single", color: "#FF7043", bold: true, glow: "rgba(255,112,67,0.8)" },
      { text: "Day", color: "#FACC15", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "discipline",
    name: "Discipline",
    presetKey: "Discipline",
    words: [
      { text: "where you", color: "#9CA3AF" },
      { text: "have", color: "#FFFFFF", bold: true },
      { text: "Never", color: "#EF4444", italic: true, bold: true },
      { text: "gone", color: "#9CA3AF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 4,
  },
  {
    id: "red-wipe",
    name: "Red Wipe",
    presetKey: "Red Wipe",
    words: [
      { text: "our business", color: "#FFFFFF" },
      { text: "is editing", color: "#FFFFFF", bg: "#DC2626", pill: true, bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "spark",
    name: "Spark",
    presetKey: "Spark",
    words: [
      { text: "and i'll", color: "#9CA3AF" },
      { text: "send it", color: "#22C55E", bold: true, glow: "rgba(34,197,94,0.9)" },
      { text: "your way", color: "#22C55E" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "creator-3",
    name: "Creator 3",
    presetKey: "Creator 3",
    words: [
      { text: "captions", color: "#4ADE80", bold: true, glow: "rgba(74,222,128,0.7)" },
      { text: "simple", color: "#FFFFFF", italic: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "creator-4",
    name: "Creator 4",
    presetKey: "Submagic Glow",
    words: [
      { text: "What's The", color: "#FACC15", bold: true, glow: "rgba(250,204,21,0.8)" },
      { text: "Difference", color: "#FFFFFF", italic: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "crazy-2",
    name: "Crazy 2",
    presetKey: "Crazy 2",
    words: [
      { text: "six", color: "#00E5FF", bold: true },
      { text: "checks", color: "#000000", bg: "#00E5FF", pill: true, bold: true },
      { text: "only", color: "#00E5FF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "perfect",
    name: "Perfect",
    presetKey: "Minimal Clean",
    words: [
      { text: "this is", color: "#9CA3AF" },
      { text: "sample", color: "#FFFFFF", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "editor",
    name: "Editor",
    presetKey: "Ali Abdaal Clean Pill",
    words: [
      { text: "Stop Searching", color: "#FFFFFF" },
      { text: "Editing", color: "#000000", bg: "#00E5FF", pill: true, bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "handwritten",
    name: "Handwritten",
    presetKey: "Cursive",
    words: [
      { text: "this is", color: "#FFFFFF" },
      { text: "sample", color: "#60A5FA", italic: true, font: "cursive" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "master",
    name: "Master",
    presetKey: "Master",
    words: [
      { text: "this is a", color: "#9CA3AF" },
      { text: "choice", color: "#38BDF8", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "simple",
    name: "Simple",
    presetKey: "Shorts Karaoke",
    words: [
      { text: "this", color: "#FFFFFF", bold: true },
      { text: "is sample", color: "#38BDF8", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "podcast",
    name: "Podcast",
    presetKey: "Diary of a CEO",
    words: [
      { text: "I'M NOT", color: "#FFFFFF", bold: true },
      { text: "GOING TO DO IT", color: "#FFFFFF" },
      { text: "BECAUSE...", color: "#9CA3AF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 4,
  },
  {
    id: "kinetic",
    name: "Kinetic",
    presetKey: "Kinetic",
    words: [
      { text: "Forget the", color: "#FFFFFF" },
      { text: "RED", color: "#FACC15", bold: true },
      { text: "deep,", color: "#00E5FF", bold: true },
      { text: "second.", color: "#9CA3AF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "impact",
    name: "Impact",
    presetKey: "Impact",
    words: [
      { text: "MY FRIEND", color: "#EF4444", bold: true, glow: "rgba(239,68,68,0.9)" },
      { text: "knows the judge", color: "#FFFFFF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "clean",
    name: "Clean",
    presetKey: "Minimal Clean",
    words: [
      { text: "Anime", color: "#FFFFFF", bold: true },
      { text: "has", color: "#000000", bg: "#EF4444", pill: true, bold: true },
      { text: "helped me", color: "#FFFFFF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "punch",
    name: "Punch",
    presetKey: "Punch",
    words: [
      { text: "PTA HOTA", color: "#000000", bg: "#FACC15", pill: true, bold: true },
      { text: "they can act", color: "#9CA3AF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "story",
    name: "Story",
    presetKey: "Story",
    words: [
      { text: "this is", color: "#FFFFFF" },
      { text: "story", color: "#EF4444", italic: true },
      { text: "made simple", color: "#9CA3AF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "gamer",
    name: "Gamer",
    presetKey: "Gamer",
    words: [{ text: "Clutch", color: "#00E5FF", bold: true, glow: "rgba(0,229,255,0.8)" }],
    layout: "one-word",
    maxWordsPerLine: 2,
  },
  {
    id: "cursive",
    name: "Cursive",
    presetKey: "Cursive",
    words: [
      { text: "daily", color: "#FFFFFF" },
      { text: "life", color: "#00E5FF", italic: true, bold: true, glow: "rgba(0,229,255,0.7)" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "popular",
    name: "Popular",
    presetKey: "MrBeast Shorts Impact",
    words: [{ text: "THIS IS SAMPLE", color: "#FFFFFF", bold: true }],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "highlight",
    name: "Highlight",
    presetKey: "Hormozi Viral Pop",
    words: [
      { text: "this is", color: "#FFFFFF" },
      { text: "sample", color: "#FACC15", underline: true, bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "karaoke",
    name: "Karaoke",
    presetKey: "Shorts Karaoke",
    words: [
      { text: "this is", color: "#64748B" },
      { text: "sample", color: "#FFFFFF", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "notification",
    name: "Notification",
    presetKey: "M3 Elevated Card",
    words: [
      { text: "Instagram • now", color: "#94A3B8" },
      { text: "this is sample", color: "#FFFFFF", bold: true },
    ],
    layout: "pill",
    maxWordsPerLine: 3,
  },
  {
    id: "mint-punch",
    name: "Mint Punch",
    presetKey: "Cyber Lime Pill",
    words: [{ text: "THIS IS SAMPLE", color: "#00FF9D", bold: true, glow: "rgba(0,255,157,0.7)" }],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "smooth",
    name: "Smooth",
    presetKey: "Kinetic Wave",
    words: [
      { text: "Learn To", color: "#FFFFFF" },
      { text: "Create", color: "#EF4444", bold: true },
      { text: "Captions", color: "#FFFFFF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "sticker",
    name: "Sticker",
    presetKey: "M3 Dynamic Chip",
    words: [{ text: "PICTURE", color: "#EF4444", bold: true }],
    layout: "one-word",
    maxWordsPerLine: 2,
  },
  {
    id: "glow",
    name: "Glow",
    presetKey: "Submagic Glow",
    words: [
      { text: "daily", color: "#FFFFFF" },
      { text: "life", color: "#A855F7", bold: true, glow: "rgba(168,85,247,0.9)" },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "shadow-3d",
    name: "Shadow 3D",
    presetKey: "MrBeast Shorts Impact",
    words: [
      { text: "Epic", color: "#FACC15", bold: true },
      { text: "3D", color: "#FFFFFF", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "pill",
    name: "Pill",
    presetKey: "M3 Tonal Pill",
    words: [{ text: "100%", color: "#000000", bg: "#22C55E", pill: true, bold: true }],
    layout: "pill",
    maxWordsPerLine: 2,
  },
  {
    id: "cook",
    name: "Cook",
    presetKey: "Cook",
    words: [{ text: "COOK", color: "#EF4444", bold: true, glow: "rgba(239,68,68,0.7)" }],
    layout: "one-word",
    maxWordsPerLine: 2,
  },
  {
    id: "estate",
    name: "Estate",
    presetKey: "Estate",
    words: [
      { text: "Sample text", color: "#FFFFFF" },
      { text: "Real Estate", color: "#94A3B8" },
    ],
    layout: "single-line",
    maxWordsPerLine: 4,
  },

  // 8 Kinetic Caption Styles (Claude AI Master System)
  {
    id: "pop-word",
    name: "Pop Word",
    presetKey: "Pop Word",
    words: [{ text: "POP", color: "#FFE14D", bold: true }],
    layout: "one-word",
    maxWordsPerLine: 1,
  },
  {
    id: "karaoke-line",
    name: "Karaoke Line",
    presetKey: "Karaoke Line",
    words: [
      { text: "Word", color: "#FFFFFF" },
      { text: "Line", color: "#FFE14D", bold: true },
    ],
    layout: "single-line",
    maxWordsPerLine: 4,
  },
  {
    id: "box-highlight",
    name: "Box Highlight",
    presetKey: "Box Highlight",
    words: [{ text: "BOX", color: "#000000", bg: "#FFE14D", pill: true, bold: true }],
    layout: "box",
    maxWordsPerLine: 3,
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    presetKey: "Neon Glow",
    words: [{ text: "glow", color: "#FFFFFF", glow: "#FFE14D", bold: true }],
    layout: "single-line",
    maxWordsPerLine: 3,
  },
  {
    id: "typewriter-style",
    name: "Typewriter",
    presetKey: "Typewriter",
    words: [{ text: "typewriter", color: "#FFFFFF", font: "monospace" }],
    layout: "single-line",
    maxWordsPerLine: 5,
  },
  {
    id: "slam-headline",
    name: "Slam Headline",
    presetKey: "Slam Headline",
    words: [{ text: "SLAM", color: "#FFE14D", bold: true }],
    layout: "one-word",
    maxWordsPerLine: 1,
  },
  {
    id: "word-stack",
    name: "Word Stack",
    presetKey: "Word Stack",
    words: [{ text: "STACK", color: "#FFE14D", bold: true }],
    layout: "one-word",
    maxWordsPerLine: 3,
  },
  {
    id: "editorial-mix",
    name: "Editorial Mix",
    presetKey: "Editorial Mix",
    words: [
      { text: "EDITORIAL", color: "#FFE14D", bold: true },
      { text: "subtitle words here", color: "#FFFFFF" },
    ],
    layout: "single-line",
    maxWordsPerLine: 5,
  },
];

/**
 * Resolves a template by either its unique id (e.g. "creator-4"),
 * its human-readable name ("Creator 4"), or its Remotion presetKey.
 */
export function getWhiteStairTemplate(idOrKey?: string): WhiteStairCard | undefined {
  if (!idOrKey) return undefined;
  const clean = idOrKey.trim().toLowerCase();

  // 1. Direct match on card id
  const byId = WHITESTAIR_TEMPLATES.find((t) => t.id.toLowerCase() === clean);
  if (byId) return byId;

  // 2. Direct match on card name
  const byName = WHITESTAIR_TEMPLATES.find((t) => t.name.toLowerCase() === clean);
  if (byName) return byName;

  // 3. Match on presetKey
  const byKey = WHITESTAIR_TEMPLATES.find((t) => t.presetKey.toLowerCase() === clean);
  if (byKey) return byKey;

  // 4. Match any of the 50 Kinetic Styles dynamically
  const kinetic = getKineticStyle(clean);
  if (kinetic) {
    return {
      id: kinetic.id,
      name: kinetic.name,
      presetKey: kinetic.name,
      layout: kinetic.layout === "o" ? "one-word" : kinetic.layout === "l" ? "single-line" : "box",
      maxWordsPerLine: kinetic.chunk,
      words: [{ text: kinetic.name, color: "#FFE14D", bold: true }],
    };
  }

  return undefined;
}
