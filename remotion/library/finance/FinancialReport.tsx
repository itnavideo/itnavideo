import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FinancialMetric {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface FinancialReportProps {
  companyName?: string;
  fiscalPeriod?: string;
  revenue?: string;
  yoyGrowth?: string;
  netMargin?: string;
  metrics?: FinancialMetric[];
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_METRICS: FinancialMetric[] = [
  { label: 'Total Revenue', value: '$14.28B', change: '+18.4% YoY', isPositive: true },
  { label: 'EBITDA', value: '$4.62B', change: '+22.1% YoY', isPositive: true },
  { label: 'Net Income', value: '$3.54B', change: '+24.8% YoY', isPositive: true },
  { label: 'Diluted EPS', value: '$1.42', change: '+15.2% YoY', isPositive: true },
];

/**
 * FinancialReport — Executive earnings report card.
 * Displays revenue, EBITDA, profit margins, and quarterly performance benchmarks.
 */
export function FinancialReport({
  companyName = 'Acme Technologies Inc.',
  fiscalPeriod = 'Q3 2026 EARNINGS REPORT',
  revenue = '$14.28B',
  yoyGrowth = '+18.4%',
  netMargin = '24.8%',
  metrics = DEFAULT_METRICS,
  delay = 0,
  width = '100%',
  height = 360,
}: FinancialReportProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Report Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 14,
        }}
      >
        <div>
          <span style={{ color: '#10b981', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em' }}>
            {fiscalPeriod}
          </span>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>
            {companyName}
          </h3>
        </div>

        <span
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            backgroundColor: '#10b98125',
            border: '1px solid #10b98160',
            color: '#10b981',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          BEAT ESTIMATES
        </span>
      </div>

      {/* 4-Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, margin: '14px 0' }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#18181b',
              borderRadius: 10,
              padding: '12px 16px',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 600 }}>{m.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'monospace' }}>
                {m.value}
              </span>
              {m.change && (
                <span
                  style={{
                    color: m.isPositive ? '#10b981' : '#ef4444',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {m.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Benchmark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
        }}
      >
        <span>Net Profit Margin: <strong style={{ color: '#fff' }}>{netMargin}</strong></span>
        <span>YoY Topline Growth: <strong style={{ color: '#10b981' }}>{yoyGrowth}</strong></span>
      </div>
    </div>
  );
}
