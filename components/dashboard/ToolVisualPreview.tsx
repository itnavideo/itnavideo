"use client";

import React, { useState } from "react";
import { Sparkles, Subtitles, Captions, Flame } from "lucide-react";

interface ToolVisualPreviewProps {
  toolId: string;
  title: string;
  aspectRatio?: string;
  className?: string;
}

// Clean mapping of tool IDs to 2D image paths in public/assets/reusable/tools_2d/
const TOOL_IMAGE_MAP: Record<string, string> = {
  "image-to-video": "/assets/reusable/tools_2d/image-to-video.png",
  "youtube-subtitles": "/assets/reusable/tools_2d/youtube-subtitles.png",
  "auto-caption": "/assets/reusable/tools_2d/auto-caption.png",
  "faceless-video": "/assets/reusable/tools_2d/faceless-video.png",
  "compare-explainer": "/assets/reusable/tools_2d/compare-explainer.png",
  "typography-video": "/assets/reusable/tools_2d/typography-video.png",
  "whiteboard-video": "/assets/reusable/tools_2d/whiteboard-video.png",
  "long-video-promo": "/assets/reusable/tools_2d/long-video-promo.png",
  "long-video-clips": "/assets/reusable/tools_2d/long-video-clips.png",
  "audio-cleaner": "/assets/reusable/tools_2d/audio-cleaner.png",
};

// Set of 9:16 vertical reel tool IDs
const VERTICAL_TOOLS = new Set([
  "auto-caption",
  "typography-video",
  "faceless-video",
  "compare-explainer",
  "long-video-clips",
]);

export default function ToolVisualPreview({
  toolId,
  title,
  aspectRatio = "16:9",
  className = "",
}: ToolVisualPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = TOOL_IMAGE_MAP[toolId];

  // Determine if this tool is a 9:16 vertical reel tool or 16:9 widescreen tool
  const isVertical = VERTICAL_TOOLS.has(toolId) || aspectRatio.includes("9:16");

  // Render the full uncropped 2D image with ambient background blur if available
  if (imageUrl && !imageError) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#070B14] group/img transition-all duration-300 ${
          isVertical ? "h-56 sm:h-64" : "h-40 sm:h-44"
        } ${className}`}
      >
        {/* Ambient Blurred Background Glow Layer */}
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-30 pointer-events-none"
        />

        {/* Full Uncropped Foreground Image Layer (100% visible, no half-cut images) */}
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={`${title} 2D Preview`}
            onError={() => setImageError(true)}
            className="max-w-full max-h-full object-contain object-center transition-transform duration-500 group-hover/img:scale-102 drop-shadow-2xl rounded-lg"
          />
        </div>

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none z-20" />
      </div>
    );
  }

  // Fallback SVG/CSS Previews
  switch (toolId) {
    case "image-to-video":
      return (
        <div className={`relative w-full h-40 sm:h-44 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/40 via-slate-900 to-indigo-950/60 animate-pulse" />
          <div className="relative z-10 w-11/12 h-4/5 rounded-lg border border-amber-500/30 bg-slate-950/80 p-3 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> 16:9 Cinema Parallax
              </span>
              <span className="text-[9px] font-mono text-slate-400">4K Render • 30fps</span>
            </div>
            <div className="flex items-center gap-3 my-1">
              <div className="w-10 h-11 rounded-md bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-xs shadow-md">
                AI
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-amber-400/30 rounded-full w-3/4 animate-pulse" />
                <div className="h-2 bg-slate-700/60 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      );

    case "youtube-subtitles":
      return (
        <div className={`relative w-full h-40 sm:h-44 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full h-full rounded-lg bg-slate-900 border border-red-500/30 p-2.5 flex flex-col justify-between relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Subtitles className="w-3 h-3" /> YouTube Closed Captions
              </span>
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">99.2% Sync</span>
            </div>
          </div>
        </div>
      );

    case "auto-caption":
      return (
        <div className={`relative w-full h-56 sm:h-64 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center p-2 ${className}`}>
          <div className="w-32 h-full rounded-lg bg-slate-900 border border-emerald-500/40 p-2 flex flex-col justify-between items-center relative shadow-xl">
            <div className="w-full flex justify-between items-center">
              <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full">
                9:16 REEL
              </span>
              <Flame className="w-3 h-3 text-orange-400 animate-bounce" />
            </div>
            <div className="text-center space-y-1 my-1">
              <span className="block text-[10px] font-black text-slate-400">THIS IS HOW YOU</span>
              <span className="inline-block text-xs font-black text-slate-900 bg-amber-400 px-2 py-0.5 rounded shadow-lg transform -rotate-2 scale-105 animate-pulse">
                GO VIRAL 🔥
              </span>
            </div>
            <div className="w-full flex items-center justify-center gap-1 text-[8px] font-bold text-slate-300 bg-slate-800/80 py-0.5 rounded border border-slate-700">
              <Captions className="w-2.5 h-2.5 text-emerald-400" /> Word Sync + SFX
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-40 sm:h-44 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center p-4 ${className}`}>
          <p className="text-xs font-bold text-slate-300">{title}</p>
        </div>
      );
  }
}
