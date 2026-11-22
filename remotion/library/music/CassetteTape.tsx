import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CassetteTapeProps {
  tapeLabel?: string;
  side?: 'A' | 'B';
  duration?: string;
  className?: string;
}

export const CassetteTape: React.FC<CassetteTapeProps> = ({
  tapeLabel = 'RETRO MIXTAPE VOL. 1',
  side = 'A',
  duration = 'C-60 HIGH BIAS',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const spoolRot = (frame * 3) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-80 h-48 rounded-2xl p-4 border-2 border-zinc-700 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 24, 20, 0.95), rgba(15, 12, 10, 0.98))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 30px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Top Tape Label Bar */}
        <div className="bg-amber-100 rounded-lg p-2 text-zinc-900 shadow-md flex items-center justify-between border border-amber-300">
          <span className="font-extrabold text-xs tracking-tight">{tapeLabel}</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-white font-black text-[9px]">
            SIDE {side}
          </span>
        </div>

        {/* Center Tape Window & Dual Rotating Spools */}
        <div className="h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-around px-8 relative overflow-hidden">
          {/* Left Spool */}
          <div
            className="w-12 h-12 rounded-full border-2 border-white/20 bg-zinc-950 flex items-center justify-center shadow-inner"
            style={{ transform: `rotate(${spoolRot}deg)` }}
          >
            <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Magnetic Ribbon Bridge */}
          <div className="flex-1 h-3 bg-amber-900/60 mx-4 border-t border-b border-amber-600/30 rounded" />

          {/* Right Spool */}
          <div
            className="w-12 h-12 rounded-full border-2 border-white/20 bg-zinc-950 flex items-center justify-center shadow-inner"
            style={{ transform: `rotate(${spoolRot}deg)` }}
          >
            <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>

        {/* Bottom Audio Spec */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>{duration}</span>
          <span>DOLBY B-NR SYSTEM</span>
        </div>
      </div>
    </div>
  );
};
