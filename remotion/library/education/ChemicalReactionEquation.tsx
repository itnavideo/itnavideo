import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChemicalReactionEquationProps {
  reactants?: string;
  products?: string;
  reactionType?: string;
  energyChange?: string;
  className?: string;
}

export const ChemicalReactionEquation: React.FC<ChemicalReactionEquationProps> = ({
  reactants = '2H₂ + O₂',
  products = '2H₂O',
  reactionType = 'COMBUSTION / SYNTHESIS',
  energyChange = 'ΔH = -483.6 kJ/mol (EXOTHERMIC)',
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
          background: 'rgba(10, 18, 14, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            BALANCED CHEMICAL EQUATION
          </span>
          <span className="text-zinc-500 text-[10px]">{reactionType}</span>
        </div>

        {/* Equation Formula Display */}
        <div className="flex items-center justify-center gap-3 my-4 py-2 px-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-xl font-black text-white">{reactants}</span>
          <span className="text-emerald-400 font-black text-2xl">→</span>
          <span className="text-xl font-black text-cyan-300">{products}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span className="text-amber-400 font-semibold">{energyChange}</span>
        </div>
      </div>
    </div>
  );
};
