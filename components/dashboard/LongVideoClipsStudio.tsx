"use client";

import React from "react";
import {
  Sparkles,
  Sliders,
  Upload,
  Captions,
  Zap,
  Globe,
  Youtube,
  Trash2,
  User,
  LayoutGrid,
  Maximize2,
  Video,
  CheckCircle2,
  Check,
  Flame,
  Star,
  Clock3,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

export interface LongVideoClipsStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  inputMode?: "file" | "youtube";
  onInputModeChange?: (mode: "file" | "youtube") => void;
  youtubeUrl?: string;
  onYoutubeUrlChange?: (url: string) => void;

  layoutMode?: "auto-speaker" | "split-screen" | "fit-widescreen";
  onLayoutModeChange?: (mode: "auto-speaker" | "split-screen" | "fit-widescreen") => void;

  clipCount: number;
  onClipCountChange: (val: number) => void;

  clipDuration: "auto" | "under-30" | "30-60" | "60-90" | number;
  onClipDurationChange: (val: "auto" | "under-30" | "30-60" | "60-90") => void;

  clipsHookStrategy: "auto" | "high-energy" | "actionable" | "story";
  onClipsHookStrategyChange: (val: "auto" | "high-energy" | "actionable" | "story") => void;

  clipsTopBanner?: "none" | "glass-pill" | "yellow-ticker";
  onClipsTopBannerChange?: (val: "none" | "glass-pill" | "yellow-ticker") => void;

  enableClipsCaptions: boolean;
  onEnableClipsCaptionsChange: (val: boolean) => void;

  captionStyle: string;
  onCaptionStyleChange: (val: string) => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export const CLIPS_CAPTION_PRESETS = [
  {
    id: "hormozi-pop",
    name: "Hormozi Pop",
    desc: "Yellow & green word highlights with rapid scale pops",
    badge: "🔥 Most Viral",
    previewText: "VIRAL HOOK",
    previewStyle: "bg-[#FFE600] text-black font-black tracking-tight uppercase px-2 py-0.5 rounded shadow-lg",
  },
  {
    id: "mrbeast-impact",
    name: "MrBeast Impact",
    desc: "Heavy bold white text with thick black outline stroke",
    badge: "⚡ High Retention",
    previewText: "BIG MOMENT!",
    previewStyle: "text-white font-black tracking-wider uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,1)]",
  },
  {
    id: "submagic-glow",
    name: "Submagic Glow",
    desc: "Cyan & orange neon gradient glow with smooth box pop",
    badge: "✨ Cyber Neon",
    previewText: "NEXT LEVEL",
    previewStyle: "text-cyan-300 font-extrabold tracking-wide uppercase drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    desc: "Crisp white typography on soft dark glass backdrop",
    badge: "📐 Editorial",
    previewText: "Clean Insights",
    previewStyle: "text-white font-semibold tracking-normal bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10",
  },
  {
    id: "none",
    name: "No Captions",
    desc: "Clean raw video export without subtitle overlays",
    badge: "🔇 Raw Video",
    previewText: "No Captions",
    previewStyle: "text-zinc-500 font-medium italic text-xs",
  },
];

export function LongVideoClipsStudio({
  selectedFile,
  onSelectFile,
  inputMode = "file",
  onInputModeChange,
  youtubeUrl = "",
  onYoutubeUrlChange,
  layoutMode = "auto-speaker",
  onLayoutModeChange,
  clipCount,
  onClipCountChange,
  clipDuration,
  onClipDurationChange,
  clipsHookStrategy,
  onClipsHookStrategyChange,
  enableClipsCaptions,
  onEnableClipsCaptionsChange,
  captionStyle,
  onCaptionStyleChange,
  onGenerate,
  isGenerating,
}: LongVideoClipsStudioProps) {

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const handleCaptionSelect = (presetId: string) => {
    if (presetId === "none") {
      onEnableClipsCaptionsChange(false);
      onCaptionStyleChange("none");
    } else {
      onEnableClipsCaptionsChange(true);
      onCaptionStyleChange(presetId);
    }
  };

  const activeCaptionPreset = !enableClipsCaptions ? "none" : (captionStyle || "hormozi-pop");

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25">
            <Sparkles size={20} className="fill-black/20" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Long Video to Shorts Clips Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Extract viral viral short clips from long videos or YouTube links with AI hook detection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF7043]" />
            <span>Input: Up to 3 Hours • Output: 9:16 Shorts</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="longVideoClips" />
      {/* Left Column: Form Settings (7 cols) */}
      <div className="lg:col-span-7 space-y-6 sm:space-y-8">
        
        {/* STEP 1: CHOOSE VIDEO SOURCE */}
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FF9100]">
                <Video size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">1. Choose Video Source</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Upload a long video file or paste a YouTube URL.</p>
              </div>
            </div>

            {/* Input Mode Switcher Pill */}
            <div className="flex rounded-xl bg-[#161720] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => onInputModeChange?.("file")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  inputMode === "file"
                    ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Upload size={13} />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => onInputModeChange?.("youtube")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  inputMode === "youtube"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white font-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Youtube size={13} />
                <span>YouTube Link</span>
              </button>
            </div>
          </div>

          {/* File Upload Mode */}
          {inputMode === "file" && (
            <div>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-white/15 bg-[#161720] hover:border-[#FF5722]/50 rounded-2xl p-8 text-center cursor-pointer transition relative group flex flex-col items-center justify-center gap-2"
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF9100] border border-[#FF5722]/20 group-hover:scale-105 transition">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-bold text-white">Drag &amp; drop source video, or click to browse</p>
                  <p className="text-[10px] text-zinc-400">Supports MP4, MOV, WEBM up to 3GB</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-[#161720] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black font-bold">
                      <Video size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Slicing
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
          )}

          {/* YouTube Link Mode */}
          {inputMode === "youtube" && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-red-500">
                  <Youtube size={18} />
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => onYoutubeUrlChange?.(e.target.value)}
                  placeholder="Paste YouTube video link (e.g. https://youtube.com/watch?v=...)"
                  className="w-full rounded-2xl border border-white/10 bg-[#161720] pl-11 pr-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                />
              </div>
              {youtubeUrl && /(youtube\.com|youtu\.be)/i.test(youtubeUrl) ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={15} />
                  <span>Valid YouTube URL detected! Speech AI will chunk stream directly in cloud.</span>
                </div>
              ) : youtubeUrl ? (
                <p className="text-[10px] text-amber-400 pl-1">Please enter a valid YouTube video URL</p>
              ) : null}
            </div>
          )}
        </div>

        {/* STEP 2: SPEAKER REFRAMING & 9:16 LAYOUT */}
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FF9100]">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">2. Speaker Reframing &amp; 9:16 Layout</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Computer Vision face tracking &amp; dynamic 9:16 pan-and-crop.</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF9100]">
              9:16 Full HD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "auto-speaker" as const,
                title: "Auto Active Speaker",
                desc: "Face tracking & pan-and-crop",
                icon: User,
                badge: "Single Speaker",
              },
              {
                id: "split-screen" as const,
                title: "Split Screen",
                desc: "Top & bottom stacked 50/50",
                icon: LayoutGrid,
                badge: "2-Person Podcast",
              },
              {
                id: "fit-widescreen" as const,
                title: "Fit Widescreen",
                desc: "Original 16:9 + ambient blur",
                icon: Maximize2,
                badge: "Blurred Background",
              },
            ].map((mode) => {
              const active = layoutMode === mode.id;
              const IconComp = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onLayoutModeChange?.(mode.id)}
                  className={`rounded-2xl border p-3.5 text-left transition duration-200 cursor-pointer active:scale-95 flex flex-col justify-between ${
                    active
                      ? "border-[#FF5722] bg-[#FF5722]/10 ring-1 ring-[#FF5722] text-white font-black shadow-lg shadow-[#FF5722]/20"
                      : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-[#FF5722] text-black" : "bg-white/5 text-zinc-400"}`}>
                        <IconComp size={16} />
                      </div>
                      <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider">{mode.badge}</span>
                    </div>
                    <p className="text-xs font-black text-white">{mode.title}</p>
                    <p className="text-[10px] opacity-80 mt-1 leading-tight">{mode.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: SUBTITLE CAPTION PRESET SELECTOR */}
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FF9100]">
                <Captions size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">3. Kinetic Caption Preset</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Select high-converting animated subtitle styles for short-form retention.</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-black text-indigo-300">
              <Globe size={11} />
              <span>Auto Detect Language</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLIPS_CAPTION_PRESETS.map((preset) => {
              const isSelected = activeCaptionPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleCaptionSelect(preset.id)}
                  className={`rounded-2xl border p-3.5 text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#FF5722] bg-[#FF5722]/10 ring-2 ring-[#FF5722] shadow-xl shadow-[#FF5722]/25"
                      : "border-white/10 bg-[#161720] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#FF9100]">
                      {preset.badge}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-tight mb-3">{preset.desc}</p>

                  <div className="h-8 w-full rounded-xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden">
                    <span className={preset.previewStyle}>{preset.previewText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 4: CLIP PACING & QUANTITY CONTROLS */}
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FF9100]">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">4. Extraction Quantity &amp; Pacing</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Control clip count, length boundaries, and AI hook strategy.</p>
              </div>
            </div>
          </div>

          {/* Clip Count Pills */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2.5">Number of Clips to Slices</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 0, label: "AI Auto (~5 Clips)" },
                { value: 3, label: "3 Clips" },
                { value: 5, label: "5 Clips" },
                { value: 10, label: "10 Clips" },
              ].map((item) => {
                const isActive = clipCount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onClipCountChange(item.value)}
                    className={`rounded-xl py-2.5 px-3 text-center text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md"
                        : "bg-[#161720] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clip Duration Pills */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2.5">Target Clip Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: "auto" as const, label: "AI Auto" },
                { val: "under-30" as const, label: "Under 30s" },
                { val: "30-60" as const, label: "30–60s" },
                { val: "60-90" as const, label: "60–90s" },
              ].map((item) => {
                const isActive = clipDuration === item.val || (item.val === "auto" && (!clipDuration || clipDuration === 0));
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onClipDurationChange(item.val as any)}
                    className={`rounded-xl py-2.5 px-3 text-center text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md"
                        : "bg-[#161720] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Focus Strategy */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2.5">AI Hook Moment Focus</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "auto", label: "Auto Moments" },
                { id: "actionable", label: "Educational" },
                { id: "high-energy", label: "High Energy" },
                { id: "story", label: "Storytelling" },
              ].map((strat) => {
                const active = clipsHookStrategy === strat.id || (strat.id === "auto" && !clipsHookStrategy);
                return (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => onClipsHookStrategyChange(strat.id as any)}
                    className={`rounded-xl py-2.5 px-3 text-center text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md"
                        : "bg-[#161720] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {strat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credit Estimation Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#161720] p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] border border-[#FF5722]/30">
                <Zap size={16} className="fill-[#FF9100]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Estimated Generation Cost</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Calculated for <span className="font-bold text-[#FF9100]">{(clipCount === 0 ? 5 : clipCount)} parallel 9:16 Shorts</span>
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-[#FF9100]">{(clipCount === 0 ? 5 : clipCount) + 2} Credits</span>
          </div>
        </div>
      </div>

      {/* Right Column: Live Information & Primary CTA Stage (5 cols) */}
      <div className="lg:col-span-5 sticky top-24 space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-2xl space-y-6 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Live 9:16 Preview
              </span>
            </div>
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
              9:16 Shorts
            </span>
          </div>

          {/* 9:16 Canvas Mockup Frame */}
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[250px] rounded-2xl border-2 border-white/10 bg-[#0B0F19] overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
            {/* Top Watermark */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-0.5 text-[9px] font-black text-[#FFA000]">
                <span>⚡ AI Viral Clip</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                {layoutMode === "auto-speaker" ? "Auto-Speaker" : layoutMode === "split-screen" ? "Split-Screen" : "Fit 16:9"}
              </span>
            </div>

            {/* Center Video Frame Mockup */}
            <div className="relative z-10 my-auto text-center space-y-3 px-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <span className="text-2xl animate-pulse">🎙️</span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-white line-clamp-2">
                  {selectedFile ? selectedFile.name : youtubeUrl ? "YouTube Video Repurposing" : "Upload long video or paste URL"}
                </p>
                <p className="text-[9px] text-[#FFA000] font-bold">
                  {clipCount === 0 ? "Extracting 5-10 Top Hooks" : `${clipCount} Shorts Clips`}
                </p>
              </div>

              {/* Caption Overlay Preview */}
              {enableClipsCaptions && (
                <div className="mt-2 inline-block rounded-md bg-[#FFE600] px-2.5 py-0.5 text-[10px] font-black uppercase text-black shadow-md">
                  VIRAL HOOK
                </div>
              )}
            </div>

            {/* Bottom Scrubber */}
            <div className="relative z-10 rounded-xl bg-black/80 p-2 backdrop-blur-sm space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-300">
                <span>30-60s Clip</span>
                <span className="text-[#FFA000]">1080×1920</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-2/5 bg-gradient-to-r from-[#FF5722] to-[#FFA000] rounded-full" />
              </div>
            </div>
          </div>

          {/* Specs & Credit Cost Breakdown */}
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Output Format</span>
              <span className="font-bold text-white">9:16 Vertical (1080×1920)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Clip Target Length</span>
              <span className="font-bold text-white">30s–60s Viral Hooks</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Estimated Cost</span>
              <span className="font-bold text-[#FFA000]">{(clipCount === 0 ? 5 : clipCount) * 2} Credits (2 Cr/Clip)</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={
              isGenerating ||
              (inputMode === "youtube"
                ? !youtubeUrl || !/(youtube\.com|youtu\.be)/i.test(youtubeUrl)
                : !selectedFile)
            }
            className={`w-full inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-200 ${
              (inputMode === "youtube" ? !youtubeUrl : !selectedFile)
                ? "bg-[#141A28] text-zinc-500 border border-white/10 shadow-inner cursor-not-allowed"
                : isGenerating
                ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black opacity-80 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-xl shadow-[#FF5722]/25 hover:brightness-110 active:scale-[0.99] cursor-pointer"
            }`}
          >
            <Sparkles size={16} className={(inputMode === "youtube" ? !youtubeUrl : !selectedFile) ? "text-zinc-600" : "text-black"} />
            <span>
              {isGenerating
                ? "Transcribing & Extracting Clips..."
                : inputMode === "youtube" && !youtubeUrl
                ? "Paste YouTube URL Above"
                : !selectedFile && inputMode === "file"
                ? "Upload Long Video Above"
                : "Extract 9:16 Viral Clips"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LongVideoClipsStudio;
