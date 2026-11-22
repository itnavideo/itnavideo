import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PrimaryReplicaClusterProps {
  primaryHost?: string;
  replicasCount?: number;
  lagMs?: number;
  className?: string;
}

export const PrimaryReplicaCluster: React.FC<PrimaryReplicaClusterProps> = ({
  primaryHost = 'pg-primary-us-east (Read/Write)',
  replicasCount = 2,
  lagMs = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          PRIMARY / REPLICA CLUSTER
        </span>
        <span className="text-emerald-400 font-bold">REPLICATION HEALTHY</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="px-5 py-2.5 bg-blue-950/80 border border-blue-500/50 rounded-xl text-center shadow-lg">
          <div className="text-xs font-bold text-blue-300">★ {primaryHost}</div>
          <div className="text-[10px] text-white/50">LEADER (WAL STREAMING)</div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-white/40">
          <span>↓ ASYNC WAL STREAM</span>
          <span className="text-emerald-400 font-bold">({lagMs}ms REPLICATION LAG)</span>
          <span>↓</span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {[...Array(replicasCount)].map((_, i) => (
            <div key={i} className="p-2.5 bg-zinc-900 border border-white/10 rounded-lg text-center">
              <div className="text-xs font-bold text-white">Replica #{i + 1} (Read-Only)</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">STANDBY ACTIVE</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>READ TRAFFIC BALANCED: 50/50</span>
        <span>AUTO-PROMOTION ON FAILURE</span>
      </div>
    </div>
  );
};
