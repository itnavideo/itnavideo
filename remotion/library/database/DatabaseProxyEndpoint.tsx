import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseProxyEndpointProps {
  proxyName?: string;
  clientConnectionsCount?: number;
  backendServerConnectionsCount?: number;
  connectionEfficiencyPercent?: number;
  className?: string;
}

export const DatabaseProxyEndpoint: React.FC<DatabaseProxyEndpointProps> = ({
  proxyName = "aws-rds-proxy-production-pg",
  clientConnectionsCount = 3850,
  backendServerConnectionsCount = 64,
  connectionEfficiencyPercent = 98.3,
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
            DATABASE PROXY POOLER (RDS PROXY)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {connectionEfficiencyPercent}% POOL REDUCTION
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="text-[10px] text-amber-400 uppercase">Client Incoming Lambdas</div>
          <div className="text-white font-bold text-lg mt-1">{clientConnectionsCount.toLocaleString()} Conns</div>
          <div className="text-[10px] text-zinc-500">Short-lived serverless invocations</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase">DB Core Direct Conns</div>
          <div className="text-emerald-300 font-bold text-lg mt-1">{backendServerConnectionsCount} Clean Conns</div>
          <div className="text-[10px] text-zinc-500">Zero backend memory saturation</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Proxy: {proxyName}</span>
        <span className="text-sky-300 font-bold">Instant Failover Preservation</span>
      </div>
    </div>
  );
};
