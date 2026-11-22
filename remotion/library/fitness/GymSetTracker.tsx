import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SetRecord {
  setNumber: number;
  weightKg: number;
  reps: number;
  isPr?: boolean;
}

export interface GymSetTrackerProps {
  exerciseName?: string;
  sets?: SetRecord[];
  className?: string;
}

export const GymSetTracker: React.FC<GymSetTrackerProps> = ({
  exerciseName = 'CONVENTIONAL DEADLIFT',
  sets = [
    { setNumber: 1, weightKg: 140, reps: 8 },
    { setNumber: 2, weightKg: 160, reps: 5 },
    { setNumber: 3, weightKg: 180, reps: 3, isPr: true },
  ],
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
        className="w-full max-w-sm rounded-2xl p-4 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(16, 14, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-black tracking-wider text-[11px] uppercase">
            🏋️ {exerciseName}
          </span>
          <span className="text-zinc-500 text-[10px]">3 WORKING SETS</span>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          {sets.map((s, idx) => (
            <div
              key={s.setNumber}
              className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                s.isPr
                  ? 'bg-amber-500/15 border-amber-500/40'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <span className="font-bold text-zinc-400">SET {s.setNumber}</span>
              <span className="text-white font-extrabold">{s.weightKg} KG × {s.reps} REPS</span>
              {s.isPr ? (
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-black text-[9px]">
                  NEW PR! 🏆
                </span>
              ) : (
                <span className="text-emerald-400 text-[10px]">✓ DONE</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
