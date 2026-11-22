import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLDeleteStatementProps {
  tableName?: string;
  whereClause?: string;
  purgedRows?: number;
  className?: string;
}

export const SQLDeleteStatement: React.FC<SQLDeleteStatementProps> = ({
  tableName = 'temp_renders',
  whereClause = 'created_at < NOW() - INTERVAL '48 HOURS'',
  purgedRows = 428,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          DELETE STATEMENT
        </span>
        <span className="text-red-400 font-bold">-{purgedRows} ROWS PURGED</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
        <div>
          <span className="text-red-400 font-black">DELETE FROM</span>{' '}
          <span className="text-white font-bold">{tableName}</span>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-red-500/40 my-2">
          <span className="text-amber-400 font-black">WHERE</span>{' '}
          <span className="text-white">{whereClause};</span>
        </div>

        <div className="text-red-400 font-bold">VACUUM RECLAIMS DEAD TUPLES</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREVENTS TABLE BLOAT</span>
        <span>S3 LIFECYCLE 48H POLICY</span>
      </div>
    </div>
  );
};
