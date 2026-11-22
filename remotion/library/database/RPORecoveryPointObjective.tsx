import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RPORecoveryPointObjectiveProps {
  currentRpoSec?: number;
  slaTargetSec?: number;
  unreplicatedTransactions?: number;
  className?: string;
}

export const RPORecoveryPointObjective: React.FC<RPORecoveryPointObjectiveProps> = ({
  currentRpoSec = 0.45,
  slaTargetSec = 5.0,
  unreplicatedTransactions = 0,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animRpo = interpolate(frame, [0, 40], [0, currentRpoSec], { extrapolateRight: 'clamp' });
  const isCompliant = animRpo <= slaTargetSec;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            RECOVERY POINT OBJECTIVE (RPO)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          SLA Target: &lt;{slaTargetSec}s
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animRpo.toFixed(2)}s</span>
          <span className="text-xs text-zinc-400 ml-2">Current Data Loss Gap</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${isCompliant ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' : 'bg-red-950 text-red-300'}`}>
          {isCompliant ? 'SLA COMPLIANT' : 'RPO BREACHED'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Unreplicated Transactions</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{unreplicatedTransactions} Pending</div>
          <div className="text-[10px] text-zinc-500">Zero data loss sync</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Replication Type</div>
          <div className="text-sky-400 font-bold text-base mt-1">Semi-Sync WAL</div>
          <div className="text-[10px] text-zinc-500">Dual-node confirmation</div>
        </div>
      </div>
    </div>
  );
};
