import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface QuarterlyEarningsPanelProps {
  quarter?: string;
  revenue?: string;
  yoyGrowth?: string;
  grossMargin?: string;
  className?: string;
}

export const QuarterlyEarningsPanel: React.FC<QuarterlyEarningsPanelProps> = ({
  quarter = 'Q3 2026',
  revenue = '$8.42M',
  yoyGrowth = '+118% YoY',
  grossMargin = '78.5%',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          QUARTERLY EARNINGS CALL
        </span>
        <span className="text-white/40">{quarter}</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">QUARTER REVENUE</div>
          <div className="text-lg font-bold font-mono text-white">{revenue}</div>
        </div>
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center">
          <div className="text-[10px] text-emerald-400 font-mono">YOY GROWTH</div>
          <div className="text-lg font-black font-mono text-emerald-400">{yoyGrowth}</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40 font-mono">GROSS MARGIN</div>
          <div className="text-lg font-bold font-mono text-sky-400">{grossMargin}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>WALL STREET CONSENSUS: BEAT BY 14%</span>
        <span>GUIDANCE: RAISED</span>
      </div>
    </div>
  );
};
