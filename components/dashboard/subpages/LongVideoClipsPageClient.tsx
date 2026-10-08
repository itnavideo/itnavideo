"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { LongVideoClipsStudio } from "@/components/dashboard/LongVideoClipsStudio";
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
  History,
  Columns,
  Layers3,
  Scissors
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

type ClipStatus = {
  clipIndex: number;
  renderId: string;
  bucketName: string;
  outName: string;
  startSeconds: number;
  endSeconds: number;
  title: string;
  durationSeconds: number;
  headline?: string;
  viralityScore?: number;
  viralityGrade?: string;
  whyItWorks?: string;
  status: "rendering" | "done" | "failed";
  outputFile?: string;
};

type JobStatus = {
  state: "idle" | "uploading" | "starting" | "rendering" | "ready" | "error";
  message?: string;
  progress?: number;
  clips?: ClipStatus[];
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
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

const CLIPS_RENDER_STEPS = [
  { label: "Long video uploaded", detail: "Widescreen video asset loaded safely to cloud storage.", threshold: 0.10, icon: Upload },
  { label: "Transcribing audio track", detail: "Speech AI aligning language patterns and full script timeline.", threshold: 0.35, icon: Layers3 },
  { label: "AI clip hook scoring", detail: "Analyzing speech hooks, viral metrics, and emotional high-points.", threshold: 0.65, icon: Scissors },
  { label: "Rendering vertical clips", detail: "Cloud render engine building visual cropping layouts in parallel.", threshold: 0.88, icon: Film },
  { label: "Clips ready to download", detail: "Viral short clips ready to publish on TikTok, Reels, and Shorts.", threshold: 0.98, icon: Clapperboard },
];

export default function LongVideoClipsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Clips form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"file" | "youtube">("file");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [layoutMode, setLayoutMode] = useState<"auto-speaker" | "split-screen" | "fit-widescreen">("auto-speaker");
  const [clipCount, setClipCount] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<"auto" | "under-30" | "30-60" | "60-90">("auto");
  const [clipsHookStrategy, setClipsHookStrategy] = useState<"auto" | "high-energy" | "actionable" | "story">("auto");
  const [clipsTopBanner, setClipsTopBanner] = useState<"none" | "glass-pill" | "yellow-ticker">("none");
  const [enableClipsCaptions, setEnableClipsCaptions] = useState(true);
  const [captionStyle, setCaptionStyle] = useState<string>("impact-yellow");

  // Media metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/long-video-clips");
    }
  }, [user, authLoading, router]);

  // Load duration when selected
  useEffect(() => {
    if (!selectedFile) {
      setMediaDurationSeconds(0);
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(selectedFile);
    video.src = url;
    video.onloadedmetadata = () => {
      setMediaDurationSeconds(video.duration || 0);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

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

  // Past Renders history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_clips_projects");
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
          const clipsRenders = payload.renders.filter(
            (r: RecentRender) => r.mode === "longVideoClips" || r.mode === "LONG_VIDEO_CLIPS"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            clipsRenders.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
            try {
              localStorage.setItem("itnavideo_clips_projects", JSON.stringify(merged.slice(0, 30)));
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

  async function uploadFileViaPresign(
    file: File,
    mode: string,
    userId: string,
    onProgress?: (percent: number) => void
  ): Promise<string> {
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

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presign.uploadUrl, true);
      xhr.setRequestHeader("Content-Type", contentType);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(presign.key as string);
        } else {
          reject(new Error(`Upload failed for ${file.name} (HTTP ${xhr.status})`));
        }
      };

      xhr.onerror = () => {
        reject(new Error(`Network error during upload of ${file.name}`));
      };

      xhr.ontimeout = () => {
        reject(new Error(`Upload timed out for ${file.name}`));
      };

      xhr.send(file);
    });
  }

  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/long-video-clips");
      return;
    }
    if (inputMode === "youtube") {
      if (!youtubeUrl || !/(youtube\.com|youtu\.be)/i.test(youtubeUrl)) {
        alert("Please paste a valid YouTube video URL first.");
        return;
      }
    } else if (!selectedFile) {
      alert("Please upload a podcast or video file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      let mediaKey = "";
      let fileName = "youtube-source.mp4";
      let contentType = "video/mp4";

      if (inputMode === "file" && selectedFile) {
        setJobStatus({
          state: "uploading",
          message: "Uploading source video securely to cloud container (0%)...",
          progress: 0.10,
        });
        mediaKey = await uploadFileViaPresign(
          selectedFile,
          "longVideoClips",
          user.id,
          (percent) => {
            const calculatedProgress = 0.10 + Math.round((percent / 100) * 20) / 100;
            setJobStatus({
              state: "uploading",
              message: `Uploading source video securely to cloud container (${percent}%)...`,
              progress: calculatedProgress,
            });
          }
        );
        fileName = selectedFile.name;
        contentType = selectedFile.type || "video/mp4";
      } else {
        setJobStatus({
          state: "starting",
          message: "Connecting to YouTube cloud stream...",
          progress: 0.15,
        });
      }

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Aligning speech recognition & face tracking parameters...",
        progress: 0.25,
      });

      const plannedTitle = inputMode === "file" && selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "YouTube Clip Import";

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          youtubeUrl: inputMode === "youtube" ? youtubeUrl : undefined,
          inputMode,
          fileName,
          contentType,
          mediaType: "video",
          mode: "longVideoClips",
          topicTitle: plannedTitle,
          userId: user.id,
          layoutMode,
          clipCount,
          clipDuration,
          enableSfx: false,
          enableCaptions: enableClipsCaptions,
          captionStyle,
          clipsAspectRatio: "9:16",
          clipsHookStrategy,
          clipsTopBanner,
          durationSeconds: mediaDurationSeconds,
          sourceDurationSeconds: mediaDurationSeconds,
          mediaAspect: "portrait",
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Podcast Clips job.");
      }

      const initialClips = jobPayload.clips;
      if (!Array.isArray(initialClips) || initialClips.length === 0) {
        throw new Error("No clips returned by podcast analyzer engine.");
      }

      // 3. Poll multiple renders in parallel
      let activeClips: ClipStatus[] = initialClips.map((c) => ({
        ...c,
        status: "rendering",
        outputFile: undefined,
      }));

      setJobStatus({
        state: "rendering",
        message: `Extracting and rendering ${activeClips.length} clips in parallel...`,
        progress: 0.40,
        clips: activeClips,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 150;
      let consecutiveErrors = 0;

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Clips rendering timed out. Please check your history in a few minutes.",
          });
          return;
        }

        const allDoneOrFailed = activeClips.every(
          (c) => c.status === "done" || c.status === "failed"
        );
        if (allDoneOrFailed) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;

          const successfulClips = activeClips.filter((c) => c.status === "done");
          if (successfulClips.length === 0) {
            setJobStatus({
              state: "error",
              message: "All clip renderings failed. Please try again.",
              clips: activeClips,
              title: plannedTitle,
            });
          } else {
            setJobStatus({
              state: "ready",
              message: `Successfully generated ${successfulClips.length} high-quality viral clips!`,
              progress: 1,
              clips: activeClips,
              outputFile: successfulClips[0].outputFile,
              title: plannedTitle,
            });

            // Refresh billing
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
              }).catch(() => {});
          }
          return;
        }

        let updated = false;

        for (const clip of activeClips) {
          if (clip.status !== "rendering") continue;

          try {
            const statusParams = new URLSearchParams({
              renderId: clip.renderId,
              bucketName: clip.bucketName,
              userId: user.id,
              mode: "longVideoClips",
              title: clip.title,
            });

            const response = await fetch(`/api/reels/jobs/status?${statusParams.toString()}`);
            const status = await response.json().catch(() => ({}));

            if (!response.ok || !status.ok || status.state === "error" || (status.done && status.errors?.length)) {
              clip.status = "failed";
              updated = true;
            } else if (status.done && status.outputFile) {
              clip.status = "done";
              clip.outputFile = status.outputFile;
              updated = true;

              const finishedRender: RecentRender = {
                id: clip.renderId,
                title: clip.title,
                mode: "longVideoClips",
                outputFile: status.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const map = new Map<string, RecentRender>();
                prev.forEach((item) => { if (item?.id) map.set(item.id, item); });
                map.set(clip.renderId, finishedRender);
                const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
                try {
                  localStorage.setItem("itnavideo_clips_projects", JSON.stringify(merged.slice(0, 30)));
                } catch {}
                return merged;
              });
            }
            consecutiveErrors = 0;
          } catch (error) {
            console.warn(`Polling error for clip ${clip.clipIndex + 1}:`, error);
            consecutiveErrors += 1;
            if (consecutiveErrors >= 10) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;
              setJobStatus({
                state: "error",
                message: "Lost connection to the rendering server. Please check your network.",
                clips: activeClips,
                title: plannedTitle,
              });
              return;
            }
          }
        }

        if (updated) {
          const completedCount = activeClips.filter((c) => c.status === "done").length;
          const failedCount = activeClips.filter((c) => c.status === "failed").length;
          const progressEst = 0.40 + (completedCount / activeClips.length) * 0.55;

          setJobStatus({
            state: "rendering",
            message: `Rendering clips: ${completedCount} ready, ${failedCount} failed, ${activeClips.length - completedCount - failedCount} remaining...`,
            progress: progressEst,
            clips: [...activeClips],
            title: plannedTitle,
          });
        }
      }, 3500);

    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit clips extraction job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white transition active:scale-90"
            >
              <ArrowLeft size={16} />
            </Link>
            <BrandLogo />
          </div>

          <div className="flex items-center gap-4">
            {billingEntitlement && (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black text-[#FF9100] shadow-md shadow-[#FF6D00]/10">
                <Zap size={13} className="fill-[#FF9100]" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* Render Status Panel */}
        {jobStatus.state !== "idle" && jobStatus.state !== "ready" && (
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">Parallel Clips Export Progress</h3>
                <p className="text-xs text-zinc-400">{jobStatus.message}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FFA726]">
                <Loader2 size={13} className="animate-spin" />
                <span>{Math.round((jobStatus.progress || 0) * 100)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] transition-all duration-500 ease-out"
                style={{ width: `${(jobStatus.progress || 0) * 100}%` }}
              />
            </div>

            {/* Steps List */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              {CLIPS_RENDER_STEPS.map((step, idx) => {
                const stepProgress = jobStatus.progress || 0;
                const active = stepProgress >= step.threshold && stepProgress < (CLIPS_RENDER_STEPS[idx + 1]?.threshold || 1.1);
                const done = stepProgress >= (CLIPS_RENDER_STEPS[idx + 1]?.threshold || 0.98);
                const Icon = step?.icon || Sparkles;

                return (
                  <div
                    key={step.label}
                    className={`flex flex-row md:flex-col items-center md:items-start gap-3 p-3 rounded-2xl border transition-all ${
                      active
                        ? "border-[#FF6D00] bg-[#FF6D00]/5 shadow-md shadow-[#FF6D00]/5"
                        : done
                        ? "border-emerald-500/20 bg-emerald-500/5 opacity-80"
                        : "border-white/5 bg-black/10 opacity-40"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        active
                          ? "border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100]"
                          : done
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 bg-white/5 text-zinc-500"
                      }`}
                    >
                      {done ? <CheckCircle2 size={15} /> : <Icon size={14} />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-zinc-200 leading-snug">{step.label}</p>
                      <p className="hidden md:block text-[9px] text-zinc-500 leading-normal">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clips status list grid during export */}
            {jobStatus.clips && jobStatus.clips.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  <span>Extracting Scene Highlights ({jobStatus.clips.length} segments):</span>
                  <span>{jobStatus.clips.filter((c) => c.status === "done").length} / {jobStatus.clips.length} Ready</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                  {jobStatus.clips.map((clip) => (
                    <div
                      key={clip.renderId}
                      className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{clip.title}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Duration: {Math.round(clip.durationSeconds)}s</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                          clip.status === "done"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : clip.status === "failed"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 animate-pulse"
                        }`}
                      >
                        {clip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jobStatus.state === "error" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Extraction Terminated</p>
                  <p>{jobStatus.message}</p>
                  <button
                    onClick={() => setJobStatus({ state: "idle" })}
                    className="mt-2 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-black text-white hover:bg-red-600 transition"
                  >
                    Reset Studio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ready Clips Download Stage */}
        {jobStatus.state === "ready" && jobStatus.clips && (
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Successfully Repurposed {jobStatus.clips.filter((c) => c.status === "done").length} Viral Clips!</h3>
                <p className="text-xs text-zinc-400">Smart speech density highlighting and vertical 9:16 layout formatting is fully complete.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setJobStatus({ state: "idle" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-zinc-300 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Upload New Video</span>
              </button>
            </div>

            {/* Clips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {jobStatus.clips.map((clip) => {
                const isClipDone = clip.status === "done";
                const isClipFailed = clip.status === "failed";

                return (
                  <div
                    key={clip.renderId}
                    className={`relative overflow-hidden rounded-[28px] border p-5 bg-[#111218] flex flex-col justify-between gap-4 shadow-xl ${
                      isClipFailed
                        ? "opacity-60 border-red-500/10"
                        : "border-white/10"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black text-white truncate max-w-[70%]">{clip.title}</h4>
                        <span
                          className={`shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            isClipFailed
                              ? "bg-red-500/10 border-red-500/20 text-red-400"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {clip.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Segment: {Math.floor(clip.startSeconds / 60)}:{(clip.startSeconds % 60).toString().padStart(2, '0')} - {Math.floor(clip.endSeconds / 60)}:{(clip.endSeconds % 60).toString().padStart(2, '0')} ({Math.round(clip.durationSeconds)}s)
                      </p>
                    </div>

                    <div className="aspect-[9/16] h-[360px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/5 relative flex items-center justify-center">
                      {isClipDone && clip.outputFile ? (
                        <video
                          src={clip.outputFile}
                          controls
                          className="w-full h-full object-cover"
                          playsInline
                        />
                      ) : (
                        <div className="text-center p-4">
                          <span className="text-red-400 font-bold block mb-1">Rendering Failed</span>
                          <span className="text-[9px] text-zinc-500 block">Failures are not charged. Feel free to try again.</span>
                        </div>
                      )}
                    </div>

                    {isClipDone && clip.outputFile && (
                      <a
                        href={clip.outputFile}
                        download={`clip-${clip.clipIndex + 1}.mp4`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
                      >
                        <Download size={13} />
                        <span>Download Clip</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <>
            {activeTab === "studio" && (
              <LongVideoClipsStudio
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                inputMode={inputMode}
                onInputModeChange={setInputMode}
                youtubeUrl={youtubeUrl}
                onYoutubeUrlChange={setYoutubeUrl}
                layoutMode={layoutMode}
                onLayoutModeChange={setLayoutMode}
                clipCount={clipCount}
                onClipCountChange={setClipCount}
                clipDuration={clipDuration}
                onClipDurationChange={setClipDuration}
                clipsHookStrategy={clipsHookStrategy}
                onClipsHookStrategyChange={setClipsHookStrategy}
                clipsTopBanner={clipsTopBanner}
                onClipsTopBannerChange={setClipsTopBanner}
                enableClipsCaptions={enableClipsCaptions}
                onEnableClipsCaptionsChange={setEnableClipsCaptions}
                captionStyle={captionStyle}
                onCaptionStyleChange={setCaptionStyle}
                onGenerate={handleStartRender}
                isGenerating={false}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
