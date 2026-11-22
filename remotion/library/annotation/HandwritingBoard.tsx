import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HandwritingBoardProps {
  className?: string;
}

export const HandwritingBoard: React.FC<HandwritingBoardProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          CHALKBOARD SLATE
        </span>
        <span className="text-white/40">CHALK TEXTURE</span>
      </div>

      <div className="flex-1 my-4 bg-emerald-950 border-4 border-amber-800 rounded-xl p-5 flex flex-col items-center justify-center text-white/90 shadow-2xl">
        <div className="text-2xl font-serif italic mb-1">E = mc²</div>
        <div className="text-xs text-white/50">Energy-Mass Equivalence</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SURFACE: GREEN SLATE</span>
        <span>CHALK RESIDUE: 8%</span>
      </div>
    </div>
  );
};
