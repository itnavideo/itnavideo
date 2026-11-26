import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AssetCategory {
  name: string;
  percentage: number;
  value: string;
  color: string;
}

export interface PortfolioChartProps {
  totalNetWorth?: number;
  currency?: string;
  assets?: AssetCategory[];
  title?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ASSETS: AssetCategory[] = [
  { name: 'Equities & Tech Stocks', percentage: 45, value: '$652,500', color: '#10b981' },
  { name: 'Real Estate & REITs', percentage: 25, value: '$362,500', color: '#38bdf8' },
  { name: 'Cryptocurrency (BTC/ETH)', percentage: 20, value: '$290,000', color: '#6366f1' },
  { name: 'Cash Reserves (HYSA)', percentage: 10, value: '$145,000', color: '#f59e0b' },
];

/**
 * PortfolioChart — Visual asset allocation breakdown.
 * Features total net worth odometer counter, multi-color SVG allocation ring,
 * and percentage asset tier list.
 */
export function PortfolioChart({
  totalNetWorth = 1450000,
  currency = '$',
  assets = DEFAULT_ASSETS,
  title = 'Total Investment Portfolio',
  delay = 0,
  width = '100%',
  height = 360,
}: PortfolioChartProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Spring animated counter for net worth
  const currentNetWorth = Math.round(
    interpolate(entrySpr, [0, 1], [0, totalNetWorth])
  );

  const formattedNetWorth = `${currency}${currentNetWorth.toLocaleString('en-US')}`;

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets for each pie segment
  let cumulativePercentage = 0;

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
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ color: '#71717a', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
            {title.toUpperCase()}
          </span>
          <div style={{ color: '#fff', fontSize: 26, fontWeight: 900, fontFamily: 'monospace', marginTop: 2 }}>
            {formattedNetWorth}
          </div>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: '#10b98120',
            border: '1px solid #10b98160',
            color: '#10b981',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          +22.4% ALL TIME
        </span>
      </div>

      {/* Main Content: Donut + Asset Breakdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '14px 0' }}>
        {/* SVG Allocation Donut Ring */}
        <div style={{ position: 'relative', width: radius * 2 + 20, height: radius * 2 + 20, flexShrink: 0 }}>
          <svg
            width={radius * 2 + 20}
            height={radius * 2 + 20}
            viewBox={`-${radius + 10} -${radius + 10} ${(radius + 10) * 2} ${(radius + 10) * 2}`}
            style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
          >
            {assets.map((asset, index) => {
              const strokeDasharray = `${(asset.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
              cumulativePercentage += asset.percentage;

              return (
                <circle
                  key={index}
                  cx="0"
                  cy="0"
                  r={radius}
                  fill="none"
                  stroke={asset.color}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                />
              );
            })}
          </svg>

          {/* Donut Center Icon */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            100%
          </div>
        </div>

        {/* Category Rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {assets.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: a.color,
                  }}
                />
                <span style={{ color: '#d4d4d8', fontSize: 13, fontWeight: 600 }}>{a.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                  {a.value}
                </span>
                <span style={{ color: '#71717a', fontSize: 11, fontWeight: 600, width: 32, textAlign: 'right' }}>
                  {a.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
