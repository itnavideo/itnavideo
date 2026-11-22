import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TimeLapseClockProps {
  speedFactor?: string;
  className?: string;
}

export const TimeLapseClock: React.FC<TimeLapseClockProps> = ({
  speedFactor = '60x TIMELAPSE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 12;

  return (
    <div className={"w-64 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl flex flex-col items-center " + className}>
      <div className="text-xs text-amber-400 font-bold mb-3 uppercase tracking-wider">{speedFactor}</div>
      <div className="w-24 h-24 rounded-full border-2 border-white/20 relative flex items-center justify-center mb-3">
        <div
          className="w-1 h-10 bg-amber-400 origin-bottom rounded-full"
          style={{ transform: "rotate(" + rotation + "deg) translateY(-20px)" }}
        />
        <div className="w-2 h-2 rounded-full bg-white z-10" />
      </div>
      <div className="text-[10px] text-white/40">HOURS PASSING IN SECONDS</div>
    </div>
  );
};
