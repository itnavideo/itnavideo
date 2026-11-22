import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ConsistentSnapshotLockProps {
  lockScope?: string;
  lockDurationMs?: number;
  blockedQueriesCount?: number;
  snapshotLSN?: string;
  className?: string;
}

export const ConsistentSnapshotLock: React.FC<ConsistentSnapshotLockProps> = ({
  lockScope = "GLOBAL READ LOCK (FLUSH TABLES WITH READ LOCK)",
  lockDurationMs = 184,
  blockedQueriesCount = 12,
  snapshotLSN = "0/18A4200",
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
            CONSISTENT SNAPSHOT FREEZE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          LOCK RELEASED
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-amber-300 mb-3">
        <code>{lockScope}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Lock Duration</div>
          <div className="text-white font-bold text-base mt-1">{lockDurationMs} ms</div>
          <div className="text-[10px] text-zinc-500">Minimal application pause</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Snapshot LSN Boundary</div>
          <div className="text-sky-400 font-bold text-base mt-1">{snapshotLSN}</div>
          <div className="text-[10px] text-zinc-500">Atomic consistency mark</div>
        </div>
      </div>
    </div>
  );
};
