import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGPolygonProps {
  points?: string;
  sides?: number; // 3 = triangle, 4 = diamond, 5 = pentagon, 6 = hexagon, 8 = octagon
  cx?: number;
  cy?: number;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  rotate?: boolean;
  rotateSpeed?: number;
  glow?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * SVGPolygon — Geometric multi-point vector polygon.
 * Supports auto regular polygon generation (triangles, hexagons, octagons)
 * or explicit custom point coordinates, with spring pop-in and rotation.
 */
export function SVGPolygon({
  points,
  sides = 6,
  cx = 100,
  cy = 100,
  radius = 60,
  stroke = '#6366f1',
  strokeWidth = 2.5,
  fill = 'rgba(99, 102, 241, 0.12)',
  fillOpacity = 1,
  rotate = false,
  rotateSpeed = 1,
  glow = true,
  delay = 0,
  style,
}: SVGPolygonProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Compute regular polygon points if not provided explicitly
  const polygonPoints = React.useMemo(() => {
    if (points) return points;
    const pts: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [points, sides, cx, cy, radius]);

  const rotationAngle = rotate ? frame * 0.8 * rotateSpeed : 0;

  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        transform: `rotate(${rotationAngle}deg) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <polygon
        points={polygonPoints}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill={fill}
        fillOpacity={fillOpacity}
        filter={glow ? 'drop-shadow(0px 0px 8px rgba(99, 102, 241, 0.5))' : undefined}
      />
    </g>
  );
}
