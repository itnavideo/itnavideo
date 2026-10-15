"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Columns,
  Upload,
  UserCheck,
  Check,
  Clock3,
  Sliders,
  Trophy,
  Palette,
  Tv,
  Clock,
  ShieldCheck,
  Loader2,
  Play,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StickerStylePicker } from "@/components/compare/StickerStylePicker";
import { CompareImageSlots } from "@/components/compare/CompareImageSlots";
import { CompareExplainerShowcase } from "@/components/compare/CompareExplainerShowcase";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

interface CompareExplainerStudioProps {
  // Dual Images upload
  comparisonFiles: File[];
  onComparisonFilesChange: (files: File[]) => void;

  // Header Titles & Handle
  compareLeftTitle: string;
  onLeftTitleChange: (val: string) => void;
  compareRightTitle: string;
  onRightTitleChange: (val: string) => void;
  compareHandle: string;
  onHandleChange: (val: string) => void;

  // Comparison Style Variables
  compareTheme?: string;
  onThemeChange?: (val: string) => void;
  compareTone?: string;
  onToneChange?: (val: string) => void;
  compareWinner?: string;
  onWinnerChange?: (val: string) => void;
  compareImageStyle?: string;
  onImageStyleChange?: (val: string) => void;
  stickerStyle: string;
  onStickerStyleChange: (val: string) => void;
  compareCaptionStyle?: string;
  onCaptionStyleChange?: (val: string) => void;
  compareSpeakingPace?: "1.0" | "1.15" | "1.25";
  onSpeakingPaceChange?: (val: "1.0" | "1.15" | "1.25") => void;
  compareBgmTrack?: "tech" | "versus" | "corporate" | "none";
  onBgmTrackChange?: (val: "tech" | "versus" | "corporate" | "none") => void;

  // Aspect ratio option (strictly 9:16 Shorts)
  aspectRatio?: "9:16" | "16:9";
  onAspectRatioChange?: (val: "9:16" | "16:9") => void;

  // Audio voiceover file upload
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  // Actions
  onCleanAudio: () => void;
  isCleaning: boolean;
}

export function CompareExplainerStudio({
  comparisonFiles,
  onComparisonFilesChange,
  compareLeftTitle,
  onLeftTitleChange,
  compareRightTitle,
  onRightTitleChange,
  compareHandle,
  onHandleChange,
  compareTheme = "light",
  onThemeChange,
  compareTone = "versus",
  onToneChange,
  compareWinner = "none",
  onWinnerChange,
  stickerStyle,
  onStickerStyleChange,
  selectedFile,
  onSelectFile,
  onCleanAudio,
  isCleaning,
}: CompareExplainerStudioProps) {
  const [showHandleOnVideo, setShowHandleOnVideo] = useState(Boolean(compareHandle));
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

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

  const handleSelectExample = (left: string, right: string) => {
    onLeftTitleChange(left);
    onRightTitleChange(right);
  };

  const isReadyToRender = Boolean(selectedFile && comparisonFiles.length === 2);

  return (
    <div className="space-y-8">
      {/* 1. TOP SHOWCASE: 5 Featured Demo Videos */}
      <CompareExplainerShowcase onSelectTopicExample={handleSelectExample} />

      {/* 2. 2-COLUMN STANDARDIZED STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Input Controls (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 min-w-0 max-w-full overflow-x-hidden space-y-6">
          <div className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-7 shadow-2xl space-y-6 text-white">
            <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

            {/* Master Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/25">
                  <Sparkles size={22} className="fill-black/20" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-orange-400 mb-1">
                    <span>Versus Comparison Engine</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>Compare Explainer Studio</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Upload voiceover &amp; 2 split-screen visuals. AI animates character reactions, side-pointing, and winner reveal.
                  </p>
                </div>
              </div>

              {/* Rule 4.1 Strict Limits Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-black text-orange-300">
                  <Clock3 size={13} className="text-[#FFA000]" />
                  <span>9:16 Shorts · Max 90s · 1 Credit</span>
                </span>
              </div>
            </div>

            {/* Process Workflow Roadmap */}
            <StudioWorkflowRoadmap mode="compare" />

            {/* STEP 1: VOICEOVER NARRATION */}
            <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-[#FFA000]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                      Step 1 · Voiceover Narration
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      MP3, WAV, M4A or MP4 video • Your narration drives split-screen timing
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                    ✓ Audio Uploaded
                  </span>
                )}
              </div>

              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border border-dashed border-white/15 hover:border-[#FF5722]/50 hover:bg-white/[0.02] rounded-2xl bg-black/40 p-7 text-center cursor-pointer transition relative group"
                >
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="mx-auto h-8 w-8 text-zinc-500 group-hover:text-[#FFA000] transition mb-2.5" />
                  <p className="text-xs font-bold text-zinc-200">
                    Click to browse or drag &amp; drop your speech narration
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Supports MP3, WAV, M4A, or MP4 up to 50MB (max 90 seconds)
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-black/60 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-[#FFA000] text-sm">
                      🎤
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for Groq cloud transcription
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectFile(null)}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: DUAL COMPARISON IMAGES & TITLES */}
            <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-[#FFA000]">
                  <Columns size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Step 2 · Split-Screen Comparison Subjects
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Upload Option A (Left) &amp; Option B (Right) visual screenshots with descriptive titles.
                  </p>
                </div>
              </div>

              <CompareImageSlots
                files={comparisonFiles}
                onChange={onComparisonFilesChange}
                onError={(msg) => alert(msg)}
                leftTitle={compareLeftTitle}
                rightTitle={compareRightTitle}
                onLeftTitleChange={onLeftTitleChange}
                onRightTitleChange={onRightTitleChange}
              />
            </div>

            {/* STEP 3: CHARACTER PRESENTER SELECTION */}
            <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-[#FFA000]">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Step 3 · Presenter Character
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select an animated stickman or 3D host to react, compare and announce the winner.
                  </p>
                </div>
              </div>

              <StickerStylePicker
                value={stickerStyle}
                onChange={onStickerStyleChange}
              />
            </div>

            {/* STEP 4: VISUAL THEME & ADVANCED CONFIGURATION */}
            <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-[#FFA000]">
                    <Palette size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                      Step 4 · Visual Theme &amp; Winner
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Card background palette and automated winner reveal celebration.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition"
                >
                  <Sliders size={12} />
                  <span>{showAdvancedOptions ? "Simple View" : "Advanced"}</span>
                </button>
              </div>

              {/* Theme & Winner Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <span>Card Surface Palette</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "light", label: "Clean Studio (White)", bg: "bg-white text-slate-900" },
                      { id: "dark", label: "Obsidian Slate (Dark)", bg: "bg-slate-900 text-white" },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => onThemeChange?.(th.id)}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition text-left ${
                          compareTheme === th.id
                            ? "border-[#FF5722] bg-[#FF5722]/10 text-white ring-1 ring-[#FF5722]"
                            : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{th.label}</span>
                          {compareTheme === th.id && <Check size={12} className="text-[#FFA000]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Winner Reveal */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Trophy size={13} className="text-[#FFA000]" />
                    <span>Winner Celebration</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "none", label: "Draw / Neutral" },
                      { id: "left", label: compareLeftTitle ? `${compareLeftTitle.slice(0, 10)} wins` : "Left wins" },
                      { id: "right", label: compareRightTitle ? `${compareRightTitle.slice(0, 10)} wins` : "Right wins" },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => onWinnerChange?.(w.id)}
                        className={`rounded-xl border p-2 text-[11px] font-bold transition text-center truncate ${
                          compareWinner === w.id
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500"
                            : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Options Accordion */}
              {showAdvancedOptions && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">Creator Channel Watermark Handle</label>
                    <input
                      type="text"
                      maxLength={30}
                      value={compareHandle}
                      onChange={(e) => onHandleChange(e.target.value)}
                      placeholder="@yourchannel"
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-semibold text-white placeholder-zinc-600 outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Canvas Preview & Studio Output Config (4 cols sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Live Stage Preview
                </span>
              </div>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                9:16 Vertical
              </span>
            </div>

            {/* 9:16 Canvas Mockup Frame */}
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[260px] rounded-2xl border-2 border-white/10 bg-[#0B0F19] overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
              {/* Top Card (Option A) */}
              <div className="relative rounded-xl border border-white/15 bg-white/5 p-3 flex flex-col items-center justify-center min-h-[90px] text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFA000] mb-0.5">Option A</span>
                <p className="text-xs font-black text-white truncate max-w-full">
                  {compareLeftTitle || "Left Subject"}
                </p>
                <div className="mt-1 h-1.5 w-12 rounded-full bg-blue-500/40" />
              </div>

              {/* Center VS Badge + Host Reaction */}
              <div className="my-2 flex items-center justify-center relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black text-xs shadow-lg shadow-[#FF5722]/30 border-2 border-white/20">
                  VS
                </div>
                <div className="absolute right-3 text-lg animate-bounce">
                  {stickerStyle.includes("presenter") ? "🕺" : "🤾"}
                </div>
              </div>

              {/* Bottom Card (Option B) */}
              <div className="relative rounded-xl border border-white/15 bg-white/5 p-3 flex flex-col items-center justify-center min-h-[90px] text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7043] mb-0.5">Option B</span>
                <p className="text-xs font-black text-white truncate max-w-full">
                  {compareRightTitle || "Right Subject"}
                </p>
                <div className="mt-1 h-1.5 w-12 rounded-full bg-purple-500/40" />
              </div>

              {/* Winner Tag Preview */}
              {compareWinner !== "none" && (
                <div className="mt-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-1.5 text-center">
                  <span className="text-[10px] font-black text-emerald-400">
                    🏆 {compareWinner === "left" ? (compareLeftTitle || "Option A") : (compareRightTitle || "Option B")} WINS
                  </span>
                </div>
              )}
            </div>

            {/* Studio Output Specs Breakdown */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Tv size={12} className="text-slate-500" />
                  <span>Resolution</span>
                </span>
                <span className="font-bold text-white">1080×1920 (Vertical)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-500" />
                  <span>Max Duration</span>
                </span>
                <span className="font-bold text-white">Up to 90 Seconds</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Credit Cost</span>
                </span>
                <span className="font-bold text-emerald-400">1 Credit</span>
              </div>
            </div>

            {/* Primary Generate Button */}
            <button
              type="button"
              onClick={onCleanAudio}
              disabled={isCleaning || !isReadyToRender}
              className={`w-full inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-200 ${
                !isReadyToRender
                  ? "bg-[#141A28] text-zinc-500 border border-white/10 shadow-inner cursor-not-allowed"
                  : isCleaning
                  ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black opacity-80 cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-xl shadow-[#FF5722]/25 hover:brightness-110 active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isCleaning ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Directing Compare Scenes...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className={!isReadyToRender ? "text-zinc-600" : "text-black"} />
                  <span>
                    {!selectedFile
                      ? "Upload Voiceover Narration"
                      : comparisonFiles.length !== 2
                      ? "Upload 2 Comparison Images"
                      : "Generate Compare Reel (1 Credit)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
