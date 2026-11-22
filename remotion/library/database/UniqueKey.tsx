import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface UniqueKeyProps {
  columnName?: string;
  constraintName?: string;
  className?: string;
}

export const UniqueKey: React.FC<UniqueKeyProps> = ({
  columnName = 'email',
  constraintName = 'uq_users_email',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          UNIQUE KEY CONSTRAINT
        </span>
        <span className="text-emerald-400 font-bold">ZERO DUPLICATES</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-base font-bold text-white">{columnName}</div>
            <div className="text-xs text-white/50">{constraintName}</div>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-600">
            UNIQUE (ALLOWS NULL)
          </span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          CONSTRAINT: Prevents duplicate email accounts across entire SaaS database.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>POSTGRES UNIQUE INDEX CREATED</span>
        <span>COLLISION PROOF</span>
      </div>
    </div>
  );
};
