import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface WriteAheadLogProps {
  currentLsn?: string;
  flushedLsn?: string;
  className?: string;
}

export const WriteAheadLog: React.FC<WriteAheadLogProps> = ({
  currentLsn = '0/18A42F0',
  flushedLsn = '0/18A42F0',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          WRITE-AHEAD LOG (WAL)
        </span>
        <span className="text-white/40">DURABILITY ENGINE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">Append-Only Transaction Log</div>
            <div className="text-xs text-amber-400 mt-0.5">Log Sequence Number: {currentLsn}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/40">
            FSYNC COMMITTED
          </span>
        </div>

        <div className="flex items-center space-x-1.5 my-3 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 p-2 bg-zinc-950 rounded border border-white/10 text-center">
              <div className="text-[9px] text-white/40">RECORD {i + 1}</div>
              <div className="text-[11px] font-bold text-amber-300 mt-0.5">TX_COMMIT</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>CHECKPOINT INTERVAL: 5 MIN</span>
          <span className="text-emerald-400">FLUSHED LSN: {flushedLsn}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ACID 'D' (DURABILITY) GUARANTEE</span>
        <span>ZERO IN-MEMORY DATA LOSS</span>
      </div>
    </div>
  );
};
