"use client";

import React from "react";

export type TypographyStyleId =
  | "silver-chrome"
  | "neon-blue"
  | "fire-orange"
  | "ice-white"
  | "gold-luxury"
  | "purple-haze"
  | "red-bold"
  | "green-matrix";

type TypographyStyle = {
  id: TypographyStyleId;
  name: string;
  preview: {
    background: string;
    textGradient: string;
    textShadow: string;
    textStroke?: string;
  };
};

export const TYPOGRAPHY_STYLES: TypographyStyle[] = [
  {
    id: "silver-chrome",
    name: "Chrome",
    preview: {
      background: "linear-gradient(180deg, #1E293B, #0F172A)",
      textGradient: "linear-gradient(180deg, #F8FAFC 0%, #94A3B8 50%, #CBD5E1 100%)",
      textShadow: "0 4px 20px rgba(148,163,184,0.5), 0 2px 4px rgba(0,0,0,0.8)",
      textStroke: "1px rgba(71,85,105,0.5)",
    },
  },
  {
    id: "neon-blue",
    name: "Neon Blue",
    preview: {
      background: "linear-gradient(180deg, #0F172A, #020617)",
      textGradient: "linear-gradient(180deg, #93C5FD 0%, #3B82F6 50%, #60A5FA 100%)",
      textShadow: "0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4), 0 4px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "fire-orange",
    name: "Fire",
    preview: {
      background: "linear-gradient(180deg, #1C1917, #0C0A09)",
      textGradient: "linear-gradient(180deg, #FDE68A 0%, #F97316 40%, #DC2626 100%)",
      textShadow: "0 0 30px rgba(249,115,22,0.7), 0 4px 12px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "ice-white",
    name: "Ice White",
    preview: {
      background: "linear-gradient(180deg, #1E293B, #0F172A)",
      textGradient: "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 50%, #F8FAFC 100%)",
      textShadow: "0 2px 20px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.8)",
    },
  },
  {
    id: "gold-luxury",
    name: "Gold",
    preview: {
      background: "linear-gradient(180deg, #1C1917, #0C0A09)",
      textGradient: "linear-gradient(160deg, #FDE68A 0%, #D97706 35%, #F59E0B 65%, #FDE68A 100%)",
      textShadow: "0 4px 20px rgba(217,119,6,0.5), 0 2px 4px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "purple-haze",
    name: "Purple",
    preview: {
      background: "linear-gradient(180deg, #1E1B4B, #0F0A2E)",
      textGradient: "linear-gradient(180deg, #C4B5FD 0%, #8B5CF6 50%, #A78BFA 100%)",
      textShadow: "0 0 30px rgba(139,92,246,0.7), 0 4px 12px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "red-bold",
    name: "Red Bold",
    preview: {
      background: "linear-gradient(180deg, #1C1917, #0C0A09)",
      textGradient: "linear-gradient(180deg, #FCA5A5 0%, #EF4444 50%, #DC2626 100%)",
      textShadow: "0 0 20px rgba(239,68,68,0.6), 0 4px 8px rgba(0,0,0,0.9)",
      textStroke: "1px rgba(127,29,29,0.6)",
    },
  },
  {
    id: "green-matrix",
    name: "Matrix",
    preview: {
      background: "linear-gradient(180deg, #052E16, #022C22)",
      textGradient: "linear-gradient(180deg, #86EFAC 0%, #22C55E 50%, #4ADE80 100%)",
      textShadow: "0 0 30px rgba(34,197,94,0.7), 0 0 60px rgba(34,197,94,0.3), 0 4px 8px rgba(0,0,0,0.9)",
    },
  },
];

export function getTypographyStyle(id: string): TypographyStyle {
  return TYPOGRAPHY_STYLES.find((s) => s.id === id) || TYPOGRAPHY_STYLES[0];
}

type TypographyStylePickerProps = {
  value: string;
  onChange: (value: TypographyStyleId) => void;
};

export function TypographyStylePicker({ value, onChange }: TypographyStylePickerProps) {
  return (
    <div className="rounded-xl border border-purple-400/20 bg-purple-400/[0.05] p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-purple-300">Typography Style</p>
      <div className="grid grid-cols-4 gap-2">
        {TYPOGRAPHY_STYLES.map((style) => {
          const isSelected = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              className={`relative overflow-hidden rounded-lg border p-2 transition-all ${
                isSelected
                  ? "border-purple-400 ring-1 ring-purple-400/50 scale-105"
                  : "border-white/10 hover:border-white/25"
              }`}
              style={{ background: style.preview.background }}
            >
              <span
                className="block text-center text-lg font-black leading-none"
                style={{
                  background: style.preview.textGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: isSelected ? style.preview.textShadow : "none",
                  WebkitTextStroke: style.preview.textStroke || undefined,
                }}
              >
                Ab
              </span>
              <span className={`mt-1 block text-center text-[9px] font-bold ${isSelected ? "text-purple-300" : "text-zinc-500"}`}>
                {style.name}
              </span>
              {isSelected && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-purple-400/60" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
