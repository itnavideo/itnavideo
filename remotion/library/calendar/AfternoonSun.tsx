import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AfternoonSunProps {
  timeStr?: string;
  status?: string;
  className?: string;
}

export const AfternoonSun: React.FC<AfternoonSunProps> = ({
  timeStr = '02:15 PM',
  status = 'PEAK FOCUS & PRODUCTIVITY',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-br from-yellow-950/60 to-zinc-950 border border-yellow-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs text-yellow-400 font-bold mb-3">
        <span>AFTERNOON ZENITH</span>
        <span>☀️</span>
      </div>
      <div className="text-4xl font-black text-yellow-300 tracking-tight mb-2">{timeStr}</div>
      <div className="text-xs text-white/60">{status}</div>
    </div>
  );
};
