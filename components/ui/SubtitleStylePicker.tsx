"use client";

import React from "react";
import { Check, Play, Pause, Sparkles, Volume2, VolumeX } from "lucide-react";
import {
  SUBTITLE_PRESETS as REMOTION_SUBTITLE_PRESETS,
  type SubtitleStyle,
} from "@/remotion/types/subtitles";
import { getCaptionStyleCatalogItem } from "@/lib/cloudinary/captionCatalog";

type SubtitleStyleKey = string;

export type PresetOption = {
  key: string;
  label: string;
  style: string;
  font: string;
  textColor: string;
  highlightColor: string;
  bgColor?: string;
};

type PreviewLayout =
  | "phrase"
  | "stacked"
  | "one-word"
  | "pill"
  | "bounce-pill"
  | "strip"
  | "code"
  | "shorts"
  | "karaoke"
  | "box"
  | "split"
  | "cinematic-bar"
  | "editorial-serif"
  | "impact-outline"
  | "marker-highlight"
  | "floating-serif"
  | "metallic-gradient"
  | "neon-pulse"
  | "glass-blur"
  | "minimal-fade"
  | "gradient-wave"
  | "retro-vhs"
  | "handwritten"
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
  | "blue-muse"
  | "headliner"
  | "chalk"
  | "gold-centre"
  | "floodlight"
  | "storyline"
  | "the-difference"
  | "action"
  | "stat-numbers"
  | string;

export type CaptionStylePreviewConfig = {
  sampleLines: string[];
  activeWord?: string;
  background?: string;
  backgroundImage?: string;
  accent?: string;
  layout?: PreviewLayout;
};

export const PREVIEW_VIDEO_URL =
  "";   // Upload replacement video to GCS itnavideo-media-assets bucket
export const PREVIEW_POSTER_URL =
  "/visuals/homepage/autocaption.1.png";

export const PREVIEW_LONG_FORM_VIDEO_URL =
  "https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.3gp";
export const PREVIEW_LONG_FORM_POSTER_URL =
  "/visuals/homepage/youtubesubtitlesgenerator.1.png";

export type CaptionScriptWord = {
  word: string;
  start: number;
  end: number;
};

export type CaptionScriptChunk = {
  id: number;
  start: number;
  end: number;
  sampleLines: string[];
  activeWord: string;
  words: CaptionScriptWord[];
};

export const PREVIEW_SCRIPT_CHUNKS: CaptionScriptChunk[] = [
  {
    id: 0,
    start: 0.0,
    end: 1.85,
    sampleLines: ["If your videos", "aren't getting views,"],
    activeWord: "views",
    words: [
      { word: "If", start: 0.40, end: 0.56 },
      { word: "your", start: 0.56, end: 0.70 },
      { word: "videos", start: 0.70, end: 1.00 },
      { word: "aren't", start: 1.00, end: 1.22 },
      { word: "getting", start: 1.22, end: 1.40 },
      { word: "views,", start: 1.40, end: 1.85 },
    ],
  },
  {
    id: 1,
    start: 1.85,
    end: 3.40,
    sampleLines: ["it might not be", "your content."],
    activeWord: "content",
    words: [
      { word: "it", start: 1.95, end: 2.14 },
      { word: "might", start: 2.14, end: 2.30 },
      { word: "not", start: 2.30, end: 2.44 },
      { word: "be", start: 2.44, end: 2.60 },
      { word: "your", start: 2.60, end: 2.72 },
      { word: "content.", start: 2.72, end: 3.40 },
    ],
  },
  {
    id: 2,
    start: 3.40,
    end: 5.85,
    sampleLines: ["Most people scroll away", "in the first few seconds."],
    activeWord: "scroll",
    words: [
      { word: "Most", start: 3.40, end: 3.88 },
      { word: "people", start: 3.88, end: 4.12 },
      { word: "scroll", start: 4.12, end: 4.40 },
      { word: "away", start: 4.40, end: 4.66 },
      { word: "in", start: 4.66, end: 4.84 },
      { word: "the", start: 4.84, end: 4.94 },
      { word: "first", start: 4.94, end: 5.14 },
      { word: "few", start: 5.14, end: 5.30 },
      { word: "seconds.", start: 5.30, end: 5.85 },
    ],
  },
  {
    id: 3,
    start: 5.85,
    end: 7.70,
    sampleLines: ["They can't follow", "what's being said."],
    activeWord: "follow",
    words: [
      { word: "They", start: 5.85, end: 6.24 },
      { word: "can't", start: 6.24, end: 6.44 },
      { word: "follow", start: 6.44, end: 6.70 },
      { word: "what's", start: 6.70, end: 6.90 },
      { word: "being", start: 6.90, end: 7.06 },
      { word: "said.", start: 7.06, end: 7.70 },
    ],
  },
  {
    id: 4,
    start: 7.70,
    end: 10.05,
    sampleLines: ["Clear captions", "keep people watching."],
    activeWord: "captions",
    words: [
      { word: "Clear", start: 7.75, end: 8.12 },
      { word: "captions", start: 8.12, end: 8.56 },
      { word: "keep", start: 8.56, end: 8.82 },
      { word: "people", start: 8.82, end: 9.10 },
      { word: "watching.", start: 9.10, end: 10.00 },
    ],
  },
];

const CREATOR_BACKGROUNDS = {
  studio: PREVIEW_POSTER_URL,
  faceless: PREVIEW_POSTER_URL,
  podcast: PREVIEW_POSTER_URL,
  business: PREVIEW_POSTER_URL,
  tech: PREVIEW_POSTER_URL,
  educator: PREVIEW_POSTER_URL,
} as const;

export const PRESET_ORDER = [
  // ── Moonshot Typography Presets (https://makemoonshot.co/) ──
  "Blue Muse",
  "Headliner",
  "Chalk",
  "Cursive",
  "Gold Centre",
  "Floodlight",
  "Storyline",
  "The Difference",
  "Action",
  "Stat Numbers",

  // ── Competitor Specials (Captions.ai & Submagic Inspired) ──
  "Creator 3",
  "Crazy",
  "Crazy 2",
  "Spark",
  "Gamer",
  "Cursive",
  "Discipline",
  "Kinetic",
  "Impact",
  "Red Wipe",
  "Punch",
  "Cook",
  "Master",
  "Solo",
  "Estate",
  "Story",

  // ── Top Viral Creator Presets (TikTok, Reels, Shorts — USA, UK, Canada, Australia) ──
  "Hormozi Viral Pop",
  "MrBeast Shorts Impact",
  "Submagic Glow",
  "Ali Abdaal Clean Pill",
  "Devane Luxury Serif",
  "Cyber Lime Pill",
  "Opus Inverted Box",
  "Shorts Karaoke",
  "Vox Documentary",
  "Diary of a CEO",
  "Huberman Lab Lecture",
  "MrBeast 16:9 Punch",
  "MKBHD Tech Studio",
  "Kurzgesagt Explainer",
  "Lex Fridman Minimalist",
  "BBC / Netflix Closed Captions",

  // ── Material Design 3 (M3) Presets ──
  "M3 Tonal Pill",
  "M3 Dynamic Chip",
  "M3 Elevated Card",
  "M3 Surface Outline",
  "M3 Primary Container",
  "Warikoo Black Card",
  "Active Orange Pill",

  // ── Clean & Minimalist Presets ──
  "Minimal Clean",
  "Reels Clean",
  "Cinematic Docu",
  "Studio Podcast",
  "Bold Creator",
  "Sharp Yellow",
  "Studio Clean",
  "Eclipse",
  "Karaoke Fill",
  "Bold Fire",
  "Ocean Blue",
  "Podcast Hype",
  "Hustle",
  "Bold Highlight Strip",
  "Shatter Drop",
  "One Word",
  "Metallic Gradient",
  "Gold Pill",
  "Stock Green",
  "Glass Blur",
  "Netflix Bar",
  "Boardroom",
  "Marker Highlight",
  "Pill Bounce",
  "Neon Pulse",
  "Hacker Type",
  "Gradient Wave",
  "Retro VHS",
  "Handwritten",
  "Pop Candy",
  "Floating Serif",
  "Midnight",
  "Arctic Glow",
  "Rainbow Pop",
  "Bubble Bounce",
  "Storybook Spark",
  "Crayon Caption",
  "Candy Karaoke",
  "Toon Word Pop",
  "Comic Burst 2D",
  "Cel Shade 2D",
  "Anime Kinetic 2D",
  "Flat Motion 2D",
  "Pixel Pop 2D",
  "Cutout Story 2D",
  "Toy Block 3D",
  "Depth Pop 3D",
  "Chrome Bounce 3D",
  "Holo Glass 3D",
  "Neon Voxel 3D",
  "Orbit Motion 3D",
  "Cinema Depth 3D",
];

export const SHORTS_PRESET_ORDER = PRESET_ORDER;

export const LONG_FORM_PRESET_ORDER = [
  // ── Western 16:9 Creator Presets (USA, UK, Canada, Australia) ──
  "Ali Abdaal Clean Pill",
  "Vox Documentary",
  "Diary of a CEO",
  "Huberman Lab Lecture",
  "MrBeast 16:9 Punch",
  "MKBHD Tech Studio",
  "BBC / Netflix Closed Captions",
  "Kurzgesagt Explainer",
  "Lex Fridman Minimalist",
  "Warikoo Black Card",
  "Active Orange Pill",
  "M3 Tonal Pill",
  "M3 Dynamic Chip",
  "M3 Elevated Card",
  "M3 Surface Outline",
  "M3 Primary Container",
  "Minimal Clean",
  "Cinematic Docu",
  "Studio Podcast",
  "Bold Creator",
  "Glass Blur",
  "Karaoke Fill",
  "Marker Highlight",
  "Floating Serif",
  "Metallic Gradient",
  "Ocean Blue",
  "Stock Green",
  "Boardroom",
  "Hacker Type",
  "Retro VHS",
  "Neon Pulse",
];

/** Categories for filtering in the dashboard */
export const STYLE_CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'competitors', label: '⚡ Competitor Specials (Captions/Submagic)' },
  { id: 'creators', label: '🇬🇧 Top UK/USA Creators' },
  { id: 'shorts', label: '🔥 Viral Shorts (TikTok/Reels)' },
  { id: 'material', label: '💎 M3 Design' },
  { id: 'clean', label: '📐 Clean & Minimal' },
  { id: 'bold', label: '🎯 Bold Impact' },
  { id: 'premium', label: '✨ Luxury & Docu' },
  { id: 'kids', label: 'Kids Creators' },
  { id: 'animation2d', label: '2D Animation' },
  { id: 'animation3d', label: '3D Animation' },
] as const;

export const STYLE_CATEGORY_MAP: Record<string, string> = {
  // ── Competitor Specials ──
  'Creator 3': 'competitors',
  'Crazy': 'competitors',
  'Crazy 2': 'competitors',
  'Spark': 'competitors',
  'Gamer': 'competitors',
  'Cursive': 'competitors',
  'Discipline': 'competitors',
  'Kinetic': 'competitors',
  'Impact': 'competitors',
  'Red Wipe': 'competitors',
  'Punch': 'competitors',
  'Cook': 'competitors',
  'Master': 'competitors',
  'Solo': 'competitors',
  'Estate': 'competitors',
  'Story': 'competitors',

  // ── Viral Shorts & Top Creators ──
  'Hormozi Viral Pop': 'shorts',
  'MrBeast Shorts Impact': 'shorts',
  'Submagic Glow': 'shorts',
  'Devane Luxury Serif': 'shorts',
  'Cyber Lime Pill': 'shorts',
  'Opus Inverted Box': 'shorts',
  'Shorts Karaoke': 'shorts',
  'Ali Abdaal Clean Pill': 'creators',
  'Vox Documentary': 'creators',
  'Diary of a CEO': 'creators',
  'Huberman Lab Lecture': 'creators',
  'MrBeast 16:9 Punch': 'creators',
  'MKBHD Tech Studio': 'creators',
  'BBC / Netflix Closed Captions': 'creators',
  'Kurzgesagt Explainer': 'creators',
  'Lex Fridman Minimalist': 'creators',

  // ── M3 Design ──
  'Warikoo Black Card': 'material',
  'Active Orange Pill': 'material',
  'M3 Tonal Pill': 'material',
  'M3 Dynamic Chip': 'material',
  'M3 Elevated Card': 'material',
  'M3 Surface Outline': 'material',
  'M3 Primary Container': 'material',

  // ── Clean & Minimal ──
  'Minimal Clean': 'clean',
  'Reels Clean': 'clean',
  'Midnight': 'clean',
  'Hacker Type': 'clean',
  'Arctic Glow': 'clean',
  'Floating Serif': 'clean',
  'Minimal Fade': 'clean',

  // ── Bold Impact ──
  'Bold Creator': 'bold',
  'Sharp Yellow': 'bold',
  'Studio Podcast': 'bold',
  'Studio Clean': 'bold',
  'Eclipse': 'bold',
  'Karaoke Fill': 'bold',
  'Bold Fire': 'bold',
  'Ocean Blue': 'bold',
  'Podcast Hype': 'bold',
  'Hustle': 'bold',
  'Bold Highlight Strip': 'bold',
  'Shatter Drop': 'bold',
  'One Word': 'bold',
  'Neon Pulse': 'bold',

  // ── Moonshot Typography Presets (https://makemoonshot.co/) ──
  'Blue Muse': 'viral',
  'Headliner': 'viral',
  'Chalk': 'creative',
  'Gold Centre': 'premium',
  'Floodlight': 'viral',
  'Storyline': 'premium',
  'The Difference': 'viral',
  'Action': 'viral',
  'Stat Numbers': 'viral',

  // ── Luxury, Premium & Creative ──
  'Metallic Gradient': 'premium',
  'Gold Pill': 'premium',
  'Cinematic Docu': 'premium',
  'Glass Blur': 'premium',
  'Netflix Bar': 'premium',
  'Stock Green': 'premium',
  'Boardroom': 'premium',
  'Pill Bounce': 'premium',
  'Pop Candy': 'premium',
  'Marker Highlight': 'premium',
  'Retro VHS': 'premium',
  'Gradient Wave': 'premium',
  'Handwritten': 'premium',

  'Rainbow Pop': 'kids',
  'Bubble Bounce': 'kids',
  'Storybook Spark': 'kids',
  'Crayon Caption': 'kids',
  'Candy Karaoke': 'kids',
  'Toon Word Pop': 'kids',
  'Comic Burst 2D': 'animation2d',
  'Cel Shade 2D': 'animation2d',
  'Anime Kinetic 2D': 'animation2d',
  'Flat Motion 2D': 'animation2d',
  'Pixel Pop 2D': 'animation2d',
  'Cutout Story 2D': 'animation2d',
  'Toy Block 3D': 'animation3d',
  'Depth Pop 3D': 'animation3d',
  'Chrome Bounce 3D': 'animation3d',
  'Holo Glass 3D': 'animation3d',
  'Neon Voxel 3D': 'animation3d',
  'Orbit Motion 3D': 'animation3d',
  'Cinema Depth 3D': 'animation3d',
};

export function getStyleCategory(styleName: string): string {
  return STYLE_CATEGORY_MAP[styleName] || 'creative';
}

export const PREVIEW_CONFIG: Record<string, CaptionStylePreviewConfig> = {
  // ── Moonshot Typography Presets (https://makemoonshot.co/) ──
  "Blue Muse": {
    sampleLines: ["THEN SAY", "LESS"],
    activeWord: "LESS",
    background: "linear-gradient(160deg, #1E3A8A 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#3B82F6",
    layout: "blue-muse",
  },
  "Headliner": {
    sampleLines: ["STRONG STORIES", "START HERE"],
    activeWord: "START",
    background: "linear-gradient(160deg, #311300 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FF6D00",
    layout: "headliner",
  },
  "Chalk": {
    sampleLines: ["OWN YOUR", "BACK STORY"],
    activeWord: "OWN",
    background: "linear-gradient(160deg, #18181B 0%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    accent: "#FACC15",
    layout: "chalk",
  },
  "Cursive": {
    sampleLines: ["content", "ideas"],
    activeWord: "ideas",
    background: "linear-gradient(160deg, #451A03 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#FF9100",
    layout: "cursive",
  },
  "Gold Centre": {
    sampleLines: ["KEEP MAKING", "THEM"],
    activeWord: "MAKING",
    background: "linear-gradient(160deg, #2E1A00 0%, #0A0A0A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FFD700",
    layout: "gold-centre",
  },
  "Floodlight": {
    sampleLines: ["HIGHLIGHT THE", "WORD"],
    activeWord: "WORD",
    background: "linear-gradient(160deg, #3F2C00 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#FACC15",
    layout: "floodlight",
  },
  "Storyline": {
    sampleLines: ["THE BEST", "STORIES MOVE"],
    activeWord: "MOVE",
    background: "linear-gradient(160deg, #072B4A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#38BDF8",
    layout: "storyline",
  },
  "The Difference": {
    sampleLines: ["IS OFTEN THE", "STORY"],
    activeWord: "STORY",
    background: "linear-gradient(160deg, #3B0764 0%, #042F2E 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#C084FC",
    layout: "the-difference",
  },
  "Action": {
    sampleLines: ["TAKE IMMEDIATE", "ACTION"],
    activeWord: "ACTION",
    background: "linear-gradient(160deg, #450A0A 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#EF4444",
    layout: "action",
  },
  "Stat Numbers": {
    sampleLines: ["$45,000", "REVENUE"],
    activeWord: "$45,000",
    background: "linear-gradient(160deg, #022C22 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#00FF88",
    layout: "stat-numbers",
  },

  // ── Competitor Specials (Captions.ai & Submagic Inspired) ──
  "Creator 3": {
    sampleLines: ["captions and", "stylers"],
    activeWord: "stylers",
    background: "linear-gradient(160deg, #052E16 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#4ADE80",
    layout: "neon-pulse",
  },
  "Crazy": {
    sampleLines: ["EVERY SINGLE", "DAY"],
    activeWord: "DAY",
    background: "linear-gradient(160deg, #451A03 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "mrbeast-16-9",
  },
  "Crazy 2": {
    sampleLines: ["six checks", "only"],
    activeWord: "only",
    background: "linear-gradient(160deg, #082F49 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
    layout: "box",
  },
  "Spark": {
    sampleLines: ["and i'll send it", "your way"],
    activeWord: "way",
    background: "linear-gradient(160deg, #052E16 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#22C55E",
    layout: "phrase",
  },
  "Gamer": {
    sampleLines: ["CLUTCH PLAY", "WINNER"],
    activeWord: "CLUTCH",
    background: "linear-gradient(160deg, #0C4A6E 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#0284C7",
    layout: "impact-outline",
  },
  "Discipline": {
    sampleLines: ["where you have", "never gone"],
    activeWord: "never",
    background: "linear-gradient(160deg, #450A0A 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#EF4444",
    layout: "floating-serif",
  },
  "Kinetic": {
    sampleLines: ["FORGET THE", "RED JEEP"],
    activeWord: "JEEP",
    background: "linear-gradient(160deg, #18181B 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "mrbeast-16-9",
  },
  "Impact": {
    sampleLines: ["MY FRIEND KNOWS", "THE JUDGE"],
    activeWord: "JUDGE",
    background: "linear-gradient(160deg, #450A0A 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#EF4444",
    layout: "box",
  },
  "Red Wipe": {
    sampleLines: ["our business", "is editing"],
    activeWord: "editing",
    background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#DC2626",
    layout: "pill",
  },
  "Punch": {
    sampleLines: ["PTA HOTA", "THEY CAN SEE"],
    activeWord: "PTA HOTA",
    background: "linear-gradient(160deg, #18181B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "impact-outline",
  },
  "Cook": {
    sampleLines: ["LET HIM", "COOK"],
    activeWord: "COOK",
    background: "linear-gradient(160deg, #3B0764 0%, #0C4A6E 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#E879F9",
    layout: "gradient-wave",
  },
  "Master": {
    sampleLines: ["this is a", "choice"],
    activeWord: "choice",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
    layout: "m3-tonal-pill",
  },
  "Solo": {
    sampleLines: ["THIS", "IS", "SAMPLE"],
    activeWord: "SAMPLE",
    background: "linear-gradient(160deg, #18181B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "one-word",
  },
  "Estate": {
    sampleLines: ["LUXURY", "REAL ESTATE"],
    activeWord: "LUXURY",
    background: "linear-gradient(160deg, #0A0A0A 0%, #171717 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#E2E8F0",
    layout: "floating-serif",
  },
  "Story": {
    sampleLines: ["this is story", "made simple"],
    activeWord: "simple",
    background: "linear-gradient(160deg, #1C1917 0%, #0C0A09 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    accent: "#EF4444",
    layout: "editorial-serif",
  },

  // ── Top Viral Creator Presets (TikTok, Reels, Shorts) ──
  "Hormozi Viral Pop": {
    sampleLines: ["IF YOU WANT", "MASSIVE ATTENTION"],
    activeWord: "ATTENTION",
    background: "linear-gradient(160deg, #18181B 0%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#22C55E",
    layout: "one-word",
  },
  "MrBeast Shorts Impact": {
    sampleLines: ["I GAVE AWAY", "$1,000,000 DOLLARS"],
    activeWord: "$1,000,000",
    background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FFE500",
    layout: "impact-outline",
  },
  "Submagic Glow": {
    sampleLines: ["captions that keep viewers", "hooked till the end"],
    activeWord: "hooked",
    background: "linear-gradient(160deg, #2E1065 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#A855F7",
    layout: "neon-pulse",
  },
  "Devane Luxury Serif": {
    sampleLines: ["wealth is what you", "don't see on camera"],
    activeWord: "wealth",
    background: "linear-gradient(160deg, #1C1917 0%, #0C0A09 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#D9B76E",
    layout: "floating-serif",
  },
  "Cyber Lime Pill": {
    sampleLines: ["BUILD IN PUBLIC", "AND SCALE FAST"],
    activeWord: "SCALE",
    background: "linear-gradient(160deg, #14532D 0%, #052E16 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#A3E635",
    layout: "pill",
  },
  "Opus Inverted Box": {
    sampleLines: ["HIGH RETENTION", "FOR TIKTOK REELS"],
    activeWord: "RETENTION",
    background: "linear-gradient(160deg, #18181B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "box",
  },
  "Reels Clean": {
    sampleLines: ["clean dynamic text", "for modern creators"],
    activeWord: "dynamic",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#38BDF8",
    layout: "phrase",
  },
  // ── Western 16:9 YouTube Creator Presets (USA, UK, Canada, Australia) ──
  "Ali Abdaal Clean Pill": {
    sampleLines: ["if you want to be productive", "focus on clarity not hustle"],
    activeWord: "clarity",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#FDE047",
    layout: "ali-abdaal",
  },
  "Vox Documentary": {
    sampleLines: ["the hidden history behind", "how modern society works"],
    activeWord: "history",
    background: "linear-gradient(160deg, #1C1917 0%, #0C0A09 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#F59E0B",
    layout: "vox-docu",
  },
  "Diary of a CEO": {
    sampleLines: ["the biggest lesson I learned", "from building this company"],
    activeWord: "lesson",
    background: "linear-gradient(160deg, #09090B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#FFFFFF",
    layout: "diary-of-ceo",
  },
  "Huberman Lab Lecture": {
    sampleLines: ["neural mechanisms that control", "your dopamine and focus"],
    activeWord: "focus",
    background: "linear-gradient(160deg, #0A0A0A 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    accent: "#38BDF8",
    layout: "huberman-lecture",
  },
  "MrBeast 16:9 Punch": {
    sampleLines: ["I SURVIVED 100 DAYS", "IN AN ABANDONED CITY"],
    activeWord: "SURVIVED",
    background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "mrbeast-16-9",
  },
  "MKBHD Tech Studio": {
    sampleLines: ["so I've been using this phone", "for the last two weeks"],
    activeWord: "using",
    background: "linear-gradient(160deg, #18181B 0%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#EF4444",
    layout: "mkbhd-tech",
  },
  "BBC / Netflix Closed Captions": {
    sampleLines: ["Closed captioning standard for", "broadcast accessibility."],
    activeWord: "accessibility",
    background: "linear-gradient(160deg, #0A0A0A 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#FFFFFF",
    layout: "bbc-netflix-cc",
  },
  "Kurzgesagt Explainer": {
    sampleLines: ["what would happen if the sun", "vanished for five seconds"],
    activeWord: "vanished",
    background: "linear-gradient(160deg, #1E293B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#67E8F9",
    layout: "kurzgesagt",
  },
  "Lex Fridman Minimalist": {
    sampleLines: ["consciousness and the nature", "of human intelligence"],
    activeWord: "intelligence",
    background: "linear-gradient(160deg, #09090B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#FFFFFF",
    layout: "lex-fridman",
  },
  "Minimal Clean": {
    sampleLines: ["simple and clean", "youtube subtitles"],
    activeWord: "clean",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    layout: "phrase",
  },
  "Cinematic Docu": {
    sampleLines: ["documentary stories", "that captivate"],
    activeWord: "captivate",
    background: "linear-gradient(160deg, #1C1917 0%, #0C0A09 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#FDE047",
    layout: "cinematic-bar",
  },
  "Studio Podcast": {
    sampleLines: ["deep conversations", "and interviews"],
    activeWord: "interviews",
    background: "linear-gradient(160deg, #18181B 0%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    layout: "box",
  },
  "Bold Creator": {
    sampleLines: ["high impact", "creator subtitles"],
    activeWord: "impact",
    background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FACC15",
    layout: "impact-outline",
  },
  "Netflix Classic": {
    sampleLines: ["classic cinema", "closed captions"],
    activeWord: "captions",
    background: "linear-gradient(160deg, #0A0A0A 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#FFDE00",
    layout: "cinematic-bar",
  },
  Eclipse: {
    sampleLines: ["create better", "reels in minutes"],
    activeWord: "better",
    background: "radial-gradient(circle at 48% 28%, #312E81 0, #111827 42%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#7C3AED",
  },
  Hustle: {
    sampleLines: ["create better", "reels faster"],
    activeWord: "faster",
    background: "linear-gradient(160deg, #1F0A0A 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#EF4444",
    layout: "impact-outline",
  },
  "Gold Pill": {
    sampleLines: ["better reels", "in minutes"],
    background: "linear-gradient(160deg, #2E2207 0%, #111827 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "pill",
  },
  "Studio Clean": {
    sampleLines: ["create better", "reels in minutes"],
    activeWord: "reels",
    background: "linear-gradient(160deg, #263241 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "stacked",
  },
  "One Word": {
    sampleLines: ["REELS"],
    activeWord: "REELS",
    background: "linear-gradient(160deg, #1E293B 0%, #111827 56%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.faceless,
    layout: "one-word",
  },
  "Arctic Glow": {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "reels",
    background: "linear-gradient(160deg, #082F49 0%, #0F172A 50%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
  },
  "Karaoke Fill": {
    sampleLines: ["create better reels"],
    activeWord: "better",
    background: "linear-gradient(160deg, #14213D 0%, #111827 56%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    layout: "karaoke",
  },
  "Shorts Karaoke": {
    sampleLines: ["create better reels"],
    activeWord: "better",
    background: "linear-gradient(160deg, #334155 0%, #111827 58%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "shorts",
  },
  "Bold Highlight Strip": {
    sampleLines: ["create better", "reels faster"],
    activeWord: "better",
    background: "linear-gradient(160deg, #3B1B05 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "strip",
  },
  "Shatter Drop": {
    sampleLines: ["create better", "reels faster"],
    activeWord: "reels",
    background: "linear-gradient(160deg, #3B0A0A 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#FF3D3D",
    layout: "impact-outline",
  },
  "Pill Bounce": {
    sampleLines: ["better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #3A1B0B 0%, #111827 56%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    layout: "bounce-pill",
  },
  "Marker Highlight": {
    sampleLines: ["clear money tips", "without confusion"],
    activeWord: "money",
    background: "linear-gradient(160deg, #1F2937 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "marker-highlight",
  },
  "Metallic Gradient": {
    sampleLines: ["premium results", "in minutes"],
    activeWord: "premium",
    background: "linear-gradient(160deg, #1E293B 0%, #111827 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "metallic-gradient",
  },
  "Neon Pulse": {
    sampleLines: ["unlock the secret", "to viral reels"],
    activeWord: "secret",
    background: "linear-gradient(160deg, #020617 0%, #0a0a1a 60%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    layout: "neon-pulse",
  },
  "Glass Blur": {
    sampleLines: ["your brand", "elevated"],
    activeWord: "brand",
    background: "linear-gradient(160deg, #1E293B 0%, #0F172A 55%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "glass-blur",
  },
  "Minimal Fade": {
    sampleLines: ["simple clean", "readable always"],
    activeWord: "clean",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "minimal-fade",
  },
  "Gradient Wave": {
    sampleLines: ["express yourself", "with color"],
    activeWord: "yourself",
    background: "linear-gradient(160deg, #0F0720 0%, #1a0a2e 50%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    layout: "gradient-wave",
  },
  "Retro VHS": {
    sampleLines: ["rewind and", "watch again"],
    activeWord: "rewind",
    background: "linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "retro-vhs",
  },
  "Handwritten": {
    sampleLines: ["feel the story", "being told"],
    activeWord: "story",
    background: "linear-gradient(160deg, #1E293B 0%, #0F172A 60%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "handwritten",
  },
  "Floating Serif": {
    sampleLines: ["build trust", "one step at a time"],
    activeWord: "trust",
    background: "linear-gradient(160deg, #233044 0%, #111827 56%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "floating-serif",
  },
  Cinematic: {
    sampleLines: ["create better reels", "in minutes"],
    background: "linear-gradient(160deg, #111827 0%, #020617 70%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "cinematic-bar",
  },
  "Hacker Type": {
    sampleLines: ["generate reels", "with AI"],
    background: "linear-gradient(160deg, #052E1B 0%, #06130D 48%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    layout: "code",
  },
  Vollkorn: {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #172033 0%, #111827 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "editorial-serif",
  },
  Midnight: {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "minutes",
    background: "linear-gradient(160deg, #0F1E3A 0%, #0F172A 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
  },
  Marigold: {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #3A2608 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
  },
  "Pop Candy": {
    sampleLines: ["better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #2A1230 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "box",
  },
  "Bold Fire": {
    sampleLines: ["REELS"],
    activeWord: "REELS",
    background: "linear-gradient(160deg, #3B1605 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    layout: "one-word",
  },
  Typewriter: {
    sampleLines: ["create reels", "with AI"],
    background: "linear-gradient(160deg, #052E2F 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    layout: "code",
  },
  "split-color": {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #172033 0%, #111827 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "split",
  },
  "Sharp Yellow": {
    sampleLines: ["create better reels"],
    activeWord: "better",
    background: "linear-gradient(160deg, #1F2937 0%, #111827 55%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#FACC15",
  },
  "Ocean Blue": {
    sampleLines: ["create better reels"],
    activeWord: "better",
    background: "linear-gradient(160deg, #0C2A3F 0%, #0F172A 55%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
  },
  "Screamer": {
    sampleLines: ["stop scrolling", "watch this"],
    activeWord: "stop",
    background: "linear-gradient(160deg, #2A0A0A 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#EF4444",
    layout: "impact-outline",
  },
  "Netflix Bar": {
    sampleLines: ["a clean cinematic", "caption style"],
    background: "linear-gradient(160deg, #111827 0%, #020617 70%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "cinematic-bar",
  },
  "Black Card": {
    sampleLines: ["premium and", "timeless"],
    activeWord: "premium",
    background: "linear-gradient(160deg, #0A0A0A 0%, #050505 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "floating-serif",
  },
  "Stock Green": {
    sampleLines: ["profits are up", "this quarter"],
    activeWord: "up",
    background: "linear-gradient(160deg, #06231A 0%, #0F172A 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#22C55E",
    layout: "stacked",
  },
  "Boardroom": {
    sampleLines: ["clear business", "communication"],
    activeWord: "business",
    background: "linear-gradient(160deg, #14202E 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    layout: "editorial-serif",
  },
  "Podcast Hype": {
    sampleLines: ["this changed", "everything"],
    activeWord: "changed",
    background: "linear-gradient(160deg, #2B1607 0%, #111827 54%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
    accent: "#F97316",
    layout: "stacked",
  },
  "M3 Tonal Pill": {
    sampleLines: ["material design", "expressive captions"],
    activeWord: "expressive",
    background: "linear-gradient(160deg, #082F49 0%, #0F172A 56%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
    layout: "m3-tonal-pill",
  },
  "M3 Dynamic Chip": {
    sampleLines: ["dynamic chips", "smart tags"],
    activeWord: "dynamic",
    background: "linear-gradient(160deg, #064E3B 0%, #0B1E19 55%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#10B981",
    layout: "m3-dynamic-chip",
  },
  "M3 Elevated Card": {
    sampleLines: ["elevated surface", "high contrast"],
    activeWord: "elevated",
    background: "linear-gradient(160deg, #3B0764 0%, #1C1B1F 55%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#A855F7",
    layout: "m3-elevated-card",
  },
  "Warikoo Black Card": {
    sampleLines: ["one person will have", "₹35,000 left,"],
    activeWord: "35,000",
    background: "linear-gradient(160deg, #18181B 0%, #09090B 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.educator,
    layout: "warikoo-black-card",
  },
  "Active Blue Pill": {
    sampleLines: ["THE MORNING YOU TURN"],
    activeWord: "TURN",
    background: "linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
    accent: "#2563EB",
    layout: "active-blue-pill",
  },
  "M3 Surface Outline": {
    sampleLines: ["material outline", "crisp clarity"],
    activeWord: "clarity",
    background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#38BDF8",
    layout: "m3-surface-outline",
  },
  "M3 Primary Container": {
    sampleLines: ["sapphire container", "smart subtitles"],
    activeWord: "sapphire",
    background: "linear-gradient(160deg, #172554 0%, #0F172A 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.tech,
    accent: "#67E8F9",
    layout: "m3-primary-container",
  },
  "Storyteller Bold": {
    sampleLines: ["timeless stories", "captivating audience"],
    activeWord: "stories",
    background: "linear-gradient(160deg, #18181B 0%, #000000 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.business,
    accent: "#FFFFFF",
    layout: "impact-outline",
  },
};

const PRESETS: PresetOption[] = PRESET_ORDER.flatMap((key) => {
  const preset = REMOTION_SUBTITLE_PRESETS[key];
  if (!preset) return [];
  return {
    key,
    label: preset.name,
    style: preset.style,
    font: preset.fontFamily,
    textColor: preset.textColor,
    highlightColor: preset.highlightColor,
    bgColor: preset.backgroundColor,
  };
});

type SubtitleStylePickerVariant = "shorts" | "longForm";

interface SubtitleStylePickerProps {
  value: string;
  onChange: (presetKey: string) => void;
  variant?: SubtitleStylePickerVariant;
}

export function SubtitleStylePicker({ value, onChange, variant = "shorts" }: SubtitleStylePickerProps) {
  const selectedPreset = React.useMemo(() => {
    return PRESETS.find((p) => p.key === value || p.style === value) || PRESETS[0];
  }, [value]);

  const [playingKey, setPlayingKey] = React.useState<string>(() => {
    return selectedPreset?.key || "Sharp Yellow";
  });

  const [activeCategory, setActiveCategory] = React.useState<string>(() => {
    return "all";
  });

  // Whenever the active style changes, ensure it plays immediately
  React.useEffect(() => {
    if (selectedPreset?.key) {
      setPlayingKey(selectedPreset.key);
    }
  }, [selectedPreset?.key]);

  const presets = variant === "longForm"
    ? PRESETS.filter((preset) =>
        LONG_FORM_PRESET_ORDER.includes(preset.key) &&
        (activeCategory === "all" || getStyleCategory(preset.key) === activeCategory)
      )
    : activeCategory === "all"
      ? PRESETS
      : PRESETS.filter((preset) => getStyleCategory(preset.key) === activeCategory);

  return (
    <>
      <style>{`
        @keyframes captionPreviewEnter {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          45% { transform: translateY(-1px) scale(1.02); opacity: 0.98; }
        }
        @keyframes captionPreviewActive {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          45% { transform: scale(1.08); filter: brightness(1.15); }
        }
        @keyframes captionPreviewFill {
          0% { width: 42%; }
          50% { width: 82%; }
          100% { width: 62%; }
        }
        @keyframes captionPreviewCursor {
          0%, 48% { opacity: 1; }
          49%, 100% { opacity: 0; }
        }
        .caption-preview-enter {
          animation: captionPreviewEnter 2.8s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .caption-preview-active-word {
          animation: captionPreviewActive 1.35s ease-in-out infinite;
          transform-origin: center;
        }
        .caption-preview-fill {
          animation: captionPreviewFill 1.7s ease-in-out infinite;
        }
        .caption-preview-cursor::after {
          content: "|";
          display: inline-block;
          margin-left: 1px;
          animation: captionPreviewCursor 0.9s steps(1) infinite;
        }
      `}</style>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" style={{ scrollbarWidth: "none" }}>
          {STYLE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition touch-manipulation min-h-[38px] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground shrink-0">
          <Sparkles size={12} className="text-primary" />
          {variant === "longForm" ? "16:9 Widescreen Live Preview" : "Live sync caption preview"}
        </span>
      </div>
      <div className={variant === "longForm" ? "grid min-w-0 max-w-full grid-cols-1 gap-2.5 sm:grid-cols-2" : "grid min-w-0 max-w-full grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 lg:grid-cols-4"}>
        {presets.map((preset) => {
          const isActive = value === preset.key || value === preset.style;
          return (
            <CaptionStylePreviewCard
              key={preset.key}
              preset={preset}
              isActive={isActive}
              onSelect={() => {
                onChange(preset.key);
                setPlayingKey(preset.key);
              }}
              variant={variant}
            />
          );
        })}
      </div>
    </>
  );
}

function CaptionStylePreviewCard({
  preset,
  isActive,
  onSelect,
  variant,
}: {
  preset: PresetOption;
  isActive: boolean;
  onSelect: () => void;
  variant: SubtitleStylePickerVariant;
}) {
  const config = PREVIEW_CONFIG[preset.key] || {
    sampleLines: ["VIRAL CAPTIONS", "THAT POP"],
    activeWord: "VIRAL",
  };
  const categoryId = getStyleCategory(preset.key);
  const categoryLabel = STYLE_CATEGORIES.find((c) => c.id === categoryId)?.label.replace(/^[^\s]+\s/, "") || "Style";
  const catalogItem = getCaptionStyleCatalogItem(preset.key);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isActive}
      className={`group relative flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border-2 p-2.5 sm:p-3 text-left cursor-pointer transition-all select-none ${
        isActive
          ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      {/* Header: Label, Category, Checkmark */}
      <div className="flex items-center justify-between gap-1 w-full mb-2">
        <span className={`truncate text-xs font-bold leading-tight ${isActive ? "text-indigo-950 font-black" : "text-slate-900"}`}>
          {preset.label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
            {categoryLabel}
          </span>
          {isActive ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
              <Check size={10} strokeWidth={3} />
            </span>
          ) : null}
        </div>
      </div>

      {/* Visual Preview Instance — Dedicated Video Instance for this specific Subtitle Style */}
      {variant === "longForm" && PREVIEW_LONG_FORM_VIDEO_URL ? (
        <div className="relative w-full aspect-video rounded-xl bg-[#090D16] overflow-hidden flex items-center justify-center border border-slate-800/80 shadow-inner group">
          <video
            src={catalogItem.previewVideoUrl || PREVIEW_LONG_FORM_VIDEO_URL}
            playsInline
            loop
            muted
            autoPlay
            poster={catalogItem.posterUrl || PREVIEW_LONG_FORM_POSTER_URL}
            className="h-full w-full object-cover"
          />
          {/* Dark scrim overlay for subtitle readability */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

          {/* Subtitle Style Overlay on top of this card's video instance */}
          <div className="absolute inset-x-2 bottom-2 z-10 text-center">
            <MiniCaptionPreview preset={preset} config={config} />
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[9/16] max-h-[160px] rounded-xl bg-[#090D16] overflow-hidden flex items-center justify-center border border-slate-800/80 shadow-inner group">
          <video
            src={catalogItem.previewVideoUrl}
            poster={catalogItem.posterUrl}
            playsInline
            loop
            muted
            autoPlay={isActive}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
      )}
    </div>
  );
}

function MiniCaptionPreview({
  preset,
  config,
}: {
  preset: PresetOption;
  config: CaptionStylePreviewConfig;
}) {
  const font = preset.font || "Inter, sans-serif";
  const textColor = preset.textColor || "#FFFFFF";
  const highlightColor = preset.highlightColor || config.accent || "#FACC15";
  const sampleLines = config.sampleLines || ["VIRAL", "REELS"];
  const activeWord = config.activeWord || sampleLines[0]?.split(" ")[0] || "REELS";

  const isOneWord = preset.style === "one-word" || config.layout === "one-word";
  const isPill = preset.style === "gold-pill" || config.layout === "pill" || preset.style === "ali-abdaal";
  const isBox = preset.style === "box" || config.layout === "box";

  if (isOneWord) {
    return (
      <div
        className="font-black text-sm sm:text-base uppercase tracking-wider transition-transform group-hover:scale-105"
        style={{
          fontFamily: font,
          color: highlightColor,
          textShadow: `0 0 12px ${highlightColor}66, 0 2px 4px #000000`,
        }}
      >
        {activeWord}
      </div>
    );
  }

  if (isBox) {
    return (
      <div
        className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wide inline-block"
        style={{
          fontFamily: font,
          backgroundColor: preset.bgColor || highlightColor,
          color: textColor === highlightColor ? "#000000" : textColor,
        }}
      >
        {sampleLines.join(" ")}
      </div>
    );
  }

  if (isPill) {
    return (
      <div
        className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 border border-white/10"
        style={{
          fontFamily: font,
          backgroundColor: preset.bgColor || "rgba(15, 23, 42, 0.85)",
          color: textColor,
        }}
      >
        <span>{sampleLines[0]?.split(" ")[0] || "create"}</span>
        <span style={{ color: highlightColor }} className="font-black">
          {activeWord}
        </span>
      </div>
    );
  }

  // Default clean & kinetic layout
  return (
    <div
      className="text-[11px] sm:text-xs font-bold leading-tight max-w-full truncate"
      style={{
        fontFamily: font,
        color: textColor,
        textShadow: "0 1px 3px rgba(0,0,0,0.8)",
      }}
    >
      <span className="opacity-90">{sampleLines[0]?.split(" ").slice(0, 2).join(" ")} </span>
      <span
        style={{
          color: highlightColor,
          textShadow: `0 0 8px ${highlightColor}55`,
        }}
        className="font-extrabold"
      >
        {activeWord}
      </span>
    </div>
  );
}

export function CaptionPreviewText({
  preset,
  config,
  chunk,
  playbackTime = 0,
  isPlaying = false,
  activeWord = "VIRAL",
  currentWordObj,
}: {
  preset: PresetOption;
  config: CaptionStylePreviewConfig;
  chunk?: CaptionScriptChunk;
  playbackTime?: number;
  isPlaying?: boolean;
  activeWord?: string;
  currentWordObj?: CaptionScriptWord;
}) {
  const style = preset.style as SubtitleStyle;
  const layout = config.layout || layoutForStyle(style);
  const textStyle = getTextStyle(preset, style);
  const sampleLines = chunk?.sampleLines || config.sampleLines || ["VIRAL CAPTIONS", "THAT POP"];
  const finalActiveWord = activeWord || chunk?.activeWord || config.activeWord || "VIRAL";

  if (layout === "one-word") {
    const displayWord = isPlaying
      ? (currentWordObj ? currentWordObj.word.replace(/[^a-zA-Z0-9']/g, "").toUpperCase() : finalActiveWord.toUpperCase())
      : (chunk?.activeWord || config.activeWord || "VIRAL").toUpperCase();

    return (
      <div
        className="caption-preview-enter max-w-full break-words text-center text-sm sm:text-base md:text-lg font-black uppercase tracking-wider leading-none drop-shadow-md"
        style={{
          ...textStyle,
          color: preset.highlightColor,
          textShadow: `0 0 10px ${preset.highlightColor}77, 0 2px 4px rgba(0,0,0,0.85)`,
        }}
      >
        {displayWord}
      </div>
    );
  }

  if (layout === "code") {
    return (
      <div
        className="caption-preview-enter caption-preview-cursor w-full rounded-md border-l-2 px-2 py-1.5 text-left text-[11px] sm:text-[12px] font-bold leading-snug shadow-md"
        style={{
          ...textStyle,
          color: preset.highlightColor,
          borderColor: preset.highlightColor,
          background: "rgba(0,0,0,0.72)",
          textShadow: `0 0 6px ${preset.highlightColor}77`,
        }}
      >
        {sampleLines.map((line) => (
          <div key={line}>
            {">"} {line}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "shorts") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-lg px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black leading-snug shadow-lg"
        style={{
          ...textStyle,
          background: preset.bgColor || "#F4F4F5",
          color: preset.textColor,
          textShadow: "none",
        }}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
          karaoke
        />
      </div>
    );
  }

  if (layout === "box") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-col items-center gap-1.5">
        {sampleLines.map((line) => (
          <div key={line} className="flex flex-wrap justify-center gap-1">
            {line.split(" ").map((word, index) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
              const isWordActive = cleanWord === activeWord.toLowerCase();
              return (
                <span
                  key={`${line}-${word}-${index}`}
                  className={`rounded-md px-1.5 py-0.5 text-[11px] sm:text-[12px] md:text-[13px] font-black leading-snug transition-transform duration-100 shadow-sm ${
                    isWordActive ? "caption-preview-active-word scale-105" : ""
                  }`}
                  style={{
                    ...textStyle,
                    color: isWordActive ? "#111827" : preset.textColor,
                    background: isWordActive ? preset.highlightColor : "rgba(255,255,255,0.95)",
                    textShadow: "none",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "impact-outline") {
    return (
      <div
        className="caption-preview-enter max-w-full text-center text-[13px] sm:text-[14px] md:text-[15px] font-black uppercase leading-tight tracking-tight"
        style={{
          ...textStyle,
          color: preset.textColor,
          WebkitTextStroke: `0.75px ${preset.highlightColor}`,
          paintOrder: "stroke fill",
          textShadow: `2px 2px 0 rgba(0,0,0,0.9), 0 0 8px ${preset.highlightColor}77`,
        }}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
        />
      </div>
    );
  }

  if (layout === "cinematic-bar") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-md border border-white/15 bg-black/60 px-3 py-1.5 text-center text-[11px] sm:text-[12px] md:text-[13px] font-bold leading-snug backdrop-blur-xs shadow-md"
        style={{
          ...textStyle,
          color: preset.textColor,
          letterSpacing: "0.02em",
          textTransform: "none",
        }}
      >
        {sampleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    );
  }

  if (layout === "marker-highlight") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-wrap justify-center gap-x-1.5 gap-y-1 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black leading-snug">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`relative inline-block px-1.5 py-0.5 ${isWordActive ? "caption-preview-active-word" : ""}`}
              style={{
                ...textStyle,
                color: preset.textColor,
                zIndex: 0,
                textShadow: "0 1px 3px rgba(0,0,0,0.85)",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-[68%] rounded-sm transition-all duration-150"
                style={{
                  background: isWordActive ? preset.highlightColor : `${preset.bgColor || preset.highlightColor}CC`,
                  transform: `rotate(${index % 2 === 0 ? "-1.5deg" : "1.3deg"}) scale(${isWordActive ? 1.06 : 1})`,
                  opacity: isWordActive ? 0.98 : 0.82,
                }}
              />
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "floating-serif") {
    return (
      <div
        className="caption-preview-enter max-w-full text-center text-[12px] sm:text-[13px] md:text-[14px] font-bold leading-snug"
        style={{
          ...textStyle,
          color: preset.textColor,
          fontFamily: preset.font,
          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
        }}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
        />
      </div>
    );
  }

  if (layout === "metallic-gradient") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-lg border border-white/15 px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase leading-snug"
        style={{
          ...textStyle,
          background: "linear-gradient(180deg, rgba(17,24,39,0.85), rgba(2,6,23,0.75))",
          boxShadow: "0 5px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {sampleLines.map((line) => (
          <div key={line}>
            {line.split(" ").map((word, index) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
              const isWordActive = cleanWord === activeWord.toLowerCase();
              return (
                <span
                  key={`${line}-${word}-${index}`}
                  className={`inline-block px-0.5 ${isWordActive ? "caption-preview-active-word" : ""}`}
                  style={{
                    background: isWordActive
                      ? "linear-gradient(100deg, #FFFFFF 0%, #D9B76E 38%, #94A3B8 70%, #FFFFFF 100%)"
                      : "linear-gradient(100deg, #F8FAFC 0%, #B8C2D8 46%, #E5E7EB 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 2px 4px rgba(0,0,0,0.85)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "editorial-serif") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-md bg-black/60 px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-bold leading-snug shadow-md"
        style={{
          ...textStyle,
          color: preset.textColor,
          fontFamily: preset.font,
        }}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
        />
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-md bg-black/55 px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black leading-snug shadow-md"
        style={textStyle}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
          inactiveColor="rgba(255,255,255,0.65)"
          karaoke
        />
      </div>
    );
  }

  if (layout === "strip") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-md px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase leading-snug shadow-md"
        style={{
          ...textStyle,
          background: preset.bgColor || "#F59E0B",
          color: preset.textColor,
          WebkitTextStroke: "0.8px #7F1D1D",
          paintOrder: "stroke fill",
          boxShadow: "inset 0 -2px 0 rgba(127,29,29,0.25), 0 5px 8px rgba(0,0,0,0.3)",
          textShadow: "0 1px 0 rgba(39,16,16,0.85)",
        }}
      >
        {sampleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    );
  }

  if (layout === "pill") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-col items-center gap-1">
        {sampleLines.map((line) => (
          <div
            key={line}
            className="max-w-full rounded-full px-3 py-1 text-center text-[11px] sm:text-[12px] md:text-[13px] font-black uppercase leading-tight shadow-md"
            style={{
              ...textStyle,
              background: preset.bgColor || "rgba(0,0,0,0.78)",
              color: preset.highlightColor,
              boxShadow: `0 0 8px ${preset.highlightColor}30, 0 4px 8px rgba(0,0,0,0.35)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "bounce-pill") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-wrap justify-center gap-1.5 text-[11px] sm:text-[12px] md:text-[13px] font-black leading-snug">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`${isWordActive ? "caption-preview-active-word scale-105" : ""} rounded-full px-2 py-0.5 transition-all duration-100 shadow-sm`}
              style={{
                ...textStyle,
                color: isWordActive ? "#111827" : preset.textColor,
                background: isWordActive ? preset.highlightColor : "rgba(255,255,255,0.18)",
                textShadow: isWordActive ? "none" : textStyle.textShadow,
                boxShadow: isWordActive ? `0 4px 10px ${preset.highlightColor}40` : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "karaoke") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-md bg-black/60 px-2.5 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black leading-snug shadow-md"
        style={textStyle}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
          inactiveColor="rgba(255,255,255,0.45)"
          karaoke
        />
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-lg px-3 py-1.5 text-center text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase leading-snug shadow-md"
        style={{
          ...textStyle,
          background: preset.bgColor || "rgba(24,24,27,0.92)",
          color: preset.textColor,
          boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
        }}
      >
        <CaptionWords
          lines={sampleLines}
          chunk={chunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={activeWord}
          activeColor={preset.highlightColor}
        />
      </div>
    );
  }

  if (layout === "m3-tonal-pill") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-full items-center justify-center rounded-full border border-white/20 bg-zinc-900/85 px-3 py-1.5 shadow-lg backdrop-blur-md"
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-[11px] sm:text-[12px] font-bold">
          {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isWordActive = cleanWord === activeWord.toLowerCase();
            return (
              <span
                key={`${word}-${index}`}
                className={`inline-flex items-center rounded-full px-2 py-0.5 transition-all duration-100 ${
                  isWordActive ? "caption-preview-active-word scale-105" : ""
                }`}
                style={{
                  ...textStyle,
                  color: isWordActive ? preset.highlightColor : "#F8FAFC",
                  background: isWordActive ? `${preset.highlightColor}28` : "transparent",
                  border: isWordActive ? `1px solid ${preset.highlightColor}88` : "1px solid transparent",
                  boxShadow: isWordActive ? `0 0 12px ${preset.highlightColor}44` : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (layout === "m3-dynamic-chip") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-[12px] font-bold">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <div
              key={`${word}-${index}`}
              className={`inline-flex items-center rounded-full px-2 py-0.5 transition-all duration-100 ${
                isWordActive
                  ? "caption-preview-active-word scale-110 shadow-md"
                  : "bg-zinc-900/75 border border-white/12 text-zinc-300"
              }`}
              style={{
                background: isWordActive
                  ? `linear-gradient(135deg, ${preset.highlightColor}, #059669)`
                  : "rgba(24, 24, 27, 0.75)",
                color: isWordActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                border: isWordActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)",
                boxShadow: isWordActive ? `0 4px 14px ${preset.highlightColor}66` : "none",
              }}
            >
              <span style={textStyle}>{word}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === "m3-elevated-card") {
    return (
      <div
        className="caption-preview-enter flex max-w-full flex-col items-center justify-center rounded-2xl border border-white/15 bg-zinc-900/90 px-3.5 py-2 shadow-xl backdrop-blur-md"
        style={{
          boxShadow: "0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>M3 Live</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 text-center text-[11px] sm:text-[12px] font-bold">
          {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isWordActive = cleanWord === activeWord.toLowerCase();
            return (
              <span
                key={`${word}-${index}`}
                className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word scale-105" : ""}`}
                style={{
                  ...textStyle,
                  color: isWordActive ? preset.highlightColor : "#F4EFF4",
                  textShadow: isWordActive ? `0 0 10px ${preset.highlightColor}88` : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (layout === "m3-surface-outline") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] items-center justify-center rounded-xl border border-slate-400/80 bg-slate-900/85 px-3 py-1.5 shadow-md backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center justify-center gap-1 text-center text-[11px] sm:text-[12px] font-bold">
          {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isWordActive = cleanWord === activeWord.toLowerCase();
            return (
              <span
                key={`${word}-${index}`}
                className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word scale-105 font-extrabold" : ""}`}
                style={{
                  ...textStyle,
                  color: isWordActive ? (preset.highlightColor || "#38BDF8") : "#F8FAFC",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (layout === "m3-primary-container") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] items-center justify-center rounded-2xl border border-cyan-400/30 bg-blue-950/90 px-3.5 py-1.5 shadow-xl backdrop-blur-md"
        style={{
          boxShadow: "0 10px 24px rgba(15,23,42,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-1 text-center text-[11px] sm:text-[12px] font-extrabold">
          {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isWordActive = cleanWord === activeWord.toLowerCase();
            return (
              <span
                key={`${word}-${index}`}
                className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word scale-105" : ""}`}
                style={{
                  ...textStyle,
                  color: isWordActive ? (preset.highlightColor || "#67E8F9") : "#FFFFFF",
                  textShadow: isWordActive ? `0 0 10px ${preset.highlightColor || "#67E8F9"}99` : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (layout === "warikoo-black-card") {
    return (
      <div
        className="caption-preview-enter inline-block max-w-[94%] rounded-[10px] bg-black/90 px-3.5 py-1.5 text-center shadow-lg"
        style={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
        }}
      >
        <span
          className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-white leading-snug"
          style={{ fontFamily: preset.font }}
        >
          {sampleLines.join(" ")}
        </span>
      </div>
    );
  }

  if (layout === "active-blue-pill") {
    return (
      <div className="caption-preview-enter flex max-w-[96%] flex-wrap items-center justify-center gap-1.5 text-center text-[12px] sm:text-[13px] font-black uppercase leading-snug">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`inline-block transition-all duration-100 ${
                isWordActive
                  ? "caption-preview-active-word rounded-full bg-blue-600 px-2.5 py-0.5 text-white shadow-md shadow-blue-600/50 scale-105"
                  : "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_0_2px_#000]"
              }`}
              style={{
                fontFamily: preset.font,
                backgroundColor: isWordActive ? (preset.highlightColor || "#2563EB") : "transparent",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "ali-abdaal") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 rounded-[14px] border border-white/15 bg-slate-900/85 px-4 py-1.5 text-center shadow-2xl backdrop-blur-md"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
      >
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word font-bold scale-105" : "font-medium text-white"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "12px",
                color: isWordActive ? (preset.highlightColor || "#FDE047") : "#FFFFFF",
                textShadow: isWordActive ? `0 0 10px ${preset.highlightColor || "#FDE047"}88` : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "vox-docu") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 rounded-xs border-b-[2.5px] border-amber-500 bg-stone-950/90 px-4 py-1.5 text-center shadow-2xl"
      >
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-colors duration-100 ${isWordActive ? "caption-preview-active-word font-bold" : "font-normal"}`}
              style={{
                fontFamily: preset.font || "Georgia, serif",
                fontSize: "12.5px",
                color: isWordActive ? (preset.highlightColor || "#F59E0B") : "#FFFBEB",
                letterSpacing: "0.01em",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "diary-of-ceo") {
    return (
      <div className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 px-3 py-1 text-center">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word font-black scale-105 opacity-100" : "font-bold opacity-90"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "13px",
                color: "#FFFFFF",
                textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 4px 18px rgba(0,0,0,0.85)",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "huberman-lecture") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 rounded-md border border-white/10 bg-black/92 px-3.5 py-1.5 text-center shadow-xl"
      >
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-colors duration-100 ${isWordActive ? "caption-preview-active-word font-bold" : "font-semibold"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "12px",
                color: isWordActive ? (preset.highlightColor || "#38BDF8") : "#F8FAFC",
                textShadow: isWordActive ? `0 0 10px ${preset.highlightColor || "#38BDF8"}88` : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "mrbeast-16-9") {
    return (
      <div className="caption-preview-enter flex max-w-[96%] flex-wrap items-center justify-center gap-1.5 text-center text-[13px] sm:text-[14px] font-black uppercase leading-tight">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`inline-block transition-transform duration-100 ${isWordActive ? "caption-preview-active-word scale-110" : ""}`}
              style={{
                fontFamily: preset.font,
                color: isWordActive ? (preset.highlightColor || "#FACC15") : "#FFFFFF",
                WebkitTextStroke: "1.5px #000000",
                textShadow: "0 3px 10px rgba(0,0,0,0.9), 0 1px 0 #000000",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "mkbhd-tech") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900/90 px-3.5 py-1.5 text-center shadow-xl"
      >
        <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-500/80 mr-0.5" />
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-all duration-100 rounded-xs px-1 ${isWordActive ? "bg-white/15 text-white font-bold" : "text-zinc-300 font-semibold"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "12px",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "bbc-netflix-cc") {
    return (
      <div className="caption-preview-enter inline-block max-w-[94%] bg-black/90 px-3 py-1 text-center shadow-md">
        <span
          className="text-[12px] sm:text-[13px] font-semibold tracking-wide text-white leading-relaxed"
          style={{ fontFamily: preset.font }}
        >
          {sampleLines.join(" ")}
        </span>
      </div>
    );
  }

  if (layout === "kurzgesagt") {
    return (
      <div
        className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-cyan-400/30 bg-slate-800/90 px-4 py-1.5 text-center shadow-xl"
      >
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-transform duration-100 ${isWordActive ? "caption-preview-active-word font-bold scale-105" : "font-medium"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "12px",
                color: isWordActive ? (preset.highlightColor || "#67E8F9") : "#F8FAFC",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (layout === "lex-fridman") {
    return (
      <div className="caption-preview-enter inline-flex max-w-[94%] flex-wrap items-center justify-center gap-1.5 px-3 py-1 text-center">
        {sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isWordActive = cleanWord === activeWord.toLowerCase();
          return (
            <span
              key={`${word}-${index}`}
              className={`transition-all duration-100 ${isWordActive ? "caption-preview-active-word font-semibold text-white scale-105 opacity-100" : "font-normal text-slate-300 opacity-80"}`}
              style={{
                fontFamily: preset.font,
                fontSize: "12px",
                textShadow: "0 2px 8px rgba(0,0,0,0.95)",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="caption-preview-enter max-w-full text-center text-[13px] sm:text-[14px] md:text-[15px] font-black leading-snug"
      style={textStyle}
    >
      <CaptionWords
        lines={sampleLines}
        chunk={chunk}
        playbackTime={playbackTime}
        isPlaying={isPlaying}
        activeWord={activeWord}
        activeColor={preset.highlightColor}
      />
    </div>
  );
}

function CaptionWords({
  lines,
  chunk,
  playbackTime = 0,
  isPlaying = false,
  activeWord,
  activeColor,
  inactiveColor,
  karaoke = false,
}: {
  lines: string[];
  chunk?: CaptionScriptChunk;
  playbackTime?: number;
  isPlaying?: boolean;
  activeWord: string;
  activeColor: string;
  inactiveColor?: string;
  karaoke?: boolean;
}) {
  return (
    <>
      {lines.map((line) => (
        <div key={line}>
          {line.split(" ").map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");

            // In playing mode, find timing of this specific word in the chunk
            const wordTiming = (isPlaying && chunk?.words)
              ? chunk.words.find(
                  (w) => w.word.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanWord
                )
              : null;

            const isCurrent = isPlaying && wordTiming
              ? playbackTime >= wordTiming.start && playbackTime <= wordTiming.end
              : cleanWord === activeWord.toLowerCase();

            const isPast = isPlaying && wordTiming ? playbackTime > wordTiming.end : false;

            const isWordActive = isCurrent || (karaoke && isPast);

            return (
              <span
                key={`${line}-${word}-${index}`}
                className={`relative inline-block px-0.5 ${isCurrent ? "caption-preview-active-word" : ""}`}
                style={{
                  color: isWordActive ? activeColor : inactiveColor,
                  transition: "color 0.12s ease",
                }}
              >
                {karaoke && isCurrent ? (
                  <>
                    <span className="opacity-35">{word}</span>
                    <span
                      className="caption-preview-fill absolute inset-y-0 left-0 overflow-hidden px-0.5"
                      style={{
                        width:
                          wordTiming && wordTiming.end - wordTiming.start > 0
                            ? `${Math.min(
                                100,
                                Math.max(
                                  20,
                                  ((playbackTime - wordTiming.start) /
                                    (wordTiming.end - wordTiming.start)) *
                                    100
                                )
                              )}%`
                            : "75%",
                        color: activeColor,
                      }}
                    >
                      {word}
                    </span>
                  </>
                ) : (
                  word
                )}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
}

function layoutForStyle(style: SubtitleStyle): PreviewLayout {
  if (style === "ali-abdaal") return "ali-abdaal";
  if (style === "vox-docu") return "vox-docu";
  if (style === "diary-of-ceo") return "diary-of-ceo";
  if (style === "huberman-lecture") return "huberman-lecture";
  if (style === "mrbeast-16-9") return "mrbeast-16-9";
  if (style === "mkbhd-tech") return "mkbhd-tech";
  if (style === "bbc-netflix-cc") return "bbc-netflix-cc";
  if (style === "kurzgesagt") return "kurzgesagt";
  if (style === "lex-fridman") return "lex-fridman";
  if (style === "warikoo-black-card") return "warikoo-black-card";
  if (style === "active-blue-pill") return "active-blue-pill";
  if (style === "m3-surface-outline") return "m3-surface-outline";
  if (style === "m3-primary-container") return "m3-primary-container";
  if (style === "one-word" || style === "big-bold") return "one-word";
  if (style === "gold-pill") return "pill";
  if (style === "m3-tonal-pill") return "m3-tonal-pill";
  if (style === "m3-dynamic-chip") return "m3-dynamic-chip";
  if (style === "m3-elevated-card") return "m3-elevated-card";
  if (style === "pill-bounce") return "bounce-pill";
  if (style === "stacked") return "stacked";
  if (style === "bold-highlight-strip") return "strip";
  if (style === "box") return "box";
  if (style === "split-color") return "split";
  if (style === "cinematic") return "cinematic-bar";
  if (style === "marker-highlight") return "marker-highlight";
  if (style === "floating-serif") return "floating-serif";
  if (style === "metallic-gradient") return "metallic-gradient";
  if (style === "vollkorn") return "editorial-serif";
  if (style === "bold-outline" || style === "shatter") return "impact-outline";
  if (style === "typewriter-code" || style === "typewriter") return "code";
  if (style === "shorts-karaoke") return "shorts";
  if (style === "karaoke") return "karaoke";
  return "phrase";
}

function getTextStyle(preset: PresetOption, style: SubtitleStyle): React.CSSProperties {
  const textShadow =
    style === "neon"
      ? `0 0 10px ${preset.highlightColor}, 0 0 20px ${preset.highlightColor}aa, 0 2px 4px rgba(0,0,0,0.95)`
      : style === "bold-outline" || style === "shatter"
        ? `0 0 6px ${preset.highlightColor}aa, 2px 2px 0 rgba(0,0,0,0.95), -2px -2px 0 rgba(0,0,0,0.95), 2px -2px 0 rgba(0,0,0,0.95), -2px 2px 0 rgba(0,0,0,0.95)`
        : style === "cinematic" || style === "vollkorn" || style === "floating-serif"
          ? "0 2px 6px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)"
          : "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)";

  return {
    color: preset.textColor,
    fontFamily: preset.font,
    fontWeight: style === "cinematic" || style === "vollkorn" || style === "floating-serif" ? 800 : 900,
    textShadow,
  };
}

export { PRESETS as SUBTITLE_PRESETS };
export type { SubtitleStyleKey };
