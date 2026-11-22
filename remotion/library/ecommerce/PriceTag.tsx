import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PriceTagProps {
  price?: string;
  originalPrice?: string;
  currency?: string;
  savingsText?: string;
  badge?: string;
  slashStrike?: boolean;
  accentColor?: string;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * PriceTag — High-impact animated price badge.
 * Features crossed-out original price with animated diagonal slash,
 * large discounted offer price, and pulsing savings pill banner.
 */
export function PriceTag({
  price = '149',
  originalPrice = '249',
  currency = '$',
  savingsText = 'SAVE $100 TODAY',
  badge = 'LIMITED TIME OFFER',
  slashStrike = true,
  accentColor = '#10b981',
  delay = 0,
  style,
}: PriceTagProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Slash line width expansion
  const slashWidth = slashStrike
    ? interpolate(adjustedFrame, [10, 30], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {/* Top Offer Badge */}
      {badge && (
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 9999,
            backgroundColor: `${accentColor}25`,
            border: `1px solid ${accentColor}80`,
            color: accentColor,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}
        >
          {badge}
        </span>
      )}

      {/* Main Price Numbers Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        {/* Original Price with Red Slash */}
        {originalPrice && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#71717a',
                fontFamily: 'monospace',
              }}
            >
              {currency}{originalPrice}
            </span>

            {/* Animated Red Slash Line */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: -2,
                width: `${slashWidth}%`,
                height: 3,
                backgroundColor: '#ef4444',
                transform: 'rotate(-14deg)',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                transition: 'none',
              }}
            />
          </div>
        )}

        {/* Big Offer Price */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: accentColor,
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            {currency}
          </span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              fontFamily: 'monospace',
              letterSpacing: '-0.03em',
            }}
          >
            {price}
          </span>
        </div>
      </div>

      {/* Bottom Savings Callout */}
      {savingsText && (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          }}
        >
          {savingsText}
        </span>
      )}
    </div>
  );
}
