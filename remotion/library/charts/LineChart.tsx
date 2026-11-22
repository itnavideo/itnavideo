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
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 19 },
  { label: 'Mar', value: 15 },
  { label: 'Apr', value: 27 },
  { label: 'May', value: 34 },
  { label: 'Jun', value: 48 },
  { label: 'Jul', value: 65 },
];

export const LineChart: React.FC<LineChartProps> = ({
  title = 'Audience Retention & Growth',
  subtitle = 'Month-over-month active trajectory',
  data = DEFAULT_LINE_DATA,
  width = '100%',
  height = 340,
  theme = 'dark',
  lineColor = '#0066FF',
  strokeWidth = 4,
  showDots = true,
  showGrid = true,
  showArea = true,
  peakBadgeText,
  delayFrames = 6,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const items = data && data.length > 1 ? data : DEFAULT_LINE_DATA;
  const values = items.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, 1);
  const valRange = maxVal - minVal || 1;

  // Chart coordinates inside SVG
  const svgWidth = 600;
  const svgHeight = 220;
  const padX = 40;
  const padY = 30;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padY * 2;

  const points = items.map((item, idx) => {
    const x = padX + (idx / (items.length - 1)) * plotWidth;
    const y = padY + plotHeight - ((item.value - minVal) / valRange) * plotHeight;
    return { x, y, ...item };
  });

  // Construct SVG path string
  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padY} L ${points[0].x} ${svgHeight - padY} Z`;

  // Spring animation for stroke draw
  const lineSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  // Approximate total path length
  const approxPathLength = 1200;
  const strokeDashoffset = interpolate(lineSpring, [0, 1], [approxPathLength, 0]);

  // Peak index
  const peakIndex = values.indexOf(maxVal);
  const peakPoint = points[peakIndex];

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>
                {subtitle}
              </p>
            )}
          </div>
          {peakBadgeText && (
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: `${lineColor}22`,
                border: `1px solid ${lineColor}55`,
                color: lineColor,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {peakBadgeText}
            </div>
          )}
        </div>
      )}

      {/* SVG Container */}
      <div style={{ position: 'relative', width: '100%', height: `${height - 100}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={lineColor} floodOpacity="0.6" />
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
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

          {/* Area Fill */}
          {showArea && (
            <path
              d={areaD}
              fill="url(#lineAreaGradient)"
              opacity={lineSpring}
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
                  <circle cx={pt.x} cy={pt.y} r={6} fill={lineColor} stroke={bgColor} strokeWidth={3} />
                </g>
              );
            })}

          {/* Peak Highlight Pulse Dot */}
          {peakPoint && lineSpring > 0.8 && (
            <g>
              <circle
                cx={peakPoint.x}
                cy={peakPoint.y}
                r={12}
                fill={lineColor}
                opacity={0.3}
              />
              <circle
                cx={peakPoint.x}
                cy={peakPoint.y}
                r={6}
                fill="#FFFFFF"
                stroke={lineColor}
                strokeWidth={2}
              />
            </g>
          )}

          {/* X Axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={svgHeight - 6}
              textAnchor="middle"
              fill={textMuted}
              fontSize="12"
              fontWeight="600"
            >
              {pt.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
