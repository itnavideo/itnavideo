import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SQLRightJoinProps {
  tableA?: string;
  tableB?: string;
  onClause?: string;
  className?: string;
}

export const SQLRightJoin: React.FC<SQLRightJoinProps> = ({
  tableA = 'render_jobs r',
  tableB = 'users u',
  onClause = 'r.user_id = u.id',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          RIGHT OUTER JOIN (⟖)
        </span>
        <span className="text-teal-400 font-bold">PRESERVES ALL RIGHT ROWS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="relative w-44 h-24 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-zinc-700 bg-zinc-900/60 absolute left-2 flex items-center pl-3">
            <span className="text-[9px] text-white/40">Table A</span>
          </div>
          <div className="w-24 h-24 rounded-full border-2 border-teal-400 bg-teal-500/40 absolute right-2 flex items-center justify-end pr-3 z-10">
            <span className="text-[9px] text-white font-black">ALL B</span>
          </div>
        </div>

        <div className="text-xs text-center text-white/90">
          <span className="text-teal-400 font-black">FROM</span> {tableA}{' '}
          <span className="text-teal-400 font-black">RIGHT JOIN</span> {tableB}{' '}
          <span className="text-teal-400 font-black">ON</span> <span className="text-teal-300 font-bold">{onClause}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>UNMATCHED LEFT FIELDS FILLED WITH NULL</span>
        <span>RIGHT PRESERVING</span>
      </div>
    </div>
  );
};
