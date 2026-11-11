"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Plus,
  Flame,
  Tag,
  Music,
  Scissors,
  Wand2,
  ArrowRight,
  Search,
  Type,
  Layout,
  Clock,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { StudioStepperRow } from "@/components/dashboard/shared/StudioStepper";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";

export const CLIPS_STEPS = [
  { step: 1, title: "Upload", desc: "Long Video Source" },
  { step: 2, title: "Settings", desc: "Clip Count & Duration" },
  { step: 3, title: "Preview", desc: "Viral Clips & Hooks" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

export interface LongVideoClipsStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  clipCount?: number;
  onClipCountChange?: (val: number) => void;

  clipDuration?: "auto" | "under-30" | "30-60" | "60-90";
  onClipDurationChange?: (val: "auto" | "under-30" | "30-60" | "60-90") => void;

  clipsHookStrategy?: "auto" | "high-energy" | "actionable" | "story";
  onClipsHookStrategyChange?: (val: "auto" | "high-energy" | "actionable" | "story") => void;

  layoutMode?: "auto-speaker" | "split-screen" | "fit-widescreen";
  onLayoutModeChange?: (val: "auto-speaker" | "split-screen" | "fit-widescreen") => void;

  enableCaptions?: boolean;
  onEnableCaptionsChange?: (val: boolean) => void;

  captionStyle?: string;
  onCaptionStyleChange?: (val: string) => void;

  bgmTrackId?: string;
  onBgmTrackIdChange?: (trackId: string) => void;
  bgmVolume?: number;
  onBgmVolumeChange?: (vol: number) => void;
  customBgmFile?: File | null;
  onCustomBgmFileSelect?: (file: File | null) => void;

  enableSfx?: boolean;
  onEnableSfxChange?: (val: boolean) => void;

  editorialTranscript?: string;
  onEditorialTranscriptChange?: (text: string) => void;

  onGenerate: () => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
}

export function LongVideoClipsStudio({
  selectedFile,
  onSelectFile,
  clipCount = 3,
  onClipCountChange,
  clipDuration = "30-60",
  onClipDurationChange,
  clipsHookStrategy = "auto",
  onClipsHookStrategyChange,
  layoutMode = "auto-speaker",
  onLayoutModeChange,
  enableCaptions = true,
  onEnableCaptionsChange,
  captionStyle = "glow-viral",
  onCaptionStyleChange,
  bgmTrackId = "parasail",
  onBgmTrackIdChange,
  bgmVolume = 0.12,
  onBgmVolumeChange,
  customBgmFile,
  onCustomBgmFileSelect,
  enableSfx = true,
  onEnableSfxChange,
  editorialTranscript = "",
  onEditorialTranscriptChange,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}: LongVideoClipsStudioProps) {
  // ── Flexible Step State (supports any number of steps) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Video duration & playback
  const [videoDurationSec, setVideoDurationSec] = useState<number>(180);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

  // BGM audition state
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round(bgmVolume * 100) || 12);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(bgmTrackId || "parasail");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);

  // Captions
  const [captionFilter, setCaptionFilter] = useState<string>("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>("");

  // Simulator Preview State
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewProgress, setPreviewProgress] = useState<number>(0);

  // Transcript editing
  const [localTranscript, setLocalTranscript] = useState(editorialTranscript);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState(false);

  // Input refs
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preview video Object URL
  const videoPreviewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  // Load duration when file changes
  useEffect(() => {
    if (!selectedFile) {
      setVideoDurationSec(180);
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(selectedFile);
    video.src = url;
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setVideoDurationSec(Math.round(video.duration || 180));
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

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
          return prev + 2.5;
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

  const calculatedCredits = clipCount > 0 ? clipCount : 3;

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden bg-white">
      {/* Hidden Audio Elements */}
      <audio
        ref={bgmPreviewAudioRef}
        preload="auto"
        onEnded={() => setPlayingTrackId(null)}
      />

      {/* ── ROW 1: Flexible Studio Stepper ── */}
      <StudioStepperRow
        steps={CLIPS_STEPS}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* ── ROW 2: Scrollable Studio Workspace ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (Long Video, Duration & Clip Strategy)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Long Video Upload Zone */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Film size={20} className="text-orange-500" />
                      <span>Upload Long Source Video</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Up to 2 Hours (7,200s)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your podcast, interview, or lecture. AI will detect emotional hooks and speech density.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Max: 2 Hours (3GB)
                  </span>
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
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
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-3xl bg-slate-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud size={28} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-800">
                        Click to Upload Long-Form Video File
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        MP4, MOV, or WebM • 1 Credit per extracted viral clip
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
                              Duration: {formatSec(videoDurationSec)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-orange-600">
                              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
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
                  </div>
                )}
              </div>

              {/* Clip Count & Duration Selectors */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Clip Count */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Number of Viral Clips</span>
                      <span className="text-orange-600 font-black">1 Cr / Clip</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: 0, label: "AI Recommended", sub: "Auto-sized" },
                        { val: 3, label: "3 Clips", sub: "3 Credits" },
                        { val: 5, label: "5 Clips", sub: "5 Credits" },
                        { val: 10, label: "10 Clips", sub: "10 Credits" },
                      ].map((c) => (
                        <button
                          key={c.val}
                          type="button"
                          onClick={() => onClipCountChange?.(c.val)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${clipCount === c.val
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div>{c.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{c.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Clip Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Target Clip Duration</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "auto", label: "AI Auto", sub: "Natural story arc" },
                        { id: "under-30", label: "Under 30s", sub: "Fast bite-sized" },
                        { id: "30-60", label: "30–60s", sub: "Standard Shorts" },
                        { id: "60-90", label: "60–90s", sub: "In-depth recap" },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => onClipDurationChange?.(d.id as any)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${clipDuration === d.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div>{d.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{d.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Virality Hook Strategy */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">AI Hook Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "auto", label: "Auto Virality", sub: "Top moments" },
                        { id: "high-energy", label: "High Energy", sub: "Peak emotion" },
                        { id: "actionable", label: "Actionable", sub: "Direct advice" },
                        { id: "story", label: "Storytelling", sub: "Engaging arcs" },
                      ].map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => onClipsHookStrategyChange?.(h.id as any)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${clipsHookStrategy === h.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <div>{h.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{h.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: MUSIC (14 AWS S3 Tracks, Volume & SFX)
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
                      Select upbeat royalty-free music from AWS S3, or keep speech pure with auto-ducking.
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
                      <p className="text-xs font-bold text-slate-900">Hook Transition Sound Effects</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Punchy whoosh audio transition at hook punchline moments
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
                      Choose Background Music Track ({AWS_BGM_TRACKS.length})
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
              STEP 3: STYLE (32 Caption Themes & Speaker Crop)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Speaker Reframing Layout Mode */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Layout size={20} className="text-orange-500" />
                      <span>Speaker Reframing &amp; Layout Mode</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Computer vision face detection automatically centers active speaker in 9:16 vertical shorts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "auto-speaker", label: "Auto Active Speaker", desc: "Tracks active speaker with jump-cuts (+15% punch-in)", badge: "Recommended" },
                    { id: "split-screen", label: "Split Screen Podcast", desc: "Host in top 50%, Guest in bottom 50%", badge: "2-Person" },
                    { id: "fit-widescreen", label: "Fit Widescreen Blur", desc: "16:9 landscape video with blurred backdrop", badge: "Classic" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onLayoutModeChange?.(mode.id as any)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${layoutMode === mode.id
                          ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-1 ring-orange-500"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black text-slate-900">{mode.label}</span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {mode.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{mode.desc}</p>
                    </button>
                  ))}
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
                      Live animated word-by-word previews for high-retention vertical shorts.
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
                    const isSelected = captionStyle === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onCaptionStyleChange?.(theme.id)}
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
              STEP 4: PREVIEW (9:16 Live Simulator & Hook Review)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === CLIPS_STEPS.length && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Eye size={20} className="text-orange-500" />
                      <span>9:16 Vertical Shorts Simulator</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Compulsory Review
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Simulate vertical face crop, hook punchlines, and kinetic subtitles before rendering.
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
                <div className="relative mx-auto w-full max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black flex flex-col justify-between p-4 select-none">
                  {/* Top Hook Headline Banner */}
                  <div className="text-center space-y-1.5 z-10 pt-2">
                    <div className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1.5 rounded-xl max-w-[92%] mx-auto shadow-md tracking-wide">
                      ⚡ THE TRUTH ABOUT SUCCESS
                    </div>
                  </div>

                  {/* Center Video Crop Area */}
                  <div className="my-auto text-center z-10">
                    <div className="h-44 w-44 rounded-full bg-slate-800 mx-auto flex items-center justify-center border-2 border-white/20 shadow-inner">
                      <Film size={36} className="text-orange-400 opacity-60" />
                    </div>
                  </div>

                  {/* Bottom Subtitle Strip */}
                  <div className="z-10 text-center pb-2">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 text-white rounded-xl py-2 px-3 max-w-[95%] mx-auto shadow-md">
                      {renderPreviewCaptionWords(captionStyle)}
                    </div>
                  </div>

                  {/* Watermark Tag */}
                  {!removeAiWatermark && (
                    <div className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                      Itnavideo AI
                    </div>
                  )}

                  {/* Scrubber Line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
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
                  description="Export completely clean, unbranded vertical shorts ready for TikTok, Instagram Reels, and YouTube Shorts."
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
            <span className="text-xs font-bold text-slate-500">Source:</span>
            <span className="text-xs font-black text-slate-900 max-w-[200px] truncate">
              {selectedFile?.name || "Long Source Video"}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Zap size={13} className="fill-orange-500 text-orange-500" />
            <span>Cost: {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""} (1 Credit / Clip)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Back
            </button>
          )}

          {currentStep < CLIPS_STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
            >
              <span>Next: {CLIPS_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !selectedFile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles size={14} />
              <span>Extract Viral Shorts ({calculatedCredits} Clips)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
