"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { BookSummaryStudio } from "@/components/dashboard/BookSummaryStudio";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Loader2,
  Download,
  History,
  Clock,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookSummaryPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [renderStartedAt, setRenderStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  const renderRequestInFlightRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Auth redirect ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ── Billing entitlement ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`
        );
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

  // ── Recent renders (localStorage + server history) ───────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_book_summary_projects");
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
        const res = await fetch(
          `/api/reels/history?userId=${encodeURIComponent(user?.id || "")}`
        );
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && Array.isArray(payload.renders)) {
          const bsRenders: RecentRender[] = payload.renders
            .filter(
              (r: RecentRender) =>
                r.mode === "bookSummary" ||
                r.mode === "book-summary" ||
                r.mode === "BOOK_SUMMARY"
            )
            .map((r: any) => ({
              id: r.renderId || r.id,
              title: r.title || "Book Summary Video",
              mode: "bookSummary",
              outputFile: r.outputFile || r.outputUrl || "",
              createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
              expiresAt: r.expiresAt
                ? new Date(r.expiresAt).getTime()
                : Date.now() + 48 * 60 * 60 * 1000,
            }));
          if (bsRenders.length > 0) {
            setRecentRenders((prev) => {
              const merged = [
                ...bsRenders,
                ...prev.filter((p) => !bsRenders.some((r) => r.id === p.id)),
              ];
              return merged.slice(0, 30);
            });
          }
        }
      } catch (err) {
        console.warn("Could not load render history:", err);
      }
    }
    fetchHistory();
  }, [user]);

  // ── Live timer tick during render ────────────────────────────────────────────
  useEffect(() => {
    const isActive =
      jobStatus.state === "uploading" ||
      jobStatus.state === "starting" ||
      jobStatus.state === "rendering";
    if (!isActive || !renderStartedAt) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - renderStartedAt) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state, renderStartedAt]);

  // ── Cancel handler ───────────────────────────────────────────────────────────
  const handleCancelProcess = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (jobStatus.renderId) {
      try {
        await fetch("/api/reels/jobs/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renderId: jobStatus.renderId, userId: user?.id }),
        });
      } catch {}
    }
    renderRequestInFlightRef.current = false;
    setJobStatus({ state: "idle" });
    setRenderStartedAt(null);
    setElapsedSeconds(0);
  };

  const handleBackClick = () => {
    const isProcessActive =
      jobStatus.state === "uploading" ||
      jobStatus.state === "starting" ||
      jobStatus.state === "rendering";
    if (isProcessActive) {
      setShowExitConfirmModal(true);
    } else {
      router.push("/dashboard");
    }
  };

  const handleConfirmExit = async () => {
    await handleCancelProcess();
    setShowExitConfirmModal(false);
    router.push("/dashboard");
  };

  // ── onStartRender — called by BookSummaryStudio when user clicks "Render" ────
  const handleStartRender = async (payload: {
    mode: string;
    template: string;
    audioUrl: string;
    durationSeconds: number;
    bookTitle?: string;
    authorName?: string;
    bookCoverUrl?: string;
    authorPortraitUrl?: string;
    referenceImages?: string[];
    scenes: unknown[];
    metadata?: unknown;
    captionsTheme?: string;
    words?: unknown[];
    timestampSegments?: unknown[];
    transcript?: string;
  }) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    const bookTitle = payload.bookTitle || "Book Summary";

    try {
      setRenderStartedAt(Date.now());
      setElapsedSeconds(0);
      setJobStatus({
        state: "starting",
        message: "Submitting Book Summary render to cloud pipeline...",
        progress: 0.1,
      });

      // The audio is already uploaded by BookSummaryStudio — audioUrl is a cloud URL.
      // We need its S3 key (relative path) for the jobs route's mediaKey field.
      // Pass the full audioUrl as mediaKey so the backend can resolve it.
      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: currentSignal,
        body: JSON.stringify({
          mediaKey: payload.audioUrl,
          mediaUrl: payload.audioUrl,
          fileName: bookTitle + ".mp3",
          contentType: "audio/mpeg",
          mediaType: "audio",
          mode: "bookSummary",
          topicTitle: bookTitle,
          userId: user.id,
          bookTitle: payload.bookTitle,
          authorName: payload.authorName,
          bookCoverUrl: payload.bookCoverUrl,
          authorPortraitUrl: payload.authorPortraitUrl,
          referenceImages: payload.referenceImages || [],
          scenes: payload.scenes,
          durationSeconds: payload.durationSeconds,
          transcript: payload.transcript,
          words: payload.words,
          timestampSegments: payload.timestampSegments,
          captionsTheme: payload.captionsTheme || "glow-viral",
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Book Summary render job.");
      }

      const jobId = jobPayload.jobId;
      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      setJobStatus({
        state: "rendering",
        message: "Remotion is rendering your Book Summary video in 1080p Full HD...",
        progress: 0.3,
        renderId,
        bucketName,
        title: bookTitle,
      });

      // Poll status
      let attempts = 0;
      const MAX_ATTEMPTS = 800; // ~40 min for up to 12-min videos

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message:
              "Render took longer than expected. Your video is still processing in the cloud — check your Projects tab shortly.",
          });
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId || "")}&renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&title=${encodeURIComponent(bookTitle)}&mode=bookSummary`
          );
          const statusPayload = await statusRes.json().catch(() => ({}));

          if (statusPayload.ok) {
            const serverState = statusPayload.state;
            const currentProgress =
              typeof statusPayload.progress === "number" ? statusPayload.progress : 0.4;

            const isComplete =
              (serverState === "ready" || serverState === "done" || Boolean(statusPayload.done)) &&
              Boolean(statusPayload.outputFile);

            if (isComplete) {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;

              const completedRender: RecentRender = {
                id: renderId,
                title: bookTitle,
                mode: "bookSummary",
                outputFile: statusPayload.outputFile,
                createdAt: Date.now(),
                expiresAt: Date.now() + 48 * 60 * 60 * 1000,
              };

              setRecentRenders((prev) => {
                const next = [completedRender, ...prev.filter((r) => r.id !== renderId)];
                try {
                  localStorage.setItem(
                    "itnavideo_book_summary_projects",
                    JSON.stringify(next.slice(0, 30))
                  );
                } catch {}
                return next;
              });

              setJobStatus({
                state: "ready",
                message: "Your Book Summary video is ready to download!",
                progress: 1,
                outputFile: statusPayload.outputFile,
                renderId,
                bucketName,
                title: bookTitle,
              });

              // Save to history
              fetch("/api/reels/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  renderId,
                  bucketName,
                  mode: "bookSummary",
                  title: bookTitle,
                  outputFile: statusPayload.outputFile,
                  createdAt: new Date().toISOString(),
                  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                }),
              }).catch((e) => console.warn("Could not save render history:", e));
            } else if (serverState === "error") {
              clearInterval(pollInterval);
              renderRequestInFlightRef.current = false;
              setJobStatus({
                state: "error",
                message: statusPayload.message || "Render failed during video generation.",
                diagnostics: statusPayload.diagnostics,
              });
            } else {
              setJobStatus((prev) => ({
                ...prev,
                state: "rendering",
                message:
                  statusPayload.message ||
                  "Building lesson cards and syncing spoken narration...",
                progress: Math.max(prev.progress || 0.3, currentProgress),
              }));
            }
          }
        } catch (pollErr) {
          console.warn("[BookSummary] Polling error:", pollErr);
        }
      }, 3000);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: error?.message || "An unexpected error occurred during rendering.",
      });
    }
  };

  // ── Download helper ──────────────────────────────────────────────────────────
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

  // ── Reset ────────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setJobStatus({ state: "idle" });
    setRenderStartedAt(null);
    setElapsedSeconds(0);
  };

  // ── Derived state ────────────────────────────────────────────────────────────
  const userRemainingCredits = billingEntitlement?.active
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;

  const isWorking =
    jobStatus.state === "uploading" ||
    jobStatus.state === "starting" ||
    jobStatus.state === "rendering";

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6D00]" />
        <p className="text-sm font-semibold text-zinc-200">Loading Book Summary Studio...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col selection:bg-[#FF6D00]/30 selection:text-white pb-12">

      {/* ── Top Navigation Bar (Google Analytics Obsidian Surface) ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0E1526]/90 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          {/* Left: back + logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Tools</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <BrandLogo size="sm" showBadge={false} />

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF9100]">
              <BookOpen size={11} />
              Book Summary Studio
            </span>
          </div>

          {/* Right: credits + tabs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer badge while rendering */}
            {isWorking && (
              <div className="flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1.5 text-xs font-black text-[#FF9100]">
                <Clock size={13} className="animate-pulse" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
            )}

            {/* Credits badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#151E30] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-sm">
              <Zap size={14} className="text-[#FF6D00] fill-[#FF6D00]" />
              <span className="text-zinc-400 hidden xs:inline">Balance:</span>
              <span className="text-white font-black">
                {billingEntitlement ? userRemainingCredits : "..."} Cr
              </span>
              <Link
                href="/pricing"
                className="ml-0.5 text-[11px] text-[#FF9100] hover:text-[#FFA726] underline font-black"
              >
                +Add
              </Link>
            </div>

            {/* History tab button */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "history" ? "studio" : "history")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "history"
                  ? "border-[#FF6D00]/40 bg-[#FF6D00]/10 text-[#FF9100]"
                  : "border-white/10 bg-[#151E30] text-zinc-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <History size={13} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero banner with Mascot Image */}
        <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0E1526] via-[#111827] to-[#151E30] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-2xl z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <button
                type="button"
                onClick={handleBackClick}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#FF9100] transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Video Modes</span>
              </button>
              <span>/</span>
              <span className="text-zinc-200">Book Summary Video</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Book Summary{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Video Studio
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Upload your book narration audio, add cover art, review the AI-generated storyboard, and render a stunning 16:9 Full HD summary video with visual chapters and takeaways.
            </p>

            {/* Spec badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                <Sparkles size={12} className="text-[#FF9100]" />
                16:9 Widescreen
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                1080p Full HD
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                ⚡ ~35s render
              </span>
            </div>
          </div>

          {/* Mascot Visual Guide */}
          <div className="shrink-0 relative z-10 flex items-center justify-center pt-2 md:pt-0">
            <img
              src="/visuals/book_summary_mascot.png"
              alt="Book Summary Visual Guide"
              className="h-32 sm:h-44 w-auto object-contain drop-shadow-[0_10px_25px_rgba(255,109,0,0.25)] hover:scale-105 transition-transform duration-300 pointer-events-none"
            />
          </div>
        </div>

        {/* ── Tab: Studio ────────────────────────────────────────────────────────── */}
        {activeTab === "studio" && (
          <BookSummaryStudio
            onStartRender={handleStartRender}
            renderStatus={{ ...jobStatus, message: jobStatus.message || '' }}
            onResetRender={handleReset}
            onRetryRender={handleReset}
            onCancelRender={handleCancelProcess}
          />
        )}

        {/* ── Tab: History ───────────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Recent Book Summary Renders</h2>
              <button
                type="button"
                onClick={() => setActiveTab("studio")}
                className="text-xs font-bold text-[#FF6D00] hover:text-[#FFA726] transition"
              >
                ← Back to Studio
              </button>
            </div>

            {recentRenders.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white py-16 text-center">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-sm font-bold text-slate-500">No renders yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Your completed Book Summary videos will appear here for 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("studio")}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-2.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
                >
                  <Sparkles size={14} />
                  Create Your First Book Summary
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRenders.map((render) => {
                  const isExpired = render.expiresAt < Date.now();
                  const expiresInHours = Math.max(
                    0,
                    Math.ceil((render.expiresAt - Date.now()) / (60 * 60 * 1000))
                  );

                  return (
                    <div
                      key={render.id}
                      className="rounded-[28px] border border-slate-200 bg-white p-5 space-y-4 hover:border-[#FF6D00]/40 hover:shadow-lg hover:shadow-[#FF6D00]/10 transition-all duration-300"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                        {render.outputFile && !isExpired ? (
                          <video
                            src={render.outputFile}
                            className="w-full h-full object-cover rounded-2xl"
                            muted
                            playsInline
                            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                            onMouseLeave={(e) => {
                              const v = e.currentTarget as HTMLVideoElement;
                              v.pause();
                              v.currentTime = 0;
                            }}
                          />
                        ) : (
                          <BookOpen size={32} className="text-slate-300" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900 truncate">{render.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(render.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {isExpired ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                          <Clock size={12} />
                          <span>Expired</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            Expires in {expiresInHours}h
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              downloadVideoDirectly(
                                render.outputFile,
                                `itnavideo-book-summary-${render.id.slice(-6)}.mp4`
                              )
                            }
                            disabled={downloadingUrl === render.outputFile}
                            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-3.5 py-1.5 text-xs font-black text-black shadow-sm shadow-[#FF6D00]/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                          >
                            <Download size={12} />
                            {downloadingUrl === render.outputFile ? "Downloading..." : "Download"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Exit Confirmation Modal ─────────────────────────────────────────────── */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-[28px] border border-white/10 bg-[#0E1526] p-8 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <ArrowLeft size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-black text-white">Leave Studio?</h3>
              <p className="text-sm text-slate-400">
                A render is currently in progress. Leaving will cancel the render job and credits used will not be refunded.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-[#151E30] px-4 py-3 text-sm font-bold text-slate-300 hover:bg-[#1C2840] hover:text-white transition active:scale-95"
              >
                Keep Rendering
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 rounded-2xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/30 hover:text-red-300 transition active:scale-95"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
