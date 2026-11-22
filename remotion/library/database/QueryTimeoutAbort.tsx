import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface QueryTimeoutAbortProps {
  timeoutSec?: number;
  abortedQuery?: string;
  className?: string;
}

export const QueryTimeoutAbort: React.FC<QueryTimeoutAbortProps> = ({
  timeoutSec = 15,
  abortedQuery = 'SELECT * FROM big_table CROSS JOIN big_table;',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          STATEMENT TIMEOUT
        </span>
        <span className="text-rose-400 font-bold">TERMINATED</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-rose-500/40 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">ERROR: canceling statement due to statement_timeout</div>
          <div className="text-xs text-rose-400 mt-1">Exceeded max {timeoutSec}s execution limit</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2 truncate">
          Query: {abortedQuery}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREVENTS RUNAWAY RESOURCE EXHAUSTION</span>
        <span>CPU PROTECTED</span>
      </div>
    </div>
  );
};
