"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Trash2,
  RefreshCw,
  History,
  Download,
  X,
  FileVideo,
  AlertTriangle,
  Edit3,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  SUBTITLE_PRESETS,
  STYLE_CATEGORIES,
} from "@/components/ui/SubtitleStylePicker";
import type { PresetOption } from "@/components/ui/SubtitleStylePicker";
import type { CaptionSegment, WordTiming } from "@/remotion/types/subtitles";
import { TranscriptReviewModal } from "@/components/captions/TranscriptReviewModal";
import type { TranscriptDocument } from "@/lib/captions/types";

export interface AutoCaptionsStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  captionStyle: string;
  onChangeCaptionStyle: (style: string) => void;
  captionPosition: "top" | "center" | "bottom";
  onChangeCaptionPosition: (pos: "top" | "center" | "bottom") => void;
  captionFontSize: "small" | "medium" | "large" | "xlarge";
  onChangeCaptionFontSize: (size: "small" | "medium" | "large" | "xlarge") => void;
  captionTextColor: string;
  onChangeCaptionTextColor: (color: string) => void;
  captionHighlightColor: string;
  onChangeCaptionHighlightColor: (color: string) => void;
  captionBackgroundColor: string;
  onChangeCaptionBackgroundColor: (color: string) => void;
  wordClickSound: boolean;
  onChangeWordClickSound: (sound: boolean) => void;
  captionEmphasisAnimation: "bounce" | "glow" | "none";
  onChangeCaptionEmphasisAnimation: (anim: "bounce" | "glow" | "none") => void;
  spokenLanguage?: string;
  onChangeSpokenLanguage?: (lang: string) => void;
  captionLanguage?: string;
  onChangeCaptionLanguage?: (lang: string) => void;
  durationSeconds?: number;
  isRendering: boolean;
  renderProgress?: number;
  renderState?: string;
  renderMessage?: string;
  onStartRender: () => void;
  userCredits?: number;
  plannedCreditCost?: string | number;
  isFreeTrial?: boolean;
  recentRenders?: any[];
  onSelectRecentRender?: (render: any) => void;
  standalone?: boolean;
  /** Real captions array if available from transcription */
  realCaptions?: CaptionSegment[];
  onChangeRealCaptions?: (captions: CaptionSegment[]) => void;
  isTranscribing?: boolean;
  onTriggerTranscription?: () => Promise<void>;
  userId?: string;
}

const SAMPLE_DEMO_VIDEO =
  "https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4";

// 4 clean creator categories
const CATEGORIES = [
  { id: "popular", label: "🔥 Popular" },
  { id: "bold", label: "🎯 Bold" },
  { id: "minimal", label: "📐 Minimal" },
  { id: "social", label: "📱 Social" },
] as const;

// 6-8 carefully selected representative styles per category from the 70+ existing library
const CURATED_STYLES: Record<string, string[]> = {
  popular: [
    "Sharp Yellow",
    "Studio Clean",
    "Eclipse",
    "Karaoke Fill",
    "M3 Tonal Pill",
    "M3 Dynamic Chip",
  ],
  bold: [
    "One Word",
    "Bold Fire",
    "Hustle",
    "Screamer",
    "Neon Pulse",
    "Bold Highlight Strip",
  ],
  minimal: [
    "Midnight",
    "Cinematic",
    "Glass Blur",
    "Studio Clean",
    "Arctic Glow",
    "Floating Serif",
  ],
  social: [
    "Shorts Karaoke",
    "Ocean Blue",
    "Pop Candy",
    "Pill Bounce",
    "Marker Highlight",
    "Retro VHS",
  ],
};

const QUICK_COLORS = [
  { name: "Yellow", hex: "#facc15" },
  { name: "Green", hex: "#22c55e" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Coral", hex: "#f43f5e" },
  { name: "Purple", hex: "#a855f7" },
  { name: "White", hex: "#ffffff" },
];

const BACKGROUND_OPTIONS = [
  { id: "", label: "No Background" },
  { id: "#18181B", label: "Dark Pill" },
  { id: "#000000", label: "Solid Black" },
  { id: "rgba(0,0,0,0.65)", label: "Translucent Black" },
  { id: "#ffffff", label: "White Box" },
];

const LANGUAGES = [
  { code: "auto", label: "Auto-detect Speech" },
  { code: "en", label: "English (US / UK / Global)" },
  { code: "hi", label: "Hindi / Hinglish" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
  { code: "ar", label: "Arabic" },
];

export function AutoCaptionsStudio({
  selectedFile,
  onSelectFile,
  captionStyle,
  onChangeCaptionStyle,
  captionPosition,
  onChangeCaptionPosition,
  captionFontSize,
  onChangeCaptionFontSize,
  captionTextColor,
  onChangeCaptionTextColor,
  captionHighlightColor,
  onChangeCaptionHighlightColor,
  captionBackgroundColor,
  onChangeCaptionBackgroundColor,
  wordClickSound,
  onChangeWordClickSound,
  captionEmphasisAnimation,
  onChangeCaptionEmphasisAnimation,
  spokenLanguage = "auto",
  onChangeSpokenLanguage,
  durationSeconds,
  isRendering,
  renderProgress = 0,
  renderState,
  renderMessage,
  onStartRender,
  userCredits,
  plannedCreditCost,
  isFreeTrial = false,
  recentRenders = [],
  standalone = false,
  realCaptions = [],
  onChangeRealCaptions,
  isTranscribing = false,
  userId,
}: AutoCaptionsStudioProps) {
  const [activeCategory, setActiveCategory] = useState<"popular" | "bold" | "minimal" | "social">("popular");
  const [showAllStylesModal, setShowAllStylesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allStylesSearch, setAllStylesSearch] = useState("");
  const [allStylesCategoryFilter, setAllStylesCategoryFilter] = useState<string>("all");
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);

  // Video preview player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(10);
  const [videoAspect, setVideoAspect] = useState<"portrait" | "landscape" | "square">("portrait");
  const [videoBlobUrl, setVideoBlobUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Manage object URL for uploaded video
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoBlobUrl("");
    }
  }, [selectedFile]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const d = videoRef.current.duration;
      if (d && !isNaN(d)) setVideoDuration(d);
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h) {
        if (w > h * 1.2) setVideoAspect("landscape");
        else if (h > w * 1.2) setVideoAspect("portrait");
        else setVideoAspect("square");
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  // Drag & drop file upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        onSelectFile(file);
      }
    }
  };

  // Active preset config
  const currentPreset: PresetOption = SUBTITLE_PRESETS[captionStyle] || {
    key: captionStyle,
    label: captionStyle,
    style: captionStyle,
    font: "Inter, sans-serif",
    textColor: captionTextColor || "#ffffff",
    highlightColor: captionHighlightColor || "#facc15",
  };

  // Compute live caption overlay from REAL CAPTION DATA when available, fallback to demo loop if no upload
  const activeCaptionData = useMemo(() => {
    // 1. If real transcription captions exist, find matching segment & active word by real timestamps
    if (realCaptions && realCaptions.length > 0) {
      const activeSeg = realCaptions.find(
        (seg) => currentTime >= seg.start && currentTime <= seg.end
      );

      if (activeSeg) {
        let activeWordIndex = -1;
        if (activeSeg.words && activeSeg.words.length > 0) {
          activeWordIndex = activeSeg.words.findIndex(
            (w) => currentTime >= w.start && currentTime <= w.end
          );
        }

        return {
          type: "real" as const,
          words: activeSeg.words && activeSeg.words.length > 0
            ? activeSeg.words.map((w, idx) => ({
                text: w.word,
                active: idx === activeWordIndex,
              }))
            : activeSeg.text.split(" ").map((t) => ({ text: t, active: false })),
          fullText: activeSeg.text,
        };
      }
      return null;
    }

    // 2. Demo caption sequence for live sample preview
    const loopTime = currentTime % 6;
    if (loopTime < 2) {
      return {
        type: "sample" as const,
        words: [
          { text: "Turn", active: loopTime < 0.5 },
          { text: "your", active: loopTime >= 0.5 && loopTime < 0.9 },
          { text: "video", active: loopTime >= 0.9 && loopTime < 1.4 },
          { text: "into", active: loopTime >= 1.4 && loopTime < 1.8 },
        ],
        fullText: "Turn your video into",
      };
    } else if (loopTime < 4) {
      return {
        type: "sample" as const,
        words: [
          { text: "viral", active: loopTime >= 2.0 && loopTime < 2.5 },
          { text: "animated", active: loopTime >= 2.5 && loopTime < 3.2 },
          { text: "captions", active: loopTime >= 3.2 && loopTime < 4.0 },
        ],
        fullText: "viral animated captions",
      };
    } else {
      return {
        type: "sample" as const,
        words: [
          { text: "in", active: loopTime >= 4.0 && loopTime < 4.4 },
          { text: "one", active: loopTime >= 4.4 && loopTime < 4.9 },
          { text: "click", active: loopTime >= 4.9 },
        ],
        fullText: "in one click",
      };
    }
  }, [realCaptions, currentTime]);

  const activeCuratedList = CURATED_STYLES[activeCategory] || CURATED_STYLES.popular;

  const filteredAllStyles = useMemo(() => {
    let list = Object.keys(SUBTITLE_PRESETS);
    if (allStylesCategoryFilter !== "all") {
      const targetCategory = allStylesCategoryFilter.toLowerCase();
      list = list.filter((key) => {
        const cat = (CURATED_STYLES[targetCategory] || []).includes(key);
        return cat;
      });
      if (list.length === 0) list = Object.keys(SUBTITLE_PRESETS);
    }
    if (!allStylesSearch.trim()) return list;
    const q = allStylesSearch.toLowerCase();
    return list.filter((name) => name.toLowerCase().includes(q));
  }, [allStylesSearch, allStylesCategoryFilter]);

  // Document model for transcript review modal
  const transcriptDoc = useMemo<TranscriptDocument | null>(() => {
    if (!realCaptions || realCaptions.length === 0) return null;
    const rawText = realCaptions.map((s) => s.text).join(" ");
    return {
      rawTranscript: rawText,
      editedTranscript: rawText,
      segments: realCaptions.map((s, idx) => ({
        id: `seg-${idx}`,
        start: s.start,
        end: s.end,
        text: s.text,
        words: s.words || [],
      })),
      sourceDuration: durationSeconds || videoDuration,
      language: spokenLanguage || "en",
    };
  }, [realCaptions, durationSeconds, videoDuration, spokenLanguage]);

  const handleApplyEditedTranscript = (updatedDoc: TranscriptDocument) => {
    if (!onChangeRealCaptions) return;
    const updatedSegments: CaptionSegment[] = updatedDoc.segments.map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text,
      words: s.words,
    }));
    onChangeRealCaptions(updatedSegments);
  };

  return (
    <div className="mx-auto max-w-4xl min-w-0 pb-32">
      {/* ── 1. COMPACT HEADER ── */}
      <header className="sticky top-0 z-40 -mx-4 mb-5 flex items-center justify-between border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground transition hover:border-primary/40 hover:bg-muted hover:text-foreground"
            title="Back to All Tools"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-black text-foreground">Auto Captions</h1>
            <p className="text-[11px] text-muted-foreground">9:16 Viral Reels & Shorts</p>
          </div>
        </div>

        {/* Clear Projects / History navigation */}
        <div className="flex items-center gap-2">
          {recentRenders.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted active:scale-95"
            >
              <History size={14} className="text-primary" />
              <span>Projects ({recentRenders.length})</span>
            </button>
          )}

          {userCredits !== undefined && (
            <div className="flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
              <span>{isFreeTrial ? "Free Trial" : `${userCredits} Credits`}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. HERO & UPLOAD SECTION ── */}
      <section className="mb-6 space-y-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            Auto Captions
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Turn your video into professional animated captions in seconds.
          </p>
        </div>

        {/* Upload Box / Card */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onSelectFile(e.target.files[0]);
            }
          }}
        />

        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all sm:p-8 ${
              isDragging
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.01]"
                : "border-border/80 bg-card/40 hover:border-primary/60 hover:bg-card/70 shadow-sm"
            }`}
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
              <Upload size={26} />
            </div>

            <h3 className="text-base font-black text-foreground sm:text-lg">
              Upload Video
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag & drop or <span className="font-bold text-primary underline">browse files</span> from your device
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
              <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1">
                MP4 • MOV • WEBM • Up to 3 minutes
              </span>
              {plannedCreditCost ? (
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-400 font-bold">
                  Cost: {plannedCreditCost}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FileVideo size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-foreground">
                    {selectedFile.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-black text-emerald-400">
                    Ready
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  {durationSeconds ? (
                    <>
                      <span>•</span>
                      <span>
                        Length: <strong className="text-foreground">{Math.round(durationSeconds)}s</strong> ({Math.floor(durationSeconds / 60)}:{(Math.round(durationSeconds % 60)).toString().padStart(2, "0")})
                      </span>
                    </>
                  ) : null}
                  {plannedCreditCost ? (
                    <>
                      <span>•</span>
                      <span className="font-bold text-primary">
                        Cost: {plannedCreditCost}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
              {transcriptDoc && (
                <button
                  type="button"
                  onClick={() => setShowTranscriptEditor(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                >
                  <Edit3 size={13} />
                  <span>Edit Captions</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                title="Remove Video"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Warning if landscape video uploaded */}
        {selectedFile && videoAspect === "landscape" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Uploaded video is Landscape (16:9)</p>
              <p className="mt-0.5 text-[11px] opacity-90">
                Auto Captions works best for 9:16 vertical reels. For 16:9 YouTube videos, check out YouTube Subtitle Generator!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── 3. CAPTION STYLE SELECTOR ── */}
      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              Caption Style
            </h3>
            <p className="text-xs text-muted-foreground">Choose a typography aesthetic</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllStylesModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-primary transition hover:underline"
          >
            <span>View all styles</span>
            <span>→</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 6-8 Curated Styles Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
          {activeCuratedList.map((styleKey) => {
            const isSelected = captionStyle === styleKey;
            const preset = SUBTITLE_PRESETS[styleKey] || {
              label: styleKey,
              textColor: "#ffffff",
              highlightColor: "#facc15",
            };

            return (
              <button
                key={styleKey}
                type="button"
                onClick={() => onChangeCaptionStyle(styleKey)}
                className={`group relative flex flex-col items-center justify-between rounded-xl border p-2.5 text-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/40 scale-[1.02]"
                    : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                {/* Mini Visual Typography Preview Box */}
                <div
                  className="mb-2 flex h-14 w-full items-center justify-center rounded-lg border border-black/40 bg-zinc-950 px-1 py-1"
                  style={{
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  <span
                    className="truncate text-[11px] font-black tracking-tight"
                    style={{
                      color: isSelected ? captionHighlightColor || preset.highlightColor : preset.textColor,
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {styleKey.split(" ")[0]}
                  </span>
                </div>

                <div className="flex w-full items-center justify-between px-0.5">
                  <span className="truncate text-[11px] font-bold text-foreground">
                    {preset.label || styleKey}
                  </span>
                  {isSelected && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 4. LIVE 9:16 INTERACTIVE PREVIEW ── */}
      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              Live Preview
            </h3>
            <p className="text-xs text-muted-foreground">
              {realCaptions.length > 0
                ? "Synchronized with your uploaded video transcript"
                : `Real-time preview with ${currentPreset.label || captionStyle} style`}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              type="button"
              onClick={restartVideo}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Restart Preview"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 9:16 Phone Player Container */}
        <div
          className="relative mx-auto flex max-w-[280px] sm:max-w-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-black shadow-2xl"
          style={{ aspectRatio: "9 / 16" }}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            src={videoBlobUrl || SAMPLE_DEMO_VIDEO}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="h-full w-full object-cover"
          />

          {/* Video Overlay Scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

          {/* Dynamic Captions Render in Live Preview using Real/Sample Data */}
          {activeCaptionData && (
            <div
              className={`pointer-events-none absolute inset-x-3 flex items-center justify-center text-center transition-all ${
                captionPosition === "top"
                  ? "top-12"
                  : captionPosition === "center"
                  ? "top-1/2 -translate-y-1/2"
                  : "bottom-14"
              }`}
            >
              <div
                className={`max-w-full rounded-xl px-3 py-1.5 transition-all ${
                  captionBackgroundColor ? "shadow-lg backdrop-blur-xs" : ""
                }`}
                style={{
                  backgroundColor: captionBackgroundColor || "transparent",
                }}
              >
                <div
                  className={`flex flex-wrap items-center justify-center gap-1.5 font-black uppercase tracking-tight leading-tight ${
                    captionFontSize === "small"
                      ? "text-xs"
                      : captionFontSize === "medium"
                      ? "text-sm"
                      : captionFontSize === "large"
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  }`}
                  style={{
                    fontFamily: currentPreset.font || "Inter, sans-serif",
                  }}
                >
                  {activeCaptionData.words.map((w, i) => {
                    const isActive = w.active;
                    return (
                      <span
                        key={i}
                        className={`transition-all duration-100 ${
                          isActive
                            ? captionEmphasisAnimation === "bounce"
                              ? "scale-110 shadow-sm"
                              : captionEmphasisAnimation === "glow"
                              ? "scale-105"
                              : "scale-100"
                            : "opacity-90"
                        }`}
                        style={{
                          color: isActive
                            ? captionHighlightColor || currentPreset.highlightColor
                            : captionTextColor || currentPreset.textColor,
                          textShadow: isActive
                            ? `0 0 14px ${captionHighlightColor || currentPreset.highlightColor}88, 0 2px 4px rgba(0,0,0,0.9)`
                            : "0 2px 4px rgba(0,0,0,0.95)",
                        }}
                      >
                        {w.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Play/Pause Button on Hover/Tap */}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* Badge indicator */}
          {!selectedFile ? (
            <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md">
              Sample Reel Preview
            </div>
          ) : isTranscribing ? (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-primary/80 px-2.5 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur-md">
              <RefreshCw size={10} className="animate-spin" />
              <span>Transcribing speech...</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── 5. QUICK CUSTOMIZATION ── */}
      <section className="mb-6 space-y-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          Quick Customization
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Position Segmented Control */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Position</label>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted/60 p-1">
              {(["top", "center", "bottom"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onChangeCaptionPosition(pos)}
                  className={`rounded-lg py-2 text-xs font-bold capitalize transition ${
                    captionPosition === pos
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Swatches */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Accent Color</label>
            <div className="flex items-center gap-2 flex-wrap min-h-[42px]">
              {QUICK_COLORS.map((c) => {
                const isSelected = captionHighlightColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onChangeCaptionHighlightColor(c.hex)}
                    title={c.name}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        size={14}
                        className={c.hex === "#ffffff" || c.hex === "#facc15" ? "text-black" : "text-white"}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}

              {/* Custom Color Trigger */}
              <label
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:text-foreground"
                title="Custom Color"
              >
                <Sliders size={14} />
                <input
                  type="color"
                  value={captionHighlightColor}
                  onChange={(e) => onChangeCaptionHighlightColor(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ADVANCED SETTINGS ACCORDION (COLLAPSED BY DEFAULT) ── */}
      <section className="mb-6 rounded-2xl border border-border bg-card/40 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-muted/40 sm:px-5"
        >
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Advanced Settings
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium hidden sm:inline">
              Typography, Highlight, Background, SFX & Language
            </span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showAdvanced && (
          <div className="border-t border-border p-4 sm:p-5 space-y-5">
            {/* 1. Text Options */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Text & Typography
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Typography Size</label>
                <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-border bg-muted/60 p-1">
                  {(["small", "medium", "large", "xlarge"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onChangeCaptionFontSize(size)}
                      className={`rounded-lg py-2 text-xs font-bold transition ${
                        captionFontSize === size
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`}
                    >
                      {size === "xlarge" ? "XL" : size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Base Text Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
                  <input
                    type="color"
                    value={captionTextColor}
                    onChange={(e) => onChangeCaptionTextColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Primary Text Color</span>
                </div>
              </div>
            </div>

            {/* 2. Highlight Options */}
            <div className="border-t border-border/60 pt-4 space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Active Word Highlight
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Active Word Motion</label>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/60 p-1">
                  {[
                    { id: "bounce", label: "Pop Scale" },
                    { id: "glow", label: "Glow Burst" },
                    { id: "none", label: "Clean Flow" },
                  ].map((anim) => (
                    <button
                      key={anim.id}
                      type="button"
                      onClick={() => onChangeCaptionEmphasisAnimation(anim.id as "bounce" | "glow" | "none")}
                      className={`rounded-lg py-2 text-xs font-bold transition ${
                        captionEmphasisAnimation === anim.id
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {anim.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Background Options */}
            <div className="border-t border-border/60 pt-4 space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Container Background
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Background Style</label>
                <select
                  value={captionBackgroundColor}
                  onChange={(e) => onChangeCaptionBackgroundColor(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <option key={bg.id} value={bg.id}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Audio SFX Options */}
            <div className="border-t border-border/60 pt-4 space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Audio Effects
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Word Pop Sound (SFX)</label>
                <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-muted/60 p-1">
                  <button
                    type="button"
                    onClick={() => onChangeWordClickSound(false)}
                    className={`rounded-lg py-2 text-xs font-bold transition ${
                      !wordClickSound
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🔇 Mute SFX
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeWordClickSound(true)}
                    className={`rounded-lg py-2 text-xs font-bold transition ${
                      wordClickSound
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🔊 Pop Audio
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Language Options */}
            {onChangeSpokenLanguage && (
              <div className="border-t border-border/60 pt-4 space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Language & Transcription
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Spoken Language</label>
                  <select
                    value={spokenLanguage}
                    onChange={(e) => onChangeSpokenLanguage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 7. STICKY BOTTOM GENERATE CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-3.5 backdrop-blur-md shadow-2xl sm:p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-black text-foreground">
              {selectedFile ? selectedFile.name : "Ready to generate"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isFreeTrial
                ? "🎁 Free Trial"
                : plannedCreditCost
                ? `Cost: ${plannedCreditCost} · 1080p MP4`
                : "1080p MP4 · Synced Captions"}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartRender}
            disabled={isRendering || !selectedFile}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-all shadow-lg active:scale-98 ${
              !selectedFile
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                : isRendering
                ? "bg-primary/80 text-primary-foreground cursor-wait"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 cursor-pointer"
            }`}
          >
            {isRendering ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>
                  {renderState === "uploading"
                    ? "Uploading Video..."
                    : renderState === "transcribing"
                    ? "Transcribing Speech..."
                    : "Generating Captions..."}
                </span>
              </>
            ) : (
              <>
                <span>Generate Captions</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── FULL-HEIGHT MOBILE-FIRST "VIEW ALL STYLES" SHEET / PAGE ── */}
      {showAllStylesModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAllStylesModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="text-base font-black text-foreground">All Caption Styles</h3>
                <p className="text-[11px] text-muted-foreground">70+ animated presets for reels & shorts</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAllStylesModal(false)}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-black text-primary-foreground transition hover:bg-primary/90"
            >
              Done
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="border-b border-border bg-card/40 p-4 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search styles by name (e.g. Hormozi, Neon, Clean, Glass)..."
                value={allStylesSearch}
                onChange={(e) => setAllStylesSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setAllStylesCategoryFilter("all")}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${
                  allStylesCategoryFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                All Styles
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAllStylesCategoryFilter(cat.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${
                    allStylesCategoryFilter === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Style Catalog Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-16">
              {filteredAllStyles.map((styleKey) => {
                const isSelected = captionStyle === styleKey;
                const preset = SUBTITLE_PRESETS[styleKey] || {
                  label: styleKey,
                  textColor: "#ffffff",
                  highlightColor: "#facc15",
                };

                return (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => {
                      onChangeCaptionStyle(styleKey);
                      setShowAllStylesModal(false);
                    }}
                    className={`flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary shadow-md scale-[1.02]"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/60"
                    }`}
                  >
                    {/* Visual Preview Box */}
                    <div
                      className="mb-2.5 flex h-16 w-full items-center justify-center rounded-xl bg-zinc-950 px-2 shadow-inner"
                      style={{
                        backgroundColor: preset.backgroundColor || "#0a0a0c",
                      }}
                    >
                      <span
                        className="truncate text-xs font-black uppercase tracking-tight"
                        style={{
                          color: preset.highlightColor || "#facc15",
                          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                        }}
                      >
                        {styleKey}
                      </span>
                    </div>

                    <div className="flex w-full items-center justify-between px-1">
                      <span className="truncate text-xs font-bold text-foreground">
                        {preset.label || styleKey}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY / PROJECTS FULL MODAL ── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-black text-foreground">Projects / Recent Renders</h3>
                <p className="text-xs text-muted-foreground">Your recent generated auto captions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
              {recentRenders.map((render: any) => (
                <div
                  key={render.jobId || render.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-foreground">
                      {render.title || render.design || "Auto Caption Video"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {render.createdAt ? new Date(render.createdAt).toLocaleString() : "Just now"}
                    </p>
                  </div>

                  {render.outputFile && (
                    <a
                      href={render.outputFile}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FUTURE FEATURE: TRANSCRIPT EDIT MODAL ── */}
      {showTranscriptEditor && transcriptDoc && (
        <TranscriptReviewModal
          isOpen={showTranscriptEditor}
          onClose={() => setShowTranscriptEditor(false)}
          initialDoc={transcriptDoc}
          onApply={handleApplyEditedTranscript}
        />
      )}
    </div>
  );
}
