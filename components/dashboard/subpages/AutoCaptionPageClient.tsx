"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { AutoCaptionStudio } from "@/components/dashboard/AutoCaptionStudio";
import { AutoCaptionBeforeAfterPlayer } from "@/components/dashboard/AutoCaptionBeforeAfterPlayer";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
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
      if (saved && SUBTITLE_PRESETS[saved]) return saved;
    } catch {}
  }
  // 3. Default
  return "Shorts Karaoke";
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
  const [captionTextColor, setCaptionTextColor] = useState<string>("#ffffff");
  const [captionHighlightColor, setCaptionHighlightColor] = useState<string>("#facc15");
  const [captionBackgroundColor, setCaptionBackgroundColor] = useState<string>("#18181B");
  const [spokenLanguage, setSpokenLanguage] = useState<string>("auto");
  const [captionLanguage, setCaptionLanguage] = useState<string>("auto");
  const [wordClickSound, setWordClickSound] = useState<boolean>(true);
  const [captionEmphasisAnimation, setCaptionEmphasisAnimation] = useState<"bounce" | "glow" | "none">("bounce");
  const [youtubeSubtitleCase, setYoutubeSubtitleCase] = useState<"natural" | "uppercase">("uppercase");
  const [highlightActiveWord, setHighlightActiveWord] = useState<boolean>(true);
  const [editedTranscript, setEditedTranscript] = useState<string>("");
  const [previewCaptions, setPreviewCaptions] = useState<Array<{ start: number; end: number; text: string; words?: any[] }> | null>(null);

  // Sync URL ?style_id on mount (client-side only — SSR gives null)
  useEffect(() => {
    const resolved = resolveInitialPreset(styleIdParam);
    setCaptionStyle(resolved);
    // Seed the preset colors from the preset definition
    const preset = SUBTITLE_PRESETS[resolved];
    if (preset) {
      if (preset.textColor) setCaptionTextColor(preset.textColor);
      if (preset.highlightColor) setCaptionHighlightColor(preset.highlightColor);
      if (preset.backgroundColor) setCaptionBackgroundColor(preset.backgroundColor);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleIdParam]);

  // Persist last-used preset to localStorage whenever captionStyle changes
  useEffect(() => {
    if (!captionStyle) return;
    try {
      localStorage.setItem(LAST_PRESET_KEY, captionStyle);
    } catch {}
  }, [captionStyle]);

  // Media Metadata
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);
  const [mediaAspect, setMediaAspect] = useState<string>("portrait");

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

  // Presigned file uploader
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

  // Start Render Job
  async function handleStartRender() {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/auto-caption");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a video or audio file first.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading video/audio safely to cloud container...",
        progress: 0.05,
      });

      // 1. Upload main media file
      const mediaKey = await uploadFileViaPresign(selectedFile, "autoCaption", user.id);

      // 2. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Preparing transcription engines...",
        progress: 0.22,
      });

      const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");

      const isAudio = selectedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || (isAudio ? "audio/mpeg" : "video/mp4"),
          mediaType: isAudio ? "audio" : "video",
          mode: "autoCaption",
          topicTitle: plannedTitle,
          userId: user.id,
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
    setJobStatus({ state: "idle" });
    setSelectedFile(null);
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-semibold tracking-wide text-slate-700">Loading Auto Caption Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-[#FF6D00]/30 selection:text-white pb-28 sm:pb-12">
      {/* ── Top Navigation Bar (Google Analytics Obsidian Surface) ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0E1526]/90 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandLogo size="sm" showBadge={false} />
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#151E30] hover:bg-[#1C2840] px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#FF8F00]" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#151E30] px-3.5 py-1.5 text-xs font-bold shadow-xs">
              <Zap size={14} className="text-[#FFA726] fill-[#FFA726]" />
              <span className="text-slate-400">Balance:</span>
              <span className="text-white font-extrabold">
                {billingEntitlement && userRemainingCredits !== undefined ? `${userRemainingCredits} Credits` : "908 Credits"}
              </span>
              <Link
                href="/pricing"
                className="ml-1 text-[11px] text-[#FF8F00] hover:text-[#FFA726] underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Auto Caption{" "}
              <span className="text-[#FF8F00]">
                Studio
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Generate word-synchronized kinetic subtitles for your videos in seconds.
            </p>
          </div>

        </div>

        {(isWorking || isReady || isError) ? (
          <div className="max-w-3xl mx-auto py-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Form Config */}
            <div className="lg:col-span-2 min-w-0 max-w-full overflow-x-hidden">
              <AutoCaptionStudio
                mode="autoCaption"
                userId={user?.id}
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                captionStyle={captionStyle}
                onCaptionStyleChange={setCaptionStyle}
                captionPosition={captionPosition}
                onCaptionPositionChange={setCaptionPosition}
                captionFontSize={captionFontSize}
                onCaptionFontSizeChange={setCaptionFontSize}
                captionFontFamily={captionFontFamily}
                onCaptionFontFamilyChange={setCaptionFontFamily}
                captionTextColor={captionTextColor}
                onCaptionTextColorChange={setCaptionTextColor}
                captionHighlightColor={captionHighlightColor}
                onCaptionHighlightColorChange={setCaptionHighlightColor}
                captionBackgroundColor={captionBackgroundColor}
                onCaptionBackgroundColorChange={setCaptionBackgroundColor}
                spokenLanguage={spokenLanguage}
                onSpokenLanguageChange={setSpokenLanguage}
                captionLanguage={captionLanguage}
                onCaptionLanguageChange={setCaptionLanguage}
                wordClickSound={wordClickSound}
                onWordClickSoundChange={setWordClickSound}
                captionEmphasisAnimation={captionEmphasisAnimation}
                onCaptionEmphasisAnimationChange={setCaptionEmphasisAnimation}
                youtubeSubtitleSafeZone="standard"
                onYoutubeSubtitleSafeZoneChange={() => {}}
                youtubeSubtitleCase={youtubeSubtitleCase}
                onYoutubeSubtitleCaseChange={setYoutubeSubtitleCase}
                highlightActiveWord={highlightActiveWord}
                onHighlightActiveWordChange={setHighlightActiveWord}
                mediaDurationSeconds={mediaDurationSeconds}
                mediaAspect={mediaAspect}
                onMediaMetaChange={(meta: { durationSeconds: number; mediaAspect: string }) => {
                  setMediaDurationSeconds(meta.durationSeconds);
                  setMediaAspect(meta.mediaAspect);
                }}
                editedTranscript={editedTranscript}
                onEditedTranscriptChange={setEditedTranscript}
                previewCaptions={previewCaptions}
                onPreviewCaptionsChange={setPreviewCaptions}
                onStartRender={handleStartRender}
                isWorking={isWorking}
              />
            </div>

            {/* Right 1 Col: Live 9:16 Video Preview Stage & Primary Render Action */}
            <div className="space-y-5 lg:sticky lg:top-20">
              {/* 9:16 Vertical Video Preview Stage */}
              <AutoCaptionBeforeAfterPlayer
                selectedPresetKey={captionStyle}
                uploadedFile={selectedFile}
                mode="shorts"
                hideCarousel={true}
                captionPosition={captionPosition}
                onPositionChange={setCaptionPosition}
                onSelectPreset={setCaptionStyle}
                onHighlightColorChange={setCaptionHighlightColor}
                onRemoveFile={() => setSelectedFile(null)}
              />

              {/* Primary Action Button */}
              <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-4 shadow-xl">
                <button
                  onClick={handleStartRender}
                  disabled={!selectedFile || isWorking}
                  className={`w-full inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-base font-black transition duration-200 ${
                    !selectedFile
                      ? "bg-[#151E30] text-[#FFA726] border border-[#FF6D00]/30 hover:border-[#FF6D00]/60 shadow-inner cursor-not-allowed"
                      : isWorking
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black opacity-80 cursor-wait animate-pulse"
                      : "bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-xl shadow-[#FF6D00]/30 hover:brightness-110 active:scale-95 cursor-pointer"
                  }`}
                >
                  <Sparkles size={18} className={!selectedFile ? "text-[#FFA726]" : "text-black"} />
                  <span>
                    {!selectedFile
                      ? "Upload Video First (Costs 1 Credit)"
                      : isWorking
                      ? "Styling Reel..."
                      : "Generate Video (Costs 1 Credit)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile-First Sticky Action Bar (65% mobile creators) ── */}
      {activeTab === "studio" && !isWorking && !isReady && !isError && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0E1526]/98 backdrop-blur-xl border-t border-white/10 p-3.5 pb-[calc(0.85rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-white truncate">
              {captionStyle}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {selectedFile ? selectedFile.name : "No file selected"}
            </p>
          </div>

          <button
            onClick={() => {
              if (!selectedFile) {
                const el = document.getElementById("upload-section");
                el?.scrollIntoView({ behavior: "smooth" });
              } else {
                handleStartRender();
              }
            }}
            disabled={isWorking}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-5 py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/30 active:scale-95 transition cursor-pointer"
          >
            <Sparkles size={15} className="text-black" />
            <span>{selectedFile ? "Generate Reel" : "Upload File"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
