import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ThroughputQPSCounterProps {
  currentQPS?: number;
  currentTPS?: number;
  peakQPS?: number;
  avgLatencyMs?: number;
  className?: string;
}

export const ThroughputQPSCounter: React.FC<ThroughputQPSCounterProps> = ({
  currentQPS = 16450,
  currentTPS = 2850,
  peakQPS = 24000,
  avgLatencyMs = 2.4,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animQPS = interpolate(frame, [0, 45], [0, currentQPS], { extrapolateRight: 'clamp' });
  const animTPS = interpolate(frame, [0, 45], [0, currentTPS], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            DATABASE THROUGHPUT ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Peak: {peakQPS.toLocaleString()} QPS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono mb-4">
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
          <div className="text-xs text-zinc-400 uppercase">Queries / Sec (QPS)</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{animQPS.toFixed(0)}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Read + Write queries</div>
        </div>

        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/20">
          <div className="text-xs text-zinc-400 uppercase">Transactions / Sec (TPS)</div>
          <div className="text-3xl font-extrabold text-sky-400 mt-1">{animTPS.toFixed(0)}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Committed transactions</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
        <span>Average Query Latency:</span>
        <span className="text-emerald-400 font-bold">{avgLatencyMs} ms</span>
      </div>
    </div>
  );
};
