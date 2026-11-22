import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BorderHighlightProps {
  regionName?: string;
  treatyStatus?: string;
  borderLengthKm?: string;
  color?: string;
  className?: string;
}

export const BorderHighlight: React.FC<BorderHighlightProps> = ({
  regionName = 'SCHENGEN BORDER REGIME',
  treatyStatus = 'OPEN FRONTIER PROTOCOL',
  borderLengthKm = '14,500 KM CONTINENTAL LINE',
  color = '#38bdf8',
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
            GEOPOLITICAL BOUNDARY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {regionName}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">{treatyStatus}</span>
      </div>

      {/* Border Canvas */}
      <div className="relative w-full aspect-[16/7] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6 flex items-center justify-center">
        <svg viewBox="0 0 500 200" className="w-full h-full">
          <path
            d="M 50 150 Q 150 40 280 120 T 450 60"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray="6 3"
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>

        <div className="absolute bottom-4 right-4 bg-zinc-950/90 border border-zinc-800 px-3 py-1 rounded text-xs font-mono text-zinc-300">
          TOTAL LENGTH: {borderLengthKm}
        </div>
      </div>
    </div>
  );
};
