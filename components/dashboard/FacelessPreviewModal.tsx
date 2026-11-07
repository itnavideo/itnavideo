"use client";

import React, { useRef, useState, useEffect } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { FacelessLongVideoTemplate } from "@/remotion/templates/FACELESS_LONG_VIDEO/template";
import type { SceneBlueprintItem } from "@/services/ai/sceneBlueprintTypes";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers3,
  Clock,
  CheckCircle2,
  Tv,
  Film,
  Type,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface FacelessPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl?: string;
  scenes?: SceneBlueprintItem[];
  brollUrls?: Record<number, string>;
  durationSeconds?: number;
  title?: string;
  headingFont?: string;
  subheadingFont?: string;
  captionAnimationStyle?: "mrbeast" | "handwriting" | "bouncy" | "smooth";
  captionPosition?: "bottom" | "center" | "top";
  bgmUrl?: string;
  bgmVolume?: number;
  onConfirmRender: () => void;
  isSubmitting?: boolean;
}

export default function FacelessPreviewModal({
  isOpen,
  onClose,
  audioUrl = "/assets/reusable/music/not-for-nothing-otis-mcdonald.mp3",
  scenes = [],
  brollUrls = {},
  durationSeconds = 60,
  title = "16:9 Faceless Video",
  headingFont = "Plus Jakarta Sans",
  subheadingFont = "Plus Jakarta Sans",
  captionAnimationStyle = "smooth",
  captionPosition = "bottom",
  bgmUrl = "/assets/reusable/music/not-for-nothing-otis-mcdonald.mp3",
  bgmVolume = 0.15,
  onConfirmRender,
  isSubmitting = false,
}: FacelessPreviewModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: any) => setCurrentFrame(e.detail.frame);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener("frameupdate", onFrameUpdate);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("frameupdate", onFrameUpdate);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalFrames = Math.max(90, Math.round(durationSeconds * 30));
  const currentTimeSec = (currentFrame / 30).toFixed(1);

  // Fallback demo scenes if user opened preview before planning
  const activeScenes: SceneBlueprintItem[] = scenes.length > 0 ? scenes : [
    {
      sceneNumber: 1,
      sceneType: "hook",
      layoutType: "big_typography",
      duration: 6,
      narrationSegment: { text: "The power of financial freedom", startSeconds: 0, endSeconds: 6 },
      heading: "The Power of Financial Freedom",
      supportingText: "How modern creators build passive digital income",
      highlightedWords: ["Financial", "Freedom"],
      visualAssetRequirement: "Modern creator studio desk with laptop",
      background: "solid-white",
      fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
      animation: "slow_zoom_in",
      SFX: "whoosh",
      transition: "crossfade",
    },
    {
      sceneNumber: 2,
      sceneType: "main_point",
      layoutType: "horizontal_process",
      duration: 8,
      narrationSegment: { text: "Follow this three step execution roadmap", startSeconds: 6, endSeconds: 14 },
      heading: "The 3-Step Execution Roadmap",
      supportingText: "From zero audience to first recurring client",
      highlightedWords: ["Execution", "Roadmap"],
      visualAssetRequirement: "Process flow diagram with 3 cards",
      background: "solid-white",
      fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
      animation: "spring",
      SFX: "pop",
      transition: "slide",
      timelineSteps: ["Pick High-Value Skill", "Build One Proof Case", "Systematize & Scale"],
    },
    {
      sceneNumber: 3,
      sceneType: "example_stat",
      layoutType: "stat_card",
      duration: 7,
      narrationSegment: { text: "Over eighty five percent of creators quit too early", startSeconds: 14, endSeconds: 21 },
      heading: "The Retention Inflection Point",
      supportingText: "Those who persist past day 90 capture 10x higher revenue",
      highlightedWords: ["85%", "Retention"],
      visualAssetRequirement: "Large circular impact metric card",
      background: "solid-white",
      fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
      animation: "scale_pop",
      SFX: "chime",
      transition: "crossfade",
      statValue: "85%",
      statLabel: "Quit Before Day 90",
      statTrend: "up",
    },
    {
      sceneNumber: 4,
      sceneType: "explanation",
      layoutType: "comparison",
      duration: 8,
      narrationSegment: { text: "Old manual hustle versus modern AI workflows", startSeconds: 21, endSeconds: 29 },
      heading: "Traditional Grind vs Modern System",
      supportingText: "Why working smarter beats working longer hours",
      highlightedWords: ["Traditional", "Modern"],
      visualAssetRequirement: "Dual split comparison card with red and emerald highlights",
      background: "solid-white",
      fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
      animation: "spring",
      SFX: "pop",
      transition: "slide",
      comparisonItems: {
        left: "40 hours manual editing & zero leverage",
        right: "Automated 16:9 rendering & instant cloud scale",
      },
    },
    {
      sceneNumber: 5,
      sceneType: "transition",
      layoutType: "quote",
      duration: 6,
      narrationSegment: { text: "Consistency compounds faster than raw talent", startSeconds: 29, endSeconds: 35 },
      heading: "Consistency Compounds Faster Than Talent",
      supportingText: "Show up every day with clarity and systems.",
      highlightedWords: ["Consistency", "Compounds"],
      visualAssetRequirement: "Editorial quote block with warm paper accent",
      background: "solid-white",
      fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
      animation: "slow_zoom_out",
      SFX: "whoosh",
      transition: "fade_to_black",
      quoteAuthor: "James Clear, Atomic Habits",
    },
  ];

  const currentSceneIndex = activeScenes.findIndex(
    (s) =>
      Number(currentTimeSec) >= (s.narrationSegment?.startSeconds ?? 0) &&
      Number(currentTimeSec) < (s.narrationSegment?.endSeconds ?? ((s.narrationSegment?.startSeconds ?? 0) + s.duration))
  );

  const jumpToScene = (startSeconds: number) => {
    if (!playerRef.current) return;
    // Seek 0.6s into the scene so entrance transition is complete and visual elements are fully rendered
    playerRef.current.seekTo(Math.round((startSeconds + 0.6) * 30));
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[920px] bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-orange-500/40 flex items-center justify-center text-[#3B82F6]">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  16:9 Faceless Storyboard Live Preview
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Instant WYSIWYG
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  1920×1080 Full HD
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Interactive preview: inspect scenes, typography, motion cards, and pacing before rendering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onConfirmRender}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-[#0066FF]/25/20 transition-all disabled:opacity-50"
            >
              <Film className="w-4 h-4" />
              {isSubmitting ? "Starting Render..." : "Confirm & Render 1080p"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content: 16:9 Widescreen Player on Left, Scene List on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: 16:9 Player Stage */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 sm:p-6 bg-zinc-950/60 border-r border-zinc-800/80 overflow-hidden">
            {/* 16:9 Aspect Ratio Frame */}
            <div className="w-full max-w-[820px] aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl relative flex items-center justify-center">
              <Player
                ref={playerRef}
                component={FacelessLongVideoTemplate as any}
                durationInFrames={totalFrames}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                inputProps={{
                  sceneBlueprint: activeScenes,
                  brollUrls,
                  audioSrc: audioUrl,
                  audioUrl,
                  bgmUrl,
                  bgmVolume,
                  durationSeconds,
                  aspectRatio: "16:9",
                  headingFont,
                  subheadingFont,
                  captionAnimationStyle,
                  captionPosition,
                  backgroundTheme: "solid-white",
                  title,
                }}
              />
            </div>

            {/* Transport Bar Controls */}
            <div className="w-full max-w-[820px] mt-4 flex items-center justify-between px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-lg bg-orange-500 hover:bg-[#0052CC] text-white flex items-center justify-center transition-all shadow-md shadow-[#0066FF]/25/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <button
                  onClick={() => playerRef.current?.seekTo(0)}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="text-xs font-mono text-zinc-300">
                  <span className="text-[#3B82F6] font-bold">{currentTimeSec}s</span> / {durationSeconds.toFixed(1)}s
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">
                  Scene {currentSceneIndex >= 0 ? currentSceneIndex + 1 : 1} of {activeScenes.length}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                  {activeScenes[Math.max(0, currentSceneIndex)]?.layoutType || "motion_card"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Storyboard Scene Selector */}
          <div className="lg:col-span-4 flex flex-col bg-zinc-900/30 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Storyboard Scenes ({activeScenes.length})
                </h4>
              </div>
              <span className="text-[11px] text-zinc-400">Click any scene to jump</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {activeScenes.map((sc, idx) => {
                const startSec = sc.narrationSegment?.startSeconds ?? idx * 6;
                const endSec = sc.narrationSegment?.endSeconds ?? (startSec + sc.duration);
                const isActive = currentSceneIndex === idx;

                return (
                  <div
                    key={sc.sceneNumber || idx}
                    onClick={() => jumpToScene(startSec)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-500/10 border-orange-500/50 shadow-md shadow-[#0066FF]/10"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            isActive ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                          {sc.layoutType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {startSec.toFixed(1)}s - {endSec.toFixed(1)}s
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-1 mb-1">
                      {sc.heading || `Scene ${idx + 1}`}
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {sc.narrationSegment?.text || sc.supportingText}
                    </div>

                    {sc.highlightedWords && sc.highlightedWords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {sc.highlightedWords.slice(0, 3).map((w, wIdx) => (
                          <span
                            key={wIdx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300/90 font-medium"
                          >
                            ★ {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Advice */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
              <div className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                <span>
                  Tip: Every scene dynamically renders in full 1080p widescreen with auto-ducked background audio.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
