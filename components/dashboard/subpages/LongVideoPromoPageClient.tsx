"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  LongVideoPromoStudio,
  type LongVideoPromoGoal,
} from "@/components/dashboard/LongVideoPromoStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import {
  ArrowLeft,
  Zap,
  Loader2,
} from "lucide-react";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";

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

export default function LongVideoPromoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(false);

  // Promo form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [promoThumbnailFile, setPromoThumbnailFile] = useState<File | null>(null);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoGoal, setPromoGoal] = useState<LongVideoPromoGoal>("watch-full-video");
  const [promoCreatorHandle, setPromoCreatorHandle] = useState("");
  const [promoCtaText, setPromoCtaText] = useState("");
  const [promoCtaStyle, setPromoCtaStyle] = useState<"youtube-red" | "emerald" | "glass" | "tiktok-yellow">("youtube-red");
  const [promoBackgroundMode, setPromoBackgroundMode] = useState<"blur" | "solid" | "white">("blur");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [thumbnailMode, setThumbnailMode] = useState<"upload" | "youtube">("upload");
  const [captionStyle, setCaptionStyle] = useState<string>("Pop Word");
  const [bgmTrackId, setBgmTrackId] = useState<string>("parasail");
  const [bgmVolume, setBgmVolume] = useState<number>(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [editorialTranscript, setEditorialTranscript] = useState<string>("");

  // Media metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  const renderRequestInFlightRef = useRef(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/long-video-promo");
    }
  }, [user, authLoading, router]);

  // Read media duration when user drops a file
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      return;
    }
    const video = document.createElement("video");
    video.preload = "metadata";
    const objectUrl = URL.createObjectURL(selectedFile);
    video.src = objectUrl;
    video.onloadedmetadata = () => {
      setMediaDurationSeconds(Math.round(video.duration || 0));
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  // Fetch billing entitlement
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
            active: Boolean(ent.active),
            planId: ent.planId || "paid",
            planName: ent.planName || "Creator",
            monthlyVideoLimit: limit,
            expiresAt: ent.expiresAt,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/long-video-promo");
      return;
    }
    if (!selectedFile) {
      alert("Please upload your video teaser first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setJobStatus({
        state: "uploading",
        message: "Uploading video securely for AI analysis...",
        progress: 0.10,
      });

      // 1. Upload main video
      const mediaKey = await uploadFileViaPresign(selectedFile, "longVideoPromo", user.id);

      // 2. Upload thumbnail file (if provided)
      let promoThumbnailKey: string | undefined = undefined;
      if (promoThumbnailFile && thumbnailMode === "upload") {
        setJobStatus({
          state: "uploading",
          message: "Uploading video thumbnail image...",
          progress: 0.25,
        });
        promoThumbnailKey = await uploadFileViaPresign(promoThumbnailFile, "longVideoPromo", user.id);
      }

      let customBgmKey: string | undefined = undefined;
      if (customBgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading custom background audio...",
          progress: 0.30,
        });
        customBgmKey = await uploadFileViaPresign(customBgmFile, "longVideoPromo", user.id);
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
          removeAiWatermark: Boolean(removeAiWatermark),
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
          youtubeUrl: youtubeUrl.trim() || undefined,
          captionStyle,
          bgmTrackId,
          bgmVolume,
          customBgmUrl: customBgmKey || undefined,
          enableSfx,
          editorialTranscript: editorialTranscript.trim() || undefined,
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
          setIsSubmitting(false);
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
            setIsSubmitting(false);
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
            setIsSubmitting(false);
            const errorMsg = renderErrors[0]?.message || statusPayload.error || "Render job failed.";
            setJobStatus({
              state: "error",
              message: errorMsg,
            });
            return;
          }

          const isRenderComplete =
            (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) &&
            Boolean(statusPayload.outputFile);

          if (isRenderComplete) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);

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
                  setBillingEntitlement((curr) =>
                    curr
                      ? {
                          ...curr,
                          usage: payload.usage
                            ? {
                                used: payload.usage.used,
                                limit: payload.usage.limit,
                                remaining: payload.usage.remaining,
                              }
                            : curr.usage,
                        }
                      : null
                  );
                }
              })
              .catch(() => {});

            return;
          }

          const rawProgress =
            typeof statusPayload.progress === "number" ? statusPayload.progress : attempts / MAX_ATTEMPTS;
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
      setIsSubmitting(false);
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit promo job.",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPromoThumbnailFile(null);
    setIsSubmitting(false);
    setJobStatus({ state: "idle" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-sm font-semibold text-slate-800">Loading Long Video Promo Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar - Unified Full Bleed Canvas */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-2xs shrink-0">
        <div className="w-full px-4 sm:px-8 lg:px-12 min-h-14 sm:min-h-16 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Modern Back Button */}
            <Link
              href="/dashboard"
              className="group flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Back to Studios"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <BrandLogo size="sm" showBadge={false} variant="light" />

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Clean Studio Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Studios</span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-xs font-black text-slate-900 tracking-tight">Long Video Promo</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-2xs text-slate-800">
              <Zap size={14} className="text-orange-600 fill-orange-600" />
              <span className="text-slate-500 hidden xs:inline">Balance:</span>
              <span className="text-slate-900 font-black">
                {billingEntitlement?.usage?.remaining !== undefined
                  ? `${billingEntitlement.usage.remaining} Cr`
                  : "10 Cr"}
              </span>
              <Link
                href="/pricing"
                className="ml-0.5 text-[11px] text-orange-600 hover:text-orange-500 underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="longVideoPromo"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Composing 9:16 vertical promo reel...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || promoTitle || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Promo Video Reel",
              }}
              title={jobStatus.title || promoTitle || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Promo Video Reel"}
              fileName={selectedFile?.name}
              onRetry={handleStartRender}
              onReset={handleReset}
            />
          </div>
        ) : (
          <LongVideoPromoStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            promoThumbnailFile={promoThumbnailFile}
            onPromoThumbnailFileChange={setPromoThumbnailFile}
            youtubeUrl={youtubeUrl}
            onYoutubeUrlChange={setYoutubeUrl}
            thumbnailMode={thumbnailMode}
            onThumbnailModeChange={setThumbnailMode}
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
            captionStyle={captionStyle}
            onCaptionStyleChange={setCaptionStyle}
            bgmTrackId={bgmTrackId}
            onBgmTrackIdChange={setBgmTrackId}
            bgmVolume={bgmVolume}
            onBgmVolumeChange={setBgmVolume}
            customBgmFile={customBgmFile}
            onCustomBgmFileSelect={setCustomBgmFile}
            enableSfx={enableSfx}
            onEnableSfxChange={setEnableSfx}
            editorialTranscript={editorialTranscript}
            onEditorialTranscriptChange={setEditorialTranscript}
            onGenerate={handleStartRender}
            isGenerating={isSubmitting || jobStatus.state !== "idle"}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
          />
        )}
      </main>
    </div>
  );
}
