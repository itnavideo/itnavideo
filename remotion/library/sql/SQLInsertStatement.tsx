import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLInsertStatementProps {
  tableName?: string;
  columns?: string[];
  values?: string[];
  className?: string;
}

export const SQLInsertStatement: React.FC<SQLInsertStatementProps> = ({
  tableName = 'render_jobs',
  columns = ['id', 'user_id', 'status'],
  values = ['gen_random_uuid()', "'usr_8402'", "'PENDING'"],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          INSERT STATEMENT
        </span>
        <span className="text-emerald-400 font-bold">+1 NEW TUPLE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
        <div>
          <span className="text-emerald-400 font-black">INSERT INTO</span>{' '}
          <span className="text-white font-bold">{tableName} ({columns.join(', ')})</span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-emerald-500/40 my-2">
          <span className="text-emerald-400 font-black">VALUES</span>{' '}
          <span className="text-white">({values.join(', ')})</span>
        </div>

        <div className="text-emerald-400 font-bold">RETURNING id, created_at;</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TUPLE COMMITTED TO HEAP & WAL</span>
        <span>INDEX UPDATED AUTOMATICALLY</span>
      </div>
    </div>
  );
};
