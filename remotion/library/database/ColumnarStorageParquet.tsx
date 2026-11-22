import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ColumnarStorageParquetProps {
  rowGroupsCount?: number;
  columnsStored?: number;
  compressionRatio?: string;
  olapSpeedup?: string;
  className?: string;
}

export const ColumnarStorageParquet: React.FC<ColumnarStorageParquetProps> = ({
  rowGroupsCount = 24,
  columnsStored = 48,
  compressionRatio = "6.2x (Snappy + Dictionary)",
  olapSpeedup = "100x Faster Analytical Aggregations",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            COLUMNAR OLAP STORAGE (PARQUET)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {olapSpeedup}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Row Groups Chunking</div>
          <div className="text-white font-bold text-base mt-1">{rowGroupsCount} Groups (1M rows each)</div>
          <div className="text-[10px] text-zinc-500">Column striping on disk</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Columnar Compression</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{compressionRatio}</div>
          <div className="text-[10px] text-zinc-500">Run-length + Bit-packing</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Disk I/O Pruned: Only queried columns scanned from storage</span>
      </div>
    </div>
  );
};
