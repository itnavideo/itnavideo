import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TableTruncateProps {
  tableName?: string;
  durationMs?: number;
  className?: string;
}

export const TableTruncate: React.FC<TableTruncateProps> = ({
  tableName = 'temp_render_frames',
  durationMs = 2.4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          TRUNCATE TABLE
        </span>
        <span className="text-white/40">INSTANT PURGE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-rose-500/40 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">TRUNCATE TABLE {tableName} RESTART IDENTITY;</div>
          <div className="text-xs text-rose-400 mt-1">Direct OS file extent deallocation ({durationMs}ms)</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Deallocates storage without scanning rows or generating massive WAL records.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>AUTO-RESETS SEQUENCE COUNTERS</span>
        <span>DDL TRANSACTIONAL IN POSTGRES</span>
      </div>
    </div>
  );
};
