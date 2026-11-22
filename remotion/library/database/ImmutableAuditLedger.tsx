import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ImmutableAuditLedgerProps {
  currentBlockIndex?: number;
  merkleRootHash?: string;
  previousBlockHash?: string;
  ledgerIntegrity?: string;
  className?: string;
}

export const ImmutableAuditLedger: React.FC<ImmutableAuditLedgerProps> = ({
  currentBlockIndex = 148920,
  merkleRootHash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  previousBlockHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  ledgerIntegrity = "100% VERIFIED TAMPER-PROOF",
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
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            IMMUTABLE AUDIT LEDGER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {ledgerIntegrity}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-xs text-zinc-400 uppercase block">Audit Chain Height</span>
          <span className="text-2xl font-bold text-white">Block #{currentBlockIndex.toLocaleString()}</span>
        </div>
        <span className="text-xs text-indigo-400 font-bold">SHA-256 Chained</span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Merkle Root</div>
          <code className="text-emerald-400 text-[11px] block overflow-hidden text-ellipsis">{merkleRootHash}</code>
        </div>
        <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Previous Block Hash</div>
          <code className="text-zinc-400 text-[11px] block overflow-hidden text-ellipsis">{previousBlockHash}</code>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Append-Only Storage Architecture</span>
        <span className="text-emerald-400 font-bold">Zero Historical Mutation</span>
      </div>
    </div>
  );
};
