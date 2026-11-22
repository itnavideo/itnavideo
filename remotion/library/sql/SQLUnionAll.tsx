import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLUnionAllProps {
  queryA?: string;
  queryB?: string;
  operator?: 'UNION' | 'UNION ALL';
  className?: string;
}

export const SQLUnionAll: React.FC<SQLUnionAllProps> = ({
  queryA = 'SELECT id, email FROM active_users',
  queryB = 'SELECT id, email FROM archived_users',
  operator = 'UNION ALL',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          SET OPERATOR: {operator}
        </span>
        <span className="text-emerald-400 font-bold">FAST CONCAT</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
        <div className="p-2.5 bg-zinc-950 rounded border border-white/10">{queryA}</div>
        <div className="text-center font-black text-amber-400 my-1">{operator}</div>
        <div className="p-2.5 bg-zinc-950 rounded border border-white/10">{queryB}</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>UNION ALL SKIPS DEDUPLICATION (FASTER)</span>
        <span>MATCHING COLUMN SCHEMA</span>
      </div>
    </div>
  );
};
