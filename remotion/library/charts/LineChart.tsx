import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LineChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  title?: string;
  subtitle?: string;
  data?: LineChartDataPoint[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  lineColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showArea?: boolean;
  peakBadgeText?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_LINE_DATA: LineChartDataPoint[] = [
  { label: 'Jan', value: 24 },
  { label: 'Feb', value: 38 },
  { label: 'Mar', value: 32 },
  { label: 'Apr', value: 58 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 94 },
  { label: 'Jul', value: 128 },
];

export const LineChart: React.FC<LineChartProps> = ({
  title = 'Audience Retention & Growth',
  subtitle = 'Month-over-month active trajectory across platforms',
  data = DEFAULT_LINE_DATA,
  width = '100%',
  height = 540,
  theme = 'light',
  lineColor = '#EA580C',
  strokeWidth = 6,
  showDots = true,
  showGrid = true,
  showArea = true,
  peakBadgeText = 'All-Time High',
  delayFrames = 4,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';

  const items = data && data.length > 1 ? data : DEFAULT_LINE_DATA;
  const values = items.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, 1);
  const valRange = maxVal - minVal || 1;

  // Broad 1000x380 SVG coordinates for ultra-sharp video scale
  const svgWidth = 1000;
  const svgHeight = 360;
  const padX = 60;
  const padY = 40;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padY * 2;

  const points = items.map((item, idx) => {
    const x = padX + (idx / (items.length - 1)) * plotWidth;
    const y = padY + plotHeight - ((item.value - minVal) / valRange) * plotHeight;
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padY} L ${points[0].x} ${svgHeight - padY} Z`;

  const lineSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const approxPathLength = 1800;
  const strokeDashoffset = interpolate(lineSpring, [0, 1], [approxPathLength, 0]);

  const peakIndex = values.indexOf(maxVal);
  const peakPoint = points[peakIndex];

  return (
    <div
      style={{
        width,
        height: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        padding: 0,
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: textColor, letterSpacing: '-0.02em' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '6px 0 0 0', fontSize: '18px', fontWeight: 500, color: textMuted }}>
                {subtitle}
              </p>
            )}
          </div>
          {peakBadgeText && (
            <div
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: `${lineColor}22`,
                border: `2px solid ${lineColor}66`,
                color: lineColor,
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: `0 4px 16px ${lineColor}33`,
              }}
            >
              {peakBadgeText}
            </div>
          )}
        </div>
      )}

      {/* SVG Container */}
      <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0 }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={lineColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines */}
          {showGrid &&
            [0, 0.33, 0.66, 1].map((pct, i) => {
              const y = padY + plotHeight * pct;
              return (
                <line
                  key={i}
                  x1={padX}
                  y1={y}
                  x2={svgWidth - padX}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              );
            })}

          {/* Area Fill */}
          {showArea && (
            <path
              d={areaD}
              fill="url(#lineAreaGradient)"
              opacity={interpolate(lineSpring, [0, 0.4, 1], [0, 0.6, 1])}
            />
          )}

          {/* Animated Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={approxPathLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#lineGlow)"
          />

          {/* Dots on Vertices */}
          {showDots &&
            points.map((pt, idx) => {
              const dotSpring = spring({
                frame: Math.max(0, frame - delayFrames - idx * 3),
                fps,
                config: { damping: 12, stiffness: 120 },
              });

              return (
                <g key={idx} style={{ opacity: dotSpring, transform: `scale(${dotSpring})`, transformOrigin: `${pt.x}px ${pt.y}px` }}>
                  <circle cx={pt.x} cy={pt.y} r={9} fill={lineColor} stroke={bgColor} strokeWidth={4} />
                </g>
              );
            })}

          {/* Peak Highlight Pulse Dot */}
          {peakPoint && lineSpring > 0.8 && (
            <g>
              <circle
                cx={peakPoint.x}
                cy={peakPoint.y}
                r={18}
                fill={lineColor}
                opacity={0.3}
              />
              <circle
                cx={peakPoint.x}
                cy={peakPoint.y}
                r={9}
                fill="#FFFFFF"
                stroke={lineColor}
                strokeWidth={3}
              />
            </g>
          )}

          {/* X Axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={svgHeight - 8}
              textAnchor="middle"
              fill={textMuted}
              fontSize="16"
              fontWeight="700"
            >
              {pt.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
