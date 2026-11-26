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
import { Player, type PlayerRef } from "@remotion/player";
import { FacelessLongVideoTemplate } from "@/remotion/templates/FACELESS_LONG_VIDEO/template";
import { splitCaptionChunksToShortPills } from "@/remotion/components/library/UniversalCaptionLayer";
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
  { step: 2, title: "Creator Styles", desc: "1-Click or Skip" },
  { step: 3, title: "Music", desc: "Library or Custom" },
  { step: 4, title: "Audio Ducking", desc: "Auto-Lower Music" },
  { step: 5, title: "Sound Effects", desc: "Scene Impacts" },
  { step: 6, title: "Captions", desc: "Kinetic Presets" },
  { step: 7, title: "Fonts", desc: "Typography & Accent" },
  { step: 8, title: "Canvas", desc: "Backdrop Tone" },
  { step: 9, title: "Edit & Download", desc: "Preview & Export" },
] as const;

// ── Font Selection (Single Font Family + Weight Hierarchy via Google Fonts) ──
export interface StudioFontOption {
  id: string;
  name: string;
  sample: string;
  bodySample: string;
  category: string;
  desc: string;
  recommended?: boolean;
}

export const POPULAR_STUDIO_FONTS: StudioFontOption[] = [
  { id: "Montserrat", name: "Montserrat", sample: "YOUTUBE IMPACT", bodySample: "Bold geometric headings paired with crisp supporting copy.", category: "Geometric Sans", desc: "YouTube, Creators & SaaS", recommended: true },
  { id: "Inter", name: "Inter", sample: "Clarity & Focus", bodySample: "Clean UI legibility across titles, cards, and subtitles.", category: "Clean UI Sans", desc: "Tech, Explainers & Neutral", recommended: true },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans", sample: "Modern Thinking", bodySample: "Every breakthrough starts with a quiet insight.", category: "Modern Sans", desc: "Business & Global Content", recommended: true },
  { id: "Poppins", name: "Poppins", sample: "Smart Strategy", bodySample: "Rounded contemporary rhythm that feels inviting.", category: "Rounded Sans", desc: "Education & Lifestyle", recommended: true },
  { id: "DM Sans", name: "DM Sans", sample: "CRISP & MINIMAL", bodySample: "Friendly geometric letters engineered for widescreen.", category: "Geometric", desc: "Minimal & Crisp", recommended: true },
  { id: "Lora", name: "Lora", sample: "Mastery & Vision", bodySample: "Refined editorial storytelling from hook to takeaway.", category: "Editorial Serif", desc: "Documentary, Essays & Vox", recommended: true },
  { id: "Space Grotesk", name: "Space Grotesk", sample: "Future of AI", bodySample: "Sharp technical personality for AI and coding videos.", category: "Tech Display", desc: "AI, Coding & Startups" },
  { id: "Outfit", name: "Outfit", sample: "Clean Growth", bodySample: "Sleek modern proportions built for SaaS explainers.", category: "Geometric", desc: "Sleek SaaS & Startups" },
  { id: "Playfair Display", name: "Playfair Display", sample: "Timeless Luxury", bodySample: "High-contrast authority for finance and mindset.", category: "Luxury Serif", desc: "Finance, Mindset & Luxury" },
  { id: "Merriweather", name: "Merriweather", sample: "Deep Research", bodySample: "Thoughtful, pleasant reading pace for book summaries.", category: "Classic Serif", desc: "History, Books & Research" },
  { id: "Nunito", name: "Nunito", sample: "Warm & Natural", bodySample: "Balanced human warmth that makes narration effortless.", category: "Warm Sans", desc: "Friendly & Courses" },
  { id: "Raleway", name: "Raleway", sample: "MINIMAL DESIGN", bodySample: "Elegant light-to-black weight range for lifestyle.", category: "Elegant Sans", desc: "Minimalist & Lifestyle" },
  { id: "Work Sans", name: "Work Sans", sample: "Editorial Focus", bodySample: "Optimized for crisp on-screen headings and paragraphs.", category: "Editorial Sans", desc: "Modern Article Look" },
  { id: "Manrope", name: "Manrope", sample: "Fintech Clarity", bodySample: "Precision geometry built for data and dashboards.", category: "Precision", desc: "Fintech & Data Clarity" },
  { id: "Bricolage Grotesque", name: "Bricolage Grotesque", sample: "Creator Studio", bodySample: "Expressive modern storytelling with bold character.", category: "Expressive", desc: "Trendy Storytelling" },
  { id: "Rubik", name: "Rubik", sample: "Learn Faster", bodySample: "Soft, approachable geometry for tech and education.", category: "Soft Bold", desc: "Tech & Education" },
  { id: "Source Sans 3", name: "Source Sans 3", sample: "Long-Form Flow", bodySample: "Effortless long-form readability without fatigue.", category: "Doc Sans", desc: "Long-Form Explanations" },
  { id: "Lato", name: "Lato", sample: "Business Ready", bodySample: "Balanced warmth and professionalism in every line.", category: "Balanced", desc: "Business & Explainers" },
  { id: "Roboto", name: "Roboto", sample: "Universal Clarity", bodySample: "Trusted clarity across mobile and widescreen.", category: "Standard Sans", desc: "Classic YouTube Clarity" },
  { id: "Open Sans", name: "Open Sans", sample: "Clear Lessons", bodySample: "Comfortable reading pace for educational videos.", category: "Humanist", desc: "Educational Copy" },
];

export const POPULAR_HEADING_FONTS = POPULAR_STUDIO_FONTS;
export const POPULAR_BODY_FONTS = POPULAR_STUDIO_FONTS;

export const POPULAR_ACCENT_FONTS: StudioFontOption[] = [
  { id: "Caveat", name: "Caveat", sample: "Key insight right here!", bodySample: "", category: "Handwritten", desc: "Natural Marker Callouts", recommended: true },
  { id: "Patrick Hand", name: "Patrick Hand", sample: "Remember this step", bodySample: "", category: "Clean Script", desc: "Neat Whiteboard Notes", recommended: true },
  { id: "Kalam", name: "Kalam", sample: "Why this matters ->", bodySample: "", category: "Pen Note", desc: "Bold Expressive Ink", recommended: true },
  { id: "Shadows Into Light", name: "Shadows Into Light", sample: "Quick takeaway!", bodySample: "", category: "Marker", desc: "Friendly Margin Notes" },
  { id: "Architects Daughter", name: "Architects Daughter", sample: "Step 1: Start small", bodySample: "", category: "Sketch", desc: "Crisp Diagram Labels" },
  { id: "Indie Flower", name: "Indie Flower", sample: "Big difference here", bodySample: "", category: "Casual Ink", desc: "Warm Creator Annotations" },
];

// ── 1-Click Creator-Inspired Style Bundles (Font + Background + Subtitle only) ──
// Each bundle applies ONLY: fontFamily, backgroundTheme, subtitleStyle (if captions are on).
// Everything else (pacing, SFX, BGM, transitions, animations) stays on the standard workflow.
export interface CreatorStyleBundle {
  id: string;
  name: string;
  inspiredBy: string;
  creatorHandle?: string;
  avatarUrl?: string;
  featured?: boolean;
  tag: string;
  desc: string;
  /** Font family applied to the video titles and body text */
  fontFamily: string;
  /** Background theme / hex color for the canvas */
  backgroundTheme: string;
  /** Subtitle pill style — applied ONLY when the user has captions enabled */
  subtitleStyle: string;
  previewBg: string;
  previewText: string;
  previewAccent: string;
  accentColors: [string, string, string];
  previewHeadline: string;
  previewSubline: string;
  previewCallout: string;
}

export const CREATOR_STYLE_BUNDLES: CreatorStyleBundle[] = [
  {
    id: "ali-abdaal",
    name: "Ali Abdaal",
    inspiredBy: "YouTube Creator",
    creatorHandle: "@aliabdaal",
    avatarUrl: "https://res.cloudinary.com/dhouh9idx/image/upload/v1795673159/ali_abdaal_uodbfo.jpg",
    featured: true,
    tag: "",
    desc: "",
    fontFamily: "Lora",
    backgroundTheme: "solid-white",
    subtitleStyle: "clean-minimal-pill",
    previewBg: "#FAF6F2",
    previewText: "#141414",
    previewAccent: "#FB923C",
    accentColors: ["#FAF6F2", "#FB923C", "#141414"],
    previewHeadline: "Corporate restructuring",
    previewSubline: "AI automates your job",
    previewCallout: "Reason 1",
  },
  {
    id: "sara-finance",
    name: "Sara Finance",
    inspiredBy: "YouTube Creator",
    creatorHandle: "@sarafinance",
    avatarUrl: "https://res.cloudinary.com/dhouh9idx/image/upload/v1795673158/sara_finance_d52i6w.jpg",
    featured: true,
    tag: "",
    desc: "",
    fontFamily: "Montserrat",
    backgroundTheme: "#4F46E5",
    subtitleStyle: "box-highlight",
    previewBg: "#3B1FD4",
    previewText: "#FFFFFF",
    previewAccent: "#FFF000",
    accentColors: ["#3B1FD4", "#FFF000", "#FFFFFF"],
    previewHeadline: "INTERACTIVE SPREADSHEETS",
    previewSubline: "HELP PEOPLE SOLVE EVERYDAY",
    previewCallout: "",
  },
];

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

  showCaptions?: boolean;
  onShowCaptionsChange?: (val: boolean) => void;

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

  fontFamily?: string;
  onFontFamilyChange?: (font: string) => void;

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
  initialSceneBlueprint?: any[];
  initialBrollUrls?: Record<number, string>;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
}

export const FacelessVideoStudio: React.FC<FacelessVideoStudioProps> = ({
  selectedFile,
  onSelectFile,
  topicTitle = "",
  onTopicTitleChange,
  showCaptions = true,
  onShowCaptionsChange,
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
  fontFamily,
  onFontFamilyChange,
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
  initialSceneBlueprint,
  initialBrollUrls,
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
  const [isReplanningFromTranscript, setIsReplanningFromTranscript] = useState(false);
  const [transcriptReplanError, setTranscriptReplanError] = useState<string | null>(null);
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<any[]>([]);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<1 | 1.5>(1);
  const [originalWords, setOriginalWords] = useState<any[]>([]);
  const [sceneBlueprint, setSceneBlueprint] = useState<any[]>(initialSceneBlueprint || []);
  const [brollUrls, setBrollUrls] = useState<Record<number, string>>(initialBrollUrls || {});

  useEffect(() => {
    if (Array.isArray(initialSceneBlueprint) && initialSceneBlueprint.length > 0 && sceneBlueprint.length === 0) {
      setSceneBlueprint(initialSceneBlueprint);
    }
  }, [initialSceneBlueprint]);

  useEffect(() => {
    if (initialBrollUrls && Object.keys(initialBrollUrls).length > 0 && Object.keys(brollUrls).length === 0) {
      setBrollUrls(initialBrollUrls);
    }
  }, [initialBrollUrls]);
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
  const [activeFont, setActiveFont] = useState<string>(fontFamily || "Montserrat");
  const [activeAccentFont, setActiveAccentFont] = useState<string>("Caveat");
  const [activeCreatorBundleId, setActiveCreatorBundleId] = useState<string | null>(null);
  const handleSelectPrimaryFont = (fontId: string) => {
    setActiveCreatorBundleId(null);
    setActiveFont(fontId);
    onFontFamilyChange?.(fontId);
  };
  const [isBgmActive, setIsBgmActive] = useState<boolean>(bgmEnabled ?? true);
  const [bgmSourceMode, setBgmSourceMode] = useState<"library" | "custom">("library");
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [customBgmUrl, setCustomBgmUrl] = useState<string>("");
  const [customBgmName, setCustomBgmName] = useState<string>("");

  // Canva Color Palette & Custom Hex State
  const [activeBackgroundTheme, setActiveBackgroundTheme] = useState<string>(backgroundTheme || "solid-white");
  const [canvasTexture, setCanvasTexture] = useState<"solid" | "dot-grid" | "square-grid" | "vignette" | "paper">("solid");
  const [customHexInput, setCustomHexInput] = useState<string>(
    backgroundTheme?.startsWith("#") ? backgroundTheme : "#FAF6F2"
  );
  const [copiedHexFeedback, setCopiedHexFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (backgroundTheme) {
      setActiveBackgroundTheme(backgroundTheme);
    }
  }, [backgroundTheme]);

  // Storyboard Scene Editing & Swapping State (Audit Recommendation 1)
  const [swapModalSceneIndex, setSwapModalSceneIndex] = useState<number | null>(null);
  const [editSceneIndex, setEditSceneIndex] = useState<number | null>(null);
  const [editHeadlineInput, setEditHeadlineInput] = useState<string>("");
  const [editTakeawayInput, setEditTakeawayInput] = useState<string>("");
  const [editNarrationInput, setEditNarrationInput] = useState<string>("");
  const [editLayoutInput, setEditLayoutInput] = useState<string>("card_concept");
  const [editHighlightArrowInput, setEditHighlightArrowInput] = useState<boolean>(false);
  const [editConceptStickerInput, setEditConceptStickerInput] = useState<string>("none");
  const [sceneTransitionStyle, setSceneTransitionStyle] = useState<"crossfade" | "slide-push" | "zoom-whip" | "hard-cut">("crossfade");
  const applyCreatorBundle = (bundle: CreatorStyleBundle, jumpToFinal = true) => {
    // ── Font ────────────────────────────────────────────────────────────────
    setActiveCreatorBundleId(bundle.id);
    setActiveFont(bundle.fontFamily);
    onFontFamilyChange?.(bundle.fontFamily);

    // ── Background ──────────────────────────────────────────────────────────
    setActiveBackgroundTheme(bundle.backgroundTheme);
    onBackgroundThemeChange?.(bundle.backgroundTheme);

    // ── Subtitle style (only if user already has captions enabled) ──────────
    if (isCaptionsEnabled && bundle.subtitleStyle) {
      onSubtitleStyleChange?.(bundle.subtitleStyle);
    }

    // Everything else (pacing, SFX, BGM, transitions, animations) is NOT
    // changed — the standard workflow handles those independently.

    if (jumpToFinal) {
      setCurrentStep(9);
    }
  };
  const [replanningSceneIndex, setReplanningSceneIndex] = useState<number | null>(null);
  const [showPreRenderModal, setShowPreRenderModal] = useState<boolean>(false);
  const step8PlayerRef = useRef<PlayerRef | null>(null);
  const [step8CurrentFrame, setStep8CurrentFrame] = useState<number>(0);

  const totalSceneDurationSec = useMemo(() => {
    if (!sceneBlueprint || sceneBlueprint.length === 0) {
      return Math.max(5, Number((audioDurationSec || 30).toFixed(3)));
    }
    const sum = sceneBlueprint.reduce((acc, s) => acc + Number(s.duration || 5), 0);
    return Math.max(5, Number((audioDurationSec > 0 ? Math.max(audioDurationSec, sum) : sum).toFixed(3)));
  }, [sceneBlueprint, audioDurationSec]);

  const realPreviewCaptions = useMemo(() => {
    if (!transcriptSegments || transcriptSegments.length === 0) return [];
    const rawChunks = transcriptSegments.map((seg) => ({
      text: seg.text,
      start: seg.start,
      end: seg.end,
      words: (originalWords || []).filter(
        (w) => w.start >= seg.start - 0.15 && w.end <= seg.end + 0.15
      ),
    }));
    return splitCaptionChunksToShortPills(rawChunks);
  }, [transcriptSegments, originalWords]);

  const activeBgmPreviewUrl = useMemo(() => {
    if (!isBgmActive) return undefined;
    if (bgmSourceMode === "custom" && customBgmUrl) return customBgmUrl;
    const found = AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack);
    return found ? getBgmTrackAudioUrl(found) : undefined;
  }, [isBgmActive, bgmSourceMode, customBgmUrl, selectedBgmTrack]);

  const step8PreviewInputProps = useMemo(
    () => ({
      title: topicTitle || "Faceless Video",
      durationSeconds: totalSceneDurationSec,
      audioSrc: audioPreviewUrl || undefined,
      musicUrl: activeBgmPreviewUrl,
      musicVolume: isBgmActive ? activeBgmVolume / 100 : 0,
      sceneBlueprint,
      brollUrls,
      captions: realPreviewCaptions,
      showCaptions,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      fontFamily: activeFont,
      headingFont: activeFont,
      typographyFont: activeFont,
      accentFont: activeAccentFont,
      backgroundTheme: activeBackgroundTheme,
      canvasTexture,
      sceneTransitionStyle,
      visualTheme: activeVisualTheme,
      pacingStyle: facelessPacingStyle,
      aspectRatio: "16:9" as const,
      watermark: false,
    }),
    [
      topicTitle,
      totalSceneDurationSec,
      audioPreviewUrl,
      activeBgmPreviewUrl,
      isBgmActive,
      activeBgmVolume,
      sceneBlueprint,
      brollUrls,
      realPreviewCaptions,
      showCaptions,
      subtitleStyle,
      captionAnimationStyle,
      captionPosition,
      activeFont,
      activeAccentFont,
      activeBackgroundTheme,
      canvasTexture,
      sceneTransitionStyle,
      activeVisualTheme,
      facelessPacingStyle,
    ]
  );

  useEffect(() => {
    const player = step8PlayerRef.current;
    if (!player || currentStep !== 9 || sceneBlueprint.length === 0) return;
    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      setStep8CurrentFrame(e.detail.frame);
    };
    player.addEventListener("frameupdate", onFrameUpdate as any);
    return () => {
      player.removeEventListener("frameupdate", onFrameUpdate as any);
    };
  }, [currentStep, sceneBlueprint.length]);

  const handleSelectAndSeekScene = (sceneNum: number, startSeconds: number) => {
    setSelectedSceneForAssetSwap(sceneNum);
    if (step8PlayerRef.current) {
      step8PlayerRef.current.seekTo(Math.max(0, Math.round(startSeconds * 30)));
    }
  };

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
  const [brokenAssetUrls, setBrokenAssetUrls] = useState<Record<string, boolean>>({});

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

  const handleSceneCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const targetSceneNum = uploadTargetSceneNum || selectedSceneForAssetSwap || 1;
    const localUrl = URL.createObjectURL(file);
    setSceneCustomImageFiles((prev) => ({ ...prev, [targetSceneNum]: file }));
    handleAssignAssetToCurrentOrTarget(localUrl, targetSceneNum);
    setUploadTargetSceneNum(null);
    if (e.target) e.target.value = "";
  };

  const handleAssignAssetToCurrentOrTarget = (assetUrl: string, explicitSceneNum?: number) => {
    const targetSceneNum = explicitSceneNum || selectedSceneForAssetSwap || 1;
    setBrollUrls((prev) => ({
      ...prev,
      [targetSceneNum]: assetUrl,
    }));
    setSceneBlueprint((prev) =>
      prev.map((sc, idx) =>
        (sc.sceneNumber || idx + 1) === targetSceneNum ? { ...sc, assetUrl, brollUrl: assetUrl } : sc
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
    setEditHighlightArrowInput(Boolean(sc.highlightArrow));
    setEditConceptStickerInput(sc.conceptSticker || "none");
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
            highlightArrow: editHighlightArrowInput,
            conceptSticker: editConceptStickerInput === "none" ? undefined : editConceptStickerInput,
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

  const handleReplanSingleScene = async (sceneIdx: number) => {
    const targetScene = sceneBlueprint[sceneIdx];
    if (!targetScene || replanningSceneIndex !== null) return;
    const narrationText =
      targetScene.narrationSegment?.text ||
      targetScene.narrationExcerpt ||
      targetScene.supportingText ||
      targetScene.heading ||
      "Key video insight";
    const startSec = Number(targetScene.narrationSegment?.startSeconds ?? targetScene.startSeconds ?? 0);
    const durSec = Math.max(2, Number(targetScene.duration || 5));

    setReplanningSceneIndex(sceneIdx);
    try {
      const res = await fetch("/api/reels/plan-faceless-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingTranscript: narrationText,
          durationSeconds: durSec,
          existingSegments: [{ text: narrationText, start: startSec, end: startSec + durSec }],
          topicTitle: topicTitle.trim() || undefined,
          backgroundTheme: activeBackgroundTheme,
          fontFamily: activeFont,
          accentFont: activeAccentFont,
          creatorStyle: activeCreatorBundleId || undefined,
        }),
      });
      const data = await res.json();
      const replanned = data?.sceneBlueprint?.[0];
      if (data?.ok && replanned) {
        const sceneNum = targetScene.sceneNumber || sceneIdx + 1;
        setSceneBlueprint((prev) =>
          prev.map((sc, idx) =>
            idx === sceneIdx
              ? {
                  ...replanned,
                  sceneNumber: sceneNum,
                  duration: targetScene.duration || replanned.duration,
                  narrationSegment: targetScene.narrationSegment || replanned.narrationSegment,
                }
              : sc
          )
        );
        if (replanned.assetUrl) {
          setBrollUrls((prev) => ({ ...prev, [sceneNum]: replanned.assetUrl }));
        }
      }
    } catch (err) {
      console.warn("[REPLAN_SINGLE_SCENE_ERROR]", err);
    } finally {
      setReplanningSceneIndex(null);
    }
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

  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [duckingStrength, setDuckingStrength] = useState<"gentle" | "balanced" | "podcast">("balanced");
  const [bgmMoodFilter, setBgmMoodFilter] = useState<string>("all");
  const [isPlayingSfxSample, setIsPlayingSfxSample] = useState<boolean>(false);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlayingDuckingExample, setIsPlayingDuckingExample] = useState(false);
  const duckingAudioRef = useRef<HTMLAudioElement | null>(null);
  const duckingTimersRef = useRef<number[]>([]);

  const stopDuckingExample = () => {
    duckingTimersRef.current.forEach((id) => window.clearTimeout(id));
    duckingTimersRef.current = [];
    if (duckingAudioRef.current) {
      duckingAudioRef.current.pause();
      duckingAudioRef.current.currentTime = 0;
    }
    setIsPlayingDuckingExample(false);
  };

  const playDuckingExample = () => {
    if (isPlayingDuckingExample) {
      stopDuckingExample();
      return;
    }
    try {
      const track = AWS_BGM_TRACKS.find((t) => t.id === selectedBgmTrack) || AWS_BGM_TRACKS[0];
      const src =
        bgmSourceMode === "custom" && customBgmUrl
          ? customBgmUrl
          : getBgmTrackAudioUrl(track);
      if (!src) return;

      if (!duckingAudioRef.current || duckingAudioRef.current.src !== src) {
        duckingAudioRef.current = new Audio(src);
      }
      const audio = duckingAudioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.4;
      setIsPlayingDuckingExample(true);

      const dipVolume = !autoDucking
        ? 0.4
        : duckingStrength === "gentle"
          ? 0.16
          : duckingStrength === "podcast"
            ? 0.03
            : 0.08;

      audio
        .play()
        .then(() => {
          // 1.2s: smoothly dip music volume as if voiceover starts speaking
          duckingTimersRef.current.push(
            window.setTimeout(() => {
              if (duckingAudioRef.current) duckingAudioRef.current.volume = dipVolume;
            }, 1200)
          );
          // 3.0s: smoothly raise music back up during a pause
          duckingTimersRef.current.push(
            window.setTimeout(() => {
              if (duckingAudioRef.current) duckingAudioRef.current.volume = 0.4;
            }, 3000)
          );
          // 4.2s: stop preview
          duckingTimersRef.current.push(
            window.setTimeout(() => {
              stopDuckingExample();
            }, 4200)
          );
        })
        .catch(() => stopDuckingExample());
    } catch {
      stopDuckingExample();
    }
  };

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

  // Caption Filter, Search & ON/OFF Toggle
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState<boolean>(showCaptions ?? true);
  const [showAllCaptionStyles, setShowAllCaptionStyles] = useState<boolean>(false);
  const [captionFilter, setCaptionFilter] = useState("all");
  const [captionSearchQuery, setCaptionSearchQuery] = useState("");
  const [previewWordStep, setPreviewWordStep] = useState<number>(1);

  useEffect(() => {
    setIsCaptionsEnabled(showCaptions ?? true);
  }, [showCaptions]);

  // Font Search Filter & Expand Toggle
  const [fontSearch, setFontSearch] = useState("");
  const [showAllFonts, setShowAllFonts] = useState(false);

  useEffect(() => {
    if (currentStep !== 6) return;
    const interval = setInterval(() => {
      setPreviewWordStep((prev) => (prev + 1) % 3);
    }, 700);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Dynamically load all Google Fonts for Step 0, Step 2 (Creator Bundles) & Step 7 (Typography)
  useEffect(() => {
    if ((currentStep !== 0 && currentStep !== 2 && currentStep !== 7) || typeof document === "undefined") return;
    const linkId = "itnavideo-studio-google-fonts";
    if (document.getElementById(linkId)) return;
    const families = [
      ...new Set([
        ...POPULAR_STUDIO_FONTS.map((f) => f.id),
        ...POPULAR_ACCENT_FONTS.map((f) => f.id),
      ]),
    ].filter((name) => name !== "Georgia");
    const query = families
      .map((name) => `family=${encodeURIComponent(name)}:wght@400;500;600;700;800;900`)
      .join("&");
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
    document.head.appendChild(link);
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
  const sceneImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetSceneNum, setUploadTargetSceneNum] = useState<number | null>(null);
  const [sceneCustomImageFiles, setSceneCustomImageFiles] = useState<Record<number, File>>({});
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

  const [isDraggingNarration, setIsDraggingNarration] = useState(false);
  const [isDraggingBgm, setIsDraggingBgm] = useState(false);

  const isValidMediaFile = (file: File, allowVideo: boolean) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const audioExts = ["mp3", "wav", "m4a", "aac", "ogg", "flac", "webm"];
    if (file.type.startsWith("audio/") || audioExts.includes(ext)) return true;
    if (allowVideo && (file.type === "video/mp4" || ext === "mp4")) return true;
    return false;
  };

  const processNarrationFile = (file: File) => {
    if (!isValidMediaFile(file, true)) return;

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
    setCurrentStep(1);
  };

  // Handle narration audio file selection
  const handleNarrationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processNarrationFile(file);
    if (e.target) e.target.value = "";
  };

  const handleNarrationDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingNarration(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processNarrationFile(file);
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

  // Save edited transcript (text only)
  const handleSaveEditedTranscript = () => {
    setTranscriptText(editableTranscript);
    setTranscriptReplanError(null);
    setTranscriptSavedFeedback(true);
    setTimeout(() => setTranscriptSavedFeedback(false), 2500);
  };

  // Save edited transcript AND re-plan storyboard scenes so scenes stay 100% synced
  const handleApplyAndReplanTranscript = async () => {
    const cleanText = editableTranscript.trim();
    if (!cleanText || isReplanningFromTranscript) return;

    setTranscriptText(cleanText);
    setTranscriptReplanError(null);

    if (sceneBlueprint.length === 0) {
      handleSaveEditedTranscript();
      return;
    }

    const totalDur = Math.max(5, audioDurationSec || totalSceneDurationSec || 60);
    const sentences = cleanText
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    let mappedSegments: Array<{ text: string; start: number; end: number }>;
    if (
      transcriptSegments.length > 0 &&
      sentences.length === transcriptSegments.length
    ) {
      mappedSegments = transcriptSegments.map((seg, i) => ({
        text: sentences[i],
        start: Number(seg.start ?? 0),
        end: Number(seg.end ?? totalDur),
      }));
    } else {
      const parts = sentences.length > 0 ? sentences : [cleanText];
      const totalChars = parts.reduce((sum, p) => sum + p.length, 0) || 1;
      let cursor = 0;
      mappedSegments = parts.map((p, idx) => {
        const span = (p.length / totalChars) * totalDur;
        const start = Math.round(cursor * 100) / 100;
        const end = idx === parts.length - 1 ? totalDur : Math.round((cursor + span) * 100) / 100;
        cursor = end;
        return { text: p, start, end };
      });
    }

    setIsReplanningFromTranscript(true);
    try {
      const res = await fetch("/api/reels/plan-faceless-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingTranscript: cleanText,
          existingSegments: mappedSegments,
          durationSeconds: totalDur,
          topicTitle: topicTitle.trim() || undefined,
          backgroundTheme: activeBackgroundTheme,
          fontFamily: activeFont,
          accentFont: activeAccentFont,
          creatorStyle: activeCreatorBundleId || undefined,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to re-plan scenes from edited transcript.");
      }

      if (Array.isArray(payload.segments) && payload.segments.length > 0) {
        setTranscriptSegments(payload.segments);
      } else {
        setTranscriptSegments(mappedSegments);
      }
      if (Array.isArray(payload.sceneBlueprint)) {
        setSceneBlueprint(payload.sceneBlueprint);
        onSceneBlueprintChange?.(payload.sceneBlueprint);
      }
      if (payload.brollUrls && typeof payload.brollUrls === "object") {
        setBrollUrls(payload.brollUrls);
      }
      setTranscriptSavedFeedback(true);
      setTimeout(() => setTranscriptSavedFeedback(false), 2500);
    } catch (err: any) {
      setTranscriptReplanError(err?.message || "Failed to re-plan scenes. Please click Retry.");
    } finally {
      setIsReplanningFromTranscript(false);
    }
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

  const processCustomBgmFile = (file: File) => {
    if (!isValidMediaFile(file, false)) return;

    setCustomBgmFile(file);
    const localUrl = URL.createObjectURL(file);
    setCustomBgmUrl(localUrl);
    setCustomBgmName(file.name);
    setBgmSourceMode("custom");
    setSelectedBgmTrack(localUrl);
  };

  // Handle custom BGM upload
  const handleCustomBgmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCustomBgmFile(file);
    if (e.target) e.target.value = "";
  };

  const handleBgmDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBgm(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processCustomBgmFile(file);
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

  const handleSkipAudio = (deltaSec: number) => {
    if (!audioPlayerRef.current || !audioDurationSec) return;
    const next = Math.max(0, Math.min(audioDurationSec, audioPlayerRef.current.currentTime + deltaSec));
    audioPlayerRef.current.currentTime = next;
    setAudioCurrentTime(next);
  };

  const handleTogglePlaybackRate = () => {
    const nextRate: 1 | 1.5 = audioPlaybackRate === 1 ? 1.5 : 1;
    setAudioPlaybackRate(nextRate);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = nextRate;
    }
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
      backgroundTheme: activeBackgroundTheme || backgroundTheme || "solid-white",
      canvasTexture,
      fontFamily: activeFont,
      accentFont: activeAccentFont,
      creatorStyle: activeCreatorBundleId || undefined,
      bgmEnabled: isBgmActive,
      bgmSourceMode,
      customBgmFile: (bgmSourceMode === "custom" && customBgmUrl) ? customBgmFile : null,
      visualTheme: activeVisualTheme,
      showCaptions: isCaptionsEnabled,
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
      sceneCustomImageFiles,
      removeAiWatermark,
      autoDucking,
      duckingStrength,
      duckingDb: duckingStrength === "gentle" ? -8 : duckingStrength === "podcast" ? -20 : -14,
      sceneTransitionStyle,
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
      showCaptions: isCaptionsEnabled,
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
      sceneCustomImageFiles,
      removeAiWatermark,
      autoDucking,
      duckingStrength,
      duckingDb: duckingStrength === "gentle" ? -8 : duckingStrength === "podcast" ? -20 : -14,
      sceneTransitionStyle,
    };

    onGenerate(payload);
  };

  // Filter 32 caption styles
  const filteredCaptionStyles = THIRTY_TWO_CAPTION_STYLES.filter((s) => {
    const matchesCategory = captionFilter === "all" || (s.category || "").toLowerCase() === captionFilter.toLowerCase();
    const matchesSearch =
      !captionSearchQuery.trim() ||
      s.name.toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      (s.desc || "").toLowerCase().includes(captionSearchQuery.toLowerCase()) ||
      (s.badge || "").toLowerCase().includes(captionSearchQuery.toLowerCase());
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
        allowJumpAhead
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

                    {/* Handwritten Margin Note near Start Creating Video CTA */}
                    <div className="flex items-center gap-1.5 pl-1 pt-0.5 select-none">
                      <svg
                        className="w-5 h-5 text-orange-500 shrink-0 -mt-1"
                        viewBox="0 0 28 28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Hand-drawn curved arrow pointing up-left toward Start Creating Video */}
                        <path d="M22 20 C14 20, 9 15, 8 6" />
                        <path d="M4 11 L8 6 L13 10" />
                      </svg>
                      <span
                        style={{ fontFamily: 'var(--font-caveat), "Caveat", cursive' }}
                        className="text-xl sm:text-2xl font-bold text-orange-600 tracking-wide -rotate-1"
                      >
                        No editing skills needed
                      </span>
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
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
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
                        className="text-xl sm:text-3xl font-bold text-orange-600 tracking-wide select-none"
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

                {/* ── ROW 2: 9-Step Interactive Pipeline Cards with Generous Spacing ── */}
                <div className="pt-10 sm:pt-12 relative">
                  {/* Subtle section label */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5 px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                      Creation Pipeline (8 Focused Steps)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Total Time: ~60s
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                    {[
                      {
                        step: "Step 1",
                        numLabel: "01",
                        handFont: '"Caveat", cursive',
                        numTilt: "-rotate-6",
                        stepNumber: 1,
                        phase: "Input",
                        title: "Voiceover Narration",
                        time: "~10s",
                        icon: Mic,
                        cardBg: "bg-gradient-to-br from-orange-50/85 via-white to-amber-50/30 border-orange-200/90 hover:border-orange-400 hover:shadow-orange-500/15",
                        iconWrap: "bg-orange-500 text-white shadow-orange-500/30",
                        numColor: "text-orange-600",
                        sticker: "🎙️ Required",
                        stickerBg: "bg-orange-100/90 text-orange-800 border-orange-200",
                        bullets: ["MP3, WAV, M4A", "Word-Sync & Transcript"],
                        widget: (
                          <div className="rounded-xl bg-white/90 border border-orange-200/80 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-end gap-1 h-6">
                              {[45, 85, 60, 100, 70, 90, 50, 75].map((h, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${h}%`, animationDelay: `${i * 110}ms` }}
                                  className="w-1 rounded-full bg-gradient-to-t from-orange-600 to-amber-400 animate-pulse"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/70">
                              00:45
                            </span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 2",
                        numLabel: "02",
                        handFont: '"Patrick Hand", cursive',
                        numTilt: "rotate-3",
                        stepNumber: 2,
                        phase: "Music",
                        title: "Background Music",
                        time: "~5s",
                        icon: Music,
                        cardBg: "bg-gradient-to-br from-sky-50/85 via-white to-cyan-50/30 border-sky-200/90 hover:border-sky-400 hover:shadow-sky-500/15",
                        iconWrap: "bg-sky-600 text-white shadow-sky-600/30",
                        numColor: "text-sky-600",
                        sticker: "🎵 14 Tracks",
                        stickerBg: "bg-sky-100/90 text-sky-800 border-sky-200",
                        bullets: ["Mood-Filtered Library", "Or Upload Custom Track"],
                        widget: (
                          <div className="rounded-xl bg-white/90 border border-sky-200/80 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                                <Music size={11} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 truncate">Lo-Fi Focus</span>
                            </div>
                            <span className="text-[10px] font-mono font-black text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                              12% Vol
                            </span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 3",
                        numLabel: "03",
                        handFont: '"Kalam", cursive',
                        numTilt: "-rotate-3",
                        stepNumber: 3,
                        phase: "Ducking",
                        title: "Dynamic Audio Ducking",
                        time: "~5s",
                        icon: Sliders,
                        cardBg: "bg-gradient-to-br from-emerald-50/85 via-white to-teal-50/30 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/15",
                        iconWrap: "bg-emerald-600 text-white shadow-emerald-600/30",
                        numColor: "text-emerald-600",
                        sticker: "✨ Clear Vocals",
                        stickerBg: "bg-emerald-100/90 text-emerald-800 border-emerald-200",
                        bullets: ["3 Strength Presets", "Hear Live Example"],
                        widget: (
                          <div className="rounded-xl bg-white/90 border border-emerald-200/80 p-2.5 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                              <span className="text-emerald-700">Voice 100%</span>
                              <span className="text-slate-500">Music -14 dB</span>
                            </div>
                            <div className="flex items-center gap-1 h-2">
                              <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                              <div className="h-1 w-1/4 rounded-full bg-slate-300" />
                            </div>
                          </div>
                        ),
                      },
                      {
                        step: "Step 4",
                        numLabel: "04",
                        handFont: '"Shadows Into Light", cursive',
                        numTilt: "rotate-6",
                        stepNumber: 4,
                        phase: "SFX",
                        title: "Sound Effects",
                        time: "~5s",
                        icon: Zap,
                        cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/40 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/15",
                        iconWrap: "bg-amber-600 text-white shadow-amber-600/30",
                        numColor: "text-amber-600",
                        sticker: "⚡ Retention Boost",
                        stickerBg: "bg-amber-100/90 text-amber-800 border-amber-200",
                        bullets: ["Whooshes & Hits", "Synced to Scene Cuts"],
                        widget: (
                          <div className="min-h-[42px] rounded-xl bg-white/90 border border-amber-200/80 p-2 flex flex-wrap items-center justify-center gap-1 shadow-2xs">
                            {["⚡ Whoosh", "💥 Hit", "📈 Riser"].map((fx) => (
                              <span
                                key={fx}
                                className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/70 text-[9px] font-extrabold text-amber-900 whitespace-nowrap"
                              >
                                {fx}
                              </span>
                            ))}
                          </div>
                        ),
                      },
                      {
                        step: "Step 5",
                        numLabel: "05",
                        handFont: '"Architects Daughter", cursive',
                        numTilt: "-rotate-3",
                        stepNumber: 5,
                        phase: "Captions",
                        title: "Kinetic Captions",
                        time: "~10s",
                        icon: Sparkles,
                        cardBg: "bg-gradient-to-br from-violet-50/85 via-white to-indigo-50/30 border-violet-200/90 hover:border-violet-400 hover:shadow-violet-500/15",
                        iconWrap: "bg-violet-700 text-white shadow-violet-700/30",
                        numColor: "text-violet-700",
                        sticker: "💬 32 Presets",
                        stickerBg: "bg-violet-100/90 text-violet-800 border-violet-200",
                        bullets: ["ON / OFF Toggle", "Word-by-Word Pop"],
                        widget: (
                          <div className="rounded-xl bg-slate-900 border border-violet-300/40 p-2 flex items-center justify-center gap-1.5 shadow-2xs">
                            <span className="text-[10px] font-black text-white/70">STAY</span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 animate-pulse">
                              LOCKED
                            </span>
                            <span className="text-[10px] font-black text-white/70">IN</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 6",
                        numLabel: "06",
                        handFont: '"Indie Flower", cursive',
                        numTilt: "rotate-3",
                        stepNumber: 6,
                        phase: "Fonts",
                        title: "Dual + Accent Fonts",
                        time: "~5s",
                        icon: Type,
                        cardBg: "bg-gradient-to-br from-slate-100/90 via-white to-slate-50 border-slate-300/90 hover:border-slate-500 hover:shadow-slate-500/15",
                        iconWrap: "bg-slate-800 text-white shadow-slate-800/25",
                        numColor: "text-slate-700",
                        sticker: "✍️ Google Fonts",
                        stickerBg: "bg-slate-200/80 text-slate-800 border-slate-300",
                        bullets: ["Live 16:9 Pairing", "Handwritten Accents"],
                        widget: (
                          <div className="rounded-xl bg-white/95 border border-slate-200 p-2 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-baseline gap-1.5">
                              <span style={{ fontFamily: '"Lora", serif' }} className="text-sm font-black text-slate-900">
                                Aa
                              </span>
                              <span className="text-[10px] font-sans font-semibold text-slate-500">Body</span>
                            </div>
                            <span
                              style={{ fontFamily: '"Caveat", cursive' }}
                              className="text-sm font-bold text-orange-600 -rotate-2"
                            >
                              + Note!
                            </span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 7",
                        numLabel: "07",
                        handFont: '"Caveat", cursive',
                        numTilt: "-rotate-6",
                        stepNumber: 7,
                        phase: "Canvas",
                        title: "Background & Texture",
                        time: "~5s",
                        icon: Palette,
                        cardBg: "bg-gradient-to-br from-orange-50/70 via-white to-amber-50/60 border-amber-200/90 hover:border-orange-400 hover:shadow-orange-500/15",
                        iconWrap: "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30",
                        numColor: "text-orange-600",
                        sticker: "🎨 28 Swatches",
                        stickerBg: "bg-amber-100/90 text-amber-800 border-amber-200",
                        bullets: ["4 Studio Textures", "Auto-Contrast Text"],
                        widget: (
                          <div className="min-h-[42px] rounded-xl bg-white/90 border border-amber-200/80 p-2 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-center -space-x-1.5">
                              {["#0F172A", "#1E293B", "#FAF6F2", "#EA580C", "#059669", "#0284C7"].map((hex) => (
                                <span
                                  key={hex}
                                  style={{ backgroundColor: hex }}
                                  className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-300/70 shadow-2xs"
                                />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono font-bold text-slate-600">Dot / Paper</span>
                          </div>
                        ),
                      },
                      {
                        step: "Step 8",
                        numLabel: "08",
                        handFont: '"Kalam", cursive',
                        numTilt: "rotate-2",
                        stepNumber: 8,
                        phase: "Final",
                        title: "Edit Scenes & Download",
                        time: "~15s",
                        icon: Film,
                        cardBg: "bg-gradient-to-br from-emerald-50/95 via-white to-sky-50/40 border-emerald-300/90 hover:border-emerald-500 hover:shadow-emerald-500/20",
                        iconWrap: "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-600/30",
                        numColor: "text-emerald-700",
                        sticker: "🎬 1080p HD",
                        stickerBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
                        bullets: ["Transitions & Arrows", "Single-Scene AI Re-plan"],
                        widget: (
                          <div className="rounded-xl bg-white/95 border border-emerald-200 p-2 flex items-center gap-1.5 shadow-2xs">
                            {[1, 2, 3].map((n) => (
                              <div
                                key={n}
                                className="flex-1 aspect-video rounded bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-400/40 flex items-center justify-center text-[8px] font-mono font-black text-emerald-300"
                              >
                                S{n}
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ].map((item, idx) => {
                      const IconC = item.icon;
          return (
                        <div
                          key={item.step}
                          style={{ animationDelay: `${(idx + 1) * 70}ms` }}
                          className={`animate-fade-in-up p-4 sm:p-5 rounded-2xl border ${item.cardBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
                        >
                          {/* Top: Step Number + Icon + Time */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                            <div className="flex items-center gap-2.5">
                              <div className={`h-8 w-8 rounded-xl ${item.iconWrap} flex items-center justify-center shadow-sm`}>
                                <IconC size={15} />
                              </div>
                              <span className={`text-xs font-mono font-black tracking-tight ${item.numColor}`}>
                                STEP {item.numLabel}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                              <Clock size={10} className="text-slate-400" />
                              {item.time}
                            </span>
                          </div>

                          {/* Middle: Title & Unique Mini-Studio Widget */}
                          <div className="py-3.5 space-y-2.5 flex-1">
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">
                              {item.title}
                            </h3>
                            {item.widget}
                            <ul className="space-y-1 pt-0.5">
                              {item.bullets.map((b, i) => (
                                <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400/70 shrink-0" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Bottom: Clean Informational Tag */}
                          <div className="pt-3 border-t border-slate-200/60 flex items-center">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${item.stickerBg}`}>
                              {item.sticker}
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
                    <span>Zero video editing experience required — AI builds your complete video scenes in under 60 seconds.</span>
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
              {/* Optional Video Title Input */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 shrink-0">
                  <label htmlFor="faceless-video-title" className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Edit3 size={13} className="text-orange-500" />
                    <span>Video Title</span>
                    <span className="text-[10px] font-bold lowercase text-slate-400 font-sans">(optional)</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Used to name your video and guide scene visuals
                  </p>
                </div>
                <input
                  id="faceless-video-title"
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onTopicTitleChange?.(e.target.value)}
                  placeholder="e.g., How to Build Better Habits"
                  maxLength={120}
                  className="w-full sm:max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                />
              </div>

              {!selectedFile ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-10 shadow-sm relative overflow-hidden group">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingNarration(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingNarration(false);
                    }}
                    onDrop={handleNarrationDrop}
                    className={`w-full py-12 sm:py-20 md:py-24 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-4 sm:gap-5 cursor-pointer group relative z-10 ${
                      isDraggingNarration
                        ? "border-orange-500 bg-orange-50/40 scale-[1.01] shadow-md"
                        : "border-slate-300 hover:border-orange-500 bg-slate-50/70 hover:bg-orange-50/20"
                    }`}
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
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                        <span>Upload Audio / Voiceover</span>
                        <ArrowRight size={18} className="hidden sm:inline-block text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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

                    {/* Waveform Visualizer Bar with Quick Take-Check Controls */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 font-mono">
                        <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={togglePlayAudio}
                            title={isPlayingAudio ? "Pause audio" : "Play audio"}
                            className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center transition cursor-pointer shadow-xs shadow-orange-500/30"
                          >
                            {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSkipAudio(-5)}
                            title="Rewind 5 seconds"
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition cursor-pointer"
                          >
                            -5s
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSkipAudio(5)}
                            title="Forward 5 seconds"
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition cursor-pointer"
                          >
                            +5s
                          </button>
                          <button
                            type="button"
                            onClick={handleTogglePlaybackRate}
                            title="Toggle playback speed"
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                              audioPlaybackRate === 1.5
                                ? "border-orange-300 bg-orange-50 text-orange-700"
                                : "border-slate-200 hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            {audioPlaybackRate}x
                          </button>
                          <button
                            type="button"
                            onClick={toggleMuteAudio}
                            title={isAudioMuted ? "Unmute" : "Mute"}
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
                          <span className="ml-1">{formatSec(audioCurrentTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline font-sans text-[11px] font-semibold text-slate-400">
                            Tap waveform to scrub
                          </span>
                          <span>{formatSec(audioDurationSec)}</span>
                        </div>
                      </div>

                      {/* Natural High-Density Studio Waveform Scrubber */}
                      {(() => {
                        const currentProgress = audioDurationSec > 0 ? Math.min(1, Math.max(0, audioCurrentTime / audioDurationSec)) : 0;
                        const totalBars = 140;
                        const svgWidth = totalBars * 4;
                        const svgHeight = 56;
                        const midY = svgHeight / 2;
                        const bars = Array.from({ length: totalBars }, (_, i) => {
                          // Natural speech envelope: phrase bursts + syllable variation + micro-pauses
                          const phrase = Math.max(0.15, Math.sin(i * 0.14) * 0.5 + 0.55);
                          const syllable = Math.abs(Math.sin(i * 0.63 + 0.7) * Math.cos(i * 0.29));
                          const microPause = (i % 27 >= 23 && i % 27 <= 25) ? 0.18 : 1;
                          const amp = Math.min(0.95, Math.max(0.12, (0.22 + syllable * 0.78) * phrase * microPause));
                          return Math.round(amp * (svgHeight - 8));
                        });
                        return (
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                              handleWaveformSeek(ratio);
                            }}
                            className="relative h-14 w-full px-2 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center cursor-pointer overflow-hidden select-none group"
                          >
                            <svg
                              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                              preserveAspectRatio="none"
                              className="w-full h-11 overflow-visible"
                            >
                              <defs>
                                <linearGradient id="step1WavePlayed" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#F59E0B" />
                                  <stop offset="50%" stopColor="#EA580C" />
                                  <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                                <clipPath id="step1PlayedClip">
                                  <rect x="0" y="0" width={currentProgress * svgWidth} height={svgHeight} />
                                </clipPath>
                              </defs>

                              {/* Unplayed Waveform */}
                              <g fill="#CBD5E1" className="group-hover:fill-slate-400 transition-colors">
                                {bars.map((h, i) => (
                                  <rect
                                    key={i}
                                    x={i * 4}
                                    y={midY - h / 2}
                                    width="2.4"
                                    height={h}
                                    rx="1.2"
                                  />
                                ))}
                              </g>

                              {/* Played Waveform */}
                              <g fill="url(#step1WavePlayed)" clipPath="url(#step1PlayedClip)">
                                {bars.map((h, i) => (
                                  <rect
                                    key={i}
                                    x={i * 4}
                                    y={midY - h / 2}
                                    width="2.4"
                                    height={h}
                                    rx="1.2"
                                  />
                                ))}
                              </g>

                              {/* Crisp Playhead Line */}
                              <line
                                x1={currentProgress * svgWidth}
                                y1="2"
                                x2={currentProgress * svgWidth}
                                y2={svgHeight - 2}
                                stroke="#EA580C"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        );
                      })()}
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
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-wrap items-center justify-between gap-3 text-red-800 text-sm font-bold shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                    <div className="min-w-0">
                      <div>{planningError}</div>
                      <div className="text-[11px] font-medium text-red-600 mt-0.5">
                        No credits were used. You can safely retry.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {selectedFile && onTranscribeAndPlan && (
                      <button
                        type="button"
                        onClick={() => triggerTranscription(selectedFile)}
                        disabled={isPlanning}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <RefreshCw size={12} />
                        <span>Retry</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClearPlanningError}
                      className="text-xs text-red-600 hover:text-red-800 underline font-semibold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Collapsible Editable Transcript Preview (Post-Upload) */}
              {transcriptText && (
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
                    className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0">
                        <FileText size={17} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900">
                            Review &amp; Fix Transcript
                          </h3>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {transcriptText.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {showTranscriptEditor
                            ? "Fix brand names, numbers, or spelling before captions & scenes render"
                            : transcriptText}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 shrink-0">
                      <span className="hidden sm:inline">
                        {showTranscriptEditor ? "Collapse" : "Edit"}
                      </span>
                      {showTranscriptEditor ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {showTranscriptEditor && (
                    <div className="px-5 sm:px-7 pb-6 pt-1 space-y-3 border-t border-slate-100">
                      <textarea
                        value={editableTranscript}
                        onChange={(e) => {
                          setEditableTranscript(e.target.value);
                          if (transcriptReplanError) setTranscriptReplanError(null);
                        }}
                        rows={5}
                        placeholder="Edit your spoken transcript here..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none transition leading-relaxed"
                      />
                      {sceneBlueprint.length > 0 && editableTranscript.trim() !== transcriptText.trim() && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
                          <span className="text-[11px] font-semibold text-amber-800">
                            Transcript changed — re-plan scenes so headlines, cards, and captions match your edits.
                          </span>
                        </div>
                      )}
                      {transcriptReplanError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-[11px] font-semibold text-red-700">
                          {transcriptReplanError}
                        </div>
                      )}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] text-slate-500">
                          Edits here update your captions and scene narration before rendering.
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={handleSaveEditedTranscript}
                            disabled={isReplanningFromTranscript}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                          >
                            {transcriptSavedFeedback && !isReplanningFromTranscript ? (
                              <>
                                <CheckCheck size={13} className="text-emerald-600" />
                                <span>Saved!</span>
                              </>
                            ) : (
                              <>
                                <Save size={13} />
                                <span>Save Text Only</span>
                              </>
                            )}
                          </button>
                          {sceneBlueprint.length > 0 && (
                            <button
                              type="button"
                              onClick={handleApplyAndReplanTranscript}
                              disabled={isReplanningFromTranscript || !editableTranscript.trim()}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              <Sparkles size={13} className={isReplanningFromTranscript ? "animate-spin" : ""} />
                              <span>{isReplanningFromTranscript ? "Re-planning Scenes..." : "Apply & Re-plan Scenes"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              STEP 2: CREATOR STYLES (Minimal YouTube-Style Cards + Skip)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-6">
                {/* Clean Minimal Header + Skip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Choose a Creator Style
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Applies font, background &amp; subtitle style (if captions are on). Everything else follows the standard workflow.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveCreatorBundleId(null);
                      setCurrentStep(3);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    <span>Skip</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Two Clean YouTube-Style Creator Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {CREATOR_STYLE_BUNDLES.map((bundle) => {
                    const isSelected = activeCreatorBundleId === bundle.id;
                    const isAli = bundle.id === "ali-abdaal";
                    return (
                      <div
                        key={bundle.id}
                        className={`rounded-3xl border-2 p-5 sm:p-6 transition-all flex flex-col justify-between gap-5 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/20 shadow-md ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        {/* YouTube-Style Creator Header */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src={bundle.avatarUrl}
                            alt={bundle.name}
                            className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                              {bundle.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                              {/* YouTube Play Icon */}
                              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                              <span>YouTube Creator</span>
                            </div>
                          </div>
                        </div>

                        {/* Accurate 16:9 Faceless Visual Preview */}
                        {isAli ? (
                          <div
                            className="aspect-video w-full rounded-2xl p-4 sm:p-5 flex flex-col justify-center gap-2 border border-slate-200/80 overflow-hidden"
                            style={{ backgroundColor: "#FAF6F2" }}
                          >
                            {[
                              { tag: "Reason 1", title: "Corporate restructuring", tint: "#FFF1E6", iconColor: "#EA580C" },
                              { tag: "Reason 2", title: "Bought out by private equity", tint: "#E0F2FE", iconColor: "#0284C7" },
                              { tag: "Reason 3", title: "AI automates your job", tint: "#F3E8FF", iconColor: "#7C3AED" },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="rounded-xl bg-white px-3.5 py-2 shadow-xs border border-slate-100 flex items-center gap-3"
                              >
                                <div
                                  className="h-7 w-7 rounded-lg shrink-0 flex items-center justify-center"
                                  style={{ backgroundColor: item.tint }}
                                >
                                  <span
                                    className="h-2.5 w-2.5 rounded-xs"
                                    style={{ backgroundColor: item.iconColor }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className="inline-block px-2 py-0.2 rounded-full text-[8px] font-bold text-white leading-tight"
                                    style={{ backgroundColor: "#FB923C" }}
                                  >
                                    {item.tag}
                                  </span>
                                  <div
                                    style={{ fontFamily: `'Lora', Georgia, serif` }}
                                    className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight mt-0.5"
                                  >
                                    {item.title}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="aspect-video w-full rounded-2xl p-5 sm:p-6 flex flex-col justify-center relative overflow-hidden border border-indigo-900/20"
                            style={{
                              background: "radial-gradient(circle at 50% 45%, #5B4CF5 0%, #3F2CC9 75%, #2D1F9E 100%)",
                            }}
                          >
                            {/* Subtle Blue Square Grid */}
                            <div
                              className="absolute inset-0 pointer-events-none opacity-25"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.22) 1px, transparent 1px)",
                                backgroundSize: "22px 22px",
                              }}
                            />

                            {/* Black Title Pill with Glowing Blue Border */}
                            <div className="relative z-10 flex flex-col items-start gap-3.5">
                              <div
                                className="w-full rounded-lg px-3.5 py-2 flex items-center justify-center gap-2"
                                style={{
                                  backgroundColor: "#050507",
                                  border: "1.5px solid #2563EB",
                                  boxShadow: "0 0 18px rgba(37, 99, 235, 0.55)",
                                }}
                              >
                                <span
                                  className="h-3.5 w-3.5 rounded-xs shrink-0 flex items-center justify-center text-[8px] font-black"
                                  style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
                                >
                                  $
                                </span>
                                <span
                                  style={{ fontFamily: `'Montserrat', sans-serif` }}
                                  className="text-[11px] sm:text-xs font-black tracking-wide text-white uppercase truncate"
                                >
                                  INTERACTIVE SPREADSHEETS
                                </span>
                              </div>

                              {/* White Curved Arrow + Progressive Uppercase Sans Text */}
                              <div className="flex items-start gap-2 pl-1">
                                <svg
                                  className="w-6 h-6 text-white shrink-0 -mt-1"
                                  viewBox="0 0 28 28"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M16 4 C6 6, 4 15, 11 22" />
                                  <path d="M6 21 L12 22 L11 16" />
                                </svg>
                                <div
                                  style={{ fontFamily: `'Montserrat', sans-serif` }}
                                  className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide leading-snug pt-1"
                                >
                                  <span className="text-white">HELP PEOPLE </span>
                                  <span className="text-white/40">SOLVE EVERYDAY</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Single Action Button */}
                        <button
                          type="button"
                          onClick={() => applyCreatorBundle(bundle, true)}
                          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-sm shadow-orange-600/20"
                        >
                          Use This Style
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: MUSIC (Direct Tracks First & Sleek Controls)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-8 sm:space-y-10">
                
                {/* Centered Main Section Heading with Generous Spacing */}
                <div className="text-center max-w-xl mx-auto space-y-2.5 pb-1 pt-1">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25 mb-1">
                    <Music size={26} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Audio &amp; Soundtrack
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Choose from our music library, upload your own audio, or render with no background music.
                  </p>
                </div>

                {/* ACTIVE SOUNDTRACK & CONTROLS */}
                {(() => {
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

                      {/* ── EXCLUSIVE 3-OPTION SOURCE SELECTOR: LIBRARY vs CUSTOM UPLOAD vs NO MUSIC ── */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-4xl mx-auto px-1">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                            <span>Select Music Source</span>
                          </span>
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                            {!isBgmActive
                              ? "Active: No Background Music"
                              : bgmSourceMode === "custom" && customBgmUrl
                                ? "Active: Your Uploaded Music"
                                : `Active: Library (${activeLibraryTrack.label})`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                          {/* Option 1: Choose from Library */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsBgmActive(true);
                              onBgmEnabledChange?.(true);
                              setBgmSourceMode("library");
                              if (playingBgmPreview === "custom" && bgmPreviewAudioRef.current) {
                                bgmPreviewAudioRef.current.pause();
                                setPlayingBgmPreview(null);
                              }
                            }}
                            className={`flex items-center justify-between p-3.5 sm:px-4 rounded-xl text-left transition cursor-pointer ${
                              isBgmActive && bgmSourceMode === "library"
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-orange-500/50"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isBgmActive && bgmSourceMode === "library" ? "bg-orange-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                              }`}>
                                <Music size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate">Choose from Library</p>
                                <p className="text-[11px] text-slate-400 truncate">14 royalty-free tracks</p>
                              </div>
                            </div>
                            <div className="shrink-0 pl-2">
                              {isBgmActive && bgmSourceMode === "library" ? (
                                <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="block w-4 h-4 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>

                          {/* Option 2: Upload My Own Music */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsBgmActive(true);
                              onBgmEnabledChange?.(true);
                              setBgmSourceMode("custom");
                              if (playingBgmPreview && playingBgmPreview !== "custom" && bgmPreviewAudioRef.current) {
                                bgmPreviewAudioRef.current.pause();
                                setPlayingBgmPreview(null);
                              }
                            }}
                            className={`flex items-center justify-between p-3.5 sm:px-4 rounded-xl text-left transition cursor-pointer ${
                              isBgmActive && bgmSourceMode === "custom"
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-orange-500/50"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isBgmActive && bgmSourceMode === "custom" ? "bg-orange-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                              }`}>
                                <UploadCloud size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate">Upload My Own Music</p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {customBgmName ? `Uploaded: ${customBgmName}` : "MP3, WAV, M4A"}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 pl-2">
                              {isBgmActive && bgmSourceMode === "custom" ? (
                                <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="block w-4 h-4 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>

                          {/* Option 3: No Background Music */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsBgmActive(false);
                              onBgmEnabledChange?.(false);
                              if (bgmPreviewAudioRef.current) {
                                bgmPreviewAudioRef.current.pause();
                                setPlayingBgmPreview(null);
                              }
                            }}
                            className={`flex items-center justify-between p-3.5 sm:px-4 rounded-xl text-left transition cursor-pointer ${
                              !isBgmActive
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200 ring-2 ring-orange-500/50"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                !isBgmActive ? "bg-orange-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                              }`}>
                                <VolumeX size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate">No Background Music</p>
                                <p className="text-[11px] text-slate-400 truncate">Voiceover only</p>
                              </div>
                            </div>
                            <div className="shrink-0 pl-2">
                              {!isBgmActive ? (
                                <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="block w-4 h-4 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </button>
                        </div>
                      </div>

                      {!isBgmActive ? (
                        <div className="py-10 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-2 max-w-4xl mx-auto">
                          <VolumeX size={24} className="mx-auto text-slate-400" />
                          <p className="text-sm font-black text-slate-700">No background music selected</p>
                          <p className="text-xs text-slate-500">Your video will be created with your voiceover narration only.</p>
                        </div>
                      ) : (
                        <>
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

                                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto select-none">
                                  <span
                                    style={{ fontFamily: 'var(--font-caveat), "Caveat", cursive' }}
                                    className="text-lg sm:text-xl font-bold text-orange-600 leading-none"
                                  >
                                    Auto-ducks when voiceover speaks
                                  </span>
                                  <svg
                                    className="hidden sm:block w-5 h-5 text-orange-500 shrink-0 transform rotate-12 -mt-0.5"
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

                                  <div className="flex flex-wrap items-center gap-1.5 sm:ml-1">
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

                                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
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

                                  <div className="flex flex-wrap items-center gap-1.5 sm:ml-1 self-start sm:self-auto">
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
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingBgm(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingBgm(false);
                              }}
                              onDrop={handleBgmDrop}
                              className={`rounded-3xl border-2 border-dashed bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition shadow-xs group ${
                                isDraggingBgm
                                  ? "border-orange-500 bg-orange-50/80 scale-[1.01] shadow-md"
                                  : "border-orange-300 hover:border-orange-400 hover:bg-orange-50/60"
                              }`}
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
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: DYNAMIC AUDIO DUCKING (Dedicated Step: Auto-Lower Music)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
                {/* Step Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 mt-0.5">
                      <Mic size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Dynamic Audio Ducking
                        </h2>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
                          Recommended: ON
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Automatically lowers music when you speak so your voice stays crystal clear
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning if Background Music is muted in Step 3 */}
                {!isBgmActive && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      <span>Background music is currently turned OFF in Step 3. Turn on music if you want auto-ducking to apply.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition cursor-pointer shrink-0"
                    >
                      Go to Step 3: Music
                    </button>
                  </div>
                )}

                {/* Main Interactive Auto-Ducking Card */}
                <div
                  onClick={() => setAutoDucking(!autoDucking)}
                  className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between gap-6 cursor-pointer select-none ${
                    autoDucking
                      ? "border-orange-300 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/30 shadow-sm ring-1 ring-orange-500/15"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {autoDucking ? "Auto-Ducking is ON" : "Auto-Ducking is OFF"}
                        </h3>
                        <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          autoDucking
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {autoDucking ? "Clear Vocals" : "Constant Music Volume"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                        Automatically lowers music when you speak, then gently brings it back up during pauses.
                      </p>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <ModernToggleSwitch
                        checked={autoDucking}
                        onChange={setAutoDucking}
                        activeColor="orange"
                        size="md"
                      />
                    </div>
                  </div>

                  {/* 3 Ducking Strength Presets */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`space-y-2 transition-opacity ${autoDucking ? "opacity-100" : "opacity-50 pointer-events-none"}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-xs font-extrabold text-slate-700">
                        Ducking Strength
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Choose how much the music dips while you speak
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "gentle" as const, label: "Gentle", db: "-8 dB", desc: "Keeps music lively underneath" },
                        { id: "balanced" as const, label: "Balanced", db: "-14 dB", desc: "Clear voice + warm music", recommended: true },
                        { id: "podcast" as const, label: "Podcast Clear", db: "-20 dB", desc: "Maximum vocal focus" },
                      ].map((preset) => {
                        const isSelected = duckingStrength === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setDuckingStrength(preset.id);
                              if (!autoDucking) setAutoDucking(true);
                            }}
                            className={`px-3.5 py-2.5 rounded-xl border text-left transition cursor-pointer ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/90 ring-2 ring-orange-500/20 shadow-2xs"
                                : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/30"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className={`text-xs font-black ${isSelected ? "text-orange-700" : "text-slate-900"}`}>
                                {preset.label} ({preset.db})
                              </span>
                              {preset.recommended && (
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{preset.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Waveform Visualization + Hear Example Button */}
                  <div className="rounded-2xl border border-orange-200/80 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-900">
                        <Sliders size={14} className="text-orange-500" />
                        <span>Voiceover vs Background Music Level</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playDuckingExample();
                        }}
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition shadow-xs cursor-pointer active:scale-95"
                      >
                        {isPlayingDuckingExample ? (
                          <>
                            <Pause size={10} className="fill-white" />
                            <span>Stop Example</span>
                          </>
                        ) : (
                          <>
                            <Play size={10} className="fill-white" />
                            <span>Hear Example</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Natural 2-Track Studio Ducking Visualizer (Voiceover + Music Waveforms) */}
                    {(() => {
                      const totalBars = 140;
                      const svgW = totalBars * 4;
                      const duckScale = !autoDucking
                        ? 1
                        : duckingStrength === "gentle"
                          ? 0.52
                          : duckingStrength === "podcast"
                            ? 0.18
                            : 0.34;

                      // Smooth speech activity mask (3 realistic spoken phrases with natural pauses)
                      const getSpeechWeight = (i: number) => {
                        const t = i / totalBars;
                        const p1 = Math.exp(-Math.pow((t - 0.18) / 0.11, 2));
                        const p2 = Math.exp(-Math.pow((t - 0.54) / 0.13, 2));
                        const p3 = Math.exp(-Math.pow((t - 0.85) / 0.09, 2));
                        return Math.min(1, Math.max(0, (p1 + p2 + p3) * 1.15));
                      };

                      const voiceBars = Array.from({ length: totalBars }, (_, i) => {
                        const w = getSpeechWeight(i);
                        const syllable = Math.abs(Math.sin(i * 0.58 + 0.4) * Math.cos(i * 0.31)) * 0.75 + 0.25;
                        const h = w > 0.22 ? Math.round((0.18 + w * syllable * 0.8) * 34) : 3;
                        return { h, active: w > 0.22 };
                      });

                      const musicBars = Array.from({ length: totalBars }, (_, i) => {
                        const w = getSpeechWeight(i);
                        const gain = 1 - w * (1 - duckScale);
                        const groove = 0.55 + 0.45 * Math.abs(Math.sin(i * 0.24 + 1.1) * Math.cos(i * 0.13));
                        return Math.max(4, Math.round(groove * gain * 36));
                      });

                      return (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-2.5">
                          {/* Track 1: Voiceover Speech Waveform */}
                          <div className="flex items-center gap-2.5">
                            <span className="w-12 shrink-0 text-[10px] font-mono font-bold text-emerald-700">
                              Voice
                            </span>
                            <div className="flex-1 h-10 px-2 rounded-lg bg-white border border-slate-200/80 flex items-center">
                              <svg viewBox={`0 0 ${svgW} 40`} preserveAspectRatio="none" className="w-full h-9">
                                {voiceBars.map((b, i) => (
                                  <rect
                                    key={i}
                                    x={i * 4}
                                    y={20 - b.h / 2}
                                    width="2.4"
                                    height={b.h}
                                    rx="1.2"
                                    fill={b.active ? "#10B981" : "#E2E8F0"}
                                  />
                                ))}
                              </svg>
                            </div>
                          </div>

                          {/* Track 2: Background Music Waveform (Naturally Dips Under Speech) */}
                          <div className="flex items-center gap-2.5">
                            <span className="w-12 shrink-0 text-[10px] font-mono font-bold text-orange-700">
                              Music
                            </span>
                            <div className="flex-1 h-10 px-2 rounded-lg bg-white border border-slate-200/80 flex items-center">
                              <svg viewBox={`0 0 ${svgW} 40`} preserveAspectRatio="none" className="w-full h-9">
                                <defs>
                                  <linearGradient id="duckMusicGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="50%" stopColor="#EA580C" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                  </linearGradient>
                                </defs>
                                {musicBars.map((h, i) => {
                                  const isDucked = getSpeechWeight(i) > 0.25 && autoDucking;
                                  return (
                                    <rect
                                      key={i}
                                      x={i * 4}
                                      y={20 - h / 2}
                                      width="2.4"
                                      height={h}
                                      rx="1.2"
                                      fill={isDucked ? "#FCD34D" : "url(#duckMusicGrad)"}
                                      opacity={isDucked ? 0.85 : 0.95}
                                    />
                                  );
                                })}
                              </svg>
                            </div>
                          </div>

                          {/* Legend Footer */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-medium text-slate-500 pt-0.5">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Voice Speaking
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                Music Full
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-300" />
                                Music Dipped
                              </span>
                            </div>
                            <span className="font-mono font-bold text-emerald-700">
                              {autoDucking
                                ? `Auto-Dip ${duckingStrength === "gentle" ? "-8 dB" : duckingStrength === "podcast" ? "-20 dB" : "-14 dB"}`
                                : "Flat Volume (Disabled)"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 3 Clear Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3.5">
                      <p className="text-xs font-black text-slate-900">🎙️ Clear Voiceover</p>
                      <p className="text-[11px] text-slate-500 mt-1">Your narration never gets drowned out by loud music.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3.5">
                      <p className="text-xs font-black text-slate-900">🎚️ Smooth Transitions</p>
                      <p className="text-[11px] text-slate-500 mt-1">Gentle volume fade with no sudden audio jumps.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3.5">
                      <p className="text-xs font-black text-slate-900">🎵 Works Everywhere</p>
                      <p className="text-[11px] text-slate-500 mt-1">Applies to both Library tracks and your own uploaded music.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 5: SOUND EFFECTS (Dedicated Step: Scene Impacts & Cues)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
                {/* Step Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 mt-0.5">
                      <Zap size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Cinematic Sound Effects (SFX)
                        </h2>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
                          Scene Impacts
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Add subtle whooshes, metric hits, and risers synchronized to visual transitions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Interactive Sound Effects Card */}
                <div
                  onClick={() => onEnableSfxChange?.(!facelessEnableSfx)}
                  className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between gap-6 cursor-pointer select-none ${
                    facelessEnableSfx
                      ? "border-orange-300 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 shadow-sm ring-1 ring-orange-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {facelessEnableSfx ? "Sound Effects are ON" : "Sound Effects are OFF"}
                        </h3>
                        <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          facelessEnableSfx
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {facelessEnableSfx ? "Synced to Scene Cuts" : "Muted"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                        Automatically adds crisp whooshes on scene changes, metric impact pops on stats, and subtle risers before key moments. <strong className="text-slate-800 font-semibold">Kept subtle so they never overpower your voiceover.</strong>
                      </p>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <ModernToggleSwitch
                        checked={Boolean(facelessEnableSfx)}
                        onChange={(val) => onEnableSfxChange?.(val)}
                        activeColor="orange"
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Interactive Audition & Sound Cue Cards */}
                  <div className="rounded-2xl border border-orange-200/80 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-xs font-bold text-orange-950">
                        <Headphones size={15} className="text-orange-500" />
                        <span>Included Synchronized Sound Cues</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSfxSample();
                        }}
                        className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition shadow-sm cursor-pointer active:scale-95"
                      >
                        {isPlayingSfxSample ? (
                          <>
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-3" />
                              <span className="w-0.5 bg-white rounded-full animate-pulse h-2" />
                            </div>
                            <span>Playing Sample...</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} className="fill-white" />
                            <span>Audition Sample SFX</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-4 text-center space-y-1">
                        <p className="text-sm font-black text-orange-950">💨 Whoosh</p>
                        <p className="text-[11px] text-orange-800 font-medium">Plays smoothly on scene transitions</p>
                      </div>
                      <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-4 text-center space-y-1">
                        <p className="text-sm font-black text-orange-950">💥 Metric Hit</p>
                        <p className="text-[11px] text-orange-800 font-medium">Highlights stats, numbers &amp; charts</p>
                      </div>
                      <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-4 text-center space-y-1">
                        <p className="text-sm font-black text-orange-950">📈 Riser</p>
                        <p className="text-[11px] text-orange-800 font-medium">Builds anticipation before key points</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${facelessEnableSfx ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={facelessEnableSfx ? "text-slate-800 font-bold" : "text-slate-400"}>
                        {facelessEnableSfx ? "Active: Sound cues sync automatically with your storyboard" : "SFX muted"}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Independent of Background Music (works even when BGM is off)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ══════════════════════════════════════════════════════════════
              STEP 6: CAPTIONS (Dedicated Step: Clean Caption Styles & Position)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 6 && (() => {
            const isDefaultView = captionFilter === "all" && !captionSearchQuery.trim();
            const topCuratedCount = 9;
            const visibleCaptionStyles =
              isDefaultView && !showAllCaptionStyles
                ? filteredCaptionStyles.filter((t, idx) => idx < topCuratedCount || t.id === subtitleStyle)
                : filteredCaptionStyles;
            const hasMoreStyles = isDefaultView && filteredCaptionStyles.length > topCuratedCount;

return (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-7">
                {/* Prominent Centered Section Heading */}
                <div className="text-center max-w-xl mx-auto space-y-3 pt-1 pb-1">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25 mb-1">
                    <Type size={26} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Choose Your Video Captions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Pick how your spoken words animate on screen, or turn captions off if you prefer YouTube&apos;s native CC.
                  </p>

                  {/* Captions ON / OFF Segmented Toggle */}
                  <div className="pt-2 flex justify-center">
                    <div className="inline-grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCaptionsEnabled(true);
                          onShowCaptionsChange?.(true);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCaptionsEnabled
                            ? "bg-white text-orange-600 shadow-xs ring-1 ring-orange-500/30"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Check size={13} strokeWidth={3} className={isCaptionsEnabled ? "opacity-100" : "opacity-0 w-0"} />
                        <span>Captions ON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCaptionsEnabled(false);
                          onShowCaptionsChange?.(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          !isCaptionsEnabled
                            ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <X size={13} strokeWidth={3} className={!isCaptionsEnabled ? "opacity-100" : "opacity-0 w-0"} />
                        <span>No Captions (OFF)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {!isCaptionsEnabled ? (
                  <div className="py-10 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center space-y-3 max-w-2xl mx-auto">
                    <Type size={26} className="mx-auto text-slate-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-800">No burned-in captions</p>
                      <p className="text-xs text-slate-500">
                        Your 16:9 video will be rendered cleanly without on-screen subtitles (great if you upload your own YouTube CC).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCaptionsEnabled(true);
                        onShowCaptionsChange?.(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <span>Turn Captions ON</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Clean Active Caption & Position Bar */}
                    <div className="rounded-2xl border border-orange-200/80 bg-orange-50/40 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: Active Style + Live Animated Word Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                        <div
                          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700/60 flex items-center justify-center sm:min-w-[210px] shrink-0 shadow-sm relative overflow-hidden"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${currentCaptionObj.color}26 0%, #0F172A 78%)`,
                          }}
                        >
                          {renderPreviewCaptionWords(
                            currentCaptionObj.id,
                            currentCaptionObj.color,
                            currentCaptionObj.fontFamily,
                            previewWordStep
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-700">
                            Selected Style
                          </span>
                          <h3 className="text-base font-black text-slate-900 mt-0.5 truncate">
                            {currentCaptionObj.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {currentCaptionObj.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right: Where Captions Appear */}
                      <div className="space-y-1.5 shrink-0">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                          Caption Position
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "bottom", label: "Bottom" },
                            { id: "center", label: "Center" },
                            { id: "top", label: "Top" },
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => onCaptionPositionChange?.(pos.id as any)}
                              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                captionPosition === pos.id
                                  ? "border-orange-500 bg-orange-500 text-white shadow-xs"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Category Filters & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {["all", "viral", "cinema", "modern", "creative", "minimal"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCaptionFilter(cat)}
                            className={`text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                              captionFilter === cat
                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full sm:w-64 shrink-0">
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

                    {/* Caption Styles Grid (Visual-First Stage Cards, Clean Name + Description) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {visibleCaptionStyles.map((theme) => {
                        const isSelected = subtitleStyle === theme.id;

            return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => onSubtitleStyleChange?.(theme.id)}
                            className={`group p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/40 text-slate-900 shadow-md ring-2 ring-orange-500/20"
                                : "border-slate-200/90 bg-white hover:border-orange-300 hover:shadow-sm text-slate-700"
                            }`}
                          >
                            {/* Visual-First Tinted Stage Preview */}
                            <div
                              className="relative w-full rounded-xl px-4 py-5 flex items-center justify-center min-h-[76px] overflow-hidden border border-slate-900/10"
                              style={{
                                background: `radial-gradient(circle at 50% 55%, ${theme.color}30 0%, #1E293B 68%, #0F172A 100%)`,
                              }}
                            >
                              {/* Subtle grid texture */}
                              <div
                                className="absolute inset-0 pointer-events-none opacity-15"
                                style={{
                                  backgroundImage:
                                    "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
                                  backgroundSize: "14px 14px",
                                }}
                              />

                              <div className="relative z-10 flex items-center justify-center">
                                {renderPreviewCaptionWords(
                                  theme.id,
                                  theme.color,
                                  theme.fontFamily,
                                  isSelected ? previewWordStep : 1
                                )}
                              </div>

                              {isSelected && (
                                <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white/90 z-20">
                                  <Check size={11} strokeWidth={3} />
                                </span>
                              )}
                            </div>

                            {/* Clean Style Name + Description (No Clutter Badges) */}
                            <div className="px-0.5 space-y-0.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                                  style={{ backgroundColor: theme.color }}
                                />
                                <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                  {theme.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                                {theme.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Show More / Show Fewer Styles Toggle */}
                    {hasMoreStyles && (
                      <div className="flex justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAllCaptionStyles(!showAllCaptionStyles)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-700 transition cursor-pointer"
                        >
                          {showAllCaptionStyles ? (
                            <>
                              <ChevronUp size={14} />
                              <span>Show fewer styles</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown size={14} />
                              <span>Show all {filteredCaptionStyles.length} caption styles</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Scene Animation Speed */}
                <div className="pt-5 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Scene Animation Speed
                    </label>
                    <span className="text-[11px] text-slate-400">Controls how fast captions and visuals transition</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: "clean", label: "Clean (Calm)", desc: "Gentle, relaxed pacing" },
                      { id: "cinematic", label: "Balanced", desc: "Smooth storytelling flow" },
                      { id: "documentary", label: "Documentary", desc: "Editorial Vox style" },
                      { id: "dynamic", label: "Fast & Dynamic", desc: "Punchy, high-energy cuts" },
                    ].map((pace) => (
                      <button
                        key={pace.id}
                        type="button"
                        onClick={() => onPacingStyleChange?.(pace.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          facelessPacingStyle === pace.id
                            ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500/30"
                            : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="text-xs font-black">{pace.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{pace.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            );
          })()}

          {/* ══════════════════════════════════════════════════════════════
              STEP 7: FONTS (Single Font Family + Weight Hierarchy + Handwritten Accent)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 7 && (() => {
            const filteredFonts = POPULAR_STUDIO_FONTS.filter(
              (f) =>
                !fontSearch.trim() ||
                f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
                f.category.toLowerCase().includes(fontSearch.toLowerCase()) ||
                f.desc.toLowerCase().includes(fontSearch.toLowerCase())
            );

return (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-6">
                  {/* Simple Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                        <Type size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Choose your video font &amp; accent style.
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          One unified Google Font with automatic weights for headings (800–900) &amp; body (400–600)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono self-start sm:self-center">
                      Google Fonts Library
                    </span>
                  </div>

                  {/* Live 16:9 Mockup Card (Single Font + Weight Hierarchy + Handwritten Accent) */}
                  <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/70 via-[#FAF6F2] to-amber-50/60 p-5 sm:p-7 text-zinc-900 relative overflow-hidden shadow-sm">
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-orange-700 bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-full">
                          16:9 Live Typography Preview
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-700">
                          <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 font-semibold">Font: {activeFont} (400–900)</span>
                          <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">Accent: {activeAccentFont}</span>
                        </div>
                      </div>

                      <div className="min-h-[180px] sm:aspect-video sm:max-h-56 w-full rounded-xl border border-orange-200/70 bg-white p-4 sm:p-7 flex flex-col justify-center relative shadow-2xs">
                        <div className="max-w-xl space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              style={{ fontFamily: `'${activeAccentFont}', "Caveat", cursive` }}
                              className="text-base sm:text-xl font-bold text-orange-600 -rotate-2 inline-block"
                            >
                              Key stat to watch!
                            </span>
                            <svg className="w-5 h-5 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6 C10 8, 14 12, 16 18" />
                              <path d="M11 16 L16 18 L18 13" />
                            </svg>
                          </div>
                          <h3
                            style={{ fontFamily: `'${activeFont}', sans-serif` }}
                            className="text-xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight"
                          >
                            +240% Audience Retention in{" "}
                            <span className="relative inline-block text-orange-600">
                              90 Days
                              <svg className="w-full h-2 absolute -bottom-1 left-0 text-orange-500" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                <path d="M2 7 Q50 1 98 6" />
                              </svg>
                            </span>
                          </h3>
                          <p
                            style={{ fontFamily: `'${activeFont}', sans-serif` }}
                            className="text-xs sm:text-sm font-medium text-zinc-600 leading-relaxed max-w-lg"
                          >
                            A single unified font family uses bold weights for widescreen headlines and clean medium weights for effortless reading pace.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Primary Video Font (Headings & Body via Weight Hierarchy) */}
                  <div className="rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 sm:p-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                          <span>Primary Video Font (Headings &amp; Body)</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Automatically applies ExtraBold/Black (800–900) for titles and Regular/Medium (400–600) for body &amp; subtitles
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 min-w-[140px] sm:flex-none sm:w-52">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            placeholder="Search Google Fonts..."
                            className="w-full pl-7 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-orange-800 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shrink-0">
                          {activeFont}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {(fontSearch.trim() || showAllFonts
                        ? filteredFonts
                        : filteredFonts.filter((f, idx) => idx < 6 || f.id === activeFont)
                      ).map((f) => {
                        const isSelected = activeFont === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleSelectPrimaryFont(f.id)}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                              isSelected
                                ? "border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20"
                                : "border-slate-200 bg-white/80 hover:border-orange-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[11px] font-bold text-slate-700 truncate">{f.name}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                {f.recommended && (
                                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Popular
                                  </span>
                                )}
                                {isSelected && (
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-white">
                                    <Check size={10} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <span
                              style={{ fontFamily: `'${f.id}', sans-serif` }}
                              className="text-lg font-black text-slate-900 block truncate tracking-tight leading-snug"
                            >
                              {f.sample}
                            </span>
                            <p
                              style={{ fontFamily: `'${f.id}', sans-serif` }}
                              className="text-[11px] text-slate-600 font-medium line-clamp-1 leading-snug"
                            >
                              {f.bodySample}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium truncate">{f.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!fontSearch.trim() && filteredFonts.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setShowAllFonts(!showAllFonts)}
                        className="w-full py-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {showAllFonts ? (
                          <>
                            <ChevronUp size={14} />
                            <span>Show fewer fonts</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} />
                            <span>View all {filteredFonts.length} Google Fonts</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Section 2: Accent / Annotation Font (Handwritten) */}
                  <div className="rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                          <span>Accent / Annotation Font (Handwritten)</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Used for margin callout notes, arrows, and underlined keywords inside video scenes
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-orange-800 bg-white px-2.5 py-1 rounded-lg border border-orange-200 self-start sm:self-center">
                        {activeAccentFont}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {POPULAR_ACCENT_FONTS.map((f) => {
                        const isSelected = activeAccentFont === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setActiveAccentFont(f.id)}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                              isSelected
                                ? "border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20"
                                : "border-slate-200 bg-white/80 hover:border-orange-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[11px] font-bold text-slate-700">{f.name}</span>
                              <div className="flex items-center gap-1">
                                {f.recommended && (
                                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Popular
                                  </span>
                                )}
                                {isSelected && (
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-white">
                                    <Check size={10} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <p
                              style={{ fontFamily: `'${f.id}', "Caveat", cursive` }}
                              className="text-xl text-orange-600 leading-snug"
                            >
                              {f.sample}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">{f.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════════════════════════════════════
              STEP 8: BACKGROUND CANVAS (Canva 28-Swatch Palette + Studio Presets)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 8 && (() => {
            const activeCanvas = resolveCurrentCanvasDetails(activeBackgroundTheme);
            const isSwatchSelected = (hex: string) => activeCanvas.hex.toLowerCase() === hex.toLowerCase();

            const selectBackgroundColor = (val: string) => {
              setActiveBackgroundTheme(val);
              onBackgroundThemeChange?.(val);
            };

            const handleCustomHexChange = (hexVal: string) => {
              let formatted = hexVal.trim();
              if (!formatted.startsWith("#")) formatted = "#" + formatted;
              setCustomHexInput(formatted);
              if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
                selectBackgroundColor(formatted);
              }
            };

            const handleCopyHex = () => {
              if (navigator?.clipboard) {
                navigator.clipboard.writeText(activeCanvas.hex);
                setCopiedHexFeedback(true);
                setTimeout(() => setCopiedHexFeedback(false), 2000);
              }
            };

            const isVibrantCanvas = (() => {
              let c = activeCanvas.hex.replace("#", "").trim();
              if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
              if (c.length !== 6) return false;
              const r = parseInt(c.slice(0, 2), 16);
              const g = parseInt(c.slice(2, 4), 16);
              const b = parseInt(c.slice(4, 6), 16);
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              return max - min > 110 && max > 160;
            })();

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
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
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

                  {/* Main Two-Column Layout: Left Clean 16:9 YouTube Canvas / Right Canva Swatches Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* LEFT PANEL: Clean 16:9 YouTube Video Canvas & Active Color Inspector (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Full 16:9 YouTube Video Canvas with Live Texture Overlay */}
                      <div
                        className="aspect-[16/9] w-full rounded-xl border-[1.2px] border-orange-500/75 flex items-center justify-center relative overflow-hidden transition-colors duration-200"
                        style={{ backgroundColor: activeCanvas.hex }}
                      >
                        {canvasTexture === "dot-grid" && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage: `radial-gradient(${activeCanvas.isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.14)"} 1px, transparent 1px)`,
                              backgroundSize: "16px 16px",
                            }}
                          />
                        )}
                        {canvasTexture === "vignette" && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: activeCanvas.isDark
                                ? "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.45) 100%)"
                                : "radial-gradient(circle at center, transparent 50%, rgba(15,23,42,0.12) 100%)",
                            }}
                          />
                        )}
                        {canvasTexture === "paper" && (
                          <div
                            className="absolute inset-0 pointer-events-none opacity-45"
                            style={{
                              backgroundImage: `repeating-linear-gradient(0deg, ${activeCanvas.isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)"} 0px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, ${activeCanvas.isDark ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.02)"} 0px, transparent 1px, transparent 4px)`,
                            }}
                          />
                        )}
                      </div>

                      {/* Visual Background Texture Style Selector */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 tracking-tight">
                            Background Texture Style
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                            4 Styles
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {[
                            { id: "solid" as const, label: "Clean Solid", hint: "Flat color" },
                            { id: "dot-grid" as const, label: "Dot Grid", hint: "Studio dots" },
                            { id: "vignette" as const, label: "Vignette", hint: "Soft edges" },
                            { id: "paper" as const, label: "Paper Grain", hint: "Editorial texture" },
                          ].map((tex) => {
                            const isTexActive = canvasTexture === tex.id;
                            return (
                              <button
                                key={tex.id}
                                type="button"
                                onClick={() => setCanvasTexture(tex.id)}
                                className={`group p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                  isTexActive
                                    ? "border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20"
                                    : "border-slate-200 bg-white/85 hover:bg-white hover:border-orange-300"
                                }`}
                              >
                                {/* Live Mini Texture Swatch */}
                                <div
                                  className="h-10 w-12 rounded-lg shrink-0 relative overflow-hidden border border-black/10"
                                  style={{ backgroundColor: activeCanvas.hex }}
                                >
                                  {tex.id === "dot-grid" && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundImage: `radial-gradient(${activeCanvas.isDark ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.32)"} 1.2px, transparent 1.2px)`,
                                        backgroundSize: "7px 7px",
                                      }}
                                    />
                                  )}
                                  {tex.id === "vignette" && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        background: activeCanvas.isDark
                                          ? "radial-gradient(circle at center, rgba(255,255,255,0.14) 20%, rgba(0,0,0,0.65) 100%)"
                                          : "radial-gradient(circle at center, transparent 30%, rgba(15,23,42,0.28) 100%)",
                                      }}
                                    />
                                  )}
                                  {tex.id === "paper" && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundImage: `repeating-linear-gradient(0deg, ${activeCanvas.isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.09)"} 0px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, ${activeCanvas.isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"} 0px, transparent 1px, transparent 4px)`,
                                      }}
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[11px] font-black text-slate-900 truncate">
                                      {tex.label}
                                    </span>
                                    {isTexActive && (
                                      <Check size={12} strokeWidth={3} className="text-orange-600 shrink-0" />
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {tex.hint}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Auto-Contrast Text Indicator + Friendly Readability Tip */}
                      <div
                        className={`text-[11px] leading-snug px-3 py-2.5 rounded-xl border space-y-1.5 ${
                          isVibrantCanvas
                            ? "bg-amber-50 border-amber-200 text-amber-800 font-semibold"
                            : "bg-slate-50 border-slate-200/80 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-bold text-slate-800">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={`h-3 w-3 rounded-full border ${
                                activeCanvas.isDark
                                  ? "bg-white border-slate-300"
                                  : "bg-slate-900 border-slate-700"
                              }`}
                            />
                            <span>
                              Text Color: {activeCanvas.isDark ? "Crisp White" : "Deep Charcoal"}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Auto-Contrast
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">
                          AI automatically adapts scene &amp; subject colors to this background so nothing blends in or disappears.
                        </p>
                      </div>

                      {/* Active Color Details & Custom Color Picker */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full border border-slate-200 shrink-0"
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
                                selectBackgroundColor(e.target.value);
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
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-6 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                          <div>
                            <h3 className="text-sm font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
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
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-3.5 md:gap-4 justify-items-center py-2">
                          {CANVA_PALETTE_SWATCHES.map((swatch) => {
                            const isSelected = isSwatchSelected(swatch.hex);

                return (
                              <button
                                key={swatch.id}
                                type="button"
                                onClick={() => {
                                  setCustomHexInput(swatch.hex);
                                  selectBackgroundColor(swatch.hex);
                                }}
                                title={`${swatch.name} (${swatch.hex})`}
                                className={`group relative w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full cursor-pointer transition-all duration-150 flex items-center justify-center active:scale-95 hover:scale-110 ${
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
                            <span>Recommended Background</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">5 Presets</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {BACKGROUND_PALETTES.map((preset) => {
                            const isSelected = activeBackgroundTheme === preset.id;

                return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setCustomHexInput(preset.color);
                                  selectBackgroundColor(preset.id);
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
              STEP 9: VIDEO SCENES (Clean Storyboard & Visual Library)
              ══════════════════════════════════════════════════════════════ */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm space-y-6">
                {/* Clean Pictory-Style Header: Title on left, Count + Export CTA on right */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 mt-0.5">
                      <Film size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Edit Scenes &amp; Download
                        </h2>
                        {activeCreatorBundleId && (() => {
                          const bundle = CREATOR_STYLE_BUNDLES.find((b) => b.id === activeCreatorBundleId);
                          if (!bundle) return null;
                          return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-bold text-orange-800">
                              <Sparkles size={11} className="text-orange-600" />
                              <span>{bundle.name} ({bundle.inspiredBy})</span>
                              <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="underline text-orange-700 hover:text-orange-900 ml-1 cursor-pointer"
                              >
                                Customize
                              </button>
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {sceneBlueprint.length > 0
                          ? "Click any scene to jump the live preview, edit text or visuals, and export your 1080p MP4."
                          : "Upload your audio or video in Step 1 to generate your real storyboard and live preview."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 font-mono">
                      {sceneBlueprint.length} {sceneBlueprint.length === 1 ? "Scene" : "Scenes"}
                      {sceneBlueprint.length > 0 ? ` • ${formatSec(totalSceneDurationSec)}` : ""}
                    </span>

                    {renderedVideoUrl ? (
                      <a
                        href={renderedVideoUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-sm shadow-emerald-600/25"
                      >
                        <CheckCircle2 size={14} />
                        <span>Download MP4</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowPreRenderModal(true)}
                        disabled={isGenerating || !selectedFile || sceneBlueprint.length === 0}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition shadow-sm shadow-orange-600/25 cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
                      >
                        <Sparkles size={14} />
                        <span>Render &amp; Download MP4</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Storyboard + Live Preview Area */}
                {sceneBlueprint.length === 0 ? (
                  isPlanning ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-8 sm:p-12 text-center space-y-3">
                      <Sparkles size={32} className="mx-auto text-orange-500 animate-spin" />
                      <p className="text-sm font-black text-slate-800">
                        {planningMessage || "Creating your real video scenes from audio..."}
                      </p>
                      <p className="text-xs text-slate-500">
                        Your storyboard and live 16:9 preview will appear automatically once planning completes.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <div className="lg:col-span-5 space-y-2.5">
                          <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Storyboard
                          </div>
                          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500 leading-relaxed">
                            No scenes generated yet. Upload your real voiceover or video in Step 1 so AI can build your timestamped storyboard scenes.
                          </div>
                        </div>
                        <div className="lg:col-span-7">
                          <div className="aspect-video w-full rounded-2xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center gap-2.5 p-6 text-center">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                              <Film size={22} />
                            </div>
                            <p className="text-sm font-black text-slate-800">
                              Live 16:9 Preview Ready After Upload
                            </p>
                            <p className="text-xs text-slate-500 max-w-sm">
                              We never show fake or sample footage here — your preview will reflect your actual uploaded audio, captions, and scenes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center pt-1">
                        {selectedFile ? (
                          <button
                            type="button"
                            onClick={() => triggerTranscription(selectedFile)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition shadow-xs cursor-pointer"
                          >
                            <Sparkles size={14} />
                            <span>Generate Video Scenes</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <span>Upload Audio in Step 1</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-5">
                    {/* 2-Column Pictory-Style Workspace: Left Storyboard List + Right Large 16:9 Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left Column: Storyboard Scene Rows */}
                      <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Storyboard
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            Click a scene to preview &amp; edit
                          </span>
                        </div>

                        <div className="p-2.5 space-y-2 max-h-[430px] overflow-y-auto">
                          {sceneBlueprint.map((sc, idx) => {
                            const sceneNum = sc.sceneNumber || idx + 1;
                            const cumulativeStart = sceneBlueprint
                              .slice(0, idx)
                              .reduce((acc, s) => acc + Number(s.duration || 5), 0);
                            const sceneStartSec = Number(
                              sc.narrationSegment?.startSeconds ?? sc.startSeconds ?? cumulativeStart
                            );
                            const sceneDurSec = Number(sc.duration || 5);
                            const sceneEndSec = sceneStartSec + sceneDurSec;
                            const isSelected = selectedSceneForAssetSwap === sceneNum;
                            const playbackSec = step8CurrentFrame / 30;
                            const isPlayingThisScene =
                              playbackSec >= sceneStartSec && playbackSec < sceneEndSec;
                            const isReplanningThis = replanningSceneIndex === idx;
                            const layoutLabel = String(sc.layoutType || "card_concept").replace(/_/g, " ");

                            return (
                              <div
                                key={`storyboard-row-${sceneNum}`}
                                onClick={() => handleSelectAndSeekScene(sceneNum, sceneStartSec)}
                                className={`rounded-xl border p-3 transition-all cursor-pointer space-y-1.5 ${
                                  isSelected || isPlayingThisScene
                                    ? "border-orange-400 border-l-4 border-l-orange-600 bg-white shadow-sm"
                                    : "border-slate-200/80 bg-white/85 hover:border-orange-300 hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-mono font-black shrink-0 ${
                                        isSelected || isPlayingThisScene
                                          ? "bg-orange-600 text-white"
                                          : "bg-slate-800 text-white"
                                      }`}
                                    >
                                      {sceneNum}
                                    </span>
                                    <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                                      {formatSec(Math.round(sceneStartSec))}–{formatSec(Math.round(sceneEndSec))}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate">
                                      {layoutLabel}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplanSingleScene(idx);
                                      }}
                                      disabled={replanningSceneIndex !== null}
                                      className="p-1 rounded-md text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer disabled:opacity-50"
                                      title="Re-plan scene with AI"
                                    >
                                      <Sparkles size={12} className={isReplanningThis ? "animate-spin text-orange-600" : ""} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal(idx);
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 hover:text-orange-700 hover:bg-orange-50 transition cursor-pointer"
                                      title="Edit scene text & layout"
                                    >
                                      <Edit3 size={11} />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadTargetSceneNum(sceneNum);
                                        sceneImageInputRef.current?.click();
                                      }}
                                      className="p-1 rounded-md text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                                      title="Upload image for this scene"
                                    >
                                      <Upload size={12} />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-xs font-black text-slate-900 line-clamp-1">
                                  {sc.heading || sc.title || `Scene ${sceneNum}`}
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                                  {sc.narrationSegment?.text || sc.supportingText || sc.keyTakeaway}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Large 16:9 Live Preview */}
                      <div className="lg:col-span-7 space-y-2.5">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
                          <Player
                            ref={step8PlayerRef}
                            component={FacelessLongVideoTemplate as any}
                            inputProps={step8PreviewInputProps}
                            durationInFrames={Math.max(150, Math.ceil(totalSceneDurationSec * 30))}
                            fps={30}
                            compositionWidth={1920}
                            compositionHeight={1080}
                            controls
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-500">
                          <span className="font-mono font-bold text-slate-700">
                            Preview: {formatSec(Math.floor(step8CurrentFrame / 30))} / {formatSec(totalSceneDurationSec)}
                          </span>
                          <span>
                            {selectedSceneForAssetSwap
                              ? `Selected: Scene ${selectedSceneForAssetSwap} — swap visual below or click Edit`
                              : "Live preview reflects your real uploaded audio, captions, fonts & scenes"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Scene Filmstrip (Click to jump & swap visual) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">
                          Scene Filmstrip
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Click any thumbnail to jump preview &amp; assign visuals
                        </span>
                      </div>

                      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5">
                        {sceneBlueprint.map((sc, idx) => {
                          const sceneNum = sc.sceneNumber || idx + 1;
                          const assetUrl = brollUrls[sceneNum] || sc.assetUrl;
                          const cumulativeStart = sceneBlueprint
                            .slice(0, idx)
                            .reduce((acc, s) => acc + Number(s.duration || 5), 0);
                          const sceneStartSec = Number(
                            sc.narrationSegment?.startSeconds ?? sc.startSeconds ?? cumulativeStart
                          );
                          const sceneDurSec = Number(sc.duration || 5);
                          const isSelected = selectedSceneForAssetSwap === sceneNum;
                          const playbackSec = step8CurrentFrame / 30;
                          const isPlayingThisScene =
                            playbackSec >= sceneStartSec && playbackSec < sceneStartSec + sceneDurSec;

                          return (
                            <div
                              key={`filmstrip-thumb-${sceneNum}`}
                              onClick={() => handleSelectAndSeekScene(sceneNum, sceneStartSec)}
                              className={`group relative w-40 shrink-0 rounded-xl border overflow-hidden cursor-pointer transition-all ${
                                isSelected || isPlayingThisScene
                                  ? "border-orange-600 ring-2 ring-orange-500/30 shadow-md"
                                  : "border-slate-200 hover:border-orange-300"
                              }`}
                            >
                              <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                {assetUrl && !assetUrl.endsWith(".html") ? (
                                  <img
                                    src={assetUrl}
                                    alt={sc.heading || `Scene ${sceneNum}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full p-2 flex flex-col justify-center bg-slate-800 text-left">
                                    <span className="text-[9px] font-bold uppercase text-orange-400 truncate">
                                      {String(sc.layoutType || "scene").replace(/_/g, " ")}
                                    </span>
                                    <span className="text-[10px] font-bold text-white line-clamp-2 leading-tight mt-0.5">
                                      {sc.heading || `Scene ${sceneNum}`}
                                    </span>
                                  </div>
                                )}

                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono font-black">
                                  #{sceneNum}
                                </span>
                                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-mono">
                                  {sceneDurSec.toFixed(1)}s
                                </span>

                                {assetUrl && !assetUrl.endsWith(".html") && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAssetFromScene(sceneNum);
                                    }}
                                    className="absolute top-1.5 right-1.5 p-1 rounded bg-slate-950/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    title="Remove visual"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scene Transition Selector (Per-Video) */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900">
                          Scene Transition Style
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Applied between every scene change
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "crossfade" as const, label: "Smooth Crossfade", desc: "Clean cinema blend" },
                          { id: "slide-push" as const, label: "Slide Push", desc: "Dynamic lateral move" },
                          { id: "zoom-whip" as const, label: "Zoom Whip", desc: "High-energy YouTube cut" },
                          { id: "hard-cut" as const, label: "Hard Cut", desc: "Instant documentary snap" },
                        ].map((tr) => {
                          const isTrActive = sceneTransitionStyle === tr.id;
                          return (
                            <button
                              key={tr.id}
                              type="button"
                              onClick={() => setSceneTransitionStyle(tr.id)}
                              className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
                                isTrActive
                                  ? "border-orange-500 bg-white ring-2 ring-orange-500/20 shadow-2xs"
                                  : "border-slate-200 bg-white/70 hover:border-orange-300"
                              }`}
                            >
                              <div className={`text-xs font-black ${isTrActive ? "text-orange-700" : "text-slate-800"}`}>
                                {tr.label}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{tr.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden Scene Image Input */}
                <input
                  ref={sceneImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSceneCustomImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL: Pre-Render Confirmation (Audit Recommendation 6) ── */}
      {showPreRenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Ready to Create Your Video?</h3>
                  <p className="text-xs text-slate-500">Full HD Widescreen (16:9)</p>
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
                <span className="font-bold text-slate-500">Quality:</span>
                <span className="font-bold text-slate-700">1080p Full HD • Studio Audio Mastering</span>
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
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Back to Scenes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreRenderModal(false);
                  handleTriggerGenerate();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-orange-500/25 active:scale-95 cursor-pointer"
              >
                Create Video ({calculatedCredits} Cr)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Scene Text ── */}
      {editSceneIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
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
                <label className="block font-bold text-slate-700 mb-1">Layout Style</label>
                <select
                  value={editLayoutInput}
                  onChange={(e) => setEditLayoutInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="card_concept">Standard Card</option>
                  <option value="stat_card">Big Stat</option>
                  <option value="comparison">Comparison (Side-by-Side)</option>
                  <option value="checklist">Checklist</option>
                  <option value="quote">Quote</option>
                  <option value="chapter_title">Chapter Title</option>
                  <option value="horizontal_process">Step-by-Step Process</option>
                  <option value="workflow">Workflow</option>
                  <option value="before_after_transformation">Before &amp; After</option>
                  <option value="curved_roadmap">Roadmap</option>
                  <option value="scorecard_dashboard">KPI Scorecard</option>
                  <option value="rough_notation">RoughNotation Highlight</option>
                  <option value="lottie_motion">Lottie Motion Card</option>
                  <option value="code_diff">Animated Code Diff</option>
                  <option value="three_globe">3D Spinning Globe</option>
                  <option value="map_flyover">Map Route Flyover</option>
                  <option value="kinetic_kit">Kinetic Kit Takeaway</option>
                  <option value="table_of_contents">Agenda / Contents</option>
                  <option value="mission_vision">Two Pillars</option>
                  <option value="circular_org_chart">Radial Diagram</option>
                  <option value="horizontal_shelves">Tiered Shelves</option>
                  <option value="medical_infographic">Monitor / Chart</option>
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

              {/* Sticker / Arrow Callout Toggles */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Highlight Arrow Callout</p>
                    <p className="text-[11px] text-slate-500">Draw an animated arrow pointing to key stats or comparisons</p>
                  </div>
                  <ModernToggleSwitch
                    checked={editHighlightArrowInput}
                    onChange={setEditHighlightArrowInput}
                    activeColor="orange"
                    size="sm"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                  <label className="block text-xs font-bold text-slate-800">Reaction / Concept Sticker</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "none", label: "None" },
                      { id: "lightbulb", label: "💡 Insight" },
                      { id: "rocket", label: "🚀 Growth" },
                      { id: "check", label: "✅ Verified" },
                      { id: "trending", label: "📈 Trend" },
                      { id: "warning", label: "⚠️ Caution" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setEditConceptStickerInput(st.id)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                          editConceptStickerInput === st.id
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
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
      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-3 sm:px-8 lg:px-12 py-2.5 sm:py-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shadow-lg">
        {/* Left Side: Back button + Step info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1))}
              className="px-3 sm:px-3.5 py-2 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
            >
              Back
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100/90 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-200/80 shrink-0 font-mono">
            {currentStep === 0 ? (
              <span>
                <span className="hidden sm:inline">Overview Roadmap • </span>~60s Total
              </span>
            ) : (
              <span>{`Step ${currentStep}/${FACELESS_STEPS.length - 1} • ${calculatedCredits} Cr`}</span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 max-w-[220px] truncate border-l border-slate-200 pl-3">
            <span className="font-semibold text-slate-400">Topic:</span>
            <span className="font-bold text-slate-800 truncate">{topicTitle || "Faceless Video"}</span>
          </div>
        </div>

        {/* Right Side: Next or Generate */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {currentStep < FACELESS_STEPS[FACELESS_STEPS.length - 1].step ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[10px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 group max-w-[210px] sm:max-w-none"
            >
              <span className="truncate">{currentStep === 0 ? "Start Creating Video" : `Next: ${FACELESS_STEPS.find(s => s.step === currentStep + 1)?.title ?? "Next"}`}</span>
              <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
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

