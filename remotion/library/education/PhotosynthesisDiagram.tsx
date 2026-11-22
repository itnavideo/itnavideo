import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PhotosynthesisDiagramProps {
  className?: string;
}

export const PhotosynthesisDiagram: React.FC<PhotosynthesisDiagramProps> = ({
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
        className="w-full max-w-sm rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 20, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            PHOTOSYNTHESIS BIOENERGETICS
          </span>
          <span className="text-zinc-500 text-[10px]">CHLOROPLAST THYLAKOID</span>
        </div>

        {/* Reaction Flow */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col">
            <span className="text-amber-400 font-bold text-[10px]">INPUT REACTANTS</span>
            <span className="text-white mt-1">☀️ Sunlight Energy</span>
            <span className="text-white mt-0.5">💧 6H₂O (Water)</span>
            <span className="text-white mt-0.5">💨 6CO₂ (Carbon Dioxide)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col">
            <span className="text-emerald-400 font-bold text-[10px]">OUTPUT PRODUCTS</span>
            <span className="text-white font-bold mt-1">🌿 C₆H₁₂O₆ (Glucose)</span>
            <span className="text-cyan-300 font-bold mt-0.5">💨 6O₂ (Oxygen)</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 text-center pt-2 border-t border-white/10">
          Light-Dependent Reactions & Calvin-Benson Cycle
        </div>
      </div>
    </div>
  );
};
