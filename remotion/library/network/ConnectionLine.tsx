import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ConnectionLineProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  curveType?: 'straight' | 'bezier' | 'orthogonal';
  color?: string;
  strokeWidth?: number;
  showPacketPulse?: boolean;
  label?: string;
  width?: number | string;
  height?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  startX = 50,
  startY = 80,
  endX = 450,
  endY = 80,
  curveType = 'bezier',
  color = '#0066FF',
  strokeWidth = 3,
  showPacketPulse = true,
  label = 'Real-time WebSocket Stream',
  width = '100%',
  height = 160,
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  // Calculate path
  let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
  if (curveType === 'bezier') {
    const cpX1 = startX + (endX - startX) * 0.4;
    const cpY1 = startY - 50;
    const cpX2 = startX + (endX - startX) * 0.6;
    const cpY2 = endY + 50;
    pathD = `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;
  } else if (curveType === 'orthogonal') {
    const midX = (startX + endX) / 2;
    pathD = `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
  }

  const approxLength = 600;
  const strokeDashoffset = interpolate(lineSpring, [0, 1], [approxLength, 0]);

  // Traveling packet pulse along the line
  const packetProgress = (frame % (fps * 2)) / (fps * 2);

  return (
    <div
      style={{
        width,
        height: `${height}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 500 160" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="packetGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Base connecting line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={approxLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />

        {/* Start Pin */}
        <circle cx={startX} cy={startY} r={6} fill={color} opacity={lineSpring} />

        {/* End Pin */}
        <circle cx={endX} cy={endY} r={6} fill={color} opacity={lineSpring} />
      </svg>

      {/* Label Badge */}
      {label && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: `${color}22`,
            border: `1px solid ${color}44`,
            color,
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            opacity: lineSpring,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
