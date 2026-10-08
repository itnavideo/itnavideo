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
  History,
  Layers3,
  Columns
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

const FACELESS_RENDER_STEPS = [
  { label: "Voiceover received", detail: "Narration speech track uploaded safely to cloud storage.", threshold: 0.10, icon: Upload },
  { label: "Transcribing narration", detail: "Speech AI translating language patterns & word alignments.", threshold: 0.38, icon: Layers3 },
  { label: "AI Shotlist & Beats", detail: "AI Director planning custom visual layouts, slides, and background graphics.", threshold: 0.68, icon: Columns },
  { label: "Rendering 16:9 widescreen", detail: "Cloud render engine building visual overlays, pan/zoom Ken Burns, and sound.", threshold: 0.88, icon: Film },
  { label: "Ready to download", detail: "Cinematic faceless video ready to publish on YouTube & social networks.", threshold: 0.98, icon: Clapperboard },
];

export default function FacelessVideoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Faceless Video States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [facelessImageFiles, setFacelessImageFiles] = useState<File[]>([]);
  const [assetSourceMode, setAssetSourceMode] = useState<"library" | "upload" | "mix">("library");
  const [visualArtStyle, setVisualArtStyle] = useState<"realistic" | "3d" | "2d">("realistic");
  const [topicTitle, setTopicTitle] = useState("");
  const [longVideoHeadingFont, setLongVideoHeadingFont] = useState("League Spartan");
  const [longVideoSubheadingFont, setLongVideoSubheadingFont] = useState("Montserrat");
  const [longVideoBodyFont, setLongVideoBodyFont] = useState("Inter");
  const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState("cozy-loft");
  const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState("");
  const [facelessEnableCaptions, setFacelessEnableCaptions] = useState(true);
  const [facelessMotionIntensity, setFacelessMotionIntensity] = useState<"ambient" | "dynamic">("dynamic");
  const [facelessBgmMood, setFacelessBgmMood] = useState<"lofi" | "tech" | "mystery" | "acoustic" | "none">("mystery");
  const [facelessBgmVolume, setFacelessBgmVolume] = useState(0.20);
  const [facelessPacingStyle, setFacelessPacingStyle] = useState<"clean" | "cinematic" | "documentary" | "dynamic">("cinematic");
  const [facelessEnableSfx, setFacelessEnableSfx] = useState<boolean>(true);
  const [narrationMode, setNarrationMode] = useState<"ai-voice" | "upload">("ai-voice");
  const [selectedVoice, setSelectedVoice] = useState<string>("cinema-deep");
  const [subtitleStyle, setSubtitleStyle] = useState<string>("netflix-yellow");

  // Audio duration tracker
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/faceless-video");
    }
  }, [user, authLoading, router]);

  // Load audio duration when selected
  useEffect(() => {
    if (!selectedFile) {
      setAudioDurationSeconds(0);
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
      const saved = localStorage.getItem("itnavideo_faceless_projects");
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
          const facelessRenders = payload.renders.filter(
            (r: RecentRender) => r.mode === "facelessVideo" || r.mode === "FACELESS_VIDEO"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item: RecentRender) => { if (item?.id) map.set(item.id, item); });
            facelessRenders.forEach((item: RecentRender) => { if (item?.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
            try {
              localStorage.setItem("itnavideo_faceless_projects", JSON.stringify(merged.slice(0, 30)));
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
      router.push("/login?returnUrl=/dashboard/faceless-video");
      return;
    }
    if (narrationMode === "upload" && !selectedFile) {
      alert("Please upload a script voiceover file first.");
      return;
    }
    if (narrationMode === "ai-voice" && !topicTitle.trim() && !selectedFile) {
      alert("Please enter a video topic/premise or switch to Upload Voiceover.");
      return;
    }
    if (assetSourceMode === "upload" && facelessImageFiles.length === 0) {
      alert("Upload at least one image, or choose Itnavideo Assets or Mix.");
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

      // 1. Upload main voiceover file if present
      const mediaKey = selectedFile ? await uploadFileViaPresign(selectedFile, "facelessVideo", user.id) : "";
      const uploadedImageKeys = assetSourceMode !== "library" && facelessImageFiles.length > 0
        ? await Promise.all(facelessImageFiles.map((image) => uploadFileViaPresign(image, "facelessVideo", user.id)))
        : [];

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Compiling shotlist and visual beat timelines...",
        progress: 0.22,
      });

      const plannedTitle = topicTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Faceless Video");

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile ? selectedFile.name : `${plannedTitle}.mp3`,
          contentType: selectedFile ? (selectedFile.type || "audio/mpeg") : "audio/mpeg",
          mediaType: "audio",
          mode: "facelessVideo",
          narrationMode,
          selectedVoice,
          subtitleStyle,
          uploadedImageKeys,
          assetMode: assetSourceMode,
          visualArtStyle,
          topicTitle: plannedTitle,
          userId: user.id,
          backgroundTheme: selectedBackgroundTheme,
          selectedBackgroundTheme,
          customBgUrl: selectedBackgroundUrl,
          backgroundUrl: selectedBackgroundUrl,
          headingFont: longVideoHeadingFont,
          subheadingFont: longVideoSubheadingFont,
          bodyFont: longVideoBodyFont,
          typographyFont: longVideoBodyFont,
          showCaptions: facelessEnableCaptions,
          enableCaptions: facelessEnableCaptions,
          facelessMotionIntensity,
          facelessPacingStyle,
          pacingStyle: facelessPacingStyle,
          facelessBgmMood,
          facelessBgmVolume,
          enableSfx: facelessEnableSfx,
          facelessEnableSfx,
          durationSeconds: audioDurationSeconds || 60,
          sourceDurationSeconds: audioDurationSeconds || 60,
          mediaAspect: "landscape", // Faceless video is widescreen 16:9
          frameRange: audioDurationSeconds > 0 ? [0, Math.min(27000, Math.round(audioDurationSeconds * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Faceless Video render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 3. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Speech AI transcribing speech narration...",
        progress: 0.38,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      let attempts = 0;
      const MAX_ATTEMPTS = 800; // ~40 minutes max polling for long faceless video renders

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message: "Render took longer than usual. Please check your history tab in a few minutes.",
          });
          return;
        }

        try {
          const statusParams = new URLSearchParams({
            renderId,
            bucketName,
            userId: user.id,
            mode: "facelessVideo",
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
              message: "16:9 Faceless Video is fully rendered!",
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
              }).catch(() => {});

            return;
          }

          const rawProgress = typeof statusPayload.progress === "number" ? statusPayload.progress : (attempts / MAX_ATTEMPTS);
          const progressEst = Math.min(0.98, Math.max(0.38, 0.38 + rawProgress * 0.60));

          setJobStatus({
            state: "rendering",
            message: `Generating widescreen faceless film (${Math.round(progressEst * 100)}%)...`,
            progress: progressEst,
            renderId,
            bucketName,
            title: plannedTitle,
          });

        } catch (err) {
          console.warn("Poll error:", err);
        }
      }, 3500);

    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit faceless video job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#07090E] text-white">
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
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-black text-orange-400 shadow-md shadow-orange-500/5">
                <Zap size={13} className="fill-orange-400" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
              <Sparkles size={11} className="text-orange-300" />
              <span>Cinematic Film Director</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Faceless Video{' '}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Widescreen Studio
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Turn voiceover narration tracks into fully-formed, immersive widescreen YouTube videos with curated scenes and layout cards.
            </p>
          </div>

        </div>

        {/* Dynamic Stepper Overlay during Render */}
        {jobStatus.state !== "idle" && jobStatus.state !== "ready" && (
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/95 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">Widescreen Film Rendering Progress</h3>
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

            {/* Custom Steps List */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              {FACELESS_RENDER_STEPS.map((step, idx) => {
                const stepProgress = jobStatus.progress || 0;
                const active = stepProgress >= step.threshold && stepProgress < (FACELESS_RENDER_STEPS[idx + 1]?.threshold || 1.1);
                const done = stepProgress >= (FACELESS_RENDER_STEPS[idx + 1]?.threshold || 0.98);
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

            {jobStatus.state === "error" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Rendering Interrupted</p>
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

        {/* Ready Download Preview Stage */}
        {jobStatus.state === "ready" && jobStatus.outputFile && (
          <div className="rounded-[28px] border border-white/10 bg-[#111218] p-6 shadow-2xl max-w-2xl mx-auto text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Widescreen Faceless Video is Ready!</h3>
              <p className="text-xs text-zinc-400">Your AI-curated film rendering has completed successfully.</p>
            </div>

            <video
              src={jobStatus.outputFile}
              controls
              className="mx-auto h-[315px] w-full max-w-xl rounded-2xl bg-black border border-white/10 shadow-lg"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <a
                href={jobStatus.outputFile}
                download={jobStatus.title ? `${jobStatus.title}.mp4` : "faceless-video.mp4"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
              >
                <Download size={14} />
                <span>Download Widescreen Video</span>
              </a>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setJobStatus({ state: "idle" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-zinc-300 transition active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Create New Video</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <>
            {activeTab === "studio" && (
              <FacelessVideoStudio
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                narrationMode={narrationMode}
                onNarrationModeChange={setNarrationMode}
                selectedVoice={selectedVoice}
                onSelectVoiceChange={setSelectedVoice}
                subtitleStyle={subtitleStyle}
                onSubtitleStyleChange={setSubtitleStyle}
                assetSourceMode={assetSourceMode}
                onAssetSourceModeChange={setAssetSourceMode}
                uploadedImageFiles={facelessImageFiles}
                onUploadedImageFilesChange={setFacelessImageFiles}
                visualArtStyle={visualArtStyle}
                onVisualArtStyleChange={setVisualArtStyle}
                topicTitle={topicTitle}
                onTopicTitleChange={setTopicTitle}
                facelessBgmMood={facelessBgmMood}
                onBgmMoodChange={setFacelessBgmMood}
                facelessBgmVolume={facelessBgmVolume}
                onBgmVolumeChange={setFacelessBgmVolume}
                facelessPacingStyle={facelessPacingStyle}
                onPacingStyleChange={setFacelessPacingStyle}
                facelessEnableSfx={facelessEnableSfx}
                onEnableSfxChange={setFacelessEnableSfx}
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
