import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AreaChartDataPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  title?: string;
  subtitle?: string;
  data?: AreaChartDataPoint[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  peakLabel?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_AREA_DATA: AreaChartDataPoint[] = [
  { label: 'Day 1', value: 18 },
  { label: 'Day 5', value: 42 },
  { label: 'Day 10', value: 36 },
  { label: 'Day 15', value: 68 },
  { label: 'Day 20', value: 84 },
  { label: 'Day 25', value: 110 },
  { label: 'Day 30', value: 145 },
];

export const AreaChart: React.FC<AreaChartProps> = ({
  title = 'Cumulative Viral Reach',
  subtitle = '30-day verified impression growth',
  data = DEFAULT_AREA_DATA,
  width = '100%',
  height = 540,
  theme = 'light',
  fillColor = '#0066FF',
  strokeColor = '#0066FF',
  strokeWidth = 6,
  showGrid = true,
  showDots = true,
  peakLabel = '1.45M PEAK',
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

  const items = data && data.length > 1 ? data : DEFAULT_AREA_DATA;
  const values = items.map((d) => d.value);
  const minVal = 0;
  const maxVal = Math.max(...values, 1) * 1.1;

  const svgWidth = 1000;
  const svgHeight = 360;
  const padX = 60;
  const padY = 40;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padY * 2;

  const points = items.map((item, idx) => {
    const x = padX + (idx / (items.length - 1)) * plotWidth;
    const y = padY + plotHeight - (item.value / maxVal) * plotHeight;
    return { x, y, ...item };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padY} L ${points[0].x} ${svgHeight - padY} Z`;

  const animSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const approxLength = 1800;
  const strokeDashoffset = interpolate(animSpring, [0, 1], [approxLength, 0]);

  const lastPoint = points[points.length - 1];

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
      {/* Title */}
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
          {peakLabel && (
            <div
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: `${fillColor}22`,
                border: `2px solid ${fillColor}66`,
                color: fillColor,
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: `0 4px 16px ${fillColor}33`,
              }}
            >
              {peakLabel}
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0 }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGradientSmooth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.5" />
              <stop offset="60%" stopColor={fillColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="areaLineGlow">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={strokeColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid */}
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
          <path
            d={areaD}
            fill="url(#areaGradientSmooth)"
            opacity={interpolate(animSpring, [0, 0.4, 1], [0, 0.7, 1])}
          />

          {/* Spline Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={approxLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#areaLineGlow)"
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
                  <circle cx={pt.x} cy={pt.y} r={9} fill={strokeColor} stroke={bgColor} strokeWidth={4} />
                </g>
              );
            })}

          {/* Glowing Peak Dot on Last Vertex */}
          {lastPoint && (
            <g>
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={20}
                fill={strokeColor}
                opacity={0.3}
              />
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={9}
                fill="#FFFFFF"
                stroke={strokeColor}
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

export default AreaChart;
