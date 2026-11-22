import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ChainPhysicsProps {
  className?: string;
}

export const ChainPhysics: React.FC<ChainPhysicsProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-stone-500/20 text-stone-300 font-bold border border-stone-500/30">
          INTERLOCKING CHAIN LINKS
        </span>
        <span className="text-white/40">RIGID CONSTRAINTS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center">
        {Array.from({ length: 4 }).map((_, i) => {
          const sway = Math.sin((frame * 0.1) + i * 0.5) * 6;
          return (
            <div
              key={i}
              className="w-6 h-8 rounded-full border-4 border-stone-400 -my-1 shadow"
              style={{ transform: "translateX(" + sway.toFixed(1) + "px)" }}
            />
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>LINK RIGIDITY: HARD</span>
        <span>TOLERANCE: 0.1mm</span>
      </div>
    </div>
  );
};
