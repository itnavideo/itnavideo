import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface ROASCalculatorProps {
  adSpend?: number;
  revenue?: number;
  className?: string;
}

export const ROASCalculator: React.FC<ROASCalculatorProps> = ({
  adSpend = 5000,
  revenue = 24500,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const currentSpend = Math.round(interpolate(frame, [0, 30], [0, adSpend], { extrapolateRight: 'clamp' }));
  const currentRev = Math.round(interpolate(frame, [0, 45], [0, revenue], { extrapolateRight: 'clamp' }));
  const roas = (revenue / adSpend).toFixed(2);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          ROAS PERFORMANCE CALCULATOR
        </span>
        <span className="text-white/40">META & GOOGLE ADS</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">TOTAL AD SPEND</div>
          <div className="text-lg font-bold font-mono text-rose-400">${currentSpend.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">GROSS REVENUE</div>
          <div className="text-lg font-bold font-mono text-emerald-400">${currentRev.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-violet-950/40 border border-violet-500/50 rounded-xl text-center">
          <div className="text-[10px] text-violet-300 font-mono">NET ROAS</div>
          <div className="text-2xl font-black font-mono text-violet-400">{roas}x</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PROFIT MARGIN: 68%</span>
        <span>SCALING RECOMMENDATION: INCREASE 30%</span>
      </div>
    </div>
  );
};
