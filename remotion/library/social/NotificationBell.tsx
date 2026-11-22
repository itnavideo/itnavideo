import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NotificationBellProps {
  unreadCount?: number;
  label?: string;
  theme?: 'dark' | 'amber' | 'emerald';
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount = 3,
  label = 'New Video Alert',
  theme = 'dark',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Bell swing oscillation
  const swingAngle = Math.sin(frame * 0.25) * Math.max(0, 1 - (frame / 60)) * 18;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: 'rgba(15, 15, 18, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(234, 179, 8, 0.2)',
        }}
      >
        {/* Bell container with swing */}
        <div className="relative flex-shrink-0" style={{ transform: `rotate(${swingAngle}deg)` }}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          </div>

          {/* Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-md border border-zinc-950">
              {unreadCount}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-white font-bold text-xs tracking-tight">{label}</span>
          <span className="text-zinc-400 text-[11px]">Turn on all notifications</span>
        </div>
      </div>
    </div>
  );
};
