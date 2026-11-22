import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GlobeMarker {
  lat: number;
  lng: number;
  name?: string;
  color?: string;
}

export interface ThreeDGlobeProps {
  radius?: number;
  color?: string;
  atmosphereColor?: string;
  gridLines?: boolean;
  spinSpeed?: number;
  markers?: GlobeMarker[];
  showAtmosphere?: boolean;
  delay?: number;
}

const DEFAULT_MARKERS: GlobeMarker[] = [
  { lat: 37.77, lng: -122.41, name: 'San Francisco', color: '#10b981' },
  { lat: 51.5, lng: -0.12, name: 'London', color: '#38bdf8' },
  { lat: 35.67, lng: 139.65, name: 'Tokyo', color: '#f59e0b' },
];

/**
 * ThreeDGlobe — 3D rotating planetary wireframe globe.
 * Features illuminated latitude/longitude coordinate rings,
 * atmospheric outer glow halo, and spinning orbital location markers.
 */
export function ThreeDGlobe({
  radius = 140,
  color = '#10b981',
  atmosphereColor = 'rgba(16, 185, 129, 0.25)',
  gridLines = true,
  spinSpeed = 1,
  markers = DEFAULT_MARKERS,
  showAtmosphere = true,
  delay = 0,
}: ThreeDGlobeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  const spinAngle = (adjustedFrame * 0.7 * spinSpeed) % 360;

  return (
    <div
      style={{
        position: 'relative',
        width: radius * 2 + 60,
        height: radius * 2 + 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Outer Atmosphere Glow Rim */}
      {showAtmosphere && (
        <div
          style={{
            position: 'absolute',
            width: radius * 2 + 30,
            height: radius * 2 + 30,
            borderRadius: '50%',
            background: `radial-gradient(circle, transparent 65%, ${atmosphereColor} 90%, transparent 100%)`,
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Main Vector Globe */}
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="globe-depth" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#090d16" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Shaded Sphere Surface */}
        <circle cx="0" cy="0" r={radius} fill="url(#globe-depth)" />

        {/* Outer Rim Ring */}
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          filter="drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.4))"
        />

        {/* Latitude Rings */}
        {gridLines && (
          <>
            {[-60, -30, 0, 30, 60].map((lat, idx) => {
              const rad = (lat * Math.PI) / 180;
              const y = radius * Math.sin(rad);
              const rAtY = radius * Math.cos(rad);
              return (
                <ellipse
                  key={idx}
                  cx="0"
                  cy={y}
                  rx={rAtY}
                  ry={rAtY * 0.3}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity={lat === 0 ? '0.6' : '0.25'}
                />
              );
            })}

            {/* Longitude Rotating Meridians */}
            {Array.from({ length: 6 }).map((_, mIdx) => {
              const baseAngle = mIdx * 30;
              const curAngle = (baseAngle + spinAngle) % 180;
              const xRadius = Math.abs(Math.sin((curAngle * Math.PI) / 180)) * radius;

              return (
                <ellipse
                  key={mIdx}
                  cx="0"
                  cy="0"
                  rx={xRadius}
                  ry={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              );
            })}
          </>
        )}

        {/* Animated Location Markers */}
        {markers.map((m, i) => {
          // Approximate spherical projection with spin
          const adjustedLng = (m.lng + spinAngle) % 360;
          const radLng = (adjustedLng * Math.PI) / 180;
          const radLat = (m.lat * Math.PI) / 180;

          // Only render if on front hemisphere
          const isFront = Math.cos(radLng) > 0;
          if (!isFront) return null;

          const x = radius * Math.cos(radLat) * Math.sin(radLng);
          const y = -radius * Math.sin(radLat);

          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle
                r="4.5"
                fill={m.color || color}
                filter="drop-shadow(0px 0px 6px #10b981)"
              />
              <circle
                r="8"
                fill="none"
                stroke={m.color || color}
                strokeWidth="1.5"
                opacity={(Math.sin(frame * 0.2 + i) + 1) / 2}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
