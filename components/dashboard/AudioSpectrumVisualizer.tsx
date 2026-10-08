"use client";

import React from "react";

interface AudioSpectrumVisualizerProps {
  isPlaying?: boolean;
  isTranscribing?: boolean;
  barCount?: number;
}

export function AudioSpectrumVisualizer({
  isPlaying = false,
  isTranscribing = false,
  barCount = 18,
}: AudioSpectrumVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center gap-1 h-6 px-3 py-1 rounded-full bg-[#151E30] border border-white/10 select-none">
      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9100] mr-1">
        {isTranscribing ? "Neural Audio" : isPlaying ? "Live Wave" : "Audio Active"}
      </span>
      <div className="flex items-end gap-0.5 h-4">
        {bars.map((i) => {
          // Dynamic height variation based on active state
          const delay = (i % 6) * 0.12;
          const heightClass = isPlaying || isTranscribing
            ? i % 4 === 0
              ? "h-4"
              : i % 3 === 0
              ? "h-3"
              : i % 2 === 0
              ? "h-3.5"
              : "h-2"
            : "h-1.5";

          return (
            <span
              key={i}
              style={{
                animationDuration: isTranscribing ? "0.6s" : "0.9s",
                animationDelay: `${delay}s`,
              }}
              className={`w-0.5 rounded-full bg-gradient-to-t from-[#FF6D00] to-[#FFA726] transition-all duration-200 ${
                isPlaying || isTranscribing ? `animate-pulse ${heightClass}` : "h-1.5 opacity-40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
