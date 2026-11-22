import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LofiVibePlayerProps {
  trackName?: string;
  artist?: string;
  currentTime?: string;
  totalDuration?: string;
  className?: string;
}

export const LofiVibePlayer: React.FC<LofiVibePlayerProps> = ({
  trackName = 'Rainy Window Memories',
  artist = 'Chilled Cow & Lo-Fi Beats',
  currentTime = '01:24',
  totalDuration = '03:15',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const albumSpin = (frame * 1.5) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(16, 12, 22, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(168, 85, 247, 0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Rotating Album Art Disc */}
          <div
            className="w-16 h-16 rounded-full border-2 border-purple-400/40 bg-zinc-950 flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ transform: `rotate(${albumSpin}deg)` }}
          >
            <div className="w-6 h-6 rounded-full bg-purple-600/80 border border-white/20" />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
              LO-FI RADIO 24/7
            </span>
            <h4 className="text-white font-bold text-sm truncate mt-0.5">{trackName}</h4>
            <span className="text-zinc-400 text-xs truncate block">{artist}</span>
          </div>
        </div>

        {/* Progress Bar & Timestamp */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-1.5">
            <div className="h-full bg-purple-400 rounded-full w-2/5" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>{currentTime}</span>
            <span>{totalDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
