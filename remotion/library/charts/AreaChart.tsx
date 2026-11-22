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
  peakLabel?: string;
  delayFrames?: number;
  showGrid?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_AREA_DATA: AreaChartDataPoint[] = [
  { label: 'Day 1', value: 1200 },
  { label: 'Day 5', value: 2400 },
  { label: 'Day 10', value: 1900 },
  { label: 'Day 15', value: 4100 },
  { label: 'Day 20', value: 3800 },
  { label: 'Day 25', value: 6800 },
  { label: 'Day 30', value: 9400 },
];

export const AreaChart: React.FC<AreaChartProps> = ({
  title = 'Cumulative Viral Reach',
  subtitle = '30-day verified impression growth',
  data = DEFAULT_AREA_DATA,
  width = '100%',
  height = 340,
  theme = 'dark',
  fillColor = '#0066FF',
  strokeColor = '#0066FF',
  peakLabel = '9.4K Peak',
  delayFrames = 5,
  showGrid = true,
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

  const items = data && data.length > 1 ? data : DEFAULT_AREA_DATA;
  const values = items.map((d) => d.value);
  const minVal = 0;
  const maxVal = Math.max(...values, 1) * 1.1;

  const svgWidth = 600;
  const svgHeight = 220;
  const padX = 40;
  const padY = 30;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padY * 2;

  const points = items.map((item, idx) => {
    const x = padX + (idx / (items.length - 1)) * plotWidth;
    const y = padY + plotHeight - (item.value / maxVal) * plotHeight;
    return { x, y, ...item };
  });

  // Construct smooth bezier curve path
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
    config: { damping: 16, stiffness: 85 },
  });

  const approxLength = 1400;
  const strokeDashoffset = interpolate(animSpring, [0, 1], [approxLength, 0]);

  const lastPoint = points[points.length - 1];

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
      {/* Title */}
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
          {peakLabel && (
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: `${fillColor}22`,
                border: `1px solid ${fillColor}55`,
                color: fillColor,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {peakLabel}
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${height - 100}px` }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGradientSmooth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.45" />
              <stop offset="60%" stopColor={fillColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="areaLineGlow">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={strokeColor} floodOpacity="0.5" />
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
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

          {/* Area under curve */}
          <path d={areaD} fill="url(#areaGradientSmooth)" opacity={animSpring} />

          {/* Curve stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={approxLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#areaLineGlow)"
          />

          {/* Peak pulsing pin */}
          {lastPoint && animSpring > 0.85 && (
            <g>
              <circle cx={lastPoint.x} cy={lastPoint.y} r={14} fill={strokeColor} opacity={0.25} />
              <circle cx={lastPoint.x} cy={lastPoint.y} r={7} fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />
            </g>
          )}

          {/* Labels */}
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
