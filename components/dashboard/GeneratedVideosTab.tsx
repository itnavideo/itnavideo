"use client";

import { useState } from "react";
import PhoneQrDownloadModal from "@/components/media/PhoneQrDownloadModal";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { PLATFORM_MODE_CONFIG } from "@/lib/config/platformMode";
import {
  Video,
  Download,
  Play,
  Film,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
  ExternalLink,
  Flame,
  Smartphone,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface RenderRecord {
  id: string;
  title?: string;
  templateId?: string;
  templateName?: string;
  videoUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  duration?: number | string;
  createdAt?: string;
  aspectRatio?: string;
  status?: string;
}

interface GeneratedVideosTabProps {
  renders: RenderRecord[];
  onOpenStudio?: () => void;
}

export default function GeneratedVideosTab({
  renders,
  onOpenStudio,
}: GeneratedVideosTabProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalData, setQrModalData] = useState<{ url: string; title: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [limitExceededInfo, setLimitExceededInfo] = useState<{ resetsIn: string } | null>(null);

  const downloadDirectly = async (url: string, filename: string) => {
    try {
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
    }
  };

  const handleClaimDownload = async (render: RenderRecord) => {
    const url = render.downloadUrl || render.videoUrl;
    if (!url) return;
    const filename = `${(render.templateName || render.title || "itnavideo-render").toLowerCase().replace(/[^a-z0-9]/g, "-")}-1080p.mp4`;

    if (!PLATFORM_MODE_CONFIG.TEMPORARY_FREE_ACCESS) {
      await downloadDirectly(url, filename);
      return;
    }

    if (!user) {
      alert("Please log in to download your video.");
      return;
    }

    try {
      setDownloadingId(render.id);
      const res = await fetch("/api/downloads/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user.uid,
          videoId: render.id || url,
          videoType: render.templateId || "generic",
          outputUrl: url,
          fileName: filename,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.reason === "DAILY_LIMIT_EXCEEDED") {
          setLimitExceededInfo({ resetsIn: data.resetsInFormatted || "12:00 AM IST" });
          return;
        }
        throw new Error(data.error || "Failed to claim download.");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("download-claimed", { detail: data }));
      }
      await downloadDirectly(url, filename);
    } catch (e: any) {
      console.error("Download claim error:", e);
      await downloadDirectly(url, filename);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#0D111D] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              <Video size={14} className="text-emerald-400" />
              <span>Export History &amp; Cloud Library</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Generated{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                1080p MP4 Videos
              </span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Access your cloud-rendered master files. All videos are rendered at 1080p Full HD 30/60 FPS with zero watermarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#121624] p-3 text-center min-w-[100px]">
              <div className="text-2xl font-black text-white">{renders.length}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Total Exports
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos List / Grid */}
      {renders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renders.map((render, index) => {
            const downloadLink = render.downloadUrl || render.videoUrl || "#";
            return (
              <div
                key={render.id || index}
                className="group relative flex flex-col justify-between rounded-[24px] bg-[#121624] border border-white/10 hover:border-emerald-500/60 p-5 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Video Preview / Mock Stage */}
                <div className="relative aspect-video w-full rounded-xl bg-[#070B14] border border-white/10 overflow-hidden mb-4 flex items-center justify-center group/stage">
                  {render.videoUrl ? (
                    <video
                      src={render.videoUrl}
                      controls={false}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Film size={32} className="text-orange-400" />
                      <span className="text-xs font-semibold">1080p Master Video</span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  {render.videoUrl && (
                    <button
                      onClick={() => setSelectedVideo(render.videoUrl || null)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/stage:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-110 transition-transform">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </button>
                  )}

                  <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    1080p Ready
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-4">
                  <h3 className="text-sm font-black text-white truncate">
                    {render.templateName || "1080p AI Video Export"}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-400" />
                      {render.createdAt
                        ? new Date(render.createdAt).toLocaleDateString()
                        : "Recently Rendered"}
                    </span>
                    <span></span>
                    <span className="text-emerald-400 font-bold">Full HD MP4</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleClaimDownload(render)}
                    disabled={downloadingId === render.id}
                    className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === render.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span>{downloadingId === render.id ? "Saving..." : "Download"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrModalData({ url: downloadLink, title: render.title || "Cloud Video" })}
                    className="py-2.5 px-2 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Scan QR to download directly on phone"
                  >
                    <Smartphone size={13} className="text-orange-400" />
                    <span>Phone QR</span>
                  </button>

                  {render.videoUrl ? (
                    <button
                      onClick={() => handleCopyLink(render.videoUrl!, render.id)}
                      className="py-2.5 px-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Share2 size={13} className="text-emerald-400" />
                      <span>{copiedId === render.id ? "Copied!" : "Share"}</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden rounded-[28px] bg-[#0D111D] border border-white/10 p-10 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-4 shadow-lg shadow-orange-500/10">
            <Film size={32} />
          </div>

          <h3 className="text-xl font-black text-white">No Rendered Videos Yet</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Pick any creation studio from the sidebar or choose a quick-start template below to render your first 1080p MP4.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left max-w-lg mx-auto">
            <Link
              href="/dashboard/auto-caption-reel"
              className="p-3.5 rounded-2xl bg-[#15151D] hover:bg-[#1C1C26] border border-white/10 hover:border-orange-500/40 transition group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-black text-white group-hover:text-orange-400">
                   Auto Caption Studio
                </div>
                <div className="text-[10px] text-zinc-400">Safe-zone word subtitles</div>
              </div>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-orange-400" />
            </Link>

            <Link
              href="/dashboard/ai-shorts-polisher"
              className="p-3.5 rounded-2xl bg-[#15151D] hover:bg-[#1C1C26] border border-white/10 hover:border-orange-500/40 transition group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-black text-white group-hover:text-orange-400">
                   AI Shorts Polisher
                </div>
                <div className="text-[10px] text-zinc-400">Punch-in cuts & viral audio</div>
              </div>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-orange-400" />
            </Link>
          </div>
        </div>
      )}

      {/* Video Playback Modal */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-[28px] bg-[#0E1526] border border-white/20 p-4 shadow-2xl overflow-hidden"
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-2xl bg-black"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 DAILY FREE DOWNLOAD LIMIT REACHED MODAL */}
      {limitExceededInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-amber-500/30 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Free Limit Reached (0/2)</h3>
                <p className="text-xs text-zinc-400">All 2 free video downloads used for today</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2 text-xs text-zinc-300">
              <p>
                To maintain GPU rendering stability and collect community feedback, each account receives <span className="text-amber-400 font-semibold">2 free downloads per day</span>.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono text-[11px]">
                <span className="text-zinc-400">Next Reset:</span>
                <span className="text-emerald-400 font-bold">{limitExceededInfo.resetsIn} (12:00 AM IST)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              ✨ <strong className="text-zinc-200">Unlimited Studio Previews:</strong> You can continue generating, editing, and previewing videos in any studio without consuming your daily allowance.
            </p>

            <button
              type="button"
              onClick={() => setLimitExceededInfo(null)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
