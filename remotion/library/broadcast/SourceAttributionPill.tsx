import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SourceAttributionPillProps {
  sourceName?: string;
  license?: string;
  year?: string;
  className?: string;
}

export const SourceAttributionPill: React.FC<SourceAttributionPillProps> = ({
  sourceName = 'NASA Jet Propulsion Laboratory (JPL)',
  license = 'Public Domain / Open Data',
  year = '2024',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-2 flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px) scale(${enter})`,
        opacity: enter,
      }}
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-lg bg-black/80 text-[11px] text-zinc-300">
        <span className="text-zinc-500">Source:</span>
        <span className="text-white font-bold truncate max-w-xs">{sourceName}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400 text-[10px]">{license} ({year})</span>
      </div>
    </div>
  );
};
