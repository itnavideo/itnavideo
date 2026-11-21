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
  Video,
  Image as ImageIcon,
  CheckCheck,
  Edit3,
  Save,
  Lock,
  ShieldCheck,
  Mic,
  Type,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  Search,
  Headphones,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { StudioStepper, StudioStepperRow } from "@/components/dashboard/shared/StudioStepper";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import {
  ThreeDMicrophoneIcon,
  ThreeDClapperboardIcon,
} from "@/components/ui/ThreeDimensionalIcons";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  STYLE_PREVIEW_WORDS,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";
import {
  RAW_ITNAVIDEO_STOCK_ASSETS,
  ITNAVIDEO_STOCK_CATEGORIES,
  toAbsoluteS3AssetUrl,
  type ItnaVideoStockAsset,
} from "@/constants/itnavideoStockAssets";

export const FACELESS_STEPS = [
  { step: 0, title: "Overview", desc: "Process & Time" },
  { step: 1, title: "Upload", desc: "Audio & Script" },
  { step: 2, title: "Music", desc: "Soundtrack & Volume" },
  { step: 3, title: "Style", desc: "Typography & Theme" },
  { step: 4, title: "Storyboard", desc: "Scene Review & Render" },
] as const;

// ── Font Selection (Dual Font Architecture: Font 1 & Font 2) ──
export const POPULAR_HEADING_FONTS = [
  { id: "Lora", name: "Lora", sample: "Mastery & Vision", category: "Editorial Serif", desc: "Vox & NYT Editorial Serif" },
  { id: "Playfair Display", name: "Playfair Display", sample: "Timeless Luxury", category: "Luxury Serif", desc: "High-Contrast Luxury" },
  { id: "Georgia", name: "Georgia", sample: "Authoritative Truth", category: "Classic Serif", desc: "Balanced Editorial Serif" },
  { id: "Montserrat", name: "Montserrat", sample: "YOUTUBE IMPACT", category: "Bold Sans", desc: "Punchy Modern YouTube" },
  { id: "Cinzel", name: "Cinzel", sample: "ANCIENT WISDOM", category: "Cinema Serif", desc: "Documentary Authority" },
  { id: "Bebas Neue", name: "Bebas Neue", sample: "THE BIG SHIFT", category: "Headline Display", desc: "Tall Punchy Title Sans" },
  { id: "Anton", name: "Anton", sample: "STOP SCROLLING", category: "Hook Display", desc: "Ultra-Bold Hook Title" },
  { id: "Archivo Black", name: "Archivo Black", sample: "RAW POWER", category: "Heavy Sans", desc: "Heavy Industrial Punch" },
  { id: "Outfit", name: "Outfit", sample: "Future of AI", category: "Tech Sans", desc: "Clean Geometric Tech" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta", sample: "Modern Thinking", category: "Modern Sans", desc: "Global Clean Tech Sans" },
] as const;

export const POPULAR_BODY_FONTS = [
  { id: "Plus Jakarta Sans", name: "Plus Jakarta", sample: "Every breakthrough starts with a quiet insight.", category: "Tech Sans", desc: "High-Retention Reading" },
  { id: "Inter", name: "Inter", sample: "Clear typography builds trust and effortless focus.", category: "Clean Sans", desc: "Neutral Modern Legibility" },
  { id: "DM Sans", name: "DM Sans", sample: "Friendly geometric letters engineered for screens.", category: "Geometric Sans", desc: "Friendly Subtitles" },
  { id: "Poppins", name: "Poppins", sample: "Rounded contemporary rhythm that feels inviting.", category: "Rounded Sans", desc: "Contemporary Clean" },
  { id: "Nunito", name: "Nunito", sample: "Warm human balance that makes narration natural.", category: "Warm Sans", desc: "Warm Balanced Narrative" },
  { id: "Lora", name: "Lora", sample: "Refined storytelling rhythm from classic literature.", category: "Story Serif", desc: "Refined Storytelling Serif" },
] as const;

// ── Background Palette Selection ──
export const BACKGROUND_PALETTES = [
  { id: "solid-white", name: "Warm Off-White", color: "#FAF6F2", text: "#141414", desc: "Warm Cream Tone with Subtle #EFE7DF Diagonal Depth & Deep Charcoal Text (Recommended)" },
  { id: "deep-dark", name: "Deep Dark", color: "#09090b", text: "#FFFFFF", desc: "Dark Luxury YouTube Documentary" },
  { id: "warm-editorial", name: "Warm Editorial", color: "#FCFBF7", text: "#1C1917", desc: "Substack & Vox Paper Aesthetic" },
  { id: "modern-slate", name: "Modern Slate", color: "#0F172A", text: "#FFFFFF", desc: "Engineering & Tech Dark Slate" },
  { id: "midnight-blue", name: "Midnight Navy", color: "#0B0F19", text: "#FFFFFF", desc: "Deep Cinematic Midnight" },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

/**
 * Modern tactile on/off switch component (Clean iOS / Linear standard)
 */
export function ModernToggleSwitch({
  checked,
  onChange,
  activeColor = "orange",
  size = "md",
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  activeColor?: "orange" | "emerald";
  size?: "sm" | "md";
}) {
  const isSm = size === "sm";
  const wClass = isSm ? "w-11 h-6" : "w-[48px] h-7";
  const knobSize = isSm ? "w-4 h-4" : "w-5 h-5";
  const translateClass = checked ? (isSm ? "translate-x-5" : "translate-x-[23px]") : "translate-x-1";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex items-center ${wClass} rounded-full transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none shrink-0 ${
        checked
          ? activeColor === "emerald"
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/25 ring-2 ring-emerald-500/20"
            : "bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/25 ring-2 ring-orange-500/20"
          : "bg-slate-200 border border-slate-300/80 shadow-inner"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center ${knobSize} rounded-full bg-white shadow-md shadow-black/15 transition-transform duration-200 ease-out transform ${translateClass}`}
      >
        {checked ? (
          <Check size={isSm ? 10 : 12} strokeWidth={3} className={activeColor === "emerald" ? "text-emerald-600" : "text-orange-600"} />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        )}
      </span>
    </button>
  );
}

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

  headingFont?: string;
  onHeadingFontChange?: (font: string) => void;
  bodyFont?: string;
  onBodyFontChange?: (font: string) => void;

  bgmEnabled?: boolean;
  onBgmEnabledChange?: (enabled: boolean) => void;

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
    availableAssetsPool?: any[];
  } | null>;
  isPlanning?: boolean;
  planningMessage?: string;
  planningError?: string | null;
  onClearPlanningError?: () => void;
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
  headingFont = "Lora",
  onHeadingFontChange,
  bodyFont = "Plus Jakarta Sans",
  onBodyFontChange,
  bgmEnabled = true,
  onBgmEnabledChange,
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
  onSceneBlueprintChange,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
}) => {
  // ── Flexible Step State (Step 0: Overview Roadmap, Step 1: Upload, Step 2: Music, Step 3: Style, Step 4: Storyboard) ──
  const [currentStep, setCurrentStep] = useState<number>(selectedFile ? 1 : 0);

  useEffect(() => {
    if (selectedFile && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [selectedFile]);

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

  // Background Music State (Default 12%)
  const [activeBgmVolume, setActiveBgmVolume] = useState<number>(Math.round(facelessBgmVolume * 100) || 12);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(
    selectedBgmTrackId || AWS_BGM_TRACKS[0]?.id || "not-for-nothing-otis-mcdonald"
  );
  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || "modern-saas");
  const [activeHeadingFont, setActiveHeadingFont] = useState<string>(headingFont || "Lora");
  const [activeBodyFont, setActiveBodyFont] = useState<string>(bodyFont || "Plus Jakarta Sans");
  const [isBgmActive, setIsBgmActive] = useState<boolean>(bgmEnabled ?? true);

  // Storyboard Scene Editing & Swapping State (Audit Recommendation 1)
  const [swapModalSceneIndex, setSwapModalSceneIndex] = useState<number | null>(null);
  const [editSceneIndex, setEditSceneIndex] = useState<number | null>(null);
  const [editHeadlineInput, setEditHeadlineInput] = useState<string>("");
  const [editTakeawayInput, setEditTakeawayInput] = useState<string>("");
  const [editNarrationInput, setEditNarrationInput] = useState<string>("");
  const [editLayoutInput, setEditLayoutInput] = useState<string>("card_concept");
  const [showPreRenderModal, setShowPreRenderModal] = useState<boolean>(false);

  // Curated stock library for 16:9 widescreen scenes
  const CURATED_16_9_STOCKS = [
    {
      title: "Modern Tech Office & Cloud Strategy",
      url: "/assets/reusable/images/realistic/businesswoman_analyzing_cloud_services_workflow_office.png",
      tag: "Tech & Corporate",
    },
    {
      title: "Financial Growth & Analytics Chart",
      url: "/assets/reusable/images/realistic/businessman_presenting_financial_growth_chart_modern_of.png",
      tag: "Finance & Data",
    },
    {
      title: "Executive Penthouse & Global Reach",
      url: "/assets/reusable/images/realistic/professional_man_luxury_penthouse_dubai_skyline.png",
      tag: "Leadership",
    },
    {
      title: "Creator Studio & AI Prompt Engineering",
      url: "/assets/reusable/images/realistic/young_man_explaining_ai_prompts_youtube_studio.png",
      tag: "Media & AI",
    },
    {
      title: "Deep Focus & Financial Budgeting Desk",
      url: "/assets/reusable/images/realistic/overhead_desk_budgeting_financial_planning_tools.png",
      tag: "Strategy",
    },
    {
      title: "Confident Professional European Walk",
      url: "/assets/reusable/images/realistic/confident_woman_walking_european_cobblestone_street.png",
      tag: "Mindset",
    },
    {
      title: "Data Visualization & Curved Displays",
      url: "/assets/reusable/images/realistic/woman_analyzing_complex_data_on_curved_monitor_in_moder.png",
      tag: "Analytics",
    },
    {
      title: "Clean Home Office Dialogue & Explaining",
      url: "/assets/reusable/images/realistic/young_woman_talking_gesturing_home_setting.png",
      tag: "Communication",
    },
  ];

  // S3 Curated Media Pool State
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [selectedSceneForAssetSwap, setSelectedSceneForAssetSwap] = useState<number | null>(null);
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>("all");
  const [assetSearchQuery, setAssetSearchQuery] = useState<string>("");
  const [assetStyleFilter, setAssetStyleFilter] = useState<string>("all");

  const handleRemoveAssetFromScene = (sceneNum: number) => {
    setBrollUrls((prev) => {
      const next = { ...prev };
      delete next[sceneNum];
      return next;
    });
    setSceneBlueprint((prev) =>
      prev.map((sc) =>
        sc.sceneNumber === sceneNum ? { ...sc, assetUrl: undefined, brollUrl: undefined, assignedAssetId: undefined } : sc
      )
    );
  };

  const handleAssignAssetToCurrentOrTarget = (assetUrl: string) => {
    const targetSceneNum = selectedSceneForAssetSwap || 1;
    setBrollUrls((prev) => ({
      ...prev,
      [targetSceneNum]: assetUrl,
    }));
    setSceneBlueprint((prev) =>
      prev.map((sc) =>
        sc.sceneNumber === targetSceneNum ? { ...sc, assetUrl, brollUrl: assetUrl } : sc
      )
    );
  };

  const allStockPool: any[] = availableAssets.length > 0
    ? availableAssets
    : RAW_ITNAVIDEO_STOCK_ASSETS.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      categoryLabel: a.categoryLabel,
      url: a.url,
      absoluteUrl: toAbsoluteS3AssetUrl(a.url),
      style: a.style || "2d",
      tags: a.positiveTags || [],
    }));

  const filteredAssets = allStockPool.filter((asset) => {
    const matchesCat = assetCategoryFilter === "all" || asset.category === assetCategoryFilter;
    const matchesStyle = assetStyleFilter === "all" || asset.style === assetStyleFilter;
    const matchesSearch =
      !assetSearchQuery.trim() ||
      (asset.title && asset.title.toLowerCase().includes(assetSearchQuery.toLowerCase())) ||
      (asset.tags && asset.tags.some((t: string) => t.toLowerCase().includes(assetSearchQuery.toLowerCase())));
    return matchesCat && matchesStyle && matchesSearch;
  });

  const handleOpenSwapModal = (sceneIdx: number) => {
    setSwapModalSceneIndex(sceneIdx);
  };

  const handleSelectAssetForScene = (assetUrl: string) => {
    if (swapModalSceneIndex === null) return;
    const sceneNum = swapModalSceneIndex + 1;
    setBrollUrls((prev) => ({
      ...prev,
      [sceneNum]: assetUrl,
    }));
    setSceneBlueprint((prev) =>
      prev.map((sc, i) => (i === swapModalSceneIndex ? { ...sc, brollUrl: assetUrl } : sc))
    );
    setSwapModalSceneIndex(null);
  };

  const handleOpenEditModal = (sceneIdx: number) => {
    const sc = sceneBlueprint[sceneIdx];
    if (!sc) return;
    setEditSceneIndex(sceneIdx);
    // Use correct SceneBlueprintItem field names: heading, supportingText, narrationSegment.text
    setEditHeadlineInput(sc.heading || sc.title || sc.headline || "");
    setEditTakeawayInput(sc.supportingText || sc.keyTakeaway || "");
    setEditNarrationInput(sc.narrationSegment?.text || sc.narrationExcerpt || sc.description || "");
    setEditLayoutInput(sc.layoutType || "card_concept");
  };

  const handleSaveSceneEdits = () => {
    if (editSceneIndex === null) return;
    setSceneBlueprint((prev) =>
      prev.map((sc, i) =>
        i === editSceneIndex
          ? {
            ...sc,
            // Map to correct SceneBlueprintItem fields
            heading: editHeadlineInput,
            supportingText: editTakeawayInput,
            layoutType: editLayoutInput,
            narrationSegment: sc.narrationSegment
              ? { ...sc.narrationSegment, text: editNarrationInput || sc.narrationSegment.text }
              : { text: editNarrationInput, startSeconds: 0 },
            // Also keep legacy aliases for backward compatibility
            title: editHeadlineInput,
            headline: editHeadlineInput,
            keyTakeaway: editTakeawayInput,
          }
          : sc
      )
    );
    setEditSceneIndex(null);
  };

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);

  // Sync BGM track when parent prop changes (PageClient -> Studio)
  useEffect(() => {
    if (selectedBgmTrackId) {
      setSelectedBgmTrack(selectedBgmTrackId);
    }
  }, [selectedBgmTrackId]);

  const [customBgmUrl, setCustomBgmUrl] = useState<string>("");
  const [customBgmName, setCustomBgmName] = useState<string>("");
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [bgmMoodFilter, setBgmMoodFilter] = useState<string>("all");

  // Step 3 Sub-Tabs: Fast mobile-first navigation across 65 style cards
  const [styleSubTab, setStyleSubTab] = useState<"subtitles" | "themes" | "typography" | "canvas">("subtitles");

  // Caption Filter & Search
  const [captionFilter, setCaptionFilter] = useState("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState("");
  const [previewWordStep, setPreviewWordStep] = useState<number>(1);

  useEffect(() => {
    if (currentStep !== 3) return;
    const interval = setInterval(() => {
      setPreviewWordStep((prev) => (prev + 1) % 3);
    }, 700);
    return () => clearInterval(interval);
  }, [currentStep]);

  const currentCaptionObj = useMemo(() => {
    return (
      THIRTY_TWO_CAPTION_STYLES.find(
        (c) => c.id === subtitleStyle || c.name.toLowerCase() === (subtitleStyle || "").toLowerCase()
      ) || THIRTY_TWO_CAPTION_STYLES[0]
    );
  }, [subtitleStyle]);

  // Filtered BGM tracks by mood chip (Instant mobile search)
  const filteredBgmTracks = useMemo(() => {
    if (bgmMoodFilter === "all") return AWS_BGM_TRACKS;
    return AWS_BGM_TRACKS.filter((t) => {
      if (t.id === "none") return true;
      const cat = (t.category || "").toLowerCase();
      const mood = bgmMoodFilter.toLowerCase();
      if (mood === "lofi") return cat.includes("lo-fi") || cat.includes("chill");
      if (mood === "cinematic") return cat.includes("cinematic") || cat.includes("epic") || cat.includes("drama");
      if (mood === "tech") return cat.includes("beats") || cat.includes("deep") || cat.includes("modern");
      if (mood === "upbeat") return cat.includes("upbeat") || cat.includes("motown") || cat.includes("narrative");
      if (mood === "acoustic") return cat.includes("acoustic") || cat.includes("piano") || cat.includes("zen") || cat.includes("lounge");
      return cat.includes(mood);
    });
  }, [bgmMoodFilter]);

  // User Uploaded Video Clips & Images
  const [userMediaClips, setUserMediaClips] = useState<Array<{ file: File; type: "video" | "image"; url: string }>>([]);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const multiMediaInputRef = useRef<HTMLInputElement>(null);
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
        if ((planRes as any).availableAssetsPool && (planRes as any).availableAssetsPool.length > 0) {
          setAvailableAssets((planRes as any).availableAssetsPool);
        }
        if (planRes.durationSeconds > 0) {
          setAudioDurationSec(planRes.durationSeconds);
        }
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
      const fileType = typeof f?.type === "string" ? f.type : "";
      const fileName = typeof f?.name === "string" ? f.name : "";
      const isVid = fileType.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(fileName);
      const isImg = fileType.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(fileName);
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

  // Final Generate Video Action
  const handleTriggerGenerate = () => {
    const finalBgmUrl = isBgmActive
      ? (customBgmUrl || (selectedBgmTrack === "none" ? "" : getBgmTrackAudioUrl(AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0])))
      : "";

    const payload = {
      sceneBlueprint,
      brollUrls,
      transcript: editableTranscript || transcriptText,
      segments: transcriptSegments,
      durationSeconds: audioDurationSec || 60,
      topicTitle: topicTitle.trim() || "",
      backgroundTheme: backgroundTheme || "solid-white",
      headingFont: activeHeadingFont,
      bodyFont: activeBodyFont,
      bgmEnabled: isBgmActive,
      visualTheme: activeVisualTheme,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      facelessBgmMood,
      facelessBgmVolume: (isBgmActive && finalBgmUrl) ? activeBgmVolume / 100 : 0,
      facelessEnableSfx,
      facelessPacingStyle,
      assetSourceMode,
      aspectRatio: "16:9",
      bgmUrl: finalBgmUrl,
      bgmTrackId: isBgmActive ? selectedBgmTrack : "none",
      userMediaClips,
      removeAiWatermark,
      autoDucking,
    };

    onGenerate(payload);
    return;
  };

  const _legacyTriggerGenerate = () => {
    const finalBgmUrl = customBgmUrl || (selectedBgmTrack === "none" ? "" : getBgmTrackAudioUrl(AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0]));

    const payload = {
      sceneBlueprint,
      brollUrls,
      transcript: editableTranscript || transcriptText,
      segments: transcriptSegments,
      durationSeconds: audioDurationSec || 60,
      topicTitle: topicTitle.trim() || "",
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
      autoDucking,
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

      {/* ── ROW 1: Studio Stepper Row ── */}
      <StudioStepperRow
        steps={[...FACELESS_STEPS]}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* ── ROW 2: Scrollable Studio Workspace ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-6">


          {/* ══════════════════════════════════════════════════════════════
              STEP 0: OVERVIEW & QUICK ROADMAP (Creation Flow & Time Estimates)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Main Hero Card */}
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-orange-50/20 to-white p-5 sm:p-10 shadow-sm relative overflow-hidden">
                {/* Decorative ambient corner blur */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-black text-orange-600 uppercase tracking-wider">
                        <Zap size={13} className="fill-orange-500" />
                        4 Fast Steps • Under 60 Seconds
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-xs font-black text-red-600 border border-red-200 shadow-2xs">
                        <img src="/logos/social/youtube.png" alt="YouTube" className="w-4 h-4 object-contain animate-[pulseGlow_2.5s_ease-in-out_infinite]" />
                        <span>16:9 YouTube Widescreen</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        1080p Cloud Render
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/90 font-['Caveat',cursive] text-base sm:text-lg font-bold -rotate-1 shadow-2xs">
                        ✏️ Under 60 seconds total!
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      How Faceless Video AI Works
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                      Transform your raw voiceover audio or script recording into a retention-optimized, 1080p widescreen YouTube video. Here is the exact 4-step process before you begin:
                    </p>
                  </div>

                  {/* Prominent YouTube 16:9 Feature Card with Dynamic Motion & Floating Glow */}
                  <div className="relative shrink-0 flex flex-col items-center sm:items-end gap-1.5">
                    <div className="relative flex items-center justify-center p-4 sm:p-5 rounded-2xl border border-red-200/90 bg-gradient-to-br from-red-500/10 via-white to-orange-500/10 shadow-md backdrop-blur-xs group overflow-hidden">
                      {/* Animated radial glow ring */}
                      <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-red-500/30 via-orange-500/20 to-red-500/30 blur-xl animate-[pulseGlow_2.5s_ease-in-out_infinite] pointer-events-none" />

                      <div className="flex items-center gap-4 relative z-10">
                        {/* YouTube Animated Floating Icon */}
                        <div className="relative flex items-center justify-center animate-[floatSlow_3.5s_ease-in-out_infinite]">
                          <div className="absolute inset-0 rounded-2xl bg-red-600/30 blur-lg animate-[pulseGlow_2s_ease-in-out_infinite]" />
                          <img
                            src="/logos/social/youtube.png"
                            alt="YouTube 16:9"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_16px_rgba(239,68,68,0.35)] relative transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                              16:9 Cinema
                            </span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">
                            YouTube Video
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            1920 × 1080 Full HD
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 pt-0.5">
                            <CheckCircle2 size={11} />
                            <span>Monetization Ready</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Handwritten annotation under the YouTube card */}
                    <div className="font-['Caveat',cursive] text-red-600 text-base sm:text-lg font-bold -rotate-2 select-none flex items-center gap-1 self-center sm:self-end pr-1">
                      <span>✨ Vox & Johnny Harris documentary style!</span>
                    </div>
                  </div>
                </div>

                {/* 4-Step Interactive Pipeline Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6">
                  {[
                    {
                      step: "Step 1",
                      title: "Upload Voiceover",
                      time: "~10s",
                      desc: "Drop your audio file (MP3, WAV, M4A) or MP4 clip. AI Whisper aligns millisecond-accurate word timestamps.",
                      icon: Mic,
                      tip: "Required",
                      tipColor: "bg-orange-50 text-orange-600 border-orange-200",
                      handnote: "drop voice here 🎙️",
                    },
                    {
                      step: "Step 2",
                      title: "Music & Volume",
                      time: "~10s",
                      desc: "Choose from 14 royalty-free background tracks. Dynamic auto-ducking lowers music volume when you speak.",
                      icon: Headphones,
                      tip: "Auto-Ducking",
                      tipColor: "bg-slate-100 text-slate-600 border-slate-200",
                      handnote: "auto-ducked beats 🎵",
                    },
                    {
                      step: "Step 3",
                      title: "Style & Subtitles",
                      time: "~15s",
                      desc: "Select from 32 kinetic caption animations, 6 visual themes (Modern SaaS, Documentary), and dual font pairings.",
                      icon: Type,
                      tip: "32 Presets",
                      tipColor: "bg-amber-50 text-amber-600 border-amber-200",
                      handnote: "32 viral presets ✨",
                    },
                    {
                      step: "Step 4",
                      title: "Review & Render",
                      time: "~25s",
                      desc: "AI structures speech into visual scenes with matching S3 illustrations and B-roll visuals. 1-Click 1080p render.",
                      icon: Film,
                      tip: "1080p Full HD",
                      tipColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      handnote: "1-click 1080p export 🚀",
                    },
                  ].map((item) => {
                    const IconC = item.icon;
                    return (
                      <div
                        key={item.step}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white/90 hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-black text-xs group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <IconC size={16} />
                              </div>
                              <span className="text-xs font-black text-slate-900">{item.step}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                              {item.time}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                {item.title}
                              </h3>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                              {item.desc}
                            </p>
                            {/* Handwritten playful note */}
                            <p className="font-['Caveat',cursive] text-sm sm:text-base font-bold text-orange-600/90 pt-1 -rotate-1 select-none">
                              {item.handnote}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${item.tipColor}`}>
                            {item.tip}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-500 transition-colors flex items-center gap-0.5">
                            <span>Fast</span>
                            <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checklist & Primary Action Bar */}
                <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-500" />
                      <span>Ready to create your video?</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Have your voiceover recording or script ready. The AI will do the heavy lifting.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Handwritten indicator arrow */}
                    <div className="hidden sm:flex items-center gap-1 text-orange-600 font-['Caveat',cursive] text-xl font-bold -rotate-2 select-none">
                      <span>start here</span>
                      <ArrowRight size={15} className="text-orange-500 animate-[bounceWord_1.5s_infinite]" />
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadSampleDemo}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                      Try Sample Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer group"
                    >
                      <span>Start Step 1: Upload Audio</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (Voiceover Audio)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*,video/mp4"
                onChange={handleNarrationSelect}
                className="hidden"
              />

              {/* Workflow Pipeline Guide (Gradients + Directional Arrows) */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-3 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-orange-50/70 border border-orange-200/60 text-[11px] sm:text-xs font-bold text-slate-700 shadow-2xs overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1.5 shrink-0 text-orange-600 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>1. Voiceover Narration</span>
                </div>
                <ArrowRight size={13} className="text-orange-400 shrink-0" />
                <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>2. Groq Whisper Word-Sync</span>
                </div>
                <ArrowRight size={13} className="text-orange-400 shrink-0" />
                <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
                  <Film size={12} className="text-orange-500" />
                  <span>3. 16:9 Widescreen Storyboard</span>
                </div>
              </div>

              {!selectedFile ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-10 shadow-sm relative overflow-hidden group">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="w-full py-12 sm:py-20 md:py-24 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-3xl bg-slate-50/70 hover:bg-orange-50/20 transition-all duration-300 flex flex-col items-center justify-center gap-4 sm:gap-5 cursor-pointer group relative z-10"
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/20 to-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 group-hover:scale-110 transition duration-500" />
                      <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-orange-50/80 to-white border border-orange-200/80 shadow-md flex items-center justify-center group-hover:scale-110 group-hover:border-orange-400 group-hover:shadow-orange-500/25 transition-all duration-300">
                        <ThreeDMicrophoneIcon size={42} className="sm:hidden filter drop-shadow-[0_6px_12px_rgba(249,115,22,0.3)]" />
                        <ThreeDMicrophoneIcon size={52} className="hidden sm:block filter drop-shadow-[0_8px_16px_rgba(249,115,22,0.3)]" />
                      </div>
                    </div>
                    <div className="text-center px-4 space-y-1 sm:space-y-2">
                      <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                        <span>Upload Audio / Voiceover</span>
                        <ArrowRight size={18} className="text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Drag &amp; drop audio file here or tap to browse
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-600 shadow-2xs">
                      <span>MP3, WAV, M4A, or MP4</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="font-mono font-bold text-slate-700">
                              {formatSec(audioDurationSec)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Ready for 16:9 Cinema
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

                    {/* Waveform Visualizer Bar with Gradient Bars */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={togglePlayAudio}
                            className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center transition cursor-pointer shadow-xs shadow-orange-500/30"
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
                          {isPlayingAudio && (
                            <div className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-600">
                              <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2.5" />
                              <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-3" />
                              <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2" />
                            </div>
                          )}
                          <span>{formatSec(audioCurrentTime)}</span>
                        </div>
                        <span>{formatSec(audioDurationSec)}</span>
                      </div>

                      {/* Interactive Waveform Bars with Gradient */}
                      <div className="flex items-end gap-1 h-12 w-full pt-2 cursor-pointer overflow-hidden">
                        {WAVE_BARS.map((height, i) => {
                          const barProgress = i / WAVE_BARS.length;
                          const currentProgress = audioDurationSec > 0 ? audioCurrentTime / audioDurationSec : 0;
                          const isPlayed = barProgress <= currentProgress;

                          return (
                            <div
                              key={i}
                              onClick={() => handleWaveformSeek(barProgress)}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isPlayed
                                  ? "bg-gradient-to-t from-orange-600 to-amber-400 shadow-2xs shadow-orange-500/20"
                                  : "bg-slate-200 hover:bg-slate-300"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
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
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              STEP 2: MUSIC (Direct Tracks First & Sleek Controls)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Clean Direct Header: Master On/Off Switch & Volume */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <ModernToggleSwitch
                      checked={isBgmActive}
                      onChange={(next) => {
                        setIsBgmActive(next);
                        onBgmEnabledChange?.(next);
                      }}
                      activeColor="orange"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {isBgmActive ? "Background Music: ON" : "Background Music: Muted"}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                          {AWS_BGM_TRACKS.length} Soundtracks
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {isBgmActive ? "Royalty-free YouTube soundtracks with auto-ducking" : "Zero background music will be rendered"}
                      </span>
                    </div>
                  </div>

                  {isBgmActive && (
                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-2xl self-start sm:self-auto">
                      <Volume2 size={15} className="text-orange-500" />
                      <span className="text-xs font-bold text-slate-600">Volume</span>
                      <span className="text-xs font-mono font-black text-orange-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {activeBgmVolume}%
                      </span>
                    </div>
                  )}
                </div>

                {/* DIRECT MUSIC TRACKS LIST (Front & Center!) */}
                {isBgmActive && (
                  <div className="space-y-3.5">
                    {/* BGM Mood Filter Pills (Mobile-First Fast Selection) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: "all", label: "All Tracks" },
                        { id: "lofi", label: "☕ Chill Lo-Fi" },
                        { id: "cinematic", label: "🎬 Cinematic" },
                        { id: "upbeat", label: "🔥 Upbeat" },
                        { id: "tech", label: "⚡ Beats / Modern" },
                        { id: "acoustic", label: "🎸 Acoustic" },
                      ].map((mood) => {
                        const isMoodActive = bgmMoodFilter === mood.id;
                        return (
                          <button
                            key={mood.id}
                            type="button"
                            onClick={() => setBgmMoodFilter(mood.id)}
                            className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                              isMoodActive
                                ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {mood.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {filteredBgmTracks.map((track) => {
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
                            className={`p-3 sm:p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${isSelected
                              ? "border-orange-500 bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-white text-slate-900 shadow-md shadow-orange-500/10 ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                              }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black truncate">{track.label}</span>
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
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
                                    <div className="flex items-end gap-0.5 h-3">
                                      <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2.5" />
                                      <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-3" />
                                      <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2" />
                                    </div>
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
                )}

                {/* Secondary Audio Controls: Volume Slider, Ducking, SFX, Custom Upload */}
                {isBgmActive && (
                  <div className="space-y-4 pt-2">
                    {/* Volume Slider with Quick Presets */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Sliders size={14} className="text-orange-500" />
                          <span>Soundtrack Level</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[
                            { label: "12%", val: 12 },
                            { label: "20%", val: 20 },
                            { label: "35%", val: 35 },
                          ].map((p) => (
                            <button
                              key={p.val}
                              type="button"
                              onClick={() => {
                                setActiveBgmVolume(p.val);
                                onBgmVolumeChange?.(p.val / 100);
                              }}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border transition cursor-pointer ${activeBgmVolume === p.val
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
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
                    </div>

                    {/* Audio Ducking & SFX Toggles with Modern Tactile Switches */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setAutoDucking(!autoDucking)}
                        className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${autoDucking ? "border-orange-300 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                          }`}
                      >
                        <div>
                          <p className="text-xs font-black text-slate-900">Dynamic Auto-Ducking</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Lowers music volume during voiceover speech
                          </p>
                        </div>
                        <ModernToggleSwitch
                          checked={autoDucking}
                          onChange={setAutoDucking}
                          size="sm"
                        />
                      </div>

                      <div
                        onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                        className={`rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition ${facelessEnableSfx ? "border-orange-300 bg-orange-50/40" : "border-slate-200 bg-slate-50/50"
                          }`}
                      >
                        <div>
                          <p className="text-xs font-black text-slate-900">Sound Effects (SFX)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Subtle scene whoosh &amp; metric hit sound cues
                          </p>
                        </div>
                        <ModernToggleSwitch
                          checked={Boolean(facelessEnableSfx)}
                          onChange={(val) => onEnableSfxChange?.(val)}
                          size="sm"
                        />
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

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0">
                          <Upload size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {customBgmName ? `Uploaded: ${customBgmName}` : "Upload Custom Background MP3"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {customBgmUrl ? "Active custom soundtrack" : "Your own royalty-free audio file"}
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
                            <span>Browse</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              STEP 3: STYLE (Mobile-Responsive Sub-Tabs Engine)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Sleek Sub-Tabs Strip (Eliminates 65-card infinite scrolling on mobile) */}
              <div className="p-1 bg-slate-100/90 border border-slate-200/90 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-2xs">
                {[
                  {
                    id: "subtitles",
                    label: "Captions",
                    badge: "32 Presets",
                    active: currentCaptionObj.name,
                    icon: Type,
                  },
                  {
                    id: "themes",
                    label: "Themes",
                    badge: "6 Systems",
                    active: MASTER_THEMES[activeVisualTheme]?.name || activeVisualTheme,
                    icon: Sparkles,
                  },
                  {
                    id: "typography",
                    label: "Fonts",
                    badge: "11 Pairs",
                    active: `${activeHeadingFont} / ${activeBodyFont}`,
                    icon: FileText,
                  },
                  {
                    id: "canvas",
                    label: "Canvas",
                    badge: "5 Tones",
                    active: backgroundTheme || "solid-white",
                    icon: Layers,
                  },
                ].map((tab) => {
                  const isTabActive = styleSubTab === tab.id;
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStyleSubTab(tab.id as any)}
                      className={`flex-1 min-w-[105px] sm:min-w-0 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                        isTabActive
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-black scale-[1.01]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold"
                      }`}
                    >
                      <IconComp size={14} className={isTabActive ? "text-white" : "text-slate-400"} />
                      <span className="text-xs">{tab.label}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        isTabActive ? "bg-white/20 text-white border border-white/30" : "bg-slate-200/80 text-slate-500"
                      }`}>
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab: Visual Themes */}
              {styleSubTab === "themes" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-orange-500" />
                      <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Visual Themes
                      </h2>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                      6 Master Themes
                    </span>
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
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${isSelected
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
            )}

            {/* Sub-Tab 2: Kinetic Subtitle Captions (32 Presets) */}
            {styleSubTab === "subtitles" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-5">
                {/* Kinetic Caption Pipeline Guide */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-slate-50 border border-orange-200/60 overflow-x-auto scrollbar-none shadow-2xs">
                  <span className="text-orange-600 font-extrabold flex items-center gap-1.5 shrink-0">
                    <Zap size={13} className="fill-orange-500 text-orange-500" />
                    Kinetic Pipeline:
                  </span>
                  <span className="text-slate-800 shrink-0">Spoken Speech</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-slate-800 shrink-0">Word Timestamps</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-orange-600 font-bold shrink-0">Active Word Glow</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-slate-800 shrink-0">1080p Cinema Burn-in</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Type size={18} className="text-orange-500" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Kinetic Caption Styles
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                      32 Presets
                    </span>
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

                {/* Active Subtitle Live Cinema Preview Bar */}
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                          Active Preset:
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                          {currentCaptionObj.name}
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            {currentCaptionObj.category}
                          </span>
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {currentCaptionObj.desc}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Preview Words Live Preview */}
                  <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black/80 border border-slate-800 flex items-center justify-center min-w-[220px]">
                    {renderPreviewCaptionWords(
                      currentCaptionObj.id,
                      currentCaptionObj.color,
                      currentCaptionObj.fontFamily,
                      previewWordStep
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["all", "viral", "cinema", "modern", "creative", "minimal"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCaptionFilter(cat)}
                      className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${captionFilter === cat
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

                        {/* Live Kinetic Word Preview Strip */}
                        <div className="bg-slate-950 rounded-xl px-3 py-2.5 flex items-center justify-center min-h-[44px] overflow-hidden border border-slate-800/80 shadow-inner">
                          {renderPreviewCaptionWords(
                            theme.id,
                            theme.color,
                            theme.fontFamily,
                            isSelected ? previewWordStep : 1
                          )}
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
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${facelessPacingStyle === pace.id
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
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${captionPosition === pos.id
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
            )}

            {/* Sub-Tab 3: Dual Font Typography (Font 1 & Font 2) */}
            {styleSubTab === "typography" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Type size={18} className="text-orange-500" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Font Pairing Selection
                    </h2>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                    Dual Font Architecture
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Font 1: Headline & Stats Font */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">1</span>
                        <span>Font 1 (Headlines, Numbers &amp; Hook Words)</span>
                      </label>
                      <span className="text-[10px] font-bold text-orange-600 font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {activeHeadingFont}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {POPULAR_HEADING_FONTS.map((f: any) => {
                        const isSelected = activeHeadingFont === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setActiveHeadingFont(f.id);
                              onHeadingFontChange?.(f.id);
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                              }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] font-bold text-slate-500 font-sans">{f.name}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 font-sans">
                                  {f.category}
                                </span>
                                {isSelected && (
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xs">
                                    <Check size={10} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actual Font Live Specimen Preview */}
                            <div className="py-1">
                              <span
                                style={{ fontFamily: `'${f.id}', serif, sans-serif` }}
                                className="text-base sm:text-lg font-black text-slate-900 block truncate tracking-tight leading-none"
                              >
                                {f.sample}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400 font-medium font-sans truncate block">{f.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font 2: Body & Subtitles Font */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">2</span>
                        <span>Font 2 (Subtitles, Narration &amp; Body Text)</span>
                      </label>
                      <span className="text-[10px] font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {activeBodyFont}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {POPULAR_BODY_FONTS.map((f: any) => {
                        const isSelected = activeBodyFont === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setActiveBodyFont(f.id);
                              onBodyFontChange?.(f.id);
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                              }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] font-bold text-slate-500 font-sans">{f.name}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 font-sans">
                                  {f.category}
                                </span>
                                {isSelected && (
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xs">
                                    <Check size={10} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actual Font Live Specimen Preview */}
                            <div className="py-1">
                              <p
                                style={{ fontFamily: `'${f.id}', sans-serif, serif` }}
                                className="text-xs text-slate-800 font-medium line-clamp-1 leading-snug"
                              >
                                {f.sample}
                              </p>
                            </div>

                            <span className="text-[10px] text-slate-400 font-medium font-sans truncate block">{f.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Background Canvas Palette Selection */}
            {styleSubTab === "canvas" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-orange-500" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Background Palette
                    </h2>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                    Canvas Tone
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {BACKGROUND_PALETTES.map((bg) => {
                    const isSelected = (backgroundTheme || "solid-white") === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => onBackgroundThemeChange?.(bg.id)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${isSelected
                          ? "border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-500/20"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/80"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{bg.name}</span>
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: bg.color }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 line-clamp-2">{bg.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: ASSETS (S3 Curated Media Pool & Scene Assignment)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Layers size={20} className="text-orange-500" />
                      <span>S3 Curated Media Pool &amp; Scene Assignment</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        730+ Curated S3 Assets
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Connect each scene with authentic S3 illustrations, 2D vector concepts, and realistic documentary visuals. AI has pre-matched the most relevant assets below.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {sceneBlueprint.length} Scenes Planned
                    </span>
                  </div>
                </div>

                {/* Video Beat Pipeline Guide */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-slate-50 border border-orange-200/60 overflow-x-auto scrollbar-none shadow-2xs">
                  <span className="text-orange-600 font-extrabold flex items-center gap-1.5 shrink-0">
                    <Film size={13} className="text-orange-500" />
                    Story Beat Flow:
                  </span>
                  <span className="text-slate-800 shrink-0">Hook Intro</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-slate-800 shrink-0">Core Tenets &amp; Data</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-slate-800 shrink-0">B-Roll Visuals</span>
                  <ArrowRight size={12} className="text-orange-400 shrink-0" />
                  <span className="text-orange-600 font-bold shrink-0">Retention Climax</span>
                </div>

                {/* Scene-to-Asset Mapping Strip */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Film size={14} className="text-orange-500" />
                      <span>Scene Visual Timeline</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      Click any scene to assign or replace its S3 asset
                    </span>
                  </div>

                  {sceneBlueprint.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-8 text-center space-y-2">
                      <Film size={32} className="mx-auto text-slate-400 stroke-1" />
                      <p className="text-xs font-bold text-slate-700">No scenes planned yet</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Please upload your voiceover audio in Step 1 to auto-transcribe and generate scenes with AI.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {sceneBlueprint.map((sc, idx) => {
                        const sceneNum = sc.sceneNumber || idx + 1;
                        const assetUrl = brollUrls[sceneNum] || sc.assetUrl;
                        const isSelected = selectedSceneForAssetSwap === sceneNum;

                        return (
                          <div
                            key={`scene-asset-card-${sceneNum}`}
                            onClick={() => setSelectedSceneForAssetSwap(isSelected ? null : sceneNum)}
                            className={`rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer space-y-2.5 group hover:-translate-y-1 ${isSelected
                              ? "border-orange-500 bg-gradient-to-b from-orange-50/50 to-white ring-2 ring-orange-500/25 shadow-md shadow-orange-500/10"
                              : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-md"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-tr from-slate-900 to-slate-800 text-white text-[10px] font-mono font-black shadow-xs">
                                  {sceneNum}
                                </span>
                                <span className="text-xs font-black text-slate-900 truncate max-w-[140px] group-hover:text-orange-600 transition-colors">
                                  {sc.heading || sc.title || `Scene ${sceneNum}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                                  {sc.duration ? `${Math.round(sc.duration)}s` : "5s"}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(idx);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                                  title="Edit Scene Text"
                                >
                                  <Edit3 size={11} />
                                </button>
                              </div>
                            </div>

                            {/* Thumbnail / Visual Placeholder */}
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center group">
                              {assetUrl ? (
                                <>
                                  <img
                                    src={assetUrl}
                                    alt={sc.heading || "Scene Visual"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAssetFromScene(sceneNum);
                                    }}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-900/80 hover:bg-red-600 text-white transition opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer"
                                    title="Remove asset from scene"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-1 text-slate-400 p-2 text-center">
                                  <Type size={18} className="text-slate-400" />
                                  <span className="text-[10px] font-bold text-slate-500">
                                    {sc.layoutType ? String(sc.layoutType).replace(/_/g, " ") : "Vector Typography"}
                                  </span>
                                  <span className="text-[9px] text-orange-600 font-semibold">
                                    Click to assign S3 visual
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 line-clamp-1">
                                {sc.supportingText || sc.keyTakeaway || "Supporting explanation"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* S3 Curated Asset Library Browser */}
                <div className="pt-4 border-t border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Search size={14} className="text-orange-500" />
                        <span>Browse S3 Asset Library</span>
                        {selectedSceneForAssetSwap && (
                          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            Target: Scene #{selectedSceneForAssetSwap}
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Select any asset below to assign it to {selectedSceneForAssetSwap ? `Scene #${selectedSceneForAssetSwap}` : "the active scene"}.
                      </p>
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        placeholder="Search tags or titles..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {ITNAVIDEO_STOCK_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAssetCategoryFilter(cat.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${assetCategoryFilter === cat.id
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Assets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[460px] overflow-y-auto pr-1">
                    {filteredAssets.map((asset) => {
                      const isAssigned = Object.values(brollUrls).includes(asset.absoluteUrl);
                      return (
                        <div
                          key={`stock-card-${asset.id}`}
                          className="group relative rounded-2xl border border-slate-200 bg-white p-2 hover:border-orange-400 hover:shadow-md transition flex flex-col space-y-2"
                        >
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                            <img
                              src={asset.absoluteUrl}
                              alt={asset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                            <span className="absolute top-1 left-1 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md">
                              {asset.style || "2d"}
                            </span>
                            {isAssigned && (
                              <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                                <Check size={10} /> In Use
                              </span>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <p className="text-[11px] font-black text-slate-900 line-clamp-1" title={asset.title}>
                              {asset.title}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                              {asset.categoryLabel || asset.category}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAssignAssetToCurrentOrTarget(asset.absoluteUrl)}
                            className="w-full py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 border border-orange-200 hover:border-orange-500"
                          >
                            <Plus size={12} />
                            <span>{selectedSceneForAssetSwap ? `Assign to #${selectedSceneForAssetSwap}` : "Assign to Scene"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preflight Guarantee Banner */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                        Studio-Grade 1080p Cinema Preflight Verified
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        All visual assets, BGM audio tracks, and Remotion scene templates are cleared for commercial YouTube monetization.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px] font-bold text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>1920×1080 @ 30 FPS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>-16 LUFS Audio Mastering</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Dynamic BGM Auto-Ducking</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>AWS Lambda Parallel Render</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL: Pre-Render Confirmation (Audit Recommendation 6) ── */}
      {showPreRenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Confirm Cloud Render</h3>
                  <p className="text-xs text-slate-500">1080p Cinema Widescreen (16:9)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreRenderModal(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-bold text-slate-500">Topic:</span>
                <span className="font-black text-slate-900 max-w-[200px] truncate">
                  {topicTitle || "Faceless Video"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-bold text-slate-500">Duration:</span>
                <span className="font-mono font-black text-slate-900">
                  {formatSec(audioDurationSec)} ({Math.max(1, sceneBlueprint.length)} Scenes)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-bold text-slate-500">Mastering:</span>
                <span className="font-bold text-slate-700">1080p Full HD • -16 LUFS Audio</span>
              </div>
              <div className="flex items-center justify-between py-1 pt-2 text-sm">
                <span className="font-black text-slate-900">Credits Required:</span>
                <span className="font-mono font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  {calculatedCredits} Credit{calculatedCredits > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPreRenderModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Back to Storyboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreRenderModal(false);
                  handleTriggerGenerate();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-orange-500/25 active:scale-95 cursor-pointer"
              >
                Confirm &amp; Render ({calculatedCredits} Cr)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Scene Text ── */}
      {editSceneIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Scene #{editSceneIndex + 1}</h3>
                  <p className="text-xs text-slate-500">Update headline and takeaway text</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditSceneIndex(null)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Visual Layout & Presentation Infographic</label>
                <select
                  value={editLayoutInput}
                  onChange={(e) => setEditLayoutInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <optgroup label="── Modern Infographics (PowerPoint/Keynote Suite) ──">
                    <option value="curved_roadmap">Curved Serpentine Roadmap (Poles & Milestones)</option>
                    <option value="circular_org_chart">Multi-Level Circular Org Chart (Radial Hub)</option>
                    <option value="horizontal_shelves">Horizontal Architecture Shelves (3-4 Tiers)</option>
                    <option value="scorecard_dashboard">Scorecard / Executive KPI Dashboard</option>
                    <option value="table_of_contents">Table of Contents / Agenda Roadmap</option>
                    <option value="mission_vision">Mission & Vision Dual Strategic Pillars</option>
                    <option value="medical_infographic">Medical & Clinical Monitor (Live ECG Waveform)</option>
                  </optgroup>
                  <optgroup label="── Core 16:9 Narrative Archetypes ──">
                    <option value="card_concept">Card Concept (Default Modern Card)</option>
                    <option value="stat_card">Stat Card (Single KPI & Accent Chime)</option>
                    <option value="comparison">Versus Comparison (Side-by-Side)</option>
                    <option value="horizontal_process">5-Step Horizontal Process Flow</option>
                    <option value="workflow">Workflow & Automation Pipeline</option>
                    <option value="before_after_transformation">Before / After Transformation</option>
                    <option value="checklist">Checklist / Core Tenets</option>
                    <option value="quote">Quote & Mindset Principle</option>
                    <option value="chapter_title">Chapter Title Card</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline Text (2-5 words)</label>
                <input
                  type="text"
                  value={editHeadlineInput}
                  onChange={(e) => setEditHeadlineInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supporting Takeaway Text</label>
                <textarea
                  rows={3}
                  value={editTakeawayInput}
                  onChange={(e) => setEditTakeawayInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditSceneIndex(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSceneEdits}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ROW 3: Sticky Bottom Action Bar ── */}
      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-3 sm:px-8 lg:px-12 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 shadow-lg">
        {/* Left Side: Back button + Step info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1))}
              className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
            >
              Back
            </button>
          )}

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-orange-600 bg-orange-50 px-2.5 sm:px-3 py-1 rounded-full border border-orange-200 shrink-0">
            <Zap size={12} className="fill-orange-500 text-orange-500" />
            <span className="hidden sm:inline">
              {currentStep === 0 ? "Overview Roadmap • " : `Step ${currentStep} of 4 • `}
            </span>
            <span>{currentStep === 0 ? "~60s Total" : `${calculatedCredits} Cr`}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 max-w-[200px] truncate">
            <span className="font-semibold text-slate-400">Topic:</span>
            <span className="font-black text-slate-900 truncate">{topicTitle || "Faceless Video"}</span>
          </div>
        </div>

        {/* Right Side: Next or Generate */}
        <div className="flex items-center gap-2 shrink-0">
          {currentStep < FACELESS_STEPS[FACELESS_STEPS.length - 1].step ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 group"
            >
              <span>{currentStep === 0 ? "Start Step 1: Upload" : `Next: ${FACELESS_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}`}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPreRenderModal(true)}
              disabled={isGenerating || !selectedFile}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
            >
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300" />
              <span>Create Faceless Video</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

