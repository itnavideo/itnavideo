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
  ChevronLeft,
  ArrowLeftRight,
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
  Trash2,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";

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
    id: "minimal-clean",
    title: "Clean Translucent Pill",
    desc: "Crisp white text on subtle dark pill backing for maximum readability",
    renderCaption: () => (
      <span className="font-semibold text-xs sm:text-sm text-white bg-black/70 px-3 py-1 rounded-full border border-white/10 tracking-wide">
        Captions synchronized with narration
      </span>
    ),
  },
  {
    id: "parallax-modern",
    title: "Modern Minimal",
    desc: "Clean modern typography with balanced contrast and gentle presence",
    renderCaption: () => (
      <span className="font-bold text-xs sm:text-sm text-slate-100 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
        Every word clearly legible
      </span>
    ),
  },
  {
    id: "documentary-serif",
    title: "Documentary Clean",
    desc: "Timeless editorial subtitles with soft contrast drop-shadow",
    renderCaption: () => (
      <span className="font-medium text-xs sm:text-sm text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] tracking-wide">
        Clear, synchronized spoken narrative
      </span>
    ),
  },
  {
    id: "netflix-yellow",
    title: "Classic High Contrast",
    desc: "Subtle warm-white text with dark background for vivid scenes",
    renderCaption: () => (
      <span className="font-semibold text-xs sm:text-sm text-amber-50 bg-black/75 px-3 py-1 rounded-lg border border-white/10">
        High contrast across any background
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
  onReorderImages?: (fromIndex: number, toIndex: number) => void;
  imagePhrases?: string[];
  onChangeImagePhrase?: (index: number, val: string) => void;
  onClearAllImages?: () => void;
  maxImages?: number;
  assetSourceMode?: ImageToVideoAssetMode;
  onChangeAssetSourceMode?: (mode: ImageToVideoAssetMode) => void;
  selectedStockAssetUrls?: string[];
  onChangeSelectedStockAssetUrls?: (urls: string[]) => void;
  aiGeneratedImageUrls?: string[];
  onChangeAiGeneratedImageUrls?: (urls: string[]) => void;
  visualStyle?: string;
  onChangeVisualStyle?: (style: any) => void;
  customAiPrompt?: string;
  onChangeCustomAiPrompt?: (prompt: string) => void;
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
  onReorderImages,
  imagePhrases,
  onChangeImagePhrase,
  onClearAllImages,
  maxImages = 100,
  assetSourceMode = "library",
  onChangeAssetSourceMode,
  selectedStockAssetUrls = [],
  onChangeSelectedStockAssetUrls,
  visualStyle = "realistic",
  onChangeVisualStyle,
  customAiPrompt = "",
  onChangeCustomAiPrompt,
  characterImageFile = null,
  onSelectCharacterImage,
  characterDnaHint = "",
  onChangeCharacterDnaHint,
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
  cameraMotionPreset = "slow-dolly",
  onChangeCameraMotionPreset,
  topicTitle,
}: ImageToVideoStudioProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);

  // Local state for image previews
  const imagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  const characterPreviewUrl = useMemo(() => {
    if (!characterImageFile) return null;
    return URL.createObjectURL(characterImageFile);
  }, [characterImageFile]);

  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Detected audio duration
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);

  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    if (!selectedAudio) {
      setAudioDurationSeconds(0);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      }
      return;
    }
    const url = URL.createObjectURL(selectedAudio);
    const audioObj = new Audio(url);
    audioObj.onloadedmetadata = () => {
      if (audioObj.duration && !isNaN(audioObj.duration)) {
        setAudioDurationSeconds(Math.min(600, Math.round(audioObj.duration)));
      }
    };
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = url;
    }
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedAudio]);

  const toggleAudioPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => console.warn("Audio play error", err));
    }
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculatedCredits = Math.max(1, Math.min(10, Math.ceil((audioDurationSeconds || estimatedDurationSeconds || 60) / 60)));
  const activeArtStyle = visualStyle || "realistic";
  const activeAssetMode = assetSourceMode || "library";

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Hidden audio element for preview */}
      <audio
        ref={audioPlayerRef}
        onTimeUpdate={() => {
          if (audioPlayerRef.current) {
            setAudioCurrentTime(audioPlayerRef.current.currentTime);
          }
        }}
        onEnded={() => {
          setIsPlayingAudio(false);
          setAudioCurrentTime(0);
        }}
      />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-md shadow-[#FF5722]/25">
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#161720] px-3.5 py-1.5 text-xs font-bold text-slate-200">
            <Clock3 size={13} className="text-[#FF7043]" />
            <span>16:9 Widescreen • Up to 5m (300s)</span>
          </span>
        </div>
      </div>


      {/* 2-Column Responsive Layout (7 cols Form / 5 cols Sticky Live Cinema Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/*  1. UPLOAD YOUR AUDIO  */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Mic size={18} className="text-[#FF9100]" />
                    <span>Upload Your Audio</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select voiceover narration audio (MP3, WAV, M4A  up to 5 mins).
                  </p>
                </div>
              </div>
            </div>

            {/* Audio File Dropzone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer?.files?.[0] || null;
                if (file) {
                  onSelectAudio(file);
                }
              }}
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-[#161720] p-6 text-center hover:border-[#FF5722]/50 transition cursor-pointer overflow-hidden"
            >
              {!selectedAudio ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF9100] border border-[#FF5722]/20 group-hover:scale-110 transition">
                    <UploadCloud size={24} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Drop your audio file here or browse</p>
                    <p className="text-xs text-zinc-400 font-mono">MP3, WAV or M4A  Max 5 minutes (300s)</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#FF5722]/30 bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#FF5722]/20 hover:brightness-110 transition">
                    <Upload size={14} />
                    <span>Browse Audio Files</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left space-y-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Play/Pause Button */}
                      <button
                        type="button"
                        onClick={toggleAudioPlay}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5722] text-black hover:brightness-110 transition shadow-lg shrink-0 cursor-pointer"
                        title={isPlayingAudio ? "Pause" : "Play preview"}
                      >
                        {isPlayingAudio ? (
                          <Pause size={18} className="fill-black" />
                        ) : (
                          <Play size={18} className="ml-0.5 fill-black" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">{selectedAudio.name}</p>
                        <p className="text-[11px] text-emerald-300 font-mono mt-0.5 flex items-center gap-2">
                          <span>{(selectedAudio.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <span></span>
                          <span>{audioDurationSeconds > 0 ? `${formatAudioTime(audioCurrentTime)} / ${formatAudioTime(audioDurationSeconds)}` : "Loaded"}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (audioPlayerRef.current) {
                          audioPlayerRef.current.pause();
                        }
                        setIsPlayingAudio(false);
                        onSelectAudio(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-red-400 font-bold px-2 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Scrubber Progress Bar */}
                  {audioDurationSeconds > 0 && (
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] h-full transition-all duration-100"
                        style={{
                          width: `${Math.min(100, (audioCurrentTime / audioDurationSeconds) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <input
                type="file"
                id="itna-audio-file-input"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onSelectAudio(file);
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {/*  2. VISUAL STYLE & SOURCE  */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
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

            {/* ⚡ One-Click "Viral Style" Presets (4 Signature Curated Packs) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#FFA000]" />
                  <span>One-Click Viral Style Preset</span>
                </label>
                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">1-Click Lighting, Motion &amp; Color Grade</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    id: "cinematic-film",
                    label: "🎞️ Cinematic 35mm",
                    badge: "Movie Look",
                    desc: "Warm Kodak film grain, anamorphic flare & golden hour grade",
                    glow: "hover:border-amber-500/50",
                    activeRing: "border-amber-500 bg-amber-500/10 ring-amber-500",
                    badgeColor: "bg-amber-500 text-black",
                  },
                  {
                    id: "3d-animation",
                    label: "🧸 3D Pixar Animation",
                    badge: "Ultra CGI",
                    desc: "Vibrant characters, soft global illumination & 3D depth",
                    glow: "hover:border-purple-500/50",
                    activeRing: "border-purple-500 bg-purple-500/10 ring-purple-500",
                    badgeColor: "bg-purple-500 text-white",
                  },
                  {
                    id: "anime-storybook",
                    label: "🎨 Studio Anime",
                    badge: "Ghibli 2D",
                    desc: "Painterly cloudscapes, clean ink lines & storybook anime",
                    glow: "hover:border-sky-500/50",
                    activeRing: "border-sky-500 bg-sky-500/10 ring-sky-500",
                    badgeColor: "bg-sky-500 text-white",
                  },
                  {
                    id: "dark-mystery",
                    label: "🌑 Dark Mystery",
                    badge: "Noir Suspense",
                    desc: "High-contrast shadows, deep silhouettes & thriller lighting",
                    glow: "hover:border-zinc-400/50",
                    activeRing: "border-zinc-300 bg-white/10 ring-zinc-300",
                    badgeColor: "bg-zinc-200 text-black",
                  },
                ].map((preset) => {
                  const active =
                    activeArtStyle === preset.id ||
                    (preset.id === "cinematic-film" && (activeArtStyle === "realistic" || activeArtStyle === "cinematic")) ||
                    (preset.id === "anime-storybook" && activeArtStyle === "2d") ||
                    (preset.id === "3d-animation" && activeArtStyle === "3d");

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onChangeVisualStyle?.(preset.id);
                        if (preset.id === "cinematic-film") {
                          onChangeCameraMotionPreset?.("slow-dolly");
                          onChangeSubtitleStyle?.("documentary-serif");
                        } else if (preset.id === "3d-animation") {
                          onChangeCameraMotionPreset?.("dynamic-zoom");
                          onChangeSubtitleStyle?.("minimal-clean");
                        } else if (preset.id === "anime-storybook") {
                          onChangeCameraMotionPreset?.("gentle-pan");
                          onChangeSubtitleStyle?.("parallax-modern");
                        } else if (preset.id === "dark-mystery") {
                          onChangeCameraMotionPreset?.("slow-dolly");
                          onChangeSubtitleStyle?.("netflix-yellow");
                        }
                      }}
                      className={`relative rounded-2xl border p-3.5 text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                        active
                          ? `${preset.activeRing} text-white font-bold ring-1`
                          : `border-white/10 bg-[#161720] text-zinc-400 hover:text-white ${preset.glow}`
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="block text-xs font-black text-white">{preset.label}</span>
                        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-snug">{preset.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset Source Mode (3 Options: AI Generate, Upload up to 100, ItnaVideo Library) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-bold text-zinc-300">Image Source Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "ai-generate",
                    label: "✨ Generate with AI",
                    badge: "Automated",
                    detail: "AI creates custom cinematic visuals for every scene from your audio.",
                  },
                  {
                    id: "upload",
                    label: "📁 Upload My Images",
                    badge: "Up to 100",
                    detail: "Bulk upload your photos. AI auto-times and sequences them to voiceover.",
                  },
                  {
                    id: "library",
                    label: "🎬 ItnaVideo Library",
                    badge: "Studio Assets",
                    detail: "Match your story to our curated 16:9 cinematic archive.",
                  },
                ].map((option) => {
                  const active =
                    activeAssetMode === option.id ||
                    (option.id === "upload" && (activeAssetMode === "custom_upload" || activeAssetMode === "mix")) ||
                    (option.id === "library" && activeAssetMode === "default_stock");

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onChangeAssetSourceMode?.(option.id as any)}
                      className={`relative rounded-2xl border p-3.5 text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                        active
                          ? "border-[#FF5722] bg-[#FF5722]/10 text-white font-bold ring-1 ring-[#FF5722]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="block text-xs font-bold text-white">{option.label}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            active
                              ? "bg-[#FF5722] text-black"
                              : "bg-white/10 text-zinc-400"
                          }`}
                        >
                          {option.badge}
                        </span>
                      </div>
                      <span className="block text-[10px] text-zinc-400 leading-tight">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Image Generation Active Banner with Prompt & Character Upload */}
            {activeAssetMode === "ai-generate" && (
              <div className="rounded-2xl border border-[#FF5722]/30 bg-gradient-to-br from-[#FF5722]/10 via-[#161720] to-[#111218] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-white">
                    <Sparkles size={14} className="text-[#FF9100]" />
                    <span>100% Automated AI Scene Generation</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#FF9100] bg-[#FF5722]/15 px-2.5 py-0.5 rounded-full border border-[#FF5722]/30">
                    Vertex AI Imagen 3 &amp; Gemini 2.0
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Zero manual images needed. Our AI analyzes your voiceover, locks a single consistent character profile, and generates cinematic 16:9 scenes timed every 5 seconds.
                </p>

                {/* Viral Story System Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10.5px]">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-amber-300 font-bold">
                    🎭 Character Consistency Locked
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-300 font-bold">
                    ⚡ Strict 5s Pacing
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">
                    📜 Story Devices Active
                  </span>
                </div>

                {/* Active Style Indicator (Synced to Master One-Click Presets) */}
                <div className="flex items-center justify-between text-xs py-2 px-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#FFA000]" />
                    <span>Selected Visual Style:</span>
                  </span>
                  <span className="font-bold text-[#FFA000]">
                    {activeArtStyle === "3d" || activeArtStyle === "3d-animation" ? "🧸 3D Pixar Animation" :
                     activeArtStyle === "2d" || activeArtStyle === "anime-storybook" ? "🎨 Studio Anime" :
                     activeArtStyle === "dark-mystery" ? "🌑 Dark Mystery" : "🎞️ Cinematic 35mm Movie"}
                  </span>
                </div>

                {/* 2. Visual Direction & Prompt Box */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Wand2 size={13} className="text-[#FF9100]" />
                      <span>Visual Direction &amp; Character Prompt (Optional)</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">Customizes AI Visuals</span>
                  </div>

                  <input
                    type="text"
                    value={customAiPrompt}
                    onChange={(e) => onChangeCustomAiPrompt?.(e.target.value)}
                    placeholder='e.g. "3D Pixar animation style with warm sunlight about a brave young astronaut" or "Moody 35mm cinema in rainy Tokyo"'
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  />

                  {/* 1-Click Quick Style Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-zinc-400 mr-1">Quick prompts:</span>
                    {[
                      "3D Pixar Animation Style",
                      "Cinematic 35mm Film Lighting",
                      "Studio Ghibli 2D Anime",
                      "Cyberpunk Neon Cityscape",
                      "Dark Moody Noir Aesthetic",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onChangeCustomAiPrompt?.(tag)}
                        className="text-[10px] font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Character Reference Photo Upload (Consistent Character) */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <User size={13} className="text-[#FF9100]" />
                      <span>Consistent Character Reference Photo (Optional)</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Locks Character Face &amp; Outfit
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-tight">
                    Already have a character image or avatar? Upload 1 photo and our AI will maintain the exact same person across all scenes.
                  </p>

                  {!characterImageFile ? (
                    <div
                      onClick={() => characterInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/40 p-3.5 text-xs font-bold text-zinc-300 hover:border-[#FF5722]/50 hover:text-white transition cursor-pointer"
                    >
                      <UploadCloud size={16} className="text-[#FF9100]" />
                      <span>Upload 1 Character Reference Image (PNG, JPG)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {characterPreviewUrl && (
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-emerald-500/30 shrink-0 bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={characterPreviewUrl} alt="Character" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                            <span>{characterImageFile.name}</span>
                          </p>
                          <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                            Character locked for all story scenes
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectCharacterImage?.(null);
                          if (characterInputRef.current) characterInputRef.current.value = "";
                        }}
                        className="text-xs font-bold text-zinc-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <input
                    ref={characterInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) onSelectCharacterImage?.(file);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Uploaded Images List (Bulk Upload up to 100 images, ZERO manual text fields) */}
            {(activeAssetMode === "upload" || activeAssetMode === "custom_upload" || activeAssetMode === "mix") && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                {/* Multi-Image Drag & Dropzone */}
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
                      f.type.startsWith("image/")
                    );
                    if (files.length > 0) onAddImages(files);
                  }}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-[#161720] p-6 text-center hover:border-[#FF5722]/50 transition cursor-pointer overflow-hidden"
                >
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF9100] border border-[#FF5722]/20 group-hover:scale-110 transition">
                      <UploadCloud size={22} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-white">
                        Drop story images here in bulk or browse
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">
                        Select multiple images at once • Up to {maxImages} images (PNG, JPG, WEBP)
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#FF5722]/30 bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-3.5 py-1.5 text-xs font-black text-black shadow-md hover:brightness-110 transition">
                      <Upload size={13} />
                      <span>Browse Files (Up to {maxImages})</span>
                    </span>
                  </div>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) onAddImages(files);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                  />
                </label>

                {/* Gallery of Uploaded Images */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-3">
                    {/* Header Controls: Count & Clear All */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-[#FF9100]" />
                          <span>Uploaded Images ({imagePreviews.length} / {maxImages})</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles size={10} />
                          <span>AI Story Arc Active</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="text-[11px] font-bold text-[#FF9100] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Add More</span>
                        </button>
                        {onClearAllImages && (
                          <button
                            type="button"
                            onClick={onClearAllImages}
                            className="text-[11px] font-bold text-zinc-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Clear All</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* AI Story Arc Narrative Visual Flow Bar */}
                    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-red-500/10 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <Sparkles size={12} />
                          <span>AI Story Arc Director</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">100% Gapless • Dynamic Motion</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-semibold text-center">
                        <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg py-1 px-1.5">
                          🎣 1. Hook Intro
                        </div>
                        <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg py-1 px-1.5">
                          📖 2. Narrative
                        </div>
                        <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg py-1 px-1.5">
                          💥 3. Peak Climax
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg py-1 px-1.5">
                          🎬 4. Resolution
                        </div>
                      </div>
                    </div>

                    {/* Responsive Image Grid with Story Beat Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {imagePreviews.map((img, idx) => {
                        const total = imagePreviews.length;
                        const ratio = idx / Math.max(1, total);
                        let beatBadge = { label: '📖 Story', color: 'bg-blue-500/80 text-white' };
                        if (idx === 0) {
                          beatBadge = { label: '🎣 Hook', color: 'bg-amber-500 text-black font-black' };
                        } else if (ratio >= 0.65 && ratio < 0.85) {
                          beatBadge = { label: '💥 Climax', color: 'bg-red-500 text-white font-black' };
                        } else if (ratio >= 0.85 || idx === total - 1) {
                          beatBadge = { label: '🎬 Outro', color: 'bg-emerald-500 text-white font-bold' };
                        }

                        return (
                          <div
                            key={idx}
                            className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/60 hover:border-[#FF5722]/50 transition shadow-md"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            {/* Index & Story Beat Badge */}
                            <div className="absolute top-1 left-1 flex items-center gap-1">
                              <span className="px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9.5px] font-mono font-bold text-[#FF9100] border border-white/10">
                                #{idx + 1}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-bold backdrop-blur-sm shadow-sm ${beatBadge.color}`}>
                                {beatBadge.label}
                              </span>
                            </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveImage(idx);
                            }}
                            title="Remove image"
                            className="absolute top-1 right-1 h-5 w-5 rounded-md bg-black/80 hover:bg-red-500 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer opacity-80 group-hover:opacity-100"
                          >
                            <X size={11} />
                          </button>

                          {/* Filename caption */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1 pt-2">
                            <p className="text-[9px] text-zinc-300 truncate font-mono">{img.name}</p>
                          </div>
                        </div>
                      );
                    })}
                    </div>

                    {/* Intelligent Speech-Paced Camera Motion Banner */}
                    <div className="rounded-xl border border-white/10 bg-[#161720] p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Film size={13} className="text-[#FFA000]" />
                          <span>Intelligent Speech-Paced Camera Motion</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          ⚡ Voice-Energy Synced
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                        <div className="rounded-lg bg-black/40 border border-white/5 p-2 flex items-start gap-2">
                          <span className="text-amber-400 text-sm leading-none">⚡</span>
                          <div>
                            <p className="font-bold text-white">Excitement &amp; Punch Phrases</p>
                            <p className="text-zinc-400">Automatic dynamic punch-in zoom</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-black/40 border border-white/5 p-2 flex items-start gap-2">
                          <span className="text-blue-400 text-sm leading-none">🌊</span>
                          <div>
                            <p className="font-bold text-white">Narrative Background Context</p>
                            <p className="text-zinc-400">Gentle, slow panoramic glide</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/*  3. WIDESCREEN CINEMA CAPTIONS  */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
                  3
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Captions size={18} className="text-[#FF9100]" />
                    <span>Synchronized Speech Captions</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Clean, high-legibility captions synchronized directly with your audio narration.
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
                        ? "border-[#FF5722] bg-[#FF5722]/10 ring-1 ring-[#FF5722]"
                        : "border-white/10 bg-[#161720] hover:border-white/20"
                    }`}
                  >
                    <div className="relative aspect-[16/6] w-full rounded-xl border border-white/10 bg-slate-900 overflow-hidden flex items-center justify-center p-2 mb-2.5">
                      <div className="absolute inset-0 bg-black/60" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-black shadow-md">
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

          {/*  4. AUDIO SCORE & SOUND EFFECTS  */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF9100] text-sm font-black border border-[#FF5722]/30">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ITNAVIDEO_LIBRARY_BGM.map((track) => {
                  const active = selectedBgmTrack?.id === track.id || track.id === "wealth-building";
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => onSelectBgmTrack?.(track)}
                      className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                        active
                          ? "border-[#FF5722] bg-[#FF5722]/10 text-white font-bold ring-1 ring-[#FF5722]"
                          : "border-white/10 bg-[#161720] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-white truncate">{track.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{track.genre}  {track.mood}</p>
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
                    enableSoundEffects ? "bg-[#FF5722]" : "bg-zinc-700"
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
                  className="w-full accent-[#FF5722] cursor-pointer"
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
              <span className="rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9100]">
                19201080 Full HD
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
                <span>16:9 Cinema  Ken Burns FX</span>
              </div>
            </div>

            {/* Config Summary Badges */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Audio Duration</span>
                <span className="font-mono text-white font-bold">
                  {audioDurationSeconds > 0 ? `${audioDurationSeconds} seconds (${Math.ceil(audioDurationSeconds / 60)}m)` : "Ready for audio"}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-2">
                <span>Credit Rate</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"} (1 Min = 1 Cr)
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
              onClick={() => onStartRender?.()}
              disabled={isRendering}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-black text-black shadow-xl transition-all duration-200 ${
                isRendering
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              <Sparkles size={18} className="fill-black/20" />
              <span>{isRendering ? "Rendering 1080p MP4..." : "Generate Video"}</span>
              <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-xs font-mono font-bold">
                {calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar (Always Available on Phones) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-[#09090B]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-[#FFA000] tracking-wider truncate">
            {selectedAudio ? (topicTitle || selectedAudio.name) : "16:9 Cinema Story"}
          </p>
          <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5">
            <span className="text-emerald-400 font-mono font-bold">{calculatedCredits} {calculatedCredits === 1 ? "Credit" : "Credits"}</span>
            <span>•</span>
            <span>{selectedAudio ? (audioDurationSeconds > 0 ? `${audioDurationSeconds}s` : "Audio Loaded") : "Up to 5m"}</span>
          </p>
        </div>
        
        {selectedAudio ? (
          <button
            type="button"
            onClick={() => onStartRender?.()}
            disabled={isRendering}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF5722]/30 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles size={14} className="fill-black/20" />
            <span>{isRendering ? "Rendering..." : "Generate Video"}</span>
          </button>
        ) : (
          <label
            htmlFor="itna-audio-file-input"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF5722]/30 active:scale-95 cursor-pointer"
          >
            <Upload size={14} />
            <span>Upload Audio</span>
          </label>
        )}
      </div>
    </div>
  );
}
