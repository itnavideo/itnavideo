import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLCrossJoinProps {
  rowsA?: number;
  rowsB?: number;
  className?: string;
}

export const SQLCrossJoin: React.FC<SQLCrossJoinProps> = ({
  rowsA = 3,
  rowsB = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          CROSS JOIN (CARTESIAN)
        </span>
        <span className="text-rose-400 font-bold">{rowsA * rowsB} COMBINATIONS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="text-center text-xs">
          <span className="text-white/50">{rowsA} Rows (Table A)</span>{' '}
          <span className="text-rose-400 font-black">✕</span>{' '}
          <span className="text-white/50">{rowsB} Rows (Table B)</span>{' '}
          <span className="text-emerald-400 font-bold">= {rowsA * rowsB} Cartesian Tuples</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 my-2">
          {[...Array(rowsA * rowsB)].map((_, i) => (
            <div key={i} className="p-1.5 bg-zinc-950 rounded border border-rose-500/30 text-[9px] text-center text-white/80">
              (A{Math.floor(i / rowsB) + 1}, B{(i % rowsB) + 1})
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>NO ON CLAUSE REQUIRED</span>
        <span>USED FOR COMBINATORICS & TESTING</span>
      </div>
    </div>
  );
};
