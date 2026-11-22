import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NeonGlowProps {
  children?: React.ReactNode;
  color?: string; // Main neon glow hex
  secondaryColor?: string; // Core accent
  flicker?: boolean;
  intensity?: number; // 0.5 to 2
  pulseSpeed?: number;
  borderWidth?: number;
  rounded?: string;
  className?: string;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  children,
  color = '#00f0ff',
  secondaryColor = '#ffffff',
  flicker = true,
  intensity = 1.0,
  pulseSpeed = 1.2,
  borderWidth = 2,
  rounded = 'rounded-2xl',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 },
  });

  // Cyberpunk tube flicker calculation
  let flickerFactor = 1.0;
  if (flicker) {
    const hash = Math.sin(frame * 24.3 + 45.1) * 98765.4;
    const rand = hash - Math.floor(hash);
    // 8% chance of brief voltage drop
    if (rand < 0.08) {
      flickerFactor = 0.4 + rand * 0.4;
    }
  }

  // Smooth breathing pulse
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2 * pulseSpeed) * 0.15;
  const currentIntensity = intensity * flickerFactor * pulse;

  const glowShadow = [
    `0 0 ${4 * currentIntensity}px ${secondaryColor}`,
    `0 0 ${12 * currentIntensity}px ${color}`,
    `0 0 ${28 * currentIntensity}px ${color}`,
    `0 0 ${60 * currentIntensity}px ${color}80`,
    `inset 0 0 ${8 * currentIntensity}px ${color}40`,
  ].join(', ');

  return (
    <div
      className={`relative inline-block ${rounded} ${className}`}
      style={{
        border: `${borderWidth}px solid ${color}`,
        boxShadow: glowShadow,
        transform: `scale(${entry})`,
        transition: 'box-shadow 0.05s ease-out',
      }}
    >
      {/* Inner ambient tube highlight */}
      <div
        className={`absolute inset-0 ${rounded} pointer-events-none opacity-30`}
        style={{
          background: `radial-gradient(ellipse at center, ${color}33 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
