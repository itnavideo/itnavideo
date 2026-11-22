import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BasePair {
  label: string;
  colorA: string;
  colorB: string;
}

export interface DNAHelixProps {
  pairsCount?: number;
  rotationSpeed?: number;
  strandTitle?: string;
  className?: string;
}

export const DNAHelix: React.FC<DNAHelixProps> = ({
  pairsCount = 14,
  rotationSpeed = 0.08,
  strandTitle = 'DOUBLE HELIX // DEOXYRIBONUCLEIC ACID',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Base pair types
  const baseColors = [
    { name: 'A-T', colorA: '#38bdf8', colorB: '#f43f5e' },
    { name: 'G-C', colorA: '#10b981', colorB: '#facc15' },
  ];

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 14, 22, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6, 182, 212, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
            {strandTitle}
          </span>
          <span className="text-zinc-500 text-[10px]">3.4 nm PITCH</span>
        </div>

        {/* 3D-Look Rotating DNA Strand */}
        <div className="relative h-48 w-full flex flex-col justify-between items-center py-2 my-2">
          {Array.from({ length: pairsCount }).map((_, i) => {
            const phase = frame * rotationSpeed + (i * 0.45);
            const xA = Math.sin(phase) * 60;
            const xB = -xA;
            const z = Math.cos(phase);
            const scaleA = 0.8 + (z + 1) * 0.2;
            const scaleB = 0.8 + (-z + 1) * 0.2;
            const pairType = baseColors[i % 2];

            return (
              <div key={i} className="relative w-40 h-2 flex items-center justify-center">
                {/* Horizontal Hydrogen Bond Bridge */}
                <div
                  className="absolute h-0.5 bg-gradient-to-r from-cyan-400 via-white/40 to-pink-500 rounded-full opacity-60"
                  style={{
                    width: `${Math.abs(xA - xB)}px`,
                    transform: `translateX(${(xA + xB) / 2}px)`,
                  }}
                />

                {/* Left Nucleotide Ball */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full shadow-md z-10"
                  style={{
                    transform: `translateX(${xA}px) scale(${scaleA})`,
                    backgroundColor: pairType.colorA,
                    boxShadow: `0 0 8px ${pairType.colorA}`,
                  }}
                />

                {/* Right Nucleotide Ball */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full shadow-md z-10"
                  style={{
                    transform: `translateX(${xB}px) scale(${scaleB})`,
                    backgroundColor: pairType.colorB,
                    boxShadow: `0 0 8px ${pairType.colorB}`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Base Pair Legend */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Adenine - Thymine
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Guanine - Cytosine
          </span>
        </div>
      </div>
    </div>
  );
};
