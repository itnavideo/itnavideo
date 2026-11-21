import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LifeSystemItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  icon: string;
  rule: string;
}

export interface LifeSystemsDeckAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * LifeSystemsDeckAsset
 * The 5-Pillar Systems Architecture: Eliminating Willpower Through Interconnected Systems
 * Learned from Ali Abdaal's "Success Is Hard Until You Build Systems Like This" (YouTube: MBPHU7aaklM).
 */
export const LifeSystemsDeckAsset: React.FC<LifeSystemsDeckAssetProps> = ({
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

  const systems: LifeSystemItem[] = [
    {
      id: 'direction',
      number: '01',
      title: 'Direction OS',
      subtitle: 'GPS Framework (Goal, Plan, System)',
      badge: 'CLARITY',
      accentColor: '#0284C7',
      icon: '🧭',
      rule: 'Replace vague dreams with concrete daily inputs.',
    },
    {
      id: 'time',
      number: '02',
      title: 'Time Management',
      subtitle: 'Calendar Blocking & Deep Work',
      badge: 'EXECUTION',
      accentColor: '#6366F1',
      icon: '⏳',
      rule: 'If it is not on the calendar, it does not exist.',
    },
    {
      id: 'health',
      number: '03',
      title: 'Health & Energy',
      subtitle: 'Sleep Sanctuary & Movement',
      badge: 'VITALITY',
      accentColor: '#059669',
      icon: '⚡',
      rule: 'Energy is the prerequisite for all output.',
    },
    {
      id: 'relationships',
      number: '04',
      title: 'Relationship OS',
      subtitle: 'Protected Date Nights & Calls',
      badge: 'CONNECTION',
      accentColor: '#E11D48',
      icon: '❤️',
      rule: 'Schedule deep connection with non-negotiable blocks.',
    },
    {
      id: 'finance',
      number: '05',
      title: 'Personal Finance',
      subtitle: 'Payday Direct Debit & Index DCA',
      badge: 'FREEDOM',
      accentColor: '#D97706',
      icon: '📈',
      rule: 'Automate investing right after payday.',
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
            The 5-Pillar Systems Architecture
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Failure is a Design Problem: Eliminating Willpower via Life OS
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 20,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Systems beat motivation every time!
        </div>
      </div>

      {/* 5 Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {systems.map((sys, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={sys.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${sys.accentColor}33`
                  : `1px solid ${sys.accentColor}25`,
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35)'
                  : '0 6px 18px rgba(0, 0, 0, 0.04)',
                padding: '12px 10px',
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
                  backgroundColor: sys.accentColor,
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: sys.accentColor,
                      backgroundColor: isDark ? `${sys.accentColor}22` : `${sys.accentColor}12`,
                      padding: '2px 5px',
                      borderRadius: 4,
                    }}
                  >
                    OS {sys.number}
                  </span>
                  <span style={{ fontSize: 13 }}>{sys.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: sys.accentColor,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {sys.badge}
                </div>

                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 13,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.2,
                  }}
                >
                  {sys.title}
                </h4>

                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: sys.accentColor,
                    marginBottom: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {sys.subtitle}
                </div>

                <p style={{ margin: 0, fontSize: 10.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.35 }}>
                  {sys.rule}
                </p>
              </div>

              <div
                style={{
                  marginTop: 8,
                  paddingTop: 6,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 9.5,
                  color: sys.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>Automated</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Never Go To Zero Rule Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#FFF7ED',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#EA580C' }}>
          ★ The &quot;Never Go To Zero&quot; Rule:
        </span>
        <span style={{ fontSize: 11, color: isDark ? '#E4E4E7' : '#475569' }}>
          On your worst, most exhausted days, do the microscopic habit rep (1 sentence, 1 push-up). Preserve the streak identity.
        </span>
      </div>
    </div>
  );
};

