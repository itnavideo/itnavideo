import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataDistributionHistogramProps {
  columnName?: string;
  tableName?: string;
  buckets?: { range: string; count: number; percentage: number }[];
  className?: string;
}

export const DataDistributionHistogram: React.FC<DataDistributionHistogramProps> = ({
  columnName = "order_amount_usd",
  tableName = "public.orders",
  buckets = [
    { range: "$0 - $50", count: 48200, percentage: 48.2 },
    { range: "$50 - $150", count: 32100, percentage: 32.1 },
    { range: "$150 - $500", count: 14500, percentage: 14.5 },
    { range: "$500 - $2k", count: 4200, percentage: 4.2 },
    { range: "$2k+", count: 1000, percentage: 1.0 },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            DATA DISTRIBUTION HISTOGRAM
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}.{columnName}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {buckets.map((b, idx) => {
          const barWidth = interpolate(frame, [idx * 3, idx * 3 + 30], [0, b.percentage], { extrapolateRight: 'clamp' });
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-300">{b.range}</span>
                <span className="text-sky-300 font-bold">{b.count.toLocaleString()} ({b.percentage}%)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
