"use client";

import BrandLogo from '@/components/brand/BrandLogo';
import {StickerStylePicker} from '@/components/compare/StickerStylePicker';
import {CompareTextFields} from '@/components/compare/CompareTextFields';
import {CompareImageSlots} from '@/components/compare/CompareImageSlots';
import {TypographyStylePicker} from '@/components/typography/TypographyStylePicker';
import { VideoStyleControls, HeadingFontOption, TypographyFontOption } from "@/components/ui/VideoStyleControls";
import { FacelessVideoStyleControls } from "@/components/ui/FacelessVideoStyleControls";
import { DualLanguageSelector } from "@/components/ui/LanguageSelector";
import InteractiveRenderEngine from '@/components/render/InteractiveRenderEngine';
import { BackgroundPicker } from '@/components/BackgroundPicker';
import { MaterialCatalogGrid } from '@/components/dashboard/MaterialCatalogGrid';
import { AudioCleanStudio } from '@/components/dashboard/AudioCleanStudio';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Download,
  Eye,
  Film,
  FolderOpen,
  Gift,
  ImagePlus,
  Layers3,
  Laptop,
  Loader2,
  LogOut,
  Mic,
  Plus,
  Captions,
  ShieldCheck,
  Sparkles,
  Palette,
  Trash2,
  Upload,
  Video,
  FileText,
  Wand2,
  Flame,
  Zap,
  Play,
  ArrowDown,
  X,
  LayoutGrid,
  CreditCard,
  User,
  Volume2,
  Scissors,
  VolumeX,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { SubtitleStylePicker, SUBTITLE_PRESETS } from "@/components/ui/SubtitleStylePicker";
import { calculateRenderCreditUnits, formatCreditUnits, type BillableRenderMode } from "@/lib/billing/creditPricing";
import dynamic from "next/dynamic";

// Lazy-load PreviewEditor — only loaded when user triggers preview
const PreviewEditor = dynamic(
  () => import("@/components/preview/PreviewEditor").then((m) => m.PreviewEditor),
  { ssr: false }
);

// Lazy-load Typography Video live preview — only loaded when Typography Video is selected
const TypographyPreview = dynamic(
  () => import("@/components/preview/TypographyPreview").then((m) => m.TypographyPreview),
  { ssr: false, loading: () => <div className="mx-auto w-full max-w-[220px] rounded-xl border border-border bg-muted/40" style={{ aspectRatio: "9 / 16" }} /> }
);

// Whiteboard uses a single board style now — no live preview component needed

// Lazy-load Compare Explainer live preview — only loaded when Compare is selected
const ComparePreview = dynamic(
  () => import("@/components/preview/ComparePreview").then((m) => m.ComparePreview),
  { ssr: false, loading: () => <div className="mx-auto w-full max-w-[220px] rounded-xl border border-border bg-muted/40" style={{ aspectRatio: "9 / 16" }} /> }
);

// Lazy-load Long Video Promo live preview — only loaded when Long Video Promo is selected
const LongVideoPromoPreview = dynamic(
  () => import("@/components/preview/LongVideoPromoPreview").then((m) => m.LongVideoPromoPreview),
  { ssr: false, loading: () => <div className="mx-auto w-full max-w-[220px] rounded-xl border border-border bg-muted/40" style={{ aspectRatio: "9 / 16" }} /> }
);

// Lazy-load Multi Images live preview — only loaded when Multi Images Video is selected
const MultiImagesPreview = dynamic(
  () => import("@/components/preview/MultiImagesPreview").then((m) => m.MultiImagesPreview),
  { ssr: false, loading: () => <div className="mx-auto w-full max-w-[220px] rounded-xl border border-border bg-muted/40" style={{ aspectRatio: "9 / 16" }} /> }
);

type Mode =
  | "compare"
  | "autoCaption"
  | "autoDraw"
  | "longVideoPromo"
  | "dynamicCreator"
  | "creatorBackgroundReplace"
  | "customAiReel"
  | "whiteboardVideo"
  | "typographyVideo"
  | "multiImagesVideo"
  | "longVideoClips"
  | "audioClean"
  | "longVideoPro"
  | "facelessVideo"
  | "aiVideoGenerator";
type CaptionStudioSettings = {
  fontFamily: string;
  fontSizePx: number;
  fontWeight: number;
  italic: boolean;
  textCase: "as-is" | "uppercase" | "title" | "lowercase";
  letterSpacingEm: number;
  lineHeight: number;
  textColor: string;
  activeWordColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundShape: "pill" | "rounded" | "square" | "none";
  paddingPx: number;
  borderRadiusPx?: number;
  strokeWidthPx: number;
  strokeColor: string;
  shadow: "none" | "soft" | "hard";
  rotationDeg: number;
  position: "bottom" | "center" | "top";
  horizontalAlign: "left" | "center" | "right";
  maxWidthPercent: number;
  entryAnimation: "none" | "fade" | "slide-up" | "pop";
  emphasisMode: "color" | "scale" | "box" | "underline" | "none";
  wordsPerGroup: number;
};

const DEFAULT_STUDIO_SETTINGS: CaptionStudioSettings = {
  fontFamily: "Inter, sans-serif",
  fontSizePx: 72,
  fontWeight: 800,
  italic: false,
  textCase: "as-is",
  letterSpacingEm: 0,
  lineHeight: 1.2,
  textColor: "#FFFFFF",
  activeWordColor: "#22D3EE",
  backgroundColor: "#000000",
  backgroundOpacity: 0.6,
  backgroundShape: "pill",
  paddingPx: 24,
  borderRadiusPx: 24,
  strokeWidthPx: 0,
  strokeColor: "#000000",
  shadow: "soft",
  rotationDeg: 0,
  position: "bottom",
  horizontalAlign: "center",
  maxWidthPercent: 80,
  entryAnimation: "slide-up",
  emphasisMode: "color",
  wordsPerGroup: 4,
};

type CreatorBackgroundSettings = {
  backgroundFit: "cover" | "contain";
  backgroundScale: number;
  backgroundX: number;
  backgroundY: number;
  creatorScale: number;
  creatorX: number;
  creatorY: number;
};
type ClipStatus = {
  clipIndex: number;
  renderId: string;
  bucketName: string;
  outName: string;
  startSeconds: number;
  endSeconds: number;
  title: string;
  durationSeconds: number;
  outputFile?: string;
  status: "rendering" | "done" | "failed";
};
type JobStatusState = "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
type JobStatus = {
  state: JobStatusState;
  message: string;
  progress?: number;
  failureStage?: "upload" | "transcript" | "planning" | "render";
  reasonCode?: string;
  diagnostics?: string[];
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  design?: string;
  clips?: ClipStatus[];
};

type RecentRender = {
  id: string;
  title: string;
  mode: Mode;
  design: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  expiresAt?: string | number;
  creditRenewalAt?: string;
  billingCycle?: "monthly" | "annual";
  cancelAtPeriodEnd?: boolean;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
};

const RECENT_RENDER_RETENTION_MS = 48 * 60 * 60 * 1000;
const RENDER_POLL_INTERVAL_MS = 3000;
const RENDER_POLL_ATTEMPTS = 360;

const videoTypeCards = [
  { id: "auto-caption-generator", title: "Auto Caption Generator", tag: "Auto Captions", description: "Generate animated word-level captions for Reels, Shorts & YouTube videos.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png", videoPreviewUrl: "/videos/auto-captions/content-creator-after.mp4", badgeType: "Popular" as const, accent: "#1A73E8", mode: "autoCaption" as const, category: "creator", inputType: "video" as const },
  { id: "compare-explainer", title: "Compare Explainer Video", tag: "Comparison", description: "Left vs right comparison with narration and sticker presenter.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png", videoPreviewUrl: "/renders/compare-qa-30s-output.mp4", badgeType: "AI" as const, accent: "#1A73E8", mode: "compare" as const, category: "education", inputType: "text" as const },
  { id: "whiteboard-video", title: "Whiteboard Video", tag: "Whiteboard", description: "AI writes key points on a premium corporate board synced to your speech.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png", videoPreviewUrl: "/renders/whiteboard-test-output.mp4", badgeType: "AI" as const, accent: "#00FF9D", mode: "whiteboardVideo" as const, category: "education", inputType: "audio" as const },
  { id: "typography-video", title: "Typography Video", tag: "Typography", description: "Big bold text pops on your video synced to keywords.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png", videoPreviewUrl: "/renders/auto-caption-bold-highlight-strip-preview.mp4", badgeType: "Popular" as const, accent: "#1A73E8", mode: "typographyVideo" as const, category: "creator", inputType: "text" as const },
  { id: "multi-images-video", title: "Multi Images Video", tag: "Story", description: "Video + title + animated image slideshow for news & stories.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788202087/file_00000000ce648211b220fc406885b264_k6snxz.png", badgeType: "New" as const, accent: "#1A73E8", mode: "multiImagesVideo" as const, category: "creator", inputType: "audio" as const },
  { id: "long-video-promo", title: "Long Video Promo", tag: "Promo", description: "Promote your YouTube video as a vertical Short/Reel.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png", videoPreviewUrl: "/renders/long-promo-test-9x16.mp4", badgeType: undefined, accent: "#1A73E8", mode: "longVideoPromo" as const, category: "creator", inputType: "video" as const },
  { id: "ai-audio-cleaner", title: "AI Audio Cleaner", tag: "Long Audio", description: "Full script preview in dashboard • Auto removes recording mistakes, silences & noise.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png", badgeType: "Pro" as const, accent: "#1A73E8", mode: "audioClean" as const, category: "long", inputType: "audio" as const },
  { id: "long-video-clips", title: "Long Video Clips", tag: "Podcast Clips", description: "Turn long videos and podcasts into short viral clips with captions.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png", videoPreviewUrl: "/renders/long-promo-test-9x16.mp4", badgeType: "New" as const, accent: "#1A73E8", mode: "longVideoClips" as const, category: "long", inputType: "video" as const },
  { id: "faceless-video", title: "Faceless Video", tag: "16:9 YouTube • Max 20 Min", description: "Turn up to 20 min voiceover into complete 16:9 videos with curated AI visuals, Canva backgrounds & captions.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png", videoPreviewUrl: "/renders/custom-ai-reel-m1-preview.mp4", badgeType: "AI" as const, accent: "#F59E0B", mode: "facelessVideo" as const, category: "long", inputType: "audio" as const },
] as const;

function getPlannedRenderCreditUnits(mode: Mode, durationSeconds?: number, clipCount = 3) {
  try {
    if (mode === "longVideoClips") {
      return calculateRenderCreditUnits("longVideoClips", {clipCount});
    }
    const billableModes: BillableRenderMode[] = ["autoCaption", "compare", "longVideoPromo", "whiteboardVideo", "typographyVideo", "multiImagesVideo", "longVideoPro", "facelessVideo", "aiVideoGenerator"];
    return billableModes.includes(mode as BillableRenderMode)
      ? calculateRenderCreditUnits(mode as BillableRenderMode, {durationSeconds})
      : 0;
  } catch {
    return 0;
  }
}

const DEFAULT_CREATOR_BACKGROUND_SETTINGS: CreatorBackgroundSettings = {
  backgroundFit: "cover",
  backgroundScale: 1,
  backgroundX: 0,
  backgroundY: 0,
  creatorScale: 1,
  creatorX: 0,
  creatorY: 0,
};

const modeConfig = {
  autoCaption: {
    label: "Auto Caption Generator",
    title: "Auto Caption Generator",
    description: "📹 Upload: Video with speech (9:16 Reel or 16:9 Landscape)\nAI generates word-synced animated captions",
    accept: "video/*",
    supported: "MP4, MOV, WEBM",
    bestResult: "9:16 Reels or 16:9 videos with clear voice",
    uploadCta: "📹 Upload your video",
    icon: Captions,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  compare: {
    label: "Compare Explainer Video",
    title: "Compare Explainer Video",
    description: "🎙️ Upload: Audio voiceover\n🖼️ Required: 2 images (left vs right)",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC",
    bestResult: "Short comparison voiceover + 2 clear images",
    uploadCta: "🎙️ Upload audio",
    icon: Layers3,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  longVideoPromo: {
    label: "Long Video Promo",
    title: "Long Video Promo",
    description: "📹 Upload: Video clip (10-60s)\n🖼️ Required: Thumbnail image + title",
    accept: "video/*",
    supported: "MP4, MOV, WEBM • Best with 16:9 clips",
    bestResult: "10-60s video clip with thumbnail and title",
    uploadCta: "📹 Upload your video clip",
    icon: Film,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  dynamicCreator: {
    label: "Creator Reel Video",
    title: "Creator Reel Video",
    description: "📹 Upload: One vertical talking video\nAI adds dynamic edits and typography",
    accept: "video/*",
    supported: "MP4, MOV, WEBM",
    bestResult: "Vertical talking video with clear speech, up to 60 seconds",
    uploadCta: "📹 Upload your talking video",
    icon: Film,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  creatorBackgroundReplace: {
    label: "Background Replace Video",
    title: "Background Replace Video",
    description: "📹 Upload: Creator video\n🖼️ Required: Background image",
    accept: "video/*",
    supported: "MP4, MOV, WEBM + JPG/PNG/WEBP background",
    bestResult: "Creator talking video with a clear subject and one background image",
    uploadCta: "📹 Upload creator video",
    icon: ImagePlus,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  customAiReel: {
    label: "Custom AI Reel",
    title: "Custom AI Reel",
    description: "✍️ Describe your reel\n🖼️ Optional: images, screenshots, logo",
    accept: "image/*",
    supported: "Prompt + JPG, PNG, WEBP images",
    bestResult: "Simple English prompt with clear images/screenshots",
    uploadCta: "🖼️ Add images or screenshots",
    icon: Sparkles,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  autoDraw: {
    label: "Auto Draw Explainer Video",
    title: "Auto Draw Explainer Video",
    description: "🎙️ Upload: Audio or video with speech\nAI creates whiteboard scenes",
    accept: "audio/*,video/*",
    supported: "MP3, WAV, MP4, MOV",
    bestResult: "Step-by-step explanation, clear voice",
    uploadCta: "🎙️ Upload audio/video",
    icon: Film,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  whiteboardVideo: {
    label: "Whiteboard Video",
    title: "Whiteboard Video",
    description: "🎙️ Upload: Audio or video with speech\n📝 AI writes key points on a whiteboard",
    accept: "audio/*,video/*",
    supported: "MP3, WAV, M4A, MP4, MOV",
    bestResult: "Clear explanation with distinct points (30-60s)",
    uploadCta: "🎙️ Upload audio or video",
    icon: Captions,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  typographyVideo: {
    label: "Typography Video",
    title: "Typography Video",
    description: "📹 Upload: Talking video or audio voiceover\n✨ Big bold keywords appear synced to speech",
    accept: "video/*,audio/*",
    supported: "MP4, MOV, WEBM, MP3, WAV, M4A",
    bestResult: "Talking video or voiceover with numbers, stats, or strong statements",
    uploadCta: "📹 Upload your video or audio",
    icon: Film,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  multiImagesVideo: {
    label: "Multi Images Video",
    title: "Multi Images Video",
    description: "📹 Upload: 16:9 video\n🖼️ Upload: Multiple images\n✍️ Write a title",
    accept: "video/*",
    supported: "MP4, MOV, WEBM + JPG/PNG images",
    bestResult: "News clip or story video with supporting images",
    uploadCta: "📹 Upload your 16:9 video",
    icon: ImagePlus,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  longVideoClips: {
    label: "Long Video Clips",
    title: "Long Video Clips",
    description: "📹 Upload: Long video (any length)\n✂️ AI picks best moments as short clips",
    accept: "video/*",
    supported: "MP4, MOV, WEBM (any duration)",
    bestResult: "Long podcast, interview, or lecture video",
    uploadCta: "📹 Upload your long video",
    icon: Film,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  audioClean: {
    label: "AI Audio Cleaner",
    title: "AI Audio Cleaner",
    description: "🎙️ Upload: Long audio file (podcasts, voiceovers, lectures)\n✨ AI generates full script preview, cuts recording mistakes, long silences & filler words",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC, FLAC",
    bestResult: "Podcasts, voiceovers, lectures, or raw audio takes",
    uploadCta: "🎙️ Upload your long audio",
    icon: Mic,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  longVideoPro: {
    label: "Long Video Pro",
    title: "Long Video Pro",
    description: "🎬 Upload: Audio or video with speech\n✨ AI plans scenes, visuals, motion & captions for a 16:9 cinematic video",
    accept: "audio/*,video/*",
    supported: "MP4, MOV, WEBM, MP3, WAV • Up to 10 minutes",
    bestResult: "Explainers, presentations, educational content — AI directs every scene",
    uploadCta: "🎬 Upload your audio or video",
    icon: Clapperboard,
    color: "text-primary",
    border: "border-border",
    surface: "bg-muted",
  },
  facelessVideo: {
    label: "Faceless Video",
    title: "Faceless Video (16:9 YouTube)",
    description: "🎙️ Upload: Voiceover audio (MP3, WAV, M4A)\n✨ AI builds complete 16:9 YouTube videos with curated visuals, Canva backgrounds & synced captions",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC • Up to 20 minutes",
    bestResult: "Faceless YouTube channels, deep-dive documentaries, storytelling & explainers",
    uploadCta: "🎙️ Upload your voiceover / audio (Max 20 min)",
    icon: Film,
    color: "text-amber-400",
    border: "border-amber-400/40",
    surface: "bg-amber-950/20",
  },
  aiVideoGenerator: {
    label: "Faceless Video",
    title: "Faceless Video (16:9 YouTube)",
    description: "🎙️ Upload: Voiceover audio (MP3, WAV, M4A)\n✨ AI builds complete 16:9 YouTube videos with curated visuals, Canva backgrounds & synced captions",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC • Up to 20 minutes",
    bestResult: "Faceless YouTube channels, deep-dive documentaries, storytelling & explainers",
    uploadCta: "🎙️ Upload your voiceover / audio (Max 20 min)",
    icon: Film,
    color: "text-amber-400",
    border: "border-amber-400/40",
    surface: "bg-amber-950/20",
  },
} as const;

type ActiveDashboardMode = keyof typeof modeConfig;

function toActiveDashboardMode(mode: Mode): ActiveDashboardMode {
  return Object.prototype.hasOwnProperty.call(modeConfig, mode) ? mode as ActiveDashboardMode : "autoCaption";
}

const renderPreviewBars = [42, 76, 48, 92, 58, 82, 38, 68, 96, 54, 74, 44, 88, 52, 72, 62];
const renderParticles = [
  {left: "8%", top: "18%", delay: "0s"},
  {left: "22%", top: "72%", delay: "0.4s"},
  {left: "38%", top: "28%", delay: "0.9s"},
  {left: "56%", top: "82%", delay: "0.2s"},
  {left: "74%", top: "20%", delay: "0.7s"},
  {left: "88%", top: "62%", delay: "1.1s"},
];

const normalizeCaptionFont = (font: string) => {
  const key = font.split(",")[0]?.trim().toLowerCase();
  if (key === "impact") return "Impact, sans-serif";
  if (key === "arial black") return "Arial Black, sans-serif";
  if (key === "georgia") return "Georgia, serif";
  if (key === "courier new") return "Courier New, monospace";
  if (key === "fredoka") return "Fredoka";
  if (key === "sans-serif") return "sans-serif";
  return "Inter, sans-serif";
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("autoCaption");
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparisonFiles, setComparisonFiles] = useState<File[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [compareLeftTitle, setCompareLeftTitle] = useState("");
  const [compareRightTitle, setCompareRightTitle] = useState("");
  const [compareHandle, setCompareHandle] = useState("@itnavideo");
  const [compareTheme, setCompareTheme] = useState<string>("light");
  const [compareTone, setCompareTone] = useState<string>("versus");
  const [compareWinner, setCompareWinner] = useState<string>("none");
  const [compareImageStyle, setCompareImageStyle] = useState<string>("rounded");
  const [stickerStyle, setStickerStyle] = useState<string>("explainer");
  const [typographyStyle, setTypographyStyle] = useState<string>("prism-pro");
    const [whiteboardBoard] = useState<string>("corporate-luxury");
  const [captionStyle, setCaptionStyle] = useState<string>("Shorts Karaoke");
  const [captionPosition, setCaptionPosition] = useState<"bottom" | "center" | "top">("center");
  const [captionFontFamily, setCaptionFontFamily] = useState("Montserrat, sans-serif");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [captionTextColor, setCaptionTextColor] = useState("#ffffff");
  const [captionHighlightColor, setCaptionHighlightColor] = useState("#facc15");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState("#18181B");
  const [spokenLanguage, setSpokenLanguage] = useState<string>("auto");
  const [captionLanguage, setCaptionLanguage] = useState<string>("auto");
  const [videoLayout] = useState<"fullscreen" | "blur-bg" | "split">("fullscreen");
  const [progressStyle] = useState<"glow" | "line" | "none">("glow");
  const [wordClickSound] = useState(true);
  const [promoThumbnailFile, setPromoThumbnailFile] = useState<File | null>(null);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoCtaText, setPromoCtaText] = useState("");
  const [promoClipMeta, setPromoClipMeta] = useState<{durationSeconds?: number; mediaAspect?: string}>({});
  const [clipCount, setClipCount] = useState<number>(3);
  const [clipDuration, setClipDuration] = useState<15 | 30 | 60>(30);
  const [enableSfx, setEnableSfx] = useState(false);
  const [enableClipsCaptions, setEnableClipsCaptions] = useState(true);
  const [longVideoStylePreset, setLongVideoStylePreset] = useState<"cinematic_dark" | "corporate_clean" | "documentary_warm" | "tech_futuristic">("cinematic_dark");
  const [longVideoHeadingFont, setLongVideoHeadingFont] = useState("Montserrat");
  const [longVideoSubheadingFont, setLongVideoSubheadingFont] = useState("Plus Jakarta Sans");
  const [longVideoBodyFont, setLongVideoBodyFont] = useState("Inter");
  const [facelessEnableCaptions, setFacelessEnableCaptions] = useState(true);
  const [headingFont, setHeadingFont] = useState<HeadingFontOption>("Plus Jakarta Sans");
  const [typographyFont, setTypographyFont] = useState<TypographyFontOption>("Plus Jakarta Sans");
  const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState<string>("studio-white");
  const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState<string>("https://res.cloudinary.com/dhouh9idx/image/upload/v1787939447/warm-off-white-cream-texture-f4f4f9_isou0y.png");
  const [longVideoAtmosphereBg, setLongVideoAtmosphereBg] = useState<"none" | "abstract_dark" | "tech_grid" | "studio_bokeh" | "warm_gradient">("none");
  const [studioSettings, setStudioSettings] = useState<CaptionStudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [studioTab, setStudioTab] = useState<'presets' | 'text' | 'color' | 'effects' | 'position' | 'motion'>('presets');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [audioCleanOptions, setAudioCleanOptions] = useState({
    removeSilence: true,
    removeFillers: true,
    removeRepeats: true,
    removeFalseStarts: true,
    noiseReduction: false,
    volumeNormalize: true,
    trimEnds: true,
  });
  const [audioCleanAnalysis, setAudioCleanAnalysis] = useState<{
    transcript: string;
    segments: Array<{
      id: string;
      start: number;
      end: number;
      text: string;
      action: 'keep' | 'cut';
      reason?: 'repeat' | 'mistake' | 'silence' | 'filler';
    }>;
    structuredBlocks?: any[];
    markdown?: string;
    originalDuration: number;
    estimatedCleanDuration: number;
    stats: {
      totalWords: number;
      repeatedTakesCount: number;
      silenceCount: number;
      fillerCount: number;
      secondsSaved: number;
    };
    rawTranscript: any;
    mediaKey: string;
  } | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [audioCleanResult, setAudioCleanResult] = useState<{
    outputUrl: string;
    originalDuration: number;
    cleanedDuration: number;
    removedSegments?: number;
    stats?: {
      repeatedTakesCut: number;
      silencesCut: number;
      fillersCut: number;
      durationSavedSeconds: number;
    };
  } | null>(null);
  const [creatorBackgroundImageFile, setCreatorBackgroundImageFile] = useState<File | null>(null);
  const [creatorBackgroundSettings, setCreatorBackgroundSettings] = useState<CreatorBackgroundSettings>(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
  const [customAiPrompt, setCustomAiPrompt] = useState("");
  const [customAiImageFiles, setCustomAiImageFiles] = useState<File[]>([]);
  const [customAiLogoFile, setCustomAiLogoFile] = useState<File | null>(null);
  const [customAiVideoFile, setCustomAiVideoFile] = useState<File | null>(null);
  const [customAiAudioFile, setCustomAiAudioFile] = useState<File | null>(null);
  const [customAiVideoMeta, setCustomAiVideoMeta] = useState<{durationSeconds?: number}>({});
  const [customAiAudioMeta, setCustomAiAudioMeta] = useState<{durationSeconds?: number}>({});
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [deleteCandidate, setDeleteCandidate] = useState<RecentRender | null>(null);
  const [deletingRenderId, setDeletingRenderId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>({state: "idle", message: ""});
  const renderRequestInFlightRef = useRef(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [paymentBanner, setPaymentBanner] = useState("");
  const [previewVideoTypeId, setPreviewVideoTypeId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'shorts' | 'long' | 'audio' | 'video' | 'text' | 'ai_prompt'>('all');
  const [activeTab, setActiveTab] = useState<"video-types" | "credits" | "projects" | "profile">("video-types");

  // ── Preview Editor state ────────────────────────────────────────────────────
  // Stores pending upload keys + preview plan between "Generate Preview" and final render
  const [previewPlan, setPreviewPlan] = useState<import("@/components/preview/types").PreviewPlan | null>(null);
  const [pendingRenderKeys, setPendingRenderKeys] = useState<{
    mediaKey: string;
    comparisonImageKeys: string[];
    promoThumbnailKey: string;
    creatorBackgroundImageKey: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) return;
    const localRenders = loadRecentRenders(user.id);
    const timer = window.setTimeout(() => setRecentRenders(localRenders), 0);
    loadServerRecentRenders(user.id, localRenders).then(setRecentRenders).catch((error) => {
      console.warn("Could not load Supabase render history:", error);
    });
    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadBillingEntitlement(user.id).then(setBillingEntitlement).catch((error) => {
      console.warn("Could not load billing status:", error);
    });
  }, [user]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        window.setTimeout(() => {
          setPaymentBanner("Payment verified. Your paid plan is active on this account.");
        }, 0);
        window.history.replaceState(null, "", "/dashboard");
      }
      const requestedMode = params.get("mode");
      const requestedVideoType = params.get("videoType") || params.get("template");
      const nextMode = readDashboardMode(requestedMode || requestedVideoType);

      if (nextMode && nextMode !== "creatorBackgroundReplace") {
        const timer = window.setTimeout(() => {
          setMode(nextMode);
          setHasUserSelected(true);
          setSelectedFile(null);
          setComparisonFiles([]);
        }, 0);
        return () => window.clearTimeout(timer);
      }
    } catch (error) {
      console.warn("Could not read dashboard video type params:", error);
    }
    return undefined;
  }, []);

  const activeModeKey = toActiveDashboardMode(mode);
  const activeMode = modeConfig[activeModeKey];
  const isFounderDebugUser = user?.email?.toLowerCase() === "itnavideo@gmail.com" || user?.email?.toLowerCase() === "rohi@itnavideo.com";
  const ActiveModeIcon = activeMode.icon;
  const firstName = user?.displayName || user?.email?.split("@")[0] || "Creator";
  const fileMeta = useMemo(() => {
    if (!selectedFile) return null;
    return `${formatBytes(selectedFile.size)} | ${selectedFile.type || "media file"}`;
  }, [selectedFile]);
  // Local object URL for the uploaded video — used by Typography live preview
  const livePreviewVideoUrl = useMemo(() => {
    if (mode !== "typographyVideo" || !selectedFile || !selectedFile.type.startsWith("video/")) return null;
    return URL.createObjectURL(selectedFile);
  }, [mode, selectedFile]);
  useEffect(() => {
    return () => {
      if (livePreviewVideoUrl) URL.revokeObjectURL(livePreviewVideoUrl);
    };
  }, [livePreviewVideoUrl]);
  const renderInProgress = ["uploading", "starting", "rendering"].includes(jobStatus.state);
  const paidRemaining = billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit;
  const paidLimitComplete = Boolean(billingEntitlement?.active && typeof paidRemaining === "number" && paidRemaining <= 0);
  const isFreeSignupCredit = billingEntitlement?.planId === "free-signup-credit";
  const isFreeTrialModeBlocked = isFreeSignupCredit && mode !== "autoCaption";
  const isCaptionOnlyModeBlocked = false;
  const creditResetLabel = isFreeSignupCredit ? "Auto Caption only · watermark included" : billingEntitlement?.expiresAt ? `Valid until ${formatDate(String(billingEntitlement.expiresAt))}` : "";
  const plannedCreditUnits = getPlannedRenderCreditUnits(mode, promoClipMeta.durationSeconds, clipCount);
  const plannedCreditCost = plannedCreditUnits ? formatCreditUnits(plannedCreditUnits) : "—";
  const plannedCreditLabel = plannedCreditUnits
    ? `${plannedCreditCost} credit${plannedCreditCost === "1" ? "" : "s"}`
    : "Cost shown before render";
  const plannedCreditDetail = mode === "longVideoClips"
    ? "2-credit base + 1 per clip"
    : plannedCreditUnits ? "per video" : "available after setup";
  const canPrepareReel = Boolean(
    (mode === "customAiReel" ? customAiPrompt.trim().length >= 12 : selectedFile) &&
    (mode !== "compare" || comparisonFiles.length === 2) &&
    (mode !== "longVideoPromo" || (Boolean(promoThumbnailFile) && Boolean(promoTitle.trim()))) &&
    (mode !== "multiImagesVideo" || (comparisonFiles.length >= 2 && Boolean(promoTitle.trim()))) &&
    (mode !== "creatorBackgroundReplace" || Boolean(creatorBackgroundImageFile)) &&
    (mode !== "audioClean" || !isAnalyzingAudio) &&
    !renderInProgress &&
    !paidLimitComplete &&
    !isFreeTrialModeBlocked &&
    !isCaptionOnlyModeBlocked,
  );

  useEffect(() => {
    if (!renderInProgress) {
      renderRequestInFlightRef.current = false;
    }
  }, [renderInProgress]);

  const chooseCaptionStyle = (nextStyle: string) => {
    setCaptionStyle(nextStyle);
    const preset = SUBTITLE_PRESETS.find((item) => item.key === nextStyle || item.style === nextStyle);
    if (!preset) return;
    setCaptionTextColor(preset.textColor);
    setCaptionHighlightColor(preset.highlightColor);
    setCaptionBackgroundColor(preset.bgColor || "");
    setCaptionFontFamily(normalizeCaptionFont(preset.font));
    setCaptionFontSize(nextStyle === "One Word" || nextStyle === "Bold Fire" || nextStyle === "Bold Highlight Strip" ? "xlarge" : nextStyle === "Studio Clean" || nextStyle === "Karaoke Fill" || nextStyle === "Shorts Karaoke" ? "large" : "medium");

    // Seamlessly synchronize with advanced Caption Studio settings
    setStudioSettings((prev) => {
      let fontSizePx = 72;
      const presetSize = nextStyle === "One Word" || nextStyle === "Bold Fire" || nextStyle === "Bold Highlight Strip" ? "xlarge" : nextStyle === "Studio Clean" || nextStyle === "Karaoke Fill" || nextStyle === "Shorts Karaoke" ? "large" : "medium";
      if (presetSize === "medium") fontSizePx = 64;
      else if (presetSize === "large") fontSizePx = 76;
      else if (presetSize === "xlarge") fontSizePx = 92;

      let backgroundShape: "pill" | "rounded" | "square" | "none" = "none";
      let backgroundOpacity = 0.6;
      let paddingPx = 24;
      let borderRadiusPx = 24;
      let strokeWidthPx = 0;
      let shadow: "none" | "soft" | "hard" = "soft";
      let wordsPerGroup = 4;
      let emphasisMode: "color" | "scale" | "box" | "underline" | "none" = "color";

      const styleName = preset.style;
      if (styleName === "gold-pill" || styleName === "pill-bounce") {
        backgroundShape = "pill";
        backgroundOpacity = 0.85;
      } else if (styleName === "inline-bg" || styleName === "glass-blur") {
        backgroundShape = "rounded";
        backgroundOpacity = 0.6;
        borderRadiusPx = 12;
      } else if (styleName === "stacked" || styleName === "shorts-karaoke" || styleName === "bold-highlight-strip") {
        backgroundShape = "rounded";
        backgroundOpacity = 0.85;
        borderRadiusPx = 16;
      } else if (styleName === "box" || styleName === "marker-highlight") {
        backgroundShape = "square";
        backgroundOpacity = 0.9;
      }

      if (preset.bgColor) {
        if (backgroundShape === "none") {
          backgroundShape = "rounded";
          backgroundOpacity = 0.75;
          borderRadiusPx = 16;
        }
      }

      if (styleName === "bold-outline" || styleName === "shatter") {
        strokeWidthPx = 4;
        shadow = "hard";
      }

      if (styleName === "one-word") {
        wordsPerGroup = 1;
        emphasisMode = "scale";
      }

      return {
        ...prev,
        fontFamily: preset.font || "Inter, sans-serif",
        fontSizePx,
        textColor: preset.textColor || "#FFFFFF",
        activeWordColor: preset.highlightColor || "#22D3EE",
        backgroundColor: preset.bgColor || "#000000",
        backgroundOpacity: preset.bgColor ? 0.8 : backgroundOpacity,
        backgroundShape,
        paddingPx,
        borderRadiusPx,
        strokeWidthPx,
        shadow,
        wordsPerGroup,
        emphasisMode,
      };
    });
  };

  const chooseVideoTypeMode = (nextMode: Mode) => {
    if (nextMode === "creatorBackgroundReplace") {
      setJobStatus({state: "idle", message: ""});
      return;
    }
    setMode(nextMode);
    setHasUserSelected(true);
    setSelectedFile(null);
    setComparisonFiles([]);
    setPromoThumbnailFile(null);
    setPromoTitle("");
    setPromoCtaText("");
    setPromoClipMeta({});
    setCreatorBackgroundImageFile(null);
    setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
    setCustomAiPrompt("");
    setCustomAiImageFiles([]);
    setCustomAiLogoFile(null);
    setCustomAiVideoFile(null);
    setCustomAiAudioFile(null);
    setCustomAiVideoMeta({});
    setCustomAiAudioMeta({});
    setTopicTitle("");
    setJobStatus({state: "idle", message: ""});
    const nextVideoType = nextMode === "autoCaption" ? "auto-caption-generator" : nextMode === "autoDraw" ? "auto-draw-explainer" : nextMode === "longVideoPromo" ? "long-video-promo" : nextMode === "whiteboardVideo" ? "whiteboard-video" : nextMode === "typographyVideo" ? "typography-video" : nextMode === "multiImagesVideo" ? "multi-images-video" : nextMode === "longVideoClips" ? "long-video-clips" : nextMode === "dynamicCreator" ? "dynamic-creator-reel" : nextMode === "customAiReel" ? "custom-ai-reel" : nextMode === "audioClean" ? "ai-audio-cleaner" : nextMode === "longVideoPro" ? "long-video-pro" : "compare-explainer";
    window.history.replaceState(null, "", `/dashboard?videoType=${nextVideoType}`);
    // Auto-scroll to upload section on mobile
    setTimeout(() => {
      document.getElementById("upload-section")?.scrollIntoView({behavior: "smooth", block: "start"});
    }, 150);
  };

  const chooseFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPromoClipMeta({});
      return;
    }
    const validation = validateFileForMode(file, mode);
    if (validation) {
      setSelectedFile(null);
      setPromoClipMeta({});
      setJobStatus({state: "error", message: validation});
      return;
    }
    setSelectedFile(file);
    setPromoClipMeta({});
    setJobStatus({state: "idle", message: ""});
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPromoClipMeta({});
    setAudioCleanAnalysis(null);
    setAudioCleanResult(null);
    setJobStatus({state: "idle", message: ""});
  };

  const toggleAudioCleanSegment = (segmentId: string) => {
    setAudioCleanAnalysis((prev) => {
      if (!prev) return prev;
      const nextSegments = prev.segments.map((seg) => {
        if (seg.id === segmentId) {
          const nextAction: 'keep' | 'cut' = seg.action === 'keep' ? 'cut' : 'keep';
          return {
            ...seg,
            action: nextAction,
            reason: nextAction === 'cut' ? (seg.reason || 'mistake') : undefined,
          };
        }
        return seg;
      });
      const cutSeconds = nextSegments
        .filter((s) => s.action === 'cut')
        .reduce((sum, s) => sum + Math.max(0, s.end - s.start), 0);
      const estimatedCleanDuration = Math.max(1, Number((prev.originalDuration - cutSeconds).toFixed(1)));
      return {
        ...prev,
        segments: nextSegments,
        estimatedCleanDuration,
        stats: {
          ...prev.stats,
          repeatedTakesCount: nextSegments.filter((s) => s.action === 'cut' && (s.reason === 'repeat' || s.reason === 'mistake')).length,
          secondsSaved: Number(cutSeconds.toFixed(1)),
        },
      };
    });
  };

  useEffect(() => {
    if (mode !== "audioClean") {
      setAudioCleanAnalysis(null);
      setAudioCleanResult(null);
      return;
    }
    if (!selectedFile || !user?.id) return;

    let isSubscribed = true;

    async function triggerAudioAnalysis() {
      if (!selectedFile || !user?.id) return;
      setIsAnalyzingAudio(true);
      setAudioCleanResult(null);
      setJobStatus({
        state: "uploading",
        message: "Uploading audio for transcription & full script analysis...",
      });

      try {
        const uploadContentType = getUploadContentType(selectedFile);
        const presignResponse = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType: uploadContentType,
            fileSize: selectedFile.size,
            mode: "audioClean",
            userId: user.id,
          }),
        });
        const presign = await readJsonPayload(presignResponse);
        if (!presignResponse.ok || !presign.ok) {
          throw new Error(presign.error || "Could not prepare audio upload.");
        }

        const uploadResponse = await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": uploadContentType },
          body: selectedFile,
        });
        if (!uploadResponse.ok) {
          throw new Error("Audio upload failed.");
        }

        if (!isSubscribed) return;

        setJobStatus({
          state: "starting",
          message: "Transcribing full script & detecting repeated sentences, mistakes, and silences...",
        });

        const analyzeResponse = await fetch("/api/audio-clean/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaKey: presign.key,
            userId: user.id,
            audioCleanOptions,
          }),
        });
        const analyzeData = await readJsonPayload(analyzeResponse);
        if (!analyzeResponse.ok || !analyzeData.ok) {
          throw new Error(analyzeData.error || "Audio transcription & analysis failed.");
        }

        if (!isSubscribed) return;

        setAudioCleanAnalysis(analyzeData);
        setJobStatus({ state: "idle", message: "" });
      } catch (err) {
        if (!isSubscribed) return;
        console.error("Audio clean analysis error:", err);
        setJobStatus({
          state: "error",
          message: err instanceof Error ? err.message : "Audio transcription failed.",
        });
      } finally {
        if (isSubscribed) {
          setIsAnalyzingAudio(false);
        }
      }
    }

    triggerAudioAnalysis();

    return () => {
      isSubscribed = false;
    };
  }, [mode, selectedFile, user?.id]);

  const handleReanalyzeWithScript = async (pastedScript: string) => {
    if (!selectedFile || !user?.id) return;
    setIsAnalyzingAudio(true);
    try {
      let mediaKey = audioCleanAnalysis?.mediaKey;
      if (!mediaKey) {
        const uploadContentType = getUploadContentType(selectedFile);
        const presignResponse = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType: uploadContentType,
            fileSize: selectedFile.size,
            mode: "audioClean",
            userId: user.id,
          }),
        });
        const presign = await readJsonPayload(presignResponse);
        if (!presignResponse.ok || !presign.ok) {
          throw new Error(presign.error || "Could not prepare audio upload.");
        }
        const uploadResponse = await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": uploadContentType },
          body: selectedFile,
        });
        if (!uploadResponse.ok) {
          throw new Error("Audio upload failed.");
        }
        mediaKey = presign.key;
      }

      const analyzeResponse = await fetch("/api/audio-clean/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          userId: user.id,
          audioCleanOptions,
          pastedScript,
        }),
      });
      const analyzeData = await readJsonPayload(analyzeResponse);
      if (!analyzeResponse.ok || !analyzeData.ok) {
        throw new Error(analyzeData.error || "Audio transcription & analysis failed.");
      }
      setAudioCleanAnalysis(analyzeData);
    } catch (err) {
      console.error("Audio alignment error:", err);
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  useEffect(() => {
    if (mode !== "longVideoPromo" || !selectedFile || !selectedFile.type.startsWith("video/")) {
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    const onLoadedMetadata = () => {
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      const rawDurationSeconds = Number.isFinite(video.duration) ? video.duration : undefined;

      const ratio = width && height ? width / height : 16 / 9;
      const mediaAspect = ratio < 0.8 ? "portrait" : ratio > 1.35 ? "landscape" : "1:1";
      const durationSeconds = rawDurationSeconds ? Math.max(8, Math.min(60, rawDurationSeconds)) : undefined;
      setPromoClipMeta({durationSeconds, mediaAspect});
      setJobStatus({state: "idle", message: ""});
      URL.revokeObjectURL(url);
    };

    const onError = () => {
      setPromoClipMeta({});
      URL.revokeObjectURL(url);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onError);
      URL.revokeObjectURL(url);
    };
  }, [mode, selectedFile]);

  const removeCreatorBackgroundImage = () => {
    setCreatorBackgroundImageFile(null);
    setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
    setJobStatus({state: "idle", message: ""});
  };

  const removePromoThumbnail = () => {
    setPromoThumbnailFile(null);
    setJobStatus({state: "idle", message: ""});
  };

  const addCustomAiImages = (files: FileList | null) => {
    const nextFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/")).slice(0, 8);
    if (!nextFiles.length) {
      setJobStatus({state: "error", message: "Please upload JPG, PNG, or WEBP images for Custom AI Reel."});
      return;
    }
    setCustomAiImageFiles((current) => [...current, ...nextFiles].slice(0, 8));
    setJobStatus({state: "idle", message: ""});
  };

  const removeCustomAiImage = (indexToRemove: number) => {
    setCustomAiImageFiles((current) => current.filter((_, index) => index !== indexToRemove));
    setJobStatus({state: "idle", message: ""});
  };

  const chooseCustomAiLogo = (file: File | null) => {
    if (file && !file.type.startsWith("image/")) {
      setJobStatus({state: "error", message: "Logo must be a JPG, PNG, or WEBP image."});
      return;
    }
    setCustomAiLogoFile(file);
    setJobStatus({state: "idle", message: ""});
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-bold text-muted-foreground">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) return null;

  const requestDeleteRender = (render: RecentRender) => {
    if (deletingRenderId) return;
    setDeleteCandidate(render);
  };

  const deleteRender = async (render: RecentRender) => {
    if (!user || deletingRenderId) return;

    setDeletingRenderId(render.id);
    setDeleteCandidate(null);
    const nextRenders = recentRenders.filter((item) => item.id !== render.id && item.outputFile !== render.outputFile);
    setRecentRenders(nextRenders);
    saveRecentRenders(user.id, nextRenders);
    if (jobStatus.outputFile === render.outputFile) {
      setJobStatus({state: "idle", message: ""});
    }

    try {
      if (render.id !== "current-render") {
        await deleteServerRecentRender(user.id, render.id);
      }
    } catch (error) {
      console.warn("Could not delete Supabase render history:", error);
    } finally {
      setDeletingRenderId(null);
    }
  };

  return (
    <>
    {/* ── Universal Preview Editor overlay ─────────────────────────── */}
    {previewPlan && pendingRenderKeys && (
      <PreviewEditor
        plan={previewPlan}
        isRendering={jobStatus.state === "starting" || jobStatus.state === "rendering"}
        onCancel={() => {
          setPreviewPlan(null);
          setPendingRenderKeys(null);
          setJobStatus({state: "idle", message: ""});
        }}
        onConfirmRender={async (finalInputProps) => {
          if (!user || !pendingRenderKeys || !selectedFile) return;
          setPreviewPlan(null); // close overlay
          await submitFinalRender({
            mediaKey: pendingRenderKeys.mediaKey,
            fileName: selectedFile.name,
            contentType: getUploadContentType(selectedFile),
            userId: user.id,
            comparisonImageKeys: pendingRenderKeys.comparisonImageKeys,
            promoThumbnailKey: pendingRenderKeys.promoThumbnailKey,
            creatorBackgroundImageKey: pendingRenderKeys.creatorBackgroundImageKey,
            customAiImageKeys: [],
            customAiLogoKey: "",
            overrideInputProps: finalInputProps,
          });
          setPendingRenderKeys(null);
        }}
      />
    )}
    <main className="min-h-screen max-w-full overflow-hidden bg-background text-foreground flex flex-col md:flex-row pt-16 mt-16 md:mt-0">
      
      {/* ── Dashboard Sidebar ── */}
      <aside className="w-full md:w-64 shrink-0 border-r border-border bg-card flex flex-col pt-6 z-10 sticky top-16 md:top-0 h-auto md:h-screen md:overflow-y-auto">
        <div className="px-6 pb-6 border-b border-border mb-4 hidden md:block">
          <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <nav className="flex md:flex-col gap-1 px-3 pb-4 overflow-x-auto md:overflow-x-visible no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("video-types")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal ${activeTab === "video-types" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
          >
            <LayoutGrid size={18} />
            Video Types
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("credits")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal ${activeTab === "credits" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
          >
            <CreditCard size={18} />
            Credits & Plans
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal ${activeTab === "projects" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
          >
            <FolderOpen size={18} />
            Projects
            {recentRenders.length > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === "projects" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {recentRenders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal ${activeTab === "profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
          >
            <User size={18} />
            Profile
          </button>
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-x-hidden md:overflow-y-auto h-auto md:h-screen p-4 sm:p-6 md:p-8 pb-32">
        <div className="mx-auto w-full max-w-5xl space-y-6">

        {activeTab === "video-types" && (
          <div className="space-y-6 animate-in fade-in duration-300">
        {/* M3 Dashboard Quick Action & Credits Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/90 p-3 sm:p-3.5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">AI Video Engine Active</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                document.getElementById("ai-quick-start")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-3.5 text-xs font-black text-white shadow-xs transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Create Video</span>
            </button>

            {billingEntitlement?.active ? (() => {
              const total = Math.round(billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || 0);
              const remaining = Math.round(billingEntitlement?.usage?.remaining ?? total);
              return (
                <Link
                  href="/pricing"
                  className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-extrabold text-amber-600 dark:text-amber-400 shadow-xs backdrop-blur-md transition hover:bg-amber-500/20"
                  title="View credit details & upgrade"
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span>⚡ <strong className="text-foreground font-black text-xs">{remaining}</strong> / {total} Credits</span>
                </Link>
              );
            })() : null}

            <Link
              href="/pricing"
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-full bg-secondary/80 border border-border/70 hover:bg-secondary px-3.5 text-xs font-bold text-foreground transition"
            >
              <Sparkles size={13} className="text-blue-500" />
              <span>Upgrade</span>
            </Link>
          </div>
        </div>

        {/* Live Active Render Progress Widget */}
        {renderInProgress && (
          <section className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Loader2 size={20} className="animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Creating Your AI Video...</h3>
                  <p className="text-xs text-muted-foreground">{jobStatus.message || "Processing speech alignment & Remotion cloud render"}</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                {jobStatus.progress ? `${Math.round(jobStatus.progress)}%` : "Rendering"}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blue-950/20">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${jobStatus.progress || 35}%` }}
              />
            </div>
          </section>
        )}

        {isFreeSignupCredit && (
          <section className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-pink-500/30 bg-pink-500/10 text-pink-300">
                  <Gift size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">Your free Auto Caption trial is ready</p>
                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">One video up to 60 seconds with a fixed Itnavideo watermark. Other video types need credits.</p>
                </div>
              </div>
              {paidLimitComplete ? (
                <Link
                  href="/pricing"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-pink-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-pink-500"
                >
                  Buy More Credits
                </Link>
              ) : null}
            </div>
          </section>
        )}

        {isCaptionOnlyModeBlocked && (
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 shadow-xs">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  <Sparkles size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">Active Credit Pack</p>
                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">All video styles, 1080p HD, zero watermark.</p>
                </div>
              </div>
              <Link href="/pricing" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 px-3 py-2 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500/10">
                Top Up Credits
              </Link>
            </div>
          </section>
        )}

        {/* Low credits warning */}
        {billingEntitlement?.active && typeof paidRemaining === "number" && paidRemaining <= 5 && paidRemaining > 0 ? (
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-300">Running low on credits</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">You have {paidRemaining} credit{paidRemaining === 1 ? "" : "s"} left. Plans start at $29/mo.</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 transition"
            >
              Top Up Credits →
            </Link>
          </section>
        ) : null}

        {/* ── Main Studio Workflow Container & M3 Catalog ── */}
        <section id="studio-workflows" className="w-full scroll-mt-24 pt-2">
          {hasUserSelected && (
            <div className={`mb-6 inline-flex items-center gap-3 rounded-2xl border ${activeMode.border} ${activeMode.surface} px-4 py-2.5 text-sm font-bold ${activeMode.color} shadow-xs backdrop-blur-md`}>
              <ActiveModeIcon size={18} />
              <span className="min-w-0 font-extrabold">{activeMode.label}</span>
              <button
                className="ml-3 rounded-full bg-foreground/10 hover:bg-foreground/20 px-3 py-1 text-xs font-bold text-foreground transition-colors cursor-pointer"
                onClick={() => { setHasUserSelected(false); }}
                type="button"
              >
                Change Video Type
              </button>
            </div>
          )}

          <MaterialCatalogGrid
            cards={videoTypeCards}
            selectedMode={mode}
            hasUserSelected={hasUserSelected}
            activeFilter={activeCategoryFilter}
            onFilterChange={setActiveCategoryFilter}
            onSelectMode={chooseVideoTypeMode}
            onPreviewVideoType={setPreviewVideoTypeId}
            recentRendersCount={recentRenders.length}
          />

          {/* Active Workflow Configuration Container */}
          {hasUserSelected && (
            <div className="mt-8 space-y-6 border-t border-border pt-6">

              <div className={`min-w-0 rounded-xl border ${activeMode.border} ${activeMode.surface} p-3.5 flex flex-wrap items-center gap-3`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${activeMode.border} bg-black/30 ${activeMode.color}`}>
                  <ActiveModeIcon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold tracking-tight text-white truncate">{activeMode.title}</p>
                  <p className="text-[11px] leading-4 text-muted-foreground truncate mt-0.5">{activeMode.bestResult}</p>
                </div>
                <div className="ml-auto shrink-0 flex flex-col items-end gap-1">
                  <div className="rounded-md border border-brand-mint/25 bg-brand-mint/10 px-2 py-0.5 text-[10px] font-bold text-brand-mint">
                    {plannedCreditLabel}
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground">{plannedCreditDetail}</span>
                </div>
              </div>

              {mode === "customAiReel" ? (
                <div id="upload-section" className="scroll-mt-20 space-y-4">
                  <div className="min-w-0 overflow-hidden rounded-xl border border-sky-300/20 bg-sky-300/[0.065] p-3 sm:p-4">
                    <label className="grid gap-2" htmlFor="custom-ai-prompt">
                      <span className="text-sm font-black text-white">What do you want in your video?</span>
                      <textarea
                        className="min-h-52 w-full resize-y rounded-xl border border-border bg-black/35 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-300/60"
                        id="custom-ai-prompt"
                        maxLength={1200}
                        onChange={(event) => {
                          setCustomAiPrompt(event.target.value);
                          setJobStatus({state: "idle", message: ""});
                        }}
                        placeholder={'Example:\nCreate a 45-second reel. Start with big bold text: "Create Better Videos Faster".\nFrom 5 to 15 seconds, show my video clip.\nFrom 20 to 35 seconds, show my website screenshot.\nAt the end, show my logo and website: itnavideo.com.'}
                        value={customAiPrompt}
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold leading-5 text-muted-foreground">Describe your video in English. Mention timings, clips, images, and logo.</p>
                      <span className="text-[11px] font-bold text-muted-foreground">{customAiPrompt.length}/1200</span>
                    </div>
                  </div>

                  {/* Upload grid: images, video, audio, logo */}
                  <div className="grid min-w-0 grid-cols-1 gap-3 min-[430px]:grid-cols-2">
                    <label className="upload-zone flex min-h-28 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                      <input
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        multiple
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          addCustomAiImages(event.target.files);
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <ImagePlus size={20} className="mb-1.5 text-sky-200" />
                      <span className="text-center text-xs font-black text-white">Images / Screenshots</span>
                      <span className="mt-0.5 text-center text-[10px] font-bold text-muted-foreground">Up to 8 images</span>
                    </label>

                    <label className="upload-zone flex min-h-28 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                      <input
                        accept="video/mp4,video/mov,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0] || null;
                          if (!file) return;
                          if (!file.type.startsWith("video/")) {
                            setJobStatus({state: "error", message: "Video clip must be MP4, MOV, or WEBM."});
                            event.currentTarget.value = "";
                            return;
                          }
                          setCustomAiVideoFile(file);
                          setCustomAiVideoMeta({});
                          setJobStatus({state: "idle", message: ""});
                          // Read duration
                          const url = URL.createObjectURL(file);
                          const vid = document.createElement("video");
                          vid.preload = "metadata";
                          vid.src = url;
                          vid.onloadedmetadata = () => {
                            setCustomAiVideoMeta({durationSeconds: Number.isFinite(vid.duration) ? Math.min(60, vid.duration) : undefined});
                            URL.revokeObjectURL(url);
                          };
                          vid.onerror = () => URL.revokeObjectURL(url);
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <Film size={20} className="mb-1.5 text-sky-200" />
                      <span className="max-w-full truncate text-center text-xs font-black text-white">{customAiVideoFile ? customAiVideoFile.name : "Video clip"}</span>
                      <span className="mt-0.5 text-center text-[10px] font-bold text-muted-foreground">{customAiVideoFile ? `${customAiVideoMeta.durationSeconds ? `${Math.round(customAiVideoMeta.durationSeconds)}s` : "loaded"}` : "Optional MP4/MOV"}</span>
                    </label>

                    <label className="upload-zone flex min-h-28 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                      <input
                        accept="audio/mpeg,audio/mp3,audio/wav,audio/aac,audio/m4a,audio/ogg,audio/*"
                        className="hidden"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0] || null;
                          if (!file) return;
                          if (!file.type.startsWith("audio/")) {
                            setJobStatus({state: "error", message: "Audio must be MP3, WAV, M4A, or AAC."});
                            event.currentTarget.value = "";
                            return;
                          }
                          setCustomAiAudioFile(file);
                          setCustomAiAudioMeta({});
                          setJobStatus({state: "idle", message: ""});
                          // Read duration via Audio element
                          const url = URL.createObjectURL(file);
                          const aud = document.createElement("audio");
                          aud.preload = "metadata";
                          aud.src = url;
                          aud.onloadedmetadata = () => {
                            setCustomAiAudioMeta({durationSeconds: Number.isFinite(aud.duration) ? Math.min(60, aud.duration) : undefined});
                            URL.revokeObjectURL(url);
                          };
                          aud.onerror = () => URL.revokeObjectURL(url);
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <Mic size={20} className="mb-1.5 text-sky-200" />
                      <span className="max-w-full truncate text-center text-xs font-black text-white">{customAiAudioFile ? customAiAudioFile.name : "Voiceover / audio"}</span>
                      <span className="mt-0.5 text-center text-[10px] font-bold text-muted-foreground">{customAiAudioFile ? `${customAiAudioMeta.durationSeconds ? `${Math.round(customAiAudioMeta.durationSeconds)}s` : "loaded"}` : "Optional MP3/WAV"}</span>
                    </label>

                    <label className="upload-zone flex min-h-28 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                      <input
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          chooseCustomAiLogo(event.target.files?.[0] || null);
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <BadgeCheck size={20} className="mb-1.5 text-sky-200" />
                      <span className="text-center text-xs font-black text-white">{customAiLogoFile ? "Change logo" : "Logo"}</span>
                      <span className="mt-0.5 max-w-full truncate text-center text-[10px] font-bold text-muted-foreground">{customAiLogoFile ? customAiLogoFile.name.slice(0, 18) : "Optional end screen"}</span>
                    </label>
                  </div>

                  {/* Uploaded media list */}
                  {(customAiImageFiles.length || customAiLogoFile || customAiVideoFile || customAiAudioFile) ? (
                    <div className="grid min-w-0 gap-2 rounded-xl border border-border bg-black/25 p-3">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Uploaded media</p>
                      <div className="grid min-w-0 grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:grid-cols-3">
                        {customAiVideoFile ? (
                          <UploadMiniCard file={customAiVideoFile} label="Video clip" onRemove={() => { setCustomAiVideoFile(null); setCustomAiVideoMeta({}); }} />
                        ) : null}
                        {customAiAudioFile ? (
                          <UploadMiniCard file={customAiAudioFile} label="Voiceover" onRemove={() => { setCustomAiAudioFile(null); setCustomAiAudioMeta({}); }} />
                        ) : null}
                        {customAiImageFiles.map((file, index) => (
                          <UploadMiniCard file={file} key={`${file.name}-${index}`} label={`Image ${index + 1}`} onRemove={() => removeCustomAiImage(index)} />
                        ))}
                        {customAiLogoFile ? (
                          <UploadMiniCard file={customAiLogoFile} label="Logo" onRemove={() => chooseCustomAiLogo(null)} />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : mode === "audioClean" ? null : (
              <div id="upload-section" className="scroll-mt-20">
              {mode === "facelessVideo" || mode === "aiVideoGenerator" ? (
                <div className="mb-3.5 flex items-start gap-3 rounded-xl border border-sky-500/25 bg-sky-950/30 p-3.5 text-xs text-slate-300">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-sky-400" />
                  <div className="flex-1 leading-relaxed">
                    <span className="font-bold text-white">Voiceover clean karna hai?</span> Agar aapki recording me retakes, background shor ya long silences hain, to video generate karne se pehle hamare{' '}
                    <Link href="/dashboard?videoType=ai-audio-cleaner" className="font-bold text-sky-400 underline hover:text-sky-300">
                      AI Audio Cleaner
                    </Link>{' '}
                    se ek click me audio clean karein.
                  </div>
                </div>
              ) : null}
              <label
                className="upload-zone flex min-h-40 min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden sm:min-h-64"
              >
                <input
                  accept={activeMode.accept}
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    chooseFile(event.target.files?.[0] || null);
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Upload size={28} style={{ color: 'var(--color-primary-hover)' }} />
                </div>
                <p className="max-w-full px-2 text-center text-sm font-medium leading-5 text-white">{selectedFile ? "Change selected file" : activeMode.uploadCta || 'Click to upload or drag & drop'}</p>
                <p className="mt-2 max-w-full px-2 text-center text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{activeMode.supported}{mode === "facelessVideo" || mode === "aiVideoGenerator" ? "" : " • Max 1 minute"}</p>
              </label>
              {selectedFile ? (
                <div className="mt-3 w-full min-w-0 overflow-hidden rounded-lg border border-border bg-black/35 p-3 text-left sm:p-4">
                  <div className="grid min-w-0 gap-3 sm:flex sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{selectedFile.name}</p>
                      <p className="mt-1 break-words text-xs font-medium leading-5 text-muted-foreground">{fileMeta}</p>
                    </div>
                    <button
                      className="inline-flex w-full items-center justify-center rounded-md border border-red-400/25 bg-red-500/10 px-3 py-2 text-[11px] font-bold text-red-100 transition hover:bg-red-500 hover:text-foreground sm:w-auto sm:shrink-0"
                      onClick={removeSelectedFile}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <SelectedMediaPreview file={selectedFile} mode={mode} />
                </div>
              ) : null}

              {/* Multi-Language Selector: Audio Spoken & Caption Language */}
              {(mode === "autoCaption" ||
                mode === "typographyVideo" ||
                mode === "facelessVideo" ||
                mode === "aiVideoGenerator" ||
                mode === "longVideoClips") ? (
                <div className="mt-4 rounded-2xl border border-border bg-card/70 p-4 sm:p-5 shadow-xs">
                  <div className="mb-3.5 flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-foreground">
                        Language & Subtitles
                      </span>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Select audio speech language and caption output language
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      Multi-Language
                    </span>
                  </div>
                  <DualLanguageSelector
                    spokenLanguage={spokenLanguage}
                    captionLanguage={captionLanguage}
                    onSpokenLanguageChange={setSpokenLanguage}
                    onCaptionLanguageChange={setCaptionLanguage}
                  />
                </div>
              ) : null}
              </div>
              )}

              {mode === "compare" ? (
                <>
                {/* Live preview — sticky like the CapCut editor so it stays visible while you scroll controls */}
                <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#141020]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                  <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-amber-200">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                    Live preview
                  </div>
                  <ComparePreview
                    files={comparisonFiles}
                    leftTitle={compareLeftTitle}
                    rightTitle={compareRightTitle}
                    handle={compareHandle}
                    themeId={compareTheme}
                    tone={compareTone}
                    winner={compareWinner}
                    stickerStyle={stickerStyle}
                    imageStyle={compareImageStyle}
                  />
                </div>
                <CompareImageSlots
                  files={comparisonFiles}
                  onChange={(files) => {
                    setComparisonFiles(files);
                    setJobStatus({state: "idle", message: ""});
                  }}
                  onError={(message) => setJobStatus({state: "error", message})}
                />
                </>
              ) : null}

              {mode === "multiImagesVideo" ? (
                <>
                {/* Live preview — sticky like the CapCut editor so it stays visible while you scroll controls */}
                <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#141020]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                  <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-pink-200">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-pink-300" />
                    Live preview
                  </div>
                  <MultiImagesPreview clipFile={selectedFile} imageFiles={comparisonFiles} title={promoTitle} />
                </div>
                <div className="rounded-xl border border-pink-400/20 bg-pink-400/[0.05] p-4 space-y-3">
                  <div>
                    <p className="text-sm font-black text-white">Upload Story & B-Roll Images (Up to 20)</p>
                    <p className="mt-1 text-xs text-muted-foreground">AI will analyze your script keywords and place each image at the exact right moment during narration!</p>
                  </div>

                  {comparisonFiles.length === 0 ? (
                    <label className="upload-zone mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center px-3 border-dashed border-pink-400/20 hover:border-pink-400/40 bg-pink-400/[0.02]">
                      <input
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        multiple
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const files = Array.from(event.target.files || []).filter(f => f.type.startsWith("image/"));
                          if (!files.length) { setJobStatus({state: "error", message: "Please upload JPG, PNG, or WEBP images."}); return; }
                          setComparisonFiles(prev => [...prev, ...files].slice(0, 20));
                          setJobStatus({state: "idle", message: ""});
                          event.currentTarget.value = "";
                        }}
                        type="file"
                      />
                      <ImagePlus size={22} className="mb-2 text-pink-300 animate-pulse" />
                      <span className="text-xs font-black text-white">Upload Story Images</span>
                      <span className="mt-1 text-[10px] text-muted-foreground">Supports JPG, PNG, WEBP • Select multiple files</span>
                    </label>
                  ) : (
                    <>
                      {/* Premium Summary & Add Action Header */}
                      <div className="flex items-center justify-between rounded-lg bg-pink-400/[0.04] border border-pink-400/10 p-2.5">
                        <span className="text-xs font-bold text-pink-200">
                          📸 {comparisonFiles.length} of 20 images selected
                        </span>
                        {comparisonFiles.length < 20 && (
                          <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-pink-500 hover:bg-pink-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition shadow-md">
                            <input
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="hidden"
                              multiple
                              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const files = Array.from(event.target.files || []).filter(f => f.type.startsWith("image/"));
                                setComparisonFiles(prev => [...prev, ...files].slice(0, 20));
                                setJobStatus({state: "idle", message: ""});
                                event.currentTarget.value = "";
                              }}
                              type="file"
                            />
                            <span>+ Add Image</span>
                          </label>
                        )}
                      </div>

                      {/* Images grid */}
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {comparisonFiles.map((file, i) => (
                          <div key={`${file.name}-${i}`} className="relative overflow-hidden rounded-lg border border-border bg-black">
                            <div className="relative aspect-video">
                              <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                              <span className="absolute left-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-md bg-pink-500 px-1 text-[10px] font-black text-white">{i + 1}</span>
                              <button type="button" onClick={() => setComparisonFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">×</button>
                            </div>
                            <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                              <button
                                type="button"
                                disabled={i === 0}
                                onClick={() => setComparisonFiles(prev => { const n = [...prev]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}
                                className="flex-1 rounded bg-card/8 py-1 text-[11px] font-black text-white transition hover:bg-card/16 disabled:opacity-30"
                                aria-label="Move image earlier"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={i === comparisonFiles.length - 1}
                                onClick={() => setComparisonFiles(prev => { const n = [...prev]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n; })}
                                className="flex-1 rounded bg-card/8 py-1 text-[11px] font-black text-white transition hover:bg-card/16 disabled:opacity-30"
                                aria-label="Move image later"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Interactive Plus Card inside Grid */}
                        {comparisonFiles.length < 20 && (
                          <label className="flex aspect-[16/11.5] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-pink-400/20 bg-pink-400/[0.02] hover:border-pink-400/40 hover:bg-pink-400/[0.04] transition">
                            <input
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="hidden"
                              multiple
                              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const files = Array.from(event.target.files || []).filter(f => f.type.startsWith("image/"));
                                setComparisonFiles(prev => [...prev, ...files].slice(0, 20));
                                setJobStatus({state: "idle", message: ""});
                                event.currentTarget.value = "";
                              }}
                              type="file"
                            />
                            <ImagePlus size={18} className="text-primary" />
                            <span className="mt-1 text-[10px] font-bold text-pink-200">+ Add Image</span>
                          </label>
                        )}
                      </div>
                    </>
                  )}
                </div>
                </>
              ) : null}

              {mode === "compare" ? (
                  <>
                  <CompareTextFields
                    leftTitle={compareLeftTitle}
                    rightTitle={compareRightTitle}
                    handle={compareHandle}
                    onLeftTitleChange={setCompareLeftTitle}
                    onRightTitleChange={setCompareRightTitle}
                    onHandleChange={setCompareHandle}
                  />

                {/* Style controls: theme + tone + winner */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Compare style</p>

                  <p className="mt-3 mb-1.5 text-[11px] font-bold text-muted-foreground">Theme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light", label: "Light" },
                      { id: "dark", label: "Dark" },
                      { id: "bold", label: "Bold" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCompareTheme(t.id)}
                        aria-pressed={compareTheme === t.id}
                        className={`rounded-lg border px-3 py-2 text-xs font-black transition ${compareTheme === t.id ? "border-amber-500 bg-amber-500/15 text-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-accent"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 mb-1.5 text-[11px] font-bold text-muted-foreground">Comparison tone</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "versus", label: "A vs B (neutral)" },
                      { id: "goodBad", label: "Good vs Bad" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCompareTone(t.id)}
                        aria-pressed={compareTone === t.id}
                        className={`rounded-lg border px-3 py-2 text-xs font-black transition ${compareTone === t.id ? "border-amber-500 bg-amber-500/15 text-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-accent"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 mb-1.5 text-[11px] font-bold text-muted-foreground">Winner (shown on closing card)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "none", label: "No winner" },
                      { id: "left", label: "Left (A)" },
                      { id: "right", label: "Right (B)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCompareWinner(t.id)}
                        aria-pressed={compareWinner === t.id}
                        className={`rounded-lg border px-3 py-2 text-xs font-black transition ${compareWinner === t.id ? "border-amber-500 bg-amber-500/15 text-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-accent"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 mb-1.5 text-[11px] font-bold text-muted-foreground">Image frame style</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: "rounded", label: "Rounded" },
                      { id: "circle", label: "Circle" },
                      { id: "phone", label: "Phone" },
                      { id: "tilted", label: "3D Tilt" },
                      { id: "polaroid", label: "Polaroid" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCompareImageStyle(t.id)}
                        aria-pressed={compareImageStyle === t.id}
                        className={`rounded-lg border px-2 py-2 text-[10px] font-black transition ${compareImageStyle === t.id ? "border-amber-500 bg-amber-500/15 text-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-accent"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <StickerStylePicker value={stickerStyle} onChange={setStickerStyle} />
                  </>
              ) : null}

              {mode === "typographyVideo" ? (
                <>
                  {/* Live preview — sticky like the CapCut editor so it stays visible while you scroll controls */}
                  <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#141020]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                    <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-purple-200">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                      Live preview
                    </div>
                    <TypographyPreview
                      typographyStyle={typographyStyle}
                      captionStyle={captionStyle}
                      captionPosition={captionPosition}
                      showCaptions={false}
                      videoUrl={livePreviewVideoUrl}
                    />
                  </div>

                  <TypographyStylePicker value={typographyStyle} onChange={setTypographyStyle} />
                </>
              ) : null}

              {mode === "creatorBackgroundReplace" ? (
                <div className="min-w-0 overflow-hidden rounded-lg border border-orange-300/20 bg-orange-300/[0.06] p-3 sm:p-4">
                  <p className="text-sm font-black text-white">Background image</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                    Upload one image. We auto-fit it first, then you can adjust background and creator placement.
                  </p>

                  <label className="upload-zone mt-4 flex min-h-28 min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0] || null;
                        if (file && !file.type.startsWith("image/")) {
                          setJobStatus({state: "error", message: "Background must be PNG, JPG, or WEBP."});
                          event.currentTarget.value = "";
                          return;
                        }
                        setCreatorBackgroundImageFile(file);
                        setJobStatus({state: "idle", message: ""});
                        event.currentTarget.value = "";
                      }}
                      type="file"
                    />
                    <Upload size={18} className="mb-2 text-orange-200" />
                    <span className="max-w-full text-center text-sm font-black leading-5 text-white">
                      {creatorBackgroundImageFile ? "Change background image" : "Upload background image"}
                    </span>
                    {creatorBackgroundImageFile ? (
                      <span className="mt-2 max-w-full truncate text-xs font-bold text-muted-foreground">{creatorBackgroundImageFile.name}</span>
                    ) : (
                      <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP</span>
                    )}
                  </label>

                  {selectedFile && creatorBackgroundImageFile ? (
                    <CreatorBackgroundLivePreview
                      backgroundFile={creatorBackgroundImageFile}
                      creatorFile={selectedFile}
                      settings={creatorBackgroundSettings}
                    />
                  ) : null}

                  {creatorBackgroundImageFile ? (
                    <div className="mt-3 grid min-w-0 max-w-full gap-3 overflow-hidden rounded-md border border-orange-300/20 bg-black/25 px-3 py-2 sm:flex sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-white">{creatorBackgroundImageFile.name}</p>
                        <p className="mt-0.5 text-[10px] font-bold text-muted-foreground">{formatBytes(creatorBackgroundImageFile.size)}</p>
                      </div>
                      <button
                        className="inline-flex w-full items-center justify-center rounded-md border border-red-400/25 bg-red-500/10 px-2.5 py-2 text-[11px] font-black text-red-100 transition hover:bg-red-500 hover:text-foreground sm:w-auto sm:shrink-0"
                        onClick={removeCreatorBackgroundImage}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}

                  {creatorBackgroundImageFile ? (
                    <div className="mt-4 grid min-w-0 gap-4 overflow-hidden">
                      <div className="grid min-w-0 gap-2">
                        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                          <p className="min-w-0 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Background</p>
                          <div className="inline-flex max-w-full shrink-0 overflow-hidden rounded-lg border border-border bg-black/20">
                            {(["cover", "contain"] as const).map((fit) => (
                              <button
                                key={fit}
                                className={`px-2.5 py-1.5 text-[11px] font-black uppercase sm:px-3 ${creatorBackgroundSettings.backgroundFit === fit ? "bg-orange-300 text-foreground" : "text-primary"}`}
                                onClick={() => setCreatorBackgroundSettings((current) => ({...current, backgroundFit: fit}))}
                                type="button"
                              >
                                {fit}
                              </button>
                            ))}
                          </div>
                        </div>
                        <RangeControl label="Zoom" max={1.8} min={0.8} step={0.01} value={creatorBackgroundSettings.backgroundScale} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, backgroundScale: value}))} />
                        <RangeControl label="Position X" max={100} min={-100} step={1} value={creatorBackgroundSettings.backgroundX} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, backgroundX: value}))} />
                        <RangeControl label="Position Y" max={100} min={-100} step={1} value={creatorBackgroundSettings.backgroundY} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, backgroundY: value}))} />
                      </div>

                      <div className="grid min-w-0 gap-2 border-t border-border pt-4">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Creator</p>
                        <RangeControl label="Scale" max={1.6} min={0.55} step={0.01} value={creatorBackgroundSettings.creatorScale} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorScale: value}))} />
                        <RangeControl label="Position X" max={160} min={-160} step={1} value={creatorBackgroundSettings.creatorX} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorX: value}))} />
                        <RangeControl label="Position Y" max={220} min={-220} step={1} value={creatorBackgroundSettings.creatorY} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorY: value}))} />
                      </div>

                      <button
                        className="w-full rounded-lg border border-border px-3 py-2 text-xs font-black text-zinc-300 transition hover:bg-card/10 sm:w-fit"
                        onClick={() => setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS)}
                        type="button"
                      >
                        Reset adjustments
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {mode === "multiImagesVideo" ? (
                <div className="rounded-xl border border-pink-400/20 bg-pink-400/[0.05] p-4">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-wider text-pink-300">Video Title</span>
                    <input
                      type="text"
                      maxLength={80}
                      value={promoTitle}
                      onChange={(e) => { setPromoTitle(e.target.value); setJobStatus({state: "idle", message: ""}); }}
                      placeholder="Breaking: Major discovery announced today"
                      className="mt-2 block w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-pink-400/50 focus:outline-none"
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-[10px] text-muted-foreground">Max 2 lines, short and impactful</span>
                      <span className="text-[10px] text-muted-foreground">{promoTitle.length}/80</span>
                    </div>
                  </label>
                </div>
              ) : null}

              {mode === "longVideoPromo" ? (
                <>
                {/* Live preview — sticky like the CapCut editor so it stays visible while you scroll controls */}
                <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#141020]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                  <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    Live preview
                  </div>
                  <LongVideoPromoPreview
                    thumbnailFile={promoThumbnailFile}
                    clipFile={selectedFile}
                    title={promoTitle}
                    ctaText={promoCtaText}
                    mediaAspect={promoClipMeta.mediaAspect}
                  />
                </div>
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <p className="text-sm font-black text-white">Promo details</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                    Upload a promo clip above, then add the thumbnail and title.
                  </p>

                  <label className="upload-zone mt-4 flex min-h-28 min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden px-3">
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0] || null;
                        if (file && !file.type.startsWith("image/")) {
                          setJobStatus({state: "error", message: "Thumbnail must be PNG, JPG, or WebP."});
                          event.currentTarget.value = "";
                          return;
                        }
                        setPromoThumbnailFile(file);
                        setJobStatus({state: "idle", message: ""});
                        event.currentTarget.value = "";
                      }}
                      type="file"
                    />
                    <Upload size={18} className="mb-2 text-emerald-300" />
                    <span className="max-w-full text-center text-sm font-black leading-5 text-white">
                      {promoThumbnailFile ? "Change thumbnail" : "Upload thumbnail"}
                    </span>
                    {promoThumbnailFile ? (
                      <span className="mt-2 max-w-full truncate text-xs font-bold text-muted-foreground">{promoThumbnailFile.name}</span>
                    ) : (
                      <span className="mt-1 text-xs text-muted-foreground">Recommended: 1280×720 or similar</span>
                    )}
                  </label>

                  {promoThumbnailFile ? (
                    <div className="mt-3 grid min-w-0 gap-3 sm:flex sm:items-center">
                      <div className="h-24 w-full min-w-0 overflow-hidden rounded-lg border border-emerald-400/25 bg-black sm:h-16 sm:w-28">
                        <UploadedImagePreview alt="Thumbnail preview" className="h-full w-full object-cover" file={promoThumbnailFile} />
                      </div>
                      <button className="inline-flex w-full items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-black text-zinc-300 hover:bg-card/10 hover:text-foreground sm:w-auto" onClick={removePromoThumbnail} type="button">Remove</button>
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3">
                    <label className="grid gap-1.5">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Video title</span>
                      <input
                        className="form-input"
                        maxLength={80}
                        onChange={(e) => setPromoTitle(e.target.value)}
                        placeholder="My YouTube video title"
                        type="text"
                        value={promoTitle}
                      />
                      <span className="text-right" style={{ fontSize: '11px', color: promoTitle.length >= 75 ? 'var(--color-error)' : promoTitle.length >= 65 ? 'var(--color-amber)' : 'var(--text-dark-muted)' }}>{promoTitle.length}/80</span>
                    </label>

                    <label className="grid gap-1.5">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Call-to-action <span className="normal-case text-muted-foreground">(optional)</span></span>
                      <input
                        className="form-input"
                        maxLength={40}
                        onChange={(e) => setPromoCtaText(e.target.value)}
                        placeholder="Watch the full video"
                        type="text"
                        value={promoCtaText}
                      />
                      <span className="text-[10px] text-muted-foreground">Shown on the button with an arrow pointing to the full video. Default: “Watch the full video · Link in bio”.</span>
                    </label>
                  </div>
                </div>
                </>
              ) : null}

              {/* ── Whiteboard Style ── */}
              {mode === "whiteboardVideo" ? (
                <>
                <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#0a1622]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                  <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-200">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                    Board Preview
                  </div>
                  <div className="mx-auto max-w-[280px] overflow-hidden rounded-xl border border-border">
                    <Image src="/visuals/previews/whiteboard-video-new.png" alt="Corporate Whiteboard" width={560} height={315} className="w-full object-cover" />
                  </div>
                </div>
                <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                  <p className="text-sm font-black text-white">Corporate Strategy Board</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                    AI writes your key points on a premium corporate whiteboard synced to your speech. Clean, professional look.
                  </p>
                </div>
                </>
              ) : null}

              {mode === "audioClean" ? (
                <AudioCleanStudio
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  audioCleanOptions={audioCleanOptions}
                  setAudioCleanOptions={setAudioCleanOptions}
                  audioCleanAnalysis={audioCleanAnalysis}
                  setAudioCleanAnalysis={setAudioCleanAnalysis}
                  isAnalyzingAudio={isAnalyzingAudio}
                  onReanalyzeWithScript={handleReanalyzeWithScript}
                  audioCleanResult={audioCleanResult}
                  onCleanAudio={startRenderJob}
                  isCleaning={jobStatus.state === "starting" || jobStatus.state === "rendering" || jobStatus.state === "uploading"}
                />
              ) : null}

              {mode === "autoCaption" ? (
                <div className="rounded-2xl border border-blue-500/20 bg-card p-4 sm:p-6 shadow-sm min-w-0 max-w-full overflow-hidden space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-foreground">Auto Caption Generator</p>
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">9:16 & 16:9 Ready</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                        AI transcribes your video & syncs animated captions word-by-word.
                      </p>
                    </div>
                  </div>

                  {/* 1. Style Preset Picker */}
                  <div>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] form-label-muted">
                      1. Caption Style Preset
                    </span>
                    <SubtitleStylePicker
                      value={captionStyle}
                      onChange={chooseCaptionStyle}
                      variant="shorts"
                    />
                  </div>

                  {/* 2. App-Like Position & Size Segmented Controls */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Position Segmented Pill Bar */}
                    <div>
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] form-label-muted">
                        2. Vertical Position
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/60 p-1">
                        {[
                          { id: "top", label: "Top" },
                          { id: "center", label: "Center" },
                          { id: "bottom", label: "Bottom" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => setCaptionPosition(pos.id as "top" | "center" | "bottom")}
                            className={`rounded-lg py-2 text-xs font-bold transition-all ${
                              captionPosition === pos.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Segmented Pill Bar */}
                    <div>
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] form-label-muted">
                        3. Caption Size
                      </span>
                      <div className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-muted/60 p-1">
                        {[
                          { id: "small", label: "Small" },
                          { id: "medium", label: "Medium" },
                          { id: "large", label: "Large" },
                          { id: "xlarge", label: "XL" },
                        ].map((size) => (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => setCaptionFontSize(size.id as "small" | "medium" | "large" | "xlarge")}
                            className={`rounded-lg py-2 text-xs font-bold transition-all ${
                              captionFontSize === size.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Mobile App Style Color & Backing Customizer */}
                  <div className="rounded-xl border border-border bg-muted/40 p-3.5 sm:p-4">
                    <span className="mb-3 block text-xs font-black uppercase tracking-[0.16em] form-label-muted">
                      4. Colors & Backing
                    </span>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Text Color */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground">Base Text Color</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5">
                          <input
                            type="color"
                            value={captionTextColor}
                            onChange={(e) => setCaptionTextColor(e.target.value)}
                            className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                          />
                          <span className="font-mono text-xs font-bold uppercase text-foreground">{captionTextColor}</span>
                        </div>
                      </div>

                      {/* Highlight Active Word Color */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground">Highlight Active Word</label>
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5">
                          <input
                            type="color"
                            value={captionHighlightColor}
                            onChange={(e) => setCaptionHighlightColor(e.target.value)}
                            className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                          />
                          <span className="font-mono text-xs font-bold uppercase text-foreground">{captionHighlightColor}</span>
                        </div>
                      </div>

                      {/* Background Box */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground">Background Box</label>
                        <select
                          className="form-input h-[38px] text-xs py-1"
                          value={captionBackgroundColor}
                          onChange={(e) => setCaptionBackgroundColor(e.target.value)}
                        >
                          <option value="">No Background Box</option>
                          <option value="#18181B">Dark Pill (#18181B)</option>
                          <option value="#000000">Solid Black (#000000)</option>
                          <option value="rgba(0,0,0,0.65)">Translucent Black</option>
                          <option value="#ffffff">White Box</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ── Long Video Clips controls ── */}
              {mode === "longVideoClips" ? (
                <div className="rounded-2xl border border-cyan-500/20 bg-card p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-black tracking-wide text-foreground">Clip Extraction Settings</h4>
                      <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                        Our intelligent scorer scans speech density, keywords, and hooks to harvest the most viral highlights.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-primary">
                      AI Repurposer
                    </span>
                  </div>

                  {/* 1. Number of Clips Card Selector */}
                  <div className="mt-6">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                      How many clips to extract?
                    </span>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { value: 5, label: "Top 5", desc: "Highlights Only" },
                        { value: 10, label: "Top 10", desc: "Detailed Coverage" },
                        { value: 15, label: "Top 15", desc: "Maximum Clips" },
                        { value: 0, label: "Auto Clips", desc: "AI Smart Sizing" }
                      ].map((item) => {
                        const isActive = clipCount === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setClipCount(item.value)}
                            className={`rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                              isActive
                                ? "bg-primary/10 border-primary shadow-xs scale-105"
                                : "bg-card border-border hover:bg-accent text-foreground"
                            }`}
                          >
                            <p className={`text-base font-black ${isActive ? "text-primary" : "text-foreground"}`}>{item.label}</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Segmented Duration Cards */}
                  <div className="mt-6">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                      Target Clip Duration
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: 15 as const, title: "15s", label: "Short Hook", desc: "Best for YouTube" },
                        { val: 30 as const, title: "30s", label: "Engaging Story", desc: "Best for Reels" },
                        { val: 60 as const, title: "60s", label: "Deep Clip", desc: "Best for TikTok" },
                      ].map((item) => {
                        const isActive = clipDuration === item.val;
                        return (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setClipDuration(item.val)}
                            className={`rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                              isActive
                                ? "bg-primary/10 border-primary shadow-xs"
                                : "bg-card border-border hover:bg-accent text-foreground"
                            }`}
                          >
                            <p className={`text-base font-black ${isActive ? "text-primary" : "text-foreground"}`}>{item.title}</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">{item.label}</p>
                            <p className="text-[9px] font-medium text-muted-foreground mt-0.5">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Dynamic Visual Timeline Mockup */}
                  <div className="mt-6 rounded-2xl bg-muted/30 border border-border p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Start (0:00)</span>
                      <span className="text-primary uppercase tracking-widest text-[9px] font-black">AI Segment Map Preview</span>
                      <span>End (Video)</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-muted relative overflow-hidden p-0.5 border border-border">
                      <div className="absolute inset-0 flex justify-around items-center px-4">
                        {Array.from({ length: clipCount === 0 ? 5 : clipCount }).map((_, i) => (
                          <div
                            key={i}
                            className="h-2 w-[16%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30 animate-pulse"
                            style={{ animationDelay: `${i * 120}ms`, animationDuration: "2s" }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2.5 text-center text-[10px] font-bold leading-5 text-muted-foreground">
                      {clipCount === 0 ? (
                        <span>AI will automatically analyze your video to extract the most engaging viral moments based on duration.</span>
                      ) : (
                        <span>AI is programmed to extract <span className="text-primary font-extrabold">{clipCount} distinct viral moments</span> distributed across your timeline.</span>
                      )}
                    </p>
                  </div>

                  {/* 4. Translucent Receipt Card */}
                  <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                      <span>Base Pipeline Fee</span>
                      <span className="font-bold text-foreground">2.0 credits</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 pb-1.5">
                      <span>Harvesting Fee ({clipCount === 0 ? "Auto (~5 clips)" : `${clipCount} × 1.0`})</span>
                      <span className="font-bold text-foreground">{clipCount === 0 ? "5.0" : clipCount}.0 credits</span>
                    </div>
                    <div className="flex items-center justify-between text-foreground font-black pt-3 border-t border-border">
                      <span className="text-sm text-primary">Total Render Cost</span>
                      <span className="text-base text-primary font-black">{(clipCount === 0 ? 5 : clipCount) + 2}.0 credits</span>
                    </div>
                  </div>

                  {/* 5. Animated Captions Toggle & Visual Preset Selector */}
                  <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-primary border border-cyan-500/20">
                          <Captions size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">Add Animated Captions</p>
                          <p className="text-[11px] font-medium text-muted-foreground">Transcribe speech & overlay word-synced captions on every clip</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnableClipsCaptions(!enableClipsCaptions)}
                        className={`relative h-6 w-11 rounded-full transition ${enableClipsCaptions ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${enableClipsCaptions ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    {enableClipsCaptions && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                          Select Caption Style Preset
                        </span>
                        <SubtitleStylePicker value={captionStyle} onChange={chooseCaptionStyle} />
                      </div>
                    )}
                  </div>

                  {/* 6. SFX toggle */}
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3.5 py-3">
                    <div>
                      <p className="text-xs font-bold text-foreground">Caption Sound Effects</p>
                      <p className="text-[10px] text-muted-foreground">Subtle pop sound effect on word highlights</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnableSfx(!enableSfx)}
                      className={`relative h-6 w-11 rounded-full transition ${enableSfx ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${enableSfx ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              ) : null}

              <div className={mode === "autoCaption" || mode === "creatorBackgroundReplace" || mode === "customAiReel" || mode === "longVideoPromo" || mode === "compare" || mode === "typographyVideo" || mode === "longVideoClips" || mode === "whiteboardVideo" || mode === "audioClean" || mode === "longVideoPro" || mode === "multiImagesVideo" ? "hidden" : "rounded-lg border border-border bg-card/[0.035] p-4"}>
                <label className="form-label-muted" htmlFor="reel-topic">
                  Reel topic/title
                </label>
                <input
                  className="form-input mt-3 w-full"
                  id="reel-topic"
                  maxLength={60}
                  onChange={(event) => setTopicTitle(event.target.value)}
                  placeholder={mode === "compare" ? "Example: Website vs Web App" : "Example: PAN Card apply process"}
                  type="text"
                  value={topicTitle}
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>
                    Optional. Helpful for topic-specific explainer titles.
                  </p>
                  <span style={{ fontSize: '11px', color: topicTitle.length >= 55 ? 'var(--color-error)' : topicTitle.length >= 48 ? 'var(--color-amber)' : 'var(--text-dark-muted)' }}>
                    {topicTitle.length}/60
                  </span>
                </div>
              </div>

              {mode === "facelessVideo" || mode === "aiVideoGenerator" ? (
                <div className="mt-4">
                  <FacelessVideoStyleControls
                    headingFont={longVideoHeadingFont}
                    setHeadingFont={setLongVideoHeadingFont}
                    subheadingFont={longVideoSubheadingFont}
                    setSubheadingFont={setLongVideoSubheadingFont}
                    bodyFont={longVideoBodyFont}
                    setBodyFont={setLongVideoBodyFont}
                    selectedBackgroundTheme={selectedBackgroundTheme}
                    setSelectedBackgroundTheme={setSelectedBackgroundTheme}
                    selectedBackgroundUrl={selectedBackgroundUrl}
                    setSelectedBackgroundUrl={setSelectedBackgroundUrl}
                    enableCaptions={facelessEnableCaptions}
                    setEnableCaptions={setFacelessEnableCaptions}
                  />
                </div>
              ) : mode === "longVideoPro" ? (
                <div className="mt-4">
                  <VideoStyleControls
                    headingFont={headingFont}
                    setHeadingFont={setHeadingFont}
                    typographyFont={typographyFont}
                    setTypographyFont={setTypographyFont}
                    selectedBackgroundTheme={selectedBackgroundTheme}
                    setSelectedBackgroundTheme={setSelectedBackgroundTheme}
                    selectedBackgroundUrl={selectedBackgroundUrl}
                    setSelectedBackgroundUrl={setSelectedBackgroundUrl}
                  />
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                {mode === "facelessVideo" || mode === "aiVideoGenerator" ? (
                  <>
                    <PolicyPill icon={Clock3} title="Up to 20 minutes" body="Pure 16:9 widescreen video with curated AI visuals and synced captions." />
                    <PolicyPill icon={Palette} title="Canva Colors & 3 Fonts" body="Studio white default with clean typography hierarchy and zero glare bleed." />
                  </>
                ) : (
                  <>
                    <PolicyPill icon={Clock3} title="Up to 90 seconds" body="Longer uploads are trimmed to the first 90 seconds." />
                    <PolicyPill icon={ShieldCheck} title="Private & temporary" body="Your file is only used to create your reel. Not shared." />
                  </>
                )}
              </div>

              {/* Pre-generation credit notice */}
              <div className="flex min-w-0 items-start gap-2" style={{ background: 'var(--bg-raised)', border: '0.5px solid var(--border-dark)', borderRadius: '8px', padding: '8px 12px' }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--color-primary-hover)' }} />
                <p className="min-w-0 break-words leading-5" style={{ fontSize: '12px', color: 'var(--text-dark-secondary)' }}>
                  {isFreeSignupCredit && !paidLimitComplete ? (
                    mode === "autoCaption"
                      ? "Your one free Auto Caption Video will include a fixed Itnavideo watermark. Credits are released if the final render has a system failure."
                      : "Your free trial is only for a watermarked Auto Caption Video. Buy credits to use this video type."
                  ) : (
                    <>
                      This will use <span style={{ fontWeight: 600, color: 'var(--color-primary-hover)' }}>{plannedCreditLabel}</span> — {billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? '—'} remaining
                    </>
                  )}
                </p>
              </div>

              <button
                className={`inline-flex w-full items-center justify-center gap-2 transition ${
                  canPrepareReel
                    ? ""
                    : "cursor-not-allowed opacity-50"
                }`}
                style={{
                  background: canPrepareReel ? 'var(--color-primary-hover)' : 'rgba(255,255,255,0.03)',
                  color: canPrepareReel ? '#FFFFFF' : 'var(--text-dark-muted)',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '14px 18px',
                  borderRadius: '10px',
                  width: '100%',
                  border: canPrepareReel ? 'none' : '1px solid var(--border)',
                }}
                disabled={!canPrepareReel}
                onClick={startRenderJob}
                onMouseEnter={(e) => { if (canPrepareReel) e.currentTarget.style.background = 'var(--color-primary)'; }}
                onMouseLeave={(e) => { if (canPrepareReel) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                type="button"
              >
                <Sparkles size={17} />
                {jobStatus.state === "uploading"
                  ? "Uploading..."
                  : jobStatus.state === "starting"
                    ? (mode === "audioClean" ? "Cleaning Audio with AI..." : "Preparing...")
                    : jobStatus.state === "rendering"
                      ? (mode === "audioClean" ? "Normalizing & Splicing Audio..." : "Rendering HD video... please wait")
                      : mode === "audioClean"
                        ? isAnalyzingAudio
                          ? "Analyzing Speech & Script..."
                          : "Clean Audio Now"
                        : paidLimitComplete
                          ? isFreeSignupCredit ? "Buy Credits to Create More" : "Plan limit complete"
                          : !selectedFile && mode !== "customAiReel"
                            ? (activeMode.accept.startsWith("video") ? "Upload Video First" : "Upload Audio First")
                            : isFreeSignupCredit ? "Create My Video" : "Create My Reel"}
              </button>
              <p className="text-center text-xs font-bold leading-5 text-muted-foreground">
                {renderInProgress
                  ? "Please do not close this tab. Usually 2-10 minutes."
                  : mode === "customAiReel" && customAiPrompt.trim().length < 12 ? "Describe your video to continue. " : mode !== "customAiReel" && !selectedFile ? "Upload a file to continue. " : mode === "compare" && comparisonFiles.length !== 2 ? "Add at least two compare images. " : mode === "creatorBackgroundReplace" && !creatorBackgroundImageFile ? "Upload one background image. " : ""}
                {!renderInProgress ? isFreeSignupCredit && !paidLimitComplete ? "Failed renders are not charged. Usually 2-10 minutes." : "Usually 2-10 minutes depending on video type and load." : ""}
              </p>
              <ProgressPreview mode={mode} />
              {paidLimitComplete ? (
                <div className="rounded-lg border border-amber-200/20 bg-amber-200/[0.075] p-4 text-sm font-bold leading-6 text-amber-50">
                  {isFreeSignupCredit
                    ? "Your one free watermarked Auto Caption trial is used. Buy credits to continue creating."
                    : `Your ${billingEntitlement?.planName || "paid"} credits are complete or expired. Buy another pack to continue creating.`}
                  <Link className="ml-2 text-brand-mint underline-offset-4 hover:underline" href="/pricing">
                    View plans
                  </Link>
                </div>
              ) : null}
              {jobStatus.state !== "idle" ? (
                <InteractiveRenderEngine
                  mode={mode}
                  fileName={selectedFile?.name}
                  onRetry={startRenderJob}
                  onReset={() => setJobStatus({state: "idle", message: ""})}
                  status={jobStatus}
                  title={jobStatus.title || selectedFile?.name || activeMode.title}
                />
              ) : null}
            </div>
          )}
        </section>

          </div>
        )}

      {deleteCandidate ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 px-3 pb-4 pt-10 backdrop-blur-md sm:items-center sm:px-5 sm:pb-10">
          <div
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-lg border border-red-300/20 bg-[#09090b] shadow-[0_26px_90px_rgba(0,0,0,0.65)]"
            role="dialog"
          >
            <div className="relative border-b border-border bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,191,0.16),transparent_32%),radial-gradient(circle_at_92%_8%,rgba(248,113,113,0.18),transparent_34%)] px-5 pb-5 pt-5">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-300/25 bg-red-500/10 text-red-200">
                  <AlertTriangle size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-200">Delete render</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">Remove this video?</h2>
                  <p className="mt-2 text-[13px] font-medium leading-5 text-muted-foreground">
                    This only removes the render from your dashboard history on this device/account. Temporary MP4 links still expire automatically.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-5">

              <div className="rounded-lg border border-border bg-card/[0.035] p-4">
                <p className="truncate text-sm font-bold text-white">{deleteCandidate.title}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {getModeLabel(deleteCandidate.mode)} · {formatTimeLeft(deleteCandidate.expiresAt)}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card/[0.04] px-4 py-3.5 text-sm font-bold text-zinc-200 transition hover:border-white/25 hover:bg-card/[0.08] hover:text-foreground"
                  onClick={() => setDeleteCandidate(null)}
                  type="button"
                >
                  Keep video
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-400 px-4 py-3.5 text-sm font-bold text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deletingRenderId === deleteCandidate.id}
                  onClick={() => void deleteRender(deleteCandidate)}
                  type="button"
                >
                  <Trash2 size={16} />
                  Delete video
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Security & Privacy Modal */}
      {showPrivacyModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-900 hover:text-white transition"
              type="button"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Security &amp; Privacy</h3>
                <p className="text-xs text-slate-400">How Itnavideo protects your uploaded media</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Your uploads are private and temporary.",
                "Final MP4 links are automatically deleted after 48 hours.",
                "Your reel is created in isolated cloud rendering sandboxes.",
                "We only use your files to process your render — never sold or trained on.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-xs font-medium leading-5 text-slate-300">
                  <ShieldCheck className="mt-0.5 shrink-0 text-emerald-400" size={15} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {/* Video Type Preview Modal */}
      {previewVideoTypeId && (() => {
        const previewVideoType = videoTypeCards.find((t) => t.id === previewVideoTypeId);
        if (!previewVideoType) return null;
        const previewMode = modeConfig[previewVideoType.mode];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
            onClick={() => setPreviewVideoTypeId(null)}
            role="dialog"
            aria-label={`Preview ${previewVideoType.title}`}
          >
            <div
              className={`relative flex max-h-[90vh] w-full ${previewVideoType.category === 'long' ? 'max-w-2xl' : 'max-w-sm'} flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-border text-white hover:bg-black/80 transition"
                onClick={() => setPreviewVideoTypeId(null)}
                type="button"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>

              {/* Full reel / widescreen preview */}
              <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                <div className={`relative mx-auto ${previewVideoType.category === 'long' ? 'aspect-video max-h-[60vh]' : 'aspect-[9/16] max-h-[56vh]'} w-full`}>
                <Image
                  alt={previewVideoType.title}
                  className="object-cover object-center"
                  fill
                  sizes={previewVideoType.category === 'long' ? "720px" : "380px"}
                  src={previewVideoType.image}
                  priority
                />
                </div>
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>

              {/* Info panel */}
              <div className="shrink-0 space-y-3 border-t border-white/5 p-3 sm:p-4">
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-foreground">{previewVideoType.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{previewVideoType.description}</p>
                  </div>
                  <div className="shrink-0 rounded-md bg-brand-mint/10 border border-brand-mint/25 px-2 py-0.5 text-[10px] font-bold text-brand-mint">
                    {previewVideoType.mode === "longVideoClips"
                      ? "3–12 credits"
                      : getPlannedRenderCreditUnits(previewVideoType.mode)
                        ? `${formatCreditUnits(getPlannedRenderCreditUnits(previewVideoType.mode))} credit${getPlannedRenderCreditUnits(previewVideoType.mode) === 10 ? "" : "s"}`
                        : "See tool pricing"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {('badges' in previewVideoType && Array.isArray((previewVideoType as unknown as {badges: string[]}).badges) ? (previewVideoType as unknown as {badges: string[]}).badges : []).map((badge: string) => (
                    <span key={badge} className="rounded-md bg-card/[0.06] border border-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="rounded-lg bg-card/[0.03] border border-white/5 p-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Best for</p>
                  <p className="text-xs text-zinc-300">{previewMode?.bestResult || previewVideoType.description}</p>
                </div>

                <button
                  className="w-full rounded-xl bg-brand-mint px-4 py-2.5 text-xs font-black text-black transition hover:bg-brand-mint/90"
                  onClick={() => {
                    chooseVideoTypeMode(previewVideoType.mode);
                    setPreviewVideoTypeId(null);
                  }}
                  type="button"
                >
                  {previewVideoType.mode === mode ? '✓ Already Selected' : 'Use This Video Type'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
      </div>
    </main>
    </>
  );

  async function startRenderJob() {
    if (!user) return;
    if (renderRequestInFlightRef.current || renderInProgress) return;
    renderRequestInFlightRef.current = true;
    if (mode === "customAiReel") {
      if (customAiPrompt.trim().length < 12) {
        renderRequestInFlightRef.current = false;
        setJobStatus({state: "error", message: "Please describe your video in simple English for best results."});
        return;
      }
      const userId = user.id;
      const hasMedia = customAiImageFiles.length || customAiLogoFile || customAiVideoFile || customAiAudioFile;
      setJobStatus({state: "uploading", message: hasMedia ? "Uploading your custom reel media..." : "Preparing your text-only reel..."});
      try {
        const customAiImageKeys = await uploadVideoTypeImages({files: customAiImageFiles, mode: "customAiReel", userId});
        const customAiLogoKey = customAiLogoFile
          ? await uploadVideoTypeImage({file: customAiLogoFile, userId, mode: "customAiReel"})
          : "";
        const customAiVideoKey = customAiVideoFile
          ? await uploadVideoTypeImage({file: customAiVideoFile, userId, mode: "customAiReel"})
          : "";
        const customAiAudioKey = customAiAudioFile
          ? await uploadVideoTypeImage({file: customAiAudioFile, userId, mode: "customAiReel"})
          : "";
        await submitFinalRender({
          mediaKey: "",
          fileName: "custom-ai-reel",
          contentType: "application/json",
          userId,
          comparisonImageKeys: [],
          promoThumbnailKey: "",
          creatorBackgroundImageKey: "",
          customAiImageKeys,
          customAiLogoKey,
          customAiVideoKey,
          customAiAudioKey,
          customAiVideoDurationSeconds: customAiVideoMeta.durationSeconds,
          customAiAudioDurationSeconds: customAiAudioMeta.durationSeconds,
          overrideInputProps: {},
        });
      } catch (error) {
        renderRequestInFlightRef.current = false;
        setJobStatus({
          state: "error",
          message: formatNetworkError(error, "We could not generate this custom reel."),
          failureStage: "upload",
        });
      }
      return;
    }

    if (!selectedFile) {
      renderRequestInFlightRef.current = false;
      return;
    }
    const validation = validateFileForMode(selectedFile, mode);
    if (validation) {
      renderRequestInFlightRef.current = false;
      setJobStatus({state: "error", message: validation});
      return;
    }

    if (mode === "compare" && comparisonFiles.length !== 2) {
      renderRequestInFlightRef.current = false;
      setJobStatus({state: "error", message: "Compare needs exactly two images: one left and one right."});
      return;
    }
    if (mode === "creatorBackgroundReplace" && !creatorBackgroundImageFile) {
      renderRequestInFlightRef.current = false;
      setJobStatus({state: "error", message: "Creator Background Replace needs one background image."});
      return;
    }
    const userId = user.id;
    const uploadContentType = getUploadContentType(selectedFile);
    setJobStatus({state: "uploading", message: "Preparing your private upload..."});

    try {
      const uploadStartedAt = performance.now();
      const presignResponse = await fetch("/api/media/presign", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: uploadContentType,
          fileSize: selectedFile.size,
          mode,
          userId,
        }),
      });
      const presign = await readJsonPayload(presignResponse);
      if (!presignResponse.ok || !presign.ok) throw new Error(presign.error || "Could not prepare upload.");
      const presignMs = Math.round(performance.now() - uploadStartedAt);

      setJobStatus({state: "uploading", message: "Uploading your file. Please keep this page open..."});
      const mediaUploadStartedAt = performance.now();
      const uploadResponse = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {"Content-Type": uploadContentType},
        body: selectedFile,
      }).catch((error) => {
        throw new Error(formatNetworkError(error, "Media upload failed. Please retry on a stable connection."));
      });
      if (!uploadResponse.ok) throw new Error("Media upload failed.");
      const mediaUploadMs = Math.round(performance.now() - mediaUploadStartedAt);

      const comparisonImageKeys = mode === "compare" || mode === "multiImagesVideo"
        ? await uploadComparisonImages({files: comparisonFiles, userId})
        : [];

      const thumbnailUploadStartedAt = performance.now();
      const promoThumbnailKey = mode === "longVideoPromo" && promoThumbnailFile
        ? await uploadVideoTypeImage({file: promoThumbnailFile, userId, mode: "longVideoPromo"})
        : "";
      const thumbnailUploadMs = mode === "longVideoPromo" ? Math.round(performance.now() - thumbnailUploadStartedAt) : 0;
      if (mode === "longVideoPromo") {
        console.log("[LONG_VIDEO_PROMO_CLIENT_UPLOAD]", {
          presignMs,
          mediaUploadMs,
          thumbnailUploadMs,
          mediaSizeBytes: selectedFile.size,
          thumbnailSizeBytes: promoThumbnailFile?.size || 0,
          durationSeconds: promoClipMeta.durationSeconds || null,
          mediaAspect: promoClipMeta.mediaAspect || "unknown",
        });
      }

      const creatorBackgroundImageKey = mode === "creatorBackgroundReplace" && creatorBackgroundImageFile
        ? await uploadVideoTypeImage({file: creatorBackgroundImageFile, userId, mode: "creatorBackgroundReplace"})
        : "";

      if (mode === "audioClean") {
        setJobStatus({
          state: "starting",
          message: "Cleaning audio: removing retakes, awkward silences & normalizing studio volume...",
        });
        try {
          const cleanResponse = await fetch("/api/audio-clean", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mediaKey: presign.key,
              userId,
              audioCleanOptions,
              transcript: audioCleanAnalysis?.rawTranscript,
              segmentsToCut: audioCleanAnalysis?.segments?.filter((s) => s.action === "cut"),
            }),
          });
          const cleanResult = await readJsonPayload(cleanResponse);
          if (!cleanResponse.ok || !cleanResult.ok) {
            throw new Error(cleanResult.error || "Audio cleaning failed.");
          }

          setAudioCleanResult(cleanResult);
          setJobStatus({
            state: "ready",
            message: "Audio cleaned successfully! Preview and download below.",
            outputFile: cleanResult.outputUrl,
          });
          renderRequestInFlightRef.current = false;
          return;
        } catch (cleanError) {
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: cleanError instanceof Error ? cleanError.message : "Audio cleaning failed.",
          });
          return;
        }
      }

      // ── PREVIEW STEP: video types that support it show preview before render ──
      // Compare and Auto Caption use the same preview-first approval flow.
      // Only Compare uses preview-first flow. Auto Caption renders directly for speed.
      const PREVIEW_SUPPORTED_MODES: Mode[] = ["compare"];
      if (PREVIEW_SUPPORTED_MODES.includes(mode)) {
        setJobStatus({state: "starting", message: "Generating your preview…"});
        try {
          const previewVideoTypeName = mode === "autoCaption"
            ? "AUTO_CAPTION_GENERATOR"
            : mode === "compare"
              ? "comparisonImages"
              : "DYNAMIC_CREATOR_REEL";
          const previewResponse = await fetch("/api/reels/preview", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              mediaKey: presign.key,
              fileName: selectedFile.name,
              contentType: uploadContentType,
              videoTypeName: previewVideoTypeName,
              templateName: previewVideoTypeName,
              userId,
              comparisonImageKeys,
              compareLeftTitle: compareLeftTitle.trim(),
              compareRightTitle: compareRightTitle.trim(),
              compareTheme,
              compareTone,
              compareWinner,
              compareImageStyle,
              creatorHandle: compareHandle.trim() || "@itnavideo",
              stickerStyle,
              typographyStyle,
              captionStyle,
              captionPosition,
              captionFontFamily,
              captionFontSize,
              captionTextColor,
              captionHighlightColor,
              captionBackgroundColor,
              captionShowBackground: captionBackgroundColor !== "",
              videoLayout: mode === "autoCaption" ? "fullscreen" : videoLayout,
              progressStyle: mode === "autoCaption" ? "none" : progressStyle,
              wordClickSound: mode === "autoCaption" ? false : wordClickSound,
              topicTitle: topicTitle.trim(),
            }),
          });
          const previewData = await readJsonPayload(previewResponse);
          if (previewResponse.ok && previewData.ok && previewData.preview) {
            // Save upload keys for final render after user confirms preview
            setPendingRenderKeys({
              mediaKey: presign.key,
              comparisonImageKeys,
              promoThumbnailKey,
              creatorBackgroundImageKey,
            });
            setPreviewPlan(previewData.preview);
            setJobStatus({state: "idle", message: ""});
            renderRequestInFlightRef.current = false;
            return; // Stop here — wait for user to confirm in PreviewEditor
          }
          // Preview failed — fall through to direct render
          console.warn("[PREVIEW] Could not generate preview, falling back to direct render:", previewData.error);
        } catch (previewErr) {
          console.warn("[PREVIEW] Preview request failed, falling back to direct render:", previewErr);
        }
      }

      // Direct render path (no preview) — used for all other video types
      // and as fallback when preview fails
      await submitFinalRender({
        mediaKey: presign.key,
        fileName: selectedFile.name,
        contentType: uploadContentType,
        userId,
        comparisonImageKeys,
        promoThumbnailKey,
        creatorBackgroundImageKey,
        customAiImageKeys: [],
        customAiLogoKey: "",
        overrideInputProps: {},
      });
    } catch (error) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: formatNetworkError(error, "We could not generate this reel."),
        failureStage: "upload",
      });
    }
  }

  // Called either directly (non-preview video types) or from PreviewEditor confirm
  async function submitFinalRender({
    mediaKey,
    fileName: renderFileName,
    contentType: renderContentType,
    userId,
    comparisonImageKeys,
    promoThumbnailKey,
    creatorBackgroundImageKey,
    customAiImageKeys,
    customAiLogoKey,
    customAiVideoKey = "",
    customAiAudioKey = "",
    customAiVideoDurationSeconds,
    customAiAudioDurationSeconds,
    overrideInputProps,
  }: {
    mediaKey: string;
    fileName: string;
    contentType: string;
    userId: string;
    comparisonImageKeys: string[];
    promoThumbnailKey: string;
    creatorBackgroundImageKey: string;
    customAiImageKeys: string[];
    customAiLogoKey: string;
    customAiVideoKey?: string;
    customAiAudioKey?: string;
    customAiVideoDurationSeconds?: number;
    customAiAudioDurationSeconds?: number;
    overrideInputProps: Record<string, unknown>;
  }) {
    setJobStatus({state: "starting", message: planningMessageForMode(mode)});
    try {
      const jobStartMs = performance.now();
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          mediaKey,
          fileName: renderFileName,
          contentType: renderContentType,
          mediaType: mode === "customAiReel" ? (customAiVideoKey ? "video" : customAiAudioKey ? "audio" : "image") : getFileMediaType(selectedFile!),
          mode,
          topicTitle: topicTitle.trim(),
          visualStylePreset: longVideoStylePreset,
          atmosphereBg: longVideoAtmosphereBg,
          userId,
          comparisonImageKeys,
          compareLeftTitle: compareLeftTitle.trim(),
          compareRightTitle: compareRightTitle.trim(),
          compareTheme,
          compareTone,
          compareWinner,
          compareImageStyle,
          creatorHandle: compareHandle.trim() || "@itnavideo",
          stickerStyle: String(overrideInputProps.stickerStyle || stickerStyle),
          // Use edited values from preview if available, else dashboard form values.
          // Long Video Promo is intentionally thumbnail + title + promo media only.
          ...(mode !== "longVideoPromo" ? {
            captionStyle: String(overrideInputProps.captionStyle || captionStyle),
            captionPosition: String(overrideInputProps.captionPosition || captionPosition),
            captionFontFamily: String(overrideInputProps.fontFamily || captionFontFamily),
            captionFontSize: String(overrideInputProps.fontSize || captionFontSize),
            captionTextColor: String(overrideInputProps.textColor || captionTextColor),
            captionHighlightColor: String(overrideInputProps.highlightColor || captionHighlightColor),
            captionBackgroundColor: String(overrideInputProps.backgroundColor || captionBackgroundColor),
            captionShowBackground: typeof overrideInputProps.showBackground === "boolean" ? overrideInputProps.showBackground : captionBackgroundColor !== "",
          } : {}),
          spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
          captionLanguage: captionLanguage !== "auto" ? captionLanguage : undefined,
          subtitleOutputLanguage: captionLanguage !== "auto" ? captionLanguage : undefined,
          videoLayout: mode === "autoCaption" ? "fullscreen" : String(overrideInputProps.videoLayout || videoLayout),
          progressStyle: mode === "autoCaption" ? "none" : String(overrideInputProps.progressStyle || progressStyle),
          wordClickSound: mode === "autoCaption" ? false : wordClickSound,
          accentColor: overrideInputProps.accentColor || undefined,
          stickerScale: overrideInputProps.stickerScale || undefined,
          stickerOffsetX: overrideInputProps.stickerOffsetX || undefined,
          stickerOffsetY: overrideInputProps.stickerOffsetY || undefined,
          // Pass edited captions from preview directly so jobs route uses them.
          ...(mode !== "longVideoPromo" && overrideInputProps.captions ? { previewCaptions: overrideInputProps.captions } : {}),
          ...(overrideInputProps.scenes ? { previewScenes: overrideInputProps.scenes } : {}),
          ...(overrideInputProps.overlayTimeline ? { previewOverlayTimeline: overrideInputProps.overlayTimeline } : {}),
          ...(overrideInputProps.stickers ? { previewStickers: overrideInputProps.stickers } : {}),
          // Long Video Promo fields
          ...(mode === "longVideoPromo" ? {
            promoTitle: promoTitle.trim(),
            promoCtaText: promoCtaText.trim() || undefined,
            thumbnailKey: promoThumbnailKey || undefined,
            durationSeconds: promoClipMeta.durationSeconds || undefined,
            sourceDurationSeconds: promoClipMeta.durationSeconds || undefined,
            mediaAspect: promoClipMeta.mediaAspect || undefined,
          } : {}),
          // Multi Images Video fields
          ...(mode === "multiImagesVideo" ? {
            promoTitle: promoTitle.trim(),
            title: promoTitle.trim(),
            durationSeconds: promoClipMeta.durationSeconds || undefined,
            sourceDurationSeconds: promoClipMeta.durationSeconds || undefined,
          } : {}),
          ...(mode === "creatorBackgroundReplace" ? {
            backgroundImageKey: creatorBackgroundImageKey || undefined,
            backgroundFit: creatorBackgroundSettings.backgroundFit,
            backgroundScale: creatorBackgroundSettings.backgroundScale,
            backgroundX: creatorBackgroundSettings.backgroundX,
            backgroundY: creatorBackgroundSettings.backgroundY,
            creatorScale: creatorBackgroundSettings.creatorScale,
            creatorX: creatorBackgroundSettings.creatorX,
            creatorY: creatorBackgroundSettings.creatorY,
          } : {}),
          ...(mode === "customAiReel" ? {
            customAiPrompt: customAiPrompt.trim(),
            customAiImageKeys,
            customAiLogoKey: customAiLogoKey || undefined,
            customAiVideoKey: customAiVideoKey || undefined,
            customAiAudioKey: customAiAudioKey || undefined,
            customAiVideoDurationSeconds: customAiVideoDurationSeconds || undefined,
            customAiAudioDurationSeconds: customAiAudioDurationSeconds || undefined,
          } : {}),
          // Long Video Clips fields
          ...(mode === "longVideoClips" ? {
            clipCount,
            clipDuration,
            enableSfx,
            enableCaptions: enableClipsCaptions,
            captionStyle,
          } : {}),
          // AI Audio Cleaner fields
          ...(mode === "audioClean" ? {
            audioCleanOptions,
          } : {}),
          // SFX preference
          enableSfx,
          // Typography Video fields
          ...(mode === "typographyVideo" ? {
            typographyStyle,
            typographyShowCaptions: false,
          } : {}),
          // Whiteboard Video fields
          ...(mode === "whiteboardVideo" ? {
            whiteboardBoard,
          } : {}),
          // Faceless Video background & typography
          ...((mode === "facelessVideo" || mode === "aiVideoGenerator" || mode === "longVideoPro") ? {
            backgroundTheme: selectedBackgroundTheme,
            selectedBackgroundTheme,
            customBgUrl: selectedBackgroundUrl,
            backgroundUrl: selectedBackgroundUrl,
            headingFont: mode === "longVideoPro" ? headingFont : longVideoHeadingFont,
            subheadingFont: longVideoSubheadingFont,
            bodyFont: mode === "longVideoPro" ? typographyFont : longVideoBodyFont,
            typographyFont: mode === "longVideoPro" ? typographyFont : longVideoBodyFont,
            showCaptions: facelessEnableCaptions,
            enableCaptions: facelessEnableCaptions,
          } : {}),
        }),
      });
      const job = await readJsonPayload(jobResponse);
      if (mode === "longVideoPromo") {
        console.log("[LONG_VIDEO_PROMO_JOB_START]", {
          httpStatus: job.httpStatus,
          ok: Boolean(job.ok),
          elapsedMs: Math.round(performance.now() - jobStartMs),
          diagnostics: job.diagnostics || null,
        });
      }
      if (!jobResponse.ok || !job.ok) {
        const reasonCode = typeof job.reasonCode === "string" ? job.reasonCode : "";
        const fd = job._founderDiagnostics || {};
        const diagnosticParts = [
          fd.step ? `Step: ${fd.step}` : (job.step ? `Step: ${job.step}` : ""),
          reasonCode ? `Code: ${reasonCode}` : "",
          fd.mode ? `Mode: ${fd.mode}` : (job.debugMode ? `Mode: ${job.debugMode}` : ""),
          fd.videoTypeName ? `Video Type: ${fd.videoTypeName}` : fd.templateName ? `Video Type: ${fd.templateName}` : (job.debugVideoType ? `Video Type: ${job.debugVideoType}` : job.debugTemplate ? `Video Type: ${job.debugTemplate}` : ""),
          fd.compositionId ? `Composition: ${fd.compositionId}` : (job.debugComposition ? `Composition: ${job.debugComposition}` : ""),
          fd.httpStatus ? `HTTP: ${fd.httpStatus}` : (job.httpStatus ? `HTTP: ${job.httpStatus}` : ""),
          fd.detail ? `Detail: ${fd.detail}` : (job.detail ? `Detail: ${job.detail}` : ""),
          fd.raw ? `Raw: ${String(fd.raw).slice(0, 240)}` : (job.rawText ? `Raw: ${String(job.rawText).slice(0, 240)}` : ""),
        ].filter(Boolean);

        const diagnostics = formatFounderDiagnostics(diagnosticParts);
        setJobStatus({
          state: "error",
          message: sanitizeUserFacingStatus(job.error || job.message || "Could not start render."),
          progress: getFailureProgress(reasonCode),
          failureStage: getFailureStage(reasonCode),
          reasonCode,
          diagnostics: isFounderDebugUser ? diagnostics : undefined,
        });
        return;
      }
      const plannedTitle = typeof job.reelTitle === "string" && job.reelTitle.trim()
        ? job.reelTitle.trim()
        : renderFileName.replace(/\.[^.]+$/, "") || "Itnavideo reel";
      const plannedDesign = typeof job.design === "string" && job.design.trim()
        ? job.design.trim()
        : "Auto from script";

      if (job.status === "ready" && typeof job.outputFile === "string" && job.outputFile) {
        const renderId = typeof job.renderId === "string" && job.renderId ? job.renderId : `direct-${Date.now()}`;
        const bucketName = typeof job.bucketName === "string" ? job.bucketName : "";
        const finishedRender: RecentRender = {
          id: renderId,
          title: plannedTitle,
          mode,
          design: plannedDesign,
          outputFile: job.outputFile,
          createdAt: Date.now(),
          expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
        };
        const localRenders = saveRecentRender(userId, finishedRender);
        setRecentRenders(localRenders);
        if (bucketName) {
          saveServerRecentRender(userId, finishedRender, bucketName).then((serverRender) => {
            if (!serverRender) return;
            setRecentRenders((current) => mergeRecentRenders([serverRender, ...current]));
            saveRecentRenders(userId, mergeRecentRenders([serverRender, ...localRenders]));
            loadBillingEntitlement(userId).then(setBillingEntitlement).catch((error) => {
              console.warn("Could not refresh billing status:", error);
            });
          }).catch((error) => {
            console.warn("Could not save Supabase render history:", error);
          });
        }
        setJobStatus({
          state: "ready",
          message: job.message || "Final MP4 is ready.",
          progress: 1,
          outputFile: job.outputFile,
          renderId,
          bucketName,
          title: plannedTitle,
          design: plannedDesign,
        });
        return;
      }

      if (typeof job.renderId !== "string" || !job.renderId || typeof job.bucketName !== "string" || !job.bucketName) {
        setJobStatus({
          state: "error",
          message: "Render started but did not return a valid render id. Please try again.",
          failureStage: "render",
        });
        return;
      }

      const renderingMessage = mode === "longVideoPromo"
        ? "Rendering your promo MP4. No transcription or caption planning is running."
        : job.transcriptSource === "not-required"
          ? "Rendering your MP4..."
          : job.transcriptSource === "primary"
            ? "Rendering your reel. This may take a few minutes..."
            : `Rendering with backup planning. ${sanitizeUserFacingStatus(job.transcriptWarning || "")}`.trim();

      if (mode === "longVideoClips" && Array.isArray(job.clips)) {
        pollRenderForClips(job.clips, userId, {title: plannedTitle, design: plannedDesign});
      } else {
        setJobStatus({
          state: "rendering",
          message: renderingMessage,
          progress: 0,
          renderId: job.renderId,
          bucketName: job.bucketName,
          title: plannedTitle,
          design: plannedDesign,
        });
        pollRender(job.renderId, job.bucketName, userId, {title: plannedTitle, design: plannedDesign});
      }
    } catch (error) {
      setJobStatus({
        state: "error",
        message: formatNetworkError(error, "We could not generate this reel."),
        failureStage: "upload",
      });
    }
  }

  async function pollRender(renderId: string, bucketName: string, userId: string, meta: {title: string; design: string}) {
    let consecutivePollErrors = 0;
    for (let attempt = 0; attempt < RENDER_POLL_ATTEMPTS; attempt += 1) {
      await wait(RENDER_POLL_INTERVAL_MS);
      let response: Response;
      let status: Awaited<ReturnType<typeof readJsonPayload>>;
      try {
        const statusParams = new URLSearchParams({
          renderId,
          bucketName,
          userId,
          mode,
          title: meta.title,
        });
        response = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
        if (!response.ok) {
          // If server returned 502/503/504 transient gateway error, treat as retryable connection glitch
          throw new Error(`Server returned HTTP ${response.status}`);
        }
        status = await readJsonPayload(response);
        consecutivePollErrors = 0;
      } catch (error) {
        consecutivePollErrors += 1;
        if (consecutivePollErrors >= 10) {
          setJobStatus({state: "error", message: formatNetworkError(error, "Could not read render progress. Connection lost."), renderId, bucketName, ...meta});
          return;
        }
        setJobStatus((current) => ({
          state: "rendering",
          message: `Render is still running. Reconnecting... (${consecutivePollErrors}/10)`,
          progress: current.progress || 0,
          renderId,
          bucketName,
          ...meta,
        }));
        await wait(Math.min(consecutivePollErrors * 1000, 4000));
        continue;
      }
      if (!status.ok || status.state === "error") {
        setJobStatus({
          state: "error",
          message: status.error || (status.errors?.[0]?.message ? sanitizeUserFacingStatus(status.errors[0].message) : "Render failed."),
          failureStage: "render",
          diagnostics: isFounderDebugUser ? formatFounderDiagnostics(status.diagnostics || []) : undefined,
          renderId,
          bucketName,
          ...meta,
        });
        return;
      }
      if (status.done && status.errors?.length) {
        setJobStatus({
          state: "error",
          message: sanitizeUserFacingStatus(status.errors[0]?.message || "Render failed."),
          failureStage: "render",
          diagnostics: isFounderDebugUser ? formatFounderDiagnostics(status.diagnostics || []) : undefined,
          renderId,
          bucketName,
          ...meta,
        });
        return;
      }
      if (status.done) {
        const finishedRender: RecentRender = {
          id: renderId,
          title: meta.title,
          mode,
          design: meta.design,
          outputFile: status.outputFile,
          createdAt: Date.now(),
          expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
        };
        const localRenders = saveRecentRender(userId, finishedRender);
        setRecentRenders(localRenders);
        saveServerRecentRender(userId, finishedRender, bucketName).then((serverRender) => {
          if (!serverRender) return;
          setRecentRenders((current) => mergeRecentRenders([serverRender, ...current]));
          saveRecentRenders(userId, mergeRecentRenders([serverRender, ...localRenders]));
          loadBillingEntitlement(userId).then(setBillingEntitlement).catch((error) => {
            console.warn("Could not refresh billing status:", error);
          });
        }).catch((error) => {
          console.warn("Could not save Supabase render history:", error);
        });
        setJobStatus({
          state: "ready",
          message: "Final MP4 is ready.",
          progress: 1,
          outputFile: status.outputFile,
          renderId,
          bucketName,
          ...meta,
        });
        return;
      }
      setJobStatus((current) => ({
        state: "rendering",
        message: status.message || "Rendering your reel...",
        progress: getOptimisticRenderProgress(attempt, status.progress, current.progress),
        renderId,
        bucketName,
        ...meta,
      }));
    }
    setJobStatus({
      state: "error",
      message: "Render is still processing longer than expected. Your upload is still selected, so you can retry without uploading again.",
      renderId,
      bucketName,
      ...meta,
    });
  }

  async function pollRenderForClips(
    initialClips: Array<{
      clipIndex: number;
      renderId: string;
      bucketName: string;
      outName: string;
      startSeconds: number;
      endSeconds: number;
      title: string;
      durationSeconds: number;
    }>,
    userId: string,
    meta: { title: string; design: string }
  ) {
    let activeClips: ClipStatus[] = initialClips.map(c => ({
      ...c,
      status: "rendering" as "rendering" | "done" | "failed",
      outputFile: undefined,
    }));

    setJobStatus({
      state: "rendering",
      message: `Extracting and rendering ${activeClips.length} viral clips in parallel...`,
      progress: 0,
      clips: activeClips,
      ...meta,
    });

    let consecutiveErrors = 0;

    for (let attempt = 0; attempt < RENDER_POLL_ATTEMPTS; attempt += 1) {
      await wait(RENDER_POLL_INTERVAL_MS);

      const allDoneOrFailed = activeClips.every(c => c.status === "done" || c.status === "failed");
      if (allDoneOrFailed) {
        break;
      }

      let updated = false;

      for (const clip of activeClips) {
        if (clip.status !== "rendering") continue;

        try {
          const statusParams = new URLSearchParams({
            renderId: clip.renderId,
            bucketName: clip.bucketName,
            userId,
            mode: "longVideoClips",
            title: clip.title,
          });
          const response = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
          if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
          }
          const status = await readJsonPayload(response);

          if (!status.ok || status.state === "error" || (status.done && status.errors?.length)) {
            clip.status = "failed";
            updated = true;
          } else if (status.done && status.outputFile) {
            clip.status = "done";
            clip.outputFile = status.outputFile;
            updated = true;

            const finishedRender: RecentRender = {
              id: clip.renderId,
              title: clip.title,
              mode: "longVideoClips",
              design: meta.design,
              outputFile: status.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
            };
            const localRenders = saveRecentRender(userId, finishedRender);
            setRecentRenders(localRenders);
            saveServerRecentRender(userId, finishedRender, clip.bucketName).then((serverRender) => {
              if (!serverRender) return;
              setRecentRenders((current) => mergeRecentRenders([serverRender, ...current]));
              saveRecentRenders(userId, mergeRecentRenders([serverRender, ...localRenders]));
            }).catch((err) => console.warn("Supabase multi-clip save error:", err));
          }
          consecutiveErrors = 0;
        } catch (error) {
          console.warn(`Polling error for clip ${clip.clipIndex + 1}:`, error);
          consecutiveErrors += 1;
          if (consecutiveErrors >= 10) {
            setJobStatus({
              state: "error",
              message: "Lost connection to the rendering server. Please check your network.",
              clips: activeClips,
              ...meta,
            });
            return;
          }
        }
      }

      if (updated) {
        const completedCount = activeClips.filter(c => c.status === "done").length;
        const failedCount = activeClips.filter(c => c.status === "failed").length;
        const progress = completedCount / activeClips.length;

        setJobStatus({
          state: "rendering",
          message: `Rendering clips: ${completedCount} ready, ${failedCount} failed, ${activeClips.length - completedCount - failedCount} remaining...`,
          progress,
          clips: [...activeClips],
          ...meta,
        });
      }
    }

    const successfulClips = activeClips.filter(c => c.status === "done");
    if (successfulClips.length === 0) {
      setJobStatus({
        state: "error",
        message: "All clip renderings failed. Please try again.",
        clips: activeClips,
        ...meta,
      });
    } else {
      setJobStatus({
        state: "ready",
        message: `Successfully generated ${successfulClips.length} high-quality viral clips!`,
        progress: 1,
        clips: activeClips,
        outputFile: successfulClips[0].outputFile,
        ...meta,
      });
      loadBillingEntitlement(userId).then(setBillingEntitlement).catch(() => {});
    }
  }
}

function validateFileForMode(file: File, mode: Mode) {
  const type = file.type || "";
  const name = file.name.toLowerCase();
  const isVideo = type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(name);
  const isAudio = type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(name);
  const maxBytes = 500 * 1024 * 1024;

  if (file.size > maxBytes) {
    return "This file is too large. Please upload a shorter file or compress it under 500MB.";
  }
  if ((mode === "creatorBackgroundReplace" || mode === "autoCaption" || mode === "dynamicCreator") && !isVideo) {
    if (mode === "creatorBackgroundReplace") return "Creator Background Replace needs a video file. Please upload an MP4/MOV video.";
    if (mode === "dynamicCreator") return "Creator Reel Video needs a video file. Please upload an MP4/MOV video.";
    return "Auto Caption Video needs a video file. Please upload an MP4/MOV video.";
  }
  if (mode === "compare" && !isAudio) {
    return "Compare needs an audio voiceover plus 2 comparison photos.";
  }
  if (mode === "longVideoPromo" && !isVideo) {
    return "Long Video Promo needs a video clip (MP4/MOV/WEBM).";
  }
  if (mode === "autoDraw" && !isAudio && !isVideo) {
    return `${modeConfig[mode].title} needs an audio or video file with clear speech.`;
  }
  if (mode === "longVideoPro" && !isAudio && !isVideo) {
    return "Long Video Pro needs an audio or video file with clear speech.";
  }
  if ((mode === "facelessVideo" || mode === "aiVideoGenerator") && !isAudio) {
    return "Faceless Video needs an audio voiceover file (MP3, WAV, M4A, AAC) up to 20 minutes.";
  }
  return "";
}

function getFileMediaType(file: File): "audio" | "video" | "image" {
  const type = file.type || "";
  const name = file.name.toLowerCase();

  if (type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(name)) return "image";
  if (type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(name)) return "audio";
  return "video";
}

function getUploadContentType(file: File) {
  const name = file.name.toLowerCase();
  const browserType = file.type || "";

  if (name.endsWith(".mp4") || name.endsWith(".m4v")) return "video/mp4";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mkv")) return "video/x-matroska";
  if (name.endsWith(".avi")) return "video/x-msvideo";

  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".wav")) return "audio/wav";
  if (name.endsWith(".m4a")) return "audio/mp4";
  if (name.endsWith(".aac")) return "audio/aac";
  if (name.endsWith(".ogg")) return "audio/ogg";
  if (name.endsWith(".flac")) return "audio/flac";

  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";

  if (browserType && browserType !== "application/octet-stream") return browserType;
  return "video/mp4";
}

async function uploadComparisonImages({files, userId}: {files: File[]; userId: string}) {
  const keys: string[] = [];
  for (const file of files.slice(0, 8)) {
    const contentType = getUploadContentType(file);
    const presignResponse = await fetch("/api/media/presign", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        fileName: file.name,
        contentType,
        fileSize: file.size,
        mode: "compare",
        userId,
      }),
    });
    const presign = await readJsonPayload(presignResponse);
    if (!presignResponse.ok || !presign.ok) throw new Error(presign.error || "Could not prepare compare image upload.");

    const uploadResponse = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: {"Content-Type": contentType},
      body: file,
    }).catch((error) => {
      throw new Error(formatNetworkError(error, "Compare image upload failed. Please retry on a stable connection."));
    });
    if (!uploadResponse.ok) throw new Error("Compare image upload failed.");
    if (typeof presign.key === "string") keys.push(presign.key);
  }
  return keys;
}

function RenderWaitCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);
  const WAIT_IMAGES = ['/visuals/render-wait/wait-1.png', '/visuals/render-wait/wait-2.png', '/visuals/render-wait/wait-3.png'];
  const WAIT_TEXTS = ['Almost there! Your video is getting ready ✨', 'AI is assembling your video...', 'Sit back, sip some chai ☕'];
  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-black/30 sm:h-48">
        <img src={WAIT_IMAGES[idx]} alt="" className="h-full w-full object-cover transition-opacity duration-700" key={idx} />
      </div>
      <p className="text-center text-xs font-bold text-cyan-200">{WAIT_TEXTS[idx]}</p>
    </div>
  );
}

function planningMessageForMode(mode: Mode) {
  if (mode === "autoCaption") return "Preparing styled captions for your reel...";
  if (mode === "compare") return "Preparing left/right comparison scenes...";
  if (mode === "creatorBackgroundReplace") return "Preparing your background replacement render...";
  if (mode === "autoDraw") return "Creating whiteboard scenes from your voiceover...";
  if (mode === "longVideoPromo") return "Preparing your promo reel...";
  if (mode === "dynamicCreator") return "Preparing dynamic text and pacing...";
  if (mode === "customAiReel") return "Planning your custom reel timeline...";
  return "Choosing scenes, text, and visuals...";
}


async function uploadVideoTypeImage({file, mode, userId}: {file: File; mode: Mode; userId: string}) {
  const contentType = getUploadContentType(file);

  const presignResponse = await fetch("/api/media/presign", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      fileSize: file.size,
      mode,
      userId,
    }),
  });

  const presign = await readJsonPayload(presignResponse);
  if (!presignResponse.ok || !presign.ok) throw new Error(presign.error || "Could not prepare image upload.");

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {"Content-Type": contentType},
    body: file,
  }).catch((error) => {
    throw new Error(formatNetworkError(error, "Image upload failed. Please retry on a stable connection."));
  });

  if (!uploadResponse.ok) throw new Error("Image upload failed.");

  return presign.key as string;
}

async function uploadVideoTypeImages({files, mode, userId}: {files: File[]; mode: Mode; userId: string}) {
  const keys: string[] = [];
  for (const file of files) {
    keys.push(await uploadVideoTypeImage({file, mode, userId}));
  }
  return keys;
}
function RenderStatusStage({
  mode,
  onRetry,
  onReset,
  status,
  title,
}: {
  mode: Mode;
  onRetry: () => void;
  onReset: () => void;
  status: JobStatus;
  title: string;
}) {
  const progress = getRenderDisplayProgress(status);
  const percentage = Math.round(progress * 100);
  const meta = getRenderStageMeta(status, mode);
  const StageIcon = meta.icon;
  const working = status.state === "uploading" || status.state === "starting" || status.state === "rendering";
  const failed = status.state === "error";
  const ready = status.state === "ready";
  const steps = getRenderSteps(progress, status, mode);

  return (
    <div
      className={`relative min-w-0 max-w-full overflow-hidden rounded-xl border p-3 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-5 ${
        failed
          ? "border-red-300/24 bg-red-500/[0.055]"
          : ready
            ? "border-brand-mint/35 bg-brand-mint/[0.07]"
            : "border-brand-mint/24 bg-[#061011]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(6,182,212,0.13),transparent_28%),radial-gradient(circle_at_76%_78%,rgba(255,61,154,0.10),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(186,230,253,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(186,230,253,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      {working ? (
        <>
          <div className="render-orbit pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full border border-cyan-200/10 sm:block">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
          </div>
        </>
      ) : null}
      {renderParticles.map((particle) => (
        <span
          aria-hidden="true"
          className="render-float absolute h-1.5 w-1.5 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(34,211,238,0.75)] motion-safe:animate-pulse"
          key={`${particle.left}-${particle.top}`}
          style={{left: particle.left, top: particle.top, animationDelay: particle.delay}}
        />
      ))}

      <div className="relative flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border sm:h-12 sm:w-12 ${meta.iconFrame}`}>
            <StageIcon className={working ? "motion-safe:animate-pulse" : ""} size={22} />
          </div>
          <div className="min-w-0">
            <p className={`text-[11px] font-black uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.2em] ${meta.kickerClass}`}>{meta.kicker}</p>
            <h3 className="mt-1 max-w-full truncate text-lg font-black tracking-normal text-white sm:text-2xl">{meta.title}</h3>
            <p className="mt-2 max-w-full whitespace-normal break-words text-sm font-bold leading-6 text-muted-foreground">{status.message || meta.body}</p>
            {failed && status.diagnostics?.length ? (
              <details className="mt-3 max-w-full overflow-hidden rounded-lg border border-red-300/20 bg-black/25 text-red-50">
                <summary className="cursor-pointer px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-red-100">
                  View details
                </summary>
                <div className="max-w-full overflow-x-auto border-t border-red-300/15 px-3 py-2">
                  {status.diagnostics.map((item, index) => (
                    <code className="block whitespace-pre-wrap break-words py-1 text-[11px] leading-5 text-red-100/80" key={`${item}-${index}`}>
                      {item}
                    </code>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </div>
        <div className={`inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${meta.badgeClass}`}>
          {working ? <Loader2 className="motion-safe:animate-spin" size={14} /> : null}
          {failed ? "Needs retry" : ready ? "Ready" : `${percentage}%`}
        </div>
      </div>

      {status.clips && status.clips.length > 0 ? (
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Harvested Clips List
            </span>
            <span className="text-xs font-black text-primary uppercase tracking-widest bg-cyan-950/40 border border-cyan-400/20 px-2.5 py-1 rounded-full">
              {status.clips.filter((c) => c.status === "done").length} / {status.clips.length} Clips Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {status.clips.map((clip) => {
              const isClipRendering = clip.status === "rendering";
              const isClipDone = clip.status === "done";
              const isClipFailed = clip.status === "failed";

              return (
                <div
                  key={clip.renderId}
                  className={`relative overflow-hidden rounded-2xl border p-4 bg-gradient-to-b from-[#08131e]/90 to-[#04090f]/90 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/5 ${
                    isClipFailed
                      ? "border-border"
                      : isClipDone
                        ? "border-emerald-500/20 shadow-lg shadow-emerald-950/5"
                        : "border-cyan-400/20 shadow-md shadow-cyan-950/5"
                  }`}
                >
                  {/* Clip Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-white truncate hover:text-primary transition-colors">
                        {clip.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
                        Segment: {Math.floor(clip.startSeconds / 60)}:{(clip.startSeconds % 60).toString().padStart(2, '0')} - {Math.floor(clip.endSeconds / 60)}:{(clip.endSeconds % 60).toString().padStart(2, '0')} ({Math.round(clip.durationSeconds)}s)
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <span
                      className={`shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isClipFailed
                          ? "bg-red-500/10 border-red-500/30 text-red-400"
                          : isClipDone
                            ? "bg-emerald-500/10 border-emerald-500/30 text-primary"
                            : "bg-cyan-500/10 border-cyan-500/30 text-primary animate-pulse"
                      }`}
                    >
                      {clip.status}
                    </span>
                  </div>

                  {/* Clip Body / Video Preview */}
                  <div className="mt-3 relative aspect-[9/16] h-[340px] mx-auto rounded-xl overflow-hidden bg-black border border-white/5 flex flex-col items-center justify-center">
                    {isClipDone && clip.outputFile ? (
                      <video
                        src={clip.outputFile}
                        controls
                        className="w-full h-full object-cover animate-fade-in"
                        playsInline
                      />
                    ) : isClipFailed ? (
                      <div className="p-4 text-center">
                        <span className="inline-grid w-10 h-10 place-items-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-2">✕</span>
                        <p className="text-xs font-black text-red-400">Failed to render</p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Our system will automatically retry. Failures are not billed.</p>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <div className="relative w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                          <span className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                          <Loader2 className="text-primary animate-pulse animate-spin" size={20} />
                        </div>
                        <p className="text-xs font-black text-primary">AI is rendering...</p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">Smart cutting and visual jump-cuts in progress.</p>
                      </div>
                    )}
                  </div>

                  {/* Clip Actions */}
                  {isClipDone && clip.outputFile && (
                    <div className="mt-3">
                      <a
                        href={clip.outputFile}
                        download={`itnavideo-clip-${clip.clipIndex + 1}.mp4`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-card px-3 py-2.5 text-xs font-black text-black transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-95"
                      >
                        <Download size={13} />
                        Download Clip
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-end gap-3 border-t border-white/[0.05] pt-4">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
            >
              ↻ Start New Video
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mt-5 grid min-w-0 max-w-full gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <div className="relative hidden min-h-52 min-w-0 max-w-full overflow-hidden rounded-xl border border-cyan-100/10 bg-[#061522]/82 p-3 sm:block sm:p-4">
            <div className="absolute inset-x-4 top-5 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
            <div className="absolute inset-y-6 left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="relative mx-auto mb-8 flex aspect-[9/16] h-48 max-h-full flex-col overflow-hidden rounded-xl border border-cyan-100/15 bg-[#061522] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.55)] min-[390px]:h-56">
              {working ? <div className="render-scanline pointer-events-none absolute inset-x-0 z-20 h-12 bg-gradient-to-b from-transparent via-emerald-200/18 to-transparent" /> : null}
              <div className="relative h-[36%] overflow-hidden rounded-lg border border-emerald-100/10 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.18),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.035))]">
                <div className="render-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1.5">
                  {renderPreviewBars.map((height, index) => (
                    <span
                      className="w-1.5 rounded-full bg-emerald-300/85 shadow-[0_0_14px_rgba(16,185,129,0.55)] motion-safe:animate-pulse"
                      key={`render-bar-${index}`}
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        height: `${Math.max(14, height * 0.42)}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3 h-8 rounded-md border border-border bg-card/10" />
              </div>
              <div className="mt-2 grid flex-1 grid-rows-[1fr_0.74fr_0.92fr] gap-2">
                <div className="rounded-lg border border-emerald-200/25 bg-[#0A2618] p-2">
                  <div className="h-2 w-2/3 rounded-full bg-card/70" />
                  <div className="mt-2 h-1.5 w-1/2 rounded-full bg-brand-mint/70" />
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2">
                  <div className="rounded-md bg-card/[0.08]" />
                  <div className="rounded-md bg-card/[0.055]" />
                </div>
                <div className="rounded-lg border border-border bg-card/[0.055] p-2">
                  <div className="render-caption-rise h-1.5 w-3/4 rounded-full bg-card/50" />
                  <div className="render-caption-rise mt-2 h-1.5 w-1/3 rounded-full bg-brand-mint/60 [animation-delay:0.18s]" />
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-300 to-white transition-all duration-700"
                  style={{width: `${Math.max(8, percentage)}%`}}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-3 bottom-4 flex min-w-0 items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground sm:inset-x-4">
              <span className="min-w-0 truncate">{modeConfig[toActiveDashboardMode(mode)].label}</span>
              <span className="min-w-0 truncate text-right">{title.replace(/\.[^.]+$/, "").slice(0, 18) || "Reel"}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-5">
            <div>
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-xs font-black uppercase tracking-[0.12em] form-label-muted">
                <span className="min-w-0">Live render timeline</span>
                <span className="text-primary">{failed ? "Paused" : ready ? "Complete" : "Active"}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full border border-border bg-black/45">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    failed ? "bg-red-300" : "bg-gradient-to-r from-brand-mint via-cyan-100 to-white"
                  }`}
                  style={{width: `${Math.max(6, percentage)}%`}}
                />
              </div>
            </div>

            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    className={`rounded-lg border px-3 py-3 ${
                      step.done
                        ? "border-cyan-200/30 bg-[#0A2630] text-white"
                        : step.active
                          ? "border-white/20 bg-card/[0.06] text-white"
                          : "border-border bg-black/20 text-muted-foreground"
                    }`}
                    key={step.label}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <StepIcon className={step.active && working ? "text-brand-mint motion-safe:animate-pulse" : step.done ? "text-brand-mint" : ""} size={15} />
                      <p className="min-w-0 break-words text-xs font-black uppercase tracking-[0.1em]">{step.label}</p>
                    </div>
                    <p className="mt-2 text-xs font-bold leading-5 text-muted-foreground">{step.detail}</p>
                  </div>
                );
              })}
            </div>

            {status.outputFile ? (
              <div className="grid gap-3">
                <a
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-card px-4 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
                  href={status.outputFile}
                  download={`itnavideo-${mode || 'reel'}.mp4`}
                  rel="noreferrer"
                >
                  <Download size={16} />
                  Download MP4
                </a>
              </div>
            ) : failed ? (
              <div className="space-y-3">
                <p className="max-w-full whitespace-normal break-words rounded-lg border border-red-300/20 bg-red-500/10 px-3 py-3 text-sm font-bold leading-6 text-red-100 sm:px-4">
                  Your upload is still selected. Failed renders are not charged, so your credit stays safe. Close this message, then retry after fixing the issue.
                </p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-card px-4 py-3.5 text-[15px] font-black text-black transition hover:bg-brand-mint"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-border px-4 py-3.5 text-[15px] font-semibold text-white transition hover:bg-card/10 sm:px-8"
                >
                  ↻ Close error
                </button>
              </div>
            ) : (
              <p className="rounded-lg border border-border bg-card/[0.035] px-4 py-3 text-sm font-bold leading-6 text-muted-foreground">
                Keep this tab open. Your finished MP4 will appear here and in Your Videos.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getRenderDisplayProgress(status: JobStatus) {
  if (status.state === "ready") return 1;
  if (status.state === "error") return Math.max(0.08, Math.min(0.96, status.progress || getFailureProgress(status.reasonCode)));
  if (typeof status.progress === "number") return Math.max(status.state === "rendering" ? 0.18 : 0.08, Math.min(0.98, status.progress));
  if (status.state === "uploading") return 0.1;
  if (status.state === "starting") return 0.28;
  return 0;
}

function getOptimisticRenderProgress(attempt: number, serverProgress: unknown, currentProgress?: number) {
  const reported = typeof serverProgress === "number" && Number.isFinite(serverProgress)
    ? Math.max(0, Math.min(0.98, serverProgress))
    : 0;
  const elapsedProgress = Math.min(0.82, 0.24 + attempt * 0.006);
  return Math.max(currentProgress || 0, reported, elapsedProgress);
}

function getRenderStageMeta(status: JobStatus, mode: Mode): {
  body: string;
  badgeClass: string;
  icon: LucideIcon;
  iconFrame: string;
  kicker: string;
  kickerClass: string;
  title: string;
} {
  if (status.state === "ready") {
    return {
      body: "Your final MP4 is ready to download. The credit is counted only because the render succeeded.",
      badgeClass: "border-brand-mint/35 bg-brand-mint/[0.12] text-brand-mint",
      icon: CheckCircle2,
      iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
      kicker: "Render complete",
      kickerClass: "text-brand-mint",
      title: "Your reel is ready",
    };
  }
  if (status.state === "error") {
    return {
      body: "We could not generate this reel. Failed renders are not charged, so your credit stays safe.",
      badgeClass: "border-red-300/25 bg-red-500/10 text-red-100",
      icon: AlertTriangle,
      iconFrame: "border-red-300/25 bg-red-500/10 text-red-100",
      kicker: "Needs attention",
      kickerClass: "text-primary",
      title: "We could not generate this reel",
    };
  }
  if (status.state === "uploading") {
    return {
      body: "Uploading your file. Please keep this page open.",
      badgeClass: "border-cyan-200/25 bg-cyan-300/10 text-cyan-100",
      icon: Upload,
      iconFrame: "border-cyan-200/25 bg-cyan-300/10 text-cyan-100",
      kicker: "Media upload",
      kickerClass: "text-primary",
      title: "Uploading your file",
    };
  }
  if (status.state === "starting") {
    return {
      body: mode === "compare"
        ? "AI is transcribing your audio and preparing image comparison timing."
        : mode === "creatorBackgroundReplace"
          ? "Preparing the creator cutout and uploaded background."
          : mode === "longVideoPromo"
            ? "Preparing your thumbnail, title, and promo clip layout."
          : mode === "customAiReel"
            ? "Turning your instructions into a structured visual timeline."
            : "AI is transcribing and building the reel structure.",
      badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
      icon: Layers3,
      iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
      kicker: mode === "longVideoPro" ? "AI is planning scenes" : mode === "compare" ? "AI is transcribing" : mode === "creatorBackgroundReplace" ? "Background prep" : mode === "longVideoPromo" ? "Promo setup" : mode === "customAiReel" ? "Timeline planning" : "AI is transcribing",
      kickerClass: "text-brand-mint",
      title: mode === "longVideoPro" ? "AI is directing your video" : mode === "compare" ? "Building your comparison" : mode === "creatorBackgroundReplace" ? "Preparing background replace" : mode === "longVideoPromo" ? "Preparing your promo reel" : mode === "customAiReel" ? "Planning your custom reel" : "AI is transcribing",
    };
  }
  return {
    body: mode === "longVideoPromo"
      ? "Exporting your thumbnail, title, and promo clip. No transcription or captions are running."
      : mode === "longVideoPro"
        ? "AI is rendering your directed video with planned scenes and motion. This takes 3-10 minutes."
        : "Rendering your final MP4. Usually 2-10 minutes depending on video length, captions, and current render load.",
    badgeClass: "border-cyan-200/35 bg-cyan-300/[0.12] text-cyan-100",
    icon: Clapperboard,
    iconFrame: "border-cyan-200/35 bg-cyan-300/[0.13] text-cyan-100",
    kicker: "Rendering final MP4",
    kickerClass: "text-primary",
    title: "Rendering final MP4",
  };
}

function getRenderSteps(progress: number, status: JobStatus, mode: Mode) {
  const definitions = getRenderStepDefinitions(mode);
  const failedIndex = status.state === "error" ? getFailureStepIndex(status.failureStage || getFailureStage(status.reasonCode)) : -1;
  const activeIndex = status.state === "ready"
    ? definitions.length - 1
    : Math.max(0, definitions.findIndex((step) => progress < step.threshold));

  return definitions.map((step, index) => ({
    ...step,
    active: status.state === "error"
      ? index === failedIndex
      : status.state !== "ready" && index === (activeIndex === -1 ? definitions.length - 1 : activeIndex),
    done: status.state === "ready" || (status.state === "error" ? index < failedIndex : progress >= step.threshold),
  }));
}

function getRenderStepDefinitions(mode: Mode) {
  if (mode === "longVideoPromo") {
    return [
      {label: "Upload received", detail: "Promo clip and thumbnail are safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "Thumbnail ready", detail: "Title, thumbnail, and duration badge are prepared.", threshold: 0.24, icon: ImagePlus},
      {label: "Promo layout", detail: "Thumbnail, title, and clip are balanced for 9:16.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering final MP4", detail: "Exporting the predefined promo layout.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your promo MP4 appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "compare") {
    return [
      {label: "Upload received", detail: "Voiceover and both comparison images are uploaded.", threshold: 0.08, icon: Upload},
      {label: "AI is transcribing", detail: "Audio timing is mapped to left and right moments.", threshold: 0.24, icon: Layers3},
      {label: "Building comparison", detail: "Captions, presenter poses, and comparison beats are arranged.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering final MP4", detail: "Creating HD frames. Usually 2-10 minutes.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your comparison MP4 appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "autoDraw") {
    return [
      {label: "Upload received", detail: "Your audio or video is safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "AI is transcribing", detail: "The explanation is being split into note moments.", threshold: 0.24, icon: Layers3},
      {label: "Building notes", detail: "Whiteboard scenes, arrows, and highlights are being built.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering final MP4", detail: "Creating HD frames. Complex scenes can take longer.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your explainer MP4 appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "dynamicCreator") {
    return [
      {label: "Upload received", detail: "Your creator video is safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "AI is transcribing", detail: "Speech timing is being converted into edit moments.", threshold: 0.24, icon: Layers3},
      {label: "Building typography", detail: "Dynamic text, pacing, and creator-safe overlays are prepared.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering final MP4", detail: "Creating HD frames. Usually 2-10 minutes.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your creator reel appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "longVideoPro") {
    return [
      {label: "Upload received", detail: "Your audio/video is safely uploaded.", threshold: 0.06, icon: Upload},
      {label: "Transcribing speech", detail: "AI is detecting words, timing, and emphasis.", threshold: 0.15, icon: Layers3},
      {label: "Planning scenes", detail: "AI Director plans shot list, visuals, and motion.", threshold: 0.30, icon: Sparkles},
      {label: "Matching assets", detail: "Selecting the right visual for each scene.", threshold: 0.42, icon: ImagePlus},
      {label: "Rendering 16:9 MP4", detail: "Building cinematic frames. Longer videos take longer.", threshold: 0.88, icon: Film},
      {label: "Ready to download", detail: "Your Long Video Pro appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }

  if (mode === "customAiReel") {
    return [
      {label: "Prompt received", detail: "Your instructions and uploaded media are ready.", threshold: 0.08, icon: Upload},
      {label: "Planning timeline", detail: "Your prompt and uploaded media are becoming scenes.", threshold: 0.24, icon: Layers3},
      {label: "Building scenes", detail: "Text, images, and timing are being checked.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering final MP4", detail: "Creating HD frames. Usually 2-10 minutes.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your custom reel appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  return [
    {label: "Upload received", detail: "Your file is safely uploaded.", threshold: 0.08, icon: Upload},
    {label: "AI is transcribing", detail: "Using real speech timing from your upload.", threshold: 0.24, icon: Layers3},
    {label: "Building captions", detail: "Aligning captions and scene timing.", threshold: 0.45, icon: Sparkles},
    {label: "Rendering final MP4", detail: "Creating HD frames. Usually 2-10 minutes.", threshold: 0.85, icon: Film},
    {label: "Ready to download", detail: "Your final MP4 appears here when ready.", threshold: 0.96, icon: Clapperboard},
  ];
}

function getFailureStage(reasonCode?: string): JobStatus["failureStage"] {
  const normalized = String(reasonCode || "").toUpperCase();
  if (normalized.includes("TRANSCRIPTION") || normalized.includes("TRANSCRIPT")) return "transcript";
  if (normalized.includes("PLAN") || normalized.includes("VALIDATION") || normalized.includes("MEDIA_SOURCE")) return "planning";
  if (normalized.includes("RENDER") || normalized.includes("BACKGROUND_REPLACE") || normalized.includes("WORKER")) return "render";
  return "upload";
}

function getFailureProgress(reasonCode?: string) {
  const stage = getFailureStage(reasonCode);
  if (stage === "transcript") return 0.24;
  if (stage === "planning") return 0.58;
  if (stage === "render") return 0.82;
  return 0.12;
}

function getFailureStepIndex(stage?: JobStatus["failureStage"]) {
  if (stage === "transcript") return 1;
  if (stage === "planning") return 2;
  if (stage === "render") return 3;
  return 0;
}

function getRecentRenderStorageKey(userId: string) {
  return `itnavideo.recent-renders.${userId}`;
}

function loadRecentRenders(userId: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(getRecentRenderStorageKey(userId)) || "[]");
    const now = Date.now();
    const renders = Array.isArray(parsed)
      ? parsed.map(normalizeRecentRender).filter(isRecentRender).filter((item) => item.expiresAt > now)
      : [];
    saveRecentRenders(userId, renders);
    return renders;
  } catch {
    return [];
  }
}

function saveRecentRenders(userId: string, renders: RecentRender[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getRecentRenderStorageKey(userId), JSON.stringify(renders));
  } catch {
    // Storage can be disabled or full in some browser sessions; rendering should still work.
  }
}

function saveRecentRender(userId: string, render: RecentRender) {
  if (typeof window === "undefined") return [render];
  const existing = loadRecentRenders(userId);
  const next = mergeRecentRenders([render, ...existing]);
  saveRecentRenders(userId, next);
  return next;
}

async function loadServerRecentRenders(userId: string, localRenders: RecentRender[]) {
  const response = await fetch(`/api/reels/history?userId=${encodeURIComponent(userId)}`);
  const payload = await response.json();
  if (!response.ok || !payload.ok) return localRenders;

  const serverRenders = Array.isArray(payload.renders)
    ? payload.renders.map(normalizeServerRender).filter(isRecentRender)
    : [];
  const merged = mergeRecentRenders([...serverRenders, ...localRenders]);
  saveRecentRenders(userId, merged);
  return merged;
}

async function saveServerRecentRender(userId: string, render: RecentRender, bucketName: string) {
  const response = await fetch("/api/reels/history", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      userId,
      renderId: render.id,
      bucketName,
      mode: render.mode,
      design: render.design,
      title: render.title,
      outputFile: render.outputFile,
      createdAt: new Date(render.createdAt).toISOString(),
      expiresAt: new Date(render.expiresAt).toISOString(),
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) return null;
  return normalizeServerRender(payload.render);
}

async function deleteServerRecentRender(userId: string, renderId: string) {
  const response = await fetch("/api/reels/history", {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({userId, renderId}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Render history delete failed.");
  }
}

async function loadBillingEntitlement(userId: string): Promise<BillingEntitlement | null> {
  const cached = loadCachedBillingEntitlement(userId);
  const response = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(userId)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok || !payload.active || !payload.entitlement) return cached;

  const entitlement = normalizeBillingEntitlement(payload.entitlement);
  if (entitlement) {
    const withUsage = {
      ...entitlement,
      usage: normalizeBillingUsage(payload.usage, entitlement.monthlyVideoLimit),
    };
    try {
      window.localStorage.setItem(`itnavideo.billing.entitlement.${userId}`, JSON.stringify(withUsage));
    } catch {
      // Server state is the source of truth.
    }
    return withUsage;
  }
  return cached;
}

function loadCachedBillingEntitlement(userId: string): BillingEntitlement | null {
  try {
    const value = window.localStorage.getItem(`itnavideo.billing.entitlement.${userId}`);
    return normalizeBillingEntitlement(value ? JSON.parse(value) : null);
  } catch {
    return null;
  }
}

function normalizeBillingEntitlement(value: unknown): BillingEntitlement | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const expiresAt = typeof item.expiresAt === "string" ? item.expiresAt : "";
  if (!expiresAt || Date.parse(expiresAt) <= Date.now()) return null;
  const planName = typeof item.planName === "string" && item.planName ? item.planName : "Paid plan";
  const planId = typeof item.planId === "string" && item.planId ? item.planId : "paid";
  const monthlyVideoLimit = Math.max(0, Math.round(Number(item.monthlyVideoLimit) || 0));
  return {
    active: true,
    planId,
    planName,
    monthlyVideoLimit,
    expiresAt,
    usage: normalizeBillingUsage(item.usage, monthlyVideoLimit),
  };
}

function normalizeBillingUsage(value: unknown, fallbackLimit: number) {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const limit = Math.max(0, Math.round(Number(item.limit) || fallbackLimit || 0));
  const used = Math.max(0, Math.round(Number(item.used) || 0));
  const remaining = Math.max(0, Math.round(Number(item.remaining) || limit - used));
  return {used, limit, remaining};
}

function mergeRecentRenders(renders: RecentRender[]) {
  const now = Date.now();
  const byKey = new Map<string, RecentRender>();
  renders.map(normalizeRecentRender).filter(isRecentRender).filter((item) => item.expiresAt > now).forEach((item) => {
    const key = item.outputFile || item.id;
    const existing = byKey.get(key);
    if (!existing || item.createdAt > existing.createdAt) byKey.set(key, item);
  });
  return Array.from(byKey.values()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);
}

function normalizeServerRender(value: unknown): RecentRender | null {
  return normalizeRecentRender(value);
}

function normalizeRecentRender(value: unknown): RecentRender | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const createdAt = parseServerTime(item.createdAt);
  const expiresAt = parseServerTime(item.expiresAt);
  const mode = normalizeRenderMode(item.mode);
  const id = typeof item.renderId === "string" && item.renderId ? item.renderId : typeof item.id === "string" ? item.id : "";
  const outputFile = typeof item.outputFile === "string" ? item.outputFile : "";

  if (!id || !mode || !outputFile || !createdAt || !expiresAt) return null;
  return {
    id,
    title: typeof item.title === "string" && item.title ? item.title : "Itnavideo reel",
    mode,
    design: typeof item.design === "string" && item.design ? item.design : "Auto from script",
    outputFile,
    createdAt,
    expiresAt,
  };
}

function parseServerTime(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || !value.trim()) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isRecentRender(value: unknown): value is RecentRender {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RecentRender>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    Boolean(normalizeRenderMode(item.mode)) &&
    typeof item.outputFile === "string" &&
    typeof item.createdAt === "number" &&
    typeof item.expiresAt === "number"
  );
}

function normalizeRenderMode(value: unknown): Mode | null {
  const normalized = String(value || "").toLowerCase().replace(/[-_\s]+/g, "");
  if (!normalized) return null;
  if (normalized === "autocaption" || normalized === "autocaptionreel" || normalized === "autocaptiongenerator" || normalized === "caption" || normalized === "captions" || normalized === "subtitle" || normalized === "videocaption" || normalized === "captionstudio" || normalized === "customcaption" || normalized === "customcaptions" || normalized === "advancedcaption" || normalized === "longcaptionpro" || normalized === "longcaption") return "autoCaption";
  if (normalized === "compare" || normalized === "comparison" || normalized === "compareexplainer" || normalized === "vs") return "compare";
  if (normalized === "autodraw" || normalized === "autodrawexplainer" || normalized === "whiteboard") return "autoDraw";
  if (normalized === "longvideopromo" || normalized === "longvideopromotion" || normalized === "promo") return "longVideoPromo";
  if (normalized === "longformcaptioned" || normalized === "longvideocaptioned") return "autoCaption";
  if (normalized === "whiteboardvideo" || normalized === "whiteboardreel") return "whiteboardVideo";
  if (normalized === "typographyvideo" || normalized === "typographyreel" || normalized === "boldreel") return "typographyVideo";
  if (normalized === "multiimagesvideo" || normalized === "multiimages" || normalized === "multiimagevideo") return "multiImagesVideo";
  if (normalized === "longvideoclips" || normalized === "longvideoclip" || normalized === "videoclips") return "longVideoClips";
  if (normalized === "dynamiccreator" || normalized === "dynamiccreatorreel" || normalized === "dynamicedit") return "dynamicCreator";
  if (normalized === "creatorbackgroundreplace" || normalized === "backgroundreplace" || normalized === "videobackgroundimage") return "creatorBackgroundReplace";
  if (normalized === "customaireel" || normalized === "customai" || normalized === "customreel") return "customAiReel";
  if (normalized === "audioclean" || normalized === "audiocleaner" || normalized === "aiaudiocleaner") return "audioClean";
  if (normalized === "aivideogenerator" || normalized === "aivideo" || normalized === "textovideo" || normalized === "scripttovideo" || normalized === "facelesslongvideo" || normalized === "facelessvideo" || normalized === "faceless" || normalized === "longvideopro" || normalized === "longvideo" || normalized === "aidirector" || normalized === "aidirectorreel" || normalized === "directorreel") return "facelessVideo";
  return null;
}

function getModeLabel(mode: Mode) {
  return modeConfig[toActiveDashboardMode(mode)]?.label || "Auto Caption";
}

function readDashboardMode(value: string | null): Mode | null {
  const normalized = String(value || "").toLowerCase().replace(/[-_\s]+/g, "");
  if (!normalized) return null;
  if (normalized === "aivideogenerator" || normalized === "aivideo" || normalized === "textovideo" || normalized === "scripttovideo" || normalized === "facelesslongvideo" || normalized === "facelessvideo" || normalized === "faceless" || normalized === "longvideopro" || normalized === "longvideo" || normalized === "aidirector" || normalized === "aidirectorreel" || normalized === "directorreel") return "facelessVideo";
  if (normalized === "autocaptiongenerator" || normalized === "autocaptionreel" || normalized === "autocaption" || normalized === "captiongenerator" || normalized === "captionstudio" || normalized === "customcaption" || normalized === "longcaptionpro" || normalized === "longcaption") return "autoCaption";
  if (normalized === "compareexplainer" || normalized === "compare" || normalized === "comparison") return "compare";
  if (normalized === "autodrawexplainer" || normalized === "autodraw") return "autoDraw";
  if (normalized === "whiteboardvideo" || normalized === "whiteboardreel") return "whiteboardVideo";
  if (normalized === "typographyvideo" || normalized === "typographyreel" || normalized === "boldreel") return "typographyVideo";
  if (normalized === "multiimagesvideo" || normalized === "multiimages" || normalized === "multiimagevideo") return "multiImagesVideo";
  if (normalized === "longvideopromo" || normalized === "longvideopromotion" || normalized === "promo") return "longVideoPromo";
  if (normalized === "longformcaptioned" || normalized === "longvideocaptioned") return "autoCaption";
  if (normalized === "dynamiccreatorreel" || normalized === "dynamiccreator" || normalized === "dynamicedit") return "dynamicCreator";
  if (normalized === "creatorbackgroundreplace" || normalized === "backgroundreplace" || normalized === "videobackgroundimage") return "creatorBackgroundReplace";
  if (normalized === "customaireel" || normalized === "customai" || normalized === "customreel") return "customAiReel";
  if (normalized === "longvideoclips" || normalized === "longvideoclip" || normalized === "videoclips") return "longVideoClips";
  if (normalized === "audioclean" || normalized === "audiocleaner" || normalized === "aiaudiocleaner") return "audioClean";
  if (normalized === "aidirectorreel" || normalized === "aidirector" || normalized === "directorreel" || normalized === "longvideopro") return "facelessVideo";
  if (normalized.includes("caption") || normalized.includes("subtitle")) return "autoCaption";
  if (normalized.includes("compare")) return "compare";
  if (normalized.includes("whiteboard")) return "whiteboardVideo";
  if (normalized.includes("draw")) return "autoDraw";
  if (normalized.includes("promo")) return "longVideoPromo";
  if (normalized.includes("clip")) return "longVideoClips";
  if (normalized.includes("custom")) return "customAiReel";
  if (normalized.includes("dynamic") || normalized.includes("creator")) return "dynamicCreator";
  if (normalized.includes("background")) return "creatorBackgroundReplace";
  return null;
}

function formatTimeLeft(expiresAt: number) {
  const hours = Math.max(0, Math.ceil((expiresAt - Date.now()) / (60 * 60 * 1000)));
  if (hours <= 1) return "expires soon";
  return `${hours}h left`;
}

function formatCreatedTime(createdAt: number) {
  if (!createdAt) return "Created recently";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function getVideoStatusLabel(expiresAt: number) {
  return expiresAt > Date.now() ? "Ready" : "Expired";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "this billing period";
  return date.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid min-w-0 max-w-full gap-1.5 overflow-hidden">
      <span className="flex min-w-0 items-center justify-between gap-3 text-[11px] font-bold text-muted-foreground">
        <span>{label}</span>
        <span className="shrink-0 font-mono text-muted-foreground">{Number(value).toFixed(step < 1 ? 2 : 0)}</span>
      </span>
      <input
        className="block w-full min-w-0 max-w-full accent-orange-300"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function CreatorBackgroundLivePreview({
  creatorFile,
  backgroundFile,
  settings,
}: {
  creatorFile: File;
  backgroundFile: File;
  settings: CreatorBackgroundSettings;
}) {
  const creatorUrl = useMemo(() => URL.createObjectURL(creatorFile), [creatorFile]);
  const backgroundUrl = useMemo(() => URL.createObjectURL(backgroundFile), [backgroundFile]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(creatorUrl);
      URL.revokeObjectURL(backgroundUrl);
    };
  }, [creatorUrl, backgroundUrl]);

  return (
    <div className="mt-4 min-w-0 max-w-full overflow-hidden">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-orange-100">Live preview</p>
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[190px] overflow-hidden rounded-lg border border-orange-300/20 bg-black sm:max-w-[240px]">
        <Image
          alt="Uploaded background preview"
          className="absolute inset-0 h-full w-full"
          fill
          sizes="240px"
          src={backgroundUrl}
          style={{
            objectFit: settings.backgroundFit,
            transform: `translate(${settings.backgroundX}px, ${settings.backgroundY}px) scale(${settings.backgroundScale})`,
            transformOrigin: "center",
          }}
          unoptimized
        />
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-contain"
          loop
          muted
          playsInline
          src={creatorUrl}
          style={{
            transform: `translate(${settings.creatorX}px, ${settings.creatorY}px) scale(${settings.creatorScale})`,
            transformOrigin: "center bottom",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <p className="mx-auto mt-2 max-w-[240px] text-center text-[11px] leading-5 text-muted-foreground">
        Preview updates instantly. Final export uses these exact values.
      </p>
    </div>
  );
}

function PolicyPill({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/[0.035] p-4">
      <Icon className="mb-3" size={18} style={{ color: 'var(--color-primary-hover)' }} />
      <p className="text-sm font-black text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function ProgressPreview({mode}: {mode: Mode}) {
  const steps = mode === "compare"
      ? ["Audio", "Images", "Compare", "Render", "Download"]
      : mode === "creatorBackgroundReplace"
        ? ["Video", "Image", "Adjust", "Render", "Download"]
        : mode === "customAiReel"
          ? ["Prompt", "Media", "Timeline", "Render", "Download"]
        : mode === "longVideoPromo"
          ? ["Clip", "Thumbnail", "Title", "Render", "Download"]
    : ["Upload", "Transcribe", "Plan", "Render", "Download"];

  return (
    <div className="rounded-lg border border-border bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">What happens next</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div className="flex items-center gap-2" key={step}>
            <span className="rounded-md border border-border bg-card/[0.04]" style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark-secondary)' }}>
              {step}
            </span>
            {index < steps.length - 1 ? <span className="text-xs font-black text-zinc-600">&gt;</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedMediaPreview({ file, mode }: { file: File; mode: Mode }) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="mt-4 w-full max-w-full overflow-hidden rounded-lg border border-border bg-muted p-2 sm:p-3">
      {getFileMediaType(file) === "image" ? (
        <Image
          alt="Selected image preview"
          className="max-h-72 w-full rounded-md bg-black object-contain"
          height={540}
          src={previewUrl}
          width={960}
          unoptimized
        />
      ) : getFileMediaType(file) === "audio" ? (
        <audio className="w-full max-w-full" controls preload="metadata" src={previewUrl} />
      ) : mode === "creatorBackgroundReplace" ? (
        <div className="mx-auto aspect-[9/16] max-h-56 w-full max-w-[170px] overflow-hidden rounded-md bg-black sm:max-h-72 sm:max-w-[210px]">
          <video
            className="h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
            src={previewUrl}
          />
        </div>
      ) : (
        <video
          className="max-h-64 w-full rounded-md bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          src={previewUrl}
        />
      )}
    </div>
  );
}

function UploadedImagePreview({alt, className, file}: {alt: string; className?: string; file: File}) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return <Image alt={alt} className={className} height={360} src={previewUrl} unoptimized width={480} />;
}

function UploadMiniCard({file, label, onRemove}: {file: File; label: string; onRemove: () => void}) {
  const mediaType = getFileMediaType(file);
  const MediaIcon = mediaType === "video" ? Film : mediaType === "audio" ? Mic : ImagePlus;
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card/[0.035] p-2">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-black/45">
        {mediaType === "image" ? (
          <UploadedImagePreview alt={label} className="h-full w-full object-cover" file={file} />
        ) : (
          <div className="grid h-full w-full place-items-center bg-sky-300/[0.08] text-sky-100">
            <MediaIcon size={22} />
          </div>
        )}
      </div>
      <div className="mt-2 flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black text-white">{label}</p>
          <p className="mt-0.5 truncate text-[10px] font-bold text-muted-foreground">{file.name}</p>
        </div>
        <button
          aria-label={`Remove ${label}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-red-300/20 bg-red-500/10 text-red-100 transition hover:bg-red-500 hover:text-foreground"
          onClick={onRemove}
          type="button"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

async function readJsonPayload(response: Response) {
  const httpStatus = response.status;
  const contentType = response.headers.get("content-type") || "";

  try {
    const rawText = await response.text();

    if (!rawText) {
      return {httpStatus, rawText: ""};
    }

    if (contentType.includes("application/json")) {
      try {
        return {...JSON.parse(rawText), httpStatus};
      } catch {
        return {httpStatus, rawText};
      }
    }

    try {
      return {...JSON.parse(rawText), httpStatus};
    } catch {
      return {httpStatus, rawText};
    }
  } catch (error) {
    return {
      httpStatus,
      error: error instanceof Error ? error.message : "Could not read server response.",
    };
  }
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatNetworkError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  if (error.message === "Failed to fetch") {
    return `${fallback} Browser blocked or could not reach the request. Please retry after checking the connection.`;
  }
  return sanitizeUserFacingStatus(error.message || fallback);
}

function formatFounderDiagnostics(parts: string[]) {
  if (!parts.length) return [];
  return parts
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((part) => part.slice(0, 220));
}

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || "");
  const normalized = source.toLowerCase();
  if (/background replace video is temporarily unavailable|background replace worker is not configured|background_replace_worker_not_configured|background_replace_worker_not_ready|creator_bg_replace_worker_url|background_replace_worker_url|background processor is not ready|creator-background-replace-preflight/.test(normalized)) {
    return "Background Replace Video is temporarily unavailable. Please try again later or choose another video type.";
  }
  if (/rate exceeded|too many requests|toomanyrequests|concurr|limit exceeded|throttl/.test(normalized)) {
    return "Render traffic is high right now. Your upload stays selected, so please retry in a minute.";
  }
  if (/timed out|timeout|chunks are missing|missing chunks|main function/i.test(source)) {
    return "Render took too long with the current workload. Please retry in a minute; the render system has split the job into smaller parts.";
  }

  return source
    .replace(/\s+at\s+[\s\S]*$/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bTRANSCRIPTION_FAILED\b/gi, "We could not detect clear speech in your upload.")
    .replace(/\bTRANSCRIPT_REQUIRED\b/gi, "We could not detect clear speech in your upload.")
    .replace(/\bUNSUPPORTED_MEDIA_FOR_TEMPLATE\b/gi, "This file type does not match the selected video type.")
    .replace(/\bMISSING_MEDIA_SOURCE\b/gi, "Please upload a supported file before creating your reel.")
    .replace(/\b(?:REMOTION|GROQ|OPENAI|AWS|S3|FFMPEG)[A-Z0-9_]*\b/g, "render system")
    .replace(/\bGroq\b/gi, "transcription service")
    .replace(/\bAWS Lambda\b/gi, "render system")
    .replace(/\bAWS\b/gi, "render")
    .replace(/\bLambda\b/gi, "render system")
    .replace(/\bRemotion\b/gi, "video renderer")
    .replace(/\bS3\b/gi, "secure storage")
    .replace(/\bffmpeg\b/gi, "media processor")
    .replace(/\bOpenAI\b/gi, "AI planner")
    .trim() || "Something went wrong. Please try again.";
}








































