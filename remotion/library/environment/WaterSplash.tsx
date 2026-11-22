import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WaterSplashProps {
  title?: string;
  dropletCount?: number;
  burstScale?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const WaterSplash: React.FC<WaterSplashProps> = ({
  title = 'High-Speed Water Splash & Crown',
  dropletCount = 18,
  burstScale = 1.2,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Splash burst cycle
  const cycle = frame % 60;
  const burstProgress = cycle / 60;
  const splashHeight = interpolate(burstProgress, [0, 0.35, 1], [0, 110, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const crownWidth = interpolate(burstProgress, [0, 0.4, 1], [10, 140, 180]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#060a12',
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
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>💧 KINETIC IMPACT</span>
          <span>•</span>
          <span>SPLASH PHYSICS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Splash Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 60%, #0369a1 0%, #020617 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Central Crown Splash */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            width: crownWidth,
            height: splashHeight,
            border: `2px solid #ffffff`,
            borderRadius: '50% 50% 0 0',
            background: 'linear-gradient(to top, rgba(56, 189, 248, 0.5) 0%, rgba(255,255,255,0.8) 100%)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
          }}
        />

        {/* Airborne Droplets Spattering in Parabolic Arcs */}
        {Array.from({ length: dropletCount }).map((_, idx) => {
          const angle = (idx / dropletCount) * Math.PI;
          const dist = interpolate(burstProgress, [0, 0.5, 1], [0, 90 + (idx % 4) * 20, 130]);
          const dropX = Math.cos(angle) * dist;
          const dropY = Math.sin(angle) * dist * 0.8 - (burstProgress > 0.4 ? (burstProgress - 0.4) * 120 : 0);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                bottom: 80 + dropY,
                left: `calc(50% + ${dropX}px)`,
                width: 4 + (idx % 3),
                height: 4 + (idx % 3),
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px #38bdf8',
                opacity: 1 - burstProgress * 0.7,
              }}
            />
          );
        })}

        {/* Water Pool Base Level */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to top, #0284c7 0%, rgba(2, 132, 199, 0.4) 100%)',
            borderTop: '2px solid rgba(255,255,255,0.6)',
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
            color: '#7dd3fc',
          }}
        >
          IMPACT ENERGY: 45J | SPLASH PEAK: {Math.round(splashHeight)}mm
        </div>
      </div>
    </div>
  );
};
