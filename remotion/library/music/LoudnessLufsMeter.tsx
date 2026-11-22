import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LoudnessLufsMeterProps {
  integratedLufs?: number;
  truePeakDbtp?: number;
  targetLufs?: number;
  standard?: string;
  className?: string;
}

export const LoudnessLufsMeter: React.FC<LoudnessLufsMeterProps> = ({
  integratedLufs = -14.2,
  truePeakDbtp = -1.1,
  targetLufs = -14.0,
  standard = 'EBU R128 / YOUTUBE COMPLIANT',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 18, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            {standard}
          </span>
          <span className="text-zinc-500 text-[10px]">TARGET {targetLufs} LUFS</span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold">INTEGRATED</span>
            <span className="text-2xl font-black text-white">{integratedLufs} <span className="text-xs text-zinc-500 font-bold">LUFS</span></span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold">TRUE PEAK</span>
            <span className="text-2xl font-black text-emerald-400">{truePeakDbtp} <span className="text-xs text-zinc-500 font-bold">dBTP</span></span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">✓ ZERO CLIPPING</span>
          <span>Streaming Certified</span>
        </div>
      </div>
    </div>
  );
};
