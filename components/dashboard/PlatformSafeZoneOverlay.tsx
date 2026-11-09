"use client";

import React from "react";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreVertical,
  Music2,
  Bookmark,
  Disc,
} from "lucide-react";

export type SafeZonePlatform = "clean" | "youtube" | "instagram" | "tiktok";

export interface PlatformSafeZoneOverlayProps {
  platform: SafeZonePlatform;
  creatorHandle?: string;
  topicTitle?: string;
}

export function PlatformSafeZoneOverlay({
  platform,
  creatorHandle = "@creator",
  topicTitle = "Faceless AI Short",
}: PlatformSafeZoneOverlayProps) {
  if (platform === "clean") return null;

  const displayHandle = creatorHandle.startsWith("@") ? creatorHandle : `@${creatorHandle}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none overflow-hidden font-sans text-white">
      {/* ── TOP PLATFORM HEADER ── */}
      <div className="pt-4 flex items-center justify-between text-white/90 drop-shadow-md">
        {platform === "youtube" && (
          <div className="w-full flex items-center justify-between px-1">
            <span className="text-[11px] font-black tracking-wider uppercase opacity-90">Shorts</span>
            <div className="flex items-center gap-3 opacity-80">
              <span className="text-xs">🔍</span>
              <span className="text-xs">⋮</span>
            </div>
          </div>
        )}
        {platform === "instagram" && (
          <div className="w-full flex items-center justify-between px-1">
            <span className="text-xs font-black tracking-tight drop-shadow">Reels</span>
            <span className="text-xs opacity-90">📷</span>
          </div>
        )}
        {platform === "tiktok" && (
          <div className="w-full flex items-center justify-center gap-4 text-[11px] font-bold">
            <span className="opacity-60">Following</span>
            <span className="border-b-2 border-white pb-0.5">For You</span>
          </div>
        )}
      </div>

      {/* ── MIDDLE / RIGHT SIDEBAR ACTION BUTTONS ── */}
      <div className="flex justify-end pr-1">
        {/* YOUTUBE SHORTS SIDEBAR */}
        {platform === "youtube" && (
          <div className="flex flex-col items-center gap-3 text-center drop-shadow-lg">
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <ThumbsUp size={13} className="text-white" />
              </div>
              <span className="text-[8px] font-bold mt-0.5">142K</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <ThumbsDown size={13} className="text-white" />
              </div>
              <span className="text-[8px] font-bold mt-0.5">Dislike</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <MessageCircle size={13} className="text-white" />
              </div>
              <span className="text-[8px] font-bold mt-0.5">856</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <Share2 size={13} className="text-white" />
              </div>
              <span className="text-[8px] font-bold mt-0.5">Share</span>
            </div>
            <div className="h-6 w-6 rounded-md bg-zinc-800 border border-white/30 flex items-center justify-center mt-1">
              <Music2 size={11} className="text-white/80" />
            </div>
          </div>
        )}

        {/* INSTAGRAM REELS SIDEBAR */}
        {platform === "instagram" && (
          <div className="flex flex-col items-center gap-3.5 text-center drop-shadow-lg">
            <div className="flex flex-col items-center">
              <Heart size={18} className="text-white drop-shadow" />
              <span className="text-[8.5px] font-bold mt-0.5">48.2K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle size={18} className="text-white drop-shadow" />
              <span className="text-[8.5px] font-bold mt-0.5">312</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 size={18} className="text-white drop-shadow" />
              <span className="text-[8.5px] font-bold mt-0.5">Share</span>
            </div>
            <MoreVertical size={16} className="text-white opacity-80" />
            <div className="h-6 w-6 rounded-md border-2 border-white/80 bg-zinc-900 flex items-center justify-center overflow-hidden">
              <Disc size={13} className="text-white animate-spin" />
            </div>
          </div>
        )}

        {/* TIKTOK SIDEBAR */}
        {platform === "tiktok" && (
          <div className="flex flex-col items-center gap-3 text-center drop-shadow-lg">
            <div className="relative mb-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5">
                <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center text-[9px] font-bold">
                  {displayHandle.slice(1, 3).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                +
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Heart size={18} className="text-white fill-white" />
              <span className="text-[8px] font-bold mt-0.5">94.1K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle size={18} className="text-white fill-white" />
              <span className="text-[8px] font-bold mt-0.5">1,204</span>
            </div>
            <div className="flex flex-col items-center">
              <Bookmark size={18} className="text-white fill-white" />
              <span className="text-[8px] font-bold mt-0.5">8.9K</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 size={18} className="text-white fill-white" />
              <span className="text-[8px] font-bold mt-0.5">Share</span>
            </div>
            <div className="h-7 w-7 rounded-full bg-zinc-900 border-2 border-white/80 flex items-center justify-center">
              <Disc size={14} className="text-white animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM SAFE ZONE UI OVERLAY (CAPTION OCCLUSION GUARD) ── */}
      <div className="pb-2 space-y-1.5 drop-shadow-md">
        {/* YOUTUBE SHORTS BOTTOM BAR */}
        {platform === "youtube" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[8px] font-bold">
                {displayHandle.slice(1, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-bold">{displayHandle}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-wider">
                Subscribe
              </span>
            </div>
            <p className="text-[9.5px] font-medium text-white/95 line-clamp-2 leading-tight">
              {topicTitle}
            </p>
            <div className="flex items-center gap-1.5 text-[8.5px] text-white/70">
              <Music2 size={9} />
              <span className="truncate">Original audio • {displayHandle}</span>
            </div>
          </div>
        )}

        {/* INSTAGRAM REELS BOTTOM BAR */}
        {platform === "instagram" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5">
                <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-[8px] font-bold">
                  {displayHandle.slice(1, 2).toUpperCase()}
                </div>
              </div>
              <span className="text-[10px] font-bold">{displayHandle}</span>
              <span className="px-2 py-0.5 rounded-lg border border-white/60 text-white text-[8px] font-bold">
                Follow
              </span>
            </div>
            <p className="text-[9.5px] font-normal text-white/90 line-clamp-2 leading-tight">
              {topicTitle} <span className="opacity-60">...more</span>
            </p>
            <div className="flex items-center gap-1.5 text-[8px] text-white/80">
              <Music2 size={8} />
              <span className="truncate">{displayHandle} • Original Audio</span>
            </div>
          </div>
        )}

        {/* TIKTOK BOTTOM BAR */}
        {platform === "tiktok" && (
          <div className="space-y-1">
            <span className="text-[10.5px] font-bold block">{displayHandle}</span>
            <p className="text-[9.5px] font-normal text-white/90 line-clamp-2 leading-tight">
              {topicTitle} <span className="font-bold text-white/80">#fyp #viral #shorts</span>
            </p>
            <div className="flex items-center gap-1.5 text-[8px] text-white/80">
              <Music2 size={8} />
              <span className="truncate">original sound - {displayHandle}</span>
            </div>
          </div>
        )}

        {/* Visual Safe Zone Grid Boundary Line (Dotted Warning Guide) */}
        <div className="pt-1">
          <div className="w-full border-t border-dashed border-red-500/50 flex items-center justify-between text-[7.5px] font-mono text-red-300 font-bold tracking-wider px-1">
            <span>▲ SAFE CONTENT ZONE</span>
            <span className="uppercase">{platform} UI OVERLAY ▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformSafeZoneOverlay;

