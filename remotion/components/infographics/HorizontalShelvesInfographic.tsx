import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ShelfTierItem {
  id: string;
  name: string;
  badge?: string;
  color?: string;
  tags?: string[];
}

export interface ShelfTier {
  id: string;
  levelNumber: number | string;
  name: string;
  subtitle?: string;
  accentColor?: string;
  items: ShelfTierItem[];
}

export interface HorizontalShelvesInfographicProps {
  title?: string;
  subtitle?: string;
  tiers: ShelfTier[];
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * HorizontalShelvesInfographic
 * Tiered architectural shelf rack / stacked value chain presentation infographic.
 * Perfect for software architecture, 4-tier business models, and multi-level stacks.
 */
export const HorizontalShelvesInfographic: React.FC<HorizontalShelvesInfographicProps> = ({
  title,
  subtitle,
  tiers,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  const activeTiers = tiers.slice(0, 4);

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

      {/* ── STACKED SHELVES CONTAINER ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px',
          width: '100%',
        }}
      >
        {activeTiers.map((tier, idx) => {
          const tierSpring = spring({
            frame: Math.max(0, frame - (8 + idx * 7)),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const tierColor = tier.accentColor || (
            idx === 0 ? accentColor :
            idx === 1 ? '#3B82F6' :
            idx === 2 ? '#8B5CF6' :
            '#10B981'
          );

          return (
            <div
              key={`shelf-tier-${idx}`}
              style={{
                transform: `translateX(${(1 - tierSpring) * -30}px) scale(${0.97 + tierSpring * 0.03})`,
                opacity: tierSpring,
                display: 'flex',
                alignItems: 'stretch',
                borderRadius: '18px',
                backgroundColor: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 12px 28px rgba(0,0,0,0.45)'
                  : '0 12px 28px rgba(180, 160, 140, 0.14)',
                overflow: 'hidden',
                minHeight: '90px',
              }}
            >
              {/* Left Color Indicator & Level Tab */}
              <div
                style={{
                  width: '180px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(30,41,59,0.03)',
                  borderRight: `2px solid ${tierColor}`,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 650,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tierColor,
                    marginBottom: '4px',
                  }}
                >
                  Tier {tier.levelNumber || idx + 1}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 650,
                    color: textPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  {tier.name}
                </div>
              </div>

              {/* Shelf Component Chips */}
              <div
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                {tier.items && tier.items.length > 0 ? (
                  tier.items.map((item, itemIdx) => {
                    const chipSpring = spring({
                      frame: Math.max(0, frame - (14 + idx * 7 + itemIdx * 3)),
                      fps,
                      config: { damping: 12, stiffness: 140 },
                    });

                    return (
                      <div
                        key={`chip-${idx}-${itemIdx}`}
                        style={{
                          transform: `scale(${chipSpring})`,
                          opacity: chipSpring,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : '#F8FAFC',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30, 41, 59, 0.08)'}`,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: item.color || tierColor,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: textPrimary,
                          }}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,41,59,0.06)',
                              color: tierColor,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span style={{ fontSize: '13px', color: textSecondary }}>
                    {tier.subtitle || 'Active architecture modules'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

