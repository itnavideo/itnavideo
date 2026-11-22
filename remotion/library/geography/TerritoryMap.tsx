import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TerritoryZone {
  name: string;
  share: string;
  color: string;
  points: string;
  hqLocation: { x: number; y: number };
}

export interface TerritoryMapProps {
  title?: string;
  subtitle?: string;
  territories?: TerritoryZone[];
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_TERRITORIES: TerritoryZone[] = [
  {
    name: 'North America (Americas)',
    share: '48% Market Share',
    color: '#10b981',
    points: '40,40 160,30 180,110 130,170 50,140',
    hqLocation: { x: 100, y: 80 },
  },
  {
    name: 'EMEA (Europe, Middle East, Africa)',
    share: '32% Market Share',
    color: '#38bdf8',
    points: '200,35 280,40 310,130 240,165 190,120',
    hqLocation: { x: 250, y: 85 },
  },
  {
    name: 'APAC (Asia Pacific)',
    share: '20% Market Share',
    color: '#6366f1',
    points: '320,50 390,60 380,150 310,140',
    hqLocation: { x: 350, y: 95 },
  },
];

/**
 * TerritoryMap — Regional market and sales territory coverage map.
 * Visualizes partitioned geographical zones, market share percentages,
 * and highlighted regional headquarters.
 */
export function TerritoryMap({
  title = 'Global Territory Allocation',
  subtitle = 'Enterprise Sales & Operations Coverage',
  territories = DEFAULT_TERRITORIES,
  delay = 0,
  width = '100%',
  height = 360,
}: TerritoryMapProps) {
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
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: '#71717a', fontSize: 12 }}>{subtitle}</span>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          3 CORE REGIONS
        </span>
      </div>

      {/* SVG Territory Polygons Canvas */}
      <div style={{ position: 'relative', flex: 1, margin: '12px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 420 200"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {territories.map((t, idx) => (
            <g key={idx}>
              {/* Regional Zone Boundary Polygon */}
              <polygon
                points={t.points}
                fill={t.color}
                fillOpacity="0.2"
                stroke={t.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter={`drop-shadow(0 0 10px ${t.color}50)`}
              />

              {/* Regional HQ Beacon */}
              <g transform={`translate(${t.hqLocation.x}, ${t.hqLocation.y})`}>
                <circle r="6" fill={t.color} />
                <circle r="12" fill="none" stroke={t.color} strokeWidth="1.5" opacity="0.5" />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* Territory Legend Footer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
        }}
      >
        {territories.map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: t.color,
                }}
              />
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.name}
              </span>
            </div>
            <span style={{ color: t.color, fontSize: 11, fontWeight: 800, paddingLeft: 14 }}>
              {t.share}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
