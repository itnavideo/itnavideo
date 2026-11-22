import React, { useId } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SVGConnectorProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type?: 'orthogonal' | 'bezier' | 'direct' | 'stepped';
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
  animated?: boolean;
  pulsePackets?: boolean;
  packetCount?: number;
  packetColor?: string;
  label?: string;
  delay?: number;
  durationInFrames?: number;
}

/**
 * SVGConnector — High-performance flow and architectural connector.
 * Draws dynamic lines between UI nodes/boxes with orthogonal corners,
 * smooth S-curves, and high-velocity traveling data packet pulses.
 */
export function SVGConnector({
  fromX = 100,
  fromY = 100,
  toX = 300,
  toY = 250,
  type = 'orthogonal',
  stroke = '#10b981',
  strokeWidth = 2.5,
  dashed = false,
  animated = true,
  pulsePackets = true,
  packetCount = 2,
  packetColor = '#38bdf8',
  label,
  delay = 0,
  durationInFrames = 35,
}: SVGConnectorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const spr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
    durationInFrames,
  });

  const progress = animated ? interpolate(spr, [0, 1], [0, 1]) : 1;
  const pathLength = 1000;
  const dashoffset = interpolate(progress, [0, 1], [pathLength, 0]);

  // Construct path string based on connector type
  let pathD = '';
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  switch (type) {
    case 'orthogonal':
      pathD = `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`;
      break;
    case 'stepped':
      pathD = `M ${fromX} ${fromY} V ${midY} H ${toX} V ${toY}`;
      break;
    case 'bezier':
      pathD = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
      break;
    case 'direct':
    default:
      pathD = `M ${fromX} ${fromY} L ${toX} ${toY}`;
      break;
  }

  return (
    <g>
      {/* Base Connector Path */}
      <path
        d={pathD}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={pathLength}
        strokeDasharray={dashed ? '6 6' : (animated ? pathLength : undefined)}
        strokeDashoffset={animated && !dashed ? dashoffset : undefined}
      />

      {/* Traveling Data Packets */}
      {pulsePackets && (
        <>
          {Array.from({ length: packetCount }).map((_, i) => {
            const packetOffset = ((frame * 1.5 + i * (60 / packetCount)) % 60) / 60;
            // Approximate linear interpolation between points
            const currentX = fromX + (toX - fromX) * packetOffset;
            const currentY = fromY + (toY - fromY) * packetOffset;

            return (
              <circle
                key={i}
                cx={currentX}
                cy={currentY}
                r={strokeWidth * 1.4}
                fill={packetColor}
                filter="drop-shadow(0px 0px 5px #38bdf8)"
              />
            );
          })}
        </>
      )}

      {/* Center Label Pill */}
      {label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-35}
            y={-12}
            width={70}
            height={24}
            rx={6}
            fill="#09090b"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            fill="#e4e4e7"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
