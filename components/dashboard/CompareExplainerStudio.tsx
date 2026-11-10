"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Columns,
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
  Save,
  Lock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trophy,
  Swords,
  Tag,
  Music,
  ArrowRight,
  Search,
  Type,
  User,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

export const COMPARE_STEPS = [
  { step: 1, title: "Upload", desc: "Voiceover & 2 Subjects" },
  { step: 2, title: "Music", desc: "Soundtrack & Volume" },
  { step: 3, title: "Style", desc: "Characters & Theme" },
  { step: 4, title: "Preview", desc: "9:16 Shorts & Review" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

// Curated Presenter Characters
export const COMPARE_CHARACTERS = [
  {
    id: "3d-presenter-man",
    name: "3D Presenter Pro",
    category: "3D Avatar",
    desc: "Photorealistic 3D educator with 6 animated poses",
    badge: "Popular",
    avatar: "/brand/itnavideo-logo-mark.png",
  },
  {
    id: "2d-presenter-man",
    name: "2D Teacher Pro",
    category: "2D Flat",
    desc: "Modern vector explainer teacher with clean gestures",
    badge: "Clean",
    avatar: "/brand/itnavideo-logo-mark.png",
  },
  {
    id: "character-1",
    name: "Stickman Pro",
    category: "Stickman",
    desc: "Viral sketch stickman with energetic reactions",
    badge: "Viral",
    avatar: "/brand/itnavideo-logo-mark.png",
  },
  {
    id: "character-2",
    name: "Sketch Artist",
    category: "Hand-Drawn",
    desc: "Handmade pencil doodle character with witty expressions",
    badge: "Artistic",
    avatar: "/brand/itnavideo-logo-mark.png",
  },
  {
    id: "character-4",
    name: "Doodle Explainer",
    category: "Doodle",
    desc: "Comic-style animated mascot with thumbs up",
    badge: "Fun",
    avatar: "/brand/itnavideo-logo-mark.png",
  },
];

export interface CompareExplainerStudioProps {
  // Dual comparison images
  comparisonFiles: File[];
  onComparisonFilesChange: (files: File[]) => void;

  // Voiceover narration audio/video
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  // Header Titles & Handle
  compareLeftTitle: string;
  onLeftTitleChange: (val: string) => void;
  compareRightTitle: string;
  onRightTitleChange: (val: string) => void;
  topicTitle: string;
  onTopicTitleChange: (val: string) => void;
  compareHandle: string;
  onHandleChange: (val: string) => void;

  // Visual Theme & Tone
  compareTheme?: string;
  onThemeChange?: (val: string) => void;
  compareTone?: string;
  onToneChange?: (val: string) => void;
  compareWinner?: string;
  onWinnerChange?: (val: string) => void;
  stickerStyle?: string;
  onStickerStyleChange?: (val: string) => void;

  // Audio & BGM
  bgmTrackId?: string;
  onBgmTrackIdChange?: (trackId: string) => void;
  bgmVolume?: number;
  onBgmVolumeChange?: (vol: number) => void;
  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;
  enableSfx?: boolean;
  onEnableSfxChange?: (val: boolean) => void;

  // Editorial Transcript
  editorialTranscript?: string;
  onEditorialTranscriptChange?: (text: string) => void;

  // Actions
  onGenerate: () => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
}

export function CompareExplainerStudio({
  comparisonFiles,
  onComparisonFilesChange,
  selectedFile,
  onSelectFile,
  compareLeftTitle = "Option A",
  onLeftTitleChange,
  compareRightTitle = "Option B",
  onRightTitleChange,
  topicTitle = "HEAD TO HEAD COMPARISON",
  onTopicTitleChange,
  compareHandle = "@itnavideo",
  onHandleChange,
  compareTheme = "white",
  onThemeChange,
  compareTone = "versus",
  onToneChange,
  compareWinner = "none",
  onWinnerChange,
  stickerStyle = "3d-presenter-man",
  onStickerStyleChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript = "In this breakdown, we compare both options side by side so you can pick the clear winner.",
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: CompareExplainerStudioProps) {
  // ── 4-Step Guided Video Studio State ──
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Audio duration & playback
  const [audioDurationSec, setAudioDurationSec] = useState<number>(30);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("");

  // BGM audition state
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round(bgmVolume * 100) || 12);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(bgmTrackId || "parasail");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);

  // Captions
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<string>("glow-viral");
  const [captionFilter, setCaptionFilter] = useState<string>("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>("");

  // Simulator Preview State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<"left" | "right" | "both">("both");

  // Transcript editing
  const [localTranscript, setLocalTranscript] = useState(editorialTranscript);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState(false);

  // Input refs
  const leftImageInputRef = useRef<HTMLInputElement | null>(null);
  const rightImageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Object URLs for uploaded images
  const leftImageUrl = useMemo(() => {
    if (comparisonFiles[0]) return URL.createObjectURL(comparisonFiles[0]);
    return null;
  }, [comparisonFiles[0]]);

  const rightImageUrl = useMemo(() => {
    if (comparisonFiles[1]) return URL.createObjectURL(comparisonFiles[1]);
    return null;
  }, [comparisonFiles[1]]);

  useEffect(() => {
    return () => {
      if (leftImageUrl) URL.revokeObjectURL(leftImageUrl);
      if (rightImageUrl) URL.revokeObjectURL(rightImageUrl);
    };
  }, [leftImageUrl, rightImageUrl]);

  // Sync selected voiceover audio
  useEffect(() => {
    if (!selectedFile) {
      setAudioPreviewUrl("");
      setAudioDurationSec(30);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setAudioPreviewUrl(url);

    const el = document.createElement("audio");
    el.src = url;
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      const dur = Math.min(90, Math.round(el.duration || 30));
      setAudioDurationSec(dur);
    };

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // Sync audio player time
  useEffect(() => {
    const el = audioPlayerRef.current;
    if (!el) return;
    const onTimeUpdate = () => setAudioCurrentTime(el.currentTime);
    const onEnded = () => {
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    };
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
    };
  }, [audioPreviewUrl]);

  // Play / Pause voiceover
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => { });
    }
  };

  const toggleMuteAudio = () => {
    if (!audioPlayerRef.current) return;
    audioPlayerRef.current.muted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
  };

  // Preview BGM track
  const togglePlayBgmTrack = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingTrackId(null);
      return;
    }
    const audioUrl = getBgmTrackAudioUrl(track);
    if (playingTrackId === track.id) {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = audioUrl;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, activeBgmVolume / 100);
        bgmPreviewAudioRef.current
          .play()
          .then(() => setPlayingTrackId(track.id))
          .catch(() => setPlayingTrackId(null));
      }
    }
  };

  // Pre-fill sample comparison concepts
  const handleLoadSampleConcept = (concept: {
    topic: string;
    left: string;
    right: string;
    transcript: string;
  }) => {
    onTopicTitleChange(concept.topic);
    onLeftTitleChange(concept.left);
    onRightTitleChange(concept.right);
    setLocalTranscript(concept.transcript);
    onEditorialTranscriptChange?.(concept.transcript);
  };

  // Simulator Progress Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingPreview) {
      interval = setInterval(() => {
        setPreviewProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingPreview(false);
            return 0;
          }
          const next = prev + 2;
          if (next < 45) setActiveSide("left");
          else if (next < 90) setActiveSide("right");
          else setActiveSide("both");
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingPreview]);

  // Filter 32 caption styles
  const filteredCaptionStyles = THIRTY_TWO_CAPTION_STYLES.filter((s) => {
    const matchesCategory = captionFilter === "all" || s.category.toLowerCase() === captionFilter.toLowerCase();
    const matchesSearch =
      !captionSearchQuery.trim() ||
      s.name.toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(captionSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden bg-white">
      {/* Hidden Audio Elements */}
      <audio
        ref={audioPlayerRef}
        src={audioPreviewUrl}
        preload="metadata"
        onEnded={() => setIsPlayingAudio(false)}
      />
      <audio
        ref={bgmPreviewAudioRef}
        preload="auto"
        onEnded={() => setPlayingTrackId(null)}
      />

      {/* ── ROW 1: Studio Header & 4-Step Stepper (Consistent with Image to Video AI) ── */}
      <div className="shrink-0 border-b border-slate-200/90 bg-white px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Swords size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Compare Explainer AI
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-orange-600">
                9:16 Vertical Shorts
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              Create high-retention head-to-head versus showdowns with presenter avatar reactions and dynamic score counters.
            </p>
          </div>
        </div>

        {/* 4-Step Interactive Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-start md:self-center bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
          {COMPARE_STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as 1 | 2 | 3 | 4)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? "bg-white text-orange-600 shadow-xs border border-orange-200/60 ring-1 ring-orange-500/20"
                    : isCompleted
                      ? "text-slate-800 hover:text-slate-900 hover:bg-white/60"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${isActive
                      ? "bg-orange-500 text-white"
                      : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                >
                  {isCompleted ? <Check size={11} className="stroke-[3]" /> : s.step}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block leading-none">{s.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ROW 2: Scrollable Studio Workspace ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (Voiceover, Dual Subjects & Transcript)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Concept Presets Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 shrink-0">Popular Versus Concepts:</span>
                {[
                  { topic: "SMARTPHONE BATTLE", left: "iPhone 16 Pro", right: "Galaxy S24 Ultra", transcript: "In this flagship battle, we compare camera quality, battery life, and AI features to see which device reigns supreme." },
                  { topic: "JAVASCRIPT SHOWDOWN", left: "React 19", right: "Vue 3", transcript: "React versus Vue: which frontend framework delivers faster development speed and cleaner component architecture?" },
                  { topic: "HABIT TRANSFORMATION", left: "Daily Exercise", right: "Sedentary Routine", transcript: "Comparing 30 minutes of daily movement against a sedentary lifestyle over 12 months reveals shocking health compounding." },
                ].map((c) => (
                  <button
                    key={c.topic}
                    type="button"
                    onClick={() => handleLoadSampleConcept(c)}
                    className="text-xs font-bold px-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer shrink-0"
                  >
                    {c.left} vs {c.right}
                  </button>
                ))}
              </div>

              {/* Voiceover Upload Zone */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Volume2 size={20} className="text-orange-500" />
                      <span>Narration Voiceover Audio</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Required • Up to 90s (1 Credit)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your spoken comparison narration. Groq Whisper will sync split-screen timing and presenter reactions.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Max: 01:30 (90s)
                  </span>
                </div>

                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*,video/mp4"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onSelectFile(e.target.files[0]);
                    }
                  }}
                />

                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="w-full py-10 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-3xl bg-slate-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud size={24} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-800">
                        Click to Upload Narration Audio
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        MP3, WAV, M4A, or MP4 • Flat 1 Credit Cost
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="font-mono font-bold text-slate-700">
                              {formatSec(audioDurationSec)} / 01:30 Max
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-orange-600">
                              1 Credit Flat
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => audioInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw size={12} />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectFile(null)}
                          className="p-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Waveform Player */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={togglePlayAudio}
                            className="h-8 w-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition cursor-pointer"
                          >
                            {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={toggleMuteAudio}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          >
                            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          </button>
                          <span>{formatSec(audioCurrentTime)}</span>
                        </div>
                        <span>{formatSec(audioDurationSec)}</span>
                      </div>

                      <div className="flex items-end gap-1 h-10 w-full pt-1">
                        {WAVE_BARS.map((height, i) => {
                          const barProgress = i / WAVE_BARS.length;
                          const currentProgress = audioDurationSec > 0 ? audioCurrentTime / audioDurationSec : 0;
                          const isPlayed = barProgress <= currentProgress;

                          return (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-150 ${isPlayed ? "bg-orange-500" : "bg-slate-200"
                                }`}
                              style={{ height: `${height}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dual Subject Comparison Visuals */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Columns size={18} className="text-orange-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Dual Subject Visuals (Left vs Right)
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                    Required (2 Visuals)
                  </span>
                </div>

                <input
                  type="file"
                  ref={leftImageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const next = [...comparisonFiles];
                      next[0] = e.target.files[0];
                      onComparisonFilesChange(next);
                    }
                  }}
                />

                <input
                  type="file"
                  ref={rightImageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const next = [...comparisonFiles];
                      next[1] = e.target.files[0];
                      onComparisonFilesChange(next);
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Subject Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-800">Option A (Left Side)</span>
                      {leftImageUrl && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>

                    <div
                      onClick={() => leftImageInputRef.current?.click()}
                      className="aspect-video sm:aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-orange-500 bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer transition relative group"
                    >
                      {leftImageUrl ? (
                        <>
                          <img src={leftImageUrl} alt="Option A" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                            Click to Replace
                          </div>
                        </>
                      ) : (
                        <>
                          <Plus size={24} className="text-orange-500 mb-1" />
                          <p className="text-xs font-bold text-slate-800">Upload Left Image</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Option A Title / Name</label>
                      <input
                        type="text"
                        value={compareLeftTitle}
                        onChange={(e) => onLeftTitleChange(e.target.value)}
                        placeholder="e.g. iPhone 16 Pro"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Right Subject Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-800">Option B (Right Side)</span>
                      {rightImageUrl && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>

                    <div
                      onClick={() => rightImageInputRef.current?.click()}
                      className="aspect-video sm:aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-orange-500 bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer transition relative group"
                    >
                      {rightImageUrl ? (
                        <>
                          <img src={rightImageUrl} alt="Option B" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                            Click to Replace
                          </div>
                        </>
                      ) : (
                        <>
                          <Plus size={24} className="text-orange-500 mb-1" />
                          <p className="text-xs font-bold text-slate-800">Upload Right Image</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Option B Title / Name</label>
                      <input
                        type="text"
                        value={compareRightTitle}
                        onChange={(e) => onRightTitleChange(e.target.value)}
                        placeholder="e.g. Galaxy S24 Ultra"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Topic Headline & Watermark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Topic Headline (Top Header)</label>
                    <input
                      type="text"
                      value={topicTitle}
                      onChange={(e) => onTopicTitleChange(e.target.value)}
                      placeholder="e.g. ULTIMATE FLAGSHIP BATTLE"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Creator Watermark Handle</label>
                    <input
                      type="text"
                      value={compareHandle}
                      onChange={(e) => onHandleChange(e.target.value)}
                      placeholder="e.g. @yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Spoken Narration Transcript */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-orange-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Spoken Comparison Script
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition cursor-pointer"
                    >
                      {isEditingTranscript ? "Done Editing" : "Edit Transcript"}
                    </button>

                    {isEditingTranscript && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditorialTranscriptChange?.(localTranscript);
                          setTranscriptSavedFeedback(true);
                          setTimeout(() => setTranscriptSavedFeedback(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        {transcriptSavedFeedback ? (
                          <>
                            <CheckCheck size={13} />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save size={13} />
                            <span>Save Script</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isEditingTranscript ? (
                  <textarea
                    value={localTranscript}
                    onChange={(e) => setLocalTranscript(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none transition leading-relaxed"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 max-h-32 overflow-y-auto">
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {localTranscript}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: MUSIC (14 AWS S3 BGM Tracks, Volume & SFX)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Music size={20} className="text-orange-500" />
                      <span>Background Music &amp; Audio Level</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select upbeat royalty-free music from AWS S3, or upload your own track. Includes dynamic auto-ducking.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                    <Volume2 size={14} className="text-orange-500" />
                    <span className="text-xs font-black text-slate-800">
                      Volume: {activeBgmVolume}%
                    </span>
                  </div>
                </div>

                {/* Volume Slider with Quick Presets */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sliders size={14} className="text-orange-500" />
                      <span>Background Music Level (Default: 12%)</span>
                    </span>
                    <span className="font-mono text-xs font-black text-orange-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {activeBgmVolume}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={activeBgmVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setActiveBgmVolume(val);
                      onBgmVolumeChange?.(val / 100);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { label: "Mute (0%)", val: 0 },
                      { label: "Subtle (12% - Recommended)", val: 12 },
                      { label: "Moderate (20%)", val: 20 },
                      { label: "Prominent (35%)", val: 35 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          setActiveBgmVolume(p.val);
                          onBgmVolumeChange?.(p.val / 100);
                        }}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition cursor-pointer ${activeBgmVolume === p.val
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Ducking and Sound Effects (SFX) Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setAutoDucking(!autoDucking)}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${autoDucking ? "border-orange-500 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                      }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dynamic Auto-Ducking</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ducks music down during speech and raises it during pauses
                      </p>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full transition-colors relative ${autoDucking ? "bg-orange-500" : "bg-slate-300"
                        }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform absolute top-0.5 ${autoDucking ? "left-4.5" : "left-0.5"
                          }`}
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => onEnableSfxChange?.(!enableSfx)}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${enableSfx ? "border-orange-500 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                      }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Versus Sound Effects (SFX)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Versus badge slam, whooshes, point chimes, and winner crown reveal
                      </p>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full transition-colors relative ${enableSfx ? "bg-orange-500" : "bg-slate-300"
                        }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform absolute top-0.5 ${enableSfx ? "left-4.5" : "left-0.5"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Curated AWS S3 Music Tracks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Choose from Curated AWS S3 Music Tracks ({AWS_BGM_TRACKS.length})
                    </label>
                    <span className="text-[11px] text-slate-400">All royalty-free for YouTube monetization</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AWS_BGM_TRACKS.map((track) => {
                      const isSelected = selectedBgmTrack === track.id;
                      const isPlaying = playingTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            setSelectedBgmTrack(track.id);
                            onBgmTrackIdChange?.(track.id);
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-1 ring-orange-500"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                            }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black truncate">{track.label}</span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {track.category}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">{track.desc}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {track.id !== "none" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlayBgmTrack(track);
                                }}
                                title="Listen to Preview"
                                className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-xs"
                              >
                                {isPlaying ? (
                                  <Pause size={13} className="text-orange-500" />
                                ) : (
                                  <Play size={13} className="ml-0.5 text-slate-600" />
                                )}
                              </button>
                            )}

                            {isSelected && <CheckCircle2 size={16} className="text-orange-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: STYLE (Presenter Avatar, Winner Crown & Tone)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Character Avatar Picker */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <User size={20} className="text-orange-500" />
                      <span>Presenter Character Avatar</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Animated presenter synced to narration speech, gesturing towards Left and Right options.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COMPARE_CHARACTERS.map((char) => {
                    const isSelected = stickerStyle === char.id;

                    return (
                      <div
                        key={char.id}
                        onClick={() => onStickerStyleChange?.(char.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${isSelected
                            ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-1 ring-orange-500"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-black text-slate-900">{char.name}</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {char.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{char.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Winner Crown & Comparison Tone */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Trophy size={14} className="text-amber-500" />
                      <span>Winner Reveal Crown</span>
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: "none", label: "No Winner (Neutral Comparison)", desc: "Balanced breakdown without declaring a winner" },
                        { id: "left", label: `Option A Wins (${compareLeftTitle || "Left"}) 👑`, desc: "Animated golden crown appears over Option A" },
                        { id: "right", label: `Option B Wins (${compareRightTitle || "Right"}) 👑`, desc: "Animated golden crown appears over Option B" },
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => onWinnerChange?.(w.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${compareWinner === w.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div>{w.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{w.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Swords size={14} className="text-orange-500" />
                      <span>Comparison Tone & Mood</span>
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: "versus", label: "Versus Battle (Blue vs Purple)", desc: "Classic competitive head-to-head showdown" },
                        { id: "goodBad", label: "Good vs Bad (Emerald vs Crimson)", desc: "Highlighting superior choices vs poor habits" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onToneChange?.(t.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${compareTone === t.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div>{t.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 32 Caption Styles Selector */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Type size={20} className="text-orange-500" />
                      <span>32 Master Kinetic Caption Themes</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live animated word-by-word previews for 9:16 vertical shorts.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search caption styles..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredCaptionStyles.map((theme) => {
                    const isSelected = selectedCaptionStyle === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedCaptionStyle(theme.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${isSelected
                            ? "border-orange-500 bg-orange-50/50 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: theme.color }} />
                            <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {theme.badge}
                          </span>
                        </div>

                        <div className="bg-slate-900/95 rounded-xl px-3 py-2 flex items-center justify-center min-h-[38px] overflow-hidden">
                          {renderPreviewCaptionWords(theme.id)}
                        </div>

                        <span className="text-[11px] text-slate-500 line-clamp-1">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: PREVIEW (9:16 Vertical Live Monitor & Review)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Eye size={20} className="text-orange-500" />
                      <span>9:16 Vertical Shorts Live Monitor</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Compulsory Review
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Simulate dual split-screen alignment, dynamic VS badge, and presenter reactions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer self-start sm:self-auto"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause size={13} className="text-orange-500" />
                        <span>Pause Simulation</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="text-slate-700 ml-0.5" />
                        <span>Simulate Shorts Reel</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 9:16 Vertical Simulator Canvas */}
                <div className="relative mx-auto w-full max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-white flex flex-col justify-between p-4 select-none">
                  {/* Top Bar: Handle & Headline */}
                  <div className="text-center space-y-1.5 z-10 pt-1">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {compareHandle.trim() || "@itnavideo"}
                    </span>
                    <div className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-xl max-w-[90%] mx-auto truncate shadow-md">
                      {topicTitle.trim() || "HEAD TO HEAD COMPARISON"}
                    </div>
                  </div>

                  {/* Dual Split-Screen Subject Cards */}
                  <div className="relative grid grid-cols-2 gap-2.5 my-auto z-10 px-1">
                    {/* Left Card */}
                    <div
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 p-2 bg-white shadow-sm flex flex-col items-center relative ${activeSide === "left" || activeSide === "both"
                          ? "ring-2 ring-orange-500 border-orange-400 scale-102"
                          : "opacity-80 border-slate-200"
                        }`}
                    >
                      {compareWinner === "left" && (
                        <div className="absolute -top-2 text-xl drop-shadow-md z-20">👑</div>
                      )}
                      <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-2 flex items-center justify-center border border-slate-200">
                        {leftImageUrl ? (
                          <img src={leftImageUrl} alt="Left" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={24} className="text-slate-300" />
                        )}
                      </div>
                      <p className="text-[11px] font-black text-slate-900 text-center truncate w-full">
                        {compareLeftTitle || "Option A"}
                      </p>
                    </div>

                    {/* Right Card */}
                    <div
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 p-2 bg-white shadow-sm flex flex-col items-center relative ${activeSide === "right" || activeSide === "both"
                          ? "ring-2 ring-orange-500 border-orange-400 scale-102"
                          : "opacity-80 border-slate-200"
                        }`}
                    >
                      {compareWinner === "right" && (
                        <div className="absolute -top-2 text-xl drop-shadow-md z-20">👑</div>
                      )}
                      <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-2 flex items-center justify-center border border-slate-200">
                        {rightImageUrl ? (
                          <img src={rightImageUrl} alt="Right" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={24} className="text-slate-300" />
                        )}
                      </div>
                      <p className="text-[11px] font-black text-slate-900 text-center truncate w-full">
                        {compareRightTitle || "Option B"}
                      </p>
                    </div>

                    {/* VS Badge in Center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg z-20">
                      VS
                    </div>
                  </div>

                  {/* Bottom Subtitle Strip */}
                  <div className="z-10 text-center pb-2">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 text-white rounded-xl py-2 px-3 max-w-[95%] mx-auto shadow-md">
                      {renderPreviewCaptionWords(selectedCaptionStyle)}
                    </div>
                  </div>

                  {/* Watermark Tag */}
                  {!removeAiWatermark && (
                    <div className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      Itnavideo AI
                    </div>
                  )}

                  {/* Scrubber Line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-200">
                    <div
                      className="h-full bg-orange-500 transition-all duration-100"
                      style={{ width: `${previewProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Watermark Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <WatermarkRemoverToggle
                  checked={removeAiWatermark}
                  onChange={(val) => onRemoveAiWatermarkChange?.(val)}
                  label="Remove AI Watermark"
                  description="Export a completely clean, unbranded 9:16 vertical shorts video ready for Instagram and TikTok."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Sticky Bottom Action Bar ── */}
      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Battle:</span>
            <span className="text-xs font-black text-slate-900 max-w-[200px] truncate">
              {compareLeftTitle} vs {compareRightTitle}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Zap size={13} className="fill-orange-500 text-orange-500" />
            <span>Cost: 1 Credit Flat (9:16 Shorts)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
            >
              <span>Next: {COMPARE_STEPS[currentStep].title}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !selectedFile || comparisonFiles.length < 2}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles size={14} />
              <span>Create Compare Explainer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
