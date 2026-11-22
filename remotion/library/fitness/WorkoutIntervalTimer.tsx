import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WorkoutIntervalTimerProps {
  phase?: 'WORK' | 'REST' | 'WARMUP';
  secondsRemaining?: number;
  totalIntervals?: number;
  currentInterval?: number;
  className?: string;
}

export const WorkoutIntervalTimer: React.FC<WorkoutIntervalTimerProps> = ({
  phase = 'WORK',
  secondsRemaining = 24,
  totalIntervals = 8,
  currentInterval = 5,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isWork = phase === 'WORK';
  const ringProgress = ((frame * 2) % 100) / 100;

  const phaseColor = isWork ? '#f43f5e' : '#34d399';

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-64 h-64 rounded-full border border-white/10 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle, rgba(18, 14, 18, 0.95) 0%, rgba(8, 8, 10, 0.98) 100%)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.9), 0 0 35px ${phaseColor}25`,
        }}
      >
        {/* SVG Circular Countdown Ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke={phaseColor}
            strokeWidth="8"
            strokeDasharray="515"
            strokeDashoffset={515 * ringProgress}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
          />
        </svg>

        {/* Phase Pill */}
        <span
          className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10"
          style={{ backgroundColor: `${phaseColor}25`, color: phaseColor }}
        >
          {phase} INTERVAL
        </span>

        {/* Big Countdown Seconds */}
        <span className="text-5xl font-black text-white tracking-tight my-1 z-10">
          {secondsRemaining}s
        </span>

        {/* Interval Round */}
        <span className="text-zinc-400 text-xs font-bold z-10">
          ROUND {currentInterval} / {totalIntervals}
        </span>
      </div>
    </div>
  );
};
