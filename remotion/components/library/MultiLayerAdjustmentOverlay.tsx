import React, { memo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. ADJUSTMENT & COLOR GRADING SCHEMA
// =========================================================================

export type ColorGradePreset =
  | 'dark-luxury'
  | 'warm-creator'
  | 'cyber-neon'
  | 'vintage-film'
  | 'clean-corporate'
  | 'moody-bw'
  | 'bleach-bypass'
  | 'sunset-gold'
  | 'custom';

export interface ColorGradeValues {
  brightness?: number;     // 1.0 is default
  contrast?: number;       // 1.0 is default
  saturate?: number;       // 1.0 is default
  sepia?: number;          // 0.0 to 1.0
  hueRotateDeg?: number;   // -180 to 180
  tintColor?: string;      // Optional ambient color overlay
  tintOpacity?: number;    // 0 to 1
  tintBlendMode?: React.CSSProperties['mixBlendMode'];
}

export interface DynamicAdjustmentLayer {
  id: string;
  startSeconds: number;
  durationSeconds: number;
  preset?: ColorGradePreset;
  custom?: ColorGradeValues;
  intensity?: number;       // 0.0 to 1.0 (default 1.0)
  fadeInFrames?: number;
  fadeOutFrames?: number;
  zIndex?: number;
}

// =========================================================================
// 2. PRESET LUT DEFINITIONS (8 Popular Short-Form Color Grades)
// =========================================================================

export const COLOR_GRADE_PRESETS: Record<Exclude<ColorGradePreset, 'custom'>, ColorGradeValues> = {
  'dark-luxury': {
    brightness: 0.95,
    contrast: 1.2,
    saturate: 0.9,
    tintColor: '#0F172A',
    tintOpacity: 0.15,
    tintBlendMode: 'color-burn',
  },
  'warm-creator': {
    brightness: 1.02,
    contrast: 1.08,
    saturate: 1.12,
    sepia: 0.08,
    tintColor: '#FFEDD5',
    tintOpacity: 0.1,
    tintBlendMode: 'soft-light',
  },
  'cyber-neon': {
    brightness: 1.0,
    contrast: 1.25,
    saturate: 1.35,
    hueRotateDeg: 12,
    tintColor: '#38BDF8',
    tintOpacity: 0.12,
    tintBlendMode: 'color-dodge',
  },
  'vintage-film': {
    brightness: 0.98,
    contrast: 0.92,
    saturate: 0.85,
    sepia: 0.22,
    tintColor: '#78350F',
    tintOpacity: 0.08,
    tintBlendMode: 'overlay',
  },
  'clean-corporate': {
    brightness: 1.04,
    contrast: 1.05,
    saturate: 1.08,
    tintColor: '#F8FAFC',
    tintOpacity: 0.05,
    tintBlendMode: 'soft-light',
  },
  'moody-bw': {
    brightness: 0.96,
    contrast: 1.35,
    saturate: 0.0, // Pure black & white
    tintColor: '#18181B',
    tintOpacity: 0.1,
    tintBlendMode: 'multiply',
  },
  'bleach-bypass': {
    brightness: 1.0,
    contrast: 1.3,
    saturate: 0.55,
    tintColor: '#334155',
    tintOpacity: 0.12,
    tintBlendMode: 'hard-light',
  },
  'sunset-gold': {
    brightness: 1.03,
    contrast: 1.1,
    saturate: 1.2,
    sepia: 0.12,
    tintColor: '#EA580C',
    tintOpacity: 0.14,
    tintBlendMode: 'soft-light',
  },
};

// =========================================================================
// 3. SINGLE TIME-WINDOWED ADJUSTMENT VIEW
// =========================================================================

const SingleAdjustmentView = memo(({ layer }: { layer: DynamicAdjustmentLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
  const fadeIn = layer.fadeInFrames ?? 6;
  const fadeOut = layer.fadeOutFrames ?? 6;

  // Smooth entrance & exit envelope
  let envelope = 1.0;
  if (frame < fadeIn) {
    envelope = interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: 'clamp' });
  } else if (frame > totalDurationFrames - fadeOut) {
    envelope = interpolate(frame, [totalDurationFrames - fadeOut, totalDurationFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  const intensity = (layer.intensity ?? 1.0) * envelope;

  // Resolve active color grading values
  const basePreset = layer.preset && layer.preset !== 'custom' ? COLOR_GRADE_PRESETS[layer.preset] : {};
  const values: ColorGradeValues = {
    ...basePreset,
    ...layer.custom,
  };

  const brightness = 1.0 + ((values.brightness ?? 1.0) - 1.0) * intensity;
  const contrast = 1.0 + ((values.contrast ?? 1.0) - 1.0) * intensity;
  const saturate = 1.0 + ((values.saturate ?? 1.0) - 1.0) * intensity;
  const sepia = (values.sepia ?? 0.0) * intensity;
  const hueRotate = (values.hueRotateDeg ?? 0) * intensity;

  const backdropFilterString = [
    `brightness(${brightness})`,
    `contrast(${contrast})`,
    `saturate(${saturate})`,
    sepia > 0 ? `sepia(${sepia})` : '',
    hueRotate !== 0 ? `hue-rotate(${hueRotate}deg)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const tintOpacity = (values.tintOpacity ?? 0) * intensity;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: layer.zIndex ?? 24,
        pointerEvents: 'none',
        backdropFilter: backdropFilterString,
        WebkitBackdropFilter: backdropFilterString,
      }}
    >
      {/* Optional ambient color wash overlay */}
      {values.tintColor && tintOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: values.tintColor,
            opacity: tintOpacity,
            mixBlendMode: values.tintBlendMode ?? 'soft-light',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
});

// =========================================================================
// 4. MAIN MULTI-LAYER ADJUSTMENT OVERLAY STAGE
// =========================================================================

export interface MultiLayerAdjustmentOverlayProps {
  layers?: DynamicAdjustmentLayer[];
}

export const MultiLayerAdjustmentOverlay: React.FC<MultiLayerAdjustmentOverlayProps> = ({ layers = [] }) => {
  const { fps } = useVideoConfig();

  if (!layers || layers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 24,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {layers.map((layer) => {
        const fromFrame = Math.round(layer.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(layer.durationSeconds * fps));

        return (
          <Sequence
            key={layer.id}
            name={`adjustment-${layer.preset ?? 'custom'}-${layer.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleAdjustmentView layer={layer} />
          </Sequence>
        );
      })}
    </div>
  );
};

