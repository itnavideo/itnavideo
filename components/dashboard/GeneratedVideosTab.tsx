"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

interface RenderRecord {
  id: string;
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
                      <Film size={32} className="text-[#FF5722]" />
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
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">Full HD MP4</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <a
                    href={downloadLink}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 hover:brightness-110 transition cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>

                  {render.videoUrl && (
                    <button
                      onClick={() => handleCopyLink(render.videoUrl!, render.id)}
                      className="py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Share2 size={13} className="text-emerald-400" />
                      <span>{copiedId === render.id ? "Copied!" : "Share Link"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden rounded-[28px] bg-[#0D111D] border border-white/10 p-10 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#FF5722] mx-auto mb-4 shadow-lg shadow-orange-500/10">
            <Film size={32} />
          </div>

          <h3 className="text-xl font-black text-white">No Rendered Videos Yet</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Pick any creation studio from the sidebar or choose a quick-start template below to render your first 1080p MP4.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left max-w-lg mx-auto">
            <Link
              href="/dashboard/auto-caption-reel"
              className="p-3.5 rounded-2xl bg-[#121624] hover:bg-[#161C2E] border border-white/10 hover:border-orange-500/40 transition group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-black text-white group-hover:text-[#FFA000]">
                  ⚡ Auto Caption Studio
                </div>
                <div className="text-[10px] text-zinc-400">Safe-zone word subtitles</div>
              </div>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-[#FFA000]" />
            </Link>

            <Link
              href="/dashboard/typography-video"
              className="p-3.5 rounded-2xl bg-[#121624] hover:bg-[#161C2E] border border-white/10 hover:border-orange-500/40 transition group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-black text-white group-hover:text-[#FFA000]">
                  🔥 Kinetic Motion
                </div>
                <div className="text-[10px] text-zinc-400">11 motion animation presets</div>
              </div>
              <ArrowRight size={14} className="text-zinc-500 group-hover:text-[#FFA000]" />
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
    </div>
  );
}
