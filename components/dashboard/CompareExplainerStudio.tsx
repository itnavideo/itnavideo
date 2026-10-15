"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Columns,
  Upload,
  UserCheck,
  Share2,
  Check,
  Clock3,
  Sliders,
  Trophy,
  Palette,
  ShieldAlert,
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
      {/* 1. TOP SHOWCASE: 5 Featured Cloudinary Demo Videos */}
      <CompareExplainerShowcase onSelectTopicExample={handleSelectExample} />

      {/* 2. MAIN CREATIVE STUDIO CONTAINER */}
      <div className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
        {/* Magic UI BorderBeam Glowing Effect */}
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
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Compare Explainer Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Upload your voiceover &amp; 2 split-screen visuals. AI animates character reactions, side-pointing, and winner reveal.
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
                Choose your avatar presenter (100% verified Cloudinary assets)
              </p>
            </div>
          </div>

          <StickerStylePicker value={stickerStyle} onChange={onStickerStyleChange} />
        </div>

        {/* STEP 4: STYLING & WATERMARK (OPTIONAL / STREAMLINED) */}
        <div className="rounded-[24px] border border-white/10 bg-[#070B14] p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-[#FFA000]">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Step 4 · Styling &amp; Watermark</span>
                  <span className="text-[10px] text-zinc-400 font-semibold normal-case">(Optional)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Customize background theme, comparison tone, and winner reveal crown.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 transition cursor-pointer"
            >
              {showAdvancedOptions ? "Hide Options ▲" : "Customize ▼"}
            </button>
          </div>

          {showAdvancedOptions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Theme Selector */}
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Palette size={13} className="text-[#FFA000]" />
                    <span>Background Theme</span>
                  </span>
                  <span className="text-[10px] text-[#FFA000] font-semibold">{compareTheme.toUpperCase()}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: "light", label: "Light Studio" },
                    { id: "dark", label: "Dark Slate" },
                    { id: "bold", label: "Bold Contrast" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onThemeChange?.(t.id)}
                      className={`rounded-xl py-2 px-1 text-[11px] font-extrabold transition cursor-pointer ${
                        compareTheme === t.id
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black shadow-md font-black"
                          : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selector */}
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert size={13} className="text-[#FFA000]" />
                    <span>Comparison Tone</span>
                  </span>
                  <span className="text-[10px] text-[#FFA000] font-semibold">
                    {compareTone === "goodBad" ? "Good vs Bad" : "Neutral A vs B"}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "versus", label: "Neutral A vs B" },
                    { id: "goodBad", label: "Good vs Bad (Green/Red)" },
                  ].map((tn) => (
                    <button
                      key={tn.id}
                      type="button"
                      onClick={() => onToneChange?.(tn.id)}
                      className={`rounded-xl py-2 px-2 text-[10px] font-extrabold transition cursor-pointer text-center ${
                        compareTone === tn.id
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black shadow-md font-black"
                          : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {tn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Winner Reveal */}
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Trophy size={13} className="text-[#FFA000]" />
                    <span>Winner Crown Reveal</span>
                  </span>
                  <span className="text-[10px] text-[#FFA000] font-semibold">{compareWinner.toUpperCase()}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: "none", label: "No Crown" },
                    { id: "left", label: "Option A 👑" },
                    { id: "right", label: "Option B 👑" },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => onWinnerChange?.(w.id)}
                      className={`rounded-xl py-2 px-1 text-[10px] font-extrabold transition cursor-pointer ${
                        compareWinner === w.id
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black shadow-md font-black"
                          : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Optional Instagram Handle Watermark */}
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Share2 size={14} className="text-[#FFA000]" />
                <span>Instagram / Channel Watermark Handle</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showHandleOnVideo}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setShowHandleOnVideo(checked);
                    if (!checked) {
                      onHandleChange("");
                    } else if (!compareHandle) {
                      onHandleChange("@yourchannel");
                    }
                  }}
                  className="h-4 w-4 rounded border-white/20 bg-black text-[#FF5722] focus:ring-[#FF5722] focus:ring-offset-0 accent-[#FF5722] cursor-pointer"
                />
                <span className="text-xs font-semibold text-zinc-300">Show on video corner</span>
              </label>
            </div>

            <input
              type="text"
              maxLength={30}
              value={compareHandle}
              onChange={(e) => onHandleChange(e.target.value)}
              placeholder="@yourchannel"
              disabled={!showHandleOnVideo}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-white placeholder-zinc-600 outline-none transition ${
                showHandleOnVideo
                  ? "border-white/10 bg-black/60 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20"
                  : "border-white/5 bg-black/20 opacity-40 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Automated Inclusions Pill Box */}
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5 text-center">
            <p className="text-[11px] font-bold text-zinc-400 mb-2">
              ✨ AI automatically powers:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "Character side pointing",
                "Winner celebration",
                "Thinking reactions",
                "Split-screen zoom beats",
                "Versus sound effects",
                "Kinetic subtitles",
              ].map((feat) => (
                <span
                  key={feat}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-zinc-300"
                >
                  <Check size={11} className="text-[#FFA000]" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PRIMARY STICKY CTA FLOATING ACTION BAR */}
        <div className="sticky bottom-4 z-40 rounded-2xl border border-[#FF5722]/40 bg-[#0E1526]/95 backdrop-blur-md p-4 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/25">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">
                {compareLeftTitle || "Option A"} vs {compareRightTitle || "Option B"}
              </p>
              <p className="text-[11px] text-[#FFA000] font-semibold flex items-center gap-2 mt-0.5">
                <span className={selectedFile ? "text-emerald-400" : "text-amber-400"}>
                  {selectedFile ? "✓ Voiceover Ready" : "Upload Voiceover"}
                </span>
                <span>•</span>
                <span className={comparisonFiles.length === 2 ? "text-emerald-400" : "text-amber-400"}>
                  {comparisonFiles.length === 2 ? "✓ 2/2 Visuals Ready" : `${comparisonFiles.length}/2 Visuals`}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCleanAudio}
            disabled={isCleaning || !isReadyToRender}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-7 py-3 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 transition active:scale-95 hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
          >
            <Sparkles size={15} />
            <span>{isCleaning ? "Directing Compare Scenes..." : "✨ Generate Compare Reel (1 Credit)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
