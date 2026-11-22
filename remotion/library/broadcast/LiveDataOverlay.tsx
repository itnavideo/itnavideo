import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LiveDataOverlayProps {
  metricName?: string;
  metricValue?: string;
  deltaPercent?: string;
  isPositive?: boolean;
  className?: string;
}

export const LiveDataOverlay: React.FC<LiveDataOverlayProps> = ({
  metricName = 'NASDAQ COMPOSITE',
  metricValue = '18,420.30',
  deltaPercent = '+1.45%',
  isPositive = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/85 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-white text-xs shadow-lg space-x-3 " + className}>
      <span className="text-white/60 font-bold">{metricName}</span>
      <span className="font-black text-sm">{metricValue}</span>
      <span className={"font-bold px-1.5 py-0.5 rounded text-[10px] " + (
        isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
      )}>
        {deltaPercent}
      </span>
    </div>
  );
};
