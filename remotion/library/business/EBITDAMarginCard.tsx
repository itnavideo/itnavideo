import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EBITDAMarginCardProps {
  revenue?: string;
  ebitda?: string;
  marginPercent?: number;
  className?: string;
}

export const EBITDAMarginCard: React.FC<EBITDAMarginCardProps> = ({
  revenue = '$18.4M',
  ebitda = '$4.8M',
  marginPercent = 26.1,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          EBITDA PROFITABILITY
        </span>
        <span className="text-teal-400 font-bold">GAAP AUDITED</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-black font-mono text-teal-400">
          {marginPercent}% <span className="text-sm font-normal text-white/60">MARGIN</span>
        </div>
        <div className="flex items-center space-x-6 text-center">
          <div>
            <div className="text-[10px] text-white/40 font-mono">GROSS REVENUE</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{revenue}</div>
          </div>
          <div className="text-white/20">|</div>
          <div>
            <div className="text-[10px] text-teal-400 font-mono">ADJUSTED EBITDA</div>
            <div className="text-base font-bold font-mono text-teal-300 mt-0.5">{ebitda}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RULE OF 40 SCORE: 54% (TOP QUARTILE)</span>
        <span>YEAR-OVER-YEAR: +8.2%</span>
      </div>
    </div>
  );
};
