"use client";

import React from "react";
import {
  Sparkles,
  Columns,
  Upload,
  UserCheck,
  Share2,
  Check,
  Clock3,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StickerStylePicker } from "@/components/compare/StickerStylePicker";
import { CompareImageSlots } from "@/components/compare/CompareImageSlots";
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
  compareImageStyle = "rounded",
  onImageStyleChange,
  stickerStyle,
  onStickerStyleChange,
  selectedFile,
  onSelectFile,
  onCleanAudio,
  isCleaning,
}: CompareExplainerStudioProps) {
  const [showHandleOnVideo, setShowHandleOnVideo] = React.useState(Boolean(compareHandle));

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

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md shadow-[#FF6D00]/25">
            <Sparkles size={20} className="fill-black/20" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Compare Explainer Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Create high-retention 9:16 comparison shorts with side-by-side visual beats & stickers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            <span>9:16 Vertical • 1080p Full HD</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="compare" />
      {/* STEP 1: VOICEOVER */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <Upload size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">1. VOICEOVER</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">MP3 or WAV • Your narration drives the video</p>
          </div>
        </div>

        {!selectedFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border border-dashed border-white/15 hover:border-[#FF6D00]/40 rounded-2xl bg-[#07090E]/60 p-8 text-center cursor-pointer transition relative group"
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="mx-auto h-8 w-8 text-zinc-500 group-hover:text-[#FF9100] transition mb-3" />
            <p className="text-xs font-bold text-zinc-200">Upload Voiceover</p>
            <p className="text-[10px] text-zinc-400 mt-1">Supports MP3, WAV, M4A up to 50MB</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6D00]/10 text-[#FF9100]">
                <span className="text-xs font-bold">🎤</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectFile(null)}
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3 py-1.5 text-[10px] font-bold text-zinc-300 transition"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* STEP 2: COMPARISON */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <Columns size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">2. COMPARISON</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Upload Image A & Name A, plus Image B & Name B.</p>
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

      {/* STEP 3: CHARACTER */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <UserCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">3. CHARACTER</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Choose your presenter</p>
          </div>
        </div>

        <StickerStylePicker value={stickerStyle} onChange={onStickerStyleChange} />
      </div>

      {/* STEP 4: VISUAL THEME & OPTIONS */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-lg space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">4. THEME & OPTIONS</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Customize theme, side tone, and winner reveal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme Selector */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>Background Theme</span>
              <span className="text-[10px] text-[#FFA726] font-semibold">{compareTheme.toUpperCase()}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "light", label: "Light Studio" },
                { id: "dark", label: "Dark Obsidian" },
                { id: "bold", label: "Bold Purple" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onThemeChange?.(t.id)}
                  className={`rounded-xl py-2 px-1 text-[11px] font-extrabold transition cursor-pointer ${
                    compareTheme === t.id
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>Comparison Tone</span>
              <span className="text-[10px] text-[#FFA726] font-semibold">{compareTone === "goodBad" ? "Good vs Bad" : "A vs B"}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: "versus", label: "Neutral A vs B (Blue/Purple)" },
                { id: "goodBad", label: "Good vs Bad (Green/Red)" },
              ].map((tn) => (
                <button
                  key={tn.id}
                  type="button"
                  onClick={() => onToneChange?.(tn.id)}
                  className={`rounded-xl py-2 px-2 text-[10px] font-extrabold transition cursor-pointer text-center ${
                    compareTone === tn.id
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {tn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Winner Reveal */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>End Winner Crown Reveal</span>
              <span className="text-[10px] text-[#FFA726] font-semibold">{compareWinner.toUpperCase()}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "none", label: "No Winner" },
                { id: "left", label: "Option A Wins 👑" },
                { id: "right", label: "Option B Wins 👑" },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onWinnerChange?.(w.id)}
                  className={`rounded-xl py-2 px-1 text-[10px] font-extrabold transition cursor-pointer ${
                    compareWinner === w.id
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Frame Style */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>Image Card Frame</span>
              <span className="text-[10px] text-[#FFA726] font-semibold">{compareImageStyle.toUpperCase()}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "rounded", label: "Rounded" },
                { id: "circle", label: "Circle" },
                { id: "phone", label: "Phone Mock" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onImageStyleChange?.(st.id)}
                  className={`rounded-xl py-2 px-1 text-[10px] font-extrabold transition cursor-pointer ${
                    compareImageStyle === st.id
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md font-black"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 5: OPTIONAL */}
      <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-lg space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <Share2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">5. OPTIONAL</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Instagram handle</p>
          </div>
        </div>

        {/* Optional Instagram Handle */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Share2 size={14} className="text-[#FF8F00]" />
              <span>Instagram handle</span>
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
                    onHandleChange("@yourusername");
                  }
                }}
                className="h-4 w-4 rounded border-white/20 bg-black text-[#FF6D00] focus:ring-[#FF6D00] focus:ring-offset-0 accent-[#FF6D00] cursor-pointer"
              />
              <span className="text-xs font-semibold text-zinc-300">Show on video</span>
            </label>
          </div>

          <input
            type="text"
            maxLength={30}
            value={compareHandle}
            onChange={(e) => onHandleChange(e.target.value)}
            placeholder="@username"
            disabled={!showHandleOnVideo}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-white placeholder-zinc-600 outline-none transition ${
              showHandleOnVideo
                ? "border-white/10 bg-black/60 focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]/20"
                : "border-white/5 bg-black/20 opacity-40 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Submit Rendering CTA Button */}
        <button
          type="button"
          onClick={onCleanAudio}
          disabled={isCleaning || !selectedFile || comparisonFiles.length !== 2}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-3xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] p-4.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition active:scale-[0.97] hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
        >
          <Sparkles size={16} />
          <span>{isCleaning ? "Directing Compare Scenes..." : "✨ Generate Compare Reel"}</span>
        </button>

        {/* Automatic Value Inclusions (Selling Point) */}
        <div className="rounded-2xl border border-white/5 bg-black/30 p-3.5 text-center">
          <p className="text-[11px] font-bold text-zinc-400 mb-2">
            AI automatically adds:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "Character poses",
              "Expressions",
              "Transitions",
              "Versus SFX",
              "Captions",
            ].map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-zinc-300"
              >
                <Check size={11} className="text-[#FFA726]" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PRIMARY STICKY CTA FLOATING ACTION BAR */}
      <div className="sticky bottom-4 z-40 rounded-2xl border border-[#FF6D00]/40 bg-[#0E1526]/95 backdrop-blur-md p-3.5 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] text-black font-black shadow-md shadow-[#FF6D00]/25">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-white truncate">
              {compareLeftTitle || "Option A"} vs {compareRightTitle || "Option B"}
            </p>
            <p className="text-[10px] text-[#FF9100] font-semibold flex items-center gap-1.5 mt-0.5">
              <span>{selectedFile ? "Voiceover Ready" : "Upload Voiceover"}</span>
              <span>•</span>
              <span>{comparisonFiles.length === 2 ? "2/2 Images Ready" : `${comparisonFiles.length}/2 Images`}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCleanAudio}
          disabled={isCleaning || !selectedFile || comparisonFiles.length !== 2}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition active:scale-95 hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
        >
          <Sparkles size={15} />
          <span>{isCleaning ? "Directing..." : "✨ Generate Compare Reel"}</span>
        </button>
      </div>
    </div>
  );
}
