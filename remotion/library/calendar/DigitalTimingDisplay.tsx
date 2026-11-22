import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DigitalTimingDisplayProps {
  className?: string;
}

export const DigitalTimingDisplay: React.FC<DigitalTimingDisplayProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const seconds = Math.floor(frame / 30);
  const millis = Math.floor(((frame % 30) / 30) * 100);

  return (
    <div className={"inline-flex items-center bg-zinc-950 border border-white/20 rounded-xl px-5 py-3 font-mono text-white shadow-xl space-x-2 " + className}>
      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse mr-2" />
      <span className="text-3xl font-black tracking-widest text-emerald-400">
        00:{seconds.toString().padStart(2, '0')}:{millis.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] text-white/40 ml-2">STOPWATCH</span>
    </div>
  );
};
