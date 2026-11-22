import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface LiquidMorphProps {
  color?: string;
  secondaryColor?: string;
  size?: number;
  complexity?: number; // 3 to 8 control lobes
  morphSpeed?: number;
  elasticity?: number;
  glow?: boolean;
  className?: string;
}

export const LiquidMorph: React.FC<LiquidMorphProps> = ({
  color = '#6366f1',
  secondaryColor = '#ec4899',
  size = 320,
  complexity = 5,
  morphSpeed = 1,
  elasticity = 1.2,
  glow = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
  });

  // Generate dynamic organic spline points around a circle
  const pointsCount = Math.max(3, Math.min(8, complexity));
  const angleStep = (Math.PI * 2) / pointsCount;
  const radius = (size / 2) * 0.7;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const angle = i * angleStep;
    // Harmonic oscillation per point based on deterministic frame math
    const wave1 = Math.sin((frame * 0.05 * morphSpeed) + (i * 1.5)) * 0.25;
    const wave2 = Math.cos((frame * 0.03 * morphSpeed) + (i * 2.2)) * 0.15;
    const r = radius * (1 + (wave1 + wave2) * elasticity);
    const cx = size / 2 + Math.cos(angle) * r;
    const cy = size / 2 + Math.sin(angle) * r;
    points.push({ x: cx, y: cy });
  }

  // Smooth Catmull-Rom or cubic Bezier path closure
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < pointsCount; i++) {
    const p0 = points[(i - 1 + pointsCount) % pointsCount];
    const p1 = points[i];
    const p2 = points[(i + 1) % pointsCount];
    const p3 = points[(i + 2) % pointsCount];

    // Control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  pathData += ' Z';

  const rot = interpolate(frame, [0, fps * 10], [0, 360]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scale(${entry}) rotate(${rot}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`liquid-grad-${complexity}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          {glow && (
            <filter id={`liquid-glow-${complexity}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        <path
          d={pathData}
          fill={`url(#liquid-grad-${complexity})`}
          filter={glow ? `url(#liquid-glow-${complexity})` : undefined}
          style={{
            filter: glow ? `drop-shadow(0 0 24px ${color}80)` : undefined,
          }}
        />
      </svg>
    </div>
  );
};
