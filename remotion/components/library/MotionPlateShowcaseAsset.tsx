import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MotionPlateShowcaseAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  productName?: string;
  tagline?: string;
  categoryBadge?: string;
  metricsText?: string;
  featureBullets?: string[];
}

/**
 * MotionPlateShowcaseAsset
 * Programmatic Motion Plate for Product & SaaS Launches.
 * Learned from Ali Abdaal's "I Tried Fully Automating My Video Editing With AI (Remotion & Claude Code)" (YouTube: C0jOKDJtK9s).
 */
export const MotionPlateShowcaseAsset: React.FC<MotionPlateShowcaseAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  productName = 'CreatorGrid LifeOS',
  tagline = 'Automated Creative Workflow Engine for Modern Founders',
  categoryBadge = 'AI Video Automation',
  metricsText = '⚡ 10x Faster Video Output',
  featureBullets = [
    'Modular Remotion Motion Plates',
    'Millisecond Word-Level Subtitle Sync',
    'Dynamic Side-Docked Screen Partitioning',
  ],
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const cardSpring = spring({
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
      {/* Container Frame */}
      <div
        style={{
          opacity: cardSpring,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.92)' : '#FFFFFF',
          borderRadius: 20,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isDark
            ? '0 20px 50px -12px rgba(0, 0, 0, 0.7)'
            : '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Row with Traffic Lights */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                fontFamily: 'JetBrains Mono, monospace',
                color: isDark ? '#A1A1AA' : '#71717A',
              }}
            >
              remotion://motion-plate.tsx
            </span>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.10)',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              fontSize: 11,
              fontWeight: 700,
              color: '#EA580C',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {categoryBadge}
          </div>
        </div>

        {/* Product Headline & Tagline */}
        <div style={{ marginBottom: 16 }}>
          <h2
            style={{
              margin: '0 0 6px 0',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FFFFFF' : '#141414',
              letterSpacing: '-0.01em',
            }}
          >
            {productName}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: isDark ? '#A1A1AA' : '#52525B',
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </p>
        </div>

        {/* Features Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {featureBullets.map((bullet, idx) => {
            const bulletSpring = spring({
              frame: Math.max(0, frame - 8 - idx * 5),
              fps,
              config: { damping: 14, stiffness: 130 },
            });

            return (
              <div
                key={bullet}
                style={{
                  opacity: bulletSpring,
                  transform: `translateX(${interpolate(bulletSpring, [0, 1], [-14, 0])}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 10,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isDark ? '#E4E4E7' : '#27272A',
                  }}
                >
                  {bullet}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Metrics Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>
            {metricsText}
          </div>
          <div
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 18,
              fontWeight: 700,
              color: '#EA580C',
              transform: 'rotate(-3deg)',
            }}
          >
            Instant Cloud Render
          </div>
        </div>
      </div>
    </div>
  );
};

