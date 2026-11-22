import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DimensionCalloutProps {
  value?: string;
  tolerance?: string;
  length?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  extensionLength?: number;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * DimensionCallout — Precision engineering CAD dimension measurement tool.
 * Features dual-sided extension lines, dimension line with arrowheads,
 * and nominal metric/imperial measurement tags.
 */
export function DimensionCallout({
  value = '142.50 mm',
  tolerance = '±0.02',
  length = 200,
  orientation = 'horizontal',
  color = '#f59e0b',
  extensionLength = 24,
  delay = 0,
  style,
}: DimensionCalloutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const progress = interpolate(entrySpr, [0, 1], [0, 1]);

  const isHoriz = orientation === 'horizontal';

  return (
    <div style={{ display: 'inline-block', opacity: progress, ...style }}>
      <svg
        width={isHoriz ? length + 40 : extensionLength * 2 + 60}
        height={isHoriz ? extensionLength * 2 + 30 : length + 40}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id="dim-arrow-end" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={color} />
          </marker>
          <marker id="dim-arrow-start" viewBox="0 0 10 10" refX="3" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={color} />
          </marker>
        </defs>

        {isHoriz ? (
          <g transform="translate(20, 20)">
            {/* Left Extension Line */}
            <line x1="0" y1="-4" x2="0" y2={extensionLength} stroke={color} strokeWidth="1" />
            {/* Right Extension Line */}
            <line x1={length} y1="-4" x2={length} y2={extensionLength} stroke={color} strokeWidth="1" />

            {/* Dimension Line */}
            <line
              x1="0"
              y1={extensionLength * 0.7}
              x2={length}
              y2={extensionLength * 0.7}
              stroke={color}
              strokeWidth="1.5"
              markerStart="url(#dim-arrow-start)"
              markerEnd="url(#dim-arrow-end)"
            />

            {/* Value Label */}
            <text
              x={length / 2}
              y={extensionLength * 0.7 - 6}
              fill={color}
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {value} {tolerance && <tspan fill="#a1a1aa">({tolerance})</tspan>}
            </text>
          </g>
        ) : (
          <g transform="translate(30, 20)">
            {/* Top Extension Line */}
            <line x1="-4" y1="0" x2={extensionLength} y2="0" stroke={color} strokeWidth="1" />
            {/* Bottom Extension Line */}
            <line x1="-4" y1={length} x2={extensionLength} y2={length} stroke={color} strokeWidth="1" />

            {/* Dimension Line */}
            <line
              x1={extensionLength * 0.7}
              y1="0"
              x2={extensionLength * 0.7}
              y2={length}
              stroke={color}
              strokeWidth="1.5"
              markerStart="url(#dim-arrow-start)"
              markerEnd="url(#dim-arrow-end)"
            />

            {/* Value Label */}
            <text
              x={extensionLength * 0.7 + 10}
              y={length / 2 + 4}
              fill={color}
              fontSize="11"
              fontWeight="800"
              fontFamily="monospace"
            >
              {value}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
