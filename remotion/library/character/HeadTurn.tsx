import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HeadTurnProps {
  title?: string;
  maxTurnAngle?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const HeadTurn: React.FC<HeadTurnProps> = ({
  title = '2.5D Rotational Head Turn',
  maxTurnAngle = 35,
  primaryColor = '#6366F1',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // 2.5D head turn sweep between left (-35°), center (0°), and right (+35°)
  const turnDeg = interpolate(Math.sin(frame * 0.06), [-1, 1], [-maxTurnAngle, maxTurnAngle]);
  const featureShift = (turnDeg / maxTurnAngle) * 22;

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
            background: 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#a5b4fc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🔄 2.5D ROTATION</span>
          <span>•</span>
          <span>CRANIAL YAW</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Head Turn Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Head Silhouette Base */}
        <div
          style={{
            width: 170,
            height: 200,
            borderRadius: '50% 50% 45% 45%',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          }}
        >
          {/* Eyes with Parallax Shift */}
          <div
            style={{
              display: 'flex',
              gap: 36,
              transform: `translateX(${featureShift}px)`,
              transition: 'transform 0.05s ease',
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#09090b' }} />
            </div>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#09090b' }} />
            </div>
          </div>

          {/* Nose Line with Parallax Shift */}
          <div
            style={{
              width: 3,
              height: 18,
              background: primaryColor,
              borderRadius: 2,
              marginTop: 12,
              transform: `translateX(${featureShift * 1.3}px)`,
            }}
          />

          {/* Mouth with Parallax Shift */}
          <div
            style={{
              width: 35,
              height: 6,
              background: '#f43f5e',
              borderRadius: 3,
              marginTop: 14,
              transform: `translateX(${featureShift * 1.1}px)`,
            }}
          />
        </div>

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
            color: '#a5b4fc',
          }}
        >
          YAW: {turnDeg.toFixed(1)}° | SHIFT: {featureShift.toFixed(1)}px
        </div>
      </div>
    </div>
  );
};
