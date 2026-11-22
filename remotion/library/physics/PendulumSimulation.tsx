import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PendulumSimulationProps {
  className?: string;
}

export const PendulumSimulation: React.FC<PendulumSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const angle = Math.sin(frame * 0.1) * 35;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          GRAVITATIONAL PENDULUM
        </span>
        <span className="text-white/40">θ = {angle.toFixed(1)}°</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-white z-10" />
        <div
          className="w-0.5 h-32 bg-indigo-400 origin-top flex flex-col justify-end items-center"
          style={{ transform: "rotate(" + angle.toFixed(1) + "deg)" }}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-xl -mb-4" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>PERIOD: T = 2π√(L/g)</span>
        <span>ENERGY: CONSERVED</span>
      </div>
    </div>
  );
};
