import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RadialSatelliteNode {
  id: string;
  title: string;
  subtitle?: string;
  department?: string;
  metric?: string;
  color?: string;
}

export interface CircularOrgChartInfographicProps {
  title?: string;
  subtitle?: string;
  centerNode: {
    title: string;
    subtitle?: string;
    badge?: string;
    color?: string;
  };
  satellites: RadialSatelliteNode[];
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * CircularOrgChartInfographic
 * Multi-level radial organizational chart / concentric orbital ecosystem.
 * Shows core hub with satellite departments/teams connected via animated spokes.
 */
export const CircularOrgChartInfographic: React.FC<CircularOrgChartInfographicProps> = ({
  title,
  subtitle,
  centerNode,
  satellites,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const centerSpring = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 12, stiffness: 120 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 41, 59, 0.09)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  // Radius for satellites around center (in viewBox coordinate units)
  const centerCoord = { x: 900, y: 390 };
  const orbitalRadius = 290;
  const count = Math.min(6, Math.max(3, satellites.length));
  const activeSatellites = satellites.slice(0, count);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      {(title || subtitle) && (
        <div
          style={{
            transform: `translateY(${(1 - headerSpring) * -20}px)`,
            opacity: headerSpring,
            marginBottom: '10px',
            zIndex: 10,
          }}
        >
          {title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '6px',
                  height: '30px',
                  backgroundColor: accentColor,
                  borderRadius: '3px',
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: '34px',
                  fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  color: textPrimary,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h2>
            </div>
          )}
          {subtitle && (
            <p
              style={{
                margin: '6px 0 0 20px',
                fontSize: '17px',
                fontWeight: 500,
                color: textSecondary,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── RADIAL CHART SVG & NODES ── */}
      <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: '520px' }}>
        <svg
          viewBox="0 0 1800 760"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
        >
          {/* Orbital Concentric Ring 1 (Inner) */}
          <circle
            cx={centerCoord.x}
            cy={centerCoord.y}
            r={160}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.06)'}
            strokeWidth="1.2"
            strokeDasharray="6 8"
            transform={`rotate(${frame * 0.4}, ${centerCoord.x}, ${centerCoord.y})`}
          />

          {/* Orbital Concentric Ring 2 (Outer Orbit Track) */}
          <circle
            cx={centerCoord.x}
            cy={centerCoord.y}
            r={orbitalRadius}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.09)' : 'rgba(30,41,59,0.09)'}
            strokeWidth="1.4"
            strokeDasharray="10 12"
            transform={`rotate(${-frame * 0.3}, ${centerCoord.x}, ${centerCoord.y})`}
          />

          {/* Spokes to Satellite Nodes */}
          {activeSatellites.map((sat, i) => {
            const angleDeg = (i * (360 / count)) - 90; // Start at 12 o'clock
            const angleRad = (angleDeg * Math.PI) / 180;
            const spokeX = centerCoord.x + Math.cos(angleRad) * orbitalRadius;
            const spokeY = centerCoord.y + Math.sin(angleRad) * orbitalRadius;

            const spokeProgress = interpolate(
              frame,
              [12 + i * 4, 30 + i * 4],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const spokeXAnim = centerCoord.x + (spokeX - centerCoord.x) * spokeProgress;
            const spokeYAnim = centerCoord.y + (spokeY - centerCoord.y) * spokeProgress;
            const nodeColor = sat.color || (i % 2 === 0 ? accentColor : '#3B82F6');

            return (
              <g key={`spoke-${i}`}>
                {/* Spoke Line */}
                <line
                  x1={centerCoord.x}
                  y1={centerCoord.y}
                  x2={spokeXAnim}
                  y2={spokeYAnim}
                  stroke={nodeColor}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  opacity={0.65 * spokeProgress}
                />
                {/* Node Anchor Dot */}
                <circle
                  cx={spokeX}
                  cy={spokeY}
                  r={6 * spokeProgress}
                  fill={nodeColor}
                />
              </g>
            );
          })}
        </svg>

        {/* ── CENTER HUB NODE (Core Leadership / Main Goal) ── */}
        <div
          style={{
            position: 'absolute',
            left: `${(centerCoord.x / 1800) * 100}%`,
            top: `${(centerCoord.y / 760) * 100}%`,
            transform: `translate(-50%, -50%) scale(${centerSpring})`,
            opacity: centerSpring,
            width: '240px',
            padding: '24px 20px',
            borderRadius: '24px',
            backgroundColor: cardBg,
            border: `2px solid ${centerNode.color || accentColor}`,
            boxShadow: `0 20px 48px -10px ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(234, 88, 12, 0.16)'}`,
            textAlign: 'center',
            zIndex: 30,
          }}
        >
          {centerNode.badge && (
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 650,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                backgroundColor: centerNode.color || accentColor,
                marginBottom: '8px',
              }}
            >
              {centerNode.badge}
            </span>
          )}

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: textPrimary,
              lineHeight: 1.2,
            }}
          >
              {centerNode.title}
          </div>

          {centerNode.subtitle && (
            <div
              style={{
                marginTop: '6px',
                fontSize: '12px',
                fontWeight: 500,
                color: textSecondary,
              }}
            >
              {centerNode.subtitle}
            </div>
          )}
        </div>

        {/* ── SATELLITE NODES ── */}
        {activeSatellites.map((sat, i) => {
          const angleDeg = (i * (360 / count)) - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const spokeX = centerCoord.x + Math.cos(angleRad) * orbitalRadius;
          const spokeY = centerCoord.y + Math.sin(angleRad) * orbitalRadius;

          const satSpring = spring({
            frame: Math.max(0, frame - (18 + i * 5)),
            fps,
            config: { damping: 14, stiffness: 110 },
          });

          const nodeColor = sat.color || (i % 2 === 0 ? accentColor : '#3B82F6');
          const leftPercent = (spokeX / 1800) * 100;
          const topPercent = (spokeY / 760) * 100;

          return (
            <div
              key={`sat-card-${i}`}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: `translate(-50%, -50%) scale(${satSpring})`,
                opacity: satSpring,
                width: '210px',
                padding: '14px 16px',
                borderRadius: '16px',
                backgroundColor: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 14px 30px rgba(0,0,0,0.45)'
                  : '0 14px 30px rgba(180, 160, 140, 0.16)',
                zIndex: 25,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 650,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: nodeColor,
                  }}
                >
                  {sat.department || `Node 0${i + 1}`}
                </span>
                {sat.metric && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: nodeColor,
                    }}
                  >
                    {sat.metric}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 650,
                  color: textPrimary,
                  lineHeight: 1.25,
                }}
              >
                {sat.title}
              </div>

              {sat.subtitle && (
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    color: textSecondary,
                    lineHeight: 1.35,
                  }}
                >
                  {sat.subtitle}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

