import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FullDatabaseDumpProps {
  databaseName?: string;
  totalTables?: number;
  totalRowsMillion?: number;
  compressionRatio?: string;
  dumpThroughputMBps?: number;
  className?: string;
}

export const FullDatabaseDump: React.FC<FullDatabaseDumpProps> = ({
  databaseName = "production_cluster_db",
  totalTables = 184,
  totalRowsMillion = 42.8,
  compressionRatio = "3.8x (zstd-19)",
  dumpThroughputMBps = 185.4,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animTables = interpolate(frame, [0, 40], [0, totalTables], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            FULL LOGICAL BACKUP DUMP
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {databaseName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animTables.toFixed(0)}</span>
          <span className="text-xs text-zinc-400 ml-2">/ {totalTables} Tables Dumped</span>
        </div>
        <span className="text-xs font-bold text-sky-400 font-mono">
          {totalRowsMillion}M Total Rows
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Compression Ratio</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{compressionRatio}</div>
          <div className="text-[10px] text-zinc-500">Fast high-ratio compressor</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Export Throughput</div>
          <div className="text-sky-400 font-bold text-base mt-1">{dumpThroughputMBps} MB/s</div>
          <div className="text-[10px] text-zinc-500">Parallel pg_dump workers</div>
        </div>
      </div>
    </div>
  );
};
