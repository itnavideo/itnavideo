import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BreakingNewsBannerProps {
  headline?: string;
  tickerText?: string;
  channelName?: string;
  className?: string;
}

export const BreakingNewsBanner: React.FC<BreakingNewsBannerProps> = ({
  headline = 'MAJOR BREAKTHROUGH ANNOUNCED IN AUTONOMOUS AI VIDEO GENERATION',
  tickerText = 'MARKETS SURGE AS TECH GIANTS ADOPT PROGRAMMATIC VIDEO PIPELINES • VENTURE CAPITAL FLOWS INTO GENERATIVE MEDIA • LIVE UPDATES EVERY 15 MINUTES',
  channelName = 'GLOBAL NEWS 24',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const crawlOffset = (frame * 2.5) % 800;

  return (
    <div
      className={`w-full flex flex-col justify-end p-4 pointer-events-none ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        opacity: enter,
      }}
    >
      <div className="w-full shadow-2xl overflow-hidden font-sans">
        {/* Main Headline Banner */}
        <div className="flex items-stretch bg-zinc-950/95 border-t-2 border-red-600">
          {/* Flashing Red Bug */}
          <div className="bg-red-600 px-5 py-3 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm uppercase tracking-widest animate-pulse">
              BREAKING NEWS
            </span>
          </div>

          {/* Headline Text */}
          <div className="flex-1 px-5 py-3 flex items-center bg-black/80">
            <h2 className="text-white font-extrabold text-sm md:text-base tracking-tight truncate">
              {headline}
            </h2>
          </div>

          {/* Channel Name */}
          <div className="bg-zinc-900 px-4 py-3 flex items-center border-l border-white/10 flex-shrink-0">
            <span className="text-zinc-300 font-mono text-xs font-bold">{channelName}</span>
          </div>
        </div>

        {/* Lower Crawl Tape */}
        <div className="bg-amber-500 py-1.5 px-4 overflow-hidden relative flex items-center">
          <div
            className="whitespace-nowrap font-mono font-bold text-xs text-black tracking-wide"
            style={{ transform: `translateX(-${crawlOffset}px)` }}
          >
            {tickerText} • {tickerText}
          </div>
        </div>
      </div>
    </div>
  );
};
