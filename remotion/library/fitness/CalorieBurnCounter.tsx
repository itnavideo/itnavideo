import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CalorieBurnCounterProps {
  caloriesBurned?: number;
  durationMinutes?: number;
  burnRate?: number;
  activityName?: string;
  className?: string;
}

export const CalorieBurnCounter: React.FC<CalorieBurnCounterProps> = ({
  caloriesBurned = 485,
  durationMinutes = 34,
  burnRate = 14.2,
  activityName = 'HIIT INTERVAL TRAINING',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const countFill = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });

  const animatedCalories = Math.round(caloriesBurned * countFill);

  // Flame bounce
  const flameScale = 1 + Math.sin(frame * 0.2) * 0.08;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 14, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2)',
        }}
      >
        {/* Animated Flame Icon */}
        <div
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0"
          style={{ transform: `scale(${flameScale})` }}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
          </svg>
        </div>

        {/* Calories Ticker */}
        <div className="flex flex-col">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            {activityName}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-black text-white tracking-tight">{animatedCalories}</span>
            <span className="text-zinc-400 text-xs font-bold">KCAL</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
            <span>⏱ {durationMinutes} min</span>
            <span>•</span>
            <span className="text-amber-400">{burnRate} kcal/min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
