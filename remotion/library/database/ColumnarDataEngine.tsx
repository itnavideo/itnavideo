import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ColumnarDataEngineProps {
  compressionRatio?: string;
  scanSpeed?: string;
  className?: string;
}

export const ColumnarDataEngine: React.FC<ColumnarDataEngineProps> = ({
  compressionRatio = '10x Compression (Snappy/ZSTD)',
  scanSpeed = '1.2 Billion Rows / Sec',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          COLUMNAR OLAP ENGINE
        </span>
        <span className="text-white/40">VECTORIZED EXECUTION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">ClickHouse / Parquet Column Storage</div>
          <div className="text-xs text-amber-400 mt-0.5">{scanSpeed}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">COMPRESSION</div>
            <div className="text-xs font-bold text-white mt-1">{compressionRatio}</div>
          </div>
          <div className="p-3 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40">CPU OPTIMIZATION</div>
            <div className="text-xs font-bold text-amber-300 mt-1">SIMD Vector Instructions</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ANALYTICS ACCELERATION: 100x</span>
        <span>COLUMN STRIPING ACTIVE</span>
      </div>
    </div>
  );
};
