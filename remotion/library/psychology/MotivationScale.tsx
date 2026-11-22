import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface MotivationPillar {
  name: string;
  type: 'intrinsic' | 'extrinsic';
  description: string;
  color: string;
}

export interface MotivationScaleProps {
  title?: string;
  pillars?: MotivationPillar[];
  className?: string;
}

const DEFAULT_PILLARS: MotivationPillar[] = [
  { name: 'AUTONOMY', type: 'intrinsic', description: 'Freedom to control one’s own creative direction', color: '#10b981' },
  { name: 'MASTERY', type: 'intrinsic', description: 'Urge to get better at viral video storytelling', color: '#38bdf8' },
  { name: 'PURPOSE', type: 'intrinsic', description: 'Desire to educate, inspire, and reach millions', color: '#6366f1' },
  { name: 'FINANCIAL REWARD', type: 'extrinsic', description: 'Ad revenue, sponsorships, and client retainer fees', color: '#f59e0b' },
];

export const MotivationScale: React.FC<MotivationScaleProps> = ({
  title = 'SELF-DETERMINATION MOTIVATION SPECTRUM',
  pillars = DEFAULT_PILLARS,
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
            HUMAN MOTIVATION DYNAMICS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
            style={{ borderLeftColor: p.color, borderLeftWidth: '4px' }}
          >
            <div>
              <span
                className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: `${p.color}22`, color: p.color }}
              >
                {p.type}
              </span>
              <h4 className="text-sm font-serif font-black text-zinc-100 uppercase mt-2">
                {p.name}
              </h4>
              <p className="text-xs font-sans text-zinc-400 mt-1 leading-relaxed">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
