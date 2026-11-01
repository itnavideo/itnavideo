import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FloatingBrowserWindowProps {
  children: React.ReactNode;
  url?: string;
  width?: number;
  height?: number;
  tiltAngle?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export const FloatingBrowserWindow: React.FC<FloatingBrowserWindowProps> = ({
  children,
  url = 'itnavideo.com/dashboard',
  width = 1420,
  height = 840,
  tiltAngle = 0,
  scale = 1,
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: '#0F121C',
        boxShadow: '0 30px 90px -15px rgba(0, 0, 0, 0.85), 0 0 60px -10px rgba(255, 87, 34, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: `perspective(1200px) rotateX(${tiltAngle * 0.4}deg) rotateY(${tiltAngle * -0.6}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.2s ease-out',
        ...style,
      }}
    >
      {/* Top Browser Header Bar */}
      <div
        style={{
          height: 48,
          backgroundColor: '#080A10',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* macOS Traffic Light Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>

        {/* Browser URL Capsule */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 999,
            padding: '4px 20px',
            fontSize: 13,
            color: '#94A3B8',
            fontFamily: 'system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#10B981', fontSize: 10 }}>🔒</span>
          <span>{url}</span>
        </div>

        {/* Right Studio Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF5722' }} />
          <span style={{ fontSize: 11, color: '#FF7043', fontWeight: 800 }}>LIVE CLOUD ENGINE</span>
        </div>
      </div>

      {/* Internal Content Viewport */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#0A0D15',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
