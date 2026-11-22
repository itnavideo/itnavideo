import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabasePointInTimeCloudProps {
  retentionDays?: number;
  earliestRestoreTime?: string;
  latestRestoreTime?: string;
  automatedSnapshotWindow?: string;
  className?: string;
}

export const DatabasePointInTimeCloud: React.FC<DatabasePointInTimeCloudProps> = ({
  retentionDays = 35,
  earliestRestoreTime = "2026-10-18 04:00:00 UTC",
  latestRestoreTime = "2026-11-22 16:50:00 UTC",
  automatedSnapshotWindow = "03:00 - 04:00 UTC Daily",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            CLOUD AUTOMATED BACKUP (PITR)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {retentionDays}-DAY RETENTION
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Earliest Restorable Time:</span>
          <span className="text-zinc-200 font-bold">{earliestRestoreTime}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between">
          <span className="text-zinc-400">Latest Restorable Time:</span>
          <span className="text-emerald-400 font-bold">{latestRestoreTime}</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Snapshot Window: {automatedSnapshotWindow}</span>
        <span className="text-sky-300 font-bold">Zero Performance Impact</span>
      </div>
    </div>
  );
};
