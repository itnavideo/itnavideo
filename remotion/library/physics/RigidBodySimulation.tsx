import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RigidBodySimulationProps {
  massKg?: number;
  restitution?: number;
  className?: string;
}

export const RigidBodySimulation: React.FC<RigidBodySimulationProps> = ({
  massKg = 10,
  restitution = 0.72,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const bounce = Math.abs(Math.cos(frame * 0.15)) * Math.max(0, 80 - frame * 0.8);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          RIGID BODY DYNAMICS
        </span>
        <span className="text-white/40">G = 9.81 m/s²</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex flex-col justify-end items-center">
        <div
          className="w-16 h-16 bg-blue-500 border-2 border-white rounded-md shadow-2xl flex items-center justify-center font-black text-xs text-white"
          style={{ transform: "translateY(-" + bounce.toFixed(1) + "px)" }}
        >
          {massKg} kg
        </div>
        <div className="w-full h-2 bg-zinc-700 mt-2 rounded-full border-t border-white/20" />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>RESTITUTION (e): {restitution}</span>
        <span>VELOCITY: {(bounce * 0.1).toFixed(2)} m/s</span>
      </div>
    </div>
  );
};
