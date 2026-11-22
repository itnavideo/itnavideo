import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface DataPoint {
  x: number;
  y: number;
}

export interface ScatterPlotProps {
  title?: string;
  points?: DataPoint[];
  trendline?: boolean;
  color?: string;
  className?: string;
}

const DEFAULT_POINTS: DataPoint[] = [
  { x: 10, y: 18 }, { x: 20, y: 28 }, { x: 30, y: 35 },
  { x: 40, y: 45 }, { x: 50, y: 52 }, { x: 60, y: 68 },
  { x: 70, y: 72 }, { x: 80, y: 88 }, { x: 90, y: 94 },
];

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  title = 'STATISTICAL LINEAR REGRESSION SCATTER PLOT',
  points = DEFAULT_POINTS,
  trendline = true,
  color = '#10b981',
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
            SCATTER CORRELATION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">{points.length} DATA SAMPLES</span>
      </div>

      {/* Scatter Canvas */}
      <div className="relative w-full aspect-[16/8] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        {/* Trendline */}
        {trendline && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1="5%"
              y1="90%"
              x2="95%"
              y2="10%"
              stroke={color}
              strokeWidth="2.5"
              strokeDasharray="6 3"
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
        )}

        {/* Scattered Points */}
        {points.map((p, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 3),
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 100 },
          });

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{
                left: `${p.x}%`,
                top: `${100 - p.y}%`,
                backgroundColor: color,
                transform: `translate(-50%, -50%) scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
