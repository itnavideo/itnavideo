import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CalloutPoint {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  title: string;
  desc: string;
  side?: 'left' | 'right';
}

export interface ProductFeatureCalloutProps {
  productTitle?: string;
  imageSrc?: string;
  callouts?: CalloutPoint[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CALLOUTS: CalloutPoint[] = [
  { x: 35, y: 30, title: 'Adaptive ANC 4.0', desc: 'Real-time 48kHz noise cancellation', side: 'left' },
  { x: 65, y: 48, title: 'Biometric Touch Bar', desc: 'Swipe volume & gesture controls', side: 'right' },
  { x: 40, y: 72, title: 'Titanium Acoustic Cavity', desc: 'Zero harmonic distortion chamber', side: 'left' },
];

/**
 * ProductFeatureCallout — High-tech interactive feature callout pins.
 * Emits pulsing radar pins onto exact coordinates of the product photo
 * with dynamic connecting pointer lines and glassmorphic detail cards.
 */
export function ProductFeatureCallout({
  productTitle = 'AURA PRO SIGNATURE FEATURES',
  imageSrc = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  callouts = DEFAULT_CALLOUTS,
  accentColor = '#06b6d4',
  delay = 0,
  width = 540,
  height = 500,
}: ProductFeatureCalloutProps) {
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
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: 12, opacity: intro }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: '0.14em' }}>
          {productTitle}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Center Product Image */}
        <div style={{ width: 260, height: 260, position: 'relative' }}>
          <Img
            src={imageSrc}
            alt={productTitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.7))',
            }}
          />
        </div>

        {/* Callout Pins & Labels */}
        {callouts.map((point, idx) => {
          const pinDelay = 10 + idx * 8;
          const pinSpr = spring({
            frame: Math.max(0, t - pinDelay),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const pulse = 1 + Math.sin((t + idx * 10) * 0.15) * 0.3;
          const isRight = point.side === 'right';

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                opacity: pinSpr,
              }}
            >
              {/* Radar Pulse Pin */}
              <div
                style={{
                  position: 'relative',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `${accentColor}33`,
                    transform: `scale(${pulse})`,
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
              </div>

              {/* Connecting Label Card */}
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  [isRight ? 'left' : 'right']: 24,
                  width: 160,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: 'rgba(24, 24, 27, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                  transform: `scale(${interpolate(pinSpr, [0, 1], [0.85, 1])})`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>
                  {point.title}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>
                  {point.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
