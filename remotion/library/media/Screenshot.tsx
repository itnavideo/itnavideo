import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ScreenshotProps {
  src?: string;
  alt?: string;
  title?: string;
  perspective?: 'flat' | 'isometric-right' | 'isometric-left' | 'tilted-up';
  zoomCallout?: {
    x: number; // percentage 0 - 100
    y: number; // percentage 0 - 100
    label?: string;
    radius?: number;
    zoomScale?: number;
  };
  borderRadius?: number;
  shadow?: boolean;
  width?: string | number;
  height?: number | string;
  delay?: number;
}

/**
 * Screenshot — SaaS product screenshot showcase frame.
 * Features 3D perspective tilt, browser chrome bar, and a spotlight
 * magnifying callout lens zooming into a specific product area.
 */
export function Screenshot({
  src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  alt = 'Product Screenshot',
  title = 'analytics.app/overview',
  perspective = 'flat',
  zoomCallout,
  borderRadius = 14,
  shadow = true,
  width = '100%',
  height = 'auto',
  delay = 0,
}: ScreenshotProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const entryScale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const entryOpacity = interpolate(entrySpr, [0, 1], [0, 1]);

  const getPerspectiveTransform = (): string => {
    switch (perspective) {
      case 'isometric-right':
        return 'perspective(1200px) rotateX(12deg) rotateY(-18deg) rotateZ(3deg)';
      case 'isometric-left':
        return 'perspective(1200px) rotateX(12deg) rotateY(18deg) rotateZ(-3deg)';
      case 'tilted-up':
        return 'perspective(1000px) rotateX(16deg)';
      case 'flat':
      default:
        return 'none';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `${getPerspectiveTransform()} scale(${entryScale})`,
        transformStyle: 'preserve-3d',
        opacity: entryOpacity,
        borderRadius,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: shadow
          ? '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)'
          : 'none',
        backgroundColor: '#18181b',
      }}
    >
      {/* Browser Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          backgroundColor: '#09090b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
        </div>

        <div
          style={{
            flex: 1,
            maxWidth: 320,
            margin: '0 auto',
            padding: '3px 12px',
            borderRadius: 6,
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#a1a1aa',
            fontSize: 11,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      </div>

      {/* Screenshot Image Body */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <Img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Magnifying Zoom Spotlight Lens */}
        {zoomCallout && (
          <div
            style={{
              position: 'absolute',
              left: `${zoomCallout.x}%`,
              top: `${zoomCallout.y}%`,
              width: (zoomCallout.radius || 60) * 2,
              height: (zoomCallout.radius || 60) * 2,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: '3px solid #10b981',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.7), inset 0 0 15px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            <Img
              src={src}
              alt="Magnified View"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${zoomCallout.zoomScale || 1.8})`,
                transformOrigin: `${zoomCallout.x}% ${zoomCallout.y}%`,
              }}
            />

            {zoomCallout.label && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(9, 9, 11, 0.85)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {zoomCallout.label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
