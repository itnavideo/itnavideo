import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PuppetRigProps {
  title?: string;
  pinCount?: number;
  meshDeform?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const PuppetRig: React.FC<PuppetRigProps> = ({
  title = 'Puppet Pin Mesh Deformer',
  pinCount = 7,
  meshDeform = true,
  primaryColor = '#EC4899',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const pinBend = Math.sin(frame * 0.1) * 16;

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
            background: 'rgba(236, 72, 153, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>📍 DELAUNAY MESH</span>
          <span>•</span>
          <span>PUPPET PIN ENGINE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Puppet Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0e0e15',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Triangular Wireframe Mesh */}
        <svg
          viewBox="0 0 200 260"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 260 : 280,
          }}
        >
          {/* Triangular Wireframe Tessellation */}
          <polygon points="100,30 50,90 150,90" fill="rgba(236, 72, 153, 0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <polygon points={`50,90 150,90 ${130 + pinBend},170 ${70 + pinBend},170`} fill="rgba(236, 72, 153, 0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <polygon points={`${70 + pinBend},170 ${130 + pinBend},170 140,240 60,240`} fill="rgba(236, 72, 153, 0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

          {/* Yellow Puppet Pins (Control Anchors) */}
          <circle cx="100" cy="30" r="5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
          <circle cx="50" cy="90" r="5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
          <circle cx="150" cy="90" r="5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
          <circle cx={70 + pinBend} cy="170" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <circle cx={130 + pinBend} cy="170" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <circle cx="60" cy="240" r="5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
          <circle cx="140" cy="240" r="5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
        </svg>

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
            color: '#f472b6',
          }}
        >
          PINS: {pinCount} | DEFORMATION: ELASTIC 2D
        </div>
      </div>
    </div>
  );
};
