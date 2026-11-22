import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface BurnRateRunwayProps {
  monthlyBurn?: number;
  cashReserves?: number;
  className?: string;
}

export const BurnRateRunway: React.FC<BurnRateRunwayProps> = ({
  monthlyBurn = 125000,
  cashReserves = 2800000,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const runwayMonths = (cashReserves / monthlyBurn).toFixed(1);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          CASH RUNWAY & BURN DYNAMICS
        </span>
        <span className="text-emerald-400 font-bold">RUNWAY: 22.4 MONTHS</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">MONTHLY NET BURN</div>
          <div className="text-lg font-bold font-mono text-rose-400">${(monthlyBurn / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">CASH IN BANK</div>
          <div className="text-lg font-bold font-mono text-emerald-400">${(cashReserves / 1000000).toFixed(2)}M</div>
        </div>
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-center">
          <div className="text-[10px] text-emerald-300 font-mono">ZERO CASH DATE</div>
          <div className="text-xl font-black font-mono text-emerald-400">{runwayMonths} Mo</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PROJECTED CASH FLOW POSITIVE: Q4</span>
        <span>BURN MULTIPLE: 0.8x</span>
      </div>
    </div>
  );
};
