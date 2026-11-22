import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BassPulseProps {
  subFrequency?: string;
  className?: string;
}

export const BassPulse: React.FC<BassPulseProps> = ({
  subFrequency = '40 Hz',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const ring = (frame % 20) * 4;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          SUBWOOFER BASS PULSE
        </span>
        <span className="text-white/40">{subFrequency} LOW-END</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <div
          className="rounded-full border-4 border-rose-500 opacity-60 absolute"
          style={{ width: (50 + ring) + 'px', height: (50 + ring) + 'px' }}
        />
        <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center font-bold text-xs text-white z-10 shadow-xl">
          SUB
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SEISMIC EXCURSION: MAX</span>
        <span>CROSSOVER: 80Hz</span>
      </div>
    </div>
  );
};
