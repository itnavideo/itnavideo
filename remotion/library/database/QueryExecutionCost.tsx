import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface QueryExecutionCostProps {
  planNode?: string;
  startupCost?: number;
  totalCost?: number;
  planningTimeMs?: number;
  executionTimeMs?: number;
  actualRows?: number;
  loops?: number;
  className?: string;
}

export const QueryExecutionCost: React.FC<QueryExecutionCostProps> = ({
  planNode = "Hash Aggregate (cost=12450.80..12580.20 rows=450 width=32)",
  startupCost = 12450.8,
  totalCost = 12580.2,
  planningTimeMs = 1.45,
  executionTimeMs = 348.2,
  actualRows = 450,
  loops = 1,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const costProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs tracking-wider uppercase text-indigo-400 font-bold">
            EXPLAIN ANALYZE METRICS
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
          Loops: {loops}
        </span>
      </div>

      <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 mb-4 font-mono text-xs text-indigo-300">
        <code>{planNode}</code>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono mb-4">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Startup Cost</div>
          <div className="text-lg font-bold text-zinc-200">{(startupCost * costProgress).toFixed(1)}</div>
        </div>
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="text-[10px] uppercase text-zinc-400">Total Plan Cost</div>
          <div className="text-lg font-bold text-indigo-400">{(totalCost * costProgress).toFixed(1)}</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Planning Time</div>
          <div className="text-lg font-bold text-emerald-400">{planningTimeMs} ms</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Execution Time</div>
          <div className="text-lg font-bold text-amber-400">{executionTimeMs} ms</div>
        </div>
      </div>

      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${Math.min(100, (executionTimeMs / 500) * 100 * costProgress)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
        <span>Fast (&lt;100ms)</span>
        <span>Target: 200ms</span>
        <span>Degraded (&gt;500ms)</span>
      </div>
    </div>
  );
};
