import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface UnitEconomicsModelProps {
  arpu?: number;
  cogs?: number;
  grossMargin?: number;
  className?: string;
}

export const UnitEconomicsModel: React.FC<UnitEconomicsModelProps> = ({
  arpu = 89,
  cogs = 14,
  grossMargin = 84.3,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          PER-USER UNIT ECONOMICS
        </span>
        <span className="text-white/40">MICRO-ECONOMIC MODEL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center py-1 border-b border-white/10">
          <span className="text-xs text-white/70">Average Revenue Per User (ARPU)</span>
          <span className="font-mono font-bold text-white">${arpu}/mo</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-white/10">
          <span className="text-xs text-white/70">Cost of Goods Sold (Cloud GPU & API)</span>
          <span className="font-mono font-bold text-rose-400">-${cogs}/mo</span>
        </div>
        <div className="flex justify-between items-center py-1.5 bg-emerald-950/30 px-2 rounded">
          <span className="text-xs font-bold text-emerald-400">Net Contribution Margin</span>
          <span className="font-mono font-black text-emerald-400">{grossMargin}% (${arpu - cogs})</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>INFRASTRUCTURE: SERVERLESS SCALING</span>
        <span>MARGIN EXPANSION: +6% YTD</span>
      </div>
    </div>
  );
};
