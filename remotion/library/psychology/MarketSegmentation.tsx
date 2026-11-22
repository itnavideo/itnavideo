import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface MarketLayer {
  acronym: string;
  name: string;
  valuation: string;
  color: string;
}

export interface MarketSegmentationProps {
  title?: string;
  layers?: MarketLayer[];
  className?: string;
}

const DEFAULT_LAYERS: MarketLayer[] = [
  { acronym: 'TAM', name: 'Total Addressable Market (Global Video Creation)', valuation: '$48.5 BILLION', color: '#38bdf8' },
  { acronym: 'SAM', name: 'Serviceable Addressable Market (Short-Form Reels & Shorts)', valuation: '$14.2 BILLION', color: '#10b981' },
  { acronym: 'SOM', name: 'Serviceable Obtainable Market (AI Automated SaaS Creators)', valuation: '$850 MILLION', color: '#f59e0b' },
];

export const MarketSegmentation: React.FC<MarketSegmentationProps> = ({
  title = 'ADDRESSABLE MARKET OPPORTUNITY (TAM / SAM / SOM)',
  layers = DEFAULT_LAYERS,
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
            MARKET SIZING
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {layers.map((l, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow"
            style={{ borderLeftColor: l.color, borderLeftWidth: '4px' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  style={{ backgroundColor: `${l.color}22`, color: l.color }}
                >
                  {l.acronym}
                </span>
                <span className="text-xs font-bold text-zinc-200">{l.name}</span>
              </div>
            </div>
            <span className="text-sm font-black text-amber-400 shrink-0">{l.valuation}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
