"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { CompareExplainerStudio } from "@/components/dashboard/CompareExplainerStudio";
import { useAuth } from "@/components/auth/AuthContext";
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
  Columns,
  Upload,
  Clapperboard,
  History
} from "lucide-react";
import CinematicRenderProgress from "@/components/dashboard/CinematicRenderProgress";


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

const COMPARE_RENDER_STEPS = [
  { label: "Assets received", detail: "Voiceover and 2 versus screenshots uploaded securely to cloud.", threshold: 0.12, icon: Upload },
  { label: "Transcribing voiceover", detail: "Speech AI planning comparison script alignments.", threshold: 0.38, icon: Columns },
  { label: "Syncing comparison scenes", detail: "Positioning split-screen cards, stickman presenter, and overlays.", threshold: 0.68, icon: Sparkles },
  { label: "Rendering HD Versus MP4", detail: "Remotion engine exporting smooth 3D tilt sweeps and side transitions.", threshold: 0.88, icon: Film },
  { label: "Ready to download", detail: "Viral comparison reel ready for TikTok, Instagram Reels, and Shorts.", threshold: 0.98, icon: Clapperboard },
];

export default function CompareExplainerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Compare Studio form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparisonFiles, setComparisonFiles] = useState<File[]>([]);
  const [compareLeftTitle, setCompareLeftTitle] = useState("");
  const [compareRightTitle, setCompareRightTitle] = useState("");
  const [compareHandle, setCompareHandle] = useState("");
  const [compareTheme, setCompareTheme] = useState("light");
  const [compareTone, setCompareTone] = useState("versus");
  const [compareWinner, setCompareWinner] = useState("none");
  const [compareImageStyle, setCompareImageStyle] = useState("rounded");
  const [stickerStyle, setStickerStyle] = useState("3d-presenter-man");
  const [compareCaptionStyle, setCompareCaptionStyle] = useState("Warikoo Black Card");
  const [compareSpeakingPace, setCompareSpeakingPace] = useState<"1.0" | "1.15" | "1.25">("1.15");
  const [compareBgmTrack, setCompareBgmTrack] = useState<"tech" | "versus" | "corporate" | "none">("versus");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");

  // Voiceover audio length tracker
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);

  // Job & render states
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");

  const renderRequestInFlightRef = useRef(false);

  // Timer for elapsed seconds
  useEffect(() => {
    if (jobStatus.state !== "rendering" && jobStatus.state !== "uploading") {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state]);


  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/compare-explainer");
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
      const dur = audio.duration;
      if (Number.isFinite(dur) && dur > 0) {
        setAudioDurationSeconds(dur);
      } else {
        setAudioDurationSeconds(0);
      }
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
    };
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

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

  // Recent renders history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_compare_projects");
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
          const compareRenders = payload.renders.filter(
            (r: RecentRender) => r.mode === "compare" || r.mode === "COMPARE_EXPLAINER"
          );
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            compareRenders.forEach((item: any) => { if (item?.id) map.set(item.id, item); });
            const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
            try {
              localStorage.setItem("itnavideo_compare_projects", JSON.stringify(merged.slice(0, 30)));
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



  const handleStartRender = async () => {
    if (!user) {
      router.push("/login?returnUrl=/dashboard/compare-explainer");
      return;
    }
    if (!selectedFile) {
      alert("Please upload a raw speech voiceover file first.");
      return;
    }
    if (comparisonFiles.length !== 2) {
      alert("Please upload exactly two split-screen compare images.");
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    try {
      setJobStatus({
        state: "uploading",
        message: "Uploading speech voiceover and compare images to secure cloud container...",
        progress: 0.08,
      });

      // 1. Upload main audio voiceover
      const mediaKey = await uploadFileViaPresign(selectedFile, "compare", user.id);

      // 2. Upload comparison images in batch
      const comparisonImageKeys = await Promise.all(
        comparisonFiles.map((file) => uploadFileViaPresign(file, "compare", user.id))
      );

      // 3. Submit Render Job
      setJobStatus({
        state: "starting",
        message: "Assembling comparison timelines...",
        progress: 0.22,
      });

      const plannedTitle = `${compareLeftTitle || "Left"} vs ${compareRightTitle || "Right"}`;

      const jobResponse = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || "audio/mpeg",
          mediaType: "audio",
          mode: "compare",
          topicTitle: plannedTitle,
          userId: user.id,
          userEmail: user.email || undefined,
          comparisonImageKeys,
          compareLeftTitle: compareLeftTitle.trim(),
          compareRightTitle: compareRightTitle.trim(),
          compareTheme,
          compareTone,
          compareWinner,
          compareImageStyle,
          compareSpeakingPace,
          compareBgmTrack,
          compareCaptionStyle,
          creatorHandle: compareHandle.trim() || "@itnavideo",
          stickerStyle,
          aspectRatio: "9:16",
          durationSeconds: Math.min(90, audioDurationSeconds),
          sourceDurationSeconds: Math.min(90, audioDurationSeconds),
          mediaAspect: "portrait",
          frameRange: audioDurationSeconds > 0 ? [0, Math.min(2700, Math.round(audioDurationSeconds * 30)) - 1] : undefined,
        }),
      });

      const jobPayload = await jobResponse.json().catch(() => ({}));
      if (!jobResponse.ok || !jobPayload.ok) {
        throw new Error(jobPayload.error || "Failed to start Compare Explainer render job.");
      }

      const renderId = jobPayload.renderId;
      const bucketName = jobPayload.bucketName;

      // 4. Poll render status
      setJobStatus({
        state: "rendering",
        message: "Comparing assets and building timeline...",
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
            message: "Comparison rendering timed out. Please check your history in a few minutes.",
          });
          return;
        }

        try {
          const statusParams = new URLSearchParams({
            renderId,
            bucketName,
            userId: user.id,
            mode: "compare",
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
              message: statusPayload.error || "Failed to fetch render status.",
            });
            return;
          }

          const serverState = statusPayload.state;
          const renderErrors = statusPayload.errors || [];
          const hasFatalError = serverState === "error" || (renderErrors.length > 0 && !statusPayload.isRetrying);

          if (hasFatalError) {
            clearInterval(pollInterval);
            renderRequestInFlightRef.current = false;
            const errorMsg = renderErrors[0]?.message || statusPayload.error || "Render job failed on cloud renderer.";
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
              mode: "compare",
              outputFile: statusPayload.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + 48 * 60 * 60 * 1000,
            };

            setRecentRenders((prev) => {
              const updated = [finishedRender, ...prev.filter((r) => r.id !== renderId)];
              localStorage.setItem("itnavideo_compare_projects", JSON.stringify(updated.slice(0, 30)));
              return updated;
            });

            setJobStatus({
              state: "ready",
              message: "Versus comparison video ready to export!",
              progress: 1,
              outputFile: statusPayload.outputFile,
              title: plannedTitle,
            });

            // Trigger credit cost refresh
            fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user?.id || "")}`)
              .then((r) => r.json())
              .then((payload) => {
                if (payload.ok && payload.entitlement) {
                  const ent = payload.entitlement;
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
            message: `Generating splitscreen compare rendering (${Math.round(progressEst * 100)}%)...`,
            progress: progressEst,
            renderId,
            bucketName,
            title: plannedTitle,
          });

        } catch (err) {
          console.warn("Poll status error:", err);
        }
      }, 3500);

    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({
        state: "error",
        message: err?.message || "Failed to submit compare job.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0D13] text-slate-100 selection:bg-[#FF5722]/20 selection:text-[#FF5722]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D13]/90 backdrop-blur-md">
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
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-4 py-1.5 text-xs font-black text-[#FF5722] shadow-sm">
                <Zap size={13} className="fill-[#FF5722]" />
                <span>{billingEntitlement.usage?.remaining ?? 0} Credits Left</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* Dynamic Stepper Overlay during Render - Zero Blue Cinematic Render Screen */}
        {jobStatus.state !== "idle" && jobStatus.state !== "ready" && (
          <CinematicRenderProgress
            title="Versus Comparison Reel"
            subtitle="Composing split-screen comparison cards, dynamic presenter reactions, and synced captions."
            modeLabel="9:16 Compare Explainer Studio"
            progress={jobStatus.progress}
            isIndeterminate={jobStatus.progress === undefined}
            statusMessage={jobStatus.message}
            elapsedSeconds={elapsedSeconds}
            steps={COMPARE_RENDER_STEPS}
            isError={jobStatus.state === "error"}
            errorMessage={jobStatus.message}
            onRetry={() => handleStartRender()}
            onReset={() => setJobStatus({ state: "idle" })}
            showTipsCarousel={true}
          />
        )}


        {/* Ready Download Preview Stage - Kept Dark Black for contrast */}
        {jobStatus.state === "ready" && jobStatus.outputFile && (
          <div className="rounded-[28px] border border-white/10 bg-[#0B0D13] p-6 shadow-2xl max-w-2xl mx-auto text-center space-y-6 text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Versus Comparison Reel is Ready!</h3>
              <p className="text-xs text-zinc-400">Your dual split-screen explainer render has completed successfully.</p>
            </div>

            <video
              src={jobStatus.outputFile}
              controls
              className="mx-auto h-[480px] w-auto rounded-2xl bg-black border border-slate-800 shadow-2xl"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <a
                href={jobStatus.outputFile}
                download={jobStatus.title ? `${jobStatus.title}.mp4` : "compare-reel.mp4"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 transition hover:brightness-110 active:scale-95"
              >
                <Download size={14} />
                <span>Download HD MP4 Video</span>
              </a>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setComparisonFiles([]);
                  setJobStatus({ state: "idle" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-bold text-zinc-300 transition active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Create New Comparison</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Views */}
        {jobStatus.state === "idle" && (
          <>
            {activeTab === "studio" && (
              <div className="space-y-12">
                <CompareExplainerStudio
                  comparisonFiles={comparisonFiles}
                  onComparisonFilesChange={setComparisonFiles}
                  compareLeftTitle={compareLeftTitle}
                  onLeftTitleChange={setCompareLeftTitle}
                  compareRightTitle={compareRightTitle}
                  onRightTitleChange={setCompareRightTitle}
                  compareHandle={compareHandle}
                  onHandleChange={setCompareHandle}
                  compareTheme={compareTheme}
                  onThemeChange={setCompareTheme}
                  compareTone={compareTone}
                  onToneChange={setCompareTone}
                  compareWinner={compareWinner}
                  onWinnerChange={setCompareWinner}
                  compareImageStyle={compareImageStyle}
                  onImageStyleChange={setCompareImageStyle}
                  stickerStyle={stickerStyle}
                  onStickerStyleChange={setStickerStyle}
                  aspectRatio={aspectRatio}
                  onAspectRatioChange={setAspectRatio}
                  compareCaptionStyle={compareCaptionStyle}
                  onCaptionStyleChange={setCompareCaptionStyle}
                  compareSpeakingPace={compareSpeakingPace}
                  onSpeakingPaceChange={setCompareSpeakingPace}
                  compareBgmTrack={compareBgmTrack}
                  onBgmTrackChange={setCompareBgmTrack}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  onCleanAudio={handleStartRender}
                  isCleaning={false}
                />

                {/* Popular Comparison Formats Showcase */}
                <div className="mx-auto max-w-4xl pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Sparkles size={14} className="text-[#FFA000]" />
                        <span>Popular Comparison Formats</span>
                      </h3>
                      <p className="text-xs text-zinc-400">Click any format to quick-fill your comparison titles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { title: "Tech & Gadgets", example: "iPhone 16 Pro vs Galaxy S25 Ultra", icon: "📱", tag: "Tech" },
                      { title: "Personal Finance", example: "Debit Card vs Credit Card", icon: "💳", tag: "Finance" },
                      { title: "Investing & Wealth", example: "SIP vs Lump Sum Investing", icon: "📈", tag: "Investing" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        onClick={() => {
                          const [l, r] = item.example.split(" vs ");
                          if (l && r) {
                            setCompareLeftTitle(l);
                            setCompareRightTitle(r);
                          }
                        }}
                        className="group rounded-2xl border border-white/10 bg-[#0E1526]/80 p-4 shadow-sm hover:border-[#FF5722]/50 hover:bg-[#111726] hover:shadow-lg hover:shadow-[#FF5722]/10 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{item.icon}</span>
                          <span className="rounded-full bg-white/5 group-hover:bg-[#FF5722]/15 px-2 py-0.5 text-[10px] font-bold text-zinc-400 group-hover:text-[#FFA000] transition">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="mt-2 text-xs font-black text-white group-hover:text-[#FFA000] transition">{item.title}</h4>
                        <p className="mt-1 text-[11px] text-zinc-400 font-medium group-hover:text-zinc-200 transition">
                          {item.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
