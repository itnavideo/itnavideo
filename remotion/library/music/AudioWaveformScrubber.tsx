import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AudioWaveformScrubberProps {
  playedPercent?: number;
  timeRemaining?: string;
  className?: string;
}

export const AudioWaveformScrubber: React.FC<AudioWaveformScrubberProps> = ({
  playedPercent = 64,
  timeRemaining = '-01:18',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`w-full p-4 flex items-center justify-center font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(244, 63, 94, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
            SOUNDCLOUD AUDIO WAVEFORM
          </span>
          <span className="text-zinc-400 text-[11px]">{timeRemaining}</span>
        </div>

        {/* 40 Waveform Amplitude Bars */}
        <div className="flex items-center justify-between h-14 my-3 gap-0.5">
          {Array.from({ length: 42 }).map((_, i) => {
            const height = Math.abs(Math.sin(i * 0.35 + 2)) * 40 + 8;
            const isPlayed = (i / 42) * 100 <= playedPercent;

            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all"
                style={{
                  height: `${height}px`,
                  backgroundColor: isPlayed ? '#f43f5e' : '#3f3f46',
                  boxShadow: isPlayed ? '0 0 5px rgba(244,63,94,0.5)' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
