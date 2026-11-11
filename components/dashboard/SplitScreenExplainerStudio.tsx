"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Volume2,
  Check,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Tv,
  X,
  FileText,
  RotateCcw,
  Tag,
  Music,
  Sliders,
  Layers,
  Zap,
  Film,
  Eye,
  Video,
  Image as ImageIcon,
  CheckCheck,
  Edit3,
  Lock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Split,
  User,
  ArrowRight,
  Search,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";

export const SPLIT_STEPS = [
  { step: 1, title: "Upload", desc: "Creator & Visuals" },
  { step: 2, title: "Music", desc: "Soundtrack & Audio" },
  { step: 3, title: "Style", desc: "Captions & 50/50 Layout" },
  { step: 4, title: "Preview", desc: "9:16 Shorts Simulator" },
] as const;

export interface VisualUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
}

export interface SplitScreenExplainerStudioProps {
  // Bottom 50%: Creator Video
  creatorVideoFile: File | null;
  onCreatorVideoSelect: (file: File | null) => void;

  // Top 50%: Explanation Visuals
  explanationItems: VisualUploadItem[];
  onAddExplanationFiles: (files: File[]) => void;
  onRemoveExplanationItem: (id: string) => void;

  topicTitle: string;
  onTopicTitleChange: (val: string) => void;

  subtitleStyle: string;
  onSubtitleStyleChange: (val: string) => void;

  visualTheme?: string;
  onVisualThemeChange?: (val: string) => void;

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

  onGenerate: () => void;
  isGenerating: boolean;

  renderedVideoUrl?: string;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (val: boolean) => void;
}

export function SplitScreenExplainerStudio({
  creatorVideoFile,
  onCreatorVideoSelect,
  explanationItems,
  onAddExplanationFiles,
  onRemoveExplanationItem,
  topicTitle,
  onTopicTitleChange,
  subtitleStyle,
  onSubtitleStyleChange,
  visualTheme = "modern-saas",
  onVisualThemeChange,
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
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: SplitScreenExplainerStudioProps) {
  // 4-Step Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || "modern-saas");

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);

  // Local Creator Video Preview & Duration
  const [creatorVideoUrl, setCreatorVideoUrl] = useState<string>("");
  const [creatorVideoDuration, setCreatorVideoDuration] = useState<number>(0);

  useEffect(() => {
    if (creatorVideoFile) {
      const url = URL.createObjectURL(creatorVideoFile);
      setCreatorVideoUrl(url);
      const v = document.createElement("video");
      v.src = url;
      v.onloadedmetadata = () => {
        setCreatorVideoDuration(Math.round(v.duration || 0));
      };
      return () => URL.revokeObjectURL(url);
    } else {
      setCreatorVideoUrl("");
      setCreatorVideoDuration(0);
    }
  }, [creatorVideoFile]);

  // Caption Filtering
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

  // Audio / BGM Auditioning
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

  // Compulsory Live Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Verification whether ready to generate
  const hasCreatorVideo = Boolean(creatorVideoFile);
  const hasVisuals = explanationItems.length > 0;
  const isReadyToRender = hasCreatorVideo && hasVisuals;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
      {/* ── ROW 1: 4-STEP GUIDED STEPPER BAR (Unified Studio Stepper) ── */}
      <div className="border-b border-slate-200/90 bg-white px-4 sm:px-8 py-3 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
            {SPLIT_STEPS.map((step) => {
              const isActive = currentStep === step.step;
              const isDone =
                (step.step === 1 && hasCreatorVideo && hasVisuals) ||
                (step.step === 2 && Boolean(bgmTrackId)) ||
                (step.step === 3 && Boolean(subtitleStyle)) ||
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

          {/* ──────────────── STEP 1: UPLOAD CREATOR VIDEO & TOP VISUALS ──────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Section 1A: Bottom 50% Creator Video */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      1. Bottom 50%: Creator Video (Talking-Head)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload your smartphone talking-head recording. Videos and audio longer than 90 seconds are supported. Only the first 90 seconds will be used.
                    </p>
                  </div>
                </div>

                {creatorVideoFile ? (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Film size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{creatorVideoFile.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {(creatorVideoFile.size / (1024 * 1024)).toFixed(1)} MB • Duration:{" "}
                            <span className="font-bold text-slate-800">{creatorVideoDuration}s</span> (max 90s)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCreatorVideoSelect(null)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    {creatorVideoUrl && (
                      <div className="rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video max-h-48 flex items-center justify-center">
                        <video src={creatorVideoUrl} controls className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400 p-8 text-center transition cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                      <Video size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drop your creator talking-head video
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">MP4, MOV, or WEBM • Videos and audio longer than 90 seconds are supported. Only the first 90 seconds will be used.</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onCreatorVideoSelect(file);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Section 1B: Top 50% Explanation Visuals */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        2. Top 50%: Explanation Visuals (Images or B-Roll Clips)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload 1 to 10 visual aids (photos, diagrams, screenshots) that cycle during speech
                      </p>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs">
                    <Plus size={14} className="text-orange-600" />
                    <span>Add Visuals</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          onAddExplanationFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                </div>

                {explanationItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {explanationItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group shadow-2xs aspect-video flex items-center justify-center"
                      >
                        {item.type === "video" ? (
                          <video src={item.previewUrl} className="h-full w-full object-cover" />
                        ) : (
                          <img src={item.previewUrl} alt="Visual" className="h-full w-full object-cover" />
                        )}
                        <span className="absolute top-1 left-1 rounded bg-black/70 text-white text-[9px] font-bold px-1 py-0.5">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveExplanationItem(item.id)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400 p-8 text-center transition cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drop top explanation visual images
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP, or MP4 b-roll clips</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          onAddExplanationFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Section 1C: Topic Title */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Floating Topic Title Badge (Center Divider)
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange(e.target.value)}
                  placeholder="e.g. ATOMIC HABITS: The 1% Rule"
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
                  <h3 className="text-base font-bold text-slate-900">Background Music &amp; Transition SFX</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a background soundtrack from the curated cloud library or audition tracks.
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
                          ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
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
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Visual Transition SFX</p>
                      <p className="text-[11px] text-slate-500">Subtle whoosh sound effects on top visual scene cuts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSfx}
                      onChange={(e) => onEnableSfxChange(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
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
                    <span>Next: Style &amp; Captions</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: STYLE & 32 KINETIC CAPTIONS ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Unified Visual Design System (12-System Master Theme Engine) */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-orange-500" />
                      <span>Unified Visual Design System (Dual-Zone Theme)</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        6 Master Themes
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Coordinates typography, colors, divider bars, charts, and captions across both top explanation and bottom creator zones.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(MASTER_THEMES).map((theme) => {
                    const isSelected = activeVisualTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setActiveVisualTheme(theme.id);
                          onVisualThemeChange?.(theme.id);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${isSelected
                            ? "border-orange-500 bg-orange-50/50 text-slate-900 shadow-xs ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          {isSelected && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Swatch Preview Box */}
                        <div
                          className="w-full h-10 rounded-lg flex items-center justify-between px-2.5 border shadow-inner"
                          style={{
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span
                              className="w-3 h-3 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                            <span
                              className="w-3 h-3 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.surface }}
                            />
                          </div>
                          <span
                            className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: theme.colors.badgeBg,
                              color: theme.colors.accent,
                            }}
                          >
                            {theme.typography.id.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {theme.description}
                        </p>
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-1.5 border-t border-slate-200/60 mt-auto">
                          <span>{theme.typography.headingFont.split(',')[0].replace(/['"]/g, '')}</span>
                          <span className="capitalize">{theme.motion.defaultTransition}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 32 Caption Styles Selector */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">32 Animated Kinetic Caption Styles</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subtitles will animate synced to spoken words over the creator talking-head video
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
                    const isSelected = (subtitleStyle || "Pop Word") === style.name;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onSubtitleStyleChange(style.name)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${isSelected
                          ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
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

          {/* ──────────────── STEP 4 (final): LIVE 9:16 SIMULATOR & RENDER ──────────────── */}
          {currentStep === SPLIT_STEPS.length && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Live 9:16 Split-Screen Simulator</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review the exact 50/50 split layout: Top explanation visuals and Bottom creator video.
                    </p>
                  </div>

                  {onRemoveAiWatermarkChange && (
                    <WatermarkRemoverToggle
                      removeAiWatermark={removeAiWatermark}
                      onRemoveAiWatermarkChange={onRemoveAiWatermarkChange}
                      variant="inline"
                    />
                  )}
                </div>

                {/* 50/50 Dual Zone Phone Mockup */}
                <div className="flex justify-center py-4">
                  <div className="relative w-72 h-[520px] rounded-[36px] bg-slate-950 p-2.5 shadow-2xl ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
                    {/* Phone Notch */}
                    <div className="relative z-20 mx-auto h-3.5 w-24 rounded-full bg-slate-900 flex items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-slate-700" />
                    </div>

                    {/* TOP 50%: EXPLANATION VISUALS ZONE */}
                    <div className="relative w-full h-[235px] rounded-t-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                      {explanationItems[0]?.previewUrl ? (
                        explanationItems[0].type === "video" ? (
                          <video src={explanationItems[0].previewUrl} className="h-full w-full object-cover" autoPlay muted loop />
                        ) : (
                          <img src={explanationItems[0].previewUrl} alt="Top Visual" className="h-full w-full object-cover" />
                        )
                      ) : (
                        <div className="text-slate-500 text-xs flex flex-col items-center">
                          <ImageIcon size={22} className="mb-1" />
                          <span>No Explanation Visual</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 rounded-md bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5">
                        EXPLANATION
                      </span>
                    </div>

                    {/* CENTER DIVIDER BAR & TOPIC TITLE BADGE */}
                    <div className="relative z-10 w-full h-7 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 flex items-center justify-center px-3 shadow-md">
                      <span className="text-[10px] font-black text-white truncate max-w-full uppercase tracking-wider">
                        {topicTitle || "TOPIC TITLE"}
                      </span>
                    </div>

                    {/* BOTTOM 50%: CREATOR TALKING-HEAD ZONE */}
                    <div className="relative w-full h-[235px] rounded-b-2xl overflow-hidden bg-black flex items-center justify-center">
                      {creatorVideoUrl ? (
                        <video src={creatorVideoUrl} className="h-full w-full object-cover" autoPlay muted loop />
                      ) : (
                        <div className="text-slate-500 text-xs flex flex-col items-center">
                          <User size={22} className="mb-1" />
                          <span>No Creator Video</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 rounded-md bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5">
                        CREATOR
                      </span>

                      {/* Subtitle Strip */}
                      <div className="absolute bottom-3 inset-x-2 text-center">
                        <span className="inline-block rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-black text-yellow-300 shadow-md">
                          {subtitleStyle || "Pop Word"} Captions
                        </span>
                      </div>
                    </div>

                    {/* Phone Bottom Pill */}
                    <div className="relative z-20 mx-auto h-1 w-20 rounded-full bg-white/30 my-0.5" />
                  </div>
                </div>

                {/* Review Gate Confirmation Checkbox */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={previewConfirmed}
                      onChange={(e) => setPreviewConfirmed(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-600 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        I have reviewed this 50/50 dual-zone layout and approve cloud rendering
                      </p>
                      <p className="text-[11px] text-slate-500">
                        AWS Remotion Lambda will render a 1080×1920 30 FPS MP4 with ducked background music and animated captions.
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
                    disabled={!isReadyToRender || !previewConfirmed || isGenerating}
                    onClick={onGenerate}
                    className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-8 text-xs font-black text-white shadow-md shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Submitting Render Job...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="transition group-hover:rotate-12" />
                        <span>Render Split-Screen Video (1 Credit)</span>
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
