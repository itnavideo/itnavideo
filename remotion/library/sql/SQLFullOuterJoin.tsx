import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLFullOuterJoinProps {
  tableA?: string;
  tableB?: string;
  onClause?: string;
  className?: string;
}

export const SQLFullOuterJoin: React.FC<SQLFullOuterJoinProps> = ({
  tableA = 'subscriptions s',
  tableB = 'invoices i',
  onClause = 's.id = i.sub_id',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          FULL OUTER JOIN (⟗)
        </span>
        <span className="text-purple-400 font-bold">A ∪ B COMPLETE UNION</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="relative w-44 h-24 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-purple-400 bg-purple-500/40 absolute left-2 flex items-center pl-3" />
          <div className="w-24 h-24 rounded-full border-2 border-indigo-400 bg-indigo-500/40 absolute right-2 flex items-center justify-end pr-3" />
          <span className="text-[10px] font-black text-white z-10 drop-shadow">ALL A + ALL B</span>
        </div>

        <div className="text-xs text-center text-white/90">
          <span className="text-purple-400 font-black">FROM</span> {tableA}{' '}
          <span className="text-purple-400 font-black">FULL OUTER JOIN</span> {tableB}{' '}
          <span className="text-purple-400 font-black">ON</span> <span className="text-purple-300 font-bold">{onClause}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PRESERVES ORPHANS FROM BOTH SIDES</span>
        <span>MAXIMUM DATA RETENTION</span>
      </div>
    </div>
  );
};
