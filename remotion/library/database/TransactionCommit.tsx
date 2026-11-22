import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TransactionCommitProps {
  txId?: string;
  mutationsCount?: number;
  className?: string;
}

export const TransactionCommit: React.FC<TransactionCommitProps> = ({
  txId = 'TX_94822',
  mutationsCount = 6,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          TRANSACTION COMMIT
        </span>
        <span className="text-emerald-400 font-bold">SUCCESS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">✔ COMMIT {txId};</div>
          <div className="text-xs text-emerald-400 mt-1">{mutationsCount} Rows Mutated & Flushed to WAL</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          <div className="text-[10px] text-white/40 mb-1">DURABILITY SEAL:</div>
          <div>Changes visible to all concurrent transactions under snapshot isolation.</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FSYNC COMPLETED</span>
        <span>STATUS: COMMITTED (PERMANENT)</span>
      </div>
    </div>
  );
};
