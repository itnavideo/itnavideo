import React from 'react';
import { interpolate } from 'remotion';

export interface WhiteboardFlowArrowProps {
  direction?: 'down' | 'right' | 'curved_down' | 'curved_up' | 'loop';
  drawProgress?: number; // 0 to 1
  color?: string;
  width?: number;
  height?: number;
  label?: string;
  fontFamily?: string;
  className?: string;
}

/**
 * WhiteboardFlowArrow
 * Authentic SeeKen-style hand-drawn connecting arrow:
 * - Hand-sketched curve with natural organic wobble.
 * - Progressive stroke reveal (strokeDashoffset) as if drawn live by marker.
 * - Arrowhead drawn at the end of the stroke.
 * - Optional flow step badge or label (e.g., "Step ➔ Action ➔ Result").
 */
export const WhiteboardFlowArrow: React.FC<WhiteboardFlowArrowProps> = ({
  direction = 'down',
  drawProgress = 1,
  color = '#0F172A',
  width = 80,
  height = 80,
  label,
  fontFamily,
  className = '',
}) => {
  const p = Math.min(1, Math.max(0, drawProgress));

  // Determine path based on direction
  let pathD = '';
  let headD = '';
  let pathLength = 100;
  let labelX = 50;
  let labelY = 50;

  if (direction === 'down') {
    // Curved downward arrow (connecting vertical cards)
    pathD = 'M 50 10 C 65 35, 35 60, 50 85';
    headD = 'M 38 72 L 50 86 L 62 72';
    pathLength = 95;
    labelX = 75;
    labelY = 48;
  } else if (direction === 'curved_down') {
    // S-curve flowing down & right
    pathD = 'M 20 15 C 60 20, 80 50, 40 75 L 50 85';
    headD = 'M 35 75 L 52 86 L 56 68';
    pathLength = 120;
    labelX = 70;
    labelY = 45;
  } else if (direction === 'curved_up') {
    // Loop back / feedback arrow
    pathD = 'M 80 85 C 30 75, 20 35, 60 20 L 75 22';
    headD = 'M 65 10 L 78 22 L 64 34';
    pathLength = 130;
    labelX = 35;
    labelY = 55;
  } else {
    // Horizontal flow arrow (Idea ➔ Action ➔ Result)
    pathD = 'M 10 50 C 35 35, 65 65, 88 50';
    headD = 'M 74 38 L 90 50 L 74 62';
    pathLength = 90;
    labelX = 50;
    labelY = 28;
  }

  // Stroke reveal: Shaft draws from 0 to 0.85, Arrowhead draws from 0.85 to 1.0
  const shaftP = Math.min(1, p / 0.82);
  const headP = Math.min(1, Math.max(0, (p - 0.82) / 0.18));
  const strokeOffset = pathLength * (1 - shaftP);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height, overflow: 'visible' }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Main curved arrow shaft */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeOffset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />

        {/* Dynamic hand-drawn arrowhead */}
        {headP > 0 && (
          <path
            d={headD}
            fill="none"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={40}
            strokeDashoffset={40 * (1 - headP)}
          />
        )}

        {/* Optional handwritten step pill / label */}
        {label && p > 0.5 && (
          <text
            x={labelX}
            y={labelY}
            fill={color}
            fontSize="14"
            fontWeight="900"
            fontFamily={fontFamily || 'sans-serif'}
            textAnchor="middle"
            opacity={Math.min(1, (p - 0.5) / 0.3)}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};
