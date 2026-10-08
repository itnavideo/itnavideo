"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
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
  { label: "Rendering 1080p Video", detail: "Cloud Render Engine exporting crisp 1080×1920 Full HD MP4.", threshold: 0.98, icon: Clapperboard },
];

export default function WhiteboardVideoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio Form Options
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);
  const [whiteboardFont, setWhiteboardFont] = useState<"marker" | "architect" | "clean" | "sans" | "blueprint">("marker");
  const [markerColor, setMarkerColor] = useState<string>("auto");

  // Transcript states
  const [transcript, setTranscript] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [cachedMediaKey, setCachedMediaKey] = useState<string>("");

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
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
      setCachedMediaKey("");
      return;
    }

    const audio = new Audio();
    const url = URL.createObjectURL(selectedFile);
    audio.src = url;
    audio.onloadedmetadata = () => {
      setAudioDurationSeconds(audio.duration || 0);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
    };

    if (user?.id) {
      performTranscription(selectedFile, user.id);
    }
  }, [selectedFile, user?.id]);

  async function performTranscription(file: File, userId: string) {
    try {
      setIsTranscribing(true);
      let mediaKey = cachedMediaKey;
      if (!mediaKey) {
        mediaKey = await uploadFileViaPresign(file, "whiteboardVideo", userId);
        setCachedMediaKey(mediaKey);
      }

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: file.name,
          spokenLanguage: "auto",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.transcript) {
        setTranscript(data.transcript);
      }
    } catch (err) {
      console.warn("Auto-transcription error:", err);
    } finally {
      setIsTranscribing(false);
    }
  }

  // Billing entitlement fetch
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

    try {
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
          whiteboardBoard: "corporate-luxury",
          whiteboardHandStyle: "direct-draw",
          whiteboardMarkerColor: markerColor,
          whiteboardFont,
          editedTranscript: transcript.trim() || undefined,
          durationSeconds: audioDurationSeconds,
          sourceDurationSeconds: audioDurationSeconds,
          mediaAspect: "portrait",
          frameRange: audioDurationSeconds > 0 ? [0, Math.min(5400, Math.round(audioDurationSeconds * 30)) - 1] : undefined,
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
      const MAX_ATTEMPTS = 150;

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

  return (
    <main className="min-h-screen bg-[#090A0F] px-4 py-8 sm:px-6 sm:py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <BrandLogo size="sm" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-[#FFA726] transition border-l border-white/10 pl-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Studio Dashboard</span>
            </Link>
          </div>

          {/* User Credits & Navigation Switcher */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {billingEntitlement && (
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111218] px-4 py-2 text-xs shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-zinc-300">
                  {billingEntitlement.usage ? `⚡ Balance: ${billingEntitlement.usage.remaining} Credits` : "Active"}
                </span>
              </div>
            )}

            <div className="flex rounded-2xl border border-white/10 bg-[#111218] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("studio")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "studio"
                    ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black font-black shadow-md shadow-[#FF6D00]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={14} />
                <span>Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black font-black shadow-md shadow-[#FF6D00]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <History size={14} />
                <span>History ({recentRenders.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Title ($H_1$) */}
        <div className="flex items-center gap-3 pt-1 pb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20 shadow-sm">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Whiteboard Explainer{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Studio
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Turn voiceover scripts into high-retention 9:16 whiteboard diagrams &amp; presentations.
            </p>
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
                setSelectedFile(null);
                setTranscript("");
                setCachedMediaKey("");
                setJobStatus({ state: "idle" });
              }}
            />
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <>
            {activeTab === "studio" && (
              <WhiteboardStudio
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                transcript={transcript}
                onTranscriptChange={setTranscript}
                isTranscribing={isTranscribing}
                onReTranscribe={() => {
                  if (selectedFile && user?.id) {
                    performTranscription(selectedFile, user.id);
                  }
                }}
                whiteboardFont={whiteboardFont}
                onWhiteboardFontChange={setWhiteboardFont}
                markerColor={markerColor}
                onMarkerColorChange={setMarkerColor}
                onGenerate={handleStartRender}
                isGenerating={false}
              />
            )}

            {activeTab === "history" && (
              <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6D00]/10 text-[#FF9100]">
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
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF9100] border border-[#FF6D00]/20 py-2 text-xs font-bold transition"
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
          </>
        )}
      </div>
    </main>
  );
}
