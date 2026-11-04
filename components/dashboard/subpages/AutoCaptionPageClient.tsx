"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { AutoCaptionStudio } from "@/components/dashboard/AutoCaptionStudio";
import { AutoCaptionBeforeAfterPlayer } from "@/components/dashboard/AutoCaptionBeforeAfterPlayer";
import { AutoCaptionTimeline } from "@/components/dashboard/AutoCaptionTimeline";
import { AutoCaptionUploadStep } from "@/components/dashboard/autocaption/AutoCaptionUploadStep";
import { AutoCaptionDualTabStudio } from "@/components/dashboard/autocaption/AutoCaptionDualTabStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
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
  History,
  Building2,
  ShieldCheck,
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
  error?: string;
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
  { label: "Media Received & Verified", detail: "Secure upload with audio stream isolation.", threshold: 0.08, icon: Upload },
  { label: "Neural Speech Transcription", detail: "Speech AI processing timestamps and punctuation.", threshold: 0.35, icon: Layers3 },
  { label: "Kinetic Highlights & Safe-Zones", detail: "Overlaying active word highlight cadence and text positioning.", threshold: 0.65, icon: Sparkles },
  { label: "Cloud Video Render", detail: "Compiling 30 FPS high-fidelity MP4 video with pop SFX.", threshold: 0.88, icon: Film },
  { label: "Ready for Export", detail: "Broadcast-ready MP4 ready for download & sharing.", threshold: 0.98, icon: Clapperboard },
];

const LAST_PRESET_KEY = "last_used_caption_preset";

function resolveInitialPreset(styleIdParam: string | null): string {
  // 1. URL param takes highest priority
  if (styleIdParam) {
    const decoded = decodeURIComponent(styleIdParam);
    if (SUBTITLE_PRESETS[decoded]) return decoded;
  }
  // 2. localStorage last-used
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LAST_PRESET_KEY);
      if (saved) return saved;
    } catch {}
  }
  // 3. Default to Editorial Mix matching reference screenshots
  return "Editorial Mix";
}

export default function AutoCaptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const styleIdParam = searchParams.get("style_id");

  // Studio form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captionStyle, setCaptionStyle] = useState<string>(() => resolveInitialPreset(styleIdParam));
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("center");
  const [captionFontSize, setCaptionFontSize] = useState<"small" | "medium" | "large" | "xlarge">("large");
  const [captionFontFamily, setCaptionFontFamily] = useState<string>("preset");
  const [captionTextColor, setCaptionTextColor] = useState<string>("");
  const [captionHighlightColor, setCaptionHighlightColor] = useState<string>("");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState<string>("");
  const [spokenLanguage, setSpokenLanguage] = useState<string>("auto");
  const [captionLanguage, setCaptionLanguage] = useState<string>("auto");
  const [wordClickSound, setWordClickSound] = useState<boolean>(true);
  const [captionEmphasisAnimation, setCaptionEmphasisAnimation] = useState<"bounce" | "glow" | "none">("bounce");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("uppercase");
  const [highlightActiveWord, setHighlightActiveWord] = useState<boolean>(true);
  const [editedTranscript, setEditedTranscript] = useState<string>("");
  const [previewCaptions, setPreviewCaptions] = useState<Array<{ start: number; end: number; text: string; words?: any[] }> | null>(null);

  // Media Metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(32);
  const [mediaAspect, setMediaAspect] = useState<string>("portrait");

  // WhiteStair Features State
  const [projectName, setProjectName] = useState<string>("sample_walking");
  const [timelineCurrentTime, setTimelineCurrentTime] = useState<number>(0);
  const [timelineDuration, setTimelineDuration] = useState<number>(32);
  const [externalSeekTime, setExternalSeekTime] = useState<number | null>(null);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);
  const [behindPerson, setBehindPerson] = useState<boolean>(false);
  const [autoEmoji, setAutoEmoji] = useState<boolean>(true);
  const [safeZones, setSafeZones] = useState<boolean>(false);
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // 2-Step Workflow State: default directly to editor to show 2-Part Studio
  const [workflowStep, setWorkflowStep] = useState<"upload" | "editor">("editor");
  const [isStep1Processing, setIsStep1Processing] = useState(false);
  const [step1Progress, setStep1Progress] = useState(0);
  const [step1Message, setStep1Message] = useState("");
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Auto-sync project name when file is uploaded
  useEffect(() => {
    if (selectedFile?.name) {
      setProjectName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, [selectedFile]);

  // Handle Step 1 -> Step 2 Transition with Background Groq Whisper Transcription
  const handleStep1Continue = async () => {
    if (!selectedFile) return;
    setIsStep1Processing(true);
    setStep1Progress(15);
    setStep1Message("Analyzing media properties...");
    setStep1Error(null);

    try {
      // 1. Measure duration & aspect ratio if not yet measured
      const url = URL.createObjectURL(selectedFile);
      const isVideo = selectedFile.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(selectedFile.name);
      const element = isVideo ? document.createElement("video") : document.createElement("audio");
      element.src = url;
      element.preload = "metadata";

      await new Promise<void>((resolve) => {
        element.onloadedmetadata = () => {
          const d = element.duration || 8;
          let aspect = "portrait";
          if (isVideo) {
            const v = element as HTMLVideoElement;
            aspect = (v.videoWidth || 1080) > (v.videoHeight || 1920) ? "landscape" : "portrait";
          }
          setMediaDurationSeconds(d);
          setMediaAspect(aspect);
          setTimelineDuration(d);
          URL.revokeObjectURL(url);
          resolve();
        };
        element.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
      });

      setStep1Progress(40);
      setStep1Message("Transcribing speech with Groq Whisper Cloud...");

      // 2. Call /api/reels/transcribe
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
      if (spokenLanguage && spokenLanguage !== "auto") {
        formData.append("spokenLanguage", spokenLanguage);
      }

      const res = await fetch("/api/reels/transcribe", {
        method: "POST",
        body: formData,
      });

      setStep1Progress(85);
      setStep1Message("Synchronizing word timestamps...");

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Speech transcription failed. Please check file format and try again.");
      }

      const transcriptText = data.transcript || "";
      setEditedTranscript(transcriptText);

      const segs =
        Array.isArray(data.segments) && data.segments.length > 0
          ? data.segments.map((s: any) => ({
              start: s.start ?? 0,
              end: s.end ?? 0,
              text: s.text ?? "",
              words: s.words ?? [],
            }))
          : [{ start: 0, end: mediaDurationSeconds || 8, text: transcriptText, words: data.words || [] }];
      setPreviewCaptions(segs);

      setStep1Progress(100);
      setStep1Message("Ready! Opening Caption Studio...");

      setTimeout(() => {
        setIsStep1Processing(false);
        setWorkflowStep("editor");
      }, 350);
    } catch (err: any) {
      console.error("Step 1 Transcription Error:", err);
      setStep1Error(err?.message || "Transcription failed. Please try again.");
      setIsStep1Processing(false);
    }
  };

  // Extract word-level items for WhiteStair timeline track
  const timelineWords = useMemo(() => {
    if (previewCaptions && previewCaptions.length > 0) {
      const allWords: Array<{ word: string; start: number; end: number }> = [];
      previewCaptions.forEach((seg) => {
        if (seg.words && seg.words.length > 0) {
          allWords.push(...seg.words);
        } else if (seg.text) {
          const segWords = seg.text.split(/\s+/).filter(Boolean);
          const segDur = Math.max(0.2, seg.end - seg.start);
          segWords.forEach((w, i) => {
            allWords.push({
              word: w,
              start: seg.start + (i / Math.max(1, segWords.length)) * segDur,
              end: seg.start + ((i + 1) / Math.max(1, segWords.length)) * segDur,
            });
          });
        }
      });
      if (allWords.length > 0) return allWords;
    }
    if (editedTranscript && editedTranscript.trim().length > 0) {
      const rawWords = editedTranscript.trim().split(/\s+/).filter(Boolean);
      const totalTime = mediaDurationSeconds || 8;
      return rawWords.map((w, i) => ({
        word: w,
        start: (i / Math.max(1, rawWords.length)) * totalTime,
        end: ((i + 1) / Math.max(1, rawWords.length)) * totalTime,
      }));
    }
    return [];
  }, [previewCaptions, editedTranscript, mediaDurationSeconds]);

  // Sync URL ?style_id on mount (client-side only  SSR gives null)
  useEffect(() => {
    const resolved = resolveInitialPreset(styleIdParam);
    setCaptionStyle(resolved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleIdParam]);

  // Persist last-used preset to localStorage whenever captionStyle changes
  useEffect(() => {
    if (!captionStyle) return;
    try {
      localStorage.setItem(LAST_PRESET_KEY, captionStyle);
    } catch {}
  }, [captionStyle]);



  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/auto-caption");
    }
  }, [user, authLoading, router]);

  // Load billing entitlement
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

  // Load recent renders for user
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_auto_caption_projects");
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
          const captionRenders: RecentRender[] = payload.renders.filter(
            (r: RecentRender) =>
              r.mode === "autoCaption" ||
              r.mode === "auto-caption" ||
              r.mode === "AUTO_CAPTION_REEL"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item) => {
              if (item && item.id) map.set(item.id, item);
            });
            captionRenders.forEach((item) => {
              if (item && item.id) map.set(item.id, item);
            });
            const merged = Array.from(map.values()).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
            try {
              localStorage.setItem("itnavideo_auto_caption_projects", JSON.stringify(merged.slice(0, 30)));
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



  // Start Render Job
  async function handleStartRender() {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/auto-caption");
      return;
    }

    let fileToUpload = selectedFile;
    if (!fileToUpload) {
      try {
        const res = await fetch("/assets/reusable/testing1.mp3");
        const blob = await res.blob();
        fileToUpload = new File([blob], "sample_walking.mp4", { type: "audio/mp3" });
        setSelectedFile(fileToUpload);
      } catch {
        alert("Please upload a video or audio file first.");
        return;
      }
    }

    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setJobStatus({
        state: "uploading",
        message: "Uploading video/audio safely to cloud container...",
        progress: 0.05,
      });

      // 1. Upload main media file
      const mediaKey = await uploadFileViaPresign(fileToUpload, "autoCaption", user.id);

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Preparing transcription engines...",
        progress: 0.22,
      });

      const plannedTitle = fileToUpload.name.replace(/\.[^/.]+$/, "");

      const isAudio = fileToUpload.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(fileToUpload.name);

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: fileToUpload.name,
          contentType: fileToUpload.type || (isAudio ? "audio/mpeg" : "video/mp4"),
          mediaType: isAudio ? "audio" : "video",
          mode: "autoCaption",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          captionStyle,
          captionPosition,
          captionFontSize,
          captionTextColor,
          captionHighlightColor,
          captionBackgroundColor,
          captionShowBackground: captionBackgroundColor !== "",
          spokenLanguage: spokenLanguage !== "auto" ? spokenLanguage : undefined,
          captionLanguage: captionLanguage !== "auto" ? captionLanguage : undefined,
          subtitleOutputLanguage: captionLanguage !== "auto" ? captionLanguage : undefined,
          videoLayout: "fullscreen",
          progressStyle: "none",
          wordClickSound,
          captionEmphasisAnimation,
          previewCaptions: previewCaptions && previewCaptions.length > 0 ? previewCaptions : undefined,
          durationSeconds: mediaDurationSeconds,
          sourceDurationSeconds: mediaDurationSeconds,
          mediaAspect: "portrait",
          removeAiWatermark: Boolean(removeAiWatermark),
          frameRange: mediaDurationSeconds > 0 ? [0, Math.min(2700, Math.round(mediaDurationSeconds * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Auto Caption render job.");
      }

      const jobId = jobPayload.jobId;
      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 3. Poll Status
      setJobStatus({
        state: "rendering",
        message: "AI transcription with Speech AI in progress...",
        progress: 0.35,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 800; // ~40 minutes max polling

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Please check your Projects tab shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId)}&renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&title=${encodeURIComponent(plannedTitle)}&mode=autoCaption`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : 0.45;

            const isRenderComplete = (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) && Boolean(statusPayload.outputFile);
            if (isRenderComplete) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;

              const completedRender: RecentRender = {
                id: renderId,
                title: plannedTitle,
                mode: "autoCaption",
                outputFile: statusPayload.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const next = [completedRender, ...prev.filter((r) => r.id !== renderId)];
                try {
                  localStorage.setItem("itnavideo_auto_caption_projects", JSON.stringify(next.slice(0, 30)));
                } catch {}
                return next;
              });

              setJobStatus({
                state: "ready",
                message: "Viral kinetic captions styled successfully!",
                progress: 1,
                outputFile: statusPayload.outputFile,
                renderId,
                bucketName,
                title: plannedTitle,
              });

              // Save to history db
              fetch("/api/reels/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  renderId,
                  bucketName,
                  mode: "autoCaption",
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
                message: statusPayload.message || "Auto Caption render failed.",
                diagnostics: statusPayload.diagnostics,
              });
            } else {
              setJobStatus((prev) => ({
                ...prev,
                state: "rendering",
                message: statusPayload.message || "Generating video frames and embedding styled kinetic words...",
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setJobStatus({ state: "idle" });
    setSelectedFile(null);
    setWorkflowStep("upload");
  };

  const userRemainingCredits = billingEntitlement?.active
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;
  const isWorking = jobStatus.state === "uploading" || jobStatus.state === "starting" || jobStatus.state === "rendering";
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D13] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5722]" />
        <p className="text-sm font-semibold tracking-wide text-zinc-300">Loading Auto Caption Studio...</p>
      </div>
    );
  }

  // ── Auto Caption Dual-Tab Studio (Matching Reference Screenshots) ──
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#5850ec]/20 selection:text-slate-900 pb-20 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <BrandLogo size="sm" showBadge={false} variant="light" />
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition group cursor-pointer"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform text-[#5850ec]" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>

          {/* Project Name Input */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-[#5850ec] rounded-2xl px-3.5 py-1.5 transition shadow-2xs max-w-sm w-full mx-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0 hidden md:inline">
              Project Name:
            </span>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="sample_walking"
              className="bg-transparent text-xs font-black text-slate-900 focus:outline-none w-full font-jakarta truncate"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold shadow-2xs">
              <Zap size={13} className="text-[#FF5722] fill-[#FF5722]" />
              <span className="text-slate-900 font-black">
                {billingEntitlement && userRemainingCredits !== undefined ? `${userRemainingCredits} Cr` : "908 Credits"}
              </span>
            </div>

            {/* Prominent Generate / Download Reel Button */}
            <button
              onClick={handleStartRender}
              disabled={isWorking}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                isWorking
                  ? "bg-[#5850ec] text-white cursor-wait animate-pulse"
                  : "bg-[#5850ec] hover:bg-[#4f46e5] text-white shadow-md shadow-[#5850ec]/25 font-jakarta"
              }`}
            >
              <Download size={13} className="text-white" />
              <span>{isWorking ? "Rendering 1080p..." : "Download 1080p"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full py-4">
        {(isWorking || isReady || isError) ? (
          <div className="max-w-3xl mx-auto py-8 px-4">
            <InteractiveRenderEngine
              mode="autoCaption"
              status={{
                state: isReady ? "ready" : isError ? "error" : isWorking ? (jobStatus.state as any) : "idle",
                message: jobStatus.message || "Rendering 1080p reel...",
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Auto Caption Reel",
                error: jobStatus.error,
                diagnostics: jobStatus.diagnostics,
              }}
              title={selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Auto Caption Reel"}
              fileName={selectedFile?.name}
              onRetry={handleStartRender}
              onReset={handleReset}
            />
          </div>
        ) : (
          <AutoCaptionDualTabStudio
            selectedFile={selectedFile}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
            onSelectFile={setSelectedFile}
            captionStyle={captionStyle}
            onCaptionStyleChange={(style) => {
              setCaptionStyle(style);
              try {
                localStorage.setItem(LAST_PRESET_KEY, style);
              } catch {}
            }}
            mediaDurationSeconds={mediaDurationSeconds}
            isWorking={isWorking}
            onStartRender={handleStartRender}
            editedTranscript={editedTranscript}
            onEditedTranscriptChange={setEditedTranscript}
            previewCaptions={previewCaptions}
            spokenLanguage={spokenLanguage}
            onSpokenLanguageChange={setSpokenLanguage}
            captionLanguage={captionLanguage}
            onCaptionLanguageChange={setCaptionLanguage}
          />
        )}
      </main>

      {/* Mobile Sticky Action Bar */}
      {selectedFile && workflowStep === "editor" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-[#FF5722] tracking-wider truncate">
              {projectName || selectedFile.name}
            </p>
            <p className="text-[10px] text-slate-500 font-bold">
              1 Credit • 9:16 Vertical
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartRender}
            disabled={!selectedFile || isWorking}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF5722]/30 active:scale-95 disabled:opacity-50"
          >
            <Download size={14} className="text-black" />
            <span>{isWorking ? "Rendering..." : "Download 1080p"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
