"use client";

import { Play, Sparkles } from "lucide-react";
import type { PreviewScene } from "./types";

type Props = {
  scenes: PreviewScene[];
  currentTime: number;
  durationSeconds: number;
  onSelectScene: (timeSeconds: number) => void;
  onEditSceneScript?: (index: number, newText: string) => void;
};

export function SceneStoryboardBar({
  scenes,
  currentTime,
  durationSeconds,
  onSelectScene,
}: Props) {
  if (!scenes || scenes.length === 0) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="bg-zinc-950/90 rounded-2xl border border-zinc-800/80 p-3 space-y-2 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 tracking-wider uppercase">
          <Sparkles size={14} className="text-emerald-400" />
          <span>Text + Scene + Script Storyboard</span>
        </div>
        <div className="text-[11px] text-zinc-500 font-medium">
          {scenes.length} Scenes · {durationSeconds.toFixed(0)}s Total
        </div>
      </div>

      {/* Horizontal Storyboard Cards Track */}
      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
        {scenes.map((scene, idx) => {
          const startSec = scene.start ?? 0;
          const endSec = scene.end ?? 0;
          const isActive = currentTime >= startSec && currentTime < endSec;
          return (
            <button
              key={idx}
              onClick={() => onSelectScene(startSec)}
              className={`flex-shrink-0 w-44 rounded-xl border text-left p-2.5 transition-all flex flex-col justify-between group ${
                isActive
                  ? "bg-zinc-900 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90"
              }`}
            >
              {/* Scene Video Preview Box */}
              <div className="relative w-full h-20 rounded-lg bg-zinc-950 overflow-hidden border border-zinc-800/80 mb-2 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
                <div className="z-10 text-[10px] font-bold text-zinc-400 flex items-center gap-1 bg-zinc-900/80 px-2 py-0.5 rounded-full border border-zinc-700/60">
                  <Play size={8} className="fill-emerald-400 text-emerald-400" />
                  <span>Scene {idx + 1}</span>
                </div>
                <div className="absolute bottom-1 right-1.5 text-[9px] font-mono text-zinc-400 bg-black/70 px-1.5 py-0.5 rounded">
                  {formatTime(startSec)} - {formatTime(endSec)}
                </div>
              </div>

              {/* Script text snippet */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide truncate">
                  {scene.type || "Text Scene"}
                </div>
                <p className="text-[11px] text-zinc-300 font-medium line-clamp-2 leading-snug">
                  {scene.text || `Scene ${idx + 1} content script`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
