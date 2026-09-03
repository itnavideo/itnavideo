"use client";

import React from "react";
import { Check, Play, Pause, Sparkles, Volume2, VolumeX } from "lucide-react";
import {
  SUBTITLE_PRESETS as REMOTION_SUBTITLE_PRESETS,
  type SubtitleStyle,
} from "@/remotion/types/subtitles";

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
  | "handwritten";

type CaptionStylePreviewConfig = {
  sampleLines: string[];
  activeWord?: string;
  background: string;
  backgroundImage?: string;
  accent?: string;
  layout?: PreviewLayout;
};

export const PREVIEW_VIDEO_URL =
  "https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4";
export const PREVIEW_POSTER_URL =
  "https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788450233/professional-creator-girl-before_rwmxsd.jpg";

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

const PRESET_ORDER = [
  "Sharp Yellow",
  "Studio Clean",
  "Eclipse",
  "Karaoke Fill",
  "Shorts Karaoke",
  "Bold Fire",
  "Ocean Blue",
  "Screamer",
  "Podcast Hype",
  "Hustle",
  "Bold Highlight Strip",
  "Shatter Drop",
  "One Word",
  "Metallic Gradient",
  "Black Card",
  "Gold Pill",
  "Stock Green",
  "Glass Blur",
  "Cinematic",
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
];

const LONG_FORM_PRESET_ORDER = [
  "Studio Clean",
  "Cinematic",
  "Marker Highlight",
  "Midnight",
  "Glass Blur",
  "Metallic Gradient",
];

/** Categories for filtering in the dashboard */
export const STYLE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'popular', label: '🔥 Popular' },
  { id: 'premium', label: '✨ Premium' },
  { id: 'bold', label: '🎯 Bold' },
  { id: 'creative', label: '🎨 Creative' },
  { id: 'clean', label: '📐 Clean' },
] as const;

const STYLE_CATEGORY_MAP: Record<string, string> = {
  'Sharp Yellow': 'popular',
  Eclipse: 'popular',
  'Karaoke Fill': 'popular',
  'Studio Clean': 'popular',
  'Bold Fire': 'popular',
  'Shorts Karaoke': 'popular',
  'Ocean Blue': 'popular',
  'Metallic Gradient': 'premium',
  'Gold Pill': 'premium',
  Cinematic: 'premium',
  'Glass Blur': 'premium',
  'Black Card': 'premium',
  'Stock Green': 'premium',
  'Netflix Bar': 'premium',
  'Boardroom': 'premium',
  'One Word': 'bold',
  'Bold Highlight Strip': 'bold',
  Hustle: 'bold',
  'Shatter Drop': 'bold',
  'Neon Pulse': 'bold',
  Screamer: 'bold',
  'Podcast Hype': 'bold',
  'Pill Bounce': 'creative',
  'Pop Candy': 'creative',
  'Marker Highlight': 'creative',
  'Retro VHS': 'creative',
  'Gradient Wave': 'creative',
  Handwritten: 'creative',
  Midnight: 'clean',
  'Hacker Type': 'clean',
  'Arctic Glow': 'clean',
  'Floating Serif': 'clean',
};

export function getStyleCategory(styleName: string): string {
  return STYLE_CATEGORY_MAP[styleName] || 'creative';
}

const PREVIEW_CONFIG: Record<string, CaptionStylePreviewConfig> = {
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
  "Reels Clean": {
    sampleLines: ["your content", "looks professional"],
    activeWord: "content",
    background: "linear-gradient(160deg, #374151 0%, #111827 52%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.podcast,
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
    if (variant === "longForm") return "all";
    const current = getStyleCategory(value);
    return STYLE_CATEGORIES.some((c) => c.id === current) ? current : "popular";
  });

  // Whenever the active style changes, ensure it plays immediately
  React.useEffect(() => {
    if (selectedPreset?.key) {
      setPlayingKey(selectedPreset.key);
    }
  }, [selectedPreset?.key]);

  const presets = variant === "longForm"
    ? PRESETS.filter((preset) => LONG_FORM_PRESET_ORDER.includes(preset.key))
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
      {variant === "shorts" ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" style={{ scrollbarWidth: "none" }}>
            {STYLE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
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
            Live sync caption preview
          </span>
        </div>
      ) : null}
      <div className={variant === "longForm" ? "grid min-w-0 max-w-full grid-cols-1 gap-2.5 sm:grid-cols-2" : "grid min-w-0 max-w-full grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 lg:grid-cols-4"}>
        {presets.map((preset) => {
          const isActive = value === preset.key || value === preset.style;
          const isPlaying = playingKey === preset.key;
          return (
            <CaptionStylePreviewCard
              key={preset.key}
              preset={preset}
              isActive={isActive}
              isPlaying={isPlaying}
              onSelect={() => {
                onChange(preset.key);
                setPlayingKey(preset.key);
              }}
              onMouseEnter={() => setPlayingKey(preset.key)}
              onMouseLeave={() => {
                // Return to active preset when leaving
                if (selectedPreset?.key) {
                  setPlayingKey(selectedPreset.key);
                }
              }}
              onTogglePlay={(e) => {
                e.stopPropagation();
                setPlayingKey((prev) => (prev === preset.key ? "" : preset.key));
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
  isPlaying,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  onTogglePlay,
  variant,
}: {
  preset: PresetOption;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTogglePlay: (e: React.MouseEvent) => void;
  variant: SubtitleStylePickerVariant;
}) {
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    if (!isPlaying) {
      setIsMuted(true);
    }
  }, [isPlaying]);

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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-pressed={isActive}
      className={`group relative flex min-w-0 max-w-full flex-col overflow-hidden rounded-xl border p-1.5 sm:p-2 text-left cursor-pointer transition-all select-none ${
        isActive
          ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-md"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/40 shadow-xs"
      }`}
    >
      {/* Selected Indicator Badge */}
      {isActive ? (
        <span className="absolute right-2 top-2 z-20 flex h-5 w-5 sm:h-5.5 sm:w-5.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-card">
          <Check aria-hidden="true" size={12} strokeWidth={3} className="sm:hidden" />
          <Check aria-hidden="true" size={13} strokeWidth={3} className="hidden sm:block" />
        </span>
      ) : null}

      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? `Pause ${preset.label} video preview` : `Play ${preset.label} video preview`}
        title={isPlaying ? "Pause video preview" : "Play video preview"}
        className={`absolute left-2 top-2 z-20 flex h-7 w-7 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-full transition-all cursor-pointer shadow-md ${
          isPlaying
            ? "bg-emerald-500 text-white shadow-lg scale-105 opacity-100 ring-2 ring-emerald-400/50"
            : "bg-black/80 text-white backdrop-blur-xs border border-white/20 opacity-85 group-hover:opacity-100 group-hover:scale-105 hover:bg-black/95"
        }`}
      >
        {isPlaying ? (
          <Pause size={11} className="fill-current" />
        ) : (
          <Play size={11} className="fill-current ml-0.5" />
        )}
      </button>

      {/* Audio Mute/Unmute Button (Visible when playing) */}
      {isPlaying ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((prev) => !prev);
          }}
          aria-label={isMuted ? "Unmute speech audio" : "Mute speech audio"}
          title={isMuted ? "Unmute speech audio" : "Mute audio"}
          className="absolute left-10.5 sm:left-11 top-2 z-20 flex h-7 w-7 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-full bg-black/85 text-white backdrop-blur-xs border border-white/25 transition-all cursor-pointer hover:bg-black shadow-md hover:scale-105"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-emerald-400" />}
        </button>
      ) : null}

      {/* Visual Frame */}
      <CaptionPreviewFrame
        preset={preset}
        variant={variant}
        isPlaying={isPlaying}
        isMuted={isMuted}
      />

      {/* Style Name and Live Status */}
      <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-1 w-full">
        <span className={`truncate text-[11px] sm:text-xs font-bold leading-tight ${isActive ? "text-primary font-black" : "text-foreground"}`}>
          {preset.label}
        </span>
        {isPlaying ? (
          <span className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-500 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Playing
          </span>
        ) : null}
      </div>
    </div>
  );
}

function CaptionPreviewFrame({
  preset,
  variant,
  isPlaying,
  isMuted = true,
}: {
  preset: PresetOption;
  variant: SubtitleStylePickerVariant;
  isPlaying: boolean;
  isMuted?: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [playbackTime, setPlaybackTime] = React.useState(0);

  // Directly synchronize audio mute to the HTML5 video element
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Ensure video actually plays when isPlaying becomes true
  React.useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (!isPlaying) {
      setPlaybackTime(0);
      return;
    }

    let animationFrameId: number;
    const loop = () => {
      const v = videoRef.current;
      if (v && !v.paused) {
        setPlaybackTime(v.currentTime);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const config = PREVIEW_CONFIG[preset.key] || {
    sampleLines: PREVIEW_SCRIPT_CHUNKS[0].sampleLines,
    activeWord: PREVIEW_SCRIPT_CHUNKS[0].activeWord,
    background: "linear-gradient(160deg, #334155 0%, #111827 55%, #020617 100%)",
    backgroundImage: PREVIEW_POSTER_URL,
  };

  // Find matching chunk based on video playbackTime (or first chunk when idle)
  const currentChunk = isPlaying
    ? PREVIEW_SCRIPT_CHUNKS.find((c) => playbackTime >= c.start && playbackTime < c.end) ||
      PREVIEW_SCRIPT_CHUNKS[0]
    : PREVIEW_SCRIPT_CHUNKS[0];

  const currentWordObj = isPlaying
    ? currentChunk.words.find((w) => playbackTime >= w.start && playbackTime <= w.end)
    : undefined;

  const currentActiveWord = currentWordObj
    ? currentWordObj.word.replace(/[^a-zA-Z0-9]/g, "")
    : currentChunk.activeWord;

  const scene = (
    <>
      {isPlaying ? (
        <video
          ref={videoRef}
          src={PREVIEW_VIDEO_URL}
          poster={PREVIEW_POSTER_URL}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={PREVIEW_POSTER_URL}
          alt={preset.label}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/65" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-1.5 bottom-[14%] flex justify-center text-center">
        <CaptionPreviewText
          preset={preset}
          config={config}
          chunk={currentChunk}
          playbackTime={playbackTime}
          isPlaying={isPlaying}
          activeWord={currentActiveWord}
          currentWordObj={currentWordObj}
        />
      </div>
    </>
  );

  if (variant === "longForm") {
    return (
      <div className="mx-auto w-full px-1 pt-1">
        <div className="rounded-[10px] border-[3px] border-slate-950 bg-slate-900 p-[3px] shadow-[0_8px_18px_rgba(0,0,0,0.42)]">
          <div className="relative aspect-video overflow-hidden rounded-[4px]" style={{ background: config.background }}>
            {scene}
            <span className="absolute left-1/2 top-[2px] h-[2px] w-5 -translate-x-1/2 rounded-full bg-slate-700" />
          </div>
        </div>
        <div className="relative mx-auto h-1.5 w-3/4 rounded-b-full border-x border-b border-slate-950 bg-slate-700 shadow-[0_4px_8px_rgba(0,0,0,0.38)]">
          <span className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 bg-cyan-100/25" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-md border border-white/10 shadow-inner shadow-black/40"
      style={{ background: config.background }}
    >
      {scene}
    </div>
  );
}

function CreatorSilhouette() {
  return (
    <>
      <div className="absolute left-1/2 top-[19%] h-[22%] w-[39%] -translate-x-1/2 rounded-full bg-slate-300/18 blur-[1px]" />
      <div className="absolute left-1/2 top-[43%] h-[31%] w-[58%] -translate-x-1/2 rounded-t-full bg-slate-400/14 blur-[1px]" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/62 via-black/18 to-transparent" />
      <div className="absolute left-[12%] top-[10%] h-1 w-8 rounded-full bg-white/16" />
      <div className="absolute right-[13%] top-[12%] h-1 w-5 rounded-full bg-white/12" />
    </>
  );
}

function CaptionPreviewText({
  preset,
  config,
  chunk,
  playbackTime,
  isPlaying,
  activeWord,
  currentWordObj,
}: {
  preset: PresetOption;
  config: CaptionStylePreviewConfig;
  chunk: CaptionScriptChunk;
  playbackTime: number;
  isPlaying: boolean;
  activeWord: string;
  currentWordObj?: CaptionScriptWord;
}) {
  const style = preset.style as SubtitleStyle;
  const layout = config.layout || layoutForStyle(style);
  const textStyle = getTextStyle(preset, style);
  const sampleLines = chunk.sampleLines;

  if (layout === "one-word") {
    const displayWord = isPlaying
      ? (currentWordObj ? currentWordObj.word.replace(/[^a-zA-Z0-9']/g, "").toUpperCase() : activeWord.toUpperCase())
      : chunk.activeWord.toUpperCase();

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
  playbackTime,
  isPlaying,
  activeWord,
  activeColor,
  inactiveColor,
  karaoke = false,
}: {
  lines: string[];
  chunk: CaptionScriptChunk;
  playbackTime: number;
  isPlaying: boolean;
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
            const wordTiming = isPlaying
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
  if (style === "one-word" || style === "big-bold") return "one-word";
  if (style === "gold-pill") return "pill";
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
