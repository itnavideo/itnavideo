import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface UrgencyTimerBannerProps {
  headline?: string;
  hours?: number;
  minutes?: number;
  seconds?: number;
  className?: string;
}

export const UrgencyTimerBanner: React.FC<UrgencyTimerBannerProps> = ({
  headline = 'SPECIAL FOUNDER DEAL ENDS IN:',
  hours = 4,
  minutes = 18,
  seconds = 42,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-rose-500/30 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>SCARCITY COUNTER</span>
        </span>
        <span className="text-rose-400 font-bold">ONLY 7 LICENSES LEFT</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3">
        <div className="text-sm font-bold tracking-wider text-rose-300 font-mono">{headline}</div>
        <div className="flex items-center space-x-3 font-mono">
          <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center min-w-[56px]">
            <div className="text-2xl font-black text-white">0{hours}</div>
            <div className="text-[9px] text-white/40">HOURS</div>
          </div>
          <span className="text-xl font-bold text-rose-400">:</span>
          <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center min-w-[56px]">
            <div className="text-2xl font-black text-white">{minutes}</div>
            <div className="text-[9px] text-white/40">MINS</div>
          </div>
          <span className="text-xl font-bold text-rose-400">:</span>
          <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-center min-w-[56px]">
            <div className="text-2xl font-black text-rose-400">{seconds}</div>
            <div className="text-[9px] text-white/40">SECS</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PROMO APPLIED: AUTOMATIC 40% OFF</span>
        <span>FINAL NOTICE</span>
      </div>
    </div>
  );
};
