import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BlueprintOverlayProps {
  className?: string;
}

export const BlueprintOverlay: React.FC<BlueprintOverlayProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          TECHNICAL BLUEPRINT GRID
        </span>
        <span className="text-white/40">CAD DRAFTING</span>
      </div>

      <div className="flex-1 my-4 bg-blue-900/60 rounded-xl border border-blue-400/40 p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="text-[10px] text-blue-300">DWG NO: BPT-8942-REV-C</div>
        <div className="grid grid-cols-6 grid-rows-4 w-full h-24 border border-blue-300/30">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-blue-300/15" />
          ))}
        </div>
        <div className="text-[9px] text-blue-300/60 flex justify-between">
          <span>SCALE: 1:50</span>
          <span>APPROVED: CHIEF ENGR</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CYAN GRID PITCH: 10mm</span>
        <span>COMPASS ORIENTATION: NORTH</span>
      </div>
    </div>
  );
};
