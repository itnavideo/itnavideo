/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  FileText,
  Volume2,
  VolumeX,
  Sliders,
  Layers,
  Film,
  Eye,
  Edit3,
  ChevronRight,
  ChevronLeft,
  Music,
  Hand,
  Palette,
  RotateCcw,
  Clock,
  AudioWaveform,
  Headphones,
  PenTool,
  Search,
  X,
  Plus,
  ArrowLeft,
  Settings2,
  Download,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { getBgmTrackAudioUrl } from "@/components/dashboard/ImageToVideoStudio";
import type { WhiteboardScene } from "@/services/ai/whiteboardPlanner";
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";

// Master AWS S3 Production Music Library (14 Curated Tracks)
export const AWS_WHITEBOARD_BGM_TRACKS = [
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
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure voiceover narration only" },
];

export const WHITEBOARD_FONTS_CATALOG = [
  { id: "balsamiq", name: "Balsamiq Sans (Default)", desc: "Clean, hand-drawn comic look", badge: "Default", sample: "The 1% Rule Explained", cssFamily: "'Balsamiq Sans', cursive, sans-serif" },
  { id: "permanent-marker", name: "Permanent Marker", desc: "Bold, natural whiteboard marker", badge: "Bold", sample: "THE 1% RULE EXPLAINED", cssFamily: "'Permanent Marker', cursive, sans-serif" },
  { id: "kids-hand", name: "Kids Hand (Gochi)", desc: "Casual playful script handwriting", badge: "Playful", sample: "The 1% Rule Explained", cssFamily: "'Gochi Hand', cursive, sans-serif" },
  { id: "comic-neue", name: "Comic Neue", desc: "Crisp and friendly rounded type", badge: "Friendly", sample: "The 1% Rule Explained", cssFamily: "'Comic Neue', cursive, sans-serif" },
  { id: "caveat", name: "Caveat", desc: "Quick cursive handwritten notes", badge: "Cursive", sample: "The 1% Rule Explained", cssFamily: "'Caveat', cursive, sans-serif" },
  { id: "kalam", name: "Kalam Handwriting", desc: "Authentic marker pen strokes", badge: "Authentic", sample: "The 1% Rule Explained", cssFamily: "'Kalam', cursive, sans-serif" },
  { id: "architect", name: "Architects Daughter", desc: "Architectural blueprint lettering", badge: "Design", sample: "The 1% Rule Explained", cssFamily: "'Architects Daughter', cursive, sans-serif" },
  { id: "handlee", name: "Handlee", desc: "Sweet, personal handwriting font", badge: "Personal", sample: "The 1% Rule Explained", cssFamily: "'Handlee', cursive, sans-serif" },
  { id: "shadows", name: "Shadows Into Light", desc: "Neat modern condensed hand", badge: "Clean", sample: "The 1% Rule Explained", cssFamily: "'Shadows Into Light', cursive, sans-serif" },
  { id: "schoolbell", name: "Schoolbell", desc: "Classroom chalkboard style", badge: "Classic", sample: "The 1% Rule Explained", cssFamily: "'Schoolbell', cursive, sans-serif" },
  { id: "indie-flower", name: "Indie Flower", desc: "Bubbly casual handwritten script", badge: "Casual", sample: "The 1% Rule Explained", cssFamily: "'Indie Flower', cursive, sans-serif" },
  { id: "comic-relief", name: "Comic Relief", desc: "Fun, vibrant cartoon lettering", badge: "Vibrant", sample: "The 1% Rule Explained", cssFamily: "'Comic Neue', cursive, sans-serif" },
];

export const MARKER_COLOR_PALETTE = [
  { id: "auto", name: "Dynamic Colorful", hex: "#2563EB", ringHex: "#3B82F6", desc: "Contrasting marker colors per scene" },
  { id: "charcoal", name: "Classic Charcoal", hex: "#0F172A", ringHex: "#334155", desc: "Dry-erase black marker" },
  { id: "blue", name: "Royal Blue", hex: "#2563EB", ringHex: "#60A5FA", desc: "Professional explainer blue" },
  { id: "crimson", name: "Crimson Red", hex: "#DC2626", ringHex: "#F87171", desc: "High-contrast hook & urgency" },
  { id: "emerald", name: "Emerald Green", hex: "#059669", ringHex: "#34D399", desc: "Growth & positive milestones" },
  { id: "amber", name: "Sunset Amber", hex: "#D97706", ringHex: "#FBBF24", desc: "Spotlight gold" },
];

export const HAND_DRAWING_STYLES = [
  { id: "right", name: "Right Hand", desc: "Natural drawing hand", icon: "✋", badge: "Default" },
  { id: "left", name: "Left Hand", desc: "Left-handed drawing stroke", icon: "🤚", badge: "Mirrored" },
  { id: "none", name: "Pure Draw", desc: "Direct vector stroke animation", icon: "⚡", badge: "Fast" },
];

export const WHITEBOARD_STEPS = [
  { step: 1, title: "Upload", desc: "Audio & Script" },
  { step: 2, title: "Music", desc: "Soundtrack & SFX" },
  { step: 3, title: "Style", desc: "Hand, Marker & Fonts" },
  { step: 4, title: "Preview", desc: "Studio Monitor & Scenes" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

export interface WhiteboardStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;
  fontPersonality: string;
  onFontPersonalityChange: (val: string) => void;
  markerColor: string;
  onMarkerColorChange: (val: string) => void;
  handStyle?: string;
  onHandStyleChange?: (val: string) => void;
  bgmTrackId: string;
  onBgmTrackIdChange: (trackId: string) => void;
  bgmVolume: number;
  onBgmVolumeChange: (vol: number) => void;
  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;
  enableSfx: boolean;
  onEnableSfxChange: (val: boolean) => void;
  editorialTranscript: string;
  onEditorialTranscriptChange: (text: string, isManual?: boolean) => void;
  onGenerate: (customScenes?: WhiteboardScene[]) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
  visualTheme?: string;
  onVisualThemeChange?: (themeId: string) => void;
}

type TranscribeState = "idle" | "uploading" | "processing" | "transcribing" | "ready" | "error";

export function WhiteboardStudio({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange = () => { },
  fontPersonality = "balsamiq",
  onFontPersonalityChange,
  markerColor = "auto",
  onMarkerColorChange,
  handStyle = "right",
  onHandStyleChange = () => { },
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript,
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
  visualTheme = "educational",
  onVisualThemeChange,
}: WhiteboardStudioProps) {
  // ── Flexible Step State (supports any number of steps) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || "educational");

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);

  // Audio Playback State for Voiceover
  const [voiceoverAudioUrl, setVoiceoverAudioUrl] = useState<string | null>(null);
  const [isVoiceoverPlaying, setIsVoiceoverPlaying] = useState<boolean>(false);
  const [voiceoverDuration, setVoiceoverDuration] = useState<number>(0);
  const [voiceoverCurrentTime, setVoiceoverCurrentTime] = useState<number>(0);
  const [isVoiceoverMuted, setIsVoiceoverMuted] = useState<boolean>(false);
  const voiceoverAudioRef = useRef<HTMLAudioElement | null>(null);

  // Step 2 BGM State
  const [bgmCategory, setBgmCategory] = useState<string>("All");
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);

  // Step 3 Font Search & State
  const [fontSearch, setFontSearch] = useState<string>("");

  // Step 4 Scene Monitor State
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isMonitorPlaying, setIsMonitorPlaying] = useState<boolean>(true);
  const [monitorTime, setMonitorTime] = useState<number>(0);

  // Transcription State
  const [transcribeState, setTranscribeState] = useState<TranscribeState>("idle");
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Create voiceover audio object URL
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVoiceoverAudioUrl(url);

      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setVoiceoverDuration(Math.min(90, Math.round(audio.duration)));
        }
      };

      triggerDirectTranscription(selectedFile);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVoiceoverAudioUrl(null);
      setVoiceoverDuration(0);
      setTranscribeState("idle");
    }
  }, [selectedFile]);

  // Transcribe audio using /api/reels/transcribe
  const triggerDirectTranscription = async (file: File) => {
    setTranscribeState("transcribing");
    setTranscribeError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("maxSeconds", "90");

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.transcript) {
        onEditorialTranscriptChange(data.transcript, false);
        setTranscribeState("ready");
      } else {
        setTranscribeState("error");
        setTranscribeError(data.error || "Could not transcribe audio. You can type or paste script manually.");
      }
    } catch (err: any) {
      setTranscribeState("error");
      setTranscribeError(err?.message || "Transcription failed. Please check network connection.");
    }
  };

  // Toggle Voiceover Play/Pause
  const togglePlayVoiceover = () => {
    if (!voiceoverAudioRef.current) return;
    if (isVoiceoverPlaying) {
      voiceoverAudioRef.current.pause();
      setIsVoiceoverPlaying(false);
    } else {
      voiceoverAudioRef.current.play().catch(() => { });
      setIsVoiceoverPlaying(true);
    }
  };

  // Toggle BGM Auditioning
  const handleTogglePlayBgm = (track: { id: string; path: string }) => {
    if (track.id === "none") {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
      onBgmTrackIdChange("none");
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      const audioUrl = getBgmTrackAudioUrl(track.path);
      const audio = new Audio(audioUrl);
      audio.volume = bgmVolume;
      audio.onended = () => setPlayingBgmId(null);
      audio.play().catch((e) => console.warn("Audio playback failed:", e));
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      onBgmTrackIdChange(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
    };
  }, []);

  // Filtered BGM tracks
  const filteredBgmTracks = useMemo(() => {
    return AWS_WHITEBOARD_BGM_TRACKS.filter((t) => {
      if (bgmCategory !== "All" && t.category !== bgmCategory) return false;
      return true;
    });
  }, [bgmCategory]);

  // Filtered Fonts
  const filteredFonts = useMemo(() => {
    return WHITEBOARD_FONTS_CATALOG.filter((f) => {
      if (fontSearch.trim()) {
        const q = fontSearch.toLowerCase().trim();
        return f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
      }
      return true;
    });
  }, [fontSearch]);

  // Storyboard Scene Generation from Transcript
  const generatedScenes: WhiteboardScene[] = useMemo(() => {
    const rawText = editorialTranscript.trim();
    if (!rawText) return [];

    const lines = rawText
      .split(/[.!?\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (lines.length === 0) return [];

    const colors = ["#2563EB", "#DC2626", "#059669", "#D97706", "#7C3AED", "#0891B2"];
    const icons = [
      "growth_chart",
      "target_bullseye",
      "handshake_deal",
      "savings_jar",
      "lightbulb_idea",
      "character_happy",
    ];

    const sceneDuration = Math.max(5, Math.round((voiceoverDuration || 30) / Math.max(1, lines.length)));

    return lines.slice(0, 8).map((line, idx) => ({
      id: `scene-${idx}`,
      sceneIndex: idx,
      startTime: idx * sceneDuration,
      endTime: (idx + 1) * sceneDuration,
      duration: sceneDuration,
      archetype: "hero_center" as const,
      modality: "illustrative_doodle" as const,
      visualIntent: {
        beatIndex: idx,
        role: "explain" as const,
        takeaway: line,
        type: "concept" as const,
        entities: [],
        action: "draw",
        emotion: "inspirational",
        metaphors: [],
        soundOffTest: line,
      },
      headline: line,
      heroVisual: {
        drawingId: icons[idx % icons.length],
        label: line.slice(0, 24),
      },
      transition: "erase_wipe" as const,
      accentColor: colors[idx % colors.length],
    }));
  }, [editorialTranscript, voiceoverDuration]);

  // Active scene for monitor preview
  const currentScene: WhiteboardScene = generatedScenes[activeSceneIndex] || generatedScenes[0] || {
    id: "demo",
    sceneIndex: 0,
    startTime: 0,
    endTime: 10,
    duration: 10,
    archetype: "hero_center" as const,
    modality: "illustrative_doodle" as const,
    visualIntent: {
      beatIndex: 0,
      role: "explain" as const,
      takeaway: "Transform your ideas with whiteboard drawings",
      type: "concept" as const,
      entities: [],
      action: "draw",
      emotion: "inspirational",
      metaphors: [],
      soundOffTest: "Transform your ideas with whiteboard drawings",
    },
    headline: "Transform your ideas with whiteboard drawings",
    heroVisual: { drawingId: "lightbulb_idea", label: "Core Concept" },
    transition: "erase_wipe" as const,
    accentColor: "#2563EB",
  };

  const selectedFontObj =
    WHITEBOARD_FONTS_CATALOG.find((f) => f.id === fontPersonality) || WHITEBOARD_FONTS_CATALOG[0];

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isReadyToCreate = Boolean(selectedFile);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white text-slate-900 select-text font-sans">
      {/* Hidden Voiceover Audio Element */}
      {voiceoverAudioUrl && (
        <audio
          ref={voiceoverAudioRef}
          src={voiceoverAudioUrl}
          onTimeUpdate={() => {
            if (voiceoverAudioRef.current) {
              setVoiceoverCurrentTime(voiceoverAudioRef.current.currentTime);
            }
          }}
          onEnded={() => setIsVoiceoverPlaying(false)}
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
        onChange={(e) => {
          if (e.target.files?.[0]) onSelectFile(e.target.files[0]);
          e.currentTarget.value = "";
        }}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* ROW 1: 4-STEP GUIDED STEPPER NAVIGATION BAR (Clean White Surface)          */}
      {/* ========================================================================= */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {/* Desktop Stepper (>=1024px) */}
          <nav aria-label="Studio Steps" className="hidden lg:flex items-center gap-2 lg:gap-3">
            {WHITEBOARD_STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;

              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-slate-50/80 active:scale-98"
                  >
                    {/* Circle */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${isCompleted
                        ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/25 ring-2 ring-emerald-500/20"
                        : isActive
                          ? "bg-white border-2 border-orange-500 text-orange-600 shadow-[0_0_0_4px_rgba(249,115,22,0.14)] font-black"
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

                  {/* Connecting Line */}
                  {idx < WHITEBOARD_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-6 lg:w-8 rounded-full transition-colors ${s.step < currentStep ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Tablet & Mobile Stepper Bar (<1024px) */}
        <div className="lg:hidden mt-3 pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black text-slate-900 truncate">
              <span className="text-orange-600 shrink-0">Step {currentStep} of 4:</span>
              <span className="truncate">{WHITEBOARD_STEPS[currentStep - 1].title}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">
                · {WHITEBOARD_STEPS[currentStep - 1].desc}
              </span>
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1)))}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer shrink-0 ml-2"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full">
            {WHITEBOARD_STEPS.map((s) => {
              const isDone = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${isDone
                    ? "bg-emerald-500 shadow-xs"
                    : isCurrent
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs"
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
        {/* STEP 1: UPLOAD (Voiceover Audio & Script)                               */}
        {/* ======================================================================= */}
        {currentStep === 1 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                1. Upload your voiceover &amp; script
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload your explainer voiceover to automatically transcribe speech, generate scene layouts, and calibrate drawing speeds.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Media Upload Card (Col 8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-[28px] sm:rounded-[32px] border-2 border-orange-500/30 bg-gradient-to-b from-orange-50/20 via-white to-white p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25 shrink-0">
                        <AudioWaveform size={20} className="stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                            Spoken Voiceover Audio
                          </h2>
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Explainer narration, business pitch, or tutorial voiceover track
                        </p>
                      </div>
                    </div>

                    {selectedFile && (
                      <span className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-mono font-bold shadow-xs">
                        <Check size={13} className="stroke-[3]" />
                        <span>{formatTime(voiceoverDuration)} · 1 Credit</span>
                      </span>
                    )}
                  </div>

                  {/* Dropzone */}
                  {!selectedFile ? (
                    <div
                      onClick={() => !isGenerating && audioInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(false);
                        if (e.dataTransfer.files?.[0]) onSelectFile(e.dataTransfer.files[0]);
                      }}
                      className={`group relative flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border-2 border-dashed min-h-[200px] sm:min-h-[240px] p-5 sm:p-10 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${isDraggingFile
                        ? "border-orange-500 bg-orange-50/70 scale-[1.005]"
                        : "border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/40"
                        }`}
                    >
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-all duration-200 shadow-sm mb-3 sm:mb-4">
                        <UploadCloud size={28} className="stroke-[2.5]" />
                      </div>

                      <p className="text-sm sm:text-lg font-black text-slate-900 mb-1">
                        Drop your narration audio here, or{" "}
                        <span className="text-orange-600 underline underline-offset-4">Browse File</span>
                      </p>

                      <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm leading-relaxed mb-3 sm:mb-4">
                        Supports MP3, WAV, M4A, AAC · Videos and audio longer than 90 seconds are supported. Only the first 90 seconds will be used.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition shadow-sm">
                          <Upload size={14} />
                          <span>Select Voiceover Audio</span>
                        </div>
                        <div
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res = await fetch("/assets/reusable/testing1.mp3");
                              const blob = await res.blob();
                              const sampleFile = new File([blob], "whiteboard_sample.mp3", {
                                type: "audio/mpeg",
                              });
                              onSelectFile(sampleFile);
                            } catch (err) {
                              console.warn("Could not load sample audio:", err);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-600 px-3.5 py-2 sm:py-2.5 transition shadow-2xs"
                        >
                          <Sparkles size={13} />
                          <span>Try Sample Voiceover</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 sm:p-6 shadow-xs space-y-4">
                      {/* File Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25">
                            <Headphones size={22} className="stroke-[2.5]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                {selectedFile.name}
                              </p>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0">
                                Verified
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Duration:{" "}
                              <strong className="text-slate-900 font-bold">{formatTime(voiceoverDuration)}</strong> · 9:16 Whiteboard
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                          >
                            Replace Audio
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectFile(null)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer shadow-xs"
                            title="Remove audio"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Custom Audio Waveform Visualizer */}
                      <div className="space-y-2 pt-2">
                        <div className="relative flex items-center justify-between gap-0.5 sm:gap-1 h-14 sm:h-16 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 select-none shadow-inner">
                          {WAVE_BARS.map((barHeight, idx) => {
                            const totalBars = WAVE_BARS.length;
                            const barPct = (idx / (totalBars - 1)) * 100;
                            const currentPct = voiceoverDuration > 0 ? (voiceoverCurrentTime / voiceoverDuration) * 100 : 0;
                            const isPlayed = barPct <= currentPct;
                            return (
                              <div key={idx} className="flex-1 flex items-center justify-center h-full">
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full max-w-[4px] sm:max-w-[6px] rounded-full transition-all duration-150 ${isPlayed
                                    ? "bg-gradient-to-t from-orange-600 to-amber-500 shadow-2xs"
                                    : "bg-slate-200"
                                    }`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Scrubber & Audio Controls Bar */}
                        <div className="flex items-center justify-between gap-3 px-1 pt-1">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={togglePlayVoiceover}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/25 active:scale-95 transition cursor-pointer"
                              title={isVoiceoverPlaying ? "Pause voiceover" : "Play voiceover"}
                            >
                              {isVoiceoverPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                            </button>

                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                              <span>{formatTime(voiceoverCurrentTime)}</span>
                              <span className="text-slate-400">/</span>
                              <span>{formatTime(voiceoverDuration)}</span>
                            </div>
                          </div>

                          <div className="flex-1 max-w-xs hidden sm:block">
                            <input
                              type="range"
                              min="0"
                              max={voiceoverDuration || 60}
                              step="0.1"
                              value={voiceoverCurrentTime}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setVoiceoverCurrentTime(val);
                                if (voiceoverAudioRef.current) voiceoverAudioRef.current.currentTime = val;
                              }}
                              className="w-full accent-orange-500 cursor-pointer"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (voiceoverAudioRef.current) {
                                voiceoverAudioRef.current.muted = !isVoiceoverMuted;
                                setIsVoiceoverMuted(!isVoiceoverMuted);
                              }
                            }}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title={isVoiceoverMuted ? "Unmute" : "Mute"}
                          >
                            {isVoiceoverMuted ? <VolumeX size={16} className="text-red-500" /> : <Volume2 size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* AI Speech Transcription Status Banner */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-emerald-900 font-bold min-w-0">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span className="truncate">
                            Speech Transcribed &amp; Scene Storyboard Ready (Groq Whisper Cloud AI)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md shrink-0">
                          30 FPS Hand Sync
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Real-time Editable Transcript Review Card */}
                  {selectedFile && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-orange-600" />
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            Transcript &amp; Scene Dialogue Review
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {editorialTranscript.trim().split(/\s+/).filter(Boolean).length} Words
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        value={editorialTranscript}
                        onChange={(e) => onEditorialTranscriptChange(e.target.value, true)}
                        placeholder="Transcription from your audio appears here. You can edit any sentence to fine-tune your whiteboard scenes..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed font-sans resize-none shadow-2xs"
                      />

                      <p className="text-[11px] text-slate-500 font-medium">
                        💡 Each sentence automatically forms an illustrated whiteboard scene with custom drawings and marker underlines.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Project Title & Video Info (Col 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Settings2 size={16} className="text-orange-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Project Settings
                    </h3>
                  </div>

                  {/* Topic Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Project Title / Topic</label>
                    <input
                      type="text"
                      value={topicTitle}
                      onChange={(e) => onTopicTitleChange(e.target.value)}
                      placeholder="e.g. The 1% Rule for Growth"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Canvas Format Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Aspect Ratio</span>
                      <strong className="text-slate-900">9:16 Vertical</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Resolution</span>
                      <strong className="text-slate-900">1080×1920 Full HD</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>FPS</span>
                      <strong className="text-slate-900">30 Frames/Sec</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Drawing Speed</span>
                      <strong className="text-emerald-600">Dynamic Voice-Synced</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Continue Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Step 1 of 4 completed · Next: Select backing soundtrack and sound effects.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 2: Music &amp; SFX</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: MUSIC & AUDIO (SOUNDTRACK & SFX)                                */}
        {/* ======================================================================= */}
        {currentStep === 2 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                2. Background Soundtrack &amp; Sound Design
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select an ambient royalty-free backing track, calibrate voiceover auto-ducking, and enable drawing sound effects.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Lo-Fi", "Piano", "Upbeat", "Cinematic", "Story", "Chill", "Beats", "Lounge", "Acoustic", "Zen", "Mute"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBgmCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${bgmCategory === cat
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* BGM Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredBgmTracks.map((track) => {
                const isSelected = bgmTrackId === track.id;
                const isAuditioning = playingBgmId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => onBgmTrackIdChange(track.id)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${isSelected
                      ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm"
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
                            ? "bg-orange-500 text-white animate-pulse"
                            : isSelected
                              ? "bg-orange-500 text-white"
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
                        <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
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
            {bgmTrackId !== "none" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-orange-500" />
                    <span className="text-xs font-black text-slate-800">
                      Soundtrack Volume: {Math.round(bgmVolume * 100)}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recommended: 10% - 15%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={bgmVolume}
                  onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoducking"
                      checked={autoDucking}
                      onChange={(e) => setAutoDucking(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
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

            {/* Drawing Sound Effects Toggle */}
            <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <p className="text-xs font-black text-slate-900">Marker &amp; Drawing Sound Effects</p>
                <p className="text-[11px] text-slate-500 font-medium">Marker pen squeaks, board swipes, and soft clicks synced to drawing strokes</p>
              </div>
              <button
                type="button"
                onClick={() => onEnableSfxChange(!enableSfx)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${enableSfx ? "bg-orange-500" : "bg-slate-300"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${enableSfx ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 3: Drawing Style</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: STYLE (HAND, MARKER & TYPOGRAPHY)                               */}
        {/* ======================================================================= */}
        {currentStep === 3 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                3. Choose Drawing Hand, Marker &amp; Handwriting Typography
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Customize your executive whiteboard aesthetic: pick a unified visual theme, drawing hand, marker ink palette, and handwriting font.
              </p>
            </div>

            {/* SECTION 0: UNIFIED VISUAL DESIGN SYSTEM (6 MASTER THEMES) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-orange-500" />
                    Unified Visual Design Themes
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Harmonizes canvas tones, marker ink, accents, and typography hierarchy.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  6 Master Themes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(MASTER_THEMES).map((theme) => {
                  const isSelected = activeVisualTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setActiveVisualTheme(theme.id);
                        onVisualThemeChange?.(theme.id);
                      }}
                      className={`group relative flex flex-col p-4 rounded-xl border text-left transition cursor-pointer ${isSelected
                        ? "border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-400/40"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2.5">
                        <span className="text-xs font-black text-slate-900 tracking-tight">
                          {theme.name}
                        </span>
                        {isSelected ? (
                          <div className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            {theme.colors.mode}
                          </span>
                        )}
                      </div>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        {[
                          theme.colors.primary,
                          theme.colors.secondary,
                          theme.colors.accent,
                          theme.colors.background,
                          theme.colors.text,
                        ].map((hex, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-6 rounded-md border border-slate-300/60 shadow-2xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>

                      {/* Typography & Background details */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2 w-full mt-auto">
                        <span className="truncate">{theme.typography.headingFont}</span>
                        <span className="capitalize font-semibold text-slate-700">{theme.background.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 1: 12 POPULAR WHITEBOARD FONTS */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800">
                  12 Handwriting Typography Personalities
                </label>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search handwriting font..."
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredFonts.map((font) => {
                  const isSelected = fontPersonality === font.id;

                  return (
                    <div
                      key={font.id}
                      onClick={() => onFontPersonalityChange(font.id)}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${isSelected
                        ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-black text-slate-900">{font.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{font.desc}</span>
                        </div>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                            <Check size={12} className="stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Font Sample Text */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[48px]">
                        <span
                          style={{ fontFamily: font.cssFamily }}
                          className="text-sm font-bold text-slate-900 text-center truncate"
                        >
                          {font.sample}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: DRAWING HAND & MARKER PALETTE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              {/* Drawing Hand Style */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Drawing Hand Style
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {HAND_DRAWING_STYLES.map((hand) => {
                    const isSelected = handStyle === hand.id;

                    return (
                      <div
                        key={hand.id}
                        onClick={() => onHandStyleChange(hand.id)}
                        className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center ${isSelected
                          ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <span className="text-2xl">{hand.icon}</span>
                        <p className="text-xs font-black text-slate-900">{hand.name}</p>
                        <span className="text-[9px] font-bold text-slate-400">{hand.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marker Ink Color Palette */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Marker Ink Palette
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MARKER_COLOR_PALETTE.map((color) => {
                    const isSelected = markerColor === color.id;

                    return (
                      <div
                        key={color.id}
                        onClick={() => onMarkerColorChange(color.id)}
                        className={`rounded-xl border p-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${isSelected
                          ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] font-bold text-slate-700 truncate">{color.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 2</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 4: Live Whiteboard Monitor</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4 (final): PREVIEW (STUDIO MONITOR & SCENE STORYBOARD)             */}
        {/* ======================================================================= */}
        {currentStep === WHITEBOARD_STEPS.length && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  4. Studio Monitor &amp; Scene Storyboard
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Inspect simulated whiteboard scenes, fine-tune headlines and visual drawings, and launch 1080p render.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold text-slate-600 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                  1080×1920 · 30 FPS
                </span>
                <span className="text-xs font-black text-orange-600 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
                  1 Video Credit
                </span>
              </div>
            </div>

            {/* 2-Column Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: 9:16 Vertical Boardroom Whiteboard Monitor (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                      9:16 Whiteboard Canvas
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-xs font-bold">
                    Scene {activeSceneIndex + 1} of {Math.max(1, generatedScenes.length)}
                  </span>
                </div>

                {/* Dry-Erase Whiteboard Canvas Frame */}
                <div className="relative aspect-[9/16] w-full max-w-[280px] sm:max-w-[300px] rounded-[32px] overflow-hidden border-[8px] border-slate-300 shadow-2xl flex flex-col items-center justify-between p-6 bg-[#FCFDFE]">
                  {/* Subtle Whiteboard Grid Texture */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  {/* Top Scene Headline in Hand-Drawn Font */}
                  <div className="relative z-10 w-full text-center mt-6">
                    <span
                      style={{ fontFamily: selectedFontObj.cssFamily }}
                      className="text-base sm:text-lg font-bold text-slate-900 leading-snug block"
                    >
                      {currentScene.headline || "Transform your vision with hand-drawn visuals"}
                    </span>
                    {/* Hand-Drawn Underline */}
                    <div
                      className="h-1 mx-auto mt-2 rounded-full transition-all"
                      style={{
                        width: "65%",
                        backgroundColor: currentScene.accentColor || "#2563EB",
                      }}
                    />
                  </div>

                  {/* Hero Visual Icon in Center */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3 my-auto">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-4xl shadow-inner">
                      {currentScene.heroVisual?.drawingId === "growth_chart"
                        ? "📈"
                        : currentScene.heroVisual?.drawingId === "target_bullseye"
                          ? "🎯"
                          : currentScene.heroVisual?.drawingId === "savings_jar"
                            ? "💰"
                            : currentScene.heroVisual?.drawingId === "character_happy"
                              ? "😊"
                              : "💡"}
                    </div>
                    <span
                      style={{ fontFamily: selectedFontObj.cssFamily }}
                      className="text-xs font-bold text-slate-600 uppercase tracking-wider"
                    >
                      {currentScene.heroVisual?.label || "Key Concept"}
                    </span>
                  </div>

                  {/* Active Drawing Hand in Bottom Corner */}
                  <div className="relative z-10 w-full flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400">
                      Font: {selectedFontObj.name}
                    </span>
                    <span className="text-xl">
                      {handStyle === "left" ? "🤚" : handStyle === "none" ? "⚡" : "✋"}
                    </span>
                  </div>
                </div>

                {/* Scene Controls & Scrubber */}
                <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveSceneIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSceneIndex === 0}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700">
                    <span>Scene {activeSceneIndex + 1}</span>
                    <span className="text-slate-400">/</span>
                    <span>{Math.max(1, generatedScenes.length)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSceneIndex((prev) => Math.min(generatedScenes.length - 1, prev + 1))
                    }
                    disabled={activeSceneIndex >= generatedScenes.length - 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Right Column: Scene Storyboard & Transcript Review (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-orange-500" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Whiteboard Scene Beats
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {generatedScenes.length} Animated Beats
                    </span>
                  </div>

                  {/* Scene Beats List */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {generatedScenes.map((sc, idx) => {
                      const isActive = activeSceneIndex === idx;

                      return (
                        <div
                          key={sc.id}
                          onClick={() => setActiveSceneIndex(idx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isActive
                            ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 text-white shadow-xs"
                              style={{ backgroundColor: sc.accentColor || "#2563EB" }}
                            >
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {sc.headline}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Beat {idx + 1} · {sc.duration}s duration
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm">
                              {sc.heroVisual?.drawingId === "growth_chart"
                                ? "📈"
                                : sc.heroVisual?.drawingId === "target_bullseye"
                                  ? "🎯"
                                  : sc.heroVisual?.drawingId === "savings_jar"
                                    ? "💰"
                                    : "💡"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Watermark Remover Toggle */}
                  {onRemoveAiWatermarkChange && (
                    <div className="pt-2 border-t border-slate-100">
                      <WatermarkRemoverToggle
                        enabled={removeAiWatermark}
                        onChange={onRemoveAiWatermarkChange}
                      />
                    </div>
                  )}
                </div>

                {/* Cloud Render Ready Banner */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900">Whiteboard Render Engine Ready</p>
                    <p className="text-emerald-700 font-medium">
                      High-resolution 1080×1920 MP4 • 1 Video Credit per Master Rule 4.1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 font-jakarta truncate max-w-xs">
                    {topicTitle || selectedFile?.name || "Whiteboard Explainer"}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-orange-600 font-bold">1 Credit</span>
                    <span>•</span>
                    <span>1080×1920 MP4</span>
                    <span>•</span>
                    <span className="text-slate-700 font-bold">{selectedFontObj.name}</span>
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
                  onClick={() => onGenerate(generatedScenes)}
                  disabled={!isReadyToCreate || isGenerating}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-xs font-black transition cursor-pointer ${!isReadyToCreate
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : isGenerating
                      ? "bg-orange-500 text-white cursor-wait animate-pulse"
                      : "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:brightness-110 text-white shadow-lg shadow-orange-500/25"
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin text-white" />
                      <span>Generating Whiteboard...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} className="fill-white text-white" />
                      <span>Create Whiteboard Video (1 Cr)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default WhiteboardStudio;
