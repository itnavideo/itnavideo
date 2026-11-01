"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  LayoutGrid,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { WhiteboardStudio } from "@/components/dashboard/WhiteboardStudio";
import WhiteboardPreviewModal from "@/components/dashboard/WhiteboardPreviewModal";
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
  design?: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

const WHITEBOARD_RENDER_STEPS = [
  { label: "Transcribing Audio", detail: "Speech AI extracting word timestamps & speech pacing.", threshold: 0.12, icon: Upload },
  { label: "Understanding Content", detail: "AI analyzing semantics to detect steps, stats, comparisons & key takeaways.", threshold: 0.35, icon: Layers3 },
  { label: "Planning Visual Scenes", detail: "AI Director directing vector cards, stickman icons, arrows & layout geometry.", threshold: 0.60, icon: Columns },
  { label: "Syncing Vector Drawings", detail: "Synchronizing progressive line reveals & karaoke highlighting with narration.", threshold: 0.82, icon: Film },
  { label: "Rendering 1080p Video", detail: "Cloud Render Engine exporting crisp 10801920 Full HD MP4.", threshold: 0.98, icon: Clapperboard },
];

export default function WhiteboardVideoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio Form Options
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);
  const [markerColor, setMarkerColor] = useState<string>("auto");
  const [fontPersonality, setFontPersonality] = useState<string>("balsamiq");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string>("");

  // Transcript states
  const [transcript, setTranscript] = useState<string>("");
  const [words, setWords] = useState<any[]>([]);
  const [plan, setPlan] = useState<any | null>(null);
  const [studioStep, setStudioStep] = useState<"inputs" | "storyboard">("inputs");
  const [isPlanning, setIsPlanning] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [cachedMediaKey, setCachedMediaKey] = useState<string>("");

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/whiteboard-video");
    }
  }, [user, authLoading, router]);

  // Track voiceover length & trigger initial transcription when file selected
  useEffect(() => {
    if (!selectedFile) {
      setAudioDurationSeconds(0);
      setTranscript("");
      setTranscriptionError(null);
      setCachedMediaKey("");
      setAudioBlobUrl("");
      return;
    }

    setTranscript("");
    setTranscriptionError(null);

    const url = URL.createObjectURL(selectedFile);
    setAudioBlobUrl(url);

    // Measure video or audio duration safely
    const isVideo = selectedFile.type?.startsWith("video/") || /\.(mp4|mov|webm|mkv)$/i.test(selectedFile.name);
    const mediaEl = isVideo ? document.createElement("video") : document.createElement("audio");
    mediaEl.src = url;
    mediaEl.onloadedmetadata = () => {
      if (Number.isFinite(mediaEl.duration) && mediaEl.duration > 0) {
        setAudioDurationSeconds(mediaEl.duration);
      }
    };
    mediaEl.onerror = () => {
      console.warn("Could not load media metadata.");
    };

    performTranscription(selectedFile, user?.id || "guest_user");

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  async function performTranscription(file: File, userId: string) {
    try {
      setIsTranscribing(true);
      setTranscriptionError(null);

      // Trigger background presigned upload for cachedMediaKey (for render job)
      if (!cachedMediaKey) {
        uploadFileViaPresign(file, "whiteboardVideo", userId)
          .then((key) => setCachedMediaKey(key))
          .catch((err) => console.warn("Background upload presign warning:", err));
      }

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("fileName", file.name);
      formData.append("spokenLanguage", "auto");

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.transcript) {
        setTranscript(data.transcript);
        setWords(data.words || []);
        setTranscriptionError(null);
      } else {
        const errorMsg = data.error || `Transcription failed (${res.status})`;
        setTranscriptionError(errorMsg);
        console.error("Auto-transcription error:", res.status, data);
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Network error during transcription.";
      setTranscriptionError(errorMsg);
      console.error("Auto-transcription network error:", err);
    } finally {
      setIsTranscribing(false);
    }
  }

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

  // Local & Remote project render history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_whiteboard_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentRenders(parsed);
        }
      }
    } catch {}

    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          const whiteboardRenders = payload.renders.filter(
            (r: RecentRender) => r.mode === "whiteboardVideo" || r.mode === "WHITEBOARD_VIDEO"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item: RecentRender) => { if (item?.id) map.set(item.id, item); });
            whiteboardRenders.forEach((item: RecentRender) => { if (item?.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
            try {
              localStorage.setItem("itnavideo_whiteboard_projects", JSON.stringify(merged.slice(0, 30)));
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



  

  const handleOpenPreview = async () => {
    if (!selectedFile) {
      alert("Please upload a voiceover audio file first.");
      return;
    }
    if (!transcript.trim()) {
      alert("Please wait for audio transcription or write a script first.");
      return;
    }

    if (!plan) {
      setIsPlanning(true);
      try {
        const res = await fetch("/api/reels/plan-whiteboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: transcript.trim(),
            words,
            durationSeconds: audioDurationSeconds || 30,
            topicTitle: selectedFile.name.replace(/\.[^/.]+$/, ""),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.ok && data.plan) {
          setPlan(data.plan);
          if (data.words && data.words.length > 0) setWords(data.words);
        }
      } catch (err) {
        console.warn("Could not plan live preview:", err);
      } finally {
        setIsPlanning(false);
      }
    }
    setIsPreviewOpen(true);
  };

  const handlePlanStoryboard = async () => {
    if (!selectedFile) return;
    setIsPlanning(true);
    setTranscriptionError(null);
    try {
      let mediaKey = cachedMediaKey;
      if (!mediaKey) {
        mediaKey = await uploadFileViaPresign(selectedFile, "whiteboardVideo", user?.id || "guest");
        setCachedMediaKey(mediaKey);
      }
      
      const res = await fetch("/api/reels/plan-whiteboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl: mediaKey,
          transcript,
          words,
          durationSeconds: audioDurationSeconds,
        })
      });
      
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        if (data.words && data.words.length > 0) setWords(data.words);
        setStudioStep("storyboard");
      } else {
        setTranscriptionError(data.error || "Failed to plan storyboard");
      }
    } catch(err: any) {
      setTranscriptionError(err?.message || "Network error planning storyboard.");
    } finally {
      setIsPlanning(false);
    }
  };

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/whiteboard-video");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a script voiceover file first.");
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
        message: "Uploading script voiceover securely to secure cloud container...",
        progress: 0.10,
      });

      // 1. Upload main media key if not already cached
      let mediaKey = cachedMediaKey;
      if (!mediaKey) {
        mediaKey = await uploadFileViaPresign(selectedFile, "whiteboardVideo", user.id);
        setCachedMediaKey(mediaKey);
      }

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Planning drawing outline layouts...",
        progress: 0.22,
      });

      const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "whiteboardVideo",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          whiteboardMarkerColor: markerColor,
          aspectRatio: "9:16",
          editedTranscript: transcript.trim() || undefined,
          durationSeconds: audioDurationSeconds,
          sourceDurationSeconds: audioDurationSeconds,
          mediaAspect: "portrait",
          frameRange: audioDurationSeconds > 0 ? [0, Math.min(2700, Math.round(audioDurationSeconds * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Whiteboard render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 3. Poll render status
      setJobStatus({
        state: "rendering",
        message: "AI Director planning whiteboard scenes...",
        progress: 0.38,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 400; // ~20 minutes polling window matching AWS Lambda duration

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Whiteboard rendering timed out. Please check history later.",
          });
          return;
        }

        try {
          const statusParams = new URLSearchParams({
            renderId,
            bucketName,
            userId: user.id,
            mode: "whiteboardVideo",
            title: plannedTitle,
            attempt: String(attempts),
          });

          const statusRes = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (!statusRes.ok || !statusPayload.ok) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            setJobStatus({
              state: "error",
              message: statusPayload.error || "Failed to fetch status.",
            });
            return;
          }

          const serverState = statusPayload.state;
          const renderErrors = statusPayload.errors || [];
          const hasFatalError = serverState === "error" || (renderErrors.length > 0 && !statusPayload.isRetrying);

          if (hasFatalError) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            const errorMsg = renderErrors[0]?.message || statusPayload.error || "Render job failed.";
            setJobStatus({
              state: "error",
              message: errorMsg,
            });
            return;
          }

          const isRenderComplete = (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) && Boolean(statusPayload.outputFile);

          if (isRenderComplete) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;

            const finishedRender: RecentRender = {
              id: renderId,
              title: plannedTitle,
              mode: "whiteboardVideo",
              outputFile: statusPayload.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + 48 * 60 * 60 * 1000,
            };

            setRecentRenders((prev) => {
              const updated = [finishedRender, ...prev.filter((r) => r.id !== renderId)];
              localStorage.setItem("itnavideo_whiteboard_projects", JSON.stringify(updated.slice(0, 30)));
              return updated;
            });

            setJobStatus({
              state: "ready",
              message: "Whiteboard explainer is drawn and ready!",
              progress: 1,
              outputFile: statusPayload.outputFile,
              title: plannedTitle,
            });

            // Refresh credit balance
            fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`)
              .then((r) => r.json())
              .then((payload) => {
                if (payload.ok && payload.entitlement) {
                  setBillingEntitlement((curr) => curr ? {
                    ...curr,
                    usage: payload.usage ? {
                      used: payload.usage.used,
                      limit: payload.usage.limit,
                      remaining: payload.usage.remaining
                    } : curr.usage
                  } : null);
                }
              })
              .catch(() => {});
            return;
          }

          // Handle in-progress
          const rawProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : (attempts / MAX_ATTEMPTS);
          const progressVal = Math.min(0.98, Math.max(0.38, 0.38 + rawProgress * 0.60));
          setJobStatus((prev) => ({
            ...prev,
            progress: progressVal,
            message: "Generating whiteboard drawings and stickman illustrations...",
          }));
        } catch (err: any) {
          console.warn("Polling error:", err);
        }
      }, 3000);
    } catch (error: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: error.message || "An unexpected error occurred during rendering.",
      });
    }
  };

  // Render Interactive Studio directly matching Image 2
  if (jobStatus.state === "idle" && activeTab === "studio") {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <WhiteboardStudio
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          transcript={transcript}
          onTranscriptChange={setTranscript}
          isTranscribing={isTranscribing}
          transcriptionError={transcriptionError}
          onReTranscribe={() => {
            if (selectedFile) {
              performTranscription(selectedFile, user?.id || "guest_user");
            }
          }}
          markerColor={markerColor}
          onMarkerColorChange={setMarkerColor}
          fontPersonality={fontPersonality}
          onFontPersonalityChange={setFontPersonality}
          onOpenPreview={handleOpenPreview}
          onGenerate={handleStartRender}
          onPlanStoryboard={handlePlanStoryboard}
          isPlanning={isPlanning}
          plan={plan}
          setPlan={setPlan}
          studioStep={studioStep}
          setStudioStep={setStudioStep}
          isGenerating={isSubmitting || jobStatus.state !== "idle"}
        />

        {/* Interactive Live Preview Modal before cloud rendering */}
        <WhiteboardPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          audioUrl={audioBlobUrl || "/whiteboard-preview.mp3"}
          plan={plan || {
            title: selectedFile?.name.replace(/\.[^/.]+$/, "") || "Whiteboard Animation",
            durationSeconds: audioDurationSeconds || 30,
            scenes: [],
          }}
          durationSeconds={audioDurationSeconds || 30}
          title={selectedFile?.name.replace(/\.[^/.]+$/, "") || "Whiteboard Animation"}
          fontPersonality={fontPersonality}
          onFontPersonalityChange={setFontPersonality}
          onConfirmRender={() => {
            setIsPreviewOpen(false);
            handleStartRender();
          }}
          isSubmitting={isSubmitting}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090A0F] px-3.5 py-4 sm:px-6 sm:py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <BrandLogo size="sm" variant="dark" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-[#FFA000] transition sm:border-l sm:border-white/10 sm:pl-4"
            >
              <ArrowLeft size={14} />
              <span className="sm:hidden">Dashboard</span>
              <span className="hidden sm:inline">Back to Studio Dashboard</span>
            </Link>
          </div>

          {/* User Credits & Navigation Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {billingEntitlement && (
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-[#111218] px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs shadow-sm">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-zinc-300">
                  {billingEntitlement.usage ? `${billingEntitlement.usage.remaining} Credits` : "Active"}
                </span>
              </div>
            )}

            <div className="flex rounded-xl sm:rounded-2xl border border-white/10 bg-[#111218] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("studio")}
                className={`inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "studio"
                    ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <History size={13} />
                <span>History ({recentRenders.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Render Stage with BorderBeam, Neural Audio Visualizer, & 1080p Cloud Export */}
        {jobStatus.state !== "idle" && (
          <div className="max-w-3xl mx-auto py-4">
            <InteractiveRenderEngine
              mode="whiteboard"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || "Rendering 1080p whiteboard explainer...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Whiteboard Explainer Video",
              }}
              title={jobStatus.title || selectedFile?.name?.replace(/\.[^/.]+$/, "") || "Whiteboard Explainer Video"}
              fileName={selectedFile?.name}
              onRetry={handleStartRender}
              onReset={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setSelectedFile(null);
                setTranscript("");
                setCachedMediaKey("");
                setIsSubmitting(false);
                setJobStatus({ state: "idle" });
              }}
            />
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && activeTab === "history" && (
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF9100]">
                      <History size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Whiteboard Render History</h2>
                      <p className="text-xs text-zinc-400">Past whiteboard explainer exports (stored for 48 hours).</p>
                    </div>
                  </div>
                </div>

                {recentRenders.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <p className="text-xs">No rendered whiteboard explainers yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentRenders.map((render) => (
                      <div
                        key={render.id}
                        className="rounded-2xl border border-white/10 bg-[#161720] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate max-w-[180px]">
                            {render.title || "Whiteboard Explainer"}
                          </p>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(render.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <video
                          src={render.outputFile}
                          className="h-32 w-full rounded-xl object-cover bg-black"
                          controls
                        />

                        <a
                          href={render.outputFile}
                          download={`${render.title || "whiteboard-explainer"}.mp4`}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-[#FF9100] border border-[#FF5722]/20 py-2 text-xs font-bold transition"
                        >
                          <Download size={13} />
                          <span>Download MP4</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
      </div>
    </main>
  );
}
