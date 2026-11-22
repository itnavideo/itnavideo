import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WaveformParticlesProps {
  className?: string;
}

export const WaveformParticles: React.FC<WaveformParticlesProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          WAVEFORM PARTICLE SPARK
        </span>
        <span className="text-white/40">CONTOUR TRACE</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 flex items-center justify-between">
        {Array.from({ length: 16 }).map((_, i) => {
          const y = Math.sin((frame * 0.15) + i * 0.5) * 35;
          return (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400 shadow-md"
              style={{ transform: "translateY(" + y + "px)" }}
            />
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PARTICLE TRAIL: GLOW</span>
        <span>INTERPOLATION: SPLINE</span>
      </div>
    </div>
  );
};
