"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { ImageToVideoStudio, ITNAVIDEO_LIBRARY_BGM } from "@/components/dashboard/ImageToVideoStudio";
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
  Layers3,
  Upload,
  Clapperboard,
  History
} from "lucide-react";

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
  design?: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

const RENDER_STEPS = [
  { label: "Audio & images received", detail: "Speech audio and scene images uploaded to secure cloud.", threshold: 0.08, icon: Upload },
  { label: "Transcribing speech", detail: "AI detecting voice pace, word timestamps and sentence stops.", threshold: 0.28, icon: Layers3 },
  { label: "Pacing scene cuts", detail: "Matching images to sentences with Ken Burns camera motion.", threshold: 0.52, icon: Sparkles },
  { label: "Rendering 16:9 MP4", detail: "Building widescreen 1080p video with synced parallax subtitles.", threshold: 0.85, icon: Film },
  { label: "Ready to download", detail: "Your cinematic 16:9 video is ready for broadcast.", threshold: 0.98, icon: Clapperboard },
];

export default function ImageToVideoDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio form states (complete original 4-week implementation)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageToVideoAssetMode, setImageToVideoAssetMode] = useState<"upload" | "library" | "ai-generate">("library");
  const [imageToVideoStockUrls, setImageToVideoStockUrls] = useState<string[]>([]);
  const [imageToVideoVisualStyle, setImageToVideoVisualStyle] = useState<"2d" | "3d" | "realistic">("realistic");
  const [imageToVideoCharacterFile, setImageToVideoCharacterFile] = useState<File | null>(null);
  const [imageToVideoCharacterDnaHint, setImageToVideoCharacterDnaHint] = useState<string>("");

  const [imageToVideoBgmEnabled, setImageToVideoBgmEnabled] = useState<boolean>(true);
  const [imageToVideoLibraryBgmUrl, setImageToVideoLibraryBgmUrl] = useState<string>(
    ITNAVIDEO_LIBRARY_BGM && ITNAVIDEO_LIBRARY_BGM.length > 0 ? ITNAVIDEO_LIBRARY_BGM[0].url : "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093179/wealth-building_kyg9kb.mp3"
  );
  const [bgmFile, setBgmFile] = useState<File | null>(null);
  const [bgmVolume, setBgmVolume] = useState<number>(0.15);

  const [topicTitle, setTopicTitle] = useState<string>("");
  const [subtitleStyle, setSubtitleStyle] = useState<string>("parallax-modern");
  const [cameraMotionPreset, setCameraMotionPreset] = useState<string>("ken-burns");
  const [fitMode, setFitMode] = useState<"blur-fill" | "cover">("cover");
  const [estimatedDurationSeconds, setEstimatedDurationSeconds] = useState<number>(60);

  const [audioCleanOptions, setAudioCleanOptions] = useState({
    removeSilence: true,
    removeFillers: true,
    removeRepeats: true,
    removeFalseStarts: true,
    noiseReduction: true,
    volumeNormalize: true,
    trimEnds: true,
    playbackSpeed: 1.0,
  });

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining || limit - used)));
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

  // Load recent renders for user
  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          const itvRenders = payload.renders.filter((r: RecentRender) => r.mode === "imageToVideoAi");
          setRecentRenders(itvRenders);
        }
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);

  // Detect audio duration when selected
  useEffect(() => {
    if (!selectedAudio) {
      setEstimatedDurationSeconds(60);
      return;
    }
    const audioUrl = URL.createObjectURL(selectedAudio);
    const audio = document.createElement("audio");
    audio.src = audioUrl;
    audio.onloadedmetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setEstimatedDurationSeconds(Math.round(audio.duration));
      }
      URL.revokeObjectURL(audioUrl);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [selectedAudio]);

  // Handlers for image files
  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Upload helper for S3 / Cloudflare
  async function uploadFileViaPresign(file: File, mode: string, userId: string): Promise<string> {
    const contentType = file.type || "application/octet-stream";
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

    const uploadRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error(`Upload failed for ${file.name}`);
    }

    return presign.key as string;
  }

  // Batch upload images in chunks of 4
  async function uploadImagesBatch(files: File[], mode: string, userId: string): Promise<string[]> {
    const keys: string[] = [];
    const BATCH_SIZE = 4;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const chunk = files.slice(i, i + BATCH_SIZE);
      const chunkKeys = await Promise.all(
        chunk.map((f) => uploadFileViaPresign(f, mode, userId))
      );
      keys.push(...chunkKeys);
    }
    return keys;
  }

  // Start Render Handler
  async function handleStartRender() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedAudio) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading voiceover audio and scene images securely...",
        progress: 0.05,
      });

      // 1. Upload audio file
      const mediaKey = await uploadFileViaPresign(selectedAudio, "imageToVideoAi", user.id);

      // 2. Upload images if provided and mode is upload
      let uploadedImageKeys: string[] = [];
      if (imageToVideoAssetMode === "upload" && imageFiles.length > 0) {
        setJobStatus({
          state: "uploading",
          message: `Uploading ${imageFiles.length} scene image${imageFiles.length > 1 ? "s" : ""}...`,
          progress: 0.12,
        });
        uploadedImageKeys = await uploadImagesBatch(imageFiles, "imageToVideoAi", user.id);
      }

      // 3. Upload BGM if provided and enabled
      let bgmKey: string | undefined = undefined;
      if (imageToVideoBgmEnabled && bgmFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading custom background music...",
          progress: 0.18,
        });
        bgmKey = await uploadFileViaPresign(bgmFile, "imageToVideoAi", user.id);
      }

      // 4. Submit Render Job to Backend
      setJobStatus({
        state: "starting",
        message: "Initializing Remotion 16:9 cinema render pipeline...",
        progress: 0.22,
      });

      const plannedTitle = topicTitle.trim() || selectedAudio.name.replace(/\.[^/.]+$/, "");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedAudio.name,
          contentType: selectedAudio.type || "audio/mpeg",
          mediaType: "audio",
          mode: "imageToVideoAi",
          topicTitle: plannedTitle,
          userId: user.id,
          uploadedImageKeys,
          customImageUrls: imageToVideoStockUrls.length > 0 ? imageToVideoStockUrls : undefined,
          assetMode: imageToVideoAssetMode,
          hasAiGeneratedImages: imageToVideoAssetMode === "ai-generate",
          visualStyle: imageToVideoVisualStyle,
          characterDnaHint: imageToVideoCharacterDnaHint,
          enableBgm: imageToVideoBgmEnabled,
          bgmUrl: imageToVideoBgmEnabled ? (bgmFile ? undefined : imageToVideoLibraryBgmUrl) : undefined,
          bgmKey: imageToVideoBgmEnabled && bgmKey ? bgmKey : undefined,
          bgmVolume: imageToVideoBgmEnabled ? bgmVolume : 0,
          subtitleStyle,
          cameraMotionPreset,
          fitMode,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Image to Video render job.");
      }

      const jobId = jobPayload.jobId;
      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 5. Poll Job Status
      setJobStatus({
        state: "rendering",
        message: "Remotion engine is syncing voiceover with scene cuts...",
        progress: 0.35,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 360; // 18 minutes max polling

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render timeout. Please check your Projects tab in a few minutes.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId)}&renderId=${encodeURIComponent(renderId)}&mode=imageToVideoAi`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : 0.4;

            if (serverState === "ready" && statusPayload.outputFile) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;

              const completedRender: RecentRender = {
                id: renderId,
                title: plannedTitle,
                mode: "imageToVideoAi",
                outputFile: statusPayload.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => [completedRender, ...prev]);

              setJobStatus({
                state: "ready",
                message: "Your cinematic 16:9 Image to Video is ready!",
                progress: 1,
                outputFile: statusPayload.outputFile,
                renderId,
                bucketName,
                title: plannedTitle,
              });

              // Save to history endpoint
              fetch("/api/reels/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  renderId,
                  bucketName,
                  mode: "imageToVideoAi",
                  title: plannedTitle,
                  outputFile: statusPayload.outputFile,
                  createdAt: new Date().toISOString(),
                  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                }),
              }).catch((e) => console.warn("Could not save history:", e));
            } else if (serverState === "error") {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;
              setJobStatus({
                state: "error",
                message: statusPayload.message || "Render failed during video generation.",
                diagnostics: statusPayload.diagnostics,
              });
            } else {
              setJobStatus((prev) => ({
                ...prev,
                state: "rendering",
                message: statusPayload.message || "Generating video frames and applying Ken Burns camera motion...",
                progress: Math.max(prev.progress || 0.35, currentProgress),
              }));
            }
          }
        } catch (pollErr) {
          console.warn("Polling error:", pollErr);
        }
      }, 3000);

    } catch (error: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: error?.message || "An unexpected error occurred during rendering.",
      });
    }
  }

  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  const downloadVideoDirectly = async (url: string, filename: string) => {
    try {
      setDownloadingUrl(url);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloadingUrl(null);
    }
  };

  const handleReset = () => {
    setJobStatus({ state: "idle" });
    setSelectedAudio(null);
    setImageFiles([]);
    setBgmFile(null);
  };

  const userRemainingCredits = billingEntitlement?.usage?.remaining ?? billingEntitlement?.monthlyVideoLimit ?? 0;
  const isWorking = jobStatus.state === "uploading" || jobStatus.state === "starting" || jobStatus.state === "rendering";
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <p className="text-sm font-semibold tracking-wide">Loading Image to Video AI Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090E]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Tools</span>
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <BrandLogo size="sm" showBadge={false} />

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-black text-purple-300">
              <Sparkles size={11} className="text-purple-400" />
              Dedicated Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-zinc-400">Balance:</span>
              <span className="text-white font-black">{billingEntitlement ? userRemainingCredits : "..."} Credits</span>
              <Link
                href="/pricing"
                className="ml-1 text-[11px] text-amber-400 hover:text-amber-300 underline font-black"
              >
                +Add
              </Link>
            </div>

            {/* View History Switcher */}
            <button
              onClick={() => setActiveTab((prev) => (prev === "studio" ? "history" : "studio"))}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "history"
                  ? "border-purple-500/50 bg-purple-500/20 text-white"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <History size={14} />
              <span className="hidden sm:inline">Recent Videos</span>
              {recentRenders.length > 0 && (
                <span className="rounded-full bg-purple-500 px-1.5 py-0.2 text-[10px] font-black text-white">
                  {recentRenders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Monitor View (When in progress or ready) */}
        {(isWorking || isReady || isError) ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1C1B1F] via-[#141218] to-[#0F0D13] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    isReady
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-purple-500/30 bg-purple-500/10 text-purple-400 animate-pulse"
                  }`}>
                    {isReady ? (
                      <CheckCircle2 size={24} />
                    ) : isError ? (
                      <AlertCircle size={24} />
                    ) : (
                      <Loader2 size={24} className="animate-spin" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">
                      {isReady ? "Render Complete" : isError ? "Render Alert" : "Live Render Monitor"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {jobStatus.title || "Image to Video AI Generation"}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">{jobStatus.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-black text-purple-300">
                    {isReady ? "100%" : isError ? "Failed" : `${Math.round((jobStatus.progress || 0.1) * 100)}%`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-8">
                <div className="h-3 w-full rounded-full bg-black/50 border border-white/10 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReady
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                        : isError
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"
                    }`}
                    style={{ width: `${Math.max(5, Math.round((jobStatus.progress || 0.1) * 100))}%` }}
                  />
                </div>
              </div>

              {/* 5-Step Visual Progress Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {RENDER_STEPS.map((step, idx) => {
                  const currentProg = jobStatus.progress || 0.1;
                  const isDone = isReady || currentProg >= step.threshold;
                  const isActive = !isReady && !isError && currentProg < step.threshold && (idx === 0 || currentProg >= RENDER_STEPS[idx - 1].threshold);
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDone
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                          : isActive
                            ? "border-purple-500/50 bg-purple-500/10 text-white shadow-lg shadow-purple-500/10"
                            : "border-white/5 bg-white/[0.02] text-zinc-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={15} className={isActive ? "text-purple-400 animate-pulse" : isDone ? "text-emerald-400" : "text-zinc-600"} />
                        <span className="text-xs font-black uppercase tracking-wider">{step.label}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{step.detail}</p>
                    </div>
                  );
                })}
              </div>

              {/* Ready Video Preview & Download */}
              {isReady && jobStatus.outputFile && (
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-black shadow-2xl">
                    <video
                      src={jobStatus.outputFile}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-black text-white">Your 16:9 Widescreen MP4 is Ready!</p>
                      <p className="text-xs text-zinc-400">Files are retained in your private cloud for 48 hours.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => downloadVideoDirectly(jobStatus.outputFile!, `itnavideo-cinematic-16x9-${Date.now()}.mp4`)}
                        disabled={downloadingUrl === jobStatus.outputFile}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-purple-500/25 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
                      >
                        {downloadingUrl === jobStatus.outputFile ? (
                          <>
                            <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Downloading MP4...</span>
                          </>
                        ) : (
                          <>
                            <Download size={15} />
                            <span>Download 1080p MP4</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-zinc-300 hover:text-white transition"
                      >
                        <RefreshCw size={14} />
                        <span>New Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Actions */}
              {isError && (
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-red-500/20">
                  <p className="text-xs text-red-300">Something went wrong during generation. Your credits were not deducted.</p>
                  <button
                    onClick={handleReset}
                    className="rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-5 py-2.5 text-xs font-black text-red-200 transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "history" ? (
          /* Recent Image to Video History Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Your Image to Video Projects</h2>
                <p className="text-xs text-zinc-400">Quickly download or view your generated 16:9 cinematic videos.</p>
              </div>
              <button
                onClick={() => setActiveTab("studio")}
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-black text-white transition"
              >
                <span>+ Create New Video</span>
              </button>
            </div>

            {recentRenders.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#141218] p-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Film size={26} />
                </div>
                <h3 className="text-base font-black text-white">No Image to Video creations yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Upload a voiceover and some images in the Studio to generate your first 16:9 widescreen video!
                </p>
                <button
                  onClick={() => setActiveTab("studio")}
                  className="rounded-full bg-purple-500 hover:bg-purple-600 px-6 py-2.5 text-xs font-black text-white transition"
                >
                  Open Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRenders.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-[#141218] overflow-hidden p-4 space-y-3 hover:border-purple-500/30 transition shadow-lg"
                  >
                    <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative">
                      <video src={item.outputFile} controls className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white truncate">{item.title || "Cinematic 16:9 Video"}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Created {new Date(item.createdAt).toLocaleDateString()} • Retained for 48h
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadVideoDirectly(item.outputFile, `itnavideo-cinematic-${item.id}.mp4`)}
                      disabled={downloadingUrl === item.outputFile}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-purple-500 px-3 py-2 text-xs font-black text-white transition cursor-pointer disabled:opacity-50"
                    >
                      {downloadingUrl === item.outputFile ? (
                        <>
                          <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download size={13} />
                          <span>Download MP4</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Main Studio Form */
          <ImageToVideoStudio
            selectedAudio={selectedAudio}
            onSelectAudio={setSelectedAudio}
            imageFiles={imageFiles}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            assetSourceMode={imageToVideoAssetMode}
            onChangeAssetSourceMode={setImageToVideoAssetMode}
            selectedStockAssetUrls={imageToVideoStockUrls}
            onChangeSelectedStockAssetUrls={setImageToVideoStockUrls}
            visualStyle={imageToVideoVisualStyle}
            onChangeVisualStyle={setImageToVideoVisualStyle}
            characterImageFile={imageToVideoCharacterFile}
            onSelectCharacterImage={setImageToVideoCharacterFile}
            characterDnaHint={imageToVideoCharacterDnaHint}
            onChangeCharacterDnaHint={setImageToVideoCharacterDnaHint}
            bgmEnabled={imageToVideoBgmEnabled}
            onChangeBgmEnabled={setImageToVideoBgmEnabled}
            selectedLibraryBgmUrl={imageToVideoLibraryBgmUrl}
            onChangeSelectedLibraryBgmUrl={setImageToVideoLibraryBgmUrl}
            bgmFile={bgmFile}
            onSelectBgm={setBgmFile}
            bgmVolume={bgmVolume}
            onChangeBgmVolume={setBgmVolume}
            topicTitle={topicTitle}
            onChangeTopicTitle={setTopicTitle}
            subtitleStyle={subtitleStyle}
            onChangeSubtitleStyle={setSubtitleStyle}
            cameraMotionPreset={cameraMotionPreset}
            onChangeCameraMotionPreset={setCameraMotionPreset}
            fitMode={fitMode}
            onChangeFitMode={setFitMode}
            isRendering={isWorking}
            onStartRender={handleStartRender}
            userCredits={userRemainingCredits}
            estimatedDurationSeconds={estimatedDurationSeconds}
            audioCleanOptions={audioCleanOptions}
            setAudioCleanOptions={setAudioCleanOptions}
            userId={user?.id}
          />
        )}
      </main>
    </div>
  );
}
