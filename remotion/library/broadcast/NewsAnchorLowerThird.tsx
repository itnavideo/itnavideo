import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NewsAnchorLowerThirdProps {
  anchorName?: string;
  title?: string;
  networkSlug?: string;
  className?: string;
}

export const NewsAnchorLowerThird: React.FC<NewsAnchorLowerThirdProps> = ({
  anchorName = 'SARAH JENNINGS',
  title = 'Chief International Affairs Anchor',
  networkSlug = 'LIVE STUDIO A',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex flex-col font-mono shadow-2xl " + className}>
      <div className="bg-red-600 text-white font-black text-xs px-3 py-1 uppercase tracking-widest inline-block self-start">
        {networkSlug}
      </div>
      <div className="bg-zinc-950/95 border-l-4 border-red-500 px-5 py-2.5 backdrop-blur-md border-y border-r border-white/10">
        <div className="text-xl font-black tracking-tight text-white uppercase">{anchorName}</div>
        <div className="text-xs text-red-300 font-medium">{title}</div>
      </div>
    </div>
  );
};
