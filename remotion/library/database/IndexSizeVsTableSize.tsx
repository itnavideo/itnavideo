import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IndexSizeVsTableSizeProps {
  tableDataGB?: number;
  indexDataGB?: number;
  indexToDataRatio?: number;
  className?: string;
}

export const IndexSizeVsTableSize: React.FC<IndexSizeVsTableSizeProps> = ({
  tableDataGB = 420,
  indexDataGB = 280,
  indexToDataRatio = 66.7,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            INDEX VS TABLE STORAGE FOOTPRINT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Ratio: {indexToDataRatio}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Heap Table Data</div>
          <div className="text-white font-bold text-lg mt-1">{tableDataGB} GB</div>
          <div className="text-[10px] text-zinc-500">60% of total volume</div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
          <div className="text-[10px] text-indigo-400 uppercase">Indexes Total</div>
          <div className="text-indigo-300 font-bold text-lg mt-1">{indexDataGB} GB</div>
          <div className="text-[10px] text-zinc-500">40% of total volume</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Optimization: Check unused indexes (pg_stat_user_indexes)</span>
      </div>
    </div>
  );
};
