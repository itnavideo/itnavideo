import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PricingCardProps {
  planName?: string;
  price?: string;
  billingPeriod?: string;
  isPopular?: boolean;
  features?: string[];
  ctaText?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

const DEFAULT_PRICING_FEATURES = [
  'Unlimited 1080p 30fps Cloud Renders',
  '32 Word-Level Kinetic Subtitle Presets',
  'Groq Whisper large-v3-turbo STT',
  'Zero Watermark on All Video Exports',
  'Priority AWS Lambda Execution Cluster',
];

export const PricingCard: React.FC<PricingCardProps> = ({
  planName = 'Pro Creator Tier',
  price = '$29',
  billingPeriod = '/ month',
  isPopular = true,
  features = DEFAULT_PRICING_FEATURES,
  ctaText = 'Start Instant Video Creation',
  theme = 'dark',
  delayFrames = 5,
  width = 320,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isPopular ? '#0066FF' : isDark ? '#334155' : '#E2E8F0';

  const cardSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '32px 28px',
        boxShadow: isPopular ? '0 16px 45px rgba(0, 102, 255, 0.25)' : '0 10px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 20}px)`,
        opacity: cardSpring,
        ...style,
      }}
    >
      {/* Popular Pill */}
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: '#0066FF',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(0, 102, 255, 0.4)',
          }}
        >
          ★ Most Popular
        </div>
      )}

      {/* Plan Name */}
      <div style={{ fontSize: '18px', fontWeight: 800, color: textColor }}>
        {planName}
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '14px 0 20px 0' }}>
        <span style={{ fontSize: '38px', fontWeight: 900, color: textColor, letterSpacing: '-0.03em' }}>
          {price}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMuted }}>
          {billingPeriod}
        </span>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {features.map((feat, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: textColor }}>
            <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
            <span style={{ fontWeight: 500, lineHeight: 1.3 }}>{feat}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#0066FF',
          color: '#FFFFFF',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 800,
          boxShadow: '0 4px 16px rgba(0, 102, 255, 0.35)',
        }}
      >
        {ctaText}
      </div>
    </div>
  );
};
