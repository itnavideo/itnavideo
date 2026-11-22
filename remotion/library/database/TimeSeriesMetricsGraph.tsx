import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TimeSeriesMetricsGraphProps {
  currentQps?: number;
  avgLatencyMs?: number;
  memoryUsedGB?: number;
  className?: string;
}

export const TimeSeriesMetricsGraph: React.FC<TimeSeriesMetricsGraphProps> = ({
  currentQps = 18450,
  avgLatencyMs = 2.1,
  memoryUsedGB = 24.8,
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
            LIVE METRICS STREAM
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          30s TICK
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Throughput</div>
          <div className="text-sky-400 font-bold text-base mt-1">{currentQps.toLocaleString()} QPS</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Latency</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{avgLatencyMs} ms</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Memory RAM</div>
          <div className="text-purple-400 font-bold text-base mt-1">{memoryUsedGB} GB</div>
        </div>
      </div>
    </div>
  );
};
