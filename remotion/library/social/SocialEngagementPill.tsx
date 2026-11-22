import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SocialEngagementPillProps {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  accentColor?: string;
  className?: string;
}

export const SocialEngagementPill: React.FC<SocialEngagementPillProps> = ({
  likes = 12480,
  comments = 942,
  shares = 3510,
  saves = 1840,
  accentColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame * 0.1) * 0.04;

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter + pulse})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{
          background: 'rgba(15, 15, 18, 0.92)',
          boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 25px ${accentColor}25`,
        }}
      >
        {/* Likes */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-white font-bold text-xs tracking-tight">{formatCount(likes)}</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* Comments */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400 fill-current" viewBox="0 0 24 24">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
          </svg>
          <span className="text-white font-bold text-xs tracking-tight">{formatCount(comments)}</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* Shares */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
          <span className="text-white font-bold text-xs tracking-tight">{formatCount(shares)}</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* Saves */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
          <span className="text-white font-bold text-xs tracking-tight">{formatCount(saves)}</span>
        </div>
      </div>
    </div>
  );
};
