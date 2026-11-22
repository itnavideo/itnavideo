import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ShieldMeterProps {
  chargePercent?: number;
  shieldType?: string;
  isOvercharged?: boolean;
  className?: string;
}

export const ShieldMeter: React.FC<ShieldMeterProps> = ({
  chargePercent = 85,
  shieldType = 'AEGIS KINETIC BARRIER',
  isOvercharged = false,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const meterProgress = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 90 } });

  const animatedPercent = Math.min(100, Math.max(0, chargePercent)) * meterProgress;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden font-mono"
        style={{
          background: 'rgba(8, 16, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(6, 182, 212, 0.25)',
        }}
      >
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            {/* Hexagonal Shield Icon */}
            <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.07 8.78-7 9.9-3.93-1.12-7-5.36-7-9.9V6.3l7-3.12z" />
            </svg>
            <span className="text-white font-bold tracking-wider uppercase text-[11px]">{shieldType}</span>
          </div>
          <span className="text-cyan-400 font-bold">{animatedPercent.toFixed(0)}%</span>
        </div>

        {/* Shield Hex Segments Display (10 segments) */}
        <div className="grid grid-cols-10 gap-1.5 h-4 my-1">
          {Array.from({ length: 10 }).map((_, i) => {
            const isFilled = (i + 1) * 10 <= animatedPercent;
            return (
              <div
                key={i}
                className="h-full rounded-sm transition-all duration-200"
                style={{
                  backgroundColor: isFilled ? '#06b6d4' : 'rgba(255,255,255,0.06)',
                  boxShadow: isFilled ? '0 0 8px rgba(6, 182, 212, 0.6)' : 'none',
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2">
          <span>Recharge Rate: +15/s</span>
          <span className={isOvercharged ? 'text-amber-400 font-bold animate-pulse' : 'text-emerald-400'}>
            {isOvercharged ? 'OVERCHARGED' : 'ACTIVE DEFENSE'}
          </span>
        </div>
      </div>
    </div>
  );
};
