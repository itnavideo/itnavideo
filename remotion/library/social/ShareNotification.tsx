import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ShareNotificationProps {
  headline?: string;
  metric?: string;
  subtext?: string;
  platformIcon?: 'viral' | 'tiktok' | 'youtube' | 'instagram';
  className?: string;
}

export const ShareNotification: React.FC<ShareNotificationProps> = ({
  headline = 'Trending Fast',
  metric = '1,420 shares in the last hour',
  subtext = '98.4% engagement retention rate',
  platformIcon = 'viral',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 130 } });
  const pulse = Math.sin(frame * 0.15) * 0.05 + 1;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [-25, 0])}px) scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 20, 24, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(244, 63, 94, 0.25)',
        }}
      >
        {/* Animated Fire Icon */}
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg flex-shrink-0"
          style={{ transform: `scale(${pulse})` }}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-xs uppercase tracking-wider">{headline}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="text-zinc-200 font-bold text-sm tracking-tight">{metric}</span>
          <span className="text-zinc-500 text-[11px] font-medium">{subtext}</span>
        </div>
      </div>
    </div>
  );
};
