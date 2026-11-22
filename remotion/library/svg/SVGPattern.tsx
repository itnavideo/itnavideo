import React from 'react';

export interface SVGPatternProps {
  id: string;
  type?: 'dot-matrix' | 'isometric-grid' | 'diagonal-stripes' | 'crosshatch' | 'honeycomb';
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

/**
 * SVGPattern — Reusable SVG texture and pattern generator.
 * Produces architectural dot matrices, isometric blueprint grids,
 * diagonal hazard stripes, and high-tech honeycomb hex meshes.
 */
export function SVGPattern({
  id,
  type = 'dot-matrix',
  size = 32,
  stroke = 'rgba(255, 255, 255, 0.15)',
  strokeWidth = 1,
  opacity = 1,
}: SVGPatternProps) {
  const renderPatternElements = () => {
    switch (type) {
      case 'diagonal-stripes':
        return (
          <path
            d={`M 0 ${size} L ${size} 0 M 0 0 L ${size} ${size}`}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case 'crosshatch':
        return (
          <path
            d={`M 0 0 L ${size} 0 0 ${size} Z`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case 'isometric-grid':
        return (
          <path
            d={`M 0 ${size / 2} L ${size} 0 M 0 ${size / 2} L ${size} ${size}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case 'honeycomb':
        return (
          <polygon
            points={`${size * 0.5},0 ${size},${size * 0.25} ${size},${size * 0.75} ${size * 0.5},${size} 0,${size * 0.75} 0,${size * 0.25}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      case 'dot-matrix':
      default:
        return (
          <circle cx={size / 2} cy={size / 2} r={strokeWidth * 1.2} fill={stroke} />
        );
    }
  };

  return (
    <pattern
      id={id}
      width={size}
      height={size}
      patternUnits="userSpaceOnUse"
      style={{ opacity }}
    >
      {renderPatternElements()}
    </pattern>
  );
}
