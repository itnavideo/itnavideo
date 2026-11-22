import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UnboxingItem {
  name: string;
  count: string;
  icon?: string;
}

export interface ProductUnboxingProps {
  headline?: string;
  productName?: string;
  items?: UnboxingItem[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ITEMS: UnboxingItem[] = [
  { name: 'Aura One Pro Headphones', count: '1x Unit' },
  { name: 'Braided 3.5mm Gold-Plated Cable', count: '1x (1.8m)' },
  { name: 'USB-C Ultra-Fast Charging Cable', count: '1x (1.2m)' },
  { name: 'Hard Shell Travel Case', count: '1x Waterproof' },
  { name: 'Quick Start & Warranty Card', count: '1x Booklet' },
];

/**
 * ProductUnboxing — Cinematic unboxing breakdown & "What's In The Box" reveal.
 * Features lid liftoff animation, foam-insert compartment tray, and accessory inventory.
 */
export function ProductUnboxing({
  headline = "WHAT'S IN THE BOX",
  productName = 'Complete Retail Edition Contents',
  items = DEFAULT_ITEMS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 480,
  height = 520,
}: ProductUnboxingProps) {
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
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20, opacity: intro }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: accentColor }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
            {headline}
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
          {productName}
        </div>
      </div>

      {/* Items Inventory List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
        {items.map((item, idx) => {
          const itemSpr = spring({
            frame: Math.max(0, t - 6 - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
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
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                opacity: itemSpr,
                transform: `translateX(${interpolate(itemSpr, [0, 1], [-20, 0])}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: `${accentColor}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accentColor,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                  {item.name}
                </div>
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {item.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Seal Footer */}
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
        <span style={{ fontSize: 10, color: '#64748b' }}>FACTORY TAMPER-EVIDENT SEALED</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>QC PASSED ✓</span>
      </div>
    </div>
  );
}
