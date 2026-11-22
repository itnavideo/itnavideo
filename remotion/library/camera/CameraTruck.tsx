import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraTruckProps {
  title?: string;
  direction?: 'left' | 'right';
  truckDistance?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraTruck: React.FC<CameraTruckProps> = ({
  title = 'Lateral Camera Truck (Tracking Shot)',
  direction = 'right',
  truckDistance = 140,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const truckX = interpolate(frame % 100, [0, 50, 100], [-truckDistance / 2, truckDistance / 2, -truckDistance / 2]);

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
            background: 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⇄ LATERAL X-AXIS</span>
          <span>•</span>
          <span>TRUCK {direction.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Trucking Studio Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#090a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Parallax Background Pillars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'space-around',
            transform: `translateX(${-truckX * 0.4}px)`,
            opacity: 0.3,
          }}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} style={{ width: 16, height: '100%', background: '#6366f1' }} />
          ))}
        </div>

        {/* Midground Focus Subject */}
        <div
          style={{
            zIndex: 4,
            width: 120,
            height: 120,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
            transform: `translateX(${-truckX * 0.8}px)`,
          }}
        >
          SUBJECT
        </div>

        {/* Lower Track Slider with Moving Camera */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            width: '80%',
            height: 6,
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: `translateX(calc(-50% + ${truckX}px))`,
              width: 36,
              height: 28,
              borderRadius: 6,
              background: primaryColor,
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${primaryColor}`,
            }}
          >
            <span style={{ fontSize: 14 }}>🎥</span>
          </div>
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
            color: '#34d399',
          }}
        >
          LATERAL OFFSET: {truckX.toFixed(1)}cm | PARALLAX: ACTIVE
        </div>
      </div>
    </div>
  );
};
