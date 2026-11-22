import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NightSkyProps {
  timeStr?: string;
  phase?: string;
  className?: string;
}

export const NightSky: React.FC<NightSkyProps> = ({
  timeStr = '10:30 PM',
  phase = 'WANING CRESCENT MOON',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-b from-indigo-950/90 to-zinc-950 border border-indigo-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs text-indigo-400 font-bold mb-3">
        <span>NIGHT MODE</span>
        <span>🌙</span>
      </div>
      <div className="text-4xl font-black text-indigo-200 tracking-tight mb-2">{timeStr}</div>
      <div className="text-xs text-white/50">{phase}</div>
    </div>
  );
};
