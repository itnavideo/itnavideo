import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StrategicPillar {
  title: string;
  subtitle: string;
  statement: string;
  tenets: string[];
  iconType?: 'compass' | 'target' | 'star' | 'eye';
  color?: string;
}

export interface MissionVisionInfographicProps {
  title?: string;
  subtitle?: string;
  mission: StrategicPillar;
  vision: StrategicPillar;
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * MissionVisionInfographic
 * Executive dual-pillar strategy infographic slide (Mission vs Vision / Objective vs Horizon).
 * Features high-contrast cards with symbolic geometry, pillars, and verified checklist tenets.
 */
export const MissionVisionInfographic: React.FC<MissionVisionInfographicProps> = ({
  title,
  subtitle,
  mission,
  vision,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14, stiffness: 120 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 14, stiffness: 120 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  const missionColor = mission.color || accentColor;
  const visionColor = vision.color || '#3B82F6';

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
            marginBottom: '26px',
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

      {/* ── DUAL PILLAR CARDS ── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          width: '100%',
        }}
      >
        {/* CARD 1: OUR MISSION */}
        <div
          style={{
            transform: `translateY(${(1 - leftSpring) * 30}px) scale(${leftSpring})`,
            opacity: leftSpring,
            borderRadius: '24px',
            backgroundColor: cardBg,
            border: `2px solid ${cardBorder}`,
            boxShadow: isDark
              ? '0 20px 48px rgba(0,0,0,0.5)'
              : '0 20px 48px rgba(180, 160, 140, 0.18)',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Decorative Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              backgroundColor: missionColor,
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 650,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: missionColor,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.05)',
                }}
              >
                {mission.subtitle || 'PRESENT PURPOSE'}
              </span>

              {/* Compass Icon SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={missionColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={missionColor} opacity="0.3" />
              </svg>
            </div>

            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '32px',
                fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                fontWeight: 700,
                color: textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              {mission.title || 'Our Mission'}
            </h3>

            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: textPrimary,
                lineHeight: 1.5,
              }}
            >
              "{mission.statement}"
            </p>
          </div>

          {/* Tenets / Pillars */}
          {mission.tenets && mission.tenets.length > 0 && (
            <div
              style={{
                paddingTop: '20px',
                borderTop: `1px solid ${cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {mission.tenets.map((tenet, idx) => (
                <div key={`m-tenet-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: `${missionColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: missionColor,
                      fontSize: '11px',
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: textSecondary }}>
                    {tenet}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 2: OUR VISION */}
        <div
          style={{
            transform: `translateY(${(1 - rightSpring) * 30}px) scale(${rightSpring})`,
            opacity: rightSpring,
            borderRadius: '24px',
            backgroundColor: cardBg,
            border: `2px solid ${cardBorder}`,
            boxShadow: isDark
              ? '0 20px 48px rgba(0,0,0,0.5)'
              : '0 20px 48px rgba(180, 160, 140, 0.18)',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Decorative Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              backgroundColor: visionColor,
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 650,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: visionColor,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.05)',
                }}
              >
                {vision.subtitle || 'FUTURE HORIZON'}
              </span>

              {/* Target / Eye Icon SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={visionColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill={visionColor} />
              </svg>
            </div>

            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '32px',
                fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                fontWeight: 700,
                color: textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              {vision.title || 'Our Vision'}
            </h3>

            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: textPrimary,
                lineHeight: 1.5,
              }}
            >
              "{vision.statement}"
            </p>
          </div>

          {/* Tenets / Pillars */}
          {vision.tenets && vision.tenets.length > 0 && (
            <div
              style={{
                paddingTop: '20px',
                borderTop: `1px solid ${cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {vision.tenets.map((tenet, idx) => (
                <div key={`v-tenet-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: `${visionColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: visionColor,
                      fontSize: '11px',
                      fontWeight: 900,
                    }}
                  >
                    ★
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: textSecondary }}>
                    {tenet}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

