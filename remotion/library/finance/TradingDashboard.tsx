import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface OrderBookRow {
  price: string;
  amount: string;
  total: string;
  type: 'bid' | 'ask';
}

export interface TradingDashboardProps {
  pair?: string;
  lastPrice?: string;
  pnl?: string;
  pnlPositive?: boolean;
  leverage?: string;
  orderBook?: OrderBookRow[];
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ORDERS: OrderBookRow[] = [
  { price: '94,280.50', amount: '0.45 BTC', total: '$42,426', type: 'ask' },
  { price: '94,250.00', amount: '1.20 BTC', total: '$113,100', type: 'ask' },
  { price: '94,210.20', amount: '0.80 BTC', total: '$75,368', type: 'ask' },
  { price: '94,190.00', amount: '2.50 BTC', total: '$235,475', type: 'bid' },
  { price: '94,160.40', amount: '1.15 BTC', total: '$108,284', type: 'bid' },
  { price: '94,120.00', amount: '3.40 BTC', total: '$320,008', type: 'bid' },
];

/**
 * TradingDashboard — High-frequency financial trading terminal interface.
 * Features live order book (bids/asks), PnL leverage pill, mini chart,
 * and Buy/Sell action controls.
 */
export function TradingDashboard({
  pair = 'BTC / USDT',
  lastPrice = '$94,200.00',
  pnl = '+$14,850.20 (+18.4%)',
  pnlPositive = true,
  leverage = '10x CROSS',
  orderBook = DEFAULT_ORDERS,
  delay = 0,
  width = '100%',
  height = 360,
}: TradingDashboardProps) {
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
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Top Header: Pair, Leverage Badge & PnL */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{pair}</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: '#6366f125',
              border: '1px solid #6366f160',
              color: '#a5b4fc',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {leverage}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>UNREALIZED PnL</span>
          <span
            style={{
              color: pnlPositive ? '#10b981' : '#ef4444',
              fontSize: 14,
              fontWeight: 800,
              fontFamily: 'monospace',
            }}
          >
            {pnl}
          </span>
        </div>
      </div>

      {/* Middle Grid: Order Book & Quick Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '12px 0' }}>
        {/* Order Book Table */}
        <div
          style={{
            backgroundColor: '#18181b',
            borderRadius: 10,
            padding: 10,
            border: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: '#71717a',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            <span>PRICE (USDT)</span>
            <span>SIZE</span>
            <span>TOTAL</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {orderBook.map((order, i) => {
              const isBid = order.type === 'bid';
              const color = isBid ? '#10b981' : '#ef4444';

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color }}>{order.price}</span>
                  <span style={{ color: '#d4d4d8' }}>{order.amount}</span>
                  <span style={{ color: '#71717a' }}>{order.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Mini Sparkline & Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#18181b',
            borderRadius: 10,
            padding: 12,
            border: 'none',
          }}
        >
          <div>
            <span style={{ color: '#71717a', fontSize: 10, fontWeight: 700 }}>LAST TRADED PRICE</span>
            <div
              style={{
                color: '#10b981',
                fontSize: 22,
                fontWeight: 900,
                fontFamily: 'monospace',
                marginTop: 2,
              }}
            >
              {lastPrice}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            <button
              style={{
                padding: '8px 0',
                borderRadius: 8,
                backgroundColor: '#10b981',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              BUY / LONG
            </button>
            <button
              style={{
                padding: '8px 0',
                borderRadius: 8,
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              }}
            >
              SELL / SHORT
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status Line */}
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
        <span>24h Vol: $4.2B</span>
        <span style={{ color: '#10b981' }}>Latency: 12ms • API Connected</span>
      </div>
    </div>
  );
}
