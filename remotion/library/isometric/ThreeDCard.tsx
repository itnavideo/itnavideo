import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ThreeDCardProps {
  title?: string;
  description?: string;
  badge?: string;
  color?: string;
  width?: number;
  height?: number;
  tiltAngle?: number;
  delay?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * ThreeDCard — Spatial parallax card with specular shine.
 * Features dynamic tilt physics, floating detached Z-space badges,
 * and holographic edge reflections.
 */
export function ThreeDCard({
  title = 'Autonomous Video AI',
  description = 'Programmatic 3D scene orchestration with zero keyframing.',
  badge = 'PRO SPEED',
  color = '#10b981',
  width = 340,
  height = 200,
  tiltAngle = 16,
  delay = 0,
  children,
  style,
}: ThreeDCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.88, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Dynamic frame-based continuous gentle 3D tilt
  const tiltX = Math.sin(adjustedFrame * 0.05) * tiltAngle;
  const tiltY = Math.cos(adjustedFrame * 0.04) * (tiltAngle * 1.2);

  // Specular shine movement across card
  const glareX = ((adjustedFrame * 2) % 300) - 50;

  return (
    <div
      style={{
        position: 'relative',
        perspective: 1000,
        display: 'inline-block',
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {/* 3D Card Surface */}
      <div
        style={{
          position: 'relative',
          width,
          height,
          borderRadius: 20,
          backgroundColor: '#0f172a',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.4)',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'none',
        }}
      >
        {/* Specular Glare Reflection Line */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            bottom: -50,
            left: `${glareX}%`,
            width: 80,
            background:
              'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.12), transparent)',
            transform: 'rotate(25deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Top detached badge in Z-depth */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: 'translateZ(25px)',
          }}
        >
          {badge && (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 9999,
                backgroundColor: `${color}25`,
                border: `1px solid ${color}80`,
                color,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              {badge}
            </span>
          )}

          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>

        {/* Center / Custom Content */}
        {children ? (
          <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transform: 'translateZ(30px)',
            }}
          >
            <h4
              style={{
                margin: 0,
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h4>
            <p
              style={{
                margin: 0,
                color: '#94a3b8',
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          </div>
        )}

        {/* Bottom Ambient Glow Line */}
        <div
          style={{
            height: 2,
            width: '100%',
            background: `linear-gradient(to right, ${color}, transparent)`,
            transform: 'translateZ(15px)',
          }}
        />
      </div>
    </div>
  );
}
