import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TransactionRollbackProps {
  txId?: string;
  reason?: string;
  className?: string;
}

export const TransactionRollback: React.FC<TransactionRollbackProps> = ({
  txId = 'TX_94821',
  reason = 'Foreign Key Violation on billing_history',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          TRANSACTION ROLLBACK
        </span>
        <span className="text-rose-400 font-bold">ABORTED</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-rose-500/40 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">↺ ROLLBACK {txId};</div>
          <div className="text-xs text-rose-400 mt-1">{reason}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          <div className="text-[10px] text-white/40 mb-1">ATOMIC INTEGRITY:</div>
          <div>All uncommitted table mutations reverted to initial state. Zero partial writes.</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>UNDO LOGS APPLIED</span>
        <span>ACID 'A' (ATOMICITY) ENFORCED</span>
      </div>
    </div>
  );
};
