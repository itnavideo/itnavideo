import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLUpdateStatementProps {
  tableName?: string;
  setClause?: string;
  whereClause?: string;
  className?: string;
}

export const SQLUpdateStatement: React.FC<SQLUpdateStatementProps> = ({
  tableName = 'render_jobs',
  setClause = "status = 'COMPLETED', progress = 100",
  whereClause = "id = 'f81d4fae-7dec-11d0'",
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          UPDATE STATEMENT
        </span>
        <span className="text-sky-400 font-bold">IN-PLACE MUTATION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
        <div>
          <span className="text-sky-400 font-black">UPDATE</span>{' '}
          <span className="text-white font-bold">{tableName}</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded border border-sky-500/40 my-1">
          <span className="text-sky-400 font-black">SET</span>{' '}
          <span className="text-white">{setClause}</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded border border-white/10">
          <span className="text-amber-400 font-black">WHERE</span>{' '}
          <span className="text-white">{whereClause}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>HOT UPDATE (HEAP-ONLY TUPLE) OPTIMIZATION</span>
        <span>ROW LOCK: FOR UPDATE</span>
      </div>
    </div>
  );
};
