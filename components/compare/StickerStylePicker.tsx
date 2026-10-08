"use client";

import { useState } from "react";
import { Sparkles, Palette, Box, Camera, Check } from "lucide-react";

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
  category: "2D" | "3D" | "Realistic";
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

export const CHARACTER_CATALOG: CharacterItem[] = [
  // ── 3D Characters ──
  {
    id: "3d-presenter-man",
    name: "3D Teacher Pro",
    badge: "Popular 3D",
    category: "3D",
    preview: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
      left: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png",
      right: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png",
      thinking: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png",
      warning: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png",
      success: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png",
    },
  },
  {
    id: "casual-guy-3d",
    name: "3D Casual Creator",
    badge: "3D Stylized",
    category: "3D",
    preview: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
      left: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png",
      right: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png",
      thinking: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png",
      warning: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png",
      success: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png",
    },
  },

  // ── 2D Characters ──
  {
    id: "2d-presenter-man",
    name: "2D Teacher Pro",
    badge: "Vector Pro",
    category: "2D",
    preview: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png",
      left: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-left.png",
      right: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-right.png",
      thinking: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-thinking.png",
      warning: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-warning.png",
      success: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-success.png",
    },
  },
  {
    id: "character-1",
    name: "2D Anime Guy",
    badge: "Anime",
    category: "2D",
    preview: "/assets/stickman/compare_characters/character-1/normal.png",
    poses: {
      welcome: "/assets/stickman/compare_characters/character-1/normal.png",
      left: "/assets/stickman/compare_characters/character-1/left.png",
      right: "/assets/stickman/compare_characters/character-1/right.png",
      thinking: "/assets/stickman/compare_characters/character-1/normal.png",
      warning: "/assets/stickman/compare_characters/character-1/normal.png",
      success: "/assets/stickman/compare_characters/character-1/normal.png",
    },
  },
  {
    id: "character-2",
    name: "2D Sketch Artist",
    badge: "Sketch",
    category: "2D",
    preview: "/assets/stickman/compare_characters/character-2/normal.png",
    poses: {
      welcome: "/assets/stickman/compare_characters/character-2/normal.png",
      left: "/assets/stickman/compare_characters/character-2/left.png",
      right: "/assets/stickman/compare_characters/character-2/right.png",
      thinking: "/assets/stickman/compare_characters/character-2/normal.png",
      warning: "/assets/stickman/compare_characters/character-2/normal.png",
      success: "/assets/stickman/compare_characters/character-2/normal.png",
    },
  },
  {
    id: "character-3",
    name: "2D Stickman Presenter",
    badge: "Stickman",
    category: "2D",
    preview: "/assets/stickman/compare_characters/character-3/normal.png",
    poses: {
      welcome: "/assets/stickman/compare_characters/character-3/normal.png",
      left: "/assets/stickman/compare_characters/character-3/left.png",
      right: "/assets/stickman/compare_characters/character-3/right.png",
      thinking: "/assets/stickman/compare_characters/character-3/normal.png",
      warning: "/assets/stickman/compare_characters/character-3/normal.png",
      success: "/assets/stickman/compare_characters/character-3/normal.png",
    },
  },
  {
    id: "character-4",
    name: "2D Doodle Explainer",
    badge: "Doodle",
    category: "2D",
    preview: "/assets/stickman/compare_characters/character-4/normal.png",
    poses: {
      welcome: "/assets/stickman/compare_characters/character-4/normal.png",
      left: "/assets/stickman/compare_characters/character-4/left.png",
      right: "/assets/stickman/compare_characters/character-4/right.png",
      thinking: "/assets/stickman/compare_characters/character-4/normal.png",
      warning: "/assets/stickman/compare_characters/character-4/normal.png",
      success: "/assets/stickman/compare_characters/character-4/normal.png",
    },
  },

  // ── Realistic Characters ──
  {
    id: "doctor-pro-real",
    name: "Realistic Doctor",
    badge: "Realistic Pro",
    category: "Realistic",
    preview: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
      left: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png",
      right: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png",
      thinking: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png",
      warning: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png",
      success: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png",
    },
  },
  {
    id: "tech-founder-real",
    name: "Realistic Founder",
    badge: "Realistic Pro",
    category: "Realistic",
    preview: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
    poses: {
      welcome: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png",
      left: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png",
      right: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png",
      thinking: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png",
      warning: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png",
      success: "https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png",
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
    title: "1. 3D Characters",
    icon: Box,
    badge: "3D Stylized",
    description: "High-fidelity stylized 3D avatars",
  },
  {
    id: "2D" as const,
    title: "2. 2D Characters",
    icon: Palette,
    badge: "2D Vector / Anime",
    description: "Flat, sketch & animated cartoon presenters",
  },
  {
    id: "Realistic" as const,
    title: "3. Realistic Characters",
    icon: Camera,
    badge: "Realistic Pro",
    description: "Photorealistic avatar presenters for professional explainers",
  },
] as const;

export function StickerStylePicker({ value, onChange }: StickerStylePickerProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleSections = CATEGORY_SECTIONS.filter(
    (sec) => activeCategoryFilter === "All" || activeCategoryFilter === sec.id
  );

  return (
    <div className="space-y-6">
      {/* Header with Title & Filter Pills */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF8F00] shadow-[0_0_10px_rgba(255,143,0,0.8)]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Choose Presenter Character
            </h3>
            <span className="rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[10px] font-extrabold text-[#FFA726]">
              {CHARACTER_CATALOG.length} Avatars
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-300 flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#FFA726] shrink-0" />
            <span>AI automatically syncs character poses, expressions, and reaction sound effects to your narration.</span>
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-black/40 p-1">
          {["All", "3D", "2D", "Realistic"].map((cat) => {
            const isActive = activeCategoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`rounded-xl px-3 py-1 text-[11px] font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25 font-black"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat === "All" ? "Show All Rows" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 STACKED SECTIONS: 2D -> 3D -> REALISTIC */}
      {CHARACTER_CATALOG.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/30 p-8 text-center">
          <p className="text-xs font-bold text-zinc-300">No Presenter Characters Active</p>
          <p className="text-[11px] text-zinc-500 mt-1">Ready to receive real character assets and poses.</p>
        </div>
      ) : (
        <div className="space-y-8">
        {visibleSections.map((section) => {
          const sectionChars = CHARACTER_CATALOG.filter((c) => c.category === section.id);
          const SectionIcon = section.icon;

          if (sectionChars.length === 0) return null;

          return (
            <div key={section.id} className="space-y-3.5">
              {/* Section Title Banner */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#151E30]/70 px-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#FF6D00]/30 bg-[#FF6D00]/15 text-[#FFA726]">
                    <SectionIcon size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-2">
                      <span>{section.title}</span>
                      <span className="text-[10px] font-normal normal-case text-zinc-400 hidden sm:inline">
                        • {section.description}
                      </span>
                    </h4>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[9px] font-bold text-zinc-300">
                  {sectionChars.length} Avatars
                </span>
              </div>

              {/* Character Grid with Circular Avatars */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sectionChars.map((char) => {
                  const isSelected = value === char.id;

                  return (
                    <div
                      key={char.id}
                      onClick={() => onChange(char.id)}
                      className={`group relative flex flex-col items-center justify-between rounded-2xl border p-3 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#FF6D00] bg-gradient-to-b from-[#FF6D00]/20 via-[#0E1526] to-[#070B14] shadow-[0_0_20px_rgba(255,109,0,0.3)] ring-2 ring-[#FF6D00]/50"
                          : "border-white/10 bg-[#0E1526]/80 hover:border-white/25 hover:bg-[#151E30]"
                      }`}
                    >
                      {/* Top Badge */}
                      {char.badge ? (
                        <div className="absolute left-2 top-2 z-10">
                          <span className="rounded-full bg-[#FF6D00] px-1.5 py-0.5 text-[7px] font-black uppercase text-black shadow-md">
                            {char.badge}
                          </span>
                        </div>
                      ) : null}

                      {/* Selected Checkmark Badge */}
                      {isSelected ? (
                        <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-[10px] font-black text-black shadow-lg ring-2 ring-black">
                          ✓
                        </span>
                      ) : null}

                      {/* CIRCULAR Avatar Frame (Shows 100% Full Character Cleanly) */}
                      <div className="my-1.5 flex flex-col items-center">
                        <div
                          className={`relative h-20 w-20 sm:h-22 sm:w-22 rounded-full overflow-hidden border p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                            isSelected
                              ? "border-[#FF6D00] bg-gradient-to-b from-[#FF6D00]/30 via-black to-black shadow-[0_0_15px_rgba(255,109,0,0.4)] ring-2 ring-[#FF6D00]/40"
                              : "border-white/15 bg-black/60 group-hover:border-white/30"
                          }`}
                        >
                          {failedImages[char.id] ? (
                            <div className="flex flex-col items-center justify-center text-center p-1">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] text-black font-black shadow-md">
                                {char.category === "3D" ? <Box size={20} /> : char.category === "2D" ? <Palette size={20} /> : <Camera size={20} />}
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
                            isSelected ? "text-[#FFA726]" : "text-zinc-200"
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
                              ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-sm"
                              : "border border-white/10 bg-white/5 text-zinc-400 group-hover:border-[#FF6D00]/40 group-hover:bg-[#FF6D00]/10 group-hover:text-[#FFA726]"
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
      )}
    </div>
  );
}

