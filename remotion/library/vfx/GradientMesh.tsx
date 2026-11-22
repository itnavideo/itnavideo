import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface GradientMeshProps {
  colors?: [string, string, string, string];
  speed?: number;
  blur?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({
  colors = ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b'],
  speed = 0.8,
  blur = 60,
  opacity = 0.85,
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps) * speed;

  // Harmonically drifting control node coordinates
  const p1 = {
    x: 25 + Math.sin(t * 0.8) * 20,
    y: 25 + Math.cos(t * 0.9) * 20,
  };
  const p2 = {
    x: 75 + Math.cos(t * 0.7) * 20,
    y: 25 + Math.sin(t * 0.8) * 20,
  };
  const p3 = {
    x: 30 + Math.sin(t * 1.1) * 22,
    y: 75 + Math.cos(t * 0.6) * 18,
  };
  const p4 = {
    x: 70 + Math.cos(t * 0.9) * 20,
    y: 70 + Math.sin(t * 1.0) * 22,
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background drifting fluid orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transform: 'scale(1.2)', // prevent edge clipping
        }}
      >
        <div
          className="absolute w-[50%] h-[50%] rounded-full"
          style={{
            left: `${p1.x}%`,
            top: `${p1.y}%`,
            background: colors[0],
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-[50%] h-[50%] rounded-full"
          style={{
            left: `${p2.x}%`,
            top: `${p2.y}%`,
            background: colors[1],
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-[50%] h-[50%] rounded-full"
          style={{
            left: `${p3.x}%`,
            top: `${p3.y}%`,
            background: colors[2],
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-[50%] h-[50%] rounded-full"
          style={{
            left: `${p4.x}%`,
            top: `${p4.y}%`,
            background: colors[3],
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Foreground Content */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};
