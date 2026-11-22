import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SportsScorebugProps {
  teamA?: { code: string; score: number; color: string };
  teamB?: { code: string; score: number; color: string };
  period?: string;
  time?: string;
  className?: string;
}

export const SportsScorebug: React.FC<SportsScorebugProps> = ({
  teamA = { code: 'LAL', score: 104, color: '#eab308' },
  teamB = { code: 'BOS', score: 102, color: '#10b981' },
  period = '4TH',
  time = '02:14',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/90 border border-white/20 rounded-lg overflow-hidden font-mono text-white shadow-2xl " + className}>
      <div className="flex items-center px-3 py-1.5 space-x-2" style={{ backgroundColor: teamA.color + '22' }}>
        <span className="font-black text-sm" style={{ color: teamA.color }}>{teamA.code}</span>
        <span className="font-bold text-base">{teamA.score}</span>
      </div>
      <div className="flex items-center px-3 py-1.5 space-x-2 border-l border-white/10" style={{ backgroundColor: teamB.color + '22' }}>
        <span className="font-black text-sm" style={{ color: teamB.color }}>{teamB.code}</span>
        <span className="font-bold text-base">{teamB.score}</span>
      </div>
      <div className="bg-zinc-800 px-3 py-1.5 flex flex-col items-center justify-center text-[10px] border-l border-white/20 font-bold">
        <span className="text-red-400">{period}</span>
        <span>{time}</span>
      </div>
    </div>
  );
};
