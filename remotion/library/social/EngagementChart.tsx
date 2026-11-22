import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface EngagementChartProps {
  headline?: string;
  engagementRate?: string;
  growthDelta?: string;
  dataPoints?: number[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_POINTS = [20, 35, 45, 40, 65, 80, 95];

/**
 * EngagementChart — Channel analytics & engagement retention curve visualizer.
 * Renders SVG sparkline gradient curve, engagement percentage, and subscriber growth spike.
 */
export function EngagementChart({
  headline = 'AUDIENCE ENGAGEMENT RATE',
  engagementRate = '14.8%',
  growthDelta = '+34.2% vs previous 30 days',
  dataPoints = DEFAULT_POINTS,
  accentColor = '#22c55e',
  delay = 0,
  width = 440,
  height = 200,
}: EngagementChartProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const chartProgress = interpolate(
    spring({
      frame: Math.max(0, t - 10),
      fps,
      config: { damping: 16, stiffness: 60 },
    }),
    [0, 1],
    [0, 1]
  );

  // SVG Line coordinates
  const svgW = 380;
  const svgH = 80;
  const stepX = svgW / (dataPoints.length - 1);
  const maxVal = Math.max(...dataPoints);
  const minVal = Math.min(...dataPoints);

  const points = dataPoints.map((val, i) => {
    const x = i * stepX;
    const y = svgH - ((val - minVal) / (maxVal - minVal || 1)) * (svgH - 20) - 10;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${svgW},${svgH} L 0,${svgH} Z`;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header Metric */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' }}>
            {headline}
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
            {engagementRate}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 9999,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 800 }}>↗ HIGH</span>
        </div>
      </div>

      {/* Sparkline Curve Area */}
      <div style={{ width: '100%', height: svgH, position: 'relative' }}>
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="eng-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaD} fill="url(#eng-grad)" opacity={chartProgress} />
          <path
            d={pathD}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={svgW * 2}
            strokeDashoffset={interpolate(chartProgress, [0, 1], [svgW * 2, 0])}
          />
        </svg>
      </div>

      {/* Footer Growth Delta */}
      <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>
        {growthDelta}
      </div>
    </div>
  );
}
