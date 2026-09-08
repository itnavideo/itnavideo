import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface StatBadgeProps {
  value: string;
  label?: string;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
  fontFamily?: string;
}

export function StatBadge({
  value,
  label,
  trend = 'up',
  accentColor = '#10B981',
  fontFamily = 'Montserrat, sans-serif',
}: StatBadgeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const scale = interpolate(spr, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      className="inline-flex flex-col items-center justify-center rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.07)',
        transform: `scale(${scale})`,
        opacity,
        fontFamily,
      }}
    >
      <div
        className="text-7xl font-black uppercase tracking-tight"
        style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}80` }}
      >
        {value}
      </div>
      {label && (
        <div className="mt-2 text-sm font-extrabold uppercase tracking-widest text-gray-300">
          {label} {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '•'}
        </div>
      )}
    </div>
  );
}

