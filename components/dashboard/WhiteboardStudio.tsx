"use client";

import React from "react";
import {
  Sparkles,
  Upload,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Palette,
  Check,
  Tv,
  Clock,
  ShieldCheck,
  Play,
  Layers3,
  Film,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  transcript: string;
  onTranscriptChange: (text: string) => void;
  isTranscribing: boolean;
  transcriptionError?: string | null;
  onReTranscribe?: () => void;

  markerColor?: string;
  onMarkerColorChange?: (val: string) => void;

  enableSfx?: boolean;
  onToggleSfx?: (val: boolean) => void;

  onGenerate: () => void;
  onPlanStoryboard?: () => void;
  isPlanning?: boolean;
  plan?: any;
  setPlan?: (plan: any) => void;
  studioStep?: "inputs" | "storyboard";
  setStudioStep?: (step: "inputs" | "storyboard") => void;
  isGenerating: boolean;
}

export function WhiteboardStudio({
  selectedFile,
  onSelectFile,
  transcript,
  onTranscriptChange,
  isTranscribing,
  transcriptionError,
  onReTranscribe,
  markerColor = "auto",
  onMarkerColorChange,
  enableSfx = true,
  onToggleSfx,
  onGenerate,
  isGenerating,
  isPlanning,
  studioStep = 'inputs',
}: WhiteboardStudioProps) {
  const [internalSfx, setInternalSfx] = React.useState<boolean>(true);
  const sfxEnabled = enableSfx !== undefined ? enableSfx : internalSfx;
  const toggleSfx = () => {
    const next = !sfxEnabled;
    setInternalSfx(next);
    if (onToggleSfx) onToggleSfx(next);
  };

  const [internalColor, setInternalColor] = React.useState<string>("auto");
  const activeColor = markerColor || internalColor;
  const setColor = (val: string) => {
    setInternalColor(val);
    if (onMarkerColorChange) onMarkerColorChange(val);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const isReadyToRender = Boolean(selectedFile && transcript.trim() && !isTranscribing);

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 sm:pb-8">
      {/* 2-Column Standardized Studio Layout */}
      {studioStep === "inputs" && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Panel: Input Controls (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 min-w-0 max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
          <div className="relative rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#0E131F]/90 backdrop-blur-xl p-4 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 text-white">
            <BorderBeam size={320} duration={12} colorFrom="#FF5722" colorTo="#FFA000" />

            {/* Master Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30">
                  <Sparkles size={20} className="sm:size-[24px] fill-black/20" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>AI Whiteboard Studio</span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      1 Credit
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5">
                    Turn voice narration into synchronized, 2D hand-drawn storyboard explainer scenes.
                  </p>
                </div>
              </div>

              {/* Strict 9:16 Vertical Shorts Format Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-orange-400 shadow-inner shrink-0 self-start sm:self-auto">
                <div>
                  <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#FFA000]">Strictly 9:16 Vertical</div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-400">1080 × 1920 Full HD • Up to 90s</div>
                </div>
              </div>
            </div>

            {/* 1. Upload Script Narration Audio Card */}
            <div className="rounded-2xl sm:rounded-[24px] border border-white/10 bg-[#141A28] p-4 sm:p-6 shadow-xl space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">1. Upload Voiceover Audio</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Upload recorded speech or voiceover file (MP3, WAV, M4A, or MP4).</p>
                  </div>
                </div>

                {selectedFile && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} />
                    <span>Audio Loaded</span>
                  </span>
                )}
              </div>

              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 rounded-2xl bg-[#0B0F19] p-5 sm:p-10 text-center cursor-pointer transition-all duration-300 relative group flex flex-col items-center justify-center hover:bg-[#0E1422] active:scale-[0.99]"
                >
                  <input
                    id="whiteboard-audio-input"
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF5722]/40 group-hover:bg-[#FF5722]/10 transition mb-2.5 sm:mb-3">
                    <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-400 group-hover:text-[#FFA000] transition" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-200">
                    <span className="sm:hidden">Tap to choose voiceover audio file</span>
                    <span className="hidden sm:inline">Drag &amp; drop voiceover audio here, or click to browse</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">MP3, WAV, M4A, AAC, MP4 up to 50MB (Duration: up to 90s)</p>

                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 sm:px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:scale-105 transition duration-200">
                    <Upload size={14} className="stroke-[2.5]" />
                    <span>Choose Audio File</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] border border-[#FF5722]/30 text-lg sm:text-xl">
                      🎙️
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Ready for AI Planning</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectFile(null)}
                    className="self-start sm:self-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95"
                  >
                    Change Audio
                  </button>
                </div>
              )}
            </div>

            {/* 2. Narration Transcript Review Card (Always anchored to eliminate layout jumps) */}
            <div className="rounded-2xl sm:rounded-[24px] border border-white/10 bg-[#141A28] p-4 sm:p-6 shadow-xl space-y-3.5 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">2. Narration Transcript</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Review or edit your spoken script before AI directs the whiteboard storyboard.</p>
                  </div>
                </div>

                {selectedFile && onReTranscribe && !isTranscribing && (
                  <button
                    type="button"
                    onClick={onReTranscribe}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer self-start sm:self-auto active:scale-95"
                  >
                    <RefreshCw size={12} />
                    <span>Re-Transcribe</span>
                  </button>
                )}
              </div>

              {!selectedFile ? (
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-center space-y-1 text-zinc-500">
                  <p className="text-xs font-semibold text-zinc-400">No voiceover audio loaded yet</p>
                  <p className="text-[11px]">Upload an audio file above to automatically transcribe speech and review script beats.</p>
                </div>
              ) : isTranscribing ? (
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-center space-y-2">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#FFA000]" />
                  <p className="text-sm font-bold text-zinc-200">Listening &amp; Transcribing Audio...</p>
                  <p className="text-xs text-zinc-400">Extracting sub-second word timestamps and speech beats via Groq Whisper.</p>
                </div>
              ) : transcriptionError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle size={16} />
                    <p className="text-xs font-bold">Transcription Notice</p>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed">{transcriptionError}</p>
                  {onReTranscribe && (
                    <button
                      type="button"
                      onClick={onReTranscribe}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3.5 py-1.5 text-xs font-bold transition cursor-pointer active:scale-95"
                    >
                      <RefreshCw size={12} />
                      <span>Retry Transcription</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <textarea
                    value={transcript}
                    onChange={(e) => onTranscriptChange(e.target.value)}
                    placeholder="Speech transcription will appear here. You can make adjustments, fix names, or add punctuation..."
                    rows={4}
                    className="w-full rounded-2xl border border-white/15 bg-[#080B13] p-4 text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition resize-y"
                  />
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={13} />
                      <span>AI plans whiteboard scenes directly from this narration.</span>
                    </div>
                    <div>
                      <span className="font-mono text-white font-bold">{wordCount}</span> words
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Marker & Audio SFX Settings */}
            <div className="rounded-2xl sm:rounded-[24px] border border-white/10 bg-[#141A28] p-4 sm:p-6 shadow-xl space-y-3.5 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">3. Marker Accent &amp; Sound FX</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Select a primary whiteboard marker color and drawing sound preferences.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Marker Color Palette */}
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
                  <span className="text-xs font-bold text-zinc-300">Marker Accent Color:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "auto", label: "Auto AI", bg: "bg-gradient-to-r from-[#FF5722] to-[#FFA000]" },
                      { id: "navy", label: "Executive Navy", bg: "bg-blue-600" },
                      { id: "teal", label: "Emerald Green", bg: "bg-emerald-600" },
                      { id: "crimson", label: "Impact Crimson", bg: "bg-red-600" },
                    ].map((c) => {
                      const isSelected = activeColor === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setColor(c.id)}
                          className={`flex items-center gap-2 rounded-xl p-2.5 sm:p-3 min-h-[42px] sm:min-h-[44px] text-xs font-bold transition cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-white/15 text-white border border-[#FF5722] ring-1 ring-[#FF5722] shadow-md"
                              : "bg-[#141A28] text-zinc-400 border border-white/5 hover:text-white"
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full shrink-0 ${c.bg}`} />
                          <span className="truncate">{c.label}</span>
                          {isSelected && <Check size={12} className="ml-auto text-[#FFA000] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sound Effects Toggle */}
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3.5 sm:p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#FFA000]">
                      <Volume2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Whiteboard Audio FX</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Pen writing &amp; board swipe sounds</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleSfx}
                    className={`w-full py-2.5 rounded-xl min-h-[42px] sm:min-h-[44px] text-xs font-bold border transition cursor-pointer active:scale-95 flex items-center justify-center ${
                      sfxEnabled
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {sfxEnabled ? "Active (30% Writing SFX)" : "Muted"}
                  </button>
                </div>
              </div>
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
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[260px] rounded-2xl border-2 border-white/10 bg-[#0B0F19] overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              {/* Whiteboard Background Texture Preview */}
              <div className="absolute inset-0 bg-[#FAFAFA] opacity-95 pointer-events-none" />

              {/* Top Watermark / Topic Indicator */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-0.5 text-[9px] font-black text-white shadow-sm">
                  <Sparkles size={10} className="text-[#FFA000]" />
                  <span>Whiteboard Explainer</span>
                </div>
                <span className="rounded-full bg-black/60 px-2 py-0.5 text-[8px] font-mono text-zinc-300">
                  9:16 HD
                </span>
              </div>

              {/* 2D Storyboard Infographic Canvas Preview */}
              <div className="relative z-10 flex-1 flex flex-col justify-between py-2 text-slate-800 select-none">
                {/* Header Title */}
                <div className="text-center pt-1 pb-1">
                  <div className="inline-block text-[11px] font-black tracking-tight text-slate-900 border-b-2 border-orange-500/80 pb-0.5">
                    Why You Should <span className="text-[#FF5722]">Save Money?</span>
                  </div>
                </div>

                {/* Upper Split: Thinking Character + Thought Bubble + Curly Bracket */}
                <div className="flex items-center justify-between gap-1 px-1 my-auto">
                  {/* Thinking Character & Bubble */}
                  <div className="flex flex-col items-center shrink-0 w-20">
                    <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 text-[7px] font-bold text-orange-950 text-center leading-tight shadow-sm mb-1">
                      Need cash later?
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-sm shadow-md">
                      🤔
                    </div>
                  </div>

                  {/* Curly Bracket & 3 Items */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-2xl font-light text-slate-400 select-none">{"{"}</span>
                    <div className="space-y-1 text-[7px] font-bold text-slate-700 leading-tight">
                      <div className="flex items-center gap-1">
                        <span>🚑</span>
                        <span className="truncate">Emergencies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🚗</span>
                        <span className="truncate">Repairs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🏡</span>
                        <span className="truncate">Future Goals</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Hero: Main Statement & Savings Jar Hero */}
                <div className="my-auto text-center space-y-1 px-1">
                  <div className="rounded-lg bg-amber-100/90 border border-amber-300 px-2 py-1 text-[8px] font-extrabold text-amber-950 shadow-sm leading-tight">
                    "Saving money gives you unstoppable peace of mind."
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-0.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-base shadow-md">
                      🍯
                    </div>
                    <div className="text-left text-[7px] text-slate-600 font-bold leading-tight">
                      <span className="text-emerald-700 font-black block">SAVINGS JAR</span>
                      <span>Freedom &amp; clarity</span>
                    </div>
                  </div>
                </div>

                {/* Bottom 4 Takeaway Cards */}
                <div className="space-y-1 pt-1">
                  <div className="text-[7px] font-black text-center text-slate-500 uppercase tracking-wider">
                    Small steps today... Big future tomorrow.
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { icon: "🚨", label: "Crisis" },
                      { icon: "🌱", label: "Wealth" },
                      { icon: "🎯", label: "Goals" },
                      { icon: "😊", label: "Peace" },
                    ].map((card, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 bg-white px-0.5 py-1 text-center shadow-xs">
                        <div className="text-[10px] leading-none mb-0.5">{card.icon}</div>
                        <div className="text-[7px] font-black text-slate-800 leading-tight">{card.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hand Marker Drawing Tip Indicator */}
                <div className="absolute bottom-12 right-2 flex items-center gap-1 opacity-90 pointer-events-none animate-pulse">
                  <span className="text-xs">✍️</span>
                  <span className="text-[7px] font-black text-slate-700 bg-white/80 px-1 rounded shadow-xs">Tracing live</span>
                </div>
              </div>

              {/* Bottom Scrubber Overlay */}
              <div className="relative z-10 rounded-xl bg-black/80 p-2 backdrop-blur-sm space-y-1">
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Play size={7} className="fill-[#FFA000] text-[#FFA000]" />
                    <span>0:00</span>
                  </span>
                  <span>90s Vertical Shorts</span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-2/5 bg-gradient-to-r from-[#FF5722] to-[#FFA000] rounded-full" />
                </div>
              </div>
            </div>

            {/* Studio Output Specs Breakdown */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Tv size={12} className="text-slate-500" />
                  <span>Resolution</span>
                </span>
                <span className="font-bold text-white">1080 × 1920 (Vertical)</span>
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

            {/* Primary Generate Button in Sticky Right Panel (Desktop visible, mobile uses docked bar) */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={(isGenerating || isPlanning) || !isReadyToRender}
              className={`w-full hidden sm:inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-200 ${
                !isReadyToRender
                  ? "bg-[#141A28] text-zinc-500 border border-white/10 shadow-inner cursor-not-allowed"
                  : isGenerating
                  ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black opacity-80 cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-xl shadow-[#FF5722]/25 hover:brightness-110 active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Directing Whiteboard Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className={!isReadyToRender ? "text-zinc-600" : "text-black"} />
                  <span>
                    {!selectedFile
                      ? "Upload Voiceover Audio"
                      : isTranscribing
                      ? "Transcribing Speech..."
                      : !transcript.trim()
                      ? "Waiting for Script..."
                      : studioStep === "inputs" ? "Generate AI Storyboard & Plan" : "Generate AI Whiteboard Video (1 Credit)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ── MOBILE-ONLY DOCKED GENERATE ACTION BAR (Fixed Bottom for Instant Access) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-3.5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">
            {selectedFile ? selectedFile.name : "Voiceover Audio"}
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>9:16 Vertical • 1 Credit</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={(isGenerating || isPlanning) || !isReadyToRender}
          className="shrink-0 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black text-xs shadow-lg shadow-orange-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
        >
          {isGenerating ? (
            <>
              <Loader2 size={13} className="animate-spin text-black" />
              <span>Directing...</span>
            </>
          ) : isTranscribing ? (
            <>
              <Loader2 size={13} className="animate-spin text-black" />
              <span>Transcribing...</span>
            </>
          ) : !selectedFile ? (
            <>
              <Upload size={13} className="text-black" />
              <span>Choose Audio</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-black" />
              <span>Generate (1 Cr)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
