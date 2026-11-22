import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RecordGrowthTimeSeriesProps {
  currentRecordsMillion?: number;
  growthRatePercentMonthly?: number;
  projectedSixMonthsMillion?: number;
  className?: string;
}

export const RecordGrowthTimeSeries: React.FC<RecordGrowthTimeSeriesProps> = ({
  currentRecordsMillion = 48.5,
  growthRatePercentMonthly = 8.4,
  projectedSixMonthsMillion = 78.4,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animRec = interpolate(frame, [0, 45], [0, currentRecordsMillion], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            RECORD GROWTH TIME-SERIES
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          +{growthRatePercentMonthly}% / Mo
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">{animRec.toFixed(1)}M</span>
          <span className="text-xs text-zinc-400 ml-2">Total Rows Active</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block uppercase">6-Mo Projection</span>
          <span className="text-sm font-bold text-sky-300">{projectedSixMonthsMillion}M Rows</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
        <span>Capacity Planning: Storage Auto-Scaling Enabled</span>
        <span className="text-emerald-400 font-bold">Healthy Runway</span>
      </div>
    </div>
  );
};
