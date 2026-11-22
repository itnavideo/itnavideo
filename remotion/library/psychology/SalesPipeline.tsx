import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface DealStage {
  stage: string;
  deals: number;
  value: string;
  color: string;
}

export interface SalesPipelineProps {
  title?: string;
  totalPipelineValue?: string;
  stages?: DealStage[];
  className?: string;
}

const DEFAULT_STAGES: DealStage[] = [
  { stage: 'LEAD INBOX', deals: 142, value: '$28,400', color: '#38bdf8' },
  { stage: 'QUALIFIED DISCOVERY', deals: 64, value: '$19,200', color: '#6366f1' },
  { stage: 'PRODUCT DEMO', deals: 32, value: '$14,400', color: '#f59e0b' },
  { stage: 'CONTRACT PROPOSAL', deals: 18, value: '$10,800', color: '#10b981' },
  { stage: 'CLOSED WON', deals: 12, value: '$8,400', color: '#ec4899' },
];

export const SalesPipeline: React.FC<SalesPipelineProps> = ({
  title = 'B2B ENTERPRISE SALES PIPELINE',
  totalPipelineValue = '$81,200 ACTIVE PIPELINE',
  stages = DEFAULT_STAGES,
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
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            REVENUE PIPELINE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">{totalPipelineValue}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
            style={{ borderTopColor: st.color, borderTopWidth: '3px' }}
          >
            <div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                STAGE 0{idx + 1}
              </span>
              <h4 className="text-xs font-serif font-bold text-zinc-100 uppercase mt-1">
                {st.stage}
              </h4>
            </div>
            <div className="mt-4 pt-2 border-t border-zinc-800">
              <div className="text-sm font-mono font-black text-amber-400">{st.value}</div>
              <span className="text-[10px] font-mono text-zinc-500">{st.deals} DEALS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
