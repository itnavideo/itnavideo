import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CryptoCardProps {
  name?: string;
  symbol?: string;
  price?: string;
  change24h?: string;
  isPositive?: boolean;
  marketCap?: string;
  rank?: number;
  sparkline?: number[];
  color?: string;
  delay?: number;
  width?: number | string;
}

const DEFAULT_SPARKLINE = [42, 45, 43, 48, 52, 49, 56, 62, 59, 68, 74, 82];

/**
 * CryptoCard — Visual cryptocurrency token showcase card.
 * Features live token price, 24h delta pill, mini SVG sparkline,
 * and market cap rank badge.
 */
export function CryptoCard({
  name = 'Bitcoin',
  symbol = 'BTC',
  price = '$94,250.00',
  change24h = '+5.82%',
  isPositive = true,
  marketCap = '$1.85 Trillion',
  rank = 1,
  sparkline = DEFAULT_SPARKLINE,
  color = '#f59e0b',
  delay = 0,
  width = 340,
}: CryptoCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  const trendColor = isPositive ? '#10b981' : '#ef4444';

  // Normalize sparkline points for SVG path
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline);
  const valRange = maxVal - minVal || 1;

  const sparklineWidth = 140;
  const sparklineHeight = 36;

  const sparklineD = sparkline.reduce((acc, val, i) => {
    const x = (i / (sparkline.length - 1)) * sparklineWidth;
    const y = sparklineHeight - ((val - minVal) / valRange) * (sparklineHeight - 6) - 3;
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Header: Coin Logo & Rank */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: `${color}25`,
              border: `2px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: 16,
              fontWeight: 900,
            }}
          >
            ₿
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>{name}</span>
            <span style={{ color: '#71717a', fontSize: 11, fontWeight: 700 }}>{symbol}</span>
          </div>
        </div>

        <span
          style={{
            padding: '2px 8px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#a1a1aa',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          RANK #{rank}
        </span>
      </div>

      {/* Center: Price & Sparkline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'monospace' }}>
            {price}
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: trendColor,
              fontSize: 11,
              fontWeight: 800,
              marginLeft: 8,
            }}
          >
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{change24h}</span>
          </div>
        </div>

        {/* Mini Vector Sparkline */}
        <svg width={sparklineWidth} height={sparklineHeight} style={{ overflow: 'visible' }}>
          <path
            d={sparklineD}
            fill="none"
            stroke={trendColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Footer Market Cap */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
        }}
      >
        <span>Market Cap</span>
        <span style={{ color: '#d4d4d8', fontFamily: 'monospace' }}>{marketCap}</span>
      </div>
    </div>
  );
}
