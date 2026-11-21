import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RunwayPhase {
  id: string;
  stageNumber: string;
  title: string;
  subtitle: string;
  revenueRange: string;
  badge: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  description: string;
  milestone: string;
}

export interface SideHustleRunwayAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * SideHustleRunwayAsset
 * 4-Phase Side-Hustle Runway & Departure Blueprint (The Jeff Su & Ali Abdaal Model)
 * Phase 1: The Safety Anchor (Full-time Day Job)
 * Phase 2: The 1% Repetition Machine (Suck Less With Each Rep)
 * Phase 3: Demand-Led Products (Let Products Come to You)
 * Phase 4: The Freedom Threshold (The Strategic Quit Date)
 * Learned from "If You Want to Make Money From YouTube, Do This" (YouTube: LLjpnubsOWc).
 */
export const SideHustleRunwayAsset: React.FC<SideHustleRunwayAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const phases: RunwayPhase[] = [
    {
      id: 'phase-1',
      stageNumber: '01',
      title: 'The Safety Anchor',
      subtitle: 'Full-Time Day Job',
      revenueRange: '$0 – $100 / mo',
      badge: 'RISK BUFFER',
      accentColor: '#475569',
      bgLight: '#F8FAFC',
      bgDark: 'rgba(71, 85, 105, 0.15)',
      description: 'Day job pays rent and bills; eliminates creative anxiety and desperation.',
      milestone: 'Zero pressure on creative output',
    },
    {
      id: 'phase-2',
      stageNumber: '02',
      title: 'The 1% Rep Engine',
      subtitle: 'Suck Less Each Upload',
      revenueRange: '$100 – $1,000 / mo',
      badge: 'SYSTEMS & SOPS',
      accentColor: '#0284C7',
      bgLight: '#F0F9FF',
      bgDark: 'rgba(2, 132, 199, 0.15)',
      description: 'Notion command center, checklist-driven workflows, 1% improvement per rep.',
      milestone: 'Consistent weekly publishing cadence',
    },
    {
      id: 'phase-3',
      stageNumber: '03',
      title: 'Demand-Led Products',
      subtitle: 'Organic Pull vs Push',
      revenueRange: '$1,000 – $10,000 / mo',
      badge: 'INBOUND PULL',
      accentColor: '#059669',
      bgLight: '#F0FDF4',
      bgDark: 'rgba(5, 150, 105, 0.15)',
      description: 'Launch templates & guides only after audience explicitly asks for them.',
      milestone: 'Digital products match 50% salary',
    },
    {
      id: 'phase-4',
      stageNumber: '04',
      title: 'Freedom Threshold',
      subtitle: 'The Strategic Quit Date',
      revenueRange: '$10k+ / mo (12m Runway)',
      badge: 'SAFE EXIT',
      accentColor: '#D97706',
      bgLight: '#FFFBEB',
      bgDark: 'rgba(217, 119, 6, 0.15)',
      description: 'Side income exceeds day job for 6 straight months + 12 months liquid savings.',
      milestone: 'Full-time creator transition',
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title & Callout Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The Risk-Averse Creator Runway
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            From $98 to $835,000: The 4-Phase Side-Hustle Exit Blueprint
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 19,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Let the products come to you!
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {phases.map((phase, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={phase.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [18, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${phase.accentColor}33`
                  : `1px solid ${phase.accentColor}25`,
                boxShadow: isDark
                  ? '0 8px 20px rgba(0, 0, 0, 0.35)'
                  : '0 8px 20px rgba(0, 0, 0, 0.04)',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: phase.accentColor,
                }}
              />

              <div>
                {/* Header row: Stage number + Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: phase.accentColor,
                      backgroundColor: isDark ? phase.bgDark : phase.bgLight,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    PHASE {phase.stageNumber}
                  </span>

                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: phase.accentColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    {phase.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h4
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.25,
                  }}
                >
                  {phase.title}
                </h4>

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: phase.accentColor,
                    marginBottom: 8,
                  }}
                >
                  {phase.subtitle}
                </div>

                {/* Revenue Tag */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? '#E4E4E7' : '#0F172A',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                    padding: '3px 8px',
                    borderRadius: 6,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  {phase.revenueRange}
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: 11,
                    color: isDark ? '#A1A1AA' : '#64748B',
                    lineHeight: 1.4,
                  }}
                >
                  {phase.description}
                </p>
              </div>

              {/* Milestone Footer */}
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 8,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                }}
              >
                <div style={{ fontSize: 9.5, color: isDark ? '#71717A' : '#94A3B8', marginBottom: 2 }}>
                  Milestone Check:
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: isDark ? '#FAFAFA' : '#1E293B',
                    lineHeight: 1.3,
                  }}
                >
                  ✓ {phase.milestone}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

