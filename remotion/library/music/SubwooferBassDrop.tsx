import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SubwooferBassDropProps {
  bassFrequencyHz?: number;
  dbLevel?: number;
  className?: string;
}

export const SubwooferBassDrop: React.FC<SubwooferBassDropProps> = ({
  bassFrequencyHz = 35,
  dbLevel = 118,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const bassDisplacement = Math.sin(frame * 0.4) * 15;

  return (
    <div
      className={`relative flex items-center justify-center w-64 h-64 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      {/* Shockwave Rings */}
      <div
        className="absolute w-56 h-56 rounded-full border border-rose-500/30 animate-ping pointer-events-none"
      />

      {/* Subwoofer Cone */}
      <div
        className="w-48 h-48 rounded-full bg-zinc-900 border-4 border-zinc-700 shadow-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          transform: `scale(${1 + bassDisplacement * 0.01})`,
          boxShadow: '0 0 40px rgba(244, 63, 94, 0.4)',
        }}
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-inner">
          <div className="w-12 h-12 rounded-full bg-zinc-950 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-rose-400 leading-none">{bassFrequencyHz}</span>
            <span className="text-[8px] text-zinc-500 font-bold">HZ</span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 px-3 py-1 rounded bg-black/80 border border-rose-500/40 text-[10px] font-bold text-rose-400 shadow-md">
        SUB BASS DROP: {dbLevel} dB SPL
      </div>
    </div>
  );
};
