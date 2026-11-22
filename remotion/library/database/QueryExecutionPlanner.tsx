import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface QueryExecutionPlannerProps {
  query?: string;
  executionTime?: string;
  totalCost?: string;
  className?: string;
}

export const QueryExecutionPlanner: React.FC<QueryExecutionPlannerProps> = ({
  query = 'SELECT * FROM render_jobs WHERE user_id = $1 ORDER BY created_at DESC;',
  executionTime = '0.38 ms',
  totalCost = 'cost=0.42..8.44 rows=1 width=184',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          EXPLAIN ANALYZE PLANNER
        </span>
        <span className="text-emerald-400 font-bold">{executionTime}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="text-xs text-white/70 overflow-x-auto truncate">
          <code>{query}</code>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 space-y-1 my-2 text-xs">
          <div className="text-emerald-400 font-bold">▶ Index Scan Backward using idx_render_jobs_created</div>
          <div className="text-white/50 text-[10px]">{totalCost}</div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>OPTIMIZER: COST-BASED</span>
          <span className="text-emerald-400 font-bold">SEQUENTIAL SCAN BYPASS: YES</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BUFFER CACHE: HIT=4 READ=0</span>
        <span>PLANNING TIME: 0.12ms</span>
      </div>
    </div>
  );
};
