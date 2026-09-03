'use client';

import { useEffect, useState } from "react";
import { getAdminVideos, deleteRenderVideo, type AdminVideo } from "../actions";
import {
  Search,
  SlidersHorizontal,
  Film,
  User,
  Trash2,
  Download,
  ExternalLink,
  Play,
  Loader2,
  RefreshCw,
  Coins,
  Clock,
  Video,
  X,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState("All");

  // Video playback modal state
  const [activePlayVideo, setActivePlayVideo] = useState<AdminVideo | null>(null);

  // Actions loading indicator
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadVideos() {
    try {
      setLoading(true);
      const res = await getAdminVideos(search, templateFilter);
      setVideos(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load generated exports library.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVideos();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, templateFilter]);

  async function handleDeleteVideo(video: AdminVideo) {
    if (!confirm(`Are you absolutely sure you want to delete this render record from history? This deletes the output references permanently.`)) {
      return;
    }
    try {
      setActionLoading(video.renderId);
      await deleteRenderVideo(video.renderId);
      toast.success("Successfully deleted video render record.");
      loadVideos();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete video record.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Render Operations & Media
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Render Pipeline Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Monitor all generated video exports, inspect render times, and manage S3 binary outputs.
          </p>
        </div>

        <button
          onClick={loadVideos}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Pipelines</span>
        </button>
      </div>

      {/* Searching / filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search clip title, user email, or job ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="w-full sm:w-56 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#1a73e8] focus:outline-none"
          >
            <option value="All">All Templates</option>
            <option value="LONG_VIDEO_PRO">Long Video Pro</option>
            <option value="AUTO_CAPTION_GENERATOR">Auto Caption Generator</option>
            <option value="COMPARE_EXPLAINER">Compare Explainer</option>
            <option value="LONG_VIDEO_PROMO">Long Video Promo</option>
            <option value="LONG_VIDEO_CLIPS">Long Video Clips</option>
            <option value="TYPOGRAPHY_VIDEO">Typography Video</option>
            <option value="MULTI_IMAGES_VIDEO">Multi Images Video</option>
            <option value="WHITEBOARD_VIDEO">Auto Draw Whiteboard</option>
            <option value="DYNAMIC_CREATOR_REEL">Dynamic Creator Reel</option>
          </select>
        </div>
      </div>

      {/* Main Video Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Scanning media buckets...
          </p>
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center space-y-2 shadow-xs">
          <Video className="text-slate-300 mx-auto" size={40} />
          <h3 className="text-sm font-bold text-slate-700">No outputs found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            No renders match current query parameters in active temporal logs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.renderId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between space-y-4 group relative"
            >
              {/* Card visual header */}
              <div className="flex items-start gap-3.5">
                <div className="h-24 w-18 rounded-xl bg-slate-100 border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center text-slate-400 group-hover:text-[#1a73e8] transition">
                  <Film size={22} />
                  {video.outputFile && (
                    <button
                      onClick={() => setActivePlayVideo(video)}
                      className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <div className="p-2 rounded-full bg-[#1a73e8] text-white">
                        <Play size={14} className="fill-current" />
                      </div>
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[9px] font-bold text-[#1a73e8] font-mono">
                    {video.mode}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-[#1a73e8] transition">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <User size={11} className="text-slate-400" />
                    <span>{video.userEmail}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">ID: {video.renderId}</p>
                </div>
              </div>

              {/* Specs & Performance */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={12} className="text-slate-400" />
                  <span>Avg: {video.renderTimeMs / 1000}s</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Coins size={12} className="text-slate-400" />
                  <span>Cost: {video.creditsUsed} cr</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    video.outputFile
                      ? "bg-emerald-50 border-emerald-200 text-[#34a853]"
                      : "bg-red-50 border-red-200 text-[#ea4335]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      video.outputFile ? "bg-[#34a853]" : "bg-[#ea4335]"
                    }`}
                  />
                  {video.outputFile ? "Ready" : "Failed"}
                </span>

                <div className="flex items-center gap-1.5">
                  {video.outputFile && (
                    <a
                      href={video.outputFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                      title="Download S3 Binary"
                    >
                      <Download size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteVideo(video)}
                    disabled={actionLoading === video.renderId}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#ea4335] transition"
                    title="Delete Render"
                  >
                    {actionLoading === video.renderId ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Playback Modal */}
      {activePlayVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activePlayVideo.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{activePlayVideo.mode}</p>
              </div>
              <button
                onClick={() => setActivePlayVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                src={activePlayVideo.outputFile}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
