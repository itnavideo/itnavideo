import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SlowQueryLogProps {
  query?: string;
  durationMs?: number;
  thresholdMs?: number;
  rowsExamined?: number;
  rowsSent?: number;
  database?: string;
  clientIp?: string;
  className?: string;
}

export const SlowQueryLog: React.FC<SlowQueryLogProps> = ({
  query = "SELECT * FROM orders WHERE status = 'pending' AND created_at >= NOW() - INTERVAL '7 days';",
  durationMs = 4850,
  thresholdMs = 1000,
  rowsExamined = 1250400,
  rowsSent = 42,
  database = "production_db",
  clientIp = "10.0.4.182",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 6) * 0.15 + 0.85;
  const isSlow = durationMs > thresholdMs;

  return (
    <div
      className={`relative p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" style={{ opacity: pulse }} />
          <span className="font-mono text-sm tracking-widest uppercase text-amber-400 font-bold">
            SLOW QUERY DETECTED
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
            {database}
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-zinc-400">
          <span>Client: {clientIp}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 mb-4 font-mono text-xs text-zinc-200 overflow-x-auto">
        <code>{query}</code>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="text-[10px] uppercase text-zinc-400 mb-1">Execution Time</div>
          <div className="text-xl font-bold text-amber-400">{(durationMs / 1000).toFixed(2)}s</div>
          <div className="text-[10px] text-zinc-500">Threshold: {thresholdMs}ms</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400 mb-1">Rows Examined</div>
          <div className="text-xl font-bold text-red-400">{rowsExamined.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Full scan alert</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400 mb-1">Rows Returned</div>
          <div className="text-xl font-bold text-emerald-400">{rowsSent.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Efficiency: {((rowsSent / rowsExamined) * 100).toFixed(4)}%</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-center">
          <div className="text-[10px] uppercase text-zinc-400 mb-1">Action Required</div>
          <span className="text-xs font-semibold text-sky-400 flex items-center space-x-1">
            <span>Add Index (status)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
