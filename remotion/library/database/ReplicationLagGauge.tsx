import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ReplicationLagGaugeProps {
  lagMs?: number;
  replicaHost?: string;
  bytesBehindPrimary?: number;
  syncMode?: string;
  className?: string;
}

export const ReplicationLagGauge: React.FC<ReplicationLagGaugeProps> = ({
  lagMs = 45,
  replicaHost = "db-replica-us-west",
  bytesBehindPrimary = 1420000,
  syncMode = "Async Streaming",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animLag = interpolate(frame, [0, 40], [0, lagMs], { extrapolateRight: 'clamp' });
  const isHealthy = animLag < 100;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            REPLICATION LAG GAUGE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {replicaHost}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{animLag.toFixed(0)} ms</span>
          <span className="text-xs text-zinc-400 ml-2">Replication Delay</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${isHealthy ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' : 'bg-red-950 text-red-300'}`}>
          {isHealthy ? 'IN SYNC' : 'LAG BEHIND'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Bytes Behind Primary</div>
          <div className="text-zinc-200 font-bold text-base mt-1">{(bytesBehindPrimary / 1024 / 1024).toFixed(2)} MB</div>
          <div className="text-[10px] text-zinc-500">WAL queue size</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Replication Mode</div>
          <div className="text-sky-400 font-bold text-base mt-1">{syncMode}</div>
          <div className="text-[10px] text-zinc-500">Zero packet loss</div>
        </div>
      </div>
    </div>
  );
};
