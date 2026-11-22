import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BubblePoint {
  label: string;
  x: number; // 0 - 100
  y: number; // 0 - 100
  size: number; // Bubble diameter
  color: string;
}

export interface BubbleChartProps {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  bubbles?: BubblePoint[];
  className?: string;
}

const DEFAULT_BUBBLES: BubblePoint[] = [
  { label: 'Shorts Studio', x: 25, y: 75, size: 55, color: '#38bdf8' },
  { label: 'Auto Captioning', x: 50, y: 85, size: 70, color: '#10b981' },
  { label: 'Voiceover Sync', x: 75, y: 40, size: 45, color: '#f59e0b' },
  { label: 'Long Form Repurpose', x: 85, y: 80, size: 60, color: '#ec4899' },
];

export const BubbleChart: React.FC<BubbleChartProps> = ({
  title = 'FEATURE VELOCITY VS ENGAGEMENT (BUBBLE CHART)',
  xAxisLabel = 'DEVELOPMENT EFFORT (DAYS) →',
  yAxisLabel = 'USER RETENTION (%) ↑',
  bubbles = DEFAULT_BUBBLES,
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
            3-DIMENSIONAL BUBBLE MATRIX
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Scatter Canvas */}
      <div className="relative w-full aspect-[16/9] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Bubbles */}
        {bubbles.map((b, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-2xl border-2 border-white/60 backdrop-blur-xs"
              style={{
                left: `${b.x}%`,
                top: `${100 - b.y}%`,
                width: `${b.size * itemSpring}px`,
                height: `${b.size * itemSpring}px`,
                backgroundColor: `${b.color}88`,
                boxShadow: `0 0 25px ${b.color}66`,
              }}
            >
              <span className="text-[9px] font-serif font-black text-white leading-tight uppercase drop-shadow">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-4 px-2">
        <span>{yAxisLabel}</span>
        <span>{xAxisLabel}</span>
      </div>
    </div>
  );
};
