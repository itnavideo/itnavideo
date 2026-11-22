import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface StockTickerItem {
  symbol: string;
  name?: string;
  price: string | number;
  change: string; // e.g. "+3.42%" or "-1.15%"
  isPositive?: boolean;
}

export interface StockTickerProps {
  items?: StockTickerItem[];
  speed?: number; // pixels per frame
  marketStatus?: 'MARKET OPEN' | 'AFTER HOURS' | 'CRYPTO 24/7' | 'MARKET CLOSED';
  direction?: 'left' | 'right';
  backgroundColor?: string;
  borderColor?: string;
  width?: number | string;
  height?: number;
  style?: React.CSSProperties;
}

const DEFAULT_TICKER: StockTickerItem[] = [
  { symbol: 'NVDA', name: 'Nvidia Corp', price: '$142.80', change: '+4.85%', isPositive: true },
  { symbol: 'AAPL', name: 'Apple Inc', price: '$228.40', change: '+1.12%', isPositive: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$94,200', change: '+5.60%', isPositive: true },
  { symbol: 'TSLA', name: 'Tesla Inc', price: '$248.10', change: '-2.35%', isPositive: false },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,450', change: '+3.10%', isPositive: true },
  { symbol: 'MSFT', name: 'Microsoft', price: '$425.60', change: '-0.45%', isPositive: false },
  { symbol: 'AMZN', name: 'Amazon.com', price: '$198.30', change: '+2.18%', isPositive: true },
  { symbol: 'GOOGL', name: 'Alphabet', price: '$178.50', change: '+1.64%', isPositive: true },
];

/**
 * StockTicker — Continuous financial stock and crypto ticker tape.
 * Features auto horizontal marquee loop, live price deltas,
 * directional trend indicators, and market status badge.
 */
export function StockTicker({
  items = DEFAULT_TICKER,
  speed = 2,
  marketStatus = 'MARKET OPEN',
  direction = 'left',
  backgroundColor = 'rgba(9, 9, 11, 0.95)',
  borderColor = 'rgba(255, 255, 255, 0.12)',
  width = '100%',
  height = 54,
  style,
}: StockTickerProps) {
  const frame = useCurrentFrame();

  // Approximate item width for looping offset
  const itemWidth = 220;
  const totalWidth = items.length * itemWidth;

  const scrollOffset = (frame * speed) % totalWidth;
  const translateX = direction === 'left' ? -scrollOffset : scrollOffset;

  const isMarketOpen = marketStatus === 'MARKET OPEN' || marketStatus === 'CRYPTO 24/7';

  // Double the items array for seamless infinite marquee loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        ...style,
      }}
    >
      {/* Market Status Pill Badge (Pinned on Left) */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px',
          backgroundColor: '#09090b',
          borderRight: `1px solid ${borderColor}`,
          boxShadow: '10px 0 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: isMarketOpen ? '#10b981' : '#ef4444',
            boxShadow: isMarketOpen ? '0 0 8px #10b981' : 'none',
          }}
        />
        <span
          style={{
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          {marketStatus}
        </span>
      </div>

      {/* Marquee Scrolling Rail */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(${translateX}px)`,
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {displayItems.map((item, index) => {
          const isUp = item.isPositive ?? !item.change.startsWith('-');
          const trendColor = isUp ? '#10b981' : '#ef4444';

          return (
            <div
              key={index}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                width: itemWidth,
                padding: '0 16px',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                }}
              >
                {item.symbol}
              </span>

              <span
                style={{
                  color: '#e4e4e7',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {item.price}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  color: trendColor,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                <span>{isUp ? '▲' : '▼'}</span>
                <span>{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
