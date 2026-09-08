"use client";

import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Check,
  RotateCcw,
  Captions,
  Tv,
  Wand2,
  Volume2,
  Layers,
  Compass,
  Zap,
  BookOpen,
  Crown,
  DollarSign,
  Film,
  Flame,
} from "lucide-react";

export type FacelessFontOption =
  | "Montserrat"
  | "Plus Jakarta Sans"
  | "Inter"
  | "Poppins"
  | "Bebas Neue"
  | "Oswald"
  | "Playfair Display"
  | "Space Grotesk"
  | "Outfit"
  | "Cinzel"
  | "Syne"
  | "Roboto";

export const CURATED_FACELESS_FONTS: {
  id: FacelessFontOption;
  label: string;
  role: string;
  tag: string;
}[] = [
  { id: "Montserrat", label: "Montserrat", role: "High-retention bold YouTube headline", tag: "GEOMETRIC SANS" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", role: "Editorial accent & smooth subtitle flow", tag: "MODERN GROTESK" },
  { id: "Inter", label: "Inter", role: "Clarity, readability & clean screen text", tag: "INTERFACE CLEAN" },
  { id: "Poppins", label: "Poppins", role: "Friendly geometric contemporary aesthetic", tag: "GEOMETRIC" },
  { id: "Bebas Neue", label: "Bebas Neue", role: "High-impact uppercase documentary hooks", tag: "CONDENSED DISPLAY" },
  { id: "Oswald", label: "Oswald", role: "Sharp narrow news & business headlines", tag: "EDITORIAL CONDENSED" },
  { id: "Outfit", label: "Outfit", role: "Sleek Silicon Valley tech & AI presentations", tag: "TECH SANS" },
  { id: "Space Grotesk", label: "Space Grotesk", role: "Cybernetic, futuristic & algorithmic tone", tag: "DIGITAL DISPLAY" },
  { id: "Playfair Display", label: "Playfair Display", role: "Luxury, narrative storytelling & documentary", tag: "EDITORIAL SERIF" },
  { id: "Cinzel", label: "Cinzel", role: "Cinematic, dramatic & historical authority", tag: "CINEMATIC SERIF" },
  { id: "Syne", label: "Syne", role: "Avant-garde artistic & creative branding", tag: "CREATIVE DISPLAY" },
  { id: "Roboto", label: "Roboto", role: "Classic YouTube clean informational text", tag: "STANDARD SANS" },
];

export interface CanvaBackgroundTile {
  id: string;
  name: string;
  category: "light" | "dark" | "luxury" | "vibrant";
  hex: string;
  contrastColor: string;
  previewBg: string;
  cloudinaryUrl?: string;
}

export const CANVA_BACKGROUND_TILES: CanvaBackgroundTile[] = [
  {
    id: "studio-white",
    name: "Studio White",
    category: "light",
    hex: "#F9F9FB",
    contrastColor: "#0F172A",
    previewBg: "linear-gradient(135deg, #FFFFFF 0%, #F1F3F7 100%)",
    cloudinaryUrl: "https://res.cloudinary.com/dhouh9idx/image/upload/v1787939447/warm-off-white-cream-texture-f4f4f9_isou0y.png",
  },
  {
    id: "warm-cream",
    name: "Warm Cream",
    category: "light",
    hex: "#F5F3EF",
    contrastColor: "#1C1917",
    previewBg: "linear-gradient(135deg, #FAF7F2 0%, #ECE6DC 100%)",
  },
  {
    id: "soft-slate",
    name: "Soft Slate",
    category: "light",
    hex: "#E2E8F0",
    contrastColor: "#0F172A",
    previewBg: "linear-gradient(135deg, #EEF2F6 0%, #D8E0EB 100%)",
  },
  {
    id: "midnight-obsidian",
    name: "Midnight Obsidian",
    category: "dark",
    hex: "#0A0D14",
    contrastColor: "#F8FAFC",
    previewBg: "linear-gradient(135deg, #0F131D 0%, #06080C 100%)",
  },
  {
    id: "charcoal-slate",
    name: "Charcoal Slate",
    category: "dark",
    hex: "#1E293B",
    contrastColor: "#F8FAFC",
    previewBg: "linear-gradient(135deg, #243044 0%, #171F2C 100%)",
  },
  {
    id: "emerald-studio",
    name: "Emerald Studio",
    category: "luxury",
    hex: "#064E3B",
    contrastColor: "#ECFDF5",
    previewBg: "linear-gradient(135deg, #065F46 0%, #022C22 100%)",
  },
  {
    id: "royal-navy",
    name: "Royal Navy",
    category: "luxury",
    hex: "#0F172A",
    contrastColor: "#F1F5F9",
    previewBg: "linear-gradient(135deg, #1E293B 0%, #0B1120 100%)",
  },
  {
    id: "sunset-amber",
    name: "Sunset Amber",
    category: "vibrant",
    hex: "#451A03",
    contrastColor: "#FEF3C7",
    previewBg: "linear-gradient(135deg, #572004 0%, #290E02 100%)",
  },
  {
    id: "velvet-wine",
    name: "Velvet Wine",
    category: "luxury",
    hex: "#3B0764",
    contrastColor: "#FAF5FF",
    previewBg: "linear-gradient(135deg, #4C0B82 0%, #200438 100%)",
  },
];

export interface CreativeDirectorPreset {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  themeId: string;
  headingFont: FacelessFontOption;
  subheadingFont: FacelessFontOption;
  bodyFont: FacelessFontOption;
  pacing: "dynamic" | "balanced" | "cinema";
  description: string;
}

export const CREATIVE_DIRECTOR_PRESETS: CreativeDirectorPreset[] = [
  {
    id: "youtube-doc",
    name: "YouTube Documentary",
    badge: "MOST POPULAR",
    icon: Flame,
    themeId: "midnight-obsidian",
    headingFont: "Montserrat",
    subheadingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    pacing: "dynamic",
    description: "Punchy contrast, 3-5s kinetic visual cuts & high retention",
  },
  {
    id: "minimal-editorial",
    name: "Minimalist Studio",
    badge: "CANVA CLEAN",
    icon: Sparkles,
    themeId: "studio-white",
    headingFont: "Plus Jakarta Sans",
    subheadingFont: "Poppins",
    bodyFont: "Inter",
    pacing: "balanced",
    description: "Ultra-clean light canvas with crisp editorial typography",
  },
  {
    id: "tech-silicon",
    name: "Silicon Valley Tech",
    badge: "AI & CODE",
    icon: Zap,
    themeId: "charcoal-slate",
    headingFont: "Space Grotesk",
    subheadingFont: "Outfit",
    bodyFont: "Inter",
    pacing: "dynamic",
    description: "Cybernetic typography, data callouts & split screens",
  },
  {
    id: "cinema-story",
    name: "Cinema Storytelling",
    badge: "NARRATIVE",
    icon: Crown,
    themeId: "velvet-wine",
    headingFont: "Playfair Display",
    subheadingFont: "Montserrat",
    bodyFont: "Inter",
    pacing: "cinema",
    description: "Dramatic cinematic serif titles & emotional storytelling flow",
  },
  {
    id: "wealth-finance",
    name: "Wealth & Finance",
    badge: "HIGH RPM",
    icon: DollarSign,
    themeId: "emerald-studio",
    headingFont: "Oswald",
    subheadingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    pacing: "balanced",
    description: "Executive dark emerald palette with bold stats & quotes",
  },
];

export interface FacelessVideoStyleControlsProps {
  headingFont: string;
  setHeadingFont: (font: string) => void;
  subheadingFont: string;
  setSubheadingFont: (font: string) => void;
  bodyFont: string;
  setBodyFont: (font: string) => void;
  selectedBackgroundTheme: string;
  setSelectedBackgroundTheme: (themeId: string) => void;
  selectedBackgroundUrl?: string;
  setSelectedBackgroundUrl?: (url: string) => void;
  enableCaptions?: boolean;
  setEnableCaptions?: (enabled: boolean) => void;
  aiPacing?: "dynamic" | "balanced" | "cinema";
  setAiPacing?: (pacing: "dynamic" | "balanced" | "cinema") => void;
}

export function FacelessVideoStyleControls({
  headingFont = "Montserrat",
  setHeadingFont,
  subheadingFont = "Plus Jakarta Sans",
  setSubheadingFont,
  bodyFont = "Inter",
  setBodyFont,
  selectedBackgroundTheme = "studio-white",
  setSelectedBackgroundTheme,
  setSelectedBackgroundUrl,
  enableCaptions = true,
  setEnableCaptions,
  aiPacing = "dynamic",
  setAiPacing,
}: FacelessVideoStyleControlsProps) {
  const [internalPacing, setInternalPacing] = useState<"dynamic" | "balanced" | "cinema">(aiPacing);
  const [enableSFX, setEnableSFX] = useState<boolean>(true);

  const activePacing = setAiPacing ? aiPacing : internalPacing;
  const handlePacingChange = (p: "dynamic" | "balanced" | "cinema") => {
    setInternalPacing(p);
    setAiPacing?.(p);
  };

  const activeTile = useMemo(() => {
    return (
      CANVA_BACKGROUND_TILES.find((t) => t.id === selectedBackgroundTheme) ||
      CANVA_BACKGROUND_TILES[0]
    );
  }, [selectedBackgroundTheme]);

  const handleSelectBackground = (tile: CanvaBackgroundTile) => {
    setSelectedBackgroundTheme(tile.id);
    if (setSelectedBackgroundUrl) {
      setSelectedBackgroundUrl(tile.cloudinaryUrl || "");
    }
  };

  const handleApplyPreset = (preset: CreativeDirectorPreset) => {
    setSelectedBackgroundTheme(preset.themeId);
    const tile = CANVA_BACKGROUND_TILES.find((t) => t.id === preset.themeId);
    if (setSelectedBackgroundUrl) {
      setSelectedBackgroundUrl(tile?.cloudinaryUrl || "");
    }
    setHeadingFont(preset.headingFont);
    setSubheadingFont(preset.subheadingFont);
    setBodyFont(preset.bodyFont);
    handlePacingChange(preset.pacing);
  };

  const handleResetDefaultFonts = () => {
    setHeadingFont("Montserrat");
    setSubheadingFont("Plus Jakarta Sans");
    setBodyFont("Inter");
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-white/10 bg-zinc-950/90 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
      {/* ── M3 Studio Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <Film className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              Faceless Video Studio &bull; Material 3 Design
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            16:9 YouTube Widescreen &bull; AI Scene Director &bull; Canva Color Palettes &bull; 3-Font Hierarchy
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
            <Tv className="h-3 w-3" /> 16:9 Widescreen
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25">
            <Wand2 className="h-3 w-3" /> AI Pipeline Active
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/25">
            <Layers className="h-3 w-3" /> 60+ Visual Library
          </span>
        </div>
      </div>

      {/* ── SECTION 1: M3 Creative Director Presets (1-Tap Selection) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Step 1 &bull; Creative Director Presets
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">Instant Style + Typography + Pacing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CREATIVE_DIRECTOR_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isMatch =
              selectedBackgroundTheme === preset.themeId &&
              headingFont === preset.headingFont &&
              subheadingFont === preset.subheadingFont;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`group relative flex flex-col justify-between p-3 rounded-2xl text-left transition-all duration-200 border ${
                  isMatch
                    ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]"
                    : "border-white/10 bg-zinc-900/60 hover:border-white/25 hover:bg-zinc-900"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300 border border-white/10">
                      {preset.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {preset.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono truncate">{preset.headingFont}</span>
                  {isMatch && <Check className="h-3.5 w-3.5 text-amber-400" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: M3 Canva Canvas Swatches (16:9 Mini Cards) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Step 2 &bull; Canva Color Backdrops (16:9 Texture)
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-300">
            Selected: {activeTile.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {CANVA_BACKGROUND_TILES.map((tile) => {
            const isSelected = selectedBackgroundTheme === tile.id;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleSelectBackground(tile)}
                className={`group relative flex flex-col p-2 rounded-2xl transition-all duration-200 border text-left ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/40 bg-zinc-900 shadow-md scale-105"
                    : "border-white/10 bg-zinc-900/60 hover:border-white/30 hover:scale-[1.02]"
                }`}
                title={tile.name}
              >
                {/* 16:9 Swatch Preview Box */}
                <div
                  className="aspect-video w-full rounded-xl border border-black/30 shadow-inner flex items-center justify-center relative overflow-hidden transition"
                  style={{ background: tile.previewBg }}
                >
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950 shadow-md">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-200 truncate max-w-[85%]">
                    {tile.name}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full border border-black/40"
                    style={{ backgroundColor: tile.hex }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: M3 3-Font Hierarchy System ── */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Step 3 &bull; Curated 3-Font Suite Hierarchy
            </span>
            <p className="text-[11px] text-zinc-400">
              Heading for Hooks &bull; Subheading for Narrative &bull; Body for Subtitles &amp; Explanations
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaultFonts}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition"
          >
            <RotateCcw size={12} />
            <span>Reset to Optimal Hierarchy</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Slot 1: Heading Font */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                1. Heading Font (Primary)
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                {CURATED_FACELESS_FONTS.find((f) => f.id === headingFont)?.tag || "DISPLAY"}
              </span>
            </div>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none transition"
            >
              {CURATED_FACELESS_FONTS.map((font) => (
                <option key={`heading-${font.id}`} value={font.id}>
                  {font.label} &mdash; {font.tag}
                </option>
              ))}
            </select>
            <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
              <span
                className="block text-sm font-black text-white truncate"
                style={{ fontFamily: headingFont }}
              >
                THE FUTURE OF AI AUTOMATION
              </span>
              <span className="text-[10px] text-zinc-400 block truncate mt-0.5">
                {CURATED_FACELESS_FONTS.find((f) => f.id === headingFont)?.role}
              </span>
            </div>
          </div>

          {/* Slot 2: Subheading Font */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                2. Accent &bull; Subheading Font
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                {CURATED_FACELESS_FONTS.find((f) => f.id === subheadingFont)?.tag || "EDITORIAL"}
              </span>
            </div>
            <select
              value={subheadingFont}
              onChange={(e) => setSubheadingFont(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-2 text-xs font-bold text-white focus:border-orange-400 focus:outline-none transition"
            >
              {CURATED_FACELESS_FONTS.map((font) => (
                <option key={`sub-${font.id}`} value={font.id}>
                  {font.label} &mdash; {font.tag}
                </option>
              ))}
            </select>
            <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
              <span
                className="block text-xs font-bold uppercase tracking-wider text-orange-300 truncate"
                style={{ fontFamily: subheadingFont }}
              >
                ✦ Key Growth Metric &bull; Chapter 01
              </span>
              <span className="text-[10px] text-zinc-400 block truncate mt-0.5">
                {CURATED_FACELESS_FONTS.find((f) => f.id === subheadingFont)?.role}
              </span>
            </div>
          </div>

          {/* Slot 3: Body & Captions Font */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                3. Body &amp; Captions Font
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                {CURATED_FACELESS_FONTS.find((f) => f.id === bodyFont)?.tag || "CLEAN"}
              </span>
            </div>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-2 text-xs font-bold text-white focus:border-emerald-400 focus:outline-none transition"
            >
              {CURATED_FACELESS_FONTS.map((font) => (
                <option key={`body-${font.id}`} value={font.id}>
                  {font.label} &mdash; {font.tag}
                </option>
              ))}
            </select>
            <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
              <span
                className="block text-xs font-normal text-zinc-200 truncate"
                style={{ fontFamily: bodyFont }}
              >
                Clear word-by-word synced subtitle rendering
              </span>
              <span className="text-[10px] text-zinc-400 block truncate mt-0.5">
                {CURATED_FACELESS_FONTS.find((f) => f.id === bodyFont)?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: AI Scene Director & Visual Pacing Pipeline ── */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/15 text-amber-400">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              AI Scene Director &bull; Visual Pacing &amp; Library Matching
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Powered by Groq Whisper &amp; Cloudinary 60+ Visuals
          </span>
        </div>

        {/* M3 Segmented Pacing Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handlePacingChange("dynamic")}
            className={`p-2.5 rounded-xl border text-left transition ${
              activePacing === "dynamic"
                ? "border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400/30"
                : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-amber-400" /> Dynamic Retention
              </span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                3-5s Beats
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-tight text-zinc-400">
              Rapid visual cuts, stats, split screens &amp; kinetic emphasis for maximum watch time.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handlePacingChange("balanced")}
            className={`p-2.5 rounded-xl border text-left transition ${
              activePacing === "balanced"
                ? "border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400/30"
                : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-sky-400" /> Balanced Explainer
              </span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300">
                6-9s Flow
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-tight text-zinc-400">
              Steady pacing with clean image-text cards, quotes &amp; smooth narrative transitions.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handlePacingChange("cinema")}
            className={`p-2.5 rounded-xl border text-left transition ${
              activePacing === "cinema"
                ? "border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400/30"
                : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown className="h-3 w-3 text-purple-400" /> Cinema Storytelling
              </span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300">
                10-14s Arcs
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-tight text-zinc-400">
              Deep emotional narrative arcs, slow zooms &amp; cinematic ambient pauses.
            </p>
          </button>
        </div>

        {/* AI Assets Matching & SFX Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="h-3.5 w-3.5" />
            </span>
            <div className="text-[11px] text-zinc-300 leading-tight">
              <span className="font-bold text-white">60+ Curated Library Images</span>
              <p className="text-[10px] text-zinc-400">
                Semantic matching: AI, Business, Tech, Money, Mindset &amp; Growth.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Volume2 className="h-3.5 w-3.5" />
              </span>
              <div className="text-[11px] text-zinc-300 leading-tight">
                <span className="font-bold text-white">Sonic SFX Design</span>
                <p className="text-[10px] text-zinc-400">
                  Auto Rise, Pop, Chime &amp; Woosh on transitions
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enableSFX}
              onClick={() => setEnableSFX(!enableSFX)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableSFX ? "bg-amber-400" : "bg-zinc-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                  enableSFX ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: Live Interactive 16:9 Canvas Preview ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
            Real-Time 16:9 Canvas Monitor
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">1920 &times; 1080 (30 FPS)</span>
        </div>

        <div
          className="relative aspect-video w-full rounded-2xl p-5 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300"
          style={{
            background: activeTile.previewBg,
            color: activeTile.contrastColor,
          }}
        >
          {/* Top Bar inside Canvas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
                style={{
                  backgroundColor: activeTile.contrastColor === "#0F172A" || activeTile.contrastColor === "#1C1917" ? "#0F172A" : "rgba(255,255,255,0.15)",
                  color: activeTile.contrastColor === "#0F172A" || activeTile.contrastColor === "#1C1917" ? "#FFFFFF" : "#FFFFFF",
                }}
              >
                CHAPTER 01 &bull; HOOK
              </span>
              <span className="text-[10px] font-semibold opacity-75">
                ✦ AI SCENE DIRECTED
              </span>
            </div>

            <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-bold uppercase tracking-wider">
              <span>{activeTile.name}</span>
            </div>
          </div>

          {/* Center Content: Headline & Subheading */}
          <div className="space-y-2 my-auto max-w-2xl">
            <h2
              className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.15]"
              style={{ fontFamily: headingFont }}
            >
              HOW AI AUTOMATION IS REPLACING 10-HOUR EDITING WORKFLOWS
            </h2>
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90"
              style={{ fontFamily: subheadingFont }}
            >
              ✦ Synced Narrative Beats &bull; Curated Cloudinary ChatGPT Library Assets
            </p>
          </div>

          {/* Bottom Bar: Word-Synced Subtitle Strip Preview */}
          {enableCaptions ? (
            <div className="flex items-center justify-between border-t border-black/10 pt-2.5 mt-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400 text-zinc-950">
                  <Captions className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span
                  className="text-xs sm:text-sm font-bold tracking-normal opacity-95"
                  style={{ fontFamily: bodyFont }}
                >
                  &ldquo;Convert up to <span className="underline decoration-amber-400 decoration-2 underline-offset-2 font-black">20 minutes</span> of speech into documentary reels.&rdquo;
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 hidden sm:inline">
                Groq Whisper Sync
              </span>
            </div>
          ) : (
            <div className="text-[10px] opacity-60 text-right">
              Subtitles disabled &bull; Hero visual focus
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 6: Word-Synced Bottom Captions Toggle ── */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/25">
              <Captions size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                Word-Synced Bottom Captions
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-400/30">
                  Groq Whisper Strip
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-zinc-400 leading-normal">
                Narration voiceover ke sath word-by-word synced subtitle strip 16:9 video ke bottom me dikhayein (English &amp; Roman Hinglish).
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enableCaptions}
            onClick={() => setEnableCaptions?.(!enableCaptions)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enableCaptions ? "bg-amber-400" : "bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                enableCaptions ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
