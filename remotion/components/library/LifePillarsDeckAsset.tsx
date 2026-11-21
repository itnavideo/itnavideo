import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LifePillarItem {
  id: string;
  name: string;
  status: string;
  metric?: string;
  color: string;
  iconSvg: React.ReactNode;
}

export interface LifePillarsDeckAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * LifePillarsDeckAsset
 * 4-Pillar Life Architecture Card Deck (Health, Wealth, Relationships, Growth).
 * Learned from Ali Abdaal's signature life-alignment masterclass.
 */
export const LifePillarsDeckAsset: React.FC<LifePillarsDeckAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 8,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const pillars: LifePillarItem[] = [
    {
      id: 'health',
      name: 'Physical & Mental Health',
      status: 'OPTIMAL ENERGY',
      metric: '8.4 hrs sleep',
      color: '#10B981',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'wealth',
      name: 'Wealth & Asymmetric Bets',
      status: 'SCALING AUTOMATION',
      metric: '+3.4x Leverage',
      color: '#D97706',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      ),
    },
    {
      id: 'relationships',
      name: 'Deep Human Connection',
      status: 'FAMILY & COMMUNITY',
      metric: 'Daily Quality Time',
      color: '#0284C7',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'growth',
      name: 'Curiosity & Mastery',
      status: 'SUPERFOCUS FLOW',
      metric: '4 hrs Deep Work',
      color: '#8B5CF6',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        width: '100%',
        maxWidth: '1280px',
        transform: `scale(${scale})`,
      }}
    >
      {pillars.map((pillar, idx) => {
        const itemSpring = spring({
          frame: Math.max(0, frame - idx * 6),
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        return (
          <div
            key={pillar.id}
            style={{
              transform: `translateY(${(1 - itemSpring) * 28}px) scale(${itemSpring})`,
              opacity: itemSpring,
              borderRadius: '20px',
              backgroundColor: cardBg,
              border: `1.5px solid ${cardBorder}`,
              boxShadow: isDark
                ? '0 16px 36px rgba(0,0,0,0.5)'
                : '0 16px 36px rgba(180, 160, 140, 0.16)',
              padding: '22px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${pillar.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pillar.iconSvg}
              </div>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: pillar.color,
                  backgroundColor: `${pillar.color}15`,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                }}
              >
                {pillar.status}
              </span>
            </div>

            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: textPrimary,
                  lineHeight: 1.25,
                  marginBottom: '6px',
                  fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                }}
              >
                {pillar.name}
              </div>

              {pillar.metric && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textSecondary,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {pillar.metric}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LifePillarsDeckAsset;
