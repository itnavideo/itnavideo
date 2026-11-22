import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VerticalTextProps {
  primaryText?: string;
  subText?: string;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * VerticalText — Cyberpunk & East-Asian vertical column typography.
 * Renders vertical reading text with luminescent borders and high contrast.
 */
export function VerticalText({
  primaryText = 'CYBERNETIC',
  subText = '未来の創造',
  accentColor = '#ec4899',
  fontSize = 32,
  delay = 0,
  width = 120,
  height = 340,
}: VerticalTextProps) {
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
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity: intro,
        transform: `translateY(${interpolate(intro, [0, 1], [-30, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Primary Vertical Text */}
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontSize,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.18em',
          textShadow: `0 0 16px ${accentColor}66`,
        }}
      >
        {primaryText}
      </div>

      {/* Vertical Accent Divider */}
      <div
        style={{
          width: 2,
          height: '70%',
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      />

      {/* Sub Asian Kanji / Script */}
      <div
        style={{
          writingMode: 'vertical-rl',
          fontSize: fontSize * 0.45,
          color: accentColor,
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}
      >
        {subText}
      </div>
    </div>
  );
}
