import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SoftBodySimulationProps {
  className?: string;
}

export const SoftBodySimulation: React.FC<SoftBodySimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const squish = 1 + Math.sin(frame * 0.2) * 0.3;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30">
          SOFT BODY DEFORMATION
        </span>
        <span className="text-white/40">VOLUME PRESERVATION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-fuchsia-600 to-pink-400 border-2 border-white shadow-2xl flex items-center justify-center text-xs font-bold"
          style={{
            transform: "scaleX(" + (1 / squish).toFixed(2) + ") scaleY(" + squish.toFixed(2) + ")",
          }}
        >
          JELLY
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SPRING LATTICE: TETRAHEDRAL</span>
        <span>INTERNAL PRESSURE: 101 kPa</span>
      </div>
    </div>
  );
};
