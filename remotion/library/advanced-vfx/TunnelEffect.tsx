import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TunnelEffectProps {
  className?: string;
}

export const TunnelEffect: React.FC<TunnelEffectProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          INFINITE CONCENTRIC TUNNEL
        </span>
        <span className="text-white/40">HYPER-ZOOM</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-emerald-400/40"
            style={{
              width: (50 + i * 40) + "px",
              height: (50 + i * 40) + "px",
            }}
          />
        ))}
        <span className="text-xs text-emerald-300 font-bold z-10">VANISHING POINT</span>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ACCELERATION: 1.8x</span>
        <span>DEPTH BLUR: ON</span>
      </div>
    </div>
  );
};
