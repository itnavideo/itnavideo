import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraRollProps {
  title?: string;
  maxRollAngle?: number;
  rollSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraRoll: React.FC<CameraRollProps> = ({
  title = 'Z-Axis Camera Roll (Dutch Tilt)',
  maxRollAngle = 18,
  rollSpeed = 1,
  primaryColor = '#06B6D4',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const rollAngle = interpolate(
    Math.sin(frame * 0.06 * rollSpeed),
    [-1, 1],
    [-maxRollAngle, maxRollAngle]
  );

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
            background: 'rgba(6, 182, 212, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⟲ HORIZON TILT</span>
          <span>•</span>
          <span>DUTCH ANGLE ROLL</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Dutch Tilt Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0e1117',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Tilting Horizon Scene Card */}
        <div
          style={{
            width: '130%',
            height: '130%',
            position: 'absolute',
            background: 'linear-gradient(to top, #1e1b4b 0%, #312e81 50%, #0284c7 100%)',
            transform: `rotate(${rollAngle}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Virtual Horizon Line */}
          <div
            style={{
              width: '100%',
              height: 2,
              background: '#ffffff',
              boxShadow: '0 0 10px #ffffff',
            }}
          />
          <div
            style={{
              marginTop: 14,
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: 2,
            }}
          >
            ARTIFICIAL HORIZON
          </div>
        </div>

        {/* Fixed Stationary Camera Level Indicator HUD */}
        <div
          style={{
            zIndex: 10,
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: 12, height: 2, background: '#ef4444' }} />
        </div>

        {/* Degree HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#67e8f9',
          }}
        >
          BANK ROLL: {rollAngle.toFixed(1)}°
        </div>
      </div>
    </div>
  );
};
