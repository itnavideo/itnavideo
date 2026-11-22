import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RadarMetric {
  axis: string;
  value: number; // 0 to 100
  benchmark?: number; // Optional comparison value (0 to 100)
}

export interface RadarChartProps {
  title?: string;
  subtitle?: string;
  metrics?: RadarMetric[];
  size?: number;
  theme?: 'dark' | 'light';
  primaryColor?: string;
  benchmarkColor?: string;
  delayFrames?: number;
  showBenchmark?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_RADAR_METRICS: RadarMetric[] = [
  { axis: 'Retention', value: 92, benchmark: 60 },
  { axis: 'CTR (Clicks)', value: 85, benchmark: 52 },
  { axis: 'Watch Time', value: 94, benchmark: 65 },
  { axis: 'Engagement', value: 78, benchmark: 48 },
  { axis: 'Viral Shares', value: 88, benchmark: 42 },
  { axis: 'Conversion', value: 82, benchmark: 50 },
];

export const RadarChart: React.FC<RadarChartProps> = ({
  title = 'Algorithm Performance Spider',
  subtitle = 'Multi-factor retention and viral index',
  metrics = DEFAULT_RADAR_METRICS,
  size = 320,
  theme = 'dark',
  primaryColor = '#0066FF',
  benchmarkColor = '#10B981',
  delayFrames = 5,
  showBenchmark = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const webColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const items = metrics && metrics.length >= 3 ? metrics : DEFAULT_RADAR_METRICS;
  const numAxes = items.length;
  const center = size / 2;
  const maxRadius = size * 0.36;

  const animSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 15, stiffness: 75 },
  });

  // Calculate coordinates on spider polygon
  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (index / numAxes) * 2 * Math.PI - Math.PI / 2;
    const r = (valPercent / 100) * maxRadius * animSpring;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Primary data polygon points
  const primaryPoints = items.map((m, idx) => getCoordinates(idx, m.value));
  const primaryPolygonD = primaryPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Benchmark polygon points (if enabled)
  const benchmarkPoints = items.map((m, idx) => getCoordinates(idx, m.benchmark || 50));
  const benchmarkPolygonD = benchmarkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
          {title && (
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor, letterSpacing: '-0.02em' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 500, color: textMuted }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Spider SVG */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Concentric Web Polygons */}
          {[0.25, 0.5, 0.75, 1.0].map((tier, tierIdx) => {
            const webPts = items.map((_, i) => {
              const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
              const r = tier * maxRadius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');

            return (
              <polygon
                key={tierIdx}
                points={webPts}
                fill="none"
                stroke={webColor}
                strokeWidth={1}
                strokeDasharray={tierIdx === 3 ? undefined : '3 3'}
              />
            );
          })}

          {/* Radiating Axis Lines */}
          {items.map((_, i) => {
            const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
            const x2 = center + maxRadius * Math.cos(angle);
            const y2 = center + maxRadius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke={webColor}
                strokeWidth={1}
              />
            );
          })}

          {/* Benchmark Polygon */}
          {showBenchmark && (
            <path
              d={benchmarkPolygonD}
              fill={`${benchmarkColor}22`}
              stroke={benchmarkColor}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {/* Primary Filled Data Polygon */}
          <path
            d={primaryPolygonD}
            fill={`${primaryColor}38`}
            stroke={primaryColor}
            strokeWidth={3}
          />

          {/* Vertex Dots */}
          {primaryPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill="#FFFFFF"
              stroke={primaryColor}
              strokeWidth={2}
            />
          ))}

          {/* Axis Labels */}
          {items.map((m, i) => {
            const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
            const labelR = maxRadius + 24;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);

            return (
              <text
                key={i}
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                fill={textColor}
                fontSize="11"
                fontWeight="700"
              >
                {m.axis}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: primaryColor }} />
          <span style={{ fontWeight: 700 }}>Our Video</span>
        </div>
        {showBenchmark && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textMuted }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: benchmarkColor }} />
            <span style={{ fontWeight: 600 }}>Niche Average</span>
          </div>
        )}
      </div>
    </div>
  );
};
