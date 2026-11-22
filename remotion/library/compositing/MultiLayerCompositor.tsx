import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiLayerCompositorProps {
  title?: string;
  layerNames?: string[];
  explodedSpacing?: number;
  perspectiveAngle?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const MultiLayerCompositor: React.FC<MultiLayerCompositorProps> = ({
  title = 'Multi-Layer Compositor',
  layerNames = ['Layer 4: UI & Typography', 'Layer 3: VFX & Particles', 'Layer 2: Hero Subject', 'Layer 1: Background & Sky'],
  explodedSpacing = 36,
  perspectiveAngle = 45,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const tilt = interpolate(Math.sin(frame * 0.05), [-1, 1], [-5, 5]);

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
        perspective: 1000,
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
          <span>▤ 3D ISOMETRIC STACK</span>
          <span>•</span>
          <span>COMPOSITOR</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Exploded 3D Layer Stack */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotateX(55deg) rotateZ(-30deg) rotateY(${tilt}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {layerNames.map((name, idx) => {
          const zOffset = (layerNames.length - 1 - idx) * explodedSpacing;
          const bgColors = [
            'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(99, 102, 241, 0.25) 100%)',
            'linear-gradient(135deg, rgba(236, 72, 153, 0.35) 0%, rgba(245, 158, 11, 0.25) 100%)',
            'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(6, 182, 212, 0.25) 100%)',
            'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(15, 23, 42, 0.8) 100%)',
          ];

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: isVertical ? 240 : 360,
                height: isVertical ? 150 : 190,
                borderRadius: 14,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: bgColors[idx % bgColors.length],
                backdropFilter: 'blur(6px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                transform: `translateZ(${zOffset * anim}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#ffffff',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '4px 10px',
                  borderRadius: 6,
                }}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
