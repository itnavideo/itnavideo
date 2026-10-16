"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  Check,
  Film,
  Layers,
  Palette,
  Eye,
  Trash2,
  Tv,
} from "lucide-react";
import {
  BACKGROUND_CATALOG,
  BACKGROUND_CATEGORIES,
  type BackgroundCategory,
  type BackgroundItem,
} from "@/remotion/components/backgrounds/BackgroundCatalog";

export interface BackgroundPickerProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
  customBgUrl?: string;
  onCustomBgUrlChange?: (url: string) => void;
  onCustomFileSelect?: (file: File | null) => void;
}

export function BackgroundPicker({
  selectedTheme = "midnight-mesh",
  onSelectTheme,
  customBgUrl = "",
  onCustomBgUrlChange,
  onCustomFileSelect,
}: BackgroundPickerProps) {
  const [activeCategory, setActiveCategory] = useState<BackgroundCategory>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter catalog
  const filteredBackgrounds = BACKGROUND_CATALOG.filter((bg) => {
    if (activeCategory === "all") return true;
    return bg.category === activeCategory;
  });

  const activeBackground =
    BACKGROUND_CATALOG.find((b) => b.id === selectedTheme) ||
    BACKGROUND_CATALOG[0];

  // Handle custom upload file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onCustomBgUrlChange?.(localUrl);
      onCustomFileSelect?.(file);
      onSelectTheme("custom-upload");
    }
  };

  const handleRemoveCustomBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCustomBgUrlChange?.("");
    onCustomFileSelect?.(null);
    if (selectedTheme === "custom-upload") {
      onSelectTheme("midnight-mesh");
    }
  };

  // Helper to render mini live CSS/SVG previews inside card
  const renderCardPreview = (bg: BackgroundItem, isHovered: boolean) => {
    if (bg.id === "custom-upload" && customBgUrl) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{
            backgroundImage: `url(${customBgUrl})`,
            transform: isHovered ? "scale(1.05)" : "scale(1.0)",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      );
    }

    // Gradient previews
    if (bg.id === "midnight-mesh") {
      return (
        <div className="absolute inset-0 bg-[#05070E] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              background: `
                radial-gradient(circle at ${isHovered ? "60% 40%" : "50% 50%"}, rgba(30, 27, 75, 0.9) 0%, transparent 65%),
                radial-gradient(circle at ${isHovered ? "80% 70%" : "70% 80%"}, rgba(255, 87, 34, 0.35) 0%, transparent 55%),
                radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.25) 0%, transparent 50%)
              `,
              transform: isHovered ? "scale(1.08)" : "scale(1.0)",
            }}
          />
        </div>
      );
    }

    if (bg.id === "aurora-borealis") {
      return (
        <div className="absolute inset-0 bg-[#020B14] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              background: `
                radial-gradient(circle at ${isHovered ? "35% 25%" : "25% 35%"}, rgba(16, 185, 129, 0.5) 0%, transparent 60%),
                radial-gradient(circle at ${isHovered ? "70% 65%" : "80% 75%"}, rgba(6, 182, 212, 0.45) 0%, transparent 60%)
              `,
              transform: isHovered ? "scale(1.06)" : "scale(1.0)",
            }}
          />
        </div>
      );
    }

    if (bg.id === "sunset-horizon") {
      return (
        <div className="absolute inset-0 bg-[#0A0503] overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `
                radial-gradient(ellipse 90% 60% at 50% ${isHovered ? "40%" : "50%"}, rgba(255, 87, 34, 0.55) 0%, rgba(255, 160, 0, 0.3) 45%, transparent 75%),
                linear-gradient(180deg, #070305 0%, #170705 100%)
              `,
            }}
          />
        </div>
      );
    }

    if (bg.id === "neon-twilight") {
      return (
        <div className="absolute inset-0 bg-[#060212] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at ${isHovered ? "60%" : "50%"} 40%, rgba(139, 92, 246, 0.5) 0%, transparent 65%),
                radial-gradient(ellipse 60% 45% at 30% 70%, rgba(37, 99, 235, 0.35) 0%, transparent 60%)
              `,
              transform: isHovered ? "scale(1.06)" : "scale(1.0)",
            }}
          />
        </div>
      );
    }

    // Minimal previews
    if (bg.id === "studio-white") {
      return (
        <div className="absolute inset-0 bg-[#FAFAFA] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#F1F5F9_80%,#E2E8F0_100%)]" />
          <span className="relative text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Editorial White
          </span>
        </div>
      );
    }

    if (bg.id === "dark-paper") {
      return (
        <div
          className="absolute inset-0 bg-[#0C0E14]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 16px 16px, 16px 16px",
          }}
        />
      );
    }

    if (bg.id === "deep-slate") {
      return (
        <div className="absolute inset-0 bg-[#0B0F19] bg-[radial-gradient(circle_at_50%_45%,#111827_0%,#0B0F19_75%,#05080F_100%)]" />
      );
    }

    if (bg.id === "studio-dark") {
      return (
        <div className="absolute inset-0 bg-[#070B14] bg-[radial-gradient(circle_at_50%_40%,rgba(30,41,59,0.5)_0%,#070B14_70%,#030509_100%)]" />
      );
    }

    // Tech previews
    if (bg.id === "cyber-grid") {
      return (
        <div className="absolute inset-0 bg-[#050811] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
              transform: isHovered ? "translateY(-6px)" : "none",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.2)_0%,transparent_70%)]" />
        </div>
      );
    }

    if (bg.id === "matrix-dots") {
      return (
        <div className="absolute inset-0 bg-[#040812] overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id={`dot-pat-${bg.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="9" cy="9" r="1.3" fill={isHovered ? "rgba(6, 182, 212, 0.45)" : "rgba(6, 182, 212, 0.25)"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dot-pat-${bg.id})`} />
          </svg>
        </div>
      );
    }

    if (bg.id === "neon-scanlines") {
      return (
        <div className="absolute inset-0 bg-[#050A14] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
              backgroundSize: "100% 3px",
            }}
          />
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent transition-all duration-700"
            style={{ top: isHovered ? "80%" : "30%" }}
          />
        </div>
      );
    }

    if (bg.id === "circuit-flow") {
      return (
        <div className="absolute inset-0 bg-[#060B12] overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" className="opacity-40">
            <path
              d="M 10 30 L 70 30 L 90 60 L 150 60 L 170 30 L 220 30 M 40 80 L 110 80 L 130 50 L 200 50"
              stroke="#F59E0B"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="90" cy="60" r="2.5" fill="#F59E0B" />
            <circle cx="150" cy="60" r="2.5" fill="#F59E0B" />
          </svg>
        </div>
      );
    }

    // Cinematic previews
    if (bg.id === "dark-vignette") {
      return (
        <div className="absolute inset-0 bg-[#030508] bg-[radial-gradient(ellipse_60%_65%_at_50%_45%,#0F172A_0%,#060911_50%,#010204_100%)]" />
      );
    }

    if (bg.id === "spotlight-drama") {
      return (
        <div className="absolute inset-0 bg-[#020306] bg-[radial-gradient(ellipse_65%_85%_at_50%_0%,rgba(251,191,36,0.35)_0%,rgba(15,23,42,0.5)_55%,#020306_90%)]" />
      );
    }

    if (bg.id === "film-grain") {
      return (
        <div
          className="absolute inset-0 bg-[#0A0C10]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.6) 0%, #050608 85%),
              repeating-radial-gradient(circle at 17% 32%, rgba(255, 255, 255, 0.04) 0px, transparent 1px, rgba(0, 0, 0, 0.05) 2px)
            `,
          }}
        />
      );
    }

    if (bg.id === "noir-monochrome") {
      return (
        <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(circle_at_50%_40%,#18181B_0%,#09090B_60%,#000000_100%)]" />
      );
    }

    // Nature / Calm previews
    if (bg.id === "flowing-waves") {
      return (
        <div className="absolute inset-0 bg-[#040D1A] overflow-hidden">
          <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full">
            <path
              d={isHovered ? "M 0 65 Q 50 50 100 65 T 200 65 L 200 120 L 0 120 Z" : "M 0 70 Q 50 80 100 70 T 200 70 L 200 120 L 0 120 Z"}
              fill="rgba(14, 165, 233, 0.25)"
              className="transition-all duration-700"
            />
            <path
              d={isHovered ? "M 0 85 Q 50 75 100 85 T 200 85 L 200 120 L 0 120 Z" : "M 0 80 Q 50 90 100 80 T 200 80 L 200 120 L 0 120 Z"}
              fill="rgba(6, 182, 212, 0.35)"
              className="transition-all duration-700"
            />
          </svg>
        </div>
      );
    }

    if (bg.id === "organic-blobs") {
      return (
        <div className="absolute inset-0 bg-[#0D0814] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              background: `
                radial-gradient(circle at 45% 50%, rgba(251, 146, 60, 0.35) 0%, transparent 60%),
                radial-gradient(circle at 65% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 55%)
              `,
              transform: isHovered ? "scale(1.08)" : "scale(1.0)",
            }}
          />
        </div>
      );
    }

    if (bg.id === "zen-ripples") {
      return (
        <div className="absolute inset-0 bg-[#040C12] flex items-center justify-center overflow-hidden">
          <div className="w-16 h-16 rounded-full border border-emerald-400/20" />
          <div className="absolute w-28 h-28 rounded-full border border-emerald-400/15" />
          <div className="absolute w-40 h-40 rounded-full border border-emerald-400/10" />
        </div>
      );
    }

    if (bg.id === "calm-ocean") {
      return (
        <div className="absolute inset-0 bg-[#020E1C] bg-[radial-gradient(ellipse_90%_60%_at_50%_30%,#03284C_0%,transparent_70%)]" />
      );
    }

    // Particles previews
    if (bg.id === "floating-dots" || bg.id === "bokeh-orbs" || bg.id === "starry-cosmos" || bg.id === "cyber-sparks") {
      const isBokeh = bg.id === "bokeh-orbs";
      const isCosmos = bg.id === "starry-cosmos";

      return (
        <div className="absolute inset-0 bg-[#070A12] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: isCosmos
                ? "radial-gradient(circle at 65% 30%, rgba(129, 140, 248, 0.25) 0%, transparent 60%), #020308"
                : "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.16) 0%, #070A12 70%)",
            }}
          />
          {/* Sample floating particle nodes */}
          <div
            className="absolute rounded-full transition-transform duration-700"
            style={{
              width: isBokeh ? "22px" : "4px",
              height: isBokeh ? "22px" : "4px",
              top: isHovered ? "20%" : "35%",
              left: "25%",
              background: isCosmos ? "#FFFFFF" : "#FFA000",
              opacity: isBokeh ? 0.35 : 0.7,
            }}
          />
          <div
            className="absolute rounded-full transition-transform duration-700"
            style={{
              width: isBokeh ? "18px" : "3px",
              height: isBokeh ? "18px" : "3px",
              top: isHovered ? "45%" : "60%",
              left: "70%",
              background: isCosmos ? "#818CF8" : "#FF5722",
              opacity: isBokeh ? 0.35 : 0.6,
            }}
          />
          <div
            className="absolute rounded-full transition-transform duration-700"
            style={{
              width: isBokeh ? "26px" : "5px",
              height: isBokeh ? "26px" : "5px",
              top: isHovered ? "65%" : "80%",
              left: "45%",
              background: isCosmos ? "#E0E7FF" : "#F59E0B",
              opacity: isBokeh ? 0.4 : 0.8,
            }}
          />
        </div>
      );
    }

    // Fallback Custom
    return (
      <div className="absolute inset-0 bg-[#0B0F19] flex items-center justify-center p-3 text-center">
        <Upload size={18} className="text-zinc-500" />
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 sm:p-6 shadow-xl space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
            <Palette size={14} />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Video Background Theme
            </h3>
            <p className="text-xs text-zinc-400">
              Code-based backgrounds render lightning-fast on Lambda, stay sharp at 1080p, and dynamically pop your titles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300">
            {activeBackground.name}
          </span>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {BACKGROUND_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── BACKGROUND CARDS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
        {/* Custom Upload Card (Shown in All or Custom category) */}
        {(activeCategory === "all" || activeCategory === "custom") && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setHoveredCardId("custom-upload")}
            onMouseLeave={() => setHoveredCardId(null)}
            className={`group relative rounded-xl border p-2.5 text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
              selectedTheme === "custom-upload"
                ? "border-orange-500 bg-[#161C2E] ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20"
                : "border-white/10 bg-[#121624] hover:border-white/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 16:9 Preview Window */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-[#070B14]">
              {customBgUrl ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${customBgUrl})` }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCustomBg}
                    className="absolute top-1.5 right-1.5 z-10 rounded-md bg-black/75 p-1 text-zinc-400 hover:text-red-400 transition"
                    title="Remove custom backdrop"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 text-center text-zinc-400 group-hover:text-white transition">
                  <Upload size={18} className="text-[#FFA000]" />
                  <span className="text-[10px] font-bold">Upload Custom File</span>
                </div>
              )}

              {selectedTheme === "custom-upload" && (
                <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-white shadow-md">
                  <Check size={11} strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">
                {customBgUrl ? "Custom Upload" : "Upload Own File"}
              </span>
              <span className="rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-orange-400">
                User
              </span>
            </div>
          </div>
        )}

        {/* Catalog Background Cards */}
        {filteredBackgrounds
          .filter((bg) => bg.id !== "custom-upload")
          .map((bg) => {
            const isSelected = selectedTheme === bg.id;
            const isHovered = hoveredCardId === bg.id;

            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => onSelectTheme(bg.id)}
                onMouseEnter={() => setHoveredCardId(bg.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`group relative rounded-xl border p-2.5 text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "border-orange-500 bg-[#161C2E] ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20"
                    : "border-white/10 bg-[#121624] hover:border-white/20"
                }`}
              >
                {/* 16:9 Live Preview Window */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-[#070B14]">
                  {renderCardPreview(bg, isHovered)}

                  {/* Selected checkmark badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-white shadow-md">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}

                  {/* Subtle live hover pill */}
                  <div className="absolute bottom-1 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="rounded-sm bg-black/70 px-1 py-0.5 text-[8px] font-mono text-zinc-300">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="mt-2.5 flex items-center justify-between w-full min-w-0">
                  <p className="text-xs font-bold text-white truncate max-w-[110px]">
                    {bg.name}
                  </p>
                  <span className="shrink-0 rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300">
                    {bg.tag}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      {/* ── LIVE MINI PREVIEW PANEL (16:9 Widescreen Frame with Headline Overlay) ── */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-[#FFA000]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Background Mockup Preview
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {activeBackground.name} · {activeBackground.category.toUpperCase()}
          </span>
        </div>

        {/* 16:9 Widescreen Mockup Stage */}
        <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/15 bg-[#070B14] shadow-2xl flex items-center justify-center">
          {/* Live Background Render */}
          {renderCardPreview(activeBackground, true)}

          {/* Headline & Subtitle Simulation */}
          <div className="relative z-10 text-center px-6 max-w-lg space-y-2 pointer-events-none">
            <span className="inline-block rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 backdrop-blur-xs">
              AI Explainer Simulation
            </span>

            <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight drop-shadow-md leading-snug">
              HOW THE GLOBAL RACE CHANGED EVERYTHING
            </h3>

            {/* Yellow Netflix Subtitle Simulation */}
            <div className="inline-block rounded-md bg-black/80 border border-white/10 px-3 py-1 backdrop-blur-xs">
              <span className="text-xs sm:text-sm font-black text-[#FDE047] tracking-wide">
                UNCOVERING THE LOST SECRET
              </span>
            </div>
          </div>

          {/* Telemetry coordinate watermark */}
          <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-white/20 tracking-widest pointer-events-none">
            1920×1080 // 30 FPS
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundPicker;
