import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IndexCoverageRatioProps {
  indexHits?: number;
  seqScans?: number;
  tableName?: string;
  className?: string;
}

export const IndexCoverageRatio: React.FC<IndexCoverageRatioProps> = ({
  indexHits = 4850000,
  seqScans = 620000,
  tableName = "user_sessions",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const total = indexHits + seqScans;
  const ratio = total > 0 ? (indexHits / total) * 100 : 0;
  const animatedRatio = interpolate(frame, [0, 45], [0, ratio], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            INDEX COVERAGE RATIO
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}
        </span>
      </div>

      <div className="flex items-end justify-between mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animatedRatio.toFixed(1)}%</span>
          <span className="text-xs text-zinc-400 ml-2">Index Hit Rate</span>
        </div>
        <div className="text-right">
          <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            {animatedRatio >= 90 ? 'OPTIMAL' : 'NEEDS INDEX'}
          </span>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden flex mb-4">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${animatedRatio}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${100 - animatedRatio}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400 block text-[10px] uppercase">Index Scan Hits</span>
          <span className="text-emerald-400 font-bold text-base">{(indexHits / 1000000).toFixed(2)}M</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400 block text-[10px] uppercase">Sequential Scans</span>
          <span className="text-red-400 font-bold text-base">{(seqScans / 1000).toFixed(0)}K</span>
        </div>
      </div>
    </div>
  );
};
