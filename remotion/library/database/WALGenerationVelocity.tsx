import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WALGenerationVelocityProps {
  currentWalMBps?: number;
  peakWalMBps?: number;
  checkpointIntervalMin?: number;
  className?: string;
}

export const WALGenerationVelocity: React.FC<WALGenerationVelocityProps> = ({
  currentWalMBps = 48.2,
  peakWalMBps = 124.5,
  checkpointIntervalMin = 15,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            WAL GENERATION VELOCITY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Peak: {peakWalMBps} MB/s
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-purple-400">{currentWalMBps}</span>
          <span className="text-xs text-zinc-400 ml-2">MB / Second Written</span>
        </div>
        <span className="text-xs text-sky-400 font-bold">Checkpoint: {checkpointIntervalMin}m</span>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>Sufficient disk I/O bandwidth allocated for WAL flush</span>
      </div>
    </div>
  );
};
