import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ClothSimulationProps {
  className?: string;
}

export const ClothSimulation: React.FC<ClothSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          CLOTH & FABRIC SIMULATION
        </span>
        <span className="text-white/40">MASS-SPRING GRID</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-56 h-40" viewBox="0 0 100 80">
          {Array.from({ length: 6 }).map((_, i) => {
            const wave = Math.sin((frame * 0.1) + i * 0.5) * 5;
            return (
              <path
                key={i}
                d={"M 10," + (15 + i * 10) + " Q 50," + (25 + i * 10 + wave) + " 90," + (15 + i * 10)}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />
            );
          })}
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SHEAR STIFFNESS: 0.85</span>
        <span>WIND VELOCITY: 12 km/h</span>
      </div>
    </div>
  );
};
