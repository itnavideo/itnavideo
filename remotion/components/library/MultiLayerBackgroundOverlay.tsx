import React, { memo } from 'react';
import {
  interpolate,
  OffthreadVideo,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { safeResolveMediaSrc, isVideoMedia as isVideoFile } from '../../utils/safeMedia';
import { Background } from '../backgrounds/Background';

// =========================================================================
// 1. DYNAMIC BACKGROUND LAYER DATA SCHEMA (Unlimited Stackable Layers)
// =========================================================================

export type BackgroundLayerType =
  | 'color'
  | 'gradient'
  | 'image'
  | 'video'
  | 'texture'
  | 'mesh'
  | 'vignette'
  | 'particles';

export interface DynamicBackgroundLayer {
  id: string;
  type: BackgroundLayerType;
  startSeconds?: number;
  durationSeconds?: number;

  // Visual Properties
  color?: string;
  gradient?: string;
  src?: string;
  opacity?: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  filter?: string;
  blurPx?: number;
  scale?: number;
  rotationDeg?: number;
  zIndex?: number;

  // Subtle Ambient Motion (Zero jitter, purely frame-driven)
  motion?: {
    enter?: 'fade' | 'zoom' | 'none';
    enterDurationFrames?: number;
    continuous?: 'drift' | 'pulse' | 'ken-burns' | 'none';
    continuousIntensity?: number;
  };
}

export interface MultiLayerBackgroundOverlayProps {
  layers?: DynamicBackgroundLayer[];
  fallbackTheme?: string;
  aspectRatio?: '16:9' | '9:16';
}

// =========================================================================
// 2. SINGLE BACKGROUND LAYER VIEW
// =========================================================================

const SingleBackgroundLayerView = memo(({
  layer,
  totalDurationFrames,
}: {
  layer: DynamicBackgroundLayer;
  totalDurationFrames: number;
}) => {
  const frame = useCurrentFrame();

  // Entrance motion envelope
  let enterOpacity = 1;
  let enterScale = 1;
  const enterType = layer.motion?.enter ?? 'fade';
  const enterFrames = layer.motion?.enterDurationFrames ?? 12;

  if (enterType === 'fade' && frame < enterFrames) {
    enterOpacity = interpolate(frame, [0, enterFrames], [0, 1], { extrapolateRight: 'clamp' });
  } else if (enterType === 'zoom' && frame < enterFrames) {
    enterOpacity = interpolate(frame, [0, enterFrames], [0, 1], { extrapolateRight: 'clamp' });
    enterScale = interpolate(frame, [0, enterFrames], [1.08, 1.0], { extrapolateRight: 'clamp' });
  }

  // Continuous subtle ambient drift
  let contScale = 1;
  let contTx = 0;
  let contTy = 0;
  const continuous = layer.motion?.continuous;
  const intensity = layer.motion?.continuousIntensity ?? 1.0;

  if (continuous === 'drift') {
    contTx = Math.sin(frame * 0.015) * 12 * intensity;
    contTy = Math.cos(frame * 0.012) * 8 * intensity;
  } else if (continuous === 'pulse') {
    contScale = 1.0 + Math.sin(frame * 0.02) * 0.025 * intensity;
  } else if (continuous === 'ken-burns') {
    contScale = interpolate(frame, [0, Math.max(1, totalDurationFrames)], [1.0, 1.06 + 0.04 * intensity], {
      extrapolateRight: 'clamp',
    });
  }

  const finalOpacity = (layer.opacity ?? 1.0) * enterOpacity;
  const finalScale = (layer.scale ?? 1.0) * enterScale * contScale;
  const resolvedSrc = layer.src ? safeResolveMediaSrc(layer.src) : '';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: layer.zIndex ?? 1,
    opacity: finalOpacity,
    mixBlendMode: layer.blendMode ?? 'normal',
    transform: `translate3d(${contTx}px, ${contTy}px, 0) scale(${finalScale}) rotate(${layer.rotationDeg ?? 0}deg)`,
    filter: layer.blurPx ? `blur(${layer.blurPx}px)` : layer.filter || undefined,
    pointerEvents: 'none',
    overflow: 'hidden',
  };

  switch (layer.type) {
    case 'color':
      return (
        <div
          style={{
            ...containerStyle,
            backgroundColor: layer.color || '#090D16',
          }}
        />
      );

    case 'gradient':
      return (
        <div
          style={{
            ...containerStyle,
            background: layer.gradient || 'linear-gradient(135deg, #090D16 0%, #111827 50%, #030712 100%)',
          }}
        />
      );

    case 'image':
      if (!resolvedSrc) return null;
      return (
        <div style={containerStyle}>
          <Img
            src={resolvedSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      );

    case 'video':
      if (!resolvedSrc) return null;
      return (
        <div style={containerStyle}>
          <OffthreadVideo
            src={resolvedSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            volume={0}
          />
        </div>
      );

    case 'texture':
      // Halftone dot or paper texture matrix
      return (
        <div
          style={{
            ...containerStyle,
            backgroundImage: `radial-gradient(${layer.color || 'rgba(255, 255, 255, 0.15)'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      );

    case 'mesh':
      return (
        <div
          style={{
            ...containerStyle,
            backgroundImage: `
              linear-gradient(to right, ${layer.color || 'rgba(255, 255, 255, 0.05)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${layer.color || 'rgba(255, 255, 255, 0.05)'} 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      );

    case 'vignette':
      return (
        <div
          style={{
            ...containerStyle,
            background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.75) 100%)',
          }}
        />
      );

    case 'particles':
    default:
      return (
        <div
          style={{
            ...containerStyle,
            background: layer.gradient || 'radial-gradient(ellipse at 50% 50%, rgba(255, 87, 34, 0.12) 0%, transparent 70%)',
          }}
        />
      );
  }
});
SingleBackgroundLayerView.displayName = 'SingleBackgroundLayerView';

// =========================================================================
// 3. MULTI-LAYER BACKGROUND OVERLAY (Unlimited Stack)
// =========================================================================

export const MultiLayerBackgroundOverlay: React.FC<MultiLayerBackgroundOverlayProps> = memo(({
  layers = [],
  fallbackTheme = 'midnight-mesh',
  aspectRatio = '16:9',
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // If no custom multi-layers provided, cleanly fallback to the deterministic Background catalog component
  if (!layers || layers.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Background theme={fallbackTheme} aspectRatio={aspectRatio} />
      </div>
    );
  }

  // Sort layers by zIndex ascending so lower index renders first (behind)
  const sortedLayers = [...layers].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {sortedLayers.map((layer) => {
        const startSec = layer.startSeconds ?? 0;
        const fromFrame = Math.round(startSec * fps);
        const durSec = layer.durationSeconds;
        const durationFrames = durSec ? Math.max(1, Math.round(durSec * fps)) : Math.max(1, durationInFrames - fromFrame);

        return (
          <Sequence
            key={layer.id}
            name={`bg-layer-${layer.type}-${layer.id}`}
            from={fromFrame}
            durationInFrames={durationFrames}
          >
            <SingleBackgroundLayerView
              layer={layer}
              totalDurationFrames={durationFrames}
            />
          </Sequence>
        );
      })}
    </div>
  );
});
MultiLayerBackgroundOverlay.displayName = 'MultiLayerBackgroundOverlay';

