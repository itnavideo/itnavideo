import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGClipPathProps {
  id: string;
  type?: 'circle' | 'polygon-split' | 'expanding-rect' | 'custom';
  progress?: number; // 0 to 1
  animated?: boolean;
  delay?: number;
  durationInFrames?: number;
  customClip?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * SVGClipPath — Animated vector clipping path wrapper.
 * Provides sharp geometric clipping wipes (circle iris, diagonal split, expanding rectangle)
 * to reveal or hide underlying visual content without raster degradation.
 */
export function SVGClipPath({
  id,
  type = 'circle',
  progress: externalProgress,
  animated = true,
  delay = 0,
  durationInFrames = 40,
  customClip,
  children,
}: SVGClipPathProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const spr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
    durationInFrames,
  });

  const progress =
    externalProgress !== undefined
      ? externalProgress
      : animated
        ? interpolate(spr, [0, 1], [0, 1])
        : 1;

  const renderClipContent = () => {
    if (customClip) return customClip;

    switch (type) {
      case 'circle': {
        const radius = progress * 1500;
        return <circle cx="50%" cy="50%" r={radius} />;
      }
      case 'expanding-rect': {
        const w = `${(progress * 100).toFixed(1)}%`;
        return <rect x="0" y="0" width={w} height="100%" />;
      }
      case 'polygon-split': {
        const xOffset = progress * 100;
        return (
          <polygon
            points={`0,0 ${xOffset}%,0 ${Math.max(0, xOffset - 20)}%,100% 0,100%`}
          />
        );
      }
      default:
        return <rect x="0" y="0" width="100%" height="100%" />;
    }
  };

  return (
    <g>
      <defs>
        <clipPath id={id}>{renderClipContent()}</clipPath>
      </defs>

      {children && <g clipPath={`url(#${id})`}>{children}</g>}
    </g>
  );
}
