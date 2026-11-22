import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MatchTimerProps {
  clock?: string;
  injuryTime?: string;
  live?: boolean;
  className?: string;
}

export const MatchTimer: React.FC<MatchTimerProps> = ({
  clock = "89:45",
  injuryTime = "+4'",
  live = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-2 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-2xl shadow-xl bg-black/80 text-xs"
      >
        {live && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        <span className="font-black text-white text-sm tracking-tight">{clock}</span>
        {injuryTime && (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-500/30">
            {injuryTime}
          </span>
        )}
      </div>
    </div>
  );
};
