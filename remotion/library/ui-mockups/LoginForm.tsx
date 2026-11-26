import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LoginFormProps {
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title = 'Sign In to Itnavideo',
  subtitle = 'Access your autonomous video creation dashboard',
  emailPlaceholder = 'creator@youtube.com',
  theme = 'dark',
  delayFrames = 5,
  width = 340,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const inputBg = isDark ? '#1F2937' : '#F9FAFB';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#374151' : '#E5E7EB';

  const formSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '32px 28px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `scale(${formSpring}) translateY(${(1 - formSpring) * 20}px)`,
        opacity: formSpring,
        ...style,
      }}
    >
      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>
        {title}
      </h3>
      <p style={{ margin: '4px 0 20px 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>
        {subtitle}
      </p>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: textColor, display: 'block', marginBottom: '6px' }}>
            EMAIL ADDRESS
          </label>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: inputBg,
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              color: textColor,
            }}
          >
            {emailPlaceholder}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: textColor, display: 'block', marginBottom: '6px' }}>
            PASSWORD
          </label>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: inputBg,
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              color: textMuted,
            }}
          >
            ••••••••••••
          </div>
        </div>

        {/* Submit Button */}
        <div
          style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: '#0066FF',
            color: '#FFFFFF',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 800,
            boxShadow: '0 4px 16px rgba(0, 102, 255, 0.4)',
          }}
        >
          Continue with Studio
        </div>
      </div>
    </div>
  );
};
