"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  AiVideoPolisherStudio,
  type UploadedMediaItem,
  type UploadedLayerItem,
  type ArrowCalloutConfig,
  type EquationFormulaConfig,
  type ComparisonBannerConfig,
} from "@/components/dashboard/AiVideoPolisherStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import { ArrowLeft, Sparkles, Zap, Film, Loader2 } from "lucide-react";
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

export default function AiVideoPolisherPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio form states
  const [primaryMediaList, setPrimaryMediaList] = useState<UploadedMediaItem[]>([]);
  const [overlayLayerList, setOverlayLayerList] = useState<UploadedLayerItem[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [silenceJumpCuts, setSilenceJumpCuts] = useState(true);
  const [silenceSensitivity, setSilenceSensitivity] = useState<"tight" | "normal" | "gentle">("normal");
  const [smartPunchIns, setSmartPunchIns] = useState(true);
  const [punchInIntensity, setPunchInIntensity] = useState<"subtle" | "medium" | "dramatic">("medium");
  const [captionStyle, setCaptionStyle] = useState("glow-viral");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState(true);
  const [editorialTranscript, setEditorialTranscript] = useState("");
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Visual Callout States
  const [curvedArrowConfig, setCurvedArrowConfig] = useState<ArrowCalloutConfig>({
    enabled: false,
    label: "KEY EVIDENCE",
    direction: "down-left",
    color: "#EF4444",
    atSeconds: 4,
    durationSeconds: 3.5,
  });

  const [equationFormulaConfig, setEquationFormulaConfig] = useState<EquationFormulaConfig>({
    enabled: false,
    step1: { value: "1,000 VIEWS", label: "TRAFFIC", accentColor: "#38BDF8" },
    operator1: "×",
    step2: { value: "$5 RPM", label: "MONETIZATION", accentColor: "#FACC15" },
    operator2: "=",
    result: { value: "$5,000", label: "TOTAL PROFIT", accentColor: "#22C55E" },
    atSeconds: 6,
    durationSeconds: 5,
  });

  const [comparisonBannerConfig, setComparisonBannerConfig] = useState<ComparisonBannerConfig>({
    enabled: false,
    left: { tag: "STANDARD", title: "Raw Takes", description: "Dead silence & shaky pacing", isWinner: false },
    right: { tag: "PRO POLISHED", title: "Itnavideo AI", description: "Tight cuts, punch-ins & 1080p", isWinner: true },
    atSeconds: 10,
    durationSeconds: 5,
  });

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/ai-video-polisher");
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
      router.push("/login?returnUrl=/dashboard/ai-video-polisher");
      return;
    }
    if (primaryMediaList.length === 0) {
      alert("Please upload at least one primary video clip first.");
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
        message: "Uploading primary video clips to cloud render storage...",
        progress: 0.15,
      });

      // 1. Upload primary clips
      const firstMedia = primaryMediaList[0];
      const mediaKey = await uploadFileViaPresign(firstMedia.file, "aiVideoPolisher", user.id);

      // Upload remaining primary clips
      const uploadedMediaItems = [{ id: firstMedia.id, url: mediaKey, type: firstMedia.type }];
      for (let i = 1; i < primaryMediaList.length; i++) {
        const item = primaryMediaList[i];
        const key = await uploadFileViaPresign(item.file, "aiVideoPolisher", user.id);
        uploadedMediaItems.push({ id: item.id, url: key, type: item.type });
      }

      // 2. Upload overlay layers
      const uploadedLayerItems = [];
      for (const layer of overlayLayerList) {
        const key = await uploadFileViaPresign(layer.file, "aiVideoPolisher", user.id);
        uploadedLayerItems.push({
          id: layer.id,
          url: key,
          type: layer.type,
          title: layer.title,
          position: layer.position || "top-right",
          startSeconds: layer.startSeconds || 3,
          durationSeconds: layer.durationSeconds || 4,
        });
      }

      // 3. Upload custom BGM if present
      let customBgmKey: string | undefined = undefined;
      if (customBgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading custom background audio...",
          progress: 0.35,
        });
        customBgmKey = await uploadFileViaPresign(customBgmFile, "aiVideoPolisher", user.id);
      }

      // 4. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Aligning silence jump-cuts & smart camera zoom punch-ins...",
        progress: 0.45,
      });

      const plannedTitle = videoTitle.trim() || firstMedia.name.replace(/\.[^/.]+$/, "");
      const detectedDuration = Math.min(300, Math.max(10, firstMedia.durationSeconds || 120));

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: firstMedia.name,
          contentType: firstMedia.file.type || "video/mp4",
          mediaType: firstMedia.type,
          mode: "aiVideoPolisher",
          removeAiWatermark: Boolean(removeAiWatermark),
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          silenceJumpCuts,
          silenceSensitivity,
          smartPunchIns,
          punchInIntensity,
          captionStyle,
          bgmTrackId,
          bgmVolume,
          customBgmUrl: customBgmKey || undefined,
          enableSfx,
          editorialTranscript: editorialTranscript.trim() || undefined,
          mediaItems: uploadedMediaItems,
          layerItems: uploadedLayerItems,
          aspectRatio: "16:9",
          durationSeconds: detectedDuration,
          curvedArrows: curvedArrowConfig.enabled ? [curvedArrowConfig] : undefined,
          equationFormula: equationFormulaConfig.enabled ? equationFormulaConfig : undefined,
          comparisonBanner: comparisonBannerConfig.enabled ? comparisonBannerConfig : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok || !jobPayload.renderId) {
        throw new Error(jobPayload.error || "Failed to start AI Video Polisher render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "Rendering 1080p Widescreen YouTube video with smart zooms and lower-third captions...",
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
            `/api/reels/jobs/status?renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&mode=aiVideoPolisher`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.done && statusPayload.outputFile) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setIsSubmitting(false);
            setJobStatus({
              state: "ready",
              message: "Your polished 1080p YouTube video is ready!",
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
        message: err?.message || "Failed to submit polisher job.",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-sm font-semibold text-slate-800">Loading AI Video Polisher Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Header: Unified Full Bleed Canvas */}
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
              <span className="text-xs font-black text-slate-900 tracking-tight">AI Video Polisher</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                16:9 Cinema • 1 Min = 1 Cr
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Balance Badge */}
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
              mode="aiVideoPolisher"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Polishing YouTube video with smart zooms and lower-third captions...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || videoTitle || "AI YouTube Video Polisher",
              }}
              title={jobStatus.title || videoTitle || "AI YouTube Video Polisher"}
              fileName={primaryMediaList[0]?.name}
              onRetry={handleStartRender}
              onReset={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setPrimaryMediaList([]);
                setOverlayLayerList([]);
                setIsSubmitting(false);
                setJobStatus({ state: "idle" });
              }}
            />
          </div>
        ) : (
          <AiVideoPolisherStudio
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
