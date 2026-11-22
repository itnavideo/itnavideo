import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AmmoCounterProps {
  currentRounds?: number;
  reserveRounds?: number;
  fireMode?: 'AUTO' | 'BURST' | 'SINGLE';
  weaponName?: string;
  lowAmmoThreshold?: number;
  className?: string;
}

export const AmmoCounter: React.FC<AmmoCounterProps> = ({
  currentRounds = 28,
  reserveRounds = 120,
  fireMode = 'AUTO',
  weaponName = 'VOLT SMG MK-II',
  lowAmmoThreshold = 5,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isLow = currentRounds <= lowAmmoThreshold;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden font-mono"
        style={{
          background: 'rgba(12, 12, 16, 0.95)',
          boxShadow: isLow
            ? '0 0 25px rgba(239, 68, 68, 0.4)'
            : '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.15)',
        }}
      >
        {/* Bullet Graphic Simulation */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 h-5 rounded-sm ${
                i < 4 ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Big Numbers */}
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-3xl font-black ${
              isLow ? 'text-rose-500 animate-pulse' : 'text-white'
            }`}
          >
            {currentRounds}
          </span>
          <span className="text-zinc-500 font-bold text-sm">/ {reserveRounds}</span>
        </div>

        {/* Weapon Details */}
        <div className="flex flex-col border-l border-white/10 pl-3">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {weaponName}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 text-cyan-400 font-bold border border-cyan-500/30">
              {fireMode}
            </span>
            {isLow && <span className="text-[9px] text-rose-400 font-bold animate-pulse">RELOAD!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
