"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  AudioCleanStudio,
  type AudioCleanStudioAnalysis,
  type AudioCleanStudioOptions,
  type AudioCleanStudioResult,
} from "@/components/dashboard/AudioCleanStudio";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers3,
  Upload,
  Music,
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

type StreamEvent = {
  state?: string;
  ok?: boolean;
  error?: string;
  message?: string;
  progress?: number;
  result?: unknown;
};

function toStreamEvent(value: unknown): StreamEvent | null {
  if (!isRecord(value)) return null;
  return {
    state: typeof value.state === "string" ? value.state : undefined,
    ok: typeof value.ok === "boolean" ? value.ok : undefined,
    error: typeof value.error === "string" ? value.error : undefined,
    message: typeof value.message === "string" ? value.message : undefined,
    progress: typeof value.progress === "number" ? value.progress : undefined,
    result: value.result,
  };
}

async function readAudioCleanStream(
  response: Response,
  onProgress: (event: StreamEvent) => void,
): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Streaming is not supported by your browser.");

  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim()) continue;
      let event: StreamEvent | null;
      try {
        event = toStreamEvent(JSON.parse(line) as unknown);
      } catch (error: unknown) {
        console.warn("Could not parse audio-clean stream line:", line, error);
        continue;
      }
      if (!event || event.state === "heartbeat") continue;
      if (event.ok === false) throw new Error(event.error || "Audio cleanup failed.");
      if (event.state === "progress") onProgress(event);
      if (event.state === "done") return event.result;
    }
  }

  throw new Error("The audio-clean stream ended before returning a result.");
}

function isAudioCleanStudioAnalysis(value: unknown): value is AudioCleanStudioAnalysis {
  return isRecord(value)
    && typeof value.transcript === "string"
    && Array.isArray(value.segments)
    && Array.isArray(value.words)
    && typeof value.originalDuration === "number"
    && typeof value.estimatedCleanDuration === "number"
    && typeof value.mediaKey === "string";
}

function isAudioCleanStudioResult(value: unknown): value is AudioCleanStudioResult {
  return isRecord(value)
    && typeof value.outputUrl === "string"
    && typeof value.originalDuration === "number"
    && typeof value.cleanedDuration === "number"
    && isRecord(value.stats)
    && typeof value.stats.repeatedTakesCut === "number"
    && typeof value.stats.silencesCut === "number"
    && typeof value.stats.fillersCut === "number"
    && typeof value.stats.durationSavedSeconds === "number";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function isRecentRender(value: unknown): value is RecentRender {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.title === "string"
    && typeof value.mode === "string"
    && typeof value.outputFile === "string"
    && typeof value.createdAt === "number"
    && typeof value.expiresAt === "number";
}

function readRecentRenders(): RecentRender[] {
  try {
    const saved = localStorage.getItem("itnavideo_audio_clean_projects");
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(isRecentRender) : [];
  } catch {
    return [];
  }
}

function saveRecentRenders(renders: RecentRender[]): void {
  try {
    const merged = new Map(readRecentRenders().map((render) => [render.id, render]));
    renders.forEach((render) => merged.set(render.id, render));
    const sorted = Array.from(merged.values()).sort((a, b) => b.createdAt - a.createdAt);
    localStorage.setItem("itnavideo_audio_clean_projects", JSON.stringify(sorted.slice(0, 30)));
  } catch {}
}

function getUploadContentType(file: File): string {
  const name = file.name.toLowerCase();
  const browserType = file.type || "";

  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".wav")) return "audio/wav";
  if (name.endsWith(".m4a")) return "audio/mp4";
  if (name.endsWith(".aac")) return "audio/aac";
  if (name.endsWith(".ogg")) return "audio/ogg";
  if (name.endsWith(".flac")) return "audio/flac";
  if (name.endsWith(".mp4") || name.endsWith(".m4v")) return "video/mp4";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";

  return browserType && browserType !== "application/octet-stream" ? browserType : "audio/mpeg";
}

async function uploadFileViaPresign(file: File, mode: string, userId: string): Promise<string> {
  const contentType = getUploadContentType(file);
  const presignResponse = await fetch("/api/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType, fileSize: file.size, mode, userId }),
  });
  const presign: unknown = await presignResponse.json().catch(() => ({}));
  if (!presignResponse.ok || !isRecord(presign) || !presign.ok || typeof presign.uploadUrl !== "string" || typeof presign.key !== "string") {
    throw new Error(isRecord(presign) && typeof presign.error === "string" ? presign.error : `Could not prepare upload for ${file.name}`);
  }

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  }).catch((error: unknown) => {
    console.error("Direct S3 PUT network failure:", error);
    throw new Error(`Upload network error for ${file.name}: ${getErrorMessage(error, "Check connection")}`);
  });
  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text().catch(() => "");
    console.error("S3 returned non-OK status:", uploadResponse.status, errorText);
    throw new Error(`Upload to S3 failed for ${file.name} (Status: ${uploadResponse.status})`);
  }

  return presign.key;
}

const CLEAN_STEPS = [
  { label: "Recording received", detail: "Source audio uploaded to cloud stream.", threshold: 0.1, icon: Upload },
  { label: "Transcribing speech", detail: "Groq Whisper speech engine calculating word timings.", threshold: 0.35, icon: Layers3 },
  { label: "Smart pause compression", detail: "Compressing dead air pauses & non-destructive FFmpeg splicing.", threshold: 0.65, icon: Scissors },
  { label: "Voice preservation & mastering", detail: "Preserving 100% original tone, pitch, and timbre.", threshold: 0.85, icon: Music },
  { label: "Cleaned audio ready", detail: "Ready for live A/B compare and high-quality download.", threshold: 0.99, icon: CheckCircle2 },
];

export default function AudioCleanerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Selected file and analysis states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioCleanOptions, setAudioCleanOptions] = useState<AudioCleanStudioOptions>({
    preserveInputQuality: true,
    removeSilence: true,
    trimEnds: true,
    pacing: "fast",
    exportFormat: "mp3",
  });

  const [audioCleanAnalysis, setAudioCleanAnalysis] = useState<AudioCleanStudioAnalysis | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState<boolean>(false);
  const [audioCleanResult, setAudioCleanResult] = useState<AudioCleanStudioResult | null>(null);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const isUploadingOrAnalyzingRef = useRef(false);
  const audioCleanOptionsRef = useRef(audioCleanOptions);

  useEffect(() => {
    audioCleanOptionsRef.current = audioCleanOptions;
  }, [audioCleanOptions]);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/audio-cleaner");
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

  // Refresh local project history from the server
  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`);
        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok || !isRecord(payload) || !payload.ok || !Array.isArray(payload.renders)) return;
        const audioRenders = payload.renders.filter(isRecentRender).filter((render) =>
          ["audioClean", "audio-cleaner", "AUDIO_CLEANER"].includes(render.mode),
        );
        saveRecentRenders(audioRenders);
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);

  // Trigger Automatic Transcription & Audio Analysis when file is selected
  useEffect(() => {
    if (!selectedFile || !user?.id) return;
    if (isUploadingOrAnalyzingRef.current) return;
    isUploadingOrAnalyzingRef.current = true;

    let isSubscribed = true;

    async function triggerAudioAnalysis() {
      try {
        setIsAnalyzingAudio(true);
        setAudioCleanResult(null);
        setAudioCleanAnalysis(null);
        setJobStatus({
          state: "uploading",
          message: "Uploading your recording...",
          progress: 0.1,
        });

        if (!selectedFile || !user?.id) {
          throw new Error("Missing audio file or active user session");
        }

        const mediaKey = await uploadFileViaPresign(selectedFile, "audioClean", user.id);

        if (!isSubscribed) return;

        setJobStatus({
          state: "starting",
          message: "Groq Whisper transcribing speech & scanning audio timeline...",
          progress: 0.25,
        });

        const analyzeResponse = await fetch("/api/audio-clean/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaKey,
            userId: user.id,
            audioCleanOptions: audioCleanOptionsRef.current,
          }),
        });

        if (!analyzeResponse.ok) {
          const errorData: unknown = await analyzeResponse.json().catch(() => ({}));
          const errorMessage = isRecord(errorData) && typeof errorData.error === "string"
            ? errorData.error
            : "We couldn't understand the speech in this recording.";
          throw new Error(errorMessage);
        }

        if (!isSubscribed) return;
        const analysisData = await readAudioCleanStream(analyzeResponse, (event) => {
          if (!isSubscribed) return;
          setJobStatus({ state: "starting", message: event.message, progress: event.progress });
        });
        if (!isSubscribed) return;
        if (!isAudioCleanStudioAnalysis(analysisData)) {
          throw new Error("The analysis response was incomplete. Please try again.");
        }

        setAudioCleanAnalysis(analysisData);
        setJobStatus({ state: "idle", message: "" });
      } catch (err: unknown) {
        if (!isSubscribed) return;
        console.error("Audio clean analysis error:", err);
        setJobStatus({
          state: "error",
          message: getErrorMessage(err, "We couldn't prepare your audio. Try a clearer recording."),
        });
      } finally {
        isUploadingOrAnalyzingRef.current = false;
        if (isSubscribed) {
          setIsAnalyzingAudio(false);
        }
      }
    }

    triggerAudioAnalysis();

    return () => {
      isSubscribed = false;
    };
  }, [selectedFile, user?.id]);

  // Handle re-align transcription using pasted script
  const handleReanalyzeWithScript = async (pastedScript: string) => {
    if (!selectedFile || !user?.id) return;
    setIsAnalyzingAudio(true);
    try {
      let mediaKey = audioCleanAnalysis?.mediaKey;
      if (!mediaKey) {
        mediaKey = await uploadFileViaPresign(selectedFile, "audioClean", user.id);
      }

      setJobStatus({
        state: "starting",
        message: "Aligning speech timestamps with the edited script...",
        progress: 0.45,
      });

      const analyzeResponse = await fetch("/api/audio-clean/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          userId: user.id,
          audioCleanOptions: audioCleanOptionsRef.current,
          pastedScript,
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData: unknown = await analyzeResponse.json().catch(() => ({}));
        const errorMessage = isRecord(errorData) && typeof errorData.error === "string"
          ? errorData.error
          : "Audio script alignment failed.";
        throw new Error(errorMessage);
      }

      const analysisData = await readAudioCleanStream(analyzeResponse, (event) => {
        setJobStatus({ state: "starting", message: event.message, progress: event.progress });
      });
      if (!isAudioCleanStudioAnalysis(analysisData)) {
        throw new Error("The script-alignment response was incomplete. Please try again.");
      }

      setAudioCleanAnalysis(analysisData);
      setJobStatus({ state: "idle", message: "" });
    } catch (err: unknown) {
      console.error("Audio alignment error:", err);
      alert(getErrorMessage(err, "Failed to align script."));
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  // Submit actual Audio Cleaning Process (Smart Pause Compression)
  const handleCleanAudio = async () => {
    if (!selectedFile || !user?.id || !audioCleanAnalysis) {
      alert("Please wait for transcription to complete first.");
      return;
    }
    if (isCleaning) return;
    setIsCleaning(true);

    const renderFileName = selectedFile.name;
    const plannedTitle = renderFileName.replace(/\.[^/.]+$/, "") || "Cleaned Audio";

    // Gather silence cuts from analysis
    const segmentsToCut = audioCleanAnalysis.allSilenceCuts && audioCleanAnalysis.allSilenceCuts.length > 0
      ? audioCleanAnalysis.allSilenceCuts
      : audioCleanAnalysis.segments.flatMap((segment: any) =>
          segment.action === "cut" ? [segment] : segment.internalCuts || [],
        );

    setJobStatus({
      state: "rendering",
      message: "Compressing dead air pauses & non-destructive FFmpeg splicing...",
      progress: 0.1,
    });

    try {
      const cleanResponse = await fetch("/api/audio-clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey: audioCleanAnalysis.mediaKey,
          userId: user.id,
          fileName: renderFileName,
          title: plannedTitle,
          audioCleanOptions,
          transcript: audioCleanAnalysis?.rawTranscript,
          segmentsToCut,
        }),
      });

      if (!cleanResponse.ok) {
        const errorData: unknown = await cleanResponse.json().catch(() => ({}));
        const errorMessage = isRecord(errorData) && typeof errorData.error === "string"
          ? errorData.error
          : "Audio cleaning failed.";
        throw new Error(errorMessage);
      }

      const cleanResultValue = await readAudioCleanStream(cleanResponse, (event) => {
        setJobStatus({ state: "rendering", message: event.message, progress: event.progress });
      });
      if (!isAudioCleanStudioResult(cleanResultValue)) {
        throw new Error("The cleaned audio result was incomplete. Please try again.");
      }
      const cleanResult = cleanResultValue;

      const renderId = cleanResult.renderId || `clean-${Date.now()}`;
      const finishedRender: RecentRender = {
        id: renderId,
        title: plannedTitle,
        mode: "audioClean",
        design: "Cleaned Audio",
        outputFile: cleanResult.outputUrl,
        createdAt: Date.now(),
        expiresAt: Date.now() + 48 * 60 * 60 * 1000,
      };

      saveRecentRenders([finishedRender]);

      setAudioCleanResult(cleanResult);
      setJobStatus({
        state: "ready",
        message: "Clean audio generated successfully with 100% original voice preservation.",
        outputFile: cleanResult.outputUrl,
        renderId,
        bucketName: cleanResult.bucketName,
        title: plannedTitle,
        progress: 1.0,
      });

      // Save render to history database
      fetch("/api/reels/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          renderId,
          bucketName: cleanResult.bucketName,
          mode: "audioClean",
          title: plannedTitle,
          outputFile: cleanResult.outputUrl,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        }),
      }).catch((error: unknown) => console.warn("Could not save history:", error));

    } catch (error: unknown) {
      console.error("Clean Audio Error:", error);
      setJobStatus({
        state: "error",
        message: getErrorMessage(error, "We couldn't clean this recording. Please try again."),
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const handleReset = () => {
    setJobStatus({ state: "idle" });
    setAudioCleanAnalysis(null);
    setAudioCleanResult(null);
    setSelectedFile(null);
  };

  const handleBackToEdit = () => {
    setAudioCleanResult(null);
    setJobStatus({ state: "idle" });
  };

  const userRemainingCredits = billingEntitlement?.active
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;

  const isError = jobStatus.state === "error";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8F00]" />
        <p className="text-sm font-semibold tracking-wide text-zinc-300">Loading AI Audio Cleaner...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-zinc-100 flex flex-col selection:bg-[#FF6D00]/30 selection:text-[#FFA726] pb-12">
      {/* ── Top Navigation Bar (Google Analytics Obsidian Surface) ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0E1526]/90 backdrop-blur-xl shadow-md">
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

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF9100]">
              <Sparkles size={11} className="text-[#FF9100]" />
              Dedicated Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold">
              <Zap size={14} className="text-[#FF8F00] fill-[#FF8F00]" />
              <span className="text-zinc-400">Balance:</span>
              <span className="text-white font-black">{billingEntitlement ? userRemainingCredits : "..."} Credits</span>
              <Link
                href="/pricing"
                className="ml-1 text-[11px] text-[#FF9100] hover:text-[#FFA726] underline font-black"
              >
                +Add
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Unified Header Bar */}
        <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3.5 py-1 text-xs font-black text-[#FF9100] uppercase tracking-wider">
                <Sparkles size={13} className="text-[#FF9100]" />
                <span>Smart Pause & Silence Cutter</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                AI Audio Cleaner <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">& Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Clean unwanted pauses and silence from your recordings while keeping your natural voice 100% intact.
              </p>
            </div>

            {/* Core Quality Pill */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% Original Voice Preserved</span>
            </div>
          </div>

          {/* Process Workflow Roadmap (Single Source of Truth) */}
          <StudioWorkflowRoadmap mode="audioClean" />
        </div>


        {/* Global Error Banner */}
        {isError && (
          <div className="max-w-2xl mx-auto rounded-[28px] border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-white">Audio cleanup failed</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              {jobStatus.message || "We couldn't clean this recording. Please try again."}
            </p>
            <button
              onClick={handleReset}
              className="rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 cursor-pointer"
            >
              Reset & Try Again
            </button>
          </div>
        )}

        {/* Studio Workspace */}
        {!isError && (
          <div className="space-y-6">
            <AudioCleanStudio
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              audioCleanOptions={audioCleanOptions}
              setAudioCleanOptions={setAudioCleanOptions}
              audioCleanAnalysis={audioCleanAnalysis}
              setAudioCleanAnalysis={setAudioCleanAnalysis}
              isAnalyzingAudio={isAnalyzingAudio}
              onReanalyzeWithScript={handleReanalyzeWithScript}
              audioCleanResult={audioCleanResult}
              onCleanAudio={handleCleanAudio}
              isCleaning={isCleaning}
              onReset={handleReset}
              onBackToEdit={handleBackToEdit}
            />
          </div>
        )}
      </main>
    </div>
  );
}
