import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LocationBugProps {
  locationName?: string;
  satelliteFeedId?: string;
  className?: string;
}

export const LocationBug: React.FC<LocationBugProps> = ({
  locationName = 'TOKYO, JAPAN',
  satelliteFeedId = 'SAT-LINK 4',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/80 border border-white/10 rounded px-2.5 py-1 font-mono text-white text-[11px] shadow-md space-x-2 " + className}>
      <span className="text-red-500 font-bold">⌖</span>
      <span className="font-bold tracking-wider uppercase">{locationName}</span>
      <span className="text-[9px] text-white/40 border-l border-white/20 pl-2">{satelliteFeedId}</span>
    </div>
  );
};
