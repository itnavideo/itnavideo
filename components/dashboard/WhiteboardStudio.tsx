"use client";

import React from "react";
import {
  Sparkles,
  Sliders,
  Upload,
  Wand2,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Clock3,
  PenTool,
  Smartphone,
  Palette,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  transcript: string;
  onTranscriptChange: (text: string) => void;
  isTranscribing: boolean;
  transcriptionError?: string | null;
  onReTranscribe?: () => void;

  whiteboardFont: "marker" | "architect" | "clean" | "sans" | "blueprint";
  onWhiteboardFontChange: (val: "marker" | "architect" | "clean" | "sans" | "blueprint") => void;

  enableSfx?: boolean;
  onToggleSfx?: (val: boolean) => void;

  markerColor?: string;
  onMarkerColorChange?: (val: string) => void;

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
  whiteboardFont,
  onWhiteboardFontChange,
  enableSfx = true,
  onToggleSfx,
  markerColor,
  onMarkerColorChange,
  onGenerate,
  isGenerating,
}: WhiteboardStudioProps) {
  const [internalSfx, setInternalSfx] = React.useState<boolean>(true);
  const sfxEnabled = enableSfx !== undefined ? enableSfx : internalSfx;
  const setSfxEnabled = (val: boolean) => {
    setInternalSfx(val);
    if (onToggleSfx) onToggleSfx(val);
  };

  const [internalColor, setInternalColor] = React.useState<string>("auto");
  const selectedMarkerColor = markerColor !== undefined ? markerColor : internalColor;
  const setSelectedMarkerColor = (val: string) => {
    setInternalColor(val);
    if (onMarkerColorChange) onMarkerColorChange(val);
  };

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

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

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
              <span>Whiteboard Director Controls</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Generate hand-drawn stickman &amp; icon whiteboard animation scenes synced to voiceover speech.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            <span>9:16 Vertical • Hand-Drawn</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="whiteboard" />
      {/* 1. Upload Audio Narration Card */}
      <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 sm:p-7 shadow-xl space-y-4" id="upload-section">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
            <Upload size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">1. Upload Script Narration Audio</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">MP3, WAV, M4A or MP4/MOV narration track containing speaking audio script.</p>
          </div>
        </div>

        {!selectedFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border border-dashed border-white/15 hover:border-[#FF6D00]/50 rounded-2xl bg-[#161720] p-8 text-center cursor-pointer transition relative group flex flex-col items-center justify-center"
          >
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <Upload className="mx-auto h-8 w-8 text-zinc-500 group-hover:text-[#FF9100] transition mb-3" />
            <p className="text-xs font-bold text-zinc-200">Drag &amp; drop raw script audio or video, or click to browse</p>
            <p className="text-[10px] text-zinc-400 mt-1">Supports MP3, WAV, M4A, MP4 up to 50MB (Up to 3 minutes / 180s)</p>
            
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF6D00]/15 border border-[#FF6D00]/40 px-5 py-2.5 text-xs font-bold text-[#FFA726] group-hover:bg-[#FF6D00] group-hover:text-black transition duration-200 shadow-md">
              <Upload size={14} />
              <span>Select Audio File</span>
            </div>
            <p className="text-[10px] font-medium text-[#FFA726]/80 mt-2.5 flex items-center justify-center gap-1">
              <Sparkles size={11} className="text-[#FF9100]" />
              <span>Interactive AI transcript editor unlocks automatically upon file selection</span>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#161720] p-4 flex items-center justify-between gap-4">
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
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3 py-1.5 text-[10px] font-bold text-zinc-300 transition cursor-pointer"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* 2. Audio Transcript Review & Edit Card */}
      {selectedFile && (
        <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">2. Narration Transcript & Script</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Review text below and fix any typos or names before AI generates drawings.</p>
              </div>
            </div>

            {onReTranscribe && !isTranscribing && (
              <button
                type="button"
                onClick={onReTranscribe}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[10px] font-bold text-zinc-300 hover:text-white transition cursor-pointer active:scale-95"
                title="Re-extract transcript from audio"
              >
                <RefreshCw size={11} />
                <span>Re-Transcribe</span>
              </button>
            )}
          </div>

          {isTranscribing ? (
            <div className="rounded-2xl border border-white/10 bg-[#161720] p-6 text-center space-y-2">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FF9100]" />
              <p className="text-xs font-bold text-zinc-200">Transcribing audio narration with AI...</p>
              <p className="text-[10px] text-zinc-400">Extracting speech words and millisecond timestamps via Groq Whisper.</p>
            </div>
          ) : transcriptionError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={16} />
                <p className="text-xs font-bold">Transcription Failed</p>
              </div>
              <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">{transcriptionError}</p>
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
            <div className="space-y-2">
              <textarea
                value={transcript}
                onChange={(e) => onTranscriptChange(e.target.value)}
                placeholder="Narration transcript will appear here. You can freely edit, fix spelling, or adjust points..."
                rows={5}
                className="w-full rounded-2xl border border-white/15 bg-[#090A0F] p-4 text-xs font-mono text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:border-[#FF6D00] focus:ring-2 focus:ring-[#FF6D00]/20 focus:outline-none transition resize-y"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>AI plans board scenes directly from this verified script.</span>
                </div>
                <div>
                  <span className="font-mono text-zinc-300 font-bold">{wordCount}</span> words
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Visual Whiteboard Writing Style Specimen Cards */}
      <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6D00]/25 bg-[#FF6D00]/10 text-[#FF9100]">
              <PenTool size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{selectedFile ? "3" : "2"}. Writing Style Personality</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Select a typography specimen style for handwritten board text & vector drawings.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1 text-[10px] font-bold text-[#FFA726]">
            <Wand2 size={12} />
            <span>Smart AI Layout</span>
          </div>
        </div>

        {/* Marker Accent Color Palette Picker */}
        <div className="rounded-2xl border border-white/10 bg-[#161720] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-[#FF9100]" />
            <span className="text-xs font-bold text-white">Board Marker Accent Color:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "auto", label: "⚡ Auto AI", color: "bg-gradient-to-r from-[#FF6D00] to-[#FFA726]" },
              { id: "navy", label: "Corporate Blue", color: "bg-blue-500" },
              { id: "teal", label: "Emerald Tech", color: "bg-emerald-500" },
              { id: "crimson", label: "Impact Red", color: "bg-red-500" },
            ].map((c) => {
              const active = selectedMarkerColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedMarkerColor(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition cursor-pointer active:scale-95 ${
                    active
                      ? "bg-white/10 text-white border border-[#FF6D00]/50 ring-1 ring-[#FF6D00]/50 shadow-md"
                      : "bg-[#090A0F] text-zinc-400 border border-white/5 hover:text-zinc-200"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rich Specimen Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "marker",
              label: "Marker",
              sub: "Natural Handwritten",
              specimen: "“The 3 Secret Rules...”",
              fontStyle: "font-serif italic",
              icon: "✍️",
              doodle: "💡 Concept",
            },
            {
              id: "clean",
              label: "Clean Boardroom",
              sub: "Professional Corporate",
              specimen: "Executive Strategy ➔",
              fontStyle: "font-sans tracking-tight",
              icon: "📋",
              doodle: "📈 Growth Chart",
            },
            {
              id: "sans",
              label: "High Impact",
              sub: "Presentation Bold",
              specimen: "40% REVENUE SURGE",
              fontStyle: "font-black tracking-wide uppercase",
              icon: "📢",
              doodle: "🎯 Target Hit",
            },
            {
              id: "blueprint",
              label: "Blueprint Draft",
              sub: "Technical Diagram",
              specimen: "[System Architecture]",
              fontStyle: "font-mono tracking-widest text-[#FFA726]",
              icon: "📐",
              doodle: "⚙️ Pipeline",
            },
          ].map((f) => {
            const active = whiteboardFont === f.id || (whiteboardFont === "architect" && f.id === "clean");
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onWhiteboardFontChange(f.id as any)}
                className={`rounded-2xl border p-4 text-left transition-all cursor-pointer relative overflow-hidden group active:scale-[0.98] ${
                  active
                    ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white ring-2 ring-[#FF6D00] shadow-xl shadow-[#FF6D00]/25"
                    : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{f.icon}</span>
                    <div>
                      <p className={`text-xs font-black ${active ? "text-[#FFA726]" : "text-white"}`}>{f.label}</p>
                      <p className="text-[10px] text-zinc-400">{f.sub}</p>
                    </div>
                  </div>
                  <span className="text-[10px] rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-zinc-400 font-mono">
                    {f.doodle}
                  </span>
                </div>

                {/* Typography Visual Specimen Container */}
                <div className="rounded-xl border border-white/5 bg-[#090A0F] p-3 text-center">
                  <span className={`text-xs block ${f.fontStyle} ${active ? "text-[#FFA726]" : "text-zinc-200"}`}>
                    {f.specimen}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lock Specs & SFX Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#161720] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Smartphone size={15} className="text-[#FF9100] shrink-0" />
            <span className="font-bold">📱 9:16 Vertical Cinema (1080×1920 Full HD)</span>
          </div>

          <button
            type="button"
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#090A0F] hover:bg-[#111218] px-3.5 py-1.5 text-[11px] font-bold text-zinc-300 hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
            title="Click to enable/mute sketching sound effects"
          >
            <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${sfxEnabled ? "border-[#FF6D00] bg-[#FF6D00] text-black" : "border-zinc-600 bg-transparent text-transparent"}`}>
              <Volume2 size={10} className="stroke-[3]" />
            </div>
            <span className="flex items-center gap-1.5">
              <span>Sketching &amp; Duster SFX</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${sfxEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-400"}`}>
                {sfxEnabled ? "ENABLED (30%)" : "MUTED"}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Submit Rendering CTA Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || isTranscribing || !selectedFile || !transcript.trim()}
        className={`w-full inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-sm font-black transition duration-200 ${
          !selectedFile
            ? "bg-[#151E30] text-[#FFA726] border border-[#FF6D00]/30 hover:border-[#FF6D00]/60 shadow-inner cursor-not-allowed"
            : isGenerating || isTranscribing
            ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black opacity-80 cursor-wait animate-pulse"
            : "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-xl shadow-[#FF6D00]/30 hover:brightness-110 active:scale-95 cursor-pointer"
        }`}
      >
        <Sparkles size={16} className={!selectedFile ? "text-[#FFA726]" : "text-black"} />
        <span>
          {!selectedFile
            ? "Upload Script Voiceover Audio First"
            : isTranscribing
            ? "Transcribing Narration Audio..."
            : !transcript.trim()
            ? "Waiting for Narration Transcript..."
            : isGenerating
            ? "Planning Whiteboard Scenes..."
            : "Generate AI Whiteboard Video (1 Credit)"}
        </span>
      </button>
    </div>
  );
}
