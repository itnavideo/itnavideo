import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MobileMockupProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const MobileMockup: React.FC<MobileMockupProps> = ({
  title = 'Instagram Reel 9:16',
  subtitle = 'Auto Captions & Kinetic Typography',
  children,
  width = 280,
  height = 560,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bezelColor = '#1F2937';
  const screenBg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  const phoneSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${phoneSpring}) translateY(${(1 - phoneSpring) * 30}px)`,
        opacity: phoneSpring,
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {/* Smartphone Outer Shell */}
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: bezelColor,
          borderRadius: '44px',
          padding: '12px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 0 4px rgba(255,255,255,0.2)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Screen Glass */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: screenBg,
            borderRadius: '34px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Dynamic Island Notch */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90px',
              height: '24px',
              backgroundColor: '#000000',
              borderRadius: '20px',
              zIndex: 30,
            }}
          />

          {/* Screen Content */}
          <div
            style={{
              flex: 1,
              padding: '48px 16px 24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            {children || (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: textColor }}>
                  {title}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: textMuted, marginTop: '4px' }}>
                  {subtitle}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '4px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
