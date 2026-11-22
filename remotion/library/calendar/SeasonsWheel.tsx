import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SeasonsWheelProps {
  activeSeason?: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  className?: string;
}

export const SeasonsWheel: React.FC<SeasonsWheelProps> = ({
  activeSeason = 'AUTUMN',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const seasons = [
    { name: 'SPRING', icon: '🌸', color: '#ec4899' },
    { name: 'SUMMER', icon: '☀️', color: '#eab308' },
    { name: 'AUTUMN', icon: '🍂', color: '#ea580c' },
    { name: 'WINTER', icon: '❄️', color: '#38bdf8' },
  ];

  return (
    <div className={"w-72 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl flex flex-col items-center " + className}>
      <div className="text-xs text-white/50 mb-3 uppercase tracking-wider">ANNUAL SEASONS CYCLE</div>
      <div className="grid grid-cols-2 gap-3 w-full">
        {seasons.map((s) => {
          const isActive = s.name === activeSeason;
          return (
            <div
              key={s.name}
              className={"p-3 rounded-xl border flex flex-col items-center " + (
                isActive ? 'border-orange-500 bg-orange-950/30 shadow-lg' : 'border-white/5 bg-zinc-900/60'
              )}
            >
              <span className="text-xl mb-1">{s.icon}</span>
              <span className="text-xs font-bold" style={{ color: isActive ? s.color : '#a1a1aa' }}>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
