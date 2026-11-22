import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface YouTubeSubscribeButtonProps {
  channelName?: string;
  subscribersCount?: string;
  avatarUrl?: string;
  theme?: 'dark' | 'light' | 'red';
  showBell?: boolean;
  className?: string;
}

export const YouTubeSubscribeButton: React.FC<YouTubeSubscribeButtonProps> = ({
  channelName = 'ItnaVideo Creator',
  subscribersCount = '128K subscribers',
  avatarUrl,
  theme = 'dark',
  showBell = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro entrance pop
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Simulated cursor click timing:
  // Frame 25: Cursor glides in
  // Frame 45: Click on Subscribe (button turns grey/subscribed)
  // Frame 65: Click on Bell (bell rings with soundwave ripples)
  const clickSubscribe = frame >= 42;
  const clickBell = frame >= 68;

  // Subscribe button press bounce
  const subPress = spring({
    frame: frame - 42,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Bell ring vibration
  const bellRing = spring({
    frame: frame - 68,
    fps,
    config: { damping: 8, stiffness: 240 },
  });
  const bellAngle = clickBell ? Math.sin((frame - 68) * 0.8) * Math.max(0, 1 - (frame - 68) / 30) * 20 : 0;

  // Background styling
  const isDark = theme === 'dark';
  const cardBg = isDark
    ? 'rgba(24, 24, 27, 0.92)'
    : theme === 'red'
    ? 'rgba(30, 10, 10, 0.92)'
    : 'rgba(255, 255, 255, 0.95)';
  const textColor = isDark || theme === 'red' ? '#ffffff' : '#0f172a';
  const subtextColor = isDark || theme === 'red' ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enterProgress}) translateY(${interpolate(enterProgress, [0, 1], [30, 0])}px)`,
        opacity: enterProgress,
      }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all"
        style={{
          backgroundColor: cardBg,
          borderColor,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 30px rgba(239,68,68,0.2)',
        }}
      >
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={channelName} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
          )}
        </div>

        {/* Channel Details */}
        <div className="flex flex-col pr-2">
          <span className="font-bold text-sm tracking-tight leading-tight" style={{ color: textColor }}>
            {channelName}
          </span>
          <span className="text-xs font-medium" style={{ color: subtextColor }}>
            {subscribersCount}
          </span>
        </div>

        {/* Subscribe Action Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200"
          style={{
            transform: clickSubscribe ? `scale(${interpolate(subPress, [0, 0.5, 1], [1, 0.92, 1])})` : 'scale(1)',
            backgroundColor: clickSubscribe ? (isDark ? '#27272a' : '#e2e8f0') : '#cc0000',
            color: clickSubscribe ? (isDark ? '#e4e4e7' : '#334155') : '#ffffff',
            boxShadow: clickSubscribe ? 'none' : '0 4px 15px rgba(204,0,0,0.4)',
          }}
        >
          {clickSubscribe ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Subscribed</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>

        {/* Notification Bell */}
        {showBell && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors relative"
            style={{
              backgroundColor: clickBell ? (isDark ? '#3f3f46' : '#cbd5e1') : (isDark ? '#27272a' : '#f1f5f9'),
              transform: `rotate(${bellAngle}deg)`,
            }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: clickBell ? '#eab308' : (isDark ? '#a1a1aa' : '#64748b') }}
              fill={clickBell ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Ripple rings when bell rings */}
            {clickBell && frame < 95 && (
              <span
                className="absolute inset-0 rounded-full border border-amber-400 pointer-events-none"
                style={{
                  transform: `scale(${interpolate(frame - 68, [0, 25], [1, 1.8])})`,
                  opacity: interpolate(frame - 68, [0, 25], [0.8, 0]),
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
