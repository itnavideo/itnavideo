import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DepthOfFieldProps {
  title?: string;
  apertureValue?: number; // e.g. 1.4 for f/1.4
  bokehCount?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DepthOfField: React.FC<DepthOfFieldProps> = ({
  title = 'Shallow Depth of Field (Bokeh Simulator)',
  apertureValue = 1.4,
  bokehCount = 8,
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

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
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>✺ OPTICAL BOKEH</span>
          <span>•</span>
          <span>APERTURE: f/{apertureValue}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Bokeh Viewport Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#08080c',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Defocused Background Hexagonal Bokeh Orbs */}
        {Array.from({ length: bokehCount }).map((_, idx) => {
          const posX = 15 + (idx * 23) % 75;
          const posY = 20 + (idx * 31) % 65;
          const size = 45 + (idx * 17) % 55;
          const drift = Math.sin((frame + idx * 20) * 0.04) * 12;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${posX}%`,
                top: `${posY}%`,
                transform: `translate(-50%, calc(-50% + ${drift}px))`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: idx % 2 === 0 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(236, 72, 153, 0.35)',
                border: '1px solid rgba(255,255,255,0.4)',
                filter: 'blur(4px)',
                boxShadow: '0 0 20px rgba(245,158,11,0.4)',
              }}
            />
          );
        })}

        {/* Crisp In-Focus Hero Foreground Object */}
        <div
          style={{
            zIndex: 6,
            width: isVertical ? 150 : 190,
            height: isVertical ? 150 : 190,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 16,
          }}
        >
          <div style={{ fontSize: 32 }}>💎</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', marginTop: 8 }}>
            TACK SHARP
          </div>
          <div style={{ fontSize: 10, color: '#34d399', marginTop: 2 }}>In-Focus Subject</div>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#fbbf24',
          }}
        >
          BLUR RADIUS: 18px | CIRCLE OF CONFUSION: 0.03mm
        </div>
      </div>
    </div>
  );
};
