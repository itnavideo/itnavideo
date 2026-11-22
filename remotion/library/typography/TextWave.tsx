import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextWaveProps {
  text?: string;
  waveAmplitude?: number;
  waveFrequency?: number;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextWave — Harmonic sine-wave floating character ripple.
 * Undulates each letter along a continuous rhythmic sine path.
 */
export function TextWave({
  text = 'OCEANIC HARMONICS',
  waveAmplitude = 12,
  waveFrequency = 0.15,
  accentColor = '#06b6d4',
  fontSize = 38,
  delay = 0,
  width = '100%',
  height = 140,
}: TextWaveProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const chars = text.split('');

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {chars.map((char, i) => {
        // Offset wave per letter
        const waveY = Math.sin(t * waveFrequency + i * 0.4) * waveAmplitude;
        const isSpace = char === ' ';

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight: 900,
              color: i % 2 === 0 ? '#ffffff' : accentColor,
              transform: `translateY(${waveY}px)`,
              width: isSpace ? 14 : 'auto',
              textShadow: `0 4px 12px rgba(0,0,0,0.6)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
