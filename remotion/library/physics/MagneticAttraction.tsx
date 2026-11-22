import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MagneticAttractionProps {
  className?: string;
}

export const MagneticAttraction: React.FC<MagneticAttractionProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const gap = Math.max(10, 80 - (frame % 60) * 1.5);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          MAGNETIC DIPOLE ATTRACTION
        </span>
        <span className="text-white/40">N ➔ S FORCE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center space-x-2">
        <div
          className="w-20 h-14 bg-red-600 rounded-l border border-white flex items-center justify-center font-black text-xl"
          style={{ transform: "translateX(" + (gap / 2) + "px)" }}
        >
          N
        </div>
        <div
          className="w-20 h-14 bg-blue-600 rounded-r border border-white flex items-center justify-center font-black text-xl"
          style={{ transform: "translateX(-" + (gap / 2) + "px)" }}
        >
          S
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>LORENTZ FORCE: INVERSE SQUARE</span>
        <span>ATTRACTIVE FLUX: HIGH</span>
      </div>
    </div>
  );
};
