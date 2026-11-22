import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableLockVisualizerProps {
  lockMode?: string;
  tableName?: string;
  className?: string;
}

export const TableLockVisualizer: React.FC<TableLockVisualizerProps> = ({
  lockMode = 'RowExclusiveLock (SELECT FOR UPDATE)',
  tableName = 'user_credits',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center space-x-1.5">
          <span>🔒</span>
          <span>LOCK MANAGER</span>
        </span>
        <span className="text-amber-400 font-bold">ROW LOCK</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">{lockMode}</div>
          <div className="text-xs text-amber-300 mt-0.5">Target: {tableName}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Allows concurrent reads while serializing concurrent balance deductions.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONFLICT MATRIX CHECKED</span>
        <span>ZERO LOCK ESCALATION</span>
      </div>
    </div>
  );
};
