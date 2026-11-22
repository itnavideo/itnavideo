import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PartitionDataDistributionProps {
  partitions?: { name: string; sizeGB: number; percentage: number }[];
  className?: string;
}

export const PartitionDataDistribution: React.FC<PartitionDataDistributionProps> = ({
  partitions = [
    { name: "p_2026_q1", sizeGB: 142, percentage: 28.4 },
    { name: "p_2026_q2", sizeGB: 156, percentage: 31.2 },
    { name: "p_2026_q3", sizeGB: 124, percentage: 24.8 },
    { name: "p_2026_q4", sizeGB: 78, percentage: 15.6 },
  ],
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
            PARTITION BALANCE DISTRIBUTION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          BALANCED (ZERO SKEW)
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {partitions.map((p, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-white font-bold">{p.name}</span>
            <span className="text-indigo-300 font-bold">{p.sizeGB} GB ({p.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
