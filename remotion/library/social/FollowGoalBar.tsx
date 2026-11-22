import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FollowGoalBarProps {
  goalTitle?: string;
  currentCount?: number;
  targetCount?: number;
  accentGradient?: [string, string];
  className?: string;
}

export const FollowGoalBar: React.FC<FollowGoalBarProps> = ({
  goalTitle = 'Next Milestone: 100K Subscribers',
  currentCount = 84520,
  targetCount = 100000,
  accentGradient = ['#ec4899', '#8b5cf6'],
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const barFill = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 80 } });

  const rawPercent = Math.min(100, Math.max(0, (currentCount / targetCount) * 100));
  const animatedPercent = rawPercent * barFill;

  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: 'rgba(15, 15, 18, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(236, 72, 153, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            {goalTitle}
          </span>
          <span className="text-pink-400 font-mono font-bold">{animatedPercent.toFixed(1)}%</span>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-3.5 rounded-full bg-zinc-800/80 p-0.5 overflow-hidden border border-white/5 relative">
          <div
            className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
            style={{
              width: `${animatedPercent}%`,
              background: `linear-gradient(90deg, ${accentGradient[0]}, ${accentGradient[1]})`,
              boxShadow: `0 0 15px ${accentGradient[0]}80`,
            }}
          >
            {/* Shimmer light sweep on progress bar */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                transform: `translateX(${interpolate((frame * 4) % 150, [0, 150], [-100, 200])}%)`,
              }}
            />
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 font-mono">
          <span>{formatNumber(Math.round(currentCount * barFill))}</span>
          <span className="text-zinc-500">Goal: {formatNumber(targetCount)}</span>
        </div>
      </div>
    </div>
  );
};
