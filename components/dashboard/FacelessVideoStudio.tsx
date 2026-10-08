"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Film,
  Plus,
  Music,
  Volume2,
  Wand2,
  Mic,
  Subtitles,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause,
  Trash2,
  VolumeX,
  Layers,
  ArrowRight,
  FileText,
  Clock3,
  Radio,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  narrationMode?: "ai-voice" | "upload";
  onNarrationModeChange?: (mode: "ai-voice" | "upload") => void;

  selectedVoice?: string;
  onSelectVoiceChange?: (voice: string) => void;

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

  visualArtStyle: "realistic" | "3d" | "2d";
  onVisualArtStyleChange: (style: "realistic" | "3d" | "2d") => void;
}

// ── 16:9 KINETIC SUBTITLE PRESETS ──
export const FACELESS_169_SUBTITLE_STYLES = [
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
    desc: "Bold white kinetic word zoom with Google Analytics orange highlight.",
    badge: "High Retention",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    renderCaption: () => (
      <div className="text-center font-black tracking-tight text-white text-xs sm:text-sm drop-shadow-md">
        <span>THIS CHANGED <span className="bg-gradient-to-r from-[#FF6D00] to-[#FFA726] bg-clip-text text-transparent underline font-black">EVERYTHING</span></span>
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
      <div className="text-center font-black text-amber-400 text-xs sm:text-sm drop-shadow-[0_2px_8px_rgba(255,145,0,0.4)]">
        <span>THE GOLDEN <span className="text-white">ERA</span></span>
      </div>
    ),
  },
];

// ── AI VOICE PRESETS ──
export const FACELESS_AI_VOICES = [
  { id: "cinema-deep", name: "Deep Cinema Narrator", desc: "Epic, gravitas-filled voice for documentary & history", gender: "Male" },
  { id: "tech-explainer", name: "Tech Explainer", desc: "Articulate, fast-paced, clear modern voice", gender: "Female" },
  { id: "doc-storyteller", name: "Documentary Storyteller", desc: "Warm, rich, engaging tone for deep dive topics", gender: "Male" },
  { id: "news-anchor", name: "Bold News Anchor", desc: "Authoritative, confident, punchy voiceover", gender: "Female" },
];

export function FacelessVideoStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  narrationMode = "ai-voice",
  onNarrationModeChange,
  selectedVoice = "cinema-deep",
  onSelectVoiceChange,
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
  visualArtStyle,
  onVisualArtStyleChange,
}: FacelessVideoStudioProps) {
  const [internalNarrationMode, setInternalNarrationMode] = useState<"ai-voice" | "upload">(narrationMode);
  const activeNarrationMode = narrationMode || internalNarrationMode;

  const setNarrationMode = (mode: "ai-voice" | "upload") => {
    setInternalNarrationMode(mode);
    onNarrationModeChange?.(mode);
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
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Widescreen Cinema Configurator</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Customize narration, visual art style, pacing, kinetic subtitles, and audio score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            <span>16:9 Widescreen • 1080p Full HD</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="facelessVideo" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── 1. NARRATION SOURCE (DUAL FLOW SWITCHER) ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Mic size={18} className="text-[#FF9100]" />
                    <span>Your Narration</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Generate voiceover from AI topic prompt or upload audio.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>{activeNarrationMode === "ai-voice" ? "AI Voice Active" : selectedFile ? "Audio Loaded" : "Upload Ready"}</span>
              </span>
            </div>

            {/* 2-Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#161720] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setNarrationMode("ai-voice")}
                className={`rounded-xl py-3 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeNarrationMode === "ai-voice"
                    ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-lg shadow-[#FF6D00]/25"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles size={15} />
                <span>✨ AI Topic &amp; Voice</span>
              </button>
              <button
                type="button"
                onClick={() => setNarrationMode("upload")}
                className={`rounded-xl py-3 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeNarrationMode === "upload"
                    ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-lg shadow-[#FF6D00]/25"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Upload size={15} />
                <span>🎙️ Upload Voiceover</span>
              </button>
            </div>

            {/* Tab A: AI Topic Prompt & Voice Selector */}
            {activeNarrationMode === "ai-voice" ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#FF9100]" />
                    <span>Video Topic / Narrative Premise</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. The Untold Secret History of Ancient Civilizations and their Lost Knowledge..."
                    value={topicTitle || ""}
                    onChange={(e) => onTopicTitleChange?.(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#161720] p-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF6D00] focus:outline-none focus:ring-1 focus:ring-[#FF6D00]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Radio size={14} className="text-[#FF9100]" />
                    <span>AI Voice Narrator</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FACELESS_AI_VOICES.map((voice) => {
                      const isSelected = selectedVoice === voice.id;
                      return (
                        <button
                          key={voice.id}
                          type="button"
                          onClick={() => onSelectVoiceChange?.(voice.id)}
                          className={`rounded-2xl border p-3 text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[#FF6D00] bg-[#FF6D00]/10 ring-1 ring-[#FF6D00] text-white"
                              : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{voice.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                              {voice.gender}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-tight">{voice.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Tab B: Audio Upload Dropzone */
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
                    className="rounded-3xl border-2 border-dashed border-white/15 bg-[#161720]/80 p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 hover:border-[#FF6D00]/50 hover:bg-[#161720]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Upload Audio Voiceover</p>
                      <p className="text-xs text-zinc-400 mt-1">MP3, WAV, M4A, AAC (12 min max)</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25">
                      Browse Audio File
                    </span>
                  </label>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161720] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-bold">
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
            )}
          </div>

          {/* ── 2. VISUAL B-ROLL STYLE & ASSET SOURCE ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Film size={18} className="text-[#FF9100]" />
                    <span>Visual B-Roll &amp; Style</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select 16:9 widescreen asset style and source provider.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Art Style (3 Cards) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Visual Aesthetic Style</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "realistic", label: "📷 Realistic Cinema", desc: "Cinematic real photos & stock" },
                  { id: "3d", label: "🧊 3D Render", desc: "Depth 3D isometric scenes" },
                  { id: "2d", label: "🎨 2D Vector", desc: "Flat art & vector graphics" },
                ].map((art) => {
                  const active = visualArtStyle === art.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => onVisualArtStyleChange(art.id as any)}
                      className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                        active
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white font-bold ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight text-white">{art.label}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-tight">{art.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset Source Mode Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Asset Source</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "library", label: "Itnavideo Assets", detail: "100% Curated Stock" },
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
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white font-bold ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
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
                <label className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-[#161720] p-4 text-xs font-bold text-zinc-200 hover:border-[#FF6D00]/50 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <Plus size={16} className="text-[#FF9100]" />
                  <span>Upload Images or Video Clips</span>
                </label>

                {uploadedImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedImageFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#161720] px-3 py-1.5 text-xs text-zinc-200"
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

            {/* Video Pacing Style (4 Options) */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Video Pacing Style</span>
                <span className="text-[10px] text-zinc-400 font-mono">Ken Burns &amp; Scene Cuts</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "clean", label: "✨ Clean", desc: "Minimal & modern" },
                  { id: "cinematic", label: "🎬 Cinematic", desc: "Dramatic Ken Burns" },
                  { id: "documentary", label: "📜 Documentary", desc: "Editorial storytelling" },
                  { id: "dynamic", label: "⚡ Dynamic", desc: "Fast kinetic cuts" },
                ].map((pacing) => {
                  const active = (facelessPacingStyle || "cinematic") === pacing.id;
                  return (
                    <button
                      key={pacing.id}
                      type="button"
                      onClick={() => onPacingStyleChange?.(pacing.id as any)}
                      className={`rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                        active
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white font-bold ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight text-white">{pacing.label}</p>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-tight">{pacing.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3. 16:9 CAPTION STYLE SELECTOR ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Subtitles size={18} className="text-[#FF9100]" />
                    <span>Widescreen Captions</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    16:9 kinetic animated subtitle presets.
                  </p>
                </div>
              </div>
            </div>

            {/* 16:9 Caption Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FACELESS_169_SUBTITLE_STYLES.map((style) => {
                const isSelected = subtitleStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onSubtitleStyleChange?.(style.id)}
                    className={`group relative rounded-2xl border p-3 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#FF6D00] bg-[#FF6D00]/10 ring-2 ring-[#FF6D00] shadow-xl shadow-[#FF6D00]/25 -translate-y-0.5"
                        : "border-white/10 bg-[#161720] hover:border-[#FF6D00]/50 hover:bg-[#1C1E28] hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Widescreen 16:9 Frame */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mb-2">
                      <Image
                        src={style.bgImage}
                        alt={style.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60" />

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                        {style.renderCaption()}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#FF9100] transition">
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

          {/* ── 4. AUDIO SCORE & SOUND EFFECTS ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  4
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Music size={18} className="text-[#FF9100]" />
                    <span>Audio Score &amp; SFX</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Set cinematic ambient score, auto-ducking, and beat sound effects.
                  </p>
                </div>
              </div>
            </div>

            {/* BGM Mood Selector */}
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
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {bgm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound Effects (SFX) Toggle & Volume Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              {/* SFX Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161720] p-3.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 size={14} className="text-[#FF9100]" />
                    <span>Beat Sound Effects (SFX)</span>
                  </p>
                  <p className="text-[10px] text-zinc-400">Auto-timed transition whooshes</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    facelessEnableSfx ? "bg-[#FF6D00]" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      facelessEnableSfx ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              {facelessBgmMood !== "none" ? (
                <div className="rounded-2xl border border-white/10 bg-[#161720] p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300 font-bold">
                    <span>BGM Mix Volume</span>
                    <span className="font-mono text-[#FF9100]">{Math.round((facelessBgmVolume || 0.2) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={facelessBgmVolume || 0.2}
                    onChange={(e) => onBgmVolumeChange?.(parseFloat(e.target.value))}
                    className="w-full accent-[#FF6D00] cursor-pointer"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-[#161720]/50 p-3.5 flex items-center text-xs text-zinc-500 italic">
                  Background music disabled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 16:9 Widescreen Video Stage (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-5 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Film size={15} className="text-[#FF9100]" />
                <span>16:9 Cinema Stage</span>
              </h3>
              <span className="rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9100]">
                1920×1080 Full HD
              </span>
            </div>

            {/* 16:9 Cinema Widescreen Stage Player */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center">
              {renderedVideoUrl ? (
                <video
                  src={renderedVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] shadow-md">
                    <Film size={26} />
                  </div>
                  <p className="text-xs font-bold text-white max-w-[240px]">
                    16:9 Full HD Faceless Video preview will appear here upon rendering.
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
              disabled={isGenerating || (activeNarrationMode === "upload" && !selectedFile)}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] p-4 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition active:scale-95 hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Rendering 16:9 Faceless Video..." : "Generate Faceless Video"}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 font-medium">
              <span>Cost: 2 credits / min</span>
              <span>Processing: ~2 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacelessVideoStudio;
