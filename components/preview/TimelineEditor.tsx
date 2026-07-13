"use client";

import { useRef } from "react";
import type { PreviewCaption, PreviewScene } from "./types";

type Props = {
  durationSeconds: number;
  currentTime: number;
  captions: PreviewCaption[];
  scenes?: PreviewScene[];
  onSeek: (time: number) => void;
};

const SCENE_COLORS: Record<string, string> = {
  creator_face: "#10b981",
  typography: "#8b5cf6",
  key_point: "#f59e0b",
  broll: "#10b981",
  quote: "#ec4899",
  transition: "#6b7280",
};

export function TimelineEditor({
  durationSeconds,
  currentTime,
  captions,
  scenes,
  onSeek,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * durationSeconds);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 1));
    if (e.key === "ArrowRight") onSeek(Math.min(durationSeconds, currentTime + 1));
  };

  const pct = (t: number) => `${(t / durationSeconds) * 100}%`;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 space-y-2">
      {/* Scene track */}
      {scenes && scenes.length > 0 && (
        <div>
          <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wide">Scenes</div>
          <div className="relative h-4 rounded overflow-hidden bg-zinc-800">
            {scenes.map((scene, i) => (
              <button
                key={i}
                onClick={() => onSeek(scene.start)}
                title={`${scene.type}: ${formatTime(scene.start)} – ${formatTime(scene.end)}`}
                className="absolute top-0 h-full opacity-80 hover:opacity-100 transition-opacity border-r border-zinc-900"
                style={{
                  left: pct(scene.start),
                  width: `calc(${pct(scene.end)} - ${pct(scene.start)})`,
                  background: SCENE_COLORS[scene.type] || "#6b7280",
                }}
              />
            ))}
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
              style={{ left: pct(currentTime) }}
            />
          </div>
        </div>
      )}

      {/* Caption track */}
      <div>
        <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wide">Captions</div>
        <div className="relative h-3 rounded overflow-hidden bg-zinc-800">
          {captions.map((cap, i) => (
            <button
              key={i}
              onClick={() => onSeek(cap.start)}
              title={cap.text}
              className="absolute top-0 h-full opacity-70 hover:opacity-100 transition-opacity border-r border-zinc-900"
              style={{
                left: pct(cap.start),
                width: `calc(${pct(cap.end)} - ${pct(cap.start)})`,
                background: "#facc15",
              }}
            />
          ))}
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
            style={{ left: pct(currentTime) }}
          />
        </div>
      </div>

      {/* Main scrubber */}
      <div
        ref={barRef}
        role="slider"
        aria-label="Video timeline"
        aria-valuemin={0}
        aria-valuemax={durationSeconds}
        aria-valuenow={currentTime}
        tabIndex={0}
        className="relative h-2 rounded-full bg-zinc-700 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-emerald-500"
          style={{ width: pct(currentTime) }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-emerald-500 z-10 pointer-events-none"
          style={{ left: pct(currentTime) }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-[10px] text-zinc-500 tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(durationSeconds)}</span>
      </div>
    </div>
  );
}
