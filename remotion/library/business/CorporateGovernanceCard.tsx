import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CorporateGovernanceCardProps {
  className?: string;
}

export const CorporateGovernanceCard: React.FC<CorporateGovernanceCardProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          CORPORATE GOVERNANCE & ESG
        </span>
        <span className="text-white/40">COMPLIANCE RATING</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-base font-bold text-emerald-400 font-mono">AAA</div>
          <div className="text-[10px] text-white/40 mt-1 font-mono">ESG INDEX</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-base font-bold text-indigo-400 font-mono">100%</div>
          <div className="text-[10px] text-white/40 mt-1 font-mono">INDEPENDENT AUDIT</div>
        </div>
        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-base font-bold text-sky-400 font-mono">DELAWARE</div>
          <div className="text-[10px] text-white/40 mt-1 font-mono">C-CORP ENTITY</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>REGULATED UNDER US SEC JURISDICTION</span>
        <span>ANNUAL FILING COMPLETED</span>
      </div>
    </div>
  );
};
