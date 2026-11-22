import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiPlaneCameraProps {
  title?: string;
  glassPlanesCount?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const MultiPlaneCamera: React.FC<MultiPlaneCameraProps> = ({
  title = 'Multi-Plane Glass Camera Rig',
  glassPlanesCount = 4,
  primaryColor = '#EC4899',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const overheadTilt = interpolate(Math.sin(frame * 0.05), [-1, 1], [-8, 8]);

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
        perspective: 900,
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
          <span>▤ DISNEY MULTIPLANE</span>
          <span>•</span>
          <span>TIERED GLASS PLANES</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Multiplane Rig Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0d12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '24px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Overhead Camera Lens pointing downward */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 6,
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#e4e4e7',
            fontSize: 11,
            fontFamily: 'monospace',
          }}
        >
          <span>📷 TOP-DOWN CAMERA LENS</span>
        </div>

        {/* 4 Glass Panes stacked with varying distance and lighting */}
        {Array.from({ length: glassPlanesCount }).map((_, idx) => {
          const planeLabels = ['Plane 1: Foreground Foliage', 'Plane 2: Hero Character', 'Plane 3: Village Houses', 'Plane 4: Mountain Sky'];
          const planeColors = ['#10b981', '#ec4899', '#f59e0b', '#3b82f6'];

          return (
            <div
              key={idx}
              style={{
                width: isVertical ? '85%' : '75%',
                height: 38,
                borderRadius: 8,
                border: `1px solid ${planeColors[idx]}80`,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                transform: `rotateX(40deg) translateY(${idx * 4}px)`,
                boxShadow: `0 8px 20px ${planeColors[idx]}20`,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5' }}>
                {planeLabels[idx]}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: planeColors[idx] }}>
                Z-DIST: {(idx + 1) * 30}cm
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
