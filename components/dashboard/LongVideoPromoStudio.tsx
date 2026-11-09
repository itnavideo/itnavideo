"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Check,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Tv,
  X,
  FileText,
  Volume2,
  VolumeX,
  Sliders,
  Layers,
  Zap,
  Film,
  Eye,
  Video,
  Image as ImageIcon,
  CheckCheck,
  Edit3,
  Lock,
  ChevronLeft,
  ChevronRight,
  Music,
  ArrowRight,
  Search,
  Type,
  Youtube,
  Radio,
  ExternalLink,
  ArrowUp,
  MousePointerClick,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

export const PROMO_STEPS = [
  { step: 1, title: "Upload", desc: "Clip & 16:9 Thumbnail" },
  { step: 2, title: "Music", desc: "Soundtrack & SFX" },
  { step: 3, title: "Style", desc: "Captions & CTA Button" },
  { step: 4, title: "Preview", desc: "9:16 Shorts Simulator" },
] as const;

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

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (val: boolean) => void;
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
  removeAiWatermark = false,
  onRemoveAiWatermarkChange,
}: LongVideoPromoStudioProps) {
  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Thumbnail State
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

  // Thumbnail Local Preview URL
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

  // Video Local Preview URL & Duration
  const [videoLocalUrl, setVideoLocalUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoLocalUrl(url);
      const v = document.createElement("video");
      v.src = url;
      v.onloadedmetadata = () => {
        setVideoDuration(Math.round(v.duration || 0));
      };
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoLocalUrl("");
      setVideoDuration(0);
    }
  }, [selectedFile]);

  // Caption Styles Filter
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>("All");
  const [captionSearch, setCaptionSearch] = useState<string>("");

  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((style) => {
      const matchesCategory = captionCategoryTab === "All" || style.category === captionCategoryTab;
      const matchesSearch =
        style.name.toLowerCase().includes(captionSearch.toLowerCase()) ||
        style.description.toLowerCase().includes(captionSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [captionCategoryTab, captionSearch]);

  // Audio / BGM Auditioning
  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const audioAuditionRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: LibraryBgmTrack) => {
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
      const audioUrl = getBgmTrackAudioUrl(track);
      const audio = new window.Audio(audioUrl);
      audio.volume = Math.max(0.05, Math.min(1, (bgmVolume || 0.12) * 2));
      audio.play().catch(() => { });
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

  // CTA Text Fallbacks
  const displayCtaText = promoCtaText?.trim() || "Watch the full video";
  const displayCreatorHandle = promoCreatorHandle?.trim() || "@creator";

  // Compulsory Live Preview Gate
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);

  // Verification whether ready to generate
  const hasThumbnail = Boolean(promoThumbnailFile || (activeThumbMode === "youtube" && activeYoutubeUrl));
  const hasVideo = Boolean(selectedFile);
  const isReadyToRender = hasThumbnail && hasVideo;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
      {/* ── ROW 1: STUDIO HEADER & 4-STEP STEPPER BAR ── */}
      <div className="border-b border-slate-200/90 bg-white px-4 sm:px-8 py-3.5 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Studio Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Tv size={18} className="text-orange-600" />
                Long Video Promo Studio
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
                <Sparkles size={11} className="text-orange-600" />
                9:16 Vertical Promo
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Convert any long YouTube video or podcast into a high-converting teaser reel driving clicks to the full video.
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 self-center sm:self-auto overflow-x-auto no-scrollbar py-0.5">
            {PROMO_STEPS.map((step) => {
              const isActive = currentStep === step.step;
              const isDone =
                (step.step === 1 && hasThumbnail && hasVideo) ||
                (step.step === 2 && Boolean(bgmTrackId)) ||
                (step.step === 3 && Boolean(captionStyle)) ||
                currentStep > step.step;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setCurrentStep(step.step)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${isActive
                      ? "bg-orange-600 text-white shadow-xs"
                      : isDone
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                        : "bg-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <span
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-black ${isActive
                        ? "bg-white text-orange-600"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {isDone && !isActive ? <Check size={10} strokeWidth={3} /> : step.step}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Pricing Allowance Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
              <Zap size={13} className="text-orange-600 fill-orange-600" />
              1 Credit / Video • Up to 90s
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: STEP CONTENT (SCROLLABLE WORKSPACE) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ──────────────── STEP 1: UPLOAD THUMBNAIL & VIDEO CLIP ──────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Section 1A: 16:9 Thumbnail Image */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        1. 16:9 Thumbnail Image (Cover)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload your 16:9 thumbnail or paste a YouTube URL for automatic extraction
                      </p>
                    </div>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setThumbMode("upload")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${activeThumbMode === "upload"
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbMode("youtube")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${activeThumbMode === "youtube"
                          ? "bg-white text-red-600 shadow-2xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      <Youtube size={13} className="text-red-600" />
                      <span>YouTube URL</span>
                    </button>
                  </div>
                </div>

                {/* Upload Mode Dropzone */}
                {activeThumbMode === "upload" && (
                  <div className="space-y-3">
                    {promoThumbnailFile ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/50 p-4">
                        <div className="flex items-center gap-3">
                          {thumbLocalUrl && (
                            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                              <Image
                                src={thumbLocalUrl}
                                alt="Thumbnail preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900">{promoThumbnailFile.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {(promoThumbnailFile.size / (1024 * 1024)).toFixed(1)} MB • 16:9 Thumbnail Ready
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onPromoThumbnailFileChange(null)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400 p-8 text-center transition cursor-pointer">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drop your 16:9 thumbnail image
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WebP up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onPromoThumbnailFileChange(file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* YouTube URL Mode */}
                {activeThumbMode === "youtube" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Youtube
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none"
                        />
                        <input
                          type="url"
                          value={activeYoutubeUrl}
                          onChange={(e) => handleYoutubeChange(e.target.value)}
                          placeholder="Paste YouTube link (e.g. https://youtube.com/watch?v=...)"
                          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {thumbLocalUrl && (
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50/50 p-3">
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                          <Image
                            src={thumbLocalUrl}
                            alt="Extracted thumbnail"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                            <Check size={10} /> MaxRes Thumbnail Extracted
                          </span>
                          <p className="text-[11px] text-slate-600 font-mono mt-1 truncate max-w-sm">
                            {activeYoutubeUrl}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 1B: Teaser Video Clip Dropzone */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                    <Film size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      2. Teaser Video Clip (Up to 90s)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload the highlight hook clip to show in the promo preview
                    </p>
                  </div>
                </div>

                {selectedFile ? (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Film size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Duration:{" "}
                            <span className="font-bold text-slate-800">{videoDuration}s</span> (max 90s)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectFile(null)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    {videoLocalUrl && (
                      <div className="rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video max-h-48 flex items-center justify-center">
                        <video
                          src={videoLocalUrl}
                          controls
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400 p-8 text-center transition cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                      <Film size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drop your promo teaser video
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">MP4, MOV, or WEBM up to 90 seconds</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onSelectFile(file);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Section 1C: Video Title & Creator Handle */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Full Video Title (Headline)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={promoTitle}
                      onChange={(e) => onPromoTitleChange(e.target.value)}
                      placeholder="e.g. How I Built a $10k/mo Business in 60 Days"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Displayed on the promo reel header • {promoTitle.length}/80
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Creator Channel / Handle
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={promoCreatorHandle}
                      onChange={(e) => onPromoCreatorHandleChange(e.target.value)}
                      placeholder="e.g. @YourChannel"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Displayed alongside the call-to-action button
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  <span>Next: Music &amp; Audio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: MUSIC & SOUND DESIGN ──────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Background Music &amp; Sound Design</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a background soundtrack from the curated cloud library or upload custom audio.
                  </p>
                </div>

                {/* AWS S3 Track Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AWS_BGM_TRACKS.map((track) => {
                    const isSelected = (bgmTrackId || "parasail") === track.id;
                    const isAuditioning = auditioningTrack === track.id;

                    return (
                      <div
                        key={track.id}
                        className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${isSelected
                            ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60"
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                              {track.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-orange-600">
                                <Check size={12} strokeWidth={3} /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{track.label}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{track.desc}</p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/60">
                          {track.path !== "none" ? (
                            <button
                              type="button"
                              onClick={() => toggleAudition(track)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${isAuditioning
                                  ? "bg-orange-600 text-white"
                                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                              {isAuditioning ? <Pause size={12} /> : <Play size={12} />}
                              <span>{isAuditioning ? "Stop" : "Preview"}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Pure Speech</span>
                          )}

                          <button
                            type="button"
                            onClick={() => onBgmTrackIdChange?.(track.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${isSelected
                                ? "bg-orange-600 text-white"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                          >
                            {isSelected ? "Active" : "Select"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ducked Volume Slider */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800">
                        BGM Volume: <span className="text-orange-600 font-mono">{Math.round((bgmVolume ?? 0.12) * 100)}%</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Default: 12% (Speech Ducking)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={bgmVolume ?? 0.12}
                      onChange={(e) => onBgmVolumeChange?.(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Viral Hook SFX Transitions</p>
                      <p className="text-[11px] text-slate-500">Subtle whoosh sound effects on title and thumbnail reveal</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSfx}
                      onChange={(e) => onEnableSfxChange?.(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                  >
                    <span>Next: Style &amp; CTA</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: CAPTIONS & CTA STYLING ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Background Theme Mode */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Canvas Backdrop Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "blur", title: "Ambient Blur", desc: "Dynamic cinematic blur of the source video" },
                    { id: "solid", title: "Charcoal Solid", desc: "Deep dark studio backdrop with high contrast" },
                    { id: "white", title: "White Studio", desc: "Clean modern white editorial background" },
                  ].map((m) => {
                    const isBg = (promoBackgroundMode || "blur") === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onPromoBackgroundModeChange?.(m.id as any)}
                        className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${isBg
                            ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                          }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{m.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button Settings */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Call-to-Action (CTA) Pill</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={promoCtaText}
                      onChange={(e) => onPromoCtaTextChange?.(e.target.value)}
                      placeholder="Watch the full video"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Default: &quot;Watch the full video • Link in bio&quot;
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Button Color Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "youtube-red", label: "YouTube Red", bg: "bg-red-600 text-white" },
                        { id: "emerald", label: "Emerald Green", bg: "bg-emerald-600 text-white" },
                        { id: "glass", label: "Obsidian Glass", bg: "bg-slate-900 text-white" },
                        { id: "tiktok-yellow", label: "TikTok Yellow", bg: "bg-yellow-400 text-slate-950 font-black" },
                      ].map((s) => {
                        const isStyle = (promoCtaStyle || "youtube-red") === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onPromoCtaStyleChange?.(s.id as any)}
                            className={`rounded-xl border p-2 text-center text-xs font-bold transition cursor-pointer ${isStyle
                                ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                          >
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${s.bg}`}>
                              {s.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 32 Caption Styles Selector */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">32 Animated Kinetic Caption Styles</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subtitles will animate synced to spoken words in the teaser clip
                    </p>
                  </div>

                  {/* Search Filter */}
                  <div className="relative w-full sm:w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearch}
                      onChange={(e) => setCaptionSearch(e.target.value)}
                      placeholder="Search style..."
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {["All", "Hormozi", "Minimal", "Neon & Glow", "Dynamic", "Cinematic", "Comic & Pop"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionCategoryTab(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${captionCategoryTab === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 32 Styles Grid with Live Word Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1 no-scrollbar">
                  {filteredCaptionStyles.map((style) => {
                    const isSelected = (captionStyle || "Pop Word") === style.name;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onCaptionStyleChange?.(style.name)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${isSelected
                            ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[85%]">
                            {style.name}
                          </span>
                          {isSelected && <Check size={12} className="text-orange-600 shrink-0" strokeWidth={3} />}
                        </div>

                        {/* Animated Sample Word Preview */}
                        <div className="my-auto py-1 flex items-center justify-center">
                          {renderPreviewCaptionWords(style)}
                        </div>

                        <span className="text-[9px] text-slate-400 truncate">{style.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  ← Back to Music
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                >
                  <span>Next: Live Simulator</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: LIVE 9:16 PREVIEW SIMULATOR & RENDER ──────────────── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Live 9:16 Vertical Promo Simulator</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review the exact stacked 3D thumbnail card, teaser player, and CTA button before cloud rendering.
                    </p>
                  </div>

                  {/* Watermark Toggle */}
                  {onRemoveAiWatermarkChange && (
                    <WatermarkRemoverToggle
                      removeAiWatermark={removeAiWatermark}
                      onRemoveAiWatermarkChange={onRemoveAiWatermarkChange}
                      variant="inline"
                    />
                  )}
                </div>

                {/* 9:16 Vertical Phone Mockup Simulator */}
                <div className="flex justify-center py-4">
                  <div className="relative w-72 h-[520px] rounded-[36px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
                    {/* Simulated Background */}
                    {thumbLocalUrl && promoBackgroundMode === "blur" && (
                      <div className="absolute inset-0 z-0 opacity-25 filter blur-xl scale-125">
                        <Image src={thumbLocalUrl} alt="Backdrop" fill className="object-cover" unoptimized />
                      </div>
                    )}

                    {/* Phone Notch */}
                    <div className="relative z-10 mx-auto h-4 w-24 rounded-full bg-slate-900 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                    </div>

                    {/* Stacked Element 1: 16:9 Thumbnail 3D Card with "FULL VIDEO" Badge */}
                    <div className="relative z-10 w-full mt-2 space-y-1">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-slate-900">
                        {thumbLocalUrl ? (
                          <Image src={thumbLocalUrl} alt="Thumbnail" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                            <ImageIcon size={20} className="mb-1" />
                            <span>No Thumbnail</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 rounded-md bg-red-600/90 text-white font-black text-[9px] px-1.5 py-0.5 shadow-xs">
                          FULL VIDEO
                        </span>
                      </div>
                      <p className="text-[11px] font-black text-white truncate px-1">
                        {promoTitle || "Your Full Video Title Here"}
                      </p>
                    </div>

                    {/* Stacked Element 2: Teaser Video Player with "PREVIEW" Chip & Captions */}
                    <div className="relative z-10 w-full my-auto space-y-1">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black flex items-center justify-center">
                        {videoLocalUrl ? (
                          <video src={videoLocalUrl} className="h-full w-full object-cover" autoPlay muted loop />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500 text-xs">
                            <Film size={20} className="mb-1" />
                            <span>No Teaser Video</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 rounded-md bg-blue-600/90 text-white font-black text-[9px] px-1.5 py-0.5 shadow-xs">
                          PREVIEW
                        </span>

                        {/* Animated Caption Strip Overlay */}
                        <div className="absolute bottom-2 inset-x-2 text-center">
                          <span className="inline-block rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-black text-yellow-300 shadow-xs">
                            {captionStyle || "Pop Word"} Captions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stacked Element 3: Animated Up-Arrow & Dynamic CTA Pill */}
                    <div className="relative z-10 w-full mb-2 flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-white/80 animate-bounce">
                        <ArrowUp size={12} className="text-orange-400" />
                        <span>Watch now</span>
                      </div>

                      <div
                        className={`w-full py-2 px-3 rounded-xl shadow-lg flex items-center justify-between text-center ${promoCtaStyle === "emerald"
                            ? "bg-emerald-600 text-white"
                            : promoCtaStyle === "glass"
                              ? "bg-white/10 backdrop-blur-md text-white border border-white/20"
                              : promoCtaStyle === "tiktok-yellow"
                                ? "bg-yellow-400 text-slate-950 font-black"
                                : "bg-red-600 text-white"
                          }`}
                      >
                        <div className="text-left">
                          <p className="text-[10px] font-black leading-tight truncate">{displayCtaText}</p>
                          <p className="text-[9px] opacity-80 leading-tight">Link in bio</p>
                        </div>
                        <span className="text-[9px] font-bold opacity-75">{displayCreatorHandle}</span>
                      </div>
                    </div>

                    {/* Phone Bottom Pill Indicator */}
                    <div className="relative z-10 mx-auto h-1 w-20 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* Review Gate Confirmation Checkbox */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={previewConfirmed}
                      onChange={(e) => setPreviewConfirmed(e.target.checked)}
                      className="h-4 w-4 rounded accent-orange-600 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        I have reviewed this 9:16 vertical promo layout and approve cloud rendering
                      </p>
                      <p className="text-[11px] text-slate-500">
                        AWS Remotion Lambda will render a 1080×1920 30 FPS MP4 with ducked background music and animated captions.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Cloud Render Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Style
                  </button>

                  <button
                    type="button"
                    disabled={!isReadyToRender || !previewConfirmed || isGenerating}
                    onClick={onGenerate}
                    className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-8 text-xs font-black text-white shadow-md shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Submitting Render Job...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="transition group-hover:rotate-12" />
                        <span>Render Promo Video (1 Credit)</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
