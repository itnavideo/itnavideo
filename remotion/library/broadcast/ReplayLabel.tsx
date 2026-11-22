import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ReplayLabelProps {
  speedLabel?: string;
  className?: string;
}

export const ReplayLabel: React.FC<ReplayLabelProps> = ({
  speedLabel = 'SLOW MOTION 0.5X',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded shadow-lg uppercase tracking-wider space-x-2 " + className}>
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      <span>INSTANT REPLAY</span>
      <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/90">{speedLabel}</span>
    </div>
  );
};
