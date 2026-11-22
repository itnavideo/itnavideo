import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TransactionIsolationLevelProps {
  isolationLevel?: string;
  dirtyReadBlocked?: boolean;
  phantomReadBlocked?: boolean;
  className?: string;
}

export const TransactionIsolationLevel: React.FC<TransactionIsolationLevelProps> = ({
  isolationLevel = 'SERIALIZABLE',
  dirtyReadBlocked = true,
  phantomReadBlocked = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          ACID ISOLATION LEVEL
        </span>
        <span className="text-emerald-400 font-bold">{isolationLevel}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">SET TRANSACTION ISOLATION LEVEL {isolationLevel};</div>
          <div className="text-xs text-purple-300 mt-1">Strictest mathematical guarantee against race conditions</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2 text-xs">
          <div className="p-2.5 bg-zinc-950 rounded border border-emerald-500/40 text-center">
            <span className="text-emerald-400 font-bold">✓ DIRTY READS BLOCKED</span>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-emerald-500/40 text-center">
            <span className="text-emerald-400 font-bold">✓ PHANTOMS BLOCKED</span>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREDICATE LOCKING (SIREAD)</span>
        <span>ZERO ANOMALIES</span>
      </div>
    </div>
  );
};
