import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { CompareExplainerStudio } from "@/components/dashboard/CompareExplainerStudio";
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
  Columns,
  Upload,
  Clapperboard,
  History,
  Swords,
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
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

export default function CompareExplainerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

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

  // Poll for render progress if rendering
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (jobStatus.state === "rendering" && jobStatus.renderId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/reels/jobs/status?renderId=${jobStatus.renderId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.status === "completed" || data.status === "ready") {
            setJobStatus((prev) => ({
              ...prev,
              state: "ready",
              progress: 1,
              outputFile: data.outputFile || data.url,
              message: "Render complete! Your Compare Explainer is ready to download.",
            }));
          } else if (data.status === "failed" || data.status === "error") {
            setJobStatus((prev) => ({
              ...prev,
              state: "error",
              message: data.error || "Render encountered an error. Please try again.",
            }));
          } else if (data.progress !== undefined) {
            setJobStatus((prev) => ({
              ...prev,
              progress: Math.max(0.4, data.progress),
              message: data.stageMessage || "Composing versus animation on AWS Lambda...",
            }));
          }
        } catch {}
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobStatus.state, jobStatus.renderId]);

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/compare-explainer");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if (comparisonFiles.length !== 2) {
      alert("Please upload exactly two split-screen compare images.");
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
        message: "Uploading speech voiceover and compare images to secure cloud container...",
        progress: 0.08,
      });

      // 1. Upload main audio voiceover
      const mediaKey = await uploadFileViaPresign(selectedFile, {
        prefix: "compare/audio",
      });

      // 2. Upload comparison images
      setJobStatus({
        state: "uploading",
        message: "Uploading left and right comparison images...",
        progress: 0.18,
      });

      const comparisonUploads = await Promise.all(
        comparisonFiles.map((file) =>
          uploadFileViaPresign(file, { prefix: "compare/images" })
        )
      );

      // 3. Upload Custom BGM if provided
      let customBgmUrl: string | undefined = undefined;
      if (customBgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading custom background audio track...",
          progress: 0.28,
        });
        const bgmUpload = await uploadFileViaPresign(customBgmFile, {
          prefix: "compare/bgm",
        });
        customBgmUrl = bgmUpload.url;
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
          mediaKey: mediaKey.url,
          sourceAudioUrl: mediaKey.url,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "compare",
          removeAiWatermark: Boolean(removeAiWatermark),
          templateName: "comparisonImages",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          comparisonImageKeys: comparisonUploads.map((u) => u.url),
          comparisonImageUrls: comparisonUploads.map((u) => u.url),
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

      // 5. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Rendering 9:16 Compare Explainer on AWS Lambda...",
        progress: 0.45,
        renderId,
        bucketName,
        title: plannedTitle,
      });
    } catch (err: any) {
      setJobStatus({
        state: "error",
        message: err.message || "Failed to process video render. Please retry.",
      });
    } finally {
      renderRequestInFlightRef.current = false;
      setIsSubmitting(false);
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
    } catch {}
    setJobStatus({ state: "idle" });
    setIsCancelling(false);
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header: Clean White */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <BrandLogo variant="light" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Compare Explainer
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200">
                Side-by-Side Versus
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {billingEntitlement && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-semibold text-slate-700">
                  {billingEntitlement.planName || "Creator"} Plan
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-slate-500">
                  {billingEntitlement.usage?.remaining ?? 10} Credits Left
                </span>
              </div>
            )}
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              Studio Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {jobStatus.state !== "idle" && jobStatus.state !== "error" ? (
          <div className="max-w-2xl mx-auto py-12">
            <InteractiveRenderEngine
              mode="compare"
              status={jobStatus.state}
              progress={jobStatus.progress || 0}
              message={jobStatus.message}
              outputUrl={jobStatus.outputFile}
              onCancel={() => setShowCancelModal(true)}
              onReset={() => setJobStatus({ state: "idle" })}
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
