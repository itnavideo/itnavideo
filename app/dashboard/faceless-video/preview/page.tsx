"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Player, type PlayerRef } from "@remotion/player";
import { FacelessLongVideoTemplate } from "@/remotion/templates/FACELESS_LONG_VIDEO/template";
import type { SceneBlueprintItem } from "@/services/ai/sceneBlueprintTypes";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers3,
  Clock,
  Tv,
  Film,
  Type,
  Sliders,
  CheckCircle2,
  Volume2,
} from "lucide-react";

const DEMO_16X9_SCENES: SceneBlueprintItem[] = [
  {
    sceneNumber: 1,
    sceneType: "hook",
    layoutType: "big_typography",
    duration: 6,
    narrationSegment: {
      text: "The power of financial freedom begins with leverage",
      startSeconds: 0,
      endSeconds: 6,
    },
    heading: "The Power of Financial Freedom",
    supportingText: "How modern creators build high-margin digital media systems",
    highlightedWords: ["Financial", "Freedom", "Leverage"],
    visualAssetRequirement: "Modern creator studio workspace with ambient glow",
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
    narrationSegment: {
      text: "Follow this three step execution roadmap to scale",
      startSeconds: 6,
      endSeconds: 14,
    },
    heading: "The 3-Step Execution Roadmap",
    supportingText: "From zero audience to first recurring monetization engine",
    highlightedWords: ["Execution", "Roadmap"],
    visualAssetRequirement: "3-card process flow diagram with glassmorphism cards",
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
    narrationSegment: {
      text: "Over eighty five percent of creators quit before reaching critical mass",
      startSeconds: 14,
      endSeconds: 21,
    },
    heading: "The Retention Inflection Point",
    supportingText: "Those who persist past day 90 capture 10x higher compounding revenue",
    highlightedWords: ["85%", "Retention"],
    visualAssetRequirement: "Large circular impact metric card with trend indicator",
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
    narrationSegment: {
      text: "Traditional manual grind versus modern automated AI workflows",
      startSeconds: 21,
      endSeconds: 29,
    },
    heading: "Traditional Grind vs Modern System",
    supportingText: "Why building systems always beats trading manual hours",
    highlightedWords: ["Traditional", "Modern"],
    visualAssetRequirement: "Dual split comparison card with red problem and emerald solution",
    background: "solid-white",
    fontHierarchy: { headingFont: "Fraunces", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "pop",
    transition: "slide",
    comparisonItems: {
      left: "40 hours manual editing & zero leverage",
      right: "Automated 16:9 cloud rendering & instant scale",
    },
  },
  {
    sceneNumber: 5,
    sceneType: "transition",
    layoutType: "quote",
    duration: 6,
    narrationSegment: {
      text: "Consistency compounds faster than raw talent",
      startSeconds: 29,
      endSeconds: 35,
    },
    heading: "Consistency Compounds Faster Than Talent",
    supportingText: "Show up every day with clarity, systems, and execution.",
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

export default function FacelessLivePreviewPage() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const [headingFont, setHeadingFont] = useState<string>("Fraunces");
  const [captionStyle, setCaptionStyle] = useState<"smooth" | "bouncy" | "mrbeast" | "handwriting">("smooth");

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
  }, []);

  const totalDurationSeconds = 35;
  const totalFrames = totalDurationSeconds * 30;
  const currentTimeSec = (currentFrame / 30).toFixed(1);

  const currentSceneIndex = DEMO_16X9_SCENES.findIndex(
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
    if (isPlaying) playerRef.current.pause();
    else playerRef.current.play();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/faceless-video"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Studio
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-white tracking-tight">
              Faceless Video 16:9 Live Storyboard Studio
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              16:9 Widescreen Cinema
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              1080p @ 30 FPS
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/faceless-video"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
        >
          <Film className="w-3.5 h-3.5" />
          Open Studio & Create
        </Link>
      </header>

      {/* Main Grid: 16:9 Player Stage on Left, Interactive Storyboard on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: 16:9 Player Viewport */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-zinc-950 border-r border-zinc-800/80 overflow-y-auto">
          {/* 16:9 Aspect Ratio Frame */}
          <div className="w-full max-w-[940px] aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl relative flex items-center justify-center">
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
                sceneBlueprint: DEMO_16X9_SCENES,
                brollUrls: {},
                durationSeconds: totalDurationSeconds,
                aspectRatio: "16:9",
                headingFont,
                subheadingFont: "Plus Jakarta Sans",
                captionAnimationStyle: captionStyle,
                captionPosition: "bottom",
                backgroundTheme: "solid-white",
                title: "16:9 Faceless Video Preview",
              }}
            />
          </div>

          {/* Transport & Controls Bar */}
          <div className="w-full max-w-[940px] mt-5 flex items-center justify-between px-5 py-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all shadow-md shadow-orange-500/25"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button
                onClick={() => playerRef.current?.seekTo(0)}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                title="Rewind to start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="text-xs font-mono text-zinc-300">
                <span className="text-orange-400 font-bold">{currentTimeSec}s</span> / {totalDurationSeconds}s
              </div>
            </div>

            {/* Live Font & Subtitle Customizers */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Font:</span>
                {(["Fraunces", "Plus Jakarta Sans", "Outfit"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setHeadingFont(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      headingFont === f
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-zinc-800" />

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Captions:</span>
                {(["smooth", "bouncy", "mrbeast"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCaptionStyle(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize ${
                      captionStyle === c
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Storyboard Scene Selector */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-900/30 border-l border-zinc-800/80 overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <Layers3 className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                16:9 Storyboard Scenes ({DEMO_16X9_SCENES.length})
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400">Click to jump live</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {DEMO_16X9_SCENES.map((sc, idx) => {
              const startSec = sc.narrationSegment?.startSeconds ?? idx * 6;
              const endSec = sc.narrationSegment?.endSeconds ?? (startSec + sc.duration);
              const isActive = currentSceneIndex === idx;

              return (
                <div
                  key={sc.sceneNumber}
                  onClick={() => jumpToScene(startSec)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? "bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/30"
                      : "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isActive ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {sc.sceneNumber}
                      </span>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        {sc.layoutType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {startSec.toFixed(1)}s - {endSec.toFixed(1)}s
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white line-clamp-1 mb-1">
                    {sc.heading}
                  </div>
                  <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {sc.supportingText}
                  </div>

                  {sc.highlightedWords && sc.highlightedWords.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {sc.highlightedWords.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-amber-300 font-semibold border border-zinc-700"
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

          {/* Quick Help Card */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/60">
            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Credit Waste:</strong> Preview every card layout, font, and subtitle timing before submitting for AWS cloud rendering.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
