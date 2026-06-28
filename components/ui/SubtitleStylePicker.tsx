"use client";

import React from "react";

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

const PRESETS: PresetOption[] = [
  { key: "Eclipse", label: "Eclipse", style: "highlight", font: "Inter", textColor: "#FFFFFF", highlightColor: "#7C3AED" },
  { key: "Hustle", label: "Hustle", style: "bold-outline", font: "Impact", textColor: "#FFFFFF", highlightColor: "#EF4444" },
  { key: "Gold Pill", label: "Gold Pill", style: "gold-pill", font: "Arial Black", textColor: "#FFD700", highlightColor: "#FFD700", bgColor: "#000" },
  { key: "Studio Clean", label: "Studio Clean", style: "stacked", font: "Inter", textColor: "#FFFFFF", highlightColor: "#FACC15", bgColor: "#18181B" },
  { key: "One Word", label: "One Word", style: "one-word", font: "Impact", textColor: "#FFFFFF", highlightColor: "#FACC15" },
  { key: "Arctic Glow", label: "Arctic Glow", style: "neon", font: "sans-serif", textColor: "#E0F2FE", highlightColor: "#38BDF8" },
  { key: "Karaoke Fill", label: "Karaoke Fill", style: "karaoke", font: "Inter", textColor: "#FFFFFF", highlightColor: "#FFE500" },
  { key: "Shatter Drop", label: "Shatter Drop", style: "shatter", font: "Impact", textColor: "#FFFFFF", highlightColor: "#FF3D3D" },
  { key: "Pill Bounce", label: "Pill Bounce", style: "pill-bounce", font: "Inter", textColor: "#FFFFFF", highlightColor: "#FF6B35" },
  { key: "Cinematic", label: "Cinematic", style: "cinematic", font: "Georgia", textColor: "#FFFFFF", highlightColor: "#FFFFFF" },
  { key: "Hacker Type", label: "Hacker Type", style: "typewriter-code", font: "Courier New", textColor: "#00FF88", highlightColor: "#00FF88", bgColor: "#000" },
  { key: "Vollkorn", label: "Vollkorn", style: "vollkorn", font: "Georgia", textColor: "#FFFFFF", highlightColor: "#22D3EE", bgColor: "#000" },
  { key: "Midnight", label: "Midnight", style: "inline-bg", font: "Inter", textColor: "#FFFFFF", highlightColor: "#3B82F6" },
  { key: "Marigold", label: "Marigold", style: "normal", font: "Georgia", textColor: "#F59E0B", highlightColor: "#F59E0B" },
  { key: "Pop Candy", label: "Pop Candy", style: "box", font: "sans-serif", textColor: "#000", highlightColor: "#F472B6" },
  { key: "Bold Fire", label: "Bold Fire", style: "big-bold", font: "Impact", textColor: "#FFFFFF", highlightColor: "#F97316" },
  { key: "Typewriter", label: "Typewriter", style: "typewriter", font: "Courier New", textColor: "#22D3EE", highlightColor: "#22D3EE" },
  { key: "split-color", label: "Split Color", style: "split-color", font: "sans-serif", textColor: "#FFFFFF", highlightColor: "#FACC15" },
];

interface SubtitleStylePickerProps {
  value: string;
  onChange: (presetKey: string) => void;
}

export function SubtitleStylePicker({ value, onChange }: SubtitleStylePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {PRESETS.map((preset) => {
        const isActive = value === preset.key || value === preset.style;
        return (
          <button
            key={preset.key}
            type="button"
            onClick={() => onChange(preset.key)}
            className={`group relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3.5 text-center transition-all ${
              isActive
                ? "border-brand-mint/60 bg-brand-mint/[0.08] ring-1 ring-brand-mint/40"
                : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
            }`}
          >
            {isActive ? (
              <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-mint">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.5 7.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : null}
            {/* Preview swatch */}
            <div
              className="flex h-8 w-full items-center justify-center overflow-hidden rounded-lg text-[11px] font-black"
              style={{
                backgroundColor: preset.bgColor || 'rgba(0,0,0,0.6)',
                color: preset.highlightColor,
                fontFamily: preset.font,
                letterSpacing: preset.style === 'one-word' ? 2 : 0,
              }}
            >
              {preset.style === 'one-word' ? 'WORD' : 'Hello'}
            </div>
            <span className={`text-[11px] font-bold leading-tight ${isActive ? "text-brand-mint" : "text-zinc-300"}`}>
              {preset.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { PRESETS as SUBTITLE_PRESETS };
export type { SubtitleStyleKey };
