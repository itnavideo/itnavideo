import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VideoImageProps {
  src?: string;
  alt?: string;
  caption?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | 'auto';
  animation?: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'spring-pop' | 'none';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: boolean;
  blurFallback?: string;
  overlayGradient?: boolean;
  width?: string | number;
  height?: string | number;
  delay?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
}

/**
 * VideoImage — High-retention video image showcase component.
 * Features cinematic Ken Burns push-in/pan, glassmorphism border,
 * floating caption pill, and fallback shimmer.
 */
export function VideoImage({
  src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  alt = 'Showcase Image',
  caption,
  aspectRatio = '16:9',
  animation = 'ken-burns-in',
  borderRadius = 16,
  borderWidth = 1,
  borderColor = 'rgba(255, 255, 255, 0.15)',
  shadow = true,
  overlayGradient = false,
  width = '100%',
  height = 'auto',
  delay = 0,
  objectFit = 'cover',
}: VideoImageProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring pop
  const entrySpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const entryScale = interpolate(entrySpring, [0, 1], [0.92, 1]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  // Ken Burns zoom & pan interpolation
  const progress = Math.min(1, Math.max(0, adjustedFrame / (durationInFrames || 90)));

  let transformStyle = '';
  switch (animation) {
    case 'ken-burns-in': {
      const scale = interpolate(progress, [0, 1], [1, 1.15]);
      transformStyle = `scale(${scale * entryScale})`;
      break;
    }
    case 'ken-burns-out': {
      const scale = interpolate(progress, [0, 1], [1.15, 1]);
      transformStyle = `scale(${scale * entryScale})`;
      break;
    }
    case 'pan-left': {
      const translateX = interpolate(progress, [0, 1], [0, -30]);
      transformStyle = `scale(${1.08 * entryScale}) translateX(${translateX}px)`;
      break;
    }
    case 'pan-right': {
      const translateX = interpolate(progress, [0, 1], [-30, 0]);
      transformStyle = `scale(${1.08 * entryScale}) translateX(${translateX}px)`;
      break;
    }
    case 'spring-pop':
    default:
      transformStyle = `scale(${entryScale})`;
      break;
  }

  // Ratio aspect mapping
  const ratioPadding =
    aspectRatio === '16:9'
      ? '56.25%'
      : aspectRatio === '9:16'
        ? '177.77%'
        : aspectRatio === '1:1'
          ? '100%'
          : aspectRatio === '4:3'
            ? '75%'
            : undefined;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: ratioPadding ? 0 : height,
        paddingBottom: ratioPadding,
        borderRadius,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: shadow
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.4)'
          : 'none',
        overflow: 'hidden',
        opacity: entryOpacity,
        backgroundColor: '#18181b',
      }}
    >
      <div
        style={{
          position: ratioPadding ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: transformStyle,
          transformOrigin: 'center center',
          transition: 'none',
        }}
      >
        <Img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            display: 'block',
          }}
        />

        {overlayGradient && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(9, 9, 11, 0.85) 0%, rgba(9, 9, 11, 0.1) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            padding: '8px 16px',
            borderRadius: 9999,
            backgroundColor: 'rgba(9, 9, 11, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#f4f4f5',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}

export { VideoImage as Image };
