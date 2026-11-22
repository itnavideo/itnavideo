import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraOrbitProps {
  title?: string;
  orbitRadius?: number;
  rotationSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraOrbit: React.FC<CameraOrbitProps> = ({
  title = '360° Camera Orbit Arc',
  orbitRadius = 120,
  rotationSpeed = 1,
  primaryColor = '#EC4899',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const angle = (frame * rotationSpeed * 2) % 360;
  const rad = (angle * Math.PI) / 180;
  const camX = Math.cos(rad) * orbitRadius;
  const camY = Math.sin(rad) * (orbitRadius * 0.45); // Elliptical perspective orbit

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
            background: 'rgba(236, 72, 153, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>↻ REVOLUTION PATH</span>
          <span>•</span>
          <span>ORBIT TRAJECTORY</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Orbit Arena Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0d14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Orbit Path Ellipse Ring */}
        <div
          style={{
            position: 'absolute',
            width: orbitRadius * 2,
            height: orbitRadius * 0.9,
            borderRadius: '50%',
            border: `2px dashed ${primaryColor}60`,
          }}
        />

        {/* Central Subject */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
            zIndex: 4,
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          TARGET
        </div>

        {/* Orbiting Camera Puck */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(${camX}px, ${camY}px)`,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: primaryColor,
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${primaryColor}`,
            zIndex: camY > 0 ? 6 : 2, // Layer depth sorting
          }}
        >
          <span style={{ fontSize: 12 }}>🎥</span>
        </div>

        {/* Angle HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#f472b6',
          }}
        >
          HEADING: {Math.round(angle)}° | RADIUS: {orbitRadius}m
        </div>
      </div>
    </div>
  );
};
