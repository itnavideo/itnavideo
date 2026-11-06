/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  Video,
  Smartphone,
  Check,
  Loader2,
  Play,
  Pause,
  Layers,
  Music,
  Volume2,
  FileText,
  Eye,
  X,
  Wand2,
  Scissors,
  ZoomIn,
  Plus,
  ArrowUp,
  ArrowDown,
  Sliders,
  Activity,
  CornerDownLeft,
  Calculator,
  Columns,
  Clock,
  Search,
  ShieldCheck,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { KINETIC_STYLES } from "@/lib/captions/kineticStyles";
import { BROADCAST_PRESETS } from "@/components/dashboard/subpages/YoutubeSubtitlesPageClient";

// Master AWS S3 Production Background Music Library (13+ Curated Tracks)
export const AWS_SHORTS_BGM_TRACKS = [
  { id: "parasail", label: "Calm Lofi (Recommended)", category: "Lo-Fi", path: "assets/reusable/music/parasail-silent-partner.mp3", desc: "Warm acoustic lofi guitar" },
  { id: "19th-floor", label: "Deep Focus & Ambient", category: "Piano", path: "assets/reusable/music/19th-floor-bobby-richards.mp3", desc: "Inspiring subtle piano tone" },
  { id: "dutty-vibe", label: "Optimistic Beat", category: "Upbeat", path: "assets/reusable/music/dutty-vibe-tracks.mp3", desc: "Gentle positive acoustic rhythm" },
  { id: "book-rental", label: "Energetic Narrative", category: "Story", path: "assets/reusable/music/book-the-rental-wit-it-rage.mp3", desc: "Dynamic narrative flow" },
  { id: "crimson-fly", label: "Cinematic Drama", category: "Cinematic", path: "assets/reusable/music/crimson-fly-huma-huma.mp3", desc: "Emotional documentary drive" },
  { id: "crock-pot", label: "Funky Chill Groove", category: "Chill", path: "assets/reusable/music/crock-pot-diamond-ortiz.mp3", desc: "Playful lofi pulse" },
  { id: "illusions", label: "Modern Swagger Beat", category: "Beats", path: "assets/reusable/music/illusions-anno-domini-beats.mp3", desc: "Modern high-production beat" },
  { id: "not-for-nothing", label: "Lounge Instrumental", category: "Lounge", path: "assets/reusable/music/not-for-nothing-otis-mcdonald.mp3", desc: "Smooth brass & relaxed tempo" },
  { id: "something-going", label: "Philosophical Mystery", category: "Deep", path: "assets/reusable/music/something-is-going-on-godmode.mp3", desc: "Pensive intrigue & discovery" },
  { id: "bar-scene", label: "Acoustic Folk Narrative", category: "Acoustic", path: "assets/reusable/music/that-one-bar-scene-rkvc.mp3", desc: "Warm acoustic guitar storytelling" },
  { id: "true-messiah", label: "Victorious Inspiration", category: "Epic", path: "assets/reusable/music/true-messiah-dj-freedem.mp3", desc: "Triumphant motivational melody" },
  { id: "vishnu", label: "Zen Reflection", category: "Zen", path: "assets/reusable/music/vishnu-patrick-patrikios.mp3", desc: "Serene ambient meditation" },
  { id: "what-it-is", label: "Smooth Motown", category: "Motown", path: "assets/reusable/music/what-it-is-silent-partner.mp3", desc: "Catchy positive baseline" },
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure video audio only" },
];

export interface UploadedMediaItem {
  id: string;
  file: File;
  type: "video" | "image";
  previewUrl: string;
  name: string;
  size: number;
  durationSeconds?: number;
  trimStart?: number;
  trimEnd?: number;
}

export type OverlayPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";

export interface UploadedLayerItem {
  id: string;
  file: File;
  type: "image" | "video";
  previewUrl: string;
  name: string;
  title: string;
  position?: OverlayPosition;
  isCutaway?: boolean;
  startSeconds?: number;
  durationSeconds?: number;
}

export interface ArrowCalloutConfig {
  enabled: boolean;
  label: string;
  direction: "down-left" | "down-right" | "up-right" | "up-left";
  color: string;
  atSeconds: number;
  durationSeconds?: number;
}

export interface EquationFormulaConfig {
  enabled: boolean;
  step1: { value: string; label: string; accentColor?: string };
  operator1: string;
  step2: { value: string; label: string; accentColor?: string };
  operator2: string;
  result: { value: string; label: string; accentColor?: string };
  atSeconds: number;
  durationSeconds?: number;
}

export interface ComparisonBannerConfig {
  enabled: boolean;
  left: { tag: string; title: string; description?: string; isWinner?: boolean };
  right: { tag: string; title: string; description?: string; isWinner?: boolean };
  atSeconds: number;
  durationSeconds?: number;
}

export interface AiShortsPolisherStudioProps {
  primaryMediaList: UploadedMediaItem[];
  onPrimaryMediaListChange: (items: UploadedMediaItem[]) => void;

  overlayLayerList: UploadedLayerItem[];
  onOverlayLayerListChange: (items: UploadedLayerItem[]) => void;

  videoTitle: string;
  onVideoTitleChange: (val: string) => void;

  silenceJumpCuts: boolean;
  onSilenceJumpCutsChange: (val: boolean) => void;

  silenceSensitivity: "tight" | "normal" | "gentle";
  onSilenceSensitivityChange: (val: "tight" | "normal" | "gentle") => void;

  smartPunchIns: boolean;
  onSmartPunchInsChange: (val: boolean) => void;

  punchInIntensity: "subtle" | "medium" | "dramatic";
  onPunchInIntensityChange: (val: "subtle" | "medium" | "dramatic") => void;

  captionStyle: string;
  onCaptionStyleChange: (val: string) => void;

  captionPosition?: "bottom" | "center" | "top";
  onCaptionPositionChange?: (val: "bottom" | "center" | "top") => void;

  faceFraming?: "center" | "left" | "right";
  onFaceFramingChange?: (val: "center" | "left" | "right") => void;

  bgmTrackId: string;
  onBgmTrackIdChange: (val: string) => void;

  bgmVolume: number;
  onBgmVolumeChange: (val: number) => void;

  customBgmFile: File | null;
  onCustomBgmFileSelect: (file: File | null) => void;

  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  editorialTranscript: string;
  onEditorialTranscriptChange: (val: string) => void;

  // Visual Callout Cards
  curvedArrowConfig?: ArrowCalloutConfig;
  onCurvedArrowConfigChange?: (val: ArrowCalloutConfig) => void;

  equationFormulaConfig?: EquationFormulaConfig;
  onEquationFormulaConfigChange?: (val: EquationFormulaConfig) => void;

  comparisonBannerConfig?: ComparisonBannerConfig;
  onComparisonBannerConfigChange?: (val: ComparisonBannerConfig) => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export function AiShortsPolisherStudio({
  primaryMediaList = [],
  onPrimaryMediaListChange,
  overlayLayerList = [],
  onOverlayLayerListChange,
  videoTitle = "",
  onVideoTitleChange,
  silenceJumpCuts = true,
  onSilenceJumpCutsChange,
  silenceSensitivity = "tight",
  onSilenceSensitivityChange,
  smartPunchIns = true,
  onSmartPunchInsChange,
  punchInIntensity = "medium",
  onPunchInIntensityChange,
  captionStyle = "Pop Word",
  onCaptionStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  faceFraming = "center",
  onFaceFramingChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile = null,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript = "",
  onEditorialTranscriptChange,
  curvedArrowConfig = {
    enabled: false,
    label: "LOOK HERE",
    direction: "down-left",
    color: "#EF4444",
    atSeconds: 3,
    durationSeconds: 3,
  },
  onCurvedArrowConfigChange,
  equationFormulaConfig = {
    enabled: false,
    step1: { value: "HOOK", label: "0-3s", accentColor: "#38BDF8" },
    operator1: "+",
    step2: { value: "STORY", label: "RETENTION", accentColor: "#FACC15" },
    operator2: "=",
    result: { value: "VIRAL", label: "1M+ VIEWS", accentColor: "#22C55E" },
    atSeconds: 5,
    durationSeconds: 4,
  },
  onEquationFormulaConfigChange,
  comparisonBannerConfig = {
    enabled: false,
    left: { tag: "BORING", title: "Raw Take", description: "Awkward pauses & silence", isWinner: false },
    right: { tag: "VIRAL", title: "AI Polished", description: "Punch-ins & viral captions", isWinner: true },
    atSeconds: 8,
    durationSeconds: 4,
  },
  onComparisonBannerConfigChange,
  onGenerate,
  isGenerating,
}: AiShortsPolisherStudioProps) {
  // Safe-Zone Guide Toggle
  const [showSafeZoneGuide, setShowSafeZoneGuide] = useState<boolean>(false);

  // Caption categories & search
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>("");

  // Combine broadcast styles + kinetic styles
  const combinedSubtitleStyles = useMemo(() => {
    const list: Array<{ id: string; name: string; category: string; desc?: string; badge?: string; textColor?: string; highlightColor?: string }> = [];

    // 1. Add Broadcast Presets
    BROADCAST_PRESETS.forEach((p) => {
      list.push({
        id: p.id,
        name: p.id,
        category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Broadcast",
        desc: p.desc,
        badge: p.badge,
        textColor: p.textColor,
        highlightColor: p.highlightColor,
      });
    });

    // 2. Add Kinetic Styles
    KINETIC_STYLES.forEach((k) => {
      if (!list.some((item) => item.name.toLowerCase() === k.name.toLowerCase())) {
        list.push({
          id: k.id,
          name: k.name,
          category: k.category || "Kinetic",
          desc: "Dynamic motion highlight",
          badge: "Shorts",
        });
      }
    });

    return list;
  }, []);

  const filteredCaptionStyles = useMemo(() => {
    let result = combinedSubtitleStyles;
    if (captionCategoryTab !== "All") {
      result = result.filter((s) => s.category.toLowerCase() === captionCategoryTab.toLowerCase());
    }
    if (captionSearchQuery.trim()) {
      const q = captionSearchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || (s.desc && s.desc.toLowerCase().includes(q)));
    }
    return result;
  }, [combinedSubtitleStyles, captionCategoryTab, captionSearchQuery]);

  // Audio audition state
  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: typeof AWS_SHORTS_BGM_TRACKS[0]) => {
    if (track.path === "none") return;
    if (auditioningTrack === track.id) {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
      setAuditioningTrack(null);
    } else {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
      }
      const audio = new Audio(`https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/${track.path}`);
      audio.volume = Math.max(0.05, Math.min(1, bgmVolume * 2));
      audio.play().catch(() => { });
      audio.onended = () => setAuditioningTrack(null);
      audioAuditionRef.current = audio;
      setAuditioningTrack(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  // Primary media handlers with Object URL cleanup
  const handlePrimaryMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedMediaItem[] = Array.from(files).map((f: File): UploadedMediaItem => {
      const url = URL.createObjectURL(f);
      return {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        type: (f.type.startsWith("image/") ? "image" : "video") as "image" | "video",
        previewUrl: url,
        name: f.name,
        size: f.size,
        trimStart: 0,
        trimEnd: 0,
      };
    });

    onPrimaryMediaListChange([...primaryMediaList, ...newItems]);
    if (e.target) e.target.value = "";
  };

  const removePrimaryMedia = (id: string) => {
    const target = primaryMediaList.find((m) => m.id === id);
    if (target?.previewUrl) {
      try {
        URL.revokeObjectURL(target.previewUrl);
      } catch { }
    }
    onPrimaryMediaListChange(primaryMediaList.filter((m) => m.id !== id));
  };

  // Reorder primary takes (Move Up / Down)
  const moveMediaUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...primaryMediaList];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    onPrimaryMediaListChange(copy);
  };

  const moveMediaDown = (idx: number) => {
    if (idx >= primaryMediaList.length - 1) return;
    const copy = [...primaryMediaList];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    onPrimaryMediaListChange(copy);
  };

  // Overlay layer handlers (PIP callouts & Cutaways)
  const handleLayerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newLayers: UploadedLayerItem[] = Array.from(files).map((f: File): UploadedLayerItem => ({
      id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      type: (f.type.startsWith("video/") ? "video" : "image") as "image" | "video",
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      title: f.name.replace(/\.[^/.]+$/, ""),
      position: "top-right",
      isCutaway: false,
      startSeconds: 3,
      durationSeconds: 3.5,
    }));

    onOverlayLayerListChange([...overlayLayerList, ...newLayers]);
    if (e.target) e.target.value = "";
  };

  const removeLayerItem = (id: string) => {
    const target = overlayLayerList.find((l) => l.id === id);
    if (target?.previewUrl) {
      try {
        URL.revokeObjectURL(target.previewUrl);
      } catch { }
    }
    onOverlayLayerListChange(overlayLayerList.filter((l) => l.id !== id));
  };

  // Clean up all object URLs when unmounting
  useEffect(() => {
    return () => {
      primaryMediaList.forEach((m) => {
        if (m.previewUrl) {
          try {
            URL.revokeObjectURL(m.previewUrl);
          } catch { }
        }
      });
      overlayLayerList.forEach((l) => {
        if (l.previewUrl) {
          try {
            URL.revokeObjectURL(l.previewUrl);
          } catch { }
        }
      });
    };
  }, []);

  // Quick word replace tool
  const [wordToFind, setWordToFind] = useState("");
  const [wordToReplace, setWordToReplace] = useState("");
  const [replaceNotice, setReplaceNotice] = useState<string | null>(null);

  const applyWordReplacement = () => {
    if (!wordToFind.trim()) return;
    const pattern = new RegExp(wordToFind.trim(), "gi");
    const updated = editorialTranscript.replace(pattern, wordToReplace.trim());
    if (updated !== editorialTranscript) {
      onEditorialTranscriptChange(updated);
      setReplaceNotice(`Replaced "${wordToFind}" with "${wordToReplace}"`);
      setTimeout(() => setReplaceNotice(null), 3000);
      setWordToFind("");
      setWordToReplace("");
    } else {
      setReplaceNotice(`"${wordToFind}" not found in transcript.`);
      setTimeout(() => setReplaceNotice(null), 3000);
    }
  };

  // Visual Callouts Section Tab
  const [calloutTab, setCalloutTab] = useState<"arrows" | "formula" | "comparison">("arrows");

  const activePrimary = primaryMediaList[0];
  const activeOverlay = overlayLayerList[0];
  const hasMedia = primaryMediaList.length > 0;

  // Real-time calculated punch-in scale for live preview
  const liveZoomScale = smartPunchIns
    ? punchInIntensity === "subtle"
      ? 1.05
      : punchInIntensity === "dramatic"
        ? 1.18
        : 1.12
    : 1.0;

  const objectPositionStyle =
    faceFraming === "left" ? "left center" : faceFraming === "right" ? "right center" : "center center";

  return (
    <div className="w-full space-y-8 text-white font-sans">
      {/* Top Banner: Dark Modern Header */}
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#1E132D] to-[#0D0A14] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-400">
              <Smartphone size={13} className="text-purple-400" />
              <span>9:16 Vertical Only • AI Shorts &amp; Reels Co-Pilot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              AI Shorts &amp; Reels Polisher
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Turn raw talking selfie clips and multi-take vertical shoots into high-retention Shorts, Reels, and TikToks. Auto-trims breath pauses, triggers punch-in camera cuts, layers floating callouts, and styles 40+ viral subtitle presets with ducked audio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-[#1A1224] px-4 py-3 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Duration &amp; Cost</span>
              <span className="text-base font-black text-white">Up to 90s • Flat 1 Credit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (7 cols) | Right 9:16 Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 0: Project Title */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-3">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
              Shorts Title (Optional)
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => onVideoTitleChange(e.target.value)}
              placeholder="e.g., The 1 Secret to 100k Followers..."
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-zinc-900/90 text-white placeholder:text-zinc-500 text-xs font-medium focus:border-purple-400 focus:outline-none transition shadow-inner"
            />
          </div>

          {/* Section 1: Primary Full-Screen 9:16 Media with Reordering & Face Framing */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">1. Primary 9:16 Video Takes</h3>
                  <p className="text-xs text-zinc-400">Upload multiple camera takes, reorder, or trim dead air</p>
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-white/5">
                {primaryMediaList.length} Clip{primaryMediaList.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Face-Framing Alignment Control */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Face-Framing Alignment</span>
                <span className="text-[10px] text-zinc-400 block">Centers speaker if sitting off-center in the crop</span>
              </div>
              <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => onFaceFramingChange?.("left")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition ${faceFraming === "left" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                  title="Align left"
                >
                  <AlignLeft size={12} />
                  <span>Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFaceFramingChange?.("center")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition ${faceFraming === "center" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                  title="Align center"
                >
                  <AlignCenter size={12} />
                  <span>Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFaceFramingChange?.("right")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition ${faceFraming === "right" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-400 hover:text-white"
                    }`}
                  title="Align right"
                >
                  <AlignRight size={12} />
                  <span>Right</span>
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <label className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-900/60 hover:bg-purple-500/5 p-6 text-center transition cursor-pointer group">
              <input
                type="file"
                multiple
                accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg"
                onChange={handlePrimaryMediaSelect}
                className="hidden"
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 border border-white/10 shadow-md text-purple-400 group-hover:scale-105 transition mb-2">
                <Upload size={18} />
              </div>
              <p className="text-xs font-bold text-zinc-200">
                Drop raw 9:16 vertical video takes here, or <span className="text-purple-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Supports multi-take vertical shoots up to 90 seconds (1080×1920 MP4)</p>
            </label>

            {/* List of uploaded primary clips with Reorder & Trim */}
            {primaryMediaList.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-1">
                  <span>Take Order &amp; Trims (Drag or Use Arrows)</span>
                  <span>{primaryMediaList.length} Total Clips</span>
                </div>

                {primaryMediaList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/80 p-3.5 transition hover:border-white/20"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveMediaUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition"
                          title="Move take earlier"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMediaDown(idx)}
                          disabled={idx === primaryMediaList.length - 1}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition"
                          title="Move take later"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[11px] font-black shrink-0">
                        {idx + 1}
                      </span>

                      {item.type === "video" ? (
                        <div className="h-14 w-10 rounded-md bg-black overflow-hidden shrink-0 border border-white/10">
                          <video src={item.previewUrl} className="h-full w-full object-cover" muted />
                        </div>
                      ) : (
                        <div className="h-14 w-10 rounded-md bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                          <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">{(item.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    </div>

                    {/* Trim Markers */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-[11px] bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <Clock size={12} className="text-zinc-400" />
                        <span className="text-zinc-400">Trim In:</span>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.trimStart || 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const updated = primaryMediaList.map((m) =>
                              m.id === item.id ? { ...m, trimStart: Math.max(0, val) } : m
                            );
                            onPrimaryMediaListChange(updated);
                          }}
                          className="w-12 px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-white text-center font-mono text-[10px] focus:outline-none focus:border-purple-400"
                        />
                        <span className="text-zinc-500">s</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePrimaryMedia(item.id)}
                        className="p-1.5 rounded-lg border border-white/10 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition cursor-pointer"
                        title="Remove take"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Overlay Layers with Custom Positioning & Cutaway Mode */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">2. Overlay Layers (PIP or Full Cutaway)</h3>
                  <p className="text-xs text-zinc-400">Floating reaction clips, evidence photos, or full-screen B-roll cutaways</p>
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-white/5">
                {overlayLayerList.length} Layer{overlayLayerList.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Layer Upload Area */}
            <label className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-900/60 hover:bg-purple-500/5 p-5 text-center transition cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,video/mp4"
                onChange={handleLayerSelect}
                className="hidden"
              />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 border border-white/10 shadow-md text-purple-400 group-hover:scale-105 transition mb-1.5">
                <Plus size={17} />
              </div>
              <p className="text-xs font-bold text-zinc-200">
                Add PIP overlay layers (Images or Videos)
              </p>
              <p className="text-[11px] text-zinc-500">Pick corner position (Top-Right, Top-Left, Bottom, or Center)</p>
            </label>

            {/* List of uploaded layers with Position & Cutaway Selector */}
            {overlayLayerList.length > 0 && (
              <div className="space-y-3 pt-1">
                {overlayLayerList.map((layer, idx) => (
                  <div
                    key={layer.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/80 p-3.5 transition hover:border-white/20"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[11px] font-black shrink-0">
                        L{idx + 1}
                      </span>
                      {layer.type === "video" ? (
                        <div className="h-14 w-10 rounded-md bg-black overflow-hidden shrink-0 border border-white/10">
                          <video src={layer.previewUrl} className="h-full w-full object-cover" muted />
                        </div>
                      ) : (
                        <div className="h-14 w-10 rounded-md bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                          <img src={layer.previewUrl} alt={layer.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <input
                          type="text"
                          value={layer.title}
                          onChange={(e) => {
                            const updated = overlayLayerList.map((l) =>
                              l.id === layer.id ? { ...l, title: e.target.value } : l
                            );
                            onOverlayLayerListChange(updated);
                          }}
                          placeholder="Overlay label..."
                          className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-purple-400 focus:outline-none truncate w-full"
                        />
                        <p className="text-[10px] text-purple-400 font-semibold">
                          {layer.isCutaway ? "Full-Screen B-Roll Cutaway" : "Picture-in-Picture Callout"}
                        </p>
                      </div>
                    </div>

                    {/* Cutaway Toggle & Position Selector */}
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-1.5 bg-zinc-800 px-2 py-1.5 rounded-lg border border-white/10 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(layer.isCutaway)}
                          onChange={(e) => {
                            const updated = overlayLayerList.map((l) =>
                              l.id === layer.id ? { ...l, isCutaway: e.target.checked } : l
                            );
                            onOverlayLayerListChange(updated);
                          }}
                          className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 h-3 w-3"
                        />
                        <span className="text-[10px] font-bold text-zinc-300">Cutaway</span>
                      </label>

                      {!layer.isCutaway && (
                        <select
                          value={layer.position || "top-right"}
                          onChange={(e) => {
                            const updated = overlayLayerList.map((l) =>
                              l.id === layer.id ? { ...l, position: e.target.value as OverlayPosition } : l
                            );
                            onOverlayLayerListChange(updated);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-[11px] font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
                        >
                          <option value="top-right">Top-Right</option>
                          <option value="top-left">Top-Left</option>
                          <option value="bottom-right">Bottom-Right</option>
                          <option value="bottom-left">Bottom-Left</option>
                          <option value="center">Center / Split</option>
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => removeLayerItem(layer.id)}
                        className="p-1.5 rounded-lg border border-white/10 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition cursor-pointer"
                        title="Remove layer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Smart AI Editing Toggles with Sensitivity & Strength */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Scissors size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-sans">3. Smart Pacing &amp; Camera Cuts</h3>
                <p className="text-xs text-zinc-400">Shorts silence removal sensitivity and dynamic camera punch-ins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Silence Cutter with Sensitivity Pills */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={silenceJumpCuts}
                    onChange={(e) => onSilenceJumpCutsChange(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-purple-500 focus:ring-purple-500 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-black text-white block">Auto Silence &amp; Gap Cutter</span>
                    <span className="text-[11px] text-zinc-400 leading-snug block mt-0.5">
                      Trims dead air and pauses for high TikTok/Shorts retention.
                    </span>
                  </div>
                </label>

                {silenceJumpCuts && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Cut Sensitivity</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["tight", "normal", "gentle"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => onSilenceSensitivityChange(mode)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize transition border ${silenceSensitivity === mode
                              ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                              : "bg-zinc-800/80 text-zinc-400 border-white/5 hover:text-white"
                            }`}
                        >
                          {mode === "tight" ? "Tight (Shorts)" : mode === "normal" ? "Normal" : "Gentle (Pod)"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Smart Camera Punch-In with Intensity Pills */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smartPunchIns}
                    onChange={(e) => onSmartPunchInsChange(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-purple-500 focus:ring-purple-500 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-black text-white block">Smart Camera Punch-Ins</span>
                    <span className="text-[11px] text-zinc-400 leading-snug block mt-0.5">
                      Dynamic zoom cuts on sentence beats to eliminate drop-off.
                    </span>
                  </div>
                </label>

                {smartPunchIns && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Zoom Strength</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["subtle", "medium", "dramatic"] as const).map((intensity) => (
                        <button
                          key={intensity}
                          type="button"
                          onClick={() => onPunchInIntensityChange(intensity)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize transition border ${punchInIntensity === intensity
                              ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                              : "bg-zinc-800/80 text-zinc-400 border-white/5 hover:text-white"
                            }`}
                        >
                          {intensity === "subtle" ? "Subtle (+5%)" : intensity === "medium" ? "Standard (+12%)" : "Dramatic (+18%)"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Subtitle Presets & Vertical Position Placement */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">4. Subtitle Styles &amp; Position</h3>
                  <p className="text-xs text-zinc-400">Viral bold presets with vertical screen position choice</p>
                </div>
              </div>

              {/* Vertical Position Choice */}
              <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                {(["top", "center", "bottom"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => onCaptionPositionChange?.(pos)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${captionPosition === pos
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                      }`}
                  >
                    {pos === "top" ? "Upper 1/3" : pos === "center" ? "Center" : "Lower Safe"}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={captionSearchQuery}
                  onChange={(e) => setCaptionSearchQuery(e.target.value)}
                  placeholder="Search styles (e.g. Hormozi, MrBeast, Karaoke, Minimal)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-white/5 pb-1">
                {["All", "Viral Bold", "Podcast", "Cinematic", "Minimal", "Kinetic"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCaptionCategoryTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${captionCategoryTab.toLowerCase() === tab.toLowerCase()
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCaptionStyles.map((style) => {
                const isSelected = captionStyle === style.name;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onCaptionStyleChange(style.name)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition relative cursor-pointer ${isSelected
                        ? "border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/30"
                        : "border-white/5 bg-zinc-900/80 hover:bg-zinc-800 hover:border-white/20"
                      }`}
                  >
                    <span className="text-xs font-black text-white leading-tight line-clamp-1">{style.name}</span>
                    <div className="mt-2 flex items-center justify-between w-full">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">{style.category}</span>
                      {isSelected && <Check size={13} className="text-purple-400 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Background Music & Audio Level (12% Default) */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Music size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">5. Background Music &amp; Audio Level</h3>
                  <p className="text-xs text-zinc-400">13+ cloud tracks ducked to 12% so voiceover stays completely clear</p>
                </div>
              </div>

              {/* SFX Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  checked={enableSfx}
                  onChange={(e) => onEnableSfxChange(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-purple-500 focus:ring-purple-500 h-3.5 w-3.5"
                />
                <span className="text-xs font-bold text-zinc-300">SFX Pops &amp; Whooshes</span>
              </label>
            </div>

            {/* Volume Slider */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Volume2 size={15} className="text-purple-400" />
                  Background Music Volume
                </span>
                <span className="font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-400/20">
                  {Math.round(bgmVolume * 100)}% (12% Default)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={bgmVolume}
                onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                <span>0% (Muted)</span>
                <span className="text-purple-400 font-bold">12% Voice Safe</span>
                <span>40% Loud</span>
              </div>
            </div>

            {/* Curated BGM Library */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {AWS_SHORTS_BGM_TRACKS.map((track) => {
                const isSelected = bgmTrackId === track.id;
                const isPlaying = auditioningTrack === track.id;

                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition ${isSelected
                        ? "border-purple-500 bg-purple-500/15 ring-1 ring-purple-500/30"
                        : "border-white/5 bg-zinc-900/80 hover:bg-zinc-800"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => onBgmTrackIdChange(track.id)}
                      className="text-left min-w-0 flex-1 mr-2 cursor-pointer"
                    >
                      <p className="text-xs font-bold text-white truncate">{track.label}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{track.desc}</p>
                    </button>

                    {track.path !== "none" && (
                      <button
                        type="button"
                        onClick={() => toggleAudition(track)}
                        className={`p-1.5 rounded-lg border transition shrink-0 cursor-pointer ${isPlaying
                            ? "bg-purple-600 text-white border-purple-500 animate-pulse"
                            : "bg-zinc-800 text-zinc-300 border-white/10 hover:text-white"
                          }`}
                        title={isPlaying ? "Pause preview" : "Play preview"}
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom BGM Upload */}
            <div className="pt-1">
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">Or Upload Custom Background Music</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 cursor-pointer transition shadow-sm">
                  <Upload size={14} className="text-purple-400" />
                  <span>Choose MP3 / WAV</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onCustomBgmFileSelect(file);
                    }}
                    className="hidden"
                  />
                </label>
                {customBgmFile && (
                  <span className="text-xs font-semibold text-emerald-400 truncate max-w-xs">
                    ✓ {customBgmFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Spoken Narration & Word-Level Transcript Corrector */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">6. Spoken Dialogue &amp; Word-Level Corrector</h3>
                  <p className="text-xs text-zinc-400">Correct misheard creator names or brand names while keeping audio timing</p>
                </div>
              </div>
            </div>

            <textarea
              rows={3}
              value={editorialTranscript}
              onChange={(e) => onEditorialTranscriptChange(e.target.value)}
              placeholder="Paste or review the spoken script here to fix typos, jargon, or brand names..."
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 text-xs font-mono focus:border-purple-400 focus:outline-none transition leading-relaxed shadow-inner"
            />

            {/* Quick Word & Name Replace Tool */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3.5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Quick Word / Name Replacer (Preserves Timestamp Timing)
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={wordToFind}
                  onChange={(e) => setWordToFind(e.target.value)}
                  placeholder="Misspelled Word (e.g. 'Grok')"
                  className="w-full sm:w-1/2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  value={wordToReplace}
                  onChange={(e) => setWordToReplace(e.target.value)}
                  placeholder="Replace With (e.g. 'Groq')"
                  className="w-full sm:w-1/2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={applyWordReplacement}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  Apply Fix
                </button>
              </div>
              {replaceNotice && (
                <p className="text-[11px] font-medium text-emerald-400">{replaceNotice}</p>
              )}
            </div>
          </div>

          {/* Section 7: Visual Callouts (Curved Arrows, Formula & Comparison Cards) */}
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans">7. Visual Callouts &amp; Retention Boosters</h3>
                  <p className="text-xs text-zinc-400">Curved arrows, math formula cards, and side-by-side comparison banners</p>
                </div>
              </div>
            </div>

            {/* Sub-tabs for Callout types */}
            <div className="flex gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setCalloutTab("arrows")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${calloutTab === "arrows" ? "bg-orange-500 text-white" : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                  }`}
              >
                <CornerDownLeft size={13} />
                <span>Curved Arrow</span>
              </button>
              <button
                type="button"
                onClick={() => setCalloutTab("formula")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${calloutTab === "formula" ? "bg-orange-500 text-white" : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                  }`}
              >
                <Calculator size={13} />
                <span>Equation Formula</span>
              </button>
              <button
                type="button"
                onClick={() => setCalloutTab("comparison")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${calloutTab === "comparison" ? "bg-orange-500 text-white" : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                  }`}
              >
                <Columns size={13} />
                <span>Comparison Banner</span>
              </button>
            </div>

            {/* Tab 1: Curved Arrow Callout */}
            {calloutTab === "arrows" && (
              <div className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">Enable Animated Curved Arrow</span>
                  <input
                    type="checkbox"
                    checked={curvedArrowConfig.enabled}
                    onChange={(e) =>
                      onCurvedArrowConfigChange?.({ ...curvedArrowConfig, enabled: e.target.checked })
                    }
                    className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                  />
                </label>

                {curvedArrowConfig.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Label Text</label>
                      <input
                        type="text"
                        value={curvedArrowConfig.label}
                        onChange={(e) =>
                          onCurvedArrowConfigChange?.({ ...curvedArrowConfig, label: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Direction</label>
                      <select
                        value={curvedArrowConfig.direction}
                        onChange={(e) =>
                          onCurvedArrowConfigChange?.({
                            ...curvedArrowConfig,
                            direction: e.target.value as ArrowCalloutConfig["direction"],
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                      >
                        <option value="down-left">Down-Left</option>
                        <option value="down-right">Down-Right</option>
                        <option value="up-left">Up-Left</option>
                        <option value="up-right">Up-Right</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Show at Second</label>
                      <input
                        type="number"
                        min="1"
                        value={curvedArrowConfig.atSeconds}
                        onChange={(e) =>
                          onCurvedArrowConfigChange?.({
                            ...curvedArrowConfig,
                            atSeconds: parseFloat(e.target.value) || 3,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Equation Formula Card */}
            {calloutTab === "formula" && (
              <div className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">Enable Multi-Step Math Formula Card</span>
                  <input
                    type="checkbox"
                    checked={equationFormulaConfig.enabled}
                    onChange={(e) =>
                      onEquationFormulaConfigChange?.({ ...equationFormulaConfig, enabled: e.target.checked })
                    }
                    className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                  />
                </label>

                {equationFormulaConfig.enabled && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Step 1</label>
                        <input
                          type="text"
                          value={equationFormulaConfig.step1.value}
                          onChange={(e) =>
                            onEquationFormulaConfigChange?.({
                              ...equationFormulaConfig,
                              step1: { ...equationFormulaConfig.step1, value: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Step 2</label>
                        <input
                          type="text"
                          value={equationFormulaConfig.step2.value}
                          onChange={(e) =>
                            onEquationFormulaConfigChange?.({
                              ...equationFormulaConfig,
                              step2: { ...equationFormulaConfig.step2, value: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Result</label>
                        <input
                          type="text"
                          value={equationFormulaConfig.result.value}
                          onChange={(e) =>
                            onEquationFormulaConfigChange?.({
                              ...equationFormulaConfig,
                              result: { ...equationFormulaConfig.result, value: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-400">Trigger at second:</span>
                      <input
                        type="number"
                        min="1"
                        value={equationFormulaConfig.atSeconds}
                        onChange={(e) =>
                          onEquationFormulaConfigChange?.({
                            ...equationFormulaConfig,
                            atSeconds: parseFloat(e.target.value) || 5,
                          })
                        }
                        className="w-20 px-2.5 py-1 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Comparison Banner */}
            {calloutTab === "comparison" && (
              <div className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-white">Enable Side-By-Side Comparison Banner</span>
                  <input
                    type="checkbox"
                    checked={comparisonBannerConfig.enabled}
                    onChange={(e) =>
                      onComparisonBannerConfigChange?.({ ...comparisonBannerConfig, enabled: e.target.checked })
                    }
                    className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                  />
                </label>

                {comparisonBannerConfig.enabled && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 block">Left Side (Before / Boring)</label>
                        <input
                          type="text"
                          value={comparisonBannerConfig.left.title}
                          onChange={(e) =>
                            onComparisonBannerConfigChange?.({
                              ...comparisonBannerConfig,
                              left: { ...comparisonBannerConfig.left, title: e.target.value },
                            })
                          }
                          placeholder="e.g. Raw Take"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 block">Right Side (After / Winner)</label>
                        <input
                          type="text"
                          value={comparisonBannerConfig.right.title}
                          onChange={(e) =>
                            onComparisonBannerConfigChange?.({
                              ...comparisonBannerConfig,
                              right: { ...comparisonBannerConfig.right, title: e.target.value },
                            })
                          }
                          placeholder="e.g. Viral 1080p"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-400">Trigger at second:</span>
                      <input
                        type="number"
                        min="1"
                        value={comparisonBannerConfig.atSeconds}
                        onChange={(e) =>
                          onComparisonBannerConfigChange?.({
                            ...comparisonBannerConfig,
                            atSeconds: parseFloat(e.target.value) || 8,
                          })
                        }
                        className="w-20 px-2.5 py-1 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 9:16 Vertical Live Preview Simulator & Audio Spectrum */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#120F1C]/90 backdrop-blur-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-purple-400" />
                <h3 className="text-sm font-black text-white font-sans">9:16 Shorts Live Preview</h3>
              </div>

              {/* TikTok / Instagram Safe-Zone Guide Toggle */}
              <button
                type="button"
                onClick={() => setShowSafeZoneGuide((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${showSafeZoneGuide
                    ? "bg-purple-600 text-white border-purple-400 shadow-xs"
                    : "bg-zinc-800 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                title="Toggle social media UI boundaries"
              >
                <ShieldCheck size={12} />
                <span>Safe Zone {showSafeZoneGuide ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* 9:16 Vertical Canvas Simulator */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-3xl border-[4px] border-zinc-800 bg-black overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
              {/* Main Full-Screen Media with Dynamic Zoom & Face Framing */}
              {activePrimary ? (
                activePrimary.type === "video" ? (
                  <video
                    src={activePrimary.previewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      transform: `scale(${liveZoomScale})`,
                      objectPosition: objectPositionStyle,
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                  />
                ) : (
                  <img
                    src={activePrimary.previewUrl}
                    alt="Preview"
                    style={{
                      transform: `scale(${liveZoomScale})`,
                      objectPosition: objectPositionStyle,
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-1.5 bg-radial from-zinc-900 via-zinc-950 to-black">
                  <Smartphone size={36} className="text-purple-400" />
                  <span className="text-xs font-bold text-zinc-400">9:16 Vertical Shorts</span>
                  <span className="text-[10px] text-zinc-600">Upload video clips on left</span>
                </div>
              )}

              {/* Status Badges: Smart Zoom + Silence Jump-Cut */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {smartPunchIns && (
                    <span className="flex items-center gap-1 bg-black/80 backdrop-blur-md text-purple-400 px-2 py-0.5 rounded-md text-[8px] font-black border border-purple-500/40 uppercase">
                      <ZoomIn size={10} />
                      {punchInIntensity === "subtle" ? "+5% ZOOM" : punchInIntensity === "dramatic" ? "+18% ZOOM" : "+12% ZOOM"}
                    </span>
                  )}
                  {silenceJumpCuts && (
                    <span className="flex items-center gap-1 bg-black/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-md text-[8px] font-black border border-emerald-500/40 uppercase">
                      <Scissors size={10} />
                      {silenceSensitivity.toUpperCase()} CUTS
                    </span>
                  )}
                </div>

                {/* SFX Badge */}
                {enableSfx && (
                  <span className="bg-black/80 backdrop-blur-md text-amber-400 px-2 py-0.5 rounded-md text-[8px] font-black border border-amber-500/40 uppercase">
                    SFX ON
                  </span>
                )}
              </div>

              {/* TikTok / Instagram Safe-Zone Visual Boundaries */}
              {showSafeZoneGuide && (
                <div className="absolute inset-0 z-30 pointer-events-none border-2 border-dashed border-red-500/60 rounded-3xl m-1 flex flex-col justify-between p-2">
                  <div className="bg-red-500/20 text-red-300 text-[8px] font-bold px-2 py-0.5 rounded text-center">
                    Top UI Header (Profile / Search)
                  </div>
                  <div className="flex justify-between items-center text-[7px] text-red-300 px-1 font-bold">
                    <span>← Left Margin</span>
                    <span className="text-right">Right Action Icons (Like, Comment, Share) →</span>
                  </div>
                  <div className="bg-red-500/20 text-red-300 text-[8px] font-bold px-2 py-0.5 rounded text-center">
                    Bottom 20% (Caption, Audio Name, Progress Bar)
                  </div>
                </div>
              )}

              {/* Floating Picture-in-Picture or Cutaway */}
              {activeOverlay && (
                activeOverlay.isCutaway ? (
                  <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center p-4">
                    {activeOverlay.type === "video" ? (
                      <video src={activeOverlay.previewUrl} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      <img src={activeOverlay.previewUrl} alt={activeOverlay.title} className="h-full w-full object-contain" />
                    )}
                    <span className="absolute bottom-4 bg-black/80 text-white text-[8px] font-bold px-2 py-0.5 rounded">
                      Full-Screen B-Roll Cutaway
                    </span>
                  </div>
                ) : (
                  <div
                    className={`absolute z-20 w-24 aspect-video rounded-xl overflow-hidden border-2 border-white/60 shadow-xl bg-zinc-900 ${activeOverlay.position === "top-left"
                        ? "top-12 left-3"
                        : activeOverlay.position === "bottom-left"
                          ? "bottom-24 left-3"
                          : activeOverlay.position === "bottom-right"
                            ? "bottom-24 right-3"
                            : activeOverlay.position === "center"
                              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110"
                              : "top-12 right-3"
                      }`}
                  >
                    {activeOverlay.type === "video" ? (
                      <video src={activeOverlay.previewUrl} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      <img src={activeOverlay.previewUrl} alt={activeOverlay.title} className="h-full w-full object-cover" />
                    )}
                    {activeOverlay.title && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1 py-0.5 text-[7px] font-bold text-white truncate text-center">
                        {activeOverlay.title}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Curved Arrow Preview Mockup */}
              {curvedArrowConfig.enabled && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1 bg-red-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-red-400 shadow-lg animate-pulse">
                  <CornerDownLeft size={10} />
                  <span>{curvedArrowConfig.label}</span>
                </div>
              )}

              {/* Caption Mockup with Selected Vertical Placement */}
              <div
                className={`relative z-10 flex justify-center ${captionPosition === "top"
                    ? "mt-8 mb-auto"
                    : captionPosition === "center"
                      ? "my-auto"
                      : "mb-8 mt-auto"
                  }`}
              >
                <div className="bg-black/90 backdrop-blur-md border border-purple-500/50 rounded-xl px-3 py-1.5 text-center shadow-2xl max-w-[95%]">
                  <span className="text-[10px] sm:text-[11px] font-black text-white tracking-tight">
                    [{captionStyle}] VIRAL SHORTS CAPTIONS
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Spectrum & Output Specs Indicator */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">Speech &amp; Audio Activity</span>
                </div>
                <div className="flex items-end gap-1 h-4">
                  {[4, 12, 16, 8, 14, 10, 6, 15, 12, 8, 16, 4].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-1 rounded-full ${hasMedia ? "bg-gradient-to-t from-emerald-500 to-teal-400 animate-pulse" : "bg-zinc-700 h-2"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/5 pt-1.5 font-medium">
                <span>Output: 1080×1920 (9:16)</span>
                <span className="text-purple-400 font-bold">1 Credit • Max 90s</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={!hasMedia || isGenerating}
              className={`w-full py-4 px-6 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${hasMedia && !isGenerating
                  ? "bg-purple-600 hover:bg-purple-500 text-white active:scale-[0.99] shadow-purple-500/25"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Shorts Render Job...</span>
                </>
              ) : !hasMedia ? (
                <>
                  <Smartphone size={15} />
                  <span>Upload Raw 9:16 Video to Render</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Render 9:16 Polished Shorts (1 Credit)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
