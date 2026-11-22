import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DirtyPageCleanRateProps {
  dirtyRateMBps?: number;
  cleanRateMBps?: number;
  checkpointIntervalMin?: number;
  bufferPoolSizeGB?: number;
  className?: string;
}

export const DirtyPageCleanRate: React.FC<DirtyPageCleanRateProps> = ({
  dirtyRateMBps = 48.5,
  cleanRateMBps = 46.2,
  checkpointIntervalMin = 15,
  bufferPoolSizeGB = 32,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animDirty = interpolate(frame, [0, 40], [0, dirtyRateMBps], { extrapolateRight: 'clamp' });
  const animClean = interpolate(frame, [0, 40], [0, cleanRateMBps], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            DIRTY PAGE VS CLEAN FLUSH RATE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Pool: {bufferPoolSizeGB} GB
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono mb-4">
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">Dirty Page Rate</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{animDirty.toFixed(1)} MB/s</div>
          <div className="text-[10px] text-zinc-500">Transactions modifying pages</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">BgWriter Clean Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{animClean.toFixed(1)} MB/s</div>
          <div className="text-[10px] text-zinc-500">Flushed before checkpoint</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-2">
        <span>Checkpoint Target Interval:</span>
        <span className="text-sky-400 font-bold">{checkpointIntervalMin} minutes</span>
      </div>
    </div>
  );
};
