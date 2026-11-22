import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ChapterIntroductionProps {
  chapterNumber?: string | number; // e.g. "III" or "03"
  chapterTitle?: string;
  timeframe?: string; // e.g. "NOVEMBER 1963"
  summaryTeaser?: string;
  accentColor?: string;
  className?: string;
}

export const ChapterIntroduction: React.FC<ChapterIntroductionProps> = ({
  chapterNumber = 'IV',
  chapterTitle = 'THE MIDNIGHT RENDEZVOUS',
  timeframe = 'OCTOBER 1979 • BERLIN',
  summaryTeaser = 'Forty-eight hours before the eastern crossing was sealed, a diplomatic courier disappeared.',
  accentColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numEntry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1.0, stiffness: 70 },
  });

  const titleEntry = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 80 },
  });

  const dividerWidth = interpolate(frame, [15, 35], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-950 text-center select-none overflow-hidden ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none opacity-15"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Chapter Number Roman Watermark */}
      <div
        className="relative z-10 text-6xl sm:text-8xl md:text-9xl font-serif font-black tracking-widest text-zinc-800/40 select-none -mb-6"
        style={{
          transform: `scale(${numEntry})`,
          opacity: numEntry,
        }}
      >
        CHAPTER {chapterNumber}
      </div>

      {/* Chapter Timeframe & Location Tag */}
      <div
        className="relative z-20 flex items-center gap-2 text-xs sm:text-sm font-mono tracking-widest uppercase mb-3"
        style={{
          opacity: titleEntry,
          color: accentColor,
        }}
      >
        <span>{timeframe}</span>
      </div>

      {/* Chapter Title Headline */}
      <h2
        className="relative z-20 text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wider text-zinc-100 uppercase max-w-3xl leading-snug drop-shadow-lg mb-6"
        style={{
          opacity: titleEntry,
          transform: `translateY(${interpolate(titleEntry, [0, 1], [20, 0])}px)`,
        }}
      >
        {chapterTitle}
      </h2>

      {/* Animated Width Dividing Rule */}
      <div
        className="relative z-20 h-[2px] bg-zinc-700 mb-6 overflow-hidden"
        style={{ width: `${dividerWidth * 1.5}px` }}
      >
        <div
          className="w-full h-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Summary Narrative Teaser */}
      <p
        className="relative z-20 text-xs sm:text-sm md:text-base font-sans text-zinc-400 max-w-xl leading-relaxed italic"
        style={{
          opacity: titleEntry,
          transform: `translateY(${interpolate(titleEntry, [0, 1], [15, 0])}px)`,
        }}
      >
        {summaryTeaser}
      </p>
    </div>
  );
};
