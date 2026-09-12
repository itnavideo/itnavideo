"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Mic,
  ImagePlus,
  Music2,
  Sparkles,
  Sliders,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  Volume2,
  Info,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Maximize2
} from "lucide-react";

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  bgmFile: File | null;
  onSelectBgm: (file: File | null) => void;
  bgmVolume: number;
  onChangeBgmVolume: (vol: number) => void;
  topicTitle: string;
  onChangeTopicTitle: (title: string) => void;
  subtitleStyle: string;
  onChangeSubtitleStyle: (style: string) => void;
  cameraMotionPreset: string;
  onChangeCameraMotionPreset: (preset: string) => void;
  fitMode?: 'blur-fill' | 'cover';
  onChangeFitMode?: (mode: 'blur-fill' | 'cover') => void;
  isRendering: boolean;
  onStartRender: () => void;
  userCredits?: number;
  estimatedDurationSeconds?: number;
export interface ImageToVideoSubtitleStylePreset {
  id: string;
  title: string;
  desc: string;
  badge?: string;
  previewSample: string;
  previewBg: string;
  containerClass: string;
  textClass: string;
}

export const IMAGE_TO_VIDEO_SUBTITLE_STYLES: ImageToVideoSubtitleStylePreset[] = [
  {
    id: "parallax-modern",
    title: "2.5D Glass Pill",
    desc: "Frosted glass capsule with subtle purple glow & spring bounce",
    badge: "Recommended",
    previewSample: "DISCOVER THE FUTURE",
    previewBg: "from-purple-950/50 via-zinc-950 to-black",
    containerClass: "border border-purple-400/40 bg-zinc-900/85 backdrop-blur-md shadow-[0_4px_20px_rgba(168,85,247,0.25)] rounded-full px-3.5 py-1.5",
    textClass: "text-white font-extrabold tracking-tight",
  },
  {
    id: "bold-kinetic",
    title: "Bold Kinetic Yellow",
    desc: "High-contrast obsidian box with luminous yellow retention hook",
    badge: "High Retention",
    previewSample: "MAKE IT HAPPEN",
    previewBg: "from-amber-950/40 via-zinc-950 to-black",
    containerClass: "border border-yellow-400/50 bg-black/95 backdrop-blur-md shadow-[0_4px_20px_rgba(250,204,21,0.25)] rounded-2xl px-3.5 py-1.5",
    textClass: "text-yellow-400 font-black uppercase tracking-tight",
  },
  {
    id: "minimal-lower",
    title: "Minimal Broadcast",
    desc: "Clean lower-third typography with deep cinematic drop shadow",
    badge: "Cinema",
    previewSample: "CLEAR & TIMELESS",
    previewBg: "from-zinc-900/50 via-zinc-950 to-black",
    containerClass: "bg-transparent border-none px-2 py-1",
    textClass: "text-white font-extrabold tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.98)]",
  },
  {
    id: "neon-cyan",
    title: "Cyber Neon Cyan",
    desc: "Electric cyan neon border with futuristic tech glow",
    badge: "Tech & AI",
    previewSample: "NEXT GENERATION",
    previewBg: "from-cyan-950/50 via-zinc-950 to-black",
    containerClass: "border border-cyan-400/50 bg-[#061826]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(34,211,238,0.3)] rounded-full px-3.5 py-1.5",
    textClass: "text-cyan-300 font-extrabold tracking-tight",
  },
  {
    id: "impact-red",
    title: "Impact Red Block",
    desc: "Bold crimson block with uppercase urgent typography",
    badge: "News / Viral",
    previewSample: "BREAKING STORY",
    previewBg: "from-red-950/50 via-zinc-950 to-black",
    containerClass: "border border-red-400/40 bg-red-700/95 backdrop-blur-md shadow-[0_4px_20px_rgba(239,68,68,0.3)] rounded-xl px-3.5 py-1.5",
    textClass: "text-white font-black uppercase tracking-wider",
  },
];

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles,
  onAddImages,
  onRemoveImage,
  bgmFile,
  onSelectBgm,
  bgmVolume,
  onChangeBgmVolume,
  topicTitle,
  onChangeTopicTitle,
  subtitleStyle,
  onChangeSubtitleStyle,
  cameraMotionPreset,
  onChangeCameraMotionPreset,
  fitMode = 'blur-fill',
  onChangeFitMode,
  isRendering,
  onStartRender,
  userCredits,
  estimatedDurationSeconds = 60,
}: ImageToVideoStudioProps) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);

  const [audioDragOver, setAudioDragOver] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);

  // Credit pricing calculation: 1 minute = 2 credits
  const durationMinutes = Math.max(1, Math.ceil(estimatedDurationSeconds / 60));
  const creditCost = durationMinutes * 2;

  // Object URLs for image previews
  const imagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
  }, [imageFiles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── M3 Studio Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1C1B1F] via-[#141218] to-[#0F0D13] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <Sparkles size={13} className="text-purple-400" />
              <span>Material 3 AI Studio • 16:9 30 FPS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Image to Video AI
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Transform voiceover audio and images into a broadcast-ready 16:9 cinematic video.
              Every sentence of your script transitions seamlessly with Ken Burns pan/zoom, 2.5D parallax subtitles, and automated sound design.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" /> Max Duration
                </span>
                <span className="text-white font-extrabold">30 Minutes</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-purple-400" /> Credit Rate
                </span>
                <span className="text-purple-300 font-extrabold">1 Min = 2 Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Topic / Video Title Input ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md">
        <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
          Project / Video Title (Optional)
        </label>
        <input
          type="text"
          value={topicTitle}
          onChange={(e) => onChangeTopicTitle(e.target.value)}
          placeholder="e.g. 5 Lessons From Steve Jobs, The Future of Artificial Intelligence..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* ── Two-Column Workflow Section: Step 1 (Audio) & Step 2 (Images) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STEP 1: VOICE AUDIO (REQUIRED) */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-black text-white">
                  1
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Mic size={18} className="text-purple-400" /> Voiceover Audio
                </h3>
              </div>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-300">
                Required
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Upload the spoken speech or narration audio. The AI transcribes and slices it into dynamic visual scenes (Max 10 minutes).
            </p>

            <input
              type="file"
              ref={audioInputRef}
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onSelectAudio(file);
              }}
            />

            {!selectedAudio ? (
              <div
                onClick={() => audioInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setAudioDragOver(true); }}
                onDragLeave={() => setAudioDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setAudioDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('audio/')) {
                    onSelectAudio(file);
                  }
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                  audioDragOver ? 'border-purple-500 bg-purple-500/10' : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 mb-3">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  Click or drag audio file here
                </p>
                <p className="text-xs text-zinc-400">
                  MP3, WAV, M4A, AAC • Up to 30 minutes
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white">
                    <Mic size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selectedAudio.name}</p>
                    <p className="text-xs text-purple-300 font-semibold">
                      {(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB • Voiceover Loaded
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectAudio(null)}
                  className="p-2 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                  title="Remove audio"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Transcription via Groq Whisper Engine with precise word timestamps</span>
          </div>
        </div>

        {/* STEP 2: IMAGES (OPTIONAL - NO LIMIT) */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-black text-white">
                  2
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ImagePlus size={18} className="text-cyan-400" /> Visual Images
                </h3>
              </div>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                Optional • No Limit
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Upload your own photos or screenshots. If left empty, AI selects relevant 16:9 images from Itnavideo&apos;s library automatically.
            </p>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onAddImages(e.target.files)}
            />

            <div
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
              onDragLeave={() => setImageDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setImageDragOver(false);
                onAddImages(e.dataTransfer.files);
              }}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                imageDragOver ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 mb-2">
                <ImagePlus size={20} />
              </div>
              <p className="text-xs font-bold text-white mb-0.5">
                Click or drag images here
              </p>
              <p className="text-[11px] text-zinc-400">
                Upload any number of images (JPG, PNG, WEBP)
              </p>
            </div>

            {/* Images Grid or Empty State Banner */}
            {imagePreviews.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                  <span>{imagePreviews.length} custom image{imagePreviews.length === 1 ? '' : 's'} added</span>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition cursor-pointer"
                  >
                    + Add More
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-200/90">
                <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300 font-bold">Auto-Curated Asset Mode:</strong> If you don&apos;t upload images, the AI will automatically select high-quality 16:9 images matching each line of your script.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
            <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
            <span>Images auto-scale to 16:9 widescreen with Ken Burns pan & zoom</span>
          </div>
        </div>
      </div>

      {/* ── Additional Controls: Framing, Camera Motion & Background Music ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 16:9 FRAMING & 9:16 FIT */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Maximize2 size={16} className="text-cyan-400" />
            <span>16:9 Framing & 9:16 Fit</span>
          </div>
          <div className="space-y-2">
            {[
              {
                id: 'blur-fill',
                title: 'Smart Blur Fit (9:16 Safe)',
                desc: 'Full 16:9 ambient backdrop. The entire vertical image fits without cropping.',
                badge: 'Recommended',
              },
              {
                id: 'cover',
                title: 'Cinema Full Cover',
                desc: 'Edge-to-edge 16:9 widescreen crop with smooth Ken Burns motion.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangeFitMode?.(option.id as 'blur-fill' | 'cover')}
                className={`w-full text-left rounded-2xl p-3 border transition-all duration-150 cursor-pointer ${
                  fitMode === option.id
                    ? 'border-cyan-400 bg-cyan-400/10 text-white'
                    : 'border-white/5 bg-white/[0.03] text-zinc-400 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{option.title}</p>
                  {option.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* CAMERA MOTION */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Camera size={16} className="text-amber-400" />
            <span>Camera Motion & Pan</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 'ken-burns', title: 'Ken Burns Cinematic', desc: 'Slow zoom (1.0x to 1.2x) & horizontal drift' },
              { id: 'dynamic-flow', title: 'Dynamic Rush', desc: 'Alternating zooms, fast pans & slide cuts' },
              { id: 'subtle-drift', title: 'Subtle Float', desc: 'Ultra-gentle zoom for professional focus' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeCameraMotionPreset(preset.id)}
                className={`w-full text-left rounded-2xl p-3 border transition-all duration-150 cursor-pointer ${
                  cameraMotionPreset === preset.id
                    ? 'border-amber-400 bg-amber-400/10 text-white'
                    : 'border-white/5 bg-white/[0.03] text-zinc-400 hover:border-white/15'
                }`}
              >
                <p className="text-xs font-bold text-white">{preset.title}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* BACKGROUND MUSIC & SFX */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Music2 size={16} className="text-emerald-400" />
                <span>Background Music</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400">Auto-Ducking</span>
            </div>

            <input
              type="file"
              ref={bgmInputRef}
              accept="audio/*"
              className="hidden"
              onChange={(e) => onSelectBgm(e.target.files?.[0] || null)}
            />

            {!bgmFile ? (
              <button
                type="button"
                onClick={() => bgmInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-zinc-300 hover:bg-white/10 transition cursor-pointer"
              >
                <UploadCloud size={14} className="text-emerald-400" />
                <span>Upload Custom BGM Track</span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                <p className="text-xs font-bold text-white truncate max-w-[150px]">{bgmFile.name}</p>
                <button
                  type="button"
                  onClick={() => onSelectBgm(null)}
                  className="text-zinc-400 hover:text-rose-400 text-xs font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Volume slider */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Volume2 size={13} /> BGM Volume
                </span>
                <span className="text-white font-bold">{Math.round(bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={bgmVolume}
                onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[11px] text-zinc-500">
            ✨ Includes cinematic transition whooshes automatically.
          </p>
        </div>
      </div>

      {/* ── 2.5D Kinetic & Parallax Caption Styles with Live Visual Previews ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">Caption &amp; Subtitle Styles</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live Visual Preview
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose how spoken words appear on your 16:9 video. Click any card to preview and apply to your render.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-zinc-400 hidden sm:block">
            Selected: <span className="text-purple-300 font-extrabold">{IMAGE_TO_VIDEO_SUBTITLE_STYLES.find(s => s.id === subtitleStyle)?.title || subtitleStyle}</span>
          </span>
        </div>

        {/* 5-Column Grid of 16:9 Live Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-1">
          {IMAGE_TO_VIDEO_SUBTITLE_STYLES.map((style) => {
            const isSelected = subtitleStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeSubtitleStyle(style.id)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer p-3 select-none ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/40"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {/* 16:9 Simulated Video Screen Preview */}
                <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${style.previewBg} border border-white/10 flex flex-col justify-between p-2.5 transition-transform duration-200 group-hover:scale-[1.02]`}>
                  {/* Aspect tag & Selected Check */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-zinc-400 border border-white/5">
                      16:9 Subtitles
                    </span>
                    {isSelected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white shadow-md">
                        <CheckCircle2 size={13} strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>

                  {/* Subtitle Representation positioned at bottom third */}
                  <div className="flex justify-center pb-1">
                    <div className={`${style.containerClass} transition-transform duration-200 group-hover:scale-105`}>
                      <span className={`${style.textClass} text-[11px] leading-tight block text-center truncate max-w-[130px]`}>
                        {style.previewSample}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Title & Description */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold transition-colors ${isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"}`}>
                      {style.title}
                    </p>
                    {style.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                        {style.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── M3 Tonal Action Card with Credit Cost & Render Trigger ── */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-black p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h4 className="text-lg font-black text-white">Ready to Render Image to Video AI</h4>
          </div>
          <p className="text-xs text-zinc-400">
            16:9 Widescreen • 30 FPS • Auto-scene cuts synced to audio script • 48-hour download retention
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-purple-300 font-bold">
            <span>⚡ Cost: {creditCost} credits (for ~{durationMinutes} min video)</span>
            {userCredits !== undefined && (
              <span className="text-zinc-400">• Your balance: {userCredits} credits</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onStartRender}
          disabled={!selectedAudio || isRendering}
          className={`inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-black shadow-lg transition-all duration-200 cursor-pointer ${
            !selectedAudio || isRendering
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isRendering ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Rendering Image to Video AI...</span>
            </>
          ) : (
            <>
              <span>Generate Image to Video AI (16:9)</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
