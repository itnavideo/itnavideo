import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RotatingWordsProps {
  prefix?: string;
  words?: string[];
  suffix?: string;
  accentColor?: string;
  intervalFrames?: number;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_WORDS = ['10X FASTER', 'SMARTER', 'AUTOMATICALLY', 'EFFORTLESSLY'];

/**
 * RotatingWords — Slot-machine dynamic rotating phrase cycler.
 * Cycles words in a headline with 3D barrel spin motion.
 */
export function RotatingWords({
  prefix = 'Produce Reels',
  words = DEFAULT_WORDS,
  suffix = 'with Itnavideo',
  accentColor = '#10b981',
  intervalFrames = 30,
  fontSize = 32,
  delay = 0,
  width = '100%',
  height = 120,
}: RotatingWordsProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const wordIndex = Math.floor(t / intervalFrames) % words.length;
  const currentWord = words[wordIndex];

  // Local frame within word rotation
  const localT = t % intervalFrames;
  const flipSpr = spring({
    frame: localT,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const translateY = interpolate(flipSpr, [0, 1], [40, 0]);
  const opacity = interpolate(flipSpr, [0, 0.4, 1], [0, 0.8, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <span style={{ fontSize, fontWeight: 800, color: '#ffffff' }}>
        {prefix}
      </span>

      {/* Rotating Word Pill */}
      <span
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          padding: '4px 14px',
          borderRadius: 10,
          background: `${accentColor}18`,
          border: `1.5px solid ${accentColor}55`,
          color: accentColor,
          fontSize,
          fontWeight: 900,
          boxShadow: `0 0 16px ${accentColor}33`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: `translateY(${translateY}px)`,
            opacity,
          }}
        >
          {currentWord}
        </span>
      </span>

      <span style={{ fontSize, fontWeight: 800, color: '#ffffff' }}>
        {suffix}
      </span>
    </div>
  );
}
