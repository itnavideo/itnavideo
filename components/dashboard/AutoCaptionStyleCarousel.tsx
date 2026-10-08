"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  SHORTS_PRESET_ORDER,
  LONG_FORM_PRESET_ORDER,
  CaptionPreviewText,
  PREVIEW_CONFIG,
} from "@/components/ui/SubtitleStylePicker";
import previewTranscripts from "@/lib/cloudinary/autocaption-transcripts.json";
import { getPreviewCaptionAtTime, type SavedPreviewTranscript } from "@/lib/captions/previewTranscript";
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
}

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "viral-bold", label: "🔥 Bold / Viral" },
  { id: "kinetic", label: "⚡ Kinetic" },
  { id: "glow", label: "✨ Glow & Neon" },
  { id: "cinematic", label: "🎬 Cinematic" },
  { id: "podcast", label: "🎙️ Podcast" },
  { id: "educational", label: "🎓 Educational" },
  { id: "minimal", label: "💎 Minimal & Clean" },
  { id: "kids", label: "Kids Creators" },
  { id: "animation2d", label: "2D Animation" },
  { id: "animation3d", label: "3D Animation" },
  { id: "favorites", label: "★ Favorites" },
  { id: "all", label: "🌐 All 100 Styles" },
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

export interface StyleSectionDef {
  id: StyleCategory;
  title: string;
  badge: string;
  presets: string[];
}

export const STYLE_SECTIONS: StyleSectionDef[] = [
  {
    id: "viral-bold",
    title: "Bold & Viral Styles",
    badge: "🔥 High Retention",
    presets: Array.from(VIRAL_BOLD_PRESETS),
  },
  {
    id: "kinetic",
    title: "Kinetic & Karaoke Styles",
    badge: "⚡ Word-by-Word Motion",
    presets: Array.from(KINETIC_PRESETS),
  },
  {
    id: "glow",
    title: "Glow & Neon Styles",
    badge: "✨ Vibrant Illumination",
    presets: Array.from(GLOW_PRESETS),
  },
  {
    id: "cinematic",
    title: "Cinematic & Documentary",
    badge: "🎬 Broadcast Quality",
    presets: Array.from(CINEMATIC_PRESETS),
  },
  {
    id: "podcast",
    title: "Podcast & Keynote",
    badge: "🎙️ Studio Lecture",
    presets: Array.from(PODCAST_PRESETS),
  },
  {
    id: "educational",
    title: "Educational & Explainer",
    badge: "🎓 Clear Visual Pills",
    presets: Array.from(EDUCATIONAL_PRESETS),
  },
  {
    id: "minimal",
    title: "Minimal & Clean Pro",
    badge: "💎 Executive Elegance",
    presets: Array.from(MINIMAL_PRESETS),
  },
  {
    id: "kids",
    title: "Kids Creator Styles",
    badge: "Kids & Family Content",
    presets: Array.from(KIDS_PRESETS),
  },
  {
    id: "animation2d",
    title: "2D Animation Styles",
    badge: "Cartoons & Motion Graphics",
    presets: Array.from(ANIMATION_2D_PRESETS),
  },
  {
    id: "animation3d",
    title: "3D Creator Styles",
    badge: "Depth, Voxel & Cinema",
    presets: Array.from(ANIMATION_3D_PRESETS),
  },
];

export function getPresetCategoryLabel(key: string): string {
  if (VIRAL_BOLD_PRESETS.has(key)) return "Bold / Viral";
  if (KINETIC_PRESETS.has(key)) return "Kinetic";
  if (GLOW_PRESETS.has(key)) return "Glow";
  if (CINEMATIC_PRESETS.has(key)) return "Cinematic";
  if (PODCAST_PRESETS.has(key)) return "Podcast";
  if (EDUCATIONAL_PRESETS.has(key)) return "Educational";
  if (MINIMAL_PRESETS.has(key)) return "Minimal";
  if (KIDS_PRESETS.has(key)) return "Kids";
  if (ANIMATION_2D_PRESETS.has(key)) return "2D Animation";
  if (ANIMATION_3D_PRESETS.has(key)) return "3D Animation";
  return "Broadcast";
}

// Master list of all styles in canonical deduplicated order
export const ALL_STYLES_MASTER: string[] = Array.from(
  new Set([
    ...SHORTS_PRESET_ORDER,
    ...LONG_FORM_PRESET_ORDER,
    ...Object.keys(SUBTITLE_PRESETS),
  ])
);

// Registered Cloudinary preview videos, including the 19 new creator styles.
export const AUTOCAPTION_54_VIDEOS: string[] = [
  "ali-abdaal-clean-pill.mp4",
  "bbc-netflix-closed-captions.mp4",
  "cook.mp4",
  "crazy-2.mp4",
  "crazy.mp4",
  "creator-3.mp4",
  "cursive.mp4",
  "cyber-lime-pill.mp4",
  "devane-luxury-serif.mp4",
  "diary-of-a-ceo.mp4",
  "discipline.mp4",
  "estate.mp4",
  "gamer.mp4",
  "hormozi-viral-pop.mp4",
  "huberman-lab-lecture.mp4",
  "impact.mp4",
  "kinetic.mp4",
  "kurzgesagt-explainer.mp4",
  "lex-fridman-minimalist.mp4",
  "m3-dynamic-chip.mp4",
  "m3-elevated-card.mp4",
  "m3-tonal-pill.mp4",
  "master.mp4",
  "mkbhd-tech-studio.mp4",
  "mrbeast-16-9-punch.mp4",
  "mrbeast-shorts-impact.mp4",
  "opus-inverted-box.mp4",
  "punch.mp4",
  "red-wipe.mp4",
  "shorts-karaoke.mp4",
  "solo.mp4",
  "spark.mp4",
  "story.mp4",
  "submagic-glow.mp4",
  "vox-documentary.mp4",
  "rainbow-pop.mp4",
  "bubble-bounce.mp4",
  "storybook-spark.mp4",
  "crayon-caption.mp4",
  "candy-karaoke.mp4",
  "toon-word-pop.mp4",
  "comic-burst-2d.mp4",
  "cel-shade-2d.mp4",
  "anime-kinetic-2d.mp4",
  "flat-motion-2d.mp4",
  "pixel-pop-2d.mp4",
  "cutout-story-2d.mp4",
  "toy-block-3d.mp4",
  "depth-pop-3d.mp4",
  "chrome-bounce-3d.mp4",
  "holo-glass-3d.mp4",
  "neon-voxel-3d.mp4",
  "orbit-motion-3d.mp4",
  "cinema-depth-3d.mp4",
];

// Explicit mapping for top style presets to their dedicated video files
export const PRESET_TO_VIDEO_MAP: Record<string, string> = {
  // Top Creator & Viral Styles
  "Hormozi Viral Pop": "hormozi-viral-pop.mp4",
  "MrBeast Shorts Impact": "mrbeast-shorts-impact.mp4",
  "MrBeast 16:9 Punch": "mrbeast-16-9-punch.mp4",
  "Impact": "impact.mp4",
  "Bold Creator": "creator-3.mp4",
  "Kinetic": "kinetic.mp4",
  "Shorts Karaoke": "shorts-karaoke.mp4",
  "Crazy": "crazy.mp4",
  "Crazy 2": "crazy-2.mp4",
  "Cursive": "cursive.mp4",
  "Gamer": "gamer.mp4",
  "Submagic Glow": "submagic-glow.mp4",
  "Spark Glow": "spark.mp4",
  "Spark": "spark.mp4",
  "Vox Documentary": "vox-documentary.mp4",
  "BBC / Netflix Closed Captions": "bbc-netflix-closed-captions.mp4",
  "Studio Podcast": "solo.mp4",
  "Diary of a CEO": "diary-of-a-ceo.mp4",
  "Huberman Lab Lecture": "huberman-lab-lecture.mp4",
  "MKBHD Tech Studio": "mkbhd-tech-studio.mp4",
  "Kurzgesagt Explainer": "kurzgesagt-explainer.mp4",
  "M3 Tonal Pill": "m3-tonal-pill.mp4",
  "M3 Dynamic Chip": "m3-dynamic-chip.mp4",
  "M3 Elevated Card": "m3-elevated-card.mp4",
  "Minimal Clean": "ali-abdaal-clean-pill.mp4",
  "Lex Fridman Minimalist": "lex-fridman-minimalist.mp4",
  "Devane Luxury Serif": "devane-luxury-serif.mp4",
  "Ali Abdaal Clean Pill": "ali-abdaal-clean-pill.mp4",
  "Opus Inverted Box": "opus-inverted-box.mp4",
  "Cyber Lime Pill": "cyber-lime-pill.mp4",
  "Cook": "cook.mp4",
  "Discipline": "discipline.mp4",
  "Master": "master.mp4",
  "Punch": "punch.mp4",
  "Red Wipe": "red-wipe.mp4",
  "Estate": "estate.mp4",
  "Creator 3": "creator-3.mp4",
  "Story": "story.mp4",
  "Solo": "solo.mp4",

  // Moonshot Typography & Additional Presets
  "Blue Muse": "submagic-glow.mp4",
  "Headliner": "mrbeast-shorts-impact.mp4",
  "Chalk": "vox-documentary.mp4",
  "Gold Centre": "devane-luxury-serif.mp4",
  "Floodlight": "hormozi-viral-pop.mp4",
  "Storyline": "story.mp4",
  "The Difference": "ali-abdaal-clean-pill.mp4",
  "Action": "punch.mp4",
  "Stat Numbers": "kurzgesagt-explainer.mp4",
  "Sharp Yellow": "punch.mp4",
  "Ocean Blue": "ali-abdaal-clean-pill.mp4",
  "Screamer": "crazy.mp4",
  "Netflix Bar": "bbc-netflix-closed-captions.mp4",
  "Black Card": "m3-elevated-card.mp4",
  "Stock Green": "cyber-lime-pill.mp4",
  "Boardroom": "lex-fridman-minimalist.mp4",
  "Podcast Hype": "diary-of-a-ceo.mp4",
  "Hustle": "discipline.mp4",
  "Marigold": "mrbeast-shorts-impact.mp4",
  "Gold Pill": "devane-luxury-serif.mp4",
  "Midnight": "mkbhd-tech-studio.mp4",
  "Arctic Glow": "submagic-glow.mp4",
  "Studio Clean": "solo.mp4",
  "One Word": "hormozi-viral-pop.mp4",
  "Vollkorn": "vox-documentary.mp4",
  "Pop Candy": "spark.mp4",
  "Typewriter": "vox-documentary.mp4",
  "Bold Fire": "red-wipe.mp4",
  "Karaoke Fill": "shorts-karaoke.mp4",
  "Reels Clean": "ali-abdaal-clean-pill.mp4",
  "Bold Highlight Strip": "m3-dynamic-chip.mp4",
  "Shatter Drop": "impact.mp4",
  "Pill Bounce": "m3-tonal-pill.mp4",
  "Cinematic Docu": "vox-documentary.mp4",
  "Hacker Type": "cyber-lime-pill.mp4",
  "Marker Highlight": "huberman-lab-lecture.mp4",
  "Floating Serif": "devane-luxury-serif.mp4",
  "Metallic Gradient": "estate.mp4",
  "Neon Pulse": "spark.mp4",
  "Minimal Fade": "lex-fridman-minimalist.mp4",
  "Gradient Wave": "crazy-2.mp4",
  "Retro VHS": "gamer.mp4",
  "Handwritten": "cursive.mp4",
  "Glass Blur": "m3-elevated-card.mp4",
  "Split Color": "cook.mp4",
  "M3 Surface Outline": "m3-tonal-pill.mp4",
  "M3 Primary Container": "m3-dynamic-chip.mp4",
  "Warikoo Black Card": "m3-elevated-card.mp4",
  "Active Orange Pill": "m3-tonal-pill.mp4",
  "Rainbow Pop": "rainbow-pop.mp4",
  "Bubble Bounce": "bubble-bounce.mp4",
  "Storybook Spark": "storybook-spark.mp4",
  "Crayon Caption": "crayon-caption.mp4",
  "Candy Karaoke": "candy-karaoke.mp4",
  "Toon Word Pop": "toon-word-pop.mp4",
  "Comic Burst 2D": "comic-burst-2d.mp4",
  "Cel Shade 2D": "cel-shade-2d.mp4",
  "Anime Kinetic 2D": "anime-kinetic-2d.mp4",
  "Flat Motion 2D": "flat-motion-2d.mp4",
  "Pixel Pop 2D": "pixel-pop-2d.mp4",
  "Cutout Story 2D": "cutout-story-2d.mp4",
  "Toy Block 3D": "toy-block-3d.mp4",
  "Depth Pop 3D": "depth-pop-3d.mp4",
  "Chrome Bounce 3D": "chrome-bounce-3d.mp4",
  "Holo Glass 3D": "holo-glass-3d.mp4",
  "Neon Voxel 3D": "neon-voxel-3d.mp4",
  "Orbit Motion 3D": "orbit-motion-3d.mp4",
  "Cinema Depth 3D": "cinema-depth-3d.mp4",
};

const SAVED_PREVIEW_VIDEO_FILENAMES = Object.keys(
  previewTranscripts as Record<string, SavedPreviewTranscript>,
);

const SHORTS_STYLE_VIDEO_MAP: Record<string, string> = (() => {
  const assignments: Record<string, string> = {};
  const assignedVideos = new Set<string>();
  const styleKeys = Array.from(new Set(SHORTS_PRESET_ORDER));

  for (const key of styleKeys) {
    const preferredVideo = PRESET_TO_VIDEO_MAP[key];
    if (preferredVideo && (previewTranscripts as Record<string, any>)[preferredVideo] && !assignedVideos.has(preferredVideo)) {
      assignments[key] = preferredVideo;
      assignedVideos.add(preferredVideo);
    }
  }

  const remainingVideos = SAVED_PREVIEW_VIDEO_FILENAMES.filter((filename) => !assignedVideos.has(filename));
  let nextVideoIndex = 0;

  for (const key of styleKeys) {
    if (assignments[key]) continue;
    const nextVideo = remainingVideos[nextVideoIndex];
    if (!nextVideo) break;
    assignments[key] = nextVideo;
    nextVideoIndex += 1;
  }

  return assignments;
})();

function getCloudinaryPreviewAssetUrl(filename: string, transformation: string, extension: string): string {
  const savedTranscript = (previewTranscripts as Record<string, SavedPreviewTranscript>)[filename];
  const fallbackPublicId = `itnavideo-assets/autocaptionvideos/${filename.replace(/\.mp4$/i, "")}`;
  const publicId = savedTranscript?.publicId || fallbackPublicId;
  const encodedPublicId = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/dhouh9idx/video/upload/${transformation}/${encodedPublicId}.${extension}`;
}

export function getPresetVideoFilename(key: string, overrideIndex?: number): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.filename;
}

export function getPresetVideoUrl(key: string, overrideIndex?: number): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.previewVideoUrl;
}

export function getPresetPosterUrl(key: string, overrideIndex?: number): string {
  const item = getCaptionStyleCatalogItem(key);
  return item.posterUrl;
}

export function AutoCaptionStyleCarousel({
  selectedPresetKey,
  onSelectPreset,
  onHighlightColorChange,
  mode = "shorts",
  videoUrl,
}: AutoCaptionStyleCarouselProps) {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>("viral-bold");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Only play video when explicitly clicked (Zero background autoPlay to protect 4GB RAM & mobile speed)
  const [playingCardKey, setPlayingCardKey] = useState<string | null>(null);
  const [cardPlaybackTimes, setCardPlaybackTimes] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState<boolean>(true);

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

  // Compute all visible style keys directly in a single flat array
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

      // Favorites filter if favorites-only filter is active
      if (activeCategory === "favorites") {
        return favorites.has(key);
      }

      return true;
    });
  }, [masterList, searchQuery, activeCategory, favorites]);

  return (
    <div id="caption-style-gallery" className="w-full space-y-4 pt-2 select-none scroll-mt-6">
      {/* ── 1. Header: Title & Search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md shadow-[#FF6D00]/20">
            <Sparkles size={16} className="fill-black/20" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Available Caption Styles ({filteredStyleKeys.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Select any style to preview live on your video.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorites Filter Quick Toggle */}
          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === "favorites" ? "all" : "favorites")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeCategory === "favorites"
                ? "bg-amber-400 text-black shadow-md"
                : "bg-[#161720] text-slate-300 border border-white/10 hover:border-amber-400/50"
            }`}
          >
            <Star size={13} className={activeCategory === "favorites" ? "fill-black" : "text-amber-400 fill-amber-400/30"} />
            <span>Favorites ({favorites.size})</span>
          </button>

          {/* Search Bar 🔍 */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search styles or fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090A0F] pl-9 pr-8 py-1.5 text-xs font-medium text-white placeholder-slate-500 focus:border-[#FF6D00] focus:outline-none focus:ring-1 focus:ring-[#FF6D00]/40 transition"
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

      {/* ── 2. Unified 9:16 Style Grid (No Categories) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredStyleKeys.map((key) => {
          const isSelected = selectedPresetKey === key;
          const isPlaying = playingCardKey === key;
          const isFav = favorites.has(key);
          const presetData = SUBTITLE_PRESETS[key];
          if (!presetData) return null;

          const videoFilename = getPresetVideoFilename(key);
          const cloudinaryVideoUrl = getPresetVideoUrl(key);
          const cloudinaryPosterUrl = getPresetPosterUrl(key);

          const cardVideoSrc = videoUrl || cloudinaryVideoUrl;
          const cardPosterSrc = cloudinaryPosterUrl;
          const savedPreviewTranscript = videoUrl
            ? undefined
            : (previewTranscripts as Record<string, SavedPreviewTranscript>)[videoFilename];
          const cardPlaybackTime = cardPlaybackTimes[key] || 0;
          const cardCaption = getPreviewCaptionAtTime(savedPreviewTranscript, cardPlaybackTime);
          const cardCurrentWord = cardCaption?.words.find(
            (word) => cardPlaybackTime >= word.start && cardPlaybackTime <= word.end,
          );
          const isCardPreviewActive = isPlaying || isSelected;

          const presetOption = {
            key,
            label: presetData.name,
            style: presetData.style,
            font: presetData.fontFamily,
            textColor: presetData.textColor,
            highlightColor: presetData.highlightColor,
            bgColor: presetData.backgroundColor,
          };

          const previewConfig = PREVIEW_CONFIG[key] || {
            sampleLines: ["VIRAL CAPTIONS", "THAT POP"],
            activeWord: "VIRAL",
          };

          return (
            <div
              key={key}
              onClick={() => {
                onSelectPreset(key);
                if (onHighlightColorChange && presetData.highlightColor) {
                  onHighlightColorChange(presetData.highlightColor);
                }
                if (playingCardKey === key) {
                  setPlayingCardKey(null);
                } else {
                  setPlayingCardKey(key);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectPreset(key);
                  if (playingCardKey === key) {
                    setPlayingCardKey(null);
                  } else {
                    setPlayingCardKey(key);
                  }
                }
              }}
              className={`group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? "border-[#FF6D00] bg-[#161720] ring-2 ring-[#FF6D00]/50 shadow-xl shadow-[#FF6D00]/25 scale-[1.02] z-10"
                  : "border-white/10 bg-[#111218] hover:border-[#FF6D00]/40 hover:bg-[#161720] hover:-translate-y-0.5"
              }`}
            >
              {/* 9:16 Vertical Video / Style Preview Stage */}
              <div className="relative w-full aspect-[9/16] bg-[#090A0F] overflow-hidden flex flex-col items-center justify-center">
                {/* Real Video Playback for Caption Style */}
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
                  src={cardVideoSrc}
                  poster={cardPosterSrc}
                  playsInline
                  loop
                  muted={isMuted}
                  preload="metadata"
                  onTimeUpdate={(e) => {
                    const nextTime = Math.round(e.currentTarget.currentTime * 4) / 4;
                    setCardPlaybackTimes((current) => current[key] === nextTime
                      ? current
                      : { ...current, [key]: nextTime });
                  }}
                  className="h-full w-full object-cover"
                />

                {/* Center Play / Pause Action Button Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center z-25 transition-all duration-200 pointer-events-none ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-90 group-hover:scale-105"
                }`}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md border shadow-2xl transition-all ${
                    isPlaying
                      ? "bg-black/75 border-white/30 text-white hover:bg-red-500 hover:text-white hover:border-transparent"
                      : "bg-black/65 border-white/20 text-white group-hover:bg-gradient-to-r group-hover:from-[#FF6D00] group-hover:to-[#FF8F00] group-hover:text-black group-hover:border-transparent group-hover:scale-110"
                  }`}>
                    {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
                  </div>
                </div>

                {/* Top-Right Mute / Unmute Sound Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className={`absolute top-2.5 right-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md border transition cursor-pointer ${
                    !isMuted
                      ? "bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105"
                      : "bg-black/60 text-slate-300 border-white/20 hover:text-white hover:bg-black/80"
                  }`}
                  title={isMuted ? "Turn Sound ON" : "Turn Sound OFF (Muted)"}
                >
                  {!isMuted ? <Volume2 size={13} strokeWidth={2.5} /> : <VolumeX size={13} strokeWidth={2.5} />}
                </button>

                {/* Top-Left Status Badges (Active & Playing indicators) */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none z-30 flex flex-col items-start gap-1">
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6D00] px-2 py-0.5 text-[9px] font-black uppercase text-black shadow-md">
                      <Check size={10} strokeWidth={3.5} />
                      <span>Active</span>
                    </span>
                  )}
                  {isPlaying && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black uppercase text-black shadow-md animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      <span>Playing</span>
                    </span>
                  )}
                </div>

                {/* Favorite Star Button Overlay */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, key)}
                  className={`absolute bottom-2.5 right-2.5 z-30 flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-md border transition cursor-pointer ${
                    isFav
                      ? "bg-amber-400 text-black border-amber-300 shadow-md"
                      : "bg-black/50 text-slate-400 border-white/10 hover:text-amber-300 hover:bg-black/70"
                  }`}
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Star size={11} className={isFav ? "fill-black" : ""} />
                </button>

                {/* Dynamic Live Caption Text Overlay */}
                {isCardPreviewActive && cardCaption && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-x-2 bottom-[24%] z-20 flex justify-center px-1 text-center">
                      <CaptionPreviewText
                        preset={presetOption}
                        config={previewConfig}
                        chunk={cardCaption}
                        playbackTime={cardPlaybackTime}
                        isPlaying={isCardPreviewActive}
                        activeWord={cardCurrentWord?.word || cardCaption.activeWord}
                        currentWordObj={cardCurrentWord}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Card Footer Info */}
              <div className="flex items-center justify-between p-1.5 sm:p-2 bg-[#090A0F] border-t border-white/5 gap-1">
                <div className="min-w-0 flex-1 pr-1" title={key}>
                  <p className="text-[9px] sm:text-[10px] leading-snug font-black text-white tracking-tighter truncate">{key}</p>
                  <p className="text-[8px] sm:text-[8.5px] font-extrabold text-slate-400 truncate">
                    {getPresetCategoryLabel(key)}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-bold text-[#FF8F00] bg-[#FF6D00]/10 border border-[#FF6D00]/20 px-1.5 py-0.5 rounded-md shrink-0">
                  {isPlaying ? <Pause size={8} /> : <Play size={8} />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </div>
              </div>
            </div>
          );
              })}
      </div>

      {/* Empty State when Search returns no matches */}
      {filteredStyleKeys.length === 0 && (
        <div className="py-12 text-center space-y-2.5 rounded-2xl border border-dashed border-white/10 bg-[#0E1526]/60 p-6">
          <p className="text-sm font-bold text-slate-300">
            {activeCategory === "favorites"
              ? "No favorite caption styles saved yet."
              : `No caption styles found matching "${searchQuery}"`}
          </p>
          <p className="text-xs text-slate-500">
            {activeCategory === "favorites"
              ? "Click the star icon on any style card to add it to your favorites."
              : 'Try searching for keywords like "Bold", "Pill", "Glow", or "Hormozi".'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-[#FF6D00]/50 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

