import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentaryTitleProps {
  title?: string;
  subtitle?: string;
  genreTag?: string; // e.g. "AN INVESTIGATIVE SPECIAL"
  year?: string;
  theme?: 'dark-crimson' | 'sepia-archive' | 'cold-noir' | 'gold-editorial';
  className?: string;
}

export const DocumentaryTitle: React.FC<DocumentaryTitleProps> = ({
  title = 'THE UNRESOLVED SIGNAL',
  subtitle = 'Declassified transmissions from the deep ocean network',
  genreTag = 'AN INVESTIGATIVE SPECIAL',
  year = '1974 — 1989',
  theme = 'dark-crimson',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle slow cinematic camera drift push-in
  const scale = interpolate(frame, [0, fps * 10], [1.0, 1.08]);

  // Cinematic letter-spacing tracking expansion
  const tracking = interpolate(frame, [0, fps * 3], [0.15, 0.35], {
    extrapolateRight: 'clamp',
  });

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20, mass: 1.2, stiffness: 40 },
  });

  const subtitleOpacity = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 18, mass: 1.0, stiffness: 50 },
  });

  const accentColor =
    theme === 'dark-crimson'
      ? '#ef4444'
      : theme === 'sepia-archive'
      ? '#d97706'
      : theme === 'cold-noir'
      ? '#06b6d4'
      : '#eab308';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-8 bg-black text-center overflow-hidden select-none ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 90%, black 100%)',
        }}
      />

      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Genre Tagline */}
      <div
        className="relative z-10 flex items-center gap-3 text-xs md:text-sm font-mono uppercase text-zinc-400 mb-6"
        style={{ opacity: titleOpacity }}
      >
        <span className="w-8 h-[1px]" style={{ backgroundColor: accentColor }} />
        <span>{genreTag}</span>
        <span>•</span>
        <span className="text-zinc-500">{year}</span>
        <span className="w-8 h-[1px]" style={{ backgroundColor: accentColor }} />
      </div>

      {/* Master Film Title */}
      <h1
        className="relative z-10 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-widest text-zinc-100 uppercase max-w-4xl leading-tight drop-shadow-2xl mb-6"
        style={{
          opacity: titleOpacity,
          letterSpacing: `${tracking}em`,
        }}
      >
        {title}
      </h1>

      {/* Center Dividing Rule */}
      <div
        className="relative z-10 w-24 h-[2px] mb-6 transition-all"
        style={{
          opacity: subtitleOpacity,
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}`,
        }}
      />

      {/* Subtitle / Thesis Statement */}
      <p
        className="relative z-10 text-sm sm:text-base md:text-lg font-sans font-light text-zinc-400 max-w-2xl leading-relaxed italic"
        style={{ opacity: subtitleOpacity }}
      >
        "{subtitle}"
      </p>
    </div>
  );
};
