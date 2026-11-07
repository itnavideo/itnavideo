"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  UploadCloud,
  Volume2,
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
  EyeOff,
  Video,
  Image as ImageIcon,
  CheckCheck,
  Edit3,
  Save,
  Lock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import { diffBasedAlignTranscript } from "@/services/ai/transcriptAlignment";

// Master AWS S3 Production Music Library
const AWS_FACELESS_BGM_TRACKS = [
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
  { id: "none", label: "No Background Music", category: "Mute", path: "none", desc: "Pure spoken voiceover only" },
];

// 20 Master YouTube 16:9 Caption Styles
const TWENTY_CAPTION_STYLES = [
  { id: "glow-viral", name: "Flame Glow Yellow", category: "Viral", color: "#FFD700", badge: "Popular", desc: "High-energy glowing yellow active word highlight" },
  { id: "mrbeast", name: "MrBeast Yellow Box", category: "Viral", color: "#FFEB3B", badge: "Creator", desc: "Punchy yellow bounding box with bold pop" },
  { id: "netflix-yellow", name: "Cinema Gold Subtitle", category: "Cinema", color: "#FACC15", badge: "Clean", desc: "Classic yellow bold font with black outline" },
  { id: "hormozi-bold", name: "Hormozi Lime Punch", category: "Viral", color: "#22C55E", badge: "Retention", desc: "High-contrast punchy green & yellow caps" },
  { id: "neon-city", name: "Cyberpunk Electric Cyan", category: "Modern", color: "#00F0FF", badge: "Glow", desc: "Cyan and magenta neon electric pulse" },
  { id: "daily-look", name: "Sunny Vlog Rounded", category: "Friendly", color: "#FDE047", badge: "Vlog", desc: "Friendly rounded stroke with sunny glow" },
  { id: "blockbuster", name: "Blockbuster Flame", category: "News", color: "#FF5722", badge: "Bold", desc: "Heavyweight slab headlines with Flame Orange" },
  { id: "handwriting-pop", name: "Organic Script Pop", category: "Creative", color: "#FB7185", badge: "Script", desc: "Authentic cursive handwriting with dynamic line" },
  { id: "vox-docu", name: "Vox Documentary Serif", category: "Editorial", color: "#FFFFFF", badge: "Docu", desc: "Editorial serif with dark glass backdrop" },
  { id: "minimal-clean", name: "Minimal Ice Blue", category: "Modern", color: "#38BDF8", badge: "Minimal", desc: "Ultra-crisp modern sans-serif with slate pill" },
  { id: "cyber-ops", name: "Radar Military Green", category: "Tech", color: "#4ADE80", badge: "Tech", desc: "High-tech stencil with radar green glow" },
  { id: "premium-gold", name: "Wealth Metallic Gold", category: "Finance", color: "#FBBF24", badge: "Wealth", desc: "Rich warm metallic gold for business & finance" },
  { id: "word-highlight", name: "Flame Word Pop", category: "Kinetic", color: "#FF5722", badge: "Dynamic", desc: "Active word pops with vibrant flame orange" },
  { id: "classic-clean", name: "Timeless White Cinema", category: "Cinema", color: "#FFFFFF", badge: "Classic", desc: "Crisp white typography with deep drop shadow" },
  { id: "documentary-serif", name: "Classical Book Serif", category: "Book", color: "#E2E8F0", badge: "Book", desc: "Elegant serif captions for non-fiction literature" },
  { id: "karaoke-glow", name: "Karaoke Amber Pulse", category: "Karaoke", color: "#FFA000", badge: "Karaoke", desc: "Golden amber electric glow following speech" },
  { id: "box-pill", name: "Dark Slate Pill Box", category: "Modern", color: "#00FFCC", badge: "Pill", desc: "Solid dark badge background behind spoken words" },
  { id: "neon-cyber", name: "Magenta Cyber Pulse", category: "Modern", color: "#FF007F", badge: "Neon", desc: "High-contrast cyan & magenta glowing text" },
  { id: "minimal-lower-third", name: "Scrubber Lower Third", category: "Subtle", color: "#CBD5E1", badge: "Clean", desc: "Clean studio strip at the bottom of the frame" },
  { id: "editorial-book", name: "Author Emerald Accent", category: "Book", color: "#10B981", badge: "Editorial", desc: "Distinguished emerald highlight on solid white" },
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

  visualArtStyle?: "realistic" | "3d" | "2d" | string;
  onVisualArtStyleChange?: (style: any) => void;

  backgroundTheme?: string;
  onBackgroundThemeChange?: (theme: string) => void;
  customBgUrl?: string;
  onCustomBgUrlChange?: (url: string) => void;
  onCustomBgFileSelect?: (file: File | null) => void;

  onGenerate: (storyboardPayload?: any) => void;
  isGenerating: boolean;
  renderedVideoUrl?: string;

  assetSourceMode: "library" | "upload" | "mix";
  onAssetSourceModeChange: (mode: "library" | "upload" | "mix") => void;

  uploadedImageFiles: File[];
  onUploadedImageFilesChange: (files: File[]) => void;

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
  selectedBgmTrackId,
  onBgmTrackSelect,
  facelessBgmVolume = 0.12,
  onBgmVolumeChange,
  facelessPacingStyle = "cinematic",
  onPacingStyleChange,
  facelessEnableSfx = true,
  onEnableSfxChange,
  visualArtStyle = "realistic",
  onVisualArtStyleChange,
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
}) => {
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

  // Compulsory Preview & Sync Player
  const [previewConfirmed, setPreviewConfirmed] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);

  // Background Music State (Default 12%)
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round(facelessBgmVolume * 100) || 12);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(AWS_FACELESS_BGM_TRACKS[0].path);
  const [customBgmUrl, setCustomBgmUrl] = useState<string>("");
  const [customBgmName, setCustomBgmName] = useState<string>("");
  const [isUploadingBgm, setIsUploadingBgm] = useState(false);
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);

  // Caption Filter
  const [captionFilter, setCaptionFilter] = useState("all");

  // User Uploaded Video Clips & Images
  const [userMediaClips, setUserMediaClips] = useState<Array<{ file: File; type: "video" | "image"; url: string }>>([]);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const multiMediaInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Duration & Calculation (1 Min = 1 Credit)
  const calculatedCredits = Math.max(1, Math.min(10, Math.ceil((audioDurationSec || 60) / 60)));

  // Load sample demo
  const handleLoadSampleDemo = () => {
    onTopicTitleChange?.("The Psychology of High Performance");
    setAudioPreviewUrl("/assets/reusable/testing1.mp3");
    setAudioDurationSec(60);
    // Fake local file for test
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
    const imageFilesList: File[] = [...uploadedImageFiles];

    Array.from(files).forEach(f => {
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

    setUserMediaClips(prev => [...prev, ...newClips]);
    onUploadedImageFilesChange(imageFilesList);
    onAssetSourceModeChange("mix");
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
  const togglePlayBgmTrack = (trackPath: string) => {
    if (trackPath === "none") {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
      return;
    }
    if (playingBgmPreview === trackPath) {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = trackPath.startsWith("http") ? trackPath : `/${trackPath.replace(/^\/+/, "")}`;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, activeBgmVolume / 100);
        bgmPreviewAudioRef.current.play().then(() => {
          setPlayingBgmPreview(trackPath);
        }).catch(() => setPlayingBgmPreview(null));
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
      previewAudioRef.current.play().then(() => {
        setIsPreviewAudioPlaying(true);
      }).catch(err => {
        console.warn("Playback error:", err);
      });
    }
  };

  // Active scene calculation
  const currentPreviewScene = sceneBlueprint[activePreviewIndex] || sceneBlueprint[0];

  // Final Generate Video Action (Guarded by Compulsory Preview)
  const handleTriggerGenerate = () => {
    if (!previewConfirmed) {
      alert("Compulsory Preview: Please inspect the 16:9 preview and click 'Approve & Confirm Preview' before rendering.");
      return;
    }

    const finalBgmUrl = customBgmUrl || (selectedBgmTrack === "none" ? "" : selectedBgmTrack);

    const payload = {
      sceneBlueprint,
      brollUrls,
      transcript: editableTranscript || transcriptText,
      segments: transcriptSegments,
      durationSeconds: audioDurationSec || 60,
      topicTitle: topicTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Video"),
      backgroundTheme: "solid-white",
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      facelessBgmMood,
      facelessBgmVolume: finalBgmUrl ? activeBgmVolume / 100 : 0,
      facelessEnableSfx,
      facelessPacingStyle,
      assetSourceMode,
      visualArtStyle,
      aspectRatio: "16:9",
      bgmUrl: finalBgmUrl,
      userMediaClips,
    };

    onGenerate(payload);
  };

  const filteredCaptionStyles = TWENTY_CAPTION_STYLES.filter(s => {
    if (captionFilter === "all") return true;
    return s.category.toLowerCase() === captionFilter.toLowerCase();
  });

  return (
    <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/40 min-w-0 max-w-full space-y-8 text-slate-900">
      <BorderBeam size={320} duration={14} colorFrom="#0066FF" colorTo="#2563EB" />

      {/* Hidden BGM preview audio */}
      <audio ref={bgmPreviewAudioRef} onEnded={() => setPlayingBgmPreview(null)} />

      {/* ── STUDIO HEADER STEPPER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-2xl bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] p-2.5 text-white shadow-md shadow-[#0066FF]/20">
            <Film size={22} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">16:9 Faceless Video Studio</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0066FF]">
                1080p Widescreen
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5">
              Clean White Canvas • 20 Caption Styles • Multi-Clip Upload • {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""} (1 Min = 1 Cr)
            </p>
          </div>
        </div>

        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset current project?")) {
                onSelectFile(null);
                setTranscriptText("");
                setSceneBlueprint([]);
                setPreviewConfirmed(false);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Start Fresh</span>
          </button>
        )}
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="facelessVideo" />

      {/* Planning or Error Banner */}
      {isPlanning && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex items-center gap-3 text-sm font-bold text-slate-800 shadow-xs animate-pulse">
          <Sparkles size={18} className="animate-spin text-[#0066FF]" />
          <span>{planningMessage || "Transcribing speech and structuring visual scene beats..."}</span>
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

      {/* ── TWO COLUMN MAIN WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Media Ingest & Assets */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Required Spoken Audio Narration */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                  <Mic size={18} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">Narration Voiceover Audio</span>
                  <p className="text-[11px] text-slate-500">Spoken narration or script recording (Up to 5 min / 300s)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!selectedFile && (
                  <button
                    type="button"
                    onClick={handleLoadSampleDemo}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[11px] font-bold text-[#0066FF] hover:bg-blue-100 transition cursor-pointer shadow-xs"
                  >
                    <Sparkles size={12} />
                    <span>Try Sample Demo</span>
                  </button>
                )}
                <span className="text-[11px] font-extrabold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">
                  Required
                </span>
              </div>
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
                className="w-full h-44 border-2 border-dashed border-slate-200 hover:border-[#0066FF]/60 rounded-2xl bg-slate-50/70 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-slate-900 cursor-pointer group"
              >
                <div className="rounded-full bg-white p-3 group-hover:scale-110 shadow-xs group-hover:bg-blue-50 transition-transform">
                  <UploadCloud size={32} className="text-[#0066FF]" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold text-slate-800">Click to Upload Voiceover Audio</p>
                  <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A, or MP4 • Max 5 Minutes (300s)</p>
                  <span className="inline-block mt-2 font-mono text-[11px] text-[#0066FF] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
                    1 Min = 1 Credit
                  </span>
                </div>
              </button>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 shrink-0">
                      <CheckCircle2 size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          {Math.floor(audioDurationSec / 60)}:{(audioDurationSec % 60).toString().padStart(2, "0")} / 05:00 Max
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-amber-700">
                          {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""} Cost
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw size={13} />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectFile(null)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer border border-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {audioPreviewUrl && (
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-3">
                    <Volume2 size={16} className="text-emerald-600 shrink-0" />
                    <audio controls src={audioPreviewUrl} className="w-full h-8 accent-[#FF5722]" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Multiple Images AND Video Clips Upload Zone */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                  <Video size={18} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">Custom B-Roll Images &amp; Video Clips</span>
                  <p className="text-[11px] text-slate-500">Upload your own MP4 video clips &amp; images to blend into the scenes</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold uppercase bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full">
                Optional
              </span>
            </div>

            <input
              ref={multiMediaInputRef}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              multiple
              onChange={handleMultiMediaSelect}
              className="hidden"
            />

            <div className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0066FF]/50 bg-slate-50/60 p-5 flex flex-col items-center justify-center gap-3 text-center transition">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0066FF] shadow-xs">
                  <Video size={20} />
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-500 shadow-xs">
                  <ImageIcon size={20} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Drag &amp; Drop or Select Multiple Videos and Images</p>
                <p className="text-[11px] text-slate-400 mt-0.5">MP4 video clips, B-roll footage, diagrams, PNG graphics</p>
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

            {/* Display Media Clips Gallery */}
            {userMediaClips.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin pt-1">
                {userMediaClips.map((item, idx) => (
                  <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 group shadow-xs bg-black">
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

          {/* 3. Background Music (AWS S3 Tracks + Custom Upload + Volume Slider) */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                  <Music size={18} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">Background Music &amp; Audio Level</span>
                  <p className="text-[11px] text-slate-500">Pick from AWS S3 music catalog or upload your own background audio</p>
                </div>
              </div>

              {/* Volume Pill Display */}
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                <Volume2 size={14} className="text-[#0066FF]" />
                <span className="text-xs font-black text-slate-800">Volume: {activeBgmVolume}%</span>
              </div>
            </div>

            {/* Interactive Volume Slider (Default: 12%) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders size={13} className="text-[#0066FF]" />
                  <span>Background Music Volume (Default: 12%)</span>
                </span>
                <span className="font-mono text-xs font-black text-[#0066FF] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {activeBgmVolume}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={activeBgmVolume}
                onChange={e => {
                  const val = Number(e.target.value);
                  setActiveBgmVolume(val);
                  onBgmVolumeChange?.(val / 100);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF5722]"
              />

              <div className="flex items-center gap-2 pt-1">
                {[
                  { label: "Mute (0%)", val: 0 },
                  { label: "Subtle (12% - Recommended)", val: 12 },
                  { label: "Moderate (20%)", val: 20 },
                  { label: "Prominent (35%)", val: 35 },
                ].map(p => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => {
                      setActiveBgmVolume(p.val);
                      onBgmVolumeChange?.(p.val / 100);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition cursor-pointer ${
                      activeBgmVolume === p.val
                        ? "bg-[#FF5722] text-white border-[#0066FF]"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
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
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0">
                  <Upload size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {customBgmName ? `Uploaded: ${customBgmName}` : "Upload Custom Background Audio"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {customBgmUrl ? "Custom music track active for render" : "Upload your own royalty-free background MP3"}
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
                      setSelectedBgmTrack(AWS_FACELESS_BGM_TRACKS[0].path);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => bgmInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition cursor-pointer shadow-xs"
                  >
                    <Upload size={12} />
                    <span>Upload Track</span>
                  </button>
                )}
              </div>
            </div>

            {/* AWS S3 Preset Music Tracks */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Or Pick from AWS S3 Production Music Library ({AWS_FACELESS_BGM_TRACKS.length} Tracks)</span>
                <span className="text-[10px] text-slate-400">All royalty-free for YouTube monetization</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {AWS_FACELESS_BGM_TRACKS.map(track => {
                  const isSelected = !customBgmUrl && selectedBgmTrack === track.path;
                  const isPlaying = playingBgmPreview === track.path;

                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setCustomBgmUrl("");
                        setSelectedBgmTrack(track.path);
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? "border-[#0066FF] bg-blue-50/70 text-slate-900 shadow-xs ring-1 ring-orange-500"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black truncate">{track.label}</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {track.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate block mt-0.5">{track.desc}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {track.path !== "none" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayBgmTrack(track.path);
                            }}
                            title="Listen to Preview"
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-xs"
                          >
                            {isPlaying ? <Pause size={12} className="text-[#0066FF]" /> : <Play size={12} className="text-slate-600" />}
                          </button>
                        )}

                        {isSelected && <CheckCircle2 size={16} className="text-[#0066FF]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. 20 YouTube Subtitle & Caption Themes Selector */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                  <Type size={18} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">20 Master YouTube 16:9 Caption Styles</span>
                  <p className="text-[11px] text-slate-500">Kinetic typography and active word highlights</p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {["all", "viral", "cinema", "modern", "editorial", "book"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCaptionFilter(cat)}
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      captionFilter === cat
                        ? "bg-[#FF5722] text-white border-[#0066FF]"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 20 Caption Cards Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredCaptionStyles.map(theme => {
                const isSelected = subtitleStyle === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onSubtitleStyleChange?.(theme.id)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0066FF] bg-blue-50/70 text-slate-900 shadow-xs ring-1 ring-orange-500"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-xs" style={{ backgroundColor: theme.color }} />
                        <span className="text-xs font-black text-slate-900">{theme.name}</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {theme.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1.5">{theme.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Video Topic Title, Pacing & Render Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                  <Film size={18} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900">Project Title &amp; Topic</span>
                  <p className="text-[11px] text-slate-500">Defines video theme and headline markers</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold uppercase bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Video Topic Title</label>
              <input
                type="text"
                value={topicTitle}
                onChange={e => onTopicTitleChange?.(e.target.value)}
                placeholder="e.g. 5 Habits That Changed My Life"
                className="w-full mt-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition shadow-xs"
              />
            </div>
          </div>

          {/* Format Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Aspect Ratio:</span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                <Sparkles size={12} className="text-[#0066FF]" />
                16:9 Landscape Full HD (1920×1080)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Canvas Surface:</span>
              <span className="font-bold text-slate-900">Clean White (#FFFFFF)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Selected Caption Style:</span>
              <span className="font-bold text-slate-900">
                {TWENTY_CAPTION_STYLES.find(s => s.id === subtitleStyle)?.name || "Flame Glow"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Audio BGM &amp; Volume:</span>
              <span className="font-bold text-slate-900">
                {customBgmUrl ? "Custom Upload" : (AWS_FACELESS_BGM_TRACKS.find(t => t.path === selectedBgmTrack)?.label || "None")} ({activeBgmVolume}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200">
              <span>Credit Cost:</span>
              <span className="font-mono text-sm font-black text-[#0066FF]">
                {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""} (1 Min = 1 Cr)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAGE 2: EDITORIAL TRANSCRIPT & COMPULSORY 16:9 LIVE PREVIEW ── */}
      {sceneBlueprint.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-200">

          {/* Top Bar with Active Scene Count & Transcript Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>16:9 Scene Storyboard Timeline</span>
                <span className="text-xs font-extrabold bg-blue-100 border border-blue-200 text-[#0066FF] px-2.5 py-0.5 rounded-full">
                  {sceneBlueprint.length} Active Scenes
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect live 16:9 canvas cards, fix any typos in the transcript, and confirm before cloud rendering
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                showTranscriptEditor
                  ? "border-[#0066FF] bg-blue-50 text-[#0066FF]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs"
              }`}
            >
              <Edit3 size={14} />
              <span>{showTranscriptEditor ? "Hide Transcript Editor" : "Edit Spoken Transcript"}</span>
            </button>
          </div>

          {/* EDITORIAL TRANSCRIPT MARKDOWN EDITOR */}
          {showTranscriptEditor && (
            <div className="rounded-[28px] border-2 border-blue-200 bg-white p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Editorial Transcript Editor (Correct Spelling &amp; Jargon)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fix misheard brand names or typos before generating video subtitles
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveEditedTranscript}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                >
                  {transcriptSavedFeedback ? (
                    <>
                      <CheckCheck size={14} />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save &amp; Update Subtitles</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={editableTranscript}
                onChange={e => setEditableTranscript(e.target.value)}
                rows={6}
                placeholder="Spoken narration transcript..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition shadow-inner font-mono"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{editableTranscript.trim().split(/\s+/).filter(Boolean).length} Words</span>
                <span>Clicking &ldquo;Save &amp; Update Subtitles&rdquo; updates the transcript for cloud render.</span>
              </div>
            </div>
          )}

          {/* ── COMPULSORY INTERACTIVE 16:9 LIVE PREVIEW PLAYER ── */}
          <div className="rounded-[28px] border-2 border-blue-200 bg-white p-6 sm:p-7 space-y-5 shadow-lg shadow-[#0066FF]/10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-[#0066FF] border border-blue-500/20">
                  <Eye size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Live 16:9 Visual Preview (Compulsory Review)
                  </h4>
                  <p className="text-xs text-slate-500">
                    High-contrast typography, kinetic cards, and audio sync on white canvas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {audioPreviewUrl && (
                  <button
                    type="button"
                    onClick={togglePreviewAudio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {isPreviewAudioPlaying ? (
                      <>
                        <Pause size={13} className="text-[#0066FF]" />
                        <span>Pause Audio Sync</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="text-[#0066FF]" />
                        <span>Play Audio Sync</span>
                      </>
                    )}
                  </button>
                )}

                {previewConfirmed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Preview Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black animate-pulse">
                    <AlertCircle size={14} className="text-amber-600" />
                    Preview Required
                  </span>
                )}
              </div>
            </div>

            {/* Hidden audio element for preview sync */}
            {audioPreviewUrl && (
              <audio ref={previewAudioRef} src={audioPreviewUrl} preload="auto" onEnded={() => setIsPreviewAudioPlaying(false)} />
            )}

            {/* 16:9 Canvas Mockup */}
            <div className="aspect-video w-full rounded-2xl border border-slate-200 bg-[#FFFFFF] relative overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center shadow-inner">
              {/* Dot Grid Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.08) 1.5px, transparent 1.5px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Soft Ambient Glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              {/* Scene Content inside Canvas */}
              {currentPreviewScene ? (
                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-[#0066FF] border border-blue-200">
                    {currentPreviewScene.sceneType || "SCENE CARD"}
                  </span>

                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {currentPreviewScene.heading || currentPreviewScene.narrationSegment?.text || "Key Takeaway"}
                  </h2>

                  {currentPreviewScene.supportingPoints && currentPreviewScene.supportingPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center max-w-lg mt-2">
                      {currentPreviewScene.supportingPoints.map((pt: string, i: number) => (
                        <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                          {pt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 text-[11px] font-mono font-bold text-slate-500">
                    Scene {activePreviewIndex + 1} of {sceneBlueprint.length}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No scenes generated yet</p>
              )}
            </div>

            {/* Scrubber Navigation and Confirmation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex(prev => Math.max(0, prev - 1))}
                  disabled={activePreviewIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  Scene {activePreviewIndex + 1} of {sceneBlueprint.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex(prev => Math.min(sceneBlueprint.length - 1, prev + 1))}
                  disabled={activePreviewIndex >= sceneBlueprint.length - 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Approval Button */}
              <button
                type="button"
                onClick={() => setPreviewConfirmed(true)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  previewConfirmed
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white shadow-md shadow-[#0066FF]/25/20 hover:brightness-110 active:scale-95"
                }`}
              >
                {previewConfirmed ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>✓ Preview Confirmed (Ready to Render)</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span>Approve &amp; Confirm Preview (Required)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timeline View */}
          <FacelessStoryboardTimeline
            scenes={sceneBlueprint}
            brollUrls={brollUrls}
            onReorderScenes={setSceneBlueprint}
            onUpdateSceneText={(sceneId, text) => {
              setSceneBlueprint(prev => prev.map(s => s.id === sceneId ? { ...s, heading: text } : s));
            }}
          />

          {/* Final Action Bar (Guarded by Compulsory Preview) */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleTriggerGenerate}
              disabled={isGenerating || !previewConfirmed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-black transition-all duration-200 ${
                !previewConfirmed
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : isGenerating
                  ? "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white opacity-80 cursor-wait animate-pulse shadow-xl"
                  : "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white shadow-xl shadow-[#0066FF]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              {!previewConfirmed ? (
                <>
                  <Lock size={18} className="text-slate-400" />
                  <span>Preview Required to Unlock Render</span>
                </>
              ) : (
                <>
                  <Film size={18} className="stroke-[2.5]" />
                  <span>
                    {isGenerating
                      ? "Submitting Cloud Render..."
                      : `Generate 1080p Widescreen Video (${calculatedCredits} Credit${calculatedCredits > 1 ? "s" : ""})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

