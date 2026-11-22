import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface UpsertMergeOperationProps {
  keyConflict?: string;
  updateAction?: string;
  className?: string;
}

export const UpsertMergeOperation: React.FC<UpsertMergeOperationProps> = ({
  keyConflict = 'ON CONFLICT (user_id)',
  updateAction = 'DO UPDATE SET last_login = NOW()',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          UPSERT (MERGE) OPERATION
        </span>
        <span className="text-white/40">IDEMPOTENT WRITE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono text-xs">
        <div>
          <span className="text-emerald-400 font-black">INSERT INTO</span> users (user_id, status) VALUES ('usr_1', 'ACTIVE')
        </div>

        <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded my-2">
          <div className="text-amber-400 font-bold">{keyConflict}</div>
          <div className="text-white mt-1">{updateAction};</div>
        </div>

        <div className="text-white/60">RESULT: In-place update if existing, else new row created.</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREVENTS DUPLICATE KEY ERRORS</span>
        <span>ATOMIC AT ROW LEVEL</span>
      </div>
    </div>
  );
};
