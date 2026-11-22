import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface CreditItem {
  role: string;
  name: string;
}

export interface CinematicCreditsProps {
  title?: string;
  credits?: CreditItem[];
  disclaimer?: string;
  speed?: number; // Scrolling speed
  className?: string;
}

const DEFAULT_CREDITS: CreditItem[] = [
  { role: 'DIRECTED BY', name: 'JONATHAN R. STERLING' },
  { role: 'EXECUTIVE PRODUCER', name: 'MARGARET HOLLOWAY' },
  { role: 'ARCHIVAL RESEARCH LEAD', name: 'DR. SAMUEL T. CHEN' },
  { role: 'DIRECTOR OF PHOTOGRAPHY', name: 'ALEXEI PETROV' },
  { role: 'ORIGINAL SCORE', name: 'KAI BRYANT' },
  { role: 'AUDIO RESTORATION', name: 'METRO SOUND LABS' },
];

export const CinematicCredits: React.FC<CinematicCreditsProps> = ({
  title = 'A PRODUCTION OF THE INVESTIGATIVE JOURNALISM ARCHIVE',
  credits = DEFAULT_CREDITS,
  disclaimer = 'Certain historical records featured in this broadcast were declassified under the Freedom of Information Act. All reconstructions are based on verified court transcripts.',
  speed = 1.0,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow smooth upward vertical roll
  const scrollY = interpolate(frame, [0, fps * 20 * (1 / speed)], [100, -150]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black text-center flex flex-col items-center justify-center p-8 select-none ${className}`}
    >
      <div
        className="flex flex-col items-center max-w-xl transition-transform"
        style={{
          transform: `translateY(${scrollY}%)`,
        }}
      >
        {/* Film Production Slate */}
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-12">
          {title}
        </h3>

        {/* Credit Roll Pairs */}
        <div className="space-y-8 mb-16">
          {credits.map((c, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
                {c.role}
              </span>
              <span className="text-base sm:text-lg font-serif font-bold tracking-wider text-zinc-100 uppercase">
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] font-sans text-zinc-600 max-w-md leading-relaxed italic border-t border-zinc-900 pt-8">
          {disclaimer}
        </p>
      </div>
    </div>
  );
};
