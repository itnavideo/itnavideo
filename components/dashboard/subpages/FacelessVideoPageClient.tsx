"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { FacelessVideoStudio } from "@/components/dashboard/FacelessVideoStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";
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

type JobStatus = {
  state: "idle" | "uploading" | "planning" | "rendering" | "ready" | "error" | "cancelled";
  message?: string;
  progress?: number;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  startedAt?: number;
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
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Studio configuration states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plannedBlueprint, setPlannedBlueprint] = useState<any[]>([]);
  const [facelessImageFiles, setFacelessImageFiles] = useState<File[]>([]);
  const [assetSourceMode, setAssetSourceMode] = useState<"library" | "upload" | "mix">("library");
  const [topicTitle, setTopicTitle] = useState("");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "upbeat" | "dynamic" | "none">("upbeat");
  const [selectedBgmTrackId, setSelectedBgmTrackId] = useState<string>("not-for-nothing-otis-mcdonald");
  const [selectedBgmUrl, setSelectedBgmUrl] = useState<string>(
    "https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/not-for-nothing-otis-mcdonald.mp3"
  );
  const [facelessBgmVolume, setFacelessBgmVolume] = useState(0.12);
  const [facelessPacingStyle, setFacelessPacingStyle] = useState<"clean" | "cinematic" | "documentary" | "dynamic">("cinematic");
  const [facelessEnableSfx, setFacelessEnableSfx] = useState<boolean>(true);
  const [visualArtStyle, setVisualArtStyle] = useState<"realistic" | "3d" | "2d">("realistic");
  const [subtitleStyle, setSubtitleStyle] = useState<string>("glow-viral");
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
  const [isPlanningAudio, setIsPlanningAudio] = useState(false);
  const [planningMessage, setPlanningMessage] = useState<string>("");
  const [planningError, setPlanningError] = useState<string | null>(null);
  const cachedAudioKeyRef = useRef<string>("");
  const lastStoryboardPayloadRef = useRef<any>(null);

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

  // Helper to convert mediaKey into a readable cloud URL
  async function getReadUrlFromKey(key: string): Promise<string> {
    if (!key || /^https?:\/\//i.test(key)) return key;

    try {
      const res = await fetch("/api/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "read",
          key,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      return payload.readUrl || key;
    } catch {
      return key;
    }
  }

  // STEP 1 -> 2: Plan & Transcribe Handler
  const handleTranscribeAndPlan = async (audioFile: File, brandNamesHint?: string) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
      return null;
    }

    setIsPlanningAudio(true);
    setPlanningError(null);
    setPlanningMessage("Uploading voiceover safely to cloud storage...");
    try {
      const activeUserId = user?.id || "guest_user";

      // 1. Direct cloud upload voiceover
      const mediaKey = await uploadFileViaPresign(audioFile, "facelessVideo", activeUserId);
      cachedAudioKeyRef.current = mediaKey;
      const audioUrl = await getReadUrlFromKey(mediaKey);

      // 2. Upload any selected user images
      const uploadedImageUrls: string[] = [];
      if (facelessImageFiles.length > 0 && assetSourceMode !== "library") {
        setPlanningMessage("Uploading custom visual assets...");
        for (const img of facelessImageFiles) {
          const imgKey = await uploadFileViaPresign(img, "facelessVideo", activeUserId);
          const imgUrl = await getReadUrlFromKey(imgKey);
          uploadedImageUrls.push(imgUrl);
        }
      }

      setPlanningMessage("Transcribing speech with Groq Whisper & planning scenes...");

      // 3. Call dedicated plan endpoint with brandNamesHint bias
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
          brandNamesHint,
        }),
      });

      const planPayload = await planRes.json().catch(() => ({}));
      if (!planRes.ok || !planPayload.ok) {
        throw new Error(planPayload.error || "Failed to transcribe speech or generate scene plan.");
      }

      setPlanningMessage("");

      return {
        transcript: planPayload.transcript,
        segments: planPayload.segments,
        words: planPayload.words,
        sceneBlueprint: planPayload.sceneBlueprint,
        brollUrls: planPayload.brollUrls,
        durationSeconds: planPayload.durationSeconds,
        warnings: planPayload.warnings,
        uploadedAssets: planPayload.uploadedAssets || [],
      };
    } catch (err: any) {
      console.error("[PLAN_ERROR]", err);
      const errMsg = err?.message || "Failed to transcribe audio. Please ensure the file contains clear speech.";
      setPlanningError(errMsg);
      setPlanningMessage("");
      return null;
    } finally {
      setIsPlanningAudio(false);
    }
  };

  // STEP 3 -> 4: Start Render Job with Approved Storyboard
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
      setJobStatus({
        state: "uploading",
        message: "Staging confirmed storyboard for cloud rendering...",
      });

      // 1. Upload audio if not already done
      const mediaKey = cachedAudioKeyRef.current || (await uploadFileViaPresign(selectedFile, "facelessVideo", user.id));
      cachedAudioKeyRef.current = mediaKey;

      const uploadedImageKeys: string[] = [];
      if (facelessImageFiles.length > 0 && assetSourceMode !== "library") {
        for (const img of facelessImageFiles) {
          const key = await uploadFileViaPresign(img, "facelessVideo", user.id);
          uploadedImageKeys.push(key);
        }
      }

      const plannedTitle =
        activeStoryboard?.topicTitle ||
        topicTitle.trim() ||
        (selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Video");

      const audioDuration = activeStoryboard?.durationSeconds || 60;

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
          removeAiWatermark: Boolean(removeAiWatermark),
          subtitleStyle: activeStoryboard?.subtitleStyle || subtitleStyle,
          captionAnimationStyle: activeStoryboard?.captionAnimationStyle || captionAnimationStyle,
          captionPosition: activeStoryboard?.captionPosition || captionPosition,
          uploadedImageKeys,
          assetMode: assetSourceMode,
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          facelessBgmMood: activeStoryboard?.facelessBgmMood || facelessBgmMood,
          facelessBgmVolume: activeStoryboard?.facelessBgmVolume ?? facelessBgmVolume,
          bgmUrl: activeStoryboard?.bgmUrl || (facelessBgmMood === "none" ? "" : selectedBgmUrl),
          bgmTrackId: activeStoryboard?.bgmTrackId || selectedBgmTrackId,
          facelessPacingStyle,
          facelessEnableSfx: activeStoryboard?.facelessEnableSfx ?? facelessEnableSfx,
          aspectRatio: "16:9",
          durationSeconds: audioDuration,
          sourceDurationSeconds: audioDuration,
          mediaAspect: "landscape",
          visualTheme: activeStoryboard?.visualTheme || visualTheme || "modern-saas",
          backgroundTheme: "solid-white",
          customBgUrl: "",
          visualArtStyle: activeStoryboard?.visualArtStyle || visualArtStyle,
          sceneBlueprint: activeStoryboard?.sceneBlueprint,
          brollUrls: activeStoryboard?.brollUrls,
          approvedCaptions: activeStoryboard?.approvedCaptions,
          transcript: activeStoryboard?.transcript,
          brandNamesHint: activeStoryboard?.brandNamesHint,
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

  // Polling Engine
  const startPolling = (renderId: string, bucketName: string, title: string, startedAt: number) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let attempts = 0;
    const MAX_ATTEMPTS = 600;

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
        } else {
          setJobStatus((prev) => ({
            ...prev,
            state: "rendering",
            message: statusPayload.message || "Remotion is rendering 1080p Full HD video frames...",
            progress: typeof statusPayload.progress === "number" ? statusPayload.progress : 0.45,
          }));
        }
      } catch (pollErr) {
        console.warn("[FacelessVideo] Polling loop transient error:", pollErr);
      }
    }, 3000);
  };

  const handleCancelRender = async () => {
    if (!jobStatus.renderId) return;
    setIsCancelling(true);
    try {
      await fetch("/api/reels/jobs/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renderId: jobStatus.renderId,
          bucketName: jobStatus.bucketName,
          userId: user?.id,
          mode: "facelessVideo",
        }),
      });

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      renderRequestInFlightRef.current = false;
      localStorage.removeItem("itnavideo_faceless_active_job");
      setJobStatus({
        state: "idle",
        message: "Render cancelled.",
      });
    } catch {
      setJobStatus({ state: "idle" });
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading Faceless Video Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar (Clean White Surface - Full Bleed, matching Image to Video AI) */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs shrink-0">
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
              <span className="text-xs font-black text-slate-900 tracking-tight">Faceless Video AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-xs text-slate-800">
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

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="facelessVideo"
              status={{
                state: jobStatus.state === "cancelled" ? "error" : (jobStatus.state as any),
                message: jobStatus.state === "cancelled" ? "Generation cancelled" : (jobStatus.message || "Generating 16:9 widescreen faceless video..."),
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || topicTitle || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Faceless AI Video",
              }}
              title={jobStatus.title || topicTitle || (selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "") || "Faceless AI Video"}
              fileName={selectedFile?.name}
              onRetry={() => handleStartRender()}
              onReset={() => {
                setSelectedFile(null);
                setFacelessImageFiles([]);
                cachedAudioKeyRef.current = "";
                lastStoryboardPayloadRef.current = null;
                setPlanningError(null);
                setPlanningMessage("");
                setJobStatus({ state: "idle" });
              }}
              onCancel={() => setShowCancelModal(true)}
            />
          </div>
        ) : (
          <FacelessVideoStudio
            selectedFile={selectedFile}
            onSelectFile={(file: File | null) => {
              setSelectedFile(file);
              cachedAudioKeyRef.current = "";
              setPlanningError(null);
              setPlanningMessage("");
            }}
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
            selectedBgmTrackId={selectedBgmTrackId}
            onBgmTrackSelect={(trackId, url) => {
              setSelectedBgmTrackId(trackId);
              setSelectedBgmUrl(url);
            }}
            facelessBgmVolume={facelessBgmVolume}
            onBgmVolumeChange={setFacelessBgmVolume}
            facelessPacingStyle={facelessPacingStyle}
            onPacingStyleChange={setFacelessPacingStyle}
            facelessEnableSfx={facelessEnableSfx}
            onEnableSfxChange={setFacelessEnableSfx}
            visualArtStyle={visualArtStyle}
            onVisualArtStyleChange={setVisualArtStyle}
            visualTheme={visualTheme}
            onVisualThemeChange={setVisualTheme}
            backgroundTheme={backgroundTheme}
            onBackgroundThemeChange={setBackgroundTheme}
            customBgUrl={customBgUrl}
            onCustomBgUrlChange={setCustomBgUrl}
            onCustomBgFileSelect={setCustomBgFile}
            assetSourceMode={assetSourceMode}
            onAssetSourceModeChange={setAssetSourceMode}
            uploadedImageFiles={facelessImageFiles}
            onUploadedImageFilesChange={setFacelessImageFiles}
            onTranscribeAndPlan={handleTranscribeAndPlan}
            isPlanning={isPlanningAudio}
            planningMessage={planningMessage}
            planningError={planningError}
            onClearPlanningError={() => {
              setPlanningError(null);
              setPlanningMessage("");
            }}
            onGenerate={handleStartRender}
            isGenerating={false}
            renderedVideoUrl={jobStatus.outputFile}
            onSceneBlueprintChange={setPlannedBlueprint}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
          />
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Cancel Video Generation?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel? The render job will stop immediately and any reserved credits will be refunded to your account balance.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Keep Rendering
              </button>
              <button
                type="button"
                onClick={handleCancelRender}
                disabled={isCancelling}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-xs"
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
