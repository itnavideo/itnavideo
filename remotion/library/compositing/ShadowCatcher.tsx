import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ShadowCatcherProps {
  title?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  lightAngle?: number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ShadowCatcher: React.FC<ShadowCatcherProps> = ({
  title = 'Planar Shadow Catcher Pass',
  shadowBlur = 18,
  shadowOpacity = 0.65,
  lightAngle = 45,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const bobbing = Math.sin(frame * 0.08) * 8;

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
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e4e4e7',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>▱ CONTACT OCCLUSION</span>
          <span>•</span>
          <span>SHADOW CATCHER</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* 3D Floor Perspective Studio */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#121216',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Floating 3D Cube / Subject */}
        <div
          style={{
            zIndex: 5,
            width: 100,
            height: 100,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
            transform: `translateY(${-25 + bobbing}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
          }}
        >
          OBJECT
        </div>

        {/* Dynamic Ground Shadow Catcher Projection */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            width: 130 + bobbing * 2,
            height: 35,
            borderRadius: '50%',
            background: '#000000',
            opacity: shadowOpacity - bobbing * 0.015,
            filter: `blur(${shadowBlur + Math.abs(bobbing) * 0.5}px)`,
            transform: 'scaleY(0.4)',
          }}
        />

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
            color: '#a1a1aa',
          }}
        >
          PLANE: INVISIBLE | ALPHA ONLY
        </div>
      </div>
    </div>
  );
};
