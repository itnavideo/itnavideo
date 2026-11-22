import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PeriodicTableCardProps {
  symbol?: string;
  elementName?: string;
  atomicNumber?: number;
  atomicMass?: string;
  category?: string;
  electronConfig?: string;
  className?: string;
}

export const PeriodicTableCard: React.FC<PeriodicTableCardProps> = ({
  symbol = 'Au',
  elementName = 'GOLD',
  atomicNumber = 79,
  atomicMass = '196.967',
  category = 'TRANSITION METAL',
  electronConfig = '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-56 h-64 rounded-3xl p-5 border-2 border-amber-400/40 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(28, 20, 8, 0.95), rgba(12, 10, 6, 0.98))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(251, 191, 36, 0.25)',
        }}
      >
        {/* Top Header: Atomic Number & Category */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-400 font-black text-lg">{atomicNumber}</span>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
            {category}
          </span>
        </div>

        {/* Center Giant Element Symbol */}
        <div className="flex flex-col items-center my-auto">
          <span className="text-5xl font-black text-white tracking-tight drop-shadow-md">
            {symbol}
          </span>
          <span className="text-xs font-bold text-amber-200 tracking-widest uppercase mt-1">
            {elementName}
          </span>
        </div>

        {/* Bottom Details: Mass & Config */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-0.5 text-center text-xs">
          <span className="text-white font-bold">{atomicMass} u</span>
          <span className="text-[10px] text-zinc-400 truncate">{electronConfig}</span>
        </div>
      </div>
    </div>
  );
};
