import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ReindexOperationProps {
  indexName?: string;
  className?: string;
}

export const ReindexOperation: React.FC<ReindexOperationProps> = ({
  indexName = 'idx_users_email',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          CONCURRENT REINDEX
        </span>
        <span className="text-emerald-400 font-bold">ONLINE (ZERO LOCK)</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">REINDEX INDEX CONCURRENTLY {indexName};</div>
          <div className="text-xs text-cyan-300 mt-0.5">Rebuilding bloat-free B-Tree in parallel</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Builds a shadow replacement index without blocking active SELECT or UPDATE queries.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ATOMIC POINTER SWAP AT END</span>
        <span>INDEX BLOAT REDUCED TO 0%</span>
      </div>
    </div>
  );
};
