import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CountdownBugProps {
  eventName?: string;
  hours?: number;
  minutes?: number;
  seconds?: number;
  className?: string;
}

export const CountdownBug: React.FC<CountdownBugProps> = ({
  eventName = 'SPECIAL KEYNOTE LIVESTREAM',
  hours = 0,
  minutes = 14,
  seconds = 32,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`p-2 flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-xl shadow-xl bg-zinc-950/90 text-xs">
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider truncate max-w-36">
          {eventName}
        </span>
        <div className="flex items-center gap-1 text-amber-400 font-black text-sm tracking-tight border-l border-white/10 pl-2">
          <span>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</span>
        </div>
      </div>
    </div>
  );
};
