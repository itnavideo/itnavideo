import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ExecutiveSummaryCardProps {
  companyName?: string;
  vision?: string;
  highlights?: string[];
  className?: string;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  companyName = 'Acme Technologies Inc.',
  vision = 'Automating next-generation visual video pipelines with cloud intelligence.',
  highlights = [
    'Leading AI Cloud Rendering Platform',
    '$14M ARR with 142% Net Retention',
    'Tier-1 Global Enterprise Customer Base',
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          EXECUTIVE BRIEFING
        </span>
        <span className="text-white/40">CONFIDENTIAL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="text-lg font-bold text-white">{companyName}</div>
          <div className="text-xs text-white/60 mt-1 italic leading-relaxed">{vision}</div>
        </div>
        <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center space-x-2 text-xs">
              <span className="text-blue-400 font-bold">▶</span>
              <span className="text-white/80">{h}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PREPARED FOR: BOARD OF DIRECTORS</span>
        <span>STATUS: APPROVED</span>
      </div>
    </div>
  );
};
