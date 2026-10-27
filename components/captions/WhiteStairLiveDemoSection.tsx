"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Sparkles, X, Check, ArrowRight } from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  PREVIEW_SCRIPT_CHUNKS,
  CaptionPreviewText,
  PREVIEW_CONFIG,
  CaptionStylePreviewConfig,
  PresetOption,
} from "@/components/ui/SubtitleStylePicker";

interface DemoCard {
  id: string;
  name: string;
  presetKey: string;
  isCrossed?: boolean;
  words?: Array<{
    text: string;
    color?: string;
    bg?: string;
    bold?: boolean;
    italic?: boolean;
    glow?: string;
    pill?: boolean;
    font?: string;
  }>;
}

const DEMO_CARDS: DemoCard[] = [
  {
    id: "classic",
    name: "Classic",
    presetKey: "Minimal Clean",
    words: [{ text: "this is sample", color: "#FFFFFF" }],
  },
  {
    id: "handwritten",
    name: "Handwritten",
    presetKey: "Cursive",
    words: [
      { text: "this is", color: "#FFFFFF" },
      { text: "sample", color: "#60A5FA", italic: true, font: "cursive" },
    ],
  },
  {
    id: "solo",
    name: "Solo",
    presetKey: "Solo",
    words: [
      { text: "this", color: "#FFFFFF" },
      { text: "is", color: "#FACC15", bold: true, glow: "rgba(250,204,21,0.8)" },
      { text: "sample text now", color: "#FFFFFF" },
    ],
  },
  {
    id: "no-caption",
    name: "No Caption",
    presetKey: "none",
    isCrossed: true,
  },
  {
    id: "master",
    name: "Master",
    presetKey: "Master",
    words: [
      { text: "this is a", color: "#9CA3AF" },
      { text: "choice", color: "#38BDF8", bold: true },
    ],
  },
  {
    id: "simple",
    name: "Simple",
    presetKey: "Shorts Karaoke",
    words: [
      { text: "this", color: "#FFFFFF", bold: true },
      { text: "is sample", color: "#38BDF8", bold: true },
    ],
  },
  {
    id: "podcast",
    name: "Podcast",
    presetKey: "Diary of a CEO",
    words: [
      { text: "I'M NOT", color: "#FFFFFF", bold: true },
      { text: "GOING TO DO IT", color: "#FFFFFF" },
    ],
  },
  {
    id: "discipline",
    name: "Discipline",
    presetKey: "Discipline",
    words: [
      { text: "where you", color: "#9CA3AF" },
      { text: "have", color: "#FFFFFF", bold: true },
      { text: "Never", color: "#EF4444", italic: true, bold: true },
    ],
  },
  {
    id: "kinetic",
    name: "Kinetic",
    presetKey: "Kinetic",
    words: [
      { text: "Forget", color: "#FACC15", bold: true },
      { text: "the RED deep,", color: "#00E5FF", bold: true },
      { text: "second.", color: "#9CA3AF" },
    ],
  },
  {
    id: "impact",
    name: "Impact",
    presetKey: "Impact",
    words: [
      { text: "MY FRIEND", color: "#EF4444", bold: true, glow: "rgba(239,68,68,0.9)" },
      { text: "knows the judge", color: "#FFFFFF" },
    ],
  },
  {
    id: "clean",
    name: "Clean",
    presetKey: "Minimal Clean",
    words: [
      { text: "Anime", color: "#FFFFFF", bold: true },
      { text: "has", color: "#000000", bg: "#EF4444", pill: true, bold: true },
      { text: "helped me", color: "#FFFFFF" },
    ],
  },
  {
    id: "red-wipe",
    name: "Red Wipe",
    presetKey: "Red Wipe",
    words: [
      { text: "our business", color: "#FFFFFF" },
      { text: "is editing", color: "#FFFFFF", bg: "#DC2626", pill: true, bold: true },
    ],
  },
  {
    id: "story",
    name: "Story",
    presetKey: "Story",
    words: [
      { text: "this is", color: "#FFFFFF" },
      { text: "story", color: "#EF4444", italic: true },
      { text: "made simple", color: "#9CA3AF" },
    ],
  },
  {
    id: "creator-3",
    name: "Creator 3",
    presetKey: "Creator 3",
    words: [
      { text: "captions", color: "#4ADE80", bold: true, glow: "rgba(74,222,128,0.7)" },
      { text: "simple", color: "#FFFFFF", italic: true },
    ],
  },
  {
    id: "creator-4",
    name: "Creator 4",
    presetKey: "Submagic Glow",
    words: [
      { text: "What's The", color: "#FACC15", bold: true, glow: "rgba(250,204,21,0.8)" },
      { text: "Difference", color: "#FFFFFF", italic: true },
    ],
  },
  {
    id: "crazy",
    name: "Crazy",
    presetKey: "Crazy",
    words: [
      { text: "Every", color: "#FFFFFF" },
      { text: "Single", color: "#FF7043", bold: true, glow: "rgba(255,112,67,0.8)" },
      { text: "Day", color: "#FACC15", bold: true },
    ],
  },
  {
    id: "crazy-2",
    name: "Crazy 2",
    presetKey: "Crazy 2",
    words: [
      { text: "six", color: "#00E5FF", bold: true },
      { text: "checks", color: "#000000", bg: "#00E5FF", pill: true, bold: true },
      { text: "only", color: "#00E5FF" },
    ],
  },
  {
    id: "spark",
    name: "Spark",
    presetKey: "Spark",
    words: [
      { text: "and i'll", color: "#9CA3AF" },
      { text: "send it", color: "#22C55E", bold: true, glow: "rgba(34,197,94,0.9)" },
      { text: "your way", color: "#22C55E" },
    ],
  },
  {
    id: "gamer",
    name: "Gamer",
    presetKey: "Gamer",
    words: [{ text: "Clutch", color: "#00E5FF", bold: true, glow: "rgba(0,229,255,0.8)" }],
  },
  {
    id: "cursive",
    name: "Cursive",
    presetKey: "Cursive",
    words: [
      { text: "daily", color: "#FFFFFF" },
      { text: "life", color: "#00E5FF", italic: true, bold: true, glow: "rgba(0,229,255,0.7)" },
    ],
  },
];

export default function WhiteStairLiveDemoSection() {
  const [selectedKey, setSelectedKey] = useState<string>("Shorts Karaoke");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);

  const leftVideoRef = useRef<HTMLVideoElement | null>(null);
  const rightVideoRef = useRef<HTMLVideoElement | null>(null);

  const VIDEO_SRC = "/visuals/homepage/autocaption.mp4";

  // Sync playback between both videos
  const togglePlay = () => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    if (left.paused) {
      left.play().catch(() => {});
      right.play().catch(() => {});
      setIsPlaying(true);
    } else {
      left.pause();
      right.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    if (leftVideoRef.current) leftVideoRef.current.muted = true; // Always keep left muted
    if (rightVideoRef.current) rightVideoRef.current.muted = isMuted;
  }, [isMuted]);

  // Animation frame loop for real-time word syncing
  useEffect(() => {
    let animId: number;
    let lastUpdateAt = 0;

    const loop = (now: number) => {
      const v = rightVideoRef.current;
      if (v && !v.paused && now - lastUpdateAt >= 70) {
        setPlaybackTime(v.currentTime);
        lastUpdateAt = now;
      }
      animId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Resolve preset configuration for live overlay
  const presetData = SUBTITLE_PRESETS[selectedKey] || SUBTITLE_PRESETS["Shorts Karaoke"] || {
    name: selectedKey,
    style: "shorts-karaoke",
    fontFamily: "Montserrat, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#FFA000",
    fontSize: "large",
  };

  const presetOption: PresetOption = {
    key: selectedKey,
    label: presetData.name,
    style: presetData.style,
    font: presetData.fontFamily,
    textColor: presetData.textColor,
    highlightColor: presetData.highlightColor,
    bgColor: presetData.backgroundColor,
  };

  const config: CaptionStylePreviewConfig = PREVIEW_CONFIG[selectedKey] || {
    sampleLines: ["Clear captions", "keep people watching."],
    activeWord: "captions",
  };

  const currentChunk = useMemo(() => {
    const chunk =
      PREVIEW_SCRIPT_CHUNKS.find((c) => playbackTime >= c.start && playbackTime < c.end) ||
      PREVIEW_SCRIPT_CHUNKS[0];
    return chunk;
  }, [playbackTime]);

  const currentWordObj = isPlaying && currentChunk
    ? currentChunk.words.find((w) => playbackTime >= w.start && playbackTime <= w.end)
    : undefined;

  const currentActiveWord = currentWordObj
    ? currentWordObj.word.replace(/[^a-zA-Z0-9']/g, "")
    : currentChunk?.activeWord || "";

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#070B14] text-white border-y border-white/10">
      {/* Background ambient lighting - Flame Orange & Sunset Amber */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[#FF5722]/15 via-[#FF7043]/10 to-[#FFA000]/15 blur-[140px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ── 1. Header (Eyebrow, Title & Subtitle) in Itnavideo Brand Style ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFA000]">
            <Sparkles size={13} className="text-[#FF7043]" />
            <span>LIVE DEMO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-jakarta">
            See it{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
              in action
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-medium">
            Pick a caption style and watch the spoken words appear on the video — auto-captioned and styled in real time, exactly like the editor.
          </p>
        </div>

        {/* ── 2. The 3-Column Interactive Showcase ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center max-w-6xl mx-auto">
          {/* LEFT COLUMN: ORIGINAL (Raw Video without Captions) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            {/* Top Badge */}
            <div className="mb-3">
              <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-300 shadow">
                ORIGINAL
              </span>
            </div>

            {/* Phone Video Container */}
            <div className="relative w-[240px] sm:w-[270px] aspect-[9/16] rounded-[28px] overflow-hidden bg-black border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <video
                ref={leftVideoRef}
                src={VIDEO_SRC}
                autoPlay
                loop
                playsInline
                muted
                preload="auto"
                className="h-full w-full object-cover"
              />

              {/* Controls Overlay at Bottom */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 hover:bg-[#FF5722] hover:text-black text-white transition shadow-md border border-white/20 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 hover:bg-[#FF5722] hover:text-black text-white transition shadow-md border border-white/20 cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-emerald-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: CAPTION STYLE SELECTOR (2-Column Scrollable Cards Grid) */}
          <div className="lg:col-span-4 flex flex-col items-center w-full max-w-[340px] mx-auto">
            <h3 className="text-sm font-black text-slate-200 mb-3 tracking-wide font-jakarta">
              Caption style
            </h3>

            {/* Scrollable Cards Grid */}
            <div className="w-full grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1.5 custom-scrollbar">
              {DEMO_CARDS.map((card) => {
                const isSelected = selectedKey === card.presetKey && !card.isCrossed;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (!card.isCrossed) setSelectedKey(card.presetKey);
                      else setSelectedKey("none");
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-2.5 min-h-[105px] cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? "border-2 border-[#FF5722] bg-[#141C30] ring-4 ring-[#FF5722]/20 shadow-xl shadow-[#FF5722]/25 scale-[1.02]"
                        : "border-white/10 bg-[#070B14] hover:border-[#FF5722]/60 hover:bg-[#101726]"
                    }`}
                  >
                    {/* Selected Check Badge */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-md z-10">
                        <Check size={10} strokeWidth={3.5} />
                      </div>
                    )}

                    {/* Card Content Stage */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
                      {card.isCrossed ? (
                        <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                          <X size={20} className="text-slate-500" />
                          <span className="text-[10px] font-bold">No Caption</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-center gap-1 leading-snug">
                          {card.words?.map((w, wIdx) => (
                            <span
                              key={wIdx}
                              style={{
                                color: w.color || "#FFFFFF",
                                backgroundColor: w.bg || "transparent",
                                fontStyle: w.italic ? "italic" : "normal",
                                fontWeight: w.bold ? 800 : 500,
                                textShadow: w.glow ? `0 0 10px ${w.glow}` : undefined,
                                borderRadius: w.pill ? "5px" : undefined,
                                padding: w.pill ? "1px 4px" : undefined,
                                fontFamily: w.font || undefined,
                              }}
                              className="text-[11px] tracking-tight"
                            >
                              {w.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Name */}
                    <div className="pt-1.5 border-t border-white/5 text-center">
                      <span className="text-[10px] font-black text-slate-300 truncate block font-jakarta">
                        {card.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: WITH CAPTIONS (Live Dynamic Styled Video) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            {/* Top Badge in Itnavideo Flame Orange */}
            <div className="mb-3">
              <span className="rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-[#FF5722]/25">
                WITH CAPTIONS
              </span>
            </div>

            {/* Phone Video Container */}
            <div className="relative w-[240px] sm:w-[270px] aspect-[9/16] rounded-[28px] overflow-hidden bg-black border-2 border-[#FF5722]/40 shadow-[0_20px_50px_rgba(255,87,34,0.2)] group">
              <video
                ref={rightVideoRef}
                src={VIDEO_SRC}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                preload="auto"
                className="h-full w-full object-cover"
              />

              {/* Dynamic Styled Kinetic Caption Overlay */}
              {selectedKey !== "none" && (
                <div className="absolute inset-x-3 bottom-[26%] flex justify-center text-center z-20 pointer-events-none">
                  <div className="p-1 rounded-xl">
                    <CaptionPreviewText
                      preset={presetOption}
                      config={config}
                      chunk={currentChunk}
                      playbackTime={playbackTime}
                      isPlaying={isPlaying}
                      activeWord={currentActiveWord}
                      currentWordObj={currentWordObj}
                    />
                  </div>
                </div>
              )}

              {/* Controls Overlay at Bottom */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 hover:bg-[#FF5722] hover:text-black text-white transition shadow-md border border-white/20 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 hover:bg-[#FF5722] hover:text-black text-white transition shadow-md border border-white/20 cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-emerald-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Bottom Subtext & CTA Button in Itnavideo Flame Orange ── */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            In the editor you have full control over your captions — change the size, location, color and fonts, and even apply different templates to different parts of the video.
          </p>

          <div>
            <Link
              href="/dashboard/auto-caption"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] hover:brightness-110 px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-[#FF5722]/30 transition active:scale-95 cursor-pointer font-jakarta"
            >
              <span>See all templates</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
