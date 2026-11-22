import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterIntakeTrackerProps {
  currentMl?: number;
  targetMl?: number;
  glassesCount?: number;
  className?: string;
}

export const WaterIntakeTracker: React.FC<WaterIntakeTrackerProps> = ({
  currentMl = 2250,
  targetMl = 3000,
  glassesCount = 9,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const waterFill = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });

  const fillPercent = Math.min(100, (currentMl / targetMl) * 100) * waterFill;
  // Water wave animation
  const waveY = Math.sin(frame * 0.15) * 4;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-sky-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 16, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(14, 165, 233, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="text-sky-400">💧</span>
            <span className="text-white font-bold uppercase tracking-wider text-[11px]">HYDRATION GOAL</span>
          </div>
          <span className="text-sky-400 font-bold">{fillPercent.toFixed(0)}%</span>
        </div>

        <div className="flex items-center gap-4 mt-3">
          {/* Glass Cylinder Graphic */}
          <div className="w-12 h-20 rounded-xl border-2 border-sky-400/40 bg-zinc-950 p-1 relative overflow-hidden flex flex-col justify-end">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-sky-600 to-cyan-400 transition-all duration-300 relative"
              style={{
                height: `${fillPercent}%`,
                boxShadow: '0 0 10px rgba(14,165,233,0.6)',
              }}
            >
              <div
                className="absolute -top-1 inset-x-0 h-2 bg-cyan-200/50 rounded-full"
                style={{ transform: `translateY(${waveY}px)` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tight">{Math.round(currentMl * waterFill)}</span>
              <span className="text-zinc-500 text-xs font-bold">/ {targetMl} ML</span>
            </div>
            <span className="text-zinc-400 text-xs mt-1">
              🥛 {glassesCount} Glasses Logged Today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
