"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Volume2,
  VolumeX,
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
  RotateCcw,
  BookOpen,
  Tag,
  Music,
  Sliders,
  ChevronDown,
  ChevronUp,
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
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mic,
  Type,
  ArrowRight,
  Plus,
  Search,
  Headphones,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { StudioStepper } from "@/components/dashboard/shared/StudioStepper";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  STYLE_PREVIEW_WORDS,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";

export const FACELESS_STEPS = [
  { step: 1, title: "Upload", desc: "Audio & Media" },
  { step: 2, title: "Music", desc: "Soundtrack & Volume" },
  { step: 3, title: "Style", desc: "Captions & Theme" },
  { step: 4, title: "Preview", desc: "16:9 Cinema & Scenes" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

export interface FacelessVideoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  topicTitle?: string;
  onTopicTitleChange?: (val: string) => void;

  subtitleStyle?: string;
  onSubtitleStyleChange?: (style: string) => void;

  captionAnimationStyle?: "mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt";
  onCaptionAnimationStyleChange?: (val: "mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt") => void;

  captionPosition?: "bottom" | "center" | "top";
  onCaptionPositionChange?: (val: "bottom" | "center" | "top") => void;

  facelessBgmMood?: "lofi" | "tech" | "mystery" | "acoustic" | "upbeat" | "dynamic" | "none";
  onBgmMoodChange?: (val: "lofi" | "tech" | "mystery" | "acoustic" | "upbeat" | "dynamic" | "none") => void;

  selectedBgmTrackId?: string;
  onBgmTrackSelect?: (trackId: string, trackUrl: string) => void;

  facelessBgmVolume?: number;
  onBgmVolumeChange?: (val: number) => void;

  facelessPacingStyle?: "clean" | "cinematic" | "documentary" | "dynamic";
  onPacingStyleChange?: (style: "clean" | "cinematic" | "documentary" | "dynamic") => void;

  facelessEnableSfx?: boolean;
  onEnableSfxChange?: (enabled: boolean) => void;

  visualTheme?: string;
  onVisualThemeChange?: (themeId: string) => void;

  backgroundTheme?: string;
  onBackgroundThemeChange?: (theme: string) => void;
  customBgUrl?: string;
  onCustomBgUrlChange?: (url: string) => void;
  onCustomBgFileSelect?: (file: File | null) => void;

  onGenerate: (storyboardPayload?: any) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  assetSourceMode?: "library" | "upload" | "mix";
  onAssetSourceModeChange?: (mode: "library" | "upload" | "mix") => void;

  uploadedImageFiles?: File[];
  onUploadedImageFilesChange?: (files: File[]) => void;

  onTranscribeAndPlan?: (audioFile: File, brandNamesHint?: string) => Promise<{
    transcript: string;
    segments: Array<{ start: number; end: number; text: string }>;
    words?: Array<{ word: string; start: number; end: number }>;
    sceneBlueprint: any[];
    brollUrls: Record<number, string>;
    durationSeconds: number;
    warnings?: string[];
    uploadedAssets?: any[];
  } | null>;
  isPlanning?: boolean;
  planningMessage?: string;
  planningError?: string | null;
  onClearPlanningError?: () => void;
  onOpenPreview?: () => void;
  onSceneBlueprintChange?: (blueprint: any[]) => void;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
}

export const FacelessVideoStudio: React.FC<FacelessVideoStudioProps> = ({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  subtitleStyle = "glow-viral",
  onSubtitleStyleChange,
  captionAnimationStyle = "smooth",
  onCaptionAnimationStyleChange,
  captionPosition = "bottom",
  onCaptionPositionChange,
  facelessBgmMood = "upbeat",
  onBgmMoodChange,
  selectedBgmTrackId = "not-for-nothing-otis-mcdonald",
  onBgmTrackSelect,
  facelessBgmVolume = 0.12,
  onBgmVolumeChange,
  facelessPacingStyle = "cinematic",
  onPacingStyleChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  visualTheme = "modern-saas",
  onVisualThemeChange,
  backgroundTheme = "solid-white",
  onBackgroundThemeChange,
  customBgUrl,
  onCustomBgUrlChange,
  onCustomBgFileSelect,
  onGenerate,
  isGenerating,
  renderedVideoUrl,
  assetSourceMode = "library",
  onAssetSourceModeChange,
  uploadedImageFiles = [],
  onUploadedImageFilesChange,
  onTranscribeAndPlan,
  isPlanning = false,
  planningMessage = "",
  planningError = null,
  onClearPlanningError,
  onOpenPreview,
  onSceneBlueprintChange,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}) => {
  // ── Flexible Step State (supports any number of steps) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Transcribed state
  const [transcriptText, setTranscriptText] = useState("");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState(false);
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<any[]>([]);
  const [originalWords, setOriginalWords] = useState<any[]>([]);
  const [sceneBlueprint, setSceneBlueprint] = useState<any[]>([]);
  const [brollUrls, setBrollUrls] = useState<Record<number, string>>({});
  const [audioDurationSec, setAudioDurationSec] = useState<number>(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("");

  // Waveform Audio Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Compulsory Preview & Sync Player
  const [previewConfirmed, setPreviewConfirmed] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);

  // Background Music State (Default 12%)
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round(facelessBgmVolume * 100) || 12);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(AWS_BGM_TRACKS[0]?.id || "parasail");
  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || "modern-saas");

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);
  const [customBgmUrl, setCustomBgmUrl] = useState<string>("");
  const [customBgmName, setCustomBgmName] = useState<string>("");
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);

  // Caption Filter & Search
  const [captionFilter, setCaptionFilter] = useState("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState("");

  // User Uploaded Video Clips & Images
  const [userMediaClips, setUserMediaClips] = useState<Array<{ file: File; type: "video" | "image"; url: string }>>([]);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const multiMediaInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Duration & Calculation (1 Min = 1 Credit, Max 5 min / 300s)
  const calculatedCredits = Math.max(1, Math.min(5, Math.ceil((audioDurationSec || 60) / 60)));

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

  // Load sample demo
  const handleLoadSampleDemo = () => {
    onTopicTitleChange?.("The Psychology of High Performance");
    const demoAudioUrl = "/assets/reusable/testing1.mp3";
    setAudioPreviewUrl(demoAudioUrl);
    setAudioDurationSec(60);
    const dummyFile = new File(["dummy audio"], "high-performance-narration-sample.mp3", { type: "audio/mpeg" });
    onSelectFile(dummyFile);
  };

  // Handle narration audio file selection
  const handleNarrationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSelectFile(file);
    const localUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(localUrl);

    const audioEl = new Audio(localUrl);
    audioEl.onloadedmetadata = () => {
      if (audioEl.duration && Number.isFinite(audioEl.duration)) {
        setAudioDurationSec(Math.round(audioEl.duration));
      }
    };

    setPreviewConfirmed(false);
    triggerTranscription(file);
    if (e.target) e.target.value = "";
  };

  // Trigger transcription
  const triggerTranscription = (file: File) => {
    if (!onTranscribeAndPlan) return;
    onClearPlanningError?.();

    onTranscribeAndPlan(file, topicTitle)
      .then((planRes) => {
        if (!planRes) return;
        const text = planRes.transcript || "";
        setTranscriptText(text);
        setEditableTranscript(text);
        setTranscriptSegments(planRes.segments || []);
        setOriginalWords(planRes.words || []);
        setSceneBlueprint(planRes.sceneBlueprint || []);
        onSceneBlueprintChange?.(planRes.sceneBlueprint || []);
        setBrollUrls(planRes.brollUrls || {});
        if (planRes.durationSeconds > 0) {
          setAudioDurationSec(planRes.durationSeconds);
        }
        setPreviewConfirmed(false);
      })
      .catch((err) => {
        console.error("[AUTO_TRANSCRIBE_ERROR]", err);
      });
  };

  // Save edited transcript
  const handleSaveEditedTranscript = () => {
    setTranscriptText(editableTranscript);
    setTranscriptSavedFeedback(true);
    setTimeout(() => setTranscriptSavedFeedback(false), 2500);
  };

  // Handle multi-media (Images AND Video Clips)
  const handleMultiMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newClips: Array<{ file: File; type: "video" | "image"; url: string }> = [];
    const imageFilesList: File[] = [...(uploadedImageFiles || [])];

    Array.from(files).forEach((f) => {
      const isVid = f.type.startsWith("video/");
      const isImg = f.type.startsWith("image/");
      if (isVid || isImg) {
        newClips.push({
          file: f,
          type: isVid ? "video" : "image",
          url: URL.createObjectURL(f),
        });
        if (isImg) imageFilesList.push(f);
      }
    });

    setUserMediaClips((prev) => [...prev, ...newClips]);
    onUploadedImageFilesChange?.(imageFilesList);
    onAssetSourceModeChange?.("mix");
    if (e.target) e.target.value = "";
  };

  // Handle custom BGM upload
  const handleCustomBgmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCustomBgmUrl(localUrl);
    setCustomBgmName(file.name);
    setSelectedBgmTrack(localUrl);
    if (e.target) e.target.value = "";
  };

  // Preview music track
  const togglePlayBgmTrack = (track: LibraryBgmTrack) => {
    if (track.id === "none") {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
      return;
    }
    const audioUrl = getBgmTrackAudioUrl(track);
    if (playingBgmPreview === track.id) {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = audioUrl;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, activeBgmVolume / 100);
        bgmPreviewAudioRef.current
          .play()
          .then(() => {
            setPlayingBgmPreview(track.id);
          })
          .catch(() => setPlayingBgmPreview(null));
      }
    }
  };

  // Toggle narration preview audio sync
  const togglePreviewAudio = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewAudioPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewAudioPlaying(false);
    } else {
      previewAudioRef.current
        .play()
        .then(() => {
          setIsPreviewAudioPlaying(true);
        })
        .catch((err) => {
          console.warn("Playback error:", err);
        });
    }
  };

  // Toggle Audio Play / Pause for Waveform
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.warn("Audio play blocked:", err));
    }
  };

  const toggleMuteAudio = () => {
    if (!audioPlayerRef.current) return;
    audioPlayerRef.current.muted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
  };

  const handleWaveformSeek = (progress: number) => {
    if (!audioPlayerRef.current || !audioDurationSec) return;
    const target = progress * audioDurationSec;
    audioPlayerRef.current.currentTime = target;
    setAudioCurrentTime(target);
  };

  // Active scene calculation
  const currentPreviewScene = sceneBlueprint[activePreviewIndex] || sceneBlueprint[0] || {
    title: topicTitle || "The Psychology of High Performance",
    keyTakeaway: "Mastering mental discipline through consistent daily routines.",
    visualPrompt: "Clean white studio with high-contrast typography and obsidian slate accents.",
    narrationExcerpt: "True high performance isn't about working harder; it's about clarity of focus.",
  };

  // Final Generate Video Action
  const handleTriggerGenerate = () => {
    const finalBgmUrl = customBgmUrl || (selectedBgmTrack === "none" ? "" : getBgmTrackAudioUrl(AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0]));

    const payload = {
      sceneBlueprint,
      brollUrls,
      transcript: editableTranscript || transcriptText,
      segments: transcriptSegments,
      durationSeconds: audioDurationSec || 60,
      topicTitle: topicTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Video"),
      backgroundTheme: "solid-white",
      visualTheme: activeVisualTheme,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      facelessBgmMood,
      facelessBgmVolume: finalBgmUrl ? activeBgmVolume / 100 : 0,
      facelessEnableSfx,
      facelessPacingStyle,
      assetSourceMode,
      aspectRatio: "16:9",
      bgmUrl: finalBgmUrl,
      bgmTrackId: selectedBgmTrack,
      userMediaClips,
      removeAiWatermark,
    };

    onGenerate(payload);
  };

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
      {/* Hidden Audio Elements for Playback */}
      <audio
        ref={audioPlayerRef}
        src={audioPreviewUrl}
        preload="metadata"
        onEnded={() => setIsPlayingAudio(false)}
      />
      <audio
        ref={bgmPreviewAudioRef}
        preload="auto"
        onEnded={() => setPlayingBgmPreview(null)}
      />
      <audio
        ref={previewAudioRef}
        src={audioPreviewUrl}
        preload="auto"
        onEnded={() => setIsPreviewAudioPlaying(false)}
      />

      {/* ── ROW 1: Studio Header & 4-Step Stepper (Consistent with Image to Video AI) ── */}
      <div className="shrink-0 border-b border-slate-200/90 bg-white px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Film size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Faceless Video AI
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-orange-600">
                16:9 Widescreen
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              Create professional 1080p widescreen YouTube videos with clean white canvas, B-roll, and auto-subtitles.
            </p>
          </div>
        </div>

        {/* Flexible Studio Stepper */}
        <StudioStepper
          steps={FACELESS_STEPS}
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
          className="self-start md:self-center bg-slate-50 border border-slate-200/90 rounded-2xl px-2 py-1.5 shadow-2xs"
        />
      </div>

      {/* ── ROW 2: Scrollable Studio Workspace ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (Voiceover, Details, Waveform & Media Clips)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Voiceover Upload Zone & Waveform Visualizer */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Mic size={20} className="text-orange-500" />
                      <span>Narration Voiceover Audio</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Required • Up to 5 Min (300s)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your spoken narration or script recording. Groq Whisper will automatically align word timestamps.
                    </p>
                  </div>

                  {!selectedFile && (
                    <button
                      type="button"
                      onClick={handleLoadSampleDemo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-xs font-bold text-orange-600 hover:bg-orange-100 transition cursor-pointer self-start sm:self-auto"
                    >
                      <Sparkles size={13} />
                      <span>Try Sample Demo</span>
                    </button>
                  )}
                </div>

                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*,video/mp4"
                  onChange={handleNarrationSelect}
                  className="hidden"
                />

                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-3xl bg-slate-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud size={28} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-800">
                        Click to Upload Spoken Voiceover
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        MP3, WAV, M4A, or MP4 • Strictly 16:9 Widescreen (1920×1080)
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[11px] font-black">
                      <Zap size={11} className="fill-orange-500" />
                      <span>1 Min = 1 Credit Pricing</span>
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
                              {formatSec(audioDurationSec)} / 05:00 Max
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-orange-600">
                              {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""}
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
                          onClick={() => {
                            onSelectFile(null);
                            setAudioPreviewUrl("");
                            setAudioDurationSec(0);
                            setTranscriptText("");
                            setSceneBlueprint([]);
                          }}
                          className="p-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Waveform Visualizer Bar */}
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

                      {/* Interactive Waveform Bars */}
                      <div className="flex items-end gap-1 h-12 w-full pt-2 cursor-pointer">
                        {WAVE_BARS.map((height, i) => {
                          const barProgress = i / WAVE_BARS.length;
                          const currentProgress = audioDurationSec > 0 ? audioCurrentTime / audioDurationSec : 0;
                          const isPlayed = barProgress <= currentProgress;

                          return (
                            <div
                              key={i}
                              onClick={() => handleWaveformSeek(barProgress)}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isPlayed ? "bg-orange-500" : "bg-slate-200 hover:bg-slate-300"
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

              {/* Planning or Error Banner */}
              {isPlanning && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 flex items-center gap-3 text-sm font-bold text-slate-800 shadow-xs animate-pulse">
                  <Sparkles size={18} className="animate-spin text-orange-500" />
                  <span>{planningMessage || "Transcribing speech and structuring 16:9 visual scene beats..."}</span>
                </div>
              )}

              {planningError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3 text-red-800 text-sm font-bold shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle size={18} className="text-red-500" />
                    <span>{planningError}</span>
                  </div>
                  <button
                    onClick={onClearPlanningError}
                    className="text-xs text-red-600 hover:text-red-800 underline font-semibold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Video Topic Title & Details */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film size={18} className="text-orange-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Project Name / Video Title
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Optional
                  </span>
                </div>

                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange?.(e.target.value)}
                  placeholder="e.g. The Science of Deep Focus (auto-detected if left blank)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition"
                />
                <p className="text-[11px] text-slate-500 font-medium">
                  Used for your export file and intro badge. If left blank, it automatically uses your uploaded audio file name.
                </p>
              </div>

              {/* Editable Spoken Transcript Editor */}
              {transcriptText && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-orange-500" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Spoken Narration Transcript
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                      >
                        {showTranscriptEditor ? "Collapse Editor" : "Edit Transcript"}
                      </button>

                      {showTranscriptEditor && (
                        <button
                          type="button"
                          onClick={handleSaveEditedTranscript}
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
                              <span>Save Words</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {showTranscriptEditor ? (
                    <textarea
                      value={editableTranscript}
                      onChange={(e) => setEditableTranscript(e.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none transition leading-relaxed"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 max-h-36 overflow-y-auto">
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {transcriptText}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Optional Custom B-Roll Media Clips & Images */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-orange-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Custom B-Roll Images &amp; Video Clips
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Upload your own MP4 video clips, screenshots, or diagrams to blend alongside AI vector illustrations.
                </p>

                <input
                  ref={multiMediaInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  multiple
                  onChange={handleMultiMediaSelect}
                  className="hidden"
                />

                <div className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-500 bg-slate-50/60 p-5 flex flex-col items-center justify-center gap-3 text-center transition">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-orange-500 shadow-xs">
                      <Video size={18} />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-500 shadow-xs">
                      <ImageIcon size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag &amp; Drop or Select Videos and Images
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      MP4 clips, screenshots, diagrams, PNG graphics
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => multiMediaInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition cursor-pointer shadow-xs"
                  >
                    <Upload size={13} />
                    <span>Choose Media Clips ({userMediaClips.length} Added)</span>
                  </button>
                </div>

                {userMediaClips.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin pt-1">
                    {userMediaClips.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 group shadow-xs bg-black"
                      >
                        {item.type === "video" ? (
                          <video src={item.url} className="w-full h-full object-cover opacity-80" muted />
                        ) : (
                          <img src={item.url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-black/80 text-white">
                          {item.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => setUserMediaClips(userMediaClips.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: MUSIC (14 AWS Tracks, Custom Upload & Volume)
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
                      Select royalty-free music from AWS S3, or upload your own track. Includes dynamic auto-ducking during speech.
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
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition cursor-pointer ${
                          activeBgmVolume === p.val
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Ducking & SFX Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setAutoDucking(!autoDucking)}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${
                      autoDucking ? "border-orange-500 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dynamic Auto-Ducking</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ducks music volume down during speech and raises it during pauses
                      </p>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full transition-colors relative ${
                        autoDucking ? "bg-orange-500" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          autoDucking ? "left-4.5" : "left-0.5"
                        }`}
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${
                      facelessEnableSfx ? "border-orange-500 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Synchronized Sound Effects (SFX)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Adds subtle swoosh and whoosh audio transitions between scenes
                      </p>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full transition-colors relative ${
                        facelessEnableSfx ? "bg-orange-500" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          facelessEnableSfx ? "left-4.5" : "left-0.5"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom User BGM Upload Box */}
                <input
                  ref={bgmInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomBgmUpload}
                  className="hidden"
                />

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0">
                      <Upload size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {customBgmName ? `Uploaded: ${customBgmName}` : "Upload Custom Background Music"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {customBgmUrl
                          ? "Custom music track active for render"
                          : "Upload your own royalty-free background MP3"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {customBgmUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomBgmUrl("");
                          setCustomBgmName("");
                          setSelectedBgmTrack(AWS_BGM_TRACKS[0].id);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => bgmInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition cursor-pointer shadow-xs"
                      >
                        <Upload size={12} />
                        <span>Upload Audio</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AWS S3 Preset Music Tracks (14 Tracks) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Or Choose from Curated AWS S3 Music Tracks ({AWS_BGM_TRACKS.length})
                    </label>
                    <span className="text-[11px] text-slate-400">All tracks royalty-free for YouTube monetization</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AWS_BGM_TRACKS.map((track) => {
                      const isSelected = !customBgmUrl && selectedBgmTrack === track.id;
                      const isPlaying = playingBgmPreview === track.id;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            setCustomBgmUrl("");
                            setSelectedBgmTrack(track.id);
                            onBgmTrackSelect?.(track.id, getBgmTrackAudioUrl(track));
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
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
              STEP 3: STYLE (32 Animated Caption Themes & Pacing)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Unified Visual Design System (12-System Master Theme Engine) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Sparkles size={20} className="text-orange-500" />
                      <span>Unified Visual Design System (16:9 Widescreen)</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        6 Master Themes
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Controls typography, colors, backgrounds, SVGs, charts, images, and motion with 100% aesthetic harmony across all scenes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Swatch Preview Box */}
                        <div
                          className="w-full h-12 rounded-xl flex items-center justify-between px-3 border shadow-inner"
                          style={{
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-xs"
                              style={{ backgroundColor: theme.colors.surface }}
                            />
                          </div>
                          <span
                            className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: theme.colors.badgeBg,
                              color: theme.colors.accent,
                            }}
                          >
                            {theme.typography.id.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {theme.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-200/60 mt-auto">
                          <span>{theme.typography.headingFont.split(',')[0].replace(/['"]/g, '')}</span>
                          <span className="capitalize">{theme.motion.defaultTransition}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Type size={20} className="text-orange-500" />
                      <span>32 Master Kinetic Caption Themes</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live animated word-by-word previews. High retention YouTube captions.
                    </p>
                  </div>

                  {/* Search Bar */}
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

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["all", "viral", "cinema", "modern", "creative", "minimal"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionFilter(cat)}
                      className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                        captionFilter === cat
                          ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 32 Caption Cards Grid with Live Word Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredCaptionStyles.map((theme) => {
                    const isSelected = subtitleStyle === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onSubtitleStyleChange?.(theme.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
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

                        {/* Live Kinetic Word Preview Strip */}
                        <div className="bg-slate-900/95 rounded-xl px-3 py-2 flex items-center justify-center min-h-[38px] overflow-hidden">
                          {renderPreviewCaptionWords(theme.id)}
                        </div>

                        <span className="text-[11px] text-slate-500 line-clamp-1">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Motion Pacing & Subtitle Position */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Editorial Motion Pacing</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "clean", label: "Clean (Calm)", desc: "Gentle spring drift" },
                        { id: "cinematic", label: "Cinematic", desc: "Balanced editorial flow" },
                        { id: "documentary", label: "Documentary", desc: "Vox/Veritas style" },
                        { id: "dynamic", label: "Dynamic", desc: "Punchy fast-paced cuts" },
                      ].map((pace) => (
                        <button
                          key={pace.id}
                          type="button"
                          onClick={() => onPacingStyleChange?.(pace.id as any)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                            facelessPacingStyle === pace.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div>{pace.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{pace.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Subtitle Position</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "bottom", label: "Bottom (Standard)" },
                        { id: "center", label: "Center Pop" },
                        { id: "top", label: "Top Strip" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => onCaptionPositionChange?.(pos.id as any)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                            captionPosition === pos.id
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: PREVIEW (16:9 Cinema Monitor, Scene Stepper & Storyboard)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === FACELESS_STEPS.length && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 16:9 Cinema Widescreen Live Monitor */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Eye size={20} className="text-orange-500" />
                      <span>16:9 Cinema Widescreen Live Monitor</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Compulsory Review
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Inspect scene typography, vector illustration badges, and spoken audio sync on pure white canvas.
                    </p>
                  </div>

                  {audioPreviewUrl && (
                    <button
                      type="button"
                      onClick={togglePreviewAudio}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer self-start sm:self-auto"
                    >
                      {isPreviewAudioPlaying ? (
                        <>
                          <Pause size={13} className="text-orange-500" />
                          <span>Pause Audio Sync</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} className="text-slate-700" />
                          <span>Play Audio Sync</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* 16:9 Full HD Video Canvas (Pure White Background Guarantee) */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-lg flex flex-col justify-between p-6 sm:p-10 select-none">
                  {/* Top Bar: Scene Pill & Progress */}
                  <div className="flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                      <Film size={12} className="text-orange-400" />
                      Scene {activePreviewIndex + 1} of {Math.max(1, sceneBlueprint.length)}
                    </span>

                    <span className="text-xs font-black text-slate-400">
                      1080p Full HD (1920×1080)
                    </span>
                  </div>

                  {/* Center Content: Headline & Vector Badge */}
                  <div className="my-auto text-center space-y-4 max-w-2xl mx-auto z-10">
                    <div className="inline-block px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 text-xs font-black uppercase tracking-widest">
                      {currentPreviewScene.title || topicTitle || "Key Concept"}
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {currentPreviewScene.keyTakeaway || "Consistent actions compound into extraordinary results."}
                    </h3>

                    {currentPreviewScene.narrationExcerpt && (
                      <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                        &ldquo;{currentPreviewScene.narrationExcerpt}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Bottom Strip: Kinetic Subtitle Preview */}
                  <div className="flex items-center justify-center z-10">
                    <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-md">
                      {renderPreviewCaptionWords(subtitleStyle)}
                    </div>
                  </div>

                  {/* Watermark Notice in Canvas Preview */}
                  {!removeAiWatermark && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      Itnavideo AI
                    </div>
                  )}
                </div>

                {/* Scene Scrubber Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={activePreviewIndex <= 0}
                    onClick={() => setActivePreviewIndex(Math.max(0, activePreviewIndex - 1))}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-800 transition cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous Scene</span>
                  </button>

                  <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                    {Array.from({ length: Math.max(1, sceneBlueprint.length) }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePreviewIndex(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          activePreviewIndex === idx ? "w-6 bg-orange-500" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={activePreviewIndex >= Math.max(0, sceneBlueprint.length - 1)}
                    onClick={() => setActivePreviewIndex(Math.min(sceneBlueprint.length - 1, activePreviewIndex + 1))}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-800 transition cursor-pointer"
                  >
                    <span>Next Scene</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Watermark Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <WatermarkRemoverToggle
                  checked={removeAiWatermark}
                  onChange={(val) => onRemoveAiWatermarkChange?.(val)}
                  label="Remove AI Watermark"
                  description="Export a completely clean, unbranded 1080p MP4 ready for YouTube monetized publishing."
                />
              </div>

              {/* Storyboard Timeline Detail */}
              {sceneBlueprint.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={18} className="text-orange-500" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Scene Storyboard Breakdown ({sceneBlueprint.length} Scenes)
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      Total: {formatSec(audioDurationSec)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                    {sceneBlueprint.map((sc, i) => (
                      <div
                        key={i}
                        onClick={() => setActivePreviewIndex(i)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
                          activePreviewIndex === i
                            ? "border-orange-500 bg-orange-50/60 shadow-xs"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black text-slate-900">Scene {i + 1}</span>
                          <span className="font-mono text-[10px] text-slate-500 font-bold">
                            {formatSec(sc.startTime || 0)} - {formatSec(sc.endTime || 0)}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {sc.title || sc.headline || "Scene Beat"}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {sc.narrationExcerpt || sc.keyTakeaway || sc.description || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Sticky Bottom Action Bar ── */}
      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Topic:</span>
            <span className="text-xs font-black text-slate-900 max-w-[200px] truncate">
              {topicTitle || "Faceless Video"}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <Zap size={13} className="fill-orange-500 text-orange-500" />
            <span>Cost: {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""} (1 Min = 1 Cr)</span>
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

          {currentStep < FACELESS_STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
            >
              <span>Next: {FACELESS_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTriggerGenerate}
              disabled={isGenerating || !selectedFile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles size={14} />
              <span>Create Faceless Video</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
