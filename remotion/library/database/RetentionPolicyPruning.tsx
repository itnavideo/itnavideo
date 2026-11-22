import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RetentionPolicyPruningProps {
  dailySnapshotsCount?: number;
  weeklySnapshotsCount?: number;
  monthlySnapshotsCount?: number;
  prunedExpiredCount?: number;
  className?: string;
}

export const RetentionPolicyPruning: React.FC<RetentionPolicyPruningProps> = ({
  dailySnapshotsCount: 7,
  weeklySnapshotsCount: 4,
  monthlySnapshotsCount: 12,
  prunedExpiredCount: 38,
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
            GFS RETENTION & PRUNING
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Lifecycle Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Daily Retained</div>
          <div className="text-white font-bold text-sm mt-1">{dailySnapshotsCount} Snapshots</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Weekly Retained</div>
          <div className="text-white font-bold text-sm mt-1">{weeklySnapshotsCount} Snapshots</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Monthly Retained</div>
          <div className="text-white font-bold text-sm mt-1">{monthlySnapshotsCount} Snapshots</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Expired Snapshots Pruned: <span className="text-indigo-300 font-bold">{prunedExpiredCount}</span></span>
        <span className="text-emerald-400 font-bold">Compliance Maintained</span>
      </div>
    </div>
  );
};
