import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseFirewallRulesProps {
  vpcSubnet?: string;
  port?: number;
  blockedAttemptsCount?: number;
  allowlistRulesCount?: number;
  className?: string;
}

export const DatabaseFirewallRules: React.FC<DatabaseFirewallRulesProps> = ({
  vpcSubnet = "10.100.0.0/16 (Private VPC)",
  port = 5432,
  blockedAttemptsCount = 842,
  allowlistRulesCount = 4,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animBlocked = interpolate(frame, [0, 40], [0, blockedAttemptsCount], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            DATABASE FIREWALL RULES
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          PORT {port} RESTRICTED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="text-[10px] text-emerald-400 uppercase">Allowed Ingress VPC</div>
          <div className="text-white font-bold text-sm mt-1">{vpcSubnet}</div>
          <div className="text-[10px] text-zinc-500 mt-1">{allowlistRulesCount} CIDR rules active</div>
        </div>

        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
          <div className="text-[10px] text-red-400 uppercase">Blocked Public Ingress</div>
          <div className="text-red-400 font-bold text-sm mt-1">{animBlocked.toFixed(0)} Drops</div>
          <div className="text-[10px] text-zinc-500 mt-1">Default-Deny Policy</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Public Internet Access: <span className="text-red-400 font-bold">DISABLED</span></span>
        <span className="text-emerald-400 font-bold">Zero-Trust Network Perimeter</span>
      </div>
    </div>
  );
};
