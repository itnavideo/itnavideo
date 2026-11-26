import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WorldMapCity {
  name: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  color?: string;
  metric?: string;
}

export interface WorldMapProps {
  title?: string;
  subtitle?: string;
  activeCities?: WorldMapCity[];
  color?: string;
  accentColor?: string;
  showGrid?: boolean;
  pulsePings?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CITIES: WorldMapCity[] = [
  { name: 'San Francisco', x: 18, y: 35, color: '#10b981', metric: '99.9% Uptime' },
  { name: 'New York', x: 28, y: 34, color: '#38bdf8', metric: '12ms Ping' },
  { name: 'London', x: 48, y: 26, color: '#6366f1', metric: '10 Gbps' },
  { name: 'Tokyo', x: 84, y: 36, color: '#f59e0b', metric: 'Edge Cluster' },
  { name: 'Sydney', x: 88, y: 78, color: '#ec4899', metric: 'PoP Active' },
  { name: 'Singapore', x: 76, y: 55, color: '#10b981', metric: 'Tier 4 DC' },
];

/**
 * WorldMap — Global cartographic projection map.
 * Features stylized continental silhouettes, animated ping beacons on major hubs,
 * coordinate grid lines, and global edge network statistics.
 */
export function WorldMap({
  title = 'Global Distributed Edge Network',
  subtitle = '52 Edge Regions Across 6 Continents',
  activeCities = DEFAULT_CITIES,
  color = '#38bdf8',
  accentColor = '#10b981',
  showGrid = true,
  pulsePings = true,
  delay = 0,
  width = '100%',
  height = 380,
}: WorldMapProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Header Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: '#71717a', fontSize: 12, fontWeight: 500 }}>{subtitle}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 9999,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span style={{ color: '#10b981', fontSize: 11, fontWeight: 800 }}>LIVE MESH</span>
        </div>
      </div>

      {/* SVG Canvas with Continental Polygons & Cities */}
      <div style={{ position: 'relative', flex: 1, margin: '10px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          {/* Latitude & Longitude Grid Lines */}
          {showGrid && (
            <g opacity="0.15">
              {[100, 200, 300, 400].map((y) => (
                <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#fff" strokeWidth="1" strokeDasharray="6 6" />
              ))}
              {[200, 400, 600, 800].map((x) => (
                <line key={`lng-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#fff" strokeWidth="1" strokeDasharray="6 6" />
              ))}
            </g>
          )}

          {/* Stylized Continental Silhouettes */}
          <g fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5">
            {/* North America */}
            <path d="M 120 70 L 280 80 L 260 170 L 220 220 L 190 280 L 160 210 L 110 160 Z" />
            {/* South America */}
            <path d="M 230 290 L 320 310 L 300 420 L 250 480 L 220 390 Z" />
            {/* Europe */}
            <path d="M 440 80 L 550 70 L 530 150 L 460 160 L 430 110 Z" />
            {/* Africa */}
            <path d="M 450 170 L 560 180 L 550 330 L 490 390 L 440 280 Z" />
            {/* Asia */}
            <path d="M 560 60 L 880 70 L 860 230 L 750 250 L 670 200 L 580 160 Z" />
            {/* Australia */}
            <path d="M 780 340 L 910 330 L 890 420 L 800 430 Z" />
          </g>

          {/* Flight / Data Transmission Cables */}
          <path
            d="M 180 175 Q 330 80 480 130 T 840 180"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Active Cities with Ping Beacons */}
          {activeCities.map((city, idx) => {
            const cx = (city.x / 100) * 1000;
            const cy = (city.y / 100) * 500;
            const pinColor = city.color || accentColor;

            // Pulse wave
            const pulse = ((adjustedFrame * 2 + idx * 20) % 60) / 60;
            const pulseRadius = 6 + pulse * 20;
            const pulseOpacity = (1 - pulse) * 0.7;

            return (
              <g key={idx}>
                {pulsePings && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={pulseRadius}
                    fill="none"
                    stroke={pinColor}
                    strokeWidth="1.5"
                    opacity={pulseOpacity}
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={pinColor}
                  filter={`drop-shadow(0 0 6px ${pinColor})`}
                />

                {/* City Tag Label */}
                <g transform={`translate(${cx + 8}, ${cy - 8})`}>
                  <rect
                    x="0"
                    y="-12"
                    width={city.name.length * 7 + 10}
                    height="18"
                    rx="4"
                    fill="rgba(9, 9, 11, 0.85)"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                  <text
                    x="5"
                    y="1"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    {city.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Metrics Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
        }}
      >
        <span>Global Traffic: <strong style={{ color: '#fff' }}>14.8 Tbps</strong></span>
        <span>Average Latency: <strong style={{ color: '#10b981' }}>18ms</strong></span>
        <span>Availability: <strong style={{ color: '#38bdf8' }}>99.999% SLA</strong></span>
      </div>
    </div>
  );
}
