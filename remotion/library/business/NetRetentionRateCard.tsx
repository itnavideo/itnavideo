import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NetRetentionRateCardProps {
  nrr?: number;
  expansionRate?: number;
  churnRate?: number;
  className?: string;
}

export const NetRetentionRateCard: React.FC<NetRetentionRateCardProps> = ({
  nrr = 138,
  expansionRate = 42,
  churnRate = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          NET RETENTION (NDR / NRR)
        </span>
        <span className="text-emerald-400 font-bold">BEST-IN-CLASS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3">
        <div className="text-4xl font-extrabold font-mono text-emerald-400">{nrr}%</div>
        <div className="flex items-center space-x-6 text-center text-xs font-mono">
          <div>
            <span className="text-emerald-400 font-bold">+{expansionRate}%</span>
            <div className="text-[10px] text-white/40">EXPANSION</div>
          </div>
          <span className="text-white/20">|</span>
          <div>
            <span className="text-rose-400 font-bold">-{churnRate}%</span>
            <div className="text-[10px] text-white/40">LOGO CHURN</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>NEGATIVE CHURN COHORT EFFECT</span>
        <span>ENTERPRISE COHORT</span>
      </div>
    </div>
  );
};
