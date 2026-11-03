"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Video,
  ArrowRight,
  Clock3,
  Film,
  Check,
  Palette,
  Sliders,
  Tv,
  Clock,
  ShieldCheck,
  Loader2,
  Play,
  Pause,
  Image as ImageIcon,
  Youtube,
  Music,
  Volume2,
  FileText,
  Eye,
  AlertCircle,
  X,
  Lock,
  Layers,
  Wand2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { KINETIC_STYLES, type KineticStyleDefinition } from "@/lib/captions/kineticStyles";

// Slice the top 20 curated kinetic styles for Long Video Promo
export const PROMO_CAPTION_STYLES: KineticStyleDefinition[] = KINETIC_STYLES.slice(0, 20);

// Curated AWS S3 Production Background Music Tracks
export const AWS_PROMO_BGM_TRACKS = [
  { id: "parasail", label: "Calm Lofi (Recommended)", category: "Lo-Fi", path: "assets/reusable/music/parasail-silent-partner.mp3", desc: "Warm acoustic lofi guitar" },
  { id: "19th-floor", label: "Deep Focus & Ambient", category: "Piano", path: "assets/reusable/music/19th-floor-bobby-richards.mp3", desc: "Inspiring subtle piano tone" },
  { id: "dutty-vibe", label: "Optimistic Beat", category: "Upbeat", path: "assets/reusable/music/dutty-vibe-tracks.mp3", desc: "Gentle positive acoustic rhythm" },
  { id: "book-rental", label: "Energetic Narrative", category: "Story", path: "assets/reusable/music/book-the-rental-wit-it-rage.mp3", desc: "Dynamic narrative flow" },
  { id: "crimson-fly", label: "Cinematic Drama", category: "Cinematic", path: "assets/reusable/music/crimson-fly-huma-huma.mp3", desc: "Emotional documentary drive" },
  { id: "crock-pot", label: "Funky Chill Groove", category: "Chill", path: "assets/reusable/music/crock-pot-diamond-ortiz.mp3", desc: "Playful lofi pulse" },
  { id: "illusions", label: "Modern Swagger Beat", category: "Beats", path: "assets/reusable/music/illusions-anno-domini-beats.mp3", desc: "Modern high-production beat" },
  { id: "not-for-nothing", label: "Lounge Instrumental", category: "Lounge", path: "assets/reusable/music/not-for-nothing-otis-mcdonald.mp3", desc: "Smooth brass & relaxed tempo" },
  { id: "something-going", label: "Philosophical Mystery", category: "Deep", path: "assets/reusable/music/something-is-going-on-godmode.mp3", desc: "Pensive intrigue & discovery" },
  { id: "bar-scene", label: "Acoustic Folk Narrative", category: "Acoustic", path: "assets/reusable/music/that-one-bar-scene-rkvc.mp3", desc: "Warm acoustic guitar storytelling" },
  { id: "true-messiah", label: "Victorious Inspiration", category: "Epic", path: "assets/reusable/music/true-messiah-dj-freedem.mp3", desc: "Triumphant motivational melody" },
  { id: "vishnu", label: "Zen Reflection", category: "Zen", path: "assets/reusable/music/vishnu-patrick-patrikios.mp3", desc: "Serene ambient meditation" },
  { id: "what-it-is", label: "Smooth Motown", category: "Motown", path: "assets/reusable/music/what-it-is-silent-partner.mp3", desc: "Catchy positive baseline" },
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure video audio only" },
];

export function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function getYoutubeThumbnail(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

export type LongVideoPromoGoal = "watch-full-video" | "subscribers" | "promote-episode";

export interface LongVideoPromoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  promoThumbnailFile: File | null;
  onPromoThumbnailFileChange: (file: File | null) => void;

  youtubeUrl?: string;
  onYoutubeUrlChange?: (val: string) => void;

  thumbnailMode?: "upload" | "youtube";
  onThumbnailModeChange?: (mode: "upload" | "youtube") => void;

  promoTitle: string;
  onPromoTitleChange: (val: string) => void;

  promoGoal?: LongVideoPromoGoal;
  onPromoGoalChange?: (val: LongVideoPromoGoal) => void;

  promoCreatorHandle: string;
  onPromoCreatorHandleChange: (val: string) => void;

  promoCtaText?: string;
  onPromoCtaTextChange?: (val: string) => void;

  promoCtaStyle?: "youtube-red" | "emerald" | "glass" | "tiktok-yellow";
  onPromoCtaStyleChange?: (val: "youtube-red" | "emerald" | "glass" | "tiktok-yellow") => void;

  promoBackgroundMode?: "blur" | "solid" | "white";
  onPromoBackgroundModeChange?: (val: "blur" | "solid" | "white") => void;

  captionStyle?: string;
  onCaptionStyleChange?: (val: string) => void;

  bgmTrackId?: string;
  onBgmTrackIdChange?: (val: string) => void;

  bgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;

  enableSfx?: boolean;
  onEnableSfxChange?: (val: boolean) => void;

  editorialTranscript?: string;
  onEditorialTranscriptChange?: (val: string) => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export function LongVideoPromoStudio({
  selectedFile,
  onSelectFile,
  promoThumbnailFile,
  onPromoThumbnailFileChange,
  youtubeUrl = "",
  onYoutubeUrlChange,
  thumbnailMode = "upload",
  onThumbnailModeChange,
  promoTitle,
  onPromoTitleChange,
  promoGoal = "watch-full-video",
  onPromoGoalChange,
  promoCreatorHandle,
  onPromoCreatorHandleChange,
  promoCtaText = "",
  onPromoCtaTextChange,
  promoCtaStyle = "youtube-red",
  onPromoCtaStyleChange,
  promoBackgroundMode = "blur",
  onPromoBackgroundModeChange,
  captionStyle = "Pop Word",
  onCaptionStyleChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile = null,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript = "",
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
}: LongVideoPromoStudioProps) {
  // Local state fallbacks
  const [internalThumbMode, setInternalThumbMode] = useState<"upload" | "youtube">(thumbnailMode);
  const activeThumbMode = thumbnailMode || internalThumbMode;
  const setThumbMode = (m: "upload" | "youtube") => {
    setInternalThumbMode(m);
    if (onThumbnailModeChange) onThumbnailModeChange(m);
  };

  const [internalYoutubeUrl, setInternalYoutubeUrl] = useState<string>(youtubeUrl);
  const activeYoutubeUrl = youtubeUrl || internalYoutubeUrl;
  const handleYoutubeChange = (val: string) => {
    setInternalYoutubeUrl(val);
    if (onYoutubeUrlChange) onYoutubeUrlChange(val);
  };

  const [internalGoal, setInternalGoal] = useState<LongVideoPromoGoal>(promoGoal || "watch-full-video");
  const currentGoal = promoGoal || internalGoal;
  const handleGoalSelect = (goal: LongVideoPromoGoal) => {
    setInternalGoal(goal);
    if (onPromoGoalChange) onPromoGoalChange(goal);
  };

  const [internalCtaStyle, setInternalCtaStyle] = useState<"youtube-red" | "emerald" | "glass" | "tiktok-yellow">(promoCtaStyle);
  const activeCtaStyle = promoCtaStyle || internalCtaStyle;
  const handleCtaStyleSelect = (style: "youtube-red" | "emerald" | "glass" | "tiktok-yellow") => {
    setInternalCtaStyle(style);
    if (onPromoCtaStyleChange) onPromoCtaStyleChange(style);
  };

  const [internalBgMode, setInternalBgMode] = useState<"blur" | "solid" | "white">(promoBackgroundMode);
  const activeBgMode = promoBackgroundMode || internalBgMode;
  const handleBgModeSelect = (mode: "blur" | "solid" | "white") => {
    setInternalBgMode(mode);
    if (onPromoBackgroundModeChange) onPromoBackgroundModeChange(mode);
  };

  // Caption Styles state
  const [internalCaptionStyle, setInternalCaptionStyle] = useState<string>(captionStyle);
  const activeCaptionStyle = captionStyle || internalCaptionStyle;
  const handleCaptionStyleSelect = (st: string) => {
    setInternalCaptionStyle(st);
    if (onCaptionStyleChange) onCaptionStyleChange(st);
  };
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");

  // Filtered caption styles
  const filteredCaptionStyles = useMemo(() => {
    if (captionCategoryTab === "All") return PROMO_CAPTION_STYLES;
    return PROMO_CAPTION_STYLES.filter((s) => s.category === captionCategoryTab);
  }, [captionCategoryTab]);

  // Audio / BGM audition state
  const [internalBgmTrack, setInternalBgmTrack] = useState<string>(bgmTrackId);
  const activeBgmTrack = bgmTrackId || internalBgmTrack;
  const handleBgmTrackSelect = (id: string) => {
    setInternalBgmTrack(id);
    if (onBgmTrackIdChange) onBgmTrackIdChange(id);
  };

  const [internalBgmVolume, setInternalBgmVolume] = useState<number>(bgmVolume);
  const activeBgmVolume = typeof bgmVolume === "number" ? bgmVolume : internalBgmVolume;
  const handleVolumeChange = (vol: number) => {
    setInternalBgmVolume(vol);
    if (onBgmVolumeChange) onBgmVolumeChange(vol);
  };

  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: typeof AWS_PROMO_BGM_TRACKS[0]) => {
    if (track.path === "none") return;
    if (auditioningTrack === track.id) {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
      setAuditioningTrack(null);
    } else {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
      }
      const audio = new window.Audio(`https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/${track.path}`);
      audio.volume = Math.max(0.05, Math.min(1, activeBgmVolume * 2));
      audio.play().catch(() => {});
      audio.onended = () => setAuditioningTrack(null);
      audioAuditionRef.current = audio;
      setAuditioningTrack(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioAuditionRef.current) {
        audioAuditionRef.current.pause();
        audioAuditionRef.current = null;
      }
    };
  }, []);

  // Thumbnail preview URL
  const [thumbLocalUrl, setThumbLocalUrl] = useState<string>("");
  useEffect(() => {
    if (activeThumbMode === "upload" && promoThumbnailFile) {
      const url = URL.createObjectURL(promoThumbnailFile);
      setThumbLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (activeThumbMode === "youtube" && activeYoutubeUrl) {
      const ytThumb = getYoutubeThumbnail(activeYoutubeUrl);
      setThumbLocalUrl(ytThumb || "");
    } else {
      setThumbLocalUrl("");
    }
  }, [promoThumbnailFile, activeThumbMode, activeYoutubeUrl]);

  // Video preview URL
  const [videoLocalUrl, setVideoLocalUrl] = useState<string>("");
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoLocalUrl("");
    }
  }, [selectedFile]);

  // Compulsory Live Preview Gate state
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // File drop / select handlers
  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm)$/i))) {
      onSelectFile(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
  };

  const handleThumbDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onPromoThumbnailFileChange(file);
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPromoThumbnailFileChange(file);
  };

  // Video duration reader
  const [videoDuration, setVideoDuration] = useState<number>(0);
  useEffect(() => {
    if (!selectedFile) {
      setVideoDuration(0);
      return;
    }
    const v = document.createElement("video");
    const u = URL.createObjectURL(selectedFile);
    v.src = u;
    v.onloadedmetadata = () => {
      setVideoDuration(Math.round(v.duration || 0));
      URL.revokeObjectURL(u);
    };
    v.onerror = () => URL.revokeObjectURL(u);
  }, [selectedFile]);

  const isReadyToRender = Boolean(selectedFile && (promoThumbnailFile || (activeThumbMode === "youtube" && activeYoutubeUrl)));

  return (
    <div className="w-full space-y-8">
      {/* Top Banner: Crisp White Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-700">
              <Tv size={13} className="text-orange-600" />
              <span>9:16 Vertical Promo Reel • Traffic Booster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
              Long Video Promo Studio
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              Turn any long YouTube video, podcast, or lecture into a high-converting 9:16 vertical teaser reel with stacked thumbnail card, dynamic title, teaser clip, and call-to-action button.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Render Cost</span>
              <span className="text-base font-black text-slate-900">1 Credit / Video</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (2 Cols) | Right 9:16 Live Preview (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Thumbnail Source (Upload or YouTube Auto-Extract) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">1. 16:9 Thumbnail Image</h3>
                  <p className="text-xs text-slate-500">Upload your cover image or paste YouTube link for automatic extraction</p>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setThumbMode("upload")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    activeThumbMode === "upload"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setThumbMode("youtube")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                    activeThumbMode === "youtube"
                      ? "bg-white text-red-600 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Youtube size={13} />
                  <span>YouTube URL</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Mode 1: File Upload */}
            {activeThumbMode === "upload" ? (
              <div>
                {promoThumbnailFile ? (
                  <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {thumbLocalUrl && (
                        <div className="relative h-14 w-24 rounded-lg overflow-hidden border border-emerald-300 bg-slate-900">
                          <img src={thumbLocalUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{promoThumbnailFile.name}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">16:9 Thumbnail loaded</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPromoThumbnailFileChange(null)}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 hover:border-red-200 transition"
                      title="Remove thumbnail"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleThumbDrop}
                    className="relative rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/20 p-6 text-center transition cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleThumbSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs text-orange-600">
                        <Upload size={18} />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Drop 16:9 cover image here, or <span className="text-orange-600 underline">browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400">Recommended 1280×720 PNG, JPG, or WebP</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Thumbnail Mode 2: YouTube Link Automatic Extraction */
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-500">
                    <Youtube size={18} />
                  </div>
                  <input
                    type="url"
                    value={activeYoutubeUrl}
                    onChange={(e) => handleYoutubeChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-red-500 focus:outline-none transition shadow-2xs"
                  />
                </div>

                {/* Auto Extracted Thumbnail Feedback */}
                {activeYoutubeUrl && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                    {thumbLocalUrl ? (
                      <div className="relative h-14 w-24 rounded-lg overflow-hidden border border-slate-300 bg-black shrink-0">
                        <img src={thumbLocalUrl} alt="YouTube thumbnail" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-14 w-24 rounded-lg border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <AlertCircle size={16} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {thumbLocalUrl ? "YouTube MaxRes Thumbnail Detected" : "Enter a valid YouTube video URL"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {thumbLocalUrl ? "Auto-synced into 9:16 top card" : "Example: https://youtu.be/dQw4w9WgXcQ"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Upload Promo Video Clip */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                <Film size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">2. Promo Teaser Clip (Up to 90s)</h3>
                <p className="text-xs text-slate-500">The actual teaser moment from your video (MP4, MOV, or WEBM)</p>
              </div>
            </div>

            {selectedFile ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
                    <Video size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {videoDuration > 0 ? `${videoDuration}s duration` : "Ready"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectFile(null)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 hover:border-red-200 transition"
                  title="Remove video"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleVideoDrop}
                className="relative rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/20 p-6 text-center transition cursor-pointer"
              >
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleVideoSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs text-orange-600">
                    <Video size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Drop teaser video clip here, or <span className="text-orange-600 underline">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Horizontal or vertical clips up to 90 seconds (1080p MP4)</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Promo Details (Title, Handle, Goal, CTA Style) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                <Tv size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">3. Title & Traffic Conversion</h3>
                <p className="text-xs text-slate-500">Configure headline typography and call-to-action button</p>
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Video Headline Title</label>
                <span className="text-[11px] text-slate-400">{promoTitle.length}/80 chars</span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={promoTitle}
                onChange={(e) => onPromoTitleChange(e.target.value)}
                placeholder="e.g. How I Built a Profitable AI Business from Scratch"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
              />
            </div>

            {/* Creator Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Channel / Creator Handle</label>
                <input
                  type="text"
                  value={promoCreatorHandle}
                  onChange={(e) => onPromoCreatorHandleChange(e.target.value)}
                  placeholder="@yourchannel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Custom CTA Text Override */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Custom Button Text (Optional)</label>
                <input
                  type="text"
                  maxLength={36}
                  value={promoCtaText}
                  onChange={(e) => onPromoCtaTextChange && onPromoCtaTextChange(e.target.value)}
                  placeholder="Defaults to goal text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            {/* Promo Goal Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Promo Goal (Traffic Objective)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "watch-full-video", title: "Watch Full Video", sub: "Drives traffic to YouTube link" },
                  { id: "subscribers", title: "Channel Growth", sub: "Focuses on subscribers" },
                  { id: "promote-episode", title: "New Episode", sub: "Highlights series release" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGoalSelect(g.id as LongVideoPromoGoal)}
                    className={`rounded-xl border p-3 text-left transition ${
                      currentGoal === g.id
                        ? "border-orange-500 bg-orange-50/50 shadow-xs"
                        : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">{g.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{g.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button Style & Background Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">CTA Button Color</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "youtube-red", label: "YouTube Red", dot: "bg-red-600" },
                    { id: "emerald", label: "Emerald Green", dot: "bg-emerald-600" },
                    { id: "glass", label: "Obsidian Glass", dot: "bg-slate-900" },
                    { id: "tiktok-yellow", label: "TikTok Yellow", dot: "bg-yellow-400" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleCtaStyleSelect(s.id as any)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                        activeCtaStyle === s.id
                          ? "border-orange-500 bg-orange-50/40 text-slate-900 shadow-2xs"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${s.dot}`} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Reel Background Canvas</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "blur", label: "Ambient Blur" },
                    { id: "solid", label: "Charcoal" },
                    { id: "white", label: "White Studio" },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleBgModeSelect(bg.id as any)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                        activeBgMode === bg.id
                          ? "border-orange-500 bg-orange-50/50 text-orange-950 shadow-2xs"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 20 Standalone Kinetic Caption Styles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">4. 20 Kinetic Caption Styles</h3>
                  <p className="text-xs text-slate-500">Pick an animated typography style for speech subtitles</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Active: {activeCaptionStyle}
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
              {["All", "Single Word", "Line Captions", "Stacks", "Typewriter", "Editorial"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCaptionCategoryTab(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    captionCategoryTab === tab
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 20 Styles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCaptionStyles.map((style) => {
                const isSelected = activeCaptionStyle === style.name;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleCaptionStyleSelect(style.name)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition relative ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900 leading-tight">{style.name}</span>
                    <div className="mt-2 flex items-center justify-between w-full">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{style.category}</span>
                      {isSelected && <Check size={13} className="text-orange-600 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Background Music & Audio Controls (12% Default) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <Music size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">5. Background Music &amp; Audio Level</h3>
                  <p className="text-xs text-slate-500">Curated cloud tracks ducked to 12% so speech remains pristine</p>
                </div>
              </div>

              {/* SFX Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={enableSfx}
                  onChange={(e) => onEnableSfxChange && onEnableSfxChange(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                />
                <span className="text-xs font-bold text-slate-700">SFX Whooshes</span>
              </label>
            </div>

            {/* Volume Slider */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Volume2 size={15} className="text-orange-600" />
                  Background Music Volume
                </span>
                <span className="font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {Math.round(activeBgmVolume * 100)}% (12% Default)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={activeBgmVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>0% (Muted)</span>
                <span className="text-orange-600 font-bold">12% Voice Safe</span>
                <span>40% Loud</span>
              </div>
            </div>

            {/* Music Library & Audition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {AWS_PROMO_BGM_TRACKS.map((track) => {
                const isSelected = activeBgmTrack === track.id;
                const isPlaying = auditioningTrack === track.id;

                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleBgmTrackSelect(track.id)}
                      className="text-left min-w-0 flex-1 mr-2"
                    >
                      <p className="text-xs font-bold text-slate-900 truncate">{track.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{track.desc}</p>
                    </button>

                    {track.path !== "none" && (
                      <button
                        type="button"
                        onClick={() => toggleAudition(track)}
                        className={`p-1.5 rounded-lg border transition shrink-0 ${
                          isPlaying
                            ? "bg-orange-500 text-white border-orange-600 animate-pulse"
                            : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                        }`}
                        title={isPlaying ? "Pause preview" : "Play preview"}
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom BGM Upload */}
            <div className="pt-1">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Or Upload Custom Background Music</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-700 cursor-pointer transition shadow-2xs">
                  <Upload size={14} className="text-orange-600" />
                  <span>Choose MP3 / WAV</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onCustomBgmFileSelect) onCustomBgmFileSelect(file);
                    }}
                    className="hidden"
                  />
                </label>
                {customBgmFile && (
                  <span className="text-xs font-semibold text-emerald-700 truncate max-w-xs">
                    ✓ {customBgmFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Spoken Narration Editorial Transcript Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-sans">6. Editorial Transcript Editor</h3>
                  <p className="text-xs text-slate-500">Correct any speech transcription spelling mistakes before rendering</p>
                </div>
              </div>
            </div>

            <textarea
              rows={3}
              value={editorialTranscript}
              onChange={(e) => onEditorialTranscriptChange && onEditorialTranscriptChange(e.target.value)}
              placeholder="Paste or edit the spoken dialogue text here to fix typos, technical keywords, or brand names..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:bg-white focus:border-orange-500 focus:outline-none transition leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Right Column: Compulsory Live 9:16 Mockup Simulator & Gate (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-orange-600" />
                <h3 className="text-sm font-black text-slate-900 font-sans">Compulsory 9:16 Visual Preview</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Interactive Mockup
              </span>
            </div>

            {/* 9:16 Phone Canvas Simulator */}
            <div className="relative mx-auto w-full max-w-[310px] aspect-[9/16] rounded-[32px] border-[6px] border-slate-900 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
              {/* Simulator Background */}
              {activeBgMode === "white" ? (
                <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 pointer-events-none" />
              ) : activeBgMode === "blur" && thumbLocalUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 scale-125 pointer-events-none"
                  style={{ backgroundImage: `url(${thumbLocalUrl})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black pointer-events-none" />
              )}

              {/* TOP: 16:9 Thumbnail Levitation Card */}
              <div className="relative z-10 w-full rounded-xl overflow-hidden border border-white/20 bg-slate-900 aspect-video shadow-lg">
                {thumbLocalUrl ? (
                  <img src={thumbLocalUrl} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 gap-1 bg-slate-800/80">
                    <ImageIcon size={22} />
                    <span className="text-[10px] font-bold">16:9 Thumbnail</span>
                  </div>
                )}

                {/* Badge Top Left */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600/95 text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  FULL VIDEO
                </div>

                {/* Central Play Pulse Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* MIDDLE: Headline Title */}
              <div className="relative z-10 text-center px-1 my-1">
                <h4
                  className={`text-xs font-black tracking-tight leading-snug line-clamp-2 ${
                    activeBgMode === "white" ? "text-slate-900" : "text-white"
                  }`}
                >
                  {promoTitle || "Your YouTube Video Title Goes Here"}
                </h4>
                {promoCreatorHandle && (
                  <p className="text-[10px] font-bold text-orange-500 mt-0.5">{promoCreatorHandle}</p>
                )}
              </div>

              {/* LOWER: Video Clip Stage + Active Animated Caption */}
              <div className="relative z-10 w-full aspect-video rounded-xl overflow-hidden border border-white/20 bg-black shadow-md flex items-center justify-center">
                {videoLocalUrl ? (
                  <video src={videoLocalUrl} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                    <Film size={20} className="text-orange-500" />
                    <span className="text-[10px] font-semibold">Teaser Clip Preview</span>
                  </div>
                )}

                {/* REC Status Badge */}
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  REC
                </div>

                {/* Mock Subtitle Preview with Active Caption Style */}
                <div className="absolute bottom-2 inset-x-2 flex justify-center pointer-events-none">
                  <div className="bg-black/85 backdrop-blur-md border border-orange-500/50 rounded-lg px-2 py-0.5 text-center shadow-md">
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-tight">
                      [{activeCaptionStyle}] VIRAL MOMENT
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM: Traffic Driving CTA Pill */}
              <div className="relative z-10 text-center pt-1">
                <div
                  className={`inline-flex flex-col items-center justify-center w-full py-2 px-3 rounded-xl font-black text-xs shadow-lg transition ${
                    activeCtaStyle === "youtube-red"
                      ? "bg-red-600 text-white"
                      : activeCtaStyle === "emerald"
                      ? "bg-emerald-600 text-white"
                      : activeCtaStyle === "tiktok-yellow"
                      ? "bg-yellow-400 text-slate-900"
                      : "bg-slate-900 text-white border border-white/20"
                  }`}
                >
                  <span>{promoCtaText || (currentGoal === "subscribers" ? "SUBSCRIBE FOR MORE" : "WATCH FULL VIDEO")}</span>
                  <span className="text-[9px] font-medium opacity-85">Link in bio &amp; comments</span>
                </div>
              </div>
            </div>

            {/* Compulsory Review Checkbox Gate */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewConfirmed}
                  onChange={(e) => setPreviewConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-orange-600 focus:ring-orange-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-amber-950 leading-tight">
                  I have reviewed this 9:16 promo reel preview and approve generating the final render.
                </span>
              </label>
              <p className="text-[11px] text-amber-700 pl-6.5">
                Preview confirmation is compulsory before cloud rendering to avoid wasting credits.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={!isReadyToRender || !previewConfirmed || isGenerating}
              className={`w-full py-4 px-6 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isReadyToRender && previewConfirmed && !isGenerating
                  ? "bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.99] shadow-orange-500/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Render Job...</span>
                </>
              ) : !previewConfirmed ? (
                <>
                  <Lock size={15} />
                  <span>Confirm Preview Above to Unlock</span>
                </>
              ) : !selectedFile ? (
                <>
                  <Video size={15} />
                  <span>Upload Promo Video to Render</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Render 9:16 Promo Reel (1 Credit)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
