"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  AiShortsPolisherStudio,
  type UploadedMediaItem,
  type UploadedLayerItem,
  type ArrowCalloutConfig,
  type EquationFormulaConfig,
  type ComparisonBannerConfig,
} from "@/components/dashboard/AiShortsPolisherStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import { ArrowLeft, Zap, Loader2 } from "lucide-react";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
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

export default function AiShortsPolisherPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio form states
  const [primaryMediaList, setPrimaryMediaList] = useState<UploadedMediaItem[]>([]);
  const [overlayLayerList, setOverlayLayerList] = useState<UploadedLayerItem[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [silenceJumpCuts, setSilenceJumpCuts] = useState(true);
  const [silenceSensitivity, setSilenceSensitivity] = useState<"tight" | "normal" | "gentle">("tight");
  const [smartPunchIns, setSmartPunchIns] = useState(true);
  const [punchInIntensity, setPunchInIntensity] = useState<"subtle" | "medium" | "dramatic">("medium");
  const [captionStyle, setCaptionStyle] = useState("Pop Word");
  const [captionPosition, setCaptionPosition] = useState<"bottom" | "center" | "top">("bottom");
  const [faceFraming, setFaceFraming] = useState<"center" | "left" | "right">("center");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState(true);
  const [editorialTranscript, setEditorialTranscript] = useState("");
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Visual Callout States
  const [curvedArrowConfig, setCurvedArrowConfig] = useState<ArrowCalloutConfig>({
    enabled: false,
    label: "LOOK HERE",
    direction: "down-left",
    color: "#EF4444",
    atSeconds: 3,
    durationSeconds: 3,
  });

  const [equationFormulaConfig, setEquationFormulaConfig] = useState<EquationFormulaConfig>({
    enabled: false,
    step1: { value: "HOOK", label: "0-3s", accentColor: "#38BDF8" },
    operator1: "+",
    step2: { value: "STORY", label: "RETENTION", accentColor: "#FACC15" },
    operator2: "=",
    result: { value: "VIRAL", label: "1M+ VIEWS", accentColor: "#22C55E" },
    atSeconds: 5,
    durationSeconds: 4,
  });

  const [comparisonBannerConfig, setComparisonBannerConfig] = useState<ComparisonBannerConfig>({
    enabled: false,
    left: { tag: "BORING", title: "Raw Take", description: "Awkward pauses & silence", isWinner: false },
    right: { tag: "VIRAL", title: "AI Polished", description: "Punch-ins & viral captions", isWinner: true },
    atSeconds: 8,
    durationSeconds: 4,
  });

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/ai-shorts-polisher");
    }
  }, [user, authLoading, router]);

  // Billing entitlement fetch
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

  // Duration detection for first primary video
  useEffect(() => {
    if (primaryMediaList.length > 0 && primaryMediaList[0].type === "video") {
      const first = primaryMediaList[0];
      if (!first.durationSeconds) {
        const tempVideo = document.createElement("video");
        tempVideo.preload = "metadata";
        tempVideo.onloadedmetadata = () => {
          if (tempVideo.duration && Number.isFinite(tempVideo.duration)) {
            setPrimaryMediaList((prev) =>
              prev.map((m) => (m.id === first.id ? { ...m, durationSeconds: Math.round(tempVideo.duration) } : m))
            );
          }
        };
        tempVideo.src = first.previewUrl;
      }
    }
  }, [primaryMediaList]);

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/ai-shorts-polisher");
      return;
    }
    if (primaryMediaList.length === 0) {
      alert("Please upload at least one 9:16 vertical video clip first.");
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
        message: "Uploading 9:16 video clips and layers in parallel...",
        progress: 0.15,
      });

      // 1. Parallel Upload of primary clips & overlay layers
      const primaryUploadPromises = primaryMediaList.map(async (item) => {
        const key = await uploadFileViaPresign(item.file, "aiShortsPolisher", user.id);
        return { id: item.id, url: key, type: item.type };
      });

      const layerUploadPromises = overlayLayerList.map(async (layer) => {
        const key = await uploadFileViaPresign(layer.file, "aiShortsPolisher", user.id);
        return {
          id: layer.id,
          url: key,
          type: layer.type,
          title: layer.title,
          position: layer.position || "top-right",
          isCutaway: Boolean(layer.isCutaway),
          startSeconds: layer.startSeconds || 3,
          durationSeconds: layer.durationSeconds || 3.5,
        };
      });

      const customBgmPromise = customBgmFile
        ? uploadFileViaPresign(customBgmFile, "aiShortsPolisher", user.id)
        : Promise.resolve(undefined);

      const [uploadedMediaItems, uploadedLayerItems, customBgmKey] = await Promise.all([
        Promise.all(primaryUploadPromises),
        Promise.all(layerUploadPromises),
        customBgmPromise,
      ]);

      const firstMedia = primaryMediaList[0];
      const mediaKey = uploadedMediaItems[0].url;

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Applying high-retention silence cuts and kinetic punch-ins...",
        progress: 0.45,
      });

      const plannedTitle = videoTitle.trim() || firstMedia.name.replace(/\.[^/.]+$/, "");
      const detectedDuration = Math.min(90, Math.max(5, firstMedia.durationSeconds || 60));

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: firstMedia.name,
          contentType: firstMedia.file.type || "video/mp4",
          mediaType: firstMedia.type,
          mode: "aiShortsPolisher",
          removeAiWatermark: Boolean(removeAiWatermark),
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          silenceJumpCuts,
          silenceSensitivity,
          smartPunchIns,
          punchInIntensity,
          captionStyle,
          captionPosition,
          faceFraming,
          bgmTrackId,
          bgmVolume,
          customBgmUrl: customBgmKey || undefined,
          enableSfx,
          editorialTranscript: editorialTranscript.trim() || undefined,
          mediaItems: uploadedMediaItems,
          layerItems: uploadedLayerItems,
          aspectRatio: "9:16",
          durationSeconds: detectedDuration,
          curvedArrows: curvedArrowConfig.enabled ? [curvedArrowConfig] : undefined,
          equationFormula: equationFormulaConfig.enabled ? equationFormulaConfig : undefined,
          comparisonBanner: comparisonBannerConfig.enabled ? comparisonBannerConfig : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok || !jobPayload.renderId) {
        throw new Error(jobPayload.error || "Failed to start AI Shorts Polisher render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "Rendering 1080×1920 vertical Shorts with punch-ins & viral captions...",
        progress: 0.55,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      // Poll status
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > 120) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setIsSubmitting(false);
          setJobStatus({
            state: "error",
            message: "Render timed out. Please check your dashboard history shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName)}&userId=${encodeURIComponent(user.id)}&mode=aiShortsPolisher&title=${encodeURIComponent(plannedTitle)}`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.state === "ready" || statusPayload.state === "done") {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);
            setJobStatus({
              state: "ready",
              message: "Your viral polished 9:16 Shorts video is ready!",
              progress: 1,
              outputFile: statusPayload.outputFile,
              renderId,
              title: plannedTitle,
            });
          } else if (statusPayload.state === "error") {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);
            setJobStatus({
              state: "error",
              message: statusPayload.error || "Rendering encountered an error. Please try again.",
            });
          } else {
            const currentProgress = 0.55 + Math.min(0.4, attempts * 0.01);
            setJobStatus((prev) => ({
              ...prev,
              progress: currentProgress,
            }));
          }
        } catch (err) {
          console.warn("Poll error:", err);
        }
      }, 3500);
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setIsSubmitting(false);
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit shorts polisher job.",
      });
    }
  };

  const handleReset = () => {
    setPrimaryMediaList([]);
    setOverlayLayerList([]);
    setIsSubmitting(false);
    setJobStatus({ state: "idle" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading AI Shorts Polisher Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Standardized Unified Studio Navigation Header */}
      <StudioHeader
        studioName="AI Shorts Polisher"
        aspectRatioLabel="9:16 Shorts"
        badgeLabel="Auto Editor"
        userRemainingCredits={billingEntitlement?.usage?.remaining}
        isWorking={jobStatus.state !== "idle"}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="aiShortsPolisher"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Polishing 9:16 Shorts with punch-in cuts and viral captions...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || videoTitle || "AI Shorts Polisher",
              }}
              title={jobStatus.title || videoTitle || "AI Shorts Polisher"}
              fileName={primaryMediaList[0]?.name}
              onRetry={handleStartRender}
              onReset={handleReset}
            />
          </div>
        ) : (
          <AiShortsPolisherStudio
            primaryMediaList={primaryMediaList}
            onPrimaryMediaListChange={setPrimaryMediaList}
            overlayLayerList={overlayLayerList}
            onOverlayLayerListChange={setOverlayLayerList}
            videoTitle={videoTitle}
            onVideoTitleChange={setVideoTitle}
            silenceJumpCuts={silenceJumpCuts}
            onSilenceJumpCutsChange={setSilenceJumpCuts}
            silenceSensitivity={silenceSensitivity}
            onSilenceSensitivityChange={setSilenceSensitivity}
            smartPunchIns={smartPunchIns}
            onSmartPunchInsChange={setSmartPunchIns}
            punchInIntensity={punchInIntensity}
            onPunchInIntensityChange={setPunchInIntensity}
            captionStyle={captionStyle}
            onCaptionStyleChange={setCaptionStyle}
            captionPosition={captionPosition}
            onCaptionPositionChange={setCaptionPosition}
            faceFraming={faceFraming}
            onFaceFramingChange={setFaceFraming}
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
            curvedArrowConfig={curvedArrowConfig}
            onCurvedArrowConfigChange={setCurvedArrowConfig}
            equationFormulaConfig={equationFormulaConfig}
            onEquationFormulaConfigChange={setEquationFormulaConfig}
            comparisonBannerConfig={comparisonBannerConfig}
            onComparisonBannerConfigChange={setComparisonBannerConfig}
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
