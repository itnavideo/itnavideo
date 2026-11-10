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
import { useAuth } from "@/components/auth/AuthContext";
import { uploadFileViaPresign } from "@/lib/media/presignedUpload";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";

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

export default function AudioCleanerPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioCleanOptions, setAudioCleanOptions] = useState<AudioCleanStudioOptions>({
    removeRepeatedTakes: true,
    removeFillerWords: true,
    smartSilenceCut: true,
    voicePreserveMode: "natural",
    pacing: "fast",
    exportFormat: "mp3",
    vocalTone: "natural",
  });
  const audioCleanOptionsRef = useRef(audioCleanOptions);
  audioCleanOptionsRef.current = audioCleanOptions;

  const [audioCleanAnalysis, setAudioCleanAnalysis] = useState<AudioCleanStudioAnalysis | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [audioCleanResult, setAudioCleanResult] = useState<AudioCleanStudioResult | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);

  const isUploadingOrAnalyzingRef = useRef(false);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/audio-cleaner");
    }
  }, [user, authLoading, router]);

  // Billing Entitlement
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
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining ?? (limit - used))));
          setBillingEntitlement({
            active: Boolean(ent.active),
            planId: ent.planId || "paid",
            planName: ent.planName || "Creator",
            monthlyVideoLimit: limit,
            expiresAt: ent.expiresAt,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn("Could not load billing entitlement:", err);
      }
    }
    fetchBilling();
  }, [user]);

  // Handle Automatic Cloud Upload & Transcription Analysis upon file selection
  useEffect(() => {
    let isSubscribed = true;

    async function triggerAudioAnalysis() {
      if (!selectedFile || !user?.id) return;
      if (isUploadingOrAnalyzingRef.current) return;
      isUploadingOrAnalyzingRef.current = true;

      setIsAnalyzingAudio(true);
      setAudioCleanAnalysis(null);
      setAudioCleanResult(null);
      setJobStatus({ state: "uploading", message: "Uploading audio to cloud stream...", progress: 0.1 });

      try {
        const mediaKey = await uploadFileViaPresign(selectedFile, "audioClean", user.id);

        if (!isSubscribed) return;

        setJobStatus({
          state: "starting",
          message: "Groq Whisper transcribing & mapping silence gaps...",
          progress: 0.35,
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
            : "Audio analysis failed. Please try again.";
          throw new Error(errorMessage);
        }

        const analysisData = await readAudioCleanStream(analyzeResponse, (event) => {
          if (!isSubscribed) return;
          setJobStatus({
            state: "starting",
            message: event.message,
            progress: event.progress,
          });
        });

        if (!isAudioCleanStudioAnalysis(analysisData)) {
          throw new Error("Audio analysis result was incomplete. Please try again.");
        }

        if (isSubscribed) {
          setAudioCleanAnalysis(analysisData);
          setJobStatus({ state: "idle", message: "" });
        }
      } catch (err: unknown) {
        if (!isSubscribed) return;
        console.error("Audio clean analysis error:", err);
        setJobStatus({
          state: "error",
          message: getErrorMessage(err, "We couldn't analyze your audio. Try a clearer recording."),
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

  // Handle re-align transcription with edited script
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

  const isError = jobStatus.state === "error";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading AI Audio Cleaner...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Standardized Unified Studio Navigation Header */}
      <StudioHeader
        studioName="AI Audio Cleaner"
        aspectRatioLabel="Studio Audio"
        badgeLabel="Noise & Retake Cleaner"
        userRemainingCredits={billingEntitlement?.usage?.remaining}
        isWorking={isCleaning || isAnalyzingAudio}
      />
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {isError ? (
          <div className="max-w-2xl mx-auto my-auto p-8 rounded-2xl border border-rose-200 bg-rose-50/60 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 border border-rose-200">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Audio cleanup failed</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              {jobStatus.message || "We couldn't clean this recording. Please try a clearer audio file."}
            </p>
            <button
              onClick={handleReset}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition active:scale-95 cursor-pointer"
            >
              Reset &amp; Try Again
            </button>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}
