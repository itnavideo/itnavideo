import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CheckpointFlushProps {
  dirtyBuffers?: number;
  syncTimeSec?: number;
  className?: string;
}

export const CheckpointFlush: React.FC<CheckpointFlushProps> = ({
  dirtyBuffers = 1420,
  syncTimeSec = 3.8,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          CHECKPOINT FLUSH
        </span>
        <span className="text-white/40">BUFFER SYNC</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">CHECKPOINT; (Dirty Pages to Disk)</div>
          <div className="text-xs text-indigo-300 mt-0.5">{dirtyBuffers} Dirty Pages Written & Fsynced</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          Sync Time: {syncTimeSec}s • Sets recovery safe-point for crash recovery restarts.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SPREAD CHECKPOINTS: 0.9 COMPLETION</span>
        <span>ZERO IO SPIKES</span>
      </div>
    </div>
  );
};
