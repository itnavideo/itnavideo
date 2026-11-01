"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Player, type PlayerRef } from "@remotion/player";
import { WhiteboardVideo } from "@/remotion/templates/WHITEBOARD_VIDEO/template";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Layers3,
  Clock,
  ChevronRight,
  Tv,
} from "lucide-react";

// Pre-calculated live scenes from the user's uploaded audio
const PREVIEW_DATA = {
  title: "Power Of Persistence",
  mediaSrc: "/whiteboard-preview.mp3",
  mediaType: "audio" as const,
  durationSeconds: 66,
  scenes: [
    {
      id: "wb-scene-0",
      sceneIndex: 0,
      startTime: 0,
      endTime: 6.06,
      duration: 6.06,
      archetype: "keyword_slam" as const,
      headline: "The power of never giving up",
      heroVisual: {
        drawingId: "lightning_bolt",
        label: "Power & Resilience",
      },
      accentColor: "#14B8A6",
    },
    {
      id: "wb-scene-1",
      sceneIndex: 1,
      startTime: 6.92,
      endTime: 13.64,
      duration: 6.72,
      archetype: "hero_center" as const,
      headline: "Imagine a young entrepreneur",
      heroVisual: {
        drawingId: "piggy_bank",
        label: "Seed Dream",
      },
      accentColor: "#FF5722",
    },
    {
      id: "wb-scene-2",
      sceneIndex: 2,
      startTime: 14.66,
      endTime: 19.54,
      duration: 4.88,
      archetype: "hub_spoke" as const,
      headline: "No money, no team, no guarantee",
      heroVisual: {
        drawingId: "money_stack",
        label: "Zero Capital",
      },
      supportingItems: [
        { id: "1", text: "Zero Funding" },
        { id: "2", text: "Solo Builder" },
      ],
      accentColor: "#3B82F6",
    },
    {
      id: "wb-scene-3",
      sceneIndex: 3,
      startTime: 20.37,
      endTime: 25.07,
      duration: 4.7,
      archetype: "step_ladder" as const,
      headline: "Every single day he works hard",
      heroVisual: {
        drawingId: "calendar_sheet",
        label: "Daily Consistency",
      },
      accentColor: "#10B981",
    },
    {
      id: "wb-scene-4",
      sceneIndex: 4,
      startTime: 25.55,
      endTime: 32.3,
      duration: 6.75,
      archetype: "split_comparison" as const,
      headline: "Rejections pile up & doubts creep in",
      heroVisual: {
        drawingId: "alert_triangle",
        label: "Doubts & Obstacles",
      },
      comparisonData: {
        leftTitle: "The Doubters",
        leftItem: "Too risky, stop now",
        rightTitle: "Inner Drive",
        rightItem: "Keep pushing every day",
      },
      accentColor: "#EF4444",
    },
    {
      id: "wb-scene-5",
      sceneIndex: 5,
      startTime: 33.19,
      endTime: 38.31,
      duration: 5.12,
      archetype: "stat_callout" as const,
      headline: "Most people would quit right here",
      heroVisual: {
        drawingId: "vintage_hourglass",
        label: "Time Running Out",
      },
      statData: {
        number: "90%",
        metric: "Give up too early",
        context: "The inflection point where champions persist",
      },
      accentColor: "#FFA000",
    },
    {
      id: "wb-scene-6",
      sceneIndex: 6,
      startTime: 39.02,
      endTime: 44.89,
      duration: 5.87,
      archetype: "hero_center" as const,
      headline: "One small breakthrough changes everything",
      heroVisual: {
        drawingId: "rocket_launch",
        label: "Breakthrough Launch",
      },
      accentColor: "#10B981",
    },
    {
      id: "wb-scene-7",
      sceneIndex: 7,
      startTime: 45.42,
      endTime: 52.34,
      duration: 6.92,
      archetype: "step_ladder" as const,
      headline: "First customer, first revenue, first momentum",
      heroVisual: {
        drawingId: "gold_bars",
        label: "Gold & Revenue",
      },
      accentColor: "#3B82F6",
    },
    {
      id: "wb-scene-8",
      sceneIndex: 8,
      startTime: 53.02,
      endTime: 59.85,
      duration: 6.83,
      archetype: "split_comparison" as const,
      headline: "Difference between failure and victory",
      heroVisual: {
        drawingId: "balancing_scale",
        label: "Balance & Choice",
      },
      comparisonData: {
        leftTitle: "Giving Up",
        leftItem: "Zero chance of winning",
        rightTitle: "Staying in Game",
        rightItem: "Success is inevitable",
      },
      accentColor: "#14B8A6",
    },
    {
      id: "wb-scene-9",
      sceneIndex: 9,
      startTime: 60.5,
      endTime: 65.84,
      duration: 5.34,
      archetype: "keyword_slam" as const,
      headline: "Never give up on your dream",
      heroVisual: {
        drawingId: "trophy_gold",
        label: "Ultimate Victory",
      },
      accentColor: "#FF5722",
    },
  ],
  showHand: true,
};

export default function WhiteboardLivePreviewPage() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [fontPersonality, setFontPersonality] = useState<"marker" | "casual" | "clean" | "architect">("marker");

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: any) => {
      setCurrentFrame(e.detail.frame);
    };
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


  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const jumpToScene = (startTimeSec: number) => {
    if (!playerRef.current) return;
    const targetFrame = Math.round(startTimeSec * 30);
    playerRef.current.seekTo(targetFrame);
    playerRef.current.play();
    setIsPlaying(true);
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
    setIsPlaying(true);
  };

  const currentTimeSec = (currentFrame / 30).toFixed(1);

  return (
    <div className="min-h-screen bg-[#07090E] text-white py-6 px-4 sm:px-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/whiteboard-video"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Studio</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Whiteboard Live Studio Preview</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Instant WYSIWYG
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
            9:16 Vertical (1080×1920)
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">
            {PREVIEW_DATA.durationSeconds}s Total
          </span>
        </div>
      </div>

      {/* Main Grid: Player on Left, Scene Breakdown on Right */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        {/* Left: 9:16 Remotion Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl border-2 border-white/15 bg-white shadow-2xl overflow-hidden ring-1 ring-white/10">
            <Player
              ref={playerRef}
              component={WhiteboardVideo}
              inputProps={{ ...PREVIEW_DATA, fontPersonality } as any}
              durationInFrames={Math.round(PREVIEW_DATA.durationSeconds * 30)}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              style={{ width: "100%", height: "100%" }}
              controls={true}
              autoPlay={false}
              loop={true}
              clickToPlay={true}
              spaceKeyToPlayOrPause={true}
              acknowledgeRemotionLicense
            />
          </div>

          {/* Font Personality Selector Live Pill Dock */}
          <div className="w-full max-w-[340px] mt-3 bg-[#111624] border border-white/10 rounded-2xl p-2.5 space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <span>Writing Font Style:</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-orange-400">
                Live Switch
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "marker" as const, label: "✍️ Kalam Marker", desc: "YouTube bold" },
                { id: "casual" as const, label: "📝 Caveat Casual", desc: "Natural script" },
                { id: "architect" as const, label: "📐 Architect", desc: "Blueprint draft" },
                { id: "clean" as const, label: "📋 Jakarta Sans", desc: "Modern crisp" },
              ].map((f) => {
                const isSelected = fontPersonality === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontPersonality(f.id)}
                    className={`flex flex-col p-2 rounded-xl text-left transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/60 text-white shadow-sm"
                        : "bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xs font-black truncate">{f.label}</span>
                    <span className="text-[10px] text-zinc-400 truncate mt-0.5">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Quick Drawing Stage Jump Bar */}
          <div className="w-full max-w-[340px] mt-2.5 bg-[#0F1422] border border-white/10 rounded-2xl p-2.5 space-y-1.5">
            <span className="text-[11px] font-bold text-zinc-400 block px-1">
              Jump to Drawing Stage:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "1.0s Title", sec: 1.0 },
                { label: "3.0s Sketch", sec: 3.0 },
                { label: "4.0s Color", sec: 4.0 },
                { label: "5.5s Done", sec: 5.5 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.pause();
                      playerRef.current.seekTo(Math.round(btn.sec * 30));
                      setCurrentFrame(Math.round(btn.sec * 30));
                    }
                  }}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:border-orange-500/40 border border-white/5 text-[10px] font-bold text-zinc-300 hover:text-white transition cursor-pointer active:scale-95 text-center truncate"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>


          {/* Player Controls Bar */}
          <div className="w-full max-w-[340px] mt-4 flex items-center justify-between gap-3 bg-[#111624] border border-white/10 rounded-2xl p-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-black" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Restart</span>
            </button>
            <span className="font-mono text-xs text-zinc-400">
              {currentTimeSec}s / {PREVIEW_DATA.durationSeconds}s
            </span>
          </div>
        </div>

        {/* Right: Scene Breakdown & Explanation Hub (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0E1422] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Layers3 size={18} className="text-[#FFA000]" />
                <span>10 Auto-Planned Storyboard Scenes</span>
              </h2>
              <span className="text-xs text-zinc-400">Click any scene to jump to it live</span>
            </div>
            <p className="text-xs text-zinc-400">
              Watch each scene and tell me what needs fixing (timing, hand speed, font size, icon choice, or layout)!
            </p>
          </div>

          {/* Scene List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {PREVIEW_DATA.scenes.map((scene, idx) => (
              <div
                key={scene.id}
                onClick={() => jumpToScene(scene.startTime)}
                className="group rounded-2xl border border-white/10 bg-[#111624] hover:bg-[#161D2F] hover:border-[#FF5722]/50 p-4 transition cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-black text-zinc-300 group-hover:text-[#FFA000] group-hover:border-[#FF5722]/40 transition">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white truncate group-hover:text-[#FFA000] transition">
                        "{scene.headline}"
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                      <span className="font-mono text-[#FFA000] font-bold">
                        {scene.startTime.toFixed(1)}s – {scene.endTime.toFixed(1)}s
                      </span>
                      <span>•</span>
                      <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                        Layout: {scene.archetype.replace("_", " ")}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-500">Icon: {scene.heroVisual.drawingId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-[#FF5722] text-zinc-400 group-hover:text-black text-xs font-bold transition flex items-center gap-1">
                    <Play size={11} className="fill-current" />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
