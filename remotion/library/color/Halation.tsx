import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HalationProps {
  glowColor?: string;
  intensity?: number;
  threshold?: number;
  className?: string;
}

export const Halation: React.FC<HalationProps> = ({
  glowColor = '#ef4444',
  intensity = 65,
  threshold = 85,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          ANALOG FILM HALATION
        </span>
        <span className="text-white/40">35MM CELLULOID BLEED</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 relative p-5 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-white shadow-2xl relative flex items-center justify-center">
          <div
            className="absolute -inset-4 rounded-full opacity-70 blur-md pointer-events-none"
            style={{ backgroundColor: glowColor }}
          />
          <span className="text-black font-black text-xs z-10">SPECULAR</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>THRESHOLD: {threshold}%</span>
        <span>RED EMULSION SCATTER: {intensity}%</span>
      </div>
    </div>
  );
};
