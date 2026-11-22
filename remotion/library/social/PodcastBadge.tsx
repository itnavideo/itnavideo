import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PodcastBadgeProps {
  podcastTitle?: string;
  episodeTitle?: string;
  hostName?: string;
  duration?: string;
  platform?: 'spotify' | 'apple' | 'generic';
  className?: string;
}

export const PodcastBadge: React.FC<PodcastBadgeProps> = ({
  podcastTitle = 'The AI Creator Hour',
  episodeTitle = 'Ep #42: Autonomous Video Pipelines',
  hostName = 'Rohit & Team',
  duration = '24:15',
  platform = 'spotify',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // 6 Equalizer audio frequency bars
  const bars = [0.7, 0.4, 0.9, 0.5, 0.8, 0.3];

  const platformColor = platform === 'spotify' ? '#1db954' : platform === 'apple' ? '#b83bfa' : '#38bdf8';

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 18, 20, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px ${platformColor}20`,
        }}
      >
        <div className="flex items-center gap-3.5">
          {/* Podcast Album Art Thumbnail */}
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 overflow-hidden">
            <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>

            {/* Little Live Equalizer Overlay in Corner */}
            <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
              {bars.map((bar, i) => {
                const height = Math.abs(Math.sin((frame * 0.2) + i * 1.2)) * 12 + 3;
                return (
                  <div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{
                      height: `${height}px`,
                      backgroundColor: platformColor,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platformColor }} />
              <span className="truncate">{podcastTitle}</span>
            </div>
            <h4 className="text-white font-bold text-sm truncate mt-0.5">{episodeTitle}</h4>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
              <span className="truncate">Host: {hostName}</span>
              <span className="font-mono text-[11px] text-zinc-500">{duration}</span>
            </div>
          </div>
        </div>

        {/* Audio Progress Scrubber */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((frame * 0.8) % 100)}%`,
                backgroundColor: platformColor,
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Available on All Platforms</span>
        </div>
      </div>
    </div>
  );
};
