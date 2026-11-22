import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface HistogramBin {
  range: string;
  frequency: number;
}

export interface HistogramProps {
  title?: string;
  bins?: HistogramBin[];
  normalCurve?: boolean;
  color?: string;
  className?: string;
}

const DEFAULT_BINS: HistogramBin[] = [
  { range: '0-15s', frequency: 12 },
  { range: '15-30s', frequency: 38 },
  { range: '30-45s', frequency: 84 },
  { range: '45-60s', frequency: 110 },
  { range: '60-75s', frequency: 75 },
  { range: '75-90s', frequency: 28 },
];

export const Histogram: React.FC<HistogramProps> = ({
  title = 'VIDEO DURATION FREQUENCY DISTRIBUTION (HISTOGRAM)',
  bins = DEFAULT_BINS,
  normalCurve = true,
  color = '#6366f1',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const maxFreq = Math.max(...bins.map((b) => b.frequency));

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
            STATISTICAL FREQUENCY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Histogram Bars Canvas */}
      <div className="relative w-full aspect-[16/8] flex items-end gap-2 pb-6 border-b border-zinc-800">
        {bins.map((bin, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const heightPercent = (bin.frequency / maxFreq) * 100 * itemSpring;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
              <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1">
                {bin.frequency}
              </span>
              <div
                className="w-full rounded-t transition-all shadow-lg"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 15px ${color}55`,
                }}
              />
              <span className="text-[10px] font-mono text-zinc-500 mt-2 truncate">
                {bin.range}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
