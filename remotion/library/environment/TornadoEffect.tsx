import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TornadoEffectProps {
  title?: string;
  vortexScale?: number;
  rotationSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const TornadoEffect: React.FC<TornadoEffectProps> = ({
  title = 'Mesocyclone Tornado Funnel Vortex',
  vortexScale = 1,
  rotationSpeed = 1.4,
  primaryColor = '#64748B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sway = Math.sin(frame * 0.08) * 18;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#06070a',
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
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(100, 116, 139, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#cbd5e1',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌪 SEVERE VORTEX</span>
          <span>•</span>
          <span>EF-4 MESOCYCLONE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Tornado Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 10%, #1e293b 0%, #030712 90%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Swirling Funnel Cloud (Concentric rotating ellipses narrowing to ground) */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateX(${sway}px)`,
          }}
        >
          {Array.from({ length: 8 }).map((_, idx) => {
            const widthPct = 200 - idx * 22;
            const rot = (frame * (idx + 2) * 3) % 360;

            return (
              <div
                key={idx}
                style={{
                  width: widthPct,
                  height: 18,
                  borderRadius: '50%',
                  border: '2px dashed rgba(203, 213, 225, 0.6)',
                  background: 'rgba(71, 85, 105, 0.25)',
                  transform: `rotate(${rot}deg)`,
                  filter: 'blur(2px)',
                }}
              />
            );
          })}
        </div>

        {/* Ground Touchdown Debris Cloud */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: 90,
            height: 25,
            borderRadius: '50%',
            background: 'rgba(148, 163, 184, 0.5)',
            filter: 'blur(8px)',
            transform: `translateX(${sway * 1.4}px)`,
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#cbd5e1',
          }}
        >
          ROTATION: 280km/h | FUJITA: EF-4 TOUCHDOWN
        </div>
      </div>
    </div>
  );
};
