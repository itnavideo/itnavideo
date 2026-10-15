"use client";

import { useState } from "react";
import { Sparkles, Palette, Box, Check } from "lucide-react";

export type StickerStyle =
  | "3d-presenter-man"
  | "2d-presenter-man"
  | "character-1"
  | "character-2"
  | "character-3"
  | "character-4"
  | string;

export type CharacterItem = {
  id: StickerStyle;
  name: string;
  badge?: string;
  category: "2D" | "3D";
  preview: string;
  poses: {
    welcome: string;
    left: string;
    right: string;
    thinking: string;
    warning: string;
    success: string;
  };
};

/**
 * 100% Verified Cloudinary Asset Catalog for Compare Explainer
 * Strictly shows available, working character assets. Missing/placeholder 3D characters removed.
 */
export const CHARACTER_CATALOG: CharacterItem[] = [
  // ── 3D Characters ──
  {
    id: "3d-presenter-man",
    name: "3D Teacher Pro",
    badge: "Popular 3D",
    category: "3D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711876/itnavideo/assets/stickman/3d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711876/itnavideo/assets/stickman/3d-presenter-man/teacher-welcome.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711871/itnavideo/assets/stickman/3d-presenter-man/teacher-left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711872/itnavideo/assets/stickman/3d-presenter-man/teacher-right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711874/itnavideo/assets/stickman/3d-presenter-man/teacher-thinking.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711875/itnavideo/assets/stickman/3d-presenter-man/teacher-warning.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711873/itnavideo/assets/stickman/3d-presenter-man/teacher-success.png",
    },
  },

  // ── 2D Characters ──
  {
    id: "2d-presenter-man",
    name: "2D Teacher Pro",
    badge: "Vector Pro",
    category: "2D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711870/itnavideo/assets/stickman/2d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711870/itnavideo/assets/stickman/2d-presenter-man/teacher-welcome.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711865/itnavideo/assets/stickman/2d-presenter-man/teacher-left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711865/itnavideo/assets/stickman/2d-presenter-man/teacher-right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711867/itnavideo/assets/stickman/2d-presenter-man/teacher-thinking.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711868/itnavideo/assets/stickman/2d-presenter-man/teacher-warning.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711866/itnavideo/assets/stickman/2d-presenter-man/teacher-success.png",
    },
  },
  {
    id: "character-1",
    name: "Stickman Pro",
    badge: "Popular Stickman",
    category: "2D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791706431/itnavideo/visuals/compare_explainer/character-1.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711886/itnavideo/assets/stickman/compare_characters/character-1/normal.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711882/itnavideo/assets/stickman/compare_characters/character-1/left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711891/itnavideo/assets/stickman/compare_characters/character-1/right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711886/itnavideo/assets/stickman/compare_characters/character-1/normal.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711886/itnavideo/assets/stickman/compare_characters/character-1/normal.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711886/itnavideo/assets/stickman/compare_characters/character-1/normal.png",
    },
  },
  {
    id: "character-2",
    name: "Sketch Artist",
    badge: "Sketch",
    category: "2D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791706433/itnavideo/visuals/compare_explainer/character-2.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711921/itnavideo/assets/stickman/compare_characters/character-2/normal.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711903/itnavideo/assets/stickman/compare_characters/character-2/left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711928/itnavideo/assets/stickman/compare_characters/character-2/right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711921/itnavideo/assets/stickman/compare_characters/character-2/normal.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711921/itnavideo/assets/stickman/compare_characters/character-2/normal.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711921/itnavideo/assets/stickman/compare_characters/character-2/normal.png",
    },
  },
  {
    id: "character-3",
    name: "Stickman Presenter",
    badge: "Dynamic",
    category: "2D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791706435/itnavideo/visuals/compare_explainer/character-3.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711933/itnavideo/assets/stickman/compare_characters/character-3/normal.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711930/itnavideo/assets/stickman/compare_characters/character-3/left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711935/itnavideo/assets/stickman/compare_characters/character-3/right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711933/itnavideo/assets/stickman/compare_characters/character-3/normal.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711933/itnavideo/assets/stickman/compare_characters/character-3/normal.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711933/itnavideo/assets/stickman/compare_characters/character-3/normal.png",
    },
  },
  {
    id: "character-4",
    name: "Doodle Explainer",
    badge: "Doodle",
    category: "2D",
    preview: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791706436/itnavideo/visuals/compare_explainer/character-4.png",
    poses: {
      welcome: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711942/itnavideo/assets/stickman/compare_characters/character-4/normal.png",
      left: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711939/itnavideo/assets/stickman/compare_characters/character-4/left.png",
      right: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711945/itnavideo/assets/stickman/compare_characters/character-4/right.png",
      thinking: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711942/itnavideo/assets/stickman/compare_characters/character-4/normal.png",
      warning: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711942/itnavideo/assets/stickman/compare_characters/character-4/normal.png",
      success: "https://res.cloudinary.com/dhouh9idx/image/upload/v1791711942/itnavideo/assets/stickman/compare_characters/character-4/normal.png",
    },
  },
];

type StickerStylePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const CATEGORY_SECTIONS = [
  {
    id: "3D" as const,
    title: "3D Stylized Presenter",
    icon: Box,
    badge: "3D Pro",
    description: "High-fidelity rendered 3D avatar",
  },
  {
    id: "2D" as const,
    title: "2D Vector & Stickman Presenters",
    icon: Palette,
    badge: "Vector / Stickman",
    description: "Flat, sketch & animated stickman cartoon presenters",
  },
] as const;

export function StickerStylePicker({ value, onChange }: StickerStylePickerProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleSections = CATEGORY_SECTIONS.filter(
    (sec) => activeCategoryFilter === "All" || activeCategoryFilter === sec.id
  );

  return (
    <div className="space-y-5">
      {/* Header with Title & Filter Pills */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5722] shadow-[0_0_10px_rgba(255,87,34,0.8)]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Choose Presenter Character
            </h4>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-400">
              {CHARACTER_CATALOG.length} Verified Presenters
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300 flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#FFA000] shrink-0" />
            <span>AI automatically syncs character poses, side-pointing, and reactions to your narration.</span>
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-black/50 p-1">
          {["All", "3D", "2D"].map((cat) => {
            const isActive = activeCategoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`rounded-xl px-3 py-1 text-[11px] font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25 font-black"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat === "All" ? "All Styles" : `${cat} Presenters`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Sections */}
      <div className="space-y-6">
        {visibleSections.map((section) => {
          const sectionChars = CHARACTER_CATALOG.filter((c) => c.category === section.id);
          const SectionIcon = section.icon;

          if (sectionChars.length === 0) return null;

          return (
            <div key={section.id} className="space-y-3">
              {/* Section Title Banner */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070B14]/70 px-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/15 text-orange-400">
                    <SectionIcon size={14} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-2">
                      <span>{section.title}</span>
                      <span className="text-[10px] font-normal normal-case text-zinc-400 hidden sm:inline">
                        • {section.description}
                      </span>
                    </h5>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[9px] font-bold text-zinc-300">
                  {sectionChars.length} {section.id}
                </span>
              </div>

              {/* Character Grid with Circular Avatars */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {sectionChars.map((char) => {
                  const isSelected = value === char.id;

                  return (
                    <div
                      key={char.id}
                      onClick={() => onChange(char.id)}
                      className={`group relative flex flex-col items-center justify-between rounded-2xl border p-3 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#FF5722] bg-gradient-to-b from-[#FF5722]/20 via-[#0E1526] to-[#070B14] shadow-[0_0_20px_rgba(255,87,34,0.35)] ring-2 ring-[#FF5722]/50"
                          : "border-white/10 bg-[#070B14]/80 hover:border-white/25 hover:bg-[#111726]"
                      }`}
                    >
                      {/* Top Badge */}
                      {char.badge && (
                        <div className="absolute left-2 top-2 z-10">
                          <span className="rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-1.5 py-0.5 text-[7px] font-black uppercase text-black shadow-md">
                            {char.badge}
                          </span>
                        </div>
                      )}

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-[10px] font-black text-black shadow-lg ring-2 ring-black">
                          ✓
                        </span>
                      )}

                      {/* CIRCULAR Avatar Frame */}
                      <div className="my-1.5 flex flex-col items-center">
                        <div
                          className={`relative h-20 w-20 sm:h-22 sm:w-22 rounded-full overflow-hidden border p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                            isSelected
                              ? "border-[#FF5722] bg-gradient-to-b from-[#FF5722]/30 via-black to-black shadow-[0_0_15px_rgba(255,87,34,0.4)] ring-2 ring-[#FF5722]/40"
                              : "border-white/15 bg-black/60 group-hover:border-white/30"
                          }`}
                        >
                          {failedImages[char.id] ? (
                            <div className="flex flex-col items-center justify-center text-center p-1">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black font-black shadow-md">
                                {char.category === "3D" ? <Box size={20} /> : <Palette size={20} />}
                              </div>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={char.preview}
                              alt={char.name}
                              onError={() => setFailedImages((prev) => ({ ...prev, [char.id]: true }))}
                              className="h-full w-full object-contain rounded-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                              loading="eager"
                            />
                          )}
                        </div>

                        {/* Name */}
                        <p
                          className={`mt-2 text-center text-[11px] font-extrabold px-1 leading-tight ${
                            isSelected ? "text-[#FFA000]" : "text-zinc-200"
                          }`}
                        >
                          {char.name}
                        </p>
                      </div>

                      {/* Select Action Pill */}
                      <div className="mt-1 w-full">
                        <div
                          className={`w-full rounded-xl py-1 text-center text-[9px] font-black transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-sm"
                              : "border border-white/10 bg-white/5 text-zinc-400 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 group-hover:text-orange-300"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
