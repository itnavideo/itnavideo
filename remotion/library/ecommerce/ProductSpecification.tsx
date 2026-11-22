import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SpecItem {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

export interface ProductSpecificationProps {
  productTitle?: string;
  category?: string;
  specs?: SpecItem[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_SPECS: SpecItem[] = [
  { label: 'Acoustic Driver', value: '50mm Graphene Dual Chamber', subtext: 'Ultra-low <0.05% THD' },
  { label: 'Battery Endurance', value: '65 Hours Playback', subtext: 'Fast Charge: 10m = 8 Hours', highlight: true },
  { label: 'Active Noise Cancellation', value: 'Hybrid ANC (-45dB)', subtext: '8 External Beamforming Mics' },
  { label: 'Wireless Protocol', value: 'Bluetooth 5.4 & LE Audio', subtext: 'LDAC, aptX Adaptive, AAC' },
  { label: 'Weight & Materials', value: '248 Grams', subtext: 'Grade 5 Titanium & Memory Foam' },
];

/**
 * ProductSpecification — High-density technical specification sheet.
 * Features staggered spec card entries, highlighted hero metrics,
 * and high-contrast typography designed for product launch videos.
 */
export function ProductSpecification({
  productTitle = 'TECHNICAL SPECIFICATIONS',
  category = 'AUDIO HARDWARE ARCHITECTURE',
  specs = DEFAULT_SPECS,
  accentColor = '#3b82f6',
  delay = 0,
  width = 500,
  height = 540,
}: ProductSpecificationProps) {
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
        padding: '28px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20, opacity: intro }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          {category}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
          {productTitle}
        </div>
      </div>

      {/* Specs Grid Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
        {specs.map((item, idx) => {
          const itemSpr = spring({
            frame: Math.max(0, t - 6 - idx * 4),
            fps,
            config: { damping: 14, stiffness: 95 },
          });

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 14,
                background: item.highlight
                  ? `linear-gradient(90deg, ${accentColor}18, rgba(255,255,255,0.03))`
                  : 'rgba(255, 255, 255, 0.02)',
                border: item.highlight
                  ? `1px solid ${accentColor}55`
                  : '1px solid rgba(255, 255, 255, 0.06)',
                opacity: itemSpr,
                transform: `translateY(${interpolate(itemSpr, [0, 1], [15, 0])}px)`,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>
                  {item.value}
                </div>
              </div>

              {item.subtext && (
                <div
                  style={{
                    fontSize: 11,
                    color: item.highlight ? accentColor : '#64748b',
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  {item.subtext}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Benchmark Verified Bug */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: intro,
        }}
      >
        <span style={{ fontSize: 10, color: '#64748b' }}>
          LABORATORY BENCHMARK VERIFIED
        </span>
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>
          CERTIFIED HI-RES AUDIO WIRELESS
        </span>
      </div>
    </div>
  );
}
