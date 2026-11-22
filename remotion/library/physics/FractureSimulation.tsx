import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FractureSimulationProps {
  className?: string;
}

export const FractureSimulation: React.FC<FractureSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isFractured = (frame % 60) > 20;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          VORONOI FRACTURE IMPACT
        </span>
        <span className="text-white/40">{isFractured ? 'SHATTERED' : 'SOLID IMPACT'}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div className="w-40 h-28 grid grid-cols-3 grid-rows-2 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-stone-500/80 border border-white/30 rounded-xs transition-transform"
              style={{
                transform: isFractured ? ("translate(" + ((i % 3 - 1) * 12) + "px, " + ((i > 2 ? 1 : -1) * 10) + "px)") : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>FRAGMENTS: 6 VORONOI CELLS</span>
        <span>TENSILE STRESS: EXCEEDED</span>
      </div>
    </div>
  );
};
