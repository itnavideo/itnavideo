import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DigestiveSystemProps {
  currentStage?: string;
  transitTimeHours?: number;
  phLevel?: number;
  className?: string;
}

export const DigestiveSystem: React.FC<DigestiveSystemProps> = ({
  currentStage = 'GASTRIC ACID BREAKDOWN',
  transitTimeHours = 4,
  phLevel = 1.8,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const bolusProgress = (frame * 1.5) % 100;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 14, 10, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            GASTROINTESTINAL DIGESTIVE TRACT
          </span>
          <span className="text-zinc-500 text-[10px]">PERISTALSIS</span>
        </div>

        {/* GI Tract Flow Schematic */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center text-xs">
          {/* Esophagus */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-[14px]">👄</span>
            <span className="text-[9px] font-bold text-zinc-300 mt-1">Esophagus</span>
          </div>

          {/* Stomach */}
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 flex flex-col items-center">
            <span className="text-[14px]">🥣</span>
            <span className="text-[9px] font-bold text-amber-300 mt-1">Stomach</span>
          </div>

          {/* Small Intestine */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-[14px]">🧬</span>
            <span className="text-[9px] font-bold text-zinc-300 mt-1">Intestine</span>
          </div>

          {/* Colon */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-[14px]">🔄</span>
            <span className="text-[9px] font-bold text-zinc-300 mt-1">Colon</span>
          </div>
        </div>

        {/* Acid / Absorption Status */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 my-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-bold">{currentStage}</span>
            <span className="text-rose-400 font-bold text-[11px]">pH {phLevel}</span>
          </div>
          {/* Peristalsis Wave Progress */}
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-2">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${bolusProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>Transit: ~{transitTimeHours} Hours</span>
          <span className="text-emerald-400 font-bold">Enzymatic Lysis</span>
        </div>
      </div>
    </div>
  );
};
