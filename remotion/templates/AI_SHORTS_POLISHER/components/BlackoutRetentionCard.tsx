import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlackoutRetentionCardProps {
  word: string;
  triggerFrame?: number;
  durationFrames?: number; // default: 36 frames (~1.2 seconds)
}

export function BlackoutRetentionCard({
  word,
  triggerFrame = 0,
  durationFrames = 36,
}: BlackoutRetentionCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - triggerFrame;
  if (relFrame < 0 || relFrame > durationFrames) return null;

  // Gentle breathing scale for 9:16 vertical viewport
  const zoomSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  const scale = interpolate(zoomSpring, [0, 1], [1.08, 1.0]);

  // Fast in and out opacity flash
  const opacity = interpolate(
    relFrame,
    [0, 2, durationFrames - 3, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        opacity,
        pointerEvents: 'none',
        padding: 40,
      }}
    >
      {/* Centered High-Contrast Editorial Typography for 9:16 mobile */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.15,
            textShadow: '0 6px 24px rgba(255, 255, 255, 0.3)',
          }}
        >
          {word}
        </span>

        {/* Minimal Underline Accent */}
        <div
          style={{
            width: 100,
            height: 4,
            backgroundColor: '#FF5722',
            borderRadius: 2,
            boxShadow: '0 0 16px rgba(255, 87, 34, 0.9)',
          }}
        />
      </div>
    </div>
  );
}

