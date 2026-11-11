"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { BookSummaryStudio } from "@/components/dashboard/BookSummaryStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { isFeatureLockedForUser } from "@/lib/billing/freeTierAccess";
import { FeaturePaywall } from "@/components/dashboard/FeaturePaywall";
import { useAuth } from "@/components/auth/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";

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

export default function BookSummaryPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  const renderRequestInFlightRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPayloadRef = useRef<any>(null);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/book-summary");
    }
  }, [user, authLoading, router]);

  // Billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}&email=${encodeURIComponent(user?.email || "")}`
        );
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

  // Cancel handler
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
      } catch { }
    }
    renderRequestInFlightRef.current = false;
    setJobStatus({ state: "idle" });
  };

  const handleConfirmExit = async () => {
    await handleCancelProcess();
    setShowExitConfirmModal(false);
    router.push("/dashboard");
  };

  // Start Render - called by BookSummaryStudio
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
    aspectRatio?: "16:9";
    words?: unknown[];
    timestampSegments?: unknown[];
    transcript?: string;
  }) => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/book-summary");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    lastPayloadRef.current = payload;
    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    const bookTitle = payload.bookTitle || "Book Summary";

    try {
      setJobStatus({
        state: "starting",
        message: "Submitting Book Summary render to cloud pipeline...",
        progress: 0.1,
      });

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: currentSignal,
        body: JSON.stringify({
          mediaKey: (payload as any).audioS3Key || payload.audioUrl,
          mediaUrl: payload.audioUrl,
          fileName: bookTitle + ".mp3",
          contentType: "audio/mpeg",
          mediaType: "audio",
          mode: "bookSummary",
          template: "BOOK_SUMMARY",
          templateName: "BOOK_SUMMARY",
          topicTitle: bookTitle,
          userId: user.id,
          userEmail: user.email || undefined,
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
          bgmUrl: (payload as any).bgmUrl || undefined,
          customBgmUrl: (payload as any).bgmUrl || undefined,
          bgmVolume: typeof (payload as any).bgmVolume === "number" ? (payload as any).bgmVolume : 0.12,
          aspectRatio: "16:9",
          mediaAspect: "landscape",
          visualTheme: (payload as any).visualTheme || "editorial-minimal",
          bookNotes: (payload as any).bookNotes,
          removeAiWatermark: Boolean(removeAiWatermark),
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
      const MAX_ATTEMPTS = 800;

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(pollInterval);
          renderRequestInFlightRef.current = false;
          setJobStatus({
            state: "error",
            message:
              "Render took longer than expected. Your video is still processing in the cloud - check your Projects shortly.",
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
                  "Building chapter cards and syncing spoken narration...",
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

  const handleReset = () => {
    setJobStatus({ state: "idle" });
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-semibold text-slate-800">Loading Book Summary Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar (Clean White Surface - Full Bleed, matching Image to Video AI) */}
      <StudioHeader
        studioName="Book Summary AI"
        aspectRatioLabel="16:9 Cinema"
        badgeLabel="Summary Cards"
        userRemainingCredits={billingEntitlement?.usage?.remaining ?? 0}
        isWorking={Boolean(jobStatus.state !== 'idle' && jobStatus.state !== 'ready')}
      />

      {/* Main Canvas - Full Screen Fluid Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {billingEntitlement && isFeatureLockedForUser("bookSummary", billingEntitlement) ? (
          <FeaturePaywall featureName="Book Summary Video" description="Turn book notes and voiceover into cinematic 16:9 book summary videos. Upgrade to access Book Summary Studio." />
        ) : jobStatus.state !== "idle" ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="bookSummary"
              title={jobStatus.title || "Book Summary Video"}
              status={jobStatus}
              onRetry={() => {
                if (lastPayloadRef.current) {
                  handleStartRender(lastPayloadRef.current);
                } else {
                  handleReset();
                }
              }}
              onCancel={() => setShowExitConfirmModal(true)}
              onReset={handleReset}
            />
          </div>
        ) : (
          <BookSummaryStudio
            onStartRender={handleStartRender}
            renderStatus={jobStatus}
            onResetRender={handleReset}
            onRetryRender={handleReset}
            onCancelRender={handleCancelProcess}
            removeAiWatermark={removeAiWatermark}
            onRemoveAiWatermarkChange={setRemoveAiWatermark}
          />
        )}
      </main>

      {/* Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-bold text-slate-900 mb-2">Cancel Active Render?</h3>
            <p className="text-xs text-slate-600 mb-5">
              Are you sure you want to stop this rendering process? Progress will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Continue Rendering
              </button>
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
