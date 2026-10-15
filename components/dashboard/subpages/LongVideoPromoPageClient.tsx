"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { LongVideoPromoStudio } from "@/components/dashboard/LongVideoPromoStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
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
  History,
  Image as ImageIcon
} from "lucide-react";
import CinematicRenderProgress from "@/components/dashboard/CinematicRenderProgress";


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

const PROMO_RENDER_STEPS = [
  { label: "Media & video source preparation", detail: "Loading uploaded teaser clip and preparing 9:16 vertical canvas.", threshold: 0.20, icon: Upload },
  { label: "Teaser hook extraction & pacing", detail: "Analyzing video timeline and preparing high-retention payoff moments.", threshold: 0.45, icon: Sparkles },
  { label: "Composing 9:16 vertical layout", detail: "Integrating 3D thumbnail card, dynamic CTA button & video player.", threshold: 0.70, icon: Film },
  { label: "Rendering 1080p promo MP4", detail: "Exporting 30 FPS Full HD promo video ready for Shorts, Reels & TikTok.", threshold: 0.95, icon: Clapperboard },
];

export type LongVideoPromoGoal = "watch-full-video" | "subscribers" | "promote-episode";

export default function LongVideoPromoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Promo form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [promoThumbnailFile, setPromoThumbnailFile] = useState<File | null>(null);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoGoal, setPromoGoal] = useState<LongVideoPromoGoal>("watch-full-video");
  const [promoCreatorHandle, setPromoCreatorHandle] = useState("");
  const [promoCtaText, setPromoCtaText] = useState("");
  const [promoCtaStyle, setPromoCtaStyle] = useState<"youtube-red" | "emerald" | "glass" | "tiktok-yellow">("youtube-red");
  const [promoBackgroundMode, setPromoBackgroundMode] = useState<"blur" | "solid">("blur");

  // Media metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Timer for elapsed seconds
  useEffect(() => {
    if (jobStatus.state !== "rendering" && jobStatus.state !== "uploading") {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state]);


  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/long-video-promo");
    }
  }, [user, authLoading, router]);

  // Load duration when clip selected
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(selectedFile);
    video.src = url;
    video.onloadedmetadata = () => {
      const rawDur = video.duration || 0;
      // Strictly clamp to max 90s per Rule 4.1 & user instructions
      const clamped = Math.min(90, Math.max(5, Math.round(rawDur)));
      setMediaDurationSeconds(clamped);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Billing entitlement fetch
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(user?.email || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining ?? (limit - used))));
          setBillingEntitlement({
            active: Boolean(ent.active),
            planId: ent.planId || "paid",
            planName: ent.planName || "Creator",
            monthlyVideoLimit: limit,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // Past Renders history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_promo_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentRenders(parsed);
        }
      }
    } catch {}

    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          const promoRenders = payload.renders.filter(
            (r: RecentRender) => r.mode === "longVideoPromo" || r.mode === "LONG_VIDEO_PROMO"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            promoRenders.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
            try {
              localStorage.setItem("itnavideo_promo_projects", JSON.stringify(merged.slice(0, 30)));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);



  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/long-video-promo");
      return;
    }
    if (!selectedFile) {
      alert("Please upload your video first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading video securely for AI analysis...",
        progress: 0.10,
      });

      // 1. Upload main video
      const mediaKey = await uploadFileViaPresign(selectedFile, "longVideoPromo", user.id);

      // 2. Upload thumbnail file (if provided)
      let promoThumbnailKey: string | undefined = undefined;
      if (promoThumbnailFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading YouTube video thumbnail image...",
          progress: 0.25,
        });
        promoThumbnailKey = await uploadFileViaPresign(promoThumbnailFile, "longVideoPromo", user.id);
      }

      // 3. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Composing 9:16 vertical promo layout...",
        progress: 0.35,
      });

      const plannedTitle = promoTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");
      const effectiveDuration = Math.min(90, Math.max(5, mediaDurationSeconds || 30));
      const totalFrames = Math.min(2700, Math.round(effectiveDuration * 30));

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "video/mp4",
          mediaType: "video",
          mode: "longVideoPromo",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          thumbnailKey: promoThumbnailKey,
          promoThumbnailKey,
          promoTitle: plannedTitle,
          promoGoal,
          promoCtaText: promoCtaText.trim(),
          creatorHandle: promoCreatorHandle.trim() || "@itnavideo",
          promoCtaStyle,
          promoBackgroundMode,
          aspectRatio: "9:16",
          durationSeconds: effectiveDuration,
          sourceDurationSeconds: effectiveDuration,
          mediaAspect: "portrait",
          frameRange: [0, totalFrames - 1],
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Promo render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 4. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Generating vertical promo layout...",
        progress: 0.45,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 150;

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Promo rendering timed out. Please check your history in a few minutes.",
          });
          return;
        }

        try {
          const statusParams = new URLSearchParams({
            renderId,
            bucketName,
            userId: user.id,
            mode: "longVideoPromo",
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
              mode: "longVideoPromo",
              outputFile: statusPayload.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + 48 * 60 * 60 * 1000,
            };

            setRecentRenders((prev) => {
              const updated = [finishedRender, ...prev.filter((r) => r.id !== renderId)];
              localStorage.setItem("itnavideo_promo_projects", JSON.stringify(updated.slice(0, 30)));
              return updated;
            });

            setJobStatus({
              state: "ready",
              message: "Promo Video Reel is rendered and ready!",
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
          const progressEst = Math.min(0.98, Math.max(0.45, 0.45 + rawProgress * 0.53));

          setJobStatus({
            state: "rendering",
            message: `Compiling video overlays and layers (${Math.round(progressEst * 100)}%)...`,
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
        message: err?.message || "Failed to submit promo job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0D13] text-white">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D13]/80 backdrop-blur-md">
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
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-black text-orange-400 shadow-md shadow-orange-500/5">
                <Zap size={13} className="fill-orange-400" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* Dynamic Stepper Overlay during Render - Zero Blue Cinematic Render Screen */}
        {jobStatus.state !== "idle" && jobStatus.state !== "ready" && (
          <CinematicRenderProgress
            title="Promo Video Reel"
            subtitle="Composing 9:16 vertical layout, 3D teaser card, and high-conversion callout overlays."
            modeLabel="9:16 Promo Video Studio"
            progress={jobStatus.progress}
            isIndeterminate={jobStatus.progress === undefined}
            statusMessage={jobStatus.message}
            elapsedSeconds={elapsedSeconds}
            steps={PROMO_RENDER_STEPS}
            isError={jobStatus.state === "error"}
            errorMessage={jobStatus.message}
            onRetry={() => handleStartRender()}
            onReset={() => setJobStatus({ state: "idle" })}
            showTipsCarousel={true}
          />
        )}

        {/* Ready Download Preview Stage */}
        {jobStatus.state === "ready" && jobStatus.outputFile && (
          <div className="rounded-[28px] border border-white/10 bg-[#0B0D13] p-6 shadow-xl max-w-2xl mx-auto text-center space-y-6">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Promo Video Reel is Ready!</h3>
              <p className="text-xs text-zinc-400">Your visual overlays and layout render completed successfully.</p>
            </div>

            <video
              src={jobStatus.outputFile}
              controls
              className="mx-auto h-[480px] w-auto rounded-2xl bg-black border border-white/10 shadow-lg"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <a
                href={jobStatus.outputFile}
                download={jobStatus.title ? `${jobStatus.title}.mp4` : "promo-reel.mp4"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 transition hover:brightness-110 active:scale-95"
              >
                <Download size={14} />
                <span>Download Promo Video</span>
              </a>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPromoThumbnailFile(null);
                  setJobStatus({ state: "idle" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-zinc-300 transition active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Create New Promo</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <>
            {activeTab === "studio" && (
              <LongVideoPromoStudio
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                promoThumbnailFile={promoThumbnailFile}
                onPromoThumbnailFileChange={setPromoThumbnailFile}
                promoTitle={promoTitle}
                onPromoTitleChange={setPromoTitle}
                promoGoal={promoGoal}
                onPromoGoalChange={setPromoGoal}
                promoCtaText={promoCtaText}
                onPromoCtaTextChange={setPromoCtaText}
                promoCreatorHandle={promoCreatorHandle}
                onPromoCreatorHandleChange={setPromoCreatorHandle}
                promoCtaStyle={promoCtaStyle}
                onPromoCtaStyleChange={setPromoCtaStyle}
                promoBackgroundMode={promoBackgroundMode}
                onPromoBackgroundModeChange={setPromoBackgroundMode}
                onGenerate={handleStartRender}
                isGenerating={false}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
