import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SavepointRollbackProps {
  savepointName?: string;
  className?: string;
}

export const SavepointRollback: React.FC<SavepointRollbackProps> = ({
  savepointName = 'sp_before_credit_charge',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          PARTIAL SAVEPOINT
        </span>
        <span className="text-white/40">NESTED RECOVERY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono text-xs">
        <div className="text-white/60">SAVEPOINT {savepointName};</div>
        <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded my-2 text-rose-300">
          ROLLBACK TO SAVEPOINT {savepointName};
        </div>
        <div className="text-emerald-400 font-bold">COMMIT; (Outer transaction succeeds)</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>GRANULAR ERROR HANDLING</span>
        <span>ZERO WHOLE-TX ABORT</span>
      </div>
    </div>
  );
};
