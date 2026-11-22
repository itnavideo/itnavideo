import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EdgeDatabaseReplicaProps {
  edgeLocation?: string;
  readLatencyMs?: number;
  embeddedEngine?: string;
  className?: string;
}

export const EdgeDatabaseReplica: React.FC<EdgeDatabaseReplicaProps> = ({
  edgeLocation = "fra (Frankfurt Edge Region)",
  readLatencyMs = 1.2,
  embeddedEngine = "Turso libSQL / Cloudflare D1 (SQLite)",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            EDGE-REPLICATED DATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {readLatencyMs} ms EDGE READS
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Nearest Edge POP:</span>
          <span className="text-white font-bold">{edgeLocation}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Underlying Engine:</span>
          <span className="text-purple-300 font-bold">{embeddedEngine}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Global Primary Write Forwarding Enabled</span>
      </div>
    </div>
  );
};
