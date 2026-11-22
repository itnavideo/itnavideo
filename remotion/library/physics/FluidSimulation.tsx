import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FluidSimulationProps {
  className?: string;
}

export const FluidSimulation: React.FC<FluidSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.15) * 6;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          SPH FLUID DYNAMICS (2D)
        </span>
        <span className="text-white/40">NAVIER-STOKES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div className="w-48 h-36 border-2 border-white/30 rounded-b-xl relative overflow-hidden flex flex-col justify-end bg-black/40">
          <div
            className="w-full bg-gradient-to-t from-cyan-600 to-blue-500/80"
            style={{ height: (60 + wave) + '%' }}
          />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>VISCOSITY (μ): 0.001 Pa·s</span>
        <span>INCOMPRESSIBLE FLOW</span>
      </div>
    </div>
  );
};
