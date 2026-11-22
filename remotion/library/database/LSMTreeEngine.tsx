import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LSMTreeEngineProps {
  memTableSize?: string;
  sstablesCount?: number;
  className?: string;
}

export const LSMTreeEngine: React.FC<LSMTreeEngineProps> = ({
  memTableSize = '64 MB RAM (Active)',
  sstablesCount = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          LOG-STRUCTURED MERGE (LSM)
        </span>
        <span className="text-white/40">WRITE-OPTIMIZED</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-2 gap-3 items-center font-mono">
        <div className="p-3 bg-violet-950/50 border border-violet-500/50 rounded-xl text-center">
          <div className="text-[10px] text-violet-300 font-bold">MEMTABLE (MEMORY)</div>
          <div className="text-xs font-bold text-white mt-1">{memTableSize}</div>
          <div className="text-[9px] text-emerald-400 mt-1">FAST ZERO-SEEK WRITES</div>
        </div>

        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-bold">SSTABLES (DISK)</div>
          <div className="text-xs font-bold text-sky-400 mt-1">{sstablesCount} Immutable SSTables</div>
          <div className="text-[9px] text-white/60 mt-1">Leveled Compaction</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BLOOM FILTER: ACCELERATED</span>
        <span>ROCKSDB / CASSANDRA CORE</span>
      </div>
    </div>
  );
};
