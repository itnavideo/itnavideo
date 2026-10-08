"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Film, Volume2, VolumeX } from "lucide-react";

export interface ImageToVideoCloudinaryItem {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  tag: string;
}

export const HOMEPAGE_IMAGE_TO_VIDEO_ITEMS: ImageToVideoCloudinaryItem[] = [
  {
    id: "itv-hp-1",
    title: "Cinematic Parallax Story",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011644112_vtrkhq.jpg",
    tag: "Ken Burns Motion",
  },
  {
    id: "itv-hp-2",
    title: "Voiceover Sync Explainer",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011245820_oqja39.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011245820_oqja39.jpg",
    tag: "AI Visual Sync",
  },
  {
    id: "itv-hp-3",
    title: "Frosted Subtitle Overlay",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489918/InShot_20261009_011006327_vedacf.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489918/InShot_20261009_011006327_vedacf.jpg",
    tag: "Parallax Captions",
  },
  {
    id: "itv-hp-4",
    title: "3D Art Style Aesthetic",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011836714_jz0sxu.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489914/InShot_20261009_011836714_jz0sxu.jpg",
    tag: "Depth 3D Render",
  },
  {
    id: "itv-hp-5",
    title: "Realistic History Narrative",
    videoUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/v1791489916/InShot_20261009_012727569_wfvxcv.mp4",
    posterUrl: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3/v1791489916/InShot_20261009_012727569_wfvxcv.jpg",
    tag: "1080p Broadcast",
  },
];

interface ImageToVideoCardProps {
  item: ImageToVideoCloudinaryItem;
}

function ImageToVideoCard({ item }: ImageToVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      onClick={handleTogglePlay}
      className="relative flex-shrink-0 w-[270px] sm:w-[320px] md:w-[360px] group cursor-pointer select-none"
    >
      {/* 16:9 Widescreen Smartphone Card */}
      <div className="relative w-full aspect-video rounded-[22px] overflow-hidden border border-white/15 bg-[#090A0F] shadow-xl group-hover:border-[#FF6D00] group-hover:shadow-2xl group-hover:shadow-[#FF6D00]/25 transition-all duration-300 group-hover:-translate-y-1">
        
        {/* Top Badge */}
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-black uppercase text-[#FF8F00]">
            <Sparkles size={10} className="text-[#FF9100]" />
            <span>{item.tag}</span>
          </span>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.posterUrl}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Play Icon Overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/20 group-hover:bg-black/40 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 border border-white/25 backdrop-blur-sm group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] group-hover:scale-110 transition-all duration-300 shadow-xl">
              <Play size={20} className="fill-white text-white ml-0.5 group-hover:text-black group-hover:fill-black transition-colors" />
            </div>
          </div>
        )}

        {/* Mute/Unmute Overlay when playing */}
        {isPlaying && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute top-2.5 right-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white backdrop-blur-md hover:bg-black transition cursor-pointer"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-emerald-400" />}
          </button>
        )}

        {/* Title Footer Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-20 flex items-center justify-between">
          <span className="text-xs font-black text-white truncate drop-shadow">{item.title}</span>
          <span className="text-[9px] font-mono font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">1080p MP4</span>
        </div>
      </div>
    </div>
  );
}

export default function ImageToVideoHomepageShowcase() {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeItems = [...HOMEPAGE_IMAGE_TO_VIDEO_ITEMS, ...HOMEPAGE_IMAGE_TO_VIDEO_ITEMS, ...HOMEPAGE_IMAGE_TO_VIDEO_ITEMS];

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] border-b border-white/10 py-10 sm:py-14">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF6D00]/8 blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#FF9100]">
              <Film size={12} className="text-[#FF8F00]" />
              Image to Video AI
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-heading">
              Image to Video AI.{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Turn photos &amp; audio into 16:9 movies.
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-lg">
              Cinematic widescreen storytelling with Ken Burns camera motion, voiceover sync, and frosted captions.
            </p>
          </div>

          <Link
            href="/dashboard/image-to-video-ai"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#0E1526] px-5 py-2.5 text-xs font-black text-white hover:border-[#FF6D00]/50 hover:text-[#FFA726] transition active:scale-95 cursor-pointer"
          >
            <span>Create Image to Video AI</span>
            <ArrowRight size={13} className="text-[#FF8F00]" />
          </Link>
        </div>

        {/* Infinite Slow Moving Marquee Track */}
        <div 
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-4 w-max"
            animate={isPaused ? { x: undefined } : { x: ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {marqueeItems.map((item, idx) => (
              <ImageToVideoCard
                key={`${item.id}-${idx}`}
                item={item}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
