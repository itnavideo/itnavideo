import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLOrderBySortProps {
  sortColumn?: string;
  direction?: 'ASC' | 'DESC';
  className?: string;
}

export const SQLOrderBySort: React.FC<SQLOrderBySortProps> = ({
  sortColumn = 'created_at',
  direction = 'DESC',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          ORDER BY SORT CONVEYOR
        </span>
        <span className="text-cyan-400 font-bold">{direction} ORDER</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="text-xs">
          <span className="text-cyan-400 font-black">ORDER BY</span>{' '}
          <span className="text-white font-bold">{sortColumn} {direction}</span>
        </div>

        <div className="flex items-center space-x-2 my-2">
          {['2026-11-22 (Newest)', '2026-11-21', '2026-11-20 (Oldest)'].map((d, i) => (
            <div key={i} className="flex-1 p-2 bg-zinc-950 rounded border border-cyan-500/40 text-center">
              <span className="text-[9px] text-cyan-400 font-bold">#{i + 1}</span>
              <div className="text-[11px] text-white mt-0.5 truncate">{d}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SORT METHOD: QUICKSORT / TOPTEN</span>
          <span className="text-emerald-400 font-bold">WORK MEM: 4MB (ZERO SPILL)</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>INDEX SCAN PREVENTS PHYSICAL SORT</span>
        <span>DETERMINISTIC TIE-BREAK</span>
      </div>
    </div>
  );
};
