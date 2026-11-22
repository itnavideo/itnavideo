import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HeartCirculationProps {
  heartRate?: number;
  cardiacOutput?: string;
  className?: string;
}

export const HeartCirculation: React.FC<HeartCirculationProps> = ({
  heartRate = 72,
  cardiacOutput = '5.0 L/min',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame * 0.2) * 0.08 + 1;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-rose-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 10, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(244, 63, 94, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
            CARDIOVASCULAR CIRCULATION
          </span>
          <span className="text-zinc-500 text-[10px]">{heartRate} BPM</span>
        </div>

        {/* 4 Chamber Heart Graphic */}
        <div className="h-36 my-2 flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-3xl border-2 border-rose-500/40 p-2 grid grid-cols-2 gap-2 shadow-2xl"
            style={{ transform: `scale(${pulse})` }}
          >
            {/* Right Atrium (Blue deox) */}
            <div className="rounded-xl bg-sky-900/70 border border-sky-400/40 flex items-center justify-center text-[9px] font-bold text-sky-200">
              R. Atrium
            </div>
            {/* Left Atrium (Red ox) */}
            <div className="rounded-xl bg-rose-900/70 border border-rose-400/40 flex items-center justify-center text-[9px] font-bold text-rose-200">
              L. Atrium
            </div>
            {/* Right Ventricle */}
            <div className="rounded-xl bg-sky-950/90 border border-sky-500/40 flex items-center justify-center text-[9px] font-bold text-sky-300">
              R. Ventricle
            </div>
            {/* Left Ventricle */}
            <div className="rounded-xl bg-rose-950/90 border border-rose-500/40 flex items-center justify-center text-[9px] font-bold text-rose-300">
              L. Ventricle
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-rose-400 font-bold">Output: {cardiacOutput}</span>
          <span className="text-zinc-400 text-[10px]">Systemic Circuit</span>
        </div>
      </div>
    </div>
  );
};
