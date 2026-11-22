import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HealthBarProps {
  currentHp?: number;
  maxHp?: number;
  shield?: number;
  playerName?: string;
  theme?: 'cyberpunk' | 'fantasy' | 'scifi';
  className?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  currentHp = 780,
  maxHp = 1000,
  shield = 250,
  playerName = 'SHADOW_NINJA',
  theme = 'cyberpunk',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const hpFill = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 90 } });

  const hpRatio = Math.min(1, Math.max(0, currentHp / maxHp));
  const animatedHpWidth = hpRatio * hpFill * 100;
  const isCritical = hpRatio < 0.25;

  const lowHpFlash = isCritical && frame % 20 < 10;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 10, 15, 0.94)',
          boxShadow: isCritical
            ? '0 0 30px rgba(239, 68, 68, 0.4)'
            : '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.15)',
        }}
      >
        {/* Player Name & Tag */}
        <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 transform rotate-45" />
            <span className="text-white tracking-widest">{playerName}</span>
          </div>
          <div className="text-zinc-400">
            <span className="text-emerald-400 font-bold">{Math.round(currentHp * hpFill)}</span>
            <span className="text-zinc-600"> / {maxHp} HP</span>
          </div>
        </div>

        {/* Health Bar Track */}
        <div className="w-full h-5 bg-zinc-900 rounded-lg p-0.5 border border-white/10 relative overflow-hidden flex">
          {/* Main Health Fill */}
          <div
            className="h-full rounded-md transition-all duration-200 relative overflow-hidden"
            style={{
              width: `${animatedHpWidth}%`,
              background: lowHpFlash
                ? '#ef4444'
                : 'linear-gradient(90deg, #10b981, #059669)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
            }}
          >
            {/* Shimmer line */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                transform: `translateX(${interpolate((frame * 4) % 120, [0, 120], [-100, 200])}%)`,
              }}
            />
          </div>

          {/* Shield segment overlay if shield > 0 */}
          {shield > 0 && (
            <div
              className="h-full rounded-r-md bg-cyan-400/80 border-l border-white/20"
              style={{
                width: `${Math.min(25, (shield / maxHp) * 100 * hpFill)}%`,
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
              }}
            />
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>Armor: 100%</span>
          {shield > 0 && <span className="text-cyan-400">Shield: +{shield}</span>}
          <span className={isCritical ? 'text-rose-500 animate-pulse font-bold' : 'text-emerald-400'}>
            {isCritical ? 'CRITICAL HP' : 'STABLE'}
          </span>
        </div>
      </div>
    </div>
  );
};
