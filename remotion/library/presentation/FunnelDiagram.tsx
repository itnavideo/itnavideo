import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface FunnelStage {
  name: string;
  count: string;
  dropRate: string;
  color: string;
}

export interface FunnelDiagramProps {
  title?: string;
  stages?: FunnelStage[];
  className?: string;
}

const DEFAULT_STAGES: FunnelStage[] = [
  { name: 'TOP OF FUNNEL (REEL IMPRESSIONS)', count: '1,200,000', dropRate: '100%', color: '#38bdf8' },
  { name: 'PROFILE VISITS', count: '180,000', dropRate: '15.0%', color: '#6366f1' },
  { name: 'FREE STUDIO SIGNUPS', count: '45,000', dropRate: '3.75%', color: '#10b981' },
  { name: 'PAID PRO SUBSCRIBERS', count: '5,400', dropRate: '0.45%', color: '#f59e0b' },
];

export const FunnelDiagram: React.FC<FunnelDiagramProps> = ({
  title = 'END-TO-END CONVERSION FUNNEL DIAGRAM',
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
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            PIPELINE CONVERSION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Centered Funnel Tiers */}
      <div className="space-y-2.5 flex flex-col items-center">
        {stages.map((stage, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          // Proportional width stepping down: 100% -> 80% -> 60% -> 40%
          const stepWidth = 100 - idx * 18;

          return (
            <div
              key={idx}
              className="h-14 rounded-xl flex items-center justify-between px-5 text-zinc-950 shadow-xl transition-all"
              style={{
                width: `${stepWidth * itemSpring}%`,
                backgroundColor: stage.color,
                boxShadow: `0 4px 20px ${stage.color}40`,
              }}
            >
              <span className="text-xs font-serif font-black uppercase truncate">
                {stage.name}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono font-black shrink-0">
                <span>{stage.count}</span>
                <span className="bg-zinc-950/20 px-2 py-0.5 rounded text-[10px]">
                  {stage.dropRate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
