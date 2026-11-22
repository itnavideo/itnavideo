import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLInnerJoinProps {
  tableA?: string;
  tableB?: string;
  onClause?: string;
  className?: string;
}

export const SQLInnerJoin: React.FC<SQLInnerJoinProps> = ({
  tableA = 'users u',
  tableB = 'render_jobs r',
  onClause = 'u.id = r.user_id',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          INNER JOIN (⋈)
        </span>
        <span className="text-indigo-400 font-bold">EXACT MATCH ONLY</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        {/* Venn Diagram */}
        <div className="relative w-44 h-24 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-blue-500/60 bg-blue-950/30 absolute left-2 flex items-center pl-3">
            <span className="text-[9px] text-blue-300 font-bold">Table A</span>
          </div>
          <div className="w-24 h-24 rounded-full border-2 border-purple-500/60 bg-purple-950/30 absolute right-2 flex items-center justify-end pr-3">
            <span className="text-[9px] text-purple-300 font-bold">Table B</span>
          </div>
          {/* Intersection Highlight */}
          <div className="w-8 h-16 rounded-full bg-emerald-500/60 border border-emerald-400 z-10 flex items-center justify-center">
            <span className="text-[8px] font-black text-white">A ∩ B</span>
          </div>
        </div>

        <div className="text-xs text-center text-white/90">
          <span className="text-indigo-400 font-black">FROM</span> {tableA}{' '}
          <span className="text-indigo-400 font-black">INNER JOIN</span> {tableB}{' '}
          <span className="text-indigo-400 font-black">ON</span> <span className="text-emerald-400 font-bold">{onClause}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>EXCLUDES UNMATCHED ORPHANS</span>
        <span>JOIN ALGORITHM: HASH JOIN</span>
      </div>
    </div>
  );
};
