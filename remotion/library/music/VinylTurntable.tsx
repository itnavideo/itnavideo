import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VinylTurntableProps {
  rpm?: '33' | '45';
  trackTitle?: string;
  artistName?: string;
  spinning?: boolean;
  className?: string;
}

export const VinylTurntable: React.FC<VinylTurntableProps> = ({
  rpm = '33',
  trackTitle = 'Midnight Chill Lo-Fi Beats',
  artistName = 'ItnaVideo Sound Lab',
  spinning = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const rotation = spinning ? (frame * 2.5) % 360 : 0;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 16, 14, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            ANALOG DIRECT-DRIVE TURNTABLE
          </span>
          <span className="text-zinc-500 text-[10px]">{rpm} RPM</span>
        </div>

        {/* Vinyl Disc Platter */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-3">
          {/* Outer Platter Edge */}
          <div className="absolute inset-0 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-2xl" />

          {/* Rotating Vinyl Record */}
          <div
            className="w-44 h-44 rounded-full bg-zinc-950 border border-zinc-800 relative flex items-center justify-center shadow-inner overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Grooves */}
            <div className="absolute inset-2 rounded-full border border-zinc-800 opacity-60" />
            <div className="absolute inset-5 rounded-full border border-zinc-800 opacity-60" />
            <div className="absolute inset-8 rounded-full border border-zinc-800 opacity-60" />
            <div className="absolute inset-11 rounded-full border border-zinc-800 opacity-60" />

            {/* Shimmer light sheen over vinyl */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

            {/* Center Record Label */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 border border-white/20 flex flex-col items-center justify-center text-center p-1 shadow-md z-10">
              <span className="text-[7px] text-white/90 font-black tracking-tight leading-none">ITNA</span>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 mt-1 border border-zinc-700" />
            </div>
          </div>

          {/* Stylus Tone Arm */}
          <div className="absolute top-2 right-2 w-2 h-24 origin-top bg-zinc-400 rounded-full shadow-lg transform rotate-[-25deg] pointer-events-none">
            <div className="w-4 h-6 bg-zinc-700 rounded-sm absolute -bottom-1 -left-1" />
          </div>
        </div>

        <div className="text-center pt-2 border-t border-white/10">
          <span className="text-white font-bold text-xs truncate block">{trackTitle}</span>
          <span className="text-zinc-400 text-[11px] truncate block mt-0.5">{artistName}</span>
        </div>
      </div>
    </div>
  );
};
