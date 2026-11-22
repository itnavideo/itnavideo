import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RNAVisualizationProps {
  strandType?: string;
  codonSequence?: string[];
  ribosomeActive?: boolean;
  className?: string;
}

export const RNAVisualization: React.FC<RNAVisualizationProps> = ({
  strandType = 'MESSENGER RNA (mRNA) TRANSCRIPT',
  codonSequence = ['AUG', 'UUC', 'GAC', 'CAA', 'UAA'],
  ribosomeActive = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const wave = Math.sin(frame * 0.1) * 6;

  // Single strand bases: Uracil (Amber), Adenine (Cyan), Guanine (Emerald), Cytosine (Pink)
  const bases = [
    { base: 'A', color: '#06b6d4' },
    { base: 'U', color: '#f59e0b' },
    { base: 'G', color: '#10b981' },
    { base: 'C', color: '#ec4899' },
    { base: 'U', color: '#f59e0b' },
    { base: 'U', color: '#f59e0b' },
    { base: 'C', color: '#ec4899' },
    { base: 'G', color: '#10b981' },
    { base: 'A', color: '#06b6d4' },
    { base: 'C', color: '#ec4899' },
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
        className="w-full max-w-sm rounded-3xl p-5 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 16, 22, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(6, 182, 212, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
            {strandType}
          </span>
          <span className="text-zinc-500 text-[10px]">SINGLE STRAND</span>
        </div>

        {/* RNA Ribbon Single-Strand Diagram */}
        <div className="h-32 my-3 relative flex items-center justify-between px-2 overflow-hidden rounded-2xl bg-zinc-950 border border-white/5">
          {/* Sugar-Phosphate Backbone Ribbon */}
          <div
            className="absolute inset-x-2 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 rounded-full"
            style={{ transform: `translateY(${wave}px)` }}
          />

          {/* Ribosome Molecular Unit Hovering */}
          {ribosomeActive && (
            <div className="absolute top-2 left-1/3 w-16 h-8 rounded-full bg-indigo-600/50 border border-indigo-400/60 backdrop-blur text-[8px] font-bold text-white flex items-center justify-center shadow-lg">
              Ribosome
            </div>
          )}

          {/* Nitrogenous Bases Hanging Down (Uracil replaces Thymine) */}
          <div className="flex justify-between w-full z-10 px-2 mt-4">
            {bases.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-5 h-7 rounded flex items-center justify-center text-[10px] font-black text-black shadow-md"
                  style={{ backgroundColor: b.color }}
                >
                  {b.base}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Codon Sequence Display */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-amber-400 font-bold">Uracil (U) Hybrid</span>
          <div className="flex gap-1.5 text-[10px] text-zinc-300">
            {codonSequence.slice(0, 3).map((c, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-bold">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
