"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Type, Palette, Sparkles, Check, Film, Eye } from "lucide-react";
import backgroundPresetsData from "@/lib/cloudinary/background-presets.json";

export type HeadingFontOption =
  | "Plus Jakarta Sans"
  | "Montserrat"
  | "Bebas Neue"
  | "Playfair Display"
  | "Cinzel"
  | "Syne"
  | "Anton"
  | "Poppins"
  | "Oswald"
  | "Archivo Black"
  | "Barlow Condensed"
  | "Space Grotesk"
  | "League Spartan"
  | "Teko"
  | "Bodoni Moda"
  | "Tenor Sans"
  | "Marcellus"
  | "Inter"
  | "Roboto";

export type TypographyFontOption =
  | "Plus Jakarta Sans"
  | "Inter"
  | "Roboto"
  | "Montserrat"
  | "Poppins"
  | "Space Grotesk"
  | "JetBrains Mono"
  | "IBM Plex Mono"
  | "Fira Code"
  | "Barlow Condensed"
  | "Oswald"
  | "Kalam"
  | "Caveat"
  | "Patrick Hand"
  | "Rubik";

export const HEADING_FONTS: { id: HeadingFontOption; label: string }[] = [
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Bold)" },
  { id: "Montserrat", label: "Montserrat (Heavy)" },
  { id: "Bebas Neue", label: "Bebas Neue (Poster Caps)" },
  { id: "Anton", label: "Anton (Impactful Heavy)" },
  { id: "Poppins", label: "Poppins (Modern Bold)" },
  { id: "Oswald", label: "Oswald (Condensed)" },
  { id: "Archivo Black", label: "Archivo Black (Block)" },
  { id: "Barlow Condensed", label: "Barlow Condensed (Punchy)" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech)" },
  { id: "League Spartan", label: "League Spartan (Bold)" },
  { id: "Teko", label: "Teko (Narrow High-Contrast)" },
  { id: "Playfair Display", label: "Playfair Display (Classy Luxury)" },
  { id: "Cinzel", label: "Cinzel (Royal Serif)" },
  { id: "Bodoni Moda", label: "Bodoni Moda (Editorial)" },
  { id: "Tenor Sans", label: "Tenor Sans (Clean)" },
  { id: "Marcellus", label: "Marcellus (Classic Serif)" },
  { id: "Syne", label: "Syne (Avantgarde)" },
  { id: "Inter", label: "Inter (Clean Pro)" },
  { id: "Roboto", label: "Roboto (Standard Heavy)" },
];

export const TYPOGRAPHY_FONTS: { id: TypographyFontOption; label: string }[] = [
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Recommended)" },
  { id: "Inter", label: "Inter Clean" },
  { id: "Roboto", label: "Roboto Standard" },
  { id: "Montserrat", label: "Montserrat Modern" },
  { id: "Poppins", label: "Poppins Bold & Clean" },
  { id: "Space Grotesk", label: "Space Grotesk Tech" },
  { id: "JetBrains Mono", label: "JetBrains Mono Code" },
  { id: "IBM Plex Mono", label: "IBM Plex Mono Typewriter" },
  { id: "Fira Code", label: "Fira Code Monospace" },
  { id: "Barlow Condensed", label: "Barlow Condensed" },
  { id: "Oswald", label: "Oswald Narrow" },
  { id: "Kalam", label: "Kalam Handwriting" },
  { id: "Caveat", label: "Caveat Cursive" },
  { id: "Patrick Hand", label: "Patrick Hand Casual" },
  { id: "Rubik", label: "Rubik Rounded" },
];

export type BackgroundPreset = {
  id: string;
  name: string;
  type: "solid" | "gradient";
  swatch: string;
  contrast: string;
  url: string;
  public_id: string;
  width: number;
  height: number;
};

export const SOLID_BACKGROUNDS: BackgroundPreset[] = (backgroundPresetsData.solidColours || []) as BackgroundPreset[];
export const GRADIENT_BACKGROUNDS: BackgroundPreset[] = (backgroundPresetsData.gradientColours || []) as BackgroundPreset[];
export const ALL_BACKGROUNDS: BackgroundPreset[] = [...SOLID_BACKGROUNDS, ...GRADIENT_BACKGROUNDS];

export interface VideoStyleControlsProps {
  headingFont: HeadingFontOption;
  setHeadingFont: (font: HeadingFontOption) => void;
  typographyFont: TypographyFontOption;
  setTypographyFont: (font: TypographyFontOption) => void;
  selectedBackgroundTheme: string;
  setSelectedBackgroundTheme: (themeId: string) => void;
  selectedBackgroundUrl?: string;
  setSelectedBackgroundUrl?: (url: string) => void;
}

export function VideoStyleControls({
  headingFont,
  setHeadingFont,
  typographyFont,
  setTypographyFont,
  selectedBackgroundTheme,
  setSelectedBackgroundTheme,
  selectedBackgroundUrl,
  setSelectedBackgroundUrl,
}: VideoStyleControlsProps) {
  // Find current active preset by id or url
  const activePreset = useMemo(() => {
    return (
      ALL_BACKGROUNDS.find(
        (bg) =>
          bg.id === selectedBackgroundTheme ||
          bg.url === selectedBackgroundUrl ||
          bg.url === selectedBackgroundTheme ||
          bg.public_id === selectedBackgroundTheme
      ) || SOLID_BACKGROUNDS[0] || ALL_BACKGROUNDS[0]
    );
  }, [selectedBackgroundTheme, selectedBackgroundUrl]);

  const handleSelectBackground = (preset: BackgroundPreset) => {
    setSelectedBackgroundTheme(preset.id);
    if (setSelectedBackgroundUrl) {
      setSelectedBackgroundUrl(preset.url);
    }
  };

  return (
    <div className="w-full space-y-5 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Video Style & Background Customization</h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            {ALL_BACKGROUNDS.length} Cloudinary Assets • 19 Fonts
          </span>
        </div>
      </div>

      {/* Typography Font Dropdowns */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Heading Font Select */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Type className="h-3.5 w-3.5 text-amber-400" /> Heading & Title Font
          </label>
          <select
            value={headingFont}
            onChange={(e) => setHeadingFont(e.target.value as HeadingFontOption)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/90 p-2.5 text-xs sm:text-sm font-semibold text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-sm"
          >
            {HEADING_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Body Subtitle Font Select */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Type className="h-3.5 w-3.5 text-cyan-400" /> Body Subtitle Font
          </label>
          <select
            value={typographyFont}
            onChange={(e) => setTypographyFont(e.target.value as TypographyFontOption)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/90 p-2.5 text-xs sm:text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-sm"
          >
            {TYPOGRAPHY_FONTS.map((tf) => (
              <option key={tf.id} value={tf.id}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Canva-Style Background Section */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Background Canvas Colours
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Click circle to apply & preview</span>
        </div>

        {/* 2-Column Responsive Layout: Swatches on Left, Live Canvas on Right */}
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          {/* Left Column: Canva Swatch Groups */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Default Solid Colours */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎨</span>
                  <span className="text-xs font-bold text-zinc-200">Default solid colours</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{SOLID_BACKGROUNDS.length} colours</span>
              </div>

              {/* Circular Swatches Grid */}
              <div className="flex flex-wrap gap-2.5">
                {SOLID_BACKGROUNDS.map((bg) => {
                  const isSelected = activePreset.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleSelectBackground(bg)}
                      title={`${bg.name} (Solid)`}
                      aria-label={bg.name}
                      style={{ background: bg.swatch }}
                      className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-150 hover:scale-110 shadow-sm ${
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110 z-10 shadow-lg"
                          : "border border-white/20 hover:border-white/60 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          strokeWidth={3.5}
                          style={{ color: bg.contrast }}
                          className="drop-shadow-sm"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Default Gradient Colours */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔲</span>
                  <span className="text-xs font-bold text-zinc-200">Default gradient colours</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{GRADIENT_BACKGROUNDS.length} gradients</span>
              </div>

              {/* Circular Gradient Swatches Grid */}
              <div className="flex flex-wrap gap-2.5">
                {GRADIENT_BACKGROUNDS.map((bg) => {
                  const isSelected = activePreset.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleSelectBackground(bg)}
                      title={`${bg.name} (Gradient)`}
                      aria-label={bg.name}
                      style={{ background: bg.swatch }}
                      className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-150 hover:scale-110 shadow-sm ${
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110 z-10 shadow-lg"
                          : "border border-white/20 hover:border-white/60 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          strokeWidth={3.5}
                          style={{ color: bg.contrast }}
                          className="drop-shadow-sm"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Canva-Style Background Preview Frame */}
          <div className="lg:col-span-5 rounded-xl border border-white/10 bg-zinc-900/70 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Canvas Preview</span>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider">
                ✓ Full video background
              </span>
            </div>

            {/* Video Canvas Aspect Frame */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-inner group">
              {/* Actual Cloudinary background image */}
              <Image
                src={activePreset.url}
                alt={activePreset.name}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Subtle cinematic gradient + Vox grid preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Sample Motion Typography Overlay */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white/90 border border-white/10">
                    <Film size={9} className="text-amber-400" /> SCENE 01 • CHAPTER
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white/60 bg-black/50 px-1 rounded">
                    1080p
                  </span>
                </div>

                {/* Sample Heading & Subtitle Mock with Selected Fonts */}
                <div className="space-y-1 text-center my-auto px-2">
                  <h5
                    className="text-xs sm:text-sm font-extrabold text-white drop-shadow-md leading-tight"
                    style={{ fontFamily: headingFont }}
                  >
                    AI Video Generator
                  </h5>
                  <p
                    className="text-[10px] sm:text-[11px] font-medium text-amber-300 drop-shadow line-clamp-1"
                    style={{ fontFamily: typographyFont }}
                  >
                    High-impact visuals with {activePreset.name} background
                  </p>
                </div>

                {/* Bottom Canvas Info Tag */}
                <div className="flex items-center justify-between text-[9px] text-white/70">
                  <span className="truncate max-w-[180px] font-semibold">{activePreset.name}</span>
                  <span className="capitalize font-mono">{activePreset.type}</span>
                </div>
              </div>
            </div>

            {/* Footer Details */}
            <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400">
              <span className="truncate font-medium text-zinc-300">
                Active: <strong className="text-white font-semibold">{activePreset.name}</strong>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Applied to all scenes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
