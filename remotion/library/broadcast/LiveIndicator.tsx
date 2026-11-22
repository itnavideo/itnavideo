import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LiveIndicatorProps {
  viewerCount?: string;
  className?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  viewerCount = '42.8K',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-black/80 border border-white/20 rounded-md px-2.5 py-1 font-mono text-white text-xs shadow-md space-x-2 " + className}>
      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
      <span className="font-black text-red-500 uppercase tracking-widest">LIVE</span>
      {viewerCount && (
        <span className="text-[10px] text-white/60 border-l border-white/20 pl-2 font-bold">
          👁 {viewerCount}
        </span>
      )}
    </div>
  );
};
