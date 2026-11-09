import React, { memo, useId } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// =========================================================================
// 1. SHAPE CLIPPING & REVEAL SCHEMA
// =========================================================================

export type ShapeClippingMode =
  | 'circle-reveal'       // Expanding/contracting iris circle wipe
  | 'circle-static'       // Clean circular mask (for avatars, illustrations)
  | 'diagonal-wipe'       // Angled 45-degree cinematic reveal wipe
  | 'horizontal-wipe'     // Left-to-right or right-to-left wipe
  | 'vertical-wipe'       // Top-to-bottom or bottom-to-top wipe
  | 'squircle'            // Modern Apple-style rounded squircle
  | 'pill'                // Rounded capsule pill
  | 'star'                // 5-point graphic star cutout
  | 'diamond'             // Rhombus diamond card cutout
  | 'custom-svg-path';    // Any custom SVG path mask (e.g. logo or sticker silhouette)

export interface ShapeClippingRevealAnimation {
  startOffsetFrame?: number;  // Default 0
  durationInFrames?: number;  // Default 15
  direction?: 'in' | 'out';   // 'in' reveals content, 'out' hides it
  easing?: 'spring' | 'linear' | 'ease-out';
  origin?: { x: number; y: number }; // Relative 0-1, default { x: 0.5, y: 0.5 }
}

export interface ShapeClippingContainerProps {
  mode: ShapeClippingMode;
  children: React.ReactNode;
  reveal?: ShapeClippingRevealAnimation;
  customSvgPath?: string;      // Used when mode === 'custom-svg-path'
  cornerRadiusPx?: number;    // Used for squircle / pill
  border?: {
    color: string;
    widthPx: number;
    style?: 'solid' | 'dashed';
  };
  style?: React.CSSProperties;
}

// =========================================================================
// 2. REVEAL CLIP-PATH MATHEMATICAL EVALUATORS (100% GPU-Accelerated)
// =========================================================================

function computeClipPathString(
  mode: ShapeClippingMode,
  progress: number, // 0 (hidden) to 1 (fully revealed)
  origin: { x: number; y: number } = { x: 0.5, y: 0.5 },
  cornerRadiusPx: number = 24,
  customClipPathId?: string
): string {
  const ox = origin.x * 100;
  const oy = origin.y * 100;

  switch (mode) {
    case 'circle-reveal': {
      // Circle expands from 0% radius to 150% radius covering full canvas
      const radius = progress * 150;
      return `circle(${radius.toFixed(2)}% at ${ox.toFixed(1)}% ${oy.toFixed(1)}%)`;
    }

    case 'circle-static': {
      return `circle(50% at 50% 50%)`;
    }

    case 'diagonal-wipe': {
      // 45-degree angled polygon wipe from top-left to bottom-right
      // At progress 0: polygon(-50% 0%, 0% -50%, -50% -50%, ...)
      // At progress 1: polygon(0 0, 100% 0, 100% 100%, 0 100%)
      const p = progress * 200; // 0 to 200%
      const p1 = Math.min(100, Math.max(0, p));
      const p2 = Math.min(100, Math.max(0, p - 50));
      const p3 = Math.min(100, Math.max(0, p - 100));
      return `polygon(0 0, ${p.toFixed(1)}% 0, ${(p - 50).toFixed(1)}% 100%, 0 100%)`;
    }

    case 'horizontal-wipe': {
      const rightCut = (1 - progress) * 100;
      return `inset(0 ${rightCut.toFixed(2)}% 0 0)`;
    }

    case 'vertical-wipe': {
      const bottomCut = (1 - progress) * 100;
      return `inset(0 0 ${bottomCut.toFixed(2)}% 0)`;
    }

    case 'squircle': {
      // Smooth squircle rounded-corner polygon/inset
      return `inset(0 0 0 0 round ${cornerRadiusPx}px)`;
    }

    case 'pill': {
      return `inset(0 0 0 0 round 9999px)`;
    }

    case 'star': {
      // 5-point star polygon
      return `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`;
    }

    case 'diamond': {
      // Rhombus diamond polygon
      return `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`;
    }

    case 'custom-svg-path': {
      return customClipPathId ? `url(#${customClipPathId})` : 'none';
    }

    default:
      return 'none';
  }
}

// =========================================================================
// 3. SHAPE CLIPPING CONTAINER COMPONENT
// =========================================================================

export const ShapeClippingContainer: React.FC<ShapeClippingContainerProps> = memo(({
  mode,
  children,
  reveal,
  customSvgPath,
  cornerRadiusPx = 24,
  border,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uniqueSvgId = useId().replace(/:/g, '_');

  // Compute reveal progress
  let progress = 1.0;
  if (reveal) {
    const startFrame = reveal.startOffsetFrame ?? 0;
    const duration = Math.max(1, reveal.durationInFrames ?? 15);
    const localFrame = frame - startFrame;

    if (reveal.easing === 'spring') {
      const sp = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, stiffness: 180, mass: 0.6 },
      });
      progress = Math.min(1, Math.max(0, sp));
    } else {
      progress = interpolate(localFrame, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic out
      });
    }

    if (reveal.direction === 'out') {
      progress = 1.0 - progress;
    }
  }

  const clipPathString = computeClipPathString(
    mode,
    progress,
    reveal?.origin,
    cornerRadiusPx,
    customSvgPath ? `custom-clip-${uniqueSvgId}` : undefined
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        clipPath: clipPathString,
        WebkitClipPath: clipPathString,
        overflow: 'hidden',
        border: border ? `${border.widthPx}px ${border.style ?? 'solid'} ${border.color}` : undefined,
        ...style,
      }}
    >
      {/* SVG Defs for custom SVG path clip-path */}
      {mode === 'custom-svg-path' && customSvgPath ? (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id={`custom-clip-${uniqueSvgId}`} clipPathUnits="objectBoundingBox">
              <path d={customSvgPath} />
            </clipPath>
          </defs>
        </svg>
      ) : null}

      {children}
    </div>
  );
});

