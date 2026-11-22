import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraCraneProps {
  title?: string;
  jibLength?: number;
  sweepAngle?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraCrane: React.FC<CameraCraneProps> = ({
  title = 'Jib Crane Aerial Sweeper',
  jibLength = 140,
  sweepAngle = 35,
  primaryColor = '#F43F5E',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const craneRot = interpolate(frame % 100, [0, 50, 100], [-sweepAngle, sweepAngle, -sweepAngle]);

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
            background: 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fb7185',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⤹ SWEEPING JIB ARM</span>
          <span>•</span>
          <span>CRANE BOOM</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Crane Arc Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0d0d14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Crane Pivot Fulcrum on Bottom Left */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '25%',
            width: 24,
            height: 40,
            background: '#3f3f46',
            borderRadius: 4,
          }}
        />

        {/* Rotating Jib Beam */}
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: '25%',
            width: jibLength,
            height: 6,
            background: `linear-gradient(to right, #71717a 0%, ${primaryColor} 100%)`,
            transformOrigin: '0% 50%',
            transform: `rotate(${craneRot - 25}deg)`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Camera Head on Beam Tip */}
          <div
            style={{
              width: 32,
              height: 24,
              borderRadius: 6,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${primaryColor}`,
              transform: `rotate(${-craneRot + 25}deg)`, // Counter-stabilized head
            }}
          >
            <span style={{ fontSize: 12 }}>🎥</span>
          </div>
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
            color: '#fda4af',
          }}
        >
          JIB ELEVATION: {(craneRot + 45).toFixed(1)}° | RADIUS: {jibLength / 10}m
        </div>
      </div>
    </div>
  );
};
