import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SourceCitationProps {
  sourceTitle?: string;
  authorOrAgency?: string;
  archiveId?: string;
  year?: string;
  declassifiedDate?: string;
  className?: string;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({
  sourceTitle = 'Memorandum for the Special Assistant to the President',
  authorOrAgency = 'Joint Chiefs of Staff • Department of Defense',
  archiveId = 'DOC-ID: #892-004-B',
  year = '1962',
  declassifiedDate = 'DECLASSIFIED: NOV 1998',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 90 },
  });

  return (
    <div
      className={`relative inline-flex flex-col bg-zinc-900/90 border-l-4 border-l-amber-500 border-y border-r border-zinc-800 rounded-r-xl p-4 shadow-xl max-w-lg backdrop-blur-md select-none ${className}`}
      style={{
        transform: `translateX(${interpolate(entry, [0, 1], [-20, 0])}px)`,
        opacity: entry,
      }}
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
        <span>ARCHIVAL CITATION</span>
        <span className="text-emerald-400 font-semibold">{declassifiedDate}</span>
      </div>

      <h4 className="text-sm font-serif font-bold text-zinc-100 leading-snug mb-1">
        "{sourceTitle}"
      </h4>

      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1 border-t border-zinc-800">
        <span>{authorOrAgency}</span>
        <span className="text-amber-500 font-bold">{archiveId}</span>
      </div>
    </div>
  );
};
