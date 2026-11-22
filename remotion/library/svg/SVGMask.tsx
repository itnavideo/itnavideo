import React from 'react';

export interface SVGMaskProps {
  id: string;
  maskContent: React.ReactNode;
  children?: React.ReactNode;
  maskUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  maskContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
}

/**
 * SVGMask — High-leverage vector mask wrapper.
 * Enables stencil cutouts, alpha gradients, and luminance-based reveals
 * across any SVG graphic, illustration, or visual layer.
 */
export function SVGMask({
  id,
  maskContent,
  children,
  maskUnits = 'objectBoundingBox',
  maskContentUnits = 'userSpaceOnUse',
}: SVGMaskProps) {
  return (
    <g>
      <defs>
        <mask id={id} maskUnits={maskUnits} maskContentUnits={maskContentUnits}>
          {maskContent}
        </mask>
      </defs>

      {children && <g mask={`url(#${id})`}>{children}</g>}
    </g>
  );
}
