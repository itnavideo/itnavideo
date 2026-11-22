import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RowFetchEfficiencyProps {
  rowsExamined?: number;
  rowsReturned?: number;
  queryTag?: string;
  className?: string;
}

export const RowFetchEfficiency: React.FC<RowFetchEfficiencyProps> = ({
  rowsExamined = 540000,
  rowsReturned = 14,
  queryTag = "GET /api/v1/analytics/reports",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const efficiency = (rowsReturned / rowsExamined) * 100;
  const isSevere = efficiency < 0.1;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            ROW SCAN EFFICIENCY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {queryTag}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-red-400">{efficiency.toFixed(4)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Filtering Efficiency</span>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-red-950 text-red-300 border border-red-500/20 font-bold uppercase">
          {isSevere ? 'SEVERE OVER-FETCH' : 'EFFICIENT'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Rows Scanned / Examined</div>
          <div className="text-red-400 font-bold text-base mt-1">{rowsExamined.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">99.99% filtered out</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Rows Returned to Client</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{rowsReturned.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Actual payload needed</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between border-t border-zinc-800 pt-2">
        <span>Recommendation:</span>
        <span className="text-sky-400 font-semibold">Create composite index covering WHERE filter</span>
      </div>
    </div>
  );
};
