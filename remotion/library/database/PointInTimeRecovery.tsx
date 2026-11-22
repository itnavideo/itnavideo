import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PointInTimeRecoveryProps {
  targetTimestamp?: string;
  targetLSN?: string;
  baseBackupDate?: string;
  replayedWALCount?: number;
  recoveryStatus?: string;
  className?: string;
}

export const PointInTimeRecovery: React.FC<PointInTimeRecoveryProps> = ({
  targetTimestamp = "2026-11-22 14:28:45.102 UTC",
  targetLSN = "0/16B3F48",
  baseBackupDate = "2026-11-22 00:00:00 UTC",
  replayedWALCount = 84,
  recoveryStatus = "TARGET REACHED — REPLAY COMPLETE",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const progress = interpolate(frame, [0, 45], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            POINT-IN-TIME RECOVERY (PITR)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {recoveryStatus}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Target Restoration Point</div>
        <div className="text-amber-400 font-bold text-sm">{targetTimestamp}</div>
        <div className="text-[10px] text-zinc-400 mt-1">Target LSN: <span className="text-sky-300 font-mono">{targetLSN}</span></div>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Base Snapshot</div>
          <div className="text-zinc-200 font-bold text-xs mt-0.5">{baseBackupDate}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">WAL Segments Replayed</div>
          <div className="text-emerald-400 font-bold text-xs mt-0.5">{replayedWALCount} Segments (1.34 GB)</div>
        </div>
      </div>
    </div>
  );
};
