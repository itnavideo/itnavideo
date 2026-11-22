import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface PhotoZoomProps {
  imageSrc?: string;
  caption?: string;
  targetX?: number; // % zoom focus point (0 - 100)
  targetY?: number; // % zoom focus point (0 - 100)
  zoomScale?: number; // Maximum zoom level
  reticle?: boolean; // Tactical glowing target crosshair
  className?: string;
}

export const PhotoZoom: React.FC<PhotoZoomProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&q=80',
  caption = 'ENLARGEMENT: VEHICLE LICENSE PLATE #NY-4891',
  targetX = 65,
  targetY = 40,
  zoomScale = 1.45,
  reticle = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth progressive Ken Burns zoom into target coordinates
  const scale = interpolate(frame, [0, fps * 6], [1.0, zoomScale], {
    extrapolateRight: 'clamp',
  });

  const reticlePulse = 1 + Math.sin(frame * 0.2) * 0.08;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl bg-black border border-zinc-800 shadow-2xl ${className}`}
    >
      {/* Zoomable Image Layer */}
      <div
        className="w-full h-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${targetX}% ${targetY}%`,
          transition: 'transform 0.05s linear',
        }}
      >
        <img
          src={imageSrc}
          alt={caption}
          className="w-full h-full object-cover filter contrast-110 brightness-95"
        />
      </div>

      {/* Target Reticle Crosshair */}
      {reticle && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${targetX}%`,
            top: `${targetY}%`,
            transform: `translate(-50%, -50%) scale(${reticlePulse})`,
          }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-red-500/80 shadow-[0_0_12px_#ef4444]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/80 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-red-500/80 -translate-x-1/2" />
        </div>
      )}

      {/* Bottom Technical Caption */}
      <div className="absolute bottom-4 inset-x-4 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md rounded-lg px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-300 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-zinc-100">{caption}</span>
        </div>
        <span className="text-zinc-500">ZOOM: {scale.toFixed(2)}x</span>
      </div>
    </div>
  );
};
