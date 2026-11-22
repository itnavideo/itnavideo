import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BroadcastFrameProps {
  channelLabel?: string;
  className?: string;
}

export const BroadcastFrame: React.FC<BroadcastFrameProps> = ({
  channelLabel = 'FEED A // HD MASTER',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full border-2 border-white/10 p-3 pointer-events-none font-mono text-[10px] text-white/40 flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center">
        <span>┌ 90% TITLE SAFE</span>
        <span className="text-white/60 font-bold">{channelLabel}</span>
        <span>┐</span>
      </div>
      <div className="flex justify-between items-center">
        <span>└ 80% ACTION SAFE</span>
        <span>REC AUTO ┘</span>
      </div>
    </div>
  );
};
