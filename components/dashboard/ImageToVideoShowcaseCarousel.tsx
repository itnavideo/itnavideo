"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Play, Volume2, VolumeX, Film } from "lucide-react";
import { motion } from "framer-motion";

export interface ImageToVideoShowcaseItem {
  id: string;
  title: string;
  badge: string;
  videoUrl: string;
  posterUrl: string;
}

export const IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE: ImageToVideoShowcaseItem[] = [
  {
    id: "itv-demo-1",
    title: "Cinematic Parallax Story",
    badge: "Ken Burns Motion",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011644112_vtrkhq.jpg",
  },
  {
    id: "itv-demo-2",
    title: "Voiceover Sync Explainer",
    badge: "AI Visual Sync",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011245820_oqja39.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011245820_oqja39.jpg",
  },
  {
    id: "itv-demo-3",
    title: "Frosted Subtitle Overlay",
    badge: "Parallax Captions",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489918/InShot_20261009_011006327_vedacf.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489918/InShot_20261009_011006327_vedacf.jpg",
  },
  {
    id: "itv-demo-4",
    title: "3D Art Style Aesthetic",
    badge: "Depth 3D Render",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011836714_jz0sxu.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011836714_jz0sxu.jpg",
  },
  {
    id: "itv-demo-5",
    title: "Realistic History Narrative",
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
    <div
      onClick={handleVideoClick}
      className="group relative flex-shrink-0 w-[290px] sm:w-[330px] md:w-[370px] aspect-video rounded-[22px] overflow-hidden border border-white/15 bg-[#090A12] shadow-xl hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer select-none"
    >
      {/* 16:9 Widescreen Video or Poster */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/75 border border-white/25 backdrop-blur-md group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play size={20} className="ml-0.5 fill-white text-white group-hover:fill-white" />
            </div>
          </div>
        </>
      )}

      {/* Top Badge Overlay */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-purple-300 tracking-wider">
          <Sparkles size={11} className="text-pink-400" />
          <span>{item.badge}</span>
        </span>
      </div>

      {/* Mute / Unmute Button */}
      {isPlaying && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white backdrop-blur-md hover:bg-black transition cursor-pointer"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-pink-400" />}
        </button>
      )}

      {/* Title & 1080p Tag Overlaid Directly on Bottom of Card (No separate box) */}
      {!isPlaying && (
        <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-20 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-black text-white truncate drop-shadow-md group-hover:text-purple-200 transition">
            {item.title}
          </span>
          <span className="shrink-0 text-[9.5px] font-mono font-bold text-pink-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-pink-500/30">
            1080p MP4
          </span>
        </div>
      )}
    </div>
  );
}

export function ImageToVideoShowcaseCarousel() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const marqueeItems = [
    ...IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE,
    ...IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE,
    ...IMAGE_TO_VIDEO_CLOUDINARY_SHOWCASE,
  ];

  const handleTogglePlay = (id: string) => {
    setActivePlayingId((prev) => (prev === id ? null : id));
    setIsPaused(true);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/80 p-4 sm:p-5 shadow-2xl space-y-3.5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Film size={14} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Image to Video AI — Live Showcase</span>
              <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full">
                1080p Full HD
              </span>
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-zinc-400 hidden sm:inline-block">
          Hover to pause • Click to play demo
        </span>
      </div>

      {/* Infinite Horizontal Smooth Moving Marquee Track */}
      <div
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!activePlayingId) setIsPaused(false);
        }}
      >
        <motion.div
          className="flex gap-4 w-max py-1"
          animate={isPaused || activePlayingId ? { x: undefined } : { x: ["0%", "-33.333%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 32,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((item, idx) => (
            <ImageToVideoCard
              key={`${item.id}-${idx}`}
              item={item}
              isPlaying={activePlayingId === item.id}
              isMuted={isMuted}
              onTogglePlay={handleTogglePlay}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
