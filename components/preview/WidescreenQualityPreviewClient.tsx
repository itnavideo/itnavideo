"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Player, type PlayerRef } from "@remotion/player";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Tv,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Check,
} from "lucide-react";
import { FacelessLongVideoTemplate as FacelessVideoTemplate } from "@/remotion/templates/FACELESS_LONG_VIDEO/template";
import type { SceneBlueprintItem } from "@/services/ai/sceneBlueprintTypes";

// Curated 4-Scene Widescreen 16:9 Storyboard Blueprint
export const SAMPLE_WIDESCREEN_BLUEPRINT: SceneBlueprintItem[] = [
  {
    sceneNumber: 1,
    sceneType: "hook",
    heading: "THE ARCHITECTURE OF AUTOMATION",
    duration: 5,
    supportingText: "Decoupling heavy compute from local devices enables instant 1080p generation.",
    visualAssetRequirement: "none",
    background: "solid-white",
    narrationSegment: {
      text: "Decoupling heavy compute from local devices enables instant 1080p generation.",
      startSeconds: 0,
      endSeconds: 5,
    },
    highlightedWords: ["architecture", "automation", "instant", "1080p"],
    layoutType: "data_visualization",
    chartItems: [
      { label: "Cloud Lambda Render", value: 95, formattedValue: "95%" },
      { label: "Local Laptop Memory", value: 8, formattedValue: "8%" },
      { label: "Asset Reuse Efficiency", value: 88, formattedValue: "88%" },
    ],
    fontHierarchy: { headingFont: "Montserrat", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "whoosh",
    transition: "cut",
  },
  {
    sceneNumber: 2,
    sceneType: "main_point",
    heading: "PARADIGM SHIFT: ASSET CONTINUITY",
    duration: 5,
    supportingText: "Traditional rigid photographic frames vs. Universal Alpha Cutout Assets.",
    visualAssetRequirement: "none",
    background: "solid-white",
    narrationSegment: {
      text: "Traditional rigid photographic frames vs. Universal Alpha Cutout Assets.",
      startSeconds: 5,
      endSeconds: 10,
    },
    highlightedWords: ["traditional", "universal", "alpha", "assets"],
    layoutType: "vs_battle",
    comparisonItems: {
      left: "Fixed Rigid 16:9 Photos",
      right: "Transparent Alpha PNG Assets",
    },
    statValue: "+340%",
    statLabel: "Workflow Speed Gain",
    chartValuePercent: 340,
    fontHierarchy: { headingFont: "Montserrat", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "rise",
    transition: "dissolve",
  },
  {
    sceneNumber: 3,
    sceneType: "explanation",
    heading: "Turn Your Idea Into Reality",
    duration: 6,
    supportingText: "Follow these 5 simple steps to get started, stay on track, and achieve your goals with confidence.",
    categoryPill: "SIMPLE 5 STEP PROCESS",
    visualAssetRequirement: "none",
    background: "solid-white",
    narrationSegment: {
      text: "Follow these 5 simple steps to get started, stay on track, and achieve your goals with confidence.",
      startSeconds: 10,
      endSeconds: 16,
    },
    highlightedWords: ["idea", "reality", "simple", "steps", "goals"],
    layoutType: "horizontal_process",
    listItems: [
      "Research: Understand your market, audience and opportunities.",
      "Plan: Set clear goals, create a strategy and outline your roadmap.",
      "Build: Bring your plan to life with the right tools and resources.",
      "Launch: Go live, reach your audience and start getting results.",
      "Grow: Analyze performance, learn and scale for long-term success.",
    ],
    fontHierarchy: { headingFont: "Montserrat", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "chime",
    transition: "cut",
  },
  {
    sceneNumber: 4,
    sceneType: "emphasis",
    heading: "CRITICAL ARCHITECTURAL TAKEAWAYS",
    duration: 5,
    supportingText: "Core engineering standards for scalable, broadcast-grade video.",
    visualAssetRequirement: "none",
    background: "solid-white",
    narrationSegment: {
      text: "Core engineering standards for scalable, broadcast-grade video.",
      startSeconds: 15,
      endSeconds: 20,
    },
    highlightedWords: ["critical", "scalable", "broadcast", "standards"],
    layoutType: "supporting_note",
    listItems: [
      "Zero cropping across formats using transparent alpha channels",
      "Proportional typography scaled strictly for 1920x1080 widescreen display",
      "Coordinated color palette matching video design tokens",
      "Zero local compute: 100% cloud rendering & storage",
    ],
    quoteAuthor: "Itnavideo Engineering Standard",
    fontHierarchy: { headingFont: "Montserrat", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "pop",
    transition: "dissolve",
  },
  {
    sceneNumber: 5,
    sceneType: "explanation",
    heading: "FROM VILLAGE ROOTS TO TECH EMPIRE",
    duration: 5,
    supportingText: "A human journey: overcoming obstacles with relentless grit and focus.",
    visualAssetRequirement: "none",
    background: "solid-white",
    narrationSegment: {
      text: "He began in a small village house, walking miles every single day before building a technology powerhouse in the city.",
      startSeconds: 20,
      endSeconds: 25,
    },
    highlightedWords: ["village", "journey", "focus", "empire"],
    layoutType: "drawing_story",
    fontHierarchy: { headingFont: "Montserrat", bodyFont: "Plus Jakarta Sans" },
    animation: "spring",
    SFX: "whoosh",
    transition: "fade_to_black",
  },
];

export default function WidescreenQualityPreviewClient() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  const totalDurationSeconds = 25;
  const fps = 30;
  const totalFrames = totalDurationSeconds * fps;

  const jumpToScene = (sceneIndex: number) => {
    setActiveSceneIdx(sceneIndex);
    const targetFrame = sceneIndex * 5 * fps + 25;
    playerRef.current?.seekTo(targetFrame);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const restart = () => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
    setIsPlaying(true);
    setActiveSceneIdx(0);
  };

  const templateProps = {
    title: "16:9 Widescreen Quality Preview",
    durationSeconds: totalDurationSeconds,
    backgroundTheme: "solid-white",
    headingFont: "Montserrat",
    subheadingFont: "Plus Jakarta Sans",
    typographyFont: "Plus Jakarta Sans",
    sceneBlueprint: SAMPLE_WIDESCREEN_BLUEPRINT,
    showCaptions: false,
    aspectRatio: "16:9" as const,
  };

  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-6 md:p-10">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/faceless-video"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                16:9 Widescreen Preview
              </span>
              <span className="text-xs text-zinc-500">1920 × 1080 @ 30 FPS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">
              Typography, SVG Scale & Motion Quality Inspector
            </h1>
          </div>
        </div>

        {/* Quick Scene Selector Buttons */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-white/10 p-1.5 rounded-2xl">
          {SAMPLE_WIDESCREEN_BLUEPRINT.map((s, idx) => (
            <button
              key={idx}
              onClick={() => jumpToScene(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSceneIdx === idx
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Scene {idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 16:9 Player Viewport */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Remotion Player (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-white/15 bg-black shadow-2xl shadow-black/80">
            <Player
              ref={playerRef}
              component={FacelessVideoTemplate}
              inputProps={templateProps}
              durationInFrames={totalFrames}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={fps}
              style={{ width: "100%", height: "100%" }}
              loop
            />
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition shadow-lg shadow-orange-600/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={restart}
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="text-xs font-mono text-zinc-400 ml-2">
                Duration: <span className="text-white font-bold">25.0s</span> (750 frames)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">Pure White Canvas Engine:</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white text-xs font-bold font-mono">
                #FFFFFF
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Specifications & Verification Standards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Active Scene Inspection Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Active Storyboard Scene {activeSceneIdx + 1} of 5
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-zinc-400">
                {activeSceneIdx * 5}s – {(activeSceneIdx + 1) * 5}s
              </span>
            </div>
            <div className="text-base font-black text-white leading-snug">
              {SAMPLE_WIDESCREEN_BLUEPRINT[activeSceneIdx].heading}
            </div>
            <div className="text-xs text-zinc-400 leading-relaxed">
              {SAMPLE_WIDESCREEN_BLUEPRINT[activeSceneIdx].supportingText}
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Explanation Mode:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {SAMPLE_WIDESCREEN_BLUEPRINT[activeSceneIdx].layoutType === 'drawing_story'
                  ? '🎨 DRAWING-BASED STORYTELLING'
                  : '📊 SVG STRUCTURED EXPLANATION'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Layout Type:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {SAMPLE_WIDESCREEN_BLUEPRINT[activeSceneIdx].layoutType}
              </span>
            </div>
          </div>

          {/* 16:9 Design System Checklist */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col gap-4">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              16:9 Quality Standards Verified
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Headline Proportions (58px)</div>
                  <div className="text-zinc-400">
                    Montserrat 58px Obsidian Slate (#0F172A). Scaled strictly to stay well within 1920px margins.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Supporting Note Cards (24px)</div>
                  <div className="text-zinc-400">
                    Plus Jakarta Sans 24px with high-contrast text and signature yellow marker accent tape.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">SVG Vector Scale (960px–1240px)</div>
                  <div className="text-zinc-400">
                    SVGs render as bold architectural elements across the widescreen canvas, not tiny emojis.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Physics-Driven Spring Motion</div>
                  <div className="text-zinc-400">
                    Remotion spring physics calibrated with damping 14 to eliminate rigid static frames.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Zero Subtitle Clutter in 16:9</div>
                  <div className="text-zinc-400">
                    Subtitles suppressed because diagrams and note cards convey full spoken meaning.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
