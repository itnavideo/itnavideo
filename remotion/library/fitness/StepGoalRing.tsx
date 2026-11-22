import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StepGoalRingProps {
  currentSteps?: number;
  targetSteps?: number;
  distanceKm?: number;
  caloriesKcal?: number;
  className?: string;
}

export const StepGoalRing: React.FC<StepGoalRingProps> = ({
  currentSteps = 10480,
  targetSteps = 12000,
  distanceKm = 7.8,
  caloriesKcal = 420,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const ringFill = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });

  const stepPercent = Math.min(100, (currentSteps / targetSteps) * 100) * ringFill;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-rose-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 12, 16, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(244, 63, 94, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px]">DAILY STEP GOAL</span>
          <span className="text-white font-bold">{stepPercent.toFixed(0)}% COMPLETE</span>
        </div>

        <div className="flex items-center gap-4 mt-3">
          {/* Circular Step Ring */}
          <div className="w-20 h-20 relative flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset={251 - (251 * stepPercent) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />
            </svg>
            <span className="absolute text-xs font-black text-white">🚶‍♂️</span>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                {Math.round(currentSteps * ringFill).toLocaleString()}
              </span>
              <span className="text-zinc-500 text-xs">/ {targetSteps.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span>📍 {distanceKm} km</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">🔥 {caloriesKcal} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
