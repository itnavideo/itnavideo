import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CorruptedBlockRepairProps {
  corruptedBlockNumber?: number;
  relationName?: string;
  sourceReplica?: string;
  repairStatus?: string;
  className?: string;
}

export const CorruptedBlockRepair: React.FC<CorruptedBlockRepairProps> = ({
  corruptedBlockNumber = 984120,
  relationName = "public.financial_ledgers",
  sourceReplica = "db-standby-node-02",
  repairStatus = "BLOCK REPAIRED LIVE — ZERO DATA LOSS",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            CORRUPTED BLOCK AUTO-REPAIR
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {repairStatus}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">Corrupted Block Index</div>
            <div className="text-red-400 font-bold mt-0.5">Page #{corruptedBlockNumber.toLocaleString()}</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-400">Checksum Invalid</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-emerald-400 uppercase">Fetched From Standby</div>
            <div className="text-emerald-300 font-bold mt-0.5">{sourceReplica}</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-emerald-900/60 text-emerald-200">VALIDATED</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Relation: {relationName}</span>
        <span className="text-emerald-400 font-bold">Zero Table Downtime</span>
      </div>
    </div>
  );
};
