import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BackgroundProps {
  theme?:
    | 'studio-white'
    | 'warm-cream'
    | 'soft-slate'
    | 'midnight-obsidian'
    | 'charcoal-slate'
    | 'emerald-studio'
    | 'royal-navy'
    | 'sunset-amber'
    | 'velvet-wine'
    | 'purple-vignette'
    | 'pure-dark'
    | string;
  customBgUrl?: string;
  children?: React.ReactNode;
}

const BACKGROUND_GRADIENTS: Record<string, string> = {
  'studio-white': '#FFFFFF',
  'warm-cream': '#F5F3EF',
  'soft-slate': '#E2E8F0',
  'midnight-obsidian': 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)',
  'charcoal-slate': '#1E293B',
  'emerald-studio': '#064E3B',
  'royal-navy': '#0F172A',
  'sunset-amber': '#451A03',
  'velvet-wine': '#3B0764',
  'purple-vignette': 'radial-gradient(circle at center, #2e1065 0%, #0f0728 60%, #020617 100%)',
  'pure-dark': 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
};

export function Background({ theme = 'studio-white', customBgUrl, children }: BackgroundProps) {
  const frame = useCurrentFrame();
  const bgGradient = BACKGROUND_GRADIENTS[theme] || BACKGROUND_GRADIENTS['studio-white'];
  const isLight = theme === 'studio-white' || theme === 'warm-cream' || theme === 'soft-slate';

  // Continuous Ken Burns Subtle Zoom Motion (1.0 -> 1.05)
  const subtleScale = interpolate(frame, [0, 300], [1.0, 1.05], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: isLight ? '#FFFFFF' : '#020617',
        color: isLight ? '#0F172A' : '#FFFFFF',
      }}
    >
      {/* Background Image / Color Layer with Clean Neutral Lighting (No Extra Glare) */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          background: customBgUrl ? `url(${customBgUrl}) center/cover no-repeat` : bgGradient,
          transform: `scale(${subtleScale})`,
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
