import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NewSQLDistributedACIDCardProps {
  engineName?: string;
  consensusType?: string;
  clockSyncType?: string;
  globalSLA?: string;
  className?: string;
}

export const NewSQLDistributedACIDCard: React.FC<NewSQLDistributedACIDCardProps> = ({
  engineName = "CockroachDB / Google Cloud Spanner",
  consensusType = "Multi-Raft Consensus Groups",
  clockSyncType = "TrueTime (Atomic Clocks + GPS) / HLC",
  globalSLA = "99.999% Global Uptime",
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
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            DISTRIBUTED NewSQL (GLOBAL ACID)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {globalSLA}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-indigo-300 font-bold">Serializable ACID Across Continents</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Consensus Layer</div>
          <div className="text-white font-bold text-xs mt-1">{consensusType}</div>
          <div className="text-[10px] text-zinc-500">Autonomous range rebalancing</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Clock Synchronization</div>
          <div className="text-sky-300 font-bold text-xs mt-1">{clockSyncType}</div>
          <div className="text-[10px] text-zinc-500">Sub-millisecond skew bound</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>No Single Point of Failure (Survivable Failover)</span>
      </div>
    </div>
  );
};
