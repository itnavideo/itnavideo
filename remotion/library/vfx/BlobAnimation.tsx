import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BlobAnimationProps {
  color?: string;
  size?: number;
  gradientColors?: [string, string];
  blobSeed?: number;
  speed?: number;
  blur?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const BlobAnimation: React.FC<BlobAnimationProps> = ({
  color = '#38bdf8',
  size = 360,
  gradientColors = ['#06b6d4', '#3b82f6'],
  blobSeed = 1,
  speed = 1,
  blur = 0,
  opacity = 0.85,
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 80 },
  });

  // Calculate 6 oscillating radii for organic wobble
  const t = (frame / fps) * speed * 2;
  const s = blobSeed * 1.337;

  const r1 = 45 + Math.sin(t + s) * 12;
  const r2 = 55 + Math.cos(t * 1.3 + s * 2) * 15;
  const r3 = 48 + Math.sin(t * 0.9 + s * 3) * 14;
  const r4 = 52 + Math.cos(t * 1.1 + s * 4) * 13;

  const r5 = 55 + Math.cos(t * 0.8 + s * 5) * 11;
  const r6 = 45 + Math.sin(t * 1.2 + s * 6) * 13;
  const r7 = 52 + Math.cos(t * 1.4 + s * 7) * 12;
  const r8 = 48 + Math.sin(t * 0.7 + s * 8) * 14;

  const borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;
  const rotate = interpolate(frame, [0, fps * 15], [0, 360]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
      }}
    >
      {/* Animated fluid blob container */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          borderRadius,
          background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
          boxShadow: `0 0 50px ${color}66, inset 0 0 30px rgba(255,255,255,0.25)`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          opacity,
          transform: `rotate(${rotate}deg)`,
          transformOrigin: 'center center',
        }}
      />

      {/* Optional nested content (icon, stat, text) */}
      {children && (
        <div className="relative z-10 flex items-center justify-center p-6 text-center">
          {children}
        </div>
      )}
    </div>
  );
};
