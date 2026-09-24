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
import { ImageToVideoStudio } from '@/components/dashboard/ImageToVideoStudio';
import { AutoCaptionsStudio } from '@/components/dashboard/AutoCaptionsStudio';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
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

type Mode =
  | "compare"
  | "autoCaption"
  | "autoDraw"
  | "longVideoPromo"
  | "dynamicCreator"
  | "customAiReel"
  | "whiteboardVideo"
  | "typographyVideo"
  | "longVideoClips"
  | "audioClean"
  | "longVideoPro"
  | "facelessVideo"
  | "imageToVideoAi"
  | "aiVideoGenerator"
  | "youtubeSubtitleGenerator";
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

type ClipStatus = {
  clipIndex: number;
  renderId: string;
  bucketName: string;
  outName: string;
  startSeconds: number;
  endSeconds: number;
  title: string;
  durationSeconds: number;
  headline?: string;
  viralityScore?: number;
  viralityGrade?: string;
  whyItWorks?: string;
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
  { id: "youtube-subtitle-generator", title: "YouTube Subtitle Generator", tag: "16:9 YouTube • Max 15 Min", description: "Generate clean, professional subtitles for 16:9 landscape YouTube videos, podcasts, tutorials & lectures.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png", badgeType: "Popular" as const, accent: "#F59E0B", mode: "youtubeSubtitleGenerator" as const, category: "long", inputType: "video" as const, accessTier: "paid" as const, creditCost: "1 Credit / 2 Min • Paid" },
  { id: "auto-caption-generator", title: "Auto Caption Generator", tag: "9:16 Reel • 🎁 1 Free Video", description: "Generate animated word-level captions for 9:16 vertical Reels, Shorts & TikTok videos.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png", badgeType: "Popular" as const, accent: "#F59E0B", mode: "autoCaption" as const, category: "creator", inputType: "video" as const, accessTier: "free" as const, creditCost: "🎁 Free Trial / 1 Credit/Min" },
  { id: "compare-explainer", title: "Compare Explainer Video", tag: "Comparison", description: "Left vs right comparison with narration and sticker presenter.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788974553/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-welcome.png", badgeType: "AI" as const, accent: "#F59E0B", mode: "compare" as const, category: "education", inputType: "text" as const, accessTier: "paid" as const, creditCost: "1 Credit / Min • Paid" },
  { id: "whiteboard-video", title: "Whiteboard Video", tag: "Whiteboard", description: "AI writes key points on a premium corporate board synced to your speech.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png", badgeType: "AI" as const, accent: "#00FF9D", mode: "whiteboardVideo" as const, category: "education", inputType: "audio" as const, accessTier: "paid" as const, creditCost: "1 Credit / Min • Paid" },
  { id: "typography-video", title: "Typography Video", tag: "9:16 Typography Reel", description: "Turn talking video or voiceover into viral 9:16 reels with punchy kinetic typography & synced sound effects.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png", badgeType: "Popular" as const, accent: "#F59E0B", mode: "typographyVideo" as const, category: "creator", inputType: "video" as const, accessTier: "paid" as const, creditCost: "1 Credit / Min • Paid" },
  { id: "long-video-promo", title: "Long Video Promo", tag: "Promo", description: "Promote your YouTube video as a vertical Short/Reel.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png", badgeType: undefined, accent: "#F59E0B", mode: "longVideoPromo" as const, category: "creator", inputType: "video" as const, accessTier: "paid" as const, creditCost: "1 Credit • Paid" },
  { id: "ai-audio-cleaner", title: "AI Audio Cleaner", tag: "Long Audio", description: "Full script preview in dashboard • Auto removes recording mistakes, silences & noise.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png", badgeType: "Pro" as const, accent: "#F59E0B", mode: "audioClean" as const, category: "long", inputType: "audio" as const, accessTier: "paid" as const, creditCost: "1 Credit / 5 Min • Paid" },
  { id: "long-video-clips", title: "Long Video Clips", tag: "Podcast Clips", description: "Turn long videos and podcasts into short viral clips with captions.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png", badgeType: "New" as const, accent: "#F59E0B", mode: "longVideoClips" as const, category: "long", inputType: "video" as const, accessTier: "paid" as const, creditCost: "2 Base + 1/Clip • Paid" },
  { id: "faceless-video", title: "Faceless Video", tag: "16:9 YouTube • Max 20 Min", description: "Turn up to 20 min voiceover into complete 16:9 videos with curated AI visuals, Canva backgrounds & captions.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png", badgeType: "AI" as const, accent: "#F59E0B", mode: "facelessVideo" as const, category: "long", inputType: "audio" as const, accessTier: "paid" as const, creditCost: "2 Credits / Min • Paid" },
  { id: "image-to-video-ai", title: "Image to Video AI", tag: "16:9 Widescreen • Max 15 Min", description: "Turn up to 15 min voiceover into cinematic 16:9 videos with images, Ken Burns motion, 2.5D parallax subtitles & transitions.", image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788780290/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png", badgeType: "New" as const, accent: "#8B5CF6", mode: "imageToVideoAi" as const, category: "long", inputType: "audio" as const, accessTier: "paid" as const, creditCost: "2 Credits / Min • Paid" },
] as const;

function getPlannedRenderCreditUnits(mode: Mode, durationSeconds?: number, clipCount = 3) {
  try {
    if (mode === "longVideoClips") {
      return calculateRenderCreditUnits("longVideoClips", {clipCount});
    }
    const billableModes: BillableRenderMode[] = ["autoCaption", "compare", "longVideoPromo", "whiteboardVideo", "typographyVideo", "longVideoPro", "facelessVideo", "imageToVideoAi", "aiVideoGenerator", "youtubeSubtitleGenerator"];
    return billableModes.includes(mode as BillableRenderMode)
      ? calculateRenderCreditUnits(mode as BillableRenderMode, {durationSeconds})
      : 0;
  } catch {
    return 0;
  }
}

const modeConfig = {
  autoCaption: {
    label: "Auto Caption Generator",
    title: "Auto Caption Generator",
    description: "📹 Upload: Vertical video with speech (9:16 Reel/Shorts/TikTok)\nAI generates word-synced animated captions",
    accept: "video/*",
    supported: "MP4, MOV, WEBM",
    bestResult: "9:16 vertical videos with clear voice (1 credit per min)",
    uploadCta: "📹 Upload your 9:16 video",
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
    description: "🎙️ Upload: Voiceover or podcast audio (up to 15 mins)\n✨ AI generates full script preview, cuts recording mistakes, dead pauses & filler words",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC, FLAC • Up to 15 minutes",
    bestResult: "Podcasts, voiceovers, lectures, or raw audio takes",
    uploadCta: "🎙️ Upload your audio (up to 15 mins)",
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
  imageToVideoAi: {
    label: "Image to Video AI",
    title: "Image to Video AI (16:9 Widescreen)",
    description: "🎙️ Upload: Voiceover audio (required)\n🖼️ Optional: Multiple images (no limit) or use auto-curated visuals\n✨ AI syncs scenes, Ken Burns pan & zoom, 2.5D parallax subtitles & transitions",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC • Up to 10 minutes",
    bestResult: "Podcasts, storytelling, explainers & presentations in 16:9 format",
    uploadCta: "🎙️ Upload your voiceover / audio (Max 10 min)",
    icon: Film,
    color: "text-purple-400",
    border: "border-purple-400/40",
    surface: "bg-purple-950/20",
  },
  youtubeSubtitleGenerator: {
    label: "YouTube Subtitle Generator",
    title: "YouTube Subtitle Generator (16:9 Landscape)",
    description: "📹 Upload: 16:9 Landscape video (up to 15 mins)\n✨ Clean, professional subtitles used by top YouTube creators & podcasts",
    accept: "video/*",
    supported: "MP4, MOV, WEBM • Up to 15 minutes",
    bestResult: "16:9 landscape YouTube videos (1 credit for 2 min)",
    uploadCta: "📹 Upload 16:9 video (Max 15 min)",
    icon: Captions,
    color: "text-red-500",
    border: "border-red-500/40",
    surface: "bg-red-950/20",
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

export interface DashboardStudioProps {
  initialMode?: Mode;
  standalone?: boolean;
}

export default function DashboardStudio({
  initialMode,
  standalone = false,
}: DashboardStudioProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode || "autoCaption");
  const [hasUserSelected, setHasUserSelected] = useState<boolean>(standalone || false);
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
  const [stickerStyle, setStickerStyle] = useState<string>("3d-presenter-man");
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
  const [wordClickSound, setWordClickSound] = useState<boolean>(true);

  // YouTube Subtitle Generator Safe Margin & Case
  const [youtubeSubtitleSafeZone, setYoutubeSubtitleSafeZone] = useState<"standard" | "scrubber" | "high">("scrubber");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("natural");

  // Auto Caption Kinetic & Color options
  const [captionEmphasisAnimation, setCaptionEmphasisAnimation] = useState<"bounce" | "glow" | "box" | "none">("bounce");

  // Compare Explainer Additional Controls
  const [compareCaptionStyle, setCompareCaptionStyle] = useState<string>("Warikoo Black Card");
  const [compareSpeakingPace, setCompareSpeakingPace] = useState<"1.0" | "1.15" | "1.25">("1.15");
  const [compareBgmTrack, setCompareBgmTrack] = useState<"tech" | "versus" | "corporate" | "none">("versus");

  // Typography Video Additional Controls
  const [typographySfxIntensity, setTypographySfxIntensity] = useState<"full" | "subtle" | "none">("full");
  const [typographyPacing, setTypographyPacing] = useState<"fast" | "smooth">("fast");
  const [typographyTextCase, setTypographyTextCase] = useState<"uppercase" | "natural">("uppercase");

  // Long Video Promo Additional Controls
  const [promoCtaStyle, setPromoCtaStyle] = useState<"youtube-red" | "emerald" | "glass" | "tiktok-yellow">("youtube-red");
  const [promoCreatorHandle, setPromoCreatorHandle] = useState<string>("");
  const [promoBackgroundMode, setPromoBackgroundMode] = useState<"blur" | "solid">("blur");
  const [promoEnableCaptions, setPromoEnableCaptions] = useState<boolean>(false);

  // Whiteboard Video Additional Controls
  const [whiteboardTheme, setWhiteboardTheme] = useState<"classic" | "dark-glass" | "blueprint">("classic");
  const [whiteboardHandStyle, setWhiteboardHandStyle] = useState<"right-hand" | "stylus" | "direct-draw">("right-hand");
  const [whiteboardMarkerColor, setWhiteboardMarkerColor] = useState<"navy" | "crimson" | "emerald" | "gold">("navy");
  const [whiteboardFont, setWhiteboardFont] = useState<"marker" | "architect" | "sans">("marker");

  // AI Audio Cleaner Additional Controls
  const [audioCleanFormat, setAudioCleanFormat] = useState<"wav" | "mp3" | "m4a">("wav");
  const [audioCleanNoiseLevel, setAudioCleanNoiseLevel] = useState<"subtle" | "balanced" | "aggressive">("balanced");
  const [audioCleanVocalTone, setAudioCleanVocalTone] = useState<"warmth" | "clarity" | "natural">("warmth");

  // Long Video Clips Additional Controls
  const [clipsAspectRatio, setClipsAspectRatio] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [clipsHookStrategy, setClipsHookStrategy] = useState<"high-energy" | "actionable" | "story">("high-energy");
  const [clipsTopBanner, setClipsTopBanner] = useState<"none" | "glass-pill" | "yellow-ticker">("glass-pill");

  // Faceless Video Additional Controls
  const [facelessMotionIntensity, setFacelessMotionIntensity] = useState<"ambient" | "dynamic">("dynamic");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "none">("lofi");
  const [facelessBgmVolume, setFacelessBgmVolume] = useState<number>(0.25);
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
    noiseReduction: true,
    volumeNormalize: true,
    trimEnds: true,
    playbackSpeed: 1.0,
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
    originalUrl?: string;
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
  const [imageToVideoImages, setImageToVideoImages] = useState<File[]>([]);
  const [imageToVideoBgmEnabled, setImageToVideoBgmEnabled] = useState<boolean>(true);
  const [imageToVideoLibraryBgmUrl, setImageToVideoLibraryBgmUrl] = useState<string>(
    "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093179/wealth-building_kyg9kb.mp3"
  );
  const [imageToVideoBgm, setImageToVideoBgm] = useState<File | null>(null);
  const [imageToVideoBgmVolume, setImageToVideoBgmVolume] = useState<number>(0.15);
  const [imageToVideoSubtitleStyle, setImageToVideoSubtitleStyle] = useState<string>("parallax-modern");
  const [imageToVideoCameraMotion, setImageToVideoCameraMotion] = useState<string>("ken-burns");
  const [imageToVideoFitMode, setImageToVideoFitMode] = useState<"blur-fill" | "cover">("cover");
  const [imageToVideoAssetMode, setImageToVideoAssetMode] = useState<"upload" | "library" | "ai-generate">("library");
  const [imageToVideoStockUrls, setImageToVideoStockUrls] = useState<string[]>([]);
  const [imageToVideoVisualStyle, setImageToVideoVisualStyle] = useState<"2d" | "3d" | "realistic">("realistic");
  const [imageToVideoCharacterFile, setImageToVideoCharacterFile] = useState<File | null>(null);
  const [imageToVideoCharacterDnaHint, setImageToVideoCharacterDnaHint] = useState<string>("");
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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'free' | 'paid' | 'shorts' | 'long' | 'audio' | 'video' | 'text' | 'ai_prompt'>('all');
  const [activeTab, setActiveTab] = useState<"video-types" | "credits" | "projects" | "profile">("video-types");
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // ── Preview Editor state ────────────────────────────────────────────────────
  // Stores pending upload keys + preview plan between "Generate Preview" and final render
  const [previewPlan, setPreviewPlan] = useState<import("@/components/preview/types").PreviewPlan | null>(null);
  const [pendingRenderKeys, setPendingRenderKeys] = useState<{
    mediaKey: string;
    comparisonImageKeys: string[];
    promoThumbnailKey: string;
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
        window.history.replaceState(null, "", window.location.pathname);
      }
      if (!initialMode) {
        const requestedMode = params.get("mode");
        const requestedVideoType = params.get("videoType") || params.get("template");
        const nextMode = readDashboardMode(requestedMode || requestedVideoType);

        if (nextMode) {
          const timer = window.setTimeout(() => {
            setMode(nextMode);
            if (nextMode === "youtubeSubtitleGenerator") {
              setCaptionStyle("Ali Abdaal Clean Pill");
              setCaptionPosition("bottom");
            }
            setHasUserSelected(true);
            setSelectedFile(null);
            setComparisonFiles([]);
          }, 0);
          return () => window.clearTimeout(timer);
        }
      } else {
        if (initialMode === "youtubeSubtitleGenerator") {
          setCaptionStyle("Ali Abdaal Clean Pill");
          setCaptionPosition("bottom");
        }
      }
    } catch (error) {
      console.warn("Could not read dashboard video type params:", error);
    }
    return undefined;
  }, [initialMode]);

  const activeModeKey = toActiveDashboardMode(mode);
  const activeMode = modeConfig[activeModeKey];
  const isFounderDebugUser =
    user?.email?.toLowerCase() === "itnavideo@gmail.com" ||
    user?.email?.toLowerCase() === "rohi@itnavideo.com" ||
    Boolean(user?.email?.toLowerCase().includes("akram")) ||
    Boolean(user?.email?.toLowerCase().includes("itnavideo")) ||
    (typeof window !== "undefined" && (window.location.search.includes("debug=1") || window.localStorage?.getItem("itnavideo_debug") === "true"));
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
  const isFreeTrialMode = mode === "autoCaption";
  const isPaidUserWithCredits = Boolean(
    billingEntitlement?.active &&
    billingEntitlement.planId !== "free-signup-credit" &&
    (typeof paidRemaining !== "number" || paidRemaining > 0)
  );
  const isPaidModeLocked = !isFreeTrialMode && !isPaidUserWithCredits;
  const isFreeTrialModeBlocked = isFreeSignupCredit && !isFreeTrialMode;
  const isCaptionOnlyModeBlocked = false;
  const creditResetLabel = isFreeSignupCredit ? "Auto Caption only · watermark included" : billingEntitlement?.expiresAt ? `Valid until ${formatDate(String(billingEntitlement.expiresAt))}` : "";
  const plannedCreditUnits = getPlannedRenderCreditUnits(mode, promoClipMeta.durationSeconds, clipCount);
  const plannedCreditCost = plannedCreditUnits ? formatCreditUnits(plannedCreditUnits) : "—";
  const plannedCreditLabel = plannedCreditUnits
    ? `${plannedCreditCost} credit${plannedCreditCost === "1" ? "" : "s"}`
    : "Cost shown before render";
  const plannedCreditDetail = mode === "longVideoClips"
    ? "2-credit base + 1 per clip"
    : mode === "youtubeSubtitleGenerator"
    ? promoClipMeta.durationSeconds
      ? `${Math.ceil(promoClipMeta.durationSeconds / 60)} min video (${Math.round(promoClipMeta.durationSeconds)}s)`
      : "1 credit for 2 min"
    : mode === "autoCaption"
    ? promoClipMeta.durationSeconds
      ? `${Math.ceil(promoClipMeta.durationSeconds / 60)} min video (${Math.round(promoClipMeta.durationSeconds)}s)`
      : "1 credit per minute"
    : plannedCreditUnits ? "per video" : "available after setup";
  const hasUserSelectedMedia = Boolean(
    selectedFile ||
    (mode === "customAiReel" && (customAiPrompt.trim().length >= 12 || customAiImageFiles.length > 0 || Boolean(customAiVideoFile) || Boolean(customAiAudioFile))) ||
    (mode === "compare" && comparisonFiles.length > 0) ||
    (mode === "imageToVideoAi" && imageToVideoImages.length > 0)
  );
  const canPrepareReel = Boolean(
    (mode === "customAiReel" ? customAiPrompt.trim().length >= 12 : selectedFile) &&
    (mode !== "compare" || comparisonFiles.length === 2) &&
    (mode !== "longVideoPromo" || (Boolean(promoThumbnailFile) && Boolean(promoTitle.trim()))) &&
    (mode !== "audioClean" || !isAnalyzingAudio) &&
    !renderInProgress &&
    !paidLimitComplete &&
    !isPaidModeLocked &&
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
    const dedicatedRoutes: Partial<Record<Mode, string>> = {
      imageToVideoAi: "/dashboard/image-to-video",
      youtubeSubtitleGenerator: "/dashboard/youtube-subtitles",
      autoCaption: "/dashboard/auto-caption",
      compare: "/dashboard/compare-explainer",
      whiteboardVideo: "/dashboard/whiteboard-video",
      typographyVideo: "/dashboard/typography-video",
      longVideoPromo: "/dashboard/long-video-promo",
      audioClean: "/dashboard/audio-cleaner",
      longVideoClips: "/dashboard/long-video-clips",
      facelessVideo: "/dashboard/faceless-video",
    };
    const targetRoute = dedicatedRoutes[nextMode];
    if (targetRoute) {
      router.push(targetRoute);
      return;
    }
    setMode(nextMode);
    trackVideoTypeSelect(
      nextMode,
      ["youtubeSubtitleGenerator", "imageToVideoAi", "facelessVideo"].includes(nextMode)
        ? "16:9 Landscape"
        : "9:16 Shorts"
    );
    if (nextMode === "youtubeSubtitleGenerator") {
      setCaptionStyle("Ali Abdaal Clean Pill");
      setCaptionPosition("bottom");
    }
    setHasUserSelected(true);
    setSelectedFile(null);
    setComparisonFiles([]);
    setPromoThumbnailFile(null);
    setPromoTitle("");
    setPromoCtaText("");
    setPromoClipMeta({});
    setCustomAiPrompt("");
    setCustomAiImageFiles([]);
    setCustomAiLogoFile(null);
    setCustomAiVideoFile(null);
    setCustomAiAudioFile(null);
    setCustomAiVideoMeta({});
    setCustomAiAudioMeta({});
    setImageToVideoImages([]);
    setImageToVideoBgm(null);
    setTopicTitle("");
    setJobStatus({state: "idle", message: ""});
    const nextVideoType = nextMode === "imageToVideoAi" ? "image-to-video-ai" : nextMode === "youtubeSubtitleGenerator" ? "youtube-subtitle-generator" : nextMode === "autoCaption" ? "auto-caption-generator" : nextMode === "autoDraw" ? "auto-draw-explainer" : nextMode === "longVideoPromo" ? "long-video-promo" : nextMode === "whiteboardVideo" ? "whiteboard-video" : nextMode === "typographyVideo" ? "typography-video" : nextMode === "longVideoClips" ? "long-video-clips" : nextMode === "dynamicCreator" ? "dynamic-creator-reel" : nextMode === "customAiReel" ? "custom-ai-reel" : nextMode === "audioClean" ? "ai-audio-cleaner" : nextMode === "longVideoPro" ? "long-video-pro" : "compare-explainer";
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
    trackFileUpload({
      fileType: file.type || "unknown",
      fileSizeMb: file.size / (1024 * 1024),
      mode,
    });
    setPromoClipMeta({});
    setJobStatus({state: "idle", message: ""});

    if (isPaidModeLocked) {
      setShowUpgradeModal(true);
    }
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
    if ((mode !== "longVideoPromo" && mode !== "autoCaption") || !selectedFile || !selectedFile.type.startsWith("video/")) {
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

      const ratio = width && height ? width / height : (mode === "autoCaption" ? 9 / 16 : 16 / 9);
      const mediaAspect = ratio < 0.85 ? "portrait" : ratio > 1.25 ? "landscape" : "1:1";
      // Auto caption & YouTube Subtitle Generator have dynamic length
      const durationSeconds = rawDurationSeconds
        ? (mode === "youtubeSubtitleGenerator"
            ? Math.max(1, Math.min(15 * 60, rawDurationSeconds))
            : mode === "autoCaption"
            ? Math.max(1, rawDurationSeconds)
            : Math.max(8, Math.min(60, rawDurationSeconds)))
        : undefined;
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
    if (isPaidModeLocked) {
      setShowUpgradeModal(true);
    }
  };

  const removeCustomAiImage = (indexToRemove: number) => {
    setCustomAiImageFiles((current) => current.filter((_, index) => index !== indexToRemove));
    setJobStatus({state: "idle", message: ""});
  };

  const handleAddImageToVideoImages = (files: FileList | null) => {
    const nextFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (!nextFiles.length) return;
    setImageToVideoImages((prev) => [...prev, ...nextFiles]);
    setJobStatus({state: "idle", message: ""});
    if (isPaidModeLocked) {
      setShowUpgradeModal(true);
    }
  };

  const handleRemoveImageToVideoImage = (indexToRemove: number) => {
    setImageToVideoImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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

  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  const downloadFileDirectly = async (url: string, filename: string, renderId?: string, renderMode?: string) => {
    if (renderId && renderMode) {
      trackVideoDownload({ renderId, mode: renderMode });
    }
    try {
      setDownloadingUrl(url);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloadingUrl(null);
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
            customAiImageKeys: [],
            customAiLogoKey: "",
            overrideInputProps: finalInputProps,
          });
          setPendingRenderKeys(null);
        }}
      />
    )}
    <main className="min-h-screen max-w-full overflow-hidden bg-[#07090E] text-zinc-100 flex flex-col md:flex-row pt-14 md:pt-16">
      
      {/* ── Desktop Dashboard Navigation Rail (M3) ── */}
      <aside className="hidden md:flex md:w-64 shrink-0 border-r border-white/10 bg-[#0B0F19] flex-col z-10 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
        {/* M3 Sidebar Header */}
        <div className="px-5 py-5 border-b border-white/10 mb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>Dashboard</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              30 FPS
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 font-medium">AI Video &amp; Subtitle Studio</p>
        </div>
        
        {/* Navigation Items (Exact 4 Requested: Video Types, Credits & Plans, Projects, Profile) */}
        <nav className="flex flex-col gap-1.5 px-3 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("video-types")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "video-types"
                ? "bg-amber-400/15 text-amber-400 border border-amber-400/30 font-black shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
            }`}
          >
            <LayoutGrid size={17} strokeWidth={activeTab === "video-types" ? 2.5 : 2} className={activeTab === "video-types" ? "text-amber-400" : "text-zinc-400"} />
            <span>Video Types</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("credits")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "credits"
                ? "bg-amber-400/15 text-amber-400 border border-amber-400/30 font-black shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
            }`}
          >
            <CreditCard size={17} strokeWidth={activeTab === "credits" ? 2.5 : 2} className={activeTab === "credits" ? "text-amber-400" : "text-zinc-400"} />
            <span>Credits &amp; Plans</span>
            {billingEntitlement?.active && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeTab === "credits" ? "bg-amber-400 text-slate-950 font-black" : "bg-white/10 text-zinc-300"
              }`}>
                {Math.round(billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? 0)}
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "projects"
                ? "bg-amber-400/15 text-amber-400 border border-amber-400/30 font-black shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
            }`}
          >
            <FolderOpen size={17} strokeWidth={activeTab === "projects" ? 2.5 : 2} className={activeTab === "projects" ? "text-amber-400" : "text-zinc-400"} />
            <span>Projects</span>
            {recentRenders.length > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeTab === "projects" ? "bg-amber-400 text-slate-950 font-black" : "bg-white/10 text-zinc-300"
              }`}>
                {recentRenders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "profile"
                ? "bg-amber-400/15 text-amber-400 border border-amber-400/30 font-black shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
            }`}
          >
            <User size={17} strokeWidth={activeTab === "profile" ? 2.5 : 2} className={activeTab === "profile" ? "text-amber-400" : "text-zinc-400"} />
            <span>Profile</span>
          </button>
        </nav>

        {/* Sidebar Footer: Quick Credits & Plan Status */}
        <div className="mt-auto p-3 border-t border-white/10 space-y-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[11px] font-bold text-zinc-400">Credits Wallet</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/20">
                {billingEntitlement?.planName || "Starter"}
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-lg font-black text-white font-mono">
                {billingEntitlement?.active 
                  ? Math.round(billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? 0)
                  : "0"}
              </span>
              <span className="text-[10px] text-zinc-400">credits left</span>
            </div>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-[11px] shadow-sm transition active:scale-95"
            >
              <Sparkles size={12} />
              <span>Get More Credits</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── M3 Mobile Bottom Navigation Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-2 py-1.5 flex items-center justify-around pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={() => setActiveTab("video-types")}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
            activeTab === "video-types" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
            activeTab === "video-types" ? "bg-amber-400/15 text-amber-400 scale-105" : "bg-transparent"
          }`}>
            <LayoutGrid size={20} strokeWidth={activeTab === "video-types" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Video Types</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("credits")}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
            activeTab === "credits" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
            activeTab === "credits" ? "bg-amber-400/15 text-amber-400 scale-105" : "bg-transparent"
          }`}>
            <CreditCard size={20} strokeWidth={activeTab === "credits" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Credits</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 select-none relative cursor-pointer ${
            activeTab === "projects" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <div className={`px-4 py-1 rounded-full transition-all duration-200 relative ${
            activeTab === "projects" ? "bg-amber-400/15 text-amber-400 scale-105" : "bg-transparent"
          }`}>
            <FolderOpen size={20} strokeWidth={activeTab === "projects" ? 2.5 : 2} />
            {recentRenders.length > 0 && (
              <span className="absolute -top-1 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-slate-950">
                {recentRenders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
            activeTab === "profile" ? "text-amber-400" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
            activeTab === "profile" ? "bg-amber-400/15 text-amber-400 scale-105" : "bg-transparent"
          }`}>
            <User size={20} strokeWidth={activeTab === "profile" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Profile</span>
        </button>
      </nav>

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-x-hidden md:overflow-y-auto h-auto md:h-screen p-3 sm:p-6 md:p-8 pb-28 md:pb-16">
        <div className="mx-auto w-full max-w-5xl space-y-6">

        {activeTab === "video-types" && (
          <div className="space-y-6 animate-in fade-in duration-300">
        {/* M3 Dashboard Quick Action & Credits Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B0F19] p-3 sm:p-3.5 shadow-md backdrop-blur-xl">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">AI Video Engine: 30 FPS Active</span>
            </div>

            {/* Mobile-only credits chip in top row */}
            {billingEntitlement?.active ? (() => {
              const total = Math.round(billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || 0);
              const remaining = Math.round(billingEntitlement?.usage?.remaining ?? total);
              return (
                <Link
                  href="/pricing"
                  className="sm:hidden inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-black text-amber-400"
                >
                  <Sparkles size={11} className="text-amber-400" />
                  <span>{remaining} / {total}</span>
                </Link>
              );
            })() : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                document.getElementById("studio-workflows")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 px-4 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Create Video</span>
            </button>

            {billingEntitlement?.active ? (() => {
              const total = Math.round(billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || 0);
              const remaining = Math.round(billingEntitlement?.usage?.remaining ?? total);
              return (
                <Link
                  href="/pricing"
                  className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 text-xs font-extrabold text-amber-400 shadow-xs backdrop-blur-md transition hover:bg-amber-400/20"
                  title="View credit details & upgrade"
                >
                  <Sparkles size={13} className="text-amber-400" />
                  <span>⚡ <strong className="text-white font-black text-xs">{remaining}</strong> / {total} Credits</span>
                </Link>
              );
            })() : null}

            <Link
              href="/pricing"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 text-xs font-bold text-zinc-200 transition"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Upgrade</span>
            </Link>
          </div>
        </div>

        {/* Live Active Render Progress Widget */}
        {renderInProgress && (
          <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md">
                  <Loader2 size={20} className="animate-spin text-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Creating Your AI Video...</h3>
                  <p className="text-xs text-muted-foreground">{jobStatus.message || "Processing speech alignment & Remotion cloud render"}</p>
                </div>
              </div>
              <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-extrabold text-slate-950">
                {jobStatus.progress ? `${Math.round(jobStatus.progress)}%` : "Rendering"}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-950/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
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
          {standalone ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:bg-muted hover:border-primary/40 cursor-pointer shadow-xs"
                >
                  <ArrowLeft size={14} />
                  <span>All Video Tools</span>
                </Link>
                <div className="h-5 w-px bg-border/60 hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${activeMode.border} ${activeMode.surface} ${activeMode.color}`}>
                    <ActiveModeIcon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-black text-white">{activeMode.title}</h1>
                      <span className="rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
                        Dedicated Studio
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{activeMode.bestResult}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Credits: {billingEntitlement?.usage ? `${billingEntitlement.usage.remaining}` : (user ? "Active" : "—")}</span>
                  <span className="text-[10px] underline">+Add</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Active Workflow Configuration Container */}
          {hasUserSelected && mode === "autoCaption" ? (
            <div className="mt-8 space-y-6">
              <AutoCaptionsStudio
                selectedFile={selectedFile}
                onSelectFile={chooseFile}
                captionStyle={captionStyle}
                onChangeCaptionStyle={chooseCaptionStyle}
                captionPosition={captionPosition}
                onChangeCaptionPosition={setCaptionPosition}
                captionFontSize={captionFontSize}
                onChangeCaptionFontSize={setCaptionFontSize}
                captionTextColor={captionTextColor}
                onChangeCaptionTextColor={setCaptionTextColor}
                captionHighlightColor={captionHighlightColor}
                onChangeCaptionHighlightColor={setCaptionHighlightColor}
                captionBackgroundColor={captionBackgroundColor}
                onChangeCaptionBackgroundColor={setCaptionBackgroundColor}
                wordClickSound={wordClickSound}
                onChangeWordClickSound={setWordClickSound}
                captionEmphasisAnimation={captionEmphasisAnimation}
                onChangeCaptionEmphasisAnimation={setCaptionEmphasisAnimation}
                spokenLanguage={spokenLanguage}
                onChangeSpokenLanguage={setSpokenLanguage}
                captionLanguage={captionLanguage}
                onChangeCaptionLanguage={setCaptionLanguage}
                durationSeconds={promoClipMeta.durationSeconds}
                isRendering={jobStatus.state === "starting" || jobStatus.state === "rendering" || jobStatus.state === "uploading"}
                renderProgress={0}
                renderState={jobStatus.state}
                renderMessage={jobStatus.message}
                onStartRender={startRenderJob}
                userCredits={billingEntitlement?.active ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0) : undefined}
                plannedCreditCost={plannedCreditCost}
                isFreeTrial={isFreeSignupCredit}
                recentRenders={recentRenders}
                onSelectRecentRender={() => {}}
                standalone={standalone}
                userId={user?.id}
              />
              {jobStatus.state !== "idle" ? (
                <InteractiveRenderEngine
                  mode={mode}
                  fileName={selectedFile?.name}
                  onRetry={startRenderJob}
                  onReset={() => setJobStatus({state: "idle", message: ""})}
                  status={jobStatus}
                  title={jobStatus.title || selectedFile?.name || activeMode.title}
                  isFreePlan={isFreeSignupCredit || !isPaidUserWithCredits}
                />
              ) : null}
            </div>
          ) : hasUserSelected ? (
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

              {/* Free Trial Active Reassurance Banner */}
              {mode === "autoCaption" && isFreeSignupCredit && (
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-black/50 p-4 sm:p-4.5 shadow-lg backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">🎁 1 Free Trial Available for Auto Caption</h4>
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            No Payment Required
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          You can render 1 watermarked 9:16 Auto Caption Reel up to 1 minute completely free to test our AI sync accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mode === "customAiReel" ? (
                <div id="upload-section" className="scroll-mt-20 space-y-4">
                  <div className="min-w-0 overflow-hidden rounded-xl border border-sky-300/20 bg-sky-300/[0.065] p-3 sm:p-4">
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">What do you want in your video?</span>
                        <span className="text-[10px] uppercase font-bold text-sky-400">1-Click Starter Prompts</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          {
                            label: "⚡ SaaS Launch",
                            prompt: "Create a 30-second SaaS demo reel. Start with bold title: 'Meet the Future of Productivity'. At 5s show my app screenshot. At 15s play my video clip. End with logo and CTA: 'Try Free at ItnaVideo.com'.",
                          },
                          {
                            label: "📈 3 Tips Explainer",
                            prompt: "Create a 45-second educational reel. Hook: '3 Habits That Changed My Life'. Split into Step 1, Step 2, and Step 3 with bold captions and synced screenshots. Outro with follow reminder.",
                          },
                          {
                            label: "🛒 Product Sale",
                            prompt: "Create an energetic 20-second product promo. Bold flash text: 'Limited Time Deal - 30% OFF'. Feature product images, price callout, and logo outro with website link.",
                          },
                          {
                            label: "🎙️ Podcast Highlight",
                            prompt: "Create a high-retention podcast reel from my video clip. Highlight the most intense insight with kinetic pop subtitles, dark vignette backdrop, and host social handle.",
                          },
                        ].map((starter, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setCustomAiPrompt(starter.prompt);
                              setJobStatus({ state: "idle", message: "" });
                            }}
                            className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-200 transition hover:bg-sky-400/25 active:scale-95"
                          >
                            {starter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="grid gap-2" htmlFor="custom-ai-prompt">
                      <textarea
                        className="min-h-48 w-full resize-y rounded-xl border border-border bg-black/35 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-300/60"
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
                          if (isPaidModeLocked) {
                            setShowUpgradeModal(true);
                          }
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
                          if (isPaidModeLocked) {
                            setShowUpgradeModal(true);
                          }
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
              ) : mode === "audioClean" || mode === "imageToVideoAi" ? null : (
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
              <label className="upload-zone flex min-h-40 min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden sm:min-h-64">
                <input
                  accept={activeMode.accept}
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    chooseFile(event.target.files?.[0] || null);
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(37, 99, 235, 0.1)' }}
                >
                  <Upload size={28} style={{ color: 'var(--color-primary-hover)' }} />
                </div>
                <p className="max-w-full px-2 text-center text-sm font-medium leading-5 text-white">
                  {selectedFile ? "Change selected file" : activeMode.uploadCta || 'Click to upload or drag & drop'}
                </p>
                <p className="mt-2 max-w-full px-2 text-center text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>
                  {activeMode.supported}{mode === "audioClean" ? "" : mode === "facelessVideo" || mode === "aiVideoGenerator" || mode === "longVideoPro" ? " • Up to 20 minutes" : " • Max 1 minute"}
                </p>
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
                mode === "longVideoClips" ||
                mode === "youtubeSubtitleGenerator") ? (
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
                    if (isPaidModeLocked && files.length > 0) {
                      setShowUpgradeModal(true);
                    }
                  }}
                  onError={(message) => setJobStatus({state: "error", message})}
                />
                <StickerStylePicker value={stickerStyle} onChange={setStickerStyle} />
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

                {/* M3 Style Controls: Theme + Tone + Winner + Frame + AI Presets */}
                <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-sm backdrop-blur-md transition-all sm:p-6 space-y-6">
                  {/* Header with AI Suggester */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Compare Configuration</p>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">Customize theme, color tone, image frames, and winner announcement.</p>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      <span className="text-[11px] font-bold text-zinc-400">Presets:</span>
                      {[
                        { label: "📱 iPhone vs S25", left: "iPhone 16 Pro", right: "Galaxy S25 Ultra", tone: "versus", winner: "none", sticker: "3d-presenter-man" },
                        { label: "💳 Debit vs Credit", left: "Debit Card", right: "Credit Card", tone: "goodBad", winner: "right", sticker: "2d-presenter-man" },
                        { label: "📈 SIP vs Lump Sum", left: "SIP Investing", right: "Lump Sum", tone: "versus", winner: "left", sticker: "banker-3d-half" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setCompareLeftTitle(preset.left);
                            setCompareRightTitle(preset.right);
                            setCompareTone(preset.tone);
                            setCompareWinner(preset.winner);
                            setStickerStyle(preset.sticker);
                          }}
                          className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300 whitespace-nowrap"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme (M3 Segmented Button) */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Theme Background</label>
                    <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5">
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
                          className={`rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                            compareTheme === t.id
                              ? "bg-amber-400 text-black shadow-sm"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Tone (M3 Tonal Choice Chips) */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Comparison Color Scheme</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "versus", label: "A vs B (Neutral)", sub: "Blue & Violet accents", colors: ["#2563EB", "#7C3AED"] },
                        { id: "goodBad", label: "Good vs Bad (Pros/Cons)", sub: "Emerald & Rose accents", colors: ["#10B981", "#EF4444"] },
                      ].map((t) => {
                        const active = compareTone === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCompareTone(t.id)}
                            aria-pressed={active}
                            className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                              active
                                ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20"
                                : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex -space-x-1">
                                <span className="h-3 w-3 rounded-full border border-black" style={{ background: t.colors[0] }} />
                                <span className="h-3 w-3 rounded-full border border-black" style={{ background: t.colors[1] }} />
                              </span>
                              <span className={`text-xs font-bold ${active ? "text-amber-300" : "text-white"}`}>
                                {t.label}
                              </span>
                            </div>
                            <span className="mt-1 text-[11px] text-zinc-400">{t.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Winner Selector (M3 Filter Chips with Crown) */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">
                      Winner Announcement (Revealed in Closing Outro)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "none", label: "No Winner", badge: "Draw / Open" },
                        { id: "left", label: "Left (A) Wins", badge: "👑 Crown Left" },
                        { id: "right", label: "Right (B) Wins", badge: "👑 Crown Right" },
                      ].map((t) => {
                        const active = compareWinner === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCompareWinner(t.id)}
                            aria-pressed={active}
                            className={`rounded-2xl border p-3 text-center transition-all ${
                              active
                                ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20"
                                : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.03]"
                            }`}
                          >
                            <p className={`text-xs font-bold ${active ? "text-amber-300" : "text-white"}`}>{t.label}</p>
                            <p className="mt-0.5 text-[10px] text-zinc-400">{t.badge}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Frame Style (M3 Visual Icon Cards) */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Image Frame Presentation</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {[
                        { id: "rounded", label: "Rounded Card", icon: "▢" },
                        { id: "circle", label: "Circle Avatar", icon: "◯" },
                        { id: "phone", label: "Smartphone", icon: "📱" },
                        { id: "tilted", label: "3D Perspective", icon: "⬡" },
                        { id: "polaroid", label: "Polaroid Photo", icon: "📸" },
                      ].map((t) => {
                        const active = compareImageStyle === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setCompareImageStyle(t.id)}
                            aria-pressed={active}
                            className={`flex flex-col items-center justify-center rounded-2xl border py-3 px-2 text-center transition-all ${
                              active
                                ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20"
                                : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.03]"
                            }`}
                          >
                            <span className="text-base mb-1">{t.icon}</span>
                            <span className={`text-[11px] font-bold ${active ? "text-amber-300" : "text-zinc-300"}`}>
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Speaking Pace / Narration Speed */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Presenter Narration Pace</label>
                    <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5">
                      {[
                        { id: "1.0", label: "1.0x Normal", sub: "Standard pace" },
                        { id: "1.15", label: "1.15x Snappy", sub: "Viral TikTok pace" },
                        { id: "1.25", label: "1.25x Rapid", sub: "Fast high-retention" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCompareSpeakingPace(item.id as "1.0" | "1.15" | "1.25")}
                          aria-pressed={compareSpeakingPace === item.id}
                          className={`min-h-[50px] rounded-xl py-2 px-1 text-center transition-all touch-manipulation active:scale-[0.98] ${
                            compareSpeakingPace === item.id
                              ? "bg-amber-400 text-black shadow-sm font-bold"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <p className="text-xs font-bold leading-tight">{item.label}</p>
                          <p className={`text-[9px] mt-0.5 leading-tight ${compareSpeakingPace === item.id ? "text-black/80 font-medium" : "text-zinc-500"}`}>{item.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Music (BGM) */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Background Audio Beat</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { id: "versus", label: "🥊 High Stakes", sub: "Tense electronic" },
                        { id: "tech", label: "⚡ Tech Minimal", sub: "Clean modern" },
                        { id: "corporate", label: "📈 Corporate", sub: "Upbeat positive" },
                        { id: "none", label: "🔇 Mute Beat", sub: "Voiceover only" },
                      ].map((bgm) => {
                        const active = compareBgmTrack === bgm.id;
                        return (
                          <button
                            key={bgm.id}
                            type="button"
                            onClick={() => setCompareBgmTrack(bgm.id as "tech" | "versus" | "corporate" | "none")}
                            className={`min-h-[52px] rounded-2xl border p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20 text-amber-300 font-bold"
                                : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <p className="text-xs font-bold leading-tight">{bgm.label}</p>
                            <p className="text-[9px] mt-0.5 opacity-80 leading-tight">{bgm.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Narrator Caption Preset */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Narrator Caption Preset</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { id: "Warikoo Black Card", label: "Black Card", sub: "Dark rounded pill" },
                        { id: "Bold Outline", label: "Bold Impact", sub: "Thick black stroke" },
                        { id: "Active Blue Pill", label: "Blue Pill", sub: "Modern SaaS chip" },
                        { id: "Clean White", label: "Minimal Sans", sub: "Clean drop shadow" },
                      ].map((style) => {
                        const active = compareCaptionStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setCompareCaptionStyle(style.id)}
                            className={`min-h-[52px] rounded-2xl border p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20 text-amber-300 font-bold"
                                : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <p className="text-xs font-bold leading-tight">{style.label}</p>
                            <p className="text-[9px] mt-0.5 opacity-80 leading-tight">{style.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

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

                  {/* Typography Kinetic Audio & Pacing Studio Controls */}
                  <div className="mt-4 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-sm backdrop-blur-md sm:p-6 space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Kinetic SFX & Pacing Controls</p>
                    </div>

                    {/* SFX Punch Intensity */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Kinetic Sound Effects (SFX)</label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {[
                          { id: "full", label: "💥 Full Punch", sub: "Whoosh + Pop + Hit" },
                          { id: "subtle", label: "🔉 Subtle Clicks", sub: "Soft kinetic ticks" },
                          { id: "none", label: "🔇 Mute SFX", sub: "Clean voice only" },
                        ].map((sfx) => {
                          const active = typographySfxIntensity === sfx.id;
                          return (
                            <button
                              key={sfx.id}
                              type="button"
                              onClick={() => setTypographySfxIntensity(sfx.id as "full" | "subtle" | "none")}
                              className={`min-h-[52px] rounded-2xl border p-3 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                active
                                  ? "border-purple-400 bg-purple-400/10 ring-2 ring-purple-400/20 text-purple-300 font-bold"
                                  : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{sfx.label}</p>
                              <p className="text-[9px] mt-0.5 opacity-80 leading-tight">{sfx.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Kinetic Text Pacing & Word Casing */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Text Kinetic Pacing</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "fast", label: "⚡ Viral Blitz", sub: "High retention" },
                            { id: "smooth", label: "📖 Smooth Flow", sub: "Relaxed reading" },
                          ].map((pace) => {
                            const active = typographyPacing === pace.id;
                            return (
                              <button
                                key={pace.id}
                                type="button"
                                onClick={() => setTypographyPacing(pace.id as "fast" | "smooth")}
                                className={`min-h-[48px] rounded-xl border p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                  active
                                    ? "border-purple-400 bg-purple-400/10 text-purple-300 font-bold"
                                    : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <p className="text-xs font-bold leading-tight">{pace.label}</p>
                                <p className="text-[9px] opacity-75 leading-tight">{pace.sub}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Typography Casing</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "uppercase", label: "UPPERCASE", sub: "Punchy bold" },
                            { id: "natural", label: "Natural Case", sub: "Editorial" },
                          ].map((casing) => {
                            const active = typographyTextCase === casing.id;
                            return (
                              <button
                                key={casing.id}
                                type="button"
                                onClick={() => setTypographyTextCase(casing.id as "uppercase" | "natural")}
                                className={`min-h-[48px] rounded-xl border p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                  active
                                    ? "border-purple-400 bg-purple-400/10 text-purple-300 font-bold"
                                    : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <p className="text-xs font-bold leading-tight">{casing.label}</p>
                                <p className="text-[9px] opacity-75 leading-tight">{casing.sub}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
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
                    promoCtaStyle={promoCtaStyle}
                    promoCreatorHandle={promoCreatorHandle}
                    promoBackgroundMode={promoBackgroundMode}
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

                    {/* Creator Channel Handle */}
                    <label className="grid gap-1.5">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Creator Channel Handle <span className="normal-case text-muted-foreground">(optional)</span></span>
                      <input
                        className="form-input"
                        maxLength={30}
                        onChange={(e) => setPromoCreatorHandle(e.target.value)}
                        placeholder="@yourchannel or podcast name"
                        type="text"
                        value={promoCreatorHandle}
                      />
                      <span className="text-[10px] text-muted-foreground">Displays a subtle verified creator pill in the promo reel corner.</span>
                    </label>

                    {/* CTA Button Theme */}
                    <div className="mt-2">
                      <label className="mb-2 block text-xs font-medium text-zinc-300">CTA Button Styling</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          { id: "youtube-red", label: "🔴 YouTube Red", sub: "Classic YouTube" },
                          { id: "emerald", label: "🟢 Emerald Pulse", sub: "High contrast" },
                          { id: "glass", label: "⚡ Dark Glass", sub: "Minimalist SaaS" },
                          { id: "tiktok-yellow", label: "🟡 Creator Yellow", sub: "Viral Shorts" },
                        ].map((cta) => {
                          const active = promoCtaStyle === cta.id;
                          return (
                            <button
                              key={cta.id}
                              type="button"
                              onClick={() => setPromoCtaStyle(cta.id as "youtube-red" | "emerald" | "glass" | "tiktok-yellow")}
                              className={`min-h-[52px] rounded-2xl border p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                active
                                  ? "border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/20 text-emerald-300 font-bold"
                                  : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{cta.label}</p>
                              <p className="text-[9px] mt-0.5 opacity-80 leading-tight">{cta.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Background Mode */}
                    <div className="mt-2">
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Vertical Canvas Backdrop</label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          { id: "blur", label: "Cinematic Ambient Blur", sub: "Dynamic blurred video backdrop" },
                          { id: "solid", label: "Deep Matte Charcoal", sub: "Clean distraction-free frame" },
                        ].map((bg) => {
                          const active = promoBackgroundMode === bg.id;
                          return (
                            <button
                              key={bg.id}
                              type="button"
                              onClick={() => setPromoBackgroundMode(bg.id as "blur" | "solid")}
                              className={`min-h-[52px] rounded-xl border p-3 text-left transition-all touch-manipulation active:scale-[0.98] ${
                                active
                                  ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 font-bold"
                                  : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{bg.label}</p>
                              <p className="text-[9px] opacity-75 leading-tight">{bg.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Burn-in Speech Captions Toggle */}
                    <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>💬 Burn-in Speech Captions</span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">AI Subtitles</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Auto-transcribe speech and burn synchronized captions directly inside the teaser clip.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={promoEnableCaptions}
                          onChange={(e) => setPromoEnableCaptions(e.target.checked)}
                          className="toggle-checkbox h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                </>
              ) : null}

              {/* ── Whiteboard Style Studio ── */}
              {mode === "whiteboardVideo" ? (
                <>
                <div className="sticky top-16 z-30 -mx-4 mb-1 border-b border-border bg-[#0a1622]/95 px-4 pb-4 pt-3 backdrop-blur-md sm:top-4 sm:mx-0 sm:rounded-lg sm:border sm:border-border sm:bg-black/25">
                  <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-200">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                    Board Live Studio
                  </div>
                  <div className="mx-auto max-w-[320px] overflow-hidden rounded-2xl border border-cyan-500/25 shadow-lg">
                    <Image src="/visuals/previews/whiteboard-video-new.png" alt="Corporate Whiteboard" width={560} height={315} className="w-full object-cover" />
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-sm backdrop-blur-md sm:p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Whiteboard Canvas & Pen Configuration</p>
                      <p className="mt-0.5 text-xs text-zinc-400">Select board texture, hand drawing style, and executive marker colors.</p>
                    </div>
                  </div>

                  {/* 1. Board Environment */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Board Environment & Surface</label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {[
                        { id: "classic", label: "Classic Whiteboard", sub: "Glossy white ceramic & aluminum frame", icon: "📋" },
                        { id: "dark-glass", label: "Architect Dark Glass", sub: "Frosted dark slate with neon markers", icon: "💎" },
                        { id: "blueprint", label: "Blueprint Grid", sub: "Matte navy technical grid with chalk", icon: "📐" },
                      ].map((board) => {
                        const active = whiteboardTheme === board.id;
                        return (
                          <button
                            key={board.id}
                            type="button"
                            onClick={() => setWhiteboardTheme(board.id as "classic" | "dark-glass" | "blueprint")}
                            className={`min-h-[64px] flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20 text-cyan-300 font-bold"
                                : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span className="text-lg mb-1">{board.icon}</span>
                            <p className="text-xs font-bold leading-tight">{board.label}</p>
                            <p className="text-[10px] mt-1 opacity-75 leading-tight">{board.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Drawing Hand & Pen Style */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Drawing Hand & Marker Presence</label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[
                        { id: "right-hand", label: "Realistic Hand", sub: "Natural human drawing", icon: "✍️" },
                        { id: "stylus", label: "Modern Stylus", sub: "Clean digital pen", icon: "🖊️" },
                        { id: "direct-draw", label: "Direct Stroke", sub: "No hand · Pure line draw", icon: "✨" },
                      ].map((hand) => {
                        const active = whiteboardHandStyle === hand.id;
                        return (
                          <button
                            key={hand.id}
                            type="button"
                            onClick={() => setWhiteboardHandStyle(hand.id as "right-hand" | "stylus" | "direct-draw")}
                            className={`min-h-[58px] rounded-2xl border p-2.5 sm:p-3 text-center transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20 text-cyan-300 font-bold"
                                : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span className="text-base mb-1 block">{hand.icon}</span>
                            <p className="text-xs font-bold leading-tight">{hand.label}</p>
                            <p className="text-[9px] mt-0.5 opacity-75 leading-tight">{hand.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Marker Accent Color */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Marker Accent Color</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { id: "navy", label: "Executive Navy", color: "#1E3A8A" },
                        { id: "crimson", label: "Crimson Red", color: "#B91C1C" },
                        { id: "emerald", label: "Boardroom Emerald", color: "#0F766E" },
                        { id: "gold", label: "Amber Gold", color: "#D97706" },
                      ].map((marker) => {
                        const active = whiteboardMarkerColor === marker.id;
                        return (
                          <button
                            key={marker.id}
                            type="button"
                            onClick={() => setWhiteboardMarkerColor(marker.id as "navy" | "crimson" | "emerald" | "gold")}
                            className={`min-h-[44px] flex items-center gap-2 rounded-2xl border p-2.5 transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20 text-cyan-300 font-bold"
                                : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/40 shadow-xs" style={{ background: marker.color }} />
                            <span className="text-xs font-semibold leading-tight">{marker.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Handwriting Style */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-300">Handwriting Typography Style</label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[
                        { id: "marker", label: "Casual Marker", sub: "Natural whiteboard notes" },
                        { id: "architect", label: "Architect Daughter", sub: "Blueprint technical font" },
                        { id: "sans", label: "Corporate Sans", sub: "Crisp modern typography" },
                      ].map((f) => {
                        const active = whiteboardFont === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setWhiteboardFont(f.id as "marker" | "architect" | "sans")}
                            className={`min-h-[52px] rounded-xl border p-2 sm:p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                              active
                                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 font-bold"
                                : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <p className="text-xs font-bold leading-tight">{f.label}</p>
                            <p className="text-[9px] opacity-75 leading-tight">{f.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
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

              {mode === "imageToVideoAi" ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-purple-900/30 to-black border border-purple-500/40 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          Dedicated Fast Studio Available
                          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-300 border border-purple-500/30">
                            Fast & Spacious
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-400">
                          For zero lag, full widescreen layout, and instant loading, open the dedicated Image to Video studio.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/image-to-video"
                      className="inline-flex items-center gap-2 rounded-full bg-purple-500 hover:bg-purple-600 px-5 py-2.5 text-xs font-black text-white shrink-0 shadow-md shadow-purple-500/20 transition active:scale-95"
                    >
                      <span>Open Dedicated Studio</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>

                  <ImageToVideoStudio
                    selectedAudio={selectedFile}
                    onSelectAudio={setSelectedFile}
                    imageFiles={imageToVideoImages}
                    onAddImages={handleAddImageToVideoImages}
                    onRemoveImage={handleRemoveImageToVideoImage}
                    assetSourceMode={imageToVideoAssetMode}
                    onChangeAssetSourceMode={setImageToVideoAssetMode}
                    selectedStockAssetUrls={imageToVideoStockUrls}
                    onChangeSelectedStockAssetUrls={setImageToVideoStockUrls}
                    visualStyle={imageToVideoVisualStyle}
                    onChangeVisualStyle={setImageToVideoVisualStyle}
                    characterImageFile={imageToVideoCharacterFile}
                    onSelectCharacterImage={setImageToVideoCharacterFile}
                    characterDnaHint={imageToVideoCharacterDnaHint}
                    onChangeCharacterDnaHint={setImageToVideoCharacterDnaHint}
                    bgmEnabled={imageToVideoBgmEnabled}
                    onChangeBgmEnabled={setImageToVideoBgmEnabled}
                    selectedLibraryBgmUrl={imageToVideoLibraryBgmUrl}
                    onChangeSelectedLibraryBgmUrl={setImageToVideoLibraryBgmUrl}
                    bgmFile={imageToVideoBgm}
                    onSelectBgm={setImageToVideoBgm}
                    bgmVolume={imageToVideoBgmVolume}
                    onChangeBgmVolume={setImageToVideoBgmVolume}
                    topicTitle={topicTitle}
                    onChangeTopicTitle={setTopicTitle}
                    subtitleStyle={imageToVideoSubtitleStyle}
                    onChangeSubtitleStyle={setImageToVideoSubtitleStyle}
                    cameraMotionPreset={imageToVideoCameraMotion}
                    onChangeCameraMotionPreset={setImageToVideoCameraMotion}
                    fitMode={imageToVideoFitMode}
                    onChangeFitMode={setImageToVideoFitMode}
                    isRendering={jobStatus.state === "starting" || jobStatus.state === "rendering" || jobStatus.state === "uploading"}
                    onStartRender={startRenderJob}
                    userCredits={billingEntitlement?.active ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0) : undefined}
                    audioCleanOptions={audioCleanOptions}
                    setAudioCleanOptions={setAudioCleanOptions}
                    userId={user?.id}
                  />
                </div>
              ) : null}

              {mode === "youtubeSubtitleGenerator" ? (
                <div className="rounded-2xl border border-amber-500/20 bg-card p-4 sm:p-6 shadow-sm min-w-0 max-w-full overflow-hidden space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black text-foreground">
                          YouTube Subtitle Generator
                        </p>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          mode === "youtubeSubtitleGenerator"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {mode === "youtubeSubtitleGenerator" ? "16:9 Landscape" : "9:16 Reel"}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {mode === "youtubeSubtitleGenerator" ? "1 Credit / 2 Min · Max 15m" : "1 Credit / Min"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                        {mode === "youtubeSubtitleGenerator"
                          ? "Clean, professional subtitles used by top YouTube creators & podcasts (Up to 15 mins)."
                          : "AI transcribes your video & syncs animated captions word-by-word."}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Duration & Credit indicator */}
                  {promoClipMeta.durationSeconds ? (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                      <span className="text-muted-foreground font-medium">
                        Video Length: <strong className="text-foreground">{Math.floor(promoClipMeta.durationSeconds / 60)}:{(Math.round(promoClipMeta.durationSeconds % 60)).toString().padStart(2, '0')}</strong> ({Math.round(promoClipMeta.durationSeconds)}s)
                      </span>
                      <span className="font-bold text-primary">
                        Cost: {mode === "youtubeSubtitleGenerator"
                          ? `${Math.max(1, Math.ceil(promoClipMeta.durationSeconds / 120))} Credit${Math.ceil(promoClipMeta.durationSeconds / 120) > 1 ? 's' : ''} (1 credit per 2 minutes)`
                          : `${Math.max(1, Math.ceil(promoClipMeta.durationSeconds / 60))} Credit${Math.ceil(promoClipMeta.durationSeconds / 60) > 1 ? 's' : ''} (1 credit per minute)`
                        }
                      </span>
                    </div>
                  ) : null}

                  {/* Landscape 16:9 warning if uploaded to 9:16 reel */}
                  {mode === "autoCaption" && promoClipMeta.mediaAspect === "landscape" ? (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                      <span className="text-base leading-none">⚠️</span>
                      <div>
                        <p className="font-bold">Auto Captions is designed for 9:16 Vertical Reels.</p>
                        <p className="mt-0.5 text-[11px] opacity-90">
                          Your uploaded video is landscape (16:9). For native 16:9 widescreen with creator subtitle styles, switch to YouTube Subtitle Generator!
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Portrait 9:16 notice if uploaded to YouTube Subtitle Generator */}
                  {mode === "youtubeSubtitleGenerator" && promoClipMeta.mediaAspect === "portrait" ? (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                      <span className="text-base leading-none">💡</span>
                      <div>
                        <p className="font-bold">YouTube Subtitle Generator is designed for 16:9 Landscape Videos.</p>
                        <p className="mt-0.5 text-[11px] opacity-90">
                          Your uploaded video is vertical (9:16). For vertical reels & shorts with animated kinetic captions, switch to Auto Caption Generator.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Western Creator Guide Banner for YouTube Subtitle Generator */}
                  {mode === "youtubeSubtitleGenerator" ? (
                    <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-3.5 text-xs text-sky-700 dark:text-sky-300 flex items-start gap-2.5">
                      <span className="text-lg leading-none">🇬🇧</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sky-900 dark:text-sky-200">
                          16:9 Landscape Creator Styles (USA, UK, Canada & Australia)
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-sky-800/90 dark:text-sky-300/90">
                          Engineered for widescreen 16:9 viewing with natural sentence phrasing (5–9 words) and lower-third safe margins. Choose from iconic creator aesthetics like <strong>Ali Abdaal</strong>, <strong>Vox Documentary</strong>, <strong>Diary of a CEO</strong>, <strong>Huberman Lab</strong>, <strong>MrBeast</strong>, and <strong>BBC Closed Captions</strong>.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* 1. Style Preset Picker */}
                  <div>
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] form-label-muted">
                      1. Caption Style Preset {mode === "youtubeSubtitleGenerator" ? "(16:9 Western Creator Presets)" : ""}
                    </span>
                    <SubtitleStylePicker
                      value={captionStyle}
                      onChange={chooseCaptionStyle}
                      variant={mode === "youtubeSubtitleGenerator" ? "longForm" : "shorts"}
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
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 min-h-[44px]">
                          <input
                            type="color"
                            value={captionTextColor}
                            onChange={(e) => setCaptionTextColor(e.target.value)}
                            className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0 touch-manipulation"
                          />
                          <span className="font-mono text-xs font-bold uppercase text-foreground">{captionTextColor}</span>
                        </div>
                      </div>

                      {/* Highlight Active Word Color */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground">Highlight Active Word</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 min-h-[44px]">
                          <input
                            type="color"
                            value={captionHighlightColor}
                            onChange={(e) => setCaptionHighlightColor(e.target.value)}
                            className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0 touch-manipulation"
                          />
                          <span className="font-mono text-xs font-bold uppercase text-foreground">{captionHighlightColor}</span>
                        </div>
                      </div>

                      {/* Background Box */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground">Background Box</label>
                        <select
                          className="form-input min-h-[44px] text-xs py-2"
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

                    {/* Quick Highlight Color Chips */}
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-muted-foreground">Quick Palette:</span>
                      {[
                        { label: "Yellow", hex: "#facc15" },
                        { label: "Cyan", hex: "#06b6d4" },
                        { label: "Coral", hex: "#f43f5e" },
                        { label: "Lime", hex: "#84cc16" },
                        { label: "Purple", hex: "#a855f7" },
                        { label: "White", hex: "#ffffff" },
                      ].map((chip) => (
                        <button
                          key={chip.hex}
                          type="button"
                          onClick={() => setCaptionHighlightColor(chip.hex)}
                          className={`min-h-[36px] flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition touch-manipulation active:scale-95 ${
                            captionHighlightColor.toLowerCase() === chip.hex.toLowerCase()
                              ? "border-primary bg-primary/10 text-primary font-black"
                              : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: chip.hex }} />
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Mode Specific Advanced Controls */}
                  {mode === "youtubeSubtitleGenerator" ? (
                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-3.5 sm:p-4 space-y-3">
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-sky-400">
                        5. 16:9 Landscape Safe Margin & Casing
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Safe Zone Margin */}
                        <div>
                          <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground">
                            Bottom TV & Scrubber Safe Margin
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/60 p-1.5">
                            {[
                              { id: "standard", label: "48px Standard" },
                              { id: "scrubber", label: "84px Safe (YT)" },
                              { id: "high", label: "120px High TV" },
                            ].map((zone) => (
                              <button
                                key={zone.id}
                                type="button"
                                onClick={() => setYoutubeSubtitleSafeZone(zone.id as "standard" | "scrubber" | "high")}
                                className={`min-h-[42px] rounded-lg py-2 px-1 text-[11px] sm:text-xs font-bold leading-tight transition touch-manipulation active:scale-[0.98] ${
                                  youtubeSubtitleSafeZone === zone.id
                                    ? "bg-sky-500 text-white shadow-xs font-black"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {zone.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Subtitle Letter Casing */}
                        <div>
                          <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground">
                            Text Letter Case
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-muted/60 p-1.5">
                            {[
                              { id: "natural", label: "Natural Case" },
                              { id: "uppercase", label: "UPPERCASE" },
                            ].map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setYoutubeSubtitleCase(item.id as "natural" | "uppercase")}
                                className={`min-h-[42px] rounded-lg py-2 px-3 text-xs font-bold leading-tight transition touch-manipulation active:scale-[0.98] ${
                                  youtubeSubtitleCase === item.id
                                    ? "bg-sky-500 text-white shadow-xs font-black"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5 sm:p-4 space-y-3">
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-amber-400">
                        5. Kinetic Sound & Animation Effects
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Word Click Audio */}
                        <div>
                          <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground">
                            Word Click / Pop Sound
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-muted/60 p-1.5">
                            <button
                              type="button"
                              onClick={() => setWordClickSound(false)}
                              className={`min-h-[44px] rounded-lg py-2 px-2 text-[11px] sm:text-xs font-bold leading-tight transition touch-manipulation active:scale-[0.98] ${
                                !wordClickSound ? "bg-amber-500 text-black shadow-xs font-black" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              🔇 Mute Click Sound
                            </button>
                            <button
                              type="button"
                              onClick={() => setWordClickSound(true)}
                              className={`min-h-[44px] rounded-lg py-2 px-2 text-[11px] sm:text-xs font-bold leading-tight transition touch-manipulation active:scale-[0.98] ${
                                wordClickSound ? "bg-amber-500 text-black shadow-xs font-black" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              🔊 Pop / Click SFX
                            </button>
                          </div>
                        </div>

                        {/* Kinetic Word Animation */}
                        <div>
                          <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground">
                            Active Word Kinetic Emphasis
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/60 p-1.5">
                            {[
                              { id: "bounce", label: "Pop Scale" },
                              { id: "glow", label: "Glow Burst" },
                              { id: "none", label: "Clean Flow" },
                            ].map((anim) => (
                              <button
                                key={anim.id}
                                type="button"
                                onClick={() => setCaptionEmphasisAnimation(anim.id as "bounce" | "glow" | "none")}
                                className={`min-h-[44px] rounded-lg py-2 px-1 text-[11px] sm:text-xs font-bold leading-tight transition touch-manipulation active:scale-[0.98] ${
                                  captionEmphasisAnimation === anim.id
                                    ? "bg-amber-500 text-black shadow-xs font-black"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {anim.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      {[
                        { value: 1, label: "1 Clip", desc: "Single Highlight" },
                        { value: 3, label: "Top 3", desc: "Quick Hits" },
                        { value: 5, label: "Top 5", desc: "Best Moments" },
                        { value: 10, label: "Top 10", desc: "Detailed Coverage" },
                        { value: 0, label: "Auto", desc: "AI Smart Sizing" },
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
                            <p className={`text-sm sm:text-base font-black ${isActive ? "text-primary" : "text-foreground"}`}>{item.label}</p>
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

                  {/* 3. Dynamic Visual Timeline Mockup & Workflow Callout */}
                  <div className="mt-6 rounded-2xl bg-muted/30 border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Start (0:00)</span>
                      <span className="text-primary uppercase tracking-widest text-[9px] font-black">AI Extraction ➔ Captioning Pipeline</span>
                      <span>End (Video)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted relative overflow-hidden p-0.5 border border-border">
                      <div className="absolute inset-0 flex justify-around items-center px-4">
                        {Array.from({ length: clipCount === 0 ? 5 : Math.max(1, Math.min(10, clipCount)) }).map((_, i) => (
                          <div
                            key={i}
                            className="h-2 w-[16%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-500/25 animate-pulse"
                            style={{ animationDelay: `${i * 120}ms`, animationDuration: "2s" }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span className="font-bold text-foreground">
                        ⚡ Step 1: Extract viral clips first ➔ Step 2: Add dynamic captions &amp; hook titles
                      </span>
                      <span className="text-primary font-black">
                        {clipCount === 0 ? "Smart Sizing (~5 Clips)" : `${clipCount} Clip${clipCount > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>

                  {/* 4. Format Conversion & Hook Detection Strategy */}
                  <div className="mt-6 space-y-4">
                    {/* Framing & Aspect Ratio Banner */}
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                        Format Conversion
                      </span>
                      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3.5 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📱</span>
                          <div>
                            <p className="text-xs font-black text-foreground">16:9 Landscape Upload ➔ 9:16 Vertical Video (1080×1920)</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                              Auto-reframed with punch-in zoom &amp; smooth speech tracking for YouTube Shorts, Reels &amp; TikTok
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                          9:16 Vertical
                        </span>
                      </div>
                    </div>

                    {/* AI Viral Hook Detection Strategy */}
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                        AI Viral Hook Detection Strategy
                      </span>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {[
                          { id: "high-energy", label: "🔥 High Energy & Debate", sub: "Loudest takes & conflict" },
                          { id: "actionable", label: "💡 Actionable Advice", sub: "Step-by-step how-to tips" },
                          { id: "story", label: "❤️ Story & Insights", sub: "Emotional & personal peaks" },
                        ].map((strat) => {
                          const active = clipsHookStrategy === strat.id;
                          return (
                            <button
                              key={strat.id}
                              type="button"
                              onClick={() => setClipsHookStrategy(strat.id as "high-energy" | "actionable" | "story")}
                              className={`min-h-[54px] rounded-2xl border p-3 text-left transition-all touch-manipulation active:scale-[0.99] ${
                                active
                                  ? "bg-primary/10 border-primary text-foreground shadow-xs font-bold"
                                  : "bg-card border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{strat.label}</p>
                              <p className="text-[9px] mt-0.5 opacity-80 leading-tight">{strat.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Hook Banner Style */}
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground block mb-3">
                        Top Hook Teaser Banner
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {[
                          { id: "glass-pill", label: "⚡ Glass Card", sub: "Modern frosted bumper" },
                          { id: "yellow-ticker", label: "🟡 Yellow Ticker", sub: "High-contrast hook" },
                          { id: "none", label: "🚫 No Banner", sub: "Clean video only" },
                        ].map((banner) => {
                          const active = clipsTopBanner === banner.id;
                          return (
                            <button
                              key={banner.id}
                              type="button"
                              onClick={() => setClipsTopBanner(banner.id as "none" | "glass-pill" | "yellow-ticker")}
                              className={`min-h-[48px] rounded-xl border p-2 sm:p-2.5 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                active
                                  ? "bg-primary/10 border-primary text-primary font-bold"
                                  : "bg-card border-border text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{banner.label}</p>
                              <p className="text-[9px] opacity-75 leading-tight">{banner.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 5. Translucent Receipt Card */}
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

              <div className={mode === "autoCaption" || mode === "youtubeSubtitleGenerator" || mode === "customAiReel" || mode === "longVideoPromo" || mode === "compare" || mode === "typographyVideo" || mode === "longVideoClips" || mode === "whiteboardVideo" || mode === "audioClean" || mode === "longVideoPro" || mode === "imageToVideoAi" ? "hidden" : "rounded-lg border border-border bg-card/[0.035] p-4"}>
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

                  {/* Motion Pacing & Ambient Soundtrack Studio */}
                  <div className="mt-4 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-sm backdrop-blur-md sm:p-6 space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Cinematic Motion & Background Soundtrack</p>
                    </div>

                    {/* Visual Motion Pacing */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Visual Motion & Pan/Zoom Pacing</label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          { id: "dynamic", label: "⚡ High-Retention Kinetic", sub: "Active pan, drift & subtle punch zoom" },
                          { id: "ambient", label: "🌊 Subtle Ambient Drift", sub: "Slow relaxed documentary glide" },
                        ].map((mot) => {
                          const active = facelessMotionIntensity === mot.id;
                          return (
                            <button
                              key={mot.id}
                              type="button"
                              onClick={() => setFacelessMotionIntensity(mot.id as "ambient" | "dynamic")}
                              className={`min-h-[54px] rounded-2xl border p-3 text-left transition-all touch-manipulation active:scale-[0.99] ${
                                active
                                  ? "border-indigo-400 bg-indigo-400/10 ring-2 ring-indigo-400/20 text-indigo-300 font-bold"
                                  : "border-white/10 bg-black/30 hover:border-white/20 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{mot.label}</p>
                              <p className="text-[9px] mt-0.5 opacity-75 leading-tight">{mot.sub}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ambient BGM Mood */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Background Soundtrack Vibe</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {[
                          { id: "lofi", label: "☕ Cozy Lo-Fi" },
                          { id: "tech", label: "⚡ Deep Tech" },
                          { id: "mystery", label: "🔍 Mystery" },
                          { id: "acoustic", label: "🎸 Acoustic" },
                          { id: "none", label: "🔇 Voice Only" },
                        ].map((sound) => {
                          const active = facelessBgmMood === sound.id;
                          return (
                            <button
                              key={sound.id}
                              type="button"
                              onClick={() => setFacelessBgmMood(sound.id as "lofi" | "tech" | "mystery" | "acoustic" | "none")}
                              className={`min-h-[44px] rounded-xl border p-2 text-center transition-all touch-manipulation active:scale-[0.98] ${
                                active
                                  ? "border-indigo-400 bg-indigo-400/10 text-indigo-300 font-bold"
                                  : "border-white/10 bg-black/30 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <p className="text-xs font-bold leading-tight">{sound.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {facelessBgmMood !== "none" && (
                      <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="text-xs text-zinc-300 font-medium">BGM Audio Balance:</label>
                        <div className="flex items-center gap-3 w-full sm:max-w-xs">
                          <input
                            type="range"
                            min="0.10"
                            max="0.50"
                            step="0.05"
                            value={facelessBgmVolume}
                            onChange={(e) => setFacelessBgmVolume(parseFloat(e.target.value))}
                            className="w-full h-8 accent-indigo-400 cursor-pointer touch-manipulation"
                          />
                          <span className="text-xs font-mono text-zinc-400 w-12 text-right">{Math.round(facelessBgmVolume * 100)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
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

              {mode !== "audioClean" && mode !== "imageToVideoAi" && (
                <>
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

                  {isPaidModeLocked ? (
                    hasUserSelectedMedia ? (
                      <button
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        onClick={() => setShowUpgradeModal(true)}
                        type="button"
                      >
                        <Sparkles size={17} />
                        <span>Upgrade Plan to Render {activeMode.title} ({plannedCreditDetail || "Paid"})</span>
                      </button>
                    ) : (
                      <button
                        className="inline-flex w-full items-center justify-center gap-2 cursor-not-allowed opacity-50"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          color: 'var(--text-dark-muted)',
                          fontSize: '15px',
                          fontWeight: 600,
                          padding: '14px 18px',
                          borderRadius: '10px',
                          width: '100%',
                          border: '1px solid var(--border)',
                        }}
                        disabled={true}
                        type="button"
                      >
                        <Sparkles size={17} />
                        <span>
                          {mode === "customAiReel"
                            ? "Describe Video to Continue"
                            : activeMode.accept.startsWith("video")
                            ? "Upload Video First"
                            : "Upload Audio First"}
                        </span>
                      </button>
                    )
                  ) : (
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
                          ? "Preparing..."
                          : jobStatus.state === "rendering"
                            ? "Rendering HD video... please wait"
                            : paidLimitComplete
                              ? isFreeSignupCredit ? "Buy Credits to Create More" : "Plan limit complete"
                              : !selectedFile && mode !== "customAiReel"
                                ? (activeMode.accept.startsWith("video") ? "Upload Video First" : "Upload Audio First")
                                : isFreeSignupCredit && mode === "autoCaption"
                                  ? "Create Free Auto Caption (1 Trial)"
                                  : isFreeSignupCredit ? "Create My Video" : "Create My Reel"}
                    </button>
                  )}

                  {isPaidModeLocked && hasUserSelectedMedia && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-medium text-amber-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span>{activeMode.title} requires paid credits or plan upgrade. All styles, fonts &amp; presets are free to customize!</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowUpgradeModal(true)}
                          className="rounded-full bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 text-xs hover:bg-amber-300 transition cursor-pointer"
                        >
                          Upgrade Plan →
                        </button>
                        <button type="button" onClick={() => chooseVideoTypeMode("autoCaption")} className="rounded-full bg-white/10 text-white font-bold px-3 py-1.5 text-xs hover:bg-white/20 transition cursor-pointer">
                          Try Free Auto Caption
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-center text-xs font-bold leading-5 text-muted-foreground">
                    {renderInProgress
                      ? "Please do not close this tab. Usually 2-10 minutes."
                      : mode === "customAiReel" && customAiPrompt.trim().length < 12 ? "Describe your video to continue. " : mode !== "customAiReel" && !selectedFile ? "Upload a file to continue. " : mode === "compare" && comparisonFiles.length !== 2 ? "Add at least two compare images. " : ""}
                    {!renderInProgress ? isFreeSignupCredit && !paidLimitComplete ? "Failed renders are not charged. Usually 2-10 minutes." : "Usually 2-10 minutes depending on video type and load." : ""}
                  </p>
                  <ProgressPreview mode={mode} />
                </>
              )}
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
                  isFreePlan={isFreeSignupCredit || !isPaidUserWithCredits}
                />
              ) : null}
            </div>
          ) : null}
        </section>

          </div>
        )}

        {/* ── M3 Projects Tab ── */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Projects
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
                    {recentRenders.length} Projects
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                  Your rendered videos and cleaned audio are preserved in secure cloud storage for 48 hours for fast download.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("video-types")}
                className="inline-flex self-start sm:self-auto items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 px-5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Create Video</span>
              </button>
            </div>

            {recentRenders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {recentRenders.map((render) => {
                  const isAudio = render.mode === "audioClean";
                  const downloadFilename = isAudio
                    ? `${render.title || "cleaned-audio"}.mp3`
                    : `${render.title || "video"}.mp4`;

                  return (
                    <div
                      key={render.id}
                      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0B0F19] p-5 shadow-xl transition-all duration-200 hover:border-amber-400/40 hover:shadow-2xl"
                    >
                      <div>
                        {/* Top Badges: Mode & Expiry */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 truncate max-w-[160px]">
                            {getModeLabel(render.mode)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                            <Clock3 size={11} className="text-amber-400" />
                            <span>{formatTimeLeft(render.expiresAt)}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                          {render.title || (isAudio ? "Cleaned Audio" : "Untitled Video")}
                        </h3>

                        {render.design && (
                          <p className="mt-1 text-[11px] text-zinc-400 font-medium">
                            Style: <span className="capitalize text-zinc-200">{render.design}</span>
                          </p>
                        )}

                        {/* Inline Audio Player for audioClean projects */}
                        {isAudio && render.outputFile && (
                          <div className="mt-3 rounded-2xl bg-white/[0.04] border border-white/10 p-2">
                            <audio
                              controls
                              preload="none"
                              className="w-full h-8"
                              src={render.outputFile}
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions Row */}
                      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => downloadFileDirectly(render.outputFile, downloadFilename, render.id, render.mode)}
                          disabled={downloadingUrl === render.outputFile}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 px-4 py-1.5 text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {downloadingUrl === render.outputFile ? (
                            <>
                              <div className="h-3 w-3 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download size={13} />
                              <span>{isAudio ? "Download MP3" : "Download MP4"}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => requestDeleteRender(render)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* M3 Empty Projects State */
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 sm:p-14 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-4">
                  <FolderOpen size={26} />
                </div>
                <h3 className="text-base font-bold text-white">No saved projects yet</h3>
                <p className="mt-1.5 max-w-sm mx-auto text-xs text-zinc-400">
                  Pick a workflow from Video Types or AI Audio Cleaner to create and render your project.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("video-types")}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 px-5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer"
                  >
                    <LayoutGrid size={15} />
                    <span>Explore Video Types</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── M3 Credits & Subscription Plans Tab ── */}
        {activeTab === "credits" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Credits &amp; Plans
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Track your active plan, rendering allowance, credit cost, and upgrade options.
              </p>
            </div>

            {/* M3 Elevated Credits Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-xs font-extrabold text-amber-400 mb-2">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>{billingEntitlement?.planName || "Starter Plan"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Available Video Credits</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Each credit enables high-resolution AI video generation and cloud rendering.
                  </p>
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 px-6 py-2.5 text-xs font-black shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  <Sparkles size={14} />
                  <span>Get More Credits</span>
                </Link>
              </div>

              {/* Progress Bar & Numbers */}
              {(() => {
                const total = Math.round(billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || 100);
                const remaining = Math.round(billingEntitlement?.usage?.remaining ?? (billingEntitlement?.active ? total : 0));
                const used = Math.max(0, total - remaining);
                const percent = Math.min(100, Math.max(0, (remaining / (total || 1)) * 100));

                return (
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">{remaining}</span>
                        <span className="text-sm font-semibold text-zinc-400 ml-1.5">/ {total} credits remaining</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">{used} credits used</span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Included Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs font-bold text-white">1080p Full HD</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Crystal clear export quality</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs font-bold text-white">Zero Watermark</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Clean viral outputs</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs font-bold text-white">Groq Whisper</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Ultra-fast subtitle sync</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs font-bold text-white">48h Cloud Vault</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Download projects anytime</p>
                </div>
              </div>

              {/* Credit Consumption Guide */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Credit Usage Transparent Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <p className="font-bold text-white">9:16 Shorts &amp; Reels</p>
                    <p className="text-amber-400 font-mono font-bold mt-1">1 Credit / minute</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Auto Caption, Typography, Compare, Notes</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <p className="font-bold text-white">16:9 Long Videos</p>
                    <p className="text-amber-400 font-mono font-bold mt-1">2 Credits / minute</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">YouTube Explainers, Faceless Video</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <p className="font-bold text-white">AI Audio Cleaner</p>
                    <p className="text-amber-400 font-mono font-bold mt-1">1 Credit / file</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Vocal separation &amp; retake removal</p>
                  </div>
                </div>
              </div>

              {/* Subscription Plans Quick Upgrade Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Upgrade or Recharge</h3>
                  <Link href="/pricing" className="text-xs font-bold text-amber-400 hover:underline">
                    Compare All Features →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-amber-400/30 transition">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">Starter</span>
                      <h4 className="text-lg font-black text-white mt-2">$29<span className="text-xs font-normal text-zinc-400">/mo</span></h4>
                      <p className="text-xs text-amber-400 font-mono font-bold mt-1">100 Video Credits</p>
                      <p className="text-[11px] text-zinc-400 mt-2">Perfect for creators publishing 3–4 reels per week.</p>
                    </div>
                    <Link
                      href="/pricing"
                      className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition"
                    >
                      Choose Starter
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/[0.04] p-4 flex flex-col justify-between relative shadow-lg">
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">Growth</span>
                      <h4 className="text-lg font-black text-white mt-2">$49<span className="text-xs font-normal text-zinc-400">/mo</span></h4>
                      <p className="text-xs text-amber-400 font-mono font-bold mt-1">300 Video Credits</p>
                      <p className="text-[11px] text-zinc-400 mt-2">For high-output creators and daily social media channels.</p>
                    </div>
                    <Link
                      href="/pricing"
                      className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs text-center shadow-md transition"
                    >
                      Choose Growth
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-amber-400/30 transition">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">Pro Agency</span>
                      <h4 className="text-lg font-black text-white mt-2">$149<span className="text-xs font-normal text-zinc-400">/mo</span></h4>
                      <p className="text-xs text-amber-400 font-mono font-bold mt-1">1,000 Video Credits</p>
                      <p className="text-[11px] text-zinc-400 mt-2">Full cloud speed, priority rendering, multi-channel batching.</p>
                    </div>
                    <Link
                      href="/pricing"
                      className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition"
                    >
                      Choose Pro
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── M3 Account Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-white/10">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Profile
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Manage your account credentials, security settings, and app preferences.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl space-y-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/20">
                  {user?.email ? user.email.charAt(0).toUpperCase() : <User size={28} />}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {user?.email || "Creator Account"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Member ID: <span className="font-mono text-zinc-300">{user?.id?.slice(0, 16) || "Free-Tier"}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5 space-y-3">
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="font-semibold text-zinc-400">Plan Status</span>
                  <span className="font-bold text-amber-400 font-mono uppercase">{billingEntitlement?.planName || "Starter Plan"}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs border-t border-white/5">
                  <span className="font-semibold text-zinc-400">Render Quality</span>
                  <span className="font-bold text-white font-mono">1080p Full HD @ 30 FPS</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs border-t border-white/5">
                  <span className="font-semibold text-zinc-400">AI Speech Engine</span>
                  <span className="font-bold text-emerald-400 font-mono">Groq Whisper (English &amp; Roman Hinglish)</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs border-t border-white/5">
                  <span className="font-semibold text-zinc-400">Cloud Storage Vault</span>
                  <span className="font-bold text-white font-mono">48 Hours Retention</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 transition cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>Privacy &amp; Data Security</span>
                </button>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-zinc-200 transition cursor-pointer"
                >
                  <span>Contact Support</span>
                </Link>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 text-xs font-bold transition ml-auto cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-200">Delete project</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
                    Remove this {deleteCandidate.mode === "audioClean" ? "audio" : "video"}?
                  </h2>
                  <p className="mt-2 text-[13px] font-medium leading-5 text-muted-foreground">
                    This only removes the project from your dashboard history on this device/account. Cloud storage links still expire automatically after 48 hours.
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
                  Keep project
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-400 px-4 py-3.5 text-sm font-bold text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deletingRenderId === deleteCandidate.id}
                  onClick={() => void deleteRender(deleteCandidate)}
                  type="button"
                >
                  <Trash2 size={16} />
                  Delete project
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

      {/* Pro Studio Upgrade Plan Modal (Triggered on Media Upload / Render for Paid Modes) */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowUpgradeModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Upgrade Plan"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0B0F19] p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              type="button"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header Icon + Title */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{activeMode.title}</h3>
                  <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider">
                    Pro Studio
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  Yeh video type Pro / Paid plans me aata hai.
                </p>
              </div>
            </div>

            {/* Description & Value Props */}
            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 space-y-2.5">
              <div className="text-xs leading-relaxed text-zinc-200">
                Aap apne uploaded media ke saath <strong>saare styles, presets, fonts, safe-zones aur audio controls</strong> freely explore & customize kar sakte hain!
              </div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                Final watermark-free 1080p HD video render aur download karne ke liye plan upgrade ya credits zaroori hain.
              </div>

              {plannedCreditDetail && (
                <div className="pt-1 flex items-center justify-between text-[11px] font-medium text-amber-300/90 border-t border-white/5">
                  <span>Render Cost:</span>
                  <span className="font-bold text-amber-400">{plannedCreditDetail}</span>
                </div>
              )}
            </div>

            {/* Free Trial Hint if user is on Free Plan */}
            {isFreeSignupCredit && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <Gift size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                <div className="flex-1 text-[11px] leading-relaxed">
                  Aapke account par <strong>1 Free Trial</strong> available hai! Aap <strong>Auto Caption Generator</strong> (9:16 Reel) bilkul free me test kar sakte hain.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Zap size={16} className="fill-white" />
                <span>Upgrade Plan / View Pricing →</span>
              </Link>

              {isFreeSignupCredit && (
                <button
                  type="button"
                  onClick={() => {
                    chooseVideoTypeMode("autoCaption");
                    setShowUpgradeModal(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Try 1 Free Auto Caption Trial</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Continue Customizing &amp; Exploring
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div className="shrink-0 rounded-md bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    {previewVideoType.mode === "longVideoClips"
                      ? "3–12 credits"
                      : previewVideoType.mode === "youtubeSubtitleGenerator"
                        ? "1 credit / 2 min"
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

                {previewVideoType.mode === "compare" && (
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        15+ Animated Presenter Characters
                      </span>
                      <a
                        href="/compare-explainer"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-300 underline hover:text-amber-200"
                      >
                        Explore Gallery →
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {[
                        { label: 'Welcome', src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788974553/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-welcome.png' },
                        { label: 'Left', src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788974301/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-left.png' },
                        { label: 'Right', src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788974315/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-right.png' },
                        { label: 'Think', src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788974676/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-thinking.png' },
                        { label: 'Success', src: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788974868/Templates/Compare%20Explainer/Characters/3d-presenter-man/teacher-success.png' },
                      ].map((p) => (
                        <div key={p.label} className="flex flex-col items-center shrink-0 rounded-lg bg-black/40 p-1 border border-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.src} alt={p.label} className="h-10 w-auto object-contain" />
                          <span className="text-[9px] text-zinc-400 mt-0.5">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
    if (!user) {
      router.push("/login");
      return;
    }
    if (isPaidModeLocked) {
      renderRequestInFlightRef.current = false;
      setShowUpgradeModal(true);
      return;
    }
    if (renderRequestInFlightRef.current || renderInProgress) return;
    renderRequestInFlightRef.current = true;

    // GA4 High Intent Event: Render Initiated
    trackRenderInitiate({
      mode,
      durationSeconds: promoClipMeta.durationSeconds,
      creditCost: plannedCreditUnits ? plannedCreditUnits / 10 : 1,
      videoLayout: captionPosition,
    });
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

    if (mode === "compare" && (!comparisonFiles[0] || !comparisonFiles[1])) {
      renderRequestInFlightRef.current = false;
      setJobStatus({state: "error", message: "Compare needs exactly two images: one left and one right."});
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

      const comparisonImageKeys = mode === "compare"
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

      const imageToVideoUploadedKeys = mode === "imageToVideoAi" && imageToVideoImages.length > 0
        ? await uploadVideoTypeImages({files: imageToVideoImages, mode: "imageToVideoAi", userId})
        : [];
      const imageToVideoBgmKey = mode === "imageToVideoAi" && imageToVideoBgm
        ? await uploadVideoTypeImage({file: imageToVideoBgm, userId, mode: "imageToVideoAi"})
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
              fileName: renderFileName,
              title: renderFileName.replace(/\.[^.]+$/, "") || "Cleaned Audio",
              audioCleanOptions,
              transcript: audioCleanAnalysis?.rawTranscript,
              segmentsToCut: [
                ...(audioCleanAnalysis?.segments?.filter((s) => s.action === "cut") || []),
                ...((audioCleanAnalysis?.segments || []).flatMap((s: any) => s.action === "keep" && s.internalCuts ? s.internalCuts : []))
              ],
            }),
          });
          const cleanResult = await readJsonPayload(cleanResponse);
          if (!cleanResponse.ok || !cleanResult.ok) {
            throw new Error(cleanResult.error || "Audio cleaning failed.");
          }

          const renderId = cleanResult.renderId || `clean-${Date.now()}`;
          const plannedTitle = cleanResult.title || renderFileName.replace(/\.[^.]+$/, "") || "Cleaned Audio";
          const finishedRender: RecentRender = {
            id: renderId,
            title: plannedTitle,
            mode: "audioClean",
            design: "Studio Mastered Audio",
            outputFile: cleanResult.outputUrl,
            createdAt: Date.now(),
            expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
          };
          const localRenders = saveRecentRender(userId, finishedRender);
          setRecentRenders(localRenders);
          if (cleanResult.bucketName) {
            saveServerRecentRender(userId, finishedRender, cleanResult.bucketName).then((serverRender) => {
              if (!serverRender) return;
              setRecentRenders((current) => mergeRecentRenders([serverRender, ...current]));
              saveRecentRenders(userId, mergeRecentRenders([serverRender, ...localRenders]));
            }).catch((error) => {
              console.warn("Could not save audio render history to Supabase:", error);
            });
          }

          setAudioCleanResult(cleanResult);
          setJobStatus({
            state: "ready",
            message: "Audio cleaned successfully! Saved in Projects for 48 hours.",
            outputFile: cleanResult.outputUrl,
            renderId,
            bucketName: cleanResult.bucketName,
            title: plannedTitle,
            mode: "audioClean",
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

      // Preview step removed per user request: all modes render directly for speed
      const PREVIEW_SUPPORTED_MODES: Mode[] = [];
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
              videoLayout: (mode === "autoCaption" || mode === "youtubeSubtitleGenerator") ? "fullscreen" : videoLayout,
              progressStyle: (mode === "autoCaption" || mode === "youtubeSubtitleGenerator") ? "none" : progressStyle,
              wordClickSound: (mode === "autoCaption" || mode === "youtubeSubtitleGenerator") ? false : wordClickSound,
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
        customAiImageKeys: [],
        customAiLogoKey: "",
        uploadedImageKeys: imageToVideoUploadedKeys,
        bgmKey: imageToVideoBgmKey,
        bgmVolume: imageToVideoBgmVolume,
        imageToVideoSubtitleStyle: imageToVideoSubtitleStyle,
        imageToVideoCameraMotionPreset: imageToVideoCameraMotion,
        imageToVideoFitMode: imageToVideoFitMode,
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
    customAiImageKeys,
    customAiLogoKey,
    customAiVideoKey = "",
    customAiAudioKey = "",
    customAiVideoDurationSeconds,
    customAiAudioDurationSeconds,
    uploadedImageKeys = [],
    bgmKey = "",
    bgmVolume = 0.15,
    imageToVideoSubtitleStyle = "demo-storyteller",
    imageToVideoCameraMotionPreset = "ken-burns",
    imageToVideoFitMode = "blur-fill",
    overrideInputProps,
  }: {
    mediaKey: string;
    fileName: string;
    contentType: string;
    userId: string;
    comparisonImageKeys: string[];
    promoThumbnailKey: string;
    customAiImageKeys: string[];
    customAiLogoKey: string;
    customAiVideoKey?: string;
    customAiAudioKey?: string;
    customAiVideoDurationSeconds?: number;
    customAiAudioDurationSeconds?: number;
    uploadedImageKeys?: string[];
    bgmKey?: string;
    bgmVolume?: number;
    imageToVideoSubtitleStyle?: string;
    imageToVideoCameraMotionPreset?: string;
    imageToVideoFitMode?: string;
    overrideInputProps: Record<string, unknown>;
  }) {
    setJobStatus({state: "starting", message: planningMessageForMode(mode)});
    try {
      const jobStartMs = performance.now();

      // AI Audio Cleaner uses its dedicated audio mastering pipeline
      if (mode === "audioClean") {
        setJobStatus({
          state: "rendering",
          progress: 0.3,
          message: "Cleaning audio: removing fillers, dead air, and normalizing volume...",
        });
        const cleanResponse = await fetch("/api/audio-clean", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaKey,
            userId,
            fileName: renderFileName,
            title: renderFileName.replace(/\.[^.]+$/, "") || "Cleaned Audio",
            audioCleanOptions,
          }),
        });
        const cleanResult = await readJsonPayload(cleanResponse);
        if (!cleanResponse.ok || !cleanResult.ok) {
          setJobStatus({
            state: "error",
            message: sanitizeUserFacingStatus(cleanResult?.error || "Audio cleaning failed. Please try again."),
            reasonCode: "AUDIO_CLEAN_FAILED",
          });
          return;
        }

        const renderId = cleanResult.renderId || `clean-${Date.now()}`;
        const plannedTitle = cleanResult.title || renderFileName.replace(/\.[^.]+$/, "") || "Cleaned Audio";
        const finishedRender: RecentRender = {
          id: renderId,
          title: plannedTitle,
          mode: "audioClean",
          design: "Studio Mastered Audio",
          outputFile: cleanResult.outputUrl,
          createdAt: Date.now(),
          expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
        };
        const localRenders = saveRecentRender(userId, finishedRender);
        setRecentRenders(localRenders);
        if (cleanResult.bucketName) {
          saveServerRecentRender(userId, finishedRender, cleanResult.bucketName).then((serverRender) => {
            if (!serverRender) return;
            setRecentRenders((current) => mergeRecentRenders([serverRender, ...current]));
            saveRecentRenders(userId, mergeRecentRenders([serverRender, ...localRenders]));
          }).catch((error) => {
            console.warn("Could not save audio render history to Supabase:", error);
          });
        }

        setJobStatus({
          state: "ready",
          message: "Mastered studio audio is ready! Saved in Projects for 48 hours.",
          progress: 1,
          outputFile: cleanResult.outputUrl,
          renderId,
          bucketName: cleanResult.bucketName,
          title: plannedTitle,
          mode: "audioClean",
        });
        return;
      }

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
          compareSpeakingPace,
          compareBgmTrack,
          compareCaptionStyle,
          creatorHandle: (mode === "longVideoPromo" && promoCreatorHandle.trim()) ? promoCreatorHandle.trim() : (compareHandle.trim() || "@itnavideo"),
          stickerStyle: String(overrideInputProps.stickerStyle || stickerStyle),
          // Use edited values from preview if available, else dashboard form values.
          // Long Video Promo is intentionally thumbnail + title + promo media only.
          ...(mode !== "longVideoPromo" ? {
            captionStyle: String(overrideInputProps.captionStyle || (mode === "compare" ? compareCaptionStyle : captionStyle)),
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
          videoLayout: (mode === "autoCaption" || mode === "youtubeSubtitleGenerator") ? "fullscreen" : String(overrideInputProps.videoLayout || videoLayout),
          progressStyle: (mode === "autoCaption" || mode === "youtubeSubtitleGenerator") ? "none" : String(overrideInputProps.progressStyle || progressStyle),
          wordClickSound: mode === "autoCaption" ? wordClickSound : mode === "youtubeSubtitleGenerator" ? false : wordClickSound,
          captionEmphasisAnimation,
          youtubeSubtitleSafeZone,
          youtubeSubtitleCase,
          typographySfxIntensity,
          typographyPacing,
          typographyTextCase,
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
            promoCtaStyle,
            promoCreatorHandle,
            promoBackgroundMode,
            enableCaptions: promoEnableCaptions,
            thumbnailKey: promoThumbnailKey || undefined,
            durationSeconds: promoClipMeta.durationSeconds || undefined,
            sourceDurationSeconds: promoClipMeta.durationSeconds || undefined,
            mediaAspect: promoClipMeta.mediaAspect || undefined,
          } : {}),
          // Auto Caption / YouTube Subtitle Generator duration & aspect fields
          ...(mode === "autoCaption" || mode === "youtubeSubtitleGenerator" ? {
            durationSeconds: promoClipMeta.durationSeconds || undefined,
            sourceDurationSeconds: promoClipMeta.durationSeconds || undefined,
            mediaAspect: mode === "youtubeSubtitleGenerator" ? "landscape" : (promoClipMeta.mediaAspect || "portrait"),
            safeZoneMargin: youtubeSubtitleSafeZone,
            textCasing: youtubeSubtitleCase,
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
            clipsAspectRatio,
            clipsHookStrategy,
            clipsTopBanner,
          } : {}),
          // AI Audio Cleaner fields
          ...(mode === "audioClean" ? {
            audioCleanOptions: {
              ...audioCleanOptions,
              exportFormat: audioCleanFormat,
              noiseReductionLevel: audioCleanNoiseLevel,
              vocalTone: audioCleanVocalTone,
            },
          } : {}),
          // SFX preference
          enableSfx,
          // Typography Video fields
          ...(mode === "typographyVideo" ? {
            typographyStyle,
            typographyShowCaptions: false,
            sfxIntensity: typographySfxIntensity,
            pacing: typographyPacing,
            textCase: typographyTextCase,
          } : {}),
          // Whiteboard Video fields
          ...(mode === "whiteboardVideo" ? {
            whiteboardBoard,
            whiteboardTheme,
            whiteboardHandStyle,
            whiteboardMarkerColor,
            whiteboardFont,
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
            facelessMotionIntensity,
            facelessBgmMood,
            facelessBgmVolume,
          } : {}),
          // Image to Video AI fields
          ...(mode === "imageToVideoAi" ? {
            uploadedImageKeys,
            bgmKey: bgmKey || undefined,
            bgmVolume,
            subtitleStyle: imageToVideoSubtitleStyle,
            cameraMotionPreset: imageToVideoCameraMotionPreset,
            fitMode: imageToVideoFitMode,
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
        const errMsg = sanitizeUserFacingStatus(job.error || job.message || "Could not start render.");
        trackRenderFailed({ mode, errorReason: errMsg });
        setJobStatus({
          state: "error",
          message: errMsg,
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

        // GA4 Primary Activation Conversion
        trackRenderSuccess({
          renderId,
          mode,
          durationSeconds: promoClipMeta.durationSeconds,
          creditCost: plannedCreditUnits ? plannedCreditUnits / 10 : 1,
        });

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
          attempt: String(attempt),
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
        const errMsg = status.error || (status.errors?.[0]?.message ? sanitizeUserFacingStatus(status.errors[0].message) : "Render failed.");
        trackRenderFailed({ mode, errorReason: errMsg });
        setJobStatus({
          state: "error",
          message: errMsg,
          failureStage: "render",
          diagnostics: isFounderDebugUser ? formatFounderDiagnostics(status.diagnostics || []) : undefined,
          renderId,
          bucketName,
          ...meta,
        });
        return;
      }
      if (status.done && status.errors?.length) {
        const errMsg = sanitizeUserFacingStatus(status.errors[0]?.message || "Render failed.");
        trackRenderFailed({ mode, errorReason: errMsg });
        setJobStatus({
          state: "error",
          message: errMsg,
          failureStage: "render",
          diagnostics: isFounderDebugUser ? formatFounderDiagnostics(status.diagnostics || []) : undefined,
          renderId,
          bucketName,
          ...meta,
        });
        return;
      }
      if (status.done) {
        // GA4 Primary Activation Conversion
        trackRenderSuccess({
          renderId,
          mode,
          durationSeconds: promoClipMeta.durationSeconds,
          creditCost: plannedCreditUnits ? plannedCreditUnits / 10 : 1,
        });

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
      headline?: string;
      viralityScore?: number;
      viralityGrade?: string;
      whyItWorks?: string;
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
  if ((mode === "autoCaption" || mode === "youtubeSubtitleGenerator" || mode === "dynamicCreator") && !isVideo) {
    if (mode === "dynamicCreator") return "Creator Reel Video needs a video file. Please upload an MP4/MOV video.";
    if (mode === "youtubeSubtitleGenerator") return "YouTube Subtitle Generator needs a video file. Please upload an MP4/MOV/WEBM video.";
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
  if (mode === "imageToVideoAi" && !isAudio) {
    return "Image to Video AI needs an audio voiceover file (MP3, WAV, M4A, AAC) up to 10 minutes.";
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
    if (!file) continue;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("folder", "user-uploads/compare");

      const cloudRes = await fetch("/api/media/cloudinary-upload", {
        method: "POST",
        body: formData,
      });
      const cloudData = await readJsonPayload(cloudRes);
      if (cloudRes.ok && cloudData.ok && cloudData.url) {
        keys.push(cloudData.url);
        continue;
      }
      console.warn("[CLOUDINARY_UPLOAD_FALLBACK]", cloudData?.error);
    } catch (cErr) {
      console.warn("[CLOUDINARY_UPLOAD_ERROR_FALLBACK_TO_S3]", cErr);
    }

    // Fallback to S3 presigned upload
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
  if (mode === "youtubeSubtitleGenerator") return "Transcribing speech & syncing creator subtitles for your YouTube video...";
  if (mode === "autoCaption") return "Preparing styled captions for your reel...";
  if (mode === "compare") return "Preparing left/right comparison scenes...";
  if (mode === "autoDraw") return "Creating whiteboard scenes from your voiceover...";
  if (mode === "longVideoPromo") return "Preparing your promo reel...";
  if (mode === "dynamicCreator") return "Preparing dynamic text and pacing...";
  if (mode === "customAiReel") return "Planning your custom reel timeline...";
  if (mode === "imageToVideoAi") return "Transcribing voiceover & syncing Ken Burns scenes with 2.5D parallax subtitles...";
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
  const BATCH_SIZE = 4;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const chunk = files.slice(i, i + BATCH_SIZE);
    const chunkKeys = await Promise.all(
      chunk.map((file) => uploadVideoTypeImage({file, mode, userId}))
    );
    keys.push(...chunkKeys);
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔒</span>
                    <div>
                      <p className="font-extrabold text-sm text-white">Free Export Includes Watermark</p>
                      <p className="text-xs text-zinc-400">Upgrade to Pro to remove watermark &amp; unlock clean 4K/1080p downloads.</p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    👑 Upgrade to Remove
                  </Link>
                </div>
                <a
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-card px-4 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
                  href={status.outputFile}
                  download={`itnavideo-${mode || 'reel'}.mp4`}
                  rel="noreferrer"
                  onClick={() => trackVideoDownload({ renderId: status.renderId || 'output', mode })}
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
        : mode === "longVideoPromo"
          ? "Preparing your thumbnail, title, and promo clip layout."
        : mode === "customAiReel"
          ? "Turning your instructions into a structured visual timeline."
          : mode === "youtubeSubtitleGenerator"
            ? "AI is transcribing speech with Groq Whisper and calculating word timestamps for YouTube subtitles."
          : mode === "autoCaption"
            ? "AI is transcribing speech with Groq Whisper and calculating word timestamps."
            : mode === "imageToVideoAi"
              ? "AI is transcribing speech pace and sequencing scene visuals with Ken Burns motion."
              : "AI is transcribing and building the reel structure.",
      badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
      icon: Layers3,
      iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
      kicker: mode === "longVideoPro" ? "AI is planning scenes" : mode === "compare" ? "AI is transcribing" : mode === "longVideoPromo" ? "Promo setup" : mode === "customAiReel" ? "Timeline planning" : mode === "youtubeSubtitleGenerator" ? "Transcribing speech" : mode === "autoCaption" ? "Transcribing speech" : mode === "imageToVideoAi" ? "Pacing scene cuts" : mode === "typographyVideo" ? "Extracting punch keywords" : "AI is transcribing",
      kickerClass: "text-brand-mint",
      title: mode === "longVideoPro" ? "AI is directing your video" : mode === "compare" ? "Building your comparison" : mode === "longVideoPromo" ? "Preparing your promo reel" : mode === "customAiReel" ? "Planning your custom reel" : mode === "youtubeSubtitleGenerator" ? "Generating creator subtitles" : mode === "autoCaption" ? "Generating animated captions" : mode === "imageToVideoAi" ? "Directing Image to Video AI" : mode === "typographyVideo" ? "Styling kinetic typography" : "AI is transcribing",
    };
  }
  return {
    body: mode === "longVideoPromo"
      ? "Exporting your thumbnail, title, and promo clip. No transcription or captions are running."
      : mode === "longVideoPro"
        ? "AI is rendering your directed video with planned scenes and motion. This takes 3-10 minutes."
        : mode === "youtubeSubtitleGenerator"
          ? "Rendering your 16:9 YouTube video with creator-styled subtitles. Usually takes 30-90 seconds."
        : mode === "autoCaption"
          ? "Rendering your 30 FPS reel with animated motion captions. Usually takes 15-45 seconds."
          : mode === "imageToVideoAi"
            ? "Rendering 16:9 widescreen video with Ken Burns motion and 2.5D parallax subtitles."
            : mode === "typographyVideo"
              ? "Rendering your 30 FPS reel with dynamic kinetic typography & synced sound effects. Usually takes 30-60 seconds."
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
  if (mode === "typographyVideo") {
    return [
      {label: "Media received", detail: "Your video or audio file is safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "Transcribing speech", detail: "Groq Whisper syncing exact word timestamps.", threshold: 0.24, icon: Layers3},
      {label: "Extracting punch keywords", detail: "Highlighting power words, stats, and impact phrases.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering 9:16 Reel", detail: "Building kinetic typography reel with synced audio effects.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your typography reel appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "imageToVideoAi") {
    return [
      {label: "Audio & images received", detail: "Speech audio and scene images are ready.", threshold: 0.08, icon: Upload},
      {label: "Transcribing speech", detail: "AI detecting speech pace and word timestamps.", threshold: 0.24, icon: Layers3},
      {label: "Pacing scene cuts", detail: "Matching images to sentences with Ken Burns camera motion.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering 16:9 MP4", detail: "Building widescreen video with synced parallax subtitles.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your Image to Video MP4 appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "youtubeSubtitleGenerator") {
    return [
      {label: "Upload received", detail: "Your YouTube video file is safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "Transcribing speech", detail: "Groq Whisper syncing exact word timestamps.", threshold: 0.24, icon: Layers3},
      {label: "Styling creator subtitles", detail: "Applying chosen creator subtitle layout & typography.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering 16:9 MP4", detail: "Building landscape video with synced subtitles.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your subtitled YouTube video appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
  if (mode === "autoCaption") {
    return [
      {label: "Upload received", detail: "Your video file is safely uploaded.", threshold: 0.08, icon: Upload},
      {label: "Transcribing speech", detail: "Groq Whisper syncing exact word timestamps.", threshold: 0.24, icon: Layers3},
      {label: "Styling motion captions", detail: "Applying chosen animation style & color highlights.", threshold: 0.45, icon: Sparkles},
      {label: "Rendering 30 FPS MP4", detail: "Building vertical reel with synced captions.", threshold: 0.85, icon: Film},
      {label: "Ready to download", detail: "Your captioned reel appears here when ready.", threshold: 0.96, icon: Clapperboard},
    ];
  }
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
  if (normalized.includes("RENDER") || normalized.includes("WORKER")) return "render";
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
  if (normalized === "longvideoclips" || normalized === "longvideoclip" || normalized === "videoclips") return "longVideoClips";
  if (normalized === "dynamiccreator" || normalized === "dynamiccreatorreel" || normalized === "dynamicedit") return "dynamicCreator";
  if (normalized === "customaireel" || normalized === "customai" || normalized === "customreel") return "customAiReel";
  if (normalized === "audioclean" || normalized === "audiocleaner" || normalized === "aiaudiocleaner") return "audioClean";
  if (normalized === "imagetovideoai" || normalized === "imagetovideo" || normalized === "image2video" || normalized === "imagetovideovideo") return "imageToVideoAi";
  if (normalized === "aivideogenerator" || normalized === "aivideo" || normalized === "textovideo" || normalized === "scripttovideo" || normalized === "facelesslongvideo" || normalized === "facelessvideo" || normalized === "faceless" || normalized === "longvideopro" || normalized === "longvideo" || normalized === "aidirector" || normalized === "aidirectorreel" || normalized === "directorreel") return "facelessVideo";
  return null;
}

function getModeLabel(mode: Mode) {
  return modeConfig[toActiveDashboardMode(mode)]?.label || "Auto Caption";
}

function readDashboardMode(value: string | null): Mode | null {
  const normalized = String(value || "").toLowerCase().replace(/[-_\s]+/g, "");
  if (!normalized) return null;
  if (normalized === "imagetovideoai" || normalized === "imagetovideo" || normalized === "image2video" || normalized === "imagetovideovideo") return "imageToVideoAi";
  if (normalized === "aivideogenerator" || normalized === "aivideo" || normalized === "textovideo" || normalized === "scripttovideo" || normalized === "facelesslongvideo" || normalized === "facelessvideo" || normalized === "faceless" || normalized === "longvideopro" || normalized === "longvideo" || normalized === "aidirector" || normalized === "aidirectorreel" || normalized === "directorreel") return "facelessVideo";
  if (normalized === "youtubesubtitlegenerator" || normalized === "youtubesubtitles" || normalized === "youtubesubtitle" || normalized === "youtubecaptions" || normalized === "youtubecaption" || normalized === "longcaptionpro" || normalized === "longcaption") return "youtubeSubtitleGenerator";
  if (normalized === "autocaptiongenerator" || normalized === "autocaptionreel" || normalized === "autocaption" || normalized === "captiongenerator" || normalized === "captionstudio" || normalized === "customcaption") return "autoCaption";
  if (normalized === "compareexplainer" || normalized === "compare" || normalized === "comparison") return "compare";
  if (normalized === "autodrawexplainer" || normalized === "autodraw") return "autoDraw";
  if (normalized === "whiteboardvideo" || normalized === "whiteboardreel") return "whiteboardVideo";
  if (normalized === "typographyvideo" || normalized === "typographyreel" || normalized === "boldreel") return "typographyVideo";
  if (normalized === "longvideopromo" || normalized === "longvideopromotion" || normalized === "promo") return "longVideoPromo";
  if (normalized === "longformcaptioned" || normalized === "longvideocaptioned") return "autoCaption";
  if (normalized === "dynamiccreatorreel" || normalized === "dynamiccreator" || normalized === "dynamicedit") return "dynamicCreator";
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
  if (/rate exceeded|too many requests|toomanyrequests|concurrent.*limit|concurrency.*limit|limit exceeded|throttl/i.test(normalized)) {
    return "Render engine is warming up or processing previous tasks. Your upload stays selected, please retry in a moment.";
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








































