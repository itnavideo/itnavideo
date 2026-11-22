import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IncrementalBackupDiffProps {
  baseBackupSizeGB?: number;
  deltaDiffSizeGB?: number;
  modifiedBlocksPercent?: number;
  savingsPercent?: number;
  className?: string;
}

export const IncrementalBackupDiff: React.FC<IncrementalBackupDiffProps> = ({
  baseBackupSizeGB = 480,
  deltaDiffSizeGB = 14.2,
  modifiedBlocksPercent = 2.95,
  savingsPercent = 97.04,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animDelta = interpolate(frame, [0, 40], [0, deltaDiffSizeGB], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            INCREMENTAL BLOCK DIFFERENTIAL
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {savingsPercent.toFixed(1)}% STORAGE SAVED
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-indigo-400">{animDelta.toFixed(1)} GB</span>
          <span className="text-xs text-zinc-400 ml-2">Delta Diff Upload</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 block">Base Backup</span>
          <span className="text-sm font-bold text-zinc-300">{baseBackupSizeGB} GB Full Image</span>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-indigo-500"
          style={{ width: `${modifiedBlocksPercent * 10}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Changed Blocks Tracked</div>
          <div className="text-white font-bold mt-0.5">{modifiedBlocksPercent}% of storage blocks</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Backup Duration</div>
          <div className="text-emerald-400 font-bold mt-0.5">2m 14s (vs 45m full)</div>
        </div>
      </div>
    </div>
  );
};
