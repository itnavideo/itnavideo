import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BranchTarget {
  x: number;
  y: number;
  label?: string;
}

export interface BranchConnectorProps {
  sourceX?: number;
  sourceY?: number;
  targets?: BranchTarget[];
  strokeWidth?: number;
  strokeColor?: string;
  sourceLabel?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_TARGETS: BranchTarget[] = [
  { x: 340, y: 30, label: 'Worker 1' },
  { x: 340, y: 80, label: 'Worker 2' },
  { x: 340, y: 130, label: 'Worker 3' },
];

/**
 * BranchConnector — 1-to-N distributor / fork tree connector.
 * Distributes signal from a central source origin to multiple fan-out target branches with smooth curved or orthogonal arms.
 */
export function BranchConnector({
  sourceX = 40,
  sourceY = 80,
  targets = DEFAULT_TARGETS,
  strokeWidth = 2,
  strokeColor = '#38bdf8',
  sourceLabel = 'Dispatcher',
  delay = 0,
  width = 420,
  height = 180,
}: BranchConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const progress = interpolate(intro, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Source Hub Dot */}
        <circle cx={sourceX} cy={sourceY} r={6} fill={strokeColor} />

        {/* Branch Lines to Targets */}
        {targets.map((tgt, i) => {
          const midX = sourceX + (tgt.x - sourceX) * 0.45;
          const pathD = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${tgt.y}, ${tgt.x} ${tgt.y}`;

          return (
            <g key={i}>
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray="400"
                strokeDashoffset={interpolate(progress, [0, 1], [400, 0])}
              />

              {/* Target Terminal Arrow */}
              {progress > 0.9 && (
                <polygon
                  points={`${tgt.x},${tgt.y} ${tgt.x - 6},${tgt.y - 4} ${tgt.x - 6},${tgt.y + 4}`}
                  fill={strokeColor}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Source Label */}
      <div
        style={{
          position: 'absolute',
          left: sourceX,
          top: sourceY - 20,
          transform: 'translateX(-50%)',
          fontSize: 10,
          fontWeight: 800,
          color: strokeColor,
          whiteSpace: 'nowrap',
        }}
      >
        {sourceLabel}
      </div>

      {/* Target Labels */}
      {targets.map((tgt, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: tgt.x + 12,
            top: tgt.y,
            transform: 'translateY(-50%)',
            fontSize: 10,
            fontWeight: 700,
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            opacity: progress > 0.8 ? 1 : 0,
          }}
        >
          {tgt.label}
        </div>
      ))}
    </div>
  );
}
