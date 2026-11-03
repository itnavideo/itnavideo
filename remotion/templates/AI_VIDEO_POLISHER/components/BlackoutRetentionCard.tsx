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

  // Gentle breathing scale: starts at 1.05 and settles slightly to 1.00
  const zoomSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  const scale = interpolate(zoomSpring, [0, 1], [1.06, 1.0]);

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
      }}
    >
      {/* Centered High-Contrast Editorial Typography */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: '0.14em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(255, 255, 255, 0.25)',
          }}
        >
          {word}
        </span>

        {/* Minimal Underline Accent */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: '#FF5722',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(255, 87, 34, 0.8)',
          }}
        />
      </div>
    </div>
  );
}

