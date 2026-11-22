import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MatchClockProps {
  minutes?: number;
  seconds?: number;
  addedTime?: string;
  className?: string;
}

export const MatchClock: React.FC<MatchClockProps> = ({
  minutes = 89,
  seconds = 42,
  addedTime = '+4',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-zinc-950 border border-white/20 rounded-md px-3 py-1 font-mono text-white text-xs shadow-md space-x-2 " + className}>
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-black tracking-wider">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      {addedTime && (
        <span className="px-1 bg-red-600 text-white rounded text-[10px] font-bold">
          {addedTime}
        </span>
      )}
    </div>
  );
};
