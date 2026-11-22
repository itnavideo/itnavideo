import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RepetitionCounterProps {
  currentRep?: number;
  targetReps?: number;
  currentSet?: number;
  totalSets?: number;
  exerciseName?: string;
  weightKg?: number;
  className?: string;
}

export const RepetitionCounter: React.FC<RepetitionCounterProps> = ({
  currentRep = 8,
  targetReps = 12,
  currentSet = 3,
  totalSets = 4,
  exerciseName = 'BARBELL BENCH PRESS',
  weightKg = 100,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const repPop = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 220 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 18, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            {exerciseName}
          </span>
          <span className="text-white font-bold">{weightKg} KG</span>
        </div>

        {/* Reps and Set Grid */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">SET</span>
            <span className="text-xl font-black text-white">
              {currentSet} <span className="text-xs text-zinc-500">/ {totalSets}</span>
            </span>
          </div>

          {/* Big Animated Rep Number */}
          <div
            className="flex items-baseline gap-1 bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-500/30"
            style={{ transform: `scale(${interpolate(repPop, [0, 0.5, 1], [0.9, 1.15, 1])})` }}
          >
            <span className="text-3xl font-black text-emerald-400">{currentRep}</span>
            <span className="text-xs font-bold text-zinc-400">/ {targetReps} REPS</span>
          </div>
        </div>

        {/* Rep Progress Visual Ticks */}
        <div className="grid grid-cols-12 gap-1 mt-3">
          {Array.from({ length: targetReps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${
                i < currentRep ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
