import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface QueryLatencyScatterPlotProps {
  totalQueriesSampled?: number;
  p95Ms?: number;
  p99Ms?: number;
  breachCount?: number;
  className?: string;
}

export const QueryLatencyScatterPlot: React.FC<QueryLatencyScatterPlotProps> = ({
  totalQueriesSampled = 5000,
  p95Ms = 18.4,
  p99Ms = 48.2,
  breachCount = 14,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            QUERY LATENCY SCATTER PLOT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {totalQueriesSampled.toLocaleString()} Samples
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">P95 Latency</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">{p95Ms} ms</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">P99 Latency</div>
          <div className="text-sky-400 font-bold text-sm mt-1">{p99Ms} ms</div>
        </div>
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20">
          <div className="text-[10px] text-red-400">SLA Breaches</div>
          <div className="text-red-400 font-bold text-sm mt-1">{breachCount} spikes</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>SLA Threshold: 100 ms</span>
        <span className="text-emerald-400 font-bold">99.72% Under Budget</span>
      </div>
    </div>
  );
};
