import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WorldClockPanelProps {
  className?: string;
}

export const WorldClockPanel: React.FC<WorldClockPanelProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const cities = [
    { name: 'NEW YORK', time: '09:42 AM', zone: 'EST' },
    { name: 'LONDON', time: '02:42 PM', zone: 'GMT' },
    { name: 'MUMBAI', time: '08:12 PM', zone: 'IST' },
    { name: 'TOKYO', time: '11:42 PM', zone: 'JST' },
  ];

  return (
    <div className={"w-80 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-xs font-black text-sky-400 mb-3 uppercase tracking-wider border-b border-white/10 pb-2">
        GLOBAL WORLD CLOCKS
      </div>
      <div className="space-y-2.5">
        {cities.map((c, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-white">{c.name}</span>
              <span className="text-[10px] text-white/40 ml-1">({c.zone})</span>
            </div>
            <span className="font-black text-amber-300">{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
