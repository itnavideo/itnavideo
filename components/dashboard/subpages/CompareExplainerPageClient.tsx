"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { CompareExplainerStudio } from "@/components/dashboard/CompareExplainerStudio";
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

export default function CompareExplainerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Compare Studio form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparisonFiles, setComparisonFiles] = useState<File[]>([]);
  const [compareLeftTitle, setCompareLeftTitle] = useState("Option A");
  const [compareRightTitle, setCompareRightTitle] = useState("Option B");
  const [topicTitle, setTopicTitle] = useState("HEAD TO HEAD COMPARISON");
  const [compareHandle, setCompareHandle] = useState("@itnavideo");
  const [compareTheme, setCompareTheme] = useState("white");
  const [compareTone, setCompareTone] = useState("versus");
  const [compareWinner, setCompareWinner] = useState("none");
  const [stickerStyle, setStickerStyle] = useState("3d-presenter-man");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [editorialTranscript, setEditorialTranscript] = useState(
    "In this breakdown, we compare both options side by side so you can pick the clear winner."
  );

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const renderRequestInFlightRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/compare-explainer");
    }
  }, [user, authLoading, router]);

  // Fetch billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(
            user?.email || ""
          )}`
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
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // Start Render Job
  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/compare-explainer");
      return;
    }
    if (!selectedFile) {
      alert("Please upload your comparison voiceover audio first.");
      return;
    }
    if (comparisonFiles.length < 2) {
      alert("Please upload both left and right comparison images.");
      return;
    }

    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading speech voiceover and compare images to cloud storage...",
        progress: 0.1,
      });

      // 1. Upload audio voiceover
      const mediaKeyUpload = await uploadFileViaPresign(selectedFile, "compare", user.id);
      const mediaKey = mediaKeyUpload.url || mediaKeyUpload.key || String(mediaKeyUpload);

      // 2. Upload comparison images
      setJobStatus({
        state: "uploading",
        message: "Uploading left and right comparison images...",
        progress: 0.2,
      });

      const comparisonUploads = await Promise.all(
        comparisonFiles.map((file) => uploadFileViaPresign(file, "compare", user.id))
      );
      const comparisonUrls = comparisonUploads.map((u) => u.url || u.key || String(u));

      // 3. Upload Custom BGM if provided
      let customBgmUrl: string | undefined = undefined;
      if (customBgmFile) {
        const bgmUpload = await uploadFileViaPresign(customBgmFile, "compare", user.id);
        customBgmUrl = bgmUpload.url || bgmUpload.key || String(bgmUpload);
      }

      // 4. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Assembling comparison timelines and Groq Whisper alignment...",
        progress: 0.35,
      });

      const plannedTitle = topicTitle.trim() || `${compareLeftTitle || "Left"} vs ${compareRightTitle || "Right"}`;

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          sourceAudioUrl: mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "compare",
          removeAiWatermark: Boolean(removeAiWatermark),
          templateName: "comparisonImages",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          comparisonImageKeys: comparisonUrls,
          comparisonImageUrls: comparisonUrls,
          compareLeftTitle: compareLeftTitle.trim(),
          compareRightTitle: compareRightTitle.trim(),
          compareTheme,
          compareTone,
          compareWinner,
          creatorHandle: compareHandle.trim() || "@itnavideo",
          stickerStyle,
          aspectRatio: "9:16",
          mediaAspect: "portrait",
          bgmTrackId,
          bgmVolume,
          customBgmUrl,
          enableSfx,
          editorialTranscript,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Compare Explainer render job.");
      }

      const renderId = jobPayload.renderId || jobPayload.jobId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "Rendering 9:16 Compare Explainer shorts on AWS Lambda...",
        progress: 0.45,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      // Poll status
      let attempts = 0;
      const MAX_ATTEMPTS = 600;

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          setIsSubmitting(false);
          setJobStatus({
            state: "error",
            message: "Render took longer than expected. Please check your Projects shortly.",
          });
          return;
        }

        try {
          const res = await fetch(`/api/reels/jobs/status?renderId=${encodeURIComponent(renderId)}`);
          if (!res.ok) return;
          const data = await res.json();
          const isDone = Boolean(data.done || data.state === "ready" || data.state === "completed" || data.outputFile);
          const isFailed = Boolean(data.state === "error" || data.state === "failed");

          if (isDone && data.outputFile) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);

            setJobStatus({
              state: "ready",
              progress: 1,
              outputFile: data.outputFile,
              title: plannedTitle,
              message: "Your 9:16 Compare Explainer video is ready to download!",
            });
          } else if (isFailed) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);

            setJobStatus({
              state: "error",
              message: data.error || "Render encountered an error. Please retry.",
            });
          } else if (data.progress !== undefined) {
            setJobStatus((prev) => ({
              ...prev,
              progress: Math.max(0.45, Number(data.progress)),
              message: data.stageMessage || "Assembling dual-subject split screen frames...",
            }));
          }
        } catch { }
      }, 3000);
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setIsSubmitting(false);
      setJobStatus({
        state: "error",
        message: err.message || "Failed to process video render. Please retry.",
      });
    }
  };

  const handleCancelRender = async () => {
    setIsCancelling(true);
    try {
      if (jobStatus.renderId) {
        await fetch(`/api/reels/jobs/cancel?renderId=${jobStatus.renderId}`, {
          method: "POST",
        });
      }
    } catch { }
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    renderRequestInFlightRef.current = false;
    setIsSubmitting(false);
    setJobStatus({ state: "idle" });
    setIsCancelling(false);
    setShowCancelModal(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading Compare Explainer Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar (Clean White Surface - Full Bleed, matching Image to Video AI) */}
      <StudioHeader
        studioName="Compare Explainer"
        aspectRatioLabel="9:16 Shorts"
        badgeLabel="VS Breakdown"
        userRemainingCredits={billingEntitlement?.usage?.remaining ?? userRemainingCredits}
        isWorking={Boolean(isWorking || (typeof jobStatus !== 'undefined' && jobStatus.state !== 'idle'))}
      />

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="compare"
              status={{
                state: jobStatus.state === "uploading" ? "uploading" : jobStatus.state === "starting" ? "starting" : jobStatus.state === "rendering" ? "rendering" : jobStatus.state === "ready" ? "ready" : "error",
                message: jobStatus.message || "Generating 9:16 Compare Explainer video...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || topicTitle || "Compare Explainer Video",
              }}
              title={jobStatus.title || topicTitle || "Compare Explainer Video"}
              fileName={selectedFile?.name}
              onRetry={() => handleStartRender()}
              onReset={() => {
                setSelectedFile(null);
                setComparisonFiles([]);
                setJobStatus({ state: "idle" });
              }}
              onCancel={() => setShowCancelModal(true)}
            />
          </div>
        ) : (
          <CompareExplainerStudio
            comparisonFiles={comparisonFiles}
            onComparisonFilesChange={setComparisonFiles}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            compareLeftTitle={compareLeftTitle}
            onLeftTitleChange={setCompareLeftTitle}
            compareRightTitle={compareRightTitle}
            onRightTitleChange={setCompareRightTitle}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            compareHandle={compareHandle}
            onHandleChange={setCompareHandle}
            compareTheme={compareTheme}
            onThemeChange={setCompareTheme}
            compareTone={compareTone}
            onToneChange={setCompareTone}
            compareWinner={compareWinner}
            onWinnerChange={setCompareWinner}
            stickerStyle={stickerStyle}
            onStickerStyleChange={setStickerStyle}
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
            isGenerating={isSubmitting || (jobStatus.state !== "idle" && jobStatus.state !== "ready")}
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
              Cancel Active Render?
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Are you sure you want to stop this rendering process? Progress will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Continue Rendering
              </button>
              <button
                onClick={handleCancelRender}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition"
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
