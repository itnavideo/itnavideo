import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ArchivalPhotoProps {
  imageSrc?: string;
  caption?: string;
  date?: string;
  archiveId?: string; // e.g. "NAT-ARCH-1968"
  filter?: 'sepia' | 'grayscale' | 'vintage-color';
  cornerTape?: boolean;
  className?: string;
}

export const ArchivalPhoto: React.FC<ArchivalPhotoProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  caption = 'SURVEILLANCE PHOTOGRAPH — EXHIBIT B',
  date = 'OCTOBER 1962',
  archiveId = 'NARA RECORD #441-A',
  filter = 'sepia',
  cornerTape = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle slow push zoom
  const zoom = interpolate(frame, [0, fps * 8], [1.0, 1.05]);

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const filterStyle =
    filter === 'sepia'
      ? 'sepia(85%) contrast(110%) brightness(90%)'
      : filter === 'grayscale'
      ? 'grayscale(100%) contrast(125%) brightness(95%)'
      : 'contrast(105%) saturate(80%)';

  return (
    <div
      className={`relative inline-flex flex-col bg-[#f5f2eb] p-4 pb-6 rounded-xs shadow-2xl border border-[#d6cfc0] max-w-md ${className}`}
      style={{
        transform: `rotate(-1.5deg) scale(${entry})`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}
    >
      {/* Corner Paper Mount Tape (Top Left & Bottom Right) */}
      {cornerTape && (
        <>
          <div className="absolute -top-3 -left-3 w-10 h-6 bg-[#e6dfcb]/80 border border-amber-900/20 rotate-[-45deg] z-20 shadow-sm pointer-events-none" />
          <div className="absolute -bottom-3 -right-3 w-10 h-6 bg-[#e6dfcb]/80 border border-amber-900/20 rotate-[-45deg] z-20 shadow-sm pointer-events-none" />
        </>
      )}

      {/* Photo Frame Container */}
      <div className="relative overflow-hidden rounded-xs bg-zinc-950 aspect-[4/3] mb-3">
        {/* Actual Image with Ken Burns zoom */}
        <img
          src={imageSrc}
          alt={caption}
          className="w-full h-full object-cover transition-transform"
          style={{
            transform: `scale(${zoom})`,
            filter: filterStyle,
          }}
        />

        {/* Vintage Film Grain & Dust Scratches */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Archival ID Tag Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white/90 text-[9px] font-mono px-2 py-0.5 rounded-xs">
          {archiveId}
        </div>
      </div>

      {/* Handwritten / Typewriter Caption */}
      <div className="flex items-center justify-between text-zinc-800 font-mono text-xs px-1">
        <span className="font-bold tracking-wider uppercase">{caption}</span>
        <span className="text-zinc-500 font-semibold">{date}</span>
      </div>
    </div>
  );
};
