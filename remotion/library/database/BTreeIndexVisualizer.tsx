import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BTreeIndexVisualizerProps {
  rootRange?: string;
  branches?: string[];
  className?: string;
}

export const BTreeIndexVisualizer: React.FC<BTreeIndexVisualizerProps> = ({
  rootRange = '[50 | 100]',
  branches = ['[1..49]', '[50..99]', '[100..200]'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          B+ TREE INDEX STRUCTURE
        </span>
        <span className="text-white/40">O(log N) SEARCH</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="px-4 py-2 bg-cyan-950 border border-cyan-500/50 rounded-lg text-center">
          <div className="text-[9px] text-cyan-300 font-bold">ROOT NODE</div>
          <div className="text-xs font-black text-white">{rootRange}</div>
        </div>

        <div className="w-0.5 h-3 bg-white/20" />

        <div className="grid grid-cols-3 gap-2 w-full">
          {branches.map((b, i) => (
            <div key={i} className="p-2 bg-zinc-900 border border-white/10 rounded text-center">
              <div className="text-[9px] text-white/40">LEAF {i + 1}</div>
              <div className="text-xs font-bold text-cyan-300 mt-0.5">{b}</div>
              <div className="text-[9px] text-emerald-400 mt-1">Pointer: TID</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TREE HEIGHT: 3 LEVELS</span>
        <span>INDEX DEGREE: BALANCED</span>
      </div>
    </div>
  );
};
