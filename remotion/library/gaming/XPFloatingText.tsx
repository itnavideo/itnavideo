import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface XPFloatingTextProps {
  amount?: string;
  label?: string;
  variant?: 'xp' | 'crit' | 'heal';
  className?: string;
}

export const XPFloatingText: React.FC<XPFloatingTextProps> = ({
  amount = '+750 XP',
  label = 'HEADSHOT BONUS',
  variant = 'xp',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  // Upward floating drift and fade
  const driftY = interpolate(frame, [0, 60], [0, -50]);
  const opacity = interpolate(frame, [0, 40, 60], [1, 1, 0]);

  const styleMap = {
    xp: { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.6)' },
    crit: { color: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.6)' },
    heal: { color: '#34d399', shadow: 'rgba(52, 211, 153, 0.6)' },
  }[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center p-3 font-mono font-black pointer-events-none ${className}`}
      style={{
        transform: `translateY(${driftY}px) scale(${enter})`,
        opacity,
      }}
    >
      <span
        className="text-3xl tracking-tight drop-shadow-lg"
        style={{
          color: styleMap.color,
          textShadow: `0 0 15px ${styleMap.shadow}`,
        }}
      >
        {amount}
      </span>
      <span className="text-[11px] text-white/90 uppercase tracking-widest mt-0.5 bg-black/60 px-2 py-0.5 rounded border border-white/10">
        {label}
      </span>
    </div>
  );
};
