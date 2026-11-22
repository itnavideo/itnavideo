import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MechanicalGearSystemProps {
  className?: string;
}

export const MechanicalGearSystem: React.FC<MechanicalGearSystemProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rotA = frame * 3;
  const rotB = -(frame * 3);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          SPUR GEAR MESH SYSTEM
        </span>
        <span className="text-white/40">GEAR RATIO: 1:1</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center space-x-1">
        <div
          className="w-20 h-20 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center"
          style={{ transform: "rotate(" + rotA + "deg)" }}
        >
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
        <div
          className="w-20 h-20 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center"
          style={{ transform: "rotate(" + rotB + "deg)" }}
        >
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TOOTH PROFILE: INVOLUTE</span>
        <span>PRESSURE ANGLE: 20°</span>
      </div>
    </div>
  );
};
