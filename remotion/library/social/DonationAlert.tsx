import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DonationAlertProps {
  donorName?: string;
  amount?: string;
  message?: string;
  currencySymbol?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DonationAlert — High-energy streaming tip / donation alert pop-up.
 * Features golden coin animation, glowing donor banner, and custom viewer message bubble.
 */
export function DonationAlert({
  donorName = 'CyberViking_99',
  amount = '$50.00',
  message = 'Keep up the insane work on Itnavideo! Here is coffee for the devs ☕🚀',
  currencySymbol = '$',
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 140,
}: DonationAlertProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        borderRadius: 20,
        border: `2px solid ${accentColor}`,
        boxShadow: `0 16px 36px rgba(0,0,0,0.85), 0 0 24px ${accentColor}33`,
        opacity: intro,
        transform: `scale(${interpolate(intro, [0, 1], [0.85, 1])}) translateY(${interpolate(intro, [0, 1], [-20, 0])}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Golden Coin Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #fde047 0%, ${accentColor} 60%, #b45309 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 16px ${accentColor}66`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 900, color: '#78350f' }}>$</span>
      </div>

      {/* Donor Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>
            {donorName}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: accentColor,
              background: `${accentColor}18`,
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            {amount}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#e2e8f0',
            marginTop: 4,
            lineHeight: 1.35,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{message}&rdquo;
        </div>
      </div>
    </div>
  );
}
