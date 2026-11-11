import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  WHITEBOARD_VECTOR_DRAWINGS,
  VectorDrawingDef,
  resolveVectorDrawing,
} from '../../../lib/whiteboard/vectorDrawings';
import {
  SVG_MASTER_CATALOG,
  resolveSvgFromMasterCatalog,
  type SvgConceptItem,
} from '../../../lib/visuals/svgMasterCatalog';
import { resolveTheme, ThemeMode } from './themeTokens';

export interface VectorDrawingIconProps {
  /** Explicit drawing ID from WHITEBOARD_VECTOR_DRAWINGS or SVG_MASTER_CATALOG */
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
 * Reusable wrapper that bridges procedural vector drawings & the 500+ SVG Master Catalog
 * to any Remotion template or card layout with zero visual repetition.
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

  // 1. Check if drawingId is in SVG_MASTER_CATALOG (500+ concepts)
  const masterSvg: SvgConceptItem | undefined =
    drawingId && SVG_MASTER_CATALOG[drawingId]
      ? SVG_MASTER_CATALOG[drawingId]
      : undefined;

  // 2. Check if drawingId is in WHITEBOARD_VECTOR_DRAWINGS
  const whiteboardDef: VectorDrawingDef | undefined =
    drawingId && WHITEBOARD_VECTOR_DRAWINGS[drawingId]
      ? WHITEBOARD_VECTOR_DRAWINGS[drawingId]
      : undefined;

  // 3. If neither explicit ID matched, resolve by keyword
  const resolvedDef =
    masterSvg ||
    whiteboardDef ||
    (keyword ? resolveSvgFromMasterCatalog(keyword) : resolveVectorDrawing(keyword));

  if (!resolvedDef) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);

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

  // Render SVG Master Catalog item
  if ('paths' in resolvedDef) {
    const item = resolvedDef as SvgConceptItem;
    // S3-hosted designed SVG: render the hosted illustration file directly.
    if (item.url) {
      return (
        <img
          src={item.url}
          alt={item.name}
          className={className}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            display: 'inline-block',
            opacity: progress,
            ...style,
          }}
        />
      );
    }
    return (
      <svg
        viewBox={item.viewBox || '0 0 100 100'}
        className={className}
        style={{
          width: size,
          height: size,
          overflow: 'visible',
          display: 'inline-block',
          ...style,
        }}
      >
        {item.paths.map((p, idx) => {
          const strokeColor = getColorForStroke(p.colorKey);
          const width = strokeWidth || p.strokeWidth || 2.8;
          return (
            <path
              key={idx}
              d={p.d}
              fill={p.fill || 'none'}
              stroke={strokeColor}
              strokeWidth={width}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: progress,
                transition: 'stroke 0.2s ease',
              }}
            />
          );
        })}
      </svg>
    );
  }

  // Render Whiteboard Drawing definition
  const def = resolvedDef as VectorDrawingDef;
  if (!def.strokes) return null;

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
