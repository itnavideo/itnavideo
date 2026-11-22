import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CategoryCard {
  title: string;
  itemCount: string;
  icon: string;
  tag?: string;
}

export interface ProductCategoryProps {
  headline?: string;
  subtitle?: string;
  categories?: CategoryCard[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CATEGORIES: CategoryCard[] = [
  { title: 'Studio Audio', itemCount: '28 Products', icon: '🎧', tag: 'Trending' },
  { title: 'Smart Wearables', itemCount: '14 Products', icon: '⌚' },
  { title: 'Optics & Lenses', itemCount: '19 Products', icon: '📷', tag: 'New' },
  { title: 'Pro Accessories', itemCount: '42 Products', icon: '⚡' },
];

/**
 * ProductCategory — Multi-category retail catalog browser.
 * Displays interactive 2x2 departmental grid with product counters,
 * highlight banners, and smooth card scale transitions.
 */
export function ProductCategory({
  headline = 'EXPLORE BY COLLECTION',
  subtitle = 'Find premium equipment tailored to your creative workflow',
  categories = DEFAULT_CATEGORIES,
  accentColor = '#3b82f6',
  delay = 0,
  width = 480,
  height = 500,
}: ProductCategoryProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ opacity: intro }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {headline}
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          {subtitle}
        </div>
      </div>

      {/* 2x2 Grid of Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          margin: '16px 0',
        }}
      >
        {categories.map((cat, idx) => {
          const cardSpr = spring({
            frame: Math.max(0, t - 6 - idx * 4),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          return (
            <div
              key={cat.title}
              style={{
                position: 'relative',
                padding: '18px 16px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 120,
                boxSizing: 'border-box',
                opacity: cardSpr,
                transform: `scale(${interpolate(cardSpr, [0, 1], [0.92, 1])})`,
              }}
            >
              {cat.tag && (
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: `${accentColor}22`,
                    color: accentColor,
                    border: `1px solid ${accentColor}44`,
                  }}
                >
                  {cat.tag}
                </span>
              )}

              <div style={{ fontSize: 28 }}>{cat.icon}</div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {cat.itemCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Browse All Collections Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 11, color: '#64748b' }}>Over 100+ Catalog SKUs</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, cursor: 'pointer' }}>
          View All Categories →
        </span>
      </div>
    </div>
  );
}
