import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export interface ConversionRateCardProps {
  baseline?: number;
  testVariant?: number;
  metricName?: string;
  className?: string;
}

export const ConversionRateCard: React.FC<ConversionRateCardProps> = ({
  baseline = 2.4,
  testVariant = 4.9,
  metricName = 'Checkout Conversion Rate',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lift = (((testVariant - baseline) / baseline) * 100).toFixed(1);
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          CRO PERFORMANCE CARD
        </span>
        <span className="text-emerald-400 font-bold">STAT SIG: 99.4%</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-4" style={{ transform: "scale(" + scale + ")" }}>
        <div className="text-sm font-medium text-white/70">{metricName}</div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-white/40 font-mono mb-1">BASELINE (A)</div>
            <div className="text-2xl font-bold font-mono text-zinc-400">{baseline}%</div>
          </div>
          <div className="text-2xl font-bold text-white/30">→</div>
          <div className="text-center">
            <div className="text-xs text-emerald-400 font-mono mb-1">VARIANT (B)</div>
            <div className="text-4xl font-extrabold font-mono text-emerald-400">{testVariant}%</div>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
          +{lift}% RELATIVE LIFT
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SAMPLE SIZE: 48,200 USERS</span>
        <span>WINNER DECLARED</span>
      </div>
    </div>
  );
};
