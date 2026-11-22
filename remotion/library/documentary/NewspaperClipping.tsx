import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NewspaperClippingProps {
  publication?: string;
  headline?: string;
  date?: string;
  edition?: string;
  articleSnippet?: string;
  highlightedText?: string;
  highlightColor?: string;
  className?: string;
}

export const NewspaperClipping: React.FC<NewspaperClippingProps> = ({
  publication = 'THE METROPOLITAN GAZETTE',
  headline = 'TREASURY AUDIT REVEALS MILLIONS UNACCOUNTED IN SUBWAY CONTRACT',
  date = 'FRIDAY, NOVEMBER 17, 1972',
  edition = 'FINAL CITY EDITION • 15 CENTS',
  articleSnippet = 'An unannounced municipal audit released yesterday evening has triggered intense scrutiny into procurement agreements signed over the preceding six months.',
  highlightedText = 'MILLIONS UNACCOUNTED',
  highlightColor = 'rgba(250, 204, 21, 0.45)', // Marker highlighter yellow
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  // Animated highlighter marker pen sweep
  const highlightWidth = interpolate(frame, [15, 35], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative w-full max-w-xl bg-[#eee8d5] text-zinc-950 p-6 sm:p-8 rounded-xs shadow-2xl border border-[#d6cfba] select-none ${className}`}
      style={{
        transform: `rotate(1deg) scale(${entry})`,
        boxShadow: '0 25px 45px rgba(0,0,0,0.6)',
      }}
    >
      {/* Torn Paper Top Border Accent */}
      <div className="border-b-2 border-zinc-900 pb-2 mb-4">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-zinc-700">
          <span>{date}</span>
          <span>{edition}</span>
        </div>
        <h4 className="text-center text-xl sm:text-2xl font-serif font-black tracking-widest uppercase text-zinc-900 my-1">
          {publication}
        </h4>
        <div className="h-[1px] bg-zinc-800" />
      </div>

      {/* Main Headline with Marker Highlight */}
      <div className="relative mb-4">
        <h2 className="relative z-10 text-lg sm:text-2xl font-serif font-black uppercase tracking-tight text-zinc-950 leading-tight">
          {headline}
        </h2>

        {/* Yellow Highlighter Stroke */}
        <div
          className="absolute inset-y-0 left-0 z-0 pointer-events-none rounded-xs"
          style={{
            width: `${highlightWidth}%`,
            backgroundColor: highlightColor,
          }}
        />
      </div>

      {/* Two Column Newsprint Body Layout */}
      <div className="grid grid-cols-2 gap-4 text-xs font-serif leading-relaxed text-zinc-800 text-justify">
        <p className="first-letter:text-2xl first-letter:font-black first-letter:float-left first-letter:mr-1">
          {articleSnippet}
        </p>
        <p className="text-zinc-600">
          Investigators declined to state whether subpoenas had been issued, citing an ongoing grand jury inquiry set to convene early next Tuesday.
        </p>
      </div>
    </div>
  );
};
