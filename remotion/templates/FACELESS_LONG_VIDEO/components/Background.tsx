import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BackgroundProps {
  theme?: 'purple-vignette' | 'midnight-obsidian' | 'emerald-studio' | 'royal-indigo' | 'pure-dark' | string;
  customBgUrl?: string;
  children?: React.ReactNode;
}

const BACKGROUND_GRADIENTS: Record<string, string> = {
  'purple-vignette': 'radial-gradient(circle at center, #2e1065 0%, #0f0728 60%, #020617 100%)',
  'midnight-obsidian': 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)',
  'emerald-studio': 'radial-gradient(circle at center, #064e3b 0%, #022c22 60%, #020617 100%)',
  'royal-indigo': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #020617 100%)',
  'pure-dark': 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
};

export function Background({ theme = 'purple-vignette', customBgUrl, children }: BackgroundProps) {
  const frame = useCurrentFrame();
  const bgGradient = BACKGROUND_GRADIENTS[theme] || BACKGROUND_GRADIENTS['purple-vignette'];

  // Continuous Ken Burns Subtle Zoom Motion (1.0 -> 1.08)
  const subtleScale = interpolate(frame, [0, 300], [1.0, 1.08], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#020617',
        color: '#FFFFFF',
      }}
    >
      {/* Background Image / Gradient Layer with Ken Burns Motion */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          background: customBgUrl ? `url(${customBgUrl}) center/cover no-repeat` : bgGradient,
          transform: `scale(${subtleScale})`,
          filter: customBgUrl ? 'brightness(0.72) contrast(1.05)' : 'none',
        }}
      />

      {/* Vox-Style High Tech Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Grid Coordinates Watermark (Johnny Harris / Vox Style) */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          right: '32px',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 700,
          color: 'rgba(56, 189, 248, 0.4)',
          letterSpacing: '0.2em',
          pointerEvents: 'none',
        }}
      >
        FPS: 60 • 1080x1920 • GRID: ACTIVE
      </div>

      {children}
    </div>
  );
}
