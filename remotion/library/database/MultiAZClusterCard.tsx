import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiAZClusterCardProps {
  primaryAZ?: string;
  standbyAZ?: string;
  replicationType?: string;
  failoverSLA?: string;
  className?: string;
}

export const MultiAZClusterCard: React.FC<MultiAZClusterCardProps> = ({
  primaryAZ = "us-east-1a (Active Primary)",
  standbyAZ = "us-east-1b (Sync Standby)",
  replicationType = "Synchronous Physical Block Replication",
  failoverSLA = "< 60s Automated Failover",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            MULTI-AZ HIGH AVAILABILITY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          99.95% SLA
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase block">Primary Node</span>
            <span className="text-white font-bold">{primaryAZ}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">R/W</span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Standby Replica</span>
            <span className="text-zinc-300 font-bold">{standbyAZ}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">SYNC STANDBY</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>{replicationType}</span>
        <span className="text-emerald-400 font-bold">{failoverSLA}</span>
      </div>
    </div>
  );
};
