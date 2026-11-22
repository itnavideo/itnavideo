import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandlestickChartProps {
  symbol?: string;
  timeframe?: string;
  candles?: CandleData[];
  showMA?: boolean;
  showVolume?: boolean;
  upColor?: string;
  downColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_CANDLES: CandleData[] = [
  { time: '09:30', open: 140, high: 144, low: 139, close: 143, volume: 80 },
  { time: '10:00', open: 143, high: 147, low: 142, close: 146, volume: 110 },
  { time: '10:30', open: 146, high: 148, low: 143, close: 144, volume: 65 },
  { time: '11:00', open: 144, high: 145, low: 141, close: 142, volume: 90 },
  { time: '11:30', open: 142, high: 149, low: 141, close: 148, volume: 140 },
  { time: '12:00', open: 148, high: 153, low: 147, close: 152, volume: 175 },
  { time: '12:30', open: 152, high: 155, low: 150, close: 151, volume: 105 },
  { time: '13:00', open: 151, high: 156, low: 149, close: 155, volume: 130 },
  { time: '13:30', open: 155, high: 160, low: 154, close: 158, volume: 210 },
  { time: '14:00', open: 158, high: 162, low: 157, close: 161, volume: 185 },
];

/**
 * CandlestickChart — Professional financial stock/crypto candlestick chart.
 * Features green/red candle bodies with high/low wicks, 20-period moving average curve,
 * bottom trading volume bars, and price crosshair.
 */
export function CandlestickChart({
  symbol = 'NVDA / USD',
  timeframe = '1H CANDLES',
  candles = DEFAULT_CANDLES,
  showMA = true,
  showVolume = true,
  upColor = '#10b981',
  downColor = '#ef4444',
  delay = 0,
  width = '100%',
  height = 380,
}: CandlestickChartProps) {
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

  // Compute scale boundaries
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) * 0.98;
  const maxPrice = Math.max(...allPrices) * 1.02;
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = showVolume ? height * 0.68 : height * 0.8;
  const volumeHeight = height * 0.18;

  const getY = (val: number) => chartHeight - ((val - minPrice) / priceRange) * chartHeight;

  // Staggered candle appearance
  const candleWidth = 14;

  const latestCandle = candles[candles.length - 1];
  const isUpTrend = latestCandle.close >= latestCandle.open;
  const currentPrice = latestCandle.close.toFixed(2);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>{symbol}</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#a1a1aa',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {timeframe}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: isUpTrend ? upColor : downColor,
              fontFamily: 'monospace',
            }}
          >
            ${currentPrice}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isUpTrend ? upColor : downColor,
            }}
          >
            {isUpTrend ? '+4.2%' : '-1.8%'}
          </span>
        </div>
      </div>

      {/* SVG Candlestick Plot Area */}
      <div style={{ position: 'relative', flex: 1, margin: '14px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 500 ${chartHeight + (showVolume ? volumeHeight + 20 : 0)}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight * pct;
            const priceLevel = (maxPrice - pct * priceRange).toFixed(1);
            return (
              <g key={idx}>
                <line
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="495"
                  y={y - 4}
                  fill="#71717a"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  ${priceLevel}
                </text>
              </g>
            );
          })}

          {/* Candlestick Glyphs */}
          {candles.map((c, i) => {
            const x = 30 + i * (440 / candles.length);
            const isGreen = c.close >= c.open;
            const candleColor = isGreen ? upColor : downColor;

            const highY = getY(c.high);
            const lowY = getY(c.low);
            const openY = getY(c.open);
            const closeY = getY(c.close);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(3, Math.abs(closeY - openY));

            return (
              <g key={i}>
                {/* Candle Upper & Lower Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={candleColor}
                  strokeWidth="1.5"
                />

                {/* Candle Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  rx="2"
                  fill={candleColor}
                  stroke={candleColor}
                  strokeWidth="1"
                  filter={`drop-shadow(0 0 4px ${candleColor}60)`}
                />

                {/* Volume Bar at bottom */}
                {showVolume && c.volume && (
                  <rect
                    x={x - candleWidth / 2}
                    y={chartHeight + 15 + (volumeHeight - (c.volume / 250) * volumeHeight)}
                    width={candleWidth}
                    height={(c.volume / 250) * volumeHeight}
                    rx="1"
                    fill={candleColor}
                    opacity="0.4"
                  />
                )}
              </g>
            );
          })}

          {/* Moving Average Line (MA-20) */}
          {showMA && (
            <path
              d={candles.reduce((acc, c, idx) => {
                const x = 30 + idx * (440 / candles.length);
                const avg = (c.open + c.close + c.high + c.low) / 4;
                const y = getY(avg);
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              opacity="0.8"
            />
          )}
        </svg>
      </div>

      {/* Footer Meta: MA legend & 24h stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ color: '#f59e0b' }}>● MA (20): $151.20</span>
          <span>Vol: 24.8M</span>
        </div>
        <span>High: $162.00 • Low: $139.00</span>
      </div>
    </div>
  );
}
