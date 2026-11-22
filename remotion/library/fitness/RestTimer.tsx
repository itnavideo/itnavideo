import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RestTimerProps {
  secondsRemaining?: number;
  totalRestSeconds?: number;
  exerciseNext?: string;
  className?: string;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  secondsRemaining = 45,
  totalRestSeconds = 90,
  exerciseNext = 'Set 4: Incline Dumbbell Press',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const restProgress = ((secondsRemaining / totalRestSeconds) * 100);

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-sky-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 16, 22, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(14, 165, 233, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            RECOVERY & HYDRATION
          </span>
          <span className="text-zinc-400 text-[11px]">Next: {exerciseNext}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold">REST REMAINING</span>
            <span className="text-3xl font-black text-white">{secondsRemaining}s</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-sky-300 bg-sky-950/60 px-3 py-1.5 rounded-xl border border-sky-500/20">
            <span>🥤 Take a sip</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/10 mt-3 overflow-hidden">
          <div
            className="h-full bg-sky-400 rounded-full transition-all"
            style={{ width: `${restProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
