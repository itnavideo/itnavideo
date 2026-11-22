import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraPedestalProps {
  title?: string;
  direction?: 'up' | 'down';
  heightRange?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraPedestal: React.FC<CameraPedestalProps> = ({
  title = 'Vertical Camera Pedestal (Elevator Boom)',
  direction = 'up',
  heightRange = 90,
  primaryColor = '#8B5CF6',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const boomY = interpolate(frame % 100, [0, 50, 100], [-heightRange / 2, heightRange / 2, -heightRange / 2]);

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
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(139, 92, 246, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#a78bfa',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⇅ Y-AXIS ELEVATION</span>
          <span>•</span>
          <span>PEDESTAL {direction.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Vertical Column Pedestal Rig */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0d12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Central Hydraulic Telescopic Column */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: 32,
            height: 200,
            background: 'linear-gradient(to right, #27272a 0%, #3f3f46 50%, #18181b 100%)',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />

        {/* Moving Camera Head on Column */}
        <div
          style={{
            position: 'absolute',
            transform: `translateY(${boomY}px)`,
            width: 70,
            height: 44,
            borderRadius: 8,
            background: primaryColor,
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${primaryColor}`,
            zIndex: 5,
          }}
        >
          <span style={{ fontSize: 18 }}>📹</span>
        </div>

        {/* Altitude Scale Markers on Right */}
        <div
          style={{
            position: 'absolute',
            right: 24,
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: 10,
            color: '#a1a1aa',
          }}
        >
          <span>+200cm MAX</span>
          <span>+150cm</span>
          <span style={{ color: primaryColor, fontWeight: 700 }}>● {Math.round(150 - boomY)}cm</span>
          <span>+100cm</span>
          <span>+50cm MIN</span>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#c4b5fd',
          }}
        >
          PEDESTAL HEIGHT: {Math.round(150 - boomY)}cm
        </div>
      </div>
    </div>
  );
};
