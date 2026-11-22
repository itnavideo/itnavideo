import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlowDirectionIndicatorProps {
  arrowCount?: number;
  direction?: 'right' | 'left' | 'down' | 'up';
  speed?: number;
  label?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * FlowDirectionIndicator — Multi-chevron animated pipeline flow velocity indicator.
 * Displays traveling chevron pulses showing directional current and throughput.
 */
export function FlowDirectionIndicator({
  arrowCount = 5,
  direction = 'right',
  speed = 1,
  label = 'Pipeline Flow → 100 MB/s',
  accentColor = '#06b6d4',
  delay = 0,
  width = 320,
  height = 70,
}: FlowDirectionIndicatorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Sequential Traveling Chevrons */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {[...Array(arrowCount)].map((_, i) => {
          const phase = Math.sin((t * 0.15 * speed) - i * 0.6);
          const opacity = 0.2 + 0.8 * Math.max(0, phase);
          const scale = 0.9 + 0.2 * Math.max(0, phase);

          return (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity,
                transform: `scale(${scale})`,
                filter: `drop-shadow(0 0 6px ${accentColor})`,
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          );
        })}
      </div>

      {/* Label */}
      {label && (
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 6 }}>
          {label}
        </div>
      )}
    </div>
  );
}
