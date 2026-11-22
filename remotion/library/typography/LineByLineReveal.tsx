import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LineByLineRevealProps {
  lines?: string[];
  staggerDelay?: number;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_LINES = [
  'ARCHITECTING THE FUTURE',
  'OF COMPUTATIONAL VIDEO',
  'ONE COMPONENT AT A TIME',
];

/**
 * LineByLineReveal — Editorial headline mask reveal.
 * Slides lines upward from beneath an invisible clipping boundary.
 */
export function LineByLineReveal({
  lines = DEFAULT_LINES,
  staggerDelay = 8,
  accentColor = '#f59e0b',
  fontSize = 36,
  delay = 0,
  width = '100%',
  height = 200,
}: LineByLineRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

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
        gap: 6,
        padding: 20,
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {lines.map((line, idx) => {
        const lineSpr = spring({
          frame: Math.max(0, t - idx * staggerDelay),
          fps,
          config: { damping: 14, stiffness: 85 },
        });

        const translateY = interpolate(lineSpr, [0, 1], [100, 0]);
        const opacity = interpolate(lineSpr, [0, 1], [0, 1]);
        const isAccent = idx === 1;

        return (
          <div
            key={idx}
            style={{
              overflow: 'hidden',
              padding: '2px 0',
            }}
          >
            <div
              style={{
                fontSize,
                fontWeight: 900,
                color: isAccent ? accentColor : '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                transform: `translateY(${translateY}%)`,
                opacity,
                textShadow: isAccent ? `0 0 20px ${accentColor}44` : '0 4px 12px rgba(0,0,0,0.6)',
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
}
