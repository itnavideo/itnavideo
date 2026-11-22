import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CollisionSimulationProps {
  className?: string;
}

export const CollisionSimulation: React.FC<CollisionSimulationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const phase = frame % 60;
  const posA = phase < 30 ? (phase * 2) : (60 - (phase - 30) * 1.5);
  const posB = phase < 30 ? (120 - phase * 2) : (60 + (phase - 30) * 1.5);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          ELASTIC 2-BODY COLLISION
        </span>
        <span className="text-white/40">MOMENTUM p=mv</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center">
        <div className="w-72 h-1 bg-zinc-700 relative flex items-center">
          <div
            className="w-8 h-8 rounded-full bg-blue-500 border border-white absolute shadow"
            style={{ left: posA + 'px' }}
          />
          <div
            className="w-8 h-8 rounded-full bg-red-500 border border-white absolute shadow"
            style={{ left: posB + 'px' }}
          />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CONSERVATION OF MOMENTUM: YES</span>
        <span>KINETIC ENERGY LOSS: 0.0%</span>
      </div>
    </div>
  );
};
