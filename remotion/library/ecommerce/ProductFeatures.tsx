import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProductFeaturesProps {
  headline?: string;
  features?: FeatureItem[];
  columns?: 2 | 3;
  accentColor?: string;
  staggerFrames?: number;
  delay?: number;
  width?: number | string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  { icon: '⚡', title: 'Studio-Grade Audio', description: 'Zero-loss 24-bit 96kHz acoustic recording diaphragm' },
  { icon: '🔋', title: '48h Long Endurance', description: 'Fast charge 10 mins gives 8 hours uninterrupted runtime' },
  { icon: '🛡️', title: 'Titanium Shell', description: 'Ultra-lightweight aerospace alloy with drop-protection' },
  { icon: '📡', title: 'Zero-Latency Wireless', description: 'Ultra-wideband 2.4GHz low-jitter transmission' },
];

/**
 * ProductFeatures — Product selling propositions grid.
 * Staggers entrance of feature cards with vector icon badges,
 * titles, and high-impact value copy.
 */
export function ProductFeatures({
  headline = 'Engineered for Elite Creators',
  features = DEFAULT_FEATURES,
  columns = 2,
  accentColor = '#10b981',
  staggerFrames = 6,
  delay = 0,
  width = '100%',
}: ProductFeaturesProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width }}>
      {headline && (
        <h3 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: 18, fontWeight: 800, textAlign: 'center' }}>
          {headline}
        </h3>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 12,
        }}
      >
        {features.map((feat, index) => {
          const itemFrame = Math.max(0, frame - delay - index * staggerFrames);
          const spr = spring({
            frame: itemFrame,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.8 },
          });

          const translateY = interpolate(spr, [0, 1], [25, 0]);
          const opacity = interpolate(spr, [0, 1], [0, 1]);

          return (
            <div
              key={index}
              style={{
                backgroundColor: '#18181b',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                transform: `translateY(${translateY}px)`,
                opacity,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: `${accentColor}20`,
                  border: `1px solid ${accentColor}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{feat.title}</span>
                <span style={{ color: '#a1a1aa', fontSize: 11, lineHeight: 1.35 }}>{feat.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
