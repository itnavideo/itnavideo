import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DepthCompositorProps {
  title?: string;
  focusDistance?: number;
  bokehRadius?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DepthCompositor: React.FC<DepthCompositorProps> = ({
  title = 'Z-Depth Map & Bokeh Rack Focus',
  focusDistance = 45,
  bokehRadius = 8,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const focalShift = interpolate(frame % 100, [0, 50, 100], [20, 80, 20]);

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
          <span>◎ Z-BUFFER MAP</span>
          <span>•</span>
          <span>DEPTH OF FIELD</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Depth Map Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#09090c',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Near Foreground Sphere (White = Closest) */}
        <div
          style={{
            position: 'absolute',
            left: '20%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 0%, #71717a 80%)',
            filter: `blur(${Math.abs(focalShift - 20) * 0.15}px)`,
            boxShadow: '0 0 20px rgba(255,255,255,0.4)',
          }}
        />

        {/* Midground Cube */}
        <div
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 16,
            background: 'radial-gradient(circle, #a1a1aa 0%, #3f3f46 80%)',
            filter: `blur(${Math.abs(focalShift - 50) * 0.15}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18181b',
            fontWeight: 900,
          }}
        >
          MID Z
        </div>

        {/* Far Background Element (Black = Furthest) */}
        <div
          style={{
            position: 'absolute',
            right: '20%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #52525b 0%, #18181b 90%)',
            filter: `blur(${Math.abs(focalShift - 80) * 0.15}px)`,
          }}
        />

        {/* Focal Plane Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.75)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#34d399',
          }}
        >
          FOCAL DISTANCE: {Math.round(focalShift)}cm | APERTURE: f/1.4
        </div>
      </div>
    </div>
  );
};
