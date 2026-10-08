"use client";

import React from "react";
import { Sparkles, Flame, Zap, Award, Film } from "lucide-react";

export interface QuickViralStyle {
  key: string;
  name: string;
  badge: string;
  category: string;
  accentColor: string;
  sampleText: string;
}

export const VIRAL_QUICK_STYLES: QuickViralStyle[] = [
  {
    key: "Hormozi Viral Pop",
    name: "Hormozi Pop",
    badge: "Viral #1",
    category: "High Retention",
    accentColor: "#A3E635",
    sampleText: "VIRAL POP",
  },
  {
    key: "MrBeast Shorts Impact",
    name: "MrBeast Impact",
    badge: "Trending",
    category: "Bold Punch",
    accentColor: "#FACC15",
    sampleText: "BOLD IMPACT",
  },
  {
    key: "Creator 3",
    name: "Submagic Glow",
    badge: "Neon",
    category: "Radiant Glow",
    accentColor: "#FF8F00",
    sampleText: "SUBMAGIC GLOW",
  },
  {
    key: "Ali Abdaal Clean Pill",
    name: "Ali Abdaal Clean",
    badge: "Clean",
    category: "Minimal Pill",
    accentColor: "#38BDF8",
    sampleText: "Minimal Clean",
  },
  {
    key: "Discipline Red",
    name: "Cyber Crimson",
    badge: "Urgent",
    category: "Action Wipe",
    accentColor: "#EF4444",
    sampleText: "ACTION RED",
  },
  {
    key: "Spark Glow",
    name: "Gold Spark",
    badge: "Luxury",
    category: "Golden Radiant",
    accentColor: "#FFA726",
    sampleText: "GOLD LUXURY",
  },
];

interface AutoCaptionQuickStylesDockProps {
  selectedPresetKey: string;
  onSelectPreset: (presetKey: string) => void;
}

export function AutoCaptionQuickStylesDock({
  selectedPresetKey,
  onSelectPreset,
}: AutoCaptionQuickStylesDockProps) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#0E1526]/90 p-3.5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <Flame size={14} className="text-[#FF6D00] animate-bounce" />
          <span className="text-[11px] font-black uppercase tracking-wider text-white">
            1-Click Viral Preset Dock
          </span>
        </div>
        <span className="text-[10px] font-bold text-zinc-400">
          Fast Select
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {VIRAL_QUICK_STYLES.map((style) => {
          const isSelected = selectedPresetKey === style.key;

          return (
            <button
              key={style.key}
              type="button"
              onClick={() => onSelectPreset(style.key)}
              className={`relative flex flex-col justify-between p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-[#151E30] border-[#FF6D00] shadow-lg shadow-[#FF6D00]/20 ring-1 ring-[#FF6D00]"
                  : "bg-[#070B14]/60 border-white/10 hover:border-white/25 hover:bg-[#151E30]/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  style={{ color: style.accentColor }}
                  className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10"
                >
                  {style.badge}
                </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-[#FF6D00] animate-ping" />
                )}
              </div>

              <div className="my-1">
                <span className="text-xs font-black text-white block truncate">
                  {style.name}
                </span>
                <span className="text-[10px] text-zinc-400 block truncate">
                  {style.category}
                </span>
              </div>

              <div
                style={{ borderColor: isSelected ? style.accentColor : "rgba(255,255,255,0.1)" }}
                className="mt-1 pt-1 border-t flex items-center justify-center text-center"
              >
                <span
                  style={{ color: style.accentColor }}
                  className="text-[10px] font-extrabold tracking-tight truncate drop-shadow-sm"
                >
                  {style.sampleText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
