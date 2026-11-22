import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UpcomingSegmentTeaserProps {
  segmentTitle?: string;
  guestPreview?: string;
  timeAway?: string;
  className?: string;
}

export const UpcomingSegmentTeaser: React.FC<UpcomingSegmentTeaserProps> = ({
  segmentTitle = 'Exclusive Hands-on with Next-Gen Remotion Lambda Cloud Rendering',
  guestPreview = 'With Founder & Lead Systems Architect',
  timeAway = 'COMING UP IN 5 MIN',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 flex items-center justify-start pointer-events-none font-sans ${className}`}
      style={{
        transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 14, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(168, 85, 247, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest pb-1.5 border-b border-white/10">
          <span>{timeAway}</span>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        </div>

        <h4 className="text-white font-extrabold text-sm tracking-tight mt-2 leading-snug">
          {segmentTitle}
        </h4>

        <div className="text-zinc-400 text-xs mt-1 truncate">
          {guestPreview}
        </div>
      </div>
    </div>
  );
};
