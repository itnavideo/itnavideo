import React, { memo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. DYNAMIC VISUAL EFFECTS SCHEMA
// =========================================================================

export type VisualEffectType =
  | 'vignette'
  | 'film-grain'
  | 'light-leak'
  | 'chromatic-aberration'
  | 'glow-bloom'
  | 'lens-blur';

export interface VisualEffectConfig {
  grainSize?: number;           // Default 1.0
  leakColor?: string;           // e.g. '#FF7A00' or '#EC4899'
  aberrationOffset?: number;    // px shift, e.g. 4
  blurPx?: number;              // px blur, e.g. 6
  vignetteRadius?: number;      // % coverage, default 65
}

export interface DynamicEffectLayer {
  id: string;
  type: VisualEffectType;
  startSeconds: number;
  durationSeconds: number;
  intensity?: number;           // 0.0 to 1.0 (default 0.5)
  blendMode?: React.CSSProperties['mixBlendMode'];
  config?: VisualEffectConfig;
  fadeInFrames?: number;        // Default 6
  fadeOutFrames?: number;       // Default 6
  zIndex?: number;
}

// =========================================================================
// 2. INDIVIDUAL EFFECT RENDERERS (GPU-Accelerated CSS & SVG Filters)
// =========================================================================

/**
 * 1. Vignette: Soft radial dark edges to focus eye on center
 */
const VignetteEffect = memo(({ intensity = 0.5, radius = 65 }: { intensity?: number; radius?: number }) => {
  const alpha = Math.min(1, Math.max(0, intensity * 0.9));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, transparent ${radius}%, rgba(0, 0, 0, ${alpha}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
});

/**
 * 2. Film Grain: 35mm cinematic organic grain using procedural SVG noise
 * seed changes with frame so grain dances realistically at 30 FPS!
 */
const FilmGrainEffect = memo(({ frame, intensity = 0.35 }: { frame: number; intensity?: number }) => {
  const seed = (frame % 30) * 11;
  const opacity = Math.min(0.8, Math.max(0.05, intensity * 0.4));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" style={{ width: '100%', height: '100%' }}>
        <filter id={`grain-filter-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={3}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-filter-${seed})`} />
      </svg>
    </div>
  );
});

/**
 * 3. Light Leak: Warm organic sun flare / lens flare drifting dynamically
 */
const LightLeakEffect = memo(({ frame, fps, intensity = 0.5, color = '#FF6B00' }: { frame: number; fps: number; intensity?: number; color?: string }) => {
  const t = (frame / fps) * 0.8;
  const x = 70 + Math.sin(t) * 20; // 50% to 90%
  const y = 20 + Math.cos(t * 1.3) * 15; // 5% to 35%
  const pulse = 0.85 + Math.sin(t * 2) * 0.15;
  const opacity = Math.min(1, Math.max(0, intensity * pulse * 0.7));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, rgba(255, 140, 0, 0.4) 35%, transparent 70%)`,
        pointerEvents: 'none',
      }}
    />
  );
});

/**
 * 4. Chromatic Aberration: High-energy RGB split shift
 */
const ChromaticAberrationEffect = memo(({ intensity = 0.5, offsetPx = 4 }: { intensity?: number; offsetPx?: number }) => {
  const shift = offsetPx * intensity;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: Math.min(1, intensity * 0.8),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset ${shift}px 0 0 rgba(255, 0, 0, 0.4), inset -${shift}px 0 0 rgba(0, 240, 255, 0.4)`,
        }}
      />
    </div>
  );
});

/**
 * 5. Glow / Bloom: Soft diffused ambient light bloom
 */
const GlowBloomEffect = memo(({ intensity = 0.5, color = '#FFFFFF' }: { intensity?: number; color?: string }) => {
  const opacity = Math.min(0.6, intensity * 0.45);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        mixBlendMode: 'soft-light',
        background: `radial-gradient(circle at 50% 40%, ${color} 0%, transparent 80%)`,
        pointerEvents: 'none',
      }}
    />
  );
});

/**
 * 6. Lens Blur: Edge or full-frame cinematic depth blur
 */
const LensBlurEffect = memo(({ intensity = 0.5, blurPx = 8 }: { intensity?: number; blurPx?: number }) => {
  const actualBlur = blurPx * intensity;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(${actualBlur}px)`,
        WebkitBackdropFilter: `blur(${actualBlur}px)`,
        pointerEvents: 'none',
      }}
    />
  );
});

// =========================================================================
// 3. SINGLE TIME-WINDOWED EFFECT VIEW
// =========================================================================

const SingleEffectView = memo(({ effect }: { effect: DynamicEffectLayer }) => {
  const frame = useCurrentFrame(); // Frame inside this <Sequence>
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(effect.durationSeconds * fps));
  const fadeIn = effect.fadeInFrames ?? 6;
  const fadeOut = effect.fadeOutFrames ?? 6;

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

  const effectiveIntensity = (effect.intensity ?? 0.5) * envelope;

  let effectContent: React.ReactNode = null;
  switch (effect.type) {
    case 'vignette':
      effectContent = (
        <VignetteEffect
          intensity={effectiveIntensity}
          radius={effect.config?.vignetteRadius}
        />
      );
      break;
    case 'film-grain':
      effectContent = (
        <FilmGrainEffect
          frame={frame}
          intensity={effectiveIntensity}
        />
      );
      break;
    case 'light-leak':
      effectContent = (
        <LightLeakEffect
          frame={frame}
          fps={fps}
          intensity={effectiveIntensity}
          color={effect.config?.leakColor}
        />
      );
      break;
    case 'chromatic-aberration':
      effectContent = (
        <ChromaticAberrationEffect
          intensity={effectiveIntensity}
          offsetPx={effect.config?.aberrationOffset}
        />
      );
      break;
    case 'glow-bloom':
      effectContent = (
        <GlowBloomEffect
          intensity={effectiveIntensity}
          color={effect.config?.leakColor}
        />
      );
      break;
    case 'lens-blur':
      effectContent = (
        <LensBlurEffect
          intensity={effectiveIntensity}
          blurPx={effect.config?.blurPx}
        />
      );
      break;
    default:
      effectContent = null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: effect.zIndex ?? 28,
        pointerEvents: 'none',
        mixBlendMode: effect.blendMode,
      }}
    >
      {effectContent}
    </div>
  );
});

// =========================================================================
// 4. MAIN MULTI-LAYER EFFECTS OVERLAY STAGE
// =========================================================================

export interface MultiLayerEffectsOverlayProps {
  effects?: DynamicEffectLayer[];
}

export const MultiLayerEffectsOverlay: React.FC<MultiLayerEffectsOverlayProps> = ({ effects = [] }) => {
  const { fps } = useVideoConfig();

  if (!effects || effects.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 28,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {effects.map((effect) => {
        const fromFrame = Math.round(effect.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(effect.durationSeconds * fps));

        return (
          <Sequence
            key={effect.id}
            name={`effect-${effect.type}-${effect.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleEffectView effect={effect} />
          </Sequence>
        );
      })}
    </div>
  );
};

