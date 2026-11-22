import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EveningSunsetProps {
  timeStr?: string;
  label?: string;
  className?: string;
}

export const EveningSunset: React.FC<EveningSunsetProps> = ({
  timeStr = '06:45 PM',
  label = 'TWILIGHT GOLDEN HOUR',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-t from-purple-950/80 via-rose-950/40 to-zinc-950 border border-purple-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs text-purple-400 font-bold mb-3">
        <span>EVENING DUSK</span>
        <span>🌇</span>
      </div>
      <div className="text-4xl font-black text-rose-300 tracking-tight mb-2">{timeStr}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
};
