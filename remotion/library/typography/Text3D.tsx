import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface Text3DProps {
  text?: string;
  depth?: number;
  textColor?: string;
  shadowColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * Text3D — Layered isometric extruded 3D typography.
 * Simulates heavy 3D physical slab typography using hardware-accelerated CSS multi-layered shadows.
 */
export function Text3D({
  text = 'HYPER REALITY',
  depth = 8,
  textColor = '#ffffff',
  shadowColor = '#0284c7',
  fontSize = 48,
  delay = 0,
  width = '100%',
  height = 160,
}: Text3DProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Generate multi-step 3D extrusion shadow
  const shadows = [...Array(depth)]
    .map((_, i) => `${i + 1}px ${i + 1}px 0 ${shadowColor}`)
    .join(', ');

  const fullShadow = `${shadows}, 0 20px 30px rgba(0,0,0,0.85)`;

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
        transform: `scale(${interpolate(intro, [0, 1], [0.85, 1])})`,
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
          textShadow: fullShadow,
        }}
      >
        {text}
      </div>
    </div>
  );
}
