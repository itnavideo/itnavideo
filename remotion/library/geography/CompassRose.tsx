import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CompassRoseProps {
  heading?: number; // degrees 0 - 360
  animatedSpin?: boolean;
  coordinates?: string;
  size?: number;
  color?: string;
  needleColor?: string;
  delay?: number;
}

/**
 * CompassRose — Navigational cartography compass.
 * Features rotating magnetic needle, cardinal direction points (N, S, E, W),
 * 360-degree radial tick ring, and latitude/longitude readouts.
 */
export function CompassRose({
  heading = 45,
  animatedSpin = true,
  coordinates = '37° 46\' 29" N, 122° 25\' 9" W',
  size = 180,
  color = '#38bdf8',
  needleColor = '#ef4444',
  delay = 0,
}: CompassRoseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Subtle magnetic needle oscillation
  const needleAngle = animatedSpin ? heading + Math.sin(adjustedFrame * 0.08) * 8 : heading;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#09090b',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {/* Degree Ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isMajor = i % 9 === 0;
            const r1 = size / 2 - 8;
            const r2 = size / 2 - (isMajor ? 18 : 12);
            const rad = (angle * Math.PI) / 180;

            return (
              <line
                key={i}
                x1={Math.sin(rad) * r1}
                y1={-Math.cos(rad) * r1}
                x2={Math.sin(rad) * r2}
                y2={-Math.cos(rad) * r2}
                stroke={isMajor ? '#fff' : 'rgba(255, 255, 255, 0.3)'}
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}

          {/* Cardinal Direction Letters */}
          <text y={-size / 2 + 32} fill={needleColor} fontSize="14" fontWeight="900" textAnchor="middle">N</text>
          <text y={size / 2 - 22} fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">S</text>
          <text x={size / 2 - 25} y="5" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">E</text>
          <text x={-size / 2 + 25} y="5" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">W</text>

          {/* Rotating Magnetic Compass Needle */}
          <g transform={`rotate(${needleAngle})`}>
            {/* North Red Pointer */}
            <polygon points="0,-45 7,0 0,-8 -7,0" fill={needleColor} filter="drop-shadow(0 0 6px #ef4444)" />
            {/* South Silver Pointer */}
            <polygon points="0,45 7,0 0,8 -7,0" fill="#94a3b8" />
            {/* Center Pivot Pivot */}
            <circle r="5" fill="#fff" stroke="#09090b" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* GPS Coordinate Tag */}
      {coordinates && (
        <span
          style={{
            color: '#a1a1aa',
            fontSize: 11,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(9, 9, 11, 0.8)',
            padding: '4px 10px',
            borderRadius: 6,
            border: 'none',
          }}
        >
          {coordinates}
        </span>
      )}
    </div>
  );
}
