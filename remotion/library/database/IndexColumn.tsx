import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface IndexColumnProps {
  indexName?: string;
  algorithm?: string;
  lookupSpeed?: string;
  className?: string;
}

export const IndexColumn: React.FC<IndexColumnProps> = ({
  indexName = 'idx_render_jobs_status_created',
  algorithm = 'B-Tree (Composite)',
  lookupSpeed = '0.42 ms Lookup Time',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          DATABASE INDEX ACCELERATOR
        </span>
        <span className="text-white/40">QUERY SPEEDUP</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">{indexName}</div>
          <div className="text-xs text-cyan-300 mt-0.5">Algorithm: {algorithm}</div>
        </div>

        <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-center my-2">
          <div className="text-xs text-white/60">INDEX SCAN PERFORMANCE</div>
          <div className="text-lg font-black text-cyan-300 mt-0.5">{lookupSpeed}</div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>TABLE SCAN: 320ms → 0.42ms</span>
          <span className="text-emerald-400 font-bold">760x SPEEDUP</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>INDEX SIZE: 14.2 MB</span>
        <span>MAINTENANCE: AUTO-VACUUMED</span>
      </div>
    </div>
  );
};
