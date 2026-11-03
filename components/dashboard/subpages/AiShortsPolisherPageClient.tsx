"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  AiShortsPolisherStudio,
  type UploadedMediaItem,
  type UploadedLayerItem,
} from "@/components/dashboard/AiShortsPolisherStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import { ArrowLeft, Sparkles, Zap, Smartphone } from "lucide-react";
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
  const [smartPunchIns, setSmartPunchIns] = useState(true);
  const [captionStyle, setCaptionStyle] = useState("Pop Word");
  const [bgmTrackId, setBgmTrackId] = useState("parasail");
  const [bgmVolume, setBgmVolume] = useState(0.12);
  const [customBgmFile, setCustomBgmFile] = useState<File | null>(null);
  const [enableSfx, setEnableSfx] = useState(true);
  const [editorialTranscript, setEditorialTranscript] = useState("");

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
        message: "Uploading raw 9:16 video clips to cloud render storage...",
        progress: 0.15,
      });

      // 1. Upload primary clips
      const firstMedia = primaryMediaList[0];
      const mediaKey = await uploadFileViaPresign(firstMedia.file, "aiShortsPolisher", user.id);

      const uploadedMediaItems = [{ id: firstMedia.id, url: mediaKey, type: firstMedia.type }];
      for (let i = 1; i < primaryMediaList.length; i++) {
        const item = primaryMediaList[i];
        const key = await uploadFileViaPresign(item.file, "aiShortsPolisher", user.id);
        uploadedMediaItems.push({ id: item.id, url: key, type: item.type });
      }

      // 2. Upload overlay layers
      const uploadedLayerItems = [];
      for (const layer of overlayLayerList) {
        const key = await uploadFileViaPresign(layer.file, "aiShortsPolisher", user.id);
        uploadedLayerItems.push({
          id: layer.id,
          url: key,
          type: layer.type,
          title: layer.title,
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
        customBgmKey = await uploadFileViaPresign(customBgmFile, "aiShortsPolisher", user.id);
      }

      // 4. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Aligning silence jump-cuts & smart camera zoom punch-ins...",
        progress: 0.45,
      });

      const plannedTitle = videoTitle.trim() || firstMedia.name.replace(/\.[^/.]+$/, "");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: firstMedia.name,
          contentType: firstMedia.file.type || "video/mp4",
          mediaType: firstMedia.type,
          mode: "aiShortsPolisher",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          silenceJumpCuts,
          smartPunchIns,
          captionStyle,
          bgmTrackId,
          bgmVolume,
          customBgmUrl: customBgmKey || undefined,
          enableSfx,
          editorialTranscript: editorialTranscript.trim() || undefined,
          mediaItems: uploadedMediaItems,
          layerItems: uploadedLayerItems,
          aspectRatio: "9:16",
          durationSeconds: 60,
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
        message: "Rendering 1080p Vertical Short with smart zooms and kinetic captions...",
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
          setJobStatus({
            state: "error",
            message: "Render timed out. Please check your dashboard history shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&mode=aiShortsPolisher`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.done && statusPayload.outputFile) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setJobStatus({
              state: "ready",
              message: "Your polished 9:16 vertical short is ready!",
              progress: 1,
              outputFile: statusPayload.outputFile,
              renderId,
              title: plannedTitle,
            });
          } else if (statusPayload.state === "error") {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
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
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit shorts polisher job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-xs transition active:scale-95"
            >
              <ArrowLeft size={16} />
            </Link>
            <BrandLogo size="sm" variant="light" />
          </div>

          <div className="flex items-center gap-4">
            {billingEntitlement && (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-xs">
                <Zap size={13} className="fill-orange-500 text-orange-500" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {jobStatus.state !== "idle" && (
          <div className="max-w-3xl mx-auto py-4">
            <InteractiveRenderEngine
              mode="autoCaption"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Polishing vertical short with smart zooms and kinetic subtitles...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || videoTitle || "AI Shorts Polisher",
              }}
              title={jobStatus.title || videoTitle || "AI Shorts Polisher"}
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
        )}

        {jobStatus.state === "idle" && (
          <AiShortsPolisherStudio
            primaryMediaList={primaryMediaList}
            onPrimaryMediaListChange={setPrimaryMediaList}
            overlayLayerList={overlayLayerList}
            onOverlayLayerListChange={setOverlayLayerList}
            videoTitle={videoTitle}
            onVideoTitleChange={setVideoTitle}
            silenceJumpCuts={silenceJumpCuts}
            onSilenceJumpCutsChange={setSilenceJumpCuts}
            smartPunchIns={smartPunchIns}
            onSmartPunchInsChange={setSmartPunchIns}
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
          />
        )}
      </div>
    </main>
  );
}

