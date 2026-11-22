import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MatrixItem {
  id: string;
  name: string;
  x: number; // 0 - 100% (Effort / Complexity)
  y: number; // 0 - 100% (Impact / Value)
  color?: string;
}

export interface MatrixDiagramProps {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  quadrantLabels?: [string, string, string, string]; // TL, TR, BL, BR
  items?: MatrixItem[];
  className?: string;
}

const DEFAULT_ITEMS: MatrixItem[] = [
  { id: '1', name: 'Auto Captions', x: 25, y: 80, color: '#10b981' },
  { id: '2', name: 'Cloud Video Render', x: 80, y: 85, color: '#38bdf8' },
  { id: '3', name: 'Legacy File Export', x: 20, y: 20, color: '#f59e0b' },
  { id: '4', name: 'Custom Codec Tweak', x: 85, y: 30, color: '#ef4444' },
];

export const MatrixDiagram: React.FC<MatrixDiagramProps> = ({
  title = 'PRIORITIZATION MATRIX (EFFORT VS IMPACT)',
  xLabel = 'EFFORT / COMPLEXITY →',
  yLabel = 'BUSINESS IMPACT / VALUE ↑',
  quadrantLabels = [
    'QUICK WINS (HIGH VALUE, LOW EFFORT)',
    'STRATEGIC BETS (HIGH VALUE, HIGH EFFORT)',
    'LOW PRIORITY (LOW VALUE, LOW EFFORT)',
    'TIME SINKS (LOW VALUE, HIGH EFFORT)',
  ],
  items = DEFAULT_ITEMS,
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
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            STRATEGIC 2x2 MATRIX
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* 2x2 Grid Canvas */}
      <div className="relative w-full aspect-[16/10] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        {/* Center Crosshair Axes */}
        <div className="absolute left-1/2 inset-y-0 w-[2px] bg-zinc-700/80 -translate-x-1/2" />
        <div className="absolute top-1/2 inset-x-0 h-[2px] bg-zinc-700/80 -translate-y-1/2" />

        {/* Quadrant Watermark Labels */}
        <div className="absolute top-3 left-4 text-[10px] font-mono font-bold tracking-wider text-emerald-400/70 uppercase">
          {quadrantLabels[0]}
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono font-bold tracking-wider text-sky-400/70 uppercase text-right">
          {quadrantLabels[1]}
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
          {quadrantLabels[2]}
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-mono font-bold tracking-wider text-red-400/70 uppercase text-right">
          {quadrantLabels[3]}
        </div>

        {/* Plotted Matrix Items */}
        {items.map((item, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const dotColor = item.color || '#38bdf8';

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer"
              style={{
                left: `${item.x}%`,
                top: `${100 - item.y}%`,
                transform: `translate(-50%, -50%) scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: dotColor }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="bg-zinc-950/90 border border-zinc-700 px-2 py-1 rounded shadow text-xs font-mono font-bold text-zinc-100 whitespace-nowrap">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Direction Indicators */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-4 px-2">
        <span>{yLabel}</span>
        <span>{xLabel}</span>
      </div>
    </div>
  );
};
