import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LeaderboardOverlayProps {
  title?: string;
  entries?: { rank: number; name: string; score: string; change?: string }[];
  className?: string;
}

export const LeaderboardOverlay: React.FC<LeaderboardOverlayProps> = ({
  title = 'TOURNAMENT STANDINGS',
  entries = [
    { rank: 1, name: 'Team Alpha', score: '2,450 pts', change: '+2' },
    { rank: 2, name: 'Viper Esports', score: '2,310 pts', change: '0' },
    { rank: 3, name: 'Nova Prime', score: '2,190 pts', change: '-1' },
    { rank: 4, name: 'Cyber Wolves', score: '2,040 pts', change: '+1' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-80 bg-zinc-950/95 border border-white/10 rounded-xl p-4 font-mono text-white shadow-2xl " + className}>
      <div className="text-xs font-black text-amber-400 mb-3 uppercase tracking-wider border-b border-white/10 pb-2">
        {title}
      </div>
      <div className="space-y-2 text-xs">
        {entries.map((e) => (
          <div key={e.rank} className="flex justify-between items-center p-2 rounded bg-zinc-900 border border-white/5">
            <div className="flex items-center space-x-2">
              <span className={"w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] " + (
                e.rank === 1 ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white'
              )}>
                {e.rank}
              </span>
              <span className="font-bold">{e.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-300 font-bold">{e.score}</span>
              <span className="text-[10px] text-white/40">{e.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
