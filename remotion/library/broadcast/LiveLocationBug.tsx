import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LiveLocationBugProps {
  location?: string;
  localTime?: string;
  isLive?: boolean;
  className?: string;
}

export const LiveLocationBug: React.FC<LiveLocationBugProps> = ({
  location = 'TOKYO, JAPAN',
  localTime = '22:45 JST',
  isLive = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-3 flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div className="flex items-center rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/90 backdrop-blur-xl">
        {/* Red LIVE Flag */}
        {isLive && (
          <div className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">LIVE</span>
          </div>
        )}

        {/* Location & Time */}
        <div className="px-3.5 py-1.5 flex items-center gap-2 text-xs">
          <span className="text-white font-bold tracking-tight">{location}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 font-semibold">{localTime}</span>
        </div>
      </div>
    </div>
  );
};
