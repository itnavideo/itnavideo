"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { KineticMotionStudio } from "@/components/dashboard/KineticMotionStudio";
import InteractiveRenderEngine from "@/components/render/InteractiveRenderEngine";
import { useAuth } from "@/components/auth/AuthContext";
import {
  resolveInitialKMPreset,
  getBridgeStyleId,
  KM_LAST_PRESET_KEY,
  type KineticMotionPresetId,
} from "@/lib/kineticMotion/kineticMotionPresets";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Film,
  Loader2,
  Upload,
  Clapperboard,
  History,
  Clock,
  Download,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  usage?: { used: number; limit: number; remaining: number };
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

export default function KineticMotionPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const presetParam = searchParams.get("preset_id");

  // ── Studio state ─────────────────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<KineticMotionPresetId>(
    () => resolveInitialKMPreset(presetParam)
  );
  const [sfxIntensity, setSfxIntensity] = useState<"full" | "subtle" | "none">("full");
  const [pacing, setPacing] = useState<"fast" | "smooth">("fast");
  const [textCase, setTextCase] = useState<"uppercase" | "natural">("uppercase");
  const [accentColor, setAccentColor] = useState<string>("#FACC15");
  const [fontFamily, setFontFamily] = useState<string>("preset");
  const [intensity, setIntensity] = useState<"normal" | "aggressive">("normal");
  const [mediaDurationSeconds, setMediaDurationSeconds] = useState<number>(0);

  // ── Job state ─────────────────────────────────────────────────────────────────
  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: "idle" });
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [activeTab, setActiveTab] = useState<"studio" | "history">("studio");
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  const renderRequestInFlightRef = useRef(false);

  // ── Sync URL preset param on mount ───────────────────────────────────────────
  useEffect(() => {
    const resolved = resolveInitialKMPreset(presetParam);
    setSelectedPreset(resolved);
  }, [presetParam]);

  // ── Persist last-used preset ─────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPreset) return;
    try { localStorage.setItem(KM_LAST_PRESET_KEY, selectedPreset); } catch {}
  }, [selectedPreset]);

  // ── Auth redirect ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/dashboard/typography-video");
    }
  }, [user, authLoading, router]);

  // ── Billing ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`/api/billing/entitlement?userId=${encodeURIComponent(user.id)}`);
        const p = await res.json().catch(() => ({}));
        if (res.ok && p.ok && p.entitlement) {
          const ent = p.entitlement;
          const limit = Math.max(0, Math.round(Number(p.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(p.usage?.used || 0)));
          setBillingEntitlement({
            active: Boolean(ent.active),
            planId: ent.planId || "paid",
            planName: ent.planName || "Creator",
            monthlyVideoLimit: limit,
            usage: { used, limit, remaining: Math.max(0, limit - used) },
          });
        }
      } catch {}
    })();
  }, [user]);

  // ── History ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itnavideo_kinetic_motion_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentRenders(parsed);
      }
    } catch {}

    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`/api/reels/history?userId=${encodeURIComponent(user.id)}`);
        const p = await res.json().catch(() => ({}));
        if (res.ok && p.ok && Array.isArray(p.renders)) {
          const filtered: RecentRender[] = p.renders
            .filter((r: any) =>
              r.mode === "typographyVideo" ||
              r.mode === "TYPOGRAPHY_VIDEO" ||
              r.mode === "kineticMotion"
            )
            .map((r: any) => ({
              id: r.renderId || r.id,
              title: r.title || "Kinetic Motion Video",
              mode: "typographyVideo",
              outputFile: r.outputFile || r.outputUrl || "",
              createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
              expiresAt: r.expiresAt
                ? new Date(r.expiresAt).getTime()
                : Date.now() + 48 * 60 * 60 * 1000,
            }));
          setRecentRenders((prev) => {
            const map = new Map<string, RecentRender>();
            prev.forEach((r) => map.set(r.id, r));
            filtered.forEach((r) => map.set(r.id, r));
            const merged = Array.from(map.values())
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 30);
            try { localStorage.setItem("itnavideo_kinetic_motion_projects", JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } catch {}
    })();
  }, [user]);

  // ── Media duration detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedFile) { setMediaDurationSeconds(0); return; }
    const isVideo = selectedFile.type.startsWith("video/");
    const el = document.createElement(isVideo ? "video" : "audio");
    const url = URL.createObjectURL(selectedFile);
    el.src = url;
    el.onloadedmetadata = () => { setMediaDurationSeconds(el.duration || 0); URL.revokeObjectURL(url); };
    el.onerror = () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // ── Presign upload ───────────────────────────────────────────────────────────
  async function uploadFileViaPresign(file: File, userId: string): Promise<string> {
    const contentType = file.type || "application/octet-stream";
    const res = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType, fileSize: file.size, mode: "typographyVideo", userId }),
    });
    const p = await res.json().catch(() => ({}));
    if (!res.ok || !p.ok || !p.uploadUrl) throw new Error(p.error || "Upload preparation failed");
    const uploadRes = await fetch(p.uploadUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: file });
    if (!uploadRes.ok) throw new Error("File upload failed");
    return p.key as string;
  }

  // ── Start render ─────────────────────────────────────────────────────────────
  async function handleStartRender() {
    if (!user) { router.push("/login?returnUrl=/dashboard/typography-video"); return; }
    if (!selectedFile) { alert("Please upload a video or audio file first."); return; }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;

    // Phase 1 bridge: resolve KM preset → existing TypographyStyleId for Lambda
    const bridgeStyle = getBridgeStyleId(selectedPreset);
    const plannedTitle = selectedFile.name.replace(/\.[^/.]+$/, "").slice(0, 50) || "Kinetic Motion Reel";
    const isAudio = selectedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);

    try {
      setJobStatus({ state: "uploading", message: "Uploading media securely to cloud...", progress: 0.08 });

      const mediaKey = await uploadFileViaPresign(selectedFile, user.id);

      setJobStatus({ state: "starting", message: "Injecting Kinetic Motion parameters...", progress: 0.22 });

      const jobRes = await fetch("/api/reels/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaKey,
          fileName: selectedFile.name,
          contentType: selectedFile.type || (isAudio ? "audio/mpeg" : "video/mp4"),
          mediaType: isAudio ? "audio" : "video",
          // Backend mode stays 'typographyVideo' — no Lambda change needed
          mode: "typographyVideo",
          topicTitle: plannedTitle,
          userId: user.id,
          // Phase 1 bridge: send the compatible TypographyStyleId
          typographyStyle: bridgeStyle,
          // Store the KM preset ID in metadata for future Phase 2 use
          kineticMotionPreset: selectedPreset,
          typographyShowCaptions: false,
          sfxIntensity,
          pacing,
          textCase,
          accentColor,
          fontFamily: fontFamily === "preset" ? undefined : fontFamily,
          animationIntensity: intensity,
          durationSeconds: mediaDurationSeconds || 30,
          sourceDurationSeconds: mediaDurationSeconds || 30,
          mediaAspect: "portrait",
          frameRange: mediaDurationSeconds > 0
            ? [0, Math.min(2700, Math.round(mediaDurationSeconds * 30)) - 1]
            : undefined,
        }),
      });

      const jobPayload = await jobRes.json().catch(() => ({}));
      if (!jobRes.ok || !jobPayload.ok) throw new Error(jobPayload.error || "Failed to start Kinetic Motion render.");

      const { renderId, bucketName, jobId } = jobPayload;

      setJobStatus({
        state: "rendering",
        message: "Speech AI transcribing voice timings...",
        progress: 0.35,
        renderId,
        bucketName,
        title: plannedTitle,
      });

      // Poll status
      let attempts = 0;
      const MAX_ATTEMPTS = 400;

      const poll = setInterval(async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          clearInterval(poll);
          renderRequestInFlightRef.current = false;
          setJobStatus({ state: "error", message: "Render timed out. Check your Projects tab shortly." });
          return;
        }
        try {
          const statusRes = await fetch(
            `/api/reels/jobs/status?jobId=${encodeURIComponent(jobId || "")}&renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName || "")}&userId=${encodeURIComponent(user.id)}&title=${encodeURIComponent(plannedTitle)}&mode=typographyVideo`
          );
          const sp = await statusRes.json().catch(() => ({}));
          if (!sp.ok) return;

          const isComplete = (sp.state === "ready" || sp.state === "done" || Boolean(sp.done)) && Boolean(sp.outputFile);
          if (isComplete) {
            clearInterval(poll);
            renderRequestInFlightRef.current = false;
            const completed: RecentRender = {
              id: renderId,
              title: plannedTitle,
              mode: "typographyVideo",
              outputFile: sp.outputFile,
              createdAt: Date.now(),
              expiresAt: Date.now() + 48 * 60 * 60 * 1000,
            };
            setRecentRenders((prev) => {
              const next = [completed, ...prev.filter((r) => r.id !== renderId)];
              try { localStorage.setItem("itnavideo_kinetic_motion_projects", JSON.stringify(next.slice(0, 30))); } catch {}
              return next;
            });
            setJobStatus({ state: "ready", message: "Your Kinetic Motion video is ready!", progress: 1, outputFile: sp.outputFile, renderId, bucketName, title: plannedTitle });
            fetch("/api/reels/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id, renderId, bucketName, mode: "typographyVideo", title: plannedTitle, outputFile: sp.outputFile, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() }),
            }).catch(() => {});
          } else if (sp.state === "error") {
            clearInterval(poll);
            renderRequestInFlightRef.current = false;
            setJobStatus({ state: "error", message: sp.message || "Render failed.", diagnostics: sp.diagnostics });
          } else {
            setJobStatus((prev) => ({
              ...prev,
              state: "rendering",
              message: sp.message || "Applying kinetic motion animations...",
              progress: Math.max(prev.progress || 0.35, typeof sp.progress === "number" ? sp.progress : 0),
            }));
          }
        } catch {}
      }, 3000);
    } catch (err: any) {
      renderRequestInFlightRef.current = false;
      setJobStatus({ state: "error", message: err?.message || "Unexpected error during rendering." });
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setJobStatus({ state: "idle" });
    setSelectedFile(null);
    renderRequestInFlightRef.current = false;
  };

  // ── Download ──────────────────────────────────────────────────────────────────
  const downloadVideoDirectly = async (url: string, filename: string) => {
    try {
      setDownloadingUrl(url);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch { window.open(url, "_blank"); }
    finally { setDownloadingUrl(null); }
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const userRemaining = billingEntitlement?.active
    ? Math.round(billingEntitlement.usage?.remaining ?? billingEntitlement.monthlyVideoLimit ?? 0)
    : undefined;
  const isWorking = ["uploading", "starting", "rendering"].includes(jobStatus.state);
  const isReady = jobStatus.state === "ready" && Boolean(jobStatus.outputFile);
  const isError = jobStatus.state === "error";

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-[#FF6D00]" />
        <span className="text-sm font-semibold text-slate-400">Loading Kinetic Motion Studio...</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-[#FF6D00]/30 selection:text-white pb-28 sm:pb-0">

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0E1526]/90 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#151E30] hover:bg-[#1C2840] px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">All Tools</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <BrandLogo size="sm" showBadge={false} />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-2.5 py-0.5 text-[11px] font-black text-[#FF6D00]">
              <Sparkles size={11} />
              Kinetic Motion Studio
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0E1526] px-3 py-1.5 text-xs font-bold shadow-xs">
              <Zap size={13} className="text-[#FFA726] fill-[#FFA726]" />
              <span className="text-slate-400 hidden xs:inline">Balance:</span>
              <span className="text-white font-extrabold">{billingEntitlement ? userRemaining : "..."} Videos</span>
              <Link href="/pricing" className="ml-0.5 text-[11px] text-[#FF8F00] hover:text-[#FFA726] underline font-black">+Add</Link>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "history" ? "studio" : "history")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "history"
                  ? "border-[#FF6D00]/40 bg-[#FF6D00]/10 text-[#FF6D00]"
                  : "border-white/10 bg-[#151E30] text-slate-300 hover:text-white"
              }`}
            >
              <History size={13} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
              <button onClick={() => router.push("/dashboard")} className="hover:text-[#FF6D00] transition">← Video Modes</button>
              <span>/</span>
              <span className="text-slate-300">Kinetic Motion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kinetic Motion{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Video Studio
              </span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-lg">
              Transform speech into dynamic, animated kinetic text — 11 motion presets, 1080p Full HD, instant cloud render.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#151E30] border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">
              <Sparkles size={11} className="text-[#FF6D00]" /> 11 Motion Presets
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#151E30] border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">
              9:16 · 1080p
            </span>
          </div>
        </div>

        {/* ── Tab: Studio ── */}
        {activeTab === "studio" && (
          <>
            {(isWorking || isReady || isError) ? (
              <div className="max-w-3xl mx-auto py-4">
                <InteractiveRenderEngine
                  mode="typographyVideo"
                  status={{
                    state: isReady ? "ready" : isError ? "error" : (jobStatus.state as any),
                    message: jobStatus.message || "",
                    progress: jobStatus.progress,
                    outputFile: jobStatus.outputFile,
                    title: jobStatus.title,
                    diagnostics: jobStatus.diagnostics,
                  }}
                  title={jobStatus.title || "Kinetic Motion Reel"}
                  fileName={selectedFile?.name}
                  onRetry={handleStartRender}
                  onReset={handleReset}
                />
              </div>
            ) : (
              <KineticMotionStudio
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
                sfxIntensity={sfxIntensity}
                onSfxIntensityChange={setSfxIntensity}
                pacing={pacing}
                onPacingChange={setPacing}
                textCase={textCase}
                onTextCaseChange={setTextCase}
                accentColor={accentColor}
                onAccentColorChange={setAccentColor}
                fontFamily={fontFamily}
                onFontFamilyChange={setFontFamily}
                intensity={intensity}
                onIntensityChange={setIntensity}
                onGenerate={handleStartRender}
                isGenerating={isWorking}
              />
            )}
          </>
        )}

        {/* ── Tab: History ── */}
        {activeTab === "history" && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Recent Kinetic Motion Renders</h2>
              <button onClick={() => setActiveTab("studio")} className="text-xs font-bold text-[#FF6D00] hover:text-[#FFA726] transition">
                ← Back to Studio
              </button>
            </div>

            {recentRenders.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[#0E1526] py-16 text-center">
                <Film size={40} className="mx-auto text-slate-600 mb-4" />
                <p className="text-sm font-bold text-slate-400">No renders yet.</p>
                <p className="text-xs text-slate-500 mt-1">Completed videos appear here for 48 hours.</p>
                <button
                  onClick={() => setActiveTab("studio")}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-2.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
                >
                  <Sparkles size={14} /> Create Your First Kinetic Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRenders.map((render) => {
                  const expired = render.expiresAt < Date.now();
                  const expiresHours = Math.max(0, Math.ceil((render.expiresAt - Date.now()) / (60 * 60 * 1000)));
                  return (
                    <div key={render.id} className="rounded-[28px] border border-white/10 bg-[#0E1526] p-5 space-y-4 hover:border-[#FF6D00]/40 transition-all duration-300">
                      <div className="aspect-video w-full rounded-2xl bg-black/40 overflow-hidden flex items-center justify-center">
                        {render.outputFile && !expired ? (
                          <video src={render.outputFile} className="w-full h-full object-cover" muted playsInline
                            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                            onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                          />
                        ) : (
                          <Film size={28} className="text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white truncate">{render.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(render.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      {expired ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                          <Clock size={12} /> Expired
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Expires in {expiresHours}h</span>
                          <button
                            onClick={() => downloadVideoDirectly(render.outputFile, `kinetic-motion-${render.id.slice(-6)}.mp4`)}
                            disabled={downloadingUrl === render.outputFile}
                            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-3.5 py-1.5 text-xs font-black text-black shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
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
    </div>
  );
}
