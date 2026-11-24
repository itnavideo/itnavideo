"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Clock,
  ChevronRight,
  Palette,
  Pipette,
  Copy,
} from "lucide-react";
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import { StudioStepper, StudioStepperRow } from "@/components/dashboard/shared/StudioStepper";
import { FacelessStoryboardTimeline } from "@/components/dashboard/FacelessStoryboardTimeline";
import {
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
  { step: 2, title: "Music", desc: "Soundtrack & Audio" },
  { step: 3, title: "Captions", desc: "Kinetic Presets" },
  { step: 4, title: "Fonts", desc: "Dual Typography" },
  { step: 5, title: "Theme", desc: "Visual System" },
  { step: 6, title: "Canvas", desc: "Backdrop Tone" },
  { step: 7, title: "Storyboard", desc: "Scene Review & Render" },
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

// ── Background Palette Selection (Studio Presets) ──
export const BACKGROUND_PALETTES = [
  { id: "solid-white", name: "Warm Off-White", color: "#FAF6F2", text: "#141414", desc: "Warm Cream Tone with Subtle #EFE7DF Diagonal Depth & Deep Charcoal Text (Recommended)" },
  { id: "deep-dark", name: "Deep Dark", color: "#09090b", text: "#FFFFFF", desc: "Dark Luxury YouTube Documentary" },
  { id: "warm-editorial", name: "Warm Editorial", color: "#FCFBF7", text: "#1C1917", desc: "Substack & Vox Paper Aesthetic" },
  { id: "modern-slate", name: "Modern Slate", color: "#0F172A", text: "#FFFFFF", desc: "Engineering & Tech Dark Slate" },
  { id: "midnight-blue", name: "Midnight Navy", color: "#0B0F19", text: "#FFFFFF", desc: "Deep Cinematic Midnight" },
] as const;

// ── Canva Standard Color Palette (28 Exact Curated Swatches: 4 Rows × 7 Columns) ──
export interface CanvaColorSwatch {
  id: string;
  name: string;
  hex: string;
  isDark: boolean;
  row: 1 | 2 | 3 | 4;
}

export const CANVA_PALETTE_SWATCHES: CanvaColorSwatch[] = [
  // ── ROW 1: Neutrals / Grayscale (7 swatches) ──
  { id: "canva-black", name: "Pitch Black", hex: "#000000", isDark: true, row: 1 },
  { id: "canva-dark-charcoal", name: "Dark Charcoal", hex: "#373737", isDark: true, row: 1 },
  { id: "canva-slate-gray", name: "Slate Gray", hex: "#595959", isDark: true, row: 1 },
  { id: "canva-medium-gray", name: "Medium Gray", hex: "#808080", isDark: true, row: 1 },
  { id: "canva-silver-gray", name: "Silver Gray", hex: "#B3B3B3", isDark: false, row: 1 },
  { id: "canva-light-gray", name: "Light Gray", hex: "#D9D9D9", isDark: false, row: 1 },
  { id: "canva-pure-white", name: "Pure White", hex: "#FFFFFF", isDark: false, row: 1 },

  // ── ROW 2: Reds, Pinks, Purples (7 swatches) ──
  { id: "canva-vivid-red", name: "Vivid Red", hex: "#EF4444", isDark: true, row: 2 },
  { id: "canva-coral-red", name: "Coral Red", hex: "#F87171", isDark: false, row: 2 },
  { id: "canva-hot-pink", name: "Hot Pink", hex: "#EC4899", isDark: true, row: 2 },
  { id: "canva-soft-lavender", name: "Soft Lavender", hex: "#D8B4FE", isDark: false, row: 2 },
  { id: "canva-orchid-purple", name: "Orchid Purple", hex: "#A855F7", isDark: true, row: 2 },
  { id: "canva-royal-violet", name: "Royal Violet", hex: "#7C3AED", isDark: true, row: 2 },
  { id: "canva-deep-indigo", name: "Deep Indigo", hex: "#4F46E5", isDark: true, row: 2 },

  // ── ROW 3: Cyans, Blues, Navies (7 swatches) ──
  { id: "canva-deep-teal", name: "Deep Teal", hex: "#0E7490", isDark: true, row: 3 },
  { id: "canva-bright-cyan", name: "Bright Cyan", hex: "#06B6D4", isDark: false, row: 3 },
  { id: "canva-sky-blue", name: "Sky Blue", hex: "#38BDF8", isDark: false, row: 3 },
  { id: "canva-electric-blue", name: "Electric Blue", hex: "#3B82F6", isDark: true, row: 3 },
  { id: "canva-cobalt-blue", name: "Cobalt Blue", hex: "#2563EB", isDark: true, row: 3 },
  { id: "canva-navy-blue", name: "Navy Blue", hex: "#1D4ED8", isDark: true, row: 3 },
  { id: "canva-midnight-blue", name: "Midnight Navy", hex: "#1E1B4B", isDark: true, row: 3 },

  // ── ROW 4: Greens, Yellows, Oranges (7 swatches) ──
  { id: "canva-emerald-green", name: "Emerald Green", hex: "#10B981", isDark: true, row: 4 },
  { id: "canva-leaf-lime", name: "Leaf Lime", hex: "#84CC16", isDark: false, row: 4 },
  { id: "canva-chartreuse", name: "Pale Chartreuse", hex: "#BEF264", isDark: false, row: 4 },
  { id: "canva-sunshine-yellow", name: "Sunshine Yellow", hex: "#FACC15", isDark: false, row: 4 },
  { id: "canva-warm-amber", name: "Warm Amber", hex: "#F59E0B", isDark: false, row: 4 },
  { id: "canva-coral-peach", name: "Coral Peach", hex: "#FB923C", isDark: false, row: 4 },
  { id: "canva-canva-orange", name: "Canva Orange", hex: "#F97316", isDark: true, row: 4 },
];

export function isHexColorDark(hex: string): boolean {
  let c = hex.replace(/^#/, "").trim();
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 140;
}

export function resolveCurrentCanvasDetails(themeId?: string): {
  hex: string;
  name: string;
  isDark: boolean;
  tag: string;
} {
  const norm = (themeId || "solid-white").trim();

  // 1. Direct hex match
  if (norm.startsWith("#")) {
    const swatch = CANVA_PALETTE_SWATCHES.find((s) => s.hex.toLowerCase() === norm.toLowerCase());
    const isDark = swatch ? swatch.isDark : isHexColorDark(norm);
    return {
      hex: norm,
      name: swatch?.name || `Custom (${norm.toUpperCase()})`,
      isDark,
      tag: swatch ? "Canva Palette" : "Custom Hex",
    };
  }

  // 2. Canva Swatch by ID
  const swatch = CANVA_PALETTE_SWATCHES.find((s) => s.id === norm || s.hex.toLowerCase() === norm.toLowerCase());
  if (swatch) {
    return {
      hex: swatch.hex,
      name: swatch.name,
      isDark: swatch.isDark,
      tag: "Canva Palette",
    };
  }

  // 3. Studio Presets
  const studio = BACKGROUND_PALETTES.find((p) => p.id === norm);
  if (studio) {
    const isDark = studio.color !== "#FAF6F2" && studio.color !== "#FCFBF7";
    return {
      hex: studio.color,
      name: studio.name,
      isDark,
      tag: "Studio Backdrop",
    };
  }

  return {
    hex: "#FAF6F2",
    name: "Warm Off-White",
    isDark: false,
    tag: "Studio Backdrop",
  };
}

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
  activeColor?: "orange" | "emerald" | "violet";
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
            : activeColor === "violet"
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-sm shadow-violet-500/25 ring-2 ring-violet-500/20"
            : "bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/25 ring-2 ring-orange-500/20"
          : "bg-slate-200 border border-slate-300/80 shadow-inner"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center ${knobSize} rounded-full bg-white shadow-md shadow-black/15 transition-transform duration-200 ease-out transform ${translateClass}`}
      >
        {checked ? (
          <Check size={isSm ? 10 : 12} strokeWidth={3} className={activeColor === "emerald" ? "text-emerald-600" : activeColor === "violet" ? "text-violet-600" : "text-orange-600"} />
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

  // Canva Color Palette & Custom Hex State
  const [customHexInput, setCustomHexInput] = useState<string>(
    backgroundTheme?.startsWith("#") ? backgroundTheme : "#FAF6F2"
  );
  const [copiedHexFeedback, setCopiedHexFeedback] = useState<boolean>(false);

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

  const [bgmSourceMode, setBgmSourceMode] = useState<"library" | "custom">("library");
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [customBgmUrl, setCustomBgmUrl] = useState<string>("");
  const [customBgmName, setCustomBgmName] = useState<string>("");
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [bgmMoodFilter, setBgmMoodFilter] = useState<string>("all");
  const [isPlayingSfxSample, setIsPlayingSfxSample] = useState<boolean>(false);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSfxSample = () => {
    try {
      if (!sfxAudioRef.current) {
        sfxAudioRef.current = new Audio("https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/sfx/whoosh.wav");
      }
      setIsPlayingSfxSample(true);
      sfxAudioRef.current.currentTime = 0;
      sfxAudioRef.current.volume = 0.5;
      sfxAudioRef.current
        .play()
        .then(() => {
          setTimeout(() => setIsPlayingSfxSample(false), 900);
        })
        .catch(() => setIsPlayingSfxSample(false));
    } catch {
      setIsPlayingSfxSample(false);
    }
  };

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
      if (mood === "acoustic" || mood === "guitar") return cat.includes("guitar") || cat.includes("acoustic") || cat.includes("piano") || cat.includes("zen") || cat.includes("lounge");
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
    setCurrentStep(1);
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
    setCurrentStep(1);
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

    setCustomBgmFile(file);
    const localUrl = URL.createObjectURL(file);
    setCustomBgmUrl(localUrl);
    setCustomBgmName(file.name);
    setBgmSourceMode("custom");
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

  // Preview custom uploaded music track
  const togglePlayCustomBgm = () => {
    if (!customBgmUrl) return;
    if (playingBgmPreview === "custom") {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = customBgmUrl;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, activeBgmVolume / 100);
        bgmPreviewAudioRef.current
          .play()
          .then(() => setPlayingBgmPreview("custom"))
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
    // Mutually exclusive: strictly use custom uploaded music OR built-in library music, never both
    const finalBgmUrl = isBgmActive
      ? (bgmSourceMode === "custom" && customBgmUrl
          ? customBgmUrl
          : (selectedBgmTrack === "none" ? "" : getBgmTrackAudioUrl(AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0])))
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
      bgmSourceMode,
      customBgmFile: (bgmSourceMode === "custom" && customBgmUrl) ? customBgmFile : null,
      visualTheme: activeVisualTheme,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      facelessBgmMood,
      bgmVolume: (isBgmActive && finalBgmUrl) ? activeBgmVolume / 100 : 0,
      facelessBgmVolume: (isBgmActive && finalBgmUrl) ? activeBgmVolume / 100 : 0,
      facelessEnableSfx,
      facelessPacingStyle,
      assetSourceMode,
      aspectRatio: "16:9",
      bgmUrl: finalBgmUrl,
      bgmTrackId: isBgmActive ? (bgmSourceMode === "custom" && customBgmUrl ? "custom" : selectedBgmTrack) : "none",
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
          {/* Universal Hidden File Input for Audio/Video Upload */}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*,video/mp4"
            onChange={handleNarrationSelect}
            className="hidden"
          />

          {/* ══════════════════════════════════════════════════════════════
              STEP 0: OVERVIEW & QUICK ROADMAP (Creation Flow & Time Estimates)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Main Hero Card — Generous Breathing Room & Standardized Radius */}
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-orange-50/15 to-white p-5 sm:p-10 lg:p-12 shadow-xs relative overflow-hidden">
                {/* Decorative ambient studio halo */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                {/* ── ROW 1: Hero Header & Big YouTube Logo (Spacious Layout) ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14 pb-8 sm:pb-12 border-b border-slate-100/90">
                  {/* Left Side: Headline, Metrics & Direct Action Dropzone */}
                  <div className="max-w-xl space-y-4 sm:space-y-5">
                    {/* Concise Technical Spec Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-orange-50 text-[11px] sm:text-xs font-bold text-orange-700 border border-orange-200/80 font-mono tracking-tight shadow-2xs">
                        ⚡ 4h Edit → 60s with AI
                      </span>
                      <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-[11px] sm:text-xs font-bold text-emerald-800 border border-emerald-200/80 font-mono tracking-tight shadow-2xs">
                        Free Daily Quota
                      </span>
                      <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 text-[11px] sm:text-xs font-bold text-slate-800 border border-slate-200/80 font-mono tracking-tight shadow-2xs">
                        Automated AI Pipeline
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.14]">
                      Faceless YouTube Long Videos –{' '}
                      <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                        16:9 Ratio
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                      Upload your voiceover audio, select your preferred background soundtrack and subtitle styles, and let AI automatically generate your complete video.
                    </p>

                    {/* Essential Action Zone: Exactly 2 Clear Actions with Generous Spacing */}
                    <div className="pt-3 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[12px] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-600 text-white text-sm font-extrabold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
                      >
                        <span>Start Creating Video</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <a
                        href="https://www.youtube.com/@Itnavideo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-[12px] border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800 text-sm font-bold shadow-2xs active:scale-95 transition cursor-pointer group"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-[#FF0000] fill-current group-hover:scale-110 transition-transform"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>Watch Demo Videos</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Side: Authentic Borderless YouTube Logo with Subtle Float Animation */}
                  <div className="relative shrink-0 flex items-center justify-center p-2 sm:p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <div className="relative flex items-center justify-center group cursor-pointer max-w-full">
                      {/* Ambient breathing soft red glow behind logo */}
                      <div className="absolute -inset-8 sm:-inset-10 rounded-full bg-red-600/25 blur-2xl sm:blur-3xl animate-pulse-glow pointer-events-none" />

                      {/* Official YouTube Logo (Widescreen 1.67:1 Cinema Aspect Ratio, Borderless, Float Animation) */}
                      <svg
                        viewBox="0 0 120 72"
                        className="w-48 sm:w-60 lg:w-68 max-w-full h-auto animate-yt-float transition-transform duration-300 group-hover:scale-105"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="ytBrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FF1E1E" />
                            <stop offset="50%" stopColor="#FF0000" />
                            <stop offset="100%" stopColor="#D90000" />
                          </linearGradient>
                        </defs>

                        {/* Authentic YouTube Widescreen Squircle Path — Elongated 1.67:1 Cinema Ratio */}
                        <path
                          d="M117.2 12.8c-1.4-5.2-5.5-9.3-10.7-10.7C97 0 60 0 60 0S23 0 13.5 2.1C8.3 3.5 4.2 7.6 2.8 12.8.2 22.3 0 36 0 36s.2 13.7 2.8 23.2c1.4 5.2 5.5 9.3 10.7 10.7C23 72 60 72 60 72s37 0 46.5-2.1c5.2-1.4 9.3-5.5 10.7-10.7 2.6-9.5 2.8-23.2 2.8-23.2s-.2-13.7-2.8-23.2z"
                          fill="url(#ytBrandGrad)"
                        />

                        {/* Subtle glossy top curvature light */}
                        <path
                          d="M117.2 12.8c-1.4-5.2-5.5-9.3-10.7-10.7C97 0 60 0 60 0S23 0 13.5 2.1C8.3 3.5 4.2 7.6 2.8 12.8 1.5 17.5 1.1 26 1 34c18-4 58-6 118-2-.1-7-.5-14.5-1.8-19.2z"
                          fill="white"
                          fillOpacity="0.14"
                        />

                        {/* Crisp White Play Triangle perfectly centered */}
                        <polygon
                          points="48,22 48,50 76,36"
                          fill="white"
                          className="transform group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ── CLEAN ANIMATED MOVING TIMELINE: 0 to 5 Min ── */}
                <div className="my-6 sm:my-8 p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-orange-50/20 via-white to-amber-50/20 shadow-2xs">
                  {/* Top Bar: Left = Video Timeline Label, Right = Handwritten Note & Arrow */}
                  <div className="flex items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shadow-2xs">
                        <Clock size={13} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                        Video Timeline
                      </span>
                    </div>

                    {/* True Handwritten Font with Doodle Arrow */}
                    <div className="flex items-center gap-1.5 leading-none">
                      <span
                        style={{ fontFamily: 'var(--font-caveat), "Caveat", cursive' }}
                        className="text-2xl sm:text-3xl font-bold text-orange-600 tracking-wide select-none"
                      >
                        Up to 5 Minutes
                      </span>
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 shrink-0 transform rotate-12 -mt-0.5 ml-0.5"
                        viewBox="0 0 36 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Hand-drawn curved arrow pointing down toward the 5:00 Max marker */}
                        <path d="M6 10 C14 12, 22 18, 26 26" />
                        <path d="M16 26 L26 26 L26 16" />
                      </svg>
                    </div>
                  </div>

                  {/* Moving 0 to 5 Min Timeline */}
                  <div className="space-y-2 pt-1">
                    {/* Time Markers */}
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-0.5">
                      <span className="text-slate-600">0:00</span>
                      <span>1:00</span>
                      <span>2:30</span>
                      <span>3:45</span>
                      <span className="text-orange-600 font-black bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 shadow-2xs">
                        5:00 Max
                      </span>
                    </div>

                    {/* The Moving Line Track (Visibly Travels from 0:00 to 5:00 Max) */}
                    <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-slate-100 border border-slate-200/90 overflow-visible">
                      {/* Active moving orange progress bar */}
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 animate-timeline-live-scrub relative">
                        {/* Glowing Playhead Knob at the leading edge */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white border-[2.5px] border-orange-600 shadow-md shadow-orange-500/30 flex items-center justify-center z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ROW 2: 7-Step Interactive Pipeline Cards with Generous Spacing ── */}
                <div className="pt-10 sm:pt-12 relative">
                  {/* Subtle section label */}
                  <div className="flex items-center justify-between mb-5 px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                      Creation Pipeline (7 Focused Steps)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Total Time: ~60s
                    </span>
                  </div>

                  {/* Desktop connecting journey progression track */}
                  <div className="hidden lg:block absolute top-[94px] left-14 right-14 h-[2px] bg-gradient-to-r from-orange-300 via-amber-300 via-violet-300 to-emerald-400 z-0 opacity-70" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 relative z-10">
                    {[
                      {
                        step: "Step 1",
                        stepNumber: 1,
                        phase: "Input",
                        title: "Voiceover Narration",
                        time: "~10s",
                        icon: Mic,
                        bullets: ["MP3, WAV, M4A", "Word-Sync"],
                        tip: "Required",
                        tipColor: "bg-orange-50 text-orange-700 border-orange-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-orange-50/80 border border-orange-200/60 text-[9px] font-mono font-bold text-orange-700">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                              Voiceover
                            </span>
                            <span>00:45</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 2",
                        stepNumber: 2,
                        phase: "Audio",
                        title: "Background Music",
                        time: "~10s",
                        icon: Headphones,
                        bullets: ["14 Tracks or Upload", "Auto-Ducking"],
                        tip: "Smart Ducking",
                        tipColor: "bg-slate-100 text-slate-700 border-slate-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-100/90 border border-slate-200 text-[9px] font-mono font-bold text-slate-700">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              BGM
                            </span>
                            <span>-18 dB</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 3",
                        stepNumber: 3,
                        phase: "Captions",
                        title: "Kinetic Captions",
                        time: "~15s",
                        icon: Zap,
                        bullets: ["32 Word Styles", "Active Glow"],
                        tip: "32 Presets",
                        tipColor: "bg-amber-50 text-amber-800 border-amber-200/80",
                        widget: (
                          <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded bg-amber-50/80 border border-amber-200/70 text-[8px] font-bold">
                            <span className="px-1 py-0.5 rounded bg-amber-400 text-black">POP</span>
                            <span className="px-1 py-0.5 rounded bg-slate-800 text-white">GLOW</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 4",
                        stepNumber: 4,
                        phase: "Fonts",
                        title: "Dual Typography",
                        time: "~10s",
                        icon: Type,
                        bullets: ["Headline Font", "Subtitle Font"],
                        tip: "Google Fonts",
                        tipColor: "bg-violet-50 text-violet-800 border-violet-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-violet-50/80 border border-violet-200/70 text-[9px] font-mono font-bold text-violet-800">
                            <span>Lora / Jakarta</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 5",
                        stepNumber: 5,
                        phase: "Theme",
                        title: "Visual Themes",
                        time: "~10s",
                        icon: Sparkles,
                        bullets: ["6 Master Systems", "16:9 Motion"],
                        tip: "6 Systems",
                        tipColor: "bg-purple-50 text-purple-800 border-purple-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-purple-50/80 border border-purple-200/70 text-[9px] font-mono font-bold text-purple-800">
                            <span>SaaS • Viral • Docu</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 6",
                        stepNumber: 6,
                        phase: "Canvas",
                        title: "Studio Canvas",
                        time: "~10s",
                        icon: Layers,
                        bullets: ["5 Backdrops", "High Contrast"],
                        tip: "5 Tones",
                        tipColor: "bg-amber-50 text-amber-800 border-amber-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-amber-50/80 border border-amber-200/70 text-[9px] font-mono font-bold text-amber-800">
                            <span>Light / Dark</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 7",
                        stepNumber: 7,
                        phase: "Render",
                        title: "AI Storyboard",
                        time: "~25s",
                        icon: Film,
                        bullets: ["S3 Curated Pool", "1080p Cloud"],
                        tip: "AWS Lambda",
                        tipColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
                        widget: (
                          <div className="flex items-center justify-between px-2 py-1 rounded bg-emerald-50/80 border border-emerald-200/70 text-[9px] font-mono font-bold text-emerald-800">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              1080p
                            </span>
                            <span>30 FPS</span>
                          </div>
                        ),
                      },
                    ].map((item, idx) => {
                      const IconC = item.icon;
                      return (
                        <div
                          key={item.step}
                          onClick={() => setCurrentStep(item.stepNumber)}
                          style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                          className="animate-fade-in-up p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                        >
                          {/* Top: Step number + phase + time estimate */}
                          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-[10px] bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-2xs">
                                <IconC size={15} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 tracking-tight">{item.step}</span>
                                <span className="text-[10px] font-medium text-slate-500">{item.phase}</span>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-orange-700 bg-orange-50/90 px-2.5 py-0.5 rounded-full border border-orange-200/80 shadow-2xs">
                              <Clock size={11} className="text-orange-500" />
                              {item.time}
                            </span>
                          </div>

                          {/* Middle: Title & Micro-Visual Widget */}
                          <div className="py-4 space-y-3">
                            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {item.title}
                            </h3>
                            {item.widget}
                            <ul className="space-y-1.5 pt-1">
                              {item.bullets.map((b, i) => (
                                <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Bottom: Status pill + Interactive Jump cue */}
                          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.tipColor}`}>
                              {item.tip}
                            </span>
                            <span className="text-[11px] font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-0.5">
                              <span>Open</span>
                              <ChevronRight size={13} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── ROW 3: Clean Reassurance Note with Generous Top Margin ── */}
                <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Zero video editing experience required — AI builds your complete storyboard in under 60 seconds.</span>
                  </p>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">Automated Cloud Render • 30 FPS</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: UPLOAD (Voiceover Audio)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
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
                    {/* High-Clarity Professional Audio Upload Icon */}
                    <div className="relative">
                      {/* Ambient Breathing Soundwave Glow */}
                      <div className="absolute -inset-3 bg-gradient-to-tr from-orange-500/20 via-amber-500/25 to-orange-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 group-hover:scale-110 transition duration-500" />

                      {/* Main Audio Upload Plate */}
                      <div className="relative h-18 w-18 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-xl shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all duration-300">
                        <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-gradient-to-b from-white/15 to-transparent flex items-center justify-center relative overflow-hidden">
                          {/* Subtle pulsating equalizer bars in the background */}
                          <div className="absolute inset-0 flex items-center justify-center gap-1 sm:gap-1.5 opacity-25 pointer-events-none">
                            <span className="w-1 h-5 sm:h-7 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-8 sm:h-11 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-12 sm:h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                            <span className="w-1 h-9 sm:h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
                            <span className="w-1 h-6 sm:h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
                          </div>

                          {/* Center Universal Microphone Glyph */}
                          <div className="relative z-10 text-white flex items-center justify-center">
                            <Mic size={34} className="sm:hidden drop-shadow-md" strokeWidth={2.4} />
                            <Mic size={44} className="hidden sm:block drop-shadow-md" strokeWidth={2.4} />
                          </div>

                          {/* Bottom-Right Floating Upload Badge */}
                          <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white text-orange-600 shadow-md flex items-center justify-center border border-orange-100 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
                            <Upload size={12} className="sm:hidden" strokeWidth={2.6} />
                            <Upload size={14} className="hidden sm:block" strokeWidth={2.6} />
                          </div>
                        </div>
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
                </div>
              )}

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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-8 sm:space-y-10">
                
                {/* Centered Main Section Heading with Generous Spacing */}
                <div className="text-center max-w-xl mx-auto space-y-3 pb-3 pt-1">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25 mb-1">
                    <Music size={26} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Audio &amp; Soundtrack
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Choose whether to pick from our curated library or upload your own audio file. <span className="font-semibold text-slate-700">Only one source will be used</span> in your final video.
                  </p>

                  {/* Master On/Off Switch & Active Volume */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 px-4 py-2 rounded-full border border-slate-200 shadow-2xs transition">
                      <ModernToggleSwitch
                        checked={isBgmActive}
                        onChange={(next) => {
                          setIsBgmActive(next);
                          onBgmEnabledChange?.(next);
                        }}
                        activeColor="orange"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {isBgmActive ? "Music Enabled" : "Music Muted"}
                      </span>
                    </div>

                    {isBgmActive && (
                      <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/90 px-3.5 py-2 rounded-full text-xs font-bold shadow-2xs">
                        <Volume2 size={13} className="text-orange-500" />
                        <span>Volume: {activeBgmVolume}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIVE SOUNDTRACK & CONTROLS */}
                {isBgmActive ? (() => {
                  const activeLibraryTrack = AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0];
                  const isLibraryTrackPlaying = playingBgmPreview === activeLibraryTrack.id;

                  return (
                    <div className="space-y-6 sm:space-y-8">
                      {/* Hidden File Input for Custom Upload */}
                      <input
                        ref={bgmInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleCustomBgmUpload}
                        className="hidden"
                      />

                      {/* ── EXCLUSIVE SOURCE SELECTOR: LIBRARY vs CUSTOM UPLOAD (Only One Active, Never Both) ── */}
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-2xl mx-auto px-1">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                            <span>Select Music Source</span>
                            <span className="text-[10px] font-bold text-slate-400 font-sans lowercase">(only one is used in render)</span>
                          </span>
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                            {bgmSourceMode === "custom" && customBgmUrl
                              ? "Active: Your Uploaded Music"
                              : `Active: Library (${activeLibraryTrack.label})`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                          {/* Option 1: Choose from Library */}
                          <button
                            type="button"
                            onClick={() => {
                              setBgmSourceMode("library");
                              if (playingBgmPreview === "custom" && bgmPreviewAudioRef.current) {
                                bgmPreviewAudioRef.current.pause();
                                setPlayingBgmPreview(null);
                              }
                            }}
                            className={`flex items-center justify-between p-4 sm:px-5 rounded-xl text-left transition cursor-pointer ${
                              bgmSourceMode === "library"
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-orange-500/50"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                                bgmSourceMode === "library" ? "bg-orange-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                              }`}>
                                <Music size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate">Choose from Library</p>
                                <p className="text-[11px] text-slate-400 truncate">14 curated royalty-free tracks</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {bgmSourceMode === "library" ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>

                          {/* Option 2: Upload My Own Music */}
                          <button
                            type="button"
                            onClick={() => {
                              setBgmSourceMode("custom");
                              if (playingBgmPreview && playingBgmPreview !== "custom" && bgmPreviewAudioRef.current) {
                                bgmPreviewAudioRef.current.pause();
                                setPlayingBgmPreview(null);
                              }
                            }}
                            className={`flex items-center justify-between p-4 sm:px-5 rounded-xl text-left transition cursor-pointer ${
                              bgmSourceMode === "custom"
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-orange-500/50"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                                bgmSourceMode === "custom" ? "bg-orange-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                              }`}>
                                <UploadCloud size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate">Upload My Own Music</p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {customBgmName ? `Uploaded: ${customBgmName}` : "Use your own MP3, WAV, M4A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {bgmSourceMode === "custom" ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* ══════════════════════════════════════════════════════════════
                          MODE 1: BUILT-IN LIBRARY TRACKS (Active when bgmSourceMode === "library")
                          ══════════════════════════════════════════════════════════════ */}
                      {bgmSourceMode === "library" && (
                        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
                          {/* Active Library Soundtrack Hero Player */}
                          <div className="rounded-2xl sm:rounded-3xl border-2 border-orange-500/80 bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-white p-5 sm:p-7 shadow-sm space-y-5 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                                  <Music size={22} className={isLibraryTrackPlaying ? "animate-bounce" : ""} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 font-mono">
                                      Current Soundtrack
                                    </span>
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                                      {activeLibraryTrack.category}
                                    </span>
                                  </div>
                                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                                    {activeLibraryTrack.label}
                                  </h3>
                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {activeLibraryTrack.desc}
                                  </p>
                                </div>
                              </div>

                              {/* Listen Preview Button */}
                              {activeLibraryTrack.id !== "none" && (
                                <button
                                  type="button"
                                  onClick={() => togglePlayBgmTrack(activeLibraryTrack as LibraryBgmTrack)}
                                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-orange-400 text-slate-800 text-xs font-bold transition shadow-xs hover:bg-orange-50 cursor-pointer self-start sm:self-auto shrink-0"
                                >
                                  {isLibraryTrackPlaying ? (
                                    <>
                                      <div className="flex items-end gap-0.5 h-3.5">
                                        <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2.5" />
                                        <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-3.5" />
                                        <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2" />
                                      </div>
                                      <span>Playing Preview...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play size={13} className="text-orange-500 fill-orange-500" />
                                      <span>Listen Preview</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Integrated Volume Slider & Handwritten Callout */}
                            <div className="pt-4 border-t border-orange-200/60 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-2">
                                  <Sliders size={14} className="text-orange-500" />
                                  <span>Soundtrack Volume Level</span>
                                  <span className="text-[11px] font-mono font-black text-orange-600 bg-white px-2 py-0.5 rounded-md border border-orange-200">
                                    {activeBgmVolume}%
                                  </span>
                                </span>

                                <div className="flex items-center gap-2 self-start sm:self-auto select-none">
                                  <span
                                    style={{ fontFamily: 'var(--font-caveat), "Caveat", cursive' }}
                                    className="text-lg sm:text-xl font-bold text-orange-600 leading-none"
                                  >
                                    Auto-ducks when voiceover speaks
                                  </span>
                                  <svg
                                    className="w-5 h-5 text-orange-500 shrink-0 transform rotate-12 -mt-0.5"
                                    viewBox="0 0 36 36"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M6 10 C14 12, 22 18, 26 26" />
                                    <path d="M16 26 L26 26 L26 16" />
                                  </svg>

                                  <div className="flex items-center gap-1.5 ml-1">
                                    {[
                                      { label: "12% (Ideal)", val: 12 },
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
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                          activeBgmVolume === p.val
                                            ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                      >
                                        {p.label}
                                      </button>
                                    ))}
                                  </div>
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
                                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                              />
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>Automatically lowers volume by -18 dB during speech so narration stays crystal clear.</span>
                              </p>
                            </div>
                          </div>

                          {/* Browse Library Grid */}
                          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs space-y-4 sm:space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                                  Browse Soundtracks ({filteredBgmTracks.length} Available)
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Tap any track below to preview or switch background music
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                {[
                                  { id: "all", label: "All" },
                                  { id: "lofi", label: "☕ Lo-Fi" },
                                  { id: "cinematic", label: "🎬 Cinematic" },
                                  { id: "upbeat", label: "🔥 Upbeat" },
                                  { id: "tech", label: "⚡ Beats" },
                                  { id: "acoustic", label: "🎸 Guitar" },
                                ].map((mood) => {
                                  const isMoodActive = bgmMoodFilter === mood.id;
                                  return (
                                    <button
                                      key={mood.id}
                                      type="button"
                                      onClick={() => setBgmMoodFilter(mood.id)}
                                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
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
                            </div>

                            <div className="max-h-[310px] sm:max-h-[380px] overflow-y-auto space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 pr-1 scrollbar-thin">
                              {filteredBgmTracks.map((track) => {
                                const isSelected = selectedBgmTrack === track.id;
                                const isPlaying = playingBgmPreview === track.id;

                                return (
                                  <div
                                    key={track.id}
                                    onClick={() => {
                                      setBgmSourceMode("library");
                                      setSelectedBgmTrack(track.id);
                                      onBgmTrackSelect?.(track.id, getBgmTrackAudioUrl(track));
                                    }}
                                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? "border-orange-500 bg-orange-50/70 text-slate-900 shadow-xs ring-1 ring-orange-500"
                                        : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 text-slate-700"
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs truncate ${isSelected ? "text-orange-950 font-black" : "text-slate-800 font-bold"}`}>
                                          {track.label}
                                        </span>
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 shrink-0">
                                          {track.category}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                                        {track.desc}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 shrink-0">
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
                                            <div className="flex items-end gap-0.5 h-3.5">
                                              <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2.5" />
                                              <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-3.5" />
                                              <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2" />
                                            </div>
                                          ) : (
                                            <Play size={12} className="ml-0.5 text-slate-600" />
                                          )}
                                        </button>
                                      )}

                                      {isSelected ? (
                                        <CheckCircle2 size={17} className="text-orange-500 shrink-0" />
                                      ) : (
                                        <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════════════════════
                          MODE 2: CUSTOM UPLOADED MUSIC (Active when bgmSourceMode === "custom")
                          ══════════════════════════════════════════════════════════════ */}
                      {bgmSourceMode === "custom" && (
                        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
                          {customBgmUrl ? (
                            /* Active Custom Upload Hero Card */
                            <div className="rounded-2xl sm:rounded-3xl border-2 border-orange-500/80 bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-white p-5 sm:p-7 shadow-sm space-y-5 sm:space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                                    <UploadCloud size={24} className={playingBgmPreview === "custom" ? "animate-bounce" : ""} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 font-mono">
                                        Your Uploaded Music
                                      </span>
                                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                                        Active Soundtrack
                                      </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                                      {customBgmName || "Custom Audio File"}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                      Using this file exclusively. Built-in library tracks are completely bypassed.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                                  {/* Listen Preview Button */}
                                  <button
                                    type="button"
                                    onClick={togglePlayCustomBgm}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-orange-400 text-slate-800 text-xs font-bold transition shadow-xs hover:bg-orange-50 cursor-pointer"
                                  >
                                    {playingBgmPreview === "custom" ? (
                                      <>
                                        <div className="flex items-end gap-0.5 h-3.5">
                                          <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2.5" />
                                          <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-3.5" />
                                          <span className="w-0.5 bg-orange-500 rounded-full animate-pulse h-2" />
                                        </div>
                                        <span>Playing Preview...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Play size={13} className="text-orange-500 fill-orange-500" />
                                        <span>Listen Preview</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => bgmInputRef.current?.click()}
                                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-xs"
                                  >
                                    Replace
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustomBgmUrl("");
                                      setCustomBgmName("");
                                      setCustomBgmFile(null);
                                      setBgmSourceMode("library");
                                      if (playingBgmPreview === "custom" && bgmPreviewAudioRef.current) {
                                        bgmPreviewAudioRef.current.pause();
                                        setPlayingBgmPreview(null);
                                      }
                                    }}
                                    className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Integrated Volume Slider & Auto-Ducking note */}
                              <div className="pt-4 border-t border-orange-200/60 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-700">
                                  <span className="flex items-center gap-2">
                                    <Sliders size={14} className="text-orange-500" />
                                    <span>Custom Soundtrack Volume Level</span>
                                    <span className="text-[11px] font-mono font-black text-orange-600 bg-white px-2 py-0.5 rounded-md border border-orange-200">
                                      {activeBgmVolume}%
                                    </span>
                                  </span>

                                  <div className="flex items-center gap-1.5 ml-1 self-start sm:self-auto">
                                    {[
                                      { label: "12% (Ideal)", val: 12 },
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
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                          activeBgmVolume === p.val
                                            ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
                                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span>Dynamic auto-ducking applies to your uploaded track during speech.</span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Upload Dropzone (When No File Uploaded Yet) */
                            <div
                              onClick={() => bgmInputRef.current?.click()}
                              className="rounded-3xl border-2 border-dashed border-orange-300 bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50/60 transition shadow-xs group"
                            >
                              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white border border-orange-200 text-orange-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                                <UploadCloud size={32} />
                              </div>
                              <div className="space-y-1.5 max-w-md">
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                  Upload My Own Music
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500">
                                  Drag &amp; drop your audio file here or tap anywhere to browse
                                </p>
                                <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-orange-700 border border-orange-200 font-mono shadow-2xs mt-2">
                                  Supports MP3, WAV, or M4A
                                </span>
                              </div>
                              <button
                                type="button"
                                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition shadow-md shadow-orange-600/25 pointer-events-none"
                              >
                                <Upload size={15} />
                                <span>Choose Music File</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <div className="py-8 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-600">Background music is currently muted</p>
                    <p className="text-[11px] text-slate-400">Your video will be rendered with crystal-clear voiceover narration and sound effects only.</p>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  CARD 2: AUDIO ENGINEERING & SOUND EFFECTS (Dedicated Standalone Section)
                  ══════════════════════════════════════════════════════════════ */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-7 sm:space-y-8">
                {/* Header with clear independent identity */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-md shadow-violet-500/25 shrink-0 mt-0.5">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          Audio Engineering &amp; Sound Effects
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-mono">
                          Smart Studio Processing
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Independent vocal priority mastering, intelligent ducking curves, and tactile sound design
                      </p>
                    </div>
                  </div>
                </div>

                {/* Two Dedicated Feature Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Dynamic Auto-Ducking Card */}
                  <div
                    onClick={() => setAutoDucking(!autoDucking)}
                    className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between gap-5 cursor-pointer select-none ${
                      autoDucking 
                        ? "border-violet-300 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/40 shadow-sm ring-1 ring-violet-500/20" 
                        : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            autoDucking 
                              ? "bg-violet-600 text-white border-violet-700 shadow-sm shadow-violet-600/20" 
                              : "bg-white text-slate-400 border-slate-200 shadow-2xs"
                          }`}>
                            <Mic size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-black text-slate-900">
                                Dynamic Auto-Ducking
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 font-mono">
                                Speech Priority
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                              Automatic background music attenuation
                            </span>
                          </div>
                        </div>

                        <ModernToggleSwitch
                          checked={autoDucking}
                          onChange={setAutoDucking}
                          activeColor="violet"
                          size="sm"
                        />
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        Automatically attenuates background music by <strong className="text-violet-700 font-black">-18 dB</strong> during spoken voiceover narration, ensuring 100% vocal clarity and zero auditory clutter.
                      </p>

                      {/* Studio Waveform Visualization */}
                      <div className="rounded-xl border border-violet-200/80 bg-white/90 p-3.5 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="flex items-center gap-1.5 text-violet-900">
                            <Sliders size={13} className="text-violet-600" />
                            <span>Voiceover vs Music Waveform</span>
                          </span>
                          <span className="text-emerald-700 font-mono text-[9px] font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            100% Clear Vocals
                          </span>
                        </div>

                        {/* Interactive Waveform Bar Visualizer */}
                        <div className="h-7 w-full flex items-center gap-1 bg-violet-50/70 px-2.5 rounded-lg overflow-hidden">
                          {[40, 65, 90, 100, 85, 95, 70, 30, 20, 20, 20, 35, 75, 95, 100, 80, 50, 25].map((h, i) => (
                            <div
                              key={i}
                              className={`w-full rounded-full transition-all duration-300 ${
                                i >= 7 && i <= 11 
                                  ? "bg-slate-300 h-2" // Attenuated Ducked Music
                                  : "bg-gradient-to-t from-violet-500 to-indigo-600" // Speaking Vocal Peaks
                              }`}
                              style={{ height: `${Math.max(16, h)}%` }}
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-0.5">
                          <span>Music dips by -18 dB during speech</span>
                          <span className="font-mono font-bold text-violet-700">0.25s Smooth Ramp</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Status */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${autoDucking ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        <span className={autoDucking ? "text-slate-700 font-bold" : "text-slate-400"}>
                          {autoDucking ? "Enabled: Speech priority mastering on" : "Disabled: Static music volume"}
                        </span>
                      </span>
                      {!isBgmActive && (
                        <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Music is muted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cinematic Sound Effects (SFX) Card */}
                  <div
                    onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                    className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between gap-5 cursor-pointer select-none ${
                      facelessEnableSfx 
                        ? "border-orange-300 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 shadow-sm ring-1 ring-orange-500/20" 
                        : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            facelessEnableSfx 
                              ? "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-500/20" 
                              : "bg-white text-slate-400 border-slate-200 shadow-2xs"
                          }`}>
                            <Zap size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-black text-slate-900">
                                Cinematic Sound Effects
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
                                Scene Impacts
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                              Tactile whooshes, impacts &amp; risers
                            </span>
                          </div>
                        </div>

                        <ModernToggleSwitch
                          checked={Boolean(facelessEnableSfx)}
                          onChange={(val) => onEnableSfxChange?.(val)}
                          activeColor="orange"
                          size="sm"
                        />
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        Adds synchronized whooshes on scene cuts, dramatic riser cues, and tactile metric impact pops on key visual transitions for maximum viewer retention.
                      </p>

                      {/* Interactive Audition & Sound Cue Badges */}
                      <div className="rounded-xl border border-orange-200/80 bg-white/90 p-3.5 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="flex items-center gap-1.5 text-orange-950">
                            <Headphones size={13} className="text-orange-500" />
                            <span>Synchronized Sound Cues</span>
                          </span>

                          {/* Audition Sample SFX Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSfxSample();
                            }}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition shadow-xs cursor-pointer active:scale-95"
                          >
                            {isPlayingSfxSample ? (
                              <>
                                <div className="flex items-end gap-0.5 h-2.5">
                                  <span className="w-0.5 bg-white rounded-full animate-bounce h-2.5" />
                                  <span className="w-0.5 bg-white rounded-full animate-pulse h-1.5" />
                                </div>
                                <span>Playing Cue...</span>
                              </>
                            ) : (
                              <>
                                <Play size={10} className="fill-white" />
                                <span>Audition Sample SFX</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Three Cue Cards */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-orange-50/70 border border-orange-200/80 rounded-lg p-2 text-center">
                            <p className="text-[11px] font-black text-orange-950">💨 Whoosh</p>
                            <p className="text-[9px] text-orange-700 mt-0.5">Scene transitions</p>
                          </div>
                          <div className="bg-orange-50/70 border border-orange-200/80 rounded-lg p-2 text-center">
                            <p className="text-[11px] font-black text-orange-950">💥 Metric Hit</p>
                            <p className="text-[9px] text-orange-700 mt-0.5">Stats &amp; charts</p>
                          </div>
                          <div className="bg-orange-50/70 border border-orange-200/80 rounded-lg p-2 text-center">
                            <p className="text-[11px] font-black text-orange-950">📈 Riser</p>
                            <p className="text-[9px] text-orange-700 mt-0.5">Climax build-up</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Status */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${facelessEnableSfx ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        <span className={facelessEnableSfx ? "text-slate-700 font-bold" : "text-slate-400"}>
                          {facelessEnableSfx ? "Active: Syncs with scene cuts & kinetic text" : "SFX muted"}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Independent of BGM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              STEP 3: CAPTIONS (Dedicated Step: 32 Kinetic Styles, Pacing & Position)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-7">
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
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Kinetic Caption Styles
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
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
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: FONTS (Dedicated Step: Dual Font Typography)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                      <Type size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Font Pairing Selection
                      </h2>
                      <p className="text-xs text-slate-500">
                        Dual font architecture engineered for maximum retention &amp; legibility
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
                    Dual Fonts
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
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 5: VISUAL THEME (Dedicated Step: 6 Master Scene Systems)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-md shadow-violet-500/25 shrink-0 mt-0.5">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          Visual Scene Systems
                        </h2>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 font-mono">
                          16:9 Motion Architecture
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Choose the visual direction, scene card composition, and motion dynamics for your video
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6 Master Video Scene Simulators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Object.values(MASTER_THEMES).map((theme) => {
                    const isSelected = activeVisualTheme === theme.id;

                    // Scene simulator details per theme
                    const themeMetas: Record<string, {
                      bestFor: string;
                      badgeColor: string;
                      headlineText: string;
                      motionLabel: string;
                      previewRender: React.ReactNode;
                    }> = {
                      'modern-saas': {
                        bestFor: 'Tech & SaaS Explainer',
                        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
                        headlineText: '10X FASTER WORKFLOWS',
                        motionLabel: '⚡ Zoom-Snap',
                        previewRender: (
                          <div className="w-full h-full bg-[#090D16] p-3 flex flex-col justify-between relative overflow-hidden">
                            {/* Blueprint grid lines */}
                            <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:14px_14px] opacity-20 pointer-events-none" />
                            {/* Window Header */}
                            <div className="flex items-center justify-between pb-1.5 border-b border-blue-500/20 relative z-10">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-400/80" />
                                <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                                <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                              </div>
                              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                SaaS Architecture
                              </span>
                            </div>
                            {/* Content mockup */}
                            <div className="my-auto space-y-1.5 relative z-10">
                              <div className="text-xs font-black text-white tracking-wide">
                                10X FASTER WORKFLOWS
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-blue-500/20 rounded-full overflow-hidden">
                                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-400" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-cyan-300">+84% Speed</span>
                              </div>
                            </div>
                            {/* Bottom metric chips */}
                            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pt-1 border-t border-white/10 relative z-10">
                              <span>API: 24ms</span>
                              <span className="text-blue-400">STATUS: ACTIVE</span>
                            </div>
                          </div>
                        ),
                      },
                      'bold-viral': {
                        bestFor: 'YouTube Shorts & High Retention',
                        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
                        headlineText: 'STOP SCROLLING NOW',
                        motionLabel: '🔥 Whip-Pan',
                        previewRender: (
                          <div className="w-full h-full bg-[#09090B] p-3 flex flex-col justify-between relative overflow-hidden">
                            {/* High-contrast amber background radial */}
                            <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-500/10 rounded-full blur-xl pointer-events-none" />
                            {/* Top Hook Pill */}
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-yellow-400 text-black">
                                VIRAL HOOK
                              </span>
                              <span className="text-[9px] font-mono font-bold text-red-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                98.4% RETENTION
                              </span>
                            </div>
                            {/* Big Bold Headline */}
                            <div className="my-auto text-center space-y-1 relative z-10">
                              <div className="text-sm font-black text-yellow-400 tracking-tight leading-none uppercase font-mono">
                                STOP SCROLLING
                              </div>
                              <div className="text-[10px] font-bold text-white tracking-widest uppercase">
                                THE 1% SECRET REVEALED
                              </div>
                            </div>
                            {/* Kinetic emphasis bar */}
                            <div className="flex items-center justify-between pt-1 border-t border-white/10 relative z-10">
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-1 bg-yellow-400 rounded-sm" />
                                <span className="w-2.5 h-1 bg-yellow-400 rounded-sm" />
                                <span className="w-2.5 h-1 bg-white/40 rounded-sm" />
                              </div>
                              <span className="text-[8px] font-mono font-bold text-slate-400">30 FPS CINEMA</span>
                            </div>
                          </div>
                        ),
                      },
                      'premium-finance': {
                        bestFor: 'Finance, Real Estate & Luxury',
                        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                        headlineText: 'GLOBAL CAPITAL GROWTH',
                        motionLabel: '✨ Smooth Fade',
                        previewRender: (
                          <div className="w-full h-full bg-[#0B132B] p-3 flex flex-col justify-between relative overflow-hidden border border-amber-500/20">
                            {/* Ambient luxury gold gradient */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                            {/* Header */}
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] font-serif italic text-amber-300">
                                Executive Portfolio
                              </span>
                              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                +34.2% Net
                              </span>
                            </div>
                            {/* Chart silhouette */}
                            <div className="my-auto space-y-1.5 relative z-10">
                              <div className="text-xs font-serif font-black text-amber-100 tracking-wide">
                                CAPITAL COMPOUNDING
                              </div>
                              <div className="flex items-end gap-1.5 h-7 pt-1">
                                <div className="flex-1 bg-amber-400/20 rounded-t h-2.5" />
                                <div className="flex-1 bg-amber-400/40 rounded-t h-4" />
                                <div className="flex-1 bg-amber-400/60 rounded-t h-5" />
                                <div className="flex-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t h-7" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pt-1 border-t border-amber-500/20 relative z-10">
                              <span>AUDITED ASSETS</span>
                              <span className="text-amber-300">GOLD STANDARD</span>
                            </div>
                          </div>
                        ),
                      },
                      'educational': {
                        bestFor: 'Courses, Lessons & Science',
                        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
                        headlineText: 'STEP-BY-STEP BREAKDOWN',
                        motionLabel: '🌊 Slide Flow',
                        previewRender: (
                          <div className="w-full h-full bg-[#F8FAFC] p-3 flex flex-col justify-between relative overflow-hidden border border-slate-200">
                            {/* Header */}
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                Core Principle
                              </span>
                              <span className="text-[9px] font-bold text-slate-500">
                                Lesson 03
                              </span>
                            </div>
                            {/* Lesson visual breakdown */}
                            <div className="my-auto space-y-1.5 relative z-10">
                              <div className="text-xs font-black text-slate-900 tracking-tight">
                                Cognitive Retention Model
                              </div>
                              <div className="flex items-center gap-1 text-[8px] font-bold">
                                <span className="bg-teal-600 text-white px-2 py-0.5 rounded">01. Hook</span>
                                <span className="text-slate-400">➜</span>
                                <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">02. Story</span>
                                <span className="text-slate-400">➜</span>
                                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">03. Action</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 pt-1 border-t border-slate-200 relative z-10">
                              <span className="text-teal-700">CLEAR EXPLAINER</span>
                              <span>STEP ARCHITECTURE</span>
                            </div>
                          </div>
                        ),
                      },
                      'editorial': {
                        bestFor: 'Documentaries, Essays & History',
                        badgeColor: 'bg-amber-600/20 text-amber-800 border-amber-600/30',
                        headlineText: 'THE ARCHITECTURE OF TIME',
                        motionLabel: '🎬 Docu Dissolve',
                        previewRender: (
                          <div className="w-full h-full bg-[#FCFBF7] p-3 flex flex-col justify-between relative overflow-hidden border border-[#E7E5E4]">
                            {/* Paper texture feel */}
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500">
                                CHAPTER IV • ESSAY
                              </span>
                              <span className="text-[9px] font-serif italic text-amber-800">
                                New York Review
                              </span>
                            </div>
                            {/* Classic serif quote */}
                            <div className="my-auto space-y-1 relative z-10 text-center">
                              <div className="text-xs font-serif font-black text-stone-900 italic tracking-tight">
                                &ldquo;The Architecture of Focus&rdquo;
                              </div>
                              <div className="w-8 h-[1px] bg-amber-700/40 mx-auto" />
                              <div className="text-[9px] font-serif text-stone-600">
                                Historical deep dive &amp; analysis
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-mono text-stone-500 pt-1 border-t border-stone-200 relative z-10">
                              <span>PLAYFAIR SERIF</span>
                              <span>VOX &amp; NYT STYLE</span>
                            </div>
                          </div>
                        ),
                      },
                      'futuristic-tech': {
                        bestFor: 'AI, Crypto & Cybernetics',
                        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
                        headlineText: 'NEURAL PROCESSING ACTIVE',
                        motionLabel: '⚡ Cyber Glitch',
                        previewRender: (
                          <div className="w-full h-full bg-[#050814] p-3 flex flex-col justify-between relative overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                            {/* Cyber glow background */}
                            <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />
                            {/* HUD Top Bar */}
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                [SYS_ONLINE: 99.8%]
                              </span>
                              <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                                QUANTUM HUD
                              </span>
                            </div>
                            {/* Cyber Waveform */}
                            <div className="my-auto space-y-1 relative z-10">
                              <div className="text-xs font-mono font-black text-cyan-300 tracking-wider">
                                NEURAL SYNC ACTIVE
                              </div>
                              <div className="flex items-center gap-0.5 h-4">
                                {[40, 75, 95, 30, 85, 60, 100, 70, 45, 90, 80, 50, 65, 85].map((h, i) => (
                                  <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-400 rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400/70 pt-1 border-t border-cyan-500/20 relative z-10">
                              <span>MATRIX: ZERO LATENCY</span>
                              <span>CYBERPUNK</span>
                            </div>
                          </div>
                        ),
                      },
                    };

                    const meta = themeMetas[theme.id] || {
                      bestFor: 'General Production',
                      badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
                      headlineText: theme.name,
                      motionLabel: '✨ Smooth Motion',
                      previewRender: null,
                    };

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setActiveVisualTheme(theme.id);
                          onVisualThemeChange?.(theme.id);
                        }}
                        className={`rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 shadow-md ring-2 ring-orange-500/40 -translate-y-1"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        {/* 16:9 Realistic Video Scene Viewport */}
                        <div className="aspect-[16/9] w-full border-b border-slate-100 relative overflow-hidden bg-slate-950">
                          {meta.previewRender}

                          {/* Motion Tag Overlay */}
                          <div className="absolute top-2 right-2 z-20">
                            <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-black/80 text-white border border-white/20 backdrop-blur-md shadow-xs">
                              {meta.motionLabel}
                            </span>
                          </div>
                        </div>

                        {/* Card Info & Details */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                {theme.name}
                              </h3>
                              {isSelected ? (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-slate-300" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                              {theme.description}
                            </p>
                          </div>

                          {/* Bottom Meta Tags */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                              {meta.bestFor}
                            </span>
                            <span className="text-slate-500">
                              {theme.typography.headingFont.split(',')[0].replace(/['"]/g, '')}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 6: BACKGROUND CANVAS (Canva 28-Swatch Palette + Studio Presets)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 6 && (() => {
            const activeCanvas = resolveCurrentCanvasDetails(backgroundTheme);
            const isSwatchSelected = (hex: string) => activeCanvas.hex.toLowerCase() === hex.toLowerCase();

            const handleCustomHexChange = (hexVal: string) => {
              let formatted = hexVal.trim();
              if (!formatted.startsWith("#")) formatted = "#" + formatted;
              setCustomHexInput(formatted);
              if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
                onBackgroundThemeChange?.(formatted);
              }
            };

            const handleCopyHex = () => {
              if (navigator?.clipboard) {
                navigator.clipboard.writeText(activeCanvas.hex);
                setCopiedHexFeedback(true);
                setTimeout(() => setCopiedHexFeedback(false), 2000);
              }
            };

            return (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-7">
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 mt-0.5">
                        <Palette size={22} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            Background Color &amp; Canvas
                          </h2>
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
                            Canva Palette (28 Swatches)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          Choose from Canva standard color swatches, signature creator document backdrops, or enter a custom hex
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Two-Column Layout: Left Simulator & Inspector / Right Canva Swatches Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* LEFT PANEL: 16:9 Live Video Simulator & Active Color Inspector (5 cols) */}
                    <div className="lg:col-span-5 space-y-5">
                      {/* 16:9 Miniature Video Canvas Viewport */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 shadow-md">
                        <div className="flex items-center justify-between pb-2 px-1 text-[10px] font-mono font-bold text-slate-400">
                          <span className="flex items-center gap-1.5 text-orange-400">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            Live 16:9 Canvas Simulator
                          </span>
                          <span>1920 × 1080</span>
                        </div>

                        <div
                          className="aspect-[16/9] w-full rounded-xl border border-black/15 p-4 flex flex-col justify-between relative overflow-hidden transition-colors duration-200 shadow-inner"
                          style={{ backgroundColor: activeCanvas.hex }}
                        >
                          {/* Top indicator on canvas */}
                          <div className="flex items-center justify-between relative z-10">
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border shadow-xs ${
                                activeCanvas.isDark
                                  ? "bg-black/40 text-white border-white/20 backdrop-blur-sm"
                                  : "bg-white/80 text-slate-800 border-black/10 backdrop-blur-sm"
                              }`}
                            >
                              {activeCanvas.tag}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                activeCanvas.isDark ? "text-slate-300 bg-black/40" : "text-slate-700 bg-white/70"
                              }`}
                            >
                              {activeCanvas.hex}
                            </span>
                          </div>

                          {/* Floating sample scene card on top of this canvas */}
                          <div
                            className={`p-3.5 rounded-xl border shadow-md my-auto relative z-10 transition-all ${
                              activeCanvas.isDark
                                ? "bg-slate-900/90 border-white/15 text-white"
                                : "bg-white border-slate-200 text-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-black tracking-wide">
                                16:9 Scene Preview
                              </span>
                              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-xs" />
                            </div>
                            <div className="text-[10px] font-medium opacity-80 line-clamp-1">
                              Narration &amp; visual typography auto-adapts contrast
                            </div>
                            <div
                              className={`mt-2 h-1.5 w-4/5 rounded-full ${
                                activeCanvas.isDark ? "bg-white/20" : "bg-slate-200"
                              }`}
                            />
                          </div>

                          {/* Bottom contrast tag */}
                          <div
                            className={`flex items-center justify-between text-[9px] font-mono font-bold relative z-10 ${
                              activeCanvas.isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            <span>100% BROADCAST CONTRAST</span>
                            <span>{activeCanvas.isDark ? "DARK MODE CANVAS" : "LIGHT MODE CANVAS"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Color Details & Custom Color Picker */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-2 ring-slate-200 shrink-0"
                              style={{ backgroundColor: activeCanvas.hex }}
                            />
                            <div>
                              <h4 className="text-xs font-black text-slate-900">
                                {activeCanvas.name}
                              </h4>
                              <p className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1.5">
                                <span>{activeCanvas.hex}</span>
                                <span>•</span>
                                <span className={activeCanvas.isDark ? "text-indigo-600 font-extrabold" : "text-amber-600 font-extrabold"}>
                                  {activeCanvas.isDark ? "Dark Canvas" : "Light Canvas"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyHex}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                            title="Copy Hex Code"
                          >
                            <Copy size={12} />
                            <span>{copiedHexFeedback ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>

                        {/* Custom Hex Input + Native Eyedropper Color Picker */}
                        <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
                            <Pipette size={13} className="text-orange-500" />
                            <span>Custom:</span>
                          </label>

                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={customHexInput}
                              onChange={(e) => handleCustomHexChange(e.target.value)}
                              placeholder="#FAF6F2"
                              maxLength={7}
                              className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition"
                            />
                            <input
                              type="color"
                              value={activeCanvas.hex.startsWith("#") ? activeCanvas.hex : "#FAF6F2"}
                              onChange={(e) => {
                                setCustomHexInput(e.target.value);
                                onBackgroundThemeChange?.(e.target.value);
                              }}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                              title="Open Color Wheel"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: Canva 28-Swatch Palette Grid (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Canva Swatches Section */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                          <div>
                            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                              <span>Default Colors (Canva Palette)</span>
                              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                4 Rows × 7 Columns
                              </span>
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Click any swatch below to instantly set your video canvas tone
                            </p>
                          </div>
                        </div>

                        {/* 28 Swatches in 7 Columns Grid */}
                        <div className="grid grid-cols-7 gap-3 sm:gap-4 md:gap-4.5 justify-items-center py-2">
                          {CANVA_PALETTE_SWATCHES.map((swatch) => {
                            const isSelected = isSwatchSelected(swatch.hex);

                            return (
                              <button
                                key={swatch.id}
                                type="button"
                                onClick={() => {
                                  setCustomHexInput(swatch.hex);
                                  onBackgroundThemeChange?.(swatch.hex);
                                }}
                                title={`${swatch.name} (${swatch.hex})`}
                                className={`group relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full cursor-pointer transition-all duration-150 flex items-center justify-center active:scale-95 hover:scale-110 ${
                                  isSelected
                                    ? "ring-4 ring-orange-500 ring-offset-2 scale-105 shadow-md"
                                    : "hover:shadow-md"
                                } ${
                                  !swatch.isDark ? "border-2 border-slate-300/80 shadow-2xs" : "shadow-xs"
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                              >
                                {isSelected && (
                                  <Check
                                    size={20}
                                    strokeWidth={3.5}
                                    className={swatch.isDark ? "text-white drop-shadow-sm" : "text-slate-900 drop-shadow-sm"}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Studio Document Backdrops (5 Presets) */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Layers size={14} className="text-orange-500" />
                            <span>Studio Document Backdrops (Recommended)</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">5 Signature Presets</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {BACKGROUND_PALETTES.map((preset) => {
                            const isSelected = (backgroundTheme || "solid-white") === preset.id;

                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setCustomHexInput(preset.color);
                                  onBackgroundThemeChange?.(preset.id);
                                }}
                                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
                                  isSelected
                                    ? "border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500"
                                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-100"
                                }`}
                              >
                                <span
                                  className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs flex items-center justify-center"
                                  style={{ backgroundColor: preset.color }}
                                >
                                  {isSelected && (
                                    <Check
                                      size={12}
                                      strokeWidth={3}
                                      className={preset.color === "#09090b" || preset.color === "#0F172A" || preset.color === "#0B0F19" ? "text-white" : "text-slate-900"}
                                    />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-black text-slate-900 truncate">
                                    {preset.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-500 truncate">
                                    {preset.color}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════════════════════════════════════
              STEP 7: STORYBOARD & ASSETS (S3 Curated Media Pool & Scene Assignment)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 7 && (
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
              className="px-3.5 py-2 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
            >
              Back
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100/90 px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-200/80 shrink-0 font-mono">
            {currentStep === 0 ? (
              <span>
                <span className="hidden sm:inline">Overview Roadmap • </span>~60s Total
              </span>
            ) : (
              <span>{`Step ${currentStep} of ${FACELESS_STEPS.length - 1} • ${calculatedCredits} Cr`}</span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 max-w-[220px] truncate border-l border-slate-200 pl-3">
            <span className="font-semibold text-slate-400">Topic:</span>
            <span className="font-bold text-slate-800 truncate">{topicTitle || "Faceless Video"}</span>
          </div>
        </div>

        {/* Right Side: Next or Generate */}
        <div className="flex items-center gap-2 shrink-0">
          {currentStep < FACELESS_STEPS[FACELESS_STEPS.length - 1].step ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[10px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 group"
            >
              <span>{currentStep === 0 ? "Start Creating Video" : `Next: ${FACELESS_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}`}</span>
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

