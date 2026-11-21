import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BusinessTrinityAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  personLabel?: string;
  problemLabel?: string;
  productLabel?: string;
}

/**
 * BusinessTrinityAsset
 * The 3-P Business Engine Framework: Person, Problem, Product.
 * Learned from Ali Abdaal's CUHK Business School masterclass ("How to Get Rich", YouTube: G2tBWRHif6Q).
 */
export const BusinessTrinityAsset: React.FC<BusinessTrinityAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 8,
  personLabel = '1. The Person',
  problemLabel = '2. The Problem',
  productLabel = '3. The Product',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const pillars = [
    {
      title: personLabel,
      subtitle: 'Who specifically has the budget & pain?',
      badge: 'Specific Audience',
      color: '#0284C7',
      bgLight: '#F0F9FF',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: problemLabel,
      subtitle: 'What is the $10,000 acute bottleneck?',
      badge: 'Painful Urgency',
      color: '#EA580C',
      bgLight: '#FFF7ED',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      title: productLabel,
      subtitle: 'What high-ROI solution solves it fast?',
      badge: 'Clear Deliverable',
      color: '#059669',
      bgLight: '#F0FDF4',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
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
            The 3-P Business Engine
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Person • Problem • Product
          </span>
        </div>

        <div
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.10)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            fontSize: 11,
            fontWeight: 700,
            color: '#059669',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Sweet Spot Intersection
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {pillars.map((p, idx) => {
          const colSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={p.title}
              style={{
                opacity: colSpring,
                transform: `translateY(${interpolate(colSpring, [0, 1], [20, 0])}px)`,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                borderRadius: 16,
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 10px 30px -8px rgba(0, 0, 0, 0.6)'
                  : '0 10px 30px -8px rgba(0, 0, 0, 0.06)',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Color Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: p.color,
                }}
              />

              <div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : p.bgLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  {p.icon}
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: isDark ? '#FFFFFF' : '#18181B',
                    marginBottom: 4,
                  }}
                >
                  {p.title}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: isDark ? '#A1A1AA' : '#71717A',
                    lineHeight: 1.4,
                  }}
                >
                  {p.subtitle}
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F4F4F5',
                  border: `1px solid ${p.color}30`,
                  fontSize: 11,
                  fontWeight: 650,
                  color: p.color,
                  textAlign: 'center',
                }}
              >
                {p.badge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

