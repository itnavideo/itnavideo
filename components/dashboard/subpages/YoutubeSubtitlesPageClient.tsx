"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { YoutubeSubtitlesStudio } from "@/components/dashboard/YoutubeSubtitlesStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
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
};

type RecentRender = {
  id: string;
  title: string;
  mode: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

export default function YoutubeSubtitlesPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Studio configuration states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [captionStyle, setCaptionStyle] = useState<string>("glow-viral");
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [youtubeSubtitleSafeZone, setYoutubeSubtitleSafeZone] = useState<"standard" | "scrubber" | "high">("scrubber");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("natural");

  // BGM states
  const [selectedBgmTrackId, setSelectedBgmTrackId] = useState<string>("none");
  const [selectedBgmUrl, setSelectedBgmUrl] = useState<string>("");
  const [bgmVolume, setBgmVolume] = useState<number>(0);

  // Job, billing and render history
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Transcription states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState<string>("");
  const [previewCaptions, setPreviewCaptions] = useState<Array<{ start: number; end: number; text: string }> | null>(null);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const renderRequestInFlightRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
    }
  }, [user, authLoading, router]);

  // 2. Fetch billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(user?.email || "")}`
        );
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
        console.warn("Could not load billing status:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // 3. Auto-transcribe media on file selection
  useEffect(() => {
    if (!selectedFile) {
      setEditedTranscript("");
      setPreviewCaptions(null);
      return;
    }

    async function autoTranscribe() {
      if (!selectedFile) return;
      setIsTranscribing(true);
      try {
        const contentType = selectedFile.type || "video/mp4";
        const presignRes = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType,
            fileSize: selectedFile.size,
            mode: "youtubeSubtitleGenerator",
            removeAiWatermark: Boolean(removeAiWatermark),
            userId: user?.id || "guest_user",
          }),
        });
        const presign = await presignRes.json().catch(() => ({}));
        if (!presignRes.ok || !presign.ok || !presign.uploadUrl) {
          throw new Error(presign.error || "Could not prepare upload for transcription.");
        }

        await fetch(presign.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: selectedFile,
        });

        const transcribeRes = await fetch("/api/reels/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaKey: presign.key,
            fileName: selectedFile.name,
          }),
        });
        const transcribeData = await transcribeRes.json().catch(() => ({}));
        if (transcribeRes.ok && transcribeData.ok) {
          if (transcribeData.transcript) {
            setEditedTranscript(transcribeData.transcript);
          }
          if (transcribeData.segments) {
            setPreviewCaptions(transcribeData.segments);
          }
        }
      } catch (err: any) {
        console.warn("Auto transcribe notice:", err?.message);
      } finally {
        setIsTranscribing(false);
      }
    }

    autoTranscribe();
  }, [selectedFile, user?.id, removeAiWatermark]);

  // Start Render Handler
  const handleStartRender = async (overridePayload?: any) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/youtube-subtitles");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a 16:9 video file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading 16:9 widescreen video to cloud storage...",
        progress: 0.1,
      });

      const mediaKey = await uploadFileViaPresign(selectedFile, "youtubeSubtitleGenerator", user.id);
      const plannedTitle = topicTitle || selectedFile.name.replace(/\.[^/.]+$/, "");
      const isAudio = selectedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || (isAudio ? "audio/mpeg" : "video/mp4"),
          mediaType: isAudio ? "audio" : "video",
          mode: "youtubeSubtitleGenerator",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          captionStyle: overridePayload?.captionStyle || captionStyle,
          captionPosition: overridePayload?.captionPosition || captionPosition,
          captionFontSize: overridePayload?.captionFontSize || captionFontSize,
          youtubeSubtitleSafeZone: overridePayload?.youtubeSubtitleSafeZone || youtubeSubtitleSafeZone,
          youtubeSubtitleCase: overridePayload?.youtubeSubtitleCase || youtubeSubtitleCase,
          removeAiWatermark: Boolean(removeAiWatermark),
          bgmUrl: selectedBgmUrl || undefined,
          bgmVolume: overridePayload?.bgmVolume ?? bgmVolume,
          aspectRatio: "16:9",
          mediaAspect: "landscape",
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start YouTube Subtitle render job.");
      }

      const jobId = jobPayload.jobId;
      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "Burning 16:9 broadcast subtitles into 1080p Full HD video...",
        progress: 0.35,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 600;

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Please check your Projects shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId)}&renderId=${encodeURIComponent(
              renderId
            )}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(
              user.id
            )}&title=${encodeURIComponent(plannedTitle)}&mode=youtubeSubtitleGenerator`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress =
              typeof statusPayload.progress === "number" ? statusPayload.progress : 0.45;

            const isRenderComplete =
              (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) &&
              Boolean(statusPayload.outputFile);

            if (isRenderComplete) {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              renderRequestInFlightRef.current = false;

              setJobStatus({
                state: "ready",
                message: "16:9 Widescreen video with burnt-in broadcast captions ready!",
                progress: 1,
                outputFile: statusPayload.outputFile,
                renderId,
                bucketName,
                title: plannedTitle,
              });

              fetch("/api/reels/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  renderId,
                  bucketName,
                  mode: "youtubeSubtitleGenerator",
                  title: plannedTitle,
                  outputFile: statusPayload.outputFile,
                  createdAt: new Date().toISOString(),
                  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                }),
              }).catch((e) => console.warn("Could not save history:", e));
            } else if (serverState === "error") {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              renderRequestInFlightRef.current = false;
              setJobStatus({
                state: "error",
                message: statusPayload.message || "YouTube Subtitle render failed.",
              });
            } else {
              setJobStatus((prev) => ({
                ...prev,
                state: "rendering",
                message: statusPayload.message || "Remotion is rendering 1080p subtitle frames...",
                progress: Math.max(prev.progress || 0.35, currentProgress),
              }));
            }
          }
        } catch (pollErr) {
          console.warn("[YoutubeSubtitles] Polling error:", pollErr);
        }
      }, 3000);
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit YouTube Subtitle job.",
      });
    }
  };

  const handleCancelRender = async () => {
    if (!jobStatus.renderId) return;
    setIsCancelling(true);
    try {
      await fetch("/api/reels/jobs/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renderId: jobStatus.renderId,
          bucketName: jobStatus.bucketName,
          userId: user?.id,
          mode: "youtubeSubtitleGenerator",
        }),
      });

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      renderRequestInFlightRef.current = false;
      setJobStatus({ state: "idle" });
    } catch {
      setJobStatus({ state: "idle" });
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading YouTube Subtitles Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar (Clean White Surface - Full Bleed, matching Image to Video AI) */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs shrink-0">
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
              <span className="text-xs font-black text-slate-900 tracking-tight">YouTube Subtitles AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Free daily allowance badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold shadow-xs text-emerald-800">
              <span className="font-black">FREE • 5 Daily Videos (0 Cr)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="youtubeSubtitleGenerator"
              status={{
                state: jobStatus.state === "uploading" ? "uploading" : jobStatus.state === "starting" ? "starting" : jobStatus.state === "rendering" ? "rendering" : jobStatus.state === "ready" ? "ready" : "error",
                message: jobStatus.message || "Burning 16:9 broadcast subtitles...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || topicTitle || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "YouTube Subtitled Video",
              }}
              title={jobStatus.title || topicTitle || (selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "") || "YouTube Subtitled Video"}
              fileName={selectedFile?.name}
              onRetry={() => handleStartRender()}
              onReset={() => {
                setSelectedFile(null);
                setJobStatus({ state: "idle" });
              }}
              onCancel={() => setShowCancelModal(true)}
            />
          </div>
        ) : (
          <YoutubeSubtitlesStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            captionStyle={captionStyle}
            onCaptionStyleChange={setCaptionStyle}
            captionPosition={captionPosition}
            onCaptionPositionChange={setCaptionPosition}
            captionFontSize={captionFontSize}
            onCaptionFontSizeChange={setCaptionFontSize}
            youtubeSubtitleSafeZone={youtubeSubtitleSafeZone}
            onYoutubeSubtitleSafeZoneChange={setYoutubeSubtitleSafeZone}
            youtubeSubtitleCase={youtubeSubtitleCase}
            onYoutubeSubtitleCaseChange={setYoutubeSubtitleCase}
            selectedBgmTrackId={selectedBgmTrackId}
            onBgmTrackSelect={(trackId, url) => {
              setSelectedBgmTrackId(trackId);
              setSelectedBgmUrl(url);
            }}
            bgmVolume={bgmVolume}
            onBgmVolumeChange={setBgmVolume}
            onGenerate={handleStartRender}
            isGenerating={false}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
            editedTranscript={editedTranscript}
            onEditedTranscriptChange={setEditedTranscript}
            previewCaptions={previewCaptions}
            isTranscribing={isTranscribing}
          />
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Cancel Subtitle Generation?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to stop this rendering process? Progress will be lost.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Keep Rendering
              </button>
              <button
                type="button"
                onClick={handleCancelRender}
                disabled={isCancelling}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-xs"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
