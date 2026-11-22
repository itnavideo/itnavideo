import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EarlyMorningDawnProps {
  timeStr?: string;
  routine?: string;
  className?: string;
}

export const EarlyMorningDawn: React.FC<EarlyMorningDawnProps> = ({
  timeStr = '05:00 AM',
  routine = '5 AM CLUB • MEDITATION & SPRINT',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-br from-blue-950/90 to-zinc-950 border border-blue-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs text-cyan-400 font-bold mb-3">
        <span>PRE-DAWN BLUE HOUR</span>
        <span>⚡</span>
      </div>
      <div className="text-4xl font-black text-cyan-200 tracking-tight mb-2">{timeStr}</div>
      <div className="text-xs text-white/60">{routine}</div>
    </div>
  );
};
