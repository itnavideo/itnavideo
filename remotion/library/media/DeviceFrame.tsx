import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DeviceFrameProps {
  device?: 'iphone-16-pro' | 'macbook-pro' | 'ipad-pro' | 'apple-watch';
  children?: React.ReactNode;
  width?: string | number;
  height?: number | string;
  shadow?: boolean;
  glare?: boolean;
  scale?: number;
}

/**
 * DeviceFrame — Photorealistic hardware device wrapper.
 * Accurately models iPhone 16 Pro (with Dynamic Island), MacBook Pro,
 * iPad Pro, and Apple Watch bezels with responsive inner canvas.
 */
export function DeviceFrame({
  device = 'iphone-16-pro',
  children,
  width = 'auto',
  height = 'auto',
  shadow = true,
  glare = true,
  scale = 1,
}: DeviceFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const entryScale = interpolate(entrySpr, [0, 1], [0.92, 1]) * scale;

  // Render iPhone 16 Pro bezel
  if (device === 'iphone-16-pro') {
    return (
      <div
        style={{
          position: 'relative',
          width: width === 'auto' ? 360 : width,
          height: height === 'auto' ? 740 : height,
          borderRadius: 52,
          padding: 12,
          backgroundColor: '#1f1f23',
          border: '3px solid #3f3f46',
          boxShadow: shadow
            ? '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5)'
            : 'none',
          transform: `scale(${entryScale})`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic Island Notch */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 28,
            borderRadius: 20,
            backgroundColor: '#000',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 10,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
            }}
          />
        </div>

        {/* Screen Area */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            borderRadius: 40,
            overflow: 'hidden',
            backgroundColor: '#09090b',
          }}
        >
          {children}

          {/* Screen Glare reflection */}
          {glare && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Home Bar Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              zIndex: 30,
            }}
          />
        </div>
      </div>
    );
  }

  // Render MacBook Pro bezel
  if (device === 'macbook-pro') {
    return (
      <div
        style={{
          position: 'relative',
          width: width === 'auto' ? 820 : width,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${entryScale})`,
        }}
      >
        {/* Screen Display Housing */}
        <div
          style={{
            width: '100%',
            borderRadius: '16px 16px 4px 4px',
            padding: '12px 12px 16px 12px',
            backgroundColor: '#18181b',
            border: '2px solid #27272a',
            boxShadow: shadow ? '0 25px 60px rgba(0, 0, 0, 0.8)' : 'none',
            position: 'relative',
          }}
        >
          {/* Top Camera Notch */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 12,
              borderRadius: '0 0 8px 8px',
              backgroundColor: '#000',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#27272a' }} />
          </div>

          {/* Inner Screen */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#09090b',
              position: 'relative',
            }}
          >
            {children}
            {glare && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, transparent 45%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* MacBook Aluminum Base */}
        <div
          style={{
            width: '104%',
            height: 14,
            backgroundColor: '#27272a',
            borderRadius: '0 0 16px 16px',
            borderTop: '1px solid #3f3f46',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 90,
              height: 4,
              borderRadius: '0 0 4px 4px',
              backgroundColor: '#18181b',
            }}
          />
        </div>
      </div>
    );
  }

  // Fallback / iPad / Apple Watch simple responsive bezel
  return (
    <div
      style={{
        position: 'relative',
        width: width === 'auto' ? 560 : width,
        height: height === 'auto' ? 420 : height,
        borderRadius: 28,
        padding: 16,
        backgroundColor: '#18181b',
        border: '3px solid #27272a',
        boxShadow: shadow ? '0 20px 50px rgba(0,0,0,0.7)' : 'none',
        transform: `scale(${entryScale})`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#09090b',
        }}
      >
        {children}
      </div>
    </div>
  );
}
