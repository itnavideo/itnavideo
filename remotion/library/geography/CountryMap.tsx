import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CountryMapProps {
  countryName?: string;
  capital?: string;
  population?: string;
  gdp?: string;
  flagEmoji?: string;
  outlineColor?: string;
  fillColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CountryMap — Regional and country-specific cartographic spotlight.
 * Features stylized vector country boundary outline, capital city pin,
 * and demographic/economic overview card.
 */
export function CountryMap({
  countryName = 'United States',
  capital = 'Washington, D.C.',
  population = '334 Million',
  gdp = '$27.36 Trillion',
  flagEmoji = '🇺🇸',
  outlineColor = '#10b981',
  fillColor = 'rgba(16, 185, 129, 0.12)',
  delay = 0,
  width = '100%',
  height = 360,
}: CountryMapProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.9, 1]);
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
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{flagEmoji}</span>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{countryName}</h3>
            <span style={{ color: '#71717a', fontSize: 12 }}>Capital: {capital}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>GDP (NOMINAL)</span>
          <div style={{ color: '#10b981', fontSize: 16, fontWeight: 900, fontFamily: 'monospace' }}>{gdp}</div>
        </div>
      </div>

      {/* Stylized Vector Country Outline Canvas */}
      <div style={{ position: 'relative', flex: 1, margin: '14px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          {/* Country Boundary Polygon */}
          <path
            d="M 60 50 L 150 45 L 220 55 L 320 40 L 360 80 L 370 140 L 320 180 L 240 210 L 180 180 L 120 190 L 70 150 L 50 110 Z"
            fill={fillColor}
            stroke={outlineColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 15px ${outlineColor}50)`}
          />

          {/* Capital Pin Point */}
          <g transform="translate(330, 85)">
            <circle r="12" fill={outlineColor} opacity="0.3" />
            <circle r="5" fill="#fff" stroke={outlineColor} strokeWidth="2" />
            <text x="10" y="4" fill="#fff" fontSize="11" fontWeight="700">
              {capital}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12,
        }}
      >
        <div>
          <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>POPULATION</span>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{population}</div>
        </div>
        <div>
          <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>SOVEREIGNTY</span>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>Federal Republic</div>
        </div>
        <div>
          <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>ISO CODE</span>
          <div style={{ color: '#10b981', fontSize: 13, fontWeight: 800 }}>USA / 840</div>
        </div>
      </div>
    </div>
  );
}
