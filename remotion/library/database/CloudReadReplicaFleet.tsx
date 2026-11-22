import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudReadReplicaFleetProps {
  replicaNodesCount?: number;
  totalReaderQPS?: number;
  avgReplicaLagMs?: number;
  endpointDNS?: string;
  className?: string;
}

export const CloudReadReplicaFleet: React.FC<CloudReadReplicaFleetProps> = ({
  replicaNodesCount = 5,
  totalReaderQPS = 48200,
  avgReplicaLagMs = 8,
  endpointDNS = "prod-db-ro.cluster-ro-xyz.us-east-1.rds.amazonaws.com",
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
            READ REPLICA AUTO-SCALING FLEET
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          {replicaNodesCount} NODES ACTIVE
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Round-Robin Reader DNS Endpoint</div>
        <code className="text-sky-300 text-[11px]">{endpointDNS}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Reader Throughput</div>
          <div className="text-white font-bold text-base mt-1">{totalReaderQPS.toLocaleString()} QPS</div>
          <div className="text-[10px] text-zinc-500">Offloaded from primary writer</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Replication Delay</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{avgReplicaLagMs} ms Lag</div>
          <div className="text-[10px] text-zinc-500">Asynchronous streaming</div>
        </div>
      </div>
    </div>
  );
};
