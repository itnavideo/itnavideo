import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlueprintProps {
  projectTitle?: string;
  drawingNumber?: string;
  scale?: string;
  revision?: string;
  engineer?: string;
  children?: React.ReactNode;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * Blueprint — Classic cyan/navy architectural engineering blueprint canvas.
 * Features millimeter measurement grid, professional CAD title block box,
 * and high-contrast drafting lines.
 */
export function Blueprint({
  projectTitle = 'ORBITAL PAYLOAD FAIRING SYSTEM',
  drawingNumber = 'DWG NO. AER-9082-A',
  scale = '1:25',
  revision = 'REV 3.2',
  engineer = 'CHIEF AEROSPACE ARCHITECT',
  children,
  delay = 0,
  width = '100%',
  height = 420,
}: BlueprintProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scaleVal = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#0c2340', // Deep Classic Blueprint Cyan/Navy
        borderRadius: 14,
        border: '2px solid rgba(147, 197, 253, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.4)',
        transform: `scale(${scaleVal})`,
        opacity,
      }}
    >
      {/* Millimeter Blueprint Grid Background */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="bp-small-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
          </pattern>
          <pattern id="bp-large-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#bp-small-grid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#93c5fd" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-large-grid)" />
      </svg>

      {/* Main Drafting Content Slot */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {children ? (
          children
        ) : (
          <svg width="380" height="200" viewBox="0 0 380 200" style={{ overflow: 'visible' }}>
            {/* Example Rocket Fairing Drafting Lines */}
            <path
              d="M 100 160 L 100 80 Q 100 20 190 20 Q 280 20 280 80 L 280 160 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Centerline */}
            <line x1="190" y1="10" x2="190" y2="170" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="8 4 2 4" />
            {/* Dimensions */}
            <line x1="80" y1="160" x2="80" y2="20" stroke="#93c5fd" strokeWidth="1" />
            <text x="65" y="95" fill="#93c5fd" fontSize="10" fontWeight="700" fontFamily="monospace" transform="rotate(-90 65 95)">
              H = 5,400 mm
            </text>
          </svg>
        )}
      </div>

      {/* Official Engineering CAD Title Block (Bottom-Right) */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          alignSelf: 'flex-end',
          width: 320,
          backgroundColor: '#0a192f',
          border: '1.5px solid #93c5fd',
          borderRadius: 4,
          padding: 8,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 4,
          fontFamily: 'monospace',
          color: '#e0f2fe',
        }}
      >
        <div style={{ borderRight: '1px solid #60a5fa', paddingRight: 6 }}>
          <span style={{ fontSize: 8, color: '#93c5fd', display: 'block' }}>PROJECT TITLE</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>{projectTitle}</span>
        </div>

        <div>
          <span style={{ fontSize: 8, color: '#93c5fd', display: 'block' }}>DWG NUMBER</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8' }}>{drawingNumber}</span>
        </div>

        <div style={{ borderTop: '1px solid #60a5fa', paddingTop: 4 }}>
          <span style={{ fontSize: 8, color: '#93c5fd' }}>ENGINEER: </span>
          <span style={{ fontSize: 9, fontWeight: 700 }}>{engineer}</span>
        </div>

        <div style={{ borderTop: '1px solid #60a5fa', paddingTop: 4, textAlign: 'right' }}>
          <span style={{ fontSize: 9, fontWeight: 800 }}>{scale} • {revision}</span>
        </div>
      </div>
    </div>
  );
}
