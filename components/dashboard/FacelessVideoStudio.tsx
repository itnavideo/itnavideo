"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  Film,
  Plus,
  Music,
  Volume2,
  Subtitles,
  Check,
  CheckCircle2,
  Trash2,
  FileText,
  Clock3,
  Tv,
  Smartphone,
  Clapperboard,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  subtitleStyle?: string;
  onSubtitleStyleChange?: (style: string) => void;

  facelessBgmMood?: "lofi" | "tech" | "mystery" | "acoustic" | "none";
  onBgmMoodChange?: (val: "lofi" | "tech" | "mystery" | "acoustic" | "none") => void;

  facelessBgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  facelessPacingStyle?: "clean" | "cinematic" | "documentary" | "dynamic";
  onPacingStyleChange?: (style: "clean" | "cinematic" | "documentary" | "dynamic") => void;

  facelessEnableSfx?: boolean;
  onEnableSfxChange?: (enabled: boolean) => void;

  onGenerate: () => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  assetSourceMode: "library" | "upload" | "mix";
  onAssetSourceModeChange: (mode: "library" | "upload" | "mix") => void;

  uploadedImageFiles: File[];
  onUploadedImageFilesChange: (files: File[]) => void;

  aspectRatio?: "9:16" | "16:9";
  onAspectRatioChange?: (val: "9:16" | "16:9") => void;
}

// ── KINETIC SUBTITLE PRESETS ──
export const FACELESS_SUBTITLE_STYLES = [
  {
    id: "netflix-yellow",
    title: "Netflix Yellow",
    desc: "Classic yellow bold font with crisp black outline shadow.",
    badge: "Cinema Classic",
    bgImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="text-center font-black tracking-wide text-amber-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] text-xs sm:text-sm">
        <span>UNCOVERING THE <span className="text-white underline decoration-amber-400">LOST SECRET</span></span>
      </div>
    ),
  },
  {
    id: "documentary-serif",
    title: "Documentary Serif",
    desc: "Editorial serif captions with elegant dark glass backdrop.",
    badge: "Editorial",
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="rounded-xl bg-black/75 border border-white/10 px-3 py-1 text-center font-serif text-xs text-zinc-100 backdrop-blur-md">
        <span>History holds answers to future mysteries.</span>
      </div>
    ),
  },
  {
    id: "parallax-modern",
    title: "Parallax Modern",
    desc: "Bold white kinetic word zoom with purple brand highlight.",
    badge: "High Retention",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="text-center font-black tracking-tight text-white text-xs sm:text-sm drop-shadow-md">
        <span>THIS CHANGED <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent underline font-black">EVERYTHING</span></span>
      </div>
    ),
  },
  {
    id: "minimal-clean",
    title: "Minimal Clean",
    desc: "Crisp white typography with soft ambient drop shadow.",
    badge: "Minimalist",
    bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="text-center font-bold text-white text-xs sm:text-sm drop-shadow-md tracking-normal">
        <span>Simple, powerful narrative storytelling.</span>
      </div>
    ),
  },
  {
    id: "gold-editorial",
    title: "Gold Editorial",
    desc: "Metallic warm gold gradient headline typography.",
    badge: "Premium Gold",
    bgImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="text-center font-black text-amber-400 text-xs sm:text-sm drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]">
        <span>THE GOLDEN <span className="text-white">ERA</span></span>
      </div>
    ),
  },
];

export function FacelessVideoStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "netflix-yellow",
  onSubtitleStyleChange,
  facelessBgmMood = "mystery",
  onBgmMoodChange,
  facelessBgmVolume = 0.2,
  onBgmVolumeChange,
  facelessPacingStyle = "cinematic",
  onPacingStyleChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  assetSourceMode,
  onAssetSourceModeChange,
  uploadedImageFiles,
  onUploadedImageFilesChange,
  aspectRatio = "16:9",
  onAspectRatioChange,
}: FacelessVideoStudioProps) {
  const [internalRatio, setInternalRatio] = useState<"9:16" | "16:9">("16:9");
  const selectedRatio = aspectRatio !== undefined ? aspectRatio : internalRatio;
  const setRatio = (val: "9:16" | "16:9") => {
    setInternalRatio(val);
    onAspectRatioChange?.(val);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadedImageFilesChange([...uploadedImageFiles, ...Array.from(files)]);
      e.target.value = "";
    }
  };

  const removeMediaFile = (index: number) => {
    onUploadedImageFilesChange(uploadedImageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-orange-500/25">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Faceless Video Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Turn narration voiceovers into 1080p Full HD widescreen YouTube explainer videos.
            </p>
          </div>
        </div>

        {/* Aspect Ratio Badge: 16:9 Only */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300">
            <Tv size={14} className="text-[#FFA000]" />
            <span>16:9 Widescreen · Up to 10 min</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="facelessVideo" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── 1. VOICE OVER NARRATION AUDIO ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#070B14] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 text-sm font-black border border-orange-500/30">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Upload size={18} className="text-[#FF5722]" />
                    <span>Upload Narration Audio</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Upload your voiceover track (MP3, WAV, M4A up to 10 minutes).
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>{selectedFile ? "Audio Loaded" : "Upload Required"}</span>
              </span>
            </div>

            {/* Audio Upload Dropzone */}
            <div>
              <input
                type="file"
                accept="audio/*,video/*"
                id="faceless-audio-input"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) onSelectFile(file);
                }}
              />
              {!selectedFile ? (
                <label
                  htmlFor="faceless-audio-input"
                  className="rounded-3xl border-2 border-dashed border-white/15 bg-[#151E30]/80 p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:bg-[#151E30]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Select Audio Voiceover</p>
                    <p className="text-xs text-zinc-400 mt-1">MP3, WAV, M4A, AAC ({selectedRatio === "16:9" ? "10 min max" : "90s max"})</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-2 text-xs font-black text-white shadow-lg shadow-orange-500/25 hover:brightness-110 transition">
                    Browse Audio File
                  </span>
                </label>
              ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-[#151E30] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] text-white font-bold">
                      🎙️
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Audio Ready
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectFile(null)}
                    className="rounded-full border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. VISUAL B-ROLL ASSETS ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#070B14] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 text-sm font-black border border-orange-500/30">
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Film size={18} className="text-[#FF5722]" />
                    <span>Visual B-Roll &amp; Media Source</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Choose asset source mode for video visuals and cinematic stock matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Source Mode Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Asset Source Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "library", label: "Itnavideo Assets", detail: "Curated Stock B-Roll" },
                  { id: "upload", label: "Custom Uploads", detail: "Your Images/Clips Only" },
                  { id: "mix", label: "Mix Both", detail: "Custom + Stock Backup" },
                ].map((option) => {
                  const active = assetSourceMode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onAssetSourceModeChange(option.id as any)}
                      className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                        active
                          ? "border-orange-500 bg-orange-500/15 text-white font-bold ring-1 ring-orange-500 shadow-sm shadow-orange-500/20"
                          : "border-white/10 bg-[#151E30] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{option.label}</span>
                      <span className="mt-0.5 block text-[10px] text-zinc-400">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Uploads Button (if Upload or Mix selected) */}
            {(assetSourceMode === "upload" || assetSourceMode === "mix") && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-[#151E30] p-4 text-xs font-bold text-zinc-200 hover:border-orange-500/50 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <Plus size={16} className="text-orange-400" />
                  <span>Upload Custom Images or Video Clips</span>
                </label>

                {uploadedImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedImageFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#151E30] px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <span className="text-[10px]">{file.type.startsWith("image") ? "🖼️" : "🎬"}</span>
                        <span className="truncate max-w-[120px] text-[11px] font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeMediaFile(idx)}
                          className="text-zinc-500 hover:text-red-400 text-xs font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 3. CAPTION SUBTITLE STYLE ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#070B14] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 text-sm font-black border border-orange-500/30">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Subtitles size={18} className="text-[#FF5722]" />
                    <span>Subtitle Typography Style</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Word-synced animated subtitle presets.
                  </p>
                </div>
              </div>
            </div>

            {/* Subtitle Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FACELESS_SUBTITLE_STYLES.map((style) => {
                const isSelected = subtitleStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onSubtitleStyleChange?.(style.id)}
                    className={`group relative rounded-2xl border p-3 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/15 ring-2 ring-orange-500 shadow-xl shadow-orange-500/20 -translate-y-0.5"
                        : "border-white/10 bg-[#151E30] hover:border-orange-500/50 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mb-2">
                      <Image
                        src={style.bgImage}
                        alt={style.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60" />

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-md">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                        {style.renderCaption()}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                        {style.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {style.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. AUDIO SCORE & SFX ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#070B14] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 text-sm font-black border border-orange-500/30">
                  4
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Music size={18} className="text-[#FF5722]" />
                    <span>Background Music &amp; SFX</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Background music auto-ducking during speech + beat sound effects.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Background Music Mood</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "mystery", label: "🕯️ Mystery Cinema" },
                  { id: "lofi", label: "🎧 Ambient Lo-Fi" },
                  { id: "tech", label: "⚡ Tech Pulse" },
                  { id: "none", label: "🔇 No Music" },
                ].map((bgm) => {
                  const active = facelessBgmMood === bgm.id;
                  return (
                    <button
                      key={bgm.id}
                      type="button"
                      onClick={() => onBgmMoodChange?.(bgm.id as any)}
                      className={`rounded-2xl border p-3 text-center text-xs font-bold transition cursor-pointer ${
                        active
                          ? "border-orange-500 bg-orange-500/15 text-white ring-1 ring-orange-500 shadow-sm shadow-orange-500/20"
                          : "border-white/10 bg-[#151E30] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {bgm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#151E30] p-3.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 size={14} className="text-[#FF5722]" />
                    <span>Beat Sound Effects (SFX)</span>
                  </p>
                  <p className="text-[10px] text-zinc-400">Auto-timed transition whooshes</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    facelessEnableSfx ? "bg-orange-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      facelessEnableSfx ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {facelessBgmMood !== "none" ? (
                <div className="rounded-2xl border border-white/10 bg-[#151E30] p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300 font-bold">
                    <span>BGM Mix Volume</span>
                    <span className="font-mono text-orange-400">{Math.round((facelessBgmVolume || 0.2) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={facelessBgmVolume || 0.2}
                    onChange={(e) => onBgmVolumeChange?.(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-[#151E30]/50 p-3.5 flex items-center text-xs text-zinc-500 italic">
                  Background music disabled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Video Preview Stage (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#070B14] p-5 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Clapperboard size={15} className="text-[#FF5722]" />
                <span>{selectedRatio === "16:9" ? "16:9 Widescreen Stage" : "9:16 Vertical Stage"}</span>
              </h3>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                {selectedRatio === "16:9" ? "1920×1080 Full HD" : "1080×1920 Full HD"}
              </span>
            </div>

            {/* Video Stage Player */}
            <div className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center ${
              selectedRatio === "16:9" ? "aspect-video" : "aspect-[9/16] max-h-[480px]"
            }`}>
              {renderedVideoUrl ? (
                <video
                  src={renderedVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-md">
                    <Film size={24} />
                  </div>
                  <p className="text-xs font-bold text-white max-w-[240px]">
                    {selectedRatio === "16:9" ? "16:9 Full HD" : "9:16 Vertical"} Faceless Video preview will appear here upon rendering.
                  </p>
                  <p className="text-[10px] text-zinc-400 max-w-[220px]">
                    Curated B-Roll scenes, motion subtitles, and audio score synced to your narration.
                  </p>
                </div>
              )}
            </div>

            {/* Direct Action Generate Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !selectedFile}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 p-4 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition active:scale-95 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Rendering Faceless Video..." : "Generate Faceless Video"}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 font-medium">
              <span>Cost: {selectedRatio === "16:9" ? "1 Min = 1 Credit" : "1 Credit / Video"}</span>
              <span>Processing: ~60s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacelessVideoStudio;
