"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { FacelessShortsStudio } from "@/components/dashboard/FacelessShortsStudio";
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
} from "lucide-react";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import { isFeatureLockedForUser } from "@/lib/billing/freeTierAccess";
import { FeaturePaywall } from "@/components/dashboard/FeaturePaywall";

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

type ProductionStage = {
  id: number;
  name: string;
  detail: string;
  minProgress: number;
};

const PRODUCTION_STAGES: ProductionStage[] = [
  { id: 1, name: "Preparing scenes & script alignment", detail: "Structuring narrative beats and typography hierarchy", minProgress: 0 },
  { id: 2, name: "Assembling visual assets & B-roll", detail: "Matching high-definition footage and motion graphics", minProgress: 0.25 },
  { id: 3, name: "Rendering high-definition video", detail: "Composing 1080p vertical video frames and motion transitions", minProgress: 0.55 },
  { id: 4, name: "Final quality checks & audio mastering", detail: "Ducking background score and verifying synchronization", minProgress: 0.90 },
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

export default function FacelessShortsPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Studio configuration states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [facelessImageFiles, setFacelessImageFiles] = useState<File[]>([]);
  const [facelessVideoFiles, setFacelessVideoFiles] = useState<File[]>([]);
  const [assetSourceMode, setAssetSourceMode] = useState<"library" | "upload" | "mix">("upload");
  const [topicTitle, setTopicTitle] = useState("");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "none">("lofi");
  const [facelessBgmVolume, setFacelessBgmVolume] = useState(0.12);
  const [facelessPacingStyle, setFacelessPacingStyle] = useState<"clean" | "cinematic" | "documentary" | "dynamic">("cinematic");
  const [facelessEnableSfx, setFacelessEnableSfx] = useState<boolean>(true);
  const [subtitleStyle, setSubtitleStyle] = useState<string>("glow-viral");
  const [creatorHandle, setCreatorHandle] = useState<string>("");
  const [denoiseVoice, setDenoiseVoice] = useState<boolean>(true);
  const [captionAnimationStyle, setCaptionAnimationStyle] = useState<"mrbeast" | "handwriting" | "bouncy" | "smooth" | "capsule" | "decodingyt">("smooth");
  const [captionPosition, setCaptionPosition] = useState<"bottom" | "center" | "top">("bottom");
  const [visualTheme, setVisualTheme] = useState<string>("modern-saas");
  const [backgroundTheme, setBackgroundTheme] = useState<string>("solid-white");
  const [customBgUrl, setCustomBgUrl] = useState<string>("");
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);

  // Job, billing and render history
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Time tracker for accurate ETA
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Planning error and state
  const [isPlanningAudio, setIsPlanningAudio] = useState(false);
  const [planningMessage, setPlanningMessage] = useState("");
  const [planningError, setPlanningError] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderRequestInFlightRef = useRef(false);
  const cachedAudioKeyRef = useRef<string>("");
  const lastStoryboardPayloadRef = useRef<any>(null);

  // 1. Authenticate user
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/faceless-shorts");
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
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // 3. Polling for render progress
  useEffect(() => {
    if (jobStatus.state === "rendering" && jobStatus.renderId) {
      pollIntervalRef.current = setInterval(async () => {
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
              message: "Render complete! Your 9:16 Faceless Short is ready to download.",
            }));
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          } else if (data.status === "failed" || data.status === "error") {
            setJobStatus((prev) => ({
              ...prev,
              state: "error",
              message: data.error || "Render encountered an error. Please try again.",
            }));
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          } else if (data.progress !== undefined) {
            setJobStatus((prev) => ({
              ...prev,
              progress: Math.max(0.4, data.progress),
              message: data.stageMessage || "Composing 9:16 vertical short on AWS Lambda...",
            }));
          }
        } catch {}
      }, 3000);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [jobStatus.state, jobStatus.renderId]);

  // 4. Elapsed timer
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

  // Handle Start Render
  const handleStartRender = async (storyboardPayload?: any) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/faceless-shorts");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    const isActualPayload =
      storyboardPayload &&
      typeof storyboardPayload === "object" &&
      !("nativeEvent" in storyboardPayload) &&
      !("_reactName" in storyboardPayload);

    if (isActualPayload) {
      lastStoryboardPayloadRef.current = storyboardPayload;
    }
    const activeStoryboard = (isActualPayload ? storyboardPayload : lastStoryboardPayloadRef.current) || {};

    try {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setJobStatus({
        state: "uploading",
        message: "Uploading narration audio to cloud storage...",
        progress: 0.1,
        startedAt: Date.now(),
      });

      // 1. Upload audio
      const mediaKey = cachedAudioKeyRef.current || (await uploadFileViaPresign(selectedFile, "facelessShorts", user.id));
      cachedAudioKeyRef.current = mediaKey;

      // 2. Upload images & videos
      const uploadedImageKeys: string[] = [];
      if (facelessImageFiles.length > 0) {
        for (const img of facelessImageFiles) {
          const key = await uploadFileViaPresign(img, "facelessShorts", user.id);
          uploadedImageKeys.push(key);
        }
      }
      if (facelessVideoFiles.length > 0) {
        for (const vid of facelessVideoFiles) {
          const key = await uploadFileViaPresign(vid, "facelessShorts", user.id);
          uploadedImageKeys.push(key);
        }
      }

      // 3. Upload custom BGM if provided
      let customBgmKey: string | undefined = undefined;
      if (activeStoryboard?.customBgmFile) {
        customBgmKey = await uploadFileViaPresign(activeStoryboard.customBgmFile, "facelessShorts", user.id);
      }

      const plannedTitle =
        activeStoryboard?.topicTitle ||
        topicTitle.trim() ||
        (selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Short");

      // Up to 90s max for 9:16 Shorts
      const audioDuration = Math.min(90, Math.max(5, activeStoryboard?.durationSeconds || 60));

      setJobStatus({
        state: "planning",
        message: "Aligning speech timestamps and generating Scene-by-Scene JSON blueprint...",
        progress: 0.35,
        startedAt: Date.now(),
      });

      // 4. Submit Render Job
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "facelessShorts",
          removeAiWatermark: Boolean(removeAiWatermark),
          subtitleStyle: activeStoryboard?.subtitleStyle || subtitleStyle || "glow-viral",
          captionThemeId: activeStoryboard?.subtitleStyle || subtitleStyle || "glow-viral",
          captionAnimationStyle: activeStoryboard?.captionAnimationStyle || captionAnimationStyle,
          captionPosition: activeStoryboard?.captionPosition || captionPosition,
          uploadedImageKeys,
          assetMode: assetSourceMode,
          topicTitle: plannedTitle,
          creatorHandle: activeStoryboard?.creatorHandle || creatorHandle || undefined,
          denoiseVoice: activeStoryboard?.denoiseVoice ?? denoiseVoice,
          userId: user.id,
          userEmail: user.email || undefined,
          facelessBgmMood: activeStoryboard?.facelessBgmMood || facelessBgmMood,
          facelessBgmVolume: activeStoryboard?.facelessBgmVolume ?? facelessBgmVolume ?? 0.12,
          bgmVolume: activeStoryboard?.facelessBgmVolume ?? facelessBgmVolume ?? 0.12,
          bgmUrl: activeStoryboard?.selectedBgmPath || undefined,
          bgmKey: customBgmKey,
          facelessPacingStyle,
          facelessEnableSfx: activeStoryboard?.facelessEnableSfx ?? facelessEnableSfx,
          aspectRatio: "9:16",
          durationSeconds: audioDuration,
          sourceDurationSeconds: audioDuration,
          mediaAspect: "portrait",
          visualTheme: activeStoryboard?.visualTheme || visualTheme || "modern-saas",
          backgroundTheme: activeStoryboard?.backgroundTheme || backgroundTheme || "solid-white",
          customBgUrl: "",
          sceneBlueprint: activeStoryboard?.sceneBlueprint,
          brollUrls: activeStoryboard?.brollUrls,
          approvedCaptions: activeStoryboard?.approvedCaptions,
          transcript: activeStoryboard?.editableTranscript || activeStoryboard?.transcript,
          brandNamesHint: activeStoryboard?.brandNamesHint,
          frameRange: audioDuration > 0 ? [0, Math.min(2700, Math.round(audioDuration * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok || !jobPayload.renderId) {
        throw new Error(jobPayload.error || "Failed to start 9:16 Faceless Shorts render job.");
      }

      setJobStatus({
        state: "rendering",
        renderId: jobPayload.renderId,
        bucketName: jobPayload.bucketName,
        title: plannedTitle,
        progress: 0.45,
        message: "Rendering 1080×1920 MP4 on AWS Lambda...",
        startedAt: Date.now(),
      });
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err.message || "Failed to process video render. Please retry.",
      });
    }
  };

  const handleCancelRender = async () => {
    setIsCancelling(true);
    try {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      renderRequestInFlightRef.current = false;
      if (jobStatus.renderId) {
        await fetch("/api/reels/jobs/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            renderId: jobStatus.renderId,
            userId: user?.id,
          }),
        }).catch(() => {});
      }
      setJobStatus({ state: "idle" });
      setShowCancelModal(false);
    } catch {
      setShowCancelModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-sm font-semibold text-slate-800">Loading Faceless Shorts Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Header: Unified Full Bleed Canvas */}
      <StudioHeader
        studioName="Faceless Shorts AI"
        aspectRatioLabel="9:16 Shorts"
        badgeLabel="AI Faceless Shorts"
        userRemainingCredits={billingEntitlement?.usage?.remaining ?? 0}
        isWorking={Boolean(jobStatus.state !== 'idle' && jobStatus.state !== 'ready')}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {billingEntitlement && isFeatureLockedForUser("facelessShorts", billingEntitlement) ? (
          <FeaturePaywall
            featureName="Faceless Shorts"
            description="Turn voiceover into viral 9:16 faceless shorts. Free accounts can use Auto Captions and the YouTube Subtitles Generator — upgrade to render faceless shorts in 1080p on the cloud."
          />
        ) : jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="facelessShorts"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Composing 9:16 vertical faceless short...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || topicTitle || "Faceless Short",
              }}
              title={jobStatus.title || topicTitle || "Faceless Short"}
              fileName={selectedFile?.name}
              onRetry={() => handleStartRender()}
              onCancel={() => setShowCancelModal(true)}
              onReset={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setSelectedFile(null);
                setFacelessImageFiles([]);
                cachedAudioKeyRef.current = "";
                lastStoryboardPayloadRef.current = null;
                setPlanningError(null);
                setPlanningMessage("");
                setJobStatus({ state: "idle" });
              }}
            />
          </div>
        ) : (
          <FacelessShortsStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            creatorHandle={creatorHandle}
            onCreatorHandleChange={setCreatorHandle}
            denoiseVoice={denoiseVoice}
            onDenoiseVoiceChange={setDenoiseVoice}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            subtitleStyle={subtitleStyle}
            onSubtitleStyleChange={setSubtitleStyle}
            captionAnimationStyle={captionAnimationStyle}
            onCaptionAnimationStyleChange={setCaptionAnimationStyle}
            captionPosition={captionPosition}
            onCaptionPositionChange={setCaptionPosition}
            facelessBgmMood={facelessBgmMood}
            onBgmMoodChange={setFacelessBgmMood}
            facelessBgmVolume={facelessBgmVolume}
            onBgmVolumeChange={setFacelessBgmVolume}
            facelessPacingStyle={facelessPacingStyle}
            onPacingStyleChange={setFacelessPacingStyle}
            facelessEnableSfx={facelessEnableSfx}
            onEnableSfxChange={setFacelessEnableSfx}
            visualTheme={visualTheme}
            onVisualThemeChange={setVisualTheme}
            backgroundTheme={backgroundTheme}
            onBackgroundThemeChange={setBackgroundTheme}
            customBgUrl={customBgUrl}
            onCustomBgUrlChange={setCustomBgUrl}
            customBgFile={customBgFile}
            onCustomBgFileSelect={setCustomBgFile}
            onGenerate={handleStartRender}
            isGenerating={jobStatus.state !== "idle" && jobStatus.state !== "ready"}
            renderedVideoUrl={jobStatus.outputFile}
            assetSourceMode={assetSourceMode}
            onAssetSourceModeChange={setAssetSourceMode}
            uploadedImageFiles={facelessImageFiles}
            onUploadedImageFilesChange={setFacelessImageFiles}
            uploadedVideoFiles={facelessVideoFiles}
            onUploadedVideoFilesChange={setFacelessVideoFiles}
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
