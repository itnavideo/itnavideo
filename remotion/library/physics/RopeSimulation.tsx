import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RopeSimulationProps {
  className?: string;
}

export const RopeSimulation: React.FC<RopeSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.1) * 20;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          CATENARY ROPE DYNAMICS
        </span>
        <span className="text-white/40">VERLET INTEGRATION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-56 h-40" viewBox="0 0 100 80">
          <path
            d={"M 20,20 Q " + (50 + sway) + ",65 80,20"}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="3" fill="#fff" />
          <circle cx="80" cy="20" r="3" fill="#fff" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ROPE SEGMENTS: 24 LINKS</span>
        <span>TENSILE LOAD: 450 N</span>
      </div>
    </div>
  );
};
