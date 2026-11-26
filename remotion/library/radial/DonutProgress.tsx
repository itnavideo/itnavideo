import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DonutProgressSegment {
  label: string;
  value: number; // percentage
  color: string;
}

export interface DonutProgressProps {
  title?: string;
  subtitle?: string;
  centerNumber?: string;
  centerText?: string;
  segments?: DonutProgressSegment[];
  size?: number;
  strokeWidth?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  showLegend?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_SEGMENTS: DonutProgressSegment[] = [
  { label: 'Completed', value: 65, color: '#10B981' },
  { label: 'In Progress', value: 25, color: '#0066FF' },
  { label: 'Pending', value: 10, color: '#F59E0B' },
];

export const DonutProgress: React.FC<DonutProgressProps> = ({
  title = 'Progress & Quota Allocation',
  subtitle = 'Goal breakdown & status distribution',
  centerNumber = '65%',
  centerText = 'Goal Reached',
  segments = DEFAULT_SEGMENTS,
  size = 260,
  strokeWidth = 26,
  theme = 'dark',
  delayFrames = 5,
  showLegend = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const items = segments && segments.length > 0 ? segments : DEFAULT_SEGMENTS;
  const total = items.reduce((acc, s) => acc + s.value, 0) || 100;

  const progressSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  let accumulatedPercent = 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '18px', width: '100%' }}>
          {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* SVG Donut */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Base track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Multi-segment strokes */}
          {items.map((seg, idx) => {
            const segPercent = seg.value / total;
            const strokeDasharray = `${circumference * segPercent * progressSpring} ${circumference}`;
            const strokeDashoffset = -circumference * accumulatedPercent * progressSpring;
            accumulatedPercent += segPercent;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center Numbers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: `${size * 0.18}px`,
              fontWeight: 900,
              color: textColor,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {centerNumber}
          </div>
          {centerText && (
            <div
              style={{
                fontSize: `${size * 0.052}px`,
                fontWeight: 700,
                color: textMuted,
                marginTop: '4px',
                textTransform: 'uppercase',
              }}
            >
              {centerText}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          {items.map((seg, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: seg.color }} />
              <span style={{ fontWeight: 600 }}>{seg.label}</span>
              <span style={{ fontWeight: 800, color: seg.color }}>{seg.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
