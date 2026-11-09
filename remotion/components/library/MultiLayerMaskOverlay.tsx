import React, { memo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. MASK LAYER SCHEMA
// =========================================================================

export type MaskLayerType =
  | 'subtitle-scrim'
  | 'cinema-scope'
  | 'split-screen-divider'
  | 'spotlight-cutout';

export interface DynamicMaskLayer {
  id: string;
  type: MaskLayerType;
  startSeconds: number;
  durationSeconds: number;
  opacity?: number;
  config?: {
    scrimHeightPercent?: number;  // Default 35%
    cinemaBarHeightPx?: number;   // Default 120px
    splitDirection?: 'horizontal' | 'vertical'; // Default vertical
    splitLineColor?: string;      // Default '#FFFFFF'
    splitLineWidthPx?: number;    // Default 2
    spotlightX?: number;          // Default 540
    spotlightY?: number;          // Default 960
    spotlightRadius?: number;     // Default 250
  };
  zIndex?: number;
}

// =========================================================================
// 2. INDIVIDUAL MASK RENDERERS
// =========================================================================

/**
 * 1. Subtitle Scrim: Smooth dark gradient at bottom of screen
 * Guarantees captions are 100% readable even against bright or busy video backgrounds
 */
const SubtitleScrimMask = memo(({ opacity = 0.85, heightPercent = 38 }: { opacity?: number; heightPercent?: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: `${heightPercent}%`,
      background: `linear-gradient(to top, rgba(0, 0, 0, ${opacity}) 0%, rgba(0, 0, 0, ${opacity * 0.5}) 60%, transparent 100%)`,
      pointerEvents: 'none',
    }}
  />
));

/**
 * 2. Cinema Scope Letterbox: Clean cinematic top and bottom matte bars
 */
const CinemaScopeMask = memo(({ barHeightPx = 120 }: { barHeightPx?: number }) => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: `${barHeightPx}px`,
        backgroundColor: '#000000',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: `${barHeightPx}px`,
        backgroundColor: '#000000',
        pointerEvents: 'none',
      }}
    />
  </>
));

/**
 * 3. Split Screen Divider: Clean accent separator line
 */
const SplitScreenDivider = memo(({
  direction = 'vertical',
  lineColor = 'rgba(255, 255, 255, 0.4)',
  lineWidthPx = 3,
}: {
  direction?: 'horizontal' | 'vertical';
  lineColor?: string;
  lineWidthPx?: number;
}) => {
  if (direction === 'horizontal') {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: `${lineWidthPx}px`,
          backgroundColor: lineColor,
          transform: 'translateY(-50%)',
          boxShadow: `0 0 12px ${lineColor}`,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: `${lineWidthPx}px`,
        backgroundColor: lineColor,
        transform: 'translateX(-50%)',
        boxShadow: `0 0 12px ${lineColor}`,
        pointerEvents: 'none',
      }}
    />
  );
});

/**
 * 4. Spotlight Cutout: Dims background while keeping circular subject in full focus
 */
const SpotlightCutout = memo(({
  x = 540,
  y = 960,
  radius = 250,
  opacity = 0.65,
}: {
  x?: number;
  y?: number;
  radius?: number;
  opacity?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(circle at ${x}px ${y}px, transparent ${radius * 0.85}px, rgba(0, 0, 0, ${opacity}) ${radius * 1.15}px)`,
      pointerEvents: 'none',
    }}
  />
));

// =========================================================================
// 3. SINGLE TIME-WINDOWED MASK VIEW
// =========================================================================

const SingleMaskView = memo(({ mask }: { mask: DynamicMaskLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(mask.durationSeconds * fps));
  const fadeInFrames = 6;
  const fadeOutFrames = 6;

  let envelope = 1.0;
  if (frame < fadeInFrames) {
    envelope = interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateRight: 'clamp' });
  } else if (frame > totalDurationFrames - fadeOutFrames) {
    envelope = interpolate(frame, [totalDurationFrames - fadeOutFrames, totalDurationFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  const effectiveOpacity = (mask.opacity ?? 1.0) * envelope;

  let maskContent: React.ReactNode = null;
  switch (mask.type) {
    case 'subtitle-scrim':
      maskContent = (
        <SubtitleScrimMask
          opacity={0.85 * effectiveOpacity}
          heightPercent={mask.config?.scrimHeightPercent}
        />
      );
      break;
    case 'cinema-scope':
      maskContent = (
        <CinemaScopeMask barHeightPx={mask.config?.cinemaBarHeightPx} />
      );
      break;
    case 'split-screen-divider':
      maskContent = (
        <SplitScreenDivider
          direction={mask.config?.splitDirection}
          lineColor={mask.config?.splitLineColor}
          lineWidthPx={mask.config?.splitLineWidthPx}
        />
      );
      break;
    case 'spotlight-cutout':
      maskContent = (
        <SpotlightCutout
          x={mask.config?.spotlightX}
          y={mask.config?.spotlightY}
          radius={mask.config?.spotlightRadius}
          opacity={0.65 * effectiveOpacity}
        />
      );
      break;
    default:
      maskContent = null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: mask.zIndex ?? 18,
        opacity: effectiveOpacity,
        pointerEvents: 'none',
      }}
    >
      {maskContent}
    </div>
  );
});

// =========================================================================
// 4. MAIN MULTI-LAYER MASK OVERLAY STAGE
// =========================================================================

export interface MultiLayerMaskOverlayProps {
  masks?: DynamicMaskLayer[];
}

export const MultiLayerMaskOverlay: React.FC<MultiLayerMaskOverlayProps> = ({ masks = [] }) => {
  const { fps } = useVideoConfig();

  if (!masks || masks.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 18,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {masks.map((mask) => {
        const fromFrame = Math.round(mask.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(mask.durationSeconds * fps));

        return (
          <Sequence
            key={mask.id}
            name={`mask-${mask.type}-${mask.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleMaskView mask={mask} />
          </Sequence>
        );
      })}
    </div>
  );
};

