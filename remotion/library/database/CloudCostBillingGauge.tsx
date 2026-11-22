import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudCostBillingGaugeProps {
  monthlyEstimatedCostUSD?: number;
  computeCostUSD?: number;
  storageIopsCostUSD?: number;
  reservedSavingsUSD?: number;
  className?: string;
}

export const CloudCostBillingGauge: React.FC<CloudCostBillingGaugeProps> = ({
  monthlyEstimatedCostUSD = 840,
  computeCostUSD = 580,
  storageIopsCostUSD = 260,
  reservedSavingsUSD = 320,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animCost = interpolate(frame, [0, 45], [0, monthlyEstimatedCostUSD], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            CLOUD DATABASE MONTHLY COST
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          -${reservedSavingsUSD} RI SAVINGS
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-emerald-400">${animCost.toFixed(0)}</span>
          <span className="text-xs text-zinc-400 ml-2">/ Month Estimated</span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">Compute + Storage + IOPS</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Instance Compute</div>
          <div className="text-white font-bold mt-0.5">${computeCostUSD} / mo</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Storage & IOPS</div>
          <div className="text-white font-bold mt-0.5">${storageIopsCostUSD} / mo</div>
        </div>
      </div>
    </div>
  );
};
