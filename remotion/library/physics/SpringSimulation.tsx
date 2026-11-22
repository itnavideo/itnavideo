import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SpringSimulationProps {
  springConstant?: number;
  className?: string;
}

export const SpringSimulation: React.FC<SpringSimulationProps> = ({
  springConstant = 250,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const stretch = Math.sin(frame * 0.2) * 25;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          HOOKE'S LAW MASS-SPRING
        </span>
        <span className="text-white/40">k = {springConstant} N/m</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex flex-col items-center justify-start">
        <div className="w-16 h-2 bg-zinc-600 rounded-xs mb-1" />
        <svg className="w-16" style={{ height: (60 + stretch) + 'px' }} viewBox="0 0 40 100" preserveAspectRatio="none">
          <polyline points="20,0 35,15 5,30 35,45 5,60 35,75 5,90 20,100" fill="none" stroke="#10b981" strokeWidth="3" />
        </svg>
        <div className="w-14 h-10 bg-emerald-600 rounded border border-white shadow-lg flex items-center justify-center font-bold text-xs">
          MASS
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>RESTORING FORCE: F = -kx</span>
        <span>DAMPING RATIO (ζ): 0.15</span>
      </div>
    </div>
  );
};
