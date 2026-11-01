import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticCalloutPillProps {
  badge: string;
  title: string;
  sub?: string;
  startFrame: number;
  x?: number;
  y?: number;
  color?: string;
}

export const KineticCalloutPill: React.FC<KineticCalloutPillProps> = ({
  badge,
  title,
  sub,
  startFrame,
  x = 0,
  y = 0,
  color = '#FF5722',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  if (frame < startFrame) return null;

  const entrance = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateY(${(1 - entrance) * 30}px) scale(${entrance})`,
        opacity: interpolate(elapsed, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          backgroundColor: 'rgba(15, 23, 42, 0.90)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 999,
          padding: '10px 24px',
          boxShadow: `0 12px 32px -6px rgba(0, 0, 0, 0.6), 0 0 20px -2px ${color}33`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <span
          style={{
            backgroundColor: `${color}25`,
            color: color,
            border: `1px solid ${color}60`,
            borderRadius: 999,
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </span>
          {sub && (
            <span
              style={{
                color: '#94A3B8',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
