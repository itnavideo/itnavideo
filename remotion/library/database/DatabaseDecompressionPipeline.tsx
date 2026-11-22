import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseDecompressionPipelineProps {
  algorithm?: string;
  threadsCount?: number;
  decompressionSpeedMBps?: number;
  uncompressedSizeGB?: number;
  className?: string;
}

export const DatabaseDecompressionPipeline: React.FC<DatabaseDecompressionPipelineProps> = ({
  algorithm = "Zstandard (zstd -T8)",
  threadsCount = 8,
  decompressionSpeedMBps = 680.4,
  uncompressedSizeGB = 450,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animSpeed = interpolate(frame, [0, 40], [0, decompressionSpeedMBps], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            DECOMPRESSION ENGINE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {threadsCount} Parallel Threads
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animSpeed.toFixed(1)}</span>
          <span className="text-xs text-zinc-400 ml-2">MB/s Unpack Speed</span>
        </div>
        <span className="text-xs text-sky-400 font-bold">{algorithm}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Target Volume</div>
          <div className="text-white font-bold text-base mt-1">{uncompressedSizeGB} GB Raw Heap</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Estimated Unpack Time</div>
          <div className="text-emerald-400 font-bold text-base mt-1">11m 02s</div>
        </div>
      </div>
    </div>
  );
};
