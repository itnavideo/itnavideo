import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MagneticRepulsionProps {
  className?: string;
}

export const MagneticRepulsion: React.FC<MagneticRepulsionProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const repulsion = 40 + Math.abs(Math.sin(frame * 0.15)) * 30;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          MAGNETIC LEVITATION REPULSION
        </span>
        <span className="text-white/40">N ⟷ N REPEL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center">
        <div
          className="w-24 h-10 bg-red-600 border border-white rounded flex items-center justify-center font-black text-sm mb-2 shadow-xl"
          style={{ transform: "translateY(-" + repulsion.toFixed(0) + "px)" }}
        >
          N (FLOATING)
        </div>
        <div className="w-28 h-4 bg-red-800 border border-white/40 rounded flex items-center justify-center font-bold text-[10px]">
          N (BASE POLE)
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>MAGNETIC LEVITATION EQUILIBRIUM</span>
        <span>FIELD INTENSITY: 1.4 TESLA</span>
      </div>
    </div>
  );
};
