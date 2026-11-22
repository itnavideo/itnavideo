import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface LightLeakProps {
  color?: string; // Primary leak tone (amber / warm orange / violet)
  secondaryColor?: string;
  intensity?: number; // 0.3 to 1.0
  speed?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'roaming';
  className?: string;
}

export const LightLeak: React.FC<LightLeakProps> = ({
  color = '#f97316',
  secondaryColor = '#ec4899',
  intensity = 0.65,
  speed = 0.8,
  position = 'top-right',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps) * speed;

  // Organic drifting coordinates
  let posX = 85;
  let posY = 15;

  if (position === 'top-left') {
    posX = 15 + Math.sin(t * 0.7) * 10;
    posY = 15 + Math.cos(t * 0.9) * 10;
  } else if (position === 'bottom-left') {
    posX = 15 + Math.sin(t * 0.8) * 10;
    posY = 85 + Math.cos(t * 0.6) * 10;
  } else if (position === 'bottom-right') {
    posX = 85 + Math.sin(t * 0.6) * 10;
    posY = 85 + Math.cos(t * 0.8) * 10;
  } else if (position === 'roaming') {
    posX = 50 + Math.sin(t * 0.5) * 35;
    posY = 50 + Math.cos(t * 0.6) * 35;
  } else {
    // top-right
    posX = 85 + Math.sin(t * 0.8) * 10;
    posY = 15 + Math.cos(t * 0.7) * 10;
  }

  // Pulsing scale & opacity
  const pulse = 1 + Math.sin(t * 1.4) * 0.15;
  const flareOpacity = (intensity * 0.7 + Math.sin(t * 1.1) * 0.15 * intensity);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen z-30 ${className}`}
      style={{ opacity: flareOpacity }}
    >
      {/* Primary Warm Core */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${posX}%`,
          top: `${posY}%`,
          width: '550px',
          height: '550px',
          background: `radial-gradient(circle, ${color} 0%, ${secondaryColor}66 40%, transparent 70%)`,
          filter: 'blur(70px)',
          transform: `translate(-50%, -50%) scale(${pulse})`,
        }}
      />

      {/* Secondary Soft Ambient Spill */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${posX + 10}%`,
          top: `${posY - 5}%`,
          width: '380px',
          height: '380px',
          background: `radial-gradient(circle, #ffffff 0%, ${color}aa 30%, transparent 65%)`,
          filter: 'blur(50px)',
          transform: `translate(-50%, -50%) scale(${pulse * 0.9})`,
        }}
      />
    </div>
  );
};
