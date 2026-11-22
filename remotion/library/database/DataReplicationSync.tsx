import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DataReplicationSyncProps {
  syncState?: string;
  byteLag?: number;
  className?: string;
}

export const DataReplicationSync: React.FC<DataReplicationSyncProps> = ({
  syncState = 'Streaming (Synchronous Commit)',
  byteLag = 0,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          PHYSICAL REPLICATION SYNC
        </span>
        <span className="text-emerald-400 font-bold">0 BYTE LAG</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">{syncState}</div>
          <div className="text-xs text-emerald-300 mt-1">WAL sender and receiver threads in lockstep</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Replica has confirmed flush of all primary transactions. RPO = 0.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SYNCHRONOUS REPLICATION</span>
        <span>DATA LOSS IMPOSSIBLE</span>
      </div>
    </div>
  );
};
