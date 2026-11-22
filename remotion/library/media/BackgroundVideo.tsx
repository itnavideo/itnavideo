import React from 'react';
import { OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BackgroundVideoProps {
  src?: string;
  opacity?: number;
  blur?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  gradientVignette?: boolean;
  colorGrade?: 'none' | 'cinematic-teal' | 'cyberpunk-neon' | 'noir' | 'warm-amber' | 'deep-emerald';
  playbackRate?: number;
  children?: React.ReactNode;
}

/**
 * BackgroundVideo — High-performance ambient video background wrapper.
 * Provides dark vignette, color grading tint, blur, and opacity attenuation
 * so that foreground subtitles and UI elements stay 100% readable.
 */
export function BackgroundVideo({
  src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  opacity = 0.45,
  blur = 0,
  overlayColor = '#09090b',
  overlayOpacity = 0.5,
  gradientVignette = true,
  colorGrade = 'none',
  playbackRate = 1,
  children,
}: BackgroundVideoProps) {
  const getColorGradeStyle = (): React.CSSProperties => {
    switch (colorGrade) {
      case 'cinematic-teal':
        return {
          background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)',
          mixBlendMode: 'color',
        };
      case 'cyberpunk-neon':
        return {
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(236, 72, 153, 0.25) 100%)',
          mixBlendMode: 'color-dodge',
        };
      case 'noir':
        return {
          filter: 'grayscale(100%) contrast(120%)',
        };
      case 'warm-amber':
        return {
          background: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.25) 0%, rgba(9, 9, 11, 0.8) 100%)',
          mixBlendMode: 'soft-light',
        };
      case 'deep-emerald':
        return {
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, rgba(9, 9, 11, 0.85) 100%)',
          mixBlendMode: 'overlay',
        };
      case 'none':
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#09090b',
      }}
    >
      {/* Underlying Video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          transform: blur > 0 ? 'scale(1.05)' : undefined, // prevent blur edge bleed
        }}
      >
        <OffthreadVideo
          src={src}
          playbackRate={playbackRate}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Color Grade Overlay */}
      {colorGrade !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            ...getColorGradeStyle(),
          }}
        />
      )}

      {/* Solid Dark Tint Dimmer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Radial Vignette Mask */}
      {gradientVignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, transparent 30%, rgba(9, 9, 11, 0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Foreground Child Elements */}
      {children && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
