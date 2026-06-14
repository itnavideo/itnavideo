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
  CheckCircle2,
  Clapperboard,
  Clock3,
  Download,
  Eye,
  Film,
  FolderOpen,
  ImageIcon,
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

type Mode = "videoExplainer" | "notes" | "videoCaption" | "imageStory" | "compare";
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
  {
    id: "video-explainer",
    title: "Video Simple Explainer",
    description: "User video with real subtitles, title, and one bottom image.",
    image: "/visuals/previews/video-explainer-homepage.png",
    badges: ["Video", "Subtitles", "1 Image"],
    active: true,
    mode: "videoExplainer" as const,
  },
  {
    id: "compare",
    title: "Compare",
    description: "Audio-led comparison with left/right image panels.",
    image: "/visuals/previews/homepage to show the COMPARE template preview.png",
    badges: ["Audio", "2-4 images", "Left vs Right"],
    active: true,
    mode: "compare" as const,
  },
] as const;

const modeConfig = {
  videoExplainer: {
    label: "Video Simple",
    title: "Video Simple Explainer",
    description: "Upload audio or video with clear speech. AI creates explainer scenes from the real transcript.",
    accept: "audio/*,video/*",
    supported: "Supported: MP3, WAV, MP4, MOV, WEBM",
    bestResult: "Best result: clear voice, one topic, around 1 minute.",
    uploadCta: "Choose File",
    icon: Film,
    color: "text-cyan-200",
    border: "border-cyan-300/35",
    surface: "bg-cyan-300/[0.08]",
  },
  notes: {
    label: "Handwritten Notes",
    title: "Handwritten Notes",
    description: "Upload voiceover or video with clear speech. AI writes live note sections.",
    accept: "audio/*,video/*",
    supported: "Supported: MP3, WAV, MP4, MOV, WEBM",
    bestResult: "Best result: one teaching topic, clean explanation, around 1 minute.",
    uploadCta: "Choose File",
    icon: PenLine,
    color: "text-amber-100",
    border: "border-amber-200/35",
    surface: "bg-amber-200/[0.08]",
  },
  videoCaption: {
    label: "Video Caption",
    title: "Video Caption",
    description: "Upload a video with speech. Captions come from the real transcript only.",
    accept: "video/*",
    supported: "Supported: MP4, MOV, WEBM",
    bestResult: "Best result: clear speech, minimal background noise, around 1 minute.",
    uploadCta: "Choose video for captions",
    icon: Captions,
    color: "text-violet-100",
    border: "border-violet-200/35",
    surface: "bg-violet-200/[0.08]",
  },
  imageStory: {
    label: "Image Story",
    title: "Image Story",
    description: "Upload an image. Image-only reels do not need a transcript.",
    accept: "image/*",
    supported: "Supported: JPG, PNG, WEBP",

    bestResult: "Best result: strong image and short topic/title.",
    uploadCta: "Choose image",
    icon: ImageIcon,
    color: "text-fuchsia-200",
    border: "border-fuchsia-300/35",
    surface: "bg-fuchsia-300/[0.08]",
  },
  compare: {
    label: "Compare",
    title: "Compare",
    description: "Upload audio plus 2 photos for left/right. Use 4 photos when the explanation has more beats.",
    accept: "audio/*",
    supported: "Supported audio: MP3, WAV, M4A, AAC, OGG",
    bestResult: "Best result: short comparison voiceover with clear left and right examples.",
    uploadCta: "Choose audio",
    icon: Layers3,
    color: "text-emerald-100",
    border: "border-emerald-200/35",
    surface: "bg-emerald-200/[0.08]",
  },
} as const;

const renderPreviewBars = [42, 76, 48, 92, 58, 82, 38, 68, 96, 54, 74, 44, 88, 52, 72, 62];
const renderParticles = [
  {left: "8%", top: "18%", delay: "0s"},
  {left: "22%", top: "72%", delay: "0.4s"},
  {left: "38%", top: "28%", delay: "0.9s"},
  {left: "56%", top: "82%", delay: "0.2s"},
  {left: "74%", top: "20%", delay: "0.7s"},
  {left: "88%", top: "62%", delay: "1.1s"},
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("compare");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparisonFiles, setComparisonFiles] = useState<File[]>([]);
  const [videoExplainerImageFile, setVideoExplainerImageFile] = useState<File | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [compareLeftTitle, setCompareLeftTitle] = useState("");
  const [compareRightTitle, setCompareRightTitle] = useState("");
  const [compareHandle, setCompareHandle] = useState("@itnavideo");
  const [stickerStyle, setStickerStyle] = useState<"2d" | "cartoon" | "explainer">("2d");
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [previewRender, setPreviewRender] = useState<RecentRender | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<RecentRender | null>(null);
  const [deletingRenderId, setDeletingRenderId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>({state: "idle", message: ""});
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [paymentBanner, setPaymentBanner] = useState("");

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

  const activeMode = modeConfig[mode];
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
    !renderInProgress &&
    !paidLimitComplete,
  );

  const chooseTemplateMode = (nextMode: Mode) => {
    setMode(nextMode);
    setSelectedFile(null);
    setComparisonFiles([]);
    setJobStatus({state: "idle", message: ""});
    const nextTemplate = nextMode === "notes" ? "notes" : nextMode === "videoCaption" ? "video-caption" : nextMode === "imageStory" ? "image-story" : nextMode === "compare" ? "compare" : "video-explainer";
    window.history.replaceState(null, "", `/dashboard?template=${nextTemplate}`);
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
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
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
    <main className="min-h-screen overflow-x-hidden bg-[#050506] px-4 pb-12 pt-24 text-white sm:px-5 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:mb-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <BrandLogo size="md" showTagline />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-mint sm:text-sm">Create workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">
              Welcome, {firstName}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/videos"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              <FolderOpen size={16} />
              Projects
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
              type="button"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {paymentBanner || billingEntitlement?.active ? (
          <section className="mb-5 rounded-lg border border-brand-mint/25 bg-brand-mint/10 p-4 text-sm font-bold leading-6 text-zinc-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={20} />
                <div>
                  <p className="text-brand-mint">
                    {paymentBanner || `Congratulations. You are on the ${billingEntitlement?.planName || "paid"} plan.`}
                  </p>
                  {billingEntitlement?.active ? (
                    <>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                        {billingEntitlement.planName} active until {formatDate(billingEntitlement.expiresAt)}
                      </p>
                      <p className="mt-2 text-sm font-black text-white">
                        You can still make {billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit} videos this billing period.
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[460px]">
                <PlanStat label="Plan" value={billingEntitlement?.planName || "Paid"} />
                <PlanStat label="Limit" value={String(billingEntitlement?.usage?.limit || billingEntitlement?.monthlyVideoLimit || "-")} />
                <PlanStat label="Used" value={String(billingEntitlement?.usage?.used ?? 0)} />
                <PlanStat label="Left" value={String(billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? "-")} accent />
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="rounded-lg border border-white/10 bg-zinc-950 p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-mint">Create reel</p>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Upload for {activeMode.label}.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Choose a template, upload the required media, and we will render a polished 9:16 reel.
                </p>
              </div>
              <div className={`inline-flex items-center justify-center gap-2 rounded-lg border ${activeMode.border} ${activeMode.surface} px-4 py-3 text-sm font-black ${activeMode.color}`}>
                <ActiveModeIcon size={16} />
                {activeMode.label}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {templateCards.filter((template) => template.mode !== "videoExplainer").map((template) => (
                  <button
                    aria-disabled={!template.active}
                    aria-pressed={template.active && template.mode === mode}
                    className={`group overflow-hidden rounded-lg border text-left transition ${
                      template.active
                        ? template.mode === mode
                          ? "border-brand-mint/55 bg-brand-mint/[0.075] hover:border-brand-mint"
                          : "border-white/12 bg-white/[0.035] hover:border-white/25"
                        : "cursor-not-allowed border-white/10 bg-white/[0.025] opacity-72"
                    }`}
                    key={template.id}
                    onClick={() => {
                      if (!template.active) return;
                      if (!template.mode) return;
                      chooseTemplateMode(template.mode);
                    }}
                    type="button"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      <Image
                        alt=""
                        className={`object-cover object-top transition duration-500 ${template.active ? "group-hover:scale-[1.025]" : "grayscale-[0.2]"}`}
                        fill
                        priority={template.active && template.mode === mode}
                        sizes="(min-width: 1024px) 210px, (min-width: 640px) 30vw, 100vw"
                        src={template.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                      <div
                        className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                          template.active && template.mode === mode ? "bg-brand-mint text-black" : "border border-white/12 bg-black/62 text-zinc-300"
                        }`}
                      >
                        {template.active ? template.mode === mode ? "Selected" : "Active" : "Unavailable"}
                      </div>
                      {!template.active ? (
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/12 bg-black/62 text-zinc-300">
                          <Lock size={14} />
                        </div>
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-black text-white">{template.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{template.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {template.badges.map((badge) => (
                          <span
                            className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
                              template.active && template.mode === mode
                                ? "border-brand-mint/30 bg-brand-mint/10 text-brand-mint"
                                : "border-white/10 bg-black/25 text-zinc-400"
                            }`}
                            key={`${template.id}-${badge}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div
                        className={`mt-3 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-black transition ${
                          template.active
                            ? template.mode === mode
                              ? "bg-brand-mint text-black"
                              : "border border-brand-mint/25 bg-brand-mint/10 text-brand-mint group-hover:bg-brand-mint group-hover:text-black"
                            : "border border-white/10 bg-white/[0.035] text-zinc-500"
                        }`}
                      >
                        {template.active ? template.mode === mode ? "Using this template" : "Use template" : "Unavailable"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <label
                className={`flex min-h-56 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed ${activeMode.border} ${activeMode.surface} p-4 text-center transition hover:bg-white/[0.055] sm:min-h-64 sm:p-6`}
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
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-lg border ${activeMode.border} bg-black/25 ${activeMode.color}`}>
                  <ActiveModeIcon size={30} />
                </div>
                <p className="text-xl font-black text-white sm:text-2xl">{activeMode.title}</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">{activeMode.description}</p>
                <p className="mt-3 text-xs font-bold text-zinc-500">{activeMode.supported}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">{activeMode.bestResult}</p>
                <span className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-black sm:w-auto">
                  <Upload size={16} />
                  {activeMode.uploadCta}
                </span>
                {selectedFile ? (
                  <div className="mt-5 w-full rounded-md border border-white/10 bg-black/35 px-4 py-3 text-left">
                    <p className="truncate text-sm font-black text-white">{selectedFile.name}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">{fileMeta}</p>
                  </div>
                ) : null}
                {selectedFile ? (
                  <SelectedMediaPreview file={selectedFile} mode={mode} />
                ) : null}</label>

              {mode === "videoExplainer" ? (
                <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-4">
                  <label className="text-sm font-black text-white" htmlFor="video-explainer-image">
                    Bottom explanation image
                  </label>
                  <p className="mt-1 text-xs font-bold leading-5 text-zinc-400">
                    Upload one image. It will fit below subtitles using contain mode, no crop.
                  </p>

                  <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-amber-300/35 bg-black/25 p-4 text-center transition hover:bg-white/[0.05]">
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      id="video-explainer-image"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0] || null;
                        if (file && !file.type.startsWith("image/")) {
                          setJobStatus({state: "error", message: "Bottom explanation image must be PNG, JPG, or WebP."});
                          event.currentTarget.value = "";
                          return;
                        }
                        setVideoExplainerImageFile(file);
                        setJobStatus({state: "idle", message: ""});
                        event.currentTarget.value = "";
                      }}
                      type="file"
                    />
                    <Upload size={18} className="mb-2 text-amber-200" />
                    <span className="text-sm font-black text-white">
                      {videoExplainerImageFile ? "Change bottom image" : "Upload bottom image"}
                    </span>
                    {videoExplainerImageFile ? (
                      <span className="mt-2 max-w-full truncate text-xs font-bold text-zinc-400">
                        {videoExplainerImageFile.name}
                      </span>
                    ) : null}
                  </label>

                  {videoExplainerImageFile ? (
                    <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100">
                        Bottom image preview
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-24 w-24 overflow-hidden rounded-lg border border-amber-300/25 bg-white">
                          <img
                            alt="Bottom explanation preview"
                            className="h-full w-full object-contain"
                            src={URL.createObjectURL(videoExplainerImageFile)}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-white">{videoExplainerImageFile.name}</p>
                          <p className="mt-1 text-xs font-bold text-zinc-500">
                            This image will appear below subtitles in the final reel.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {videoExplainerImageFile ? (
                    <button
                      className="mt-3 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 transition hover:bg-white/10"
                      onClick={() => {
                        setVideoExplainerImageFile(null);
                        setJobStatus({state: "idle", message: ""});
                      }}
                      type="button"
                    >
                      Remove image
                    </button>
                  ) : null}
                </div>
              ) : null}

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

              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <label className="text-sm font-black text-white" htmlFor="reel-topic">
                  {mode === "videoExplainer" ? "Reel title (shows at top of video)" : "Optional reel topic/title"}
                </label>
                <input
                  className="mt-3 w-full rounded-lg border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-brand-mint/55"
                  id="reel-topic"
                  maxLength={120}
                  onChange={(event) => setTopicTitle(event.target.value)}
                  placeholder={mode === "imageStory" ? "Example: RBI Grade B training process" : mode === "compare" ? "Example: Website vs Web App" : "Example: PAN Card apply process"}
                  type="text"
                  value={topicTitle}
                />
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {mode === "videoExplainer" ? "This title will display at the top of your video reel." : "Optional when speech exists. Helpful for topic-specific explainer titles."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <PolicyPill icon={Clock3} title="First minute" body="Long uploads are trimmed automatically." />
                <PolicyPill
                  icon={Sparkles}
                  title={mode === "notes" ? "Voice to handwritten notes" : mode === "videoCaption" ? "Auto captions" : mode === "imageStory" ? "Image story beats" : mode === "compare" ? "Audio to comparison" : "Transcript to explainer"}
                  body={mode === "notes" ? "Speech becomes neat note sections." : mode === "videoCaption" ? "Speech becomes synced captions only." : mode === "imageStory" ? "Images can render without fake transcript." : mode === "compare" ? "Speech becomes timed compare captions." : "Clear speech becomes scenes and text."}
                />
                <PolicyPill
                  icon={BadgeCheck}
                  title="Clean layout"
                  body={mode === "notes" ? "Blank page notes, no prewritten image." : mode === "videoCaption" ? "Video stays full screen with safe captions." : mode === "imageStory" ? "One strong image per scene." : mode === "compare" ? "Two image panels stay visible." : "One primary visual per scene."}
                />
                <PolicyPill
                  icon={ShieldCheck}
                  title="Private upload"
                  body="Your file is temporary and only used to create your reel."
                />
              </div>

              <button
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 text-sm font-black transition ${
                  canPrepareReel
                    ? "bg-brand-mint text-black hover:bg-white"
                    : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-500"
                }`}
                disabled={!canPrepareReel}
                onClick={startRenderJob}
                type="button"
              >
                <Sparkles size={17} />
                {jobStatus.state === "uploading"
                  ? "Uploading..."
                  : jobStatus.state === "rendering"
                    ? "Rendering..."
                    : paidLimitComplete
                      ? "Plan limit complete"
                      : "Create My Reel"}
              </button>
              <p className="text-center text-xs font-bold leading-5 text-zinc-500">
                {!selectedFile ? "Upload a file to continue. " : mode === "compare" && comparisonFiles.length !== 2 ? "Add at least two compare images. " : ""}
                First video starts at ₹9. Most reels finish in a few minutes.
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
                  status={jobStatus}
                  title={jobStatus.title || selectedFile?.name || activeMode.title}
                />
              ) : null}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-white/10 bg-zinc-950 p-4 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-mint">Recent renders</p>
                  <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Available for 48 hours</h2>
                </div>
                <FolderOpen className="text-brand-mint" size={22} />
              </div>
              {recentRenders.length ? (
                <div className="space-y-3">
                  {recentRenders.map((render) => (
                    <article key={render.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white">{render.title}</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                            {getModeLabel(render.mode)} | {formatTimeLeft(render.expiresAt)}
                          </p>
                        </div>
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
                          rel="noreferrer"
                          target="_blank"
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
                  Finished reels will appear here on this device until their temporary links expire.
                </div>
              )}
            </section>

            <section className="rounded-lg border border-amber-200/18 bg-amber-200/[0.055] p-4 md:p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-100">Upload privacy</p>
              <div className="mt-5 space-y-3">
                {[
                  "Your uploads are private and temporary.",
                  "Final MP4 links are removed after about 48 hours.",
                  "Your reel is created in the background. You can wait here or come back later.",
                  "We only use your file to create your reel.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-zinc-200">
                    <ShieldCheck className="mt-0.5 shrink-0 text-amber-100" size={16} />
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
          <div className="max-h-full w-full max-w-sm overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl sm:max-w-md">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
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
            <video
              className="aspect-[9/16] w-full bg-black object-contain"
              controls
              playsInline
              preload="metadata"
              src={previewRender.outputFile}
            />
            <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-3">
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
                rel="noreferrer"
                target="_blank"
              >
                <Download size={16} />
                Download
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
    </main>
  );

  async function startRenderJob() {
    if (!selectedFile || !user) return;
    const validation = validateFileForMode(selectedFile, mode);
    if (validation) {
      setJobStatus({state: "error", message: validation});
      return;
    }

    if (mode === "videoExplainer" && !videoExplainerImageFile) {
      setJobStatus({state: "error", message: "Video Simple Explainer needs one bottom explanation image."});
      return;
    }
    if (mode === "compare" && comparisonFiles.length !== 2) {
      setJobStatus({state: "error", message: "Compare needs exactly two images: one left and one right."});
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

      const videoExplainerImageKey = mode === "videoExplainer" && videoExplainerImageFile
        ? await uploadVideoExplainerImage({file: videoExplainerImageFile, userId})
        : "";

      setJobStatus({state: "starting", message: planningMessageForMode(mode)});
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          mediaKey: presign.key,
          fileName: selectedFile.name,
          contentType: uploadContentType,
          mediaType: getFileMediaType(selectedFile),
          mode,
          topicTitle: topicTitle.trim(),
          design: mode === "videoExplainer" && videoExplainerImageKey ? "simpleManual" : undefined,
          userId,
          comparisonImageKeys,
          explanationImageKey: videoExplainerImageKey,
          compareLeftTitle: compareLeftTitle.trim(),
          compareRightTitle: compareRightTitle.trim(),
          creatorHandle: compareHandle.trim() || "@itnavideo",
          stickerStyle,
        }),
      });
      const job = await readJsonPayload(jobResponse);
      if (!jobResponse.ok || !job.ok) {
        const reasonCode = typeof job.reasonCode === "string" ? job.reasonCode : "";
        setJobStatus({
          state: "error",
          message: sanitizeUserFacingStatus(job.error || "Could not start render."),
          progress: getFailureProgress(reasonCode),
          failureStage: getFailureStage(reasonCode),
          reasonCode,
        });
        return;
      }
      const plannedTitle = typeof job.reelTitle === "string" && job.reelTitle.trim()
        ? job.reelTitle.trim()
        : selectedFile.name.replace(/\.[^.]+$/, "") || "Itnavideo reel";
      const plannedDesign = typeof job.design === "string" && job.design.trim()
        ? job.design.trim()
        : "Auto from script";

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
  const isImage = type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(name);
  const maxBytes = 500 * 1024 * 1024;

  if (file.size > maxBytes) {
    return "This file is too large. Please upload a shorter file or compress it under 500MB.";
  }
  if (mode === "videoCaption" && !isVideo) {
    return "Video Caption needs a video file. Please upload an MP4/MOV video or choose another template.";
  }
  if (mode === "notes" && !isAudio && !isVideo) {
    return "Handwritten Notes needs audio or video with clear speech.";
  }
  if (mode === "imageStory" && !isImage) {
    return "Image Story needs an image file. Supported formats include JPG, PNG, and WEBP.";
  }
  if (mode === "compare" && !isAudio) {
    return "Compare needs an audio voiceover plus 2 to 4 comparison photos.";
  }
  // Video Explainer media validation is handled by the backend so browser File.type quirks do not block valid uploads.
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
  if (mode === "notes") return "Creating note sections and writing animations...";
  if (mode === "videoCaption") return "Preparing timed captions from your real transcript...";
  if (mode === "imageStory") return "Creating image story beats and motion...";
  if (mode === "compare") return "Preparing left/right comparison scenes...";
  return "Choosing scenes, text, and visuals...";
}


async function uploadVideoExplainerImage({file, userId}: {file: File; userId: string}) {
  const contentType = getUploadContentType(file);

  const presignResponse = await fetch("/api/media/presign", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      fileSize: file.size,
      mode: "videoExplainer",
      userId,
    }),
  });

  const presign = await readJsonPayload(presignResponse);
  if (!presignResponse.ok || !presign.ok) throw new Error(presign.error || "Could not prepare bottom image upload.");

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {"Content-Type": contentType},
    body: file,
  }).catch((error) => {
    throw new Error(formatNetworkError(error, "Bottom image upload failed. Please retry on a stable connection."));
  });

  if (!uploadResponse.ok) throw new Error("Bottom image upload failed.");

  return presign.key as string;
}
function RenderStatusStage({
  mode,
  onPreview,
  status,
  title,
}: {
  mode: Mode;
  onPreview: () => void;
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(94,234,212,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.09),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      {renderParticles.map((particle) => (
        <span
          aria-hidden="true"
          className="absolute h-1.5 w-1.5 rounded-full bg-brand-mint/70 shadow-[0_0_18px_rgba(94,234,212,0.75)] motion-safe:animate-pulse"
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
            <div className="relative h-[36%] overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(94,234,212,0.26),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035))]">
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1.5">
                {renderPreviewBars.map((height, index) => (
                  <span
                    className="w-1.5 rounded-full bg-brand-mint/85 shadow-[0_0_14px_rgba(94,234,212,0.55)] motion-safe:animate-pulse"
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
            <span>{modeConfig[mode].label}</span>
            <span>{title.replace(/\.[^.]+$/, "").slice(0, 18) || "Reel"}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
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
                rel="noreferrer"
                target="_blank"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          ) : failed ? (
            <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
              Your upload is still selected. Tap Create My Reel again to retry without uploading the file again.
            </p>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold leading-6 text-zinc-400">
              Keep this tab open. Your finished MP4 will appear here and in Recent renders.
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
      body: mode === "videoCaption"
        ? "Listening to your video and preparing timed captions."
        : mode === "notes"
          ? "Listening to your audio and creating note sections."
          : mode === "imageStory"
            ? "Creating image story beats and motion."
            : mode === "compare"
              ? "Listening to your audio and preparing image comparison timing."
            : "Listening to your audio and building the reel structure.",
      badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
      icon: Layers3,
      iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
      kicker: mode === "imageStory" ? "Story planning" : mode === "compare" ? "Compare planning" : "Transcribing",
      kickerClass: "text-brand-mint",
      title: mode === "imageStory" ? "Building your image story" : mode === "compare" ? "Building your comparison" : "Listening to your audio",
    };
  }
  return {
    body: "Rendering your reel. This may take a few minutes.",
    badgeClass: "border-brand-mint/30 bg-brand-mint/[0.12] text-brand-mint",
    icon: Clapperboard,
    iconFrame: "border-brand-mint/35 bg-brand-mint/[0.13] text-brand-mint",
    kicker: "Live render",
    kickerClass: "text-brand-mint",
    title: "Rendering your reel",
  };
}

function getRenderSteps(progress: number, status: JobStatus, mode: Mode) {
  const definitions = [
    {label: "Upload", detail: "Uploading your file.", threshold: 0.08, icon: Upload},
    {
      label: mode === "imageStory" ? "Story beats" : mode === "compare" ? "Compare beats" : "Transcript",
      detail: mode === "imageStory" ? "Creating visual story timing." : mode === "compare" ? "Timing left/right image captions." : "Using real speech timing.",
      threshold: 0.24,
      icon: Layers3,
    },
    {
      label: "Planning",
      detail: mode === "videoCaption" ? "Preparing safe captions." : mode === "notes" ? "Creating note sections." : mode === "imageStory" ? "Adding image motion." : mode === "compare" ? "Pairing images with speech beats." : "Choosing scenes and visuals.",
      threshold: 0.58,
      icon: Sparkles,
    },
    {label: "Done", detail: "Final MP4 is ready.", threshold: 0.92, icon: Clapperboard},
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
  const mode = item.mode === "facecam" || item.mode === "notes" || item.mode === "handwriting" || item.mode === "videoCaption" || item.mode === "caption" || item.mode === "imageStory" || item.mode === "image-story"
    ? item.mode === "handwriting"
      ? "notes"
      : item.mode === "facecam"
        ? "videoExplainer"
        : item.mode === "caption"
          ? "videoCaption"
          : item.mode === "image-story"
            ? "imageStory"
            : item.mode
    : item.mode === "videoExplainer"
      ? item.mode
      : null;
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
  const itemMode = String(item.mode || "");
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    (itemMode === "videoExplainer" || itemMode === "notes" || itemMode === "videoCaption" || itemMode === "imageStory" || itemMode === "compare") &&
    typeof item.outputFile === "string" &&
    typeof item.createdAt === "number" &&
    typeof item.expiresAt === "number"
  );
}

function getModeLabel(mode: Mode) {
  return modeConfig[mode]?.label || "Video Simple";
}

function readDashboardMode(value: string | null): Mode | null {
  const normalized = String(value || "").toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("compare") || normalized.includes("comparison") || normalized === "vs") return "compare";
  if (normalized.includes("notes") || normalized.includes("handwriting")) return "notes";
  if (normalized.includes("caption") || normalized.includes("subtitle")) return "videoCaption";
  if (normalized.includes("image") || normalized.includes("story")) return "imageStory";
  if (normalized.includes("explainer") || normalized.includes("video")) return "videoExplainer";
  return null;
}

function formatTimeLeft(expiresAt: number) {
  const hours = Math.max(0, Math.ceil((expiresAt - Date.now()) / (60 * 60 * 1000)));
  if (hours <= 1) return "expires soon";
  return `${hours}h left`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "this billing period";
  return date.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

function PlanStat({label, value, accent = false}: {label: string; value: string; accent?: boolean}) {
  return (
    <div className={`rounded-md border px-3 py-2 ${accent ? "border-brand-mint/35 bg-brand-mint/15" : "border-white/10 bg-black/20"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`mt-1 truncate text-sm font-black ${accent ? "text-brand-mint" : "text-white"}`}>{value}</p>
    </div>
  );
}

function PolicyPill({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <Icon className="mb-3 text-brand-mint" size={18} />
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>
    </div>
  );
}

function ProgressPreview({mode}: {mode: Mode}) {
  const steps = mode === "imageStory"
    ? ["Upload", "Story beats", "Plan", "Render", "Download"]
    : mode === "compare"
      ? ["Audio", "Images", "Compare", "Render", "Download"]
    : ["Upload", "Transcribe", "Plan", "Render", "Download"];

  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">What happens next</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div className="flex items-center gap-2" key={step}>
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-black text-zinc-300">
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

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

async function readJsonPayload(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
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
    .replace(/\b(?:HANDWRITING_NOTES_REEL|HANDWRITTEN_NOTES|NOTES)\b/g, "Handwritten Notes")
    .replace(/\bVIDEO[-_]EXPLAINER\b/gi, "Video Simple")
    .replace(/\bVIDEO[-_]CAPTION\b/gi, "Video Caption")
    .replace(/\bIMAGE[-_]STORY\b/gi, "Image Story")
    .replace(/\bTRANSCRIPTION_FAILED\b/gi, "We could not detect clear speech in your upload.")
    .replace(/\bTRANSCRIPT_REQUIRED\b/gi, "We could not detect clear speech in your upload.")
    .replace(/\bUNSUPPORTED_MEDIA_FOR_TEMPLATE\b/gi, "This file type does not match the selected template.")
    .replace(/\bMISSING_IMAGE_SOURCE\b/gi, "Image Story needs at least one usable image.")
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



























