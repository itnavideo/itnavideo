/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  Video,
  Film,
  Check,
  CheckCircle2,
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
  RotateCcw,
  Maximize2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Trash2,
  CheckCheck,
  Tag,
  Tv,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

export const POLISHER_STEPS = [
  { step: 1, title: "Upload", desc: "Takes & PIP Callouts" },
  { step: 2, title: "Music", desc: "Soundtrack & Audio" },
  { step: 3, title: "Style", desc: "Zooms, Cuts & Captions" },
  { step: 4, title: "Preview", desc: "16:9 Cinema Simulator" },
] as const;

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

export interface AiVideoPolisherStudioProps {
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

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (val: boolean) => void;
}

export function AiVideoPolisherStudio({
  primaryMediaList = [],
  onPrimaryMediaListChange,
  overlayLayerList = [],
  onOverlayLayerListChange,
  videoTitle = "",
  onVideoTitleChange,
  silenceJumpCuts = true,
  onSilenceJumpCutsChange,
  silenceSensitivity = "normal",
  onSilenceSensitivityChange,
  smartPunchIns = true,
  onSmartPunchInsChange,
  punchInIntensity = "medium",
  onPunchInIntensityChange,
  captionStyle = "glow-viral",
  onCaptionStyleChange,
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
    label: "KEY EVIDENCE",
    direction: "down-left",
    color: "#EF4444",
    atSeconds: 4,
    durationSeconds: 3.5,
  },
  onCurvedArrowConfigChange,
  equationFormulaConfig = {
    enabled: false,
    step1: { value: "1,000 VIEWS", label: "TRAFFIC", accentColor: "#38BDF8" },
    operator1: "×",
    step2: { value: "$5 RPM", label: "MONETIZATION", accentColor: "#FACC15" },
    operator2: "=",
    result: { value: "$5,000", label: "TOTAL PROFIT", accentColor: "#22C55E" },
    atSeconds: 6,
    durationSeconds: 5,
  },
  onEquationFormulaConfigChange,
  comparisonBannerConfig = {
    enabled: false,
    left: { tag: "STANDARD", title: "Raw Takes", description: "Dead silence & shaky pacing", isWinner: false },
    right: { tag: "PRO POLISHED", title: "Itnavideo AI", description: "Tight cuts, punch-ins & 1080p", isWinner: true },
    atSeconds: 10,
    durationSeconds: 5,
  },
  onComparisonBannerConfigChange,
  onGenerate,
  isGenerating,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: AiVideoPolisherStudioProps) {
  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Audio audition state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Music category tab
  const [musicCategory, setMusicCategory] = useState<string>("All");

  // Caption search and category tab
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>("");

  // Callouts tab
  const [calloutTab, setCalloutTab] = useState<"arrows" | "formula" | "comparison">("arrows");

  // Word replacer state
  const [wordToFind, setWordToFind] = useState("");
  const [wordToReplace, setWordToReplace] = useState("");
  const [replaceNotice, setReplaceNotice] = useState<string | null>(null);

  // Stop audition audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggleAudition = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (audioRef.current) audioRef.current.pause();
      setPlayingTrackId(null);
      return;
    }

    if (playingTrackId === track.id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const url = getBgmTrackAudioUrl(track);
      const audio = new Audio(url);
      audio.volume = Math.max(0.1, Math.min(1, bgmVolume * 2.5));
      audio.play().catch(() => {});
      audio.onended = () => setPlayingTrackId(null);
      audioRef.current = audio;
      setPlayingTrackId(track.id);
    }
  };

  // Primary media handlers
  const handlePrimaryMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedMediaItem[] = Array.from(files).map((f: File): UploadedMediaItem => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      type: (f.type.startsWith("image/") ? "image" : "video") as "image" | "video",
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      trimStart: 0,
      trimEnd: 0,
    }));

    onPrimaryMediaListChange([...primaryMediaList, ...newItems]);
    if (e.target) e.target.value = "";
  };

  const removePrimaryMedia = (id: string) => {
    const target = primaryMediaList.find((m) => m.id === id);
    if (target?.previewUrl) {
      try {
        URL.revokeObjectURL(target.previewUrl);
      } catch {}
    }
    onPrimaryMediaListChange(primaryMediaList.filter((m) => m.id !== id));
  };

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

  // Overlay layer handlers (PIP)
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
      startSeconds: 3,
      durationSeconds: 4,
    }));

    onOverlayLayerListChange([...overlayLayerList, ...newLayers]);
    if (e.target) e.target.value = "";
  };

  const removeLayerItem = (id: string) => {
    const target = overlayLayerList.find((l) => l.id === id);
    if (target?.previewUrl) {
      try {
        URL.revokeObjectURL(target.previewUrl);
      } catch {}
    }
    onOverlayLayerListChange(overlayLayerList.filter((l) => l.id !== id));
  };

  // Filtered Music Tracks
  const filteredTracks = useMemo(() => {
    if (musicCategory === "All") return AWS_BGM_TRACKS;
    return AWS_BGM_TRACKS.filter((t) => t.category.toLowerCase() === musicCategory.toLowerCase());
  }, [musicCategory]);

  const musicCategories = useMemo(() => {
    const cats = Array.from(new Set(AWS_BGM_TRACKS.map((t) => t.category))).filter((c) => c !== "Mute");
    return ["All", ...cats, "Mute"];
  }, []);

  // Filtered Caption Styles
  const filteredCaptionStyles = useMemo(() => {
    let result = THIRTY_TWO_CAPTION_STYLES;
    if (captionCategoryTab !== "All") {
      result = result.filter((s) => s.category.toLowerCase() === captionCategoryTab.toLowerCase());
    }
    if (captionSearchQuery.trim()) {
      const q = captionSearchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [captionCategoryTab, captionSearchQuery]);

  const captionCategories = useMemo(() => {
    const cats = Array.from(new Set(THIRTY_TWO_CAPTION_STYLES.map((s) => s.category)));
    return ["All", ...cats];
  }, []);

  // Word Replacer
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
      setReplaceNotice(`"${wordToFind}" was not found in transcript.`);
      setTimeout(() => setReplaceNotice(null), 3000);
    }
  };

  // Preview Helpers
  const activePrimary = primaryMediaList[0];
  const activeOverlay = overlayLayerList[0];
  const selectedTrackObj = useMemo(() => {
    return AWS_BGM_TRACKS.find((t) => t.id === bgmTrackId) || AWS_BGM_TRACKS[0];
  }, [bgmTrackId]);

  const liveZoomScale = smartPunchIns
    ? punchInIntensity === "subtle"
      ? 1.05
      : punchInIntensity === "dramatic"
      ? 1.18
      : 1.12
    : 1.0;

  const canProceedToMusic = primaryMediaList.length > 0;
  const canProceedToStyle = true;
  const canProceedToPreview = true;

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-slate-50/50">
      {/* 4-Step Stepper Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shrink-0 shadow-2xs">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {POLISHER_STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-orange-50/80 border-orange-200 text-orange-950 ring-1 ring-orange-400/40 shadow-xs"
                    : isCompleted
                    ? "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80 cursor-pointer"
                    : "bg-white/60 border-slate-200/60 text-slate-400 hover:text-slate-600 cursor-pointer"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-2xs"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : s.step}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black truncate leading-tight tracking-tight">
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight font-medium mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* STEP 1: Upload (Primary Takes & PIP Callouts) */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Project Title Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={14} className="text-orange-600" />
                    Project Headline / YouTube Topic
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">Optional</span>
                </div>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => onVideoTitleChange(e.target.value)}
                  placeholder="e.g. Master Next.js 16 in 10 Minutes (Complete Guide)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Primary 16:9 Media Takes */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Film size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Primary 16:9 Widescreen Takes
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload raw talking-head footage or shoot takes (MP4/MOV/WebM)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {primaryMediaList.length} Clip{primaryMediaList.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Upload Box */}
                <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/20 p-8 text-center transition cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg"
                    onChange={handlePrimaryMediaSelect}
                    className="hidden"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-orange-600 shadow-xs group-hover:scale-105 transition mb-2.5">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-black text-slate-800">
                    Click to browse or drop 16:9 video takes here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports up to 5 minutes total runtime • 1920×1080 Full HD
                  </p>
                </label>

                {/* Primary Takes List */}
                {primaryMediaList.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                      <span>Clip Order &amp; Sequence</span>
                      <span>{primaryMediaList.length} Total</span>
                    </div>

                    {primaryMediaList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3 hover:border-slate-300 transition shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveMediaUp(idx)}
                              disabled={idx === 0}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition"
                              title="Move Up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMediaDown(idx)}
                              disabled={idx === primaryMediaList.length - 1}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition"
                              title="Move Down"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>

                          {/* Thumbnail / Icon */}
                          <div className="relative h-12 w-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {item.type === "video" ? (
                              <video
                                src={item.previewUrl}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                            <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/75 text-[9px] font-bold text-white">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {(item.size / (1024 * 1024)).toFixed(1)} MB • {item.type.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removePrimaryMedia(item.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Remove Take"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture-in-Picture (PIP) Callout Overlays */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Picture-in-Picture (PIP) Overlays
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add floating screenshot callouts, product demos, or reaction clips
                      </p>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition cursor-pointer shadow-2xs">
                    <Plus size={14} />
                    <span>Add Overlay</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleLayerSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {overlayLayerList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      No overlay callouts added. Click &quot;Add Overlay&quot; above to insert floating proof screenshots or reaction clips.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overlayLayerList.map((layer) => (
                      <div
                        key={layer.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {layer.type === "video" ? (
                              <video
                                src={layer.previewUrl}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={layer.previewUrl}
                                alt={layer.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {layer.name}
                            </p>
                            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                              PIP Overlay
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {/* Position Selector */}
                          <select
                            value={layer.position || "top-right"}
                            onChange={(e) => {
                              const pos = e.target.value as OverlayPosition;
                              onOverlayLayerListChange(
                                overlayLayerList.map((l) =>
                                  l.id === layer.id ? { ...l, position: pos } : l
                                )
                              );
                            }}
                            className="text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-orange-500"
                          >
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="center">Center / Split</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => removeLayerItem(layer.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove Overlay"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!canProceedToMusic}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: Soundtrack &amp; Audio</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Music (Soundtrack & Audio Design) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Music Catalog Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Curated AWS S3 Background Tracks
                      </h3>
                      <p className="text-xs text-slate-500">
                        Royalty-free background score ducked automatically during speech
                      </p>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {musicCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMusicCategory(cat)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                          musicCategory === cat
                            ? "bg-orange-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Tracks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTracks.map((track) => {
                    const isSelected = bgmTrackId === track.id;
                    const isAuditioning = playingTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onBgmTrackIdChange(track.id)}
                        className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black text-slate-900 truncate">
                              {track.label}
                            </p>
                            {isSelected && (
                              <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {track.desc}
                          </p>
                        </div>

                        {track.id !== "none" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAudition(track);
                            }}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                              isAuditioning
                                ? "bg-orange-600 border-orange-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                            }`}
                            title={isAuditioning ? "Pause Preview" : "Play Preview"}
                          >
                            {isAuditioning ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Volume Slider & Custom Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/80">
                  {/* Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Volume2 size={14} className="text-orange-600" />
                        BGM Ducking Volume
                      </label>
                      <span className="text-xs font-bold text-slate-600">
                        {Math.round(bgmVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.5}
                      step={0.01}
                      value={bgmVolume}
                      onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">
                      Standard YouTube default is 12% to keep voiceover crisp.
                    </p>
                  </div>

                  {/* Custom BGM Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Upload size={14} className="text-orange-600" />
                      Custom Audio Upload
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold truncate transition cursor-pointer text-center">
                        {customBgmFile ? customBgmFile.name : "Upload MP3/WAV"}
                        <input
                          type="file"
                          accept="audio/mp3,audio/wav,audio/m4a,audio/aac"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onCustomBgmFileSelect(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      {customBgmFile && (
                        <button
                          type="button"
                          onClick={() => onCustomBgmFileSelect(null)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition"
                          title="Clear Custom Audio"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SFX Toggle */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      Dynamic Transition Sound Effects (SFX)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Subtle whoosh &amp; pop cues on scene cuts and visual callouts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEnableSfxChange(!enableSfx)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      enableSfx ? "bg-orange-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enableSfx ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: Style &amp; Pacing</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Style (Zooms, Cuts, Captions & Callouts) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Pacing & Cutters Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      AI Video Pacing &amp; Dynamic Zooms
                    </h3>
                    <p className="text-xs text-slate-500">
                      Broadcast jump-cuts and camera punch-in scale controls
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Silence Trimmer */}
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scissors size={16} className="text-orange-600" />
                        <h4 className="text-xs font-black text-slate-900">
                          Auto Silence &amp; Pause Cutter
                        </h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={silenceJumpCuts}
                        onChange={(e) => onSilenceJumpCutsChange(e.target.checked)}
                        className="h-4 w-4 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Automatically detects and trims awkward silence gaps between sentences.
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(["tight", "normal", "gentle"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => onSilenceSensitivityChange(lvl)}
                          className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] capitalize transition cursor-pointer border ${
                            silenceSensitivity === lvl
                              ? "bg-orange-600 border-orange-600 text-white shadow-2xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Punch-In Zooms */}
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ZoomIn size={16} className="text-orange-600" />
                        <h4 className="text-xs font-black text-slate-900">
                          Smart Camera Punch-Ins
                        </h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={smartPunchIns}
                        onChange={(e) => onSmartPunchInsChange(e.target.checked)}
                        className="h-4 w-4 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Dynamic spring frame zoom alternating at key punch-lines.
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(["subtle", "medium", "dramatic"] as const).map((int) => (
                        <button
                          key={int}
                          type="button"
                          onClick={() => onPunchInIntensityChange(int)}
                          className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] capitalize transition cursor-pointer border ${
                            punchInIntensity === int
                              ? "bg-orange-600 border-orange-600 text-white shadow-2xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {int === "subtle" ? "Subtle (+5%)" : int === "medium" ? "Medium (+12%)" : "Dramatic (+18%)"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 32 Caption Styles Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        32 Animated Caption &amp; Subtitle Styles
                      </h3>
                      <p className="text-xs text-slate-500">
                        Master kinetic presets with millisecond word synchronization
                      </p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search styles..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {captionCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionCategoryTab(cat)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        captionCategoryTab === cat
                          ? "bg-orange-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Caption Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredCaptionStyles.map((style) => {
                    const isSelected = captionStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onCaptionStyleChange(style.id)}
                        className={`group relative flex flex-col items-center justify-between p-3 rounded-xl border text-center transition cursor-pointer min-h-[110px] ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="w-full h-12 flex items-center justify-center rounded-lg bg-slate-950 p-2 overflow-hidden shadow-inner">
                          {renderPreviewCaptionWords(style.id)}
                        </div>

                        <div className="w-full mt-2">
                          <p className="text-[11px] font-black text-slate-800 truncate">
                            {style.name}
                          </p>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {style.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Misheard Word / Brand Name Replacer */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Wand2 size={14} className="text-orange-600" />
                    Misheard Word &amp; Brand Name Replacer
                  </h4>
                  {replaceNotice && (
                    <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                      {replaceNotice}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={wordToFind}
                    onChange={(e) => setWordToFind(e.target.value)}
                    placeholder="Find mistranscribed word..."
                    className="sm:col-span-5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={wordToReplace}
                    onChange={(e) => setWordToReplace(e.target.value)}
                    placeholder="Replace with correct word/brand..."
                    className="sm:col-span-5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyWordReplacement}
                    disabled={!wordToFind.trim()}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Visual Retention Callouts (Arrows, Formula, Comparison) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Visual Retention Callout Cards
                      </h3>
                      <p className="text-xs text-slate-500">
                        Curved arrows, multi-step math formulas, and side-by-side comparison banners
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCalloutTab("arrows")}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                        calloutTab === "arrows"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Arrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalloutTab("formula")}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                        calloutTab === "formula"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Formula
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalloutTab("comparison")}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                        calloutTab === "comparison"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Comparison
                    </button>
                  </div>
                </div>

                {/* Arrow Tab */}
                {calloutTab === "arrows" && onCurvedArrowConfigChange && (
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        Curved Arrow Callout
                      </span>
                      <input
                        type="checkbox"
                        checked={curvedArrowConfig.enabled}
                        onChange={(e) =>
                          onCurvedArrowConfigChange({
                            ...curvedArrowConfig,
                            enabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    {curvedArrowConfig.enabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Label</label>
                          <input
                            type="text"
                            value={curvedArrowConfig.label}
                            onChange={(e) =>
                              onCurvedArrowConfigChange({
                                ...curvedArrowConfig,
                                label: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Direction</label>
                          <select
                            value={curvedArrowConfig.direction}
                            onChange={(e) =>
                              onCurvedArrowConfigChange({
                                ...curvedArrowConfig,
                                direction: e.target.value as any,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          >
                            <option value="down-left">Down Left</option>
                            <option value="down-right">Down Right</option>
                            <option value="up-left">Up Left</option>
                            <option value="up-right">Up Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Timestamp (sec)</label>
                          <input
                            type="number"
                            value={curvedArrowConfig.atSeconds}
                            onChange={(e) =>
                              onCurvedArrowConfigChange({
                                ...curvedArrowConfig,
                                atSeconds: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Formula Tab */}
                {calloutTab === "formula" && onEquationFormulaConfigChange && (
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        Equation &amp; Calculation Formula Card
                      </span>
                      <input
                        type="checkbox"
                        checked={equationFormulaConfig.enabled}
                        onChange={(e) =>
                          onEquationFormulaConfigChange({
                            ...equationFormulaConfig,
                            enabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    {equationFormulaConfig.enabled && (
                      <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Step 1</label>
                          <input
                            type="text"
                            value={equationFormulaConfig.step1.value}
                            onChange={(e) =>
                              onEquationFormulaConfigChange({
                                ...equationFormulaConfig,
                                step1: { ...equationFormulaConfig.step1, value: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Step 2</label>
                          <input
                            type="text"
                            value={equationFormulaConfig.step2.value}
                            onChange={(e) =>
                              onEquationFormulaConfigChange({
                                ...equationFormulaConfig,
                                step2: { ...equationFormulaConfig.step2, value: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Result</label>
                          <input
                            type="text"
                            value={equationFormulaConfig.result.value}
                            onChange={(e) =>
                              onEquationFormulaConfigChange({
                                ...equationFormulaConfig,
                                result: { ...equationFormulaConfig.result, value: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Comparison Tab */}
                {calloutTab === "comparison" && onComparisonBannerConfigChange && (
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        Side-by-Side Comparison Banner
                      </span>
                      <input
                        type="checkbox"
                        checked={comparisonBannerConfig.enabled}
                        onChange={(e) =>
                          onComparisonBannerConfigChange({
                            ...comparisonBannerConfig,
                            enabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    {comparisonBannerConfig.enabled && (
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Left Column (Standard)</label>
                          <input
                            type="text"
                            value={comparisonBannerConfig.left.title}
                            onChange={(e) =>
                              onComparisonBannerConfigChange({
                                ...comparisonBannerConfig,
                                left: { ...comparisonBannerConfig.left, title: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500">Right Column (Pro Winner)</label>
                          <input
                            type="text"
                            value={comparisonBannerConfig.right.title}
                            onChange={(e) =>
                              onComparisonBannerConfigChange({
                                ...comparisonBannerConfig,
                                right: { ...comparisonBannerConfig.right, title: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Music</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-98"
                >
                  <span>Next: 16:9 Preview Simulator</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 (final): Preview (16:9 Cinema Simulator) */}
          {currentStep === POLISHER_STEPS.length && (
            <div className="space-y-6 animate-fadeIn">
              {/* Simulator Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                      <Tv size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        16:9 Widescreen Cinema Simulator
                      </h3>
                      <p className="text-xs text-slate-500">
                        Interactive preview with dynamic punch-in zoom and PIP positioning
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    1920×1080 Full HD
                  </span>
                </div>

                {/* 16:9 Cinema Frame */}
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                  {activePrimary ? (
                    <div
                      className="absolute inset-0 transition-transform duration-500 ease-out"
                      style={{ transform: `scale(${liveZoomScale})` }}
                    >
                      {activePrimary.type === "video" ? (
                        <video
                          src={activePrimary.previewUrl}
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={activePrimary.previewUrl}
                          alt="Primary Media Preview"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                      <Film size={36} />
                      <p className="text-xs font-semibold">No media clips uploaded yet</p>
                    </div>
                  )}

                  {/* Picture-in-Picture Floating Window */}
                  {activeOverlay && (
                    <div
                      className={`absolute z-20 w-44 sm:w-56 rounded-xl border border-white/20 bg-black/85 shadow-2xl overflow-hidden backdrop-blur-md p-1 transition-all ${
                        activeOverlay.position === "top-left"
                          ? "top-4 left-4"
                          : activeOverlay.position === "bottom-left"
                          ? "bottom-14 left-4"
                          : activeOverlay.position === "bottom-right"
                          ? "bottom-14 right-4"
                          : activeOverlay.position === "center"
                          ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          : "top-4 right-4"
                      }`}
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                        {activeOverlay.type === "video" ? (
                          <video
                            src={activeOverlay.previewUrl}
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={activeOverlay.previewUrl}
                            alt="PIP"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-white px-1.5 py-1 truncate">
                        {activeOverlay.name}
                      </p>
                    </div>
                  )}

                  {/* Punch-In Scale Badge */}
                  {smartPunchIns && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 text-[10px] font-black text-orange-400">
                      <ZoomIn size={12} />
                      <span>{liveZoomScale.toFixed(2)}x Dynamic Zoom</span>
                    </div>
                  )}

                  {/* Live Caption Bar Preview */}
                  <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
                    <div className="max-w-md w-full flex justify-center">
                      {renderPreviewCaptionWords(captionStyle)}
                    </div>
                  </div>
                </div>

                {/* Recap Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Clips</span>
                    <span className="text-sm font-black text-slate-900">{primaryMediaList.length} Takes</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Silence Trims</span>
                    <span className="text-sm font-black text-slate-900 capitalize">
                      {silenceJumpCuts ? silenceSensitivity : "Disabled"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Soundtrack</span>
                    <span className="text-sm font-black text-slate-900 truncate block">
                      {selectedTrackObj.label}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Captions</span>
                    <span className="text-sm font-black text-slate-900 capitalize truncate block">
                      {captionStyle}
                    </span>
                  </div>
                </div>

                {/* Watermark Remover Toggle */}
                {onRemoveAiWatermarkChange && (
                  <div className="pt-2">
                    <WatermarkRemoverToggle
                      removeAiWatermark={removeAiWatermark}
                      onToggle={onRemoveAiWatermarkChange}
                    />
                  </div>
                )}
              </div>

              {/* Action Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Ready to Polish Your YouTube Video?
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1 Min = 1 Credit (1 Cr/min, max 5 Credits) • Rendered in AWS Cloud
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Back to Style
                  </button>
                  <button
                    type="button"
                    disabled={isGenerating || primaryMediaList.length === 0}
                    onClick={onGenerate}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-orange-600/25 transition cursor-pointer active:scale-98"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Render...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Render 1080p Cloud Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
