import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MotionCaptureProps {
  title?: string;
  markerCount?: number;
  trackingConfidence?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const MotionCapture: React.FC<MotionCaptureProps> = ({
  title = 'Optical Motion Capture Point Cloud',
  markerCount = 28,
  trackingConfidence = 99.4,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sway = Math.sin(frame * 0.08) * 10;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>📡 OPTICAL MOCAP</span>
          <span>•</span>
          <span>RETRO-REFLECTIVE TRACKERS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Mocap Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#090a10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Spatial Coordinate Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* 3D Tracking Marker Point Cloud Skeleton */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 0 10px #10b981)',
          }}
        >
          {/* Tracking Vector Lines connecting markers */}
          <line x1="100" y1="50" x2={100 + sway * 0.3} y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="70" y1="90" x2="130" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="70" y1="90" x2={50 + sway} y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="130" y1="90" x2={150 - sway} y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1={100 + sway * 0.3} y1="90" x2="100" y2="165" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="100" y1="165" x2="75" y2="280" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="100" y1="165" x2="125" y2="280" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* Retro-Reflective Glowing Tracking Dots */}
          <circle cx="100" cy="50" r="5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="90" cy="50" r="3.5" fill="#ffffff" />
          <circle cx="110" cy="50" r="3.5" fill="#ffffff" />
          <circle cx="70" cy="90" r="4.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="130" cy="90" r="4.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx={50 + sway} cy="150" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx={150 - sway} cy="150" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="100" cy="165" r="5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="75" cy="225" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="125" cy="225" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="75" cy="280" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
          <circle cx="125" cy="280" r="4" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />
        </svg>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#34d399',
          }}
        >
          CAMERAS: 16 IR | CONFIDENCE: {trackingConfidence}% | 120 FPS
        </div>
      </div>
    </div>
  );
};
