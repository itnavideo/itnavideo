import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface QuoteCalloutFrameProps {
  quote?: string;
  author?: string;
  role?: string;
  accentColor?: string;
  className?: string;
}

export const QuoteCalloutFrame: React.FC<QuoteCalloutFrameProps> = ({
  quote = '“Code is the new film reel. When you compile video through pure mathematics, rendering speeds scale linearly with cloud capacity.”',
  author = 'Steve Jobs',
  role = 'Visionary & Co-Founder, Apple Inc.',
  accentColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 flex items-center justify-center ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 14, 18, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px ${accentColor}20`,
        }}
      >
        {/* Giant Quotation Mark */}
        <span
          className="absolute -top-4 -left-1 text-7xl font-serif font-black select-none pointer-events-none opacity-20"
          style={{ color: accentColor }}
        >
          “
        </span>

        <p className="text-zinc-100 text-sm md:text-base font-serif italic leading-relaxed relative z-10">
          {quote}
        </p>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col relative z-10 font-sans">
          <span className="text-white font-bold text-sm tracking-tight">{author}</span>
          <span className="text-zinc-400 text-xs mt-0.5">{role}</span>
        </div>
      </div>
    </div>
  );
};
