"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, Film, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ImageToVideoShowcaseItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  videoUrl: string;
  posterUrl: string;
}

export const IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE: ImageToVideoShowcaseItem[] = [
  {
    id: "itv-demo-1",
    title: "Cinematic Parallax Story",
    description: "16:9 Widescreen photo storytelling with smooth Ken Burns pan & zoom.",
    badge: "Cinema 16:9",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011644112_vtrkhq.jpg",
  },
  {
    id: "itv-demo-2",
    title: "Voiceover Sync Explainer",
    description: "Multi-scene AI image pacing synchronized to narration stops.",
    badge: "AI Visual Sync",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011245820_oqja39.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011245820_oqja39.jpg",
  },
  {
    id: "itv-demo-3",
    title: "Frosted Subtitle Overlay",
    description: "2.5D frosted glass subtitles with dynamic word highlighting.",
    badge: "Parallax Captions",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489918/InShot_20261009_011006327_vedacf.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489918/InShot_20261009_011006327_vedacf.jpg",
  },
  {
    id: "itv-demo-4",
    title: "3D Art Style Aesthetic",
    description: "Depth isometric visual pacing with ambient soundscore.",
    badge: "3D Visuals",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011836714_jz0sxu.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011836714_jz0sxu.jpg",
  },
  {
    id: "itv-demo-5",
    title: "Realistic History Narrative",
    description: "High-retention documentary video output with 1080p Full HD render.",
    badge: "1080p Broadcast",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489916/InShot_20261009_012727569_wfvxcv.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489916/InShot_20261009_012727569_wfvxcv.jpg",
  },
];

interface ImageToVideoCardProps {
  item: ImageToVideoShowcaseItem;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: (id: string) => void;
  onToggleMute: () => void;
}

function ImageToVideoCard({ item, isPlaying, isMuted, onTogglePlay, onToggleMute }: ImageToVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    onTogglePlay(item.id);
  };

  return (
    <div className="group relative flex-none w-[280px] sm:w-[340px] md:w-[380px] snap-start rounded-[24px] border border-white/10 bg-[#0E1526] overflow-hidden shadow-xl hover:border-[#FF6D00]/60 hover:shadow-2xl hover:shadow-[#FF6D00]/15 transition-all duration-300">
      {/* 16:9 Widescreen Video Stage */}
      <div className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer" onClick={handleVideoClick}>
        {isPlaying ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            autoPlay
            controls
            playsInline
            muted={isMuted}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.posterUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl backdrop-blur-md group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                <Play size={20} className="ml-0.5 fill-current" />
              </div>
            </div>
          </>
        )}

        {/* Top Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FF8F00]">
            <Sparkles size={10} className="text-[#FF9100]" />
            <span>{item.badge}</span>
          </span>
        </div>

        {/* Mute/Unmute Button */}
        {isPlaying && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white backdrop-blur-md hover:bg-black transition cursor-pointer"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-emerald-400" />}
          </button>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-4 space-y-1 bg-[#0A0D18]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FF9100] transition truncate">
            {item.title}
          </h4>
          <span className="text-[10px] font-bold text-amber-400/90 shrink-0">Cloudinary 1080p</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function ImageToVideoShowcaseCarousel() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTogglePlay = (id: string) => {
    setActivePlayingId((prev) => (prev === id ? null : id));
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-5 sm:p-7 shadow-2xl space-y-5 text-white">
      {/* Heading & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1 text-[11px] font-black uppercase text-[#FF8F00] mb-2">
            <Sparkles size={12} className="text-[#FF9100]" />
            <span>Cloud Render Showcase</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Image to Video AI</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              5 Live Demos
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Real 16:9 widescreen video outputs rendered with voiceover narration, AI visual pacing &amp; Ken Burns motion.
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Moving Carousel Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE.map((item) => (
          <ImageToVideoCard
            key={item.id}
            item={item}
            isPlaying={activePlayingId === item.id}
            isMuted={isMuted}
            onTogglePlay={handleTogglePlay}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        ))}
      </div>
    </div>
  );
}
