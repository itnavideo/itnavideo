import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextOnPathProps {
  text?: string;
  radius?: number;
  textColor?: string;
  speed?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * TextOnPath — Circular orbital SVG text on a curved path.
 * Continuously revolves typographic phrases around an orbital trajectory.
 */
export function TextOnPath({
  text = '★ ITNAVIDEO AI ★ PROGRAMMATIC REMOTION STUDIO ★ REVOLUTIONARY CREATIVE ENGINE',
  radius = 110,
  textColor = '#ffffff',
  speed = 1,
  delay = 0,
  width = 300,
  height = 300,
}: TextOnPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const rot = (t * 0.8 * speed) % 360;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 300"
        style={{
          transform: `rotate(${rot}deg)`,
          overflow: 'visible',
        }}
      >
        <defs>
          <path
            id="text-path-circle"
            d={`M 150 150 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>

        <text fill={textColor} fontSize="11" fontWeight="800" letterSpacing="0.18em">
          <textPath href="#text-path-circle" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
