import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MorningSunriseProps {
  timeStr?: string;
  quote?: string;
  className?: string;
}

export const MorningSunrise: React.FC<MorningSunriseProps> = ({
  timeStr = '06:30 AM',
  quote = 'Dawn breaks • New horizon awaits',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-t from-amber-950/80 via-orange-950/40 to-zinc-950 border border-orange-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs text-orange-400 font-bold mb-3">
        <span>MORNING SUNRISE</span>
        <span>🌅</span>
      </div>
      <div className="text-4xl font-black text-amber-300 tracking-tight mb-2">{timeStr}</div>
      <div className="text-xs text-white/60">{quote}</div>
    </div>
  );
};
