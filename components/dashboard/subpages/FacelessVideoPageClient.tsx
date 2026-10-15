"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { FacelessVideoStudio } from "@/components/dashboard/FacelessVideoStudio";
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
  Clapperboard,
  Layers,
  Tv,
  X,
  Play,
  HelpCircle,
  Clock,
} from "lucide-react";
import CinematicRenderProgress from "@/components/dashboard/CinematicRenderProgress";


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
  { id: 3, name: "Rendering high-definition video", detail: "Composing 1080p widescreen video frames and motion transitions", minProgress: 0.55 },
  { id: 4, name: "Final quality checks & audio mastering", detail: "Ducking background score and verifying synchronization", minProgress: 0.90 },
];

const FACELESS_RENDER_STEPS = [
  { label: "Voiceover & Narration Ingest", detail: "Groq Whisper neural speech alignment & cadence", threshold: 0.15, icon: Upload },
  { label: "AI Scene Pacing & Storyboard", detail: "Structuring visual narrative beats & hook retention", threshold: 0.40, icon: Sparkles },
  { label: "Matching Cinematic B-Roll & SFX", detail: "Assembling high-definition video footage & ambient beds", threshold: 0.70, icon: Layers },
  { label: "1080p Cloud Composition & Mastering", detail: "AWS Lambda 30 FPS rendering & audio ducking", threshold: 0.95, icon: Film },
];


type JobStatus = {
  state: "idle" | "uploading" | "planning" | "rendering" | "ready" | "error" | "cancelled";
  message?: string;
  progress?: number; // 0 to 1, or undefined when indeterminate
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

export default function FacelessVideoPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio configuration states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [facelessImageFiles, setFacelessImageFiles] = useState<File[]>([]);
  const [assetSourceMode, setAssetSourceMode] = useState<"library" | "upload" | "mix">("library");
  const [topicTitle, setTopicTitle] = useState("");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "none">("mystery");
  const [facelessBgmVolume, setFacelessBgmVolume] = useState(0.15);
  const [facelessPacingStyle, setFacelessPacingStyle] = useState<"clean" | "cinematic" | "documentary" | "dynamic">("cinematic");
  const [facelessEnableSfx, setFacelessEnableSfx] = useState<boolean>(true);
  const [subtitleStyle, setSubtitleStyle] = useState<string>("netflix-yellow");
  const [visualArtStyle, setVisualArtStyle] = useState<"realistic" | "3d" | "2d">("realistic");
  const [backgroundTheme, setBackgroundTheme] = useState<string>("studio-white");

  // Job, billing and render history
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Time tracker for accurate ETA
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlanningAudio, setIsPlanningAudio] = useState(false);

  // In-flight guard
  const renderRequestInFlightRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
    }
  }, [user, authLoading, router]);

  // 2. Fetch billing entitlement
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
            ...ent,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Failed to load billing status:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // 3. Load saved finished renders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("itnavideo_faceless_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((r) => r.expiresAt > Date.now());
          setRecentRenders(valid);
        }
      }
    } catch {}
  }, []);

  // 4. Persistence across page refreshes: Restore in-progress render if active
  useEffect(() => {
    if (!user) return;
    try {
      const savedActive = localStorage.getItem("itnavideo_faceless_active_job");
      if (savedActive) {
        const active = JSON.parse(savedActive);
        if (active && active.renderId && active.bucketName) {
          const startedAt = active.startedAt || Date.now();
          setJobStatus({
            state: "rendering",
            message: "Reconnecting to active render job...",
            renderId: active.renderId,
            bucketName: active.bucketName,
            title: active.title || "Faceless Video",
            startedAt,
          });
          startPolling(active.renderId, active.bucketName, active.title || "Faceless Video", startedAt);
        }
      }
    } catch (err) {
      console.warn("Could not restore active job from localStorage:", err);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [user]);

  // 5. Live elapsed seconds timer during render
  useEffect(() => {
    if (jobStatus.state !== "rendering" || !jobStatus.startedAt) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - (jobStatus.startedAt || Date.now())) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state, jobStatus.startedAt]);

  // Presigned S3 file upload helper
  async function uploadFileViaPresign(file: File, folderMode: string, userId: string): Promise<string> {
    const presignRes = await fetch("/api/reels/jobs/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "audio/mpeg",
        mode: folderMode,
        userId,
      }),
    });

    const presignPayload = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presignPayload.ok || !presignPayload.uploadUrl || !presignPayload.key) {
      throw new Error(presignPayload.error || "Failed to generate presigned upload URL.");
    }

    const uploadRes = await fetch(presignPayload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "audio/mpeg" },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Direct upload failed (${uploadRes.status}). Please check network connectivity.`);
    }

    return presignPayload.key;
  }

  // Helper to convert mediaKey into a readable cloud URL
  async function getReadUrlFromKey(key: string): Promise<string> {
    // If key is already a full URL, return it
    if (/^https?:\/\//i.test(key)) return key;

    const res = await fetch("/api/reels/jobs/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: key.split("/").pop() || "media.mp3",
        mode: "facelessVideo",
        action: "read",
        key,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    return payload.readUrl || payload.uploadUrl?.split("?")[0] || key;
  }

  // ── STEP 1 -> 2: Plan & Transcribe Handler ──
  const handleTranscribeAndPlan = async (audioFile: File) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
      return null;
    }

    setIsPlanningAudio(true);
    try {
      setJobStatus({
        state: "planning",
        message: "Uploading voiceover safely to cloud storage...",
      });

      // 1. Direct cloud upload voiceover
      const mediaKey = await uploadFileViaPresign(audioFile, "facelessVideo", user.id);
      const audioUrl = await getReadUrlFromKey(mediaKey);

      // 2. Upload any selected user images
      const uploadedImageUrls: string[] = [];
      if (facelessImageFiles.length > 0 && assetSourceMode !== "library") {
        for (const img of facelessImageFiles) {
          const imgKey = await uploadFileViaPresign(img, "facelessVideo", user.id);
          const imgUrl = await getReadUrlFromKey(imgKey);
          uploadedImageUrls.push(imgUrl);
        }
      }

      setJobStatus({
        state: "planning",
        message: "Speech AI transcribing voiceover and planning scenes...",
      });

      // 3. Call dedicated plan endpoint
      const planRes = await fetch("/api/reels/plan-faceless-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl,
          mediaKey,
          topicTitle,
          assetMode: assetSourceMode,
          visualArtStyle,
          uploadedImageUrls,
          backgroundTheme,
        }),
      });

      const planPayload = await planRes.json().catch(() => ({}));
      if (!planRes.ok || !planPayload.ok) {
        throw new Error(planPayload.error || "Failed to transcribe speech or generate scene plan.");
      }

      setJobStatus({ state: "idle" });

      return {
        transcript: planPayload.transcript,
        segments: planPayload.segments,
        words: planPayload.words,
        sceneBlueprint: planPayload.sceneBlueprint,
        brollUrls: planPayload.brollUrls,
        durationSeconds: planPayload.durationSeconds,
        warnings: planPayload.warnings,
      };
    } catch (err: any) {
      console.error("[PLAN_ERROR]", err);
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to transcribe audio. Please ensure the file contains clear speech.",
      });
      return null;
    } finally {
      setIsPlanningAudio(false);
    }
  };

  // ── STEP 3 -> 4: Start Render Job with Approved Storyboard ──
  const handleStartRender = async (storyboardPayload?: any) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Staging confirmed storyboard for cloud rendering...",
      });

      // 1. Upload audio if not already done
      const mediaKey = await uploadFileViaPresign(selectedFile, "facelessVideo", user.id);

      const uploadedImageKeys: string[] = [];
      if (facelessImageFiles.length > 0 && assetSourceMode !== "library") {
        for (const img of facelessImageFiles) {
          const key = await uploadFileViaPresign(img, "facelessVideo", user.id);
          uploadedImageKeys.push(key);
        }
      }

      const plannedTitle =
        storyboardPayload?.topicTitle ||
        topicTitle.trim() ||
        selectedFile.name.replace(/\.[^/.]+$/, "");

      const audioDuration = storyboardPayload?.durationSeconds || 60;

      // 2. Submit Render Job with Approved Storyboard Blueprint
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "facelessVideo",
          subtitleStyle: storyboardPayload?.subtitleStyle || subtitleStyle,
          uploadedImageKeys,
          assetMode: assetSourceMode,
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          facelessBgmMood: storyboardPayload?.facelessBgmMood || facelessBgmMood,
          facelessBgmVolume: storyboardPayload?.facelessBgmVolume ?? facelessBgmVolume,
          facelessPacingStyle,
          facelessEnableSfx: storyboardPayload?.facelessEnableSfx ?? facelessEnableSfx,
          aspectRatio: "16:9",
          durationSeconds: audioDuration,
          sourceDurationSeconds: audioDuration,
          mediaAspect: "landscape",
          backgroundTheme: storyboardPayload?.backgroundTheme || backgroundTheme,
          visualArtStyle: storyboardPayload?.visualArtStyle || visualArtStyle,
          // Pass user-confirmed storyboard data
          sceneBlueprint: storyboardPayload?.sceneBlueprint,
          brollUrls: storyboardPayload?.brollUrls,
          approvedCaptions: storyboardPayload?.approvedCaptions,
          transcript: storyboardPayload?.transcript,
          frameRange: audioDuration > 0 ? [0, Math.min(18000, Math.round(audioDuration * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Faceless Video render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;
      const startedAt = Date.now();

      // Persist active job in localStorage for page refresh protection
      try {
        localStorage.setItem(
          "itnavideo_faceless_active_job",
          JSON.stringify({
            renderId,
            bucketName,
            title: plannedTitle,
            startedAt,
            durationSeconds: audioDuration,
          })
        );
      } catch {}

      setJobStatus({
        state: "rendering",
        message: "Initializing render cluster and aligning scene timelines...",
        renderId,
        bucketName,
        title: plannedTitle,
        startedAt,
      });

      startPolling(renderId, bucketName, plannedTitle, startedAt);
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit faceless video job.",
      });
    }
  };

  // ── Polling Engine: Queries backend progress reliably ──
  const startPolling = (renderId: string, bucketName: string, title: string, startedAt: number) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let attempts = 0;
    const MAX_ATTEMPTS = 600; // ~35 minutes polling limit

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        renderRequestInFlightRef.current = false;
        localStorage.removeItem("itnavideo_faceless_active_job");
        setJobStatus({
          state: "error",
          message: "Render took longer than expected. Please check back shortly or retry.",
        });
        return;
      }

      try {
        const params = new URLSearchParams({
          renderId,
          bucketName,
          userId: user?.id || "",
          mode: "facelessVideo",
          title,
          attempt: String(attempts),
        });

        const statusRes = await fetch(`/api/reels/jobs/status?${params.toString()}`);
        const statusPayload = await statusRes.json().catch(() => ({}));

        if (!statusRes.ok || !statusPayload.ok) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          localStorage.removeItem("itnavideo_faceless_active_job");
          setJobStatus({
            state: "error",
            message: statusPayload.error || "Unable to check rendering progress.",
          });
          return;
        }

        // 1. Check if job was cancelled
        if (statusPayload.state === "cancelled") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          localStorage.removeItem("itnavideo_faceless_active_job");
          setJobStatus({
            state: "cancelled",
            message: "Render process was cancelled.",
          });
          return;
        }

        // 2. Check for fatal errors
        const renderErrors = statusPayload.errors || [];
        const hasFatalError =
          statusPayload.state === "error" ||
          (renderErrors.length > 0 && !statusPayload.isRetrying);

        if (hasFatalError) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          localStorage.removeItem("itnavideo_faceless_active_job");
          const errorMsg = renderErrors[0]?.message || statusPayload.error || "Video rendering failed. Reserved credits were refunded.";
          setJobStatus({
            state: "error",
            message: errorMsg,
          });
          return;
        }

        // 3. Check completion
        const isComplete =
          (statusPayload.state === "ready" || statusPayload.state === "done" || Boolean(statusPayload.done)) &&
          Boolean(statusPayload.outputFile);

        if (isComplete) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          renderRequestInFlightRef.current = false;
          localStorage.removeItem("itnavideo_faceless_active_job");

          const finishedRender: RecentRender = {
            id: renderId,
            title,
            mode: "facelessVideo",
            outputFile: statusPayload.outputFile,
            createdAt: Date.now(),
            expiresAt: Date.now() + 48 * 60 * 60 * 1000,
          };

          setRecentRenders((prev) => {
            const updated = [finishedRender, ...prev.filter((r) => r.id !== renderId)];
            localStorage.setItem("itnavideo_faceless_projects", JSON.stringify(updated.slice(0, 30)));
            return updated;
          });

          setJobStatus({
            state: "ready",
            message: "Your 1080p Faceless Video is ready!",
            progress: 1,
            outputFile: statusPayload.outputFile,
            title,
          });

          // Refresh credit balance
          if (user?.id) {
            fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user.id)}`)
              .then((r) => r.json())
              .then((payload) => {
                if (payload.ok && payload.entitlement) {
                  setBillingEntitlement((curr) =>
                    curr
                      ? {
                          ...curr,
                          usage: payload.usage
                            ? {
                                used: payload.usage.used,
                                limit: payload.usage.limit,
                                remaining: payload.usage.remaining,
                              }
                            : curr.usage,
                        }
                      : null
                  );
                }
              })
              .catch(() => {});
          }

          return;
        }

        // 4. Update ongoing progress (using real backend progress only)
        const realProgress =
          typeof statusPayload.progress === "number" && statusPayload.progress > 0
            ? Math.min(0.99, Math.max(0, statusPayload.progress))
            : undefined;

        // Determine current production stage
        let activeStage = PRODUCTION_STAGES[0].name;
        if (realProgress !== undefined) {
          for (let s = PRODUCTION_STAGES.length - 1; s >= 0; s--) {
            if (realProgress >= PRODUCTION_STAGES[s].minProgress) {
              activeStage = PRODUCTION_STAGES[s].name;
              break;
            }
          }
        }

        setJobStatus({
          state: "rendering",
          message: activeStage,
          progress: realProgress,
          renderId,
          bucketName,
          title,
          startedAt,
          stageName: activeStage,
        });
      } catch (err) {
        console.warn("Poll connection check:", err);
      }
    }, 3500);
  };

  // ── Cancel Render Handler ──
  const handleConfirmCancel = async () => {
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

      localStorage.removeItem("itnavideo_faceless_active_job");
      setJobStatus({
        state: "cancelled",
        message: "Video rendering was cancelled. Reserved credits were refunded.",
      });
      setShowCancelModal(false);
    } catch {
      setShowCancelModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  // Calculate reliable remaining ETA (only when progress is verified positive)
  const calculateEtaSeconds = (): number | null => {
    if (jobStatus.progress === undefined || jobStatus.progress < 0.05 || elapsedSeconds < 5) {
      return null;
    }
    const estimatedTotal = elapsedSeconds / jobStatus.progress;
    const remaining = Math.max(1, Math.round(estimatedTotal - elapsedSeconds));
    return remaining;
  };

  const etaSeconds = calculateEtaSeconds();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900">
      {/* ── TOP NAVIGATION ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 shadow-2xs"
              title="Return to Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>
            <BrandLogo />
          </div>

          <div className="flex items-center gap-3">
            {billingEntitlement && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                <Zap size={13} className="text-[#FF5722]" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Badging */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs mb-1.5">
              <Sparkles size={12} className="text-[#FF5722]" />
              <span>Flagship Widescreen Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Faceless Video Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create professional 1080p Full HD widescreen YouTube videos from narration audio with automatic B-roll, subtitles, and music.
            </p>
          </div>
        </div>

        {/* ── PRODUCTION RENDERING SCREEN (ZERO BLUE, ENGAGING CREATOR TIPS & EQUALIZER) ── */}
        {(jobStatus.state === "uploading" || jobStatus.state === "planning" || jobStatus.state === "rendering" || jobStatus.state === "error") && (
          <CinematicRenderProgress
            title={jobStatus.title || "Faceless Video Generation"}
            subtitle="Our cloud engine is aligning scene beats, assembling visuals, and mastering audio for your 16:9 widescreen video."
            modeLabel="16:9 Faceless Video Studio"
            progress={jobStatus.progress}
            isIndeterminate={jobStatus.progress === undefined}
            statusMessage={jobStatus.message}
            elapsedSeconds={elapsedSeconds}
            estimatedRemainingSeconds={etaSeconds}
            steps={FACELESS_RENDER_STEPS}
            isError={jobStatus.state === "error"}
            errorMessage={jobStatus.message}
            onRetry={() => handleStartRender()}
            onReset={() => setJobStatus({ state: "idle" })}
            onCancel={() => setShowCancelModal(true)}
            cancelLabel="Cancel Video"
            showTipsCarousel={true}
          />
        )}


        {/* ── CANCELLED STATE ── */}
        {jobStatus.state === "cancelled" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900">Process Cancelled</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Video generation was cancelled. Any reserved credits have been released back to your balance.
            </p>
            <button
              type="button"
              onClick={() => setJobStatus({ state: "idle" })}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Return to Studio
            </button>
          </div>
        )}

        {/* ── READY VIDEO STATE (1080p PLAYER & DOWNLOAD) ── */}
        {jobStatus.state === "ready" && jobStatus.outputFile && (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={13} />
                  <span>1080p Full HD Video Ready</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{jobStatus.title || "Faceless Video"}</h3>
              </div>
              <a
                href={jobStatus.outputFile}
                download
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 transition cursor-pointer"
              >
                <Download size={14} />
                <span>Download MP4</span>
              </a>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-sm">
              <video
                src={jobStatus.outputFile}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Aspect Ratio: 16:9 Widescreen (1920×1080)</span>
              <button
                type="button"
                onClick={() => setJobStatus({ state: "idle" })}
                className="text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Create Another Video
              </button>
            </div>
          </div>
        )}

        {/* ── STUDIO WIZARD (Visible when idle) ── */}
        {jobStatus.state === "idle" && (
          <FacelessVideoStudio
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            topicTitle={topicTitle}
            onTopicTitleChange={setTopicTitle}
            subtitleStyle={subtitleStyle}
            onSubtitleStyleChange={setSubtitleStyle}
            facelessBgmMood={facelessBgmMood}
            onBgmMoodChange={setFacelessBgmMood}
            facelessBgmVolume={facelessBgmVolume}
            onBgmVolumeChange={setFacelessBgmVolume}
            facelessPacingStyle={facelessPacingStyle}
            onPacingStyleChange={setFacelessPacingStyle}
            facelessEnableSfx={facelessEnableSfx}
            onEnableSfxChange={setFacelessEnableSfx}
            visualArtStyle={visualArtStyle}
            onVisualArtStyleChange={setVisualArtStyle}
            backgroundTheme={backgroundTheme}
            onBackgroundThemeChange={setBackgroundTheme}
            assetSourceMode={assetSourceMode}
            onAssetSourceModeChange={setAssetSourceMode}
            uploadedImageFiles={facelessImageFiles}
            onUploadedImageFilesChange={setFacelessImageFiles}
            onTranscribeAndPlan={handleTranscribeAndPlan}
            isPlanning={isPlanningAudio}
            onGenerate={handleStartRender}
            isGenerating={false}
            renderedVideoUrl={jobStatus.outputFile}
          />
        )}

        {/* ── RECENT RENDERS ARCHIVE ── */}
        {recentRenders.length > 0 && jobStatus.state === "idle" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Recent Faceless Videos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentRenders.map((render) => (
                <div
                  key={render.id}
                  className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate">{render.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(render.createdAt).toLocaleDateString()} · 16:9 1080p
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <a
                      href={render.outputFile}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <Play size={12} />
                      <span>Preview</span>
                    </a>
                    <a
                      href={render.outputFile}
                      download
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5722] hover:text-[#E64A19]"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CANCEL CONFIRMATION MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Cancel Video Generation?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel? The render job will stop immediately and any reserved credits will be refunded to your account balance.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Keep Rendering
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
