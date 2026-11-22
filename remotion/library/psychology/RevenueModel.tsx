import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface RevenueStream {
  streamName: string;
  sharePercent: number;
  description: string;
  color: string;
}

export interface RevenueModelProps {
  title?: string;
  streams?: RevenueStream[];
  className?: string;
}

const DEFAULT_STREAMS: RevenueStream[] = [
  { streamName: 'Monthly / Annual SaaS Subscriptions', sharePercent: 55, description: 'Predictable recurring creator tiers', color: '#38bdf8' },
  { streamName: 'Pay-As-You-Go Credit Top-ups', sharePercent: 25, description: 'High-volume export bursts', color: '#10b981' },
  { streamName: 'Enterprise Team Seats & White-Label', sharePercent: 15, description: 'Custom branding & priority queues', color: '#f59e0b' },
  { streamName: 'Developer API Monetization', sharePercent: 5, description: 'Headless video rendering endpoint', color: '#ec4899' },
];

export const RevenueModel: React.FC<RevenueModelProps> = ({
  title = 'DIVERSIFIED BUSINESS REVENUE MODEL',
  streams = DEFAULT_STREAMS,
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
            FINANCIAL MONETIZATION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {streams.map((s, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ borderLeftColor: s.color, borderLeftWidth: '4px' }}
          >
            <div>
              <div className="text-xs sm:text-sm font-bold text-zinc-100">{s.streamName}</div>
              <p className="text-[11px] font-sans text-zinc-400 mt-0.5">{s.description}</p>
            </div>
            <span className="text-sm font-black text-amber-400 shrink-0">
              {s.sharePercent}% SHARE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
