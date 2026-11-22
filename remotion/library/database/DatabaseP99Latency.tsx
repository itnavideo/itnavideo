import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseP99LatencyProps {
  p50Ms?: number;
  p90Ms?: number;
  p95Ms?: number;
  p99Ms?: number;
  p999Ms?: number;
  serviceName?: string;
  className?: string;
}

export const DatabaseP99Latency: React.FC<DatabaseP99LatencyProps> = ({
  p50Ms = 2.1,
  p90Ms = 7.4,
  p95Ms = 14.8,
  p99Ms = 48.2,
  p999Ms = 180.5,
  serviceName = "Checkout API Cluster",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animP99 = interpolate(frame, [0, 45], [0, p99Ms], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            LATENCY PERCENTILE DISTRIBUTION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {serviceName}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{animP99.toFixed(1)} ms</span>
          <span className="text-xs text-zinc-400 ml-2">P99 Tail Latency</span>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          SLA MET (&lt;50ms)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 font-mono text-center text-xs">
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">P50</div>
          <div className="text-emerald-400 font-bold mt-1">{p50Ms}ms</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">P90</div>
          <div className="text-emerald-400 font-bold mt-1">{p90Ms}ms</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">P95</div>
          <div className="text-sky-400 font-bold mt-1">{p95Ms}ms</div>
        </div>
        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
          <div className="text-[10px] text-amber-400 font-bold">P99</div>
          <div className="text-amber-400 font-bold mt-1">{p99Ms}ms</div>
        </div>
        <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30">
          <div className="text-[10px] text-red-400 font-bold">P99.9</div>
          <div className="text-red-400 font-bold mt-1">{p999Ms}ms</div>
        </div>
      </div>
    </div>
  );
};
