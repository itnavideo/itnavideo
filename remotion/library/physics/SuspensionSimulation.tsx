import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SuspensionSimulationProps {
  className?: string;
}

export const SuspensionSimulation: React.FC<SuspensionSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const bump = Math.sin(frame * 0.25) * 15;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          COILOVER SUSPENSION STRUT
        </span>
        <span className="text-white/40">BUMP REBOUND</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center">
        <div className="w-24 h-4 bg-zinc-600 rounded mb-1" />
        <div className="w-3 bg-teal-400 rounded" style={{ height: (45 + bump) + 'px' }} />
        <div className="w-12 h-12 rounded-full bg-zinc-800 border-4 border-zinc-500 shadow-xl" />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>DAMPER COEFFICIENT: 1500 Ns/m</span>
        <span>TRAVEL: 120mm</span>
      </div>
    </div>
  );
};
