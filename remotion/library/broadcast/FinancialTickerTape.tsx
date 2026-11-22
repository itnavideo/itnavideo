import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StockTickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface FinancialTickerTapeProps {
  items?: StockTickerItem[];
  marketStatus?: string;
  className?: string;
}

export const FinancialTickerTape: React.FC<FinancialTickerTapeProps> = ({
  items = [
    { symbol: 'AAPL', price: '$224.50', change: '+1.8%', isPositive: true },
    { symbol: 'NVDA', price: '$138.20', change: '+4.5%', isPositive: true },
    { symbol: 'TSLA', price: '$210.15', change: '-2.3%', isPositive: false },
    { symbol: 'MSFT', price: '$448.90', change: '+0.9%', isPositive: true },
    { symbol: 'BTC', price: '$94,250', change: '+5.6%', isPositive: true },
    { symbol: 'ETH', price: '$3,420', change: '+3.1%', isPositive: true },
  ],
  marketStatus = 'WALL ST OPEN',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const offset = (frame * 2) % 600;

  return (
    <div
      className={`w-full flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        opacity: enter,
      }}
    >
      <div className="w-full flex items-center bg-zinc-950/95 border-t border-b border-white/10 shadow-2xl py-2 px-4 overflow-hidden">
        {/* Market Status Pill */}
        <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 mr-4 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
            {marketStatus}
          </span>
        </div>

        {/* Rolling Stock Ticker Items */}
        <div
          className="flex items-center gap-6 whitespace-nowrap"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {items.concat(items).map((stock, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-white font-extrabold">{stock.symbol}</span>
              <span className="text-zinc-300">{stock.price}</span>
              <span
                className={`font-bold flex items-center ${
                  stock.isPositive ? 'text-emerald-400' : 'text-rose-500'
                }`}
              >
                {stock.isPositive ? '▲' : '▼'} {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
