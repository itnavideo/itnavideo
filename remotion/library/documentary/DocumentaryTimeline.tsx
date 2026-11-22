import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TimelineMilestone {
  time: string;
  headline: string;
  description: string;
  evidenceBadge?: string;
}

export interface DocumentaryTimelineProps {
  caseTitle?: string;
  milestones?: TimelineMilestone[];
  activeIndex?: number;
  className?: string;
}

const DEFAULT_MILESTONES: TimelineMilestone[] = [
  { time: '04:15 HRS', headline: 'PERIMETER BREACH', description: 'Sensor alert triggered along northern wire fence.', evidenceBadge: 'LOG-01' },
  { time: '05:40 HRS', headline: 'RADIO BLACKOUT', description: 'Base frequency jammed across all VHF channels.', evidenceBadge: 'TAPE-04' },
  { time: '07:12 HRS', headline: 'SEARCH SQUAD DISPATCH', description: 'Patrol unit arrives at empty forward bunker.', evidenceBadge: 'PHOTO-09' },
];

export const DocumentaryTimeline: React.FC<DocumentaryTimelineProps> = ({
  caseTitle = 'SEQUENCE OF EVENTS — 24 OCTOBER',
  milestones = DEFAULT_MILESTONES,
  activeIndex,
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
      className={`relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold mb-1">
        CHRONOLOGY RECORD
      </div>
      <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-100 uppercase tracking-wide mb-6">
        {caseTitle}
      </h3>

      {/* Sequential Vertical Step List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
        {milestones.map((m, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 8),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const isActive = activeIndex !== undefined ? activeIndex === idx : true;

          return (
            <div
              key={idx}
              className="relative"
              style={{
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                opacity: itemSpring,
              }}
            >
              {/* Milestone Indicator Node */}
              <div
                className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center ${
                  isActive ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-zinc-700'
                }`}
              />

              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono font-bold text-amber-400">{m.time}</span>
                {m.evidenceBadge && (
                  <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                    {m.evidenceBadge}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-serif font-bold text-zinc-100">{m.headline}</h4>
              <p className="text-xs font-sans text-zinc-400 mt-0.5 leading-relaxed">
                {m.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
