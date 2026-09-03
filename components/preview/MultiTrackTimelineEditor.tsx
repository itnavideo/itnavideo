"use client";

import { useRef } from "react";
import { Type, Music, Zap, Image, Video, Volume2, Sparkles } from "lucide-react";
import type { PreviewCaption, PreviewScene, PreviewSticker } from "./types";

type Props = {
  durationSeconds: number;
  currentTime: number;
  captions: PreviewCaption[];
  scenes?: PreviewScene[];
  stickers?: PreviewSticker[];
  onSeek: (time: number) => void;
  onSelectCaption?: (index: number) => void;
  onSelectImageBlock?: (index: number) => void;
};

export function MultiTrackTimelineEditor({
  durationSeconds,
  currentTime,
  captions,
  scenes,
  stickers,
  onSeek,
  onSelectCaption,
  onSelectImageBlock,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * durationSeconds);
  };

  const pct = (t: number) => `${(t / Math.max(1, durationSeconds)) * 100}%`;

  const formatTimecode = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${ms}`;
  };

  // Generate timecode markers across ruler
  const numMarkers = 6;
  const timeMarkers = Array.from({ length: numMarkers }, (_, i) => (durationSeconds / (numMarkers - 1)) * i);

  return (
    <div className="bg-zinc-950/95 rounded-2xl border border-zinc-800/80 p-4 space-y-3 shadow-2xl backdrop-blur-md text-xs select-none">
      {/* Timeline Header & Timecodes */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2 font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Multi-Track Timeline Editor</span>
        </div>
        <div className="font-mono text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
          {formatTimecode(currentTime)} / {formatTimecode(durationSeconds)}
        </div>
      </div>

      {/* RULER & TIME MARKERS */}
      <div className="relative pl-24 pr-2 pt-1 pb-1">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-1">
          {timeMarkers.map((time, idx) => (
            <span key={idx} className="relative">
              {formatTimecode(time)}
            </span>
          ))}
        </div>
      </div>

      {/* TRACKS CONTAINER */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative space-y-2 cursor-pointer pt-1"
      >
        {/* PLAYHEAD LINE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-30 pointer-events-none shadow-[0_0_12px_#10b981]"
          style={{ left: `calc(6rem + ${(currentTime / Math.max(1, durationSeconds)) * (100 - 0)}% - 6rem * ${currentTime / Math.max(1, durationSeconds)})` }}
        >
          <div className="w-3 h-3 bg-emerald-400 rotate-45 -translate-x-1.25 -translate-y-1 rounded-xs shadow-md" />
        </div>

        {/* 1. TEXT TRACK */}
        <div className="flex items-center gap-2 h-7">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-purple-300 text-[11px]">
            <Type size={13} className="text-purple-400" />
            <span>Text</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            {captions.map((cap, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(cap.start);
                  if (onSelectCaption) onSelectCaption(i);
                }}
                title={`Text: ${cap.heroText || cap.text}`}
                className="absolute top-0.5 bottom-0.5 rounded px-2 flex items-center justify-between text-[10px] font-bold text-purple-100 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/50 shadow-sm truncate transition-colors cursor-pointer"
                style={{
                  left: pct(cap.start),
                  width: `calc(${pct(cap.end)} - ${pct(cap.start)})`,
                }}
              >
                <span className="truncate">{cap.heroText || cap.leadText || cap.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. MUSIC TRACK */}
        <div className="flex items-center gap-2 h-6">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-emerald-300 text-[11px]">
            <Music size={13} className="text-emerald-400" />
            <span>Music</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            <div
              className="absolute inset-y-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center px-2 text-[10px] font-medium text-emerald-300 overflow-hidden"
              style={{ left: "0%", width: "100%" }}
            >
              <div className="w-full h-1.5 rounded-full bg-emerald-500/30 overflow-hidden flex items-center">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500/60 via-emerald-400 to-emerald-600/60 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SFX TRACK */}
        <div className="flex items-center gap-2 h-6">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-amber-300 text-[11px]">
            <Zap size={13} className="text-amber-400" />
            <span>SFX</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            {captions.slice(0, 5).map((cap, i) => (
              <div
                key={i}
                className="absolute top-1 bottom-1 w-3 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_#f59e0b]"
                style={{ left: pct(cap.start) }}
                title="SFX Whoosh Accent"
              />
            ))}
          </div>
        </div>

        {/* 4. IMAGES TRACK */}
        <div className="flex items-center gap-2 h-7">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-blue-300 text-[11px]">
            <Image size={13} className="text-blue-400" />
            <span>Images</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            {captions.map((cap, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(cap.start);
                  if (onSelectImageBlock) onSelectImageBlock(i);
                }}
                className="absolute top-0.5 bottom-0.5 rounded px-2 flex items-center justify-between text-[10px] font-bold text-blue-100 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-blue-400/50 shadow-sm truncate transition-colors cursor-pointer"
                style={{
                  left: pct(cap.start),
                  width: `calc(${pct(cap.end)} - ${pct(cap.start)})`,
                }}
                title="Click to swap scene image overlay"
              >
                <span className="truncate">📷 {cap.customImage ? "Custom Image" : "AI Image"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. VIDEO CLIPS TRACK */}
        <div className="flex items-center gap-2 h-7">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-zinc-300 text-[11px]">
            <Video size={13} className="text-zinc-400" />
            <span>Video clips</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            {scenes && scenes.length > 0 ? (
              scenes.map((sc, i) => (
                <div
                  key={i}
                  className="absolute top-0.5 bottom-0.5 rounded px-2 flex items-center text-[10px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 truncate"
                  style={{
                    left: pct(sc.start ?? 0),
                    width: `calc(${pct(sc.end ?? 0)} - ${pct(sc.start ?? 0)})`,
                  }}
                >
                  <span className="truncate">{sc.type}</span>
                </div>
              ))
            ) : (
              <div
                className="absolute inset-y-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center px-2 text-[10px] text-zinc-400"
                style={{ left: "0%", width: "100%" }}
              >
                <span>Full Source Video</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. AUDIO WAVEFORM TRACK */}
        <div className="flex items-center gap-2 h-6">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-rose-300 text-[11px]">
            <Volume2 size={13} className="text-rose-400" />
            <span>Audio</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80 flex items-center px-1">
            <div className="w-full flex items-center gap-0.5 h-3 opacity-80">
              {Array.from({ length: 60 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-rose-500/60 rounded-full"
                  style={{ height: `${20 + Math.abs(Math.sin(idx * 0.4)) * 80}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 7. ANIMATIONS / STICKERS TRACK */}
        <div className="flex items-center gap-2 h-6">
          <div className="w-22 flex-shrink-0 flex items-center gap-1.5 font-semibold text-yellow-300 text-[11px]">
            <Sparkles size={13} className="text-yellow-400" />
            <span>Animations</span>
          </div>
          <div className="relative flex-1 h-full bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/80">
            {stickers && stickers.length > 0 ? (
              stickers.map((st, i) => (
                <div
                  key={i}
                  className="absolute top-0.5 bottom-0.5 rounded px-2 flex items-center text-[10px] font-bold text-yellow-950 bg-yellow-400 border border-yellow-300 shadow-sm truncate"
                  style={{
                    left: pct(st.start),
                    width: `calc(${pct(st.end)} - ${pct(st.start)})`,
                  }}
                >
                  <span className="truncate">✨ {st.pose}</span>
                </div>
              ))
            ) : (
              <div
                className="absolute inset-y-0.5 rounded bg-yellow-950/30 border border-yellow-600/30 flex items-center px-2 text-[10px] text-yellow-300/70"
                style={{ left: "0%", width: "100%" }}
              >
                <span>3D Kinetic Overlays Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
