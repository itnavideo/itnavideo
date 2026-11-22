import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KaraokeTextProps {
  lyric?: string;
  fillColor?: string;
  baseColor?: string;
  fillDurationFrames?: number;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * KaraokeText — Continuous left-to-right color-fill karaoke lyric visualizer.
 * Wipes a glowing accent color across typography synchronously with vocal audio tracks.
 */
export function KaraokeText({
  lyric = 'DON’T STOP BELIEVING IN THE DREAM',
  fillColor = '#ec4899',
  baseColor = 'rgba(255, 255, 255, 0.3)',
  fillDurationFrames = 60,
  fontSize = 38,
  delay = 0,
  width = '100%',
  height = 140,
}: KaraokeTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const fillPercent = Math.min(100, Math.max(0, (t / fillDurationFrames) * 100));

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
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Background Dim Text */}
      <div
        style={{
          position: 'absolute',
          fontSize,
          fontWeight: 900,
          color: baseColor,
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}
      >
        {lyric}
      </div>

      {/* Foreground Filled Text Masked by Clip Path */}
      <div
        style={{
          position: 'absolute',
          fontSize,
          fontWeight: 900,
          color: fillColor,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          clipPath: `polygon(0 0, ${fillPercent}% 0, ${fillPercent}% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 0, ${fillPercent}% 0, ${fillPercent}% 100%, 0 100%)`,
          textShadow: `0 0 20px ${fillColor}aa`,
        }}
      >
        {lyric}
      </div>
    </div>
  );
}
