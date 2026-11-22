import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SponsorBugProps {
  sponsorName?: string;
  className?: string;
}

export const SponsorBug: React.FC<SponsorBugProps> = ({
  sponsorName = 'Acme Cloud Dynamics',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/70 border border-white/10 rounded-full px-3 py-1 font-mono text-white text-[10px] space-x-2 shadow-md backdrop-blur-sm " + className}>
      <span className="text-white/40 uppercase">SPONSORED BY</span>
      <span className="font-bold text-amber-400">{sponsorName}</span>
    </div>
  );
};
