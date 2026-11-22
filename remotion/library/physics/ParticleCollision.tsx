import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ParticleCollisionProps {
  className?: string;
}

export const ParticleCollision: React.FC<ParticleCollisionProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          PARTICLE BILLIARD BOX
        </span>
        <span className="text-white/40">BOUNDING IMPACTS</span>
      </div>

      <div className="flex-1 my-4 bg-black/70 rounded-xl border border-white/10 p-4 relative overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => {
          const px = Math.abs(Math.sin((frame * 0.08) + i * 1.5)) * 180 + 10;
          const py = Math.abs(Math.cos((frame * 0.07) + i * 2.1)) * 90 + 10;
          return (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-amber-400 border border-white absolute shadow"
              style={{ transform: "translate(" + px + "px, " + py + "px)" }}
            />
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>VELOCITY VECTOR UPDATE: 60 FPS</span>
        <span>BOX REBOUND: SPECULAR</span>
      </div>
    </div>
  );
};
