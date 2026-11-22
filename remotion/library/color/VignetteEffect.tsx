import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VignetteEffectProps {
  darkness?: number; // 0 to 100
  feather?: number; // 0 to 100
  roundness?: number; // 0 to 1
  className?: string;
}

export const VignetteEffect: React.FC<VignetteEffectProps> = ({
  darkness = 75,
  feather = 60,
  roundness = 0.8,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-zinc-500/20 text-zinc-300 font-bold border border-zinc-500/30">
          LENS VIGNETTE APERTURE
        </span>
        <span className="text-white/40">FALLOFF: {darkness}%</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-white/10 relative overflow-hidden bg-zinc-800 flex items-center justify-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,' + (darkness / 100) + ') 100%)',
          }}
        />
        <span className="text-xs text-white/60 z-10">OPTICAL LIGHT FALLOFF EDGE</span>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>FEATHER: {feather}%</span>
        <span>ROUNDNESS: {roundness}</span>
      </div>
    </div>
  );
};
