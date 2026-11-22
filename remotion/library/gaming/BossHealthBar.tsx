import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BossHealthBarProps {
  bossName?: string;
  subtitle?: string;
  healthPercent?: number;
  phase?: number;
  className?: string;
}

export const BossHealthBar: React.FC<BossHealthBarProps> = ({
  bossName = 'MALIKETH, THE BLACK BLADE',
  subtitle = 'Harbinger of Destined Death • Phase II',
  healthPercent = 64,
  phase = 2,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const hpFill = spring({ frame: frame - 20, fps, config: { damping: 16, stiffness: 80 } });

  const animatedHp = Math.min(100, Math.max(0, healthPercent)) * hpFill;

  return (
    <div
      className={`w-full flex flex-col items-center justify-center px-6 py-4 ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [-30, 0])}px)`,
        opacity: enter,
      }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Boss Title */}
        <h2 className="text-lg md:text-xl font-serif font-black tracking-widest text-amber-100 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {bossName}
        </h2>
        <span className="text-[10px] md:text-xs font-serif text-amber-400/80 tracking-widest uppercase mb-2">
          {subtitle}
        </span>

        {/* Ornate Health Bar Container */}
        <div className="w-full h-4 rounded-sm bg-zinc-950 border border-amber-600/40 p-0.5 relative shadow-2xl flex items-center">
          {/* Filigree corner decorations */}
          <div className="absolute -left-1 -top-1 w-2.5 h-2.5 border-t border-l border-amber-400" />
          <div className="absolute -right-1 -top-1 w-2.5 h-2.5 border-t border-r border-amber-400" />
          <div className="absolute -left-1 -bottom-1 w-2.5 h-2.5 border-b border-l border-amber-400" />
          <div className="absolute -right-1 -bottom-1 w-2.5 h-2.5 border-b border-r border-amber-400" />

          {/* Menacing Red Blood / Fire Fill */}
          <div
            className="h-full rounded-sm transition-all duration-300 relative overflow-hidden"
            style={{
              width: `${animatedHp}%`,
              background: 'linear-gradient(90deg, #991b1b, #dc2626, #b91c1c)',
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.7)',
            }}
          >
            {/* Shimmer pulse */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
              style={{
                transform: `translateX(${interpolate((frame * 2) % 100, [0, 100], [-100, 200])}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
