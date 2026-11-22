import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LiquidTransitionProps {
  durationInFrames?: number;
  color?: string;
  secondaryColor?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  waves?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LiquidTransition: React.FC<LiquidTransitionProps> = ({
  durationInFrames = 30,
  color = '#4f46e5',
  secondaryColor = '#06b6d4',
  direction = 'up',
  waves = 3,
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, frame / durationInFrames));
  const easeProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 70 },
  });

  // Calculate sinusoidal wave crest points
  const points = 20;
  const wavePoints: string[] = [];

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 100;
    // Harmonic wave height modulation
    const wave =
      Math.sin((x / 100) * Math.PI * waves * 2 + frame * 0.2) * 6 * (1 - easeProgress * 0.8);
    const y = 100 - easeProgress * 110 + wave;
    wavePoints.push(`${x}% ${y}%`);
  }

  // Polygon path covering bottom to top wave
  const clipPath = `polygon(0% 100%, ${wavePoints.join(', ')}, 100% 100%)`;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background Content */}
      <div className="relative w-full h-full">{children}</div>

      {/* Liquid Wave Curtain */}
      {easeProgress < 1 && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            clipPath,
            background: `linear-gradient(180deg, ${secondaryColor} 0%, ${color} 100%)`,
            boxShadow: `0 -10px 40px ${color}80`,
          }}
        />
      )}
    </div>
  );
};
