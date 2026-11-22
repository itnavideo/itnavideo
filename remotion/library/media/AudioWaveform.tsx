import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AudioWaveformProps {
  bars?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  color?: string;
  activeColor?: string;
  mirror?: boolean;
  speed?: number;
  glow?: boolean;
  frequencyFactor?: number;
  amplitude?: number;
  style?: React.CSSProperties;
}

/**
 * AudioWaveform — Kinetic sound wave visualizer.
 * Deterministic mathematical oscillation using sin/cos harmonics,
 * configurable bars (16 to 64), center mirror mode, and neon glow.
 */
export function AudioWaveform({
  bars = 32,
  height = 80,
  barWidth = 4,
  gap = 4,
  color = 'rgba(255, 255, 255, 0.25)',
  activeColor = '#10b981',
  mirror = true,
  speed = 1.8,
  glow = true,
  frequencyFactor = 0.35,
  amplitude = 1,
  style,
}: AudioWaveformProps) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: mirror ? height : height / 2,
        gap,
        ...style,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Multi-frequency harmonic wave formula
        const phase = (i / bars) * Math.PI * 4;
        const wave1 = Math.sin(frame * 0.1 * speed + phase * frequencyFactor);
        const wave2 = Math.cos(frame * 0.07 * speed - phase * 0.5);
        const wave3 = Math.sin(frame * 0.15 * speed + i * 0.8);

        // Normalized scale between 0.12 and 1.0
        const rawScale = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + 1) / 2;
        const barHeight = Math.max(6, Math.min(height, rawScale * height * amplitude));

        // Active center bias
        const centerDistance = Math.abs(i - bars / 2) / (bars / 2);
        const intensity = 1 - centerDistance * 0.4;
        const currentHeight = barHeight * intensity;

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: currentHeight,
              borderRadius: barWidth / 2,
              backgroundColor: activeColor,
              backgroundImage: `linear-gradient(to top, ${activeColor}, #34d399)`,
              boxShadow: glow ? `0 0 10px ${activeColor}80` : 'none',
              transition: 'none',
            }}
          />
        );
      })}
    </div>
  );
}
