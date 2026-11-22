import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioReactiveParticlesProps {
  particleCount?: number;
  className?: string;
}

export const AudioReactiveParticles: React.FC<AudioReactiveParticlesProps> = ({
  particleCount = 20,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          AUDIO-REACTIVE PARTICLE CLOUD
        </span>
        <span className="text-white/40">KINETIC DISPERSION</span>
      </div>

      <div className="flex-1 my-4 bg-black/70 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        {Array.from({ length: particleCount }).map((_, i) => {
          const rad = (i * (360 / particleCount)) * (Math.PI / 180);
          const dist = 30 + Math.abs(Math.sin((frame * 0.1) + i)) * 60;
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-md"
              style={{ transform: "translate(" + x + "px, " + y + "px)" }}
            />
          );
        })}
        <div className="w-10 h-10 rounded-full bg-purple-900 border border-purple-400/80 z-10" />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>FORCE FIELD: TRANSIENT PULSE</span>
        <span>VELOCITY DAMPING: 0.92</span>
      </div>
    </div>
  );
};
