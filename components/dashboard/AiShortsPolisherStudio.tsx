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
  VolumeX,
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
  Zap,
  ArrowRight,
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

export const SHORTS_POLISHER_STEPS = [
  { step: 1, title: "Upload", desc: "Takes & Overlays" },
  { step: 2, title: "Music", desc: "Soundtrack & Audio" },
  { step: 3, title: "Style", desc: "Punch-Ins & Captions" },
  { step: 4, title: "Preview", desc: "9:16 Shorts Simulator" },
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
  left: { tag: string; title: string; description: string; isWinner?: boolean };
  right: { tag: string; title: string; description: string; isWinner?: boolean };
  atSeconds: number;
  durationSeconds?: number;
}

export interface AiShortsPolisherStudioProps {
  primaryMediaList: UploadedMediaItem[];
  onPrimaryMediaListChange: (items: UploadedMediaItem[]) => void;

  overlayLayerList: UploadedLayerItem[];
  onOverlayLayerListChange: (layers: UploadedLayerItem[]) => void;

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

  captionPosition: "bottom" | "center" | "top";
  onCaptionPositionChange: (val: "bottom" | "center" | "top") => void;

  faceFraming: "center" | "left" | "right";
  onFaceFramingChange: (val: "center" | "left" | "right") => void;

  bgmTrackId: string;
  onBgmTrackIdChange: (val: string) => void;

  bgmVolume: number;
  onBgmVolumeChange: (val: number) => void;

  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;

  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;

  editorialTranscript: string;
  onEditorialTranscriptChange: (val: string) => void;

  curvedArrowConfig: ArrowCalloutConfig;
  onCurvedArrowConfigChange: (val: ArrowCalloutConfig) => void;

  equationFormulaConfig: EquationFormulaConfig;
  onEquationFormulaConfigChange: (val: EquationFormulaConfig) => void;

  comparisonBannerConfig: ComparisonBannerConfig;
  onComparisonBannerConfigChange: (val: ComparisonBannerConfig) => void;

  onGenerate: () => void;
  isGenerating: boolean;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (val: boolean) => void;
}

export function AiShortsPolisherStudio({
  primaryMediaList,
  onPrimaryMediaListChange,
  overlayLayerList,
  onOverlayLayerListChange,
  videoTitle,
  onVideoTitleChange,
  silenceJumpCuts,
  onSilenceJumpCutsChange,
  silenceSensitivity,
  onSilenceSensitivityChange,
  smartPunchIns,
  onSmartPunchInsChange,
  punchInIntensity,
  onPunchInIntensityChange,
  captionStyle,
  onCaptionStyleChange,
  captionPosition,
  onCaptionPositionChange,
  faceFraming,
  onFaceFramingChange,
  bgmTrackId,
  onBgmTrackIdChange,
  bgmVolume,
  onBgmVolumeChange,
  customBgmFile,
  onCustomBgmFileSelect,
  enableSfx,
  onEnableSfxChange,
  editorialTranscript,
  onEditorialTranscriptChange,
  curvedArrowConfig,
  onCurvedArrowConfigChange,
  equationFormulaConfig,
  onEquationFormulaConfigChange,
  comparisonBannerConfig,
  onComparisonBannerConfigChange,
  onGenerate,
  isGenerating,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: AiShortsPolisherStudioProps) {
  // 4-Step Stepper state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Caption filtering
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");
  const [captionSearch, setCaptionSearch] = useState<string>("");

  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((style) => {
      const matchesCategory = captionCategoryTab === "All" || style.category === captionCategoryTab;
      const matchesSearch =
        style.name.toLowerCase().includes(captionSearch.toLowerCase()) ||
        style.description.toLowerCase().includes(captionSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [captionCategoryTab, captionSearch]);

  // Audio / BGM auditioning
  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: LibraryBgmTrack) => {
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
      const audioUrl = getBgmTrackAudioUrl(track);
      const audio = new window.Audio(audioUrl);
      audio.volume = Math.max(0.05, Math.min(1, (bgmVolume || 0.12) * 2));
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

  // Primary video file drop / selection
  const handlePrimaryFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadedMediaItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const isVid = f.type.startsWith("video/") || f.name.match(/\.(mp4|mov|webm)$/i);
      const isImg = f.type.startsWith("image/");
      if (isVid || isImg) {
        const previewUrl = URL.createObjectURL(f);
        newItems.push({
          id: `take-${Date.now()}-${i}`,
          file: f,
          type: isVid ? "video" : "image",
          previewUrl,
          name: f.name,
          size: f.size,
          trimStart: 0,
          trimEnd: 0,
        });
      }
    }
    if (newItems.length > 0) {
      onPrimaryMediaListChange([...primaryMediaList, ...newItems]);
      if (!videoTitle && newItems[0]) {
        onVideoTitleChange(newItems[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const removePrimaryTake = (id: string) => {
    onPrimaryMediaListChange(primaryMediaList.filter((item) => item.id !== id));
  };

  const movePrimaryTake = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= primaryMediaList.length) return;
    const clone = [...primaryMediaList];
    const [moved] = clone.splice(index, 1);
    clone.splice(target, 0, moved);
    onPrimaryMediaListChange(clone);
  };

  // Overlay layer file selection
  const handleOverlayFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newLayers: UploadedLayerItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const isVid = f.type.startsWith("video/") || f.name.match(/\.(mp4|mov|webm)$/i);
      const isImg = f.type.startsWith("image/");
      if (isVid || isImg) {
        const previewUrl = URL.createObjectURL(f);
        newLayers.push({
          id: `layer-${Date.now()}-${i}`,
          file: f,
          type: isVid ? "video" : "image",
          previewUrl,
          name: f.name,
          title: f.name.replace(/\.[^/.]+$/, ""),
          position: "top-right",
          startSeconds: 2,
          durationSeconds: 4,
        });
      }
    }
    if (newLayers.length > 0) {
      onOverlayLayerListChange([...overlayLayerList, ...newLayers]);
    }
  };

  const removeOverlayLayer = (id: string) => {
    onOverlayLayerListChange(overlayLayerList.filter((layer) => layer.id !== id));
  };

  // Compulsory review confirmation gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  const hasPrimaryMedia = primaryMediaList.length > 0;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
      {/* ── ROW 1: 4-STEP GUIDED STEPPER BAR (Unified Studio Stepper) ── */}
      <div className="border-b border-slate-200/90 bg-white px-4 sm:px-8 py-3 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
            {SHORTS_POLISHER_STEPS.map((step) => {
              const isActive = currentStep === step.step;
              const isDone =
                (step.step === 1 && hasPrimaryMedia) ||
                (step.step === 2 && Boolean(bgmTrackId)) ||
                (step.step === 3 && Boolean(captionStyle)) ||
                currentStep > step.step;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setCurrentStep(step.step)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-orange-600 shadow-xs border border-orange-200/60 ring-1 ring-orange-500/20"
                      : isDone
                        ? "text-slate-800 hover:text-slate-900 hover:bg-white/60"
                        : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={11} strokeWidth={3} /> : step.step}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 2: STEP CONTENT (SCROLLABLE WORKSPACE) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ──────────────── STEP 1: UPLOAD TAKES & OVERLAYS ──────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Primary Smartphone Takes Dropzone */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                      <Video size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        1. Primary Smartphone Takes (Vertical 9:16)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload your raw vertical video takes. Videos and audio longer than 90 seconds are supported. Only the first 90 seconds will be used.
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs">
                    <Plus size={14} className="text-orange-600" />
                    <span>Add Takes</span>
                    <input
                      type="file"
                      multiple
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) => handlePrimaryFileSelect(e.target.files)}
                    />
                  </label>
                </div>

                {primaryMediaList.length > 0 ? (
                  <div className="space-y-2.5">
                    {primaryMediaList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-slate-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[11px] font-black text-purple-800 shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="relative h-12 w-9 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-200">
                            {item.type === "video" ? (
                              <video src={item.previewUrl} className="h-full w-full object-cover" />
                            ) : (
                              <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {(item.size / (1024 * 1024)).toFixed(1)} MB • {item.type.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => movePrimaryTake(idx, "up")}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === primaryMediaList.length - 1}
                            onClick={() => movePrimaryTake(idx, "down")}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePrimaryTake(item.id)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                            title="Remove Take"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400 p-8 text-center transition cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                      <Smartphone size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drop your smartphone vertical takes
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">MP4, MOV, or WEBM up to 90 seconds total</p>
                    <input
                      type="file"
                      multiple
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) => handlePrimaryFileSelect(e.target.files)}
                    />
                  </label>
                )}
              </div>

              {/* Floating PIP / Overlay Layers */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        2. Picture-in-Picture (PIP) &amp; Overlay Graphics (Optional)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add screenshots, tweets, reaction cards, or secondary b-roll cutaways
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs">
                    <Plus size={14} className="text-orange-600" />
                    <span>Add Layer</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => handleOverlayFileSelect(e.target.files)}
                    />
                  </label>
                </div>

                {overlayLayerList.length > 0 && (
                  <div className="space-y-3">
                    {overlayLayerList.map((layer) => (
                      <div
                        key={layer.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-200">
                              <img src={layer.previewUrl} alt={layer.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{layer.name}</p>
                              <p className="text-[10px] text-slate-500">Starts at {layer.startSeconds ?? 2}s</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeOverlayLayer(layer.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Position Selector */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                          <span className="text-[11px] font-bold text-slate-600">Position:</span>
                          {(["top-right", "top-left", "bottom-right", "bottom-left", "center"] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => {
                                onOverlayLayerListChange(
                                  overlayLayerList.map((l) => (l.id === layer.id ? { ...l, position: pos } : l))
                                );
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(layer.position || "top-right") === pos
                                  ? "bg-orange-600 text-white"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                              {pos.replace("-", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Title */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Shorts Title / Topic</label>
                <input
                  type="text"
                  maxLength={70}
                  value={videoTitle}
                  onChange={(e) => onVideoTitleChange(e.target.value)}
                  placeholder="e.g. 3 Habits That Doubled My Productivity in 30 Days"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  <span>Next: Music &amp; Audio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: MUSIC & SOUND DESIGN ──────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Background Soundtrack &amp; Ducking</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a background soundtrack from the curated cloud library or upload custom audio.
                  </p>
                </div>

                {/* AWS S3 Track Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AWS_BGM_TRACKS.map((track) => {
                    const isSelected = (bgmTrackId || "parasail") === track.id;
                    const isAuditioning = auditioningTrack === track.id;

                    return (
                      <div
                        key={track.id}
                        className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60"
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                              {track.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-orange-600">
                                <Check size={12} strokeWidth={3} /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{track.label}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{track.desc}</p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/60">
                          {track.path !== "none" ? (
                            <button
                              type="button"
                              onClick={() => toggleAudition(track)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${isAuditioning
                                  ? "bg-orange-600 text-white"
                                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                              {isAuditioning ? <Pause size={12} /> : <Play size={12} />}
                              <span>{isAuditioning ? "Stop" : "Preview"}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Pure Speech</span>
                          )}

                          <button
                            type="button"
                            onClick={() => onBgmTrackIdChange(track.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${isSelected
                                ? "bg-orange-600 text-white"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                          >
                            {isSelected ? "Active" : "Select"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ducked Volume Slider & SFX */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800">
                        BGM Volume: <span className="text-orange-600 font-mono">{Math.round((bgmVolume ?? 0.12) * 100)}%</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Default: 12% (Speech Ducking)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={bgmVolume ?? 0.12}
                      onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Viral Hook SFX Transitions</p>
                      <p className="text-[11px] text-slate-500">Audio impacts on punch-ins and keyword reveals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSfx}
                      onChange={(e) => onEnableSfxChange(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                  >
                    <span>Next: Punch-Ins &amp; Style</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: PUNCH-INS & CAPTIONS ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Silence Jump-Cuts & Punch-In Controls */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900">Retention Cuts &amp; Camera Zooms</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Jump-Cuts */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scissors size={16} className="text-orange-600" />
                        <h4 className="text-xs font-bold text-slate-900">Auto Silence Jump-Cuts</h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={silenceJumpCuts}
                        onChange={(e) => onSilenceJumpCutsChange(e.target.checked)}
                        className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Eliminates dead air pauses between sentences</p>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(["tight", "normal", "gentle"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onSilenceSensitivityChange(s)}
                          className={`py-1 text-center rounded-lg text-[10px] font-bold transition cursor-pointer ${silenceSensitivity === s
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Punch-In Zooms */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ZoomIn size={16} className="text-orange-600" />
                        <h4 className="text-xs font-bold text-slate-900">Dynamic Punch-In Zooms</h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={smartPunchIns}
                        onChange={(e) => onSmartPunchInsChange(e.target.checked)}
                        className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Alternates zoom scale on key sentence beats</p>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(["subtle", "medium", "dramatic"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => onPunchInIntensityChange(lvl)}
                          className={`py-1 text-center rounded-lg text-[10px] font-bold transition cursor-pointer ${punchInIntensity === lvl
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          {lvl.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 32 Caption Styles Selector */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">32 Animated Kinetic Caption Styles</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subtitles will animate synced to spoken words in the vertical short
                    </p>
                  </div>

                  {/* Search Filter */}
                  <div className="relative w-full sm:w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearch}
                      onChange={(e) => setCaptionSearch(e.target.value)}
                      placeholder="Search style..."
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {["All", "Hormozi", "Minimal", "Neon & Glow", "Dynamic", "Cinematic", "Comic & Pop"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionCategoryTab(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${captionCategoryTab === cat
                          ? "bg-orange-500 text-white font-black shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 32 Styles Grid with Live Word Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1 no-scrollbar">
                  {filteredCaptionStyles.map((style) => {
                    const isSelected = (captionStyle || "Pop Word") === style.name;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onCaptionStyleChange(style.name)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[85%]">
                            {style.name}
                          </span>
                          {isSelected && <Check size={12} className="text-orange-600 shrink-0" strokeWidth={3} />}
                        </div>

                        {/* Animated Sample Word Preview */}
                        <div className="my-auto py-1 flex items-center justify-center">
                          {renderPreviewCaptionWords(style)}
                        </div>

                        <span className="text-[9px] text-slate-400 truncate">{style.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  ← Back to Music
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                >
                  <span>Next: Live Simulator</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4 (final): LIVE SIMULATOR & RENDER ──────────────── */}
          {currentStep === SHORTS_POLISHER_STEPS.length && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Live 9:16 Smartphone Simulator</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Audition punch-in camera framing, PIP overlays, and viral caption positioning.
                    </p>
                  </div>

                  {/* Watermark Remover */}
                  {onRemoveAiWatermarkChange && (
                    <WatermarkRemoverToggle
                      removeAiWatermark={removeAiWatermark}
                      onRemoveAiWatermarkChange={onRemoveAiWatermarkChange}
                      variant="inline"
                    />
                  )}
                </div>

                {/* Phone Simulator Frame */}
                <div className="flex justify-center py-4">
                  <div className="relative w-72 h-[520px] rounded-[36px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
                    {/* Simulated Background / Primary Video */}
                    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
                      {primaryMediaList[0]?.previewUrl ? (
                        primaryMediaList[0].type === "video" ? (
                          <video
                            src={primaryMediaList[0].previewUrl}
                            className="h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        ) : (
                          <img
                            src={primaryMediaList[0].previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="text-slate-600 text-xs flex flex-col items-center">
                          <Smartphone size={24} className="mb-1" />
                          <span>No Video Uploaded</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Notch */}
                    <div className="relative z-10 mx-auto h-4 w-24 rounded-full bg-slate-900 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                    </div>

                    {/* Floating PIP Overlay Preview */}
                    {overlayLayerList[0]?.previewUrl && (
                      <div
                        className={`absolute z-10 w-24 h-24 rounded-xl overflow-hidden border border-white/20 shadow-lg ${overlayLayerList[0].position === "top-left"
                            ? "top-8 left-4"
                            : overlayLayerList[0].position === "bottom-right"
                              ? "bottom-20 right-4"
                              : overlayLayerList[0].position === "bottom-left"
                                ? "bottom-20 left-4"
                                : overlayLayerList[0].position === "center"
                                  ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  : "top-8 right-4"
                          }`}
                      >
                        <img
                          src={overlayLayerList[0].previewUrl}
                          alt="PIP"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Subtitle Strip Simulator */}
                    <div className="relative z-10 w-full mb-6 text-center px-2">
                      <span className="inline-block rounded-lg bg-black/80 px-2.5 py-1 text-[11px] font-black text-yellow-300 shadow-md">
                        {captionStyle || "Pop Word"} Captions
                      </span>
                    </div>

                    {/* Phone Bottom Pill */}
                    <div className="relative z-10 mx-auto h-1 w-20 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* Review Gate Checkbox */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={previewConfirmed}
                      onChange={(e) => setPreviewConfirmed(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-500 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        I have reviewed this 9:16 vertical shorts layout and approve cloud rendering
                      </p>
                      <p className="text-[11px] text-slate-500">
                        AWS Remotion Lambda will render a 1080×1920 30 FPS MP4 with ducked background music, jump-cuts, and animated captions.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Cloud Render Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Style
                  </button>

                  <button
                    type="button"
                    disabled={!hasPrimaryMedia || !previewConfirmed || isGenerating}
                    onClick={onGenerate}
                    className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Submitting Render Job...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="transition group-hover:rotate-12" />
                        <span>Render Polished Shorts (1 Credit)</span>
                        <ArrowRight size={14} />
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
