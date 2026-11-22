import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DamageVignetteProps {
  intensity?: number;
  pulseSpeed?: number;
  color?: string;
  className?: string;
}

export const DamageVignette: React.FC<DamageVignetteProps> = ({
  intensity = 0.7,
  pulseSpeed = 0.15,
  color = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 180 } });
  const pulse = Math.sin(frame * pulseSpeed) * 0.15 + (intensity - 0.15);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${color} 100%)`,
        opacity: Math.max(0, pulse * enter),
        mixBlendMode: 'screen',
      }}
    />
  );
};
