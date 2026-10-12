"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { FacelessVideoStudio } from "@/components/dashboard/FacelessVideoStudio";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Film,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Upload,
  Clapperboard,
  Layers3,
  Columns
} from "lucide-react";

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  expiresAt?: string | number;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
};

type JobStatus = {
  state: "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
  message?: string;
  progress?: number;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  diagnostics?: string[];
};

type RecentRender = {
  id: string;
  title: string;
  mode: string;
  design?: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

const FACELESS_RENDER_STEPS = [
  { label: "Voiceover received", detail: "Narration speech track uploaded safely to cloud storage.", threshold: 0.10, icon: Upload },
  { label: "Transcribing narration", detail: "Speech AI translating language patterns & word alignments.", threshold: 0.38, icon: Layers3 },
  { label: "AI Shotlist & Beats", detail: "AI Director planning custom visual layouts and B-roll visuals.", threshold: 0.68, icon: Columns },
  { label: "Rendering Faceless Video", detail: "Cloud render engine building visual overlays, Ken Burns motion, and sound.", threshold: 0.88, icon: Film },
  { label: "Ready to download", detail: "Cinematic faceless video ready to publish on YouTube & social networks.", threshold: 0.98, icon: Clapperboard },
];

export default function FacelessVideoPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Faceless Video States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [facelessImageFiles, setFacelessImageFiles] = useState<File[]>([]);
  const [assetSourceMode, setAssetSourceMode] = useState<"library" | "upload" | "mix">("library");
  const [topicTitle, setTopicTitle] = useState("");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "none">("mystery");
  const [facelessBgmVolume, setFacelessBgmVolume] = useState(0.20);
  const [facelessPacingStyle, setFacelessPacingStyle] = useState<"clean" | "cinematic" | "documentary" | "dynamic">("cinematic");
  const [facelessEnableSfx, setFacelessEnableSfx] = useState<boolean>(true);
  const [subtitleStyle, setSubtitleStyle] = useState<string>("netflix-yellow");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("16:9");

  // Audio duration tracker
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
    }
  }, [user, authLoading, router]);

  // Load audio duration when selected
  useEffect(() => {
    if (!selectedFile) {
      setAudioDurationSeconds(0);
      return;
    }
    const audio = new Audio();
    const url = URL.createObjectURL(selectedFile);
    audio.src = url;
    audio.onloadedmetadata = () => {
      setAudioDurationSeconds(audio.duration || 0);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Billing entitlement fetch
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining ?? (limit - used))));

          setBillingEntitlement({
            ...ent,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Failed to load billing status:", err);
      }
    }

    fetchBilling();
  }, [user]);

  // Saved renders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("itnavideo_faceless_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((r) => r.expiresAt > Date.now());
          setRecentRenders(valid);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Presigned upload helper
  async function uploadFileViaPresign(file: File, folderMode: string, userId: string): Promise<string> {
    const presignRes = await fetch("/api/reels/jobs/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "audio/mpeg",
        mode: folderMode,
        userId,
      }),
    });

    const presignPayload = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presignPayload.ok || !presignPayload.uploadUrl || !presignPayload.key) {
      throw new Error(presignPayload.error || "Failed to generate presigned cloud upload URL.");
    }

    const uploadRes = await fetch(presignPayload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "audio/mpeg" },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Direct cloud upload failed (${uploadRes.status}). Please check network connectivity.`);
    }

    return presignPayload.key;
  }

  // Handle Start Render Job
  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
      return;
    }

    if (!selectedFile) {
      alert("Please upload a narration audio file first.");
      return;
    }
    if (assetSourceMode === "upload" && facelessImageFiles.length === 0) {
      alert("Upload at least one image, or choose Itnavideo Assets or Mix.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading narration audio securely to cloud storage...",
        progress: 0.10,
      });

      // 1. Upload voiceover file
      const mediaKey = await uploadFileViaPresign(selectedFile, "facelessVideo", user.id);
      const uploadedImageKeys = assetSourceMode !== "library" && facelessImageFiles.length > 0
        ? await Promise.all(facelessImageFiles.map((image) => uploadFileViaPresign(image, "facelessVideo", user.id)))
        : [];

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Compiling shotlist and visual beat timelines...",
        progress: 0.22,
      });

      const plannedTitle = topicTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "facelessVideo",
          subtitleStyle,
          uploadedImageKeys,
          assetMode: assetSourceMode,
          topicTitle: plannedTitle,
          userId: user.id,
          facelessBgmMood,
          facelessBgmVolume,
          facelessPacingStyle,
          facelessEnableSfx,
          aspectRatio,
          durationSeconds: audioDurationSeconds || 60,
          sourceDurationSeconds: audioDurationSeconds || 60,
          mediaAspect: aspectRatio === "16:9" ? "landscape" : "portrait",
          frameRange: audioDurationSeconds > 0 ? [0, Math.min(aspectRatio === "16:9" ? 18000 : 2700, Math.round(audioDurationSeconds * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Faceless Video render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 3. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Speech AI transcribing speech narration...",
        progress: 0.38,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 800; // ~40 minutes max polling for long faceless video renders

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Please check back shortly.",
          });
          return;
        }

        try {
          const statusParams = new URLSearchParams({
            renderId,
            bucketName,
            userId: user.id,
            mode: "facelessVideo",
            title: plannedTitle,
            attempt: String(attempts),
          });

          const statusRes = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (!statusRes.ok || !statusPayload.ok) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setJobStatus({
              state: "error",
              message: statusPayload.error || "Failed to fetch status.",
            });
            return;
          }

          const serverState = statusPayload.state;
          const renderErrors = statusPayload.errors || [];
          const hasFatalError = serverState === "error" || (renderErrors.length > 0 && !statusPayload.isRetrying);

          if (hasFatalError) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            const errorMsg = renderErrors[0]?.message || statusPayload.error || "Render job failed.";
            setJobStatus({
              state: "error",
              message: errorMsg,
            });
            return;
          }

          const isRenderComplete = (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) && Boolean(statusPayload.outputFile);

          if (isRenderComplete) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;

            const finishedRender: RecentRender = {
              id: renderId,
              title: plannedTitle,
              mode: "facelessVideo",
              outputFile: statusPayload.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + 48 * 60 * 60 * 1000,
            };

            setRecentRenders((prev) => {
              const updated = [finishedRender, ...prev.filter((r) => r.id !== renderId)];
              localStorage.setItem("itnavideo_faceless_projects", JSON.stringify(updated.slice(0, 30)));
              return updated;
            });

            setJobStatus({
              state: "ready",
              message: "Faceless Video is fully rendered!",
              progress: 1,
              outputFile: statusPayload.outputFile,
              title: plannedTitle,
            });

            // Refresh credit balance
            fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`)
              .then((r) => r.json())
              .then((payload) => {
                if (payload.ok && payload.entitlement) {
                  setBillingEntitlement((curr) => curr ? {
                    ...curr,
                    usage: payload.usage ? {
                      used: payload.usage.used,
                      limit: payload.usage.limit,
                      remaining: payload.usage.remaining
                    } : curr.usage
                  } : null);
                }
              }).catch(() => {});

            return;
          }

          const rawProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : (attempts / MAX_ATTEMPTS);
          const progressEst = Math.min(0.98, Math.max(0.38, 0.38 + rawProgress * 0.60));

          setJobStatus({
            state: "rendering",
            message: `Generating faceless film (${Math.round(progressEst * 100)}%)...`,
            progress: progressEst,
            renderId,
            bucketName,
            title: plannedTitle,
          });

        } catch (err) {
          console.warn("Poll error:", err);
        }
      }, 3500);

    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit faceless video job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white transition active:scale-90"
            >
              <ArrowLeft size={16} />
            </Link>
            <BrandLogo />
          </div>

          <div className="flex items-center gap-4">
            {billingEntitlement && (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-black text-purple-300 shadow-md">
                <Zap size={13} className="text-purple-400" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300">
              <Sparkles size={11} className="text-purple-400" />
              <span>Flagship AI Video Studio</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Faceless Video{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                Generator Studio
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Turn narration voiceovers into 1080p Full HD widescreen YouTube videos or vertical Shorts with automated B-roll, captions, and sound effects.
            </p>
          </div>
        </div>

        {/* Dynamic Stepper Overlay during Render */}
        {jobStatus.state !== "idle" && jobStatus.state !== "ready" && (
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/95 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">Faceless Video Rendering Progress</h3>
                <p className="text-xs text-zinc-400">{jobStatus.message}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-300">
                <Loader2 size={13} className="animate-spin text-purple-400" />
                <span>{Math.round((jobStatus.progress || 0) * 100)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${(jobStatus.progress || 0) * 100}%` }}
              />
            </div>

            {/* Custom Steps List */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              {FACELESS_RENDER_STEPS.map((step, idx) => {
                const stepProgress = jobStatus.progress || 0;
                const active = stepProgress >= step.threshold && stepProgress < (FACELESS_RENDER_STEPS[idx + 1]?.threshold || 1.1);
                const done = stepProgress >= (FACELESS_RENDER_STEPS[idx + 1]?.threshold || 0.98);
                const Icon = step?.icon || Sparkles;

                return (
                  <div
                    key={step.label}
                    className={`flex flex-row md:flex-col items-center md:items-start gap-3 p-3 rounded-2xl border transition-all ${
                      active
                        ? "border-purple-500 bg-purple-500/10 shadow-md"
                        : done
                        ? "border-emerald-500/20 bg-emerald-500/5 opacity-80"
                        : "border-white/5 bg-black/10 opacity-40"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        active
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                          : done
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 bg-white/5 text-zinc-500"
                      }`}
                    >
                      {done ? <CheckCircle2 size={15} /> : <Icon size={14} />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-zinc-200 leading-snug">{step.label}</p>
                      <p className="hidden md:block text-[9px] text-zinc-500 leading-normal">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {jobStatus.state === "error" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Rendering Interrupted</p>
                  <p>{jobStatus.message}</p>
                  <button
                    onClick={() => setJobStatus({ state: "idle" })}
                    className="mt-2 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-black text-white hover:bg-red-600 transition"
                  >
                    Reset Studio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ready Download Preview Stage */}
        {jobStatus.state === "ready" && jobStatus.outputFile && (
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-2xl max-w-2xl mx-auto text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Faceless Video is Ready!</h3>
              <p className="text-xs text-zinc-400">Your AI-curated video rendering has completed successfully.</p>
            </div>

            <video
              src={jobStatus.outputFile}
              controls
              className="mx-auto h-[315px] w-full max-w-xl rounded-2xl bg-black border border-white/10 shadow-lg"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <a
                href={jobStatus.outputFile}
                download={jobStatus.title ? `${jobStatus.title}.mp4` : "faceless-video.mp4"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 hover:bg-purple-500 px-6 py-3 text-xs font-black text-white shadow-lg shadow-purple-600/25 transition active:scale-95"
              >
                <Download size={14} />
                <span>Download Video MP4</span>
              </a>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setJobStatus({ state: "idle" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-zinc-300 transition active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Create New Video</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <FacelessVideoStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            subtitleStyle={subtitleStyle}
            onSubtitleStyleChange={setSubtitleStyle}
            assetSourceMode={assetSourceMode}
            onAssetSourceModeChange={setAssetSourceMode}
            uploadedImageFiles={facelessImageFiles}
            onUploadedImageFilesChange={setFacelessImageFiles}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            facelessBgmMood={facelessBgmMood}
            onBgmMoodChange={setFacelessBgmMood}
            facelessBgmVolume={facelessBgmVolume}
            onBgmVolumeChange={setFacelessBgmVolume}
            facelessPacingStyle={facelessPacingStyle}
            onPacingStyleChange={setFacelessPacingStyle}
            facelessEnableSfx={facelessEnableSfx}
            onEnableSfxChange={setFacelessEnableSfx}
            onGenerate={handleStartRender}
            isGenerating={false}
          />
        )}
      </div>
    </main>
  );
}
