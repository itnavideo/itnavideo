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
  | "green-matrix"
  | "cyan-electric"
  | "pink-neon"
  | "yellow-bold"
  | "sunset-gradient"
  | "outline-white";

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
      textGradient: "linear-gradient(180deg, #93C5FD 0%, #10B981 50%, #60A5FA 100%)",
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
  {
    id: "cyan-electric",
    name: "Cyan",
    preview: {
      background: "linear-gradient(180deg, #042F2E, #0C4A6E)",
      textGradient: "linear-gradient(180deg, #A5F3FC 0%, #06B6D4 50%, #22D3EE 100%)",
      textShadow: "0 0 30px rgba(6,182,212,0.8), 0 0 60px rgba(6,182,212,0.35), 0 4px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "pink-neon",
    name: "Pink Neon",
    preview: {
      background: "linear-gradient(180deg, #2E0A1F, #1A0312)",
      textGradient: "linear-gradient(180deg, #FBBFEC 0%, #EC4899 50%, #F472B6 100%)",
      textShadow: "0 0 30px rgba(236,72,153,0.8), 0 0 50px rgba(236,72,153,0.35), 0 4px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "yellow-bold",
    name: "Yellow",
    preview: {
      background: "linear-gradient(180deg, #1C1917, #0C0A09)",
      textGradient: "linear-gradient(180deg, #FEF9C3 0%, #FACC15 50%, #FDE047 100%)",
      textShadow: "0 2px 12px rgba(250,204,21,0.5), 0 4px 8px rgba(0,0,0,0.9)",
      textStroke: "1.5px rgba(113,63,18,0.5)",
    },
  },
  {
    id: "sunset-gradient",
    name: "Sunset",
    preview: {
      background: "linear-gradient(180deg, #1E1B2E, #0F0A1E)",
      textGradient: "linear-gradient(135deg, #FDA4AF 0%, #F472B6 50%, #F97316 100%)",
      textShadow: "0 0 25px rgba(244,114,182,0.6), 0 4px 12px rgba(0,0,0,0.9)",
    },
  },
  {
    id: "outline-white",
    name: "Outline",
    preview: {
      background: "linear-gradient(180deg, #1E293B, #0F172A)",
      textGradient: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
      textStroke: "2px rgba(255,255,255,0.9)",
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
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
        {TYPOGRAPHY_STYLES.map((style) => {
          const isSelected = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              className={`relative overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? "border-purple-400 ring-1 ring-purple-400/50 scale-[1.02]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* Mini phone frame with fake video + text overlay */}
              <div
                className="relative aspect-[9/16] w-full overflow-hidden"
                style={{ background: style.preview.background }}
              >
                {/* Fake person silhouette */}
                <div className="absolute left-1/2 top-[18%] h-[20%] w-[36%] -translate-x-1/2 rounded-full bg-slate-400/15" />
                <div className="absolute left-1/2 top-[40%] h-[28%] w-[52%] -translate-x-1/2 rounded-t-full bg-slate-500/12" />

                {/* Dark gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Big bold text preview - THE KEY VISUAL */}
                <div className="absolute inset-x-2 top-[30%] flex items-center justify-center">
                  <span
                    className="text-center text-[16px] font-black uppercase leading-none tracking-tight"
                    style={{
                      background: style.preview.textGradient,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      textShadow: isSelected ? style.preview.textShadow : "none",
                      WebkitTextStroke: style.preview.textStroke || undefined,
                      filter: isSelected ? 'none' : 'brightness(0.85)',
                    }}
                  >
                    HUSTLE
                  </span>
                </div>

                {/* Small caption at bottom (like real output) */}
                <div className="absolute inset-x-2 bottom-[12%]">
                  <div className="mx-auto max-w-[90%] rounded bg-black/50 px-1.5 py-0.5 text-center">
                    <span className="text-[6px] font-bold text-white/80">create better reels</span>
                  </div>
                </div>
              </div>

              {/* Style name */}
              <div className="bg-black/40 px-1.5 py-1.5">
                <span className={`block text-center text-[9px] font-bold leading-tight ${isSelected ? "text-purple-300" : "text-zinc-400"}`}>
                  {style.name}
                </span>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 shadow">
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
