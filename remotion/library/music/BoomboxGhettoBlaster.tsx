import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BoomboxGhettoBlasterProps {
  bassVolume?: number;
  radioFrequency?: string;
  className?: string;
}

export const BoomboxGhettoBlaster: React.FC<BoomboxGhettoBlasterProps> = ({
  bassVolume = 85,
  radioFrequency = 'FM 104.5 MHz',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Speaker cone pumping
  const bassPump = 1 + Math.sin(frame * 0.25) * 0.12;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-88 max-w-sm rounded-3xl p-5 border-2 border-zinc-700 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95), rgba(8, 8, 10, 0.98))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(239, 68, 68, 0.2)',
        }}
      >
        {/* Top Handle & Radio Dial */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-500 font-black text-[10px] tracking-widest uppercase">
            STEREO BASS BLASTER
          </span>
          <span className="text-zinc-400 text-[10px]">{radioFrequency}</span>
        </div>

        {/* Dual Subwoofer Speakers & Center Cassette Deck */}
        <div className="flex items-center justify-between gap-3 my-4">
          {/* Left Subwoofer Cone */}
          <div
            className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-2xl"
            style={{ transform: `scale(${bassPump})` }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 rounded-full bg-zinc-950" />
            </div>
          </div>

          {/* Center Cassette Well & LED Meter */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-12 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
              CASSETTE DECK
            </div>
            {/* LED Volume Indicator (5 bars) */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-3 rounded-sm bg-emerald-400" />
              <span className="w-2 h-3 rounded-sm bg-emerald-400" />
              <span className="w-2 h-3 rounded-sm bg-amber-400" />
              <span className="w-2 h-3 rounded-sm bg-rose-500" />
            </div>
          </div>

          {/* Right Subwoofer Cone */}
          <div
            className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-2xl"
            style={{ transform: `scale(${bassPump})` }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 rounded-full bg-zinc-950" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/10">
          <span>Bass Boost: {bassVolume}%</span>
          <span className="text-rose-400 font-bold">● SUBWOOFER ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
