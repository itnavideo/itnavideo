import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MacroNutrientBarProps {
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  totalCalories?: number;
  className?: string;
}

export const MacroNutrientBar: React.FC<MacroNutrientBarProps> = ({
  proteinG = 180,
  carbsG = 220,
  fatG = 65,
  totalCalories = 2185,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const totalGrams = proteinG + carbsG + fatG;

  const pPct = (proteinG / totalGrams) * 100;
  const cPct = (carbsG / totalGrams) * 100;
  const fPct = (fatG / totalGrams) * 100;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(14, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            DAILY MACRONUTRIENT SPLIT
          </span>
          <span className="text-amber-400 font-bold">{totalCalories} KCAL</span>
        </div>

        {/* Segmented Macro Bar */}
        <div className="w-full h-3 rounded-full bg-zinc-900 border border-white/10 overflow-hidden flex my-3">
          <div className="h-full bg-rose-500" style={{ width: `${pPct}%` }} />
          <div className="h-full bg-sky-500" style={{ width: `${cPct}%` }} />
          <div className="h-full bg-amber-500" style={{ width: `${fPct}%` }} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-rose-400 font-bold text-[10px]">PROTEIN</span>
            <span className="text-white font-black">{proteinG}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sky-400 font-bold text-[10px]">CARBS</span>
            <span className="text-white font-black">{carbsG}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-amber-400 font-bold text-[10px]">FATS</span>
            <span className="text-white font-black">{fatG}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
