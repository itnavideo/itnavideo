import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MapPinProps {
  locationName?: string;
  coordinates?: string;
  pinColor?: string;
  pinX?: number; // percentage 0 - 100
  pinY?: number; // percentage 0 - 100
  showGrid?: boolean;
  routeTo?: { x: number; y: number; name?: string };
  width?: string | number;
  height?: number;
  borderRadius?: number;
}

/**
 * MapPin (Map) — Stylized vector map and geographic locator.
 * Features animated latitude/longitude coordinates grid, bouncing pulse ripple
 * pin on target city, and bezier flight route connection.
 */
export function MapPin({
  locationName = 'SAN FRANCISCO, CA',
  coordinates = '37.7749° N, 122.4194° W',
  pinColor = '#10b981',
  pinX = 35,
  pinY = 48,
  showGrid = true,
  routeTo,
  width = '100%',
  height = 340,
  borderRadius = 16,
}: MapPinProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pin drop bounce spring
  const pinSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.7 },
  });

  const pinTranslateY = interpolate(pinSpring, [0, 1], [-40, 0]);
  const pinOpacity = interpolate(pinSpring, [0, 1], [0, 1]);

  // Pulse ring ripple
  const pulseLoop = (frame % 30) / 30;
  const ringScale = 1 + pulseLoop * 2.5;
  const ringOpacity = (1 - pulseLoop) * 0.7;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: '#09090b',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Abstract Map Grid Lines & Coordinate Marks */}
      {showGrid && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.35,
          }}
        >
          <defs>
            <pattern
              id="map-grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid-pattern)" />

          {/* Continents abstract silhouettes */}
          <circle cx="28%" cy="40%" r="90" fill="rgba(255, 255, 255, 0.04)" />
          <circle cx="45%" cy="65%" r="120" fill="rgba(255, 255, 255, 0.03)" />
          <circle cx="75%" cy="35%" r="110" fill="rgba(255, 255, 255, 0.04)" />

          {/* Animated Route Line if routeTo exists */}
          {routeTo && (
            <path
              d={`M ${pinX}% ${pinY}% Q ${(pinX + routeTo.x) / 2}% ${Math.min(pinY, routeTo.y) - 15}% ${routeTo.x}% ${routeTo.y}%`}
              fill="none"
              stroke={pinColor}
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.8"
            />
          )}
        </svg>
      )}

      {/* Target Marker Pin */}
      <div
        style={{
          position: 'absolute',
          left: `${pinX}%`,
          top: `${pinY}%`,
          transform: `translate(-50%, -100%) translateY(${pinTranslateY}px)`,
          opacity: pinOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Pulse Ripple Circle */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: pinColor,
            transform: `translate(0, 50%) scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />

        {/* Pin Icon */}
        <svg width="34" height="42" viewBox="0 0 24 24" fill={pinColor}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>

        {/* Ground shadow dot */}
        <div
          style={{
            width: 8,
            height: 4,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            marginTop: -2,
          }}
        />
      </div>

      {/* Location Badge Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          padding: '10px 16px',
          borderRadius: 10,
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: pinColor,
            }}
          />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
            {locationName}
          </span>
        </div>
        {coordinates && (
          <span style={{ color: '#71717a', fontSize: 11, fontFamily: 'monospace' }}>
            {coordinates}
          </span>
        )}
      </div>
    </div>
  );
}

export { MapPin as Map };
