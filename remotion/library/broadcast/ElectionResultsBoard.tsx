import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ElectionResultsBoardProps {
  raceTitle?: string;
  candidates?: { name: string; party: string; votes: string; percent: number; color: string; winner?: boolean }[];
  className?: string;
}

export const ElectionResultsBoard: React.FC<ElectionResultsBoardProps> = ({
  raceTitle = 'GOVERNOR SPECIAL ELECTION — 98% REPORTING',
  candidates = [
    { name: 'Elena Vance', party: 'PROGRESSIVE', votes: '1,420,500', percent: 52.4, color: '#3b82f6', winner: true },
    { name: 'Marcus Hayes', party: 'CONSERVATIVE', votes: '1,290,100', percent: 47.6, color: '#ef4444' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-96 bg-zinc-950/95 border border-white/15 rounded-xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-[11px] font-bold text-white/60 mb-3 uppercase tracking-wider">
        {raceTitle}
      </div>
      <div className="space-y-4">
        {candidates.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-bold">{c.name}</span>
                {c.winner && <span className="text-[10px] bg-emerald-500 text-black px-1.5 rounded font-black">PROJECTED WINNER</span>}
              </div>
              <span className="font-black text-sm" style={{ color: c.color }}>{c.percent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: c.percent + '%', backgroundColor: c.color }} />
            </div>
            <div className="text-[10px] text-white/40 text-right">{c.votes} votes</div>
          </div>
        ))}
      </div>
    </div>
  );
};
