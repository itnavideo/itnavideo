import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TechLayer {
  title: string;
  subtitle?: string;
  tag?: string;
  color?: string;
  icon?: string;
}

export interface ThreeDLayersProps {
  layers?: TechLayer[];
  spacing?: number;
  explode?: boolean;
  width?: number;
  height?: number;
  tiltX?: number;
  tiltZ?: number;
  delay?: number;
  style?: React.CSSProperties;
}

const DEFAULT_LAYERS: TechLayer[] = [
  {
    title: 'Presentation & UI Layer',
    subtitle: 'Next.js 16 + Remotion Player',
    tag: 'CLIENT',
    color: '#38bdf8',
  },
  {
    title: 'API Gateway & Autonomous Orchestrator',
    subtitle: 'Google Cloud Run + Groq Whisper',
    tag: 'ROUTER',
    color: '#10b981',
  },
  {
    title: 'Distributed Render Farm',
    subtitle: 'AWS Lambda Chromium Headless',
    tag: 'RENDER',
    color: '#6366f1',
  },
  {
    title: 'State & Media Persistence',
    subtitle: 'Supabase PostgreSQL + AWS S3',
    tag: 'STORAGE',
    color: '#f59e0b',
  },
];

/**
 * ThreeDLayers — Exploded 3D architectural stack.
 * Separates technology tiers in 3D Z-depth with glassmorphic cards,
 * connection lines, and status tags.
 */
export function ThreeDLayers({
  layers = DEFAULT_LAYERS,
  spacing = 70,
  explode = true,
  width = 380,
  height = 90,
  tiltX = 60,
  tiltZ = -35,
  delay = 0,
  style,
}: ThreeDLayersProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Separation spring
  const explodeSpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 85, mass: 0.9 },
  });

  const separationFactor = explode ? interpolate(explodeSpr, [0, 1], [0.2, 1]) : 1;
  const opacity = interpolate(explodeSpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width: width * 1.4,
        height: layers.length * spacing * 1.5 + 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1200,
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width,
          height: layers.length * spacing,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`,
        }}
      >
        {layers.map((layer, index) => {
          const zOffset = (layers.length - 1 - index) * spacing * separationFactor;
          const layerColor = layer.color || '#10b981';

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: index * 20,
                left: 0,
                width,
                height,
                borderRadius: 14,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                border: `2px solid ${layerColor}`,
                boxShadow: `0 15px 35px rgba(0, 0, 0, 0.6), inset 0 0 15px ${layerColor}25`,
                transform: `translateZ(${zOffset}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                transition: 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {layer.title}
                </span>
                {layer.subtitle && (
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>
                    {layer.subtitle}
                  </span>
                )}
              </div>

              {layer.tag && (
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 6,
                    backgroundColor: `${layerColor}25`,
                    border: `1px solid ${layerColor}60`,
                    color: layerColor,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                  }}
                >
                  {layer.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
