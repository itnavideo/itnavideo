import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ObjectDeformationProps {
  className?: string;
}

export const ObjectDeformation: React.FC<ObjectDeformationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          FINITE ELEMENT STRESS MESH (FEA)
        </span>
        <span className="text-white/40">VON MISES STRESS</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div className="w-44 h-24 rounded-lg bg-gradient-to-r from-blue-600 via-emerald-500 via-yellow-500 to-red-600 border border-white/40 flex items-center justify-center text-xs font-black shadow-lg">
          YIELD LOAD ZONE
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>MAX STRESS: 240 MPa</span>
        <span>SAFETY FACTOR: 1.8</span>
      </div>
    </div>
  );
};
