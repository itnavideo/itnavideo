import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface InvestorPitchDeckCardProps {
  round?: string;
  seeking?: string;
  valuation?: string;
  useOfFunds?: string;
  className?: string;
}

export const InvestorPitchDeckCard: React.FC<InvestorPitchDeckCardProps> = ({
  round = 'Series A Round',
  seeking = '$6,000,000',
  valuation = '$35,000,000 Post',
  useOfFunds = '60% R&D Cloud Compute, 30% Growth & Sales, 10% Operations',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          INVESTOR FINANCING ROUND
        </span>
        <span className="text-violet-400 font-bold">{round}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-white/40 font-mono">CAPITAL SOUGHT</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{seeking}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 font-mono">TARGET VALUATION</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{valuation}</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-[10px] text-white/40 font-mono mb-1">ALLOCATION OF PROCEEDS</div>
          <div className="text-xs text-white/80">{useOfFunds}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TERM SHEET: OPEN TO LEAD INVESTOR</span>
        <span>DATA ROOM READY</span>
      </div>
    </div>
  );
};
