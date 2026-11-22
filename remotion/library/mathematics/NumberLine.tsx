import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NumberLineProps {
  min?: number;
  max?: number;
  targetInterval?: [number, number];
  jumpArcs?: Array<{ from: number; to: number; label?: string }>;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * NumberLine — Mathematical real number line visualizer.
 * Features integer tick marks, highlighted range intervals,
 * and animated bouncing parabolic hops.
 */
export function NumberLine({
  min = -5,
  max = 5,
  targetInterval = [-2, 3],
  jumpArcs = [{ from: 0, to: 3, label: '+3' }, { from: 3, to: 1, label: '-2' }],
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 240,
}: NumberLineProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  const totalRange = max - min;
  const lineStartX = 50;
  const lineEndX = 450;
  const lineWidth = lineEndX - lineStartX;
  const lineY = 140;

  const getX = (val: number) => lineStartX + ((val - min) / totalRange) * lineWidth;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800 }}>Real Number Axis ℝ</h3>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 6,
            backgroundColor: `${accentColor}20`,
            border: `1px solid ${accentColor}60`,
            color: accentColor,
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          Interval [{targetInterval[0]}, {targetInterval[1]}]
        </span>
      </div>

      {/* SVG Canvas for Number Line & Jumping Arcs */}
      <div style={{ position: 'relative', flex: 1 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 180"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <marker id="num-arrow-r" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fff" />
            </marker>
            <marker id="num-arrow-l" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fff" />
            </marker>
          </defs>

          {/* Main Axis Line */}
          <line
            x1={lineStartX - 20}
            y1={lineY}
            x2={lineEndX + 20}
            y2={lineY}
            stroke="#fff"
            strokeWidth="2.5"
            markerEnd="url(#num-arrow-r)"
            markerStart="url(#num-arrow-l)"
          />

          {/* Highlighted Target Range Segment */}
          {targetInterval && (
            <line
              x1={getX(targetInterval[0])}
              y1={lineY}
              x2={getX(targetInterval[1])}
              y2={lineY}
              stroke={accentColor}
              strokeWidth="6"
              strokeLinecap="round"
              filter={`drop-shadow(0 0 8px ${accentColor})`}
            />
          )}

          {/* Integer Ticks and Labels */}
          {Array.from({ length: totalRange + 1 }).map((_, i) => {
            const val = min + i;
            const x = getX(val);
            const isZero = val === 0;

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={lineY - (isZero ? 12 : 7)}
                  x2={x}
                  y2={lineY + (isZero ? 12 : 7)}
                  stroke={isZero ? '#38bdf8' : '#71717a'}
                  strokeWidth={isZero ? 2.5 : 1.5}
                />
                <text
                  x={x}
                  y={lineY + 24}
                  fill={isZero ? '#38bdf8' : '#d4d4d8'}
                  fontSize={isZero ? '14' : '11'}
                  fontWeight={isZero ? '900' : '600'}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Jumping Hop Arcs */}
          {jumpArcs.map((arc, idx) => {
            const startX = getX(arc.from);
            const endX = getX(arc.to);
            const midX = (startX + endX) / 2;
            const archHeight = Math.abs(endX - startX) * 0.45;
            const midY = lineY - archHeight;

            return (
              <g key={idx}>
                <path
                  d={`M ${startX} ${lineY} Q ${midX} ${midY} ${endX} ${lineY}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                {arc.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill="#f59e0b"
                    fontSize="12"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {arc.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
