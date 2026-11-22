import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MountainCamp {
  elevation: string;
  label: string;
  x: number;
  y: number;
}

export interface MountainClimbProps {
  headline?: string;
  camps?: MountainCamp[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CAMPS: MountainCamp[] = [
  { elevation: '1,000m', label: 'Basecamp: Launch', x: 40, y: 160 },
  { elevation: '3,500m', label: 'Camp 1: Product-Market Fit', x: 120, y: 120 },
  { elevation: '6,000m', label: 'Camp 2: Virality Scale', x: 220, y: 70 },
  { elevation: '8,848m', label: 'Summit: Category Dominance', x: 320, y: 20 },
];

/**
 * MountainClimb — Summit expedition storytelling infographic.
 * Winding climbing path up steep mountainous terrain from basecamp to the summit flag.
 */
export function MountainClimb({
  headline = 'THE CLIMB TO CATEGORY LEADERSHIP',
  camps = DEFAULT_CAMPS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 520,
  height = 360,
}: MountainClimbProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pathProgress = interpolate(
    spring({
      frame: Math.max(0, t - 10),
      fps,
      config: { damping: 16, stiffness: 60 },
    }),
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          EXPEDITION ROADMAP
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Mountain Contour SVG Stage */}
      <div style={{ position: 'relative', width: '100%', height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
          {/* Mountain Silhouette Background */}
          <polygon
            points="0,200 120,80 180,120 320,15 400,200"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />

          {/* Winding Trail Path */}
          <path
            d="M 40 160 Q 90 140, 120 120 T 220 70 T 320 20"
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeDasharray="400"
            strokeDashoffset={interpolate(pathProgress, [0, 1], [400, 0])}
            strokeLinecap="round"
          />

          {/* Checkpoint Nodes */}
          {camps.map((camp, i) => (
            <g key={camp.label}>
              <circle cx={camp.x} cy={camp.y} r={5} fill={accentColor} />
              <text
                x={camp.x + 10}
                y={camp.y + 4}
                fill="#ffffff"
                fontSize="9"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
              >
                {camp.label} ({camp.elevation})
              </text>
            </g>
          ))}

          {/* Summit Flag */}
          {pathProgress > 0.9 && (
            <g transform="translate(320, 10)">
              <line x1="0" y1="0" x2="0" y2="15" stroke="#ffffff" strokeWidth="2" />
              <polygon points="0,0 12,4 0,8" fill="#ef4444" />
            </g>
          )}
        </svg>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span>ENDURANCE & SYSTEMATIC ASCENT</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>SUMMIT ACHIEVED</span>
      </div>
    </div>
  );
}
