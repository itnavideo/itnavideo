import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLWhereFilterProps {
  condition?: string;
  rowsIn?: number;
  rowsOut?: number;
  className?: string;
}

export const SQLWhereFilter: React.FC<SQLWhereFilterProps> = ({
  condition = "status = 'COMPLETED' AND duration_sec <= 90",
  rowsIn = 14200,
  rowsOut = 2840,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          WHERE PREDICATE FILTER
        </span>
        <span className="text-amber-400 font-bold">ROW FILTERING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div>
          <span className="text-amber-400 font-black">WHERE</span>{' '}
          <span className="text-white font-bold">{condition}</span>
        </div>

        <div className="flex items-center justify-around my-3 text-center">
          <div>
            <div className="text-[10px] text-white/40">INPUT TUPLES</div>
            <div className="text-base font-bold text-white mt-0.5">{rowsIn.toLocaleString()} Rows</div>
          </div>
          <span className="text-amber-400 text-lg font-bold">──FILTER──▶</span>
          <div>
            <div className="text-[10px] text-emerald-400 font-bold">MATCHING TUPLES</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">{rowsOut.toLocaleString()} Rows</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>BOOLEAN EVALUATION: SHORT-CIRCUIT</span>
          <span className="text-emerald-400 font-bold">FILTER RATIO: 20%</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREDICATE PUSHDOWN: OPTIMIZED</span>
        <span>INDEX SCAN SUPPORTED</span>
      </div>
    </div>
  );
};
