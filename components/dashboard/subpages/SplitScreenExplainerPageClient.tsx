"use client";

import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  SplitScreenExplainerStudio,
  type VisualUploadItem,
  AWS_SPLIT_BGM_TRACKS,
} from "@/components/dashboard/SplitScreenExplainerStudio";
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
  Layers,
  Tv,
  X,
  Play,
  HelpCircle,
  Clock,
  Split,
} from "lucide-react";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";

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

const SPLIT_SCREEN_RENDER_STEPS = [
  { label: "Creator Video & Visuals Ingest", detail: "Uploading talking-head video and explanation slides", threshold: 0.15, icon: Upload },
  { label: "Groq Speech Transcription & Alignment", detail: "Millisecond-level word timing and editorial typo sync", threshold: 0.40, icon: Sparkles },
  { label: "50/50 Dual Layout & SFX Placement", detail: "Top explanation motion, flame divider, and audio ducking", threshold: 0.70, icon: Layers },
  { label: "1080p Cloud Composition & Mastering", detail: "AWS Lambda 30 FPS vertical MP4 cloud rendering", threshold: 0.95, icon: Film },
];

type JobStatus = {
  state: "idle" | "uploading" | "planning" | "rendering" | "ready" | "error" | "cancelled";
  message?: string;
  progress?: number;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  startedAt?: number;
  stageName?: string;
};

type RecentRender = {
  id: string;
  title: string;
  mode: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

export default function SplitScreenExplainerPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(false);

  // Studio configuration states
  const [creatorVideoFile, setCreatorVideoFile] = useState<File | null>(null);
  const [explanationItems, setExplanationItems] = useState<VisualUploadItem[]>([]);
  const [topicTitle, setTopicTitle] = useState("ATOMIC HABITS: The 1% Rule");
  const [subtitleStyle, setSubtitleStyle] = useState("glow-viral");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [editorialTranscript, setEditorialTranscript] = useState(
    "If you get one percent better each day for one year, you will end up thirty-seven times better by the time you're done."
  );

  // Job, billing and render history
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Time tracker for accurate ETA
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load entitlement on mount
  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.entitlement) {
          setBillingEntitlement(data.entitlement);
        }
      })
      .catch(() => {});
  }, []);

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
              message: "Render complete! Your 50/50 explainer is ready to download.",
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
              progress: Math.max(0.5, data.progress),
              message: data.stageMessage || "Composing dual 50/50 video on AWS Lambda...",
            }));
          }
        } catch {}
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobStatus.state, jobStatus.renderId]);

  // Elapsed timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (jobStatus.state === "uploading" || jobStatus.state === "planning" || jobStatus.state === "rendering") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [jobStatus.state]);

  // Handle adding visual files
  const handleAddExplanationFiles = (files: File[]) => {
    const newItems: VisualUploadItem[] = files.map((file, idx) => ({
      id: `visual-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    }));
    setExplanationItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveExplanationItem = (id: string) => {
    setExplanationItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Main generation handler
  const handleGenerate = async () => {
    if (!creatorVideoFile || explanationItems.length === 0) return;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading creator video and explanation visuals to secure cloud storage...",
        progress: 0.05,
        startedAt: Date.now(),
      });

      // 1. Upload Creator Video
      const creatorUpload = await uploadFileViaPresign(creatorVideoFile, {
        prefix: "split-screen/creator",
      });
      if (!creatorUpload?.url) {
        throw new Error("Failed to upload creator talking-head video. Please check connection.");
      }

      setJobStatus({
        state: "uploading",
        message: "Uploading explanation visuals (images & video clips)...",
        progress: 0.15,
        startedAt: Date.now(),
      });

      // 2. Upload Explanation Visuals in parallel
      const visualUploadPromises = explanationItems.map(async (item) => {
        const res = await uploadFileViaPresign(item.file, {
          prefix: "split-screen/visuals",
        });
        return {
          url: res.url,
          type: item.type,
        };
      });
      const uploadedVisuals = await Promise.all(visualUploadPromises);

      // 3. Upload Custom BGM if provided
      let customBgmUrl: string | undefined = undefined;
      if (customBgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading custom background audio track...",
          progress: 0.25,
          startedAt: Date.now(),
        });
        const bgmUpload = await uploadFileViaPresign(customBgmFile, {
          prefix: "split-screen/bgm",
        });
        customBgmUrl = bgmUpload.url;
      }

      setJobStatus({
        state: "planning",
        message: "Structuring dual 50/50 timeline and aligning Groq Whisper subtitles...",
        progress: 0.35,
        startedAt: Date.now(),
      });

      // 4. Submit Job to /api/reels/jobs
      const response = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey: creatorUpload.key || creatorUpload.url,
          fileName: creatorVideoFile.name,
          contentType: creatorVideoFile.type || "video/mp4",
          mediaType: "video",
          mode: "splitScreenExplainer",
          removeAiWatermark: Boolean(removeAiWatermark),
          templateName: "SPLIT_SCREEN_EXPLAINER",
          aspectRatio: "9:16",
          mediaAspect: "portrait",
          sourceVideoUrl: creatorUpload.url,
          creatorVideoUrl: creatorUpload.url,
          explanationVisualUrls: uploadedVisuals.map((v) => v.url),
          topicTitle,
          subtitleStyle,
          bgmTrackId,
          bgmVolume,
          customBgmUrl,
          enableSfx,
          editorialTranscript,
          userEmail: user?.email,
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to start cloud render.");
      }

      setJobStatus({
        state: "rendering",
        renderId: result.renderId || result.jobId,
        bucketName: result.bucketName,
        title: topicTitle,
        progress: 0.45,
        message: "Rendering 1080p MP4 on AWS Lambda...",
        startedAt: Date.now(),
      });
    } catch (err: any) {
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
                Split-Screen Explainer
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200">
                50/50 Dual Zone
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
        {jobStatus.state !== "idle" ? (
          <div className="max-w-2xl mx-auto py-12">
            <InteractiveRenderEngine
              mode="splitScreenExplainer"
              title={topicTitle || "Split Screen Explainer"}
              fileName={creatorVideoFile?.name}
              status={jobStatus}
              onRetry={() => handleStartRender()}
              onCancel={() => setShowCancelModal(true)}
              onReset={() => setJobStatus({ state: "idle" })}
            />
          </div>
        ) : (
          <SplitScreenExplainerStudio
            creatorVideoFile={creatorVideoFile}
            onCreatorVideoSelect={setCreatorVideoFile}
            explanationItems={explanationItems}
            onAddExplanationFiles={handleAddExplanationFiles}
            onRemoveExplanationItem={handleRemoveExplanationItem}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            subtitleStyle={subtitleStyle}
            onSubtitleStyleChange={setSubtitleStyle}
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
            onGenerate={handleGenerate}
            isGenerating={jobStatus.state !== "idle" && jobStatus.state !== "ready"}
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

