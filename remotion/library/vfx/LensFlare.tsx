import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface LensFlareProps {
  x?: number; // 0% - 100% position
  y?: number; // 0% - 100% position
  color?: string; // Anamorphic streak color
  secondaryColor?: string;
  size?: number; // Center burst diameter
  streakLength?: number; // Width of horizontal streak
  intensity?: number;
  drift?: boolean;
  className?: string;
}

export const LensFlare: React.FC<LensFlareProps> = ({
  x = 50,
  y = 35,
  color = '#00f0ff',
  secondaryColor = '#ffffff',
  size = 120,
  streakLength = 800,
  intensity = 0.85,
  drift = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps);
  const driftX = drift ? Math.sin(t * 0.9) * 4 : 0;
  const driftY = drift ? Math.cos(t * 1.1) * 3 : 0;
  const pulse = 1 + Math.sin(t * 2.5) * 0.1;

  const currentX = x + driftX;
  const currentY = y + driftY;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen z-40 ${className}`}
      style={{ opacity: intensity }}
    >
      {/* Horizontal Anamorphic Streak */}
      <div
        className="absolute"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${streakLength}px`,
          height: '4px',
          background: `linear-gradient(90deg, transparent 0%, ${color} 30%, ${secondaryColor} 50%, ${color} 70%, transparent 100%)`,
          boxShadow: `0 0 16px ${color}, 0 0 32px ${color}`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* Central Starburst Core */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${secondaryColor} 0%, ${color} 35%, transparent 70%)`,
          boxShadow: `0 0 40px ${color}`,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          filter: 'blur(4px)',
        }}
      />

      {/* Optical Ring Halo */}
      <div
        className="absolute rounded-full border border-sky-400/30"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${size * 2.2}px`,
          height: `${size * 2.2}px`,
          boxShadow: `0 0 30px ${color}40`,
          transform: `translate(-50%, -50%) scale(${pulse * 1.05})`,
          filter: 'blur(2px)',
        }}
      />

      {/* Opposite Iris Ghost Reflection */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${100 - currentX}%`,
          top: `${100 - currentY}%`,
          width: `${size * 0.6}px`,
          height: `${size * 0.6}px`,
          background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
};
