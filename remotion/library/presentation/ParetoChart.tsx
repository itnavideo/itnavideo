import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ParetoItem {
  defect: string;
  count: number;
}

export interface ParetoChartProps {
  title?: string;
  items?: ParetoItem[];
  accentColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: ParetoItem[] = [
  { defect: 'Poor Mic Audio Noise', count: 140 },
  { defect: 'Slow Pacing / Intro', count: 95 },
  { defect: 'Missing Captions', count: 50 },
  { defect: 'Wrong Aspect Ratio', count: 20 },
  { defect: 'Color Grade Clipping', count: 10 },
];

export const ParetoChart: React.FC<ParetoChartProps> = ({
  title = '80/20 RETENTION DROP OFF PARETO ANALYSIS',
  items = DEFAULT_ITEMS,
  accentColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const totalCount = items.reduce((acc, i) => acc + i.count, 0);
  const maxCount = items[0].count;

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            PARETO 80/20 PRINCIPLE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Bars Container */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const barWidth = (item.count / maxCount) * 100 * itemSpring;
          const cumulativePercent = Math.round(
            (items.slice(0, idx + 1).reduce((acc, i) => acc + i.count, 0) / totalCount) * 100
          );

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-200 font-bold">{item.defect}</span>
                <span className="text-amber-400 font-bold">
                  {item.count} ({cumulativePercent}% CUM.)
                </span>
              </div>
              <div className="h-6 bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: idx < 2 ? accentColor : '#52525b',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
