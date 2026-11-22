import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CompetitiveMatrix2x2Props {
  xAxisLabel?: string;
  yAxisLabel?: string;
  leaderBrand?: string;
  className?: string;
}

export const CompetitiveMatrix2x2: React.FC<CompetitiveMatrix2x2Props> = ({
  xAxisLabel = 'Render Speed & Ease of Use →',
  yAxisLabel = 'Cloud Scalability & Automation ↑',
  leaderBrand = 'Itnavideo',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          2x2 COMPETITIVE MATRIX
        </span>
        <span className="text-white/40">MARKET POSITIONING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 relative flex items-center justify-center">
        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-white/10" />
        <div className="absolute inset-y-4 left-1/2 w-0.5 bg-white/10" />

        <div className="absolute top-6 right-6 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500 text-center">
          <div className="text-xs font-black text-emerald-300 font-mono">★ {leaderBrand}</div>
          <div className="text-[9px] text-emerald-400">CATEGORY LEADER</div>
        </div>

        <div className="absolute bottom-6 left-6 p-1.5 rounded bg-zinc-800 text-[10px] text-white/40">
          Legacy Desktop NLEs
        </div>

        <div className="absolute bottom-2 text-[9px] font-mono text-white/40">{xAxisLabel}</div>
        <div className="absolute left-2 -rotate-90 text-[9px] font-mono text-white/40">{yAxisLabel}</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>GARTNER MAGIC QUADRANT ALIGNED</span>
        <span>DEFENSIBLE MOAT: HIGH</span>
      </div>
    </div>
  );
};
