import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface WaterfallStep {
  name: string;
  value: number; // positive or negative
  isTotal?: boolean;
}

export interface WaterfallDiagramProps {
  title?: string;
  steps?: WaterfallStep[];
  currency?: string;
  className?: string;
}

const DEFAULT_STEPS: WaterfallStep[] = [
  { name: 'Gross Revenue', value: 120 },
  { name: 'Subscription Churn', value: -18 },
  { name: 'Lambda Cloud Cost', value: -12 },
  { name: 'Payment Fees', value: -4 },
  { name: 'Net Operating Profit', value: 86, isTotal: true },
];

export const WaterfallDiagram: React.FC<WaterfallDiagramProps> = ({
  title = 'NET PROFIT VARIANCE WATERFALL DIAGRAM',
  steps = DEFAULT_STEPS,
  currency = '$',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            FINANCIAL BRIDGE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Waterfall Steps Columns */}
      <div className="flex items-end gap-3 h-56 pt-8 pb-4 border-b border-zinc-800">
        {steps.map((step, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const isPos = step.value >= 0;
          const barColor = step.isTotal ? '#38bdf8' : isPos ? '#10b981' : '#ef4444';
          const heightPercent = Math.min(100, Math.abs(step.value)) * itemSpring;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
              <span className="text-[10px] font-mono font-bold mb-1" style={{ color: barColor }}>
                {isPos && !step.isTotal ? '+' : ''}{currency}{step.value}k
              </span>
              <div
                className="w-full rounded-t transition-all shadow-md"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                }}
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-2 truncate max-w-full text-center">
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
