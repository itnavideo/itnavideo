import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KillStreakPopupProps {
  streakName?: string;
  multiplier?: string;
  kills?: number;
  themeColor?: string;
  className?: string;
}

export const KillStreakPopup: React.FC<KillStreakPopupProps> = ({
  streakName = 'RAMPAGE!',
  multiplier = '5x MULTI-KILL',
  kills = 5,
  themeColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const shake = Math.sin(frame * 0.4) * Math.max(0, 1 - frame / 30) * 4;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter}) translateX(${shake}px)`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-3.5 px-6 py-3 rounded-2xl border-2 backdrop-blur-2xl shadow-2xl relative overflow-hidden font-black"
        style={{
          background: 'rgba(15, 12, 10, 0.95)',
          borderColor: themeColor,
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.9), 0 0 35px ${themeColor}60`,
        }}
      >
        {/* Skull Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
            <path d="M12 2c-4.42 0-8 3.58-8 8 0 2.97 1.63 5.56 4.04 6.94.13.07.24.18.29.32l.67 1.83v2.91h6v-2.91l.67-1.83c.05-.14.16-.25.29-.32C18.37 15.56 20 12.97 20 10c0-4.42-3.58-8-8-8zm-3 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </div>

        {/* Text Banner */}
        <div className="flex flex-col">
          <span
            className="text-2xl tracking-tighter uppercase italic"
            style={{ color: themeColor }}
          >
            {streakName}
          </span>
          <span className="text-white text-xs font-mono tracking-widest">{multiplier}</span>
        </div>
      </div>
    </div>
  );
};
