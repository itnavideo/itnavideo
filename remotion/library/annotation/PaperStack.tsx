import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PaperStackProps {
  className?: string;
}

export const PaperStack: React.FC<PaperStackProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          ISOMETRIC PAPER STACK
        </span>
        <span className="text-white/40">MULTI-LAYER DECK</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex items-center justify-center relative">
        <div className="w-36 h-44 bg-zinc-300 rounded absolute rotate-6 shadow-md" />
        <div className="w-36 h-44 bg-zinc-200 rounded absolute -rotate-3 shadow-lg" />
        <div className="w-36 h-44 bg-white text-zinc-900 rounded p-3 shadow-2xl relative z-10 flex flex-col justify-between">
          <span className="text-[10px] font-bold">EXECUTIVE SUMMARY</span>
          <span className="text-[9px] text-zinc-500">Q4 Milestone Release</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>STACK DEPTH: 3 SHEETS</span>
        <span>SHADOW ACCURACY: SOFT</span>
      </div>
    </div>
  );
};
