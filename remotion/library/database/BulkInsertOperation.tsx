import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BulkInsertOperationProps {
  batchSize?: number;
  ratePerSec?: string;
  className?: string;
}

export const BulkInsertOperation: React.FC<BulkInsertOperationProps> = ({
  batchSize = 50000,
  ratePerSec = '120,000 Rows / Sec',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          BULK INSERT (COPY)
        </span>
        <span className="text-emerald-400 font-bold">STREAMING STREAM</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">COPY render_events FROM STDIN WITH (FORMAT CSV);</div>
          <div className="text-xs text-emerald-400 mt-1">{ratePerSec} Ingestion Rate</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">BATCH CHUNK</div>
            <div className="text-base font-bold text-white mt-0.5">{batchSize.toLocaleString()} Tuples</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-bold">NETWORK OVERHEAD</div>
            <div className="text-base font-bold text-sky-400 mt-0.5">Zero Per-Row RTT</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BINARY PROTOCOL TRANSMISSION</span>
        <span>UNLOGGED TABLE COMPATIBLE</span>
      </div>
    </div>
  );
};
