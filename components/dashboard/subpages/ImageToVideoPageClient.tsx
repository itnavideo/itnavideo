"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { ImageToVideoStudio, ITNAVIDEO_LIBRARY_BGM, type ImageToVideoAssetMode } from "@/components/dashboard/ImageToVideoStudio";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Film,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Layers3,
  Upload,
  Clapperboard,
  History,
  Clock,
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
  const [imagePhrases, setImagePhrases] = useState<string[]>([]);
  const [imageToVideoAssetMode, setImageToVideoAssetMode] = useState<ImageToVideoAssetMode>("library");
  const [imageToVideoStockUrls, setImageToVideoStockUrls] = useState<string[]>([]);
  const [imageToVideoAiImageUrls, setImageToVideoAiImageUrls] = useState<string[]>([]);
  const [imageToVideoVisualStyle, setImageToVideoVisualStyle] = useState<"2d" | "realistic">("realistic");
  const [imageToVideoCharacterFile, setImageToVideoCharacterFile] = useState<File | null>(null);
  const [imageToVideoCharacterDnaHint, setImageToVideoCharacterDnaHint] = useState<string>("");

  const [imageToVideoBgmEnabled, setImageToVideoBgmEnabled] = useState<boolean>(true);
  const [imageToVideoLibraryBgmUrl, setImageToVideoLibraryBgmUrl] = useState<string>(
    ITNAVIDEO_LIBRARY_BGM && ITNAVIDEO_LIBRARY_BGM.length > 0 ? ITNAVIDEO_LIBRARY_BGM[0].url : "/assets/reusable/sfx/chime.mp3"
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
  const [renderStartedAt, setRenderStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);

  const renderRequestInFlightRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Process Cancel Handler (Abort network requests & release server credits)
  const handleCancelProcess = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (jobStatus.renderId) {
      try {
        await fetch('/api/reels/jobs/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            renderId: jobStatus.renderId,
            userId: user?.id,
          }),
        });
      } catch (err) {
        console.warn('[CANCEL_PROCESS_FETCH_ERR]', err);
      }
    }

    renderRequestInFlightRef.current = false;
    setJobStatus({ state: 'idle' });
    setRenderStartedAt(null);
    setElapsedSeconds(0);
  };

  // Top Back Navigation Handler with Exit Confirmation
  const handleBackClick = () => {
    const isProcessActive = jobStatus.state === 'uploading' || jobStatus.state === 'starting' || jobStatus.state === 'rendering' || selectedAudio !== null;
    if (isProcessActive) {
      setShowExitConfirmModal(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleConfirmExit = async () => {
    await handleCancelProcess();
    setShowExitConfirmModal(false);
    router.push('/dashboard');
  };

  // Live timer tick during render
  useEffect(() => {
    const isRendering = jobStatus.state === "uploading" || jobStatus.state === "starting" || jobStatus.state === "rendering";
    if (!isRendering || !renderStartedAt) {
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - renderStartedAt) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state, renderStartedAt]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const estimatedMinutes = Math.max(5, Math.min(15, Math.ceil((estimatedDurationSeconds || 720) / 60) + (imageFiles.length > 20 ? 3 : 1)));
  const estimatedTotalSecs = estimatedMinutes * 60;
  const remainingSeconds = Math.max(5, estimatedTotalSecs - elapsedSeconds);
  const formatRemainingTime = (secs: number) => {
    if (secs <= 10) return "Finalizing 1080p MP4...";
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return mins > 0 ? `~${mins} min ${s > 0 ? `${s}s` : ""}` : `~${s}s`;
  };

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

  // Load recent renders for user (from localStorage + server history)
  useEffect(() => {
    // 1. Initial immediate restore from localStorage
    try {
      const saved = localStorage.getItem("itnavideo_image_to_video_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentRenders(parsed);
        }
      }
    } catch {}

    // 2. Fetch from database if user is logged in
    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          const itvRenders: RecentRender[] = payload.renders.filter(
            (r: RecentRender) =>
              r.mode === "imageToVideoAi" ||
              r.mode === "image-to-video" ||
              r.mode === "IMAGE_TO_VIDEO_AI" ||
              r.mode === "imagetovideo"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            // Keep local items
            prev.forEach((item) => {
              if (item && item.id) map.set(item.id, item);
            });
            // Merge remote items
            itvRenders.forEach((item) => {
              if (item && item.id) map.set(item.id, item);
            });
            const merged = Array.from(map.values()).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
            try {
              localStorage.setItem("itnavideo_image_to_video_projects", JSON.stringify(merged.slice(0, 30)));
            } catch {}
            return merged;
          });
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
        setEstimatedDurationSeconds(Math.min(Math.round(audio.duration), 12 * 60));
      }
      URL.revokeObjectURL(audioUrl);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
    };
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [selectedAudio]);

  // Handlers for image files
  const handleAddImages = (files: File[] | FileList | null) => {
    if (!files) return;
    const newFiles = Array.isArray(files) ? files : Array.from(files);
    if (newFiles.length === 0) return;
    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePhrases((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
  async function handleStartRender(previewScenes?: any[]) {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/image-to-video");
      return;
    }
    if (!selectedAudio) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if ((imageToVideoAssetMode === "upload" || imageToVideoAssetMode === "mix") && imageFiles.length === 0) {
      alert("Please upload at least one image, or choose Itnavideo Assets.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    try {
      setRenderStartedAt(Date.now());
      setElapsedSeconds(0);
      setJobStatus({
        state: "uploading",
        message: "Uploading voiceover audio and scene images securely...",
        progress: 0.05,
      });

      // 1. Upload audio file
      const mediaKey = await uploadFileViaPresign(selectedAudio, "imageToVideoAi", user.id);

      // 2. Upload images whenever the user has added any
      let uploadedImageKeys: string[] = [];
      let uploadedImageAnchors: { url: string; targetPhrase: string }[] = [];
      if (imageFiles.length > 0) {
        setJobStatus({
          state: "uploading",
          message: `Uploading ${imageFiles.length} scene image${imageFiles.length > 1 ? "s" : ""}...`,
          progress: 0.12,
        });
        uploadedImageKeys = await uploadImagesBatch(imageFiles, "imageToVideoAi", user.id);
        uploadedImageAnchors = uploadedImageKeys.map((key, idx) => ({
          url: key,
          targetPhrase: imagePhrases[idx] || ""
        }));
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

      const plannedTitle = topicTitle.trim() || 'Image to Video AI';

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: currentSignal,
        body: JSON.stringify({
          mediaKey,
          fileName: selectedAudio.name,
          contentType: selectedAudio.type || "audio/mpeg",
          mediaType: "audio",
          mode: "imageToVideoAi",
          topicTitle: plannedTitle,
          userId: user.id,
          uploadedImageKeys,
          uploadedImageAnchors,
          previewScenes: previewScenes || undefined,
          customImageUrls: (() => {
            if (Array.isArray(previewScenes) && previewScenes.length > 0) {
              const urls = previewScenes.map((s: any) => s.imageUrl || s.url).filter(Boolean);
              if (urls.length > 0) return urls;
            }
            if (imageToVideoAssetMode === "ai-generate" && imageToVideoAiImageUrls.length > 0) {
              return imageToVideoAiImageUrls;
            }
            if (imageToVideoAssetMode === "upload") return undefined;
            if (imageToVideoStockUrls.length > 0) {
              return imageToVideoStockUrls;
            }
            return undefined;
          })(),
          assetMode: (Array.isArray(previewScenes) && previewScenes.length > 0) ? "ai-generate" : imageToVideoAssetMode,
          blendStockAssets: imageToVideoAssetMode !== "upload",
          hasAiGeneratedImages: (Array.isArray(previewScenes) && previewScenes.length > 0) || (imageToVideoAssetMode === "ai-generate" && imageToVideoAiImageUrls.length > 0),
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
      const MAX_ATTEMPTS = 800; // ~40 minutes max polling for 12-minute 1080p Full HD renders with 100+ images

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Your 1080p video is still processing in the cloud; please check your Projects tab shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId)}&renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&title=${encodeURIComponent(plannedTitle)}&mode=imageToVideoAi`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : 0.4;

            const isRenderComplete = (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) && Boolean(statusPayload.outputFile);
            if (isRenderComplete) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;

              const completedRender: RecentRender = {
                id: renderId,
                title: plannedTitle || "Cinematic 16:9 Video",
                mode: "imageToVideoAi",
                outputFile: statusPayload.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const next = [completedRender, ...prev.filter((r) => r.id !== renderId)];
                try {
                  localStorage.setItem("itnavideo_image_to_video_projects", JSON.stringify(next.slice(0, 30)));
                } catch {}
                return next;
              });

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

  const userRemainingCredits = billingEntitlement?.active
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;
  const isWorking = jobStatus.state === "uploading" || jobStatus.state === "starting" || jobStatus.state === "rendering";
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6D00]" />
        <p className="text-sm font-semibold tracking-wide text-slate-600">Loading Image to Video AI Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col selection:bg-[#FF6D00]/20 selection:text-[#FF6D00]">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Tools</span>
            </Link>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            <BrandLogo size="sm" showBadge={false} />

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF6D00]">
              <Sparkles size={11} className="text-[#FF6D00]" />
              Dedicated Studio
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-sm text-zinc-200">
              <Zap size={14} className="text-[#FF6D00] fill-[#FF6D00]" />
              <span className="text-zinc-400 hidden xs:inline">Balance:</span>
              <span className="text-white font-black">{billingEntitlement ? userRemainingCredits : "..."} Cr</span>
              <Link
                href="/pricing"
                className="ml-0.5 text-[11px] text-[#FF6D00] hover:text-[#FFA726] underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {(isWorking || isReady || isError) ? (
          /* Render Monitor View (When in progress or ready) */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    isReady
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] animate-pulse"
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#FF9100]">
                      {isReady ? "Render Complete" : isError ? "Render Alert" : "Live Render Monitor"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {jobStatus.title || "Image to Video AI Generation"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span>{jobStatus.message}</span>
                      {isWorking && (
                        <>
                          <span className="text-white/20">•</span>
                          <span className="text-amber-300/90 font-medium">
                            Takes ~{estimatedMinutes} min for {imageFiles.length > 0 ? `${imageFiles.length} images` : "large image sets"} &amp; 12 min video
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  {isWorking && (
                    <>
                      <div className="flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/15 px-3 py-1.5 text-xs font-bold text-[#FFA726] shadow-md">
                        <Clock size={13} className="text-[#FF9100] animate-pulse" />
                        <span>⏱️ Elapsed: <span className="font-mono text-white">{formatTimer(elapsedSeconds)}</span></span>
                        <span className="text-white/20">•</span>
                        <span>Rem: <span className="font-mono text-amber-300">{formatRemainingTime(remainingSeconds)}</span></span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelProcess}
                        className="px-3.5 py-1.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ml-1"
                      >
                        <RefreshCw size={12} className="text-red-400" />
                        <span>Cancel Process</span>
                      </button>
                    </>
                  )}
                  {isReady && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-400">
                      1080p Ready ✓
                    </span>
                  )}
                  {isError && (
                    <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-black text-red-400">
                      Failed
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Time Tracker */}
              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-1">
                  <span>{isReady ? "Export Completed" : isError ? "Render Paused" : "Rendering 1080p Full HD Video..."}</span>
                  <span className="font-mono text-amber-400">
                    {isReady ? "Ready" : isError ? "Alert" : `⏱️ ${formatTimer(elapsedSeconds)} / ~${estimatedMinutes}m`}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-black/50 border border-white/10 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReady
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                        : isError
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726]"
                    }`}
                    style={{ width: `${Math.max(5, Math.min(98, Math.round(((elapsedSeconds / (estimatedTotalSecs || 600)) * 90) + 10)))}%` }}
                  />
                </div>
              </div>

              {/* 5-Step Visual Progress Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {RENDER_STEPS.map((step, idx) => {
                  const currentProg = jobStatus.progress || 0.1;
                  const isDone = isReady || currentProg >= step.threshold;
                  const isActive = !isReady && !isError && currentProg < step.threshold && (idx === 0 || currentProg >= RENDER_STEPS[idx - 1].threshold);
                  const Icon = step?.icon || Sparkles;

                  return (
                    <div
                      key={step.label}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDone
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                          : isActive
                            ? "border-[#FF6D00]/50 bg-[#FF6D00]/10 text-white shadow-lg shadow-[#FF6D00]/10"
                            : "border-white/5 bg-white/[0.02] text-zinc-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={15} className={isActive ? "text-[#FF9100] animate-pulse" : isDone ? "text-emerald-400" : "text-zinc-600"} />
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
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#FF6D00]/40 bg-black shadow-2xl">
                    <video
                      src={jobStatus.outputFile}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#070B14] border border-white/10">
                    <div>
                      <p className="text-base font-black text-white">Your 16:9 Widescreen MP4 is Ready!</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Files are retained in your private cloud for 48 hours.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => downloadVideoDirectly(jobStatus.outputFile!, `itnavideo-cinematic-16x9-${Date.now()}.mp4`)}
                        disabled={downloadingUrl === jobStatus.outputFile}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-6 py-3.5 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
                      >
                        {downloadingUrl === jobStatus.outputFile ? (
                          <>
                            <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Downloading MP4...</span>
                          </>
                        ) : (
                          <>
                            <Download size={16} className="text-black" />
                            <span>Download 1080p MP4</span>
                          </>
                        )}
                      </button>

                      <a
                        href={jobStatus.outputFile}
                        download={`itnavideo-cinematic-16x9-${Date.now()}.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-xs font-bold text-zinc-300 hover:text-white transition"
                        title="Direct Download Link"
                      >
                        <Download size={14} className="text-[#FF9100]" />
                        <span>Direct Link</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-xs font-bold text-zinc-300 hover:text-white transition"
                      >
                        <Film size={14} className="text-[#FF9100]" />
                        <span>View in Projects</span>
                      </button>

                      <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-xs font-bold text-zinc-300 hover:text-white transition"
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
        ) : (
          /* Main Studio Form */
          <ImageToVideoStudio
            selectedAudio={selectedAudio}
            onSelectAudio={setSelectedAudio}
            imageFiles={imageFiles}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            imagePhrases={imagePhrases}
            onChangeImagePhrase={(idx, val) => {
              setImagePhrases((prev) => {
                const copy = [...prev];
                copy[idx] = val;
                return copy;
              });
            }}
            assetSourceMode={imageToVideoAssetMode}
            onChangeAssetSourceMode={setImageToVideoAssetMode}
            selectedStockAssetUrls={imageToVideoStockUrls}
            onChangeSelectedStockAssetUrls={setImageToVideoStockUrls}
            aiGeneratedImageUrls={imageToVideoAiImageUrls}
            onChangeAiGeneratedImageUrls={setImageToVideoAiImageUrls}
            visualStyle={imageToVideoVisualStyle}
            onChangeVisualStyle={(val: string) => setImageToVideoVisualStyle(val as any)}
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

      {/* ── Exit Confirmation Modal ── */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Exit Studio?</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Are you sure you want to exit? Your current upload &amp; generation progress will be discarded.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-zinc-300 hover:bg-white/10 transition cursor-pointer"
              >
                Stay in Studio
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-xs font-black text-white shadow-lg shadow-red-600/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                Discard &amp; Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
