import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BPMVisualizerProps {
  currentBpm?: number;
  barsCount?: number;
  accentColor?: string;
  className?: string;
}

export const BPMVisualizer: React.FC<BPMVisualizerProps> = ({
  currentBpm = 162,
  barsCount = 16,
  accentColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 12, 16, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px ${accentColor}25`,
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            CARDIO INTENSITY SPECTRUM
          </span>
          <span className="font-black text-rose-400">{currentBpm} BPM</span>
        </div>

        {/* Dynamic Equalizer Bars */}
        <div className="flex items-end justify-between h-14 mt-3 gap-1">
          {Array.from({ length: barsCount }).map((_, i) => {
            const height = Math.abs(Math.sin(frame * 0.2 + i * 0.6)) * 40 + 8;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-100"
                style={{
                  height: `${height}px`,
                  backgroundColor: accentColor,
                  opacity: 0.4 + (i / barsCount) * 0.6,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
