import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GlobalDatabaseReplicationProps {
  primaryRegion?: string;
  secondaryRegions?: string[];
  crossRegionLagSec?: number;
  className?: string;
}

export const GlobalDatabaseReplication: React.FC<GlobalDatabaseReplicationProps> = ({
  primaryRegion = "us-east-1 (N. Virginia - Writer)",
  secondaryRegions = ["eu-west-1 (Dublin)", "ap-southeast-1 (Singapore)", "sa-east-1 (São Paulo)"],
  crossRegionLagSec = 0.85,
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
            GLOBAL DATABASE REPLICATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          &lt;1s GLOBAL SYNC
        </span>
      </div>

      <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 font-mono text-xs mb-3">
        <div className="text-[10px] text-indigo-400 uppercase mb-0.5">Primary Authoritative Writer</div>
        <div className="text-white font-bold">{primaryRegion}</div>
      </div>

      <div className="space-y-1.5 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase">Synchronized Read Regions ({secondaryRegions.length})</div>
        {secondaryRegions.map((reg, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex justify-between">
            <span className="text-zinc-300">{reg}</span>
            <span className="text-emerald-400 font-bold">SYNCED</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Storage Layer Physical Sync</span>
        <span className="text-indigo-300 font-bold">Latency: {crossRegionLagSec}s</span>
      </div>
    </div>
  );
};
