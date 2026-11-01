"use client";

import React, { useRef, useState, useEffect } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WhiteboardVideo } from "@/remotion/templates/WHITEBOARD_VIDEO/template";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clapperboard,
  Type,
  ArrowRight,
} from "lucide-react";

interface WhiteboardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl?: string;
  plan: any;
  durationSeconds: number;
  title?: string;
  fontPersonality?: string;
  onFontPersonalityChange: (font: string) => void;
  onConfirmRender: () => void;
  isSubmitting?: boolean;
}

export default function WhiteboardPreviewModal({
  isOpen,
  onClose,
  audioUrl = "/whiteboard-preview.mp3",
  plan,
  durationSeconds = 30,
  title = "Whiteboard Animation",
  fontPersonality = "balsamiq",
  onFontPersonalityChange,
  onConfirmRender,
  isSubmitting = false,
}: WhiteboardPreviewModalProps) {
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

  if (!isOpen || !plan) return null;

  const scenes = Array.isArray(plan.scenes) && plan.scenes.length > 0
    ? plan.scenes
    : (plan.points || []).map((pt: any, i: number) => ({
        id: `wb-scene-${i}`,
        sceneIndex: i,
        startTime: pt.startTime ?? (i * 6),
        endTime: pt.endTime ?? ((i + 1) * 6),
        duration: (pt.endTime ?? ((i + 1) * 6)) - (pt.startTime ?? (i * 6)),
        archetype: "hero_center" as const,
        headline: pt.title || pt.text?.slice(0, 35) || `Point ${i + 1}`,
        heroVisual: {
          drawingId: pt.drawingId || pt.icon || "lightbulb_idea",
          label: pt.text?.slice(0, 24) || "Key Takeaway",
        },
        accentColor: pt.markerColor || "#FF5722",
      }));

  const totalDuration = Math.max(10, Math.round(durationSeconds || plan.durationSeconds || (scenes[scenes.length - 1]?.endTime || 30)));

  const compositionProps = {
    title: title || plan.title || "Whiteboard Explainer",
    mediaSrc: audioUrl,
    mediaType: "audio" as const,
    durationSeconds: totalDuration,
    scenes,
    fontPersonality,
    showHand: true,
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-[28px] bg-[#0A0D16] border border-white/15 text-white shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E1422]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] flex items-center justify-center text-black shadow-md shadow-orange-500/20">
              <Sparkles size={18} className="fill-black/30" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Interactive Live Preview</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Pre-Render Check
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Watch the live drawing, test handwriting fonts & verify your script before exporting.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Left Player & Controls, Right Scene Breakdown */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left: 9:16 Player & Live Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl border-2 border-white/20 bg-white shadow-2xl overflow-hidden">
              <Player
                ref={playerRef}
                component={WhiteboardVideo}
                inputProps={compositionProps as any}
                durationInFrames={totalDuration * 30}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                style={{ width: "100%", height: "100%" }}
                controls={true}
                autoPlay={true}
                loop={true}
                clickToPlay={true}
                spaceKeyToPlayOrPause={true}
                acknowledgeRemotionLicense
              />
            </div>

            {/* Quick Player Bar */}
            <div className="w-full max-w-[280px] mt-2.5 flex items-center justify-between gap-2 bg-[#121828] border border-white/10 rounded-xl p-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="fill-black" />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Restart</span>
              </button>
              <span className="font-mono text-xs text-zinc-400">
                {currentTimeSec}s / {totalDuration}s
              </span>
            </div>

            {/* Live Font Personality Switcher */}
            <div className="w-full max-w-[280px] mt-3 bg-[#101524] border border-white/10 rounded-2xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between px-1 text-[11px]">
                <span className="font-bold text-zinc-300 flex items-center gap-1">
                  <Type size={12} className="text-[#FFA000]" />
                  <span>Writing Font Style:</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/5 text-orange-400">
                  Switch Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "balsamiq", label: "✍️ Balsamiq Sans", sub: "Clean hand-drawn" },
                  { id: "permanent-marker", label: "🖊️ Permanent Marker", sub: "Bold marker" },
                  { id: "caveat", label: "📝 Caveat Casual", sub: "Natural script" },
                  { id: "comic-neue", label: "💬 Comic Neue", sub: "Friendly clean" },
                  { id: "handlee", label: "🖋️ Handlee", sub: "Rounded writing" },
                  { id: "architect", label: "📐 Architect", sub: "Blueprint draft" },
                ].map((f) => {
                  const isSelected = fontPersonality === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onFontPersonalityChange(f.id)}
                      className={`flex flex-col p-1.5 rounded-xl text-left transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/60 text-white shadow-sm"
                          : "bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[11px] font-black truncate">{f.label}</span>
                      <span className="text-[9px] text-zinc-400 truncate">{f.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Scene Breakdown & Confirmation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers3 size={16} className="text-[#FFA000]" />
                    <span>Storyboard Scenes ({scenes.length} Scenes)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Click any scene to preview the live marker drawing.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                  {totalDuration}s Total
                </span>
              </div>

              {/* Scene List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {scenes.map((sc: any, idx: number) => (
                  <div
                    key={sc.id || idx}
                    onClick={() => jumpToScene(sc.startTime)}
                    className="group rounded-xl border border-white/10 bg-[#121828] hover:bg-[#182034] hover:border-orange-500/50 p-3 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-xs font-black text-zinc-300 group-hover:text-[#FFA000] group-hover:border-orange-500/40 transition">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition">
                          "{sc.headline}"
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                          <span className="font-mono text-[#FFA000]">
                            {Number(sc.startTime).toFixed(1)}s – {Number(sc.endTime).toFixed(1)}s
                          </span>
                          <span>•</span>
                          <span className="capitalize">{sc.archetype?.replace("_", " ") || "Explainer"}</span>
                          <span>•</span>
                          <span className="text-zinc-500">Icon: {sc.heroVisual?.drawingId || "Idea"}</span>
                        </div>
                      </div>
                    </div>

                    <button className="px-2.5 py-1 rounded-md bg-white/5 group-hover:bg-[#FF5722] text-zinc-400 group-hover:text-black text-[11px] font-bold transition flex items-center gap-1 shrink-0">
                      <Play size={10} className="fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-zinc-400">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Zero credit is charged for previews. Once you verify the drawing pacing and chosen font, proceed to render the final 1080p Full HD video.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  ← Edit Script / Text
                </button>

                <button
                  type="button"
                  onClick={onConfirmRender}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black font-black text-xs sm:text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clapperboard size={15} />
                  <span>Looks Great — Render 1080p Video (1 Credit)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
