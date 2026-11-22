import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLHavingFilterProps {
  havingClause?: string;
  className?: string;
}

export const SQLHavingFilter: React.FC<SQLHavingFilterProps> = ({
  havingClause = 'HAVING COUNT(r.id) >= 100',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAVING AGGREGATE FILTER
        </span>
        <span className="text-amber-400 font-bold">POST-GROUP FILTER</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Filter On Aggregated Groups</div>
          <div className="text-xs text-amber-400 mt-1">{havingClause}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          <div className="text-[10px] text-white/40 mb-1">EXECUTION ORDER:</div>
          <div>FROM → WHERE → GROUP BY → <span className="text-amber-400 font-bold">HAVING</span> → SELECT → ORDER BY</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FILTERS GROUPS, NOT INDIVIDUAL ROWS</span>
        <span>SQL PIPELINE STAGE 4</span>
      </div>
    </div>
  );
};
