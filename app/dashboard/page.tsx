"use client";


import {StickerStylePicker} from '@/components/compare/StickerStylePicker';
import {CompareTextFields} from '@/components/compare/CompareTextFields';
import {CompareImageSlots} from '@/components/compare/CompareImageSlots';
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Download,
  Eye,
  Film,
  FolderOpen,
  ImageIcon,
  ImagePlus,
  Layers3,
  Loader2,
  LogOut,
  Lock,
  PenLine,
  Captions,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthContext";
import { SubtitleStylePicker, SUBTITLE_PRESETS } from "@/components/ui/SubtitleStylePicker";
import dynamic from "next/dynamic";

// Lazy-load PreviewEditor — only loaded when user triggers preview
const PreviewEditor = dynamic(
  () => import("@/components/preview/PreviewEditor").then((m) => m.PreviewEditor),
  { ssr: false }
);

type Mode =
  | "compare"
  | "autoCaption"
  | "autoDraw"
  | "longVideoPromo"
  | "dynamicCreator"
  | "creatorBackgroundReplace";
type CreatorBackgroundSettings = {
  backgroundFit: "cover" | "contain";
  backgroundScale: number;
  backgroundX: number;
  backgroundY: number;
  creatorScale: number;
  creatorX: number;
  creatorY: number;
};
type JobStatusState = "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
type JobStatus = {
  state: JobStatusState;
  message: string;
  progress?: number;
  failureStage?: "upload" | "transcript" | "planning" | "render";
  reasonCode?: string;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  design?: string;
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
  expiresAt: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
};

const RECENT_RENDER_RETENTION_MS = 48 * 60 * 60 * 1000;
const RENDER_POLL_INTERVAL_MS = 3000;
const RENDER_POLL_ATTEMPTS = 360;

const templateCards = [
  { id: "dynamic-creator-reel", title: "Dynamic Creator Reel", tag: "Creator edit", description: "Talking video with premium typography and short-form pacing.", image: "/preview/Dynamic Creator Reel.png", badges: ["Video", "Typography"], proof: "Best first impression", accent: "#38BDF8", mode: "dynamicCreator" as const, category: "creator" },
  { id: "auto-caption-reel", title: "Auto Caption Reel", tag: "Captions", description: "Clean word-level subtitles for existing reels.", image: "/preview/Auto Caption Reel.png", badges: ["Video", "Subtitles"], proof: "Most used", accent: "#22C55E", mode: "autoCaption" as const, category: "creator" },
  { id: "creator-background-replace", title: "Creator Background Replace", tag: "Background", description: "Upload a creator video and replace the background with your image.", image: "/preview/Dynamic Creator Reel.png", badges: ["Video", "Image"], proof: "New utility", accent: "#F97316", mode: "creatorBackgroundReplace" as const, category: "creator" },
  { id: "compare-explainer", title: "Compare Explainer", tag: "Comparison", description: "Left vs right comparison with narration and sticker presenter.", image: "/preview/Compare Explainer.png", badges: ["Audio", "2 Images"], proof: "Decision format", accent: "#F59E0B", mode: "compare" as const, category: "education" },
  { id: "auto-draw", title: "Auto Draw Explainer", tag: "Whiteboard", description: "Voiceover converted into simple drawn explainer scenes.", image: "/preview/Auto Draw Explainer.png", badges: ["Audio", "Whiteboard"], proof: "Explainer format", accent: "#06B6D4", mode: "autoDraw" as const, category: "education" },
  { id: "long-video-promo", title: "Long Video Promo", tag: "Promo", description: "Short vertical teaser for a long-form video.", image: "/preview/Long Video Promo.png", badges: ["Video", "Thumbnail"], proof: "Promo ready", accent: "#A3E635", mode: "longVideoPromo" as const, category: "creator" },
] as const;

const TEMPLATE_CATEGORIES = [
  {id: "all", label: "All"},
  {id: "creator", label: "Creator"},
  {id: "education", label: "Education"},
] as const;

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
    label: "Auto Caption",
    title: "Auto Caption Reel",
    description: "📹 Upload: Video with speech\nSubtitles added automatically",
    accept: "video/*",
    supported: "MP4, MOV, WEBM",
    bestResult: "9:16 video with clear voice",
    uploadCta: "📹 Upload your video",
    icon: Captions,
    color: "text-blue-200",
    border: "border-blue-400/30",
    surface: "bg-blue-400/[0.08]",
  },
  compare: {
    label: "Compare",
    title: "Compare Explainer",
    description: "🎙️ Upload: Audio voiceover\n🖼️ Required: 2 images (left vs right)",
    accept: "audio/*",
    supported: "MP3, WAV, M4A, AAC",
    bestResult: "Short comparison voiceover + 2 clear images",
    uploadCta: "🎙️ Upload audio",
    icon: Layers3,
    color: "text-blue-200",
    border: "border-blue-400/30",
    surface: "bg-blue-400/[0.08]",
  },
  longVideoPromo: {
    label: "Long Video Promo",
    title: "Long Video Promo",
    description: "📹 Upload: Short promo clip (10-60s)\n🖼️ Required: Thumbnail image",
    accept: "audio/*,video/*",
    supported: "MP3, WAV, MP4, MOV",
    bestResult: "Short promo voiceover or talking-head clip",
    uploadCta: "📹 Upload promo clip",
    icon: Film,
    color: "text-blue-300",
    border: "border-blue-400/30",
    surface: "bg-blue-400/[0.08]",
  },
  dynamicCreator: {
    label: "Dynamic Edit",
    title: "Dynamic Creator Reel",
    description: "📹 Upload: One vertical talking video\nAI adds dynamic edits and typography",
    accept: "video/*",
    supported: "MP4, MOV, WEBM",
    bestResult: "Vertical talking video with clear speech, 30-60 seconds",
    uploadCta: "📹 Upload your talking video",
    icon: Film,
    color: "text-blue-200",
    border: "border-blue-300/35",
    surface: "bg-blue-300/[0.08]",
  },
  creatorBackgroundReplace: {
    label: "Background Replace",
    title: "Creator Background Replace",
    description: "📹 Upload: Creator video\n🖼️ Required: Background image",
    accept: "video/*",
    supported: "MP4, MOV, WEBM + JPG/PNG/WEBP background",
    bestResult: "Creator talking video with a clear subject and one background image",
    uploadCta: "📹 Upload creator video",
    icon: ImagePlus,
    color: "text-orange-200",
    border: "border-orange-300/35",
    surface: "bg-orange-300/[0.08]",
  },
  autoDraw: {
    label: "Auto Draw",
    title: "Auto Draw Explainer",
    description: "🎙️ Upload: Audio or video with speech\nAI creates whiteboard scenes",
    accept: "audio/*,video/*",
    supported: "MP3, WAV, MP4, MOV",
    bestResult: "Step-by-step explanation, clear voice",
    uploadCta: "🎙️ Upload audio/video",
    icon: Film,
    color: "text-cyan-200",
    border: "border-cyan-300/35",
    surface: "bg-cyan-300/[0.08]",
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
  if (key === "sans-serif") return "sans-serif";
  return "Inter, sans-serif";
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("dynamicCreator");
  const [templateCategory, setTemplateCategory] = useState<string>("all");
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparisonFiles, setComparisonFiles] = useState<File[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [compareLeftTitle, setCompareLeftTitle] = useState("");
  const [compareRightTitle, setCompareRightTitle] = useState("");
  const [compareHandle, setCompareHandle] = useState("@itnavideo");
  const [stickerStyle, setStickerStyle] = useState<string>("explainer");
  const [captionStyle, setCaptionStyle] = useState<string>("Studio Clean");
  const [captionPosition, setCaptionPosition] = useState<"bottom" | "center" | "top">("bottom");
  const [captionFontFamily, setCaptionFontFamily] = useState("Inter, sans-serif");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [subtitleOutputLanguage, setSubtitleOutputLanguage] = useState<"hinglish" | "english">("hinglish");
  const [captionTextColor, setCaptionTextColor] = useState("#ffffff");
  const [captionHighlightColor, setCaptionHighlightColor] = useState("#facc15");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState("#18181B");
  const [videoLayout] = useState<"fullscreen" | "blur-bg" | "split">("fullscreen");
  const [progressStyle] = useState<"glow" | "line" | "none">("glow");
  const [wordClickSound] = useState(true);
  const [promoThumbnailFile, setPromoThumbnailFile] = useState<File | null>(null);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoChannelName, setPromoChannelName] = useState("");
  const [promoSubscriberCount, setPromoSubscriberCount] = useState("");
  const [promoCtaText, setPromoCtaText] = useState("Watch full video →");
  const [promoBgMusic, setPromoBgMusic] = useState(false);
  const [promoVideoDuration, setPromoVideoDuration] = useState("");
  const [creatorBackgroundImageFile, setCreatorBackgroundImageFile] = useState<File | null>(null);
  const [creatorBackgroundSettings, setCreatorBackgroundSettings] = useState<CreatorBackgroundSettings>(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [previewRender, setPreviewRender] = useState<RecentRender | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<RecentRender | null>(null);
  const [deletingRenderId, setDeletingRenderId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>({state: "idle", message: ""});
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [paymentBanner, setPaymentBanner] = useState("");
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

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
      const requestedTemplate = params.get("template");
      const nextMode = readDashboardMode(requestedMode || requestedTemplate);

      if (nextMode) {
        const timer = window.setTimeout(() => {
          setMode(nextMode);
          setHasUserSelected(true);
          setSelectedFile(null);
          setComparisonFiles([]);
        }, 0);
        return () => window.clearTimeout(timer);
      }
    } catch (error) {
      console.warn("Could not read dashboard template params:", error);
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
  const renderInProgress = ["uploading", "starting", "rendering"].includes(jobStatus.state);
  const paidRemaining = billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit;
  const paidLimitComplete = Boolean(billingEntitlement?.active && typeof paidRemaining === "number" && paidRemaining <= 0);
  const canPrepareReel = Boolean(
    selectedFile &&
    (mode !== "compare" || comparisonFiles.length === 2) &&
    (mode !== "creatorBackgroundReplace" || Boolean(creatorBackgroundImageFile)) &&
    !renderInProgress &&
    !paidLimitComplete,
  );

  const chooseCaptionStyle = (nextStyle: string) => {
    setCaptionStyle(nextStyle);
    const preset = SUBTITLE_PRESETS.find((item) => item.key === nextStyle || item.style === nextStyle);
    if (!preset) return;
    setCaptionTextColor(preset.textColor);
    setCaptionHighlightColor(preset.highlightColor);
    setCaptionBackgroundColor(preset.bgColor || "");
    setCaptionFontFamily(normalizeCaptionFont(preset.font));
    setCaptionFontSize(nextStyle === "One Word" || nextStyle === "Bold Fire" ? "xlarge" : nextStyle === "Studio Clean" || nextStyle === "Karaoke Fill" ? "large" : "medium");
  };

  const chooseTemplateMode = (nextMode: Mode) => {
    setMode(nextMode);
    setHasUserSelected(true);
    setSelectedFile(null);
    setComparisonFiles([]);
    setCreatorBackgroundImageFile(null);
    setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
    setTopicTitle("");
    setJobStatus({state: "idle", message: ""});
    const nextTemplate = nextMode === "autoCaption" ? "auto-caption-reel" : nextMode === "autoDraw" ? "auto-draw-explainer" : nextMode === "longVideoPromo" ? "long-video-promo" : nextMode === "dynamicCreator" ? "dynamic-creator-reel" : nextMode === "creatorBackgroundReplace" ? "creator-background-replace" : "compare-explainer";
    window.history.replaceState(null, "", `/dashboard?template=${nextTemplate}`);
    // Auto-scroll to upload section on mobile
    setTimeout(() => {
      document.getElementById("upload-section")?.scrollIntoView({behavior: "smooth", block: "start"});
    }, 150);
  };

  const chooseFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const validation = validateFileForMode(file, mode);
    if (validation) {
      setSelectedFile(null);
      setJobStatus({state: "error", message: validation});
      return;
    }
    setSelectedFile(file);
    setJobStatus({state: "idle", message: ""});
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setJobStatus({state: "idle", message: ""});
  };

  const removeCreatorBackgroundImage = () => {
    setCreatorBackgroundImageFile(null);
    setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS);
    setJobStatus({state: "idle", message: ""});
  };

  const removePromoThumbnail = () => {
    setPromoThumbnailFile(null);
    setJobStatus({state: "idle", message: ""});
  };

  const chooseComparisonFiles = (files: FileList | null) => {
    const nextFiles = Array.from(files || []).slice(0, 2);
    const invalid = nextFiles.find((file) => validateComparisonImage(file));
    if (invalid) {
      setComparisonFiles([]);
      setJobStatus({state: "error", message: validateComparisonImage(invalid)});
      return;
    }
    setComparisonFiles(nextFiles);
    setJobStatus({state: "idle", message: ""});
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
        <p className="text-sm font-bold text-zinc-500">Loading dashboard...</p>
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
    if (previewRender?.id === render.id || previewRender?.outputFile === render.outputFile) {
      setPreviewRender(null);
    }
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
            overrideInputProps: finalInputProps,
          });
          setPendingRenderKeys(null);
        }}
      />
    )}
    <main className="min-h-screen overflow-x-hidden bg-[#0B1120] px-4 pb-12 pt-24 text-white sm:px-5 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/8 pb-6 md:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <BrandLogo size="md" showTagline />
            <h1 className="mt-4 tracking-normal" style={{ fontSize: '28px', fontWeight: 600, color: '#FFFFFF' }}>
              Welcome back, {firstName} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 transition hover:opacity-90"
              style={{
                background: 'var(--color-amber-dark)',
                color: 'var(--color-amber)',
                border: '1px solid rgba(245, 197, 66, 0.3)',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '8px',
                padding: '6px 14px',
              }}
            >
              <Sparkles size={14} />
              Upgrade
            </Link>
            <Link
              href="#your-videos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-black text-zinc-300 transition hover:bg-white/[0.06]"
            >
              <FolderOpen size={14} />
              Your Videos
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-bold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              type="button"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {paymentBanner || billingEntitlement?.active ? (
          <section className="mb-5 rounded-lg px-4 py-3" style={{ borderColor: 'var(--border-dark)', background: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '12px' }}>
            {/* Credit progress bar */}
            {(() => {
              const total = billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || 0;
              const used = billingEntitlement?.usage?.used ?? 0;
              const remaining = billingEntitlement?.usage?.remaining ?? total;
              const pct = total > 0 ? Math.round((remaining / total) * 100) : 100;
              const fillColor = pct <= 10 ? 'var(--color-error)' : pct <= 20 ? 'var(--color-warning)' : 'var(--color-primary-hover)';
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary-light)' }}>
                      Credits this month
                    </span>
                    <span className="hidden sm:inline" style={{ fontSize: '11px', color: 'var(--text-dark-muted)' }}>
                      {billingEntitlement?.expiresAt ? `Resets ${formatDate(billingEntitlement.expiresAt)}` : ''}
                    </span>
                    <span className="sm:hidden" style={{ fontSize: '11px', color: 'var(--text-dark-muted)' }}>
                      {billingEntitlement?.planName || 'Paid'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span style={{ fontSize: '22px', fontWeight: 600, color: fillColor }}>{remaining}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-dark-muted)' }}>/ {total} remaining</span>
                  </div>
                  <div style={{ background: 'var(--border-dark)', height: '6px', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ background: fillColor, height: '100%', borderRadius: '100px', width: `${pct}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontSize: '11px', color: 'var(--text-dark-muted)' }}>{used} used</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dark-muted)' }}>{pct}% left</span>
                  </div>
                </>
              );
            })()}
          </section>
        ) : null}

        {/* Low credits warning */}
        {billingEntitlement?.active && typeof paidRemaining === "number" && paidRemaining <= 10 && paidRemaining > 0 ? (
          <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--bg-raised)', border: '1px solid rgba(245, 197, 66, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--color-amber)' }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-amber)' }}>Running low on credits</p>
                <p style={{ fontSize: '12px', color: 'var(--text-dark-secondary)' }}>You have {paidRemaining} credits left this month.</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center gap-1 transition hover:opacity-90"
              style={{ background: 'var(--color-amber-dark)', color: 'var(--color-amber)', border: '1px solid rgba(245, 197, 66, 0.3)', fontSize: '12px', fontWeight: 500, borderRadius: '8px', padding: '6px 14px' }}
            >
              Upgrade plan →
            </Link>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <section className="rounded-2xl border border-white/8 bg-zinc-950/80 p-4 md:p-6">
            {/* Step indicator — full on md+, active step only on mobile */}
            <div className="mb-6 hidden md:flex items-center text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-1" style={{ color: mode && hasUserSelected ? 'var(--color-success)' : mode ? 'var(--color-primary-hover)' : 'var(--text-dark-muted)', fontWeight: mode ? 500 : 400 }}>
                {mode && hasUserSelected ? <Check size={10} strokeWidth={3} /> : null}
                Template
              </span>
              <span className="mx-2 flex-1 h-px" style={{ background: 'var(--border-dark)' }} />
              <span className="flex items-center gap-1" style={{ color: selectedFile ? 'var(--color-success)' : (mode && hasUserSelected) ? 'var(--color-primary-hover)' : 'var(--text-dark-muted)', fontWeight: (mode && hasUserSelected) ? 500 : 400 }}>
                {selectedFile ? <Check size={10} strokeWidth={3} /> : null}
                Upload
              </span>
              <span className="mx-2 flex-1 h-px" style={{ background: 'var(--border-dark)' }} />
              <span className="flex items-center gap-1" style={{ color: selectedFile ? 'var(--color-primary-hover)' : 'var(--text-dark-muted)', fontWeight: selectedFile ? 500 : 400 }}>
                Settings
              </span>
              <span className="mx-2 flex-1 h-px" style={{ background: 'var(--border-dark)' }} />
              <span style={{ color: 'var(--text-dark-muted)', fontWeight: 400 }}>
                Generate
              </span>
            </div>
            {/* Mobile: show only current step */}
            <div className="mb-6 flex md:hidden items-center gap-2 text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--color-primary-hover)', fontWeight: 500 }}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white" style={{ background: 'var(--color-primary-hover)' }}>
                  {selectedFile ? '3' : (mode && hasUserSelected) ? '2' : '1'}
                </span>
                {selectedFile ? 'Settings' : (mode && hasUserSelected) ? 'Upload' : 'Template'}
              </span>
              <span style={{ color: 'var(--text-dark-muted)' }}>
                — Step {selectedFile ? '3' : (mode && hasUserSelected) ? '2' : '1'} of 4
              </span>
            </div>

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-black text-white sm:text-2xl">{hasUserSelected ? `Create a ${activeMode.label} Reel` : 'Choose a Template'}</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
                  {hasUserSelected ? `Upload your content for ${activeMode.label}.` : 'Select a template below, then upload your content.'}
                </p>
              </div>
              {hasUserSelected && (
              <div className={`inline-flex items-center gap-2 rounded-xl border ${activeMode.border} ${activeMode.surface} px-3 py-2 text-xs font-black ${activeMode.color}`}>
                <ActiveModeIcon size={14} />
                {activeMode.label}
              </div>
              )}
            </div>

            <div className="grid gap-3">
              {/* Category filter bar */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="shrink-0 transition"
                    style={{
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: templateCategory === cat.id ? '1px solid var(--color-primary-tint)' : '1px solid transparent',
                      background: templateCategory === cat.id ? 'var(--color-primary-subtle)' : 'var(--bg-raised)',
                      color: templateCategory === cat.id ? 'var(--color-primary)' : 'var(--text-dark-muted)',
                    }}
                    onClick={() => setTemplateCategory(cat.id)}
                    type="button"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Template cards - visual output selector */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
                {templateCards
                  .filter((t) => templateCategory === "all" || t.category === templateCategory)
                  .map((template) => {
                  const isSelected = hasUserSelected && template.mode === mode;
                  return (
                  <button
                    aria-pressed={isSelected}
                    className="group relative flex flex-col items-center text-center"
                    style={{
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.02)' : undefined,
                    }}
                    key={template.id}
                    onClick={() => chooseTemplateMode(template.mode)}
                    type="button"
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.transform = ''; }}
                  >
                    {/* Phone frame with interaction states */}
                    <div
                      className={`relative w-full aspect-[9/16] overflow-hidden rounded-lg ${!isSelected ? 'template-card-frame' : ''}`}
                      style={{
                        transition: 'all 0.15s ease',
                        border: isSelected ? `2px solid ${template.accent}` : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: isSelected
                          ? `0 12px 34px ${template.accent}30`
                          : '0 10px 28px rgba(0,0,0,0.25)',
                        background: isSelected ? `${template.accent}16` : '#0F172A',
                        padding: '4px',
                      }}
                    >
                      {/* Inner screen */}
                      <div className="relative w-full h-full overflow-hidden rounded-md bg-black">
                        {/* Preview image */}
                        <Image
                          alt={template.title}
                          className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
                          fill
                          sizes="(min-width: 1280px) 180px, (min-width: 1024px) 160px, (min-width: 640px) 150px, 30vw"
                          src={template.image}
                        />

                        {/* Bottom gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/88 via-black/35 to-transparent" />

                        <span
                          className="absolute left-2 top-2 z-20 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-950"
                          style={{ backgroundColor: template.accent }}
                        >
                          {template.proof}
                        </span>

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full text-slate-950 shadow-md" style={{ background: template.accent }}>
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}

                        {/* Expand preview on hover */}
                        <div
                          className="absolute right-2 bottom-6 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplateId(template.id);
                          }}
                          role="button"
                          aria-label={`Preview ${template.title}`}
                        >
                          <Eye size={9} />
                        </div>
                      </div>
                    </div>

                    {/* Category tag + template name below */}
                    <span className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--text-dark-muted)' }}>
                      {template.tag}
                    </span>
                    <p className="mt-0.5 leading-tight line-clamp-2" style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? 'var(--color-primary-hover)' : 'var(--text-dark-secondary)' }}>
                      {template.title}
                    </p>
                  </button>
                  );
                })}
              </div>

              {/* Selected template summary + upload form — only shown after user clicks a template */}
              {hasUserSelected && (<>
              <div className={`rounded-xl border-2 ${activeMode.border} ${activeMode.surface} p-3 flex items-center gap-3 shadow-sm`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${activeMode.border} bg-black/30 ${activeMode.color}`}>
                  <ActiveModeIcon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{activeMode.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{activeMode.bestResult}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <div className="rounded-md bg-brand-mint/10 border border-brand-mint/25 px-2 py-0.5 text-[10px] font-bold text-brand-mint">
                    1 credit
                  </div>
                  <span className="text-[9px] text-zinc-500">per video</span>
                </div>
              </div>

              <label
                id="upload-section"
                className="upload-zone flex min-h-56 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden sm:min-h-64"
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
                <p className="text-sm font-medium text-white">{activeMode.uploadCta || 'Click to upload or drag & drop'}</p>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-dark-muted)' }}>{activeMode.supported} • Max 1 minute</p>
                {selectedFile ? (
                  <div className="mt-5 w-full rounded-md border border-white/10 bg-black/35 px-4 py-3 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{selectedFile.name}</p>
                        <p className="mt-1 text-xs font-bold text-zinc-500">{fileMeta}</p>
                      </div>
                      <button
                        className="shrink-0 rounded-md border border-red-400/25 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-black text-red-100 transition hover:bg-red-500 hover:text-white"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeSelectedFile();
                        }}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : null}
                {selectedFile ? (
                  <SelectedMediaPreview file={selectedFile} mode={mode} />
                ) : null}</label>

              {mode === "compare" ? (
                <CompareImageSlots
                  files={comparisonFiles}
                  onChange={(files) => {
                    setComparisonFiles(files);
                    setJobStatus({state: "idle", message: ""});
                  }}
                  onError={(message) => setJobStatus({state: "error", message})}
                />
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

                <StickerStylePicker value={stickerStyle} onChange={setStickerStyle} />
                  </>
              ) : null}

              {mode === "creatorBackgroundReplace" ? (
                <div className="rounded-lg border border-orange-300/20 bg-orange-300/[0.06] p-4">
                  <p className="text-sm font-black text-white">Background image</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-zinc-400">
                    Upload one image. We auto-fit it first, then you can adjust background and creator placement.
                  </p>

                  <label className="upload-zone mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center">
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
                    <span className="text-sm font-black text-white">
                      {creatorBackgroundImageFile ? "Change background image" : "Upload background image"}
                    </span>
                    {creatorBackgroundImageFile ? (
                      <span className="mt-2 max-w-full truncate text-xs font-bold text-zinc-400">{creatorBackgroundImageFile.name}</span>
                    ) : (
                      <span className="mt-1 text-xs text-zinc-500">JPG, PNG, WEBP</span>
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
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-orange-300/20 bg-black/25 px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-white">{creatorBackgroundImageFile.name}</p>
                        <p className="mt-0.5 text-[10px] font-bold text-zinc-500">{formatBytes(creatorBackgroundImageFile.size)}</p>
                      </div>
                      <button
                        className="shrink-0 rounded-md border border-red-400/25 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-black text-red-100 transition hover:bg-red-500 hover:text-white"
                        onClick={removeCreatorBackgroundImage}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}

                  {creatorBackgroundImageFile ? (
                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Background</p>
                          <div className="inline-flex overflow-hidden rounded-lg border border-white/10 bg-black/20">
                            {(["cover", "contain"] as const).map((fit) => (
                              <button
                                key={fit}
                                className={`px-3 py-1.5 text-[11px] font-black uppercase ${creatorBackgroundSettings.backgroundFit === fit ? "bg-orange-300 text-slate-950" : "text-zinc-400"}`}
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

                      <div className="grid gap-2 border-t border-white/10 pt-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Creator</p>
                        <RangeControl label="Scale" max={1.6} min={0.55} step={0.01} value={creatorBackgroundSettings.creatorScale} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorScale: value}))} />
                        <RangeControl label="Position X" max={160} min={-160} step={1} value={creatorBackgroundSettings.creatorX} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorX: value}))} />
                        <RangeControl label="Position Y" max={220} min={-220} step={1} value={creatorBackgroundSettings.creatorY} onChange={(value) => setCreatorBackgroundSettings((current) => ({...current, creatorY: value}))} />
                      </div>

                      <button
                        className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 transition hover:bg-white/10"
                        onClick={() => setCreatorBackgroundSettings(DEFAULT_CREATOR_BACKGROUND_SETTINGS)}
                        type="button"
                      >
                        Reset adjustments
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {mode === "longVideoPromo" ? (
                <div className="rounded-lg border border-blue-400/20 bg-blue-400/[0.06] p-4">
                  <p className="text-sm font-black text-white">Promo details</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-zinc-400">
                    Add your video thumbnail and title. Upload a promo clip below.
                  </p>

                  {/* Thumbnail upload */}
                  <label className="upload-zone mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center">
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
                    <Upload size={18} className="mb-2 text-blue-300" />
                    <span className="text-sm font-black text-white">
                      {promoThumbnailFile ? "Change thumbnail" : "🖼️ Upload thumbnail"}
                    </span>
                    {promoThumbnailFile ? (
                      <span className="mt-2 max-w-full truncate text-xs font-bold text-zinc-400">{promoThumbnailFile.name}</span>
                    ) : (
                      <span className="mt-1 text-xs text-zinc-500">Recommended: 1280×720 or similar</span>
                    )}
                  </label>

                  {promoThumbnailFile ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-16 w-28 overflow-hidden rounded-lg border border-blue-400/25 bg-black">
                        <UploadedImagePreview alt="Thumbnail preview" className="h-full w-full object-cover" file={promoThumbnailFile} />
                      </div>
                      <button className="text-xs font-black text-zinc-400 hover:text-white" onClick={removePromoThumbnail} type="button">Remove</button>
                    </div>
                  ) : null}

                  {/* Text fields — only title and duration (channel/CTA/subs removed from template) */}
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
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Video duration (optional)</span>
                      <input
                        className="form-input"
                        onChange={(e) => setPromoVideoDuration(e.target.value)}
                        placeholder="12:34 (MM:SS format)"
                        type="text"
                        value={promoVideoDuration}
                      />
                      <span className="text-[10px] text-zinc-600">Shows on thumbnail — viewers see video length</span>
                    </label>

                    {/* Background music toggle */}
                    <label className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 px-3 py-3 cursor-pointer hover:bg-white/[0.03] transition">
                      <input
                        type="checkbox"
                        checked={promoBgMusic}
                        onChange={(e) => setPromoBgMusic(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-black accent-blue-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">Add background music</p>
                        <p className="text-[10px] text-zinc-500">OFF by default — your clip already has audio</p>
                      </div>
                    </label>
                  </div>
                </div>
              ) : null}

              {mode === "autoCaption" ? (
                <div className="rounded-lg border border-blue-400/20 bg-blue-400/[0.06] p-4">
                  <div>
                    <p className="text-sm font-black text-white">Caption controls</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-zinc-400">
                      Choose subtitle language, style, position, and colors. Your video stays full-screen.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Subtitle language</span>
                      <select
                        className="form-input"
                        onChange={(event) => setSubtitleOutputLanguage(event.target.value as "hinglish" | "english")}
                        value={subtitleOutputLanguage}
                      >
                        <option value="hinglish">Hinglish (Hindi + English)</option>
                        <option value="english">English Only</option>
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Caption style</span>
                    </label>
                    <div className="sm:col-span-2">
                      <SubtitleStylePicker value={captionStyle} onChange={chooseCaptionStyle} />
                    </div>

                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Position</span>
                      <select
                        className="form-input"
                        onChange={(event) => setCaptionPosition(event.target.value as "bottom" | "center" | "top")}
                        value={captionPosition}
                      >
                        <option value="bottom">Bottom safe area</option>
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Font</span>
                      <select
                        className="form-input"
                        onChange={(event) => setCaptionFontFamily(event.target.value)}
                        value={captionFontFamily}
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Impact, sans-serif">Impact</option>
                        <option value="Arial Black, sans-serif">Arial Black</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Courier New, monospace">Courier New</option>
                        <option value="sans-serif">Sans Serif</option>
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Size</span>
                      <select
                        className="form-input"
                        onChange={(event) => setCaptionFontSize(event.target.value as "small" | "medium" | "large" | "xlarge")}
                        value={captionFontSize}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra large</option>
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Text</span>
                        <select
                          className="h-12 rounded-lg border border-white/10 bg-black/35 px-3 text-sm font-bold text-white outline-none focus:border-brand-mint/55"
                          onChange={(event) => setCaptionTextColor(event.target.value)}
                          value={captionTextColor}
                        >
                          <option value="#ffffff">White</option>
                          <option value="#facc15">Yellow</option>
                          <option value="#22c55e">Green</option>
                          <option value="#38bdf8">Blue</option>
                          <option value="#fb7185">Pink</option>
                          <option value="#ef4444">Red</option>
                          <option value="#000000">Black</option>
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Highlight</span>
                        <select
                          className="h-12 rounded-lg border border-white/10 bg-black/35 px-3 text-sm font-bold text-white outline-none focus:border-brand-mint/55"
                          onChange={(event) => setCaptionHighlightColor(event.target.value)}
                          value={captionHighlightColor}
                        >
                          <option value="#facc15">Yellow</option>
                          <option value="#22c55e">Green</option>
                          <option value="#38bdf8">Blue</option>
                          <option value="#fb7185">Pink</option>
                          <option value="#ef4444">Red</option>
                          <option value="#ffffff">White</option>
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.16em] form-label-muted">Background</span>
                        <select
                          className="h-12 rounded-lg border border-white/10 bg-black/35 px-3 text-sm font-bold text-white outline-none focus:border-brand-mint/55"
                          onChange={(event) => setCaptionBackgroundColor(event.target.value)}
                          value={captionBackgroundColor}
                        >
                          <option value="#18181B">Soft black</option>
                          <option value="#000000">Black</option>
                          <option value="rgba(0,0,0,0.55)">Transparent black</option>
                          <option value="#ffffff">White</option>
                          <option value="#2563eb">Blue</option>
                          <option value="#facc15">Yellow</option>
                          <option value="">No background</option>
                        </select>
                      </label>
                    </div>

                  </div>
                </div>
              ) : null}
              <div className={mode === "autoCaption" ? "hidden" : "rounded-lg border border-white/10 bg-white/[0.035] p-4"}>
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

              {/* Subtitle language selector — all templates */}
              {mode !== "autoCaption" ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-white">Subtitle language</span>
                    <p className="text-xs font-bold leading-5 text-zinc-500">Choose what language your subtitles will be in.</p>
                    <select
                      className="mt-1 form-input"
                      onChange={(event) => setSubtitleOutputLanguage(event.target.value as typeof subtitleOutputLanguage)}
                      value={subtitleOutputLanguage}
                    >
                      <option value="hinglish">Hinglish (Hindi + English mix)</option>
                      <option value="english">English Only</option>
                    </select>
                  </label>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <PolicyPill icon={Clock3} title="Max 1 minute" body="Longer uploads are trimmed to the first 60 seconds." />
                <PolicyPill
                  icon={ShieldCheck}
                  title="Private & temporary"
                  body="Your file is only used to create your reel. Not shared."
                />
              </div>

              {/* Pre-generation credit notice */}
              <div className="flex items-center gap-2" style={{ background: 'var(--bg-raised)', border: '0.5px solid var(--border-dark)', borderRadius: '8px', padding: '6px 12px' }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--color-primary-hover)' }} />
                <p style={{ fontSize: '12px', color: 'var(--text-dark-secondary)' }}>
                  This will use <span style={{ fontWeight: 600, color: 'var(--color-primary-hover)' }}>1 credit</span> — {billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? '—'} remaining
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
                  padding: '14px 32px',
                  borderRadius: '10px',
                  width: '100%',
                  border: canPrepareReel ? 'none' : '1px solid rgba(255,255,255,0.08)',
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
                        ? "Plan limit complete"
                        : "Create My Reel"}
              </button>
              <p className="text-center text-xs font-bold leading-5 text-zinc-500">
                {renderInProgress
                  ? "Please do not close this tab. Your video is being generated."
                  : !selectedFile ? "Upload a file to continue. " : mode === "compare" && comparisonFiles.length !== 2 ? "Add at least two compare images. " : mode === "creatorBackgroundReplace" && !creatorBackgroundImageFile ? "Upload one background image. " : ""}
                {!renderInProgress ? "First video starts at ₹9. Most reels finish in 3–5 minutes." : ""}
              </p>
              <ProgressPreview mode={mode} />
              {paidLimitComplete ? (
                <div className="rounded-lg border border-amber-200/20 bg-amber-200/[0.075] p-4 text-sm font-bold leading-6 text-amber-50">
                  Your {billingEntitlement?.planName || "paid"} plan videos are complete for this billing period. Upgrade or wait for renewal to create more reels.
                  <Link className="ml-2 text-brand-mint underline-offset-4 hover:underline" href="/pricing">
                    View plans
                  </Link>
                </div>
              ) : null}
              {jobStatus.state !== "idle" ? (
                <RenderStatusStage
                  mode={mode}
                  onPreview={() => setPreviewRender(makeCurrentPreviewRender(
                    jobStatus.outputFile || "",
                    mode,
                    jobStatus.title || selectedFile?.name?.replace(/\.[^.]+$/, "") || "Current reel",
                    jobStatus.design || "Auto from script",
                  ))}
                  onReset={() => setJobStatus({state: "idle", message: ""})}
                  status={jobStatus}
                  title={jobStatus.title || selectedFile?.name || activeMode.title}
                />
              ) : null}
              </>)}
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-20">
            <section id="your-videos" className="scroll-mt-24 p-4 md:p-6" style={{ background: 'var(--bg-raised)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary-light)' }}>Your Videos</p>
                  <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Exports from every template</h2>
                  <p className="mt-2 text-xs font-bold leading-5 text-zinc-500">Finished videos stay here for 48 hours, no matter which template created them.</p>
                </div>
                <FolderOpen size={22} style={{ color: 'var(--color-secondary-light)' }} />
              </div>
              {recentRenders.length ? (
                <div className="space-y-3">
                  {recentRenders.map((render) => (
                    <article key={render.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white">{render.title}</p>
                          <p className="mt-1 text-xs font-bold text-zinc-500">
                            {getModeLabel(render.mode)} · {formatCreatedTime(render.createdAt)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md border border-brand-mint/25 bg-brand-mint/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-mint">
                          {getVideoStatusLabel(render.expiresAt)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">Available</span>
                        <span className="text-xs font-black text-zinc-200">{formatTimeLeft(render.expiresAt)}</span>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-black text-zinc-200 transition hover:border-brand-mint/40 hover:text-brand-mint"
                          onClick={() => setPreviewRender(render)}
                          type="button"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        <a
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-3 text-xs font-black text-black transition hover:bg-brand-mint"
                          href={render.outputFile}
                          download={`itnavideo-${render.mode || 'reel'}.mp4`}
                          rel="noreferrer"
                        >
                          <Download size={14} />
                          Download
                        </a>
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-400/20 bg-red-500/10 px-3 py-3 text-xs font-black text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deletingRenderId === render.id}
                          onClick={() => requestDeleteRender(render)}
                          type="button"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/10 bg-black/20 px-4 py-6 text-sm font-bold leading-6 text-zinc-500">
                  Your exported videos will appear here after final render. You will not need to remember which template created them.
                </div>
              )}
            </section>

            <section className="p-4 md:p-6" style={{ background: 'var(--bg-raised)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-success)' }}>Upload privacy</p>
              <div className="mt-5 space-y-3">
                {[
                  "Your uploads are private and temporary.",
                  "Final MP4 links are removed after about 48 hours.",
                  "Your reel is created in the background. You can wait here or come back later.",
                  "We only use your file to create your reel.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-zinc-200">
                    <ShieldCheck className="mt-0.5 shrink-0" size={16} style={{ color: 'var(--color-success)' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
      {previewRender ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-6 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl sm:max-w-md">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{previewRender.title}</p>
                <p className="mt-0.5 text-xs font-bold text-zinc-500">{formatTimeLeft(previewRender.expiresAt)}</p>
              </div>
              <button
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                onClick={() => setPreviewRender(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <video
                className="aspect-[9/16] w-full bg-black object-contain"
                controls
                playsInline
                preload="metadata"
                src={previewRender.outputFile}
              />
            </div>
            <div className="grid shrink-0 gap-3 border-t border-white/10 p-4 sm:grid-cols-3">
              <button
                className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-sm font-black text-zinc-200 transition hover:bg-white/10"
                onClick={() => setPreviewRender(null)}
                type="button"
              >
                Close
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
                href={previewRender.outputFile}
                download={`itnavideo-${previewRender.mode || 'reel'}.mp4`}
                rel="noreferrer"
              >
                <Download size={16} />
                Download MP4
              </a>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deletingRenderId === previewRender.id}
                onClick={() => requestDeleteRender(previewRender)}
                type="button"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {deleteCandidate ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 px-3 pb-4 pt-10 backdrop-blur-md sm:items-center sm:px-5 sm:pb-10">
          <div
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-lg border border-red-300/20 bg-[#09090b] shadow-[0_26px_90px_rgba(0,0,0,0.65)]"
            role="dialog"
          >
            <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,191,0.16),transparent_32%),radial-gradient(circle_at_92%_8%,rgba(248,113,113,0.18),transparent_34%)] px-5 pb-5 pt-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-300/25 bg-red-500/10 text-red-200">
                  <AlertTriangle size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">Delete render</p>
                  <h2 className="mt-2 text-2xl font-black tracking-normal text-white">Remove this video?</h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">
                    This only removes the render from your dashboard history on this device/account. Temporary MP4 links still expire automatically.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-5">

              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="truncate text-sm font-black text-white">{deleteCandidate.title}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {getModeLabel(deleteCandidate.mode)} | {formatTimeLeft(deleteCandidate.expiresAt)}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-black text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  onClick={() => setDeleteCandidate(null)}
                  type="button"
                >
                  Keep video
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-400 px-4 py-3.5 text-sm font-black text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Template Preview Modal */}
      {previewTemplateId && (() => {
        const previewTemplate = templateCards.find((t) => t.id === previewTemplateId);
        if (!previewTemplate) return null;
        const previewMode = modeConfig[previewTemplate.mode];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setPreviewTemplateId(null)}
            role="dialog"
            aria-label={`Preview ${previewTemplate.title}`}
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition"
                onClick={() => setPreviewTemplateId(null)}
                type="button"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>

              {/* Full reel preview image - 9:16 */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <Image
                  alt={previewTemplate.title}
                  className="object-cover object-center"
                  fill
                  sizes="380px"
                  src={previewTemplate.image}
                  priority
                />
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>

              {/* Info panel */}
              <div className="p-4 border-t border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white">{previewTemplate.title}</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{previewTemplate.description}</p>
                  </div>
                  <div className="shrink-0 rounded-md bg-brand-mint/10 border border-brand-mint/25 px-2 py-0.5 text-[10px] font-bold text-brand-mint">
                    1 credit
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {previewTemplate.badges.map((badge) => (
                    <span key={badge} className="rounded-md bg-white/[0.06] border border-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Best for</p>
                  <p className="text-xs text-zinc-300">{previewMode?.bestResult || previewTemplate.description}</p>
                </div>

                <button
                  className="w-full rounded-xl bg-brand-mint px-4 py-2.5 text-xs font-black text-black transition hover:bg-brand-mint/90"
                  onClick={() => {
                    chooseTemplateMode(previewTemplate.mode);
                    setPreviewTemplateId(null);
                  }}
                  type="button"
                >
                  {previewTemplate.mode === mode ? '✓ Already Selected' : 'Use This Template'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
    </>
  );

  async function startRenderJob() {
    if (!selectedFile || !user) return;
    const validation = validateFileForMode(selectedFile, mode);
    if (validation) {
      setJobStatus({state: "error", message: validation});
      return;
    }

    if (mode === "compare" && comparisonFiles.length !== 2) {
      setJobStatus({state: "error", message: "Compare needs exactly two images: one left and one right."});
      return;
    }
    if (mode === "creatorBackgroundReplace" && !creatorBackgroundImageFile) {
      setJobStatus({state: "error", message: "Creator Background Replace needs one background image."});
      return;
    }
    const userId = user.id;
    const uploadContentType = getUploadContentType(selectedFile);
    setJobStatus({state: "uploading", message: "Preparing your private upload..."});

    try {
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

      setJobStatus({state: "uploading", message: "Uploading your file. Please keep this page open..."});
      const uploadResponse = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {"Content-Type": uploadContentType},
        body: selectedFile,
      }).catch((error) => {
        throw new Error(formatNetworkError(error, "Media upload failed. Please retry on a stable connection."));
      });
      if (!uploadResponse.ok) throw new Error("Media upload failed.");

      const comparisonImageKeys = mode === "compare"
        ? await uploadComparisonImages({files: comparisonFiles, userId})
        : [];

      const promoThumbnailKey = mode === "longVideoPromo" && promoThumbnailFile
        ? await uploadTemplateImage({file: promoThumbnailFile, userId})
        : "";

      const creatorBackgroundImageKey = mode === "creatorBackgroundReplace" && creatorBackgroundImageFile
        ? await uploadTemplateImage({file: creatorBackgroundImageFile, userId})
        : "";

      // ── PREVIEW STEP: templates that support it show preview before render ──
      // Templates with in-browser preview: autoCaption, compare, dynamicCreator
      // All other templates go straight to render (existing behavior)
      const PREVIEW_SUPPORTED_MODES: Mode[] = ["autoCaption", "compare", "dynamicCreator"];
      if (PREVIEW_SUPPORTED_MODES.includes(mode)) {
        setJobStatus({state: "starting", message: "Generating your preview…"});
        try {
          const previewTemplateName = mode === "autoCaption"
            ? "AUTO_CAPTION_REEL"
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
              templateName: previewTemplateName,
              userId,
              comparisonImageKeys,
              compareLeftTitle: compareLeftTitle.trim(),
              compareRightTitle: compareRightTitle.trim(),
              creatorHandle: compareHandle.trim() || "@itnavideo",
              stickerStyle,
              subtitleOutputLanguage,
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
            return; // Stop here — wait for user to confirm in PreviewEditor
          }
          // Preview failed — fall through to direct render
          console.warn("[PREVIEW] Could not generate preview, falling back to direct render:", previewData.error);
        } catch (previewErr) {
          console.warn("[PREVIEW] Preview request failed, falling back to direct render:", previewErr);
        }
      }

      // Direct render path (no preview) — used for all other templates
      // and as fallback when preview fails
      await submitFinalRender({
        mediaKey: presign.key,
        fileName: selectedFile.name,
        contentType: uploadContentType,
        userId,
        comparisonImageKeys,
        promoThumbnailKey,
        creatorBackgroundImageKey,
        overrideInputProps: {},
      });
    } catch (error) {
      setJobStatus({
        state: "error",
        message: formatNetworkError(error, "We could not generate this reel."),
        failureStage: "upload",
      });
    }
  }

  // Called either directly (non-preview templates) or from PreviewEditor confirm
  async function submitFinalRender({
    mediaKey,
    fileName: renderFileName,
    contentType: renderContentType,
    userId,
    comparisonImageKeys,
    promoThumbnailKey,
    creatorBackgroundImageKey,
    overrideInputProps,
  }: {
    mediaKey: string;
    fileName: string;
    contentType: string;
    userId: string;
    comparisonImageKeys: string[];
    promoThumbnailKey: string;
    creatorBackgroundImageKey: string;
    overrideInputProps: Record<string, unknown>;
  }) {
    setJobStatus({state: "starting", message: planningMessageForMode(mode)});
    try {
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          mediaKey,
          fileName: renderFileName,
          contentType: renderContentType,
          mediaType: getFileMediaType(selectedFile!),
          mode,
          topicTitle: topicTitle.trim(),
          userId,
          comparisonImageKeys,
          compareLeftTitle: compareLeftTitle.trim(),
          compareRightTitle: compareRightTitle.trim(),
          creatorHandle: compareHandle.trim() || "@itnavideo",
          stickerStyle: String(overrideInputProps.stickerStyle || stickerStyle),
          // Use edited values from preview if available, else dashboard form values
          captionStyle: String(overrideInputProps.captionStyle || captionStyle),
          captionPosition: String(overrideInputProps.captionPosition || captionPosition),
          captionFontFamily: String(overrideInputProps.fontFamily || captionFontFamily),
          captionFontSize: String(overrideInputProps.fontSize || captionFontSize),
          subtitleOutputLanguage,
          captionTextColor: String(overrideInputProps.textColor || captionTextColor),
          captionHighlightColor: String(overrideInputProps.highlightColor || captionHighlightColor),
          captionBackgroundColor: String(overrideInputProps.backgroundColor || captionBackgroundColor),
          captionShowBackground: typeof overrideInputProps.showBackground === "boolean" ? overrideInputProps.showBackground : captionBackgroundColor !== "",
          videoLayout: mode === "autoCaption" ? "fullscreen" : String(overrideInputProps.videoLayout || videoLayout),
          progressStyle: mode === "autoCaption" ? "none" : String(overrideInputProps.progressStyle || progressStyle),
          wordClickSound: mode === "autoCaption" ? false : wordClickSound,
          accentColor: overrideInputProps.accentColor || undefined,
          stickerScale: overrideInputProps.stickerScale || undefined,
          stickerOffsetX: overrideInputProps.stickerOffsetX || undefined,
          stickerOffsetY: overrideInputProps.stickerOffsetY || undefined,
          // Pass edited captions from preview directly so jobs route uses them
          ...(overrideInputProps.captions ? { previewCaptions: overrideInputProps.captions } : {}),
          ...(overrideInputProps.scenes ? { previewScenes: overrideInputProps.scenes } : {}),
          ...(overrideInputProps.overlayTimeline ? { previewOverlayTimeline: overrideInputProps.overlayTimeline } : {}),
          ...(overrideInputProps.stickers ? { previewStickers: overrideInputProps.stickers } : {}),
          // Long Video Promo fields
          ...(mode === "longVideoPromo" ? {
            promoTitle: promoTitle.trim(),
            channelName: promoChannelName.trim(),
            subscriberCount: promoSubscriberCount.trim(),
            ctaText: promoCtaText.trim() || "Watch full video →",
            thumbnailKey: promoThumbnailKey || undefined,
            backgroundMusic: promoBgMusic,
            videoDuration: promoVideoDuration.trim() || undefined,
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
        }),
      });
      const job = await readJsonPayload(jobResponse);
      if (!jobResponse.ok || !job.ok) {
        const reasonCode = typeof job.reasonCode === "string" ? job.reasonCode : "";
        const fd = job._founderDiagnostics || {};
        const diagnosticParts = [
          fd.step ? `Step: ${fd.step}` : (job.step ? `Step: ${job.step}` : ""),
          fd.reason ? `Reason: ${fd.reason}` : (reasonCode ? `Reason: ${reasonCode}` : ""),
          fd.mode ? `Mode: ${fd.mode}` : (job.debugMode ? `Mode: ${job.debugMode}` : ""),
          fd.templateName ? `Template: ${fd.templateName}` : (job.debugTemplate ? `Template: ${job.debugTemplate}` : ""),
          fd.compositionId ? `Composition: ${fd.compositionId}` : (job.debugComposition ? `Composition: ${job.debugComposition}` : ""),
          fd.httpStatus ? `HTTP: ${fd.httpStatus}` : (job.httpStatus ? `HTTP: ${job.httpStatus}` : ""),
          fd.detail ? `Detail: ${fd.detail}` : (job.detail ? `Detail: ${job.detail}` : ""),
          fd.raw ? `Raw: ${String(fd.raw).slice(0, 240)}` : (job.rawText ? `Raw: ${String(job.rawText).slice(0, 240)}` : ""),
        ].filter(Boolean);

        setJobStatus({
          state: "error",
          message: sanitizeUserFacingStatus(job.error || job.message || "Could not start render.") + (isFounderDebugUser && diagnosticParts.length ? ` — ${diagnosticParts.join(" | ")}` : ""),
          progress: getFailureProgress(reasonCode),
          failureStage: getFailureStage(reasonCode),
          reasonCode,
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

      setJobStatus({
        state: "rendering",
        message: job.transcriptSource === "primary"
          ? "Rendering your reel. This may take a few minutes..."
          : `Rendering with backup planning. ${sanitizeUserFacingStatus(job.transcriptWarning || "")}`.trim(),
        progress: 0,
        renderId: job.renderId,
        bucketName: job.bucketName,
        title: plannedTitle,
        design: plannedDesign,
      });
      pollRender(job.renderId, job.bucketName, userId, {title: plannedTitle, design: plannedDesign});
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
        status = await readJsonPayload(response);
        consecutivePollErrors = 0;
      } catch (error) {
        consecutivePollErrors += 1;
        if (consecutivePollErrors >= 3) {
          setJobStatus({state: "error", message: formatNetworkError(error, "Could not read render progress."), renderId, bucketName, ...meta});
          return;
        }
        setJobStatus((current) => ({
          state: "rendering",
          message: "Render is still running. Rechecking connection...",
          progress: current.progress || 0,
          renderId,
          bucketName,
          ...meta,
        }));
        continue;
      }
      if (!response.ok || !status.ok) {
        setJobStatus({state: "error", message: status.error || "Could not read render progress.", renderId, bucketName, ...meta});
        return;
      }
      if (status.errors?.length) {
        setJobStatus({state: "error", message: sanitizeUserFacingStatus(status.errors[0]?.message || "Render failed."), renderId, bucketName, ...meta});
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
}

function makeCurrentPreviewRender(outputFile: string, mode: Mode, title: string, design: string): RecentRender {
  return {
    id: "current-render",
    title: title || "Current reel",
    mode,
    design,
    outputFile,
    createdAt: Date.now(),
    expiresAt: Date.now() + RECENT_RENDER_RETENTION_MS,
  };
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
    if (mode === "dynamicCreator") return "Dynamic Creator Reel needs a video file. Please upload an MP4/MOV video.";
    return "Auto Caption Reel needs a video file. Please upload an MP4/MOV video.";
  }
  if (mode === "compare" && !isAudio) {
    return "Compare needs an audio voiceover plus 2 comparison photos.";
  }
  if ((mode === "autoDraw" || mode === "longVideoPromo") && !isAudio && !isVideo) {
    return `${modeConfig[mode].title} needs an audio or video file with clear speech.`;
  }
  return "";
}

function validateComparisonImage(file: File) {
  const type = file.type || "";
  const name = file.name.toLowerCase();
  const isImage = type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(name);
  const maxBytes = 25 * 1024 * 1024;
  if (!isImage) return "Compare images must be JPG, PNG, or WEBP files.";
  if (file.size > maxBytes) return "Each Compare image must be under 25MB.";
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
  for (const file of files.slice(0, 4)) {
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

function planningMessageForMode(mode: Mode) {
  if (mode === "autoCaption") return "Preparing styled subtitles for your reel...";
  if (mode === "compare") return "Preparing left/right comparison scenes...";
  if (mode === "creatorBackgroundReplace") return "Preparing your background replacement render...";
  if (mode === "autoDraw") return "Creating whiteboard scenes from your voiceover...";
  if (mode === "longVideoPromo") return "Preparing your promo reel...";
  if (mode === "dynamicCreator") return "Preparing dynamic text and pacing...";
  return "Choosing scenes, text, and visuals...";
}


async function uploadTemplateImage({file, userId}: {file: File; userId: string}) {
  const contentType = getUploadContentType(file);

  const presignResponse = await fetch("/api/media/presign", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      fileSize: file.size,
      mode: "longVideoPromo",
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
function RenderStatusStage({
  mode,
  onPreview,
  onReset,
  status,
  title,
}: {
  mode: Mode;
  onPreview: () => void;
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
      className={`relative overflow-hidden rounded-xl border p-4 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-5 ${
        failed
          ? "border-red-300/24 bg-red-500/[0.055]"
          : ready
            ? "border-brand-mint/35 bg-brand-mint/[0.07]"
            : "border-brand-mint/24 bg-[#061011]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.09),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      {renderParticles.map((particle) => (
        <span
          aria-hidden="true"
          className="absolute h-1.5 w-1.5 rounded-full bg-brand-mint/70 shadow-[0_0_18px_rgba(124,58,237,0.75)] motion-safe:animate-pulse"
          key={`${particle.left}-${particle.top}`}
          style={{left: particle.left, top: particle.top, animationDelay: particle.delay}}
        />
      ))}

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg border ${meta.iconFrame}`}>
            <StageIcon className={working ? "motion-safe:animate-pulse" : ""} size={22} />
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-black uppercase tracking-[0.2em] ${meta.kickerClass}`}>{meta.kicker}</p>
            <h3 className="mt-1 text-xl font-black tracking-normal text-white sm:text-2xl">{meta.title}</h3>
            <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-zinc-400">{status.message || meta.body}</p>
          </div>
        </div>
        <div className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${meta.badgeClass}`}>
          {working ? <Loader2 className="motion-safe:animate-spin" size={14} /> : null}
          {failed ? "Needs retry" : ready ? "Ready" : `${percentage}%`}
        </div>
      </div>

      <div className="relative mt-5 grid gap-5 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="relative min-h-52 overflow-hidden rounded-lg border border-white/10 bg-black/35 p-4">
          <div className="absolute inset-x-4 top-5 h-px bg-gradient-to-r from-transparent via-brand-mint/70 to-transparent" />
          <div className="absolute inset-y-6 left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="relative mx-auto flex aspect-[9/16] h-56 max-h-full flex-col overflow-hidden rounded-xl border border-white/15 bg-[#06090d] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
            <div className="relative h-[36%] overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.26),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035))]">
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1.5">
                {renderPreviewBars.map((height, index) => (
                  <span
                    className="w-1.5 rounded-full bg-brand-mint/85 shadow-[0_0_14px_rgba(124,58,237,0.55)] motion-safe:animate-pulse"
                    key={`render-bar-${index}`}
                    style={{
                      animationDelay: `${index * 0.08}s`,
                      height: `${Math.max(14, height * 0.42)}px`,
                    }}
                  />
                ))}
              </div>
              <div className="absolute bottom-3 left-3 right-3 h-8 rounded-md border border-white/10 bg-white/10" />
            </div>
            <div className="mt-2 grid flex-1 grid-rows-[1fr_0.74fr_0.92fr] gap-2">
              <div className="rounded-lg border border-brand-mint/20 bg-brand-mint/[0.12] p-2">
                <div className="h-2 w-2/3 rounded-full bg-white/70" />
                <div className="mt-2 h-1.5 w-1/2 rounded-full bg-brand-mint/70" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-white/[0.08]" />
                <div className="rounded-md bg-white/[0.055]" />
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-2">
                <div className="h-1.5 w-3/4 rounded-full bg-white/50" />
                <div className="mt-2 h-1.5 w-1/3 rounded-full bg-brand-mint/60" />
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-mint via-white to-cyan-200 transition-all duration-700"
                style={{width: `${Math.max(8, percentage)}%`}}
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
            <span>{modeConfig[toActiveDashboardMode(mode)].label}</span>
            <span>{title.replace(/\.[^.]+$/, "").slice(0, 18) || "Reel"}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.16em] form-label-muted">
              <span>Live render timeline</span>
              <span className="text-brand-mint">{failed ? "Paused" : ready ? "Complete" : "Active"}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full border border-white/10 bg-black/45">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  failed ? "bg-red-300" : "bg-gradient-to-r from-brand-mint via-cyan-100 to-white"
                }`}
                style={{width: `${Math.max(6, percentage)}%`}}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  className={`rounded-lg border px-3 py-3 ${
                    step.done
                      ? "border-brand-mint/30 bg-brand-mint/[0.09] text-white"
                      : step.active
                        ? "border-white/20 bg-white/[0.06] text-white"
                        : "border-white/10 bg-black/20 text-zinc-500"
                  }`}
                  key={step.label}
                >
                  <div className="flex items-center gap-2">
                    <StepIcon className={step.active && working ? "text-brand-mint motion-safe:animate-pulse" : step.done ? "text-brand-mint" : ""} size={15} />
                    <p className="text-xs font-black uppercase tracking-[0.13em]">{step.label}</p>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-zinc-500">{step.detail}</p>
                </div>
              );
            })}
          </div>

          {status.outputFile ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-mint/35 bg-brand-mint/[0.13] px-4 py-3 text-sm font-black text-brand-mint transition hover:bg-brand-mint hover:text-black"
                onClick={onPreview}
                type="button"
              >
                <Eye size={16} />
                Preview
              </button>
              <a
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-brand-mint"
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
              <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                Your upload is still selected. Tap Retry below to try again without uploading the file again.
              </p>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-8 py-3.5 text-[15px] font-semibold text-white transition brand-btn-primary-dark"
              >
                ↻ Retry — Create My Reel
              </button>
            </div>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold leading-6 text-zinc-400">
              Keep this tab open. Your finished MP4 will appear here and in Your Videos.
            </p>
          )}
        </div>
      </div>
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
      body: "Your final MP4 is ready to preview or download.",
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
      body: "We could not generate this reel. You can retry with the same file or choose a better matching template.",
      badgeClass: "border-red-300/25 bg-red-500/10 text-red-100",
      icon: AlertTriangle,
      iconFrame: "border-red-300/25 bg-red-500/10 text-red-100",
      kicker: "Needs attention",
      kickerClass: "text-red-100",
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
      kickerClass: "text-cyan-100",
      title: "Uploading your file",
    };
  }
  if (status.state === "starting") {
    return {
      body: mode === "compare"
        ? "Listening to your audio and preparing image comparison timing."
        : mode === "creatorBackgroundReplace"
          ? "Preparing the creator cutout and uploaded background."
          : "Listening to your audio and building the reel structure.",
      badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
      icon: Layers3,
      iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
      kicker: mode === "compare" ? "Compare planning" : mode === "creatorBackgroundReplace" ? "Background prep" : "Transcribing",
      kickerClass: "text-brand-mint",
      title: mode === "compare" ? "Building your comparison" : mode === "creatorBackgroundReplace" ? "Preparing background replace" : "Listening to your audio",
    };
  }
  return {
    body: "Rendering your reel. Most videos complete in 3–5 minutes. In some cases, it may take up to 10 minutes. Please wait while we prepare your final HD video.",
    badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
    icon: Clapperboard,
    iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
    kicker: "Rendering in progress",
    kickerClass: "text-brand-mint",
    title: "Creating your HD video",
  };
}

function getRenderSteps(progress: number, status: JobStatus, mode: Mode) {
  const definitions = [
    {label: "Upload", detail: "Uploading your file.", threshold: 0.08, icon: Upload},
    {
      label: mode === "compare" ? "Compare beats" : mode === "creatorBackgroundReplace" ? "Background" : "Transcript",
      detail: mode === "compare" ? "Timing left/right comparison." : mode === "creatorBackgroundReplace" ? "Preparing the uploaded image and creator layer." : "Using real speech timing.",
      threshold: 0.24,
      icon: Layers3,
    },
    {
      label: "Planning",
      detail: mode === "compare" ? "Building comparison scenes." : mode === "autoDraw" ? "Creating whiteboard scenes." : mode === "creatorBackgroundReplace" ? "Applying saved preview settings." : "Choosing scenes and visuals.",
      threshold: 0.45,
      icon: Sparkles,
    },
    {
      label: "Rendering",
      detail: "Creating HD frames. This step takes the most time (2–8 min).",
      threshold: 0.85,
      icon: Film,
    },
    {label: "Done", detail: "Final MP4 is ready.", threshold: 0.96, icon: Clapperboard},
  ];
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

function getFailureStage(reasonCode?: string): JobStatus["failureStage"] {
  const normalized = String(reasonCode || "").toUpperCase();
  if (normalized.includes("TRANSCRIPTION") || normalized.includes("TRANSCRIPT")) return "transcript";
  if (normalized.includes("PLAN") || normalized.includes("VALIDATION") || normalized.includes("MEDIA_SOURCE")) return "planning";
  if (normalized.includes("RENDER")) return "render";
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
  if (normalized === "autocaption" || normalized === "autocaptionreel" || normalized === "caption" || normalized === "captions" || normalized === "subtitle" || normalized === "videocaption") return "autoCaption";
  if (normalized === "compare" || normalized === "comparison" || normalized === "compareexplainer" || normalized === "vs") return "compare";
  if (normalized === "autodraw" || normalized === "autodrawexplainer" || normalized === "whiteboard") return "autoDraw";
  if (normalized === "longvideopromo" || normalized === "longvideopromotion" || normalized === "promo") return "longVideoPromo";
  if (normalized === "dynamiccreator" || normalized === "dynamiccreatorreel" || normalized === "dynamicedit") return "dynamicCreator";
  if (normalized === "creatorbackgroundreplace" || normalized === "backgroundreplace" || normalized === "videobackgroundimage") return "creatorBackgroundReplace";
  return null;
}

function getModeLabel(mode: Mode) {
  return modeConfig[toActiveDashboardMode(mode)]?.label || "Auto Caption";
}

function readDashboardMode(value: string | null): Mode | null {
  const normalized = String(value || "").toLowerCase().replace(/[-_\s]+/g, "");
  if (!normalized) return null;
  if (normalized === "autocaptionreel" || normalized === "autocaption") return "autoCaption";
  if (normalized === "compareexplainer" || normalized === "compare" || normalized === "comparison") return "compare";
  if (normalized === "autodrawexplainer" || normalized === "autodraw" || normalized === "whiteboard") return "autoDraw";
  if (normalized === "longvideopromo" || normalized === "longvideopromotion" || normalized === "promo") return "longVideoPromo";
  if (normalized === "dynamiccreatorreel" || normalized === "dynamiccreator" || normalized === "dynamicedit") return "dynamicCreator";
  if (normalized === "creatorbackgroundreplace" || normalized === "backgroundreplace" || normalized === "videobackgroundimage") return "creatorBackgroundReplace";
  if (normalized.includes("caption") || normalized.includes("subtitle")) return "autoCaption";
  if (normalized.includes("compare")) return "compare";
  if (normalized.includes("draw") || normalized.includes("whiteboard")) return "autoDraw";
  if (normalized.includes("promo")) return "longVideoPromo";
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

function PlanStat({label, value, accent = false}: {label: string; value: string; accent?: boolean}) {
  return (
    <div className="rounded-md px-3 py-2" style={{ border: accent ? 'none' : '1px solid var(--border-dark)', background: accent ? 'transparent' : 'rgba(0,0,0,0.2)' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-dark-muted)' }}>{label}</p>
      <p className="mt-0.5 truncate" style={{ fontSize: accent ? '24px' : '14px', fontWeight: accent ? 600 : 500, color: accent ? 'var(--color-primary-hover)' : 'var(--text-dark-secondary)' }}>{value}</p>
    </div>
  );
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
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-zinc-500">{Number(value).toFixed(step < 1 ? 2 : 0)}</span>
      </span>
      <input
        className="w-full accent-orange-300"
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
    <div className="mt-4">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100">Live preview</p>
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-lg border border-orange-300/20 bg-black">
        <img
          alt="Uploaded background preview"
          className="absolute inset-0 h-full w-full"
          src={backgroundUrl}
          style={{
            objectFit: settings.backgroundFit,
            transform: `translate(${settings.backgroundX}px, ${settings.backgroundY}px) scale(${settings.backgroundScale})`,
            transformOrigin: "center",
          }}
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
      <p className="mt-2 text-center text-[11px] text-zinc-500">
        Preview updates instantly. Final export uses these exact values.
      </p>
    </div>
  );
}

function PolicyPill({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <Icon className="mb-3" size={18} style={{ color: 'var(--color-primary-hover)' }} />
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>
    </div>
  );
}

function ProgressPreview({mode}: {mode: Mode}) {
  const steps = mode === "compare"
      ? ["Audio", "Images", "Compare", "Render", "Download"]
      : mode === "creatorBackgroundReplace"
        ? ["Video", "Image", "Adjust", "Render", "Download"]
    : ["Upload", "Transcribe", "Plan", "Render", "Download"];

  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">What happens next</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div className="flex items-center gap-2" key={step}>
            <span className="rounded-md border border-white/10 bg-white/[0.04]" style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dark-secondary)' }}>
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
    <div className="mt-4 w-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-black/40 p-3">
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
          className="aspect-video w-full rounded-md bg-black object-contain"
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

  return <img alt={alt} className={className} src={previewUrl} />;
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

function sanitizeUserFacingStatus(value: string) {
  const source = String(value || "");
  const normalized = source.toLowerCase();
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
    .replace(/\bUNSUPPORTED_MEDIA_FOR_TEMPLATE\b/gi, "This file type does not match the selected template.")
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







































