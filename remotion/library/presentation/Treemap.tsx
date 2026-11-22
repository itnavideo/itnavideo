import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface TreemapNode {
  name: string;
  share: number; // % share
  color: string;
  change?: string; // e.g. "+14.2%"
}

export interface TreemapProps {
  title?: string;
  nodes?: TreemapNode[];
  className?: string;
}

const DEFAULT_NODES: TreemapNode[] = [
  { name: 'Shorts Studio', share: 42, color: '#38bdf8', change: '+28.4%' },
  { name: 'Auto Captions', share: 24, color: '#10b981', change: '+18.1%' },
  { name: 'Book Summaries', share: 18, color: '#6366f1', change: '+12.5%' },
  { name: 'Whiteboard Maker', share: 10, color: '#f59e0b', change: '+6.2%' },
  { name: 'Audio Cleaning', share: 6, color: '#ec4899', change: '+3.8%' },
];

export const Treemap: React.FC<TreemapProps> = ({
  title = 'PORTFOLIO SEGMENT TREEMAP SHARE',
  nodes = DEFAULT_NODES,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            PROPORTIONAL SHARE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Responsive Treemap Layout Grid */}
      <div className="grid grid-cols-12 gap-3 aspect-[16/9]">
        {/* Large Primary Block (Col 1-7) */}
        <div
          className="col-span-7 rounded-xl p-5 flex flex-col justify-between text-zinc-950 shadow-xl"
          style={{ backgroundColor: nodes[0].color }}
        >
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase">
              {nodes[0].share}% SHARE
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-black uppercase mt-1">
              {nodes[0].name}
            </h4>
          </div>
          <div className="text-sm font-mono font-black">{nodes[0].change}</div>
        </div>

        {/* Right Stack (Col 8-12) */}
        <div className="col-span-5 grid grid-rows-2 gap-3">
          {/* Sub Block 1 */}
          <div
            className="rounded-xl p-4 flex flex-col justify-between text-zinc-950 shadow-lg"
            style={{ backgroundColor: nodes[1].color }}
          >
            <div className="flex justify-between items-start">
              <h5 className="font-serif font-black text-sm uppercase">{nodes[1].name}</h5>
              <span className="font-mono text-xs font-bold">{nodes[1].share}%</span>
            </div>
            <span className="font-mono text-xs font-bold">{nodes[1].change}</span>
          </div>

          {/* Sub Row 2 (Split in 2) */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-xl p-3 flex flex-col justify-between text-zinc-950"
              style={{ backgroundColor: nodes[2].color }}
            >
              <h6 className="font-serif font-black text-xs uppercase truncate">{nodes[2].name}</h6>
              <span className="font-mono text-[11px] font-bold">{nodes[2].share}%</span>
            </div>
            <div
              className="rounded-xl p-3 flex flex-col justify-between text-zinc-950"
              style={{ backgroundColor: nodes[3].color }}
            >
              <h6 className="font-serif font-black text-xs uppercase truncate">{nodes[3].name}</h6>
              <span className="font-mono text-[11px] font-bold">{nodes[3].share}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
