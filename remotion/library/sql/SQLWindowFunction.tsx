import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLWindowFunctionProps {
  funcName?: string;
  partitionBy?: string;
  orderBy?: string;
  className?: string;
}

export const SQLWindowFunction: React.FC<SQLWindowFunctionProps> = ({
  funcName = 'ROW_NUMBER()',
  partitionBy = 'PARTITION BY user_id',
  orderBy = 'ORDER BY created_at DESC',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          ANALYTIC WINDOW FUNCTION
        </span>
        <span className="text-white/40">OVER () CLAUSE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono text-xs">
        <div>
          <span className="text-violet-400 font-black">{funcName}</span>{' '}
          <span className="text-white font-bold">OVER (</span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 space-y-1 my-2">
          <div className="text-violet-300 font-bold">{partitionBy}</div>
          <div className="text-emerald-400 font-bold">{orderBy}</div>
        </div>

        <div className="text-white font-bold">) AS user_job_rank</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>COMPUTES WITHOUT COLLAPSING ROWS</span>
        <span>RUNNING TOTALS & RANKING</span>
      </div>
    </div>
  );
};
