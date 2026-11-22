import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ThreeDObjectProps {
  size?: number;
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  wireframe?: boolean;
  glow?: boolean;
  rotate?: boolean;
  rotateX?: number;
  rotateY?: number;
  rotateSpeed?: number;
  topLabel?: string;
  frontLabel?: string;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * ThreeDObject (Cube3D) — Hardware-accelerated 3D isometric cube/prism.
 * Employs CSS preserve-3d transforms with shaded top, front, and side faces,
 * optional wireframe borders, and frame-deterministic rotation.
 */
export function ThreeDObject({
  size = 140,
  width,
  height,
  depth,
  color = '#10b981',
  wireframe = false,
  glow = true,
  rotate = true,
  rotateX = 25,
  rotateY = 45,
  rotateSpeed = 1,
  topLabel,
  frontLabel,
  delay = 0,
  style,
}: ThreeDObjectProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w = width || size;
  const h = height || size;
  const d = depth || size;

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Frame rotation
  const curRotateY = rotate ? (rotateY + adjustedFrame * 0.8 * rotateSpeed) % 360 : rotateY;
  const curRotateX = rotateX;

  // Face colors with isometric lighting model
  const topColor = color;
  const frontColor = '#0f172a';
  const rightColor = '#020617';

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        perspective: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {/* Ground Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: -h * 0.35,
          width: w * 1.2,
          height: d * 0.6,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          filter: 'blur(16px)',
          transform: 'rotateX(60deg)',
        }}
      />

      {/* 3D Cube Container */}
      <div
        style={{
          position: 'relative',
          width: w,
          height: h,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${curRotateX}deg) rotateY(${curRotateY}deg)`,
          transition: 'none',
        }}
      >
        {/* Front Face */}
        <div
          style={{
            position: 'absolute',
            width: w,
            height: h,
            transform: `translateZ(${d / 2}px)`,
            backgroundColor: wireframe ? 'rgba(16, 185, 129, 0.1)' : frontColor,
            border: `2px solid ${color}`,
            boxShadow: glow ? `inset 0 0 20px ${color}40` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {frontLabel}
        </div>

        {/* Back Face */}
        <div
          style={{
            position: 'absolute',
            width: w,
            height: h,
            transform: `rotateY(180deg) translateZ(${d / 2}px)`,
            backgroundColor: wireframe ? 'rgba(16, 185, 129, 0.05)' : '#020617',
            border: `1.5px solid ${color}80`,
          }}
        />

        {/* Right Face */}
        <div
          style={{
            position: 'absolute',
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(90deg) translateZ(${w / 2}px)`,
            backgroundColor: wireframe ? 'rgba(16, 185, 129, 0.15)' : rightColor,
            border: `2px solid ${color}`,
            boxShadow: glow ? `inset 0 0 20px ${color}30` : 'none',
          }}
        />

        {/* Left Face */}
        <div
          style={{
            position: 'absolute',
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
            backgroundColor: wireframe ? 'rgba(16, 185, 129, 0.05)' : '#020617',
            border: `1.5px solid ${color}80`,
          }}
        />

        {/* Top Face */}
        <div
          style={{
            position: 'absolute',
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(90deg) translateZ(${h / 2}px)`,
            backgroundColor: wireframe ? 'rgba(16, 185, 129, 0.25)' : topColor,
            border: `2px solid ${color}`,
            boxShadow: glow ? `0 0 30px ${color}60` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#09090b',
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {topLabel}
        </div>

        {/* Bottom Face */}
        <div
          style={{
            position: 'absolute',
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
            backgroundColor: '#020617',
            border: `1px solid ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
