import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BoxPlotGroup {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  color?: string;
}

export interface BoxPlotProps {
  title?: string;
  groups?: BoxPlotGroup[];
  className?: string;
}

const DEFAULT_GROUPS: BoxPlotGroup[] = [
  { label: 'Render Latency (s)', min: 12, q1: 22, median: 34, q3: 48, max: 72, color: '#38bdf8' },
  { label: 'Transcription (s)', min: 4, q1: 8, median: 14, q3: 20, max: 32, color: '#10b981' },
  { label: 'Asset Match (s)', min: 2, q1: 5, median: 9, q3: 15, max: 26, color: '#f59e0b' },
];

export const BoxPlot: React.FC<BoxPlotProps> = ({
  title = 'LATENCY DISTRIBUTION (BOX-AND-WHISKER PLOT)',
  groups = DEFAULT_GROUPS,
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
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            STATISTICAL QUANTILES
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Horizontal Box & Whisker Rows */}
      <div className="space-y-6">
        {groups.map((g, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const barColor = g.color || '#38bdf8';

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-zinc-200">{g.label}</span>
                <span className="text-zinc-500">MEDIAN: {g.median}s</span>
              </div>

              {/* Box Track */}
              <div className="relative h-9 bg-zinc-900/80 rounded border border-zinc-800 flex items-center">
                {/* Whisker Line (Min to Max) */}
                <div
                  className="absolute h-[2px] bg-zinc-600"
                  style={{
                    left: `${g.min}%`,
                    width: `${(g.max - g.min) * itemSpring}%`,
                  }}
                />

                {/* Min & Max End Caps */}
                <div
                  className="absolute w-[2px] h-4 bg-zinc-400"
                  style={{ left: `${g.min}%` }}
                />
                <div
                  className="absolute w-[2px] h-4 bg-zinc-400"
                  style={{ left: `${g.max * itemSpring}%` }}
                />

                {/* Interquartile Box (Q1 to Q3) */}
                <div
                  className="absolute h-6 rounded border border-white/60 shadow-md flex items-center justify-center"
                  style={{
                    left: `${g.q1}%`,
                    width: `${(g.q3 - g.q1) * itemSpring}%`,
                    backgroundColor: `${barColor}66`,
                  }}
                >
                  {/* Median Line */}
                  <div
                    className="absolute inset-y-0 w-1 bg-white shadow"
                    style={{ left: `${((g.median - g.q1) / (g.q3 - g.q1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
