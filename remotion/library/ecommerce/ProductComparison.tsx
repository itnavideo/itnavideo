import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProductFeatureComparison {
  name: string;
  productAVal: string;
  productBVal: string;
  winner?: 'A' | 'B' | 'tie';
}

export interface ProductComparisonProps {
  productAName?: string;
  productBName?: string;
  productAPrice?: string;
  productBPrice?: string;
  productAImage?: string;
  productBImage?: string;
  features?: ProductFeatureComparison[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_COMPARISON_FEATURES: ProductFeatureComparison[] = [
  { name: 'Sensor Resolution', productAVal: '48 MP Raw', productBVal: '12 MP Std', winner: 'A' },
  { name: 'Battery Endurance', productAVal: '28 Hours', productBVal: '14 Hours', winner: 'A' },
  { name: 'Wireless Standard', productAVal: 'Wi-Fi 7 + BT 5.4', productBVal: 'Wi-Fi 6', winner: 'A' },
  { name: 'Unit Net Weight', productAVal: '184 Grams', productBVal: '220 Grams', winner: 'A' },
];

/**
 * ProductComparison — Side-by-side product duel comparison card.
 * Compares two competitor products on price, specifications,
 * and highlights winning features with badges.
 */
export function ProductComparison({
  productAName = 'Pro Model Ultra',
  productBName = 'Standard Base',
  productAPrice = '$499',
  productBPrice = '$299',
  productAImage = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80',
  productBImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
  features = DEFAULT_COMPARISON_FEATURES,
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 420,
}: ProductComparisonProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Duel Header with Dual Product Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 1fr', alignItems: 'center', gap: 12 }}>
        {/* Product A */}
        <div
          style={{
            backgroundColor: '#18181b',
            borderRadius: 12,
            padding: 12,
            border: `2px solid ${accentColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <Img src={productAImage} alt={productAName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{productAName}</span>
            <div style={{ color: accentColor, fontSize: 15, fontWeight: 900, fontFamily: 'monospace' }}>
              {productAPrice}
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#27272a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 900,
            margin: '0 auto',
          }}
        >
          VS
        </div>

        {/* Product B */}
        <div
          style={{
            backgroundColor: '#18181b',
            borderRadius: 12,
            padding: 12,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <Img src={productBImage} alt={productBName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 700 }}>{productBName}</span>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'monospace' }}>
              {productBPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              alignItems: 'center',
              backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            <span style={{ color: '#71717a', fontWeight: 600 }}>{f.name}</span>
            <span style={{ color: f.winner === 'A' ? accentColor : '#fff', fontWeight: 700 }}>
              {f.productAVal} {f.winner === 'A' && '✓'}
            </span>
            <span style={{ color: f.winner === 'B' ? accentColor : '#a1a1aa', fontWeight: 500 }}>
              {f.productBVal}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Verdict */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 8,
        }}
      >
        <span>Winner: <strong style={{ color: accentColor }}>{productAName} (4 / 4 Categories)</strong></span>
        <span>Spec Ratio: 2.1x Higher ROI</span>
      </div>
    </div>
  );
}
