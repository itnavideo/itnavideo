import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ZoomThroughProps {
  headline?: string;
  portalLabel?: string;
  destinationLabel?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ZoomThrough — Infinite portal / gateway zoom transition storytelling visual.
 * Accelerates camera through a focal portal into the core realization.
 */
export function ZoomThrough({
  headline = 'STEPPING INTO THE AUTOMATED FUTURE',
  portalLabel = 'LEGACY LIMITATION',
  destinationLabel = 'AUTONOMOUS STUDIO',
  accentColor = '#8b5cf6',
  delay = 0,
  width = 460,
  height = 360,
}: ZoomThroughProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const zoomSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 16, stiffness: 60, mass: 1 },
  });

  const scaleOuter = interpolate(zoomSpr, [0, 1], [1, 3.5]);
  const opacityOuter = interpolate(zoomSpr, [0, 0.7, 1], [1, 0.4, 0]);
  const opacityInner = interpolate(zoomSpr, [0, 0.5, 1], [0, 0.6, 1]);
  const scaleInner = interpolate(zoomSpr, [0, 1], [0.4, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', zIndex: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          DIMENSIONAL SHIFT
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Central Zooming Portal Stage */}
      <div
        style={{
          position: 'relative',
          width: 220,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer Portal Frame (Zooms Out & Fades) */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 30px ${accentColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${scaleOuter})`,
            opacity: opacityOuter,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, color: '#ffffff' }}>
            {portalLabel}
          </span>
        </div>

        {/* Destination Horizon Revealed */}
        <div
          style={{
            position: 'absolute',
            width: 160,
            padding: '12px 14px',
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accentColor}33, #18181b)`,
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 24px ${accentColor}66`,
            textAlign: 'center',
            transform: `scale(${scaleInner})`,
            opacity: opacityInner,
          }}
        >
          <div style={{ fontSize: 9, color: accentColor, fontWeight: 800 }}>DESTINATION REACHED</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
            {destinationLabel}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b', zIndex: 3 }}>
        CONTINUOUS ZOOM PENETRATION INTO EXPONENTIAL IMPACT
      </div>
    </div>
  );
}
