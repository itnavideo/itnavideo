"use client";

import { useState } from "react";
import { Film, Play, Download, ExternalLink, Trash2, Loader2 } from "lucide-react";

export default function VideoCard({ title, videoUrl, status, createdAt, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  
  const handleOpen = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    const anchor = document.createElement("a");
    anchor.href = videoUrl;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.download = `${sanitizeFileName(title || "itnavideo")}.mp4`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleDelete = async () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950 transition-all hover:border-brand-mint/50">
      {/* Video Preview Area */}
      <div className="relative h-52 bg-[linear-gradient(135deg,#111827,#050506_55%,#0f766e)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:38px_38px] opacity-40" />
        
        <div className="absolute left-4 top-4 z-10 rounded-md bg-black/55 px-3 py-1 text-xs font-bold text-white">
          9:16 MP4
        </div>

        {/* Agar videoUrl hai toh real video dikhayein, warna Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              className="h-full w-full object-cover opacity-60"
              muted
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            />
          ) : null}
          
          <button
            type="button"
            onClick={handleOpen}
            disabled={!videoUrl}
            className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            title={videoUrl ? "Play video" : "Video is not ready yet"}
          >
            <Play size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-mint">
            <Film size={17} />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {status === 'ready' ? 'Rendered video' : 'Processing...'}
            </span>
          </div>
          {createdAt && (
             <span className="text-[10px] text-zinc-500 font-bold uppercase">
               {new Date(createdAt).toLocaleDateString()}
             </span>
          )}
        </div>

        <h3 className="mb-6 text-2xl font-bold text-white truncate">
          {title || "Untitled Video"}
        </h3>

        <div className="flex gap-2">
          <button 
            onClick={handleOpen}
            disabled={!videoUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-black text-black transition hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Download size={18} />
            {videoUrl ? "Play" : "Waiting"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!videoUrl}
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
            title="Save or download video"
          >
            <Download size={18} />
          </button>
          
          <a 
            href={videoUrl || undefined}
            target="_blank" 
            aria-disabled={!videoUrl}
            className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10 ${videoUrl ? "" : "pointer-events-none opacity-45"}`}
          >
            <ExternalLink size={18} />
          </a>

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex min-w-24 items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
              title="Delete video"
            >
              {deleting ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function sanitizeFileName(value) {
  return String(value || "itnavideo")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "itnavideo";
}
