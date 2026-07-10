"use client";

import React from "react";
import { Check } from "lucide-react";
import Image from "next/image";
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
  | "metallic-gradient";

type CaptionStylePreviewConfig = {
  sampleLines: string[];
  activeWord?: string;
  background: string;
  backgroundImage?: string;
  accent?: string;
  layout?: PreviewLayout;
};

const CREATOR_BACKGROUNDS = {
  studio: "/visuals/Creator%20Studio%20Dark.png",
  faceless: "/visuals/Faceless%20Creator%20%20Neutral.png",
  podcast: "/visuals/Podcast%20Clip%20Style.png",
  business: "/visuals/BusinessFinance%20Creator.png",
  tech: "/visuals/Tech%20Creator.png",
  educator: "/visuals/Educator%20Creator.png",
} as const;

const PRESET_ORDER = [
  "Eclipse",
  "Hustle",
  "Gold Pill",
  "Studio Clean",
  "One Word",
  "Arctic Glow",
  "Karaoke Fill",
  "Shorts Karaoke",
  "Reels Clean",
  "Bold Highlight Strip",
  "Shatter Drop",
  "Pill Bounce",
  "Marker Highlight",
  "Metallic Gradient",
  "Neon Pulse",
  "Glass Blur",
  "Floating Serif",
  "Cinematic",
  "Hacker Type",
  "Minimal Fade",
  "Gradient Wave",
  "Retro VHS",
  "Handwritten",
  "Vollkorn",
  "Midnight",
  "Marigold",
  "Pop Candy",
  "Bold Fire",
  "Typewriter",
  "split-color",
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
  Eclipse: 'popular',
  'Karaoke Fill': 'popular',
  'Studio Clean': 'popular',
  'Bold Fire': 'popular',
  'Reels Clean': 'popular',
  'Shorts Karaoke': 'popular',
  'Metallic Gradient': 'premium',
  'Gold Pill': 'premium',
  Cinematic: 'premium',
  'Floating Serif': 'premium',
  'Glass Blur': 'premium',
  'One Word': 'bold',
  'Bold Highlight Strip': 'bold',
  Hustle: 'bold',
  'Shatter Drop': 'bold',
  'Neon Pulse': 'bold',
  'Pill Bounce': 'creative',
  'Pop Candy': 'creative',
  'Marker Highlight': 'creative',
  'Retro VHS': 'creative',
  'Gradient Wave': 'creative',
  Handwritten: 'creative',
  'Minimal Fade': 'clean',
  Midnight: 'clean',
  Marigold: 'clean',
  Typewriter: 'clean',
  'Hacker Type': 'clean',
  Vollkorn: 'clean',
  'Arctic Glow': 'clean',
  'split-color': 'clean',
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

interface SubtitleStylePickerProps {
  value: string;
  onChange: (presetKey: string) => void;
}

export function SubtitleStylePicker({ value, onChange }: SubtitleStylePickerProps) {
  return (
    <>
      <style>{`
        @keyframes captionPreviewEnter {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          45% { transform: translateY(-1px) scale(1.015); opacity: 0.96; }
        }
        @keyframes captionPreviewActive {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          45% { transform: scale(1.08); filter: brightness(1.12); }
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
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {PRESETS.map((preset) => {
          const isActive = value === preset.key || value === preset.style;
          return (
            <CaptionStylePreviewCard
              key={preset.key}
              preset={preset}
              isActive={isActive}
              onSelect={() => onChange(preset.key)}
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
}: {
  preset: PresetOption;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`group relative flex min-w-0 flex-col rounded-lg border p-2 text-left transition-all ${
        isActive
          ? "border-brand-mint/70 bg-brand-mint/[0.08] ring-1 ring-brand-mint/45"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
      }`}
    >
      {isActive ? (
        <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand-mint text-slate-950 shadow-lg shadow-black/30">
          <Check aria-hidden="true" size={13} strokeWidth={3} />
        </span>
      ) : null}

      <CaptionPreviewFrame preset={preset} />

      <span className={`mt-2 truncate text-[11px] font-bold leading-tight ${isActive ? "text-brand-mint" : "text-zinc-200"}`}>
        {preset.label}
      </span>
    </button>
  );
}

function CaptionPreviewFrame({ preset }: { preset: PresetOption }) {
  const config = PREVIEW_CONFIG[preset.key] || {
    sampleLines: ["create better reels", "in minutes"],
    activeWord: "better",
    background: "linear-gradient(160deg, #334155 0%, #111827 55%, #020617 100%)",
    backgroundImage: CREATOR_BACKGROUNDS.studio,
  };

  return (
    <div
      className="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-md border border-white/10 shadow-inner shadow-black/40"
      style={{ background: config.background }}
    >
      {config.backgroundImage ? (
        <Image
          src={config.backgroundImage}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 150px"
          className="object-cover"
        />
      ) : (
        <CreatorSilhouette />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/10 to-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/58 via-black/24 to-transparent" />
      <div className="absolute inset-x-[8%] bottom-[10%] flex justify-center">
        <CaptionPreviewText preset={preset} config={config} />
      </div>
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
}: {
  preset: PresetOption;
  config: CaptionStylePreviewConfig;
}) {
  const style = preset.style as SubtitleStyle;
  const layout = config.layout || layoutForStyle(style);
  const textStyle = getTextStyle(preset, style);

  if (layout === "one-word") {
    return (
      <div
        className="caption-preview-enter max-w-full break-words text-center text-[20px] font-black uppercase leading-none"
        style={{
          ...textStyle,
          color: preset.highlightColor,
          textShadow: `0 0 8px ${preset.highlightColor}55, 0 2px 2px rgba(0,0,0,0.58)`,
        }}
      >
        {config.sampleLines[0]}
      </div>
    );
  }

  if (layout === "code") {
    return (
      <div
        className="caption-preview-enter caption-preview-cursor w-full rounded-[4px] border-l-2 px-1.5 py-1 text-left text-[8px] font-bold leading-tight"
        style={{
          ...textStyle,
          color: preset.highlightColor,
          borderColor: preset.highlightColor,
          background: "rgba(0,0,0,0.58)",
          textShadow: `0 0 5px ${preset.highlightColor}55`,
        }}
      >
        {config.sampleLines.map((line) => (
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
        className="caption-preview-enter max-w-full rounded-[5px] px-2 py-1 text-center text-[9px] font-black leading-tight shadow-md"
        style={{
          ...textStyle,
          background: preset.bgColor || "#F4F4F5",
          color: preset.textColor,
        }}
      >
        <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
      </div>
    );
  }

  if (layout === "box") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-col items-center gap-1">
        {config.sampleLines.map((line) => (
          <div key={line} className="flex flex-wrap justify-center gap-1">
            {line.split(" ").map((word, index) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
              const isActive = config.activeWord?.toLowerCase() === cleanWord;
              return (
                <span
                  key={`${line}-${word}-${index}`}
                  className={`rounded-[4px] px-1 py-0.5 text-[9px] font-black leading-none ${isActive ? "caption-preview-active-word" : ""}`}
                  style={{
                    ...textStyle,
                    color: isActive ? "#111827" : preset.textColor,
                    background: isActive ? preset.highlightColor : "rgba(255,255,255,0.9)",
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
        className="caption-preview-enter max-w-full text-center text-[11px] font-black uppercase leading-tight"
        style={{
          ...textStyle,
          color: preset.textColor,
          WebkitTextStroke: `0.55px ${preset.highlightColor}`,
          paintOrder: "stroke fill",
          textShadow: `1px 1px 0 rgba(0,0,0,0.8), 0 0 5px ${preset.highlightColor}55`,
        }}
      >
        <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
      </div>
    );
  }

  if (layout === "cinematic-bar") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-[3px] border border-white/10 bg-black/42 px-2 py-1 text-center text-[8.5px] font-semibold leading-tight"
        style={{
          ...textStyle,
          color: preset.textColor,
          letterSpacing: "0.02em",
          textTransform: "none",
        }}
      >
        {config.sampleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    );
  }

  if (layout === "marker-highlight") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-wrap justify-center gap-x-1 gap-y-1 text-center text-[9px] font-black leading-tight">
        {config.sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isActive = config.activeWord?.toLowerCase() === cleanWord;
          return (
            <span
              key={`${word}-${index}`}
              className={`relative inline-block px-1 ${isActive ? "caption-preview-active-word" : ""}`}
              style={{
                ...textStyle,
                color: preset.textColor,
                zIndex: 0,
                textShadow: "0 1px 3px rgba(0,0,0,0.72)",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-[62%] rounded-[3px]"
                style={{
                  background: isActive ? preset.highlightColor : `${preset.bgColor || preset.highlightColor}AA`,
                  transform: `rotate(${index % 2 === 0 ? "-1.5deg" : "1.3deg"})`,
                  opacity: isActive ? 0.95 : 0.74,
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
        className="caption-preview-enter max-w-full text-center text-[8.5px] font-semibold leading-snug"
        style={{
          ...textStyle,
          color: preset.textColor,
          fontFamily: preset.font,
          fontWeight: 600,
          textShadow: "0 2px 8px rgba(0,0,0,0.78)",
        }}
      >
        <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
      </div>
    );
  }

  if (layout === "metallic-gradient") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-[5px] border border-white/10 px-1.5 py-1 text-center text-[9px] font-black uppercase leading-tight"
        style={{
          ...textStyle,
          background: "linear-gradient(180deg, rgba(17,24,39,0.72), rgba(2,6,23,0.58))",
          boxShadow: "0 5px 10px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.16)",
        }}
      >
        {config.sampleLines.map((line) => (
          <div key={line}>
            {line.split(" ").map((word, index) => {
              const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
              const isActive = config.activeWord?.toLowerCase() === cleanWord;
              return (
                <span
                  key={`${line}-${word}-${index}`}
                  className={`inline-block px-0.5 ${isActive ? "caption-preview-active-word" : ""}`}
                  style={{
                    background: isActive
                      ? "linear-gradient(100deg, #FFFFFF 0%, #D9B76E 38%, #94A3B8 70%, #FFFFFF 100%)"
                      : "linear-gradient(100deg, #F8FAFC 0%, #B8C2D8 46%, #E5E7EB 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 1px 3px rgba(0,0,0,0.72)",
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
        className="caption-preview-enter max-w-full rounded-[4px] bg-black/48 px-2 py-1 text-center text-[9px] font-bold leading-tight"
        style={{
          ...textStyle,
          color: preset.textColor,
          fontFamily: preset.font,
        }}
      >
        <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-[5px] bg-black/38 px-1.5 py-1 text-center text-[9px] font-black leading-tight"
        style={textStyle}
      >
        <CaptionWords
          lines={config.sampleLines}
          activeWord={config.activeWord}
          activeColor={preset.highlightColor}
          inactiveColor="rgba(255,255,255,0.62)"
          karaoke
        />
      </div>
    );
  }

  if (layout === "strip") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-[5px] px-1.5 py-1 text-center text-[9px] font-black uppercase leading-tight"
        style={{
          ...textStyle,
          background: preset.bgColor || "#F59E0B",
          color: preset.textColor,
          WebkitTextStroke: "0.7px #7F1D1D",
          paintOrder: "stroke fill",
          boxShadow: "inset 0 -2px 0 rgba(127,29,29,0.18), 0 5px 8px rgba(0,0,0,0.2)",
          textShadow: "0 1px 0 rgba(39,16,16,0.75)",
        }}
      >
        {config.sampleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    );
  }

  if (layout === "pill") {
    return (
      <div className="caption-preview-enter flex max-w-full flex-col items-center gap-1">
        {config.sampleLines.map((line) => (
          <div
            key={line}
            className="max-w-full rounded-full px-2 py-0.5 text-center text-[9px] font-black uppercase leading-tight"
            style={{
              ...textStyle,
              background: preset.bgColor || "rgba(0,0,0,0.72)",
              color: preset.highlightColor,
              boxShadow: `0 0 7px ${preset.highlightColor}25, 0 5px 8px rgba(0,0,0,0.2)`,
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
      <div className="caption-preview-enter flex max-w-full flex-wrap justify-center gap-1 text-[9px] font-black leading-tight">
        {config.sampleLines.flatMap((line) => line.split(" ")).map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
          const isActive = config.activeWord?.toLowerCase() === cleanWord;
          return (
            <span
              key={`${word}-${index}`}
              className={`${isActive ? "caption-preview-active-word" : ""} rounded-full px-1.5 py-0.5`}
              style={{
                ...textStyle,
                color: isActive ? "#111827" : preset.textColor,
                background: isActive ? preset.highlightColor : "rgba(255,255,255,0.12)",
                textShadow: isActive ? "none" : textStyle.textShadow,
                boxShadow: isActive ? `0 4px 8px ${preset.highlightColor}30` : "none",
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
        className="caption-preview-enter max-w-full rounded-[5px] bg-black/42 px-1.5 py-1 text-center text-[9px] font-black leading-tight"
        style={textStyle}
      >
        <CaptionWords
          lines={config.sampleLines}
          activeWord={config.activeWord}
          activeColor={preset.highlightColor}
          inactiveColor="rgba(255,255,255,0.38)"
          karaoke
        />
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div
        className="caption-preview-enter max-w-full rounded-[5px] px-2 py-1 text-center text-[9px] font-black uppercase leading-tight"
        style={{
          ...textStyle,
          background: preset.bgColor || "rgba(24,24,27,0.88)",
          color: preset.textColor,
          boxShadow: "0 5px 10px rgba(0,0,0,0.22)",
        }}
      >
        <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
      </div>
    );
  }

  return (
    <div
      className="caption-preview-enter max-w-full text-center text-[10px] font-black leading-tight"
      style={textStyle}
    >
      <CaptionWords lines={config.sampleLines} activeWord={config.activeWord} activeColor={preset.highlightColor} />
    </div>
  );
}

function CaptionWords({
  lines,
  activeWord,
  activeColor,
  inactiveColor,
  karaoke = false,
}: {
  lines: string[];
  activeWord?: string;
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
            const isActive = activeWord?.toLowerCase() === cleanWord || activeWord?.toLowerCase() === word.toLowerCase();
            return (
              <span
                key={`${line}-${word}-${index}`}
                className={`relative inline-block px-0.5 ${isActive ? "caption-preview-active-word" : ""}`}
                style={{ color: isActive ? activeColor : inactiveColor }}
              >
                {karaoke && isActive ? (
                  <>
                    <span className="opacity-35">{word}</span>
                    <span className="caption-preview-fill absolute inset-y-0 left-0 overflow-hidden px-0.5" style={{ width: "68%", color: activeColor }}>
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
      ? `0 0 6px ${preset.highlightColor}99, 0 1px 3px rgba(0,0,0,0.55)`
      : style === "bold-outline" || style === "shatter"
        ? `0 0 5px ${preset.highlightColor}66, 1px 1px 0 rgba(0,0,0,0.72)`
        : style === "cinematic" || style === "vollkorn" || style === "floating-serif"
          ? "0 1px 4px rgba(0,0,0,0.64)"
          : "0 1px 3px rgba(0,0,0,0.62)";

  return {
    color: preset.textColor,
    fontFamily: preset.font,
    fontWeight: style === "cinematic" || style === "vollkorn" || style === "floating-serif" ? 700 : 900,
    textShadow,
  };
}

export { PRESETS as SUBTITLE_PRESETS };
export type { SubtitleStyleKey };
