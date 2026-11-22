import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface HistoricalFootageFrameProps {
  children?: React.ReactNode;
  format?: '16mm' | '8mm' | 'vhs' | 'broadcast';
  timecode?: string;
  reelNumber?: string;
  fpsLabel?: string;
  flicker?: boolean;
  sprockets?: boolean;
  className?: string;
}

export const HistoricalFootageFrame: React.FC<HistoricalFootageFrameProps> = ({
  children,
  format = '16mm',
  timecode = '00:14:38:12',
  reelNumber = 'REEL 04-B',
  fpsLabel = '24 FPS',
  flicker = true,
  sprockets = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle projector gate vertical jitter
  const jitterY = flicker ? (Math.sin(frame * 4.3) * 0.8) : 0;
  // Projector exposure breathing flicker
  const exposure = flicker ? 1 + (Math.sin(frame * 8.2) * 0.04) : 1;

  // Running timecode math
  const totalFrames = frame + 250;
  const tcFrames = (totalFrames % 24).toString().padStart(2, '0');
  const tcSeconds = Math.floor((totalFrames / 24) % 60).toString().padStart(2, '0');
  const dynamicTimecode = `00:14:${tcSeconds}:${tcFrames}`;

  return (
    <div
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}
      style={{
        filter: `brightness(${exposure})`,
      }}
    >
      {/* Vintage 16mm Film Sprocket Holes (Left & Right borders) */}
      {sprockets && (
        <>
          <div className="absolute left-2 inset-y-0 flex flex-col justify-around pointer-events-none z-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-6 bg-zinc-950 border border-zinc-700/60 rounded-xs shadow-inner"
              />
            ))}
          </div>
          <div className="absolute right-2 inset-y-0 flex flex-col justify-around pointer-events-none z-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-6 bg-zinc-950 border border-zinc-700/60 rounded-xs shadow-inner"
              />
            ))}
          </div>
        </>
      )}

      {/* Main Viewport with Gate Jitter */}
      <div
        className="relative w-full h-full max-w-5xl overflow-hidden rounded-md"
        style={{
          transform: `translateY(${jitterY}px)`,
        }}
      >
        {children}

        {/* Vintage Film Scratches & Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Top Historical Telemetry Strip */}
        <div className="absolute top-4 inset-x-8 flex items-center justify-between text-xs font-mono text-amber-400/90 z-20 pointer-events-none drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">HISTORICAL ARCHIVE [{format}]</span>
          </div>
          <span>{reelNumber}</span>
        </div>

        {/* Bottom Timecode & Spec Strip */}
        <div className="absolute bottom-4 inset-x-8 flex items-center justify-between text-xs font-mono text-zinc-300 z-20 pointer-events-none drop-shadow-md">
          <span>{dynamicTimecode}</span>
          <span className="text-zinc-500 font-semibold">{fpsLabel}</span>
        </div>
      </div>
    </div>
  );
};
