"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  CaptionPreviewText,
  PREVIEW_CONFIG,
} from "@/components/ui/SubtitleStylePicker";
import previewTranscripts from "@/lib/cloudinary/autocaption-transcripts.json";
import {
  getPreviewCaptionAtTime,
  type SavedPreviewTranscript,
} from "@/lib/captions/previewTranscript";
import {
  getPresetVideoFilename,
  getPresetVideoUrl,
  getPresetPosterUrl,
} from "@/components/dashboard/AutoCaptionStyleCarousel";

// ─── 10 Diverse, Distinct, High-Performing Caption Styles (Zero Repetition) ──
const SHOWCASE_STYLE_KEYS = [
  "Hormozi Viral Pop",
  "Shorts Karaoke",
  "Submagic Glow",
  "MrBeast Shorts Impact",
  "Vox Documentary",
  "Crazy",
  "Ali Abdaal Clean Pill",
  "Diary of a CEO",
  "Rainbow Pop",
  "Cyber Lime Pill",
];

// ─── Single Clean Showcase Card (Renders Live Animated Captions) ─────────────

interface ShowcaseCardProps {
  presetKey: string;
}

function ShowcaseCard({ presetKey }: ShowcaseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const presetData = SUBTITLE_PRESETS[presetKey];
  const videoFilename = getPresetVideoFilename(presetKey);
  const videoUrl = getPresetVideoUrl(presetKey);
  const posterUrl = getPresetPosterUrl(presetKey);

  const savedTranscript = (previewTranscripts as Record<string, SavedPreviewTranscript>)[videoFilename];
  const caption = getPreviewCaptionAtTime(savedTranscript, playbackTime);
  const activeWordObj = caption?.words.find(
    (w) => playbackTime >= w.start && playbackTime <= w.end
  );

  const presetOption = presetData
    ? {
        key: presetKey,
        label: presetData.name,
        style: presetData.style,
        font: presetData.fontFamily,
        textColor: presetData.textColor,
        highlightColor: presetData.highlightColor,
        bgColor: presetData.backgroundColor,
      }
    : undefined;

  const previewConfig = PREVIEW_CONFIG[presetKey] || {
    sampleLines: ["VIRAL CAPTIONS", "THAT POP"],
    activeWord: "VIRAL",
  };

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
      className="relative flex-shrink-0 w-[155px] sm:w-[180px] group cursor-pointer select-none"
    >
      {/* 9:16 smartphone card container — 100% clean without extra labels or metadata */}
      <div className="relative w-full aspect-[9/16] rounded-[22px] overflow-hidden border border-white/15 bg-[#090A0F] shadow-xl group-hover:border-[#FF6D00] group-hover:shadow-2xl group-hover:shadow-[#FF6D00]/25 transition-all duration-300 group-hover:-translate-y-1">
        
        {/* Smartphone Speaker / Notch */}
        <div className="absolute top-2 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="h-1 w-8 rounded-full bg-black/80 border border-white/20 backdrop-blur-md" />
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={(e) => {
            const nextTime = Math.round(e.currentTarget.currentTime * 4) / 4;
            setPlaybackTime(nextTime);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Live Animated Caption Overlay — synced with video playback audio */}
        {isPlaying && caption && presetOption && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-2 bottom-[22%] z-20 flex justify-center px-1 text-center">
              <CaptionPreviewText
                preset={presetOption}
                config={previewConfig}
                chunk={caption}
                playbackTime={playbackTime}
                isPlaying={isPlaying}
                activeWord={activeWordObj?.word || caption.activeWord}
                currentWordObj={activeWordObj}
              />
            </div>
          </>
        )}

        {/* Play Icon Overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 border border-white/25 backdrop-blur-sm group-hover:bg-[#FF6D00] group-hover:border-[#FF6D00] transition-all duration-300 shadow-lg">
              <Play size={18} className="fill-white text-white ml-0.5 group-hover:text-black group-hover:fill-black transition-colors" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Section Component ───────────────────────────────────────────────────

export default function CaptionStylesShowcase() {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeItems = [...SHOWCASE_STYLE_KEYS, ...SHOWCASE_STYLE_KEYS];

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] border-b border-white/10 py-10 sm:py-14">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF6D00]/8 blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#FF9100]">
              <Sparkles size={12} className="text-[#FF8F00]" />
              Auto Caption Styles
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-heading">
              Pick a style.{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                Upload your video. Done.
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-lg">
              100+ caption styles — from viral bold to cinematic minimal.
            </p>
          </div>

          <Link
            href="/dashboard/auto-caption"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#0E1526] px-5 py-2.5 text-xs font-black text-white hover:border-[#FF6D00]/50 hover:text-[#FFA726] transition active:scale-95 cursor-pointer"
          >
            <span>Browse all 100+ styles</span>
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
            animate={isPaused ? { x: undefined } : { x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {marqueeItems.map((presetKey, idx) => (
              <ShowcaseCard
                key={`${presetKey}-${idx}`}
                presetKey={presetKey}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
