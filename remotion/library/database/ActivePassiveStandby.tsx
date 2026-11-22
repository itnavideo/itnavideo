import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ActivePassiveStandbyProps {
  primaryNode?: string;
  standbyNode?: string;
  replicationLagMs?: number;
  syncState?: string;
  className?: string;
}

export const ActivePassiveStandby: React.FC<ActivePassiveStandbyProps> = ({
  primaryNode = "db-node-primary-01",
  standbyNode = "db-node-standby-02",
  replicationLagMs = 12,
  syncState = "SYNCHRONOUS_REPLICATION",
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
            ACTIVE-PASSIVE STANDBY CLUSTER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {syncState}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Primary (Read/Write)</div>
          <div className="text-white font-bold text-sm mt-1">{primaryNode}</div>
        </div>

        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 uppercase">Passive Standby (Read-Only)</div>
          <div className="text-sky-300 font-bold text-sm mt-1">{standbyNode}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Replication Lag: <span className="text-emerald-400 font-bold">{replicationLagMs} ms</span></span>
        <span className="text-sky-300 font-bold">Hot Standby Ready</span>
      </div>
    </div>
  );
};
