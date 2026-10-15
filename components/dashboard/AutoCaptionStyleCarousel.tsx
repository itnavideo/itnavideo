"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  Search,
  X,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  SHORTS_PRESET_ORDER,
  LONG_FORM_PRESET_ORDER,
  PREVIEW_CONFIG,
} from "@/components/ui/SubtitleStylePicker";
import previewTranscripts from "@/lib/cloudinary/autocaption-transcripts.json";
import { getCaptionStyleCatalogItem } from "@/lib/cloudinary/captionCatalog";

export interface AutoCaptionStyleCarouselProps {
  selectedPresetKey: string;
  onSelectPreset: (presetKey: string) => void;
  onHighlightColorChange?: (color: string) => void;
  mode?: "shorts" | "longForm";
  videoUrl?: string;
}

export type StyleCategory =
  | "viral-bold"
  | "kinetic"
  | "glow"
  | "cinematic"
  | "podcast"
  | "educational"
  | "minimal"
  | "kids"
  | "animation2d"
  | "animation3d"
  | "favorites"
  | "all";

export interface CategoryTab {
  id: StyleCategory;
  label: string;
  icon?: string;
}

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "all", label: "🌐 All Styles (100+)" },
  { id: "viral-bold", label: "🔥 Viral & Bold" },
  { id: "kinetic", label: "⚡ Kinetic" },
  { id: "glow", label: "✨ Glow & Neon" },
  { id: "cinematic", label: "🎬 Cinematic" },
  { id: "podcast", label: "🎙️ Podcast" },
  { id: "educational", label: "🎓 Educational" },
  { id: "minimal", label: "💎 Minimal & Clean" },
  { id: "favorites", label: "★ Favorites" },
];

// Exact Category Presets Sets
export const VIRAL_BOLD_PRESETS = new Set([
  "Hormozi Viral Pop",
  "MrBeast Shorts Impact",
  "MrBeast 16:9 Punch",
  "Impact",
  "Bold Creator",
  "Bold Fire",
  "Shatter Drop",
  "Sharp Yellow",
  "Punch",
  "Red Wipe",
  "Discipline",
  "Cook",
  "Master",
  "Spark",
]);

export const KINETIC_PRESETS = new Set([
  "Kinetic",
  "Karaoke Fill",
  "Shorts Karaoke",
  "Crazy",
  "Crazy 2",
  "Pop Candy",
  "Gradient Wave",
  "Pill Bounce",
  "One Word",
  "Gamer",
  "Cursive",
]);

export const GLOW_PRESETS = new Set([
  "Submagic Glow",
  "Neon Pulse",
  "Spark Glow",
  "Impact Glow",
  "Crazy Cyan",
  "Blue Muse",
  "Arctic Glow",
]);

export const CINEMATIC_PRESETS = new Set([
  "Cinematic Docu",
  "Vox Documentary",
  "BBC / Netflix Closed Captions",
  "Floating Serif",
  "Glass Blur",
  "Netflix Bar",
  "Metallic Gradient",
  "Ocean Blue",
  "Estate",
]);

export const PODCAST_PRESETS = new Set([
  "Studio Podcast",
  "Diary of a CEO",
  "Huberman Lab Lecture",
  "Warikoo Black Card",
  "MKBHD Tech Studio",
  "Boardroom",
  "Solo",
  "Solo Pop",
]);

export const EDUCATIONAL_PRESETS = new Set([
  "Kurzgesagt Explainer",
  "Active Orange Pill",
  "M3 Tonal Pill",
  "M3 Dynamic Chip",
  "M3 Elevated Card",
  "M3 Surface Outline",
  "M3 Primary Container",
  "Hacker Type",
  "Stock Green",
  "Retro VHS",
  "Marker Highlight",
  "Handwritten",
]);

export const MINIMAL_PRESETS = new Set([
  "Minimal Clean",
  "Reels Clean",
  "Lex Fridman Minimalist",
  "Studio Clean",
  "Devane Luxury Serif",
  "Story",
  "Ali Abdaal Clean Pill",
  "Opus Inverted Box",
  "Cyber Lime Pill",
  "Creator 3",
]);

export const KIDS_PRESETS = new Set([
  "Rainbow Pop",
  "Bubble Bounce",
  "Storybook Spark",
  "Crayon Caption",
  "Candy Karaoke",
  "Toon Word Pop",
]);

export const ANIMATION_2D_PRESETS = new Set([
  "Comic Burst 2D",
  "Cel Shade 2D",
  "Anime Kinetic 2D",
  "Flat Motion 2D",
  "Pixel Pop 2D",
  "Cutout Story 2D",
]);

export const ANIMATION_3D_PRESETS = new Set([
  "Toy Block 3D",
  "Depth Pop 3D",
  "Chrome Bounce 3D",
  "Holo Glass 3D",
  "Neon Voxel 3D",
  "Orbit Motion 3D",
  "Cinema Depth 3D",
]);

export const CLEAN_PRO_PRESETS = MINIMAL_PRESETS;

export function getPresetCategoryLabel(key: string): string {
  if (VIRAL_BOLD_PRESETS.has(key)) return "Viral Bold";
  if (KINETIC_PRESETS.has(key)) return "Kinetic";
  if (GLOW_PRESETS.has(key)) return "Glow";
  if (CINEMATIC_PRESETS.has(key)) return "Cinematic";
  if (PODCAST_PRESETS.has(key)) return "Podcast";
  if (EDUCATIONAL_PRESETS.has(key)) return "Educational";
  if (MINIMAL_PRESETS.has(key)) return "Minimal";
  if (KIDS_PRESETS.has(key)) return "Kids";
  if (ANIMATION_2D_PRESETS.has(key)) return "2D Animation";
  if (ANIMATION_3D_PRESETS.has(key)) return "3D Animation";
  return "Creator";
}

// Master list of all styles in canonical deduplicated order
export const ALL_STYLES_MASTER: string[] = Array.from(
  new Set([
    ...SHORTS_PRESET_ORDER,
    ...LONG_FORM_PRESET_ORDER,
    ...Object.keys(SUBTITLE_PRESETS),
  ])
);

// Top 8 Trending Creator Presets for the Demo Video Showcase
export const FEATURED_TRENDING_DEMOS: Array<{ key: string; badge: string; tag: string }> = [
  { key: "Hormozi Viral Pop", badge: "🔥 #1 Viral", tag: "Alex Hormozi" },
  { key: "MrBeast Shorts Impact", badge: "⚡ High Energy", tag: "MrBeast Punch" },
  { key: "Submagic Glow", badge: "✨ Neon Glow", tag: "Submagic Viral" },
  { key: "Ali Abdaal Clean Pill", badge: "💎 Minimal", tag: "Ali Abdaal" },
  { key: "Kurzgesagt Explainer", badge: "🎓 Explainer", tag: "Kurzgesagt" },
  { key: "Diary of a CEO", badge: "🎙️ Podcast", tag: "Steven Bartlett" },
  { key: "Crazy 2", badge: "⚡ Dynamic", tag: "Kinetic Pop" },
  { key: "Devane Luxury Serif", badge: "👑 Luxury", tag: "Editorial Serif" },
];

export function getPresetVideoFilename(key: string): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.filename;
}

export function getPresetVideoUrl(key: string): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.previewVideoUrl;
}

export function getPresetPosterUrl(key: string): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.posterUrl;
}

export function AutoCaptionStyleCarousel({
  selectedPresetKey,
  onSelectPreset,
  onHighlightColorChange,
  mode = "shorts",
}: AutoCaptionStyleCarouselProps) {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFeaturedDemos, setShowFeaturedDemos] = useState<boolean>(true);

  // Demo showcase playback state (strictly limited to top 8 featured demos)
  const [playingDemoKey, setPlayingDemoKey] = useState<string | null>(null);
  const [isDemoMuted, setIsDemoMuted] = useState<boolean>(true);

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const saved = localStorage.getItem("itnavideo_favorite_caption_styles");
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const toggleFavorite = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem(
          "itnavideo_favorite_caption_styles",
          JSON.stringify(Array.from(next))
        );
      } catch {}
      return next;
    });
  };

  const masterList = mode === "longForm" ? LONG_FORM_PRESET_ORDER : SHORTS_PRESET_ORDER;

  // Filter styles instantaneously with 0 lag
  const filteredStyleKeys = useMemo(() => {
    const list = Array.from(new Set([...masterList, ...ALL_STYLES_MASTER]));
    return list.filter((key) => {
      const presetData = SUBTITLE_PRESETS[key];
      if (!presetData) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = key.toLowerCase().includes(q);
        const fontMatch = presetData.fontFamily?.toLowerCase().includes(q) || false;
        const styleMatch = presetData.style?.toLowerCase().includes(q) || false;
        if (!nameMatch && !fontMatch && !styleMatch) return false;
      }

      // Favorites toggle filter
      if (activeCategory === "favorites") {
        return favorites.has(key);
      }
      return true;
    });
  }, [masterList, searchQuery, activeCategory, favorites]);

  const handleCardClick = (key: string) => {
    onSelectPreset(key);
    const presetData = SUBTITLE_PRESETS[key];
    if (onHighlightColorChange && presetData?.highlightColor) {
      onHighlightColorChange(presetData.highlightColor);
    }
  };

  return (
    <div id="caption-style-gallery" className="w-full space-y-6 pt-1 select-none scroll-mt-6">

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURED TOP 8 DEMOS STRIP (Real Video Moving Previews)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/20">
              <Flame size={17} className="fill-black/30" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white font-jakarta flex items-center gap-2">
                Featured Creator Demos
                <span className="rounded-full bg-orange-500/15 border border-orange-500/30 text-[#FFA000] text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  Top 8 Live Videos
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Live video results from top creators. Click to apply directly to your video.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/auto-caption/templates"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#131B2E] hover:border-[#FF5722]/50 hover:bg-[#1A233A] px-3 py-1.5 text-xs font-bold text-[#FFA000] transition"
            >
              <span>Full 100+ Gallery</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={() => setShowFeaturedDemos(!showFeaturedDemos)}
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#070B14] hover:bg-[#131B2E] px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <span>{showFeaturedDemos ? "Hide Demos" : "Show Demos"}</span>
              {showFeaturedDemos ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of the 8 Featured Video Demos */}
        {showFeaturedDemos && (
          <div className="flex gap-3 overflow-x-auto pb-2 pr-1 custom-scrollbar snap-x snap-mandatory">
          {FEATURED_TRENDING_DEMOS.map(({ key, badge, tag }) => {
            const isSelected = selectedPresetKey === key;
            const isPlaying = playingDemoKey === key;
            const videoSrc = getPresetVideoUrl(key);
            const posterSrc = getPresetPosterUrl(key);
            const presetData = SUBTITLE_PRESETS[key];

            return (
              <div
                key={`demo-${key}`}
                onClick={() => handleCardClick(key)}
                onMouseEnter={() => setPlayingDemoKey(key)}
                onMouseLeave={() => setPlayingDemoKey(null)}
                className={`group relative flex-shrink-0 w-[140px] sm:w-[155px] aspect-[9/16] rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 snap-start select-none ${
                  isSelected
                    ? "border-2 border-[#FF5722] bg-[#141C30] ring-4 ring-[#FF5722]/20 shadow-xl shadow-[#FF5722]/25 scale-[1.02] z-10"
                    : "border-white/10 bg-[#070B14] hover:border-[#FF5722]/50 hover:bg-[#0E1526] hover:-translate-y-1"
                }`}
              >
                {/* Video Tag with zero background bandwidth waste (preload=none) */}
                <video
                  ref={(el) => {
                    if (el) {
                      if (isPlaying) {
                        el.play().catch(() => {});
                      } else {
                        el.pause();
                        el.currentTime = 0;
                      }
                    }
                  }}
                  src={videoSrc}
                  poster={posterSrc}
                  playsInline
                  loop
                  muted={isDemoMuted}
                  preload="none"
                  className="h-full w-full object-cover"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-20">
                  <span className="rounded-full bg-black/80 backdrop-blur-md border border-white/15 px-2 py-0.5 text-[9px] font-black text-amber-300 shadow">
                    {badge}
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-md">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                  )}
                </div>

                {/* Play / Mute Controls */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-200">
                  {!isPlaying && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:scale-110 group-hover:bg-[#FF5722] group-hover:text-black group-hover:border-transparent transition-transform shadow-lg">
                      <Play size={15} className="fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Bottom Sound Toggle */}
                {isPlaying && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDemoMuted(!isDemoMuted);
                    }}
                    className="absolute top-2 right-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white border border-white/20 hover:bg-emerald-500 hover:text-black transition cursor-pointer"
                  >
                    {!isDemoMuted ? <Volume2 size={11} /> : <VolumeX size={11} />}
                  </button>
                )}

                {/* Bottom Card Title Info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-2.5 pt-6 z-20">
                  <p className="text-[11px] font-black text-white truncate font-jakarta">
                    {key}
                  </p>
                  <p className="text-[9px] font-bold text-slate-300 truncate">
                    {tag}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN 100+ KINETIC TYPOGRAPHY CARDS (Ultra-Fast 60 FPS, Zero Lag)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-4 sm:p-6 shadow-2xl space-y-5">
        {/* Gallery Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/20">
              <Sparkles size={16} className="fill-black/20" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white font-jakarta">
                All Caption Styles ({filteredStyleKeys.length})
              </h3>
              <p className="text-xs text-slate-300">
                Instant 60 FPS kinetic preview. Select any style to apply to the right video stage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorites Toggle */}
            <button
              type="button"
              onClick={() => setActiveCategory(activeCategory === "favorites" ? "all" : "favorites")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition cursor-pointer ${
                activeCategory === "favorites"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-[#131B2E] text-slate-200 border border-white/10 hover:border-amber-400/50"
              }`}
            >
              <Star size={13} className={activeCategory === "favorites" ? "fill-black" : "text-amber-400 fill-amber-400/30"} />
              <span>Favorites ({favorites.size})</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search styles or fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#070B14] pl-9 pr-8 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Direct All Styles Grid (No Category Tabs - All 100+ Presets Displayed Directly) */}

        {/* 100+ Kinetic Typography Grid (Zero video lag, pure CSS/SVG animation) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredStyleKeys.map((key) => {
            const isSelected = selectedPresetKey === key;
            const isFav = favorites.has(key);
            const presetData = SUBTITLE_PRESETS[key];
            if (!presetData) return null;

            const categoryLabel = getPresetCategoryLabel(key);
            const highlightColor = presetData.highlightColor || "#FFA000";
            const textColor = presetData.textColor || "#FFFFFF";
            const backgroundColor = presetData.backgroundColor;
            const fontFamily = presetData.fontFamily || "Plus Jakarta Sans, sans-serif";

            return (
              <div
                key={key}
                onClick={() => handleCardClick(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(key);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                  isSelected
                    ? "border-2 border-[#FF5722] bg-[#141C30] ring-4 ring-[#FF5722]/20 shadow-xl shadow-[#FF5722]/25 scale-[1.02] z-10"
                    : "border-white/10 bg-[#070B14] hover:border-[#FF5722]/50 hover:bg-[#131B2E] hover:-translate-y-0.5"
                }`}
              >
                {/* Top Card Header: Category Badge + Favorite Star */}
                <div className="flex items-center justify-between p-2.5 pb-1 z-10">
                  <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-300">
                    {categoryLabel}
                  </span>

                  <div className="flex items-center gap-1">
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-md">
                        <Check size={11} strokeWidth={3.5} />
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, key)}
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition cursor-pointer ${
                        isFav
                          ? "bg-amber-400 text-black shadow-md"
                          : "text-slate-500 hover:text-amber-300 hover:bg-white/10"
                      }`}
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star size={11} className={isFav ? "fill-black" : ""} />
                    </button>
                  </div>
                </div>

                {/* Central Kinetic Typography Preview Canvas */}
                <div className="relative w-full aspect-[16/10] flex items-center justify-center p-3 text-center overflow-hidden">
                  {/* Subtle ambient accent glow */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none blur-xl transition-opacity group-hover:opacity-25"
                    style={{ backgroundColor: highlightColor }}
                  />

                  {/* The Typography Preview Elements */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 px-1">
                    <span
                      style={{
                        fontFamily,
                        color: textColor,
                        textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                      }}
                      className="text-xs sm:text-sm font-black tracking-wide uppercase transition-transform group-hover:scale-105"
                    >
                      VIRAL
                    </span>
                    <span
                      style={{
                        fontFamily,
                        color: highlightColor,
                        backgroundColor: backgroundColor && backgroundColor !== "transparent" ? backgroundColor : undefined,
                        textShadow: `0 0 10px ${highlightColor}80`,
                      }}
                      className="text-xs sm:text-sm font-black tracking-wide uppercase px-1.5 py-0.5 rounded shadow-sm transition-transform group-hover:scale-110"
                    >
                      REEL
                    </span>
                  </div>
                </div>

                {/* Card Footer: Style Name & Font Family */}
                <div className="p-2.5 pt-2 border-t border-white/5 bg-[#090D18]/90">
                  <p className="text-xs font-black text-white truncate font-jakarta">
                    {key}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5 font-mono">
                    {fontFamily.split(",")[0].replace(/['"]/g, "")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredStyleKeys.length === 0 && (
          <div className="py-12 text-center space-y-2.5 rounded-2xl border border-dashed border-white/10 bg-[#070B14] p-6">
            <p className="text-sm font-bold text-slate-300">
              {activeCategory === "favorites"
                ? "No favorite caption styles saved yet."
                : `No caption styles found matching "${searchQuery}"`}
            </p>
            <p className="text-xs text-slate-500">
              {activeCategory === "favorites"
                ? "Click the star icon on any style card to add it to your favorites."
                : 'Try searching for keywords like "Bold", "Glow", or "Hormozi".'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#131B2E] px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-[#FF5722]/50 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
