import React, { memo, useId } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. PATTERN & TEXTURE LAYER SCHEMA
// =========================================================================

export type PatternTextureType =
  | 'halftone'        // Comic / Pop-art halftone dot matrix
  | 'noise'           // Organic cinematic film / micro-noise texture
  | 'hatch'           // Single-direction diagonal parallel lines
  | 'crosshatch'      // Bidirectional intersecting sketch lines
  | 'waves'           // Flowing topographic / sound wave contour lines
  | 'mesh'            // Futuristic isometric wireframe / technical grid mesh
  | 'chevron'         // Decorative geometric zigzag texture
  | 'stipple';        // Subtle organic stippling micro-dots

export interface PatternTextureConfig {
  spacing?: number;       // Pattern tile spacing in px (e.g. 16, 24, 32)
  strokeWidth?: number;   // Line / stroke thickness in px (default 1.5)
  dotRadius?: number;     // For halftone / stipple (default 3)
  angleDeg?: number;      // For hatch / crosshatch (default 45)
  waveFrequency?: number; // For waves (default 0.02)
  waveAmplitude?: number; // For waves in px (default 18)
}

export interface DynamicPatternLayer {
  id: string;
  type: PatternTextureType;
  startSeconds: number;
  durationSeconds: number;
  color?: string;         // Default '#FFFFFF'
  opacity?: number;       // Default 0.18 (clean, non-distracting)
  blendMode?: React.CSSProperties['mixBlendMode']; // Default 'overlay'
  config?: PatternTextureConfig;
  animated?: boolean;     // Dynamic frame-based drift
  speed?: number;         // Animation speed multiplier (default 1.0)
  fadeInFrames?: number;  // Default 6
  fadeOutFrames?: number; // Default 6
  zIndex?: number;        // Default 12
}

// =========================================================================
// 2. PROCEDURAL SVG PATTERN GENERATORS (Zero Heavy Compute, Ultra-Lightweight)
// =========================================================================

const HalftonePattern = memo(({ id, color, spacing = 20, dotRadius = 4, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  dotRadius?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`halftone-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternUnits="userSpaceOnUse"
  >
    <circle cx={spacing / 2} cy={spacing / 2} r={dotRadius} fill={color} />
  </pattern>
));

const HatchPattern = memo(({ id, color, spacing = 18, strokeWidth = 1.5, angleDeg = 45, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  strokeWidth?: number;
  angleDeg?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`hatch-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternTransform={`rotate(${angleDeg})`}
    patternUnits="userSpaceOnUse"
  >
    <line x1={0} y1={0} x2={0} y2={spacing} stroke={color} strokeWidth={strokeWidth} />
  </pattern>
));

const CrosshatchPattern = memo(({ id, color, spacing = 22, strokeWidth = 1.5, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  strokeWidth?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`crosshatch-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternTransform="rotate(45)"
    patternUnits="userSpaceOnUse"
  >
    <line x1={0} y1={0} x2={spacing} y2={0} stroke={color} strokeWidth={strokeWidth} />
    <line x1={0} y1={0} x2={0} y2={spacing} stroke={color} strokeWidth={strokeWidth} />
  </pattern>
));

const MeshPattern = memo(({ id, color, spacing = 36, strokeWidth = 1.0, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  strokeWidth?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`mesh-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternUnits="userSpaceOnUse"
  >
    <rect width={spacing} height={spacing} fill="none" stroke={color} strokeWidth={strokeWidth} />
    <circle cx={0} cy={0} r={1.5} fill={color} />
    <circle cx={spacing} cy={0} r={1.5} fill={color} />
    <circle cx={0} cy={spacing} r={1.5} fill={color} />
    <circle cx={spacing} cy={spacing} r={1.5} fill={color} />
  </pattern>
));

const ChevronPattern = memo(({ id, color, spacing = 28, strokeWidth = 1.5, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  strokeWidth?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`chevron-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternUnits="userSpaceOnUse"
  >
    <path
      d={`M 0,${spacing * 0.75} L ${spacing / 2},${spacing * 0.25} L ${spacing},${spacing * 0.75}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </pattern>
));

const StipplePattern = memo(({ id, color, spacing = 24, driftOffset = 0 }: {
  id: string;
  color: string;
  spacing?: number;
  driftOffset?: number;
}) => (
  <pattern
    id={`stipple-${id}`}
    x={driftOffset}
    y={driftOffset}
    width={spacing}
    height={spacing}
    patternUnits="userSpaceOnUse"
  >
    <circle cx={spacing * 0.2} cy={spacing * 0.3} r={1.0} fill={color} opacity={0.6} />
    <circle cx={spacing * 0.7} cy={spacing * 0.15} r={1.2} fill={color} opacity={0.8} />
    <circle cx={spacing * 0.4} cy={spacing * 0.8} r={0.9} fill={color} opacity={0.5} />
    <circle cx={spacing * 0.85} cy={spacing * 0.65} r={1.4} fill={color} opacity={0.9} />
  </pattern>
));

/**
 * Topographic Waves Generator (Sinusoidal paths flowing across canvas)
 */
const WavesTexture = memo(({
  color,
  frame,
  fps,
  speed = 1.0,
  spacing = 70,
  amplitude = 18,
  frequency = 0.008,
}: {
  color: string;
  frame: number;
  fps: number;
  speed?: number;
  spacing?: number;
  amplitude?: number;
  frequency?: number;
}) => {
  const t = (frame / fps) * speed * 1.5;
  const linesCount = Math.ceil(1920 / spacing) + 2;
  const paths: string[] = [];

  for (let i = 0; i < linesCount; i++) {
    const baseY = i * spacing;
    const pts: string[] = [];
    for (let x = 0; x <= 1080; x += 40) {
      const y = baseY + Math.sin(x * frequency + t + i * 0.4) * amplitude;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    paths.push(`M ${pts.join(' L ')}`);
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
      {paths.map((d, idx) => (
        <path
          key={idx}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
      ))}
    </svg>
  );
});

/**
 * Procedural Fractal Noise Texture
 */
const NoiseTexture = memo(({ frame, color }: { frame: number; color: string }) => {
  const seed = (frame % 20) * 17;
  return (
    <svg width="100%" height="100%" style={{ width: '100%', height: '100%' }}>
      <filter id={`noise-texture-${seed}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves={3}
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#noise-texture-${seed})`} fill={color} />
    </svg>
  );
});

// =========================================================================
// 3. SINGLE TIME-WINDOWED PATTERN VIEW
// =========================================================================

const SinglePatternView = memo(({ layer }: { layer: DynamicPatternLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uniqueId = useId().replace(/:/g, '_');

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

  const effectiveOpacity = (layer.opacity ?? 0.18) * envelope;
  const color = layer.color ?? '#FFFFFF';
  const speed = layer.speed ?? 1.0;
  const driftOffset = layer.animated ? (frame / fps) * speed * 12 : 0;

  let patternElement: React.ReactNode = null;
  let patternId = '';

  switch (layer.type) {
    case 'halftone':
      patternId = `halftone-${uniqueId}`;
      patternElement = (
        <HalftonePattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          dotRadius={layer.config?.dotRadius}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'hatch':
      patternId = `hatch-${uniqueId}`;
      patternElement = (
        <HatchPattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          strokeWidth={layer.config?.strokeWidth}
          angleDeg={layer.config?.angleDeg}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'crosshatch':
      patternId = `crosshatch-${uniqueId}`;
      patternElement = (
        <CrosshatchPattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          strokeWidth={layer.config?.strokeWidth}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'mesh':
      patternId = `mesh-${uniqueId}`;
      patternElement = (
        <MeshPattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          strokeWidth={layer.config?.strokeWidth}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'chevron':
      patternId = `chevron-${uniqueId}`;
      patternElement = (
        <ChevronPattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          strokeWidth={layer.config?.strokeWidth}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'stipple':
      patternId = `stipple-${uniqueId}`;
      patternElement = (
        <StipplePattern
          id={uniqueId}
          color={color}
          spacing={layer.config?.spacing}
          driftOffset={driftOffset}
        />
      );
      break;

    case 'waves':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: effectiveOpacity,
            mixBlendMode: layer.blendMode ?? 'overlay',
            zIndex: layer.zIndex ?? 12,
            pointerEvents: 'none',
          }}
        >
          <WavesTexture
            color={color}
            frame={frame}
            fps={fps}
            speed={speed}
            spacing={layer.config?.spacing}
            amplitude={layer.config?.waveAmplitude}
            frequency={layer.config?.waveFrequency}
          />
        </div>
      );

    case 'noise':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: effectiveOpacity,
            mixBlendMode: layer.blendMode ?? 'overlay',
            zIndex: layer.zIndex ?? 12,
            pointerEvents: 'none',
          }}
        >
          <NoiseTexture frame={frame} color={color} />
        </div>
      );

    default:
      return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: effectiveOpacity,
        mixBlendMode: layer.blendMode ?? 'overlay',
        zIndex: layer.zIndex ?? 12,
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" style={{ width: '100%', height: '100%' }}>
        <defs>{patternElement}</defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
});

// =========================================================================
// 4. MAIN MULTI-LAYER PATTERN OVERLAY STAGE
// =========================================================================

export interface MultiLayerPatternOverlayProps {
  patterns?: DynamicPatternLayer[];
}

export const MultiLayerPatternOverlay: React.FC<MultiLayerPatternOverlayProps> = ({ patterns = [] }) => {
  const { fps } = useVideoConfig();

  if (!patterns || patterns.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 12,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {patterns.map((pattern) => {
        const fromFrame = Math.round(pattern.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(pattern.durationSeconds * fps));

        return (
          <Sequence
            key={pattern.id}
            name={`pattern-${pattern.type}-${pattern.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SinglePatternView layer={pattern} />
          </Sequence>
        );
      })}
    </div>
  );
};
