import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LevelProgressionBadgeProps {
  currentLevel?: number;
  currentXp?: number;
  requiredXp?: number;
  rankTitle?: string;
  className?: string;
}

export const LevelProgressionBadge: React.FC<LevelProgressionBadgeProps> = ({
  currentLevel = 42,
  currentXp = 8750,
  requiredXp = 10000,
  rankTitle = 'MASTER GUARDIAN',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const xpFill = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 90 } });

  const progressPercent = Math.min(100, (currentXp / requiredXp) * 100) * xpFill;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 16, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2)',
        }}
      >
        {/* Hexagonal / Diamond Level Badge */}
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg flex-shrink-0">
          <div className="w-full h-full rounded-[10px] bg-zinc-950 flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">LVL</span>
            <span className="text-lg font-black text-white leading-none">{currentLevel}</span>
          </div>
        </div>

        {/* Level & Rank Details */}
        <div className="flex flex-col min-w-44">
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
            <span className="text-amber-400 uppercase tracking-wider">{rankTitle}</span>
            <span className="text-zinc-400 text-[11px]">{progressPercent.toFixed(0)}%</span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-white/10 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                boxShadow: '0 0 10px rgba(234, 179, 8, 0.6)',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
            <span>{Math.round(currentXp * xpFill).toLocaleString()} XP</span>
            <span>{requiredXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
