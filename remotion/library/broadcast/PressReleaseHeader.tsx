import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PressReleaseHeaderProps {
  companyName?: string;
  releaseTitle?: string;
  embargoDate?: string;
  location?: string;
  className?: string;
}

export const PressReleaseHeader: React.FC<PressReleaseHeaderProps> = ({
  companyName = 'ITNAVIDEO INC. GLOBAL HEADQUARTERS',
  releaseTitle = 'FOR IMMEDIATE RELEASE: NEXT-GEN REMOTION VIDEO ENGINE V2',
  embargoDate = 'SAN FRANCISCO, CA — NOVEMBER 22, 2026',
  location = 'PRESS BULLETIN // WIRE TRANSMISSION',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 flex items-center justify-center font-mono ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [-25, 0])}px) scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest pb-2 border-b border-white/10">
          <span>{companyName}</span>
          <span className="text-emerald-400">● {location}</span>
        </div>

        <h2 className="text-white font-black text-sm md:text-base tracking-tight mt-2.5 leading-snug">
          {releaseTitle}
        </h2>

        <div className="text-[11px] text-zinc-400 font-semibold mt-2">
          {embargoDate}
        </div>
      </div>
    </div>
  );
};
