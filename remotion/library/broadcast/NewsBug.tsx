import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NewsBugProps {
  networkName?: string;
  timeString?: string;
  className?: string;
}

export const NewsBug: React.FC<NewsBugProps> = ({
  networkName = 'ITNA NEWS 24',
  timeString = '14:45 EST',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/80 border border-white/20 rounded-lg p-1.5 font-mono text-white shadow-lg backdrop-blur-md " + className}>
      <div className="bg-red-600 px-2 py-1 rounded text-[10px] font-black tracking-widest mr-2">
        {networkName}
      </div>
      <div className="text-[11px] text-white/90 font-bold px-1">{timeString}</div>
    </div>
  );
};
