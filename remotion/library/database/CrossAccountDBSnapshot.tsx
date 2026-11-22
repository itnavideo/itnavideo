import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CrossAccountDBSnapshotProps {
  sourceAccountId?: string;
  targetAccountId?: string;
  kmsKeyId?: string;
  snapshotName?: string;
  className?: string;
}

export const CrossAccountDBSnapshot: React.FC<CrossAccountDBSnapshotProps> = ({
  sourceAccountId = "111122223333 (Prod)",
  targetAccountId = "444455556666 (Staging)",
  kmsKeyId = "mrk-7482901abcf44",
  snapshotName = "rds:prod-cluster-snapshot-20261122",
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
            CROSS-ACCOUNT SNAPSHOT SHARING
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          AWS RAM
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Shared Snapshot Identifier</div>
        <code className="text-white text-[11px]">{snapshotName}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Source Owner</div>
          <div className="text-zinc-200 font-bold text-xs mt-0.5">{sourceAccountId}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Target Recipient</div>
          <div className="text-sky-400 font-bold text-xs mt-0.5">{targetAccountId}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Re-encrypted with target KMS key</span>
        <span className="text-emerald-400 font-bold">Zero Cross-Account Leakage</span>
      </div>
    </div>
  );
};
