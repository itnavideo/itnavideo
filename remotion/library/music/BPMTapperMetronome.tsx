import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BPMTapperMetronomeProps {
  tempoBpm?: number;
  timeSignature?: string;
  className?: string;
}

export const BPMTapperMetronome: React.FC<BPMTapperMetronomeProps> = ({
  tempoBpm = 128,
  timeSignature = '4/4 TIME',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Metronome arm pendulum oscillation
  const pendulumAngle = Math.sin(frame * (tempoBpm / 60) * Math.PI) * 28;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-64 rounded-3xl p-5 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center overflow-hidden"
        style={{
          background: 'rgba(20, 16, 12, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.2)',
        }}
      >
        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
          ANALOG METRONOME
        </span>

        {/* Metronome Body & Arm */}
        <div className="relative w-36 h-40 flex flex-col items-center justify-end my-2">
          {/* Triangular Case */}
          <div className="absolute inset-0 border-b-4 border-amber-600/40 opacity-40" />

          {/* Swinging Arm */}
          <div
            className="w-1.5 h-32 bg-gradient-to-t from-zinc-400 to-amber-300 origin-bottom rounded-full shadow-lg relative flex items-center justify-center"
            style={{ transform: `rotate(${pendulumAngle}deg)` }}
          >
            {/* Sliding Weight Bead */}
            <div className="w-5 h-4 bg-amber-500 rounded border border-white/40 absolute top-8 shadow" />
          </div>
        </div>

        {/* BPM Readout */}
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-black text-white">{tempoBpm}</span>
          <span className="text-zinc-500 text-xs font-bold">BPM</span>
        </div>
        <span className="text-[10px] text-zinc-400">{timeSignature}</span>
      </div>
    </div>
  );
};
