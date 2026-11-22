import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextShadowProps {
  text?: string;
  shadowColor?: string;
  shadowBlur?: number;
  textColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextShadow — Atmospheric neon glow & deep cinematic cast drop shadow.
 */
export function TextShadow({
  text = 'NOIR CINEMATICS',
  shadowColor = '#06b6d4',
  shadowBlur = 25,
  textColor = '#ffffff',
  fontSize = 46,
  delay = 0,
  width = '100%',
  height = 160,
}: TextShadowProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pulse = 0.8 + Math.sin(t * 0.12) * 0.2;
  const currentBlur = shadowBlur * pulse;

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
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color: textColor,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          textShadow: `0 0 ${currentBlur}px ${shadowColor}, 0 10px 30px rgba(0,0,0,0.9)`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
