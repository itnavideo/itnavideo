import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StereoPanMeterProps {
  balancePercent?: number; // -100 (L) to +100 (R)
  widthPercent?: number;
  className?: string;
}

export const StereoPanMeter: React.FC<StereoPanMeterProps> = ({
  balancePercent = 0,
  widthPercent = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const panBallX = Math.sin(frame * 0.15) * 40;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-zinc-700 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            STEREO PHASE & BALANCE CORRELATION
          </span>
          <span className="text-zinc-400 text-[10px]">{widthPercent}% WIDTH</span>
        </div>

        {/* Pan Tape with Moving Balance Ball */}
        <div className="h-10 my-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center relative">
          <div className="w-[1px] h-full bg-white/20 absolute" />
          <div
            className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] absolute transition-all"
            style={{ transform: `translateX(${panBallX}px)` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>LEFT [100%]</span>
          <span className="text-white font-bold">CENTER</span>
          <span>RIGHT [100%]</span>
        </div>
      </div>
    </div>
  );
};
