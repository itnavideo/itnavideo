import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WALArchiveFlushProps {
  segmentFile?: string;
  targetStorage?: string;
  className?: string;
}

export const WALArchiveFlush: React.FC<WALArchiveFlushProps> = ({
  segmentFile = '00000001000000000000002A (16MB)',
  targetStorage = 's3://itnavideo-db-wal-archive/wal/',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          WAL ARCHIVE FLUSH
        </span>
        <span className="text-emerald-400 font-bold">ARCHIVED</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">archive_command = 'aws s3 cp %p s3://...'</div>
          <div className="text-xs text-blue-300 mt-1">Archived: {segmentFile}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2 truncate">
          Destination: {targetStorage}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONTINUOUS CLOUD ARCHIVE</span>
        <span>PITR RECOVERY ASSURED</span>
      </div>
    </div>
  );
};
