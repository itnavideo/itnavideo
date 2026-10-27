import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  WHITEBOARD_VECTOR_DRAWINGS,
  VectorDrawingDef,
  resolveVectorDrawing,
} from '../../../lib/whiteboard/vectorDrawings';
import { resolveTheme, ThemeMode } from './themeTokens';

export interface VectorDrawingIconProps {
  /** Explicit drawing ID from WHITEBOARD_VECTOR_DRAWINGS (e.g. 'character_doctor', 'business_handshake_deal') */
  drawingId?: string;
  /** Semantic keyword to auto-resolve drawing if ID is not provided (e.g. 'doctor', 'strategy', 'atom') */
  keyword?: string;
  /** Primary stroke color override */
  color?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Animate stroke drawing */
  animated?: boolean;
  delayFrames?: number;
  drawDurationFrames?: number;
  theme?: ThemeMode;
  canvasBgColor?: string;
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
  frameOverride?: number;
}

/**
 * Reusable wrapper that bridges the 15 procedural SVG vector drawings in lib/whiteboard/vectorDrawings.ts
 * to any Remotion template or card layout. Reuses existing vector paths with zero duplication.
 */
export const VectorDrawingIcon: React.FC<VectorDrawingIconProps> = ({
  drawingId,
  keyword,
  color,
  strokeWidth,
  animated = false,
  delayFrames = 0,
  drawDurationFrames = 20,
  theme = 'auto',
  canvasBgColor,
  size = 64,
  style = {},
  className = '',
  frameOverride,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frameOverride !== undefined ? frameOverride : frame;

  // Resolve definition from existing registry
  const def: VectorDrawingDef =
    (drawingId && WHITEBOARD_VECTOR_DRAWINGS[drawingId]) ||
    resolveVectorDrawing(keyword);

  if (!def || !def.strokes) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);

  // Map whiteboard colorKeys to theme-consistent colors
  const getColorForStroke = (colorKey?: string): string => {
    if (color) return color;
    switch (colorKey) {
      case 'accent':
        return palette.accent;
      case 'highlight':
        return '#F59E0B';
      case 'danger':
        return '#EF4444';
      case 'success':
        return '#10B981';
      case 'white':
        return '#FFFFFF';
      case 'primary':
      default:
        return palette.textPrimary;
    }
  };

  const progress = animated
    ? interpolate(activeFrame, [delayFrames, delayFrames + drawDurationFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <svg
      viewBox={def.viewBox || '0 0 100 100'}
      className={className}
      style={{
        width: size,
        height: size,
        overflow: 'visible',
        display: 'inline-block',
        ...style,
      }}
    >
      {def.strokes.map((stroke, idx) => {
        const strokeColor = getColorForStroke(stroke.colorKey);
        const strokeLen = stroke.len || 100;
        const width = strokeWidth || stroke.strokeWidth || 3;
        const strokeDashoffset = animated ? strokeLen * (1 - progress) : 0;

        return (
          <path
            key={idx}
            d={stroke.d}
            fill={stroke.fill || 'none'}
            stroke={strokeColor}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: animated ? strokeLen : undefined,
              strokeDashoffset: animated ? strokeDashoffset : undefined,
              transition: 'stroke 0.2s ease',
            }}
          />
        );
      })}
    </svg>
  );
};

export default VectorDrawingIcon;
