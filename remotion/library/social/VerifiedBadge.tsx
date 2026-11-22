import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VerifiedBadgeProps {
  label?: string;
  subtitle?: string;
  variant?: 'blue' | 'gold' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  label = 'Official Verified Creator',
  subtitle = 'Identity & Channel Authenticated',
  variant = 'blue',
  size = 'md',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const checkPop = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 220 } });
  const glowPulse = Math.sin(frame * 0.12) * 0.15 + 0.85;

  const colorMap = {
    blue: {
      badge: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.4)',
      bg: 'rgba(2, 132, 199, 0.1)',
    },
    gold: {
      badge: '#d97706',
      glow: 'rgba(217, 119, 6, 0.4)',
      bg: 'rgba(217, 119, 6, 0.1)',
    },
    emerald: {
      badge: '#059669',
      glow: 'rgba(5, 150, 105, 0.4)',
      bg: 'rgba(5, 150, 105, 0.1)',
    },
  }[variant];

  const iconSizes = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }[size];

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 15, 18, 0.92)',
          boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 25px ${colorMap.glow}`,
        }}
      >
        {/* Animated Checkmark Badge */}
        <div
          className={`relative ${iconSizes} rounded-full flex items-center justify-center flex-shrink-0`}
          style={{
            backgroundColor: colorMap.badge,
            transform: `scale(${checkPop})`,
            boxShadow: `0 0 15px ${colorMap.badge}`,
          }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          {/* Radial animated pulse ring */}
          <span
            className="absolute inset-0 rounded-full border border-white/40 pointer-events-none"
            style={{
              transform: `scale(${interpolate(frame % 40, [0, 40], [1, 1.8])})`,
              opacity: interpolate(frame % 40, [0, 40], [0.8, 0]),
            }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-tight">{label}</span>
          <span className="text-zinc-400 text-xs font-medium">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};
