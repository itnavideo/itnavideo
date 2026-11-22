import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaveSpectrogramProps {
  frequencyHz?: number;
  wavelengthM?: number;
  amplitude?: number;
  className?: string;
}

export const WaveSpectrogram: React.FC<WaveSpectrogramProps> = ({
  frequencyHz = 440,
  wavelengthM = 0.78,
  amplitude = 1.0,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Generate sine wave path
  const points = Array.from({ length: 50 }, (_, i) => {
    const x = (i / 50) * 200;
    const y = 30 + Math.sin(i * 0.4 + frame * 0.15) * 22;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 12, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(99, 102, 241, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
            HARMONIC WAVE OSCILLATION
          </span>
          <span className="text-zinc-500 text-[10px]">f = {frequencyHz} Hz</span>
        </div>

        {/* Oscilloscope Grid */}
        <div className="h-28 my-3 rounded-xl bg-zinc-950 border border-white/10 p-2 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />

          <svg className="w-full h-full relative z-10" viewBox="0 0 200 60">
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              points={points}
              style={{ filter: 'drop-shadow(0 0 6px #818cf8)' }}
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>λ = {wavelengthM}m</span>
          <span className="text-indigo-300">v = f × λ = 343 m/s</span>
        </div>
      </div>
    </div>
  );
};
