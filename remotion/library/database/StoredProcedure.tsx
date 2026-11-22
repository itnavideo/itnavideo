import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface StoredProcedureProps {
  procName?: string;
  parameters?: string;
  returns?: string;
  className?: string;
}

export const StoredProcedure: React.FC<StoredProcedureProps> = ({
  procName = 'deduct_render_credit(user_uuid, cost_int)',
  parameters = 'IN user_id UUID, IN credits_to_deduct INT',
  returns = 'RETURNS BOOLEAN (ATOMIC TRANSACTION)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          STORED PROCEDURE / FUNCTION
        </span>
        <span className="text-white/40">PL/PGSQL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">⚙ {procName}</div>
          <div className="text-xs text-amber-400 mt-0.5">{returns}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs space-y-1 my-2">
          <div className="text-white/40 text-[10px]">ARGUMENTS:</div>
          <div className="text-white/90">{parameters}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TRANSACTION ISOLATION: SERIALIZABLE</span>
        <span>ATOMIC COMMIT</span>
      </div>
    </div>
  );
};
