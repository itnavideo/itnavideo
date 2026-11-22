import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextReflectionProps {
  text?: string;
  textColor?: string;
  reflectionOpacity?: number;
  reflectionHeight?: number;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextReflection — Luxury automotive/tech showroom mirror reflection.
 * Displays mirrored headline reflection with gradient fade-to-dark floor decay.
 */
export function TextReflection({
  text = 'AURA SOUNDSTAGE',
  textColor = '#ffffff',
  reflectionOpacity = 0.35,
  reflectionHeight = 50,
  fontSize = 44,
  delay = 0,
  width = '100%',
  height = 200,
}: TextReflectionProps) {
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Primary Upright Text */}
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color: textColor,
          letterSpacing: '0.04em',
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          zIndex: 2,
        }}
      >
        {text}
      </div>

      {/* Mirrored Floor Reflection */}
      <div
        style={{
          position: 'relative',
          fontSize,
          fontWeight: 900,
          color: textColor,
          letterSpacing: '0.04em',
          textAlign: 'center',
          transform: 'scaleY(-1) translateY(4px)',
          opacity: reflectionOpacity,
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 20%, rgba(0,0,0,0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 20%, rgba(0,0,0,0.9) 100%)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
}
