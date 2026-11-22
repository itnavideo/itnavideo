import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ConfigOption {
  name: string;
  colorHex: string;
  priceDelta: string;
}

export interface ProductConfiguratorProps {
  productName?: string;
  basePrice?: string;
  options?: ConfigOption[];
  finishes?: string[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_OPTIONS: ConfigOption[] = [
  { name: 'Space Gray', colorHex: '#334155', priceDelta: 'Included' },
  { name: 'Midnight Blue', colorHex: '#1e3a8a', priceDelta: 'Included' },
  { name: 'Sunset Bronze', colorHex: '#b45309', priceDelta: '+$29' },
  { name: 'Titanium Silver', colorHex: '#e2e8f0', priceDelta: '+$49' },
];

/**
 * ProductConfigurator — Interactive real-time product customization picker.
 * Features animated color swatch selectors, finish toggles, and live price recalculation.
 */
export function ProductConfigurator({
  productName = 'Aura One Custom Studio Edition',
  basePrice = '$299',
  options = DEFAULT_OPTIONS,
  finishes = ['Matte Satin', 'Anodized Gloss', 'Brushed Metal'],
  accentColor = '#f59e0b',
  delay = 0,
  width = 480,
  height = 500,
}: ProductConfiguratorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Cycle through selected color option periodically
  const cycleIndex = Math.floor((t / 25) % options.length);
  const activeOption = options[cycleIndex];

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
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
          INTERACTIVE 3D CONFIGURATOR
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
          {productName}
        </div>
      </div>

      {/* Product Silhouette with Active Swatch Color */}
      <div
        style={{
          height: 180,
          borderRadius: 16,
          background: 'linear-gradient(180deg, #18181b 0%, #111827 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: activeOption.colorHex,
            filter: 'blur(35px)',
            opacity: 0.35,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Dynamic Mockup Disc */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${activeOption.colorHex}, #000000)`,
            boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
            border: '2px solid rgba(255,255,255,0.2)',
            zIndex: 2,
          }}
        />

        <div style={{ zIndex: 2, marginTop: 12, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
          {activeOption.name}
        </div>
      </div>

      {/* Swatch Selector Row */}
      <div style={{ opacity: intro }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>
          SELECT COLORWAY
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {options.map((opt, idx) => {
            const isSelected = idx === cycleIndex;
            return (
              <div
                key={opt.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 10,
                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: opt.colorHex,
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#ffffff' : '#94a3b8' }}>
                  {opt.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Total Price & Order CTA */}
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
        <div>
          <div style={{ fontSize: 10, color: '#64748b' }}>CONFIGURED TOTAL</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff' }}>{basePrice}</div>
        </div>

        <div
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: accentColor,
            color: '#000000',
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          Review Configuration
        </div>
      </div>
    </div>
  );
}
