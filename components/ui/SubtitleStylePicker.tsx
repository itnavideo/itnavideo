"use client";

import React from "react";

type SubtitleStyleKey =
  | "highlight"
  | "normal"
  | "big-bold"
  | "word-pop"
  | "neon"
  | "box"
  | "split-color"
  | "typewriter"
  | "bold-outline"
  | "none";

type StyleOption = {
  key: SubtitleStyleKey;
  label: string;
  preview: string;
  description: string;
};

const STYLES: StyleOption[] = [
  { key: "highlight", label: "Highlight", preview: "🟡", description: "Active word highlighted" },
  { key: "normal", label: "Clean", preview: "Aa", description: "Simple white text" },
  { key: "big-bold", label: "Big Bold", preview: "AB", description: "Large Instagram style" },
  { key: "word-pop", label: "Word Pop", preview: "💥", description: "One word at a time" },
  { key: "neon", label: "Neon", preview: "✨", description: "Glowing neon effect" },
  { key: "box", label: "Box", preview: "▪️", description: "Word in colored box" },
  { key: "split-color", label: "Split", preview: "🎨", description: "Spoken = highlight" },
  { key: "typewriter", label: "Typewriter", preview: "⌨️", description: "Types letter by letter" },
  { key: "bold-outline", label: "Outline", preview: "🔤", description: "Heavy stroke border" },
  { key: "none", label: "None", preview: "—", description: "No subtitles" },
];

interface SubtitleStylePickerProps {
  value: SubtitleStyleKey;
  onChange: (style: SubtitleStyleKey) => void;
}

export function SubtitleStylePicker({ value, onChange }: SubtitleStylePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {STYLES.map((style) => {
        const isActive = value === style.key;
        return (
          <button
            key={style.key}
            type="button"
            onClick={() => onChange(style.key)}
            className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all ${
              isActive
                ? "border-brand-mint/60 bg-brand-mint/[0.08] ring-1 ring-brand-mint/40"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            {isActive ? (
              <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-brand-mint flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.5 7.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : null}
            <span className="text-lg">{style.preview}</span>
            <span className={`text-xs font-bold ${isActive ? "text-brand-mint" : "text-zinc-300"}`}>
              {style.label}
            </span>
            <span className="text-[10px] leading-tight text-zinc-500">
              {style.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type { SubtitleStyleKey };
export { STYLES as SUBTITLE_STYLES };
