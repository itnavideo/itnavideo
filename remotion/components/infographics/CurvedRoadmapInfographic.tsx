import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RoadmapMilestone {
  step: number | string;
  quarterOrDate?: string;
  title: string;
  description?: string;
  status?: 'completed' | 'active' | 'upcoming';
  metric?: string;
  color?: string;
}

export interface CurvedRoadmapInfographicProps {
  title?: string;
  subtitle?: string;
  milestones: RoadmapMilestone[];
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * CurvedRoadmapInfographic
 * Executive presentation-grade winding S-curve roadmap with milestone poles,
 * animated path drawing, pin flags, and metric badges.
 */
export const CurvedRoadmapInfographic: React.FC<CurvedRoadmapInfographicProps> = ({
  title,
  subtitle,
  milestones,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  // Stagger entrance spring
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const pathProgress = interpolate(frame, [8, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const strokeDashoffset = interpolate(pathProgress, [0, 1], [1600, 0]);

  // Color palette
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.92)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 41, 59, 0.09)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';
  const roadColor = isDark ? '#334155' : '#CBD5E1';

  // 4 Milestone Coordinates along the 1920x1080 canvas
  const milestoneCoords = [
    { x: 300, y: 380, labelY: -130, align: 'left' },
    { x: 720, y: 640, labelY: 100, align: 'right' },
    { x: 1180, y: 390, labelY: -130, align: 'left' },
    { x: 1600, y: 620, labelY: 90, align: 'right' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER TITLE ── */}
      {(title || subtitle) && (
        <div
          style={{
            transform: `translateY(${(1 - headerSpring) * -25}px)`,
            opacity: headerSpring,
            marginBottom: '20px',
            zIndex: 10,
          }}
        >
          {title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '6px',
                  height: '32px',
                  backgroundColor: accentColor,
                  borderRadius: '3px',
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: '36px',
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
                margin: '8px 0 0 20px',
                fontSize: '18px',
                fontWeight: 500,
                color: textSecondary,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── ROADMAP SVG CANVAS ── */}
      <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: '520px' }}>
        <svg
          viewBox="0 0 1800 680"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
        >
          <defs>
            <linearGradient id="roadmapPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underlay Highway Base Path */}
          <path
            d="M 120 400 C 450 150, 550 780, 950 520 C 1300 280, 1420 750, 1750 480"
            fill="none"
            stroke={roadColor}
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.32"
          />

          {/* Road Asphalt Center Striping (Moving dashes) */}
          <path
            d="M 120 400 C 450 150, 550 780, 950 520 C 1300 280, 1420 750, 1750 480"
            fill="none"
            stroke={isDark ? '#0F172A' : '#FAF6F2'}
            strokeWidth="1.8"
            strokeDasharray="14 16"
            strokeDashoffset={-frame * 1.5}
            opacity="0.8"
          />

          {/* Glowing Animated Progress Stroke */}
          <path
            d="M 120 400 C 450 150, 550 780, 950 520 C 1300 280, 1420 750, 1750 480"
            fill="none"
            stroke="url(#roadmapPathGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="1600"
            strokeDashoffset={strokeDashoffset}
            filter="url(#roadGlow)"
          />

          {/* Milestone Vertical Poles & Flags */}
          {milestones.slice(0, 4).map((milestone, idx) => {
            const coord = milestoneCoords[idx] || milestoneCoords[0];
            const poleDelay = 12 + idx * 10;
            const poleSpring = spring({
              frame: Math.max(0, frame - poleDelay),
              fps,
              config: { damping: 12, stiffness: 120 },
            });

            const isActive = idx === 1 || milestone.status === 'active';
            const nodeColor = milestone.color || (idx === 0 ? accentColor : idx === 1 ? '#3B82F6' : idx === 2 ? '#8B5CF6' : '#10B981');

            return (
              <g key={`milestone-pole-${idx}`} transform={`translate(${coord.x}, ${coord.y})`}>
                {/* Vertical Pole Line */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={coord.labelY > 0 ? 55 * poleSpring : -55 * poleSpring}
                  stroke={nodeColor}
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                  opacity={poleSpring}
                />

                {/* Road Anchor Bullseye Pin */}
                <circle
                  cx="0"
                  cy="0"
                  r={16 * poleSpring}
                  fill={cardBg}
                  stroke={nodeColor}
                  strokeWidth="2"
                  filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.18))"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={7 * poleSpring}
                  fill={nodeColor}
                />
              </g>
            );
          })}
        </svg>

        {/* Milestone Detail Cards (Positioned in HTML DOM above SVG for crisp typography) */}
        {milestones.slice(0, 4).map((milestone, idx) => {
          const coord = milestoneCoords[idx] || milestoneCoords[0];
          const cardDelay = 16 + idx * 10;
          const cardSpring = spring({
            frame: Math.max(0, frame - cardDelay),
            fps,
            config: { damping: 14, stiffness: 110 },
          });

          const nodeColor = milestone.color || (idx === 0 ? accentColor : idx === 1 ? '#3B82F6' : idx === 2 ? '#8B5CF6' : '#10B981');
          const isTop = coord.labelY < 0;

          // Convert viewBox coordinate roughly to percentages
          const leftPercent = (coord.x / 1800) * 100;
          const topPercent = (coord.y / 680) * 100;

          return (
            <div
              key={`milestone-card-${idx}`}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: `translate(-50%, ${isTop ? '-125%' : '25%'}) scale(${cardSpring})`,
                opacity: cardSpring,
                width: '280px',
                padding: '16px 20px',
                borderRadius: '18px',
                backgroundColor: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 16px 36px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
                  : '0 16px 36px rgba(180, 160, 140, 0.18), 0 2px 8px rgba(30, 41, 59, 0.04)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              {/* Header Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 650,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: nodeColor,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30, 41, 59, 0.05)',
                  }}
                >
                  Step {milestone.step || idx + 1}
                </span>

                {milestone.quarterOrDate && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: textSecondary,
                    }}
                  >
                    {milestone.quarterOrDate}
                  </span>
                )}
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 650,
                  color: textPrimary,
                  lineHeight: 1.25,
                  marginBottom: milestone.description ? '6px' : '0',
                }}
              >
                {milestone.title}
              </div>

              {/* Description */}
              {milestone.description && (
                <div
                  style={{
                    fontSize: '12px',
                    color: textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  {milestone.description}
                </div>
              )}

              {/* Metric Pill (if any) */}
              {milestone.metric && (
                <div
                  style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: `1px solid ${cardBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>
                    Impact Metric
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 900,
                      color: nodeColor,
                    }}
                  >
                    {milestone.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

