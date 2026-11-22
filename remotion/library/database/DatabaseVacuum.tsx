import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseVacuumProps {
  tableName?: string;
  deadTuplesPurged?: number;
  spaceReclaimed?: string;
  className?: string;
}

export const DatabaseVacuum: React.FC<DatabaseVacuumProps> = ({
  tableName = 'render_jobs',
  deadTuplesPurged = 42800,
  spaceReclaimed = '340 MB',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          VACUUM ANALYZE
        </span>
        <span className="text-teal-400 font-bold">HEAP CLEANUP</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">VACUUM (ANALYZE) {tableName};</div>
          <div className="text-xs text-teal-300 mt-0.5">Reclaiming space from dead MVCC tuples</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">DEAD TUPLES</div>
            <div className="text-xs font-bold text-rose-400 mt-1">-{deadTuplesPurged.toLocaleString()} Purged</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">DISK FREED</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">+{spaceReclaimed}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>VISIBILITY MAP UPDATED</span>
        <span>INDEX STATS RECOMPUTED</span>
      </div>
    </div>
  );
};
