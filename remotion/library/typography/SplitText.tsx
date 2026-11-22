import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SplitTextProps {
  text?: string;
  staggerFrames?: number;
  mode?: 'words' | 'chars';
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * SplitText — GSAP-style staggered character and word splitting animation.
 * Animates each individual character or word with progressive spring delays and upward slide.
 */
export function SplitText({
  text = 'BUILD WITHOUT BOUNDARIES',
  staggerFrames = 2,
  mode = 'words',
  accentColor = '#38bdf8',
  fontSize = 38,
  delay = 0,
  width = '100%',
  height = 140,
}: SplitTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const units = mode === 'words' ? text.split(' ') : text.split('');

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: mode === 'words' ? 12 : 2,
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {units.map((unit, idx) => {
        const spr = spring({
          frame: Math.max(0, t - idx * staggerFrames),
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const translateY = interpolate(spr, [0, 1], [30, 0]);
        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const isAccent = idx % 2 === 1;

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight: 900,
              color: isAccent ? accentColor : '#ffffff',
              transform: `translateY(${translateY}px)`,
              opacity,
              textShadow: isAccent ? `0 0 16px ${accentColor}66` : '0 4px 12px rgba(0,0,0,0.6)',
            }}
          >
            {unit}
          </span>
        );
      })}
    </div>
  );
}
