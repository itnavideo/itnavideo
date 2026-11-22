import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BufferCacheHitRatioProps {
  hitRatioPercent?: number;
  diskReadsCount?: number;
  bufferHitsCount?: number;
  targetPercent?: number;
  className?: string;
}

export const BufferCacheHitRatio: React.FC<BufferCacheHitRatioProps> = ({
  hitRatioPercent = 99.4,
  diskReadsCount = 18400,
  bufferHitsCount = 3060000,
  targetPercent = 99.0,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animRatio = interpolate(frame, [0, 40], [90, hitRatioPercent], { extrapolateRight: 'clamp' });
  const isHealthy = animRatio >= targetPercent;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            BUFFER CACHE HIT RATIO
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          RAM Cache
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animRatio.toFixed(2)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Hit Ratio</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${isHealthy ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' : 'bg-red-950 text-red-300'}`}>
          {isHealthy ? 'HIGH RETENTION' : 'DISK SPILL ALERT'}
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
          style={{ width: `${animRatio}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Buffer Cache Hits</div>
          <div className="text-emerald-400 font-bold text-base mt-1">{(bufferHitsCount / 1000000).toFixed(2)}M</div>
          <div className="text-[10px] text-zinc-500">Served from RAM</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Physical Disk Reads</div>
          <div className="text-amber-400 font-bold text-base mt-1">{(diskReadsCount / 1000).toFixed(1)}K</div>
          <div className="text-[10px] text-zinc-500">Storage I/O fallback</div>
        </div>
      </div>
    </div>
  );
};
