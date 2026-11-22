import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BackgroundReplacementProps {
  title?: string;
  sourceType?: 'green-screen' | 'ai-segmented';
  environmentName?: string;
  parallaxSpeed?: number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const BackgroundReplacement: React.FC<BackgroundReplacementProps> = ({
  title = 'Virtual Background Replacement',
  sourceType = 'ai-segmented',
  environmentName = 'Cyberpunk Neon Metropolis',
  parallaxSpeed = 1,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const panBg = interpolate(frame % 150, [0, 150], [-20, 20]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(14, 165, 233, 0.15)',
            border: '1px solid rgba(14, 165, 233, 0.4)',
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◈ VIRTUAL STUDIO SET</span>
          <span>•</span>
          <span>BACKPLATE SWAP</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Composited Set Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer 1: Virtual Set Background with subtle Parallax */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            background: 'linear-gradient(135deg, #0f172a 0%, #312e81 40%, #701a75 100%)',
            transform: `translateX(${panBg}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Cyberpunk grid skyline lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '100% 30px',
            }}
          />
        </div>

        {/* Layer 2: Extracted Subject Standing in Front */}
        <div
          style={{
            zIndex: 5,
            width: isVertical ? 140 : 180,
            height: isVertical ? 220 : 250,
            borderRadius: 16,
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32 }}>🎙️</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#f4f4f5', marginTop: 8 }}>
            CUTOUT HOST
          </div>
          <div style={{ fontSize: 10, color: '#a1a1aa' }}>Alpha Injected</div>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            zIndex: 10,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#38bdf8',
          }}
        >
          SET: {environmentName}
        </div>
      </div>
    </div>
  );
};
