import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraFollowProps {
  title?: string;
  leadRoom?: number;
  damping?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraFollow: React.FC<CameraFollowProps> = ({
  title = 'Target-Tracking Camera Follow',
  leadRoom = 30,
  damping = 12,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Moving target coordinates
  const targetX = Math.sin(frame * 0.05) * 80;
  const targetY = Math.cos(frame * 0.06) * 30;

  // Damped camera follow with slight lag
  const camFollowX = interpolate(frame % 120, [0, 60, 120], [-60, 60, -60]);

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
          <span>🎯 AUTONOMOUS TRACKING</span>
          <span>•</span>
          <span>SUBJECT LOCK</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Tracking Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#090a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Moving Subject Target */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(${targetX}px, ${targetY}px)`,
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
          }}
        >
          <span style={{ fontSize: 16 }}>🏃</span>
        </div>

        {/* Tracking Reticle Bounding Box following target */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(${targetX}px, ${targetY}px)`,
            width: 80,
            height: 80,
            border: `2px solid ${primaryColor}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -18,
              left: 0,
              fontSize: 10,
              fontFamily: 'monospace',
              color: primaryColor,
              fontWeight: 700,
            }}
          >
            LOCK: 98%
          </div>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#34d399',
          }}
        >
          TARGET POS: ({Math.round(targetX)}, {Math.round(targetY)}) | LEAD ROOM: {leadRoom}px
        </div>
      </div>
    </div>
  );
};
