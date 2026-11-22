import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ThreeDDeviceProps {
  type?: 'phone' | 'laptop' | 'tablet';
  tiltX?: number;
  tiltY?: number;
  tiltZ?: number;
  rotateAnim?: boolean;
  screenContent?: React.ReactNode;
  frameColor?: string;
  shadow?: boolean;
  glare?: boolean;
  delay?: number;
}

/**
 * ThreeDDevice — 3D spatial device floating in real perspective.
 * Renders an iPhone or MacBook with true 3D CSS rotateX/Y/Z tilts,
 * realistic specular glare, and reactive inner screen container.
 */
export function ThreeDDevice({
  type = 'phone',
  tiltX = 18,
  tiltY = -24,
  tiltZ = 6,
  rotateAnim = true,
  screenContent,
  frameColor = '#27272a',
  shadow = true,
  glare = true,
  delay = 0,
}: ThreeDDeviceProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Floating gentle levitation
  const levitateY = Math.sin(adjustedFrame * 0.05) * 8;
  const currentTiltY = rotateAnim ? tiltY + Math.sin(adjustedFrame * 0.03) * 4 : tiltY;

  const isPhone = type === 'phone';
  const width = isPhone ? 300 : 540;
  const height = isPhone ? 600 : 360;
  const borderRadius = isPhone ? 44 : 16;

  return (
    <div
      style={{
        position: 'relative',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${levitateY}px) scale(${scale})`,
        opacity,
      }}
    >
      {/* 3D Ground Shadow */}
      {shadow && (
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            width: width * 1.1,
            height: height * 0.4,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            filter: 'blur(28px)',
            transform: 'rotateX(60deg)',
          }}
        />
      )}

      {/* Floating 3D Device Body */}
      <div
        style={{
          position: 'relative',
          width,
          height,
          borderRadius,
          padding: 10,
          backgroundColor: frameColor,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0,0,0,0.8)',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateY(${currentTiltY}deg) rotateZ(${tiltZ}deg)`,
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Island on Phone */}
        {isPhone && (
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 22,
              borderRadius: 16,
              backgroundColor: '#000',
              zIndex: 30,
            }}
          />
        )}

        {/* Screen Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: borderRadius - 8,
            overflow: 'hidden',
            backgroundColor: '#09090b',
          }}
        >
          {screenContent ? (
            screenContent
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                background:
                  'radial-gradient(circle at 50% 40%, #1e293b 0%, #09090b 100%)',
                color: '#fff',
                padding: 24,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px #10b981',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Itnavideo 3D OS</span>
              <span style={{ fontSize: 12, color: '#a1a1aa' }}>
                Next-Gen Spatial Video
              </span>
            </div>
          )}

          {/* Glass Specular Glare */}
          {glare && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 45%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
