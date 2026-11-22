import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FailoverClusterProps {
  primaryStatus?: string;
  standbyStatus?: string;
  heartbeatMs?: number;
  className?: string;
}

export const FailoverCluster: React.FC<FailoverClusterProps> = ({
  primaryStatus = 'Primary (Leader Online)',
  standbyStatus = 'Hot Standby (Sync Replicated)',
  heartbeatMs = 500,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          AUTOMATIC FAILOVER CLUSTER
        </span>
        <span className="text-emerald-400 font-bold">RTO &lt; 15s</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-between space-x-3 font-mono">
        <div className="flex-1 p-4 bg-zinc-900 border border-emerald-500/40 rounded-xl text-center">
          <div className="text-xs text-white/40 font-bold">NODE A</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">{primaryStatus}</div>
          <div className="text-[10px] text-white/50 mt-1">HEALTH: 100% OK</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-white/40">HEARTBEAT</span>
          <div className="w-12 h-0.5 bg-rose-500 animate-pulse my-1" />
          <span className="text-[9px] text-rose-400">{heartbeatMs}ms PING</span>
        </div>

        <div className="flex-1 p-4 bg-zinc-900 border border-white/15 rounded-xl text-center">
          <div className="text-xs text-white/40 font-bold">NODE B</div>
          <div className="text-sm font-bold text-sky-400 mt-1">{standbyStatus}</div>
          <div className="text-[10px] text-white/50 mt-1">READY TO PROMOTE</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FAILOVER QUORUM: ETCD / PATRONI</span>
        <span>SPLIT-BRAIN FENCING: ACTIVE</span>
      </div>
    </div>
  );
};
