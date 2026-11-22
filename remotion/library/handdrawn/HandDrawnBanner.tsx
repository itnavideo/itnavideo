import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnBannerProps {
  bannerText?: string;
  color?: string;
  className?: string;
}

export const HandDrawnBanner: React.FC<HandDrawnBannerProps> = ({
  bannerText = 'SPECIAL ANNOUNCEMENT',
  color = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HAND-DRAWN RIBBON BANNER
        </span>
        <span className="text-white/40">PARCHMENT SCROLL</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center relative">
        <svg className="w-80 h-28 overflow-visible" viewBox="0 0 300 100">
          {/* Main scroll banner with folded ends */}
          <path
            d="M 40,30 L 260,30 L 245,65 L 25,65 Z M 40,65 L 15,80 L 25,50 Z M 245,65 L 285,80 L 260,50 Z"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="600"
            strokeDashoffset={600 * (1 - progress)}
          />
        </svg>
        <div className="absolute font-black tracking-widest text-amber-300 font-mono text-sm uppercase">
          {bannerText}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SWALLOWTAIL RIBBON FOLDS</span>
        <span>TITLE CAROUSEL HOOK</span>
      </div>
    </div>
  );
};
