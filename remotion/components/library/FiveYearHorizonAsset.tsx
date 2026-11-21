import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FiveYearHorizonPillar {
  title: string;
  badge: string;
  color: string;
  goals: string[];
}

export interface FiveYearHorizonAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  horizonTitle?: string;
  horizonSubtitle?: string;
}

/**
 * FiveYearHorizonAsset
 * 5-Year Life Horizon Architecture (Family & Presence, Health & Vitality, Business & SaaS).
 * Learned from Ali Abdaal's "Everything's Changing - 2026 Life Update" (YouTube: DrZNvkOgZRE).
 */
export const FiveYearHorizonAsset: React.FC<FiveYearHorizonAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 6,
  horizonTitle = 'The 5-Year Life Horizon (2026 – 2031)',
  horizonSubtitle = 'Intentional Life Architecture Across 3 Vital Domains',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const pillars: FiveYearHorizonPillar[] = [
    {
      title: 'Family & Fatherhood',
      badge: 'Presence First',
      color: '#E11D48',
      goals: [
        'Be fully present for toddler years',
        'Deep local community & boys group',
        'Intentional travel with family',
      ],
    },
    {
      title: 'Health & Vitality',
      badge: 'Longevity Focus',
      color: '#059669',
      goals: [
        'Zone 2 cardio & strength training 4x/wk',
        'Consistent 8h restorative sleep',
        'High daily energy & mental clarity',
      ],
    },
    {
      title: 'Business & Software',
      badge: 'Scalable Assets',
      color: '#D97706',
      goals: [
        'Lifestyle Business Academy scale',
        'Superfocus productivity SaaS engine',
        'High-leverage media & author brand',
      ],
    },
  ];

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
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
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            {horizonTitle}
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            {horizonSubtitle}
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 18,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-4deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '3px 10px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Vision &gt; Reactivity
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {pillars.map((pillar, idx) => {
          const colSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={pillar.title}
              style={{
                opacity: colSpring,
                transform: `translateY(${interpolate(colSpring, [0, 1], [20, 0])}px)`,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                borderRadius: 16,
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 12px 30px -8px rgba(0, 0, 0, 0.6)'
                  : '0 12px 30px -8px rgba(0, 0, 0, 0.06)',
                padding: '18px 16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Stripe */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: pillar.color,
                }}
              />

              <div
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F4F4F5',
                  border: `1px solid ${pillar.color}35`,
                  color: pillar.color,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {pillar.badge}
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isDark ? '#FFFFFF' : '#18181B',
                  marginBottom: 12,
                }}
              >
                {pillar.title}
              </div>

              {/* Goals list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pillar.goals.map((g) => (
                  <div key={g} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F0FDF4',
                        border: '1px solid #10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#52525B', lineHeight: 1.35 }}>
                      {g}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

