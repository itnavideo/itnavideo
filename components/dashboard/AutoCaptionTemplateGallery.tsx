"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Flame,
  ArrowLeft,
  Star,
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  SHORTS_PRESET_ORDER,
  LONG_FORM_PRESET_ORDER,
} from "@/components/ui/SubtitleStylePicker";
import {
  ALL_STYLES_MASTER,
  CATEGORY_TABS,
  StyleCategory,
  VIRAL_BOLD_PRESETS,
  KINETIC_PRESETS,
  GLOW_PRESETS,
  CINEMATIC_PRESETS,
  PODCAST_PRESETS,
  EDUCATIONAL_PRESETS,
  MINIMAL_PRESETS,
  getPresetCategoryLabel,
  getPresetVideoUrl,
  getPresetPosterUrl,
} from "@/components/dashboard/AutoCaptionStyleCarousel";

export function AutoCaptionTemplateGallery() {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("itnavideo_favorite_caption_styles");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(
          "itnavideo_favorite_caption_styles",
          JSON.stringify(Array.from(next))
        );
      } catch {}
      return next;
    });
  };

  const allStyles = useMemo(() => {
    return Array.from(new Set([...SHORTS_PRESET_ORDER, ...LONG_FORM_PRESET_ORDER, ...ALL_STYLES_MASTER]));
  }, []);

  const filteredStyles = useMemo(() => {
    return allStyles.filter((key) => {
      const presetData = SUBTITLE_PRESETS[key];
      if (!presetData) return false;

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = key.toLowerCase().includes(q);
        const fontMatch = presetData.fontFamily?.toLowerCase().includes(q) || false;
        const styleMatch = presetData.style?.toLowerCase().includes(q) || false;
        if (!nameMatch && !fontMatch && !styleMatch) return false;
      }

      // Category Filter
      if (activeCategory === "favorites") return favorites.has(key);
      if (activeCategory === "viral-bold") return VIRAL_BOLD_PRESETS.has(key);
      if (activeCategory === "kinetic") return KINETIC_PRESETS.has(key);
      if (activeCategory === "glow") return GLOW_PRESETS.has(key);
      if (activeCategory === "cinematic") return CINEMATIC_PRESETS.has(key);
      if (activeCategory === "podcast") return PODCAST_PRESETS.has(key);
      if (activeCategory === "educational") return EDUCATIONAL_PRESETS.has(key);
      if (activeCategory === "minimal") return MINIMAL_PRESETS.has(key);

      return true;
    });
  }, [allStyles, searchQuery, activeCategory, favorites]);

  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-[#FF5722] selection:text-white">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/auto-caption"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1526] hover:bg-[#131B2E] hover:border-[#FF5722]/50 px-3.5 py-2 text-xs font-black text-slate-300 hover:text-white transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Studio</span>
            </Link>

            <div>
              <h1 className="text-lg sm:text-2xl font-black text-white font-jakarta flex items-center gap-2">
                100+ Caption Template{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
                  Gallery
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Browse full demo videos for every creator caption style. Click any style to use it in studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search 100+ styles or fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0E1526] pl-9 pr-8 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <Link
              href="/dashboard/auto-caption"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2 text-xs font-black text-black shadow-lg shadow-[#FF5722]/20 hover:brightness-110 active:scale-95 transition"
            >
              <span>Open Studio</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1700px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/20 scale-[1.02]"
                  : "bg-[#0E1526] text-slate-300 border border-white/10 hover:border-white/25 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Grid (9:16 Cards with Lazy Video Playback) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredStyles.map((key) => {
            const isPlaying = playingKey === key;
            const isFav = favorites.has(key);
            const videoSrc = getPresetVideoUrl(key);
            const posterSrc = getPresetPosterUrl(key);
            const categoryLabel = getPresetCategoryLabel(key);
            const presetData = SUBTITLE_PRESETS[key];

            return (
              <div
                key={key}
                onMouseEnter={() => setPlayingKey(key)}
                onMouseLeave={() => setPlayingKey(null)}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0E1526] hover:border-[#FF5722]/50 transition-all duration-200 overflow-hidden shadow-xl hover:-translate-y-1"
              >
                {/* 9:16 Video Player Container */}
                <div className="relative aspect-[9/16] w-full bg-[#000000] overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) {
                        if (isPlaying) el.play().catch(() => {});
                        else {
                          el.pause();
                          el.currentTime = 0;
                        }
                      }
                    }}
                    src={videoSrc}
                    poster={posterSrc}
                    playsInline
                    loop
                    muted={isMuted}
                    preload="none"
                    className="h-full w-full object-cover"
                  />

                  {/* Top Badges: Category & Favorite */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-20">
                    <span className="rounded-md bg-black/80 backdrop-blur-md border border-white/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-200">
                      {categoryLabel}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, key)}
                      className={`pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full transition cursor-pointer ${
                        isFav
                          ? "bg-amber-400 text-black shadow-md"
                          : "bg-black/60 text-slate-400 hover:text-amber-300"
                      }`}
                      title={isFav ? "Remove Favorite" : "Add Favorite"}
                    >
                      <Star size={11} className={isFav ? "fill-black" : ""} />
                    </button>
                  </div>

                  {/* Center Play Button indicator */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-transform group-hover:scale-110">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:bg-[#FF5722] group-hover:text-black group-hover:border-transparent shadow-lg">
                        <Play size={16} className="fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Mute Button when playing */}
                  {isPlaying && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="absolute top-2.5 right-10 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white border border-white/20 hover:bg-emerald-500 hover:text-black transition cursor-pointer"
                    >
                      {!isMuted ? <Volume2 size={11} /> : <VolumeX size={11} />}
                    </button>
                  )}
                </div>

                {/* Card Footer with Details & Use Style CTA */}
                <div className="p-3 bg-[#0E1526] space-y-2 border-t border-white/5">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate font-jakarta">
                      {key}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 truncate font-mono">
                      {presetData?.fontFamily ? presetData.fontFamily.split(",")[0].replace(/['"]/g, "") : "Preset Font"}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/auto-caption?style_id=${encodeURIComponent(key)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] py-2 text-[11px] font-black text-black shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    <span>Use This Style</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredStyles.length === 0 && (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-white/10 bg-[#0E1526] p-8">
            <p className="text-sm font-bold text-slate-200">
              No caption styles found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-400">
              Try searching for keywords like &quot;Hormozi&quot;, &quot;MrBeast&quot;, &quot;Glow&quot;, or &quot;Podcast&quot;.
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
      </main>
    </div>
  );
}
