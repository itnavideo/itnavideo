import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CreatorIcebergAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * CreatorIcebergAsset
 * The "Creator Business Iceberg" Framework (Surface Content vs Deep Revenue Engine).
 * Learned from Ali Abdaal's "What I Actually Do When I'm Not Making YouTube Videos" (YouTube: J5U3t6-zVz0).
 */
export const CreatorIcebergAsset: React.FC<CreatorIcebergAssetProps> = ({
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

  const tipSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const deepSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const deepPillars = [
    {
      title: 'Academy & Community Operations',
      desc: 'Live coaching • Student curriculum • High-ticket backend engine',
      color: '#EA580C',
      badge: 'Revenue Driver',
    },
    {
      title: 'Software & Product Engineering',
      desc: 'Superfocus SaaS • Digital templates • Asynchronous scalable equity',
      color: '#059669',
      badge: 'Scalable Assets',
    },
    {
      title: 'Written Media & Newsletters',
      desc: 'Weekly LifeNotes • The Splurge method • Direct audience ownership',
      color: '#D97706',
      badge: 'Audience Moat',
    },
    {
      title: 'Executive Systems & Cash Flow',
      desc: 'Team delegation • Asynchronous Notion sprints • Profit distribution',
      color: '#7C3AED',
      badge: 'Operations',
    },
  ];

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
            The Creator Business Iceberg
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Public Front-End (15%) vs Private Engine (85%)
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
          YouTube is just the storefront!
        </div>
      </div>

      {/* Surface Section (Above Waterline - 15%) */}
      <div
        style={{
          opacity: tipSpring,
          transform: `translateY(${interpolate(tipSpring, [0, 1], [12, 0])}px)`,
          backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#F0F9FF',
          border: '1.5px solid rgba(2, 132, 199, 0.35)',
          borderRadius: 14,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>👀</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#38BDF8' : '#0284C7' }}>
              What People See (The Tip: 15%)
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B' }}>
              Filming YouTube videos • Thumbnail photoshoots • Social media clips
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: isDark ? 'rgba(2, 132, 199, 0.2)' : '#E0F2FE',
            color: '#0284C7',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Surface Front-End
        </div>
      </div>

      {/* Waterline Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          margin: '6px 0 10px 0',
          opacity: 0.6,
        }}
      >
        <div style={{ flex: 1, height: 1, borderTop: '1px dashed #0284C7' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', letterSpacing: '0.06em' }}>
          WATERLINE (THE VISIBILITY BOUNDARY)
        </span>
        <div style={{ flex: 1, height: 1, borderTop: '1px dashed #0284C7' }} />
      </div>

      {/* Deep Section (Beneath Waterline - 85%) */}
      <div
        style={{
          opacity: deepSpring,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {deepPillars.map((pillar) => (
          <div
            key={pillar.title}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: pillar.color,
              }}
            />

            <div style={{ paddingLeft: 6 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDark ? '#FFFFFF' : '#18181B',
                  marginBottom: 2,
                }}
              >
                {pillar.title}
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#64748B' }}>
                {pillar.desc}
              </div>
            </div>

            <div
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                border: `1px solid ${pillar.color}35`,
                color: pillar.color,
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {pillar.badge}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

