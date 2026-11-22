import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GuitarChordsCardProps {
  chordName?: string;
  tuning?: string;
  className?: string;
}

export const GuitarChordsCard: React.FC<GuitarChordsCardProps> = ({
  chordName = 'Cmaj7 (C Major 7th)',
  tuning = 'STANDARD E-A-D-G-B-E',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-56 rounded-3xl p-4 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center overflow-hidden"
        style={{
          background: 'rgba(20, 16, 12, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.15)',
        }}
      >
        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
          FRETBOARD CHORD
        </span>
        <h4 className="text-white font-black text-sm tracking-tight my-1">{chordName}</h4>

        {/* 6 String Guitar Fretboard Grid */}
        <div className="w-36 h-36 border-2 border-zinc-600 rounded my-2 relative grid grid-cols-5 grid-rows-4 bg-zinc-900/60">
          {/* Finger Dots */}
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] absolute top-8 left-6" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] absolute top-16 left-14" />
        </div>

        <span className="text-[9px] text-zinc-500">{tuning}</span>
      </div>
    </div>
  );
};
