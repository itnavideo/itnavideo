"use client";

import React, { useMemo, useState } from "react";
import { Check, Captions, Tv, Wand2, Layers, Film, Search } from "lucide-react";
import { FACELESS_FONT_CATALOG } from "../../lib/fonts/facelessFontCatalog";

export type FacelessFontOption = string;

export const CURATED_FACELESS_FONTS = FACELESS_FONT_CATALOG.map(({ family }) => ({
  id: family,
  label: family,
  role: 'Locally hosted Google Font',
  tag: 'LATIN',
}));
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
    cloudinaryUrl: "https://storage.googleapis.com/itnavideo-media-assets/warm-off-white-cream-texture-f4f4f9_isou0y.png",
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

export interface VideoStyleOption {
  id: string;
  name: string;
  desc: string;
  themeId: string;
  headingFont: FacelessFontOption;
  subheadingFont: FacelessFontOption;
  bodyFont: FacelessFontOption;
  pacing: "dynamic" | "balanced" | "cinema";
}

export const VIDEO_STYLE_OPTIONS: VideoStyleOption[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    desc: "Dramatic & Editorial",
    themeId: "velvet-wine",
    headingFont: "Playfair Display",
    subheadingFont: "Montserrat",
    bodyFont: "Inter",
    pacing: "cinema",
  },
  {
    id: "clean",
    name: "Clean",
    desc: "Minimal & Modern",
    themeId: "studio-white",
    headingFont: "Plus Jakarta Sans",
    subheadingFont: "Poppins",
    bodyFont: "Inter",
    pacing: "balanced",
  },
  {
    id: "documentary",
    name: "Documentary",
    desc: "Classic Storytelling",
    themeId: "midnight-obsidian",
    headingFont: "Montserrat",
    subheadingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    pacing: "dynamic",
  },
  {
    id: "dynamic",
    name: "Dynamic",
    desc: "Fast Paced & Kinetic",
    themeId: "charcoal-slate",
    headingFont: "Space Grotesk",
    subheadingFont: "Outfit",
    bodyFont: "Inter",
    pacing: "dynamic",
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
  onMotionIntensityChange?: (pacing: string) => void;
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
  onMotionIntensityChange,
}: FacelessVideoStyleControlsProps) {
  const [internalPacing, setInternalPacing] = useState<"dynamic" | "balanced" | "cinema">(aiPacing);
  const [enableSFX, setEnableSFX] = useState<boolean>(true);
  const [textStyle, setTextStyle] = useState<"clean" | "bold" | "cinematic" | "modern">("bold");
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [fontRole, setFontRole] = useState<"heading" | "supporting">("heading");
  const [fontSearch, setFontSearch] = useState("");
  const visibleFontOptions = useMemo(() => {
    const query = fontSearch.trim().toLowerCase();
    return FACELESS_FONT_CATALOG.filter((font) => !query || font.family.toLowerCase().includes(query));
  }, [fontSearch]);
  const selectedFont = fontRole === "heading" ? headingFont : bodyFont;
  const selectFont = (family: string) => {
    if (fontRole === "heading") {
      setHeadingFont(family);
      return;
    }
    setSubheadingFont(family);
    setBodyFont(family);
  };

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

  const handleApplyPreset = (style: VideoStyleOption) => {
    setSelectedBackgroundTheme(style.themeId);
    const tile = CANVA_BACKGROUND_TILES.find((t) => t.id === style.themeId);
    if (setSelectedBackgroundUrl) {
      setSelectedBackgroundUrl(tile?.cloudinaryUrl || "");
    }
    setHeadingFont(style.headingFont);
    setSubheadingFont(style.subheadingFont);
    setBodyFont(style.bodyFont);
    handlePacingChange(style.pacing);
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
              Faceless Video
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Turn your narration into a complete faceless video with AI-generated visuals, typography, music and sound effects.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
            <Tv className="h-3 w-3" /> 16:9 Widescreen
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25">
            <Captions className="h-3 w-3" /> Captions: ON
          </span>
        </div>
      </div>

      {/* ── SECTION 1: Video Style Selector ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Step 1 &bull; Video Style
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">Cinematic &bull; Clean &bull; Documentary &bull; Dynamic</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VIDEO_STYLE_OPTIONS.map((style) => {
            const isMatch =
              selectedBackgroundTheme === style.themeId &&
              headingFont === style.headingFont;

            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  const targetTile = CANVA_BACKGROUND_TILES.find((t) => t.id === style.themeId) || CANVA_BACKGROUND_TILES[0];
                  handleSelectBackground(targetTile);
                  setHeadingFont(style.headingFont);
                  setSubheadingFont(style.subheadingFont);
                  setBodyFont(style.bodyFont);
                  if (onMotionIntensityChange) {
                    onMotionIntensityChange(style.pacing === "cinema" ? "ambient" : style.pacing);
                  }
                }}
                className={`group relative flex flex-col justify-between p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isMatch
                    ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]"
                    : "border-white/10 bg-zinc-900/60 hover:border-white/25 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {style.name}
                  </h4>
                  {isMatch && <Check className="h-3.5 w-3.5 text-amber-400" strokeWidth={3} />}
                </div>
                <p className="mt-1 text-[10px] text-zinc-400 leading-tight">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>










      {/* ── FONT LIBRARY ── */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white">Font library</h4>
            <p className="mt-1 text-xs text-zinc-400">{FACELESS_FONT_CATALOG.length} downloaded fonts · Latin character support</p>
          </div>
          <button
            type="button"
            aria-expanded={fontPanelOpen}
            onClick={() => setFontPanelOpen((open) => !open)}
            className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200 transition active:scale-95 hover:border-amber-300/60"
          >
            {fontPanelOpen ? "Close fonts" : "Choose fonts"}
          </button>
        </div>

        {fontPanelOpen ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
            <style>{FACELESS_FONT_CATALOG.map(({ family, assetPath }) => '@font-face{font-family:"' + family + '";src:url("/' + assetPath + '") format("woff2");font-style:normal;font-weight:400;font-display:swap}').join("\n")}</style>
            <div className="flex flex-wrap gap-2" aria-label="Font role">
              {[
                { id: "heading" as const, label: "Heading", value: headingFont },
                { id: "supporting" as const, label: "Supporting text", value: bodyFont },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  aria-pressed={fontRole === role.id}
                  onClick={() => setFontRole(role.id)}
                  className={fontRole === role.id ? "rounded-full border border-amber-400/60 bg-amber-400/15 px-3.5 py-2 text-xs font-bold text-amber-200 transition active:scale-95" : "rounded-full border border-white/10 bg-zinc-950 px-3.5 py-2 text-xs font-bold text-zinc-300 transition active:scale-95 hover:border-white/25"}
                >
                  {role.label}<span className="ml-1.5 font-medium text-zinc-400">· {role.value}</span>
                </button>
              ))}
            </div>

            <label className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={fontSearch}
                onChange={(event) => setFontSearch(event.target.value)}
                placeholder={"Search " + FACELESS_FONT_CATALOG.length + " fonts"}
                aria-label="Search font families"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15"
              />
            </label>

            <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {visibleFontOptions.slice(0, 18).map((font) => {
                const isSelected = selectedFont === font.family;
                return (
                  <button
                    key={font.family}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectFont(font.family)}
                    className={isSelected ? "flex items-center justify-between gap-3 rounded-2xl border border-amber-400/60 bg-amber-400/10 px-3 py-2.5 text-left text-white transition active:scale-[0.99]" : "flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-2.5 text-left text-zinc-200 transition active:scale-[0.99] hover:border-white/25"}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold" style={{ fontFamily: '"' + font.family + '", sans-serif' }}>{font.family}</span>
                      <span className="mt-0.5 block text-[10px] text-zinc-500" style={{ fontFamily: '"' + font.family + '", sans-serif' }}>Finance education</span>
                    </span>
                    <span className="shrink-0 text-xl font-bold" style={{ fontFamily: '"' + font.family + '", sans-serif' }}>Aa</span>
                  </button>
                );
              })}
              {visibleFontOptions.length === 0 ? (
                <p className="col-span-full rounded-xl border border-dashed border-white/10 px-3 py-5 text-center text-sm text-zinc-400">No fonts match that search.</p>
              ) : null}
            </div>
            {visibleFontOptions.length > 18 ? (
              <p className="text-center text-[11px] text-zinc-500">Showing 18 of {visibleFontOptions.length}. Search to narrow the list.</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
            Text Style
          </label>
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
            Automated Typography
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "clean", label: "Clean", desc: "Minimalist sans-serif hierarchy" },
            { id: "bold", label: "Bold", desc: "High-impact punchy headers" },
            { id: "cinematic", label: "Cinematic", desc: "Elegant tracked serif titles" },
            { id: "modern", label: "Modern", desc: "Sharp geometric tech aesthetic" },
          ].map((txt) => {
            const active = textStyle === txt.id;
            return (
              <button
                key={txt.id}
                type="button"
                onClick={() => setTextStyle(txt.id as any)}
                className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                  active
                    ? "border-amber-400 bg-amber-400/10 text-white font-bold ring-2 ring-amber-400/20"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white"
                }`}
              >
                <p className="text-xs font-bold leading-tight">{txt.label}</p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">{txt.desc}</p>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-zinc-400 italic pt-0.5">
          Selected font families control the heading and supporting text; AI still adapts size, placement, animation, color and hierarchy.
        </p>
      </div>
    </div>
  );
}
