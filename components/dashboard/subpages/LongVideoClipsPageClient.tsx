"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { LongVideoClipsStudio } from "@/components/dashboard/LongVideoClipsStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import { resolveSafeContentType } from "@/lib/media/presignedUpload";
import { ArrowLeft, Loader2 } from "lucide-react";

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
  status: "rendering" | "done" | "failed";
  outputFile?: string;
};

type JobStatus = {
  state: "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
  message?: string;
  progress?: number;
  clips?: ClipStatus[];
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

export default function LongVideoClipsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Clips form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [layoutMode, setLayoutMode] = useState<"auto-speaker" | "split-screen" | "fit-widescreen">("auto-speaker");
  const [clipCount, setClipCount] = useState<number>(3);
  const [clipDuration, setClipDuration] = useState<"auto" | "under-30" | "30-60" | "60-90">("30-60");
  const [clipsHookStrategy, setClipsHookStrategy] = useState<"auto" | "high-energy" | "actionable" | "story">("auto");
  const [enableClipsCaptions, setEnableClipsCaptions] = useState(true);
  const [captionStyle, setCaptionStyle] = useState<string>("glow-viral");

  // BGM, SFX & Editorial states
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
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const renderRequestInFlightRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/long-video-clips");
    }
  }, [user, authLoading, router]);

  // Load duration when selected
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(selectedFile);
    video.src = url;
    video.onloadedmetadata = () => {
      setMediaDurationSeconds(video.duration || 0);
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

  async function uploadFileViaPresign(
    file: File,
    mode: string,
    userId: string,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    const contentType = resolveSafeContentType(file);
    const presignRes = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType,
        fileSize: file.size,
        mode,
        userId,
      }),
    });
    const presign = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presign.ok || !presign.uploadUrl) {
      throw new Error(presign.error || `Could not prepare upload for ${file.name}`);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presign.uploadUrl, true);
      xhr.setRequestHeader("Content-Type", contentType);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(presign.key as string);
        } else {
          reject(new Error(`Upload failed for ${file.name} (HTTP ${xhr.status})`));
        }
      };

      xhr.onerror = () => {
        reject(new Error(`Network error during upload of ${file.name}`));
      };

      xhr.ontimeout = () => {
        reject(new Error(`Upload timed out for ${file.name}`));
      };

      xhr.send(file);
    });
  }

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/long-video-clips");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a video file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading source video securely to cloud storage (0%)...",
        progress: 0.10,
      });

      const mediaKey = await uploadFileViaPresign(
        selectedFile,
        "longVideoClips",
        user.id,
        (percent) => {
          const calculatedProgress = 0.10 + Math.round((percent / 100) * 20) / 100;
          setJobStatus({
            state: "uploading",
            message: `Uploading source video securely to cloud storage (${percent}%)...`,
            progress: calculatedProgress,
          });
        }
      );

      let customBgmKey = "";
      if (customBgmFile) {
        customBgmKey = await uploadFileViaPresign(
          customBgmFile,
          "longVideoClips",
          user.id
        );
      }

      setJobStatus({
        state: "starting",
        message: "Aligning speech recognition & face tracking parameters...",
        progress: 0.25,
      });

      const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "video/mp4",
          mediaType: "video",
          mode: "longVideoClips",
          removeAiWatermark: Boolean(removeAiWatermark),
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          layoutMode,
          clipCount,
          clipDuration,
          enableSfx,
          bgmTrackId,
          bgmVolume,
          customBgmUrl: customBgmKey || undefined,
          editorialTranscript: editorialTranscript.trim() || undefined,
          enableCaptions: enableClipsCaptions,
          captionStyle,
          clipsAspectRatio: "9:16",
          clipsHookStrategy,
          durationSeconds: mediaDurationSeconds || 300,
          sourceDurationSeconds: mediaDurationSeconds || 300,
          mediaAspect: "portrait",
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Video Clips job.");
      }

      const initialClips = jobPayload.clips;
      if (!Array.isArray(initialClips) || initialClips.length === 0) {
        throw new Error("No clips returned by video analyzer engine.");
      }

      let activeClips: ClipStatus[] = initialClips.map((c) => ({
        ...c,
        status: "rendering",
        outputFile: undefined,
      }));

      setJobStatus({
        state: "rendering",
        message: `Extracting and rendering ${activeClips.length} clips in parallel...`,
        progress: 0.40,
        clips: activeClips,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 150;
      let consecutiveErrors = 0;

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          setIsSubmitting(false);
          setJobStatus({
            state: "error",
            message: "Clips rendering timed out. Please check back shortly.",
          });
          return;
        }

        const allDoneOrFailed = activeClips.every(
          (c) => c.status === "done" || c.status === "failed"
        );
        if (allDoneOrFailed) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          setIsSubmitting(false);

          const successfulClips = activeClips.filter((c) => c.status === "done");
          if (successfulClips.length === 0) {
            setJobStatus({
              state: "error",
              message: "All clip renderings failed. Please try again.",
              clips: activeClips,
              title: plannedTitle,
            });
          } else {
            setJobStatus({
              state: "ready",
              message: `Successfully generated ${successfulClips.length} high-quality viral clips!`,
              progress: 1,
              clips: activeClips,
              outputFile: successfulClips[0].outputFile,
              title: plannedTitle,
            });

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
          }
          return;
        }

        let updated = false;

        for (const clip of activeClips) {
          if (clip.status !== "rendering") continue;

          try {
            const statusParams = new URLSearchParams({
              renderId: clip.renderId,
              bucketName: clip.bucketName,
              userId: user.id,
              mode: "longVideoClips",
              title: clip.title,
            });

            const response = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
            const status = await response.json().catch(() => ({}));

            if (!response.ok || !status.ok || status.state === "error" || (status.done && status.errors?.length)) {
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
                outputFile: status.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const map = new Map<string, RecentRender>();
                prev.forEach((item) => { if (item?.id) map.set(item.id, item); });
                map.set(clip.renderId, finishedRender);
                const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
                try {
                  localStorage.setItem("itnavideo_clips_projects", JSON.stringify(merged.slice(0, 30)));
                } catch {}
                return merged;
              });
            }
            consecutiveErrors = 0;
          } catch (error) {
            consecutiveErrors += 1;
            if (consecutiveErrors >= 10) {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              renderRequestInFlightRef.current = false;
              setIsSubmitting(false);
              setJobStatus({
                state: "error",
                message: "Lost connection to the rendering server.",
                clips: activeClips,
                title: plannedTitle,
              });
              return;
            }
          }
        }

        if (updated) {
          const completedCount = activeClips.filter((c) => c.status === "done").length;
          const failedCount = activeClips.filter((c) => c.status === "failed").length;
          const progressEst = 0.40 + (completedCount / activeClips.length) * 0.55;

          setJobStatus({
            state: "rendering",
            message: `Rendering clips: ${completedCount} ready, ${failedCount} failed, ${activeClips.length - completedCount - failedCount} remaining...`,
            progress: progressEst,
            clips: [...activeClips],
            title: plannedTitle,
          });
        }
      }, 3500);

    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setIsSubmitting(false);
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit clips extraction job.",
      });
    }
  };

  const handleCancelRender = async () => {
    setIsCancelling(true);
    try {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      renderRequestInFlightRef.current = false;
      setIsSubmitting(false);
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
        <p className="text-sm font-semibold text-slate-800">Loading Long Video to Shorts Studio...</p>
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
              <span className="text-xs font-black text-slate-900 tracking-tight">Long Video to Shorts AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-xs text-slate-800">
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

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="longVideoClips"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Extracting viral shorts...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Long Video to Shorts",
                clips: jobStatus.clips,
              }}
              title={jobStatus.title || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Long Video to Shorts"}
              fileName={selectedFile?.name}
              onRetry={() => handleStartRender()}
              onReset={() => {
                setSelectedFile(null);
                setIsSubmitting(false);
                setJobStatus({ state: "idle" });
              }}
              onCancel={() => setShowCancelModal(true)}
            />
          </div>
        ) : (
          <LongVideoClipsStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            clipCount={clipCount}
            onClipCountChange={setClipCount}
            clipDuration={clipDuration}
            onClipDurationChange={setClipDuration}
            clipsHookStrategy={clipsHookStrategy}
            onClipsHookStrategyChange={setClipsHookStrategy}
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
            enableCaptions={enableClipsCaptions}
            onEnableCaptionsChange={setEnableClipsCaptions}
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
            renderedVideoUrl={jobStatus.outputFile}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
          />
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cancel Active Extraction?
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Are you sure you want to stop this extraction process? Progress will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Continue Extraction
              </button>
              <button
                onClick={handleCancelRender}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer"
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
