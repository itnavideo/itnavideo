"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  UploadCloud,
  CheckCircle2,
  Volume2,
  Sparkles,
  AlertCircle,
  Play,
  Pause,
  Check,
  Upload,
  X,
  Music,
  ChevronRight,
  Plus,
  ArrowLeft,
  Captions,
  Clock3,
  SlidersHorizontal,
  VolumeX,
  Film,
  Layers,
  Zap,
  Eye,
  CheckCircle,
  Wand2,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { ImageToVideoShowcaseCarousel } from "@/components/dashboard/ImageToVideoShowcaseCarousel";

export type ImageToVideoAssetMode = "default_stock" | "custom_upload" | "library" | "upload" | "mix" | "ai-generate";

export interface LibraryBgmTrack {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  url: string;
  durationSeconds: number;
}

export const ITNAVIDEO_LIBRARY_BGM: LibraryBgmTrack[] = [
  {
    id: "wealth-building",
    name: "Wealth & Empire",
    artist: "Itnavideo Studio",
    genre: "Documentary",
    mood: "Reflective, Ambient",
    url: "/assets/reusable/sfx/chime.mp3",
    durationSeconds: 180,
  },
  {
    id: "cinematic-suspense",
    name: "Shadows of Truth",
    artist: "Itnavideo Studio",
    genre: "Cinematic",
    mood: "Mysterious, Dramatic",
    url: "/assets/reusable/sfx/ding.mp3",
    durationSeconds: 165,
  },
  {
    id: "calm-lofi",
    name: "Midnight Study",
    artist: "Itnavideo Studio",
    genre: "Lo-Fi",
    mood: "Relaxed, Chill",
    url: "/assets/reusable/sfx/chime.mp3",
    durationSeconds: 145,
  },
  {
    id: "tech-minimal",
    name: "Digital Frontier",
    artist: "Itnavideo Studio",
    genre: "Electronic",
    mood: "Modern Tech",
    url: "/assets/reusable/sfx/chime.mp3",
    durationSeconds: 155,
  },
];

export const DEFAULT_AI_SAMPLE_ASSETS = [
  { id: "1", title: "Cinematic Landscape", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80" },
  { id: "2", title: "Modern City Architecture", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { id: "3", title: "Cyberpunk Alley", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80" },
  { id: "4", title: "Cosmic Galaxy", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&q=80" },
  { id: "5", title: "Snowy Mountain Range", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { id: "6", title: "Tropical Coastline", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
];

export const CINEMA_SUBTITLE_PRESETS = [
  {
    id: "netflix-yellow",
    title: "Netflix Yellow",
    desc: "Classic bold yellow font with subtle outline",
    renderCaption: () => (
      <span className="font-black text-xs sm:text-sm text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide">
        UNCOVERING THE <span className="bg-black/80 px-1 py-0.5 rounded text-yellow-400">LOST SECRET</span>
      </span>
    ),
  },
  {
    id: "documentary-serif",
    title: "Documentary Serif",
    desc: "Editorial serif captions with elegant spacing",
    renderCaption: () => (
      <span className="font-serif font-bold text-xs sm:text-sm text-slate-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] italic tracking-wider">
        History holds answers to future mysteries.
      </span>
    ),
  },
  {
    id: "parallax-modern",
    title: "Parallax Modern",
    desc: "Bold white kinetic word zoom with frosted backing",
    renderCaption: () => (
      <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-black/60 border border-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg">
        THIS CHANGED <span className="text-[#FF9100]">EVERYTHING</span>
      </span>
    ),
  },
  {
    id: "minimal-clean",
    title: "Minimal Clean",
    desc: "Crisp white typography with subtle drop-shadow",
    renderCaption: () => (
      <span className="font-semibold text-xs sm:text-sm text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        Simple, powerful narrative storytelling.
      </span>
    ),
  },
  {
    id: "gold-editorial",
    title: "Gold Editorial",
    desc: "Metallic warm gold gradient headlines",
    renderCaption: () => (
      <span className="font-black text-xs sm:text-sm uppercase bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        THE GOLDEN ERA
      </span>
    ),
  },
];

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
  onAddImages: (files: FileList | File[] | null) => void;
  onRemoveImage: (index: number) => void;
  imagePhrases?: string[];
  onChangeImagePhrase?: (index: number, val: string) => void;
  assetSourceMode?: ImageToVideoAssetMode;
  onChangeAssetSourceMode?: (mode: ImageToVideoAssetMode) => void;
  selectedStockAssetUrls?: string[];
  onChangeSelectedStockAssetUrls?: (urls: string[]) => void;
  aiGeneratedImageUrls?: string[];
  onChangeAiGeneratedImageUrls?: (urls: string[]) => void;
  visualStyle?: string;
  onChangeVisualStyle?: (style: any) => void;
  characterImageFile?: File | null;
  onSelectCharacterImage?: (file: File | null) => void;
  characterDnaHint?: string;
  onChangeCharacterDnaHint?: (hint: string) => void;
  bgmEnabled?: boolean;
  onChangeBgmEnabled?: (enabled: boolean) => void;
  enableSubtitles?: boolean;
  onToggleSubtitles?: (enabled: boolean) => void;
  subtitleStyle?: string;
  onChangeSubtitleStyle?: (style: string) => void;
  selectedBgmTrack?: LibraryBgmTrack | null;
  onSelectBgmTrack?: (track: LibraryBgmTrack | null) => void;
  selectedLibraryBgmUrl?: string;
  onChangeSelectedLibraryBgmUrl?: (url: string) => void;
  bgmFile?: File | null;
  onSelectBgmFile?: (file: File | null) => void;
  onSelectBgm?: (file: File | null) => void;
  topicTitle?: string;
  onChangeTopicTitle?: (title: string) => void;
  bgmVolume?: number;
  onChangeBgmVolume?: (volume: number) => void;
  cameraMotionPreset?: string;
  onChangeCameraMotionPreset?: (preset: string) => void;
  fitMode?: "cover" | "contain" | "blur-fill" | string;
  onChangeFitMode?: (mode: any) => void;
  enableSoundEffects?: boolean;
  onToggleSoundEffects?: (enabled: boolean) => void;
  estimatedDurationSeconds?: number;
  onStartRender?: () => void;
  isRendering?: boolean;
  userCredits?: number;
  [key: string]: any;
}

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles,
  onAddImages,
  onRemoveImage,
  imagePhrases,
  onChangeImagePhrase,
  assetSourceMode = "library",
  onChangeAssetSourceMode,
  selectedStockAssetUrls = [],
  onChangeSelectedStockAssetUrls,
  visualStyle = "realistic",
  onChangeVisualStyle,
  enableSubtitles = true,
  onToggleSubtitles,
  subtitleStyle = "parallax-modern",
  onChangeSubtitleStyle,
  selectedBgmTrack,
  onSelectBgmTrack,
  bgmVolume = 0.15,
  onChangeBgmVolume,
  enableSoundEffects = true,
  onToggleSoundEffects,
  estimatedDurationSeconds = 60,
  onStartRender,
  isRendering = false,
  userCredits = 10,
}: ImageToVideoStudioProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Local state for image previews
  const imagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  // Detected audio duration
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);
  useEffect(() => {
    if (!selectedAudio) {
      setAudioDurationSeconds(0);
      return;
    }
    const audioObj = new Audio();
    const url = URL.createObjectURL(selectedAudio);
    audioObj.src = url;
    audioObj.onloadedmetadata = () => {
      if (audioObj.duration && !isNaN(audioObj.duration)) {
        setAudioDurationSeconds(Math.round(audioObj.duration));
      }
      URL.revokeObjectURL(url);
    };
  }, [selectedAudio]);

  const activeArtStyle = visualStyle || "realistic";
  const activeAssetMode = assetSourceMode || "library";

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
              <span>Cinema Story Configurator</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Turn voiceover narration audio into cohesive 16:9 widescreen story videos with AI visual pacing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            <span>16:9 Widescreen • Up to 12m</span>
          </span>
        </div>
      </div>

      {/* 2-Column Responsive Layout (7 cols Form / 5 cols Sticky Live Cinema Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ── 1. UPLOAD YOUR AUDIO ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Mic size={18} className="text-[#FF9100]" />
                    <span>Upload Your Audio</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select voiceover narration audio (MP3, WAV, M4A — up to 12 mins).
                  </p>
                </div>
              </div>
            </div>

            {/* Audio File Dropzone */}
            <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-[#161720] p-6 text-center hover:border-[#FF6D00]/50 transition cursor-pointer overflow-hidden">
              {!selectedAudio ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20 group-hover:scale-110 transition">
                    <UploadCloud size={24} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Drop your audio file here or browse</p>
                    <p className="text-xs text-zinc-400 font-mono">MP3, WAV or M4A • Max 12 minutes (720s)</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#FF6D00]/30 bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#FF6D00]/20 hover:brightness-110 transition">
                    <Upload size={14} />
                    <span>Browse Audio Files</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{selectedAudio.name}</p>
                      <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                        {(selectedAudio.size / (1024 * 1024)).toFixed(1)} MB • {audioDurationSeconds > 0 ? `${audioDurationSeconds}s` : "Loaded"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectAudio(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-red-400 font-bold px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onSelectAudio(file);
                }}
              />
            </label>
          </div>

          {/* ── 2. VISUAL STYLE & SOURCE ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Film size={18} className="text-[#FF9100]" />
                    <span>Visual Style &amp; Source</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select 16:9 aesthetic art style and visual asset source.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Aesthetic Style (2 Cards: Realistic Images vs 2D Illustrations) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Built-in Asset Visual Style</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "realistic", label: "📷 Realistic Images", desc: "Approved cinematic real photos & stock" },
                  { id: "2d", label: "🎨 2D Illustrations", desc: "Approved flat art & vector illustrations" },
                ].map((art) => {
                  const active = activeArtStyle === art.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => onChangeVisualStyle?.(art.id)}
                      className={`rounded-2xl border p-3.5 text-left transition cursor-pointer ${
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

            {/* Asset Source Mode (3 Options: My Images Only, ItnaVideo Assets, My Images + ItnaVideo Assets) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-bold text-zinc-300">Image Source Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "upload",
                    label: "My Images Only",
                    detail: "Use only the images you upload for this video."
                  },
                  {
                    id: "library",
                    label: "ItnaVideo Assets",
                    detail: "Choose from our built-in image library."
                  },
                  {
                    id: "mix",
                    label: "My Images + ItnaVideo Assets",
                    detail: "Use your images first and add matching ItnaVideo assets where needed."
                  },
                ].map((option) => {
                  const active = activeAssetMode === option.id || (option.id === "library" && activeAssetMode === "default_stock") || (option.id === "upload" && activeAssetMode === "custom_upload");
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onChangeAssetSourceMode?.(option.id as any)}
                      className={`rounded-2xl border p-3.5 text-left transition cursor-pointer flex flex-col justify-between ${
                        active
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white font-bold ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{option.label}</span>
                      <span className="mt-1 block text-[10px] text-zinc-400 leading-tight">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uploaded Images List (If Custom or Mix selected) */}
            {(activeAssetMode === "upload" || activeAssetMode === "mix" || activeAssetMode === "custom_upload") && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-[#161720] p-4 text-xs font-bold text-zinc-200 hover:border-[#FF6D00]/50 transition cursor-pointer"
                >
                  <Plus size={16} className="text-[#FF9100]" />
                  <span>Add Custom Images / Character References</span>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => onRemoveImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) onAddImages(files);
                  }}
                />
              </div>
            )}
          </div>

          {/* ── 3. WIDESCREEN CINEMA CAPTIONS ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] text-sm font-black border border-[#FF6D00]/30">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Captions size={18} className="text-[#FF9100]" />
                    <span>Kinetic Subtitles &amp; Captions</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select 2.5D frosted glass cinema subtitle presets.
                  </p>
                </div>
              </div>
            </div>

            {/* Subtitle Style Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CINEMA_SUBTITLE_PRESETS.map((style) => {
                const isSelected = subtitleStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChangeSubtitleStyle?.(style.id)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition cursor-pointer overflow-hidden ${
                      isSelected
                        ? "border-[#FF6D00] bg-[#FF6D00]/10 ring-1 ring-[#FF6D00]"
                        : "border-white/10 bg-[#161720] hover:border-white/20"
                    }`}
                  >
                    <div className="relative aspect-[16/6] w-full rounded-xl border border-white/10 bg-slate-900 overflow-hidden flex items-center justify-center p-2 mb-2.5">
                      <div className="absolute inset-0 bg-black/60" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <div className="relative z-10 text-center">{style.renderCaption()}</div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#FF9100] transition">
                        {style.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{style.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Image to Video AI Cloud Demos Showcase ── */}
          <ImageToVideoShowcaseCarousel />

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

            {/* BGM Track Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">Background Music Track</label>
              <div className="grid grid-cols-2 gap-2">
                {ITNAVIDEO_LIBRARY_BGM.map((track) => {
                  const active = selectedBgmTrack?.id === track.id || track.id === "wealth-building";
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => onSelectBgmTrack?.(track)}
                      className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                        active
                          ? "border-[#FF6D00] bg-[#FF6D00]/10 text-white font-bold ring-1 ring-[#FF6D00]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-white truncate">{track.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{track.genre} • {track.mood}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound Effects (SFX) Toggle & Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
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
                  onClick={() => onToggleSoundEffects?.(!enableSoundEffects)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enableSoundEffects ? "bg-[#FF6D00]" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enableSoundEffects ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161720] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-bold">
                  <span>BGM Mix Volume</span>
                  <span className="font-mono text-[#FF9100]">{Math.round((bgmVolume || 0.15) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={bgmVolume || 0.15}
                  onChange={(e) => onChangeBgmVolume?.(parseFloat(e.target.value))}
                  className="w-full accent-[#FF6D00] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 16:9 Cinema Stage Live Preview (5 cols) */}
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
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center group">
              {/* Sample Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  activeArtStyle === "2d"
                    ? DEFAULT_AI_SAMPLE_ASSETS[3].url
                    : DEFAULT_AI_SAMPLE_ASSETS[0].url
                }
                alt="Cinema Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              {/* Subtitle Badge Preview Overlay */}
              <div className="relative z-10 max-w-[85%] text-center">
                {CINEMA_SUBTITLE_PRESETS.find((s) => s.id === subtitleStyle)?.renderCaption() || (
                  <span className="font-black text-xs text-white bg-black/60 px-3 py-1 rounded-xl border border-white/20">
                    Sample 16:9 Kinetic Caption
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-mono text-zinc-300 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>16:9 Cinema • Ken Burns FX</span>
              </div>
            </div>

            {/* Config Summary Badges */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Audio Duration</span>
                <span className="font-mono text-white font-bold">
                  {audioDurationSeconds > 0 ? `${audioDurationSeconds} seconds` : "Ready for audio"}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Visual Aesthetic</span>
                <span className="font-bold text-[#FF9100] capitalize">{activeArtStyle} Cinema</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Asset Provider</span>
                <span className="font-bold text-white capitalize">{activeAssetMode} Assets</span>
              </div>
            </div>

            {/* Primary Generate Button CTA */}
            <button
              type="button"
              onClick={onStartRender}
              disabled={isRendering}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-black text-black shadow-xl transition-all duration-200 ${
                isRendering
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-lg shadow-[#FF6D00]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              <Sparkles size={18} className="fill-black/20" />
              <span>{isRendering ? "Rendering 1080p MP4..." : "Generate Video"}</span>
              <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-mono font-bold">Costs 2 Credits</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
