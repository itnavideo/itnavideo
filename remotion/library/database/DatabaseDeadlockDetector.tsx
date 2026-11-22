import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseDeadlockDetectorProps {
  victimTx?: string;
  resolution?: string;
  className?: string;
}

export const DatabaseDeadlockDetector: React.FC<DatabaseDeadlockDetectorProps> = ({
  victimTx = 'Transaction 4092 (Lock Wait Timeout)',
  resolution = 'Deadlock Detected — Aborted victim process cleanly',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          DEADLOCK DETECTOR
        </span>
        <span className="text-rose-400 font-bold">WAIT-FOR GRAPH</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">Directed Cycle Detected in Lock Graph</div>
          <div className="text-xs text-rose-400 mt-0.5">{victimTx}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs text-white/80 my-2">
          <div className="text-emerald-400 font-bold text-[10px] mb-1">AUTOMATED HEALING:</div>
          <div>{resolution}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DEADLOCK TIMEOUT: 1000ms</span>
        <span>ZERO HANG / FREEZE</span>
      </div>
    </div>
  );
};
