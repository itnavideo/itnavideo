import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLSelectClauseProps {
  columns?: string[];
  fromTable?: string;
  className?: string;
}

export const SQLSelectClause: React.FC<SQLSelectClauseProps> = ({
  columns = ['id', 'user_id', 'status', 'created_at'],
  fromTable = 'render_jobs',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          SELECT PROJECTION
        </span>
        <span className="text-white/40">{columns.length} COLUMNS PROJECTED</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="text-sm">
          <span className="text-blue-400 font-black">SELECT</span>{' '}
          <span className="text-emerald-400 font-bold">{columns.join(', ')}</span>{' '}
          <span className="text-blue-400 font-black">FROM</span>{' '}
          <span className="text-white font-bold">{fromTable};</span>
        </div>

        <div className="flex items-center space-x-2 my-2 overflow-x-auto">
          {columns.map((col, i) => (
            <div key={i} className="flex-1 p-2 bg-zinc-950 rounded border border-blue-500/40 text-center">
              <span className="text-[9px] text-white/40">COL {i + 1}</span>
              <div className="text-xs font-bold text-blue-300 mt-0.5 truncate">{col}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>VERTICAL PROJECTION FILTER</span>
          <span className="text-emerald-400 font-bold">MEMORY SAVINGS: 68%</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREVENTS SELECT * ANTI-PATTERN</span>
        <span>INDEX-ONLY SCAN READY</span>
      </div>
    </div>
  );
};
