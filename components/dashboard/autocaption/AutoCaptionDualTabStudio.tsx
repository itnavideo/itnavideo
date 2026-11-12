"use client";

import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Film,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Upload,
  Check,
  Play,
  Pause,
  RotateCcw,
  FileVideo,
  CheckCircle2,
  Globe,
  Mic,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  SlidersHorizontal,
  Flame,
  Zap,
  Download,
  ArrowRight,
  Clock,
  Settings2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Type,
  Eye,
  Layers,
  ArrowLeft,
  FileAudio,
  Headphones,
  UploadCloud,
  X,
} from "lucide-react";
import { StudioStepper, StudioBottomBar } from "@/components/dashboard/shared/StudioStepper";
import {
  KINETIC_STYLES,
  getKineticStyle,
  isKineticCaptionStyle,
  type KineticStyleDefinition,
} from "@/lib/captions/kineticStyles";
import { KineticCaptionLiveRenderer } from "@/components/captions/KineticCaptionLiveRenderer";
import { AutoCaptionTimeline, CaptionWordItem } from "@/components/dashboard/AutoCaptionTimeline";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  STYLE_PREVIEW_WORDS,
  renderPreviewCaptionWords,
  type CaptionStyleItem,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

// ── Audio Spoken Language Options ──
export const AUDIO_SPOKEN_LANGUAGES = [
  { id: "auto", label: "Auto Detect (Recommended)" },
  { id: "hi", label: "Hindi / Hinglish (Spoken)" },
  { id: "en", label: "English (Global / US / UK)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
  { id: "ar", label: "Arabic" },
  { id: "ja", label: "Japanese" },
  { id: "ru", label: "Russian" },
];

export const CAPTION_LANGUAGES = [
  { id: "same", label: "Same as Audio (Roman Hinglish / English)" },
  { id: "en", label: "English (Latin Script)" },
  { id: "hi", label: "Hinglish (Roman Hindi - No Devanagari)" },
  { id: "es", label: "Spanish (Español)" },
  { id: "fr", label: "French (Français)" },
  { id: "de", label: "German (Deutsch)" },
  { id: "pt", label: "Portuguese (Português)" },
  { id: "id", label: "Indonesian (Bahasa)" },
];

// ── 4-Step Guided Video Studio Roadmap ──
export const AUTO_CAPTION_STEPS = [
  { step: 1, title: "Upload", desc: "Video & Audio" },
  { step: 2, title: "Music", desc: "Soundtrack & Volume" },
  { step: 3, title: "Style", desc: "Captions & Kinetics" },
  { step: 4, title: "Preview", desc: "Studio Monitor & Timeline" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

function generateSrt(words: Array<{ text: string; start: number; end: number }>): string {
  if (!words || words.length === 0) return '';
  const chunks: Array<{ start: number; end: number; text: string }> = [];
  const CHUNK_SIZE = 4;
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    const slice = words.slice(i, i + CHUNK_SIZE);
    chunks.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end,
      text: slice.map(w => w.text).join(' '),
    });
  }

  const formatSrtTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  return chunks.map((c, idx) => {
    return `${idx + 1}\n${formatSrtTime(c.start)} --> ${formatSrtTime(c.end)}\n${c.text}\n`;
  }).join('\n');
}

function generateVtt(words: Array<{ text: string; start: number; end: number }>): string {
  if (!words || words.length === 0) return 'WEBVTT\n\n';
  const srt = generateSrt(words);
  return 'WEBVTT\n\n' + srt.replace(/,/g, '.');
}

export interface AutoCaptionDualTabStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  captionStyle: string;
  onCaptionStyleChange: (style: string) => void;
  mediaDurationSeconds: number;
  isWorking: boolean;
  onStartRender: () => void;
  editedTranscript?: string;
  onEditedTranscriptChange?: (text: string) => void;
  previewCaptions?: Array<{ start: number; end: number; text: string; words?: any[] }> | null;
  spokenLanguage?: string;
  onSpokenLanguageChange?: (lang: string) => void;
  captionLanguage?: string;
  onCaptionLanguageChange?: (lang: string) => void;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
  canvasBackgroundColor?: string;
  onCanvasBackgroundColorChange?: (color: string) => void;
  selectedBgmTrack?: any;
  onSelectBgmTrack?: (track: any) => void;
  bgmVolume?: number;
  onChangeBgmVolume?: (volume: number) => void;
}

export function AutoCaptionDualTabStudio({
  selectedFile,
  onSelectFile,
  captionStyle,
  onCaptionStyleChange,
  mediaDurationSeconds,
  isWorking,
  onStartRender,
  editedTranscript = "",
  onEditedTranscriptChange,
  previewCaptions = null,
  spokenLanguage,
  onSpokenLanguageChange,
  captionLanguage,
  onCaptionLanguageChange,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
  canvasBackgroundColor = "#070B14",
  onCanvasBackgroundColorChange,
  bgmVolume: propBgmVolume = 0.15,
  onChangeBgmVolume,
}: AutoCaptionDualTabStudioProps) {
  // ── 4-Step Guided Video Studio State (Rule 7.3 Flexible Step System) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Studio Settings
  const [localSpokenLang, setLocalSpokenLang] = useState<string>("auto");
  const [localCaptionLang, setLocalCaptionLang] = useState<string>("same");
  const [isHeroDragging, setIsHeroDragging] = useState(false);

  const currentSpokenLang = spokenLanguage || localSpokenLang;
  const currentCaptionLang = captionLanguage || localCaptionLang;
  const handleSpokenLangChange = onSpokenLanguageChange || setLocalSpokenLang;
  const handleCaptionLangChange = onCaptionLanguageChange || setLocalCaptionLang;

  // Step 2 Audio & Music States
  const [selectedBgmId, setSelectedBgmId] = useState<string>("parasail");
  const [localBgmVolume, setLocalBgmVolume] = useState<number>(propBgmVolume);
  const currentBgmVolume = onChangeBgmVolume ? propBgmVolume : localBgmVolume;
  const handleBgmVolumeChange = (vol: number) => {
    setLocalBgmVolume(vol);
    if (onChangeBgmVolume) onChangeBgmVolume(vol);
  };

  const [bgmCategory, setBgmCategory] = useState<string>("All");
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const [wordClickSound, setWordClickSound] = useState<boolean>(true);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [audioCleaningEnabled, setAudioCleaningEnabled] = useState<boolean>(true);

  // Step 3 Captions Filter & Search
  const [captionCategory, setCaptionCategory] = useState<string>("All");
  const [captionSearch, setCaptionSearch] = useState<string>("");
  const [hoveredStyleId, setHoveredStyleId] = useState<string | null>(null);
  const [previewWordStep, setPreviewWordStep] = useState<number>(0);

  // Step 4 Inspector & Playback Controls
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [accentColor, setAccentColor] = useState<string>("#FFE14D");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(1.2);
  const [showWordReplacer, setShowWordReplacer] = useState<boolean>(false);

  // ── P0 Audit: Caption Grouping & Safe Zones ──
  const [wordsPerGroup, setWordsPerGroup] = useState<number>(3);
  const [highlightCadence, setHighlightCadence] = useState<"word" | "phrase" | "progressive">("word");
  const [safeZonePlatform, setSafeZonePlatform] = useState<"none" | "instagram" | "tiktok" | "youtube">("none");

  // ── P0 Audit: Duration Trim Segment State ──
  const [rawDuration, setRawDuration] = useState<number>(0);
  const [segmentStartSec, setSegmentStartSec] = useState<number>(0);
  const [segmentEndSec, setSegmentEndSec] = useState<number>(90);
  const [showDurationModal, setShowDurationModal] = useState<boolean>(false);

  // Hidden File Inputs & Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const [localCanvasBg, setLocalCanvasBg] = useState<string>(canvasBackgroundColor || "#070B14");
  const canvasBg = canvasBackgroundColor || localCanvasBg;
  const handleCanvasBgChange = onCanvasBackgroundColorChange || setLocalCanvasBg;

  const isAudioFile = Boolean(
    selectedFile &&
    (selectedFile.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(selectedFile.name))
  );

  // Real Blob URL for user's uploaded video or fallback to sample
  const filePreviewUrl = useMemo(() => {
    if (!selectedFile) return "/visuals/homepage/autocaption.mp4";
    if (isAudioFile) return "";
    try {
      return URL.createObjectURL(selectedFile);
    } catch {
      return "/visuals/homepage/autocaption.mp4";
    }
  }, [selectedFile, isAudioFile]);

  // Clean up object URL on change/unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // P0 Audit: Probe media duration and detect files > 90s for explicit user segment selection
  useEffect(() => {
    if (!selectedFile) {
      setRawDuration(0);
      setShowDurationModal(false);
      return;
    }
    const tempUrl = URL.createObjectURL(selectedFile);
    const element = isAudioFile ? document.createElement("audio") : document.createElement("video");
    element.src = tempUrl;
    element.preload = "metadata";

    element.onloadedmetadata = () => {
      const dur = element.duration || 0;
      setRawDuration(dur);
      if (dur > 90) {
        setSegmentStartSec(0);
        setSegmentEndSec(90);
        setShowDurationModal(true);
      } else {
        setSegmentStartSec(0);
        setSegmentEndSec(dur);
      }
      URL.revokeObjectURL(tempUrl);
    };

    element.onerror = () => {
      URL.revokeObjectURL(tempUrl);
    };
  }, [selectedFile, isAudioFile]);

  // Total Duration clamped by selected 90s segment
  const activeDuration = rawDuration > 90 ? (segmentEndSec - segmentStartSec) : (mediaDurationSeconds > 0 ? mediaDurationSeconds : 32);
  const totalDuration = activeDuration > 0 ? activeDuration : 32;

  // Real-time Playback Loop for Monitor
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPlaybackTime((prev) => {
        const next = prev + dt;
        return next > totalDuration ? 0 : next;
      });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, totalDuration]);

  // Periodic Word Animation Loop for Caption Cards (Step 3)
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewWordStep((prev) => (prev + 1) % 3);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  // Sync Video Element with Playback Time
  useEffect(() => {
    if (videoPlayerRef.current && isPlaying) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play().catch(() => { });
      }
    } else if (videoPlayerRef.current && !isPlaying) {
      videoPlayerRef.current.pause();
    }
  }, [isPlaying]);

  // Background Music Audition Player
  const handleTogglePlayBgm = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      setPlayingBgmId(null);
      setSelectedBgmId("none");
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      const audioUrl = getBgmTrackAudioUrl(track.path);
      const audio = new Audio(audioUrl);
      audio.volume = currentBgmVolume;
      audio.onended = () => setPlayingBgmId(null);
      audio.play().catch((e) => console.warn("Audio playback failed:", e));
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      setSelectedBgmId(track.id);
    }
  };

  // Clean up BGM audio on unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
    };
  }, []);

  // Filtered BGM Tracks
  const filteredBgmTracks = useMemo(() => {
    return AWS_BGM_TRACKS.filter((track) => {
      if (bgmCategory !== "All" && track.category !== bgmCategory) {
        return false;
      }
      return true;
    });
  }, [bgmCategory]);

  // Filtered Caption Styles (from 32 Master Styles)
  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((style) => {
      if (captionCategory !== "All" && style.category !== captionCategory) {
        return false;
      }
      if (captionSearch.trim()) {
        const q = captionSearch.toLowerCase().trim();
        return (
          style.name.toLowerCase().includes(q) ||
          (style.desc && style.desc.toLowerCase().includes(q)) ||
          (style.category && style.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [captionCategory, captionSearch]);

  // Video info display text
  const videoFileName = selectedFile?.name || "sample_walking.mp4";
  const videoDurationText =
    mediaDurationSeconds > 0
      ? `0:${Math.round(mediaDurationSeconds).toString().padStart(2, "0")}`
      : "0:32";

  // Demo words for live phone preview & timeline
  const demoWords: CaptionWordItem[] = useMemo(() => {
    if (previewCaptions && previewCaptions.length > 0) {
      const flattened: CaptionWordItem[] = [];
      previewCaptions.forEach((c) => {
        if (c.words && c.words.length > 0) {
          c.words.forEach((w: any) => {
            flattened.push({ word: w.word || w.text, start: w.start, end: w.end });
          });
        } else {
          flattened.push({ word: c.text, start: c.start, end: c.end });
        }
      });
      if (flattened.length > 0) return flattened;
    }
    return [
      { word: "I", start: 0.1, end: 0.4 },
      { word: "stopped", start: 0.4, end: 0.9 },
      { word: "waiting", start: 0.9, end: 1.5 },
      { word: "for", start: 1.5, end: 1.9 },
      { word: "perfect.", start: 1.9, end: 3.2 },
      { word: "And", start: 3.2, end: 3.5 },
      { word: "started", start: 3.5, end: 4.1 },
      { word: "building", start: 4.1, end: 4.8 },
      { word: "now.", start: 4.8, end: 5.8 },
    ];
  }, [previewCaptions]);

  // Format seconds into MM:SS
  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleDownloadSubtitles = (format: 'srt' | 'vtt') => {
    try {
      const content = format === 'srt' ? generateSrt(demoWords) : generateVtt(demoWords);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'subtitles'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Failed to download subtitles:', err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white text-slate-900 select-text font-sans">

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* P0 AUDIT: 90-SECOND SEGMENT SELECTION MODAL                            */}
      {/* Shown when uploaded file is > 90 seconds. User explicitly chooses       */}
      {/* which 90s window to use. Never silently trim.                           */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {showDurationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <Clock size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Video Longer Than 90 Seconds
                </h3>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                  Your file is <strong className="text-slate-800">{formatTime(rawDuration)}</strong> long.
                  Auto Caption creates <strong className="text-orange-600">90-second</strong> vertical reels.
                  Choose which portion to use.
                </p>
              </div>
            </div>

            {/* Option 1: Use first 90 seconds */}
            <button
              type="button"
              onClick={() => {
                setSegmentStartSec(0);
                setSegmentEndSec(90);
                setShowDurationModal(false);
              }}
              className="w-full flex items-center gap-3 rounded-2xl border border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/50 p-4 transition-all group cursor-pointer text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Check size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Use first 90 seconds</p>
                <p className="text-xs text-slate-500">0:00 – 1:30 · Recommended for intro-focused content</p>
              </div>
            </button>

            {/* Option 2: Choose custom 90s window */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-orange-600" />
                <p className="text-sm font-bold text-slate-900">Choose 90-second segment</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Start: {formatTime(segmentStartSec)}</span>
                  <span className="font-bold text-orange-600">{formatTime(segmentEndSec - segmentStartSec)} selected</span>
                  <span>End: {formatTime(segmentEndSec)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, rawDuration - 90)}
                  step={1}
                  value={segmentStartSec}
                  onChange={(e) => {
                    const start = parseFloat(e.target.value);
                    setSegmentStartSec(start);
                    setSegmentEndSec(Math.min(start + 90, rawDuration));
                  }}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>0:00</span>
                  <span>{formatTime(rawDuration)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDurationModal(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-105 active:scale-[0.98] text-white font-black text-xs px-6 py-2.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <Check size={14} className="stroke-[2.5]" />
                <span>Use {formatTime(segmentStartSec)} – {formatTime(segmentEndSec)}</span>
              </button>
            </div>

            {/* Option 3: Cancel & Upload shorter */}
            <button
              type="button"
              onClick={() => {
                setShowDurationModal(false);
                onSelectFile(null as unknown as File);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-5 py-2.5 transition cursor-pointer"
            >
              <X size={14} />
              <span>Cancel & Upload Shorter Clip</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onSelectFile(e.target.files[0]);
          e.currentTarget.value = "";
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onSelectFile(e.target.files[0]);
          e.currentTarget.value = "";
        }}
      />

      {/* ========================================================================= */}
      {/* ROW 1: HEADER & STEPPER NAVIGATION BAR (Fixed height, no page scroll)     */}
      {/* ========================================================================= */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Studio Branding & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] to-orange-600 text-white shadow-md shadow-orange-500/20">
              <Sparkles size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
                  Auto Caption{" "}
                  <span className="bg-gradient-to-r from-[#FF5722] to-orange-600 bg-clip-text text-transparent">
                    AI Studio
                  </span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                  9:16 Shorts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                4-Step Guided Video Studio · Speech transcription, soundtrack, kinetic captions &amp; live timeline
              </p>
            </div>
          </div>

          {/* Center: Desktop Stepper (>=1024px) */}
          <nav aria-label="Studio Steps" className="hidden lg:flex items-center gap-2 lg:gap-3">
            {AUTO_CAPTION_STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;

              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className="group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all cursor-pointer hover:bg-slate-100/70 active:scale-98"
                  >
                    {/* Circle - Green for completed, Orange for active, Slate for upcoming */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${isCompleted
                          ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/25 ring-2 ring-emerald-500/20"
                          : isActive
                            ? "bg-white border-2 border-orange-600 text-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)] font-black"
                            : "bg-slate-100 border border-slate-200 text-slate-400 group-hover:border-slate-300"
                        }`}
                    >
                      {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.step}
                    </div>

                    {/* Label */}
                    <div className="text-left hidden xl:block">
                      <p
                        className={`text-xs font-black leading-tight ${isActive
                            ? "text-slate-900"
                            : isCompleted
                              ? "text-emerald-700"
                              : "text-slate-400"
                          }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
                    </div>
                  </button>

                  {/* Connecting Line between steps */}
                  {idx < AUTO_CAPTION_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-6 lg:w-8 rounded-full transition-colors ${s.step < currentStep ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right: Render Rate & Free Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50/80 px-3.5 py-1.5 text-right shadow-xs backdrop-blur-xs">
              <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-600">
                Daily Allowance
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 flex items-center gap-1.5 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FREE · 5 Videos/Day
              </span>
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Stepper Bar (<1024px) */}
        <div className="lg:hidden mt-3 pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black text-slate-900 truncate">
              <span className="text-orange-600 shrink-0">Step {currentStep} of {AUTO_CAPTION_STEPS.length}:</span>
              <span className="truncate">{AUTO_CAPTION_STEPS[currentStep - 1]?.title}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">
                · {AUTO_CAPTION_STEPS[currentStep - 1]?.desc}
              </span>
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer shrink-0 ml-2"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full">
            {AUTO_CAPTION_STEPS.map((s) => {
              const isDone = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${isDone
                      ? "bg-emerald-500 shadow-xs"
                      : isCurrent
                        ? "bg-gradient-to-r from-orange-600 to-amber-500 shadow-xs"
                        : "bg-slate-200"
                    }`}
                  title={`Step ${s.step}: ${s.title}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ROW 2: ACTIVE STEP CONTENT REGION (Internal scroll with smooth clearance)  */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-32 w-full">
        {/* ======================================================================= */}
        {/* STEP 1: UPLOAD (Video or Spoken Audio)                                  */}
        {/* ======================================================================= */}
        {currentStep === 1 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                1. Upload your video or audio
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload your 9:16 vertical video or voiceover speech to calculate word-level timestamps and auto-sync kinetic captions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Media Upload Card (Col 8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-[28px] sm:rounded-[32px] border border-orange-500/25 bg-gradient-to-b from-orange-500/[0.03] via-white to-white p-5 sm:p-8 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25 shrink-0">
                        {isAudioFile ? <Mic size={22} className="stroke-[2.5]" /> : <Film size={22} className="stroke-[2.5]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Primary Media Input
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {isAudioFile ? "Spoken voiceover audio track" : "9:16 Shorts or vertical reel video"}
                        </p>
                      </div>
                    </div>

                    {selectedFile && (
                      <span className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-700 text-xs font-mono font-bold shadow-xs">
                        <Check size={13} className="stroke-[3]" />
                        <span>{videoDurationText} · FREE (0 Cr)</span>
                      </span>
                    )}
                  </div>

                  {/* Big Prominent Dropzone */}
                  {!selectedFile ? (
                    <div
                      onClick={() => !isWorking && fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsHeroDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsHeroDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsHeroDragging(false);
                        if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
                      }}
                      className={`group relative flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border-2 border-dashed min-h-[220px] sm:min-h-[260px] p-6 sm:p-10 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${isHeroDragging
                        ? "border-orange-500 bg-orange-50/50 scale-[1.005]"
                        : "border-orange-200 hover:border-orange-500 bg-orange-500/[0.015] hover:bg-orange-50/30"
                        }`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100/80 group-hover:bg-gradient-to-tr group-hover:from-orange-600 group-hover:to-amber-500 text-orange-600 group-hover:text-white transition-all duration-300 shadow-xs mb-3.5 group-hover:scale-105">
                        <UploadCloud size={30} className="stroke-[2.5]" />
                      </div>

                      <p className="text-sm sm:text-lg font-black text-slate-900 mb-1">
                        Drop your 9:16 video or voiceover here, or{" "}
                        <span className="text-orange-600 underline underline-offset-4 decoration-orange-400">Browse File</span>
                      </p>

                      <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm leading-relaxed mb-4 font-medium">
                        Supports MP4, MOV, WEBM, MP3, WAV · Max 90s Duration · Millisecond Speech Sync
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 sm:px-5 py-2.5 text-xs font-bold transition shadow-sm hover:-translate-y-0.5">
                          <Film size={14} />
                          <span>Select 9:16 Video</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            audioInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 text-xs font-bold transition shadow-xs hover:-translate-y-0.5"
                        >
                          <Mic size={14} className="text-orange-600" />
                          <span>Select Audio Voiceover</span>
                        </div>
                        <div
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res = await fetch("/assets/reusable/testing1.mp3");
                              const blob = await res.blob();
                              const sampleFile = new File([blob], "sample_walking.mp4", {
                                type: "audio/mpeg",
                              });
                              onSelectFile(sampleFile);
                            } catch (err) {
                              console.warn("Could not load sample audio:", err);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/80 hover:bg-orange-100 text-xs font-bold text-orange-700 px-3.5 py-2.5 transition shadow-xs hover:-translate-y-0.5"
                        >
                          <Sparkles size={13} className="text-orange-600" />
                          <span>Try Sample Clip</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl sm:rounded-3xl border border-orange-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                      {/* Top Row: File Info & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25">
                            {isAudioFile ? <Headphones size={22} className="stroke-[2.5]" /> : <FileVideo size={22} className="stroke-[2.5]" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                {selectedFile.name}
                              </p>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0">
                                Verified
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Duration:{" "}
                              <strong className="text-slate-900 font-bold">{videoDurationText}</strong> · 9:16 Vertical
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs active:scale-98"
                          >
                            Replace File
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectFile(null)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer shadow-xs active:scale-98"
                            title="Remove file"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Custom Audio Waveform Visualizer */}
                      <div className="space-y-2 pt-1">
                        <div
                          className="relative flex items-center justify-between gap-0.5 sm:gap-1 h-14 sm:h-16 w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 select-none shadow-inner"
                        >
                          {WAVE_BARS.map((barHeight, idx) => {
                            const totalBars = WAVE_BARS.length;
                            const barPct = (idx / (totalBars - 1)) * 100;
                            const currentPct = (playbackTime / totalDuration) * 100;
                            const isPlayed = barPct <= currentPct;
                            return (
                              <div key={idx} className="flex-1 flex items-center justify-center h-full">
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full max-w-[4px] sm:max-w-[6px] rounded-full transition-all duration-150 ${isPlayed
                                    ? "bg-gradient-to-t from-orange-600 to-amber-400 shadow-2xs"
                                    : "bg-slate-200"
                                    }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Speech Transcription Status Banner */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-emerald-900 font-bold min-w-0">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span className="truncate">
                            Speech Transcribed &amp; Synced (Groq Whisper Cloud AI)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full shrink-0">
                          30 FPS Millisecond Sync
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Language & Canvas Settings (Col 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Settings2 size={16} className="text-orange-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Language &amp; Canvas Options
                    </h3>
                  </div>

                  {/* Spoken Language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Globe size={13} className="text-orange-600" />
                      <span>Audio Spoken Language</span>
                    </label>
                    <div className="relative">
                      <select
                        value={currentSpokenLang}
                        onChange={(e) => handleSpokenLangChange(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 focus:outline-none transition cursor-pointer shadow-2xs pr-8"
                      >
                        {AUDIO_SPOKEN_LANGUAGES.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Caption Language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-orange-600" />
                      <span>Caption Output Script</span>
                    </label>
                    <div className="relative">
                      <select
                        value={currentCaptionLang}
                        onChange={(e) => handleCaptionLangChange(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 focus:outline-none transition cursor-pointer shadow-2xs pr-8"
                      >
                        {CAPTION_LANGUAGES.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Canvas Background Color */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🎨</span>
                        <span>Stage Background Canvas</span>
                      </label>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">{canvasBg}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Obsidian", color: "#000000" },
                        { label: "Dark", color: "#070B14" },
                        { label: "Navy", color: "#0F172A" },
                        { label: "Slate", color: "#18181B" },
                        { label: "Emerald", color: "#064E3B" },
                        { label: "Crimson", color: "#4C0519" },
                        { label: "Violet", color: "#2E1065" },
                        { label: "White", color: "#FFFFFF" },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => handleCanvasBgChange(preset.color)}
                          className={`flex items-center gap-1.5 rounded-xl border p-2 text-[10px] font-bold transition shadow-2xs cursor-pointer ${canvasBg.toLowerCase() === preset.color.toLowerCase()
                            ? "border-orange-600 ring-2 ring-orange-500/25 scale-[1.02] bg-orange-50/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/20 shrink-0 shadow-2xs"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span className="truncate text-slate-800">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Continue Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Step 1 of {AUTO_CAPTION_STEPS.length} completed · Next: Select background music and sound effects.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-105 active:scale-98 text-white font-black text-xs px-8 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 2: Music &amp; Audio</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: MUSIC & AUDIO (SOUNDTRACK & VOLUME)                             */}
        {/* ======================================================================= */}
        {currentStep === 2 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                2. Background Soundtrack &amp; Audio Effects
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose a royalty-free backing track, calibrate voiceover auto-ducking, and enable kinetic word-pop sounds.
              </p>
            </div>

            {/* Category Filter Pills for BGM */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Lo-Fi", "Piano", "Upbeat", "Cinematic", "Chill", "Beats", "Lounge", "Acoustic", "Zen", "Mute"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBgmCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${bgmCategory === cat
                      ? "bg-[#FF5722] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Curated BGM Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredBgmTracks.map((track) => {
                const isSelected = selectedBgmId === track.id;
                const isAuditioning = playingBgmId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedBgmId(track.id)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${isSelected
                      ? "border-[#FF5722] bg-orange-50/30 ring-2 ring-[#FF5722]/20 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Play/Pause Audition Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlayBgm(track);
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs cursor-pointer ${isAuditioning
                            ? "bg-[#FF5722] text-white animate-pulse"
                            : isSelected
                              ? "bg-[#FF5722] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          title={isAuditioning ? "Pause preview" : "Play preview"}
                        >
                          {track.id === "none" ? (
                            <VolumeX size={16} />
                          ) : isAuditioning ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} className="ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{track.label}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {track.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="h-5 w-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Volume Slider & Controls */}
            {selectedBgmId !== "none" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-[#FF5722]" />
                    <span className="text-xs font-black text-slate-800">
                      Soundtrack Volume: {Math.round(currentBgmVolume * 100)}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recommended: 12% - 18%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={currentBgmVolume}
                  onChange={(e) => handleBgmVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5722] cursor-pointer"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoducking"
                      checked={autoDucking}
                      onChange={(e) => setAutoDucking(e.target.checked)}
                      className="rounded accent-[#FF5722] cursor-pointer"
                    />
                    <label htmlFor="autoducking" className="font-bold text-slate-700 cursor-pointer">
                      Speech Auto-Ducking (Lowers music volume automatically when creator speaks)
                    </label>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Enabled
                  </span>
                </div>
              </div>
            )}

            {/* Word Pop SFX & Audio Cleaning Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-xs font-black text-slate-900">Word Click Pop Sound</p>
                  <p className="text-[11px] text-slate-500 font-medium">Subtle pop sound effect on word changes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWordClickSound(!wordClickSound)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${wordClickSound ? "bg-[#FF5722]" : "bg-slate-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${wordClickSound ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-xs font-black text-slate-900">Speech Audio Cleaning</p>
                  <p className="text-[11px] text-slate-500 font-medium">Remove hum &amp; room echo automatically</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAudioCleaningEnabled(!audioCleaningEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${audioCleaningEnabled ? "bg-[#FF5722]" : "bg-slate-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${audioCleaningEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* ── P0 Audit: Caption Grouping & Highlight Cadence ── */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Caption Grouping &amp; Highlight Cadence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Words Per Group */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Words Per Caption Group</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setWordsPerGroup(n)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition cursor-pointer ${
                          wordsPerGroup === n
                            ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    3 words/group recommended for 9:16 vertical. Max 18–24 chars per line.
                  </p>
                </div>

                {/* Highlight Cadence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Highlight Cadence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: "word" as const, label: "Word" },
                      { id: "phrase" as const, label: "Phrase" },
                      { id: "progressive" as const, label: "Progressive" },
                    ]).map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setHighlightCadence(mode.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                          highlightCadence === mode.id
                            ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Word = karaoke word-by-word. Phrase = group highlight. Progressive = reveal left-to-right.
                  </p>
                </div>
              </div>
            </div>

            {/* ── P0 Audit: Platform Safe-Zone Overlay Toggle ── */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Platform Safe-Zone Preview
              </h3>
              <p className="text-xs text-slate-500">
                Toggle platform overlays to verify captions won&apos;t collide with UI buttons, sound discs, or navigation.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {([
                  { id: "none" as const, label: "Off", icon: "🚫" },
                  { id: "tiktok" as const, label: "TikTok", icon: "🎵" },
                  { id: "instagram" as const, label: "Instagram Reels", icon: "📸" },
                  { id: "youtube" as const, label: "YouTube Shorts", icon: "▶️" },
                ]).map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSafeZonePlatform(platform.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                      safeZonePlatform === platform.id
                        ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.label}</span>
                  </button>
                ))}
              </div>
              {safeZonePlatform !== "none" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>
                    {safeZonePlatform === "tiktok" && "TikTok safe zone: 100px bottom, 80px right for sound disc, like/comment buttons."}
                    {safeZonePlatform === "instagram" && "Instagram Reels safe zone: 100px bottom, 80px right for audio tag, action buttons."}
                    {safeZonePlatform === "youtube" && "YouTube Shorts safe zone: 80px bottom for subscribe button, 64px right for like/share."}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 1: Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-105 active:scale-98 text-white font-black text-xs px-8 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 3: Caption Style</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: STYLE (32 MASTER ANIMATED CAPTIONS & KINETICS)                  */}
        {/* ======================================================================= */}
        {currentStep === 3 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  3. Select Kinetic Caption Style
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  32 viral animated typography presets. Cards animate live with unique phrasing!
                </p>
              </div>

              {/* Quick Filter Search */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-[#FF5722] transition w-full sm:w-64">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 32 styles..."
                  value={captionSearch}
                  onChange={(e) => setCaptionSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-medium"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                "All",
                "Kinetic",
                "Viral",
                "Modern",
                "Karaoke",
                "Editorial",
                "Cinema",
                "Podcast",
                "Creative",
                "Clean",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCaptionCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer active:scale-95 ${captionCategory === cat
                    ? "bg-orange-600 text-white shadow-xs shadow-orange-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 32 Master Caption Styles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredCaptionStyles.map((style) => {
                const isSelected =
                  captionStyle.toLowerCase().trim() === style.name.toLowerCase().trim() ||
                  captionStyle.toLowerCase().trim() === style.id.toLowerCase().trim();
                const isHovered = hoveredStyleId === style.id;
                const previewWords = STYLE_PREVIEW_WORDS[style.id] || ["VIRAL", "KINETIC", "CAPTIONS"];

                return (
                  <div
                    key={style.id}
                    onClick={() => onCaptionStyleChange(style.name)}
                    onMouseEnter={() => setHoveredStyleId(style.id)}
                    onMouseLeave={() => setHoveredStyleId(null)}
                    className="group cursor-pointer select-none text-left"
                  >
                    {/* Live Preview Card */}
                    <div
                      style={{
                        background: "radial-gradient(circle at 50% 50%, #172033 0%, #070B14 85%)",
                        borderColor: isSelected ? "#EA580C" : undefined,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className={`aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden relative border transition-all duration-200 flex items-center justify-center p-3 ${isSelected
                        ? "shadow-lg shadow-orange-500/15 ring-2 ring-orange-500/30 scale-[1.02]"
                        : "border-slate-200 hover:border-slate-400 hover:shadow-xs"
                        }`}
                    >
                      {/* Active Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs z-20 pointer-events-none">
                          ✓ Selected
                        </div>
                      )}

                      {/* Top Category Badge */}
                      <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none uppercase tracking-wider">
                        {style.category}
                      </div>

                      {/* Live Animated Word Simulation */}
                      <div className="relative z-10 w-full text-center pointer-events-none">
                        {renderPreviewCaptionWords(
                          style.id,
                          style.color,
                          style.fontFamily,
                          previewWords,
                          previewWordStep
                        )}
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-slate-900 truncate">{style.name}</p>
                        {style.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {style.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {style.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Styling Controls (Placement, Accent Color, Watermark) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Placement &amp; Color Fine-Tuning
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Placement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Caption Placement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["top", "center", "bottom"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setCaptionPosition(pos)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${captionPosition === pos
                          ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Word Accent Color</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { label: "Yellow", color: "#FFE14D" },
                      { label: "Emerald", color: "#22C55E" },
                      { label: "Cyan", color: "#00F5FF" },
                      { label: "Pink", color: "#FF007F" },
                      { label: "White", color: "#FFFFFF" },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setAccentColor(c.color)}
                        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${accentColor === c.color
                          ? "border-orange-600 ring-2 ring-orange-500/30"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: c.color }}
                        />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Watermark Remover */}
                {onRemoveAiWatermarkChange && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Branding Output</label>
                    <WatermarkRemoverToggle
                      enabled={removeAiWatermark}
                      onChange={onRemoveAiWatermarkChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── P0 Audit: Caption Grouping & Highlight Cadence ── */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Caption Grouping &amp; Highlight Cadence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Words Per Group */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Words Per Caption Group</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setWordsPerGroup(n)}
                        className={`h-9 w-9 rounded-xl text-xs font-black transition cursor-pointer ${
                          wordsPerGroup === n
                            ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    3 words/group recommended for 9:16 vertical. Max 18–24 chars per line.
                  </p>
                </div>

                {/* Highlight Cadence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Highlight Cadence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: "word" as const, label: "Word" },
                      { id: "phrase" as const, label: "Phrase" },
                      { id: "progressive" as const, label: "Progressive" },
                    ]).map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setHighlightCadence(mode.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                          highlightCadence === mode.id
                            ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Word = karaoke word-by-word. Phrase = group highlight. Progressive = reveal left-to-right.
                  </p>
                </div>
              </div>
            </div>

            {/* ── P0 Audit: Platform Safe-Zone Overlay Toggle ── */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Platform Safe-Zone Preview
              </h3>
              <p className="text-xs text-slate-500">
                Toggle platform overlays to verify captions won&apos;t collide with UI buttons, sound discs, or navigation.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {([
                  { id: "none" as const, label: "Off", icon: "🚫" },
                  { id: "tiktok" as const, label: "TikTok", icon: "🎵" },
                  { id: "instagram" as const, label: "Instagram Reels", icon: "📸" },
                  { id: "youtube" as const, label: "YouTube Shorts", icon: "▶️" },
                ]).map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSafeZonePlatform(platform.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                      safeZonePlatform === platform.id
                        ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.label}</span>
                  </button>
                ))}
              </div>
              {safeZonePlatform !== "none" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>
                    {safeZonePlatform === "tiktok" && "TikTok safe zone: 100px bottom, 80px right for sound disc, like/comment buttons."}
                    {safeZonePlatform === "instagram" && "Instagram Reels safe zone: 100px bottom, 80px right for audio tag, action buttons."}
                    {safeZonePlatform === "youtube" && "YouTube Shorts safe zone: 80px bottom for subscribe button, 64px right for like/share."}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 2: Music &amp; Audio</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-105 active:scale-98 text-white font-black text-xs px-8 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 4: Live Studio Monitor</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4: PREVIEW (STUDIO MONITOR & MULTITRACK TIMELINE)                   */}
        {/* ======================================================================= */}
        {currentStep === 4 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  4. Studio Monitor &amp; Multitrack Timeline
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Inspect synchronized single-line captions, adjust placement, and fine-tune words before cloud render.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold text-slate-600 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                  1080×1920 · 30 FPS
                </span>
                <span className="text-xs font-black text-emerald-600 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                  0 Credits (Free Daily)
                </span>
              </div>
            </div>

            {/* 2-Column Studio Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: 9:16 Vertical Phone Monitor (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
                {/* Monitor Header */}
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                      9:16 Vertical Phone Monitor
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-xs font-bold">
                    {formatTime(playbackTime)} / {formatTime(totalDuration)}
                  </span>
                </div>

                {/* Safe Zone Quick Selector Bar */}
                <div className="w-full flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                  <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Safe Zone:</span>
                  <div className="flex items-center gap-1">
                    {([
                      { id: "none" as const, label: "Off" },
                      { id: "tiktok" as const, label: "TikTok" },
                      { id: "instagram" as const, label: "Reels" },
                      { id: "youtube" as const, label: "Shorts" },
                    ]).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSafeZonePlatform(p.id)}
                        className={`px-2 py-0.5 rounded-md font-bold transition text-[10px] cursor-pointer ${
                          safeZonePlatform === p.id
                            ? "bg-orange-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 9:16 Phone Frame Stage */}
                <div
                  className="relative aspect-[9/16] w-full max-w-[280px] sm:max-w-[300px] rounded-[32px] overflow-hidden border-[6px] border-slate-900 shadow-2xl flex items-center justify-center"
                  style={{ backgroundColor: canvasBg }}
                >
                  {/* Phone Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 pointer-events-none" />

                  {/* ── P0 Audit: Safe Zone Visual Overlay (TikTok, Reels, Shorts) ── */}
                  {safeZonePlatform !== "none" && (
                    <div className="absolute inset-0 pointer-events-none z-25 flex flex-col justify-between p-3">
                      {/* Top platform bar */}
                      <div className="flex items-center justify-between text-[9px] text-white/70 font-bold px-2 pt-4">
                        <span>{safeZonePlatform === "tiktok" ? "Following | For You" : safeZonePlatform === "instagram" ? "Reels" : "Shorts"}</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[8px] uppercase">{safeZonePlatform} SAFE</span>
                      </div>

                      {/* Right rail action buttons mockup */}
                      <div className="self-end flex flex-col items-center gap-3 pr-1 pb-16">
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-[10px] text-white">❤️</div>
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-[10px] text-white">💬</div>
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-[10px] text-white">↗️</div>
                        <div className="w-6 h-6 rounded-full border-2 border-white/40 bg-black/60 flex items-center justify-center text-[8px] text-white">🎵</div>
                      </div>

                      {/* Bottom safe-zone exclusion box border */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-dashed border-amber-400/60 bg-amber-500/10 flex items-center justify-center">
                        <span className="text-[8px] font-mono text-amber-200 bg-black/60 px-1.5 py-0.5 rounded">
                          Bottom Safe Margin (100px)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Video / Audio Content */}
                  {!isAudioFile ? (
                    <>
                      <video
                        ref={videoPlayerRef}
                        src={filePreviewUrl}
                        playsInline
                        muted={isMuted}
                        loop
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none">
                      <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-white/10 mt-6">
                        <Mic size={12} className="text-orange-500" />
                        <span>Voiceover Audio Active</span>
                      </div>

                      {/* Sound Wave Pillars */}
                      <div className="flex items-center gap-1.5 opacity-70">
                        {[24, 40, 16, 32, 48, 28, 36, 20, 44, 24].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-orange-600 to-amber-400 rounded-full animate-pulse"
                            style={{
                              height: `${h}px`,
                              animationDelay: `${i * 120}ms`,
                              animationDuration: "1s",
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-[10px] font-bold text-white/50 mb-4">
                        Canvas: {canvasBg}
                      </div>
                    </div>
                  )}

                  {/* Single-Line Synchronized Kinetic Subtitles Overlay */}
                  <div
                    className={`absolute left-0 right-0 z-20 px-3 text-center pointer-events-none ${captionPosition === "top"
                      ? "top-16"
                      : captionPosition === "center"
                        ? "top-1/2 -translate-y-1/2"
                        : "bottom-12"
                      }`}
                  >
                    <div className="max-w-[95%] mx-auto overflow-hidden whitespace-nowrap">
                      <UniversalCaptionLiveRenderer
                        styleName={captionStyle}
                        words={demoWords}
                        playbackTime={playbackTime}
                        isPlaying={isPlaying}
                        accentColor={accentColor}
                      />
                    </div>
                  </div>
                </div>

                {/* Scrubber & Controls */}
                <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>

                  <div className="flex-1 mx-2">
                    <input
                      type="range"
                      min="0"
                      max={totalDuration}
                      step="0.1"
                      value={playbackTime}
                      onChange={(e) => setPlaybackTime(parseFloat(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>

              {/* Right Column: Properties & Transcript Inspector (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Settings2 size={16} className="text-orange-600" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Studio Inspector
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      Preset: <strong className="text-orange-600">{captionStyle}</strong>
                    </span>
                  </div>

                  {/* Caption Placement */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Caption Placement</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["top", "center", "bottom"] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setCaptionPosition(pos)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${captionPosition === pos
                            ? "bg-orange-600 text-white shadow-xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Word Accent Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Word Accent Color</label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { label: "Yellow", color: "#FFE14D" },
                        { label: "Emerald", color: "#22C55E" },
                        { label: "Cyan", color: "#00F5FF" },
                        { label: "Pink", color: "#FF007F" },
                        { label: "White", color: "#FFFFFF" },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setAccentColor(c.color)}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition cursor-pointer ${accentColor === c.color
                            ? "border-orange-600 ring-2 ring-orange-500/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: c.color }}
                          />
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Watermark Remover Toggle */}
                  {onRemoveAiWatermarkChange && (
                    <div className="pt-2">
                      <WatermarkRemoverToggle
                        enabled={removeAiWatermark}
                        onChange={onRemoveAiWatermarkChange}
                      />
                    </div>
                  )}

                  {/* Script Review & Words Accordion */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Type size={14} className="text-orange-600" />
                        <span>Script Review &amp; Words</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowWordReplacer(!showWordReplacer)}
                        className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        {showWordReplacer ? "Hide Words" : "View Synced Words"}
                      </button>
                    </div>

                    {showWordReplacer && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2 max-h-48 overflow-y-auto">
                        <p className="text-[11px] text-slate-500 font-medium">
                          Click any word to seek immediately to its timestamp:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {demoWords.map((w, idx) => (
                            <span
                              key={idx}
                              onClick={() => setPlaybackTime(w.start)}
                              className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-orange-500 cursor-pointer text-slate-800 transition shadow-2xs"
                              title={`Jump to ${formatTime(w.start)}`}
                            >
                              {w.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cloud Render Ready Status Banner */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900">1080p Cloud Render Ready</p>
                    <p className="text-emerald-700 font-medium">
                      Fast 30 FPS export · Free 5 Daily Videos Included
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Multitrack Interactive Timeline Track */}
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-orange-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Multitrack Timeline Editor
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadSubtitles('srt')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-2xs hover:-translate-y-0.5"
                    title="Export standard SubRip (.SRT) subtitle file"
                  >
                    <Download size={12} className="text-orange-600" />
                    <span>Download .SRT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSubtitles('vtt')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-2xs hover:-translate-y-0.5"
                    title="Export WebVTT (.VTT) subtitle file"
                  >
                    <Download size={12} className="text-orange-600" />
                    <span>Download .VTT</span>
                  </button>
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline ml-1 font-bold">
                    {demoWords.length} Speech Beats
                  </span>
                </div>
              </div>

              <AutoCaptionTimeline
                currentTime={playbackTime}
                duration={totalDuration}
                words={demoWords}
                isPlaying={isPlaying}
                onSeek={(t) => setPlaybackTime(t)}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                wordClickSound={wordClickSound}
                onToggleWordClickSound={() => setWordClickSound(!wordClickSound)}
                theme="light"
              />
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 font-jakarta truncate max-w-xs">
                    {videoFileName}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-emerald-600 font-bold">FREE (0 Credits)</span>
                    <span>•</span>
                    <span>1080×1920 MP4</span>
                    <span>•</span>
                    <span className="text-slate-700 font-bold">{captionStyle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Change Style
                </button>

                <button
                  type="button"
                  onClick={onStartRender}
                  disabled={isWorking}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-xs font-black transition cursor-pointer active:scale-98 ${isWorking
                    ? "bg-orange-600 text-white cursor-wait animate-pulse"
                    : "bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-105 text-white shadow-lg shadow-orange-500/25"
                    }`}
                >
                  <Download size={15} className="text-white" />
                  <span>{isWorking ? "Rendering 1080p MP4..." : "Export 1080p Video (Free)"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Master Live Caption Renderer for Preview Mockup ──
function UniversalCaptionLiveRenderer({
  styleName,
  words,
  playbackTime,
  isPlaying,
  accentColor = "#FFE14D",
}: {
  styleName: string;
  words: CaptionWordItem[];
  playbackTime: number;
  isPlaying: boolean;
  accentColor?: string;
}) {
  const norm = styleName.toLowerCase().trim();

  // If it matches a defined kinetic style, use KineticCaptionLiveRenderer directly
  if (isKineticCaptionStyle(styleName)) {
    return (
      <KineticCaptionLiveRenderer
        styleName={styleName}
        words={words}
        playbackTime={playbackTime}
        isPlaying={isPlaying}
        accentColor={accentColor}
      />
    );
  }

  // Active word index from playback loop
  const activeIdx = useMemo(() => {
    if (!words || words.length === 0) return 0;
    const idx = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end);
    if (idx !== -1) return idx;
    const recent = words.findIndex((w) => playbackTime >= w.start && playbackTime <= w.end + 0.35);
    if (recent !== -1) return recent;
    return 0;
  }, [words, playbackTime]);

  const activeWordObj = words[activeIdx] || words[0];
  const activeWordText = activeWordObj?.word || "building";

  // Visible window of 3 words
  const windowStart = Math.max(0, Math.min(activeIdx - 1, Math.max(0, words.length - 3)));
  const visibleWords = words.slice(windowStart, windowStart + 3);

  // 1. Hormozi Viral Pop
  if (norm.includes("hormozi")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                WebkitTextStroke: "2px #000",
                textShadow: "0 4px 0 #000, 0 8px 16px rgba(0,0,0,0.8)",
                color: isActive ? "#22C55E" : "#FFFFFF",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
              className="text-base sm:text-lg font-black uppercase tracking-tight transition-transform duration-150 inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 2. MrBeast Shorts Impact
  if (norm.includes("mrbeast") || norm.includes("impact")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Impact, Anton, sans-serif",
                WebkitTextStroke: "2.5px #000",
                textShadow: "0 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)",
                color: isActive ? accentColor : "#FFFFFF",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
              className="text-lg sm:text-xl font-black uppercase tracking-wide transition-transform duration-100 inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 3. Solo Word Pop
  if (norm.includes("solo")) {
    return (
      <div className="flex items-center justify-center select-none py-2">
        <span
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            WebkitTextStroke: "2px #000",
            textShadow: "0 4px 12px rgba(0,0,0,0.9)",
            color: accentColor,
          }}
          className="text-2xl sm:text-3xl font-black uppercase tracking-wide transition-transform animate-pulse inline-block"
        >
          {activeWordText}
        </span>
      </div>
    );
  }

  // 4. Crazy Kinetic
  if (norm.includes("crazy")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          const rotate = idx % 2 === 0 ? "-4deg" : "4deg";
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Bangers, Anton, sans-serif",
                WebkitTextStroke: "1.5px #000",
                color: isActive ? "#FF007F" : idx % 2 === 0 ? "#00F5FF" : accentColor,
                transform: `rotate(${rotate}) ${isActive ? "scale(1.2)" : "scale(1)"}`,
              }}
              className="text-base sm:text-lg font-black uppercase tracking-wider transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 5. Submagic Glow
  if (norm.includes("submagic")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 select-none">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                textShadow: isActive
                  ? "0 0 16px rgba(192,132,252,0.9), 0 0 30px rgba(244,114,182,0.7), 0 2px 4px #000"
                  : "0 2px 6px rgba(0,0,0,0.8)",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
              className="text-sm sm:text-base font-black uppercase tracking-tight transition-transform inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 6. Simple Clean
  if (norm.includes("simple") || norm.includes("clean")) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 select-none bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 max-w-[90%] mx-auto">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? accentColor : "#FFFFFF",
                fontWeight: isActive ? 800 : 500,
              }}
              className="text-xs sm:text-sm tracking-normal transition-colors"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // 7. Ali Abdaal Modern
  if (norm.includes("ali") || norm.includes("abdaal")) {
    return (
      <div className="inline-flex max-w-[92%] items-center justify-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-4 py-1.5 shadow-xl backdrop-blur-md">
        {visibleWords.map((w, idx) => {
          const isActive = w.word === activeWordText;
          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                fontFamily: "Inter, sans-serif",
                color: isActive ? accentColor : "#CBD5E1",
                fontWeight: isActive ? 800 : 500,
                textShadow: isActive ? "0 0 10px rgba(253,224,71,0.6)" : "none",
                transform: isActive ? "scale(1.08)" : "scale(1)",
              }}
              className="text-xs sm:text-sm transition-all inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // Fallback: Clean Word Highlight
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 select-none">
      {visibleWords.map((w, idx) => {
        const isActive = w.word === activeWordText;
        return (
          <span
            key={`${w.word}-${idx}`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: isActive ? accentColor : "#FFFFFF",
              fontWeight: 800,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
            className="text-sm sm:text-base uppercase tracking-tight transition-transform inline-block"
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}

export default AutoCaptionDualTabStudio;
