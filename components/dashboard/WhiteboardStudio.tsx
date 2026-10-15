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

  return (
    <div className="relative rounded-[32px] border border-white/10 bg-[#0E131F]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={320} duration={12} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30">
            <Sparkles size={24} className="fill-black/20" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>AI Whiteboard Studio</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                1 Credit
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Turn your voice narration into synchronized, hand-drawn whiteboard explainer scenes.
            </p>
          </div>
        </div>

        {/* Strict 9:16 Vertical Shorts Format Badge */}
        <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 shadow-inner shrink-0">
          <span className="text-base">📱</span>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FFA000]">Strictly 9:16 Vertical</div>
            <div className="text-[10px] text-zinc-400">1080×1920 Full HD • Up to 90s</div>
          </div>
        </div>
      </div>

      {/* 1. Upload Script Narration Audio Card */}
      <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">1. Upload Voiceover Audio</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Upload your recorded speech or voiceover file (MP3, WAV, M4A, or MP4).</p>
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
            className="border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 rounded-2xl bg-[#0B0F19] p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 relative group flex flex-col items-center justify-center hover:bg-[#0E1422]"
          >
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF5722]/40 group-hover:bg-[#FF5722]/10 transition mb-4">
              <Upload className="h-8 w-8 text-zinc-400 group-hover:text-[#FFA000] transition" />
            </div>
            <p className="text-sm font-bold text-zinc-200">Drag &amp; drop voiceover audio here, or click to browse</p>
            <p className="text-xs text-zinc-500 mt-1.5">Supports MP3, WAV, M4A, AAC, MP4 up to 50MB (Duration: up to 90 seconds)</p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:scale-105 transition duration-200">
              <Upload size={14} className="stroke-[2.5]" />
              <span>Choose Audio File</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] border border-[#FF5722]/30">
                <span className="text-xl">🎙️</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                  <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Ready for AI Planning</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectFile(null)}
              className="self-start sm:self-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-4 py-2 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95"
            >
              Change Audio
            </button>
          </div>
        )}
      </div>

      {/* 2. Narration Transcript Review Card (Auto-Unlocks When File is Selected) */}
      {selectedFile && (
        <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-4">
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

            {onReTranscribe && !isTranscribing && (
              <button
                type="button"
                onClick={onReTranscribe}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer self-start sm:self-auto active:scale-95"
              >
                <RefreshCw size={12} />
                <span>Re-Transcribe</span>
              </button>
            )}
          </div>

          {isTranscribing ? (
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-8 text-center space-y-3">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FFA000]" />
              <p className="text-sm font-bold text-zinc-200">Listening &amp; Transcribing Audio...</p>
              <p className="text-xs text-zinc-400">Extracting sub-second word timestamps and speech beats via Groq Whisper.</p>
            </div>
          ) : transcriptionError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={16} />
                <p className="text-xs font-bold">Transcription Notice</p>
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">{transcriptionError}</p>
              {onReTranscribe && (
                <button
                  type="button"
                  onClick={onReTranscribe}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-4 py-2 text-xs font-bold transition cursor-pointer active:scale-95"
                >
                  <RefreshCw size={13} />
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
                rows={5}
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
      )}

      {/* 3. Visual Marker Accents & Tactile Audio Settings */}
      <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
            <Palette size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">{selectedFile ? "3" : "2"}. Marker Accent &amp; Sound FX</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Select a primary whiteboard marker color and drawing sound preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Marker Color Palette */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 space-y-3">
            <span className="text-xs font-bold text-zinc-300">Marker Accent Color:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "auto", label: "⚡ Auto AI", bg: "bg-gradient-to-r from-[#FF5722] to-[#FFA000]" },
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
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition cursor-pointer active:scale-95 ${
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
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#FFA000]">
                <Volume2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Whiteboard Audio FX</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Tactile pen writing &amp; board swipe sound effects</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSfx}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 ${
                sfxEnabled
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              {sfxEnabled ? "✓ Active (30%)" : "Muted"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. High-Impact Generate Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || isTranscribing || !selectedFile || !transcript.trim()}
        className={`w-full inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-2xl text-base font-black tracking-tight transition-all duration-200 ${
          !selectedFile
            ? "bg-[#141A28] text-[#FFA000] border border-[#FF5722]/30 shadow-inner cursor-not-allowed"
            : isGenerating || isTranscribing
            ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black opacity-80 cursor-wait animate-pulse"
            : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-2xl shadow-[#FF5722]/30 hover:brightness-110 active:scale-[0.99] cursor-pointer"
        }`}
      >
        <Sparkles size={18} className={!selectedFile ? "text-[#FFA000]" : "text-black"} />
        <span>
          {!selectedFile
            ? "Upload Script Narration Audio Above"
            : isTranscribing
            ? "Transcribing Spoken Audio..."
            : !transcript.trim()
            ? "Waiting for Script Transcript..."
            : isGenerating
            ? "Directing Whiteboard Storyboard..."
            : "Generate AI Whiteboard Video (1 Credit)"}
        </span>
      </button>
    </div>
  );
}
