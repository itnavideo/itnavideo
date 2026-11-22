import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface JourneyStage {
  stage: string;
  sentiment: 'neutral' | 'positive' | 'excited';
  touchpoint: string;
  action: string;
}

export interface CustomerJourneyProps {
  title?: string;
  stages?: JourneyStage[];
  className?: string;
}

const DEFAULT_STAGES: JourneyStage[] = [
  { stage: 'AWARENESS', sentiment: 'neutral', touchpoint: 'YouTube Shorts Feed', action: 'Discovers viral video reel' },
  { stage: 'CONSIDERATION', sentiment: 'positive', touchpoint: 'Landing Page', action: 'Explores AI generator studio' },
  { stage: 'DECISION', sentiment: 'excited', touchpoint: 'Free Signup', action: 'Exports first automated video' },
  { stage: 'ADVOCACY', sentiment: 'excited', touchpoint: 'Social Share', action: 'Shares reel with audience' },
];

export const CustomerJourney: React.FC<CustomerJourneyProps> = ({
  title = 'END-TO-END CUSTOMER JOURNEY MAP',
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
            USER EXPERIENCE (UX)
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((st, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                PHASE 0{idx + 1}
              </span>
              <h4 className="text-sm font-serif font-bold text-zinc-100 uppercase mt-1">
                {st.stage}
              </h4>
              <div className="text-xs font-mono text-sky-400 mt-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                {st.touchpoint}
              </div>
            </div>
            <p className="text-[11px] font-sans text-zinc-300 mt-4 pt-2 border-t border-zinc-800">
              {st.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
