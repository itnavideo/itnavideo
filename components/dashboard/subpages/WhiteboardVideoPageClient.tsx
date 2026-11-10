"use client";

import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import {
  Sparkles,
  ArrowLeft,
  Upload,
  Layers3,
  Columns,
  Film,
  Clapperboard,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Loader2,
  Clock,
  History,
  PenTool,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { WhiteboardStudio } from "@/components/dashboard/WhiteboardStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";

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

export default function WhiteboardVideoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(false);

  // Studio Form Options
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [markerColor, setMarkerColor] = useState<string>("auto");
  const [handStyle, setHandStyle] = useState<string>("right");
  const [fontPersonality, setFontPersonality] = useState<string>("balsamiq");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [visualTheme, setVisualTheme] = useState<string>("educational");
  const [editorialTranscript, setEditorialTranscript] = useState("");
  const [hasUserEditedTranscript, setHasUserEditedTranscript] = useState(false);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/whiteboard-video");
    }
  }, [user, authLoading, router]);

  // Billing entitlement
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
          const isDone = Boolean(data.done || data.state === "ready" || data.state === "completed" || data.outputFile);
          const isFailed = Boolean(data.state === "error" || data.state === "failed" || (data.done && !data.outputFile && data.errors?.length));

          if (isDone && data.outputFile) {
            setJobStatus((prev) => ({
              ...prev,
              state: "ready",
              progress: 1,
              outputFile: data.outputFile || data.url,
              message: "Render complete! Your Whiteboard Animation is ready to download.",
            }));
          } else if (isFailed) {
            setJobStatus((prev) => ({
              ...prev,
              state: "error",
              message: data.error || data.errors?.[0]?.message || "Render encountered an error. Please try again.",
            }));
          } else if (data.progress !== undefined) {
            setJobStatus((prev) => ({
              ...prev,
              progress: Math.max(0.4, Number(data.progress)),
              message: data.stageMessage || "Drawing whiteboard animation...",
            }));
          }
        } catch { }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobStatus.state, jobStatus.renderId]);

  const handleStartRender = async (customScenes?: any[]) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/whiteboard-video");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a voiceover audio file first.");
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
        message: "Uploading voiceover audio...",
        progress: 0.10,
      });

      // 1. Upload voiceover narration
      const mediaKey = await uploadFileViaPresign(
        selectedFile,
        "whiteboardVideo",
        user.id,
        user.email || undefined
      );

      // 2. Upload Custom BGM if provided
      let customBgmUrl: string | undefined = undefined;
      if (customBgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading background audio...",
          progress: 0.22,
        });
        const bgmKey = await uploadFileViaPresign(
          customBgmFile,
          "whiteboardVideo",
          user.id,
          user.email || undefined
        );
        customBgmUrl = String(bgmKey);
      }

      // 3. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Planning whiteboard scenes & speech sync...",
        progress: 0.35,
      });

      const plannedTitle =
        topicTitle.trim() ||
        selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
        "Whiteboard Explainer";

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey: String(mediaKey),
          sourceAudioUrl: String(mediaKey),
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "whiteboardVideo",
          removeAiWatermark: Boolean(removeAiWatermark),
          templateName: "WHITEBOARD_VIDEO",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          fontPersonality,
          markerColor,
          handStyle,
          visualTheme,
          aspectRatio: "9:16",
          mediaAspect: "portrait",
          bgmTrackId,
          bgmVolume,
          customBgmUrl,
          enableSfx,
          editorialTranscript: editorialTranscript.trim() || undefined,
          editedTranscript: hasUserEditedTranscript && editorialTranscript.trim() ? editorialTranscript.trim() : undefined,
          plan: customScenes && Array.isArray(customScenes) && customScenes.length > 0 ? {
            title: plannedTitle,
            scenes: customScenes,
            durationSeconds: Math.round(customScenes[customScenes.length - 1]?.endTime || 60),
          } : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Whiteboard render job.");
      }

      const renderId = jobPayload.renderId || jobPayload.jobId;
      const bucketName = jobPayload.bucketName;

      // 4. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Creating your 9:16 whiteboard video...",
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
    } catch { }
    setJobStatus({ state: "idle" });
    setIsCancelling(false);
    setShowCancelModal(false);
  };

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar (Clean White Surface - Full Bleed, matching Image to Video AI) */}
      <StudioHeader
        studioName="Whiteboard Explainer"
        aspectRatioLabel="9:16 Shorts"
        badgeLabel="Stickman Animation"
        userRemainingCredits={billingEntitlement?.usage?.remaining ?? userRemainingCredits}
        isWorking={Boolean(isWorking || (typeof jobStatus !== 'undefined' && jobStatus.state !== 'idle'))}
      />

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="whiteboardVideo"
              title={topicTitle || "Whiteboard Explainer"}
              fileName={selectedFile?.name}
              status={jobStatus}
              onRetry={() => handleStartRender()}
              onCancel={() => setShowCancelModal(true)}
              onReset={() => setJobStatus({ state: "idle" })}
            />
          </div>
        ) : (
          <WhiteboardStudio
            selectedFile={selectedFile}
            onSelectFile={(file) => {
              setSelectedFile(file);
              if (!file) {
                setEditorialTranscript("");
                setHasUserEditedTranscript(false);
              }
            }}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            fontPersonality={fontPersonality}
            onFontPersonalityChange={setFontPersonality}
            markerColor={markerColor}
            onMarkerColorChange={setMarkerColor}
            handStyle={handStyle}
            onHandStyleChange={setHandStyle}
            bgmTrackId={bgmTrackId}
            onBgmTrackIdChange={setBgmTrackId}
            bgmVolume={bgmVolume}
            onBgmVolumeChange={setBgmVolume}
            customBgmFile={customBgmFile}
            onCustomBgmFileSelect={setCustomBgmFile}
            enableSfx={enableSfx}
            onEnableSfxChange={setEnableSfx}
            visualTheme={visualTheme}
            onVisualThemeChange={setVisualTheme}
            editorialTranscript={editorialTranscript}
            onEditorialTranscriptChange={(text, isManual = false) => {
              setEditorialTranscript(text);
              if (isManual) {
                setHasUserEditedTranscript(true);
              }
            }}
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
