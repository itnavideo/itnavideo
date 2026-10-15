"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Sliders,
  Upload,
  CheckCircle2,
  FileAudio,
  Film,
  Zap,
  PenTool,
  Mic,
  Radio,
  FileText,
  Volume2,
  Trash2,
  Clock3,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import {
  TypographyStylePicker,
  getTypographyStyle,
} from "@/components/typography/TypographyStylePicker";

export interface TypographyStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  scriptText?: string;
  onScriptTextChange?: (text: string) => void;

  narrationMode?: "script" | "upload";
  onNarrationModeChange?: (mode: "script" | "upload") => void;

  selectedVoice?: string;
  onSelectVoiceChange?: (voice: string) => void;

  typographyStyle: string;
  onTypographyStyleChange: (val: string) => void;

  typographySfxIntensity: "full" | "subtle" | "none";
  onTypographySfxIntensityChange: (val: "full" | "subtle" | "none") => void;

  typographyPacing: "fast" | "smooth";
  onTypographyPacingChange: (val: "fast" | "smooth") => void;

  typographyTextCase: "uppercase" | "natural";
  onTypographyTextCaseChange: (val: "uppercase" | "natural") => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export function TypographyStudio({
  selectedFile,
  onSelectFile,
  scriptText = "",
  onScriptTextChange,
  typographyStyle,
  onTypographyStyleChange,
  typographySfxIntensity,
  onTypographySfxIntensityChange,
  typographyPacing,
  onTypographyPacingChange,
  typographyTextCase,
  onTypographyTextCaseChange,
  onGenerate,
  isGenerating,
}: TypographyStudioProps) {
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
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25">
            <Sparkles size={20} className="fill-black/20" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Kinetic Motion Video Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Transform speech &amp; voiceovers into dynamic, motion-driven 9:16 kinetic text videos for Reels, TikTok, and YouTube Shorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF7043]" />
            <span>9:16 Vertical • 1080p Full HD</span>
          </span>
        </div>
      </div>

      {/* STANDARDIZED STUDIO GRID: LEFT INPUT CONTROLS + RIGHT LIVE PREVIEW & CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7-8 cols): Input Controls */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 min-w-0">
          {/* STEP 1: SPEAKING AUDIO / VIDEO UPLOAD & TRANSCRIPT EDITOR */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Upload size={18} className="text-[#FF9100]" />
                    <span>Upload Speaking Video or Voiceover Track</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    MP4, MOV, MP3, WAV up to 100MB (Up to 3 minutes / 180 seconds).
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>{selectedFile ? "Media Loaded" : "Upload Ready"}</span>
              </span>
            </div>

            {/* UPLOAD MEDIA DROPZONE */}
            <div>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="relative border-2 border-dashed border-white/15 bg-[#161720] hover:border-[#FF5722]/50 rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
                >
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF9100] border border-[#FF5722]/20 group-hover:scale-105 transition">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Upload Talking Video or Voiceover Audio</p>
                    <p className="text-xs text-zinc-400 mt-1">MP4, MOV, MP3, WAV up to 100MB</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25">
                    Browse Files
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161720] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black font-bold">
                        {selectedFile.type.startsWith("video/") ? <Film size={18} /> : <FileAudio size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Kinetic Sync
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

                  {/* Pre-render Transcript Review & Script Editor */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <FileText size={14} className="text-[#FF9100]" />
                        <span>Review &amp; Edit Spoken Script Transcript</span>
                      </label>
                      <span className="text-[10px] text-[#FF9100] font-semibold">✨ Fix any transcription typos before render</span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Spoken transcript text will appear here. Edit any words or typos before generating video..."
                      value={scriptText}
                      onChange={(e) => onScriptTextChange?.(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#161720] p-3 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: CATEGORIZED 9:16 MOTION TYPOGRAPHY GALLERY */}
          <TypographyStylePicker value={typographyStyle} onChange={onTypographyStyleChange} />

          {/* STEP 3: STREAMLINED AUDIO & MOTION PACING CONTROLS */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Sliders size={18} className="text-[#FF9100]" />
                    <span>Audio Clicks &amp; Motion Velocity</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Configure synchronized whoosh clicks, word velocity, and lettering case.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SFX Intensity */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">Sound Effects (SFX)</label>
                <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#161720] p-1 border border-white/10">
                  {[
                    { id: "full", label: "💥 Full" },
                    { id: "subtle", label: "🔉 Subtle" },
                    { id: "none", label: "🔇 Mute" },
                  ].map((sfx) => {
                    const active = typographySfxIntensity === sfx.id;
                    return (
                      <button
                        key={sfx.id}
                        type="button"
                        onClick={() => onTypographySfxIntensityChange(sfx.id as any)}
                        className={`rounded-xl py-2.5 text-center text-xs font-bold transition cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {sfx.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Word Motion Velocity */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">Word Motion Velocity</label>
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#161720] p-1 border border-white/10">
                  {[
                    { id: "fast", label: "⚡ Viral Blitz" },
                    { id: "smooth", label: "📖 Smooth Flow" },
                  ].map((pace) => {
                    const active = typographyPacing === pace.id;
                    return (
                      <button
                        key={pace.id}
                        type="button"
                        onClick={() => onTypographyPacingChange(pace.id as any)}
                        className={`rounded-xl py-2.5 text-center text-xs font-bold transition cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {pace.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography Casing */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">Lettering Casing</label>
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[#161720] p-1 border border-white/10">
                  {[
                    { id: "uppercase", label: "UPPERCASE" },
                    { id: "natural", label: "Natural Case" },
                  ].map((casing) => {
                    const active = typographyTextCase === casing.id;
                    return (
                      <button
                        key={casing.id}
                        type="button"
                        onClick={() => onTypographyTextCaseChange(casing.id as any)}
                        className={`rounded-xl py-2.5 text-center text-xs font-bold transition cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {casing.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4-5 cols): Sticky Live 9:16 Canvas Mockup Preview & Output Config */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Film size={15} className="text-[#FF9100]" />
                <span>9:16 Canvas Stage</span>
              </h3>
              <span className="rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9100]">
                1080×1920 Full HD
              </span>
            </div>

            {/* Live 9:16 Canvas Mockup */}
            <div className="relative aspect-[9/16] max-h-[380px] w-full mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[#070B14] flex flex-col items-center justify-center p-6 text-center group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

              {/* Kinetic Typography Specimen Display */}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#FFA000] font-black">
                  {typographyStyle || "Kinetic Text"}
                </span>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {typographyTextCase === "uppercase" ? "MAKE EVERY WORD IMPACT" : "Make Every Word Impact"}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FFA000] font-mono text-[10px] font-bold">
                  ⚡ {typographyPacing === "fast" ? "Viral Blitz" : "Smooth Flow"}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={11} />
                  <span>30 FPS Remotion</span>
                </span>
                <span>SFX: {typographySfxIntensity.toUpperCase()}</span>
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Audio Source</span>
                <span className="font-bold text-white truncate max-w-[150px]">
                  {selectedFile ? selectedFile.name : "Waiting for audio"}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Preset Style</span>
                <span className="font-bold text-[#FF9100] capitalize">{typographyStyle || "Impact"}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Credit Rate</span>
                <span className="font-mono text-emerald-400 font-bold">1 Credit (9:16 Reel)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !selectedFile}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-black text-black shadow-xl transition-all duration-200 ${
                isGenerating
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black cursor-wait animate-pulse"
                  : !selectedFile
                  ? "bg-[#161720] text-zinc-500 border border-white/10 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              <Sparkles size={17} className={selectedFile ? "fill-black/20" : ""} />
              <span>{isGenerating ? "Rendering 9:16 Video..." : "Generate Typography Video (1 Credit)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA ACTION BAR (Only visible on small screens) */}
      <div className="lg:hidden sticky bottom-4 z-40 rounded-2xl border border-[#FF5722]/40 bg-[#0E1526]/95 backdrop-blur-md p-3.5 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/25">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-white truncate">
              {selectedFile ? selectedFile.name : "Upload media above to begin"}
            </p>
            <p className="text-[10px] text-[#FF9100] font-semibold flex items-center gap-1.5 mt-0.5">
              <span>9:16 Vertical • 1080p Full HD</span>
              <span>•</span>
              <span className="text-zinc-300">Preset: {typographyStyle || "Slam Impact"}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !selectedFile}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 transition active:scale-95 hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
        >
          <Sparkles size={15} />
          <span>{isGenerating ? "Rendering Reel..." : "✨ Generate 9:16 Typography Video"}</span>
        </button>
      </div>
    </div>
  );
}

export default TypographyStudio;
