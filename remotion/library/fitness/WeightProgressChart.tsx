import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WeightProgressChartProps {
  startWeightKg?: number;
  currentWeightKg?: number;
  goalWeightKg?: number;
  timeframeWeeks?: number;
  className?: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  startWeightKg = 92.5,
  currentWeightKg = 79.8,
  goalWeightKg = 75.0,
  timeframeWeeks = 12,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const lossKg = (startWeightKg - currentWeightKg).toFixed(1);

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 18, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            TRANSFORMATION PROGRESS
          </span>
          <span className="text-zinc-400 text-[11px]">{timeframeWeeks} Weeks</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold">TOTAL WEIGHT LOST</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-400">-{lossKg}</span>
              <span className="text-zinc-400 text-xs font-bold">KG</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-xs text-zinc-400">
            <span>Start: <strong className="text-white">{startWeightKg} kg</strong></span>
            <span>Now: <strong className="text-emerald-400 font-bold">{currentWeightKg} kg</strong></span>
            <span className="text-zinc-500 text-[10px]">Goal: {goalWeightKg} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
