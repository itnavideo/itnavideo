import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SpectrumVisualizerProps {
  type?: 'linear' | 'radial';
  bands?: number;
  radius?: number;
  maxBarHeight?: number;
  color?: string;
  accentColor?: string;
  glow?: boolean;
  speed?: number;
  sensitivity?: number;
  children?: React.ReactNode;
}

/**
 * SpectrumVisualizer — Multi-band audio spectrum analyzer.
 * Features both linear frequency equalizer and circular radial halo mode
 * (ideal for encircling avatars, podcast logos, and speech hubs).
 */
export function SpectrumVisualizer({
  type = 'linear',
  bands = 24,
  radius = 90,
  maxBarHeight = 50,
  color = '#10b981',
  accentColor = '#6366f1',
  glow = true,
  speed = 1.5,
  sensitivity = 1,
  children,
}: SpectrumVisualizerProps) {
  const frame = useCurrentFrame();

  if (type === 'radial') {
    return (
      <div
        style={{
          position: 'relative',
          width: radius * 2 + maxBarHeight * 2,
          height: radius * 2 + maxBarHeight * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Radiating bars */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
        >
          {Array.from({ length: bands }).map((_, i) => {
            const angle = (i / bands) * 360;
            const rad = (angle * Math.PI) / 180;

            const osc =
              Math.sin(frame * 0.12 * speed + i * 0.6) * 0.5 +
              Math.cos(frame * 0.08 * speed - i * 0.4) * 0.5;

            const barLen = Math.max(8, (osc + 1) * 0.5 * maxBarHeight * sensitivity);

            const centerX = radius + maxBarHeight;
            const centerY = radius + maxBarHeight;

            const x1 = centerX + Math.cos(rad) * radius;
            const y1 = centerY + Math.sin(rad) * radius;
            const x2 = centerX + Math.cos(rad) * (radius + barLen);
            const y2 = centerY + Math.sin(rad) * (radius + barLen);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                filter={glow ? 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.7))' : undefined}
              />
            );
          })}
        </svg>

        {/* Center content slot (e.g. Avatar) */}
        {children && (
          <div
            style={{
              position: 'relative',
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  }

  // Linear Equalizer Mode
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 6,
        height: maxBarHeight + 20,
        padding: '0 12px',
      }}
    >
      {Array.from({ length: bands }).map((_, i) => {
        const wave =
          Math.sin(frame * 0.14 * speed + i * 0.5) * 0.6 +
          Math.cos(frame * 0.09 * speed + i * 1.2) * 0.4;

        const norm = (wave + 1) / 2;
        const currentHeight = Math.max(8, norm * maxBarHeight * sensitivity);

        // Peak dot
        const peakHeight = Math.min(maxBarHeight + 12, currentHeight + 6);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {/* Peak indicator dot */}
            <div
              style={{
                width: 5,
                height: 2,
                borderRadius: 1,
                backgroundColor: accentColor,
                opacity: 0.85,
              }}
            />

            {/* EQ Column bar */}
            <div
              style={{
                width: 6,
                height: currentHeight,
                borderRadius: 3,
                background: `linear-gradient(to top, ${color}, ${accentColor})`,
                boxShadow: glow ? `0 0 10px ${color}80` : 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
